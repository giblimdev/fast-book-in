// components/profile/ProfileHeader.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { ROLES, type Role } from "@/lib/utils/roles";

// Type utilisateur basé sur votre schéma Prisma
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileHeaderProps {
  user: User;
  userDisplayName: string;
  userInitials: string;
  variant?: "default" | "traveler" | "host" | "admin";
  className?: string;
}

export function ProfileHeader({
  user,
  userDisplayName,
  userInitials,
  variant = "default",
  className = "",
}: ProfileHeaderProps) {
  // Fonction pour mapper le variant au rôle approprié
  const getVariantRole = (): Role => {
    switch (variant) {
      case "traveler":
        return ROLES.GUEST;
      case "host":
        return ROLES.HOST;
      case "admin":
        return ROLES.ADMIN;
      default:
        // Convertir le string role du schéma en Role enum
        return (user.role as Role) || ROLES.GUEST;
    }
  };

  // Configurations de gradients selon le variant
  const getGradientConfig = () => {
    const role = getVariantRole();

    switch (role) {
      case ROLES.GUEST:
        return {
          gradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500",
          pattern: (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="absolute top-8 right-8 w-6 h-6 bg-white/15 rounded-full"></div>
              <div className="absolute bottom-6 left-12 w-4 h-4 bg-white/25 rounded-full"></div>
            </div>
          ),
        };
      case ROLES.HOST:
        return {
          gradient: "bg-gradient-to-r from-amber-500 via-orange-600 to-red-500",
          pattern: (
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 rounded-lg rotate-12"></div>
              <div className="absolute bottom-4 left-6 w-6 h-6 bg-white/25 rounded-lg -rotate-12"></div>
            </div>
          ),
        };
      case ROLES.ADMIN:
      case ROLES.MANAGER:
      case ROLES.MODERATOR:
        return {
          gradient:
            "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900",
          pattern: (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 w-8 h-1 bg-white/30 rounded-full"></div>
              <div className="absolute top-8 right-4 w-6 h-1 bg-white/25 rounded-full"></div>
              <div className="absolute top-12 right-4 w-4 h-1 bg-white/20 rounded-full"></div>
            </div>
          ),
        };
      default:
        return {
          gradient: "bg-gradient-to-r from-gray-600 to-gray-700",
          pattern: null,
        };
    }
  };

  const { gradient, pattern } = getGradientConfig();
  const currentRole = getVariantRole();

  // Formatage de la date de création
  const formatMemberSince = (createdAt: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
    }).format(new Date(createdAt));
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`relative h-32 ${gradient}`}>{pattern}</div>

      <div className="px-6 pb-6">
        {/* Avatar qui chevauche */}
        <div className="relative -mt-12 mb-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={user?.image || ""} alt={userDisplayName} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Informations utilisateur */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userDisplayName}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Badge de rôle et statut */}
          <div className="flex items-center gap-2">
            <RoleBadge role={currentRole} />
            {user?.emailVerified && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Vérifié
              </Badge>
            )}
          </div>

          {/* Informations supplémentaires selon le rôle */}
          {currentRole === ROLES.HOST && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📍 Paris, France</span>
              <span>⭐ 4.8 (127 avis)</span>
              <span>🏠 3 propriétés</span>
            </div>
          )}

          {currentRole === ROLES.GUEST && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📍 Paris, France</span>
              <span>🎯 Membre depuis {formatMemberSince(user.createdAt)}</span>
            </div>
          )}

          {(currentRole === ROLES.ADMIN || currentRole === ROLES.MANAGER) && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>👑 Administrateur</span>
              <span>🛡️ Accès complet</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
