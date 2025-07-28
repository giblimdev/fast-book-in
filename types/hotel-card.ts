// @/types/hotel-card.ts

// ✅ Interface principale pour les données d'une carte d'hôtel
export interface HotelCardData {
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
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  hotelParkingId?: string;
  latitude?: number;
  longitude?: number;
  detailsId?: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations étendues (incluses lors des requêtes avec include)
  accommodationType?: AccommodationType;
  destination?: Destination;
  hotelGroup?: HotelGroup;
  parking?: HotelParking;
  images?: GaleryImage[];
  HotelCardToLabel?: HotelCardToLabel[];
  HotelCardToHotelAmenity?: HotelCardToHotelAmenity[];
  HotelCardToAccessibilityOption?: HotelCardToAccessibilityOption[];
  HotelCardToHotelHighlight?: HotelCardToHotelHighlight[];
  HotelDetails?: HotelDetails[];
  HotelRoom?: HotelRoom[];
  HotelReview?: HotelReview[];
  HotelPolicy?: HotelPolicy[];
  HotelFAQ?: HotelFAQ[];
  UserWishList?: UserWishList[];
  HostDashboard?: HostDashboard[];
  TravelerRecommendation?: TravelerRecommendation[];
}

// ✅ Interface pour les données de formulaire (création/modification)
export interface HotelCardFormData {
  name: string;
  idCity: string;
  order: number;
  shortDescription: string;
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
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  hotelParkingId?: string;
  latitude?: number;
  longitude?: number;
}

// ✅ Interface pour les filtres de recherche
export interface HotelCardFilters {
  // Filtres de base
  search?: string;
  cityId?: string;
  destinationId?: string;
  accommodationTypeId?: string;
  hotelGroupId?: string;

  // Filtres par étoiles et prix
  starRating?: number;
  minStarRating?: number;
  maxStarRating?: number;
  minPrice?: number;
  maxPrice?: number;

  // Filtres par statut
  isPartner?: boolean;

  // Filtres géographiques
  latitude?: number;
  longitude?: number;
  radius?: number; // Rayon en km pour la recherche géographique

  // Filtres par équipements et accessibilité
  amenityIds?: string[];
  accessibilityOptionIds?: string[];
  labelIds?: string[];
  highlightIds?: string[];

  // Filtres par disponibilité
  checkIn?: string;
  checkOut?: string;
  guests?: number;

  // Filtres par évaluation
  minOverallRating?: number;
  minReviewCount?: number;

  // Filtres par politique
  cancellationPolicy?: string;
  allowsPets?: boolean;
  allowsSmoking?: boolean;

  // Tri et pagination
  sortBy?: "name" | "price" | "rating" | "reviews" | "distance" | "order";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  page?: number;

  // Filtres temporels
  createdAfter?: string;
  updatedAfter?: string;
}

// ✅ Types pour les entités liées

export interface AccommodationType {
  id: string;
  name: string;
  order?: number;
  code: string;
  description?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  order?: number;
  description?: string;
  type: string;
  popularityScore: number;
  cityId: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  createdAt: string;
  updatedAt: string;
  images?: GaleryImage[];
}

