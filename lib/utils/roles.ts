// lib/utils/roles.ts
export const ROLES = {
  ADMIN: "admin", // ✅ Administrateur système
  MANAGER: "manager", // ✅ Gestionnaire d'hébergements
  MODERATOR: "moderator", // ✅ Modérateur de contenu
  HOST: "host", // ✅ Propriétaire d'hébergement
  GUEST: "guest", // ✅ Utilisateur invité (par défaut)
  BANNED: "banned", // ✅ Utilisateur banni
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Hiérarchie des permissions pour FastBooking
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    // 🔧 Permissions administrateur
    canManageUsers: true,
    canManageHotels: true,
    canManageBookings: true,
    canViewAnalytics: true,
    canManageSystem: true,
    canMakeReservations: true,
    canViewDashboard: true,
    canModerateContent: true,
    canManagePayments: true,
  },
  [ROLES.MANAGER]: {
    // 🏨 Permissions gestionnaire d'hébergements
    canManageUsers: false,
    canManageHotels: true,
    canManageBookings: true,
    canViewAnalytics: true,
    canManageSystem: false,
    canMakeReservations: true,
    canViewDashboard: true,
    canModerateContent: true,
    canManagePayments: true,
  },
  [ROLES.MODERATOR]: {
    // 🛡️ Permissions modérateur
    canManageUsers: false,
    canManageHotels: false,
    canManageBookings: true,
    canViewAnalytics: false,
    canManageSystem: false,
    canMakeReservations: true,
    canViewDashboard: true,
    canModerateContent: true,
    canManagePayments: false,
  },
  [ROLES.HOST]: {
    // 🏠 Permissions propriétaire d'hébergement
    canManageUsers: false,
    canManageHotels: true, // Seulement ses propres hébergements
    canManageBookings: true, // Seulement ses réservations
    canViewAnalytics: true, // Seulement ses statistiques
    canManageSystem: false,
    canMakeReservations: true,
    canViewDashboard: true,
    canModerateContent: false,
    canManagePayments: true, // Ses revenus
  },
  [ROLES.GUEST]: {
    // 👤 Permissions utilisateur standard
    canManageUsers: false,
    canManageHotels: false,
    canManageBookings: false, // Seulement ses propres réservations
    canViewAnalytics: false,
    canManageSystem: false,
    canMakeReservations: true,
    canViewDashboard: false,
    canModerateContent: false,
    canManagePayments: false,
  },
  [ROLES.BANNED]: {
    // 🚫 Utilisateur banni
    canManageUsers: false,
    canManageHotels: false,
    canManageBookings: false,
    canViewAnalytics: false,
    canManageSystem: false,
    canMakeReservations: false,
    canViewDashboard: false,
    canModerateContent: false,
    canManagePayments: false,
  },
};

// ✅ Fonction pour vérifier les permissions
export function hasPermission(
  role: Role,
  permission: keyof (typeof ROLE_PERMISSIONS)[Role]
) {
  return ROLE_PERMISSIONS[role]?.[permission] || false;
}

// ✅ Fonction pour obtenir les permissions d'un rôle
export function getRolePermissions(role: Role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.GUEST];
}
