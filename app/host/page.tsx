// @/app/host/page.tsx
"use client";

import React from "react";
import { useSession } from "@/lib/auth/auth-client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROLES, hasPermission, type Role } from "@/lib/utils/roles";
import {
  Building2,
  Calendar,
  MessageSquare,
  Clock,
  HelpCircle,
  BarChart3,
  Plus,
  Eye,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Loader2,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

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

export default function HostPage() {
  const { data: session, isPending } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = (user: User) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || user?.email || "Hôte";
  };

  const getUserRole = (user: User): Role => {
    return (user.role as Role) || ROLES.HOST;
  };

  // Données simulées pour la démonstration
  const stats = {
    totalAccommodations: 3,
    activeReservations: 12,
    monthlyRevenue: 4850,
    averageRating: 4.7,
    occupancyRate: 85,
  };

  const quickActions = [
    {
      title: "Ajouter un hébergement",
      description: "Créer une nouvelle annonce",
      icon: Plus,
      color: "from-blue-500 to-blue-600",
      href: "/host/accommodations",
    },
    {
      title: "Voir les réservations",
      description: "Gérer vos réservations",
      icon: Calendar,
      color: "from-green-500 to-green-600",
      href: "/host/reservations",
    },
    {
      title: "Messages clients",
      description: "3 nouveaux messages",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      href: "/host/messages",
      badge: "3",
    },
  ];

  const menuSections = [
    {
      title: "Vos Hébergements",
      description: "Gérez vos propriétés et annonces",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      href: "/host/accommodations",
      count: stats.totalAccommodations,
    },
    {
      title: "Vos Réservations",
      description: "Suivez vos réservations en cours",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      href: "/host/reservations",
      count: stats.activeReservations,
    },
    {
      title: "Messages & Notifications",
      description: "Communiquez avec vos clients",
      icon: MessageSquare,
      color: "from-purple-500 to-violet-500",
      href: "/host/messages",
      badge: true,
    },
    {
      title: "Historique",
      description: "Consultez l'historique de vos activités",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      href: "/host/history",
    },
    {
      title: "Assistance",
      description: "Support et aide pour les hôtes",
      icon: HelpCircle,
      color: "from-pink-500 to-rose-500",
      href: "/host/support",
    },
  ];

  // État de chargement
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600 mb-4" />
            <p className="text-gray-600">Chargement de votre espace hôte...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérification de la session
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Building2 className="h-12 w-12 text-amber-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Connectez-vous pour accéder à votre espace hôte et gérer vos
              hébergements.
            </p>
            <Button asChild>
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user as User;
  const userDisplayName = getUserDisplayName(user);
  const userInitials = getInitials(userDisplayName);
  const currentRole = getUserRole(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header du profil hôte */}
        <div className="mb-8">
          <ProfileHeader
            user={user}
            userDisplayName={userDisplayName}
            userInitials={userInitials}
            variant="host"
            className="mb-8"
          />
        </div>

        <div className="space-y-8">
          {/* Header de bienvenue */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 bg-clip-text text-transparent">
              Bienvenue sur l'espace professionnel
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Gérez facilement vos hébergements, réservations et communications
              avec vos clients
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-600">
                  Hébergements
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalAccommodations}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-600">
                  Réservations
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.activeReservations}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-600">
                  Revenus/mois
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.monthlyRevenue}€
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-slate-600">
                  Note moyenne
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.averageRating}/5
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-600">
                  Taux d'occupation
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.occupancyRate}%
              </p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="relative group cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600">{action.description}</p>
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {action.badge}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Sections principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuSections.map((section, index) => (
              <Link
                key={section.title}
                href={section.href}
                className="relative group cursor-pointer hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <section.icon className="w-7 h-7 text-white" />
                    </div>
                    {section.count && (
                      <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                        {section.count}
                      </div>
                    )}
                    {section.badge && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {section.description}
                  </p>

                  <div className="mt-4 flex items-center text-sm text-slate-500 group-hover:text-amber-600 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir les détails
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Section Statistiques séparée */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Statistiques détaillées
                  </h2>
                  <p className="text-slate-300">
                    Analysez vos performances et optimisez vos revenus
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Revenus totaux
                  </h4>
                  <p className="text-2xl font-bold">
                    €{(stats.monthlyRevenue * 12).toLocaleString()}
                  </p>
                  <p className="text-green-400 text-sm mt-1">
                    +12% vs année précédente
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Clients satisfaits
                  </h4>
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-green-400 text-sm mt-1">+3% ce mois</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Temps de réponse
                  </h4>
                  <p className="text-2xl font-bold">2h</p>
                  <p className="text-blue-400 text-sm mt-1">En moyenne</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Réservations récurrentes
                  </h4>
                  <p className="text-2xl font-bold">67%</p>
                  <p className="text-purple-400 text-sm mt-1">
                    Clients fidèles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
