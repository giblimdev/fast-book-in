// app/traveler/page.tsx
"use client";

import React from "react";
import { useSession } from "@/lib/auth/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Calendar,
  MessageCircle,
  History,
  HelpCircle,
  Settings,
  Edit,
  Star,
  MapPin,
  Clock,
  Bell,
  ChevronRight,
  Loader2,
  User as UserIcon,
  Plane,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ROLES, hasPermission, type Role } from "@/lib/utils/roles";

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

export default function TravelerProfilePage() {
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
    return user?.name || user?.email || "Utilisateur";
  };

  const getUserRole = (user: User): Role => {
    return (user.role as Role) || ROLES.GUEST;
  };

  const getVariantFromRole = (
    userRole: Role
  ): "default" | "traveler" | "host" | "admin" => {
    switch (userRole) {
      case ROLES.GUEST:
        return "traveler";
      case ROLES.HOST:
        return "host";
      case ROLES.ADMIN:
      case ROLES.MANAGER:
      case ROLES.MODERATOR:
        return "admin";
      default:
        return "default";
    }
  };

  // État de chargement
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">
              Chargement de votre profil voyageur...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérification de la session
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Plane className="h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Connectez-vous pour accéder à votre espace voyageur et gérer vos
              réservations.
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
  const variant = getVariantFromRole(currentRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header du profil voyageur */}
        <div className="mb-8">
          <ProfileHeader
            user={user}
            userDisplayName={userDisplayName}
            userInitials={userInitials}
            variant="traveler" // Force le variant traveler pour cette page
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Actions rapides voyageur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-500" />
                  Actions voyageur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50"
                    asChild
                  >
                    <Link href="/demo/search">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <span className="text-sm">Réserver</span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-red-50"
                  >
                    <Heart className="h-6 w-6 text-red-500" />
                    <span className="text-sm">Favoris</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50"
                  >
                    <MessageCircle className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Messages</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-purple-50"
                  >
                    <HelpCircle className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Aide</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mes réservations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Mes réservations
                  </div>
                  <Button variant="ghost" size="sm">
                    Voir tout
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Réservation active exemple */}
                  <div className="border rounded-lg p-4 bg-blue-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Hôtel Marina Bay</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Paris, France
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Confirmée
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        15-17 Janvier 2025 • 2 nuits
                      </span>
                      <span className="font-medium text-gray-900">
                        €280 Total
                      </span>
                    </div>
                  </div>

                  {/* État vide si pas de réservations futures */}
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">Aucune autre réservation</p>
                    <p className="text-sm">
                      Découvrez nos hébergements et planifiez votre prochain
                      voyage
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/demo/search">Explorer les hébergements</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favoris */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Mes favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Aucun favori pour le moment</p>
                  <p className="text-sm">
                    Découvrez des hébergements et ajoutez-les à vos favoris
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/demo/search">Découvrir les hébergements</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques du voyageur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Mes statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Voyages réalisés
                  </span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nuits passées</span>
                  <span className="font-semibold">48</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pays visités</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Note moyenne</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  Notifications récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Réservation confirmée</p>
                    <p className="text-xs text-gray-600">
                      Votre réservation à l'Hôtel Marina Bay a été confirmée.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Il y a 2 heures
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rappel de voyage</p>
                    <p className="text-xs text-gray-600">
                      N'oubliez pas votre voyage à Paris dans 3 jours
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-600" />
                  Voyages récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hôtel Le Grand</p>
                      <p className="text-xs text-gray-600">Paris • Déc 2024</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Villa Sunshine</p>
                      <p className="text-xs text-gray-600">Nice • Nov 2024</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions administratives si permissions */}
            {hasPermission(currentRole, "canViewDashboard") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Administration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {hasPermission(currentRole, "canManageUsers") && (
                    <Button variant="ghost" className="w-full justify-start">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Gérer les utilisateurs
                    </Button>
                  )}
                  {hasPermission(currentRole, "canManageHotels") && (
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      Gérer les hébergements
                    </Button>
                  )}
                  {hasPermission(currentRole, "canViewAnalytics") && (
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      Voir les statistiques
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
