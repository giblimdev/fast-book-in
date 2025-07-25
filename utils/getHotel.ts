// utils/getHotel.ts
import { hotelExample } from "@/lib/data/dataCardHotel";

export interface Hotel {
  // Propriétés principales du schéma Prisma HotelCard
  id: string;
  name: string;
  idCity: string;
  order: number;
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
  cancellationPolicy?: string;
  latitude?: number;
  longitude?: number;

  // IDs de relations
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  detailsId?: string;

  // Relations peuplées
  accommodationType?: {
    id: string;
    name: string;
    code: string;
    description?: string;
    category: string;
  };

  destination?: {
    id: string;
    name: string;
    description?: string;
    type: string;
    popularityScore: number;
    cityId: string;
    latitude?: number;
    longitude?: number;
  };

  hotelGroup?: {
    id: string;
    name: string;
    description?: string;
    website?: string;
    logoUrl?: string;
  };

  // Collections via relations many-to-many
  images: Array<{
    id: string;
    entityId: string;
    imageUrl: string;
    imageType: string;
    order: number;
    alt?: string;
  }>;

  amenities: Array<{
    id: string;
    name: string;
    category?: string;
    icon?: string;
    description?: string;
  }>;

  highlights: Array<{
    id: string;
    title: string;
    description?: string;
    category: string;
    icon?: string;
    priority: number;
    isPromoted: boolean;
    hotelId: string;
  }>;

  labels: Array<{
    id: string;
    name: string;
    code: string;
    description?: string;
    category: string;
    icon?: string;
    color?: string;
    priority: number;
  }>;

  parking: Array<{
    id: string;
    isAvailable: boolean;
    spaces?: number;
    notes?: string;
  }>;

  accessibilityOptions: Array<{
    id: string;
    name: string;
    code: string;
    description?: string;
    category: string;
    icon?: string;
  }>;

  // Propriétés calculées pour compatibilité
  main_image_url?: string;
  neighborhood?: string;
  distance_centre?: string;
  hotel_highlights?: string;
  Hotel_amenity?: string;
  // Propriétés legacy (à supprimer progressivement)
  slug?: string;
  partener?: boolean; // Alias pour isPartner
  Label?: string; // Calculé depuis labels
  hotel_group?: string; // Calculé depuis hotelGroup.name
}

// Fonctions utilitaires mises à jour
export const getAllHotels = (): Hotel[] => {
  return hotelExample;
};

export const getHotelById = (id: string): Hotel | undefined => {
  return hotelExample.find((hotel) => hotel.id === id);
};

export const getPartnerHotels = (): Hotel[] => {
  return hotelExample.filter((hotel) => hotel.isPartner === true);
};

export const getHotelsByLabel = (labelName: string): Hotel[] => {
  return hotelExample.filter(
    (hotel) =>
      hotel.labels?.some((label) =>
        label.name.toLowerCase().includes(labelName.toLowerCase())
      ) || false
  );
};

export const getHotelsByDestination = (destinationName: string): Hotel[] => {
  return hotelExample.filter(
    (hotel) =>
      hotel.destination?.name
        .toLowerCase()
        .includes(destinationName.toLowerCase()) ||
      hotel.neighborhood
        ?.toLowerCase()
        .includes(destinationName.toLowerCase()) ||
      false
  );
};

export const getHotelsByGroup = (groupName: string): Hotel[] => {
  return hotelExample.filter(
    (hotel) =>
      hotel.hotelGroup?.name.toLowerCase().includes(groupName.toLowerCase()) ||
      false
  );
};

export const sortHotelsByRatingDesc = (hotels: Hotel[]): Hotel[] => {
  return [...hotels].sort(
    (a, b) => (b.overallRating || 0) - (a.overallRating || 0)
  );
};

export const sortHotelsByPriceAsc = (hotels: Hotel[]): Hotel[] => {
  return [...hotels].sort((a, b) => a.basePricePerNight - b.basePricePerNight);
};

export const getHotelsWithPromotion = (): Hotel[] => {
  return hotelExample.filter(
    (hotel) => hotel.promoMessage && hotel.promoMessage.trim().length > 0
  );
};

export const calculateDiscountPercentage = (hotel: Hotel): number => {
  const regularPrice = hotel.regularPrice;
  const currentPrice = hotel.basePricePerNight;

  if (regularPrice && currentPrice && regularPrice > currentPrice) {
    return Math.round(((regularPrice - currentPrice) / regularPrice) * 100);
  }
  return 0;
};

export const getMainImageUrl = (hotel: Hotel): string => {
  return (
    hotel.images?.find((img) => img.order === 1)?.imageUrl ||
    hotel.images?.[0]?.imageUrl ||
    hotel.main_image_url ||
    ""
  );
};

export const getHighlightsString = (hotel: Hotel): string => {
  return (
    hotel.highlights?.map((h) => h.title).join(" • ") ||
    hotel.hotel_highlights ||
    ""
  );
};

export const getAmenitiesString = (hotel: Hotel): string => {
  return (
    hotel.amenities?.map((a) => a.name).join(", ") || hotel.Hotel_amenity || ""
  );
};
