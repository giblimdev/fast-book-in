// @/components/hotel/HotelAside.tsx
"use client";

import React, { useState } from "react";
import { Calendar, Users, Star, Shield, Wifi, Car } from "lucide-react";

// Types compatibles avec InfoHotel.tsx
type Hotel = {
  id: string;
  name: string;
  starRating: number;
  overallRating?: number;
  reviewCount: number;
  ratingAdjective?: string;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  isPartner: boolean;
  promoMessage?: string;
  cancellationPolicy?: string;
  // Ajout des propriétés manquantes
  accommodationType?: {
    name: string;
    category: string;
  };
  amenities?: Array<{
    name: string;
    icon?: string;
    category: string;
  }>;
  labels?: Array<{
    name: string;
    color: string;
    icon?: string;
    category: string;
  }>;
  // Autres propriétés optionnelles qui peuvent être utilisées
  imageMessage?: string;
  latitude?: number;
  longitude?: number;
};

type Pricing = {
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
};

type HotelAsideProps = {
  hotel: Hotel;
  pricing?: Pricing; // Rendre optionnel car les données sont déjà dans hotel
};

function HotelAside({ hotel, pricing }: HotelAsideProps) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Utiliser les données de pricing ou celles de hotel
  const priceData = pricing || {
    basePricePerNight: hotel.basePricePerNight,
    regularPrice: hotel.regularPrice,
    currency: hotel.currency,
  };

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

  const calculateDiscount = () => {
    if (
      priceData.regularPrice &&
      priceData.basePricePerNight < priceData.regularPrice
    ) {
      const discount = Math.round(
        ((priceData.regularPrice - priceData.basePricePerNight) /
          priceData.regularPrice) *
          100
      );
      return discount;
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-4">
      {/* Pricing Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {priceData.currency === "EUR" ? "€" : "$"}
            {priceData.basePricePerNight}
          </span>
          <span className="text-gray-500">/nuit</span>
          {hotel.isPartner && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Partenaire
            </span>
          )}
        </div>

        {priceData.regularPrice && discount > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500 line-through">
              {priceData.currency === "EUR" ? "€" : "$"}
              {priceData.regularPrice}
            </span>
            <span className="text-sm text-green-600 font-medium">
              -{discount}%
            </span>
          </div>
        )}

        {hotel.promoMessage && (
          <div className="text-sm text-green-600 font-medium mb-2">
            🎉 {hotel.promoMessage}
          </div>
        )}

        {/* Rating */}
        {hotel.overallRating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {renderStars(Math.floor(hotel.overallRating))}
            </div>
            <span className="text-sm font-medium">{hotel.overallRating}</span>
            <span className="text-sm text-gray-500">
              ({hotel.reviewCount} avis)
            </span>
            {hotel.ratingAdjective && (
              <span className="text-sm text-green-600 font-medium">
                {hotel.ratingAdjective}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrivée
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Départ
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voyageurs
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "personne" : "personnes"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chambres
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "chambre" : "chambres"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Réserver maintenant
        </button>
        <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Vérifier la disponibilité
        </button>
      </div>

      {/* Key Features */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Équipements principaux
          </h3>
          <div className="space-y-2">
            {hotel.amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {amenity.icon === "wifi" && <Wifi className="w-4 h-4" />}
                  {amenity.icon === "car" && <Car className="w-4 h-4" />}
                  {amenity.icon === "spa" && <span>🧘</span>}
                  {amenity.icon === "restaurant" && <span>🍽️</span>}
                  {amenity.icon === "ac" && <span>❄️</span>}
                  {amenity.icon === "concierge" && <span>🛎️</span>}
                </div>
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancellation Policy */}
      {hotel.cancellationPolicy && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>{hotel.cancellationPolicy}</span>
          </div>
        </div>
      )}

      {/* Labels */}
      {hotel.labels && hotel.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hotel.labels.map((label, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${label.color}-100 text-${label.color}-800`}
            >
              {label.icon && <span>{label.icon}</span>}
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelAside;
