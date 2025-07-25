// app/public/welcome/page.tsx
"use client";

import React from "react";
import { useSession } from "@/lib/auth/auth-client";
import type { User } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Calendar,
  Users,
  Loader2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WelcomePage() {
  const { data: session, isPending } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    const user = session?.user as User; // ✅ Cast sûr vers notre type
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || user?.email || "Utilisateur";
  };

  // État de chargement
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de FastBooking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FastBooking
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Votre plateforme de démonstration pour la gestion et la
              réservation d'hébergements
            </p>

            {/* État de connexion */}
            {session ? (
              // Utilisateur connecté
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-xl border border-white/50">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-4 border-blue-500/20">
                    <AvatarImage
                      src={(session.user as User)?.image || ""}
                      alt={getUserDisplayName()}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                      {getInitials(getUserDisplayName())}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Bienvenue, {getUserDisplayName()} !
                    </h2>
                    <p className="text-gray-600">
                      {(session.user as User)?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          (session.user as User)?.role === "admin"
                            ? "default"
                            : "secondary"
                        }
                        className={`
                          ${
                            (session.user as User)?.role === "admin"
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                              : "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                          }
                        `}
                      >
                        {(session.user as User)?.role === "admin"
                          ? "Administrateur"
                          : "Invité"}
                      </Badge>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        Connecté
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/com">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                      <Home className="mr-2 h-5 w-5" />
                      Découvrir le projet
                    </Button>
                  </Link>
                  <Link href="/com/about">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-200 hover:bg-blue-50 py-3 rounded-lg transition-all duration-200"
                    >
                      <Calendar className="mr-2 h-5 w-5" />À propos
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Utilisateur non connecté
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-xl border border-white/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Rejoignez FastBooking
                </h2>
                <p className="text-gray-600 mb-6">
                  Connectez-vous ou créez un compte pour accéder à notre
                  plateforme de démonstration.
                </p>
                <div className="space-y-3">
                  <Link href="/public/auth/login" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                      Se connecter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/public/auth/register" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-200 hover:bg-blue-50 py-3 rounded-lg transition-all duration-200"
                    >
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fonctionnalités de démonstration
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez toutes les possibilités de notre plateforme de gestion
            d'hébergements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                Recherche d'hébergements
              </CardTitle>
              <CardDescription>
                Explorez notre catalogue d'hébergements avec filtres avancés et
                géolocalisation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                Gestion des réservations
              </CardTitle>
              <CardDescription>
                Système complet de réservation avec calendrier, disponibilités
                et confirmations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                Interface administrateur
              </CardTitle>
              <CardDescription>
                Panneau d'administration pour gérer les hébergements,
                utilisateurs et statistiques
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Application de démonstration
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            FastBooking utilise les dernières technologies : Next.js 15+, Better
            Auth, Prisma, et shadcn/ui
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30"
            >
              Next.js 15+
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30"
            >
              Better Auth
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30"
            >
              Prisma PostgreSQL
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30"
            >
              shadcn/ui
            </Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FastBooking
              </h3>
              <p className="text-gray-400">Plateforme de démonstration</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                À propos
              </Link>
              <Link
                href="/com/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Conditions
              </Link>
              <Link
                href="/com/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
