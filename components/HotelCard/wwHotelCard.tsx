// components/HotelCard/HotelCard.tsx
import React from "react";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Heart,
  Check,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Types based on your Prisma schema
interface Hotel {
  id: string;
  name: string;
  shortDescription?: string;
  starRating?: number;
  overallRating?: number;
  ratingAdjective?: string;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  isPartner: boolean;
  promoMessage?: string;
  imageMessage?: string;
  cancellationPolicy?: string;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    imageCategories: string;
    order: number;
    alt?: string;
    image: {
      id: string;
      path?: string;
    }[];
  }[];
  hotelGroup?: {
    id: string;
    name: string;
  };
  labels?: {
    id: string;
    name: string;
    color?: string;
  }[];
  highlights?: {
    id: string;
    title: string;
    description?: string;
    category: string;
  }[];
  amenities?: {
    id: string;
    name: string;
    category?: string;
    icon?: string;
  }[];
  destination?: {
    id: string;
    name: string;
  };
  hotelParking?: {
    id: string;
    name: string;
    isAvailable: boolean;
  };
}

type HotelCardProps = {
  hotel: {
    name: string;
    starRating: number;
    overallRating?: number | null;
    ratingAdjective?: string | null;
    reviewCount?: number;
    basePricePerNight: number;
    regularPrice?: number | null;
    currency: string;
    shortDescription?: string | null;
    isPartner?: boolean;
    promoMessage?: string | null;
    imageMessage?: string | null;
    cancellationPolicy?: string | null;
    city?: string;
    country?: string;
    mainImage?: string;
  };
};

export default function HotelCard({ hotel }: HotelCardProps) {
  const discountAmount = hotel.regularPrice
    ? hotel.regularPrice - hotel.basePricePerNight
    : 0;

  const discountPercentage = hotel.regularPrice
    ? Math.round(
        ((hotel.regularPrice - hotel.basePricePerNight) / hotel.regularPrice) *
          100
      )
    : 0;

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-3 h-3 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderAmenityIcon = (amenity: { name: string; icon?: string }) => {
    const amenityLower = amenity.name.toLowerCase();
    if (amenityLower.includes("wifi"))
      return <Wifi className="w-4 h-4 text-blue-600" />;
    if (amenityLower.includes("parking") || amenityLower.includes("car"))
      return <Car className="w-4 h-4 text-gray-600" />;
    if (amenityLower.includes("restaurant") || amenityLower.includes("food"))
      return <Utensils className="w-4 h-4 text-orange-600" />;
    if (amenityLower.includes("gym") || amenityLower.includes("fitness"))
      return <Dumbbell className="w-4 h-4 text-red-600" />;
    if (amenityLower.includes("pool") || amenityLower.includes("piscine"))
      return <Waves className="w-4 h-4 text-blue-500" />;
    if (amenityLower.includes("coffee") || amenityLower.includes("café"))
      return <Coffee className="w-4 h-4 text-amber-600" />;
    return <Check className="w-4 h-4 text-green-600" />;
  };

  // Get main image (first image with order 1, or first image)
  const mainImage =
    hotel.images?.find((img) => img.order === 1)?.image?.[0]?.path ||
    hotel.images?.[0]?.image?.[0]?.path ||
    "/placeholder-hotel.jpg";

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Mobile Image */}
      <div className="md:hidden relative h-48 w-full">
        <Image
          src={mainImage}
          alt={hotel.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        {hotel.imageMessage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {hotel.imageMessage}
          </div>
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Desktop Image */}
        <div className="hidden md:block md:w-1/3 relative">
          <div className="relative h-full min-h-[220px]">
            <Image
              src={mainImage}
              alt={hotel.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 0px, (max-width: 1200px) 33vw, 25vw"
            />
            {hotel.imageMessage && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                {hotel.imageMessage}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {hotel.hotelGroup?.name && (
              <Badge
                variant="outline"
                className="text-xs text-blue-700 border-blue-200 bg-blue-50"
              >
                {hotel.hotelGroup.name}
              </Badge>
            )}
            {hotel.labels?.map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                className={`text-xs ${
                  label.color === "green"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : label.color === "purple"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : label.color === "gold"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {label.name}
              </Badge>
            ))}
            {hotel.isPartner && (
              <Badge className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                Partenaire
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-2">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            {hotel.starRating && renderStars(hotel.starRating)}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span>{hotel.destination?.name || "Location"}</span>
            </div>
          </div>

          {hotel.shortDescription && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {hotel.shortDescription}
            </p>
          )}

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {hotel.amenities.slice(0, 5).map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full"
                >
                  {renderAmenityIcon(amenity)}
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          )}

          {hotel.highlights && hotel.highlights.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
              {hotel.highlights.slice(0, 3).map((h) => (
                <span key={h.id} className="flex items-center">
                  {h.title}
                  <ChevronRight className="w-3 h-3" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="p-4 md:p-5 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50 md:bg-white w-full md:w-56 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            {hotel.overallRating && (
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {hotel.overallRating.toFixed(1)}
                </span>
                <div className="text-xs">
                  <p className="font-medium text-gray-900">
                    {hotel.ratingAdjective || "Excellent"}
                  </p>
                  <p className="text-gray-500">
                    {hotel.reviewCount} avis vérifiés
                  </p>
                </div>
              </div>
            )}
          </div>

          {hotel.promoMessage && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
              <p className="text-xs text-yellow-800 font-medium">
                {hotel.promoMessage}
              </p>
            </div>
          )}

          <div className="mb-3">
            {hotel.regularPrice && (
              <div className="text-sm text-gray-500 line-through">
                {hotel.regularPrice.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: hotel.currency,
                  minimumFractionDigits: 0,
                })}
              </div>
            )}
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-bold text-gray-900">
                {hotel.basePricePerNight.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: hotel.currency,
                  minimumFractionDigits: 0,
                })}
              </span>
              <span className="text-xs text-gray-600">/nuit</span>
            </div>
            {discountPercentage > 0 && (
              <div className="text-xs text-green-600 text-right mt-1">
                Économisez {discountPercentage}%
              </div>
            )}
          </div>

          {hotel.cancellationPolicy && (
            <p className="text-xs text-green-600 mb-4 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {hotel.cancellationPolicy}
            </p>
          )}

          <div className="mt-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2">
              Voir disponibilité
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-300"
              >
                <Heart className="w-4 h-4 mr-1" />
                Favoris
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-300"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Carte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
