import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { storage } from '../../storage';

export async function updateRankingDisplay(client: Client, channelId: string) {
  try {
    const channel = await client.channels.fetch(channelId) as TextChannel;
    if (!channel) return;

    const rankings = await storage.getRankings();

    // Create ranking embed
    const rankingEmbed = new EmbedBuilder()
      .setTitle('🏆 RANKING - Máfia do Vinhedo')
      .setDescription('Classificação dos membros baseada em coletas e vendas')
      .setColor(0xFFD700) // Gold color
      .setTimestamp()
      .setFooter({ text: 'Atualizado automaticamente • Máfia do Vinhedo' });

    if (rankings.length === 0) {
      rankingEmbed.addFields({
        name: '📊 Nenhum dado disponível',
        value: 'Ainda não há registros de coletas ou vendas.',
        inline: false
      });
    } else {
      // Top 10 rankings
      const topRankings = rankings.slice(0, 10);
      
      let rankingText = '';
      topRankings.forEach((ranking, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
        const totalActivities = ranking.totalCollections + ranking.totalSales;
        const totalValue = (ranking.totalValue / 100).toFixed(2);
        
        rankingText += `${medal} **${ranking.username}**\n`;
        rankingText += `   📦 ${ranking.totalCollections} coletas • 💰 ${ranking.totalSales} vendas\n`;
        rankingText += `   💵 R$ ${totalValue} • 🎯 ${totalActivities} atividades\n\n`;
      });

      rankingEmbed.addFields({
        name: '🏆 Top Membros',
        value: rankingText || 'Nenhum dado disponível',
        inline: false
      });

      // Statistics
      const totalMembers = rankings.length;
      const totalCollections = rankings.reduce((sum, r) => sum + r.totalCollections, 0);
      const totalSales = rankings.reduce((sum, r) => sum + r.totalSales, 0);
      const totalRevenue = rankings.reduce((sum, r) => sum + r.totalValue, 0);

      rankingEmbed.addFields(
        { name: '👥 Membros Ativos', value: totalMembers.toString(), inline: true },
        { name: '📦 Total de Coletas', value: totalCollections.toString(), inline: true },
        { name: '💰 Total de Vendas', value: totalSales.toString(), inline: true },
        { name: '💵 Receita Total', value: `R$ ${(totalRevenue / 100).toFixed(2)}`, inline: true },
        { name: '📊 Atividades Totais', value: (totalCollections + totalSales).toString(), inline: true },
        { name: '📈 Média por Membro', value: totalMembers > 0 ? ((totalCollections + totalSales) / totalMembers).toFixed(1) : '0', inline: true }
      );
    }

    // Delete previous ranking messages and send new one
    const messages = await channel.messages.fetch({ limit: 50 });
    const botMessages = messages.filter(msg => msg.author.id === client.user?.id);
    
    // Keep only the latest ranking message
    for (const [, msg] of botMessages) {
      if (msg.embeds.length > 0 && msg.embeds[0].title?.includes('RANKING')) {
        await msg.delete().catch(() => {});
      }
    }

    await channel.send({ embeds: [rankingEmbed] });

  } catch (error) {
    console.error('Erro ao atualizar ranking:', error);
  }
}

export async function generateUserStats(userId: string) {
  try {
    const collections = await storage.getCollectionsByUser(userId);
    const sales = await storage.getSalesByUser(userId);
    
    const totalCollections = collections.length;
    const totalSales = sales.length;
    const totalValue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
    const totalQuantity = collections.reduce((sum, collection) => sum + collection.quantity, 0);

    return {
      totalCollections,
      totalSales,
      totalValue,
      totalQuantity,
      totalActivities: totalCollections + totalSales
    };
  } catch (error) {
    console.error('Erro ao gerar estatísticas do usuário:', error);
    return null;
  }
}
