import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createRequestSetEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('🎯 PEDIR SET - Máfia do Vinhedo')
    .setDescription('**Bem-vindo à Máfia do Vinhedo!** 🍇\n\nSomos a organização mais respeitada do servidor! Especializados na venda de munições premium e controle territorial. Nossa família domina o mercado de armamentos com qualidade e confiabilidade.')
    .addFields(
      { name: '🔫 Nosso Negócio', value: 'Vendemos as melhores munições do servidor com preços justos e entrega garantida. Qualidade premium para operações de alto nível.', inline: false },
      { name: '🏆 Benefícios do Set', value: '• Acesso às melhores munições\n• Proteção da família\n• Territórios exclusivos\n• Participação nos lucros', inline: false },
      { name: '💼 Como Entrar', value: 'Clique no botão abaixo para solicitar entrada em nossa organização. Analisaremos seu perfil e experiência.', inline: false },
      { name: '📞 Processo', value: 'Após sua solicitação, um administrador avaliará sua candidatura e entrará em contato com mais informações.', inline: false }
    )
    .setColor(0xF59E0B) // Amber color for welcome/set requests
    .setImage('https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=M%C3%A1fia+do+Vinhedo')
    .setFooter({ text: 'Máfia do Vinhedo • Dominando o Mercado' })
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
