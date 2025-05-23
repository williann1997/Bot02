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
import { isAdmin } from '../utils/permissions';

const ADMIN_NOTIFICATION_CHANNEL = '1374559903414227155';
const RANKING_CHANNEL = '1374656368979480617';

export async function handleCollectionSubmit(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  data?: { name: string; id: string; quantity: string }
) {
  if (interaction.isButton()) {
    // Show modal for collection registration
    const modal = new ModalBuilder()
      .setCustomId('collection_modal')
      .setTitle('Registrar Coleta - Máfia do Vinhedo');

    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel('Nome do Coletor')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100)
      .setPlaceholder('Digite seu nome completo');

    const idInput = new TextInputBuilder()
      .setCustomId('id')
      .setLabel('ID do Coletor')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(50)
      .setPlaceholder('Digite seu ID único');

    const quantityInput = new TextInputBuilder()
      .setCustomId('quantity')
      .setLabel('Quantidade de Caixas')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(10)
      .setPlaceholder('Ex: 25');

    const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
    const thirdRow = new ActionRowBuilder<TextInputBuilder>().addComponents(quantityInput);

    modal.addComponents(firstRow, secondRow, thirdRow);

    await interaction.showModal(modal);
    return;
  }

  if (interaction.isModalSubmit() && data) {
    // Process the collection submission
    const { name, id, quantity } = data;

    // Validate quantity
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      await interaction.reply({
        content: '❌ A quantidade deve ser um número válido maior que zero.',
        ephemeral: true,
      });
      return;
    }

    try {
      // Save collection to database
      const collection = await storage.createCollection({
        name,
        userId: id,
        quantity: quantityNum,
      });

      // Success response
      const successEmbed = new EmbedBuilder()
        .setTitle('✅ Coleta Registrada com Sucesso!')
        .setDescription('Sua coleta foi registrada e contabilizada no sistema.')
        .addFields(
          { name: '👤 Coletor', value: name, inline: true },
          { name: '🆔 ID', value: id, inline: true },
          { name: '📦 Quantidade', value: `${quantityNum} caixas`, inline: true }
        )
        .setColor(0x10B981)
        .setTimestamp();

      await interaction.reply({
        embeds: [successEmbed],
        ephemeral: true,
      });

      // Send notification to admins
      await sendAdminNotification(interaction, collection);

      // Update ranking display
      await updateRankingDisplay(interaction.client, RANKING_CHANNEL);

    } catch (error) {
      console.error('Erro ao registrar coleta:', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao registrar a coleta. Tente novamente.',
        ephemeral: true,
      });
    }
  }
}

async function sendAdminNotification(
  interaction: ModalSubmitInteraction,
  collection: any
) {
  try {
    const adminChannel = await interaction.client.channels.fetch(ADMIN_NOTIFICATION_CHANNEL) as TextChannel;
    
    if (adminChannel) {
      const notificationEmbed = new EmbedBuilder()
        .setTitle('🍇 Nova Coleta Registrada')
        .setDescription('Uma nova coleta foi registrada no sistema.')
        .addFields(
          { name: '👤 Coletor', value: collection.name, inline: true },
          { name: '🆔 ID', value: collection.userId, inline: true },
          { name: '📦 Quantidade', value: `${collection.quantity} caixas`, inline: true },
          { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: false }
        )
        .setColor(0x8B5CF6)
        .setFooter({ text: `Registrado por ${interaction.user.tag}` })
        .setTimestamp();

      await adminChannel.send({
        content: '@here Nova coleta registrada!',
        embeds: [notificationEmbed],
      });
    }
  } catch (error) {
    console.error('Erro ao enviar notificação para admins:', error);
  }
}
