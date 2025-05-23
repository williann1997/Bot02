import { 
  ButtonInteraction, 
  EmbedBuilder,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
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

export async function handleMemberDecision(interaction: ButtonInteraction) {
  try {
    const customId = interaction.customId;
    const [action, , userId] = customId.split('_'); // accept_member_123 or reject_member_123
    
    if (action === 'accept') {
      // Update embed to show accepted
      const acceptedEmbed = new EmbedBuilder()
        .setTitle('✅ Membro Aceito!')
        .setDescription(`O usuário <@${userId}> foi aceito na Máfia do Vinhedo!`)
        .addFields(
          { name: '👤 Administrador', value: interaction.user.username, inline: true },
          { name: '📅 Data da Decisão', value: new Date().toLocaleString('pt-BR'), inline: true },
          { name: '🎯 Status', value: '**APROVADO** - Novo membro da família!', inline: false }
        )
        .setColor(0x10B981) // Green
        .setTimestamp();

      await interaction.update({
        embeds: [acceptedEmbed],
        components: [] // Remove buttons
      });

      // Send DM to accepted user
      try {
        const user = await interaction.client.users.fetch(userId);
        const dmEmbed = new EmbedBuilder()
          .setTitle('🎉 Bem-vindo à Máfia do Vinhedo!')
          .setDescription('Parabéns! Sua solicitação foi **APROVADA**!')
          .addFields(
            { name: '🔫 Acesso Liberado', value: 'Você agora tem acesso às melhores munições e territórios exclusivos!', inline: false },
            { name: '💰 Próximos Passos', value: 'Entre em contato com a liderança para receber suas primeiras missões e orientações.', inline: false }
          )
          .setColor(0x10B981)
          .setFooter({ text: 'Máfia do Vinhedo • Família' })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
      } catch (dmError) {
        console.log('Não foi possível enviar DM para o usuário aceito');
      }

    } else if (action === 'reject') {
      // Update embed to show rejected
      const rejectedEmbed = new EmbedBuilder()
        .setTitle('❌ Solicitação Rejeitada')
        .setDescription(`A solicitação do usuário <@${userId}> foi rejeitada.`)
        .addFields(
          { name: '👤 Administrador', value: interaction.user.username, inline: true },
          { name: '📅 Data da Decisão', value: new Date().toLocaleString('pt-BR'), inline: true },
          { name: '🎯 Status', value: '**REJEITADO** - Não atende aos critérios', inline: false }
        )
        .setColor(0xEF4444) // Red
        .setTimestamp();

      await interaction.update({
        embeds: [rejectedEmbed],
        components: [] // Remove buttons
      });

      // Send DM to rejected user
      try {
        const user = await interaction.client.users.fetch(userId);
        const dmEmbed = new EmbedBuilder()
          .setTitle('❌ Solicitação Não Aprovada')
          .setDescription('Infelizmente, sua solicitação para entrar na Máfia do Vinhedo não foi aprovada no momento.')
          .addFields(
            { name: '🔄 Tente Novamente', value: 'Você pode tentar novamente no futuro após ganhar mais experiência no servidor.', inline: false },
            { name: '💼 Dicas', value: 'Continue participando das atividades do servidor e demonstre seu comprometimento.', inline: false }
          )
          .setColor(0xEF4444)
          .setFooter({ text: 'Máfia do Vinhedo' })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
      } catch (dmError) {
        console.log('Não foi possível enviar DM para o usuário rejeitado');
      }
    }

  } catch (error) {
    console.error('Erro ao processar decisão sobre membro:', error);
    await interaction.reply({
      content: '❌ Ocorreu um erro ao processar a decisão.',
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

      const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`accept_member_${interaction.user.id}`)
            .setLabel('✅ Aceitar')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`reject_member_${interaction.user.id}`)
            .setLabel('❌ Rejeitar')
            .setStyle(ButtonStyle.Danger)
        );

      await adminChannel.send({
        content: '@here Nova solicitação de entrada!',
        embeds: [notificationEmbed],
        components: [actionRow]
      });
    }
  } catch (error) {
    console.error('Erro ao enviar notificação para admins:', error);
  }
}
