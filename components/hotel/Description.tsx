// @/components/hotel/Description.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MapPin, Star, Users } from "lucide-react";

interface DescriptionProps {
  hotel?: {
    id: string;
    name: string;
    shortDescription?: string;
    description?: string;
    starRating: number;
    overallRating?: number;
    reviewCount: number;
    accommodationType?: {
      name: string;
      category: string;
    };
    destination?: {
      name: string;
      type: string;
    };
    hotelGroup?: {
      name: string;
      logoUrl?: string;
    };
  };
}

// Données simulées basées sur votre schéma
const mockHotel = {
  id: "1",
  name: "Grand Hôtel de la Paix",
  shortDescription: "Hôtel de luxe au cœur de la ville historique",
  description: `
    Situé dans un bâtiment historique du 18ème siècle magnifiquement restauré, 
    le Grand Hôtel de la Paix offre une expérience unique alliant charme d'antan 
    et confort moderne. Nos 120 chambres et suites élégamment décorées disposent 
    toutes de la climatisation, du WiFi gratuit et d'une vue imprenable sur la ville 
    ou nos jardins privés.
    
    L'hôtel propose un restaurant gastronomique étoilé, un spa de 800m² avec 
    piscine intérieure chauffée, et des salles de réception pour vos événements. 
    Notre concierge sera ravi de vous conseiller pour découvrir les trésors 
    cachés de notre région.
  `,
  starRating: 5,
  overallRating: 4.8,
  reviewCount: 1247,
  accommodationType: {
    name: "Hôtel de Luxe",
    category: "Premium",
  },
  destination: {
    name: "Centre Historique",
    type: "Zone touristique",
  },
  hotelGroup: {
    name: "Collection Prestige",
    logoUrl: "/logos/prestige.png",
  },
};

export default function Description({ hotel = mockHotel }: DescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortText = hotel.description?.substring(0, 300) + "...";
  const shouldShowReadMore = (hotel.description?.length || 0) > 300;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        {/* En-tête avec informations principales */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hotel.name}
              </h1>

              {/* Rating et classification */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center">
                  {[...Array(hotel.starRating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {hotel.overallRating && (
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
                      {hotel.overallRating}
                    </div>
                    <span className="text-gray-600">
                      ({hotel.reviewCount.toLocaleString()} avis)
                    </span>
                  </div>
                )}
              </div>

              {/* Badges informatifs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.accommodationType && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {hotel.accommodationType.name}
                  </Badge>
                )}

                {hotel.destination && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {hotel.destination.name}
                  </Badge>
                )}

                {hotel.hotelGroup && (
                  <Badge variant="outline">{hotel.hotelGroup.name}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description courte */}
          {hotel.shortDescription && (
            <p className="text-lg text-gray-700 font-medium mb-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              {hotel.shortDescription}
            </p>
          )}
        </div>

        {/* Description complète */}
        {hotel.description && (
          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              À propos de cet hébergement
            </h3>

            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {isExpanded || !shouldShowReadMore
                ? hotel.description
                : shortText}
            </div>

            {shouldShowReadMore && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? (
                  <>
                    Voir moins <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Lire la suite <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Classification {hotel.starRating} étoiles</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{hotel.reviewCount.toLocaleString()} avis clients</span>
            </div>

            {hotel.accommodationType && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {hotel.accommodationType.category}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
