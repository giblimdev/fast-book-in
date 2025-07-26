// @/components/hotel/Room.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Star,
  Heart,
  Eye,
  Calendar,
  Shield,
} from "lucide-react";
import Image from "next/image";

// Types basés sur votre schéma Prisma
interface RoomAmenity {
  id: string;
  name: string;
  category: string;
  icon?: string;
  description?: string;
}

interface HotelRoom {
  id: string;
  name: string;
  description?: string;
  maxGuests: number;
  bedCount: number;
  bedType: string;
  roomSize?: number;
  pricePerNight: number;
  regularPrice?: number;
  currency: string;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  images?: Array<{
    id: string;
    imageUrl: string;
    imageType: string;
    alt?: string;
  }>;
  amenities: RoomAmenity[];
  features: string[];
  roomTypeId?: string;
  hotelId: string;
}

interface RoomProps {
  hotelId?: string;
  rooms?: HotelRoom[];
  onRoomSelect?: (roomId: string) => void;
  onRoomView?: (roomId: string) => void;
}

// Données mockées étendues
const mockRooms: HotelRoom[] = [
  {
    id: "room1",
    name: "Chambre Standard",
    description: "Chambre confortable avec vue sur la ville",
    maxGuests: 2,
    bedCount: 1,
    bedType: "Lit double",
    roomSize: 25,
    pricePerNight: 120,
    regularPrice: 150,
    currency: "EUR",
    isAvailable: true,
    rating: 4.2,
    reviewCount: 156,
    hotelId: "hotel-001",
    images: [
      {
        id: "img-1",
        imageUrl: "/images/room1.jpg",
        imageType: "room",
        alt: "Chambre Standard - Vue d'ensemble",
      },
    ],
    amenities: [
      { id: "1", name: "WiFi gratuit", category: "Connectivité", icon: "wifi" },
      {
        id: "2",
        name: "TV écran plat",
        category: "Divertissement",
        icon: "tv",
      },
      {
        id: "3",
        name: "Climatisation",
        category: "Confort",
        icon: "snowflake",
      },
    ],
    features: ["Petit déjeuner gratuit", "Parking sans voiturier gratuit"],
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
    regularPrice: 280,
    currency: "EUR",
    isAvailable: true,
    rating: 4.6,
    reviewCount: 89,
    hotelId: "hotel-001",
    images: [
      {
        id: "img-2",
        imageUrl: "/images/suite.jpg",
        imageType: "room",
        alt: "Suite Junior - Salon",
      },
    ],
    amenities: [
      { id: "1", name: "WiFi gratuit", category: "Connectivité", icon: "wifi" },
      {
        id: "2",
        name: "TV écran plat",
        category: "Divertissement",
        icon: "tv",
      },
      { id: "4", name: "Minibar", category: "Restauration", icon: "coffee" },
      { id: "5", name: "Balcon", category: "Vue", icon: "door" },
    ],
    features: ["Accès Internet haut débit", "À cumuler et utiliser"],
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
    regularPrice: 550,
    currency: "EUR",
    isAvailable: false,
    rating: 4.8,
    reviewCount: 34,
    hotelId: "hotel-001",
    images: [
      {
        id: "img-3",
        imageUrl: "/images/presidential.jpg",
        imageType: "room",
        alt: "Suite Présidentielle - Salon principal",
      },
    ],
    amenities: [
      { id: "1", name: "WiFi gratuit", category: "Connectivité", icon: "wifi" },
      {
        id: "2",
        name: "TV écran plat",
        category: "Divertissement",
        icon: "tv",
      },
      { id: "4", name: "Minibar", category: "Restauration", icon: "coffee" },
      { id: "6", name: "Terrasse privée", category: "Vue", icon: "tree" },
      {
        id: "7",
        name: "Service en chambre 24h/24",
        category: "Service",
        icon: "bell",
      },
    ],
    features: ["Entièrement remboursable", "Vue sur l'eau"],
  },
  {
    id: "room4",
    name: "Chambre Deluxe",
    description: "Chambre spacieuse avec vue jardin",
    maxGuests: 3,
    bedCount: 1,
    bedType: "Lit queen-size",
    roomSize: 35,
    pricePerNight: 180,
    regularPrice: 210,
    currency: "EUR",
    isAvailable: true,
    rating: 4.4,
    reviewCount: 78,
    hotelId: "hotel-001",
    images: [
      {
        id: "img-4",
        imageUrl: "/images/deluxe.jpg",
        imageType: "room",
        alt: "Chambre Deluxe - Vue jardin",
      },
    ],
    amenities: [
      { id: "1", name: "WiFi gratuit", category: "Connectivité", icon: "wifi" },
      {
        id: "2",
        name: "TV écran plat",
        category: "Divertissement",
        icon: "tv",
      },
      { id: "4", name: "Minibar", category: "Restauration", icon: "coffee" },
    ],
    features: ["Vue jardin", "Espace de travail"],
  },
  {
    id: "room5",
    name: "Suite Familiale",
    description: "Parfaite pour les familles avec chambres communicantes",
    maxGuests: 5,
    bedCount: 2,
    bedType: "1 lit double + 1 lit simple",
    roomSize: 55,
    pricePerNight: 280,
    regularPrice: 320,
    currency: "EUR",
    isAvailable: true,
    rating: 4.3,
    reviewCount: 112,
    hotelId: "hotel-001",
    images: [
      {
        id: "img-5",
        imageUrl: "/images/family.jpg",
        imageType: "room",
        alt: "Suite Familiale - Chambres communicantes",
      },
    ],
    amenities: [
      { id: "1", name: "WiFi gratuit", category: "Connectivité", icon: "wifi" },
      {
        id: "2",
        name: "TV écran plat",
        category: "Divertissement",
        icon: "tv",
      },
      {
        id: "8",
        name: "Kitchenette",
        category: "Restauration",
        icon: "coffee",
      },
    ],
    features: ["Idéal famille", "Chambres communicantes"],
  },
  {
    id: "room6",
    name: "Studio Business",
    description: "Studio moderne pour voyageurs d'affaires",
    maxGuests: 2,
    bedCount: 1,
    bedType: "Lit double",
    roomSize: 30,
    pricePerNight: 160,
    currency: "EUR",
    isAvailable: true,
    rating: 4.1,
    reviewCount: 89,
    hotelId: "hotel-001",
    images: [
      {
        id: "img-6",
        imageUrl: "/images/business.jpg",
        imageType: "room",
        alt: "Studio Business - Espace de travail",
      },
    ],
    amenities: [
      { id: "1", name: "WiFi gratuit", category: "Connectivité", icon: "wifi" },
      { id: "9", name: "Bureau ergonomique", category: "Travail", icon: "tv" },
    ],
    features: ["Espace bureau", "Accès rapide centre-ville"],
  },
];

