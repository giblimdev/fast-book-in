// @/components/hotel/Room.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Users,
  Square,
  Wifi,
  Coffee,
  Tv,
  CheckCircle,
} from "lucide-react";

interface RoomProps {
  hotelId?: string;
}

// Données simulées basées sur le nouveau modèle HotelRoom
const mockRooms = [
  {
    id: "room1",
    name: "Chambre Standard",
    description: "Chambre confortable avec vue sur la ville",
    maxGuests: 2,
    bedCount: 1,
    bedType: "Lit double",
    roomSize: 25,
    pricePerNight: 120,
    currency: "EUR",
    isAvailable: true,
    images: ["/images/room1.jpg"],
    amenities: [
      { name: "WiFi gratuit", icon: "wifi" },
      { name: "TV écran plat", icon: "tv" },
      { name: "Climatisation", icon: "snowflake" },
    ],
  },
  {
    id: "room2",
    name: "Suite Junior",
    description: "Suite spacieuse avec salon séparé et vue panoramique",
    maxGuests: 4,
    bedCount: 1,
    bedType: "Lit king-size",
    roomSize: 45,
    pricePerNight: 220,
    currency: "EUR",
    isAvailable: true,
    images: ["/images/suite.jpg"],
    amenities: [
      { name: "WiFi gratuit", icon: "wifi" },
      { name: "TV écran plat", icon: "tv" },
      { name: "Minibar", icon: "coffee" },
      { name: "Balcon", icon: "door" },
    ],
  },
  {
    id: "room3",
    name: "Suite Présidentielle",
    description: "Notre suite la plus luxueuse avec terrasse privée",
    maxGuests: 6,
    bedCount: 2,
    bedType: "2 lits king-size",
    roomSize: 80,
    pricePerNight: 450,
    currency: "EUR",
    isAvailable: false,
    images: ["/images/presidential.jpg"],
    amenities: [
      { name: "WiFi gratuit", icon: "wifi" },
      { name: "TV écran plat", icon: "tv" },
      { name: "Minibar", icon: "coffee" },
      { name: "Terrasse privée", icon: "tree" },
      { name: "Service en chambre 24h/24", icon: "bell" },
    ],
  },
];

const RoomCard = ({ room }: { room: (typeof mockRooms)[0] }) => {
  const [selectedDates, setSelectedDates] = useState({
    checkin: "",
    checkout: "",
  });

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "tv":
        return <Tv className="w-4 h-4" />;
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card
      className={`overflow-hidden ${!room.isAvailable ? "opacity-75" : ""}`}
    >
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image */}
        <div className="relative">
          <div className="w-full h-48 md:h-full bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Image: {room.name}</span>
          </div>

          {!room.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive">Non disponible</Badge>
            </div>
          )}
        </div>

        {/* Détails */}
        <CardContent className="p-6 md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {room.name}
              </h3>
              <p className="text-gray-600 mb-3">{room.description}</p>

              {/* Caractéristiques */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.maxGuests} personnes max</span>
                </div>

                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{room.bedType}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{room.roomSize}m²</span>
                </div>
              </div>

              {/* Équipements */}
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                  >
                    {getAmenityIcon(amenity.icon)}
                    <span>{amenity.name}</span>
                  </div>
                ))}
                {room.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{room.amenities.length - 4} autres
                  </Badge>
                )}
              </div>
            </div>

            {/* Prix et réservation */}
            <div className="text-right ml-4">
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-600">
                  {room.pricePerNight}€
                </div>
                <div className="text-sm text-gray-500">par nuit</div>
              </div>

              <Button className="w-full" disabled={!room.isAvailable}>
                {room.isAvailable ? "Réserver" : "Indisponible"}
              </Button>

              <Button variant="outline" size="sm" className="w-full mt-2">
                Voir les détails
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default function Room({ hotelId }: RoomProps) {
  const [sortBy, setSortBy] = useState<"price" | "size" | "guests">("price");

  const sortedRooms = [...mockRooms].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.pricePerNight - b.pricePerNight;
      case "size":
        return (b.roomSize || 0) - (a.roomSize || 0);
      case "guests":
        return b.maxGuests - a.maxGuests;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* En-tête et filtres */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Choisir votre chambre
          </h2>
          <p className="text-gray-600 mt-1">
            {mockRooms.filter((r) => r.isAvailable).length} chambres disponibles
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === "price" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price")}
          >
            Prix
          </Button>
          <Button
            variant={sortBy === "size" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("size")}
          >
            Taille
          </Button>
          <Button
            variant={sortBy === "guests" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("guests")}
          >
            Capacité
          </Button>
        </div>
      </div>

      {/* Liste des chambres */}
      <div className="space-y-4">
        {sortedRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {/* Information complémentaire */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Réservation flexible
              </h4>
              <p className="text-sm text-gray-600">
                Annulation gratuite jusqu'à 24h avant l'arrivée. Pas de frais de
                modification pour changer vos dates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
