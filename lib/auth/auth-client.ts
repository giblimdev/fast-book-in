/*
// components/ui/RoleBadge.tsx
// lib/auth/auth-client.ts
// lib/utils/roles.ts



*/
// lib/auth/auth-client.ts
import { createAuthClient } from "better-auth/react";
import type { User, Session, AuthSession } from "./auth";
import { ROLES, type Role, getRolePermissions } from "@/lib/utils/roles";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, getSession, updateUser } =
  authClient;

// ✅ Hook utilitaire amélioré pour la gestion des rôles
export const useUserRole = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const userRole = (user?.role as Role) || ROLES.GUEST;

  return {
    role: userRole,
    isAdmin: userRole === ROLES.ADMIN,
    isManager: userRole === ROLES.MANAGER,
    isModerator: userRole === ROLES.MODERATOR,
    isHost: userRole === ROLES.HOST,
    isGuest: userRole === ROLES.GUEST,
    isBanned: userRole === ROLES.BANNED,
    permissions: getRolePermissions(userRole),
  };
};

// ✅ Hook pour vérifier les permissions spécifiques
export const usePermissions = () => {
  const { role, permissions } = useUserRole();

  return {
    ...permissions,
    role,
    // Helpers pour les vérifications courantes
    canAccessAdminPanel:
      permissions.canManageSystem || permissions.canManageUsers,
    canManageOwnContent:
      role === ROLES.HOST || role === ROLES.ADMIN || role === ROLES.MANAGER,
    canViewReports: permissions.canViewAnalytics,
  };
};

// Export des types
export type { User, Session, AuthSession, Role };
export { authClient as default };
