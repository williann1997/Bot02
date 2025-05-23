import { 
  ButtonInteraction, 
  EmbedBuilder,
  TextChannel
} from 'discord.js';
import { storage } from '../../storage';

const ADMIN_NOTIFICATION_CHANNEL = '1374559903414227155';

export async function handleSetRequest(interaction: ButtonInteraction) {
  try {
    // Save set request to database
    const setRequest = await storage.createSetRequest({
      userId: interaction.user.id,
      username: interaction.user.username,
    });

    // Success response
    const successEmbed = new EmbedBuilder()
      .setTitle('🎯 Solicitação de Entrada Enviada!')
      .setDescription('Sua solicitação foi enviada com sucesso para os administradores da Máfia do Vinhedo.')
      .addFields(
        { name: '👤 Solicitante', value: interaction.user.username, inline: true },
        { name: '🆔 ID Discord', value: interaction.user.id, inline: true },
        { name: '📅 Data da Solicitação', value: new Date().toLocaleString('pt-BR'), inline: false },
        { name: '⏳ Próximos Passos', value: 'Um administrador entrará em contato em breve para fornecer mais informações sobre como ingressar em nossa organização.', inline: false }
      )
      .setColor(0xF59E0B)
      .setFooter({ text: 'Máfia do Vinhedo • Bem-vindo à Família' })
      .setTimestamp();

    await interaction.reply({
      embeds: [successEmbed],
      ephemeral: true,
    });

    // Send notification to admins
    await sendAdminNotification(interaction, setRequest);

  } catch (error) {
    console.error('Erro ao processar solicitação de set:', error);
    await interaction.reply({
      content: '❌ Ocorreu um erro ao processar sua solicitação. Tente novamente.',
      ephemeral: true,
    });
  }
}

async function sendAdminNotification(
  interaction: ButtonInteraction,
  setRequest: any
) {
  try {
    const adminChannel = await interaction.client.channels.fetch(ADMIN_NOTIFICATION_CHANNEL) as TextChannel;
    
    if (adminChannel) {
      const notificationEmbed = new EmbedBuilder()
        .setTitle('🎯 Nova Solicitação de Entrada')
        .setDescription('Um usuário solicitou entrada na Máfia do Vinhedo.')
        .addFields(
          { name: '👤 Usuário', value: `${interaction.user.username} (${interaction.user.tag})`, inline: true },
          { name: '🆔 ID Discord', value: interaction.user.id, inline: true },
          { name: '📅 Data', value: new Date().toLocaleString('pt-BR'), inline: false },
          { name: '📊 Informações da Conta', value: `Criada em: <t:${Math.floor(interaction.user.createdTimestamp / 1000)}:F>`, inline: false }
        )
        .setColor(0xF59E0B)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: 'Sistema de Solicitações' })
        .setTimestamp();

      await adminChannel.send({
        content: '@here Nova solicitação de entrada!',
        embeds: [notificationEmbed],
      });
    }
  } catch (error) {
    console.error('Erro ao enviar notificação para admins:', error);
  }
}
