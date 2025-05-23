import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createSaleEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('🔫 REGISTRAR VENDA - Máfia do Vinhedo')
    .setDescription('Registre vendas de munições. Nosso negócio é exclusivamente munições!')
    .addFields(
      { name: '📋 Informações Necessárias', value: '• Nome do vendedor\n• ID do vendedor\n• Tipo/quantidade de munições\n• Status da venda\n• Valor total', inline: false },
      { name: '📊 Status Disponíveis', value: '• **Entregue** - Venda concluída\n• **Pendente** - Aguardando entrega\n• **Produção** - Em processo', inline: false },
      { name: '🏆 Benefícios', value: '• Contabilizado no ranking\n• Comissões automáticas\n• Histórico completo', inline: false }
    )
    .setColor(0x10B981) // Green color for sales
    .setFooter({ text: 'Máfia do Vinhedo • Negócio Exclusivo de Munições' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('register_sale')
        .setLabel('🔫 Registrar Venda')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔫')
    );

  return { embed, row };
}
