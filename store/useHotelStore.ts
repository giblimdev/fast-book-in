// store/useHotelStore.ts
// Zustand store persistant pour la gestion complète et cohérente des données hôtel selon le schema Prisma FastBooking
// ✅ Version complète avec gestion API, validation flexible et adresse optionnelle

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { hotelService } from "@/lib/services/hotel-service";
import { CreateHotelPayload } from "@/lib/api/hotel-api";

// Typage des données, conforme au schema FastBooking Prisma et usage frontend

interface HotelCardData {
  id?: string;
  name: string;
  idCity: string; // ✅ Cohérent avec le schéma
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
  hotelGroupId: string | null; // ✅ Utilisé dans HotelBasicInfo
  hotelParkingId: string | null;
  hotelDetailsId: string | null;
}

interface AddressData {
  id?: string;
  name: string | null;
  streetNumber: string | null;
  streetType: string | null;
  streetName?: string; // ✅ Optionnel selon votre modification du schéma
  addressLine2: string | null;
  postalCode?: string; // ✅ Optionnel selon votre modification du schéma
  cityId: string; // ✅ Utilisé dans HotelAdress
  neighborhoodId: string | null;
  latitude: number | null;
  longitude: number | null;
}

// ✅ Interface pour stocker les informations de ville
interface CityData {
  id: string;
  name: string;
  countryId?: string;
  order?: number;
}

interface HotelDetailsData {
  id?: string;
  description: string | null;
  addressId?: string; // ✅ Ajout pour liaison avec Address
  checkInTime: string | null;
  checkOutTime: string | null;
  numberOfRooms: number | null;
  numberOfFloors: number | null;
  languages: string[];
  order?: number; // ✅ Ajout du champ order du schéma
}

interface HotelFeaturesData {
  highlights: any;
  amenities: any;
  accessibilityOptions: any;
  labels: any;
  selectedAmenities: string[]; // HotelAmenity IDs
  selectedLabels: string[]; // Label IDs
  selectedAccessibilityOptions: string[]; // AccessibilityOption IDs
  selectedHighlights: string[]; // HotelHighlight IDs
}

interface RoomTypeData {
  id?: string;
  hotelCardId?: string; // ✅ Ajout pour cohérence avec le schéma
  images: any;
  name: string;
  description: string | null;
  maxGuests: number;
  bedCount: number;
  bedType: string;
  roomSize: number | null;
  pricePerNight: number;
  currency: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoomFeaturesData {
  selectedAmenities: string[]; // RoomAmenity IDs
}

interface GalleryImageData {
  id?: string;
  imageCategories: string; // e.g. "hotelCard" or "hotelRoom"
  order: number;
  alt: string | null;
  imagePath: string;
  imageDescription: string | null;
  imageSlug: string | null;
  hotelRoomtypeId?: string;
  // ✅ Ajout des champs manquants du schéma
  hotelCardId?: string;
  cityId?: string;
  countryId?: string;
  neighborhoodId?: string;
  destinationId?: string;
  landmarkId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Interface principale du store - complète avec gestion API
interface HotelStore {
  // État principal
  isEditing: boolean;
  currentStep: number;
  hotelCardData: Partial<HotelCardData>;
  addressData: Partial<AddressData>;
  hotelDetailsData: Partial<HotelDetailsData>;
  hotelFeaturesData: HotelFeaturesData;
  roomTypes: RoomTypeData[];
  roomFeaturesData: RoomFeaturesData;
  galleryImages: GalleryImageData[];

  // ✅ Stockage des données de ville
  selectedCity: CityData | null;

  // ✅ Nouvelles propriétés pour la gestion d'état
  isCreating: boolean;
  isUpdating: boolean;
  operationError: string | null;

  // Actions de base
  setHotelCardData: (data: Partial<HotelCardData>) => void;
  setAddressData: (data: Partial<AddressData>) => void;
  setHotelDetailsData: (data: Partial<HotelDetailsData>) => void;
  setHotelFeaturesData: (data: Partial<HotelFeaturesData>) => void;
  setRoomFeaturesData: (data: Partial<RoomFeaturesData>) => void;
  addRoomType: (roomType: RoomTypeData) => void;
  updateRoomType: (index: number, roomType: Partial<RoomTypeData>) => void;
  removeRoomType: (index: number) => void;
  addGalleryImage: (image: GalleryImageData) => void;
  updateGalleryImage: (index: number, image: Partial<GalleryImageData>) => void;
  removeGalleryImage: (index: number) => void;
  setSelectedHotel: (hotel: Partial<HotelCardData>) => void;
  clearSelectedHotel: () => void;

  // ✅ Actions de ville
  setSelectedCity: (city: CityData | null) => void;

