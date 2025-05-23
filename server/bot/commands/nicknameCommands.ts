import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { updateAllMemberNicknames, updateMemberNickname } from '../utils/nicknames';
import { isAdmin } from '../utils/permissions';

export const updateNicknamesCommand = new SlashCommandBuilder()
  .setName('atualizar-apelidos')
  .setDescription('Atualiza apelidos de todos os membros baseado nos cargos da Máfia')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames);

export const updateSingleNicknameCommand = new SlashCommandBuilder()
  .setName('atualizar-apelido')
  .setDescription('Atualiza o apelido de um membro específico')
  .addUserOption(option =>
    option.setName('membro')
      .setDescription('O membro para atualizar o apelido')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames);

export async function handleUpdateAllNicknames(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild() || !interaction.member) {
    await interaction.reply({ content: '❌ Este comando só funciona em servidores!', ephemeral: true });
    return;
  }

  // Verifica permissões
  if (!isAdmin(interaction.member as any)) {
    await interaction.reply({ content: '❌ Você não tem permissão para usar este comando!', ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const guild = interaction.guild!;
    const members = await guild.members.fetch();
    const memberArray = Array.from(members.values());

    await interaction.editReply('🔄 Atualizando apelidos de todos os membros da Máfia...');

    const updated = await updateAllMemberNicknames(memberArray);

    await interaction.editReply(`✅ **Apelidos atualizados com sucesso!**\n\n🔫 **${updated}** membros da Máfia do Vinhedo receberam novos apelidos baseados em seus cargos!\n\n*Agora todos sabem quem manda no negócio de munições!* 💀`);

  } catch (error) {
    console.error('Erro ao atualizar apelidos:', error);
    await interaction.editReply('❌ Erro ao atualizar os apelidos. Verifique as permissões do bot.');
  }
}

export async function handleUpdateSingleNickname(interaction: ChatInputCommandInteraction) {
  if (!interaction.inGuild() || !interaction.member) {
    await interaction.reply({ content: '❌ Este comando só funciona em servidores!', ephemeral: true });
    return;
  }

  // Verifica permissões
  if (!isAdmin(interaction.member as any)) {
    await interaction.reply({ content: '❌ Você não tem permissão para usar este comando!', ephemeral: true });
    return;
  }

  const targetUser = interaction.options.getUser('membro', true);
  
  try {
    const guild = interaction.guild!;
    const member = await guild.members.fetch(targetUser.id);
    
    const success = await updateMemberNickname(member);
    
    if (success) {
      await interaction.reply(`✅ **Apelido atualizado!**\n\n🔫 ${member.user.username} agora tem o apelido apropriado para seu cargo na Máfia do Vinhedo!`);
    } else {
      await interaction.reply(`ℹ️ O apelido de ${member.user.username} já estava correto!`);
    }
  } catch (error) {
    console.error('Erro ao atualizar apelido:', error);
    await interaction.reply({ content: '❌ Erro ao atualizar o apelido. Verifique se o membro existe e se o bot tem permissões.', ephemeral: true });
  }
}