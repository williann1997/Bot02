import { Client, GatewayIntentBits, Events } from 'discord.js';
import { setupEmbeds } from './commands/index';
import { handleCollectionSubmit } from './handlers/collectionHandler';
import { handleSaleSubmit } from './handlers/saleHandler';
import { handleSetRequest, handleMemberDecision } from './handlers/setHandler';
import { updateMemberNickname } from './utils/nicknames';

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

    // Atualiza apelidos quando membros recebem/perdem cargos
    this.client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
      try {
        // Verifica se houve mudança nos cargos
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;
        
        if (oldRoles.size !== newRoles.size || 
            !oldRoles.every(role => newRoles.has(role.id))) {
          console.log(`🔄 Atualizando apelido de ${newMember.user.username} após mudança de cargo`);
          await updateMemberNickname(newMember);
        }
      } catch (error) {
        console.error('Erro ao atualizar apelido após mudança de cargo:', error);
      }
    });

    // Atualiza apelido quando novos membros entram
    this.client.on(Events.GuildMemberAdd, async (member) => {
      try {
        console.log(`🆕 Novo membro: ${member.user.username}`);
        // Aguarda um pouco para os cargos serem atribuídos
        setTimeout(async () => {
          await updateMemberNickname(member);
        }, 2000);
      } catch (error) {
        console.error('Erro ao atualizar apelido de novo membro:', error);
      }
    });

    // Handle button interactions
    this.client.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (interaction.isButton()) {
          const { customId } = interaction;

          if (customId === 'register_collection') {
            await handleCollectionSubmit(interaction);
          } else if (customId === 'register_sale') {
            await handleSaleSubmit(interaction);
          } else if (customId === 'request_set') {
            await handleSetRequest(interaction);
          } else if (customId.startsWith('accept_member_') || customId.startsWith('reject_member_')) {
            await handleMemberDecision(interaction);
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
