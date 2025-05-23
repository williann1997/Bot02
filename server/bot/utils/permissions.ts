import { GuildMember, PermissionFlagsBits } from 'discord.js';

// Admin role IDs or user IDs - configure these based on your server
const ADMIN_ROLES = [
  'ADMIN_ROLE_ID_1', // Replace with actual role IDs
  'ADMIN_ROLE_ID_2',
];

const ADMIN_USERS = [
  'ADMIN_USER_ID_1', // Replace with actual user IDs
  'ADMIN_USER_ID_2',
];

export function isAdmin(member: GuildMember): boolean {
  // Check if user has administrator permission
  if (member.permissions.has(PermissionFlagsBits.Administrator)) {
    return true;
  }

  // Check if user has specific admin roles
  const hasAdminRole = ADMIN_ROLES.some(roleId => 
    member.roles.cache.has(roleId)
  );

  // Check if user is in admin users list
  const isAdminUser = ADMIN_USERS.includes(member.id);

  return hasAdminRole || isAdminUser;
}

export function isModerator(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.ManageMessages) || isAdmin(member);
}

export function canManageBot(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.ManageGuild) || isAdmin(member);
}
