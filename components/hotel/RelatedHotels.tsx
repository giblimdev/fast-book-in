// @/components/hotel/RelatedHotels.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Heart,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface RelatedHotelsProps {
  currentHotelId: string;
  destination?: string;
  accommodationType?: string;
  maxPrice?: number;
  limit?: number;
}

// Types basés sur votre schéma Prisma
interface RelatedHotel {
  id: string;
  name: string;
  shortDescription?: string;
  starRating: number;
  overallRating?: number;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  promoMessage?: string;
  imageMessage?: string;
  isPartner: boolean;
  latitude?: number;
  longitude?: number;
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
  images: {
    imageUrl: string;
    alt?: string;
    imageType: string;
  }[];
  HotelCardToHotelAmenity: {
    hotelAmenity: {
      name: string;
      icon?: string;
      category: string;
    };
  }[];
}

// Données simulées basées sur votre schéma
const mockRelatedHotels: RelatedHotel[] = [
  {
    id: "hotel-2",
    name: "Villa des Oliviers",
    shortDescription: "Villa méditerranéenne avec piscine privée",
    starRating: 4,
    overallRating: 4.6,
    reviewCount: 234,
    basePricePerNight: 145,
    regularPrice: 180,
    currency: "EUR",
    promoMessage: "Offre été -20%",
    isPartner: true,
    accommodationType: {
      name: "Villa",
      category: "Premium",
    },
    destination: {
      name: "Côte d'Azur",
      type: "Zone balnéaire",
    },
    images: [
      {
        imageUrl: "/images/villa-oliviers.jpg",
        alt: "Villa des Oliviers",
        imageType: "hotel",
      },
    ],
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Piscine privée",
          icon: "waves",
          category: "Loisirs",
        },
      },
      {
        hotelAmenity: {
          name: "WiFi gratuit",
          icon: "wifi",
          category: "Connectivité",
        },
      },
      {
        hotelAmenity: {
          name: "Parking",
          icon: "car",
          category: "Transport",
        },
      },
    ],
  },
  {
    id: "hotel-3",
    name: "Château de Fontaine",
    shortDescription: "Château historique dans un écrin de verdure",
    starRating: 5,
    overallRating: 4.9,
    reviewCount: 156,
    basePricePerNight: 280,
    currency: "EUR",
    isPartner: false,
    imageMessage: "Vue sur le parc",
    accommodationType: {
      name: "Château",
      category: "Luxe",
    },
    destination: {
      name: "Vallée de la Loire",
      type: "Patrimoine historique",
    },
    images: [
      {
        imageUrl: "/images/chateau-fontaine.jpg",
        alt: "Château de Fontaine",
        imageType: "hotel",
      },
    ],
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Restaurant gastronomique",
          icon: "utensils",
          category: "Restauration",
        },
      },
      {
        hotelAmenity: {
          name: "Spa",
          icon: "waves",
          category: "Bien-être",
        },
      },
      {
        hotelAmenity: {
          name: "Service de conciergerie",
          icon: "users",
          category: "Service",
        },
      },
    ],
  },
  {
    id: "hotel-4",
    name: "Auberge du Mont Blanc",
    shortDescription: "Auberge alpine authentique avec vue panoramique",
    starRating: 4,
    overallRating: 4.7,
    reviewCount: 89,
    basePricePerNight: 165,
    regularPrice: 200,
    currency: "EUR",
    promoMessage: "Séjour montagne -15%",
    isPartner: true,
    accommodationType: {
      name: "Auberge",
      category: "Traditionnel",
    },
    destination: {
      name: "Chamonix",
      type: "Station de ski",
    },
    images: [
      {
        imageUrl: "/images/auberge-montblanc.jpg",
        alt: "Auberge du Mont Blanc",
        imageType: "hotel",
      },
    ],
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Sauna",
          icon: "flame",
          category: "Bien-être",
        },
      },
      {
        hotelAmenity: {
          name: "Bar lounge",
          icon: "coffee",
          category: "Restauration",
        },
      },
      {
        hotelAmenity: {
          name: "Local à skis",
          icon: "activity",
          category: "Sport",
        },
      },
    ],
  },
  {
    id: "hotel-5",
    name: "Hôtel des Arts",
    shortDescription: "Boutique hôtel design au cœur de la ville",
    starRating: 4,
    overallRating: 4.5,
    reviewCount: 312,
    basePricePerNight: 125,
    currency: "EUR",
    isPartner: false,
    accommodationType: {
      name: "Boutique Hôtel",
      category: "Design",
    },
    destination: {
      name: "Centre historique",
      type: "Zone culturelle",
    },
    images: [
      {
        imageUrl: "/images/hotel-arts.jpg",
        alt: "Hôtel des Arts",
        imageType: "hotel",
      },
    ],
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Galerie d'art",
          icon: "palette",
          category: "Culture",
        },
      },
      {
        hotelAmenity: {
          name: "Rooftop bar",
          icon: "coffee",
          category: "Restauration",
        },
      },
      {
        hotelAmenity: {
          name: "Salle de fitness",
          icon: "dumbbell",
          category: "Sport",
        },
      },
    ],
  },
  {
    id: "hotel-6",
    name: "Resort Plage Dorée",
    shortDescription: "Resort familial en bord de mer",
    starRating: 4,
    overallRating: 4.4,
    reviewCount: 567,
    basePricePerNight: 190,
    regularPrice: 250,
    currency: "EUR",
    promoMessage: "Tout inclus -25%",
    isPartner: true,
    accommodationType: {
      name: "Resort",
      category: "Familial",
    },
    destination: {
      name: "Riviera française",
      type: "Bord de mer",
    },
    images: [
      {
        imageUrl: "/images/resort-plage.jpg",
        alt: "Resort Plage Dorée",
        imageType: "hotel",
      },
    ],
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Accès plage privée",
          icon: "waves",
          category: "Loisirs",
        },
      },
      {
        hotelAmenity: {
          name: "Club enfants",
          icon: "baby",
          category: "Famille",
        },
      },
      {
        hotelAmenity: {
          name: "Piscine",
          icon: "waves",
          category: "Loisirs",
        },
      },
    ],
  },
];

