// @/app/admin/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Plus,
  Eye,
  Edit,
  Activity,
  Database,
  Folder,
} from "lucide-react";
import Stats from "@/components/admin/Stats";
import familyClassification from "@/components/admin/tablesClassification";

export default function AdminDashboardPage() {
  // Fonction utilitaire pour convertir le nom de table en URL
  const getTableUrl = (tableName: string) => {
    return `/admin/${tableName
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")}`;
  };

  // Calcul des statistiques par famille
  const familyStats = familyClassification.map((family) => ({
    ...family,
    totalTables: family.tables.length,
    totalRecords: family.tables.reduce((sum, table) => sum + table.count, 0),
  }));

  // Statistiques globales personnalisées
  const globalStats = {
    users: 1248,
    hotels: 156,
    destinations: 24,
    bookings: 3400,
    usersGrowth: "+12% ce mois",
    hotelsGrowth: "+8% ce mois",
    destinationsGrowth: "+3 nouvelles",
    bookingsGrowth: "+24% ce mois",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header avec fond amélioré */}
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            <h1 className="text-5xl font-black mb-4">
              Dashboard d'Administration
            </h1>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <p className="text-xl text-gray-700 mb-2">
              🚀 Bienvenue sur FastBooking Admin
            </p>
            <p className="text-gray-600">
              Organisation logique des tables de la base de données avec
              classification par familles
            </p>
          </div>
        </div>

        {/* Composant Stats réutilisable */}
        <Stats
          globalStats={globalStats}
          familyStats={familyStats}
          showFamilyStats={true}
        />

        {/* Détail par famille avec fonds améliorés */}
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            <span>
              <Folder />
            </span>
            Gestion Détaillée par Famille
          </h2>

          {familyClassification.map((family, familyIndex) => (
            <Card
              key={familyIndex}
              className={`${family.color} ${family.borderColor} border-2 shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`${family.iconBg} p-3 rounded-xl shadow-lg`}
                    >
                      {family.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-800">
                        {family.family}
                      </CardTitle>
                      <CardDescription className="mt-2 text-gray-600 font-medium">
                        {family.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`bg-gradient-to-r ${family.accentColor} text-white px-3 py-1 border-0`}
                    >
                      {family.tables.length} tables
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-3 py-1 font-bold bg-white/70"
                    >
                      {family.tables
                        .reduce((sum, table) => sum + table.count, 0)
                        .toLocaleString()}{" "}
                      items
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {family.tables.map((table, tableIndex) => (
                    <Link
                      key={tableIndex}
                      href={getTableUrl(table.name)}
                      className="group block"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-300 border-l-4 group-hover:scale-105 cursor-pointer h-full">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                                {table.icon}
                              </span>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                  {table.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {table.description}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={`bg-gradient-to-r ${family.accentColor} text-white border-0 font-bold group-hover:shadow-lg transition-shadow`}
                            >
                              {table.count.toLocaleString()}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <code className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-mono group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                              {table.name}
                            </code>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                                title="Voir"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Action de visualisation si nécessaire
                                }}
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-green-100"
                                title="Modifier"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Action de modification si nécessaire
                                }}
                              >
                                <Edit className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-purple-100"
                                title="Ajouter"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Action d'ajout si nécessaire
                                }}
                              >
                                <Plus className="h-4 w-4 text-purple-600" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions rapides avec fond coloré */}
        <Card className="mt-12 p-0 bg-gradient-to-r from-slate-100 via-gray-100 to-zinc-100 border-2 border-gray-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg p-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              🚀 Actions Rapides & Outils
            </CardTitle>
            <CardDescription className="text-gray-200">
              Raccourcis pour les tâches administratives courantes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/hotel-card">
                <Button className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau HotelCard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-14 border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
              >
                <Database className="h-5 w-5 mr-2 text-emerald-600" />
                Backup Database
              </Button>
              <Button
                variant="outline"
                className="h-14 border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
              >
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Statistiques Avancées
              </Button>
              <Button
                variant="outline"
                className="h-14 border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300"
              >
                <Activity className="h-5 w-5 mr-2 text-orange-600" />
                Monitoring Système
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer avec gradient */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            <p className="text-lg font-bold">
              FastBooking Admin Dashboard - Powered by Next.js 15+ & Prisma
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
/*
Dans "Détail par famille avec fonds améliorés " 
Creer un section Room et ajoutes les information suivantes 
model HotelReview {
  id           String   @id @default(uuid())
  hotelCardId  String
  userId       String
  rating       Float // Note de 1 à 5
  title        String?
  comment      String
  pros         String[] // Points positifs
  cons         String[] // Points négatifs
  roomType     String?
  stayDate     DateTime
  isVerified   Boolean  @default(false)
  helpfulCount Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  hotelCard HotelCard @relation(fields: [hotelCardId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@map("hotel_reviews")
}

model HotelRoom {
  id            String   @id @default(uuid())
  hotelCardId   String
  name          String
  description   String?
  maxGuests     Int
  bedCount      Int
  bedType       String
  roomSize      Float? // en m²
  pricePerNight Float
  currency      String   @default("EUR")
  isAvailable   Boolean  @default(true)
  images        String[] // URLs des images
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  hotelCard HotelCard @relation(fields: [hotelCardId], references: [id])

  @@map("hotel_rooms")
}

model HotelPolicy {
  id           String   @id @default(uuid())
  hotelCardId  String   @unique
  checkIn      String // "15:00"
  checkOut     String // "11:00"
  cancellation String // Politique d'annulation
  pets         Boolean  @default(false)
  smoking      Boolean  @default(false)
  parties      Boolean  @default(false)
  children     String? // Politique enfants
  extraBed     String?
  breakfast    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  hotelCard HotelCard @relation(fields: [hotelCardId], references: [id])

  @@map("hotel_policies")
}

model HotelFAQ {
  id          String   @id @default(uuid())
  hotelCardId String
  question    String
  answer      String
  category    String // "Général", "Réservation", "Services", etc.
  order       Int      @default(100)
  isPopular   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  hotelCard HotelCard @relation(fields: [hotelCardId], references: [id])

  @@map("hotel_faqs")
}


*/