  // ✅ Nouvelles actions de sauvegarde
  createHotel: () => Promise<{
    success: boolean;
    message: string;
    hotelId?: string;
  }>;
  updateHotel: (
    hotelId: string
  ) => Promise<{ success: boolean; message: string }>;
  setIsCreating: (creating: boolean) => void;
  setIsUpdating: (updating: boolean) => void;
  setOperationError: (error: string | null) => void;

  // Validation
  isStepComplete: (step: number) => boolean;
  getStepErrors: (step: number) => string[];
  validateForSave: () => {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
  };
  isReadyToSave: () => boolean;

  // Utilitaires
  getAllData: () => {
    hotelCard: Partial<HotelCardData>;
    address: Partial<AddressData>;
    details: Partial<HotelDetailsData>;
    features: HotelFeaturesData;
    roomTypes: RoomTypeData[];
    roomFeatures: RoomFeaturesData;
    images: GalleryImageData[];
    selectedCity: CityData | null;
  };

  // ✅ Méthodes pour la cohérence
  syncAddressWithCity: (cityId: string, cityName?: string) => void;
  linkHotelDetailsToAddress: () => void;
}

const initialHotelFeaturesData: HotelFeaturesData = {
  selectedAmenities: [],
  selectedLabels: [],
  selectedAccessibilityOptions: [],
  selectedHighlights: [],
  amenities: undefined,
  accessibilityOptions: undefined,
  labels: undefined,
  highlights: undefined,
};

const initialRoomFeaturesData: RoomFeaturesData = {
  selectedAmenities: [],
};

const initialState = {
  isEditing: false,
  currentStep: 1,
  hotelCardData: {
    currency: "EUR", // ✅ Valeur par défaut cohérente
    isPartner: false,
    reviewCount: 0,
    order: 100, // ✅ Valeur par défaut du schéma
  } as Partial<HotelCardData>,
  addressData: {} as Partial<AddressData>,
  hotelDetailsData: {
    languages: [], // ✅ Initialisation du tableau
    order: 20, // ✅ Valeur par défaut du schéma
  } as Partial<HotelDetailsData>,
  hotelFeaturesData: initialHotelFeaturesData,
  roomTypes: [],
  roomFeaturesData: initialRoomFeaturesData,
  galleryImages: [],
  // ✅ Initialisation ville et API
  selectedCity: null,
  isCreating: false,
  isUpdating: false,
  operationError: null,
};

export const useHotelStore = create<HotelStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ===== ACTIONS DE BASE =====
      setHotelCardData: (data) =>
        set((state) => ({
          hotelCardData: { ...state.hotelCardData, ...data },
        })),

      setAddressData: (data) =>
        set((state) => ({
          addressData: { ...state.addressData, ...data },
        })),

      setHotelDetailsData: (data) =>
        set((state) => ({
          hotelDetailsData: { ...state.hotelDetailsData, ...data },
        })),

      setHotelFeaturesData: (data) =>
        set((state) => ({
          hotelFeaturesData: { ...state.hotelFeaturesData, ...data },
        })),

      setRoomFeaturesData: (data) =>
        set((state) => ({
          roomFeaturesData: { ...state.roomFeaturesData, ...data },
        })),

      addRoomType: (roomType) =>
        set((state) => ({
          roomTypes: [
            ...state.roomTypes,
            {
              ...roomType,
              hotelCardId: state.hotelCardData.id, // ✅ Auto-liaison
            },
          ],
        })),

      updateRoomType: (index, roomType) =>
        set((state) => ({
          roomTypes: state.roomTypes.map((r, i) =>
            i === index ? { ...r, ...roomType } : r
          ),
        })),

      removeRoomType: (index) =>
        set((state) => ({
          roomTypes: state.roomTypes.filter((_, i) => i !== index),
        })),

      addGalleryImage: (image) =>
        set((state) => ({
          galleryImages: [
            ...state.galleryImages,
            {
              ...image,
              hotelCardId: state.hotelCardData.id, // ✅ Auto-liaison
            },
          ],
        })),

      updateGalleryImage: (index, image) =>
        set((state) => ({
          galleryImages: state.galleryImages.map((img, i) =>
            i === index ? { ...img, ...image } : img
          ),
        })),

      removeGalleryImage: (index) =>
        set((state) => ({
          galleryImages: state.galleryImages.filter((_, i) => i !== index),
        })),

      setSelectedHotel: (hotel) =>
        set({
          isEditing: true,
          hotelCardData: hotel,
          currentStep: 1,
        }),

      clearSelectedHotel: () => set({ ...initialState }),

      // ===== ACTIONS DE VILLE =====
      setSelectedCity: (city) => set({ selectedCity: city }),

