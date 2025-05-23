import { GuildMember } from 'discord.js';

// Definição dos apelidos baseados nos cargos da Máfia do Vinhedo
const ROLE_NICKNAMES = {
  // Liderança
  'BOSS_ROLE_ID': '🍷 Don',
  'UNDERBOSS_ROLE_ID': '💀 Sottocapo',
  'CONSIGLIERE_ROLE_ID': '🧠 Consigliere',
  
  // Capitães
  'CAPTAIN_ROLE_ID': '⚡ Capitão',
  'LIEUTENANT_ROLE_ID': '🔥 Tenente',
  
  // Soldados
  'SOLDIER_ROLE_ID': '🔫 Soldado',
  'ASSOCIATE_ROLE_ID': '📦 Associado',
  
  // Especialistas
  'SUPPLIER_ROLE_ID': '🚚 Fornecedor',
  'DEALER_ROLE_ID': '💰 Negociante',
  'ENFORCER_ROLE_ID': '💪 Executor',
  
  // Novatos
  'RECRUIT_ROLE_ID': '🌱 Recruta',
  'PROSPECT_ROLE_ID': '👁️ Aspirante',
};

export function getRoleBasedNickname(member: GuildMember): string | null {
  // Procura pelo cargo de maior hierarquia
  const memberRoles = member.roles.cache;
  
  // Ordem de prioridade (do mais alto para o mais baixo)
  const roleHierarchy = [
    'BOSS_ROLE_ID',
    'UNDERBOSS_ROLE_ID', 
    'CONSIGLIERE_ROLE_ID',
    'CAPTAIN_ROLE_ID',
    'LIEUTENANT_ROLE_ID',
    'SOLDIER_ROLE_ID',
    'SUPPLIER_ROLE_ID',
    'DEALER_ROLE_ID',
    'ENFORCER_ROLE_ID',
    'ASSOCIATE_ROLE_ID',
    'RECRUIT_ROLE_ID',
    'PROSPECT_ROLE_ID',
  ];

  // Encontra o cargo de maior hierarquia
  for (const roleId of roleHierarchy) {
    if (memberRoles.has(roleId)) {
      return ROLE_NICKNAMES[roleId as keyof typeof ROLE_NICKNAMES];
    }
  }

  return null; // Sem cargo específico
}

export function generateFullNickname(member: GuildMember): string {
  const roleNickname = getRoleBasedNickname(member);
  const username = member.user.displayName || member.user.username;
  
  if (roleNickname) {
    return `${roleNickname} ${username}`;
  }
  
  return username;
}

export async function updateMemberNickname(member: GuildMember): Promise<boolean> {
  try {
    const newNickname = generateFullNickname(member);
    
    // Só atualiza se o apelido for diferente do atual
    if (member.nickname !== newNickname) {
      await member.setNickname(newNickname, 'Apelido baseado no cargo da Máfia do Vinhedo');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao atualizar apelido:', error);
    return false;
  }
}

// Função para atualizar todos os membros do servidor
export async function updateAllMemberNicknames(members: GuildMember[]): Promise<number> {
  let updated = 0;
  
  for (const member of members) {
    // Pula bots
    if (member.user.bot) continue;
    
    const success = await updateMemberNickname(member);
    if (success) {
      updated++;
      // Pequeno delay para evitar rate limit
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return updated;
}