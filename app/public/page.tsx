// app/public/page.tsx
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  Star,
  MapPin,
} from "lucide-react";

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Page Publique
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Cette page est accessible à tous les visiteurs sans authentification
          </p>
        </div>

        {/* Contenu principal */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-blue-600" />
              FastBooking - Démonstration
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-lg">
              Découvrez notre sélection d'hébergements avec notre système de
              cartes d'hôtels.
            </p>

            {/* Bouton principal vers fundedHotel */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/public/foundeHotels">
                  <Building2 className="mr-2 h-5 w-5" />
                  Liste d'hôtels
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section informative */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold">Accessible à tous</h3>
              </div>
              <p className="text-gray-600">
                Cette page publique ne nécessite aucune connexion. Parfait pour
                découvrir nos hébergements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
                <h3 className="text-lg font-semibold">
                  Hébergements sélectionnés
                </h3>
              </div>
              <p className="text-gray-600">
                Découvrez une sélection d'hôtels avec leurs caractéristiques
                détaillées et prix.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation vers d'autres sections */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Explorer FastBooking</h3>
            <p className="text-blue-100 mb-6">
              Découvrez les autres fonctionnalités de notre plateforme
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" asChild>
                <Link href="/public/foundedHotels">
                  <Building2 className="mr-2 h-4 w-4" />
                  Démo complète
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-black border-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/host">
                  <MapPin className="mr-2 h-4 w-4" />À propos du projet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
