// store/useHotelSelectedStore.ts
import { create } from "zustand";

// Types basés sur votre schéma Prisma
export interface HotelCardWithDetails {
  id: string;
  name: string;
  idCity: string;
  order: number;
  shortDescription: string | null;
  starRating: number;
  overallRating: number | null;
  ratingAdjective: string | null;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice: number | null; 
  currency: string;
  isPartner: boolean;
  promoMessage: string | null;
  imageMessage: string | null;
  cancellationPolicy: string | null;
  accommodationTypeId: string | null;
  destinationId: string | null;
  hotelGroupId: string | null;
  latitude: number | null;
  longitude: number | null;
  detailsId: string | null;
  hotelParkingId: string | null;

  // Relations incluses
  accommodationType?: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    category: string;
  } | null;

  destination?: {
    id: string;
    name: string;
    description: string | null;
    type: string;
    popularityScore: number;
    cityId: string;
    latitude: number | null;
    longitude: number | null;
  } | null;

  hotelGroup?: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    logoUrl: string | null;
  } | null;

  images: Array<{
    id: string;
    entityId: string;
    imageUrl: string;
    imageType: string;
    order: number;
    alt: string | null;
  }>;

  HotelDetails?: Array<{
    id: string;
    idHotelCard: string;
    description: string | null;
    addressId: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    numberOfRooms: number | null;
    numberOfFloors: number | null;
    languages: string[];

    address: {
      id: string;
      streetNumber: string | null;
      streetName: string;
      addressLine2: string | null;
      postalCode: string;
      cityId: string;
      neighborhoodId: string | null;

      city: {
        id: string;
        name: string;
        countryId: string;

        country: {
          id: string;
          name: string;
          code: string;
          language: string | null;
          currency: string | null;
        };
      };

      neighborhood?: {
        id: string;
        name: string;
        cityId: string;
      } | null;
    };
  }>;

  HotelRoom: Array<{
    id: string;
    hotelCardId: string;
    name: string;
    description: string | null;
    maxGuests: number;
    bedCount: number;
    bedType: string;
    roomSize: number | null;
    pricePerNight: number;
    currency: string;
    isAvailable: boolean;

    images: Array<{
      id: string;
      entityId: string;
      imageUrl: string;
      imageType: string;
      order: number;
      alt: string | null;
    }>;
  }>;

  HotelCardToHotelAmenity: Array<{
    hotelAmenity: {
      id: string;
      name: string;
      category: string | null;
      icon: string | null;
      description: string | null;
    };
  }>;

  HotelCardToLabel: Array<{
    label: {
      id: string;
      name: string;
      code: string;
      description: string | null;
      category: string;
      icon: string | null;
      color: string | null;
      priority: number;
    };
  }>;

  HotelReview: Array<{
    id: string;
    hotelCardId: string;
    userId: string;
    rating: number | null;
    title: string | null;
    comment: string;
    pros: string[];
    cons: string[];
    roomType: string | null;
    stayDate: Date | null;
    isVerified: boolean;
    helpfulCount: number;
    parentId: string | null;
    createdAt: Date;

    user: {
      id: string;
      name: string;
      firstName: string | null;
      lastName: string | null;
      image: string | null;
    };
  }>;

  parking?: {
    id: string;
    isAvailable: boolean;
    spaces: number | null;
    notes: string | null;
  } | null;
}

interface HotelSelectedState {
  selectedHotel: HotelCardWithDetails | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedHotel: (hotel: HotelCardWithDetails) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelectedHotel: () => void;

  // Getters utilitaires
  getAverageRating: () => number | null;
  getMainImage: () => string | null;
  getRoomCount: () => number;
  getAmenities: () => Array<{
    id: string;
    name: string;
    icon: string | null;
    category: string | null;
  }>;
  getLabels: () => Array<{
    id: string;
    name: string;
    code: string;
    category: string;
    color: string | null;
  }>;
  getAddress: () => string | null;
  getRecentReviews: (limit?: number) => Array<any>;
}

export const useHotelSelectedStore = create<HotelSelectedState>((set, get) => ({
  selectedHotel: null,
  isLoading: false,
  error: null,

  setSelectedHotel: (hotel) =>
    set({
      selectedHotel: hotel,
      error: null,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearSelectedHotel: () =>
    set({
      selectedHotel: null,
      error: null,
      isLoading: false,
    }),

  // Getters utilitaires
  getAverageRating: () => {
    const { selectedHotel } = get();
    return selectedHotel?.overallRating || null;
  },

  getMainImage: () => {
    const { selectedHotel } = get();
    if (!selectedHotel?.images || selectedHotel.images.length === 0) {
      return null;
    }

    // Trouve la première image ou celle avec l'ordre le plus bas
    const sortedImages = selectedHotel.images.sort((a, b) => a.order - b.order);
    return sortedImages[0]?.imageUrl || null;
  },

  getRoomCount: () => {
    const { selectedHotel } = get();
    return selectedHotel?.HotelRoom?.length || 0;
  },

  getAmenities: () => {
    const { selectedHotel } = get();
    if (!selectedHotel?.HotelCardToHotelAmenity) return [];

    return selectedHotel.HotelCardToHotelAmenity.map((relation) => ({
      id: relation.hotelAmenity.id,
      name: relation.hotelAmenity.name,
      icon: relation.hotelAmenity.icon,
      category: relation.hotelAmenity.category,
    }));
  },

  getLabels: () => {
    const { selectedHotel } = get();
    if (!selectedHotel?.HotelCardToLabel) return [];

    return selectedHotel.HotelCardToLabel.map((relation) => ({
      id: relation.label.id,
      name: relation.label.name,
      code: relation.label.code,
      category: relation.label.category,
      color: relation.label.color,
    }));
  },

  getAddress: () => {
    const { selectedHotel } = get();
    const details = selectedHotel?.HotelDetails?.[0];
    if (!details?.address) return null;

    const { address } = details;
    const parts = [
      address.streetNumber,
      address.streetName,
      address.addressLine2,
      address.postalCode,
      address.city.name,
      address.city.country.name,
    ].filter(Boolean);

    return parts.join(", ");
  },

  getRecentReviews: (limit = 5) => {
    const { selectedHotel } = get();
    if (!selectedHotel?.HotelReview) return [];

    return selectedHotel.HotelReview.filter(
      (review) => review.parentId === null
    ) // Exclure les réponses
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  },
}));