export interface HotelGroup {
  id: string;
  name: string;
  order?: number;
  description?: string;
  website?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelParking {
  id: string;
  name: string;
  isAvailable: boolean;
  spaces?: number;
  order?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GaleryImage {
  id: string;
  entityId: string;
  imageUrl: string;
  imageType: string;
  order: number;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  order?: number;
  code: string;
  description?: string;
  category: string;
  icon?: string;
  color?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  hotelDetailsId?: string;
}

export interface HotelAmenity {
  id: string;
  name: string;
  order?: number;
  category?: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessibilityOption {
  id: string;
  name: string;
  order?: number;
  code: string;
  description?: string;
  category: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelHighlight {
  id: string;
  title: string;
  order?: number;
  description?: string;
  category: string;
  icon?: string;
  priority: number;
  isPromoted: boolean;
  hotelId: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Types pour les relations many-to-many

export interface HotelCardToLabel {
  hotelCardId: string;
  labelId: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  label: Label;
}

export interface HotelCardToHotelAmenity {
  hotelCardId: string;
  hotelAmenityId: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  hotelAmenity: HotelAmenity;
}

export interface HotelCardToAccessibilityOption {
  hotelCardId: string;
  accessibilityOptionId: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  accessibilityOption: AccessibilityOption;
}

export interface HotelCardToHotelHighlight {
  hotelCardId: string;
  hotelHighlightId: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  hotelHighlight: HotelHighlight;
}

// ✅ Types pour les entités complexes liées

export interface HotelDetails {
  id: string;
  idHotelCard: string;
  description?: string;
  addressId: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  checkInTime?: string;
  checkOutTime?: string;
  numberOfRooms?: number;
  numberOfFloors?: number;
  languages: string[];
  address?: Address;
}

export interface Address {
  id: string;
  name?: string;
  streetNumber?: string;
  streetType?: string;
  streetName: string;
  addressLine2?: string;
  postalCode: string;
  cityId: string;
  neighborhoodId?: string;
  createdAt: string;
  updatedAt: string;
  city?: City;
}

export interface City {
  id: string;
  name: string;
  order?: number;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  country?: Country;
}

export interface Country {
  id: string;
  name: string;
  order?: number;
  code: string;
  language?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelRoom {
  id: string;
  hotelCardId: string;
  name: string;
  description?: string;
  images?: GaleryImage[];
  maxGuests: number;
  bedCount: number;
  bedType: string;
  roomSize?: number;
  pricePerNight: number;
  currency: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HotelReview {
  id: string;
  hotelCardId: string;
  userId: string;
  rating?: number;
  title?: string;
  comment: string;
  pros: string[];
  cons: string[];
  roomType?: string;
  stayDate?: string;
  isVerified: boolean;
  helpfulCount: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: HotelReview[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelPolicy {
  id: string;
  hotelCardId: string;
  checkIn: string;
  checkOut: string;
  cancellation: string;
  pets: boolean;
  smoking: boolean;
  parties: boolean;
  children?: string;
  extraBed?: string;
  breakfast?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelFAQ {
  id: string;
  hotelCardId: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWishList {
  id: string;
  userId: string;
  hotelCardId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface HostDashboard {
  id: string;
  hotelCardId: string;
  lastUpdated: string;
  totalBookings: number;
  upcomingBookings: number;
  currentGuests: number;
  cancellationRate: number;
  averageStayLength: number;
  monthlyRevenue: number;
  occupancyRate: number;
  adr: number;
  revpar: number;
  averageRating: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  responseRate: number;
  pendingRequests: number;
  maintenanceIssues: number;
  lowInventoryItems: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  lastBookingDate?: string;
  nextCheckIn?: string;
  nextCheckOut?: string;
  widgetConfig?: any;
  performanceHistory?: any;
  createdAt: string;
  updatedAt: string;
}

export interface TravelerRecommendation {
  travelerId: string;
  hotelId: string;
}

// ✅ Types pour les réponses API

export interface HotelCardsApiResponse {
  success: boolean;
  data: HotelCardData[];
  count: number;
  totalPages?: number;
  currentPage?: number;
  error?: string;
}

export interface HotelCardApiResponse {
  success: boolean;
  data: HotelCardData;
  error?: string;
}

export interface HotelCardStatsResponse {
  success: boolean;
  data: HotelCardStats;
  error?: string;
}

export interface HotelCardStats {
  total: number;
  partners: number;
  averageRating: number;
  averagePrice: number;
  cityDistribution: Record<string, number>;
  starDistribution: Record<number, number>;
  accommodationTypeDistribution: Record<string, number>;
  priceRangeDistribution: {
    budget: number; // < 100€
    midRange: number; // 100-300€
    luxury: number; // > 300€
  };
  monthlyBookings: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
}

// ✅ Types pour les hooks

export interface UseHotelCardsOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  staleTime?: number;
}

export interface UseHotelCardsReturn {
  // Données
  hotelCards: HotelCardData[];
  loading: boolean;
  error: string | null;

  // Métadonnées
  count: number;
  isEmpty: boolean;
  hasError: boolean;

  // Filtres
  filters: HotelCardFilters;
  updateFilters: (newFilters: Partial<HotelCardFilters>) => void;
  resetFilters: () => void;
  clearFilters: () => void;

  // Actions
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;

  // État de la requête
  isFirstLoad: boolean;
  lastFetch: Date | null;
}

export interface UseHotelCardReturn {
  hotelCard: HotelCardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastFetch: Date | null;
  isEmpty: boolean;
  hasError: boolean;
}

// ✅ Types pour les constantes et configurations

export interface CurrencyOption {
  value: string;
  label: string;
  symbol: string;
}

export interface StarRatingOption {
  value: number;
  label: string;
  icon: string;
}

export interface SortOption {
  value: string;
  label: string;
  direction: "asc" | "desc";
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

// ✅ Types utilitaires

export type HotelCardStatus = "active" | "inactive" | "draft" | "archived";

export type HotelCardSortField =
  | "name"
  | "price"
  | "rating"
  | "reviews"
  | "distance"
  | "order"
  | "createdAt";

export type HotelCardViewMode = "grid" | "list" | "map";

export type AccommodationCategory =
  | "hotel"
  | "apartment"
  | "villa"
  | "guesthouse"
  | "hostel";

export type DestinationType =
  | "urban"
  | "transport"
  | "business"
  | "leisure"
  | "cultural"
  | "nature";

export type LabelCategory =
  | "Quality"
  | "Location"
  | "Service"
  | "Amenity"
  | "Experience"
  | "Value"
  | "Accessibility"
  | "Sustainability"
  | "Business"
  | "Family"
  | "Romantic"
  | "Adventure"
  | "Luxury"
  | "Budget"
  | "Popular"
  | "New"
  | "Promoted"
  | "Special";

export type AmenityCategory =
  | "Location"
  | "Amenity"
  | "Service"
  | "View"
  | "Offer"
  | "Food";

// ✅ Types pour la validation

export interface HotelCardValidationErrors {
  name?: string;
  idCity?: string;
  starRating?: string;
  basePricePerNight?: string;
  order?: string;
  overallRating?: string;
  reviewCount?: string;
  latitude?: string;
  longitude?: string;
  currency?: string;
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  general?: string;
}

// ✅ Export de tous les types
