import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createRequestSetEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('🎯 PEDIR SET - Máfia do Vinhedo')
    .setDescription('**Bem-vindo à Máfia do Vinhedo!** 🍇\n\nSomos uma organização dedicada à excelência no cultivo e comercialização de uvas premium. Nossa família trabalha com paixão e dedicação para oferecer os melhores produtos do mercado.')
    .addFields(
      { name: '🍇 Nossa Missão', value: 'Cultivar uvas de qualidade superior e estabelecer relações duradouras com nossos parceiros.', inline: false },
      { name: '💼 Oportunidades', value: 'Clique no botão abaixo para solicitar entrada em nosso time e fazer parte desta família.', inline: false },
      { name: '📞 Contato', value: 'Após solicitar, um administrador entrará em contato para mais informações.', inline: false }
    )
    .setColor(0xF59E0B) // Amber color for welcome/set requests
    .setImage('https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=M%C3%A1fia+do+Vinhedo')
    .setFooter({ text: 'Máfia do Vinhedo • Cultivando Excelência' })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('request_set')
        .setLabel('🎯 Solicitar Entrada')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🤝')
    );

  return { embed, row };
}
