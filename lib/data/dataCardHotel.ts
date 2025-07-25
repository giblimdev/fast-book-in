// lib/data/dataCardHotel.ts
// Exemples conformes au schéma Prisma

export const hotelExample = [
  {
    id: "hotel-marseille-meininger-001",
    name: "MEININGER Hotel Marseille Centre La Joliette",
    idCity: "city-marseille-001",
    order: 1,
    shortDescription:
      "Hôtel moderne situé au cœur de Marseille, proche du Vieux-Port et des plages, idéal pour découvrir la ville.",
    starRating: 3,
    overallRating: 7.8,
    ratingAdjective: "Très bien",
    reviewCount: 1247,
    basePricePerNight: 75.0,
    regularPrice: 90.0,
    currency: "EUR",
    isPartner: true,
    promoMessage: "Réservez maintenant et économisez 15€",
    imageMessage: "Réservation directe - Meilleur prix garanti",
    cancellationPolicy: "Annulation gratuite jusqu'à 24h avant l'arrivée",
    latitude: 43.3047,
    longitude: 5.3668,

    // IDs de relations
    accommodationTypeId: "accommodation-hotel-001",
    destinationId: "destination-marseille-joliette-001",
    hotelGroupId: "group-meininger-001",

    // Relations
    accommodationType: {
      id: "accommodation-hotel-001",
      name: "Hôtel",
      code: "HOTEL",
      description: "Hébergement standard avec services hôteliers",
      category: "Standard",
    },
    destination: {
      id: "destination-marseille-joliette-001",
      name: "La Joliette",
      description: "Quartier moderne et dynamique de Marseille",
      type: "neighborhood",
      popularityScore: 85,
      cityId: "city-marseille-001",
      latitude: 43.3047,
      longitude: 5.3668,
    },
    hotelGroup: {
      id: "group-meininger-001",
      name: "MEININGER Hotels",
      description: "Chaîne d'hôtels européenne",
      website: "https://www.meininger-hotels.com",
    },

    // Images selon le schéma HotelImage
    images: [
      {
        id: "img-meininger-001",
        entityId: "hotel-marseille-meininger-001",
        imageUrl: "/hotel/meininger-marseille.png",
        imageType: "hotel",
        order: 1,
        alt: "MEININGER Hotel Marseille Centre La Joliette",
      },
      {
        id: "img-meininger-002",
        entityId: "hotel-marseille-meininger-001",
        imageUrl: "/hotel/meininger1.png",
        imageType: "hotel",
        order: 2,
        alt: "Hall d'accueil MEININGER",
      },
    ],

    // Amenities selon le schéma HotelAmenity
    amenities: [
      {
        id: "amenity-wifi-001",
        name: "WiFi gratuit",
        category: "Internet",
        icon: "wifi",
        description: "Connexion WiFi haute vitesse gratuite",
      },
      {
        id: "amenity-ac-001",
        name: "Climatisation",
        category: "Comfort",
        icon: "snowflake",
        description: "Climatisation dans toutes les chambres",
      },
      {
        id: "amenity-breakfast-001",
        name: "Petit déjeuner buffet",
        category: "Food",
        icon: "coffee",
        description: "Petit déjeuner continental inclus",
      },
    ],

    // Highlights selon le schéma HotelHighlight
    highlights: [
      {
        id: "highlight-port-001",
        title: "Proximité Vieux-Port",
        description: "À seulement 1km du célèbre Vieux-Port",
        category: "Location",
        icon: "map-pin",
        priority: 1,
        isPromoted: true,
        hotelId: "hotel-marseille-meininger-001",
      },
      {
        id: "highlight-beach-001",
        title: "Accès plage",
        description: "Plages accessibles en transport public",
        category: "Location",
        icon: "waves",
        priority: 2,
        isPromoted: false,
        hotelId: "hotel-marseille-meininger-001",
      },
    ],

    // Labels selon le schéma Label
    labels: [
      {
        id: "label-partner-001",
        name: "Partenaire Vérifié",
        code: "PARTNER",
        description: "Hôtel partenaire certifié",
        category: "Business",
        color: "purple",
        priority: 1,
      },
    ],

    // Parking selon le schéma HotelParking
    parking: [
      {
        id: "parking-meininger-001",
        isAvailable: true,
        spaces: 50,
        notes: "Parking privé sécurisé",
      },
    ],

    // AccessibilityOptions
    accessibilityOptions: [
      {
        id: "accessibility-elevator-001",
        name: "Ascenseur",
        code: "ELEVATOR",
        description: "Ascenseur pour accès aux étages",
        category: "Mobility",
      },
    ],

    // Propriétés de compatibilité
    main_image_url: "/hotel/meininger-marseille.png",
    neighborhood: "La Joliette",
    distance_centre: "1 km du centre",
    hotel_highlights: "Proximité Vieux-Port • Accès plage • WiFi gratuit",
    Hotel_amenity: "WiFi gratuit, Climatisation, Petit déjeuner buffet",
  },

  {
    id: "hotel-marseille-intercontinental-002",
    name: "InterContinental Marseille - Hotel Dieu",
    idCity: "city-marseille-001",
    order: 2,
    shortDescription:
      "Hôtel de luxe situé dans un bâtiment historique du 18ème siècle avec vue imprenable sur le Vieux-Port.",
    starRating: 5,
    overallRating: 9.2,
    ratingAdjective: "Exceptionnel",
    reviewCount: 856,
    basePricePerNight: 320.0,
    regularPrice: 380.0,
    currency: "EUR",
    isPartner: true,
    promoMessage: "Offre spéciale été - Économisez 60€",
    imageMessage: "Offre spéciale Direct Horizon",
    cancellationPolicy: "Annulation gratuite jusqu'à 48h avant l'arrivée",
    latitude: 43.2965,
    longitude: 5.3698,

    accommodationTypeId: "accommodation-palace-001",
    destinationId: "destination-marseille-vieuxport-001",
    hotelGroupId: "group-intercontinental-001",

    accommodationType: {
      id: "accommodation-palace-001",
      name: "Palace",
      code: "PALACE",
      description: "Hébergement de luxe avec services premium",
      category: "Luxury",
    },
    destination: {
      id: "destination-marseille-vieuxport-001",
      name: "Vieux-Port",
      description: "Cœur historique de Marseille",
      type: "historic_center",
      popularityScore: 95,
      cityId: "city-marseille-001",
      latitude: 43.2965,
      longitude: 5.3698,
    },
    hotelGroup: {
      id: "group-intercontinental-001",
      name: "InterContinental Hotels Group",
      description: "Groupe hôtelier international de luxe",
      website: "https://www.ihg.com",
    },

    images: [
      {
        id: "img-intercontinental-001",
        entityId: "hotel-marseille-intercontinental-002",
        imageUrl: "/hotel/intercontinental-marseille.png",
        imageType: "hotel",
        order: 1,
        alt: "InterContinental Marseille - Hotel Dieu",
      },
    ],

    amenities: [
      {
        id: "amenity-spa-luxury-001",
        name: "Spa Les Thermes",
        category: "Wellness",
        icon: "spa",
        description: "Spa complet avec soins de luxe",
      },
      {
        id: "amenity-pool-luxury-001",
        name: "Piscine extérieure",
        category: "Recreation",
        icon: "waves",
        description: "Piscine avec vue panoramique",
      },
    ],

    highlights: [
      {
        id: "highlight-spa-intercontinental",
        title: "Spa Les Thermes",
        description: "Spa de luxe avec vue sur le port",
        category: "Wellness",
        priority: 1,
        isPromoted: true,
        hotelId: "hotel-marseille-intercontinental-002",
      },
    ],

    labels: [
      {
        id: "label-luxury-001",
        name: "Luxe",
        code: "LUXURY",
        description: "Établissement de luxe certifié",
        category: "Quality",
        color: "gold",
        priority: 1,
      },
    ],

    parking: [
      {
        id: "parking-intercontinental-001",
        isAvailable: true,
        spaces: 100,
        notes: "Parking privé avec service voiturier",
      },
    ],

    accessibilityOptions: [],

    main_image_url: "/hotel/intercontinental-marseille.png",
    neighborhood: "Vieux-Port",
    distance_centre: "Centre-ville",
  },
];
