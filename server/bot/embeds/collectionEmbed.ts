import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createCollectionEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('📦 REGISTRAR COLETA - Máfia do Vinhedo')
    .setDescription('Registre suas caixas de munições coletadas. Clique no botão abaixo para informar sua contribuição.')
    .addFields(
      { name: '📋 Informações Necessárias', value: '• Nome do coletor\n• ID do membro\n• Quantidade de caixas', inline: false },
      { name: '🏆 Benefícios', value: '• Contabilizado no ranking\n• Comissão garantida\n• Status na organização', inline: false }
    )
    .setColor(0x8B5CF6) // Purple color for collections
    .setFooter({ text: 'Máfia do Vinhedo • Negócio Exclusivo de Munições' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('register_collection')
        .setLabel('📦 Registrar Coleta')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📦')
    );

  return { embed, row };
}
