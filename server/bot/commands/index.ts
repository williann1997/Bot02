import { Client, TextChannel } from 'discord.js';
import { createCollectionEmbed } from '../embeds/collectionEmbed';
import { createSaleEmbed } from '../embeds/saleEmbed';
import { createRequestSetEmbed } from '../embeds/requestSetEmbed';

const CHANNELS = {
  COLLECTION: '1373300281730924624',
  SALE: '1373300281730924624',
  SET_REQUEST: '1373308437684813865',
};

export async function setupEmbeds(client: Client) {
  try {
    // Setup Collection Embed
    const collectionChannel = await client.channels.fetch(CHANNELS.COLLECTION) as TextChannel;
    if (collectionChannel) {
      const { embed, row } = createCollectionEmbed();
      await collectionChannel.send({ embeds: [embed], components: [row] });
      console.log('Embed de coleta enviado com sucesso!');
    }

    // Setup Sale Embed
    const saleChannel = await client.channels.fetch(CHANNELS.SALE) as TextChannel;
    if (saleChannel) {
      const { embed, row } = createSaleEmbed();
      await saleChannel.send({ embeds: [embed], components: [row] });
      console.log('Embed de venda enviado com sucesso!');
    }

    // Setup Request Set Embed
    const setChannel = await client.channels.fetch(CHANNELS.SET_REQUEST) as TextChannel;
    if (setChannel) {
      const { embed, row } = createRequestSetEmbed();
      await setChannel.send({ embeds: [embed], components: [row] });
      console.log('Embed de pedido de set enviado com sucesso!');
    }

  } catch (error) {
    console.error('Erro ao configurar embeds:', error);
  }
}