const getAmenityIcon = (iconName?: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    wifi: <Wifi className="w-3 h-3" />,
    car: <Car className="w-3 h-3" />,
    coffee: <Coffee className="w-3 h-3" />,
    waves: <div className="w-3 h-3 bg-blue-500 rounded-full" />,
    users: <Users className="w-3 h-3" />,
    utensils: <div className="w-3 h-3 bg-orange-500 rounded-full" />,
    flame: <div className="w-3 h-3 bg-red-500 rounded-full" />,
    activity: <div className="w-3 h-3 bg-green-500 rounded-full" />,
  };
  return (
    iconMap[iconName || ""] || (
      <div className="w-3 h-3 bg-gray-400 rounded-full" />
    )
  );
};

const HotelVignette = ({ hotel }: { hotel: RelatedHotel }) => {
  const [isLiked, setIsLiked] = useState(false);

  const discountPercentage = hotel.regularPrice
    ? Math.round(
        ((hotel.regularPrice - hotel.basePricePerNight) / hotel.regularPrice) *
          100
      )
    : 0;

  const distance = Math.random() * 15 + 0.5; // Distance simulée

  return (
    <Link href={`/demo/foundeHotels/${hotel.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white border border-gray-200 hover:border-blue-300">
        {/* Image avec overlays */}
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center">
            <span className="text-white text-sm font-medium opacity-75">
              {hotel.name}
            </span>
          </div>

          {/* Badge promotion */}
          {hotel.promoMessage && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              {hotel.promoMessage}
            </div>
          )}

          {/* Badge partenaire */}
          {hotel.isPartner && (
            <div className="absolute top-3 right-3 bg-gold-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              ⭐ Partenaire
            </div>
          )}

          {/* Badge discount */}
          {discountPercentage > 0 && (
            <div className="absolute top-12 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              -{discountPercentage}%
            </div>
          )}

          {/* Message image */}
          {hotel.imageMessage && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
              {hotel.imageMessage}
            </div>
          )}

          {/* Bouton favoris */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute bottom-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-all shadow-md"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4">
          {/* En-tête avec étoiles */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {[...Array(hotel.starRating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <Badge variant="outline" className="text-xs">
              {hotel.accommodationType?.name}
            </Badge>
          </div>

          {/* Nom et destination */}
          <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {hotel.name}
          </h3>

          {hotel.destination && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{hotel.destination.name}</span>
              <span className="mx-2">•</span>
              <span className="text-xs">{distance.toFixed(1)} km</span>
            </div>
          )}

          {/* Description */}
          {hotel.shortDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {hotel.shortDescription}
            </p>
          )}

          {/* Équipements */}
          <div className="flex items-center gap-1 mb-3 overflow-hidden">
            {hotel.HotelCardToHotelAmenity.slice(0, 3).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {getAmenityIcon(amenity.hotelAmenity.icon)}
                <span className="ml-1 truncate">
                  {amenity.hotelAmenity.name}
                </span>
              </div>
            ))}
            {hotel.HotelCardToHotelAmenity.length > 3 && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                +{hotel.HotelCardToHotelAmenity.length - 3}
              </div>
            )}
          </div>

          {/* Note et avis */}
          <div className="flex items-center justify-between mb-3">
            {hotel.overallRating && (
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  {hotel.overallRating}
                </div>
                <span className="text-sm text-gray-600">
                  ({hotel.reviewCount})
                </span>
              </div>
            )}

            {hotel.hotelGroup && (
              <Badge variant="secondary" className="text-xs">
                {hotel.hotelGroup.name}
              </Badge>
            )}
          </div>

          {/* Prix et action */}
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-1">
              {hotel.regularPrice && (
                <span className="text-gray-400 line-through text-sm">
                  {hotel.regularPrice}€
                </span>
              )}
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-blue-600">
                  {hotel.basePricePerNight}
                </span>
                <span className="text-gray-600 text-sm ml-1">€/nuit</span>
              </div>
            </div>

            <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
              <span className="text-sm font-medium mr-1">Voir</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function RelatedHotels({
  currentHotelId,
  destination,
  accommodationType,
  maxPrice,
  limit = 6,
}: RelatedHotelsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filtrer les hôtels (exclure l'hôtel actuel)
  const filteredHotels = mockRelatedHotels
    .filter((hotel) => hotel.id !== currentHotelId)
    .filter((hotel) => !maxPrice || hotel.basePricePerNight <= maxPrice)
    .slice(0, limit);

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(filteredHotels.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (filteredHotels.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hôtels que vous pourriez aimer
          </h2>
          <p className="text-gray-600">
            Découvrez d'autres hébergements similaires dans la région
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={totalSlides <= 1}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={totalSlides <= 1}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel des hôtels */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${totalSlides * 100}%`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full flex-shrink-0"
              style={{ width: `${100 / totalSlides}%` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                {filteredHotels
                  .slice(
                    slideIndex * itemsPerSlide,
                    (slideIndex + 1) * itemsPerSlide
                  )
                  .map((hotel) => (
                    <HotelVignette key={hotel.id} hotel={hotel} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicateurs de slide */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Voir tous les hôtels */}
      <div className="text-center pt-4 border-t border-gray-200">
        <Link href="/demo/hotels">
          <Button variant="outline" className="flex items-center gap-2">
            Voir tous les hébergements
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