const RoomCard = ({
  room,
  onRoomSelect,
  onRoomView,
}: {
  room: HotelRoom;
  onRoomSelect?: (roomId: string) => void;
  onRoomView?: (roomId: string) => void;
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const getAmenityIcon = (iconName?: string) => {
    switch (iconName) {
      case "wifi":
        return <Wifi className="w-3 h-3" />;
      case "tv":
        return <Tv className="w-3 h-3" />;
      case "coffee":
        return <Coffee className="w-3 h-3" />;
      case "snowflake":
        return <span className="text-blue-500">❄️</span>;
      case "door":
        return <span>🚪</span>;
      case "tree":
        return <span>🌳</span>;
      case "bell":
        return <span>🔔</span>;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const calculateDiscount = () => {
    if (room.regularPrice && room.pricePerNight < room.regularPrice) {
      return Math.round(
        ((room.regularPrice - room.pricePerNight) / room.regularPrice) * 100
      );
    }
    return 0;
  };

  const discount = calculateDiscount();

  const handleReserve = () => {
    if (onRoomSelect && room.isAvailable) {
      onRoomSelect(room.id);
    }
  };

  const handleViewDetails = () => {
    if (onRoomView) {
      onRoomView(room.id);
    }
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        !room.isAvailable ? "opacity-75" : ""
      }`}
    >
      {/* Image Section */}
      <div className="relative h-48">
        {room.images && room.images[0]?.imageUrl ? (
          <Image
            src={room.images[0].imageUrl}
            alt={room.images[0].alt || room.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center">
            <span className="text-white font-medium text-sm text-center px-2">
              {room.name}
            </span>
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white shadow-sm transition-all"
        >
          <Heart
            className={`w-4 h-4 ${
              isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 text-white font-medium text-xs">
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Availability Status */}
        {!room.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-4 py-2">
              Non disponible
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Rating */}
        {room.rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">{renderStars(room.rating)}</div>
            <span className="text-sm font-medium">{room.rating}</span>
            {room.reviewCount && (
              <span className="text-xs text-gray-500">
                ({room.reviewCount} avis)
              </span>
            )}
          </div>
        )}

        {/* Room Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {room.name}
        </h3>

        {/* Description */}
        {room.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Room Features */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{room.maxGuests} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            <span className="truncate">{room.bedType}</span>
          </div>
          {room.roomSize && (
            <div className="flex items-center gap-1">
              <Square className="w-3 h-3" />
              <span>{room.roomSize}m²</span>
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="space-y-1 mb-4">
          {room.features.slice(0, 2).map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs text-gray-600"
            >
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity) => (
            <div
              key={amenity.id}
              className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
              title={amenity.description}
            >
              {getAmenityIcon(amenity.icon)}
              <span className="truncate">{amenity.name}</span>
            </div>
          ))}
          {room.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{room.amenities.length - 3} autres
            </Badge>
          )}
        </div>

        {/* Price Section */}
        <div className="border-t pt-3">
          <div className="flex items-end justify-between mb-2">
            <div>
              {room.regularPrice && discount > 0 && (
                <div className="text-xs text-gray-500 line-through">
                  {room.currency === "EUR" ? "€" : "$"}
                  {room.regularPrice}
                </div>
              )}
              <div className="text-xl font-bold text-blue-600">
                {room.currency === "EUR" ? "€" : "$"}
                {room.pricePerNight}
              </div>
              <div className="text-xs text-gray-500">par nuit</div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleViewDetails}
              >
                <Eye className="w-3 h-3 mr-1" />
                Voir
              </Button>
              <Button
                size="sm"
                className="text-xs"
                disabled={!room.isAvailable}
                onClick={handleReserve}
              >
                {room.isAvailable ? "Réserver" : "Complet"}
              </Button>
            </div>
          </div>

          {room.isAvailable && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Shield className="w-3 h-3 text-green-500" />
              <span>Le montant ne vous sera pas encore facturé</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Room({
  hotelId,
  rooms,
  onRoomSelect,
  onRoomView,
}: RoomProps) {
  const [sortBy, setSortBy] = useState<"price" | "size" | "guests">("price");
  const [filterBy, setFilterBy] = useState<"all" | "available" | "unavailable">(
    "all"
  );

  // Utiliser les rooms passées en props ou les données mockées
  const roomsData = rooms || mockRooms;

  // Filtrage
  const filteredRooms = roomsData.filter((room) => {
    switch (filterBy) {
      case "available":
        return room.isAvailable;
      case "unavailable":
        return !room.isAvailable;
      default:
        return true;
    }
  });

  // Tri
  const sortedRooms = [...filteredRooms].sort((a, b) => {
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

  const availableRooms = roomsData.filter((r) => r.isAvailable).length;
  const totalRooms = roomsData.length;

  return (
    <div className="space-y-6">
      {/* Header et filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Choisir votre chambre
          </h2>
          <p className="text-gray-600 mt-1">
            {availableRooms} chambres disponibles sur {totalRooms}
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          {/* Filtre de disponibilité */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={filterBy === "all" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setFilterBy("all")}
            >
              Toutes
            </Button>
            <Button
              variant={filterBy === "available" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setFilterBy("available")}
            >
              Disponibles
            </Button>
            <Button
              variant={filterBy === "unavailable" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setFilterBy("unavailable")}
            >
              Indisponibles
            </Button>
          </div>

          {/* Filtres de tri */}
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={sortBy === "price" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setSortBy("price")}
            >
              Prix
            </Button>
            <Button
              variant={sortBy === "size" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setSortBy("size")}
            >
              Taille
            </Button>
            <Button
              variant={sortBy === "guests" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              Capacité
            </Button>
          </div>
        </div>
      </div>

      {/* Grille des chambres - 3 par ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRooms.length > 0 ? (
          sortedRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onRoomSelect={onRoomSelect}
              onRoomView={onRoomView}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              Aucune chambre ne correspond à vos critères.
            </p>
          </div>
        )}
      </div>

      {/* Information complémentaire */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  Réservation flexible
                </h4>
                <p className="text-xs text-gray-600">
                  Annulation gratuite jusqu'à 24h avant l'arrivée. Pas de frais
                  de modification pour changer vos dates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  Confirmation immédiate
                </h4>
                <p className="text-xs text-gray-600">
                  Recevez votre confirmation de réservation instantanément par
                  email avec tous les détails de votre séjour.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
