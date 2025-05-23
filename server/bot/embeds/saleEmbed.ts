import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createSaleEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('💰 REGISTRAR VENDA - Máfia do Vinhedo')
    .setDescription('Clique no botão abaixo para registrar uma nova venda.')
    .addFields(
      { name: '📋 Informações Necessárias', value: '• Nome do vendedor\n• ID do vendedor\n• Descrição do produto\n• Status da venda\n• Valor total', inline: false },
      { name: '📊 Status Disponíveis', value: '• **Entregue** - Venda concluída\n• **Pendente** - Aguardando entrega\n• **Produção** - Em processo', inline: false },
      { name: '🏆 Benefícios', value: '• Contabilizado no ranking\n• Notificação para administradores\n• Controle de vendas', inline: false }
    )
    .setColor(0x10B981) // Green color for sales
    .setFooter({ text: 'Máfia do Vinhedo • Sistema de Gestão' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('register_sale')
        .setLabel('💰 Registrar Venda')
        .setStyle(ButtonStyle.Success)
        .setEmoji('💰')
    );

  return { embed, row };
}
