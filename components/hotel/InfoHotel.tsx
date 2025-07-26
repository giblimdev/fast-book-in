// @/components/hotel/InfoHotel.tsx
"use client";

import React, { useState } from "react";
import { Share2, Heart, Star, MapPin } from "lucide-react";
import GalleryPhotos from "./GalleryPhotos";
import HotelAside from "./HotelAside";

// Types basés sur votre schéma Prisma
type HotelCard = {
  id: string;
  name: string;
  shortDescription?: string;
  starRating: number;
  overallRating?: number;
  ratingAdjective?: string;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  isPartner: boolean;
  promoMessage?: string;
  imageMessage?: string;
  accommodationType?: {
    name: string;
    category: string;
  };
  destination?: {
    name: string;
    type: string;
  };
  details?: {
    address: {
      streetNumber?: string;
      streetName: string;
      postalCode: string;
      city: { name: string };
      neighborhood?: { name: string };
    };
  };
  images?: Array<{
    id: string;
    imageUrl: string;
    imageType: string;
    order: number;
    alt?: string;
  }>;
  labels?: Array<{
    name: string;
    color: string;
    icon?: string;
    category: string;
  }>;
};

type InfoHotelProps = {
  hotelId?: string;
  hotel?: HotelCard;
};

function InfoHotel({ hotelId, hotel: propHotel }: InfoHotelProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Données d'exemple simplifiées
  const [hotel] = useState<HotelCard>(
    propHotel || {
      id: "hotel-001",
      name: "Hotel Le Grand Paris",
      shortDescription: "Hôtel de luxe au cœur de Paris avec vue sur la Seine",
      starRating: 4,
      overallRating: 4.5,
      ratingAdjective: "Excellent",
      reviewCount: 342,
      basePricePerNight: 195,
      regularPrice: 250,
      currency: "EUR",
      isPartner: true,
      promoMessage: "Réservez maintenant et économisez 22%",
      imageMessage: "Vue panoramique sur Paris depuis les chambres supérieures",
      accommodationType: {
        name: "Hôtel",
        category: "Luxe",
      },
      destination: {
        name: "Centre de Paris",
        type: "Zone touristique",
      },
      details: {
        address: {
          streetNumber: "123",
          streetName: "Rue de Rivoli",
          postalCode: "75001",
          city: { name: "Paris" },
          neighborhood: { name: "Louvre - Châtelet" },
        },
      },
      images: [
        {
          id: "img-1",
          imageUrl: "/hotel-main.jpg",
          imageType: "main",
          order: 1,
          alt: "Hotel Le Grand Paris - Vue principale",
        },
      ],
      labels: [
        {
          name: "Éco-responsable",
          color: "green",
          icon: "🌱",
          category: "Environnement",
        },
        {
          name: "Petit-déjeuner inclus",
          color: "blue",
          icon: "🥐",
          category: "Restauration",
        },
      ],
    }
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: hotel.shortDescription || `Découvrez ${hotel.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Lien copié dans le presse-papiers !");
      } catch (error) {
        console.error("Erreur lors de la copie");
      }
    }
  };

  const calculateDiscount = () => {
    if (hotel.regularPrice && hotel.basePricePerNight < hotel.regularPrice) {
      return Math.round(
        ((hotel.regularPrice - hotel.basePricePerNight) / hotel.regularPrice) *
          100
      );
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header minimal avec informations essentielles */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Classification et badges */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {renderStars(hotel.starRating)}
                </div>
                {hotel.accommodationType && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {hotel.accommodationType.name}
                  </span>
                )}
                {hotel.isPartner && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                    Partenaire Privilégié
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-medium">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Nom de l'hôtel */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hotel.name}
              </h1>

              {/* Rating et localisation */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-2">
                  {hotel.overallRating && (
                    <>
                      <span className="font-medium text-gray-900">
                        {hotel.overallRating}
                      </span>
                      <span>({hotel.reviewCount} avis)</span>
                      {hotel.ratingAdjective && (
                        <span className="text-green-600 font-medium">
                          {hotel.ratingAdjective}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Adresse */}
              {hotel.details?.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {hotel.details.address.streetNumber}{" "}
                    {hotel.details.address.streetName},
                    {hotel.details.address.postalCode}{" "}
                    {hotel.details.address.city.name}
                    {hotel.details.address.neighborhood &&
                      ` - ${hotel.details.address.neighborhood.name}`}
                  </span>
                </div>
              )}

              {/* Message promotionnel */}
              {hotel.promoMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-green-800 font-medium text-sm">
                    🎉 {hotel.promoMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Partager</span>
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-1 px-4 py-2 border rounded-lg transition-colors ${
                  isSaved
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isSaved ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {isSaved ? "Sauvegardé" : "Sauvegarder"}
                </span>
              </button>
            </div>
          </div>

          {/* Labels uniquement */}
          {hotel.labels && hotel.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hotel.labels.map((label, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${label.color}-100 text-${label.color}-800`}
                >
                  {label.icon && <span>{label.icon}</span>}
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Galerie photos */}
          <div className="flex-1">
            <GalleryPhotos
              images={hotel.images}
              hotelName={hotel.name}
              imageMessage={hotel.imageMessage}
            />
          </div>

          {/* Sidebar de réservation */}
          <div className="w-80">
            <HotelAside hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoHotel;
