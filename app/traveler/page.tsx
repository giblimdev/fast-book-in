// app/com/profile/page.tsx
"use client";

import React from "react";
import { useSession, useUserRole } from "@/lib/auth/auth-client";
import type { User } from "@/lib/auth/auth";
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
} from "lucide-react";
import Link from "next/link";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const { role, permissions } = useUserRole();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    const user = session?.user as User;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || user?.email || "Utilisateur";
  };

  // État de chargement
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Redirection si non connecté
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Accès restreint
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Vous devez être connecté pour accéder à votre espace personnel.
            </p>
            <Link href="/public/auth/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Se connecter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user as User;
  const userDisplayName = getUserDisplayName();
  const userInitials = getInitials(userDisplayName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du profil */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage
                  src={user?.image || ""}
                  alt={userDisplayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-white/20 text-white font-bold text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">{userDisplayName}</h1>
                <p className="text-blue-100 mb-3">{user?.email}</p>
                <div className="flex items-center gap-3">
                  <RoleBadge role={user?.role || "guest"} showIcon />
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    Membre depuis {new Date(user?.createdAt).getFullYear()}
                  </Badge>
                </div>
              </div>

              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier le profil
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vos favoris */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Vos favoris</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Exemple de favori */}
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Hôtel Paradise
                      </h4>
                      <p className="text-sm text-gray-500">Paris, France</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">
                          4.8 (124 avis)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Aucun favori pour le moment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Réservations */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Réservations</CardTitle>
                </div>
                <Link href="/com/reservations">
                  <Button variant="ghost" size="sm">
                    Gérer <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Exemple de réservation */}
                  <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      15
                      <br />
                      <span className="text-xs">JAN</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Hôtel Marina Bay
                      </h4>
                      <p className="text-sm text-gray-500">
                        15-17 Janvier 2025 • 2 nuits
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 text-green-600 border-green-200"
                      >
                        Confirmée
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">€280</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Aucune réservation active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages & Notifications */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Messages & Notifications
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  3 nouveaux
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Exemple de message */}
                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        Confirmation de réservation
                      </h5>
                      <p className="text-sm text-gray-600">
                        Votre réservation à l'Hôtel Marina Bay a été confirmée.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Il y a 2 heures
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        Message de l'hôtel
                      </h5>
                      <p className="text-sm text-gray-600">
                        Informations importantes concernant votre séjour...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Hier</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Historique */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <History className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Historique</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">Hôtel Le Grand</p>
                      <p className="text-xs text-gray-500">Déc 2024</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs ml-1">5.0</span>
                    </div>
                  </div>

                  <Link href="/com/history" className="block">
                    <Button variant="outline" className="w-full">
                      <History className="h-4 w-4 mr-2" />
                      Voir l'historique complet
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Assistance */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Assistance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/com/help/faq" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQ
                  </Button>
                </Link>

                <Link href="/com/help/contact" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Nous contacter
                  </Button>
                </Link>

                <Link href="/com/help/support" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Support technique
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Statistiques rapides (si permissions) */}
            {permissions.canViewAnalytics && (
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Vos statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Réservations totales
                    </span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Favoris</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avis donnés</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