      syncAddressWithCity: (cityId, cityName) =>
        set((state) => ({
          addressData: { ...state.addressData, cityId },
          hotelCardData: { ...state.hotelCardData, idCity: cityId },
          // ✅ Mise à jour de la ville sélectionnée si le nom est fourni
          selectedCity: cityName
            ? {
                id: cityId,
                name: cityName,
                ...state.selectedCity,
              }
            : state.selectedCity,
        })),

      linkHotelDetailsToAddress: () =>
        set((state) => ({
          hotelDetailsData: {
            ...state.hotelDetailsData,
            addressId: state.addressData.id,
          },
        })),

      // ===== ACTIONS API =====
      setIsCreating: (creating) => set({ isCreating: creating }),
      setIsUpdating: (updating) => set({ isUpdating: updating }),
      setOperationError: (error) => set({ operationError: error }),

      // ✅ Action de création d'hôtel
      createHotel: async () => {
        const state = get();
        set({ isCreating: true, operationError: null });

        try {
          // Validation avant envoi
          const validation = state.validateForSave();
          if (!validation.isValid) {
            throw new Error(
              `Données invalides: ${validation.errors.join(", ")}`
            );
          }

          // Préparation du payload
          const payload: CreateHotelPayload = {
            hotelCard: state.hotelCardData,
            address: state.addressData,
            details: state.hotelDetailsData,
            features: state.hotelFeaturesData,
            roomTypes: state.roomTypes, // ✅ Peut être vide maintenant
            images: state.galleryImages,
            selectedCity: state.selectedCity,
          };

          console.log("📤 Envoi des données pour création:", payload);

          // Appel au service
          const result = await hotelService.createCompleteHotel(payload);

          set({ isCreating: false });

          if (result.success) {
            // Réinitialiser le store après création réussie
            set({
              ...initialState,
              isCreating: false,
              operationError: null,
            });
          } else {
            set({ operationError: result.message });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({
            isCreating: false,
            operationError: errorMessage,
          });

          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // ✅ Action de mise à jour d'hôtel
      updateHotel: async (hotelId: string) => {
        const state = get();
        set({ isUpdating: true, operationError: null });

        try {
          // Validation avant envoi
          const validation = state.validateForSave();
          if (!validation.isValid) {
            throw new Error(
              `Données invalides: ${validation.errors.join(", ")}`
            );
          }

          // Préparation du payload
          const payload: CreateHotelPayload = {
            hotelCard: { ...state.hotelCardData, id: hotelId },
            address: state.addressData,
            details: state.hotelDetailsData,
            features: state.hotelFeaturesData,
            roomTypes: state.roomTypes,
            images: state.galleryImages,
            selectedCity: state.selectedCity,
          };

          console.log("📤 Envoi des données pour mise à jour:", payload);

          // Appel au service
          const result = await hotelService.updateCompleteHotel(
            hotelId,
            payload
          );

          set({ isUpdating: false });

          if (!result.success) {
            set({ operationError: result.message });
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erreur inconnue";
          set({
            isUpdating: false,
            operationError: errorMessage,
          });

          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // ===== VALIDATION FLEXIBLE =====
      isStepComplete: (step) => {
        const state = get();
        switch (step) {
          case 1: // Infos de base - OBLIGATOIRE
            return !!(
              state.hotelCardData.name &&
              state.hotelCardData.idCity &&
              state.hotelCardData.basePricePerNight &&
              state.hotelCardData.starRating
            );
          case 2: // ✅ Adresse - seulement la ville est obligatoire maintenant
            return !!state.addressData.cityId;
          case 3: // Détails - OPTIONNEL
            return true;
          case 4: // ✅ Types de chambres - OPTIONNEL pour création initiale
            return true;
          case 5: // Fonctionnalités - OPTIONNEL
            return true;
          case 6: // Images - OPTIONNEL
            return true;
          default:
            return false;
        }
      },

      getStepErrors: (step) => {
        const state = get();
        const errors: string[] = [];

        if (step === 1) {
          if (!state.hotelCardData.name)
            errors.push("Le nom de l'hôtel est requis.");
          if (!state.hotelCardData.idCity) errors.push("La ville est requise.");
          if (!state.hotelCardData.basePricePerNight)
            errors.push("Le prix de base est requis.");
          if (!state.hotelCardData.starRating)
            errors.push("Le nombre d'étoiles est requis.");
        }

        if (step === 2) {
          // ✅ SUPPRIMÉ : streetName et postalCode ne sont plus obligatoires
          if (!state.addressData.cityId) errors.push("La ville est requise.");
        }

        // ✅ Pas d'erreur pour les étapes optionnelles (3, 4, 5, 6)

        return errors;
      },

      // ✅ Validation complète pour sauvegarde - FLEXIBLE
      validateForSave: () => {
        const state = get();
        const errors: string[] = [];
        const warnings: string[] = [];

        // ✅ VALIDATION MINIMALE - Seulement ce qui est OBLIGATOIRE

        // Validation HotelCardData - OBLIGATOIRE
        if (!state.hotelCardData.name?.trim()) {
          errors.push("Le nom de l'hôtel est requis");
        }
        if (!state.hotelCardData.idCity && !state.selectedCity?.id) {
          errors.push("La ville est requise");
        }
        if (
          !state.hotelCardData.basePricePerNight ||
          state.hotelCardData.basePricePerNight <= 0
        ) {
          errors.push("Le prix de base doit être supérieur à 0");
        }
        if (
          !state.hotelCardData.starRating ||
          state.hotelCardData.starRating < 1 ||
          state.hotelCardData.starRating > 5
        ) {
          errors.push("Le nombre d'étoiles doit être entre 1 et 5");
        }

        // ✅ Validation AddressData - streetName et postalCode maintenant optionnels
        // Validation de la ville reste obligatoire
        if (!state.addressData.cityId && !state.selectedCity?.id) {
          errors.push("La ville dans l'adresse est requise");
        }

        // ✅ Validation coordonnées GPS (si fournies) - OPTIONNEL mais doit être valide
        if (
          state.addressData.latitude &&
          (state.addressData.latitude < -90 || state.addressData.latitude > 90)
        ) {
          errors.push("La latitude doit être entre -90 et 90");
        }
        if (
          state.addressData.longitude &&
          (state.addressData.longitude < -180 ||
            state.addressData.longitude > 180)
        ) {
          errors.push("La longitude doit être entre -180 et 180");
        }

        // ✅ NOUVEAU : Warnings pour informer l'utilisateur
        if (!state.addressData.streetName?.trim()) {
          warnings.push(
            "Nom de rue non renseigné - recommandé pour une adresse complète"
          );
        }
        if (!state.addressData.postalCode?.trim()) {
          warnings.push(
            "Code postal non renseigné - recommandé pour localiser l'hôtel"
          );
        }
        if (state.roomTypes.length === 0) {
          warnings.push(
            "Aucun type de chambre défini - vous pourrez les ajouter après création"
          );
        }
        if (state.galleryImages.length === 0) {
          warnings.push(
            "Aucune image ajoutée - recommandé pour attirer les clients"
          );
        }
        if (!state.hotelDetailsData.description?.trim()) {
          warnings.push(
            "Aucune description détaillée - recommandé pour informer les clients"
          );
        }

        // ✅ Validation des chambres existantes (si présentes)
        if (state.roomTypes.length > 0) {
          state.roomTypes.forEach((room, index) => {
            if (!room.name?.trim()) {
              errors.push(`Le nom de la chambre ${index + 1} est requis`);
            }
            if (!room.maxGuests || room.maxGuests < 1) {
              errors.push(
                `Le nombre de personnes pour la chambre ${
                  index + 1
                } doit être au moins 1`
              );
            }
            if (!room.pricePerNight || room.pricePerNight <= 0) {
              errors.push(
                `Le prix de la chambre ${index + 1} doit être supérieur à 0`
              );
            }
          });
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
        };
      },

      isReadyToSave: () => {
        const validation = get().validateForSave();
        return validation.isValid;
      },

      // ===== UTILITAIRES =====
      getAllData: () => {
        const state = get();
        return {
          hotelCard: state.hotelCardData,
          address: state.addressData,
          details: state.hotelDetailsData,
          features: state.hotelFeaturesData,
          roomTypes: state.roomTypes,
          roomFeatures: state.roomFeaturesData,
          images: state.galleryImages,
          selectedCity: state.selectedCity,
        };
      },
    }),
    {
      name: "hotel_creation_store",
      // ✅ Configuration de persistance optimisée
      partialize: (state) => ({
        hotelCardData: state.hotelCardData,
        addressData: state.addressData,
        hotelDetailsData: state.hotelDetailsData,
        hotelFeaturesData: state.hotelFeaturesData,
        roomTypes: state.roomTypes,
        roomFeaturesData: state.roomFeaturesData,
        galleryImages: state.galleryImages,
        selectedCity: state.selectedCity,
        isEditing: state.isEditing,
        currentStep: state.currentStep,
        // ✅ Ne pas persister les états temporaires (isCreating, isUpdating, operationError)
      }),
    }
  )
);

// ✅ Export des types pour utilisation externe
export type {
  HotelCardData,
  AddressData,
  CityData,
  HotelDetailsData,
  HotelFeaturesData,
  RoomTypeData,
  GalleryImageData,
};
