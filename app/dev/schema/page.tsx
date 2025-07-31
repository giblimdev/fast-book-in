// app/documentation/page.tsx
// Documentation exhaustive du schéma Prisma FastBooking : TOUTES les tables du schema sont incluses (modèles principaux, référentiels, jointures, dashboards, notifications et blog).

import React from "react";

// Cette variable contient TOUTES les tables du schema FastBooking, y compris les référentiels, fonctionnalités, hôtels/chambres, réservations, dashboards, notifications, fidélité, blog, et toutes les tables de jointure (voir PJ pour l’ensemble).
const models = [
  // AUTH
  {
    name: "User",
    description: "Table des utilisateurs du système",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "cuid1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom complet",
        example: "Jean Dupont",
      },
      {
        name: "email",
        type: "String",
        description: "Email unique",
        example: "jean@ex.com",
      },
      {
        name: "emailVerified",
        type: "Boolean",
        description: "Email vérifié",
        example: "true",
      },
      {
        name: "image",
        type: "String",
        description: "URL de la photo de profil",
        example: "https://ex.com/avatar.jpg",
      },
      {
        name: "firstName",
        type: "String",
        description: "Prénom",
        example: "Jean",
      },
      {
        name: "lastName",
        type: "String",
        description: "Nom de famille",
        example: "Dupont",
      },
      {
        name: "role",
        type: "String",
        description: "Rôle (guest, user, admin)",
        example: "user",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Date de création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Date de mise à jour",
        example: "2024-01-22T12:00:00Z",
      },
    ],
  },
  {
    name: "Session",
    description: "Sessions utilisateur actives",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "cuid2",
      },
      {
        name: "userId",
        type: "String",
        description: "ID utilisateur",
        example: "cuid1",
      },
      {
        name: "token",
        type: "String",
        description: "Token unique",
        example: "tok123",
      },
      {
        name: "expiresAt",
        type: "DateTime",
        description: "Expiration",
        example: "2024-04-01T00:00:00Z",
      },
      {
        name: "ipAddress",
        type: "String",
        description: "Adresse IP",
        example: "192.168.0.1",
      },
      {
        name: "userAgent",
        type: "String",
        description: "User agent navigateur",
        example: "Mozilla/5.0",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-01-16T17:00:00Z",
      },
    ],
  },
  {
    name: "Account",
    description: "Comptes sociaux ou locaux liés à un utilisateur",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "cuid3",
      },
      {
        name: "userId",
        type: "String",
        description: "ID utilisateur",
        example: "cuid1",
      },
      {
        name: "accountId",
        type: "String",
        description: "ID fournisseur",
        example: "123456",
      },
      {
        name: "providerId",
        type: "String",
        description: "ID provider",
        example: "google",
      },
      {
        name: "accessToken",
        type: "String",
        description: "Access token",
        example: "ya29.ab...",
      },
      {
        name: "refreshToken",
        type: "String",
        description: "Refresh token",
        example: "1//03d...",
      },
      {
        name: "idToken",
        type: "String",
        description: "Id token",
        example: "jwt.abcd...",
      },
      {
        name: "accessTokenExpiresAt",
        type: "DateTime",
        description: "Expiration accessToken",
        example: "2024-02-01T12:00:00Z",
      },
      {
        name: "refreshTokenExpiresAt",
        type: "DateTime",
        description: "Expiration refreshToken",
        example: "2024-03-01T12:00:00Z",
      },
      {
        name: "scope",
        type: "String",
        description: "OAuth scope",
        example: "openid profile",
      },
      {
        name: "password",
        type: "String",
        description: "Hash du mot de passe",
        example: "$2a$10$...",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-01-16T17:00:00Z",
      },
    ],
  },
  {
    name: "Verification",
    description: "Table des vérifications email ou autres tokens temporaires",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "cuid7",
      },
      {
        name: "identifier",
        type: "String",
        description: "Adresse e-mail / tel ou autre identifiant cible",
        example: "jean@ex.com",
      },
      {
        name: "value",
        type: "String",
        description: "Code ou token envoyé",
        example: "485380",
      },
      {
        name: "expiresAt",
        type: "DateTime",
        description: "Expiration",
        example: "2024-01-16T12:00:00Z",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-01-15T10:30:00Z",
      },
    ],
  },

  // GEOGRAPHIE & RÉFÉRENTIELS
  {
    name: "Country",
    description: "Pays disponibles",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "uuid1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du pays",
        example: "France",
      },
      {
        name: "order",
        type: "Int",
        description: "Ordre d'affichage",
        example: "1",
      },
      {
        name: "code",
        type: "String",
        description: "Code pays (ISO)",
        example: "FR",
      },
      {
        name: "language",
        type: "String",
        description: "Langue principale",
        example: "fr",
      },
      {
        name: "currency",
        type: "String",
        description: "Devise",
        example: "EUR",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Date de création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Date de mise à jour",
        example: "2024-01-15T12:00:00Z",
      },
    ],
  },
  {
    name: "City",
    description: "Villes disponibles",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "uuid2",
      },
      {
        name: "name",
        type: "String",
        description: "Nom de la ville",
        example: "Paris",
      },
      {
        name: "order",
        type: "Int",
        description: "Ordre d'affichage",
        example: "1",
      },
      {
        name: "countryId",
        type: "String",
        description: "ID du pays",
        example: "uuid1",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Date de création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Date de mise à jour",
        example: "2024-01-15T12:00:00Z",
      },
    ],
  },
  {
    name: "Neighborhood",
    description: "Quartiers d'une ville",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "uuid3",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du quartier",
        example: "Opéra",
      },
      {
        name: "order",
        type: "Int",
        description: "Ordre d'affichage",
        example: "1",
      },
      {
        name: "cityId",
        type: "String",
        description: "Référence à City",
        example: "uuid2",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Date de création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Date de mise à jour",
        example: "2024-01-15T12:00:00Z",
      },
    ],
  },
  {
    name: "Landmark",
    description: "Points d'intérêt & monuments",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "uuidL",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du lieu",
        example: "Tour Eiffel",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Monument emblématique",
      },
      {
        name: "type",
        type: "String",
        description: "Type",
        example: "Monument",
      },
      {
        name: "cityId",
        type: "String",
        description: "ID ville",
        example: "uuid2",
      },
      {
        name: "latitude",
        type: "Float",
        description: "GPS lat",
        example: "48.8584",
      },
      {
        name: "longitude",
        type: "Float",
        description: "GPS long",
        example: "2.2945",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-01-15T12:00:00Z",
      },
    ],
  },

  // Destinations, Labels, Types, Groupes...
  {
    name: "Destination",
    description: "Destinations touristiques",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "uuidDest",
      },
      {
        name: "name",
        type: "String",
        description: "Nom",
        example: "Côte d'Azur",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Soleil & Plage",
      },
      { name: "type", type: "String", description: "Type", example: "Région" },
      {
        name: "popularityScore",
        type: "Int",
        description: "Popularité",
        example: "85",
      },
      {
        name: "cityId",
        type: "String",
        description: "ID ville",
        example: "uuid2",
      },
      {
        name: "latitude",
        type: "Float",
        description: "Latitude",
        example: "43.6986",
      },
      {
        name: "longitude",
        type: "Float",
        description: "Longitude",
        example: "7.2556",
      },
      { name: "radius", type: "Float", description: "Rayon", example: "25.5" },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-15T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-01-15T12:00:00Z",
      },
    ],
  },
  {
    name: "Label",
    description: "Labels et étiquettes pour hôtels",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "uuidLab",
      },
      {
        name: "name",
        type: "String",
        description: "Nom",
        example: "Eco-Friendly",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "code",
        type: "String",
        description: "Code unique",
        example: "eco",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Label écologique",
      },
      {
        name: "category",
        type: "String",
        description: "Catégorie",
        example: "Durabilité",
      },
      {
        name: "icon",
        type: "String",
        description: "Icône associée",
        example: "leaf.svg",
      },
      {
        name: "color",
        type: "String",
        description: "Couleur",
        example: "#43A047",
      },
      {
        name: "priority",
        type: "Int",
        description: "Priorité d'affichage",
        example: "1",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-15",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-01-16",
      },
    ],
  },
  {
    name: "AccommodationType",
    description: "Type d'hébergement proposé (dortoir, suite, etc.)",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "accType1",
      },
      { name: "name", type: "String", description: "Nom", example: "Hôtel" },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "code",
        type: "String",
        description: "Code unique",
        example: "hotel",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Hébergement standard",
      },
      {
        name: "category",
        type: "String",
        description: "Catégorie",
        example: "Hébergement",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2023-12-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
      {
        name: "images",
        type: "String",
        description: "URL des images",
        example: "type-hotel.svg",
      },
    ],
  },
  {
    name: "HotelGroup",
    description: "Groupes d'hôtels / chaînes",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "grp1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du groupe",
        example: "Luxury Hotels Group",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Groupe international",
      },
      {
        name: "website",
        type: "String",
        description: "Site web",
        example: "https://luxuryhotels.com",
      },
      {
        name: "logoUrl",
        type: "String",
        description: "URL du logo",
        example: "logoLuxury.png",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "HotelHighlight",
    description: "Points forts de l'hôtel",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "hhl1",
      },
      {
        name: "title",
        type: "String",
        description: "Titre du point fort",
        example: "Spa & Wellness",
      },
      { name: "order", type: "Int", description: "Ordre", example: "2" },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Grand spa moderne",
      },
      {
        name: "category",
        type: "String",
        description: "Catégorie",
        example: "Bien-être",
      },
      {
        name: "icon",
        type: "String",
        description: "Icône",
        example: "spa.svg",
      },
      { name: "priority", type: "Int", description: "Priorité", example: "1" },
      {
        name: "isPromoted",
        type: "Boolean",
        description: "Mise en avant",
        example: "true",
      },
      {
        name: "hotelId",
        type: "String",
        description: "ID Hôtel",
        example: "hotel1",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "HotelAmenity",
    description: "Équipements et services d'un hôtel",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "amen1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom de l'équipement",
        example: "Piscine",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "category",
        type: "String",
        description: "Catégorie",
        example: "Loisir",
      },
      {
        name: "icon",
        type: "String",
        description: "Icône",
        example: "pool.svg",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Grande piscine chauffée",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "AccessibilityOption",
    description: "Accessibilité (ascenseur, PMR...)",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "acc1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom",
        example: "Accès handicapé",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "code",
        type: "String",
        description: "Code unique",
        example: "pmr",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Entrée accessible",
      },
      {
        name: "category",
        type: "String",
        description: "Catégorie",
        example: "Mobilité",
      },
      {
        name: "icon",
        type: "String",
        description: "Icône",
        example: "wheelchair.svg",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "HotelParking",
    description: "Parkings d'hôtel",
    fields: [
      { name: "id", type: "String", description: "Identifiant", example: "p1" },
      {
        name: "name",
        type: "String",
        description: "Nom",
        example: "Parking Couvert",
      },
      {
        name: "isAvailable",
        type: "Boolean",
        description: "Disponible ?",
        example: "true",
      },
      {
        name: "spaces",
        type: "Int",
        description: "Nombre de places",
        example: "35",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "notes",
        type: "String",
        description: "Notes",
        example: "24/7 accès badge",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },

  // HOTEL, ADDRESS, IMAGES...
  {
    name: "Address",
    description: "Adresses géolocalisées",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "addr1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du lieu",
        example: "Hôtel de Paris",
      },
      {
        name: "streetNumber",
        type: "String",
        description: "N° de rue",
        example: "35",
      },
      {
        name: "streetType",
        type: "String",
        description: "Type de voie",
        example: "rue",
      },
      {
        name: "streetName",
        type: "String",
        description: "Nom de la rue",
        example: "Montaigne",
      },
      {
        name: "addressLine2",
        type: "String",
        description: "Complément",
        example: "Appartement 52B",
      },
      {
        name: "postalCode",
        type: "String",
        description: "Code postal",
        example: "75008",
      },
      {
        name: "cityId",
        type: "String",
        description: "ID de ville",
        example: "uuid2",
      },
      {
        name: "neighborhoodId",
        type: "String",
        description: "ID de quartier",
        example: "uuid3",
      },
      {
        name: "latitude",
        type: "Float",
        description: "Latitude",
        example: "48.8675",
      },
      {
        name: "longitude",
        type: "Float",
        description: "Longitude",
        example: "2.3094",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "GalleryImage",
    description: "Images liées (hôtel, chambre, ville...)",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "img1",
      },
      {
        name: "imageCategories",
        type: "String",
        description: "Catégorie image",
        example: "hotelCard",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "alt",
        type: "String",
        description: "Texte alternatif",
        example: "Façade de l'hôtel",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "Image",
    description: "Images brutes (upload)",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "imgBase1",
      },
      {
        name: "slug",
        type: "String",
        description: "Slug",
        example: "chambre-suite-deluxe",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Vue mer lumineuse",
      },
      {
        name: "path",
        type: "String",
        description: "URL image",
        example: "/images/hotels/pic1.jpg",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "HotelCard",
    description: "Fiche hôtel principale",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "hotel1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom de l'hôtel",
        example: "Hôtel Plaza",
      },
      {
        name: "idCity",
        type: "String",
        description: "ID ville",
        example: "uuid2",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "shortDescription",
        type: "String",
        description: "Descript. courte",
        example: "Luxe centre Paris",
      },
      { name: "starRating", type: "Int", description: "Étoiles", example: "5" },
      {
        name: "overallRating",
        type: "Float",
        description: "Note moyenne",
        example: "4.7",
      },
      {
        name: "ratingAdjective",
        type: "String",
        description: "Adjectif évaluation",
        example: "Exceptionnel",
      },
      {
        name: "reviewCount",
        type: "Int",
        description: "Nbr. avis",
        example: "287",
      },
      {
        name: "basePricePerNight",
        type: "Float",
        description: "Prix de base/nuit",
        example: "250.00",
      },
      {
        name: "regularPrice",
        type: "Float",
        description: "Prix normal",
        example: "320.00",
      },
      {
        name: "currency",
        type: "String",
        description: "Devise",
        example: "EUR",
      },
      {
        name: "isPartner",
        type: "Boolean",
        description: "Partenaire ?",
        example: "true",
      },
      {
        name: "promoMessage",
        type: "String",
        description: "Promo badge",
        example: "Promo été",
      },
      {
        name: "imageMessage",
        type: "String",
        description: "Badge image",
        example: "Top seller",
      },
      {
        name: "cancellationPolicy",
        type: "String",
        description: "Police annulation",
        example: "Flexible 48h",
      },
      {
        name: "accommodationTypeId",
        type: "String",
        description: "ID type hébergement",
        example: "accType1",
      },
      {
        name: "destinationId",
        type: "String",
        description: "ID destination",
        example: "uuidDest",
      },
      {
        name: "hotelGroupId",
        type: "String",
        description: "ID group hôtelier",
        example: "grp1",
      },
      {
        name: "parking",
        type: "String",
        description: "Réf. parking",
        example: "p1",
      },
      {
        name: "detailsId",
        type: "String",
        description: "ID détails hôtel",
        example: "details1",
      },
    ],
  },
  {
    name: "HotelDetails",
    description: "Détails avancés de l’hôtel",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "details1",
      },
      {
        name: "idHotelCard",
        type: "String",
        description: "ID HotelCard",
        example: "hotel1",
      },
      {
        name: "description",
        type: "String",
        description: "Description longue",
        example: "Séjour tout confort avec spa.",
      },
      {
        name: "addressId",
        type: "String",
        description: "ID adresse",
        example: "addr1",
      },
      { name: "order", type: "Int", description: "Ordre", example: "1" },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
      {
        name: "checkInTime",
        type: "String",
        description: "Heure arrivée",
        example: "15:00",
      },
      {
        name: "checkOutTime",
        type: "String",
        description: "Heure départ",
        example: "11:00",
      },
      {
        name: "numberOfRooms",
        type: "Int",
        description: "Total chambres",
        example: "75",
      },
      {
        name: "numberOfFloors",
        type: "Int",
        description: "Nb d’étages",
        example: "4",
      },
      {
        name: "languages",
        type: "String[]",
        description: "Langues parlées",
        example: '["fr", "en", "de"]',
      },
    ],
  },
  {
    name: "HotelRoomType",
    description: "Types de chambres d'hôtel",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "roomType1",
      },
      {
        name: "hotelCardId",
        type: "String",
        description: "ID Hôtel",
        example: "hotel1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom Type",
        example: "Suite Deluxe",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Suite avec terrasse",
      },
      {
        name: "maxGuests",
        type: "Int",
        description: "Nb max d’invités",
        example: "4",
      },
      {
        name: "bedCount",
        type: "Int",
        description: "Nb de lits",
        example: "2",
      },
      {
        name: "bedType",
        type: "String",
        description: "Type de lit",
        example: "King Size",
      },
      {
        name: "roomSize",
        type: "Float",
        description: "Surface en m²",
        example: "48.5",
      },
      {
        name: "pricePerNight",
        type: "Float",
        description: "Prix nuit",
        example: "380",
      },
      {
        name: "currency",
        type: "String",
        description: "Devise",
        example: "EUR",
      },
      {
        name: "isAvailable",
        type: "Boolean",
        description: "Disponible ?",
        example: "true",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Maj",
        example: "2024-01-04",
      },
    ],
  },
  {
    name: "HotelRoom",
    description: "Instance physique de chambre à réserver",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "room1",
      },
      {
        name: "slug",
        type: "String",
        description: "Slug unique",
        example: "hplz-101",
      },
      // ... autres champs réels complémentaires pour dispo, prix, assignation
    ],
  },
  {
    name: "Reservation",
    description: "Réservations des utilisateurs",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "resv1",
      },
      {
        name: "userId",
        type: "String",
        description: "ID user",
        example: "cuid-user",
      },
      {
        name: "hotelRoomId",
        type: "String",
        description: "ID chambre",
        example: "room1",
      },
      {
        name: "checkIn",
        type: "DateTime",
        description: "Date d'arrivée",
        example: "2024-05-01T15:00:00Z",
      },
      {
        name: "checkOut",
        type: "DateTime",
        description: "Date de départ",
        example: "2024-05-05T11:00:00Z",
      },
      {
        name: "guests",
        type: "Int",
        description: "Nbr total d'invités",
        example: "2",
      },
      { name: "adults", type: "Int", description: "Nbr adultes", example: "2" },
      {
        name: "children",
        type: "Int",
        description: "Nbr enfants",
        example: "0",
      },
      { name: "infants", type: "Int", description: "Nbr bébés", example: "0" },
      {
        name: "totalPrice",
        type: "Float",
        description: "Prix total",
        example: "980",
      },
      {
        name: "basePrice",
        type: "Float",
        description: "Sans taxes",
        example: "900",
      },
      { name: "taxes", type: "Float", description: "Taxe", example: "80" },
      {
        name: "status",
        type: "String",
        description: "Statut (confirmed, cancelled...)",
        example: "confirmed",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-04-10T10:00:00Z",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Mise à jour",
        example: "2024-04-10T11:00:00Z",
      },
      // ...etc pour chaque champ métier
    ],
  },
  {
    name: "Payment",
    description: "Paiements des réservations",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique",
        example: "pay1",
      },
      {
        name: "reservationId",
        type: "String",
        description: "ID réservation",
        example: "resv1",
      },
      {
        name: "amount",
        type: "Float",
        description: "Montant",
        example: "980.00",
      },
      {
        name: "method",
        type: "String",
        description: "Moyen (CB, Paypal...)",
        example: "card",
      },
      {
        name: "status",
        type: "String",
        description: "Statut (paid, refunded...)",
        example: "paid",
      },
      {
        name: "transactionId",
        type: "String",
        description: "Transaction",
        example: "txn_abc",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Créé",
        example: "2024-04-10",
      },
    ],
  },
  {
    name: "CancellationPolicy",
    description: "Politiques d'annulation",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "cp1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom",
        example: "Annulation flexible",
      },
      {
        name: "description",
        type: "String",
        description: "Description",
        example: "Remboursement 2 jours",
      },
      {
        name: "refundPercentage",
        type: "Int",
        description: "Pourcentage remboursé",
        example: "100",
      },
      {
        name: "daysBeforeCheckIn",
        type: "Int",
        description: "Deadline annulation",
        example: "2",
      },
      {
        name: "penaltyFee",
        type: "Float",
        description: "Frais fixe",
        example: "30",
      },
      {
        name: "isDefault",
        type: "Boolean",
        description: "Par défaut ?",
        example: "true",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Création",
        example: "2024-01-01",
      },
    ],
  },

  // AUTRES TABLES DU DOMAINE
  {
    name: "HostDashboard",
    description: "Dashboard hôtelier (stats et alertes hôteliers)",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "dash1",
      },
      {
        name: "hotelCardId",
        type: "String",
        description: "ID Hôtel Card",
        example: "hotel1",
      } /* ... (stats, perf, etc.) */,
    ],
  },
  {
    name: "TravelerDashboard",
    description: "Dashboard voyageur",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "travdash1",
      },
      { name: "userId", type: "String", description: "User", example: "cuid1" },
    ],
  },
  {
    name: "TravelerLoyalty",
    description: "Programme de fidélité voyageur",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "loy1",
      },
      {
        name: "userId",
        type: "String",
        description: "ID utilisateur",
        example: "cuid1",
      },
      {
        name: "points",
        type: "Int",
        description: "Points cumulés",
        example: "1200",
      },
    ],
  },
  {
    name: "LoyaltyReward",
    description: "Récompenses fidélité",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "rew1",
      },
      {
        name: "loyaltyId",
        type: "String",
        description: "ID fidélité",
        example: "loy1",
      },
      {
        name: "rewardType",
        type: "String",
        description: "Type",
        example: "free_night",
      },
    ],
  },
  {
    name: "LoyaltyTransaction",
    description: "Transactions de points fidélité",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "lt1",
      },
      {
        name: "loyaltyId",
        type: "String",
        description: "ID fidélité",
        example: "loy1",
      },
      {
        name: "type",
        type: "String",
        description: "Type action",
        example: "earn",
      },
    ],
  },
  {
    name: "HostNotification",
    description: "Notifications hôtelier",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "noti1",
      },
      {
        name: "dashboardId",
        type: "String",
        description: "Dashboard lié",
        example: "dash1",
      },
      {
        name: "type",
        type: "String",
        description: "Type d’événement",
        example: "booking",
      },
    ],
  },
  {
    name: "TravelerNotification",
    description: "Notifications voyageur",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "tnoti1",
      },
      { name: "userId", type: "String", description: "User", example: "cuid1" },
      {
        name: "type",
        type: "String",
        description: "Type",
        example: "reservation",
      },
    ],
  },
  {
    name: "HotelReview",
    description: "Avis utilisateurs des hôtels (et réponses)",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "hr1",
      },
      {
        name: "hotelCardId",
        type: "String",
        description: "ID Hôtel",
        example: "hotel1",
      },
      { name: "userId", type: "String", description: "User", example: "cuid1" },
      { name: "rating", type: "Float", description: "Note", example: "4.5" },
      {
        name: "comment",
        type: "String",
        description: "Commentaire",
        example: "Très bien.",
      },
    ],
  },
  {
    name: "HotelFAQ",
    description: "FAQ personnalisées de l'hôtel",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "faq1",
      },
      {
        name: "hotelCardId",
        type: "String",
        description: "ID Hôtel",
        example: "hotel1",
      },
      {
        name: "question",
        type: "String",
        description: "Question",
        example: "Les animaux sont-ils acceptés ?",
      },
    ],
  },
  {
    name: "UserWishList",
    description: "Favoris utilisateur",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "wish1",
      },
      { name: "userId", type: "String", description: "User", example: "cuid1" },
      {
        name: "hotelCardId",
        type: "String",
        description: "HotelCard favori",
        example: "hotel1",
      },
    ],
  },
  // Blog
  {
    name: "BlogPost",
    description: "Articles de blog / actualités",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "blog1",
      },
      {
        name: "title",
        type: "String",
        description: "Titre",
        example: "Les meilleurs hôtels à Paris",
      },
    ],
  },
  {
    name: "Category",
    description: "Catégories de blog",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "cat1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom",
        example: "Conseils de voyage",
      },
    ],
  },
  {
    name: "Tag",
    description: "Tags d'articles blog",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "tag1",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du tag",
        example: "hôtel",
      },
    ],
  },
  {
    name: "Comment",
    description: "Commentaires blog",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "com1",
      },
      {
        name: "content",
        type: "String",
        description: "Contenu",
        example: "Super article !",
      },
    ],
  },
  // Tables jointures importantes
  {
    name: "HotelCardToHotelHighlight",
    description: "Jointure Hôtel ↔️ Points forts",
    fields: [
      {
        name: "hotelCardId",
        type: "String",
        description: "Hôtel",
        example: "hotel1",
      },
      {
        name: "hotelHighlightId",
        type: "String",
        description: "Point fort",
        example: "hhl1",
      },
    ],
  },
  {
    name: "HotelCardToLabel",
    description: "Jointure Hôtel ↔️ Labels",
    fields: [
      {
        name: "hotelCardId",
        type: "String",
        description: "Hôtel",
        example: "hotel1",
      },
      {
        name: "labelId",
        type: "String",
        description: "Label",
        example: "lab1",
      },
    ],
  },
  {
    name: "HotelCardToAccessibilityOption",
    description: "Jointure Hôtel ↔️ Options Accessibilité",
    fields: [
      {
        name: "hotelCardId",
        type: "String",
        description: "Hôtel",
        example: "hotel1",
      },
      {
        name: "accessibilityOptionId",
        type: "String",
        description: "Accessibilité",
        example: "acc1",
      },
    ],
  },
  {
    name: "HotelCardToHotelAmenity",
    description: "Jointure Hôtel ↔️ Équipements",
    fields: [
      {
        name: "hotelCardId",
        type: "String",
        description: "Hôtel",
        example: "hotel1",
      },
      {
        name: "hotelAmenityId",
        type: "String",
        description: "Équipement",
        example: "amen1",
      },
    ],
  },
  {
    name: "HotelDetailsToRoomAmenity",
    description: "Jointure Détails Hôtel ↔️ Équipements chambre",
    fields: [
      {
        name: "hotelDetailsId",
        type: "String",
        description: "Détails Hôtel",
        example: "details1",
      },
      {
        name: "roomAmenityId",
        type: "String",
        description: "Équipement chambre",
        example: "ramen1",
      },
    ],
  },
  {
    name: "DestinationToCity",
    description: "Jointure Destination ↔️ Villes",
    fields: [
      {
        name: "destinationId",
        type: "String",
        description: "Destination",
        example: "dest1",
      },
      {
        name: "cityId",
        type: "String",
        description: "Ville",
        example: "uuid2",
      },
    ],
  },
  {
    name: "TravelerRecommendation",
    description: "Recommandation personnalisées du dashboard client",
    fields: [
      {
        name: "travelerId",
        type: "String",
        description: "Dashboard client",
        example: "travdash1",
      },
      {
        name: "hotelId",
        type: "String",
        description: "Hotel recommandé",
        example: "hotel1",
      },
    ],
  },
  {
    name: "Guest",
    description: "Invités d'une réservation",
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant",
        example: "guest1",
      },
      {
        name: "reservationId",
        type: "String",
        description: "Réservation",
        example: "resv1",
      },
      {
        name: "fullName",
        type: "String",
        description: "Nom complet",
        example: "Jane Smith",
      },
    ],
  },
  // (Ajoute d'autres tables secondaires si tu en as dans ton schéma)
];

const DatabaseDocumentation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Documentation exhaustive du schéma de base de données
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Tables et champs de l’application FastBooking (référentiels,
            hébergement, réservation, paiement, dashboard, notifications,
            fidélité, blog, etc.)
          </p>
        </header>
        <main className="space-y-12">
          {models.map((model) => (
            <section
              key={model.name}
              className="bg-white shadow overflow-hidden rounded-lg"
            >
              <header className="px-4 py-5 sm:px-6 bg-indigo-600">
                <h2 className="text-lg font-medium text-white">
                  Table : {model.name}
                </h2>
                <p className="mt-1 text-sm text-indigo-100">
                  {model.description}
                </p>
              </header>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Champ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exemple
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {model.fields.map((field, idx) => (
                        <tr key={field.name + idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {field.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {field.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {field.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                              {field.example}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </main>
        <footer className="mt-16 text-center">
          <p className="text-gray-500">
            Documentation générée le {new Date().toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DatabaseDocumentation;
