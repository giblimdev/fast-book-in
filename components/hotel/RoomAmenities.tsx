// @/components/hotel/RoomAmenities.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Coffee,
  Tv,
  Wind,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AmenitiesProps {
  hotelId?: string;
}

// Données simulées basées sur votre schéma HotelAmenity et RoomAmenity
const mockAmenities = {
  hotelAmenities: [
    {
      id: "1",
      name: "WiFi gratuit",
      category: "Connectivité",
      icon: "wifi",
      description: "Internet haut débit dans tout l'établissement",
    },
    {
      id: "2",
      name: "Parking privé",
      category: "Transport",
      icon: "car",
      description: "Parking sécurisé pour 50 véhicules",
    },
    {
      id: "3",
      name: "Restaurant gastronomique",
      category: "Restauration",
      icon: "utensils",
      description: "Restaurant étoilé Michelin sur place",
    },
    {
      id: "4",
      name: "Spa & Wellness",
      category: "Bien-être",
      icon: "waves",
      description: "Spa de 800m² avec piscine intérieure",
    },
    {
      id: "5",
      name: "Salle de fitness",
      category: "Sport",
      icon: "dumbbell",
      description: "Équipements modernes 24h/24",
    },
    {
      id: "6",
      name: "Service de conciergerie",
      category: "Service",
      icon: "users",
      description: "Assistance personnalisée pour vos demandes",
    },
    {
      id: "7",
      name: "Bar lounge",
      category: "Restauration",
      icon: "coffee",
      description: "Bar avec terrasse panoramique",
    },
    {
      id: "8",
      name: "Sécurité 24h/24",
      category: "Sécurité",
      icon: "shield",
      description: "Surveillance et contrôle d'accès permanent",
    },
  ],
  roomAmenities: [
    {
      id: "1",
      name: "Climatisation",
      category: "Confort",
      icon: "wind",
      description: "Système de climatisation individuel",
    },
    {
      id: "2",
      name: "TV écran plat",
      category: "Divertissement",
      icon: "tv",
      description: 'Smart TV 55" avec chaînes internationales',
    },
    {
      id: "3",
      name: "Minibar",
      category: "Restauration",
      icon: "coffee",
      description: "Minibar garni quotidiennement",
    },
    {
      id: "4",
      name: "Coffre-fort",
      category: "Sécurité",
      icon: "shield",
      description: "Coffre-fort numérique pour objets de valeur",
    },
  ],
};

const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    wifi: <Wifi className="w-5 h-5" />,
    car: <Car className="w-5 h-5" />,
    utensils: <Utensils className="w-5 h-5" />,
    waves: <Waves className="w-5 h-5" />,
    dumbbell: <Dumbbell className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
    shield: <Shield className="w-5 h-5" />,
    wind: <Wind className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />,
  };
  return iconMap[iconName] || <div className="w-5 h-5 bg-gray-300 rounded" />;
};

const AmenityCard = ({
  amenity,
  type,
}: {
  amenity: any;
  type: "hotel" | "room";
}) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div
        className={`p-2 rounded-lg ${
          type === "hotel"
            ? "bg-blue-100 text-blue-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {getIcon(amenity.icon)}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{amenity.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{amenity.description}</p>
        <Badge variant="outline" className="text-xs">
          {amenity.category}
        </Badge>
      </div>
    </div>
  );
};

export default function RoomAmenities({ hotelId }: AmenitiesProps) {
  const [showAllHotel, setShowAllHotel] = useState(false);
  const [showAllRoom, setShowAllRoom] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Grouper par catégorie
  const hotelCategories = [
    ...new Set(mockAmenities.hotelAmenities.map((a) => a.category)),
  ];
  const roomCategories = [
    ...new Set(mockAmenities.roomAmenities.map((a) => a.category)),
  ];

  const filteredHotelAmenities = selectedCategory
    ? mockAmenities.hotelAmenities.filter(
        (a) => a.category === selectedCategory
      )
    : mockAmenities.hotelAmenities;

  const displayedHotelAmenities = showAllHotel
    ? filteredHotelAmenities
    : filteredHotelAmenities.slice(0, 6);

  const displayedRoomAmenities = showAllRoom
    ? mockAmenities.roomAmenities
    : mockAmenities.roomAmenities.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Services & Équipements
        </h2>
        <p className="text-gray-600">
          Découvrez tous les services et équipements disponibles dans cet
          établissement
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Tous
        </Button>
        {hotelCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Équipements de l'hôtel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Équipements de l'hôtel
            <Badge variant="secondary">
              {mockAmenities.hotelAmenities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {displayedHotelAmenities.map((amenity) => (
              <AmenityCard key={amenity.id} amenity={amenity} type="hotel" />
            ))}
          </div>

          {mockAmenities.hotelAmenities.length > 6 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllHotel(!showAllHotel)}
                className="flex items-center gap-2"
              >
                {showAllHotel ? (
                  <>
                    Voir moins <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Voir tous les équipements (
                    {mockAmenities.hotelAmenities.length - 6} autres)
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Équipements des chambres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            Équipements des chambres
            <Badge variant="secondary">
              {mockAmenities.roomAmenities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {displayedRoomAmenities.map((amenity) => (
              <AmenityCard key={amenity.id} amenity={amenity} type="room" />
            ))}
          </div>

          {mockAmenities.roomAmenities.length > 4 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllRoom(!showAllRoom)}
                className="flex items-center gap-2"
              >
                {showAllRoom ? (
                  <>
                    Voir moins <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Voir tous les équipements chambre{" "}
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Informations importantes
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tous les équipements sont inclus dans le tarif</li>
                <li>• L'accès au spa peut nécessiter une réservation</li>
                <li>
                  • Le restaurant gastronomique sur réservation uniquement
                </li>
                <li>• Le parking est gratuit pour les clients de l'hôtel</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
