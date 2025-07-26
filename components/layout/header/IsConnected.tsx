// components/layout/header/IsConnected.tsx
"use client";

import React from "react";
import { useSession, signOut, useUserRole } from "@/lib/auth/auth-client";
import type { User } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Home,
  History,
  LogOut,
  Loader2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function IsConnected() {
  const { data: session, isPending } = useSession();
  const { role, isAdmin } = useUserRole(); // ✅ Utilise le hook personnalisé
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/public/auth/goddbye"); // ✅ Route correcte
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

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
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement...
      </Button>
    );
  }

  // Utilisateur non connecté
  if (!session) {
    return (
      <Link href="/public/auth/login">
        {" "}
        {/* ✅ Route correcte */}
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
          Se connecter
        </Button>
      </Link>
    );
  }

  // Utilisateur connecté avec types sûrs
  const user = session.user as User; // ✅ Cast sûr vers notre type
  const userDisplayName = getUserDisplayName();
  const userInitials = getInitials(userDisplayName);

  return (
    <div className="ml-5 flex items-center gap-3">
      {/* Badge de rôle */}
      <Badge
        variant={role === "admin" ? "default" : "secondary"}
        className={`
          ${
            role === "admin"
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
              : "bg-gradient-to-r from-green-500 to-blue-500 text-white"
          } 
          px-2 py-1 text-xs font-medium rounded-full
        `}
      >
        {role === "admin" ? "Admin" : "Invité"}
      </Badge>

      {/* Menu déroulant avec avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200"
          >
            <Avatar className="h-10 w-10 border-2 border-gradient-to-r from-blue-400 to-purple-400">
              <AvatarImage
                src={user?.image || ""}
                alt={userDisplayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-72 p-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl"
          align="end"
          forceMount
        >
          {/* En-tête utilisateur */}
          <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-2">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {userDisplayName}
              </p>
              <p className="text-xs text-gray-500 leading-none">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-white/50"
                >
                  {role}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          {/* Menu items */}
          <Link href="/com/profile">
            <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
              <UserIcon className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Mon Profil</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/com">
            <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
              <Home className="h-4 w-4 text-green-600" />
              <span className="font-medium">Accueil du projet</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/com/about">
            <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
              <History className="h-4 w-4 text-purple-600" />
              <span className="font-medium">À propos</span>
            </DropdownMenuItem>
          </Link>

          {isAdmin && (
            <Link href="/admin">
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                <Settings className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Administration</span>
              </DropdownMenuItem>
            </Link>
          )}

          <DropdownMenuSeparator className="my-2" />

          {/* Déconnexion */}
          <DropdownMenuItem
            onClick={handleSignOut}
            className="gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-red-600 focus:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
