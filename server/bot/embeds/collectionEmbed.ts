import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createCollectionEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('🍇 REGISTRAR COLETA - Máfia do Vinhedo')
    .setDescription('Clique no botão abaixo para registrar uma nova coleta de uvas.')
    .addFields(
      { name: '📋 Informações Necessárias', value: '• Nome do coletor\n• ID do coletor\n• Quantidade de caixas', inline: false },
      { name: '🏆 Benefícios', value: '• Contabilizado no ranking\n• Notificação para administradores\n• Histórico de coletas', inline: false }
    )
    .setColor(0x8B5CF6) // Purple color for collections
    .setFooter({ text: 'Máfia do Vinhedo • Sistema de Gestão' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('register_collection')
        .setLabel('📝 Registrar Coleta')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🍇')
    );

  return { embed, row };
}
