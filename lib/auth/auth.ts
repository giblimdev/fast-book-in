// lib/auth/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Renouvelle chaque jour
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: false, // Empêche la modification directe
      },
      lastName: {
        type: "string",
        required: false,
        input: false,
      },
      role: {
        type: "string",
        defaultValue: "guest",
        required: true,
        input: false, // Sécurité : empêche l'utilisateur de modifier son rôle
      },
    },
  },
  trustedOrigins: ["http://localhost:3000"],
});

// ✅ Types corrigés selon votre schéma Prisma
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  session: Session;
  user: User;
}
