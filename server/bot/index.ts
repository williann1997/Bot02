import { Client, GatewayIntentBits, Events } from 'discord.js';
import { setupEmbeds } from './commands/index';
import { handleCollectionSubmit } from './handlers/collectionHandler';
import { handleSaleSubmit } from './handlers/saleHandler';
import { handleSetRequest } from './handlers/setHandler';

export class DiscordBot {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.once(Events.ClientReady, () => {
      console.log(`Bot logado como ${this.client.user?.tag}!`);
      setupEmbeds(this.client);
    });

    // Handle button interactions
    this.client.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (interaction.isButton()) {
          const { customId } = interaction;

          switch (customId) {
            case 'register_collection':
              await handleCollectionSubmit(interaction);
              break;
            case 'register_sale':
              await handleSaleSubmit(interaction);
              break;
            case 'request_set':
              await handleSetRequest(interaction);
              break;
          }
        }

        // Handle modal submissions
        if (interaction.isModalSubmit()) {
          const { customId } = interaction;

          if (customId === 'collection_modal') {
            const name = interaction.fields.getTextInputValue('name');
            const id = interaction.fields.getTextInputValue('id');
            const quantity = interaction.fields.getTextInputValue('quantity');

            await handleCollectionSubmit(interaction, { name, id, quantity });
          }

          if (customId === 'sale_modal') {
            const name = interaction.fields.getTextInputValue('name');
            const id = interaction.fields.getTextInputValue('id');
            const description = interaction.fields.getTextInputValue('description');
            const status = interaction.fields.getTextInputValue('status');
            const totalValue = interaction.fields.getTextInputValue('total_value');

            await handleSaleSubmit(interaction, { name, id, description, status, totalValue });
          }
        }
      } catch (error) {
        console.error('Erro ao processar interação:', error);
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'Ocorreu um erro ao processar sua solicitação.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'Ocorreu um erro ao processar sua solicitação.',
            ephemeral: true,
          });
        }
      }
    });
  }

  async start() {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      throw new Error('DISCORD_BOT_TOKEN não foi definido nas variáveis de ambiente');
    }

    await this.client.login(token);
  }

  getClient() {
    return this.client;
  }
}
