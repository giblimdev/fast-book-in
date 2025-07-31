// lib/api/hotel-api.ts
// Fonctions utilitaires pour les appels API de création/modification d'hôtel

export interface CreateHotelPayload {
  hotelCard: any;
  address: any;
  details: any;
  features: any;
  roomTypes: any[];
  images: any[];
  selectedCity: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

class HotelApiService {
  private async apiCall<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`🌐 API Call to ${url}:`, {
        method: options.method,
        headers: options.headers,
        body: options.body ? JSON.parse(options.body as string) : null,
      });

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      console.log(`✅ API Response from ${url}:`, {
        status: response.status,
        ok: response.ok,
        data: data,
      });

      if (!response.ok) {
        throw new Error(data.message || "Erreur API");
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || "Succès",
      };
    } catch (error) {
      console.error(`❌ API Error for ${url}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erreur inconnue",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  // Créer une adresse
  async createAddress(addressData: any): Promise<ApiResponse<{ id: string }>> {
    console.log("📍 Creating Address with data:", addressData);
    return this.apiCall("/api/address", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
  }

  // Créer les détails de l'hôtel
  async createHotelDetails(
    detailsData: any
  ): Promise<ApiResponse<{ id: string }>> {
    console.log("🏨 Creating Hotel Details with data:", detailsData);
    return this.apiCall("/api/hotel-details", {
      method: "POST",
      body: JSON.stringify(detailsData),
    });
  }

  // Créer la carte hôtel
  async createHotelCard(
    hotelCardData: any
  ): Promise<ApiResponse<{ id: string }>> {
    console.log("🎴 Creating Hotel Card with data:", hotelCardData);
    return this.apiCall("/api/hotel-card", {
      method: "POST",
      body: JSON.stringify(hotelCardData),
    });
  }

  // Créer un type de chambre
  async createRoomType(
    roomTypeData: any
  ): Promise<ApiResponse<{ id: string }>> {
    console.log("🛏️ Creating Room Type with data:", roomTypeData);
    return this.apiCall("/api/hotel-room-type", {
      method: "POST",
      body: JSON.stringify(roomTypeData),
    });
  }

  // Créer une image de galerie
  async createGalleryImage(
    imageData: any
  ): Promise<ApiResponse<{ id: string }>> {
    console.log("🖼️ Creating Gallery Image with data:", imageData);
    return this.apiCall("/api/gallery-image", {
      method: "POST",
      body: JSON.stringify(imageData),
    });
  }

  // Créer le dashboard hôtelier
  async createHostDashboard(
    dashboardData: any
  ): Promise<ApiResponse<{ id: string }>> {
    console.log("📊 Creating Host Dashboard with data:", dashboardData);
    return this.apiCall("/api/host-dashboard", {
      method: "POST",
      body: JSON.stringify(dashboardData),
    });
  }

  // Créer les relations HotelCardToHotelAmenity
  async createHotelAmenityRelation(relationData: any): Promise<ApiResponse> {
    console.log("⭐ Creating Hotel Amenity Relation with data:", relationData);
    return this.apiCall("/api/hotel-card-to-hotel-amenity", {
      method: "POST",
      body: JSON.stringify(relationData),
    });
  }

  // Créer les relations HotelCardToLabel
  async createHotelLabelRelation(relationData: any): Promise<ApiResponse> {
    console.log("🏷️ Creating Hotel Label Relation with data:", relationData);
    return this.apiCall("/api/hotel-card-to-label", {
      method: "POST",
      body: JSON.stringify(relationData),
    });
  }

  // Créer les relations HotelCardToAccessibilityOption
  async createHotelAccessibilityRelation(
    relationData: any
  ): Promise<ApiResponse> {
    console.log(
      "♿ Creating Hotel Accessibility Relation with data:",
      relationData
    );
    return this.apiCall("/api/hotel-card-to-accessibility-option", {
      method: "POST",
      body: JSON.stringify(relationData),
    });
  }

  // Créer les relations HotelCardToHotelHighlight
  async createHotelHighlightRelation(relationData: any): Promise<ApiResponse> {
    console.log(
      "✨ Creating Hotel Highlight Relation with data:",
      relationData
    );
    return this.apiCall("/api/hotel-card-to-hotel-highlight", {
      method: "POST",
      body: JSON.stringify(relationData),
    });
  }

  // Mettre à jour une adresse
  async updateAddress(id: string, addressData: any): Promise<ApiResponse> {
    console.log(`📍 Updating Address ${id} with data:`, addressData);
    return this.apiCall(`/api/address/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    });
  }

  // Mettre à jour les détails de l'hôtel
  async updateHotelDetails(id: string, detailsData: any): Promise<ApiResponse> {
    console.log(`🏨 Updating Hotel Details ${id} with data:`, detailsData);
    return this.apiCall(`/api/hotel-details/${id}`, {
      method: "PUT",
      body: JSON.stringify(detailsData),
    });
  }

  // Mettre à jour la carte hôtel
  async updateHotelCard(id: string, hotelCardData: any): Promise<ApiResponse> {
    console.log(`🎴 Updating Hotel Card ${id} with data:`, hotelCardData);
    return this.apiCall(`/api/hotel-card/${id}`, {
      method: "PUT",
      body: JSON.stringify(hotelCardData),
    });
  }

  // Supprimer les relations existantes
  async deleteHotelRelations(
    hotelCardId: string,
    relationType: string
  ): Promise<ApiResponse> {
    console.log(
      `🗑️ Deleting Hotel Relations for ${hotelCardId}, type: ${relationType}`
    );
    return this.apiCall(`/api/${relationType}?hotelCardId=${hotelCardId}`, {
      method: "DELETE",
    });
  }
}

export const hotelApiService = new HotelApiService();
