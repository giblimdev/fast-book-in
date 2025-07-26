import React from "react";
import { Star, MapPin, Wifi, Car, Coffee } from "lucide-react";

// Types basés sur votre schéma Prisma
interface PromoHotel {
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
  destination?: {
    name: string;
  };
  images: {
    imageUrl: string;
    alt?: string;
  }[];
  accommodationType?: {
    name: string;
  };
  HotelCardToHotelAmenity: {
    hotelAmenity: {
      name: string;
      icon?: string;
    };
  }[];
}

// Données simulées basées sur votre schéma
const promoHotels: PromoHotel[] = [
  {
    id: "1",
    name: "Grand Hôtel de Paris",
    shortDescription: "Hôtel de luxe au cœur de la capitale",
    starRating: 5,
    overallRating: 4.8,
    reviewCount: 234,
    basePricePerNight: 120,
    regularPrice: 180,
    currency: "EUR",
    promoMessage: "Offre spéciale -33%",
    imageMessage: "Vue sur la Tour Eiffel",
    destination: {
      name: "Centre de Paris",
    },
    images: [
      {
        imageUrl: "/images/hotel-paris.jpg",
        alt: "Grand Hôtel de Paris",
      },
    ],
    accommodationType: {
      name: "Hôtel",
    },
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "WiFi gratuit",
          icon: "wifi",
        },
      },
      {
        hotelAmenity: {
          name: "Parking",
          icon: "car",
        },
      },
      {
        hotelAmenity: {
          name: "Restaurant",
          icon: "coffee",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Villa Méditerranée",
    shortDescription: "Villa avec piscine privée",
    starRating: 4,
    overallRating: 4.6,
    reviewCount: 156,
    basePricePerNight: 85,
    regularPrice: 130,
    currency: "EUR",
    promoMessage: "Réservation anticipée -35%",
    destination: {
      name: "Côte d'Azur",
    },
    images: [
      {
        imageUrl: "/images/villa-med.jpg",
        alt: "Villa Méditerranée",
      },
    ],
    accommodationType: {
      name: "Villa",
    },
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Piscine",
          icon: "waves",
        },
      },
      {
        hotelAmenity: {
          name: "WiFi gratuit",
          icon: "wifi",
        },
      },
    ],
  },
  {
    id: "3",
    name: "Chalet des Alpes",
    shortDescription: "Chalet authentique avec vue montagne",
    starRating: 4,
    overallRating: 4.7,
    reviewCount: 89,
    basePricePerNight: 95,
    regularPrice: 140,
    currency: "EUR",
    promoMessage: "Séjour ski -32%",
    destination: {
      name: "Chamonix",
    },
    images: [
      {
        imageUrl: "/images/chalet-alpes.jpg",
        alt: "Chalet des Alpes",
      },
    ],
    accommodationType: {
      name: "Chalet",
    },
    HotelCardToHotelAmenity: [
      {
        hotelAmenity: {
          name: "Sauna",
          icon: "flame",
        },
      },
      {
        hotelAmenity: {
          name: "Parking",
          icon: "car",
        },
      },
    ],
  },
];

const HotelPromoCard = ({ hotel }: { hotel: PromoHotel }) => {
  const discountPercentage = hotel.regularPrice
    ? Math.round(
        ((hotel.regularPrice - hotel.basePricePerNight) / hotel.regularPrice) *
          100
      )
    : 0;

  const getAmenityIcon = (iconName?: string) => {
    switch (iconName) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "car":
        return <Car className="w-4 h-4" />;
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image avec badge promo */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center">
          <span className="text-gray-600 text-sm">Image: {hotel.name}</span>
        </div>

        {/* Badge promotion */}
        {hotel.promoMessage && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {hotel.promoMessage}
          </div>
        )}

        {/* Badge discount */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Message image */}
        {hotel.imageMessage && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
            {hotel.imageMessage}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* En-tête avec étoiles */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {[...Array(hotel.starRating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {hotel.accommodationType?.name}
          </span>
        </div>

        {/* Nom et destination */}
        <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
        {hotel.destination && (
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {hotel.destination.name}
          </div>
        )}

        {/* Description */}
        {hotel.shortDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {hotel.shortDescription}
          </p>
        )}

        {/* Équipements */}
        <div className="flex items-center gap-2 mb-3">
          {hotel.HotelCardToHotelAmenity.slice(0, 3).map((amenity, index) => (
            <div
              key={index}
              className="flex items-center text-gray-500 text-xs"
            >
              {getAmenityIcon(amenity.hotelAmenity.icon)}
              <span className="ml-1">{amenity.hotelAmenity.name}</span>
            </div>
          ))}
        </div>

        {/* Note et avis */}
        <div className="flex items-center mb-3">
          {hotel.overallRating && (
            <>
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold mr-2">
                {hotel.overallRating}
              </div>
              <span className="text-sm text-gray-600">
                ({hotel.reviewCount} avis)
              </span>
            </>
          )}
        </div>

        {/* Prix */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {hotel.regularPrice && (
              <span className="text-gray-400 line-through text-sm mr-2">
                {hotel.regularPrice}
                {hotel.currency === "EUR" ? "€" : hotel.currency}
              </span>
            )}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                {hotel.basePricePerNight}
              </span>
              <span className="text-gray-600 text-sm ml-1">
                {hotel.currency === "EUR" ? "€" : hotel.currency}/nuit
              </span>
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Landingpromo() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Offres Spéciales & Promotions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profitez de nos meilleures offres sur une sélection d'hébergements
            exceptionnels
          </p>
        </div>

        {/* Grille des hébergements en promo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoHotels.map((hotel) => (
            <HotelPromoCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200">
            Voir toutes les promotions
          </button>
        </div>
      </div>
    </section>
  );
}
