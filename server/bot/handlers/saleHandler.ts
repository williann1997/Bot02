import { 
  ButtonInteraction, 
  ModalSubmitInteraction, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ActionRowBuilder,
  EmbedBuilder,
  TextChannel
} from 'discord.js';
import { storage } from '../../storage';
import { updateRankingDisplay } from '../utils/ranking';

const ADMIN_NOTIFICATION_CHANNEL = '1374613709770723440';
const RANKING_CHANNEL = '1374656368979480617';

export async function handleSaleSubmit(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  data?: { name: string; id: string; description: string; status: string; totalValue: string }
) {
  if (interaction.isButton()) {
    // Show modal for sale registration
    const modal = new ModalBuilder()
      .setCustomId('sale_modal')
      .setTitle('Registrar Venda - Máfia do Vinhedo');

    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Nome do Vendedor')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100)
      .setPlaceholder('Digite seu nome completo');

    const idInput = new TextInputBuilder()
      .setCustomId('id')
      .setLabel('ID do Vendedor')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(50)
      .setPlaceholder('Digite seu ID único');

    const descriptionInput = new TextInputBuilder()
      .setCustomId('description')
      .setLabel('Descrição do Produto/Serviço')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500)
      .setPlaceholder('Descreva o que foi vendido...');

    const statusInput = new TextInputBuilder()
      .setCustomId('status')
      .setLabel('Status da Venda')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(20)
      .setPlaceholder('entregue, pendente ou produção');

    const totalValueInput = new TextInputBuilder()
      .setCustomId('total_value')
      .setLabel('Valor Total (R$)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(20)
      .setPlaceholder('Ex: 150.50');

    const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
    const thirdRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);
    const fourthRow = new ActionRowBuilder<TextInputBuilder>().addComponents(statusInput);
    const fifthRow = new ActionRowBuilder<TextInputBuilder>().addComponents(totalValueInput);

    modal.addComponents(firstRow, secondRow, thirdRow, fourthRow, fifthRow);

    await interaction.showModal(modal);
    return;
  }

  if (interaction.isModalSubmit() && data) {
    // Process the sale submission
    const { name, id, description, status, totalValue } = data;

    // Validate status
    const validStatuses = ['entregue', 'pendente', 'produção'];
    if (!validStatuses.includes(status.toLowerCase())) {
      await interaction.reply({
        content: '❌ Status inválido. Use: entregue, pendente ou produção.',
        ephemeral: true,
      });
      return;
    }

    // Validate and parse total value
    const valueMatch = totalValue.replace(',', '.').match(/^\d+\.?\d*$/);
    if (!valueMatch) {
      await interaction.reply({
        content: '❌ Valor inválido. Use formato: 150.50 ou 150',
        ephemeral: true,
      });
      return;
    }

    const totalValueCents = Math.round(parseFloat(totalValue.replace(',', '.')) * 100);

    try {
      // Save sale to database
      const sale = await storage.createSale({
        name,
        userId: id,
        description,
        status: status.toLowerCase() as 'entregue' | 'pendente' | 'produção',
        totalValue: totalValueCents,
      });

      // Success response
      const successEmbed = new EmbedBuilder()
        .setTitle('✅ Venda Registrada com Sucesso!')
        .setDescription('Sua venda foi registrada e contabilizada no sistema.')
        .addFields(
          { name: '👤 Vendedor', value: name, inline: true },
          { name: '🆔 ID', value: id, inline: true },
          { name: '📊 Status', value: status.toLowerCase(), inline: true },
          { name: '💰 Valor', value: `R$ ${(totalValueCents / 100).toFixed(2)}`, inline: true },
          { name: '📝 Descrição', value: description.length > 100 ? description.substring(0, 100) + '...' : description, inline: false }
        )
        .setColor(0x10B981)
        .setTimestamp();

      await interaction.reply({
        embeds: [successEmbed],
        ephemeral: true,
      });

      // Send notification to admins
      await sendAdminNotification(interaction, sale);

      // Update ranking display
      await updateRankingDisplay(interaction.client, RANKING_CHANNEL);

    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao registrar a venda. Tente novamente.',
        ephemeral: true,
      });
    }
  }
}

async function sendAdminNotification(
  interaction: ModalSubmitInteraction,
  sale: any
) {
  try {
    const adminChannel = await interaction.client.channels.fetch(ADMIN_NOTIFICATION_CHANNEL) as TextChannel;
    
    if (adminChannel) {
      const statusEmoji = {
        'entregue': '✅',
        'pendente': '⏳',
        'produção': '🔧'
      };

      const notificationEmbed = new EmbedBuilder()
        .setTitle('💰 Nova Venda Registrada')
        .setDescription('Uma nova venda foi registrada no sistema.')
        .addFields(
          { name: '👤 Vendedor', value: sale.name, inline: true },
          { name: '🆔 ID', value: sale.userId, inline: true },
          { name: '📊 Status', value: `${statusEmoji[sale.status as keyof typeof statusEmoji]} ${sale.status}`, inline: true },
          { name: '💰 Valor', value: `R$ ${(sale.totalValue / 100).toFixed(2)}`, inline: true },
          { name: '📝 Descrição', value: sale.description.length > 200 ? sale.description.substring(0, 200) + '...' : sale.description, inline: false },
          { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: false }
        )
        .setColor(0x10B981)
        .setFooter({ text: `Registrado por ${interaction.user.tag}` })
        .setTimestamp();

      await adminChannel.send({
        content: '@here Nova venda registrada!',
        embeds: [notificationEmbed],
      });
    }
  } catch (error) {
    console.error('Erro ao enviar notificação para admins:', error);
  }
}
