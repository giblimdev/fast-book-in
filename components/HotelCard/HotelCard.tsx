// components/HotelCard/HotelCard.tsx
// Card hôtel premium, 3 sections, responsive, bouton Réserver centré, boutons secondaires Favoris/Carte parfaitement responsives

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star, MapPin, Check, Heart, Map } from "lucide-react";

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

export default function HotelCard({
  hotel,
}: {
  hotel: HotelCardProps["hotel"];
}) {
  return (
    <Card className="relative w-full rounded-xl shadow-xl overflow-hidden bg-white flex flex-col md:flex-row transition hover:shadow-2xl">
      {/* SECTION 1 : IMAGE GAUCHE */}
      <div
        className="relative w-full md:w-[42%] aspect-[4/3] md:aspect-auto min-h-[180px] md:min-h-[230px] bg-gray-100 flex-shrink-0"
        style={{
          borderTopLeftRadius: "1.25rem",
          borderBottomLeftRadius: "1.25rem",
          borderTopRightRadius: "0.75rem",
          borderBottomRightRadius: "0.75rem",
        }}
      >
        <img
          src={hotel.mainImage || "/placeholder-hotel.jpg"}
          alt={hotel.name}
          className="object-cover w-full h-full rounded-t-xl md:rounded-tl-xl md:rounded-bl-xl md:rounded-tr-none"
        />
        {hotel.isPartner && (
          <Badge className="absolute top-3 left-3 bg-indigo-700/90 text-white rounded-md px-3 py-1 shadow font-medium">
            Partenaire
          </Badge>
        )}
        {hotel.promoMessage && (
          <Badge className="absolute top-3 right-3 bg-amber-600 text-white rounded-md px-3 py-1 shadow font-medium">
            {hotel.promoMessage}
          </Badge>
        )}
        {hotel.imageMessage && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 text-xs rounded">
            {hotel.imageMessage}
          </div>
        )}
      </div>

      {/* SECTION 2 : INFOS CENTRALES */}
      <CardContent className="md:w-[38%] w-full flex flex-col py-6 px-5 gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {/* Note globale */}
            {hotel.overallRating != null && (
              <span className="bg-blue-700 text-white font-extrabold rounded-xl px-2 py-1 text-base text-center shadow min-w-[48px]">
                {hotel.overallRating.toFixed(1)}
              </span>
            )}
            {/* Titre + étoiles */}
            <span className="font-bold text-lg truncate text-gray-900">
              {hotel.name}
            </span>
            {/* Favoris cœur côté titre seulement sur desktop */}
            <span className="hidden md:inline ml-auto">
              <button
                aria-label="Ajouter aux favoris"
                className="hover:bg-red-50 rounded-full p-1 border border-gray-200 transition"
                title="Ajouter aux favoris"
                type="button"
              >
                <Heart className="w-5 h-5 text-rose-500" strokeWidth={2} />
              </button>
            </span>
          </div>
          {/* Étoiles */}
          <div className="flex gap-0.5 items-center mt-1">
            {[...Array(hotel.starRating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400 inline"
                aria-label="Étoile"
              />
            ))}
            {hotel.ratingAdjective && (
              <span className="text-xs text-gray-600 ml-2">
                {hotel.ratingAdjective}
              </span>
            )}
            {typeof hotel.reviewCount === "number" && (
              <span className="text-xs text-gray-400 ml-1">
                ({hotel.reviewCount} avis)
              </span>
            )}
          </div>
          {/* Localisation */}
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {[hotel.city, hotel.country].filter(Boolean).join(" • ")}
            </span>
            <span className="hidden md:inline">
              <button
                aria-label="Voir sur la carte"
                className="ml-2 hover:bg-sky-50 rounded-full p-1 border border-gray-200 transition"
                title="Voir sur la carte"
                type="button"
              >
                <Map className="w-5 h-5 text-sky-700" strokeWidth={2} />
              </button>
            </span>
          </div>
          {/* Description */}
          {hotel.shortDescription && (
            <div className="mt-4 mb-2 text-sm text-gray-700 line-clamp-2 italic">
              {hotel.shortDescription}
            </div>
          )}
        </div>
      </CardContent>

      {/* SECTION 3 : PRIX & ACTIONS */}
      <div className="md:w-[20%] w-full flex flex-col justify-between py-7 px-5 border-t md:border-t-0 md:border-l border-gray-100 items-center gap-2 bg-gradient-to-b md:bg-none from-gray-50 to-white">
        {/* Prix */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              {hotel.basePricePerNight}
              <span className="ml-1 text-sm font-normal">{hotel.currency}</span>
            </span>
            {hotel.regularPrice &&
              hotel.regularPrice > hotel.basePricePerNight && (
                <span className="line-through text-gray-400 text-base">
                  {hotel.regularPrice} {hotel.currency}
                </span>
              )}
          </div>
          <div className="text-xs text-gray-500">/nuit</div>
        </div>
        {/* Cancellation */}
        {hotel.cancellationPolicy && (
          <div className="flex items-center gap-1 text-green-700 text-xs md:text-sm font-medium mt-2 mb-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{hotel.cancellationPolicy}</span>
          </div>
        )}

        {/* Call-to-action: Réserver centré */}
        <div className="flex flex-col items-center w-full gap-2 mt-2">
          <Button
            size="lg"
            className="mx-auto w-full max-w-[220px] rounded-full font-bold bg-blue-700 hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 transition text-white text-lg shadow-lg uppercase tracking-wider py-3"
            aria-label="Réserver cet hôtel"
          >
            Réserver
          </Button>

          {/* Boutons secondaires sous le CTA, parfaitement responsives */}
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 flex items-center justify-center rounded-full border border-rose-200 bg-white hover:bg-rose-50 active:bg-rose-100 shadow-sm gap-2 text-rose-600 font-semibold text-base transition group focus-visible:ring-2 focus-visible:ring-rose-300 min-w-0"
              aria-label="Ajouter aux favoris"
              type="button"
            >
              <Heart
                className="w-5 h-5 group-hover:scale-110 group-active:scale-125 transition text-rose-500"
                strokeWidth={2}
              />
              <span className="hidden sm:inline">Favoris</span>
              <span className="sr-only">Ajouter aux favoris</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 flex items-center justify-center rounded-full border border-sky-200 bg-white hover:bg-sky-50 active:bg-sky-100 shadow-sm gap-2 text-sky-700 font-semibold text-base transition group focus-visible:ring-2 focus-visible:ring-sky-300 min-w-0"
              aria-label="Voir l’hôtel sur la carte"
              type="button"
            >
              <Map
                className="w-5 h-5 group-hover:scale-110 group-active:scale-125 transition text-sky-700"
                strokeWidth={2}
              />
              <span className="hidden sm:inline">Carte</span>
              <span className="sr-only">Voir l’hôtel sur la carte</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
