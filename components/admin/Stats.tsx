// @/components/admin/Stats.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, MapPin, Calendar } from "lucide-react";

interface GlobalStats {
  users: number;
  hotels: number;
  destinations: number;
  bookings: number;
  usersGrowth?: string;
  hotelsGrowth?: string;
  destinationsGrowth?: string;
  bookingsGrowth?: string;
}

interface FamilyData {
  family: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  accentColor: string;
  iconBg: string;
  totalTables: number;
  totalRecords: number;
}

interface StatsProps {
  globalStats?: GlobalStats;
  familyStats?: FamilyData[];
  showFamilyStats?: boolean;
}

export default function Stats({
  globalStats = {
    users: 1248,
    hotels: 156,
    destinations: 24,
    bookings: 3400,
    usersGrowth: "+12% ce mois",
    hotelsGrowth: "+8% ce mois",
    destinationsGrowth: "+3 nouvelles",
    bookingsGrowth: "+24% ce mois",
  },
  familyStats = [],
  showFamilyStats = true,
}: StatsProps) {
  const statsCards = [
    {
      title: "Total Utilisateurs",
      value: globalStats.users.toLocaleString(),
      growth: globalStats.usersGrowth,
      icon: Users,
      gradient: "from-blue-500 to-blue-700",
      textColor: "text-blue-100",
      growthColor: "text-blue-200",
    },
    {
      title: "Hôtels Actifs",
      value: globalStats.hotels.toString(),
      growth: globalStats.hotelsGrowth,
      icon: Building2,
      gradient: "from-purple-500 to-purple-700",
      textColor: "text-purple-100",
      growthColor: "text-purple-200",
    },
    {
      title: "Destinations",
      value: globalStats.destinations.toString(),
      growth: globalStats.destinationsGrowth,
      icon: MapPin,
      gradient: "from-emerald-500 to-green-700",
      textColor: "text-emerald-100",
      growthColor: "text-emerald-200",
    },
    {
      title: "Réservations",
      value:
        globalStats.bookings > 1000
          ? `${(globalStats.bookings / 1000).toFixed(1)}k`
          : globalStats.bookings.toString(),
      growth: globalStats.bookingsGrowth,
      icon: Calendar,
      gradient: "from-orange-500 to-red-600",
      textColor: "text-orange-100",
      growthColor: "text-orange-200",
    },
  ];

  return (
    <div>
      {/* Statistiques globales avec fonds colorés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${stat.textColor} font-medium`}>
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black">{stat.value}</p>
                    {stat.growth && (
                      <p className={`${stat.growthColor} text-sm mt-1`}>
                        {stat.growth}
                      </p>
                    )}
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vue d'ensemble des familles avec couleurs */}
      {showFamilyStats && familyStats.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            📊 Vue d'Ensemble par Famille
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyStats.map((family, index) => (
              <Card
                key={index}
                className={`${family.color} ${family.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`${family.iconBg} p-2 rounded-xl shadow-md`}
                      >
                        {family.icon}
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        {family.family}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {family.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Tables :
                      </span>
                      <Badge
                        className={`bg-gradient-to-r ${family.accentColor} text-white border-0`}
                      >
                        {family.totalTables}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Enregistrements :
                      </span>
                      <Badge variant="outline" className="font-bold">
                        {family.totalRecords.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
