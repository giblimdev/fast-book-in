// lib/services/hotel-service.ts
// Service principal pour la création et modification d'hôtels

import {
  hotelApiService,
  CreateHotelPayload,
  ApiResponse,
} from "@/lib/api/hotel-api";
import { toast } from "sonner";

export class HotelService {
  /**
   * Créer un nouvel hôtel complet
   */
  async createCompleteHotel(
    payload: CreateHotelPayload
  ): Promise<ApiResponse<{ hotelId: string }>> {
    try {
      console.log(
        "🏗️ Début de la création de l'hôtel:",
        payload.hotelCard.name
      );

      // 1. Créer l'adresse
      const addressResult = await hotelApiService.createAddress({
        name: payload.address.name || null,
        streetNumber: payload.address.streetNumber || null,
        streetType: payload.address.streetType || null,
        streetName: payload.address.streetName,
        addressLine2: payload.address.addressLine2 || null,
        postalCode: payload.address.postalCode,
        cityId: payload.address.cityId,
        neighborhoodId: payload.address.neighborhoodId || null,
        latitude: payload.address.latitude || null,
        longitude: payload.address.longitude || null,
      });

      if (!addressResult.success) {
        throw new Error(`Erreur création adresse: ${addressResult.message}`);
      }

      console.log("✅ Adresse créée:", addressResult.data?.id);

      // 2. Créer les détails de l'hôtel
      const detailsResult = await hotelApiService.createHotelDetails({
        description: payload.details.description || null,
        addressId: addressResult.data!.id,
        checkInTime: payload.details.checkInTime || null,
        checkOutTime: payload.details.checkOutTime || null,
        numberOfRooms: payload.details.numberOfRooms || null,
        numberOfFloors: payload.details.numberOfFloors || null,
        languages: payload.details.languages || [],
        order: payload.details.order || 20,
      });

      if (!detailsResult.success) {
        throw new Error(`Erreur création détails: ${detailsResult.message}`);
      }

      console.log("✅ Détails créés:", detailsResult.data?.id);

      // 3. Créer la carte hôtel
      const hotelCardResult = await hotelApiService.createHotelCard({
        name: payload.hotelCard.name,
        idCity: payload.hotelCard.idCity || payload.selectedCity?.id,
        order: payload.hotelCard.order || 20,
        shortDescription: payload.hotelCard.shortDescription || null,
        starRating: payload.hotelCard.starRating,
        overallRating: payload.hotelCard.overallRating || null,
        ratingAdjective: payload.hotelCard.ratingAdjective || null,
        reviewCount: payload.hotelCard.reviewCount || 0,
        basePricePerNight: payload.hotelCard.basePricePerNight,
        regularPrice: payload.hotelCard.regularPrice || null,
        currency: payload.hotelCard.currency || "EUR",
        isPartner: payload.hotelCard.isPartner || false,
        imageMessage: payload.hotelCard.imageMessage || null,
        hotelGroupId: payload.hotelCard.hotelGroupId || null,
        hotelParkingId: payload.hotelCard.hotelParkingId || null,
        hotelDetailsId: detailsResult.data!.id,
      });

      if (!hotelCardResult.success) {
        throw new Error(
          `Erreur création hotel card: ${hotelCardResult.message}`
        );
      }

      const hotelCardId = hotelCardResult.data!.id;
      console.log("✅ Carte hôtel créée:", hotelCardId);

      // 4. Créer les types de chambres
      if (payload.roomTypes?.length > 0) {
        for (const [index, roomType] of payload.roomTypes.entries()) {
          const roomResult = await hotelApiService.createRoomType({
            hotelCardId,
            name: roomType.name,
            description: roomType.description || null,
            maxGuests: roomType.maxGuests,
            bedCount: roomType.bedCount,
            bedType: roomType.bedType,
            roomSize: roomType.roomSize || null,
            pricePerNight: roomType.pricePerNight,
            currency: roomType.currency || "EUR",
            isAvailable: roomType.isAvailable !== false,
          });

          if (!roomResult.success) {
            console.warn(
              `Erreur création chambre ${index + 1}:`,
              roomResult.message
            );
          } else {
            console.log(`✅ Chambre ${index + 1} créée:`, roomResult.data?.id);
          }
        }
      }

      // 5. Créer les images de galerie
      if (payload.images?.length > 0) {
        for (const [index, image] of payload.images.entries()) {
          const imageResult = await hotelApiService.createGalleryImage({
            imageCategories: image.imageCategories,
            order: image.order || 20,
            alt: image.alt || null,
            hotelCardId,
            cityId: payload.selectedCity?.id || null,
            countryId: payload.selectedCity?.countryId || null,
            neighborhoodId: payload.address.neighborhoodId || null,
          });

          if (!imageResult.success) {
            console.warn(
              `Erreur création image ${index + 1}:`,
              imageResult.message
            );
          } else {
            console.log(`✅ Image ${index + 1} créée:`, imageResult.data?.id);
          }
        }
      }

      // 6. Créer les relations pour les fonctionnalités
      await this.createHotelFeatureRelations(hotelCardId, payload.features);

      // 7. Créer le dashboard hôtelier
      const dashboardResult = await hotelApiService.createHostDashboard({
        hotelCardId,
        totalBookings: 0,
        monthlyRevenue: 0,
        averageRating: 0,
        totalReviews: 0,
        occupancyRate: 0,
        availableRooms: payload.details.numberOfRooms || 0,
      });

      if (!dashboardResult.success) {
        console.warn("Erreur création dashboard:", dashboardResult.message);
      } else {
        console.log("✅ Dashboard créé:", dashboardResult.data?.id);
      }

      console.log("🎉 Hôtel créé avec succès:", hotelCardId);

      return {
        success: true,
        data: { hotelId: hotelCardId },
        message: "Hôtel créé avec succès !",
      };
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'hôtel:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de la création",
      };
    }
  }

  /**
   * Mettre à jour un hôtel existant
   */
  async updateCompleteHotel(
    hotelId: string,
    payload: CreateHotelPayload
  ): Promise<ApiResponse<{ hotelId: string }>> {
    try {
      console.log("🔄 Début de la mise à jour de l'hôtel:", hotelId);

      // 1. Mettre à jour la carte hôtel
      const hotelCardResult = await hotelApiService.updateHotelCard(hotelId, {
        name: payload.hotelCard.name,
        idCity: payload.hotelCard.idCity || payload.selectedCity?.id,
        order: payload.hotelCard.order || 20,
        shortDescription: payload.hotelCard.shortDescription || null,
        starRating: payload.hotelCard.starRating,
        basePricePerNight: payload.hotelCard.basePricePerNight,
        regularPrice: payload.hotelCard.regularPrice || null,
        currency: payload.hotelCard.currency || "EUR",
        isPartner: payload.hotelCard.isPartner || false,
        imageMessage: payload.hotelCard.imageMessage || null,
        hotelGroupId: payload.hotelCard.hotelGroupId || null,
        hotelParkingId: payload.hotelCard.hotelParkingId || null,
      });

      if (!hotelCardResult.success) {
        throw new Error(
          `Erreur mise à jour hotel card: ${hotelCardResult.message}`
        );
      }

      console.log("✅ Carte hôtel mise à jour");

      // 2. Mettre à jour l'adresse (si addressId fourni)
      if (payload.address.id) {
        const addressResult = await hotelApiService.updateAddress(
          payload.address.id,
          {
            name: payload.address.name || null,
            streetNumber: payload.address.streetNumber || null,
            streetType: payload.address.streetType || null,
            streetName: payload.address.streetName,
            addressLine2: payload.address.addressLine2 || null,
            postalCode: payload.address.postalCode,
            cityId: payload.address.cityId,
            neighborhoodId: payload.address.neighborhoodId || null,
            latitude: payload.address.latitude || null,
            longitude: payload.address.longitude || null,
          }
        );

        if (!addressResult.success) {
          console.warn("Erreur mise à jour adresse:", addressResult.message);
        } else {
          console.log("✅ Adresse mise à jour");
        }
      }

      // 3. Mettre à jour les détails (si detailsId fourni)
      if (payload.details.id) {
        const detailsResult = await hotelApiService.updateHotelDetails(
          payload.details.id,
          {
            description: payload.details.description || null,
            checkInTime: payload.details.checkInTime || null,
            checkOutTime: payload.details.checkOutTime || null,
            numberOfRooms: payload.details.numberOfRooms || null,
            numberOfFloors: payload.details.numberOfFloors || null,
            languages: payload.details.languages || [],
            order: payload.details.order || 20,
          }
        );

        if (!detailsResult.success) {
          console.warn("Erreur mise à jour détails:", detailsResult.message);
        } else {
          console.log("✅ Détails mis à jour");
        }
      }

      // 4. Mettre à jour les relations de fonctionnalités
      await this.updateHotelFeatureRelations(hotelId, payload.features);

      console.log("🎉 Hôtel mis à jour avec succès:", hotelId);

      return {
        success: true,
        data: { hotelId },
        message: "Hôtel mis à jour avec succès !",
      };
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de l'hôtel:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de la mise à jour",
      };
    }
  }

  /**
   * Créer les relations de fonctionnalités pour un nouvel hôtel
   */
  private async createHotelFeatureRelations(
    hotelCardId: string,
    features: any
  ): Promise<void> {
    if (!features) return;

    // Équipements
    if (features.selectedAmenities?.length > 0) {
      for (const amenityId of features.selectedAmenities) {
        await hotelApiService.createHotelAmenityRelation({
          hotelCardId,
          hotelAmenityId: amenityId,
        });
      }
      console.log(`✅ ${features.selectedAmenities.length} équipements liés`);
    }

    // Labels
    if (features.selectedLabels?.length > 0) {
      for (const labelId of features.selectedLabels) {
        await hotelApiService.createHotelLabelRelation({
          hotelCardId,
          labelId,
        });
      }
      console.log(`✅ ${features.selectedLabels.length} labels liés`);
    }

    // Options d'accessibilité
    if (features.selectedAccessibilityOptions?.length > 0) {
      for (const optionId of features.selectedAccessibilityOptions) {
        await hotelApiService.createHotelAccessibilityRelation({
          hotelCardId,
          accessibilityOptionId: optionId,
        });
      }
      console.log(
        `✅ ${features.selectedAccessibilityOptions.length} options d'accessibilité liées`
      );
    }

    // Points forts
    if (features.selectedHighlights?.length > 0) {
      for (const highlightId of features.selectedHighlights) {
        await hotelApiService.createHotelHighlightRelation({
          hotelCardId,
          hotelHighlightId: highlightId,
        });
      }
      console.log(`✅ ${features.selectedHighlights.length} points forts liés`);
    }
  }

  /**
   * Mettre à jour les relations de fonctionnalités pour un hôtel existant
   */
  private async updateHotelFeatureRelations(
    hotelCardId: string,
    features: any
  ): Promise<void> {
    if (!features) return;

    // Supprimer les anciennes relations et créer les nouvelles
    const relationTypes = [
      {
        type: "hotel-card-to-hotel-amenity",
        items: features.selectedAmenities,
      },
      { type: "hotel-card-to-label", items: features.selectedLabels },
      {
        type: "hotel-card-to-accessibility-option",
        items: features.selectedAccessibilityOptions,
      },
      {
        type: "hotel-card-to-hotel-highlight",
        items: features.selectedHighlights,
      },
    ];

    for (const relation of relationTypes) {
      // Supprimer les anciennes relations
      await hotelApiService.deleteHotelRelations(hotelCardId, relation.type);

      // Créer les nouvelles relations
      if (relation.items?.length > 0) {
        for (const itemId of relation.items) {
          if (relation.type === "hotel-card-to-hotel-amenity") {
            await hotelApiService.createHotelAmenityRelation({
              hotelCardId,
              hotelAmenityId: itemId,
            });
          } else if (relation.type === "hotel-card-to-label") {
            await hotelApiService.createHotelLabelRelation({
              hotelCardId,
              labelId: itemId,
            });
          } else if (relation.type === "hotel-card-to-accessibility-option") {
            await hotelApiService.createHotelAccessibilityRelation({
              hotelCardId,
              accessibilityOptionId: itemId,
            });
          } else if (relation.type === "hotel-card-to-hotel-highlight") {
            await hotelApiService.createHotelHighlightRelation({
              hotelCardId,
              hotelHighlightId: itemId,
            });
          }
        }
        console.log(
          `✅ ${relation.items.length} relations ${relation.type} mises à jour`
        );
      }
    }
  }
}

export const hotelService = new HotelService();
