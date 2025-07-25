// components/HotelCard/HotelCard.tsx
import React from "react";
import { Hotel } from "@/utils/getHotel";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface HotelCardProps {
  hotel: Hotel;
}

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
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
      return <Coffee className="w-4 h-4 text-brown-600" />;
    return <Check className="w-4 h-4 text-green-600" />;
  };

  // Image principale selon le schéma
  const mainImage =
    hotel.images?.find((img) => img.order === 1)?.imageUrl ||
    hotel.images?.[0]?.imageUrl ||
    hotel.main_image_url ||
    "";

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Section Image */}
      <section className="hidden md:block md:w-1/3 relative">
        <div className="relative h-full min-h-[200px]">
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
          <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
          </button>
        </div>
      </section>

      {/* Section Informations principales */}
      <section className="flex-1 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {hotel.hotelGroup?.name && (
            <Badge
              variant="outline"
              className="text-xs text-blue-700 border-blue-200"
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
                  ? "bg-green-100 text-green-800"
                  : label.color === "purple"
                  ? "bg-purple-100 text-purple-800"
                  : label.color === "gold"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {label.name}
            </Badge>
          ))}
          {hotel.isPartner && (
            <Badge className="text-xs bg-purple-100 text-purple-800">
              Partenaire
            </Badge>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {hotel.name}
        </h3>

        <div className="mb-2">{renderStars(hotel.starRating)}</div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">
              {hotel.destination?.name || hotel.neighborhood}
            </span>
          </div>
          {hotel.distance_centre && (
            <span className="text-gray-500">{hotel.distance_centre}</span>
          )}
        </div>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center gap-1 text-xs text-gray-600"
              >
                {renderAmenityIcon(amenity)}
                <span className="hidden sm:inline">{amenity.name}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
          {hotel.shortDescription}
        </p>

        {hotel.highlights && hotel.highlights.length > 0 && (
          <p className="text-xs text-blue-600 font-medium line-clamp-1">
            {hotel.highlights.map((h) => h.title).join(" • ")}
          </p>
        )}
      </section>

      {/* Section Prix et réservation */}
      <section className="w-full md:w-80 p-4 md:p-6 bg-gray-50 md:bg-white border-t md:border-t-0 md:border-l border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                {hotel.overallRating?.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {hotel.ratingAdjective}
              </span>
              <p className="text-xs text-gray-600">
                {hotel.reviewCount} avis vérifiés
              </p>
            </div>
          </div>
        </div>

        {hotel.promoMessage && (
          <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mb-3">
            <p className="text-xs text-yellow-800 font-medium">
              {hotel.promoMessage}
            </p>
          </div>
        )}

        <div className="text-right mb-3">
          {hotel.regularPrice && (
            <div className="text-sm text-gray-500 line-through">
              {hotel.regularPrice}{" "}
              {hotel.currency === "EUR" ? "€" : hotel.currency}
            </div>
          )}
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-bold text-gray-900">
              {hotel.basePricePerNight}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {hotel.currency === "EUR" ? "€" : hotel.currency}
            </span>
            <span className="text-xs text-gray-600">par nuit</span>
          </div>
        </div>

        {hotel.cancellationPolicy && (
          <p className="text-xs text-green-600 mb-3 flex items-center gap-1">
            <Check className="w-3 h-3" />
            {hotel.cancellationPolicy}
          </p>
        )}

        <div className="w-full">
          <div className="flex flex-col gap-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Vérifier la disponibilité
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="w-4 h-4 mr-1" />
                Sauver
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MapPin className="w-4 h-4 mr-1" />
                Carte
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            Taxes et frais inclus dans le prix affiché
          </p>
        </div>
      </section>
    </div>
  );
}
