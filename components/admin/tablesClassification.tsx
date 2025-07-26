// @/components/admin/tablesClassification.tsx
import React from "react";
import {
  Shield,
  MapPin,
  Building,
  Cog,
  Database,
  Users,
  Star,
  Bed,
  FileText,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

const familyClassification = [
  {
    family: "Authentification & Sécurité",
    description: "Gestion des utilisateurs, sessions et authentification",
    icon: <Shield className="h-6 w-6 text-red-600" />,
    color: "bg-gradient-to-br from-red-50 to-pink-50",
    borderColor: "border-red-200",
    iconBg: "bg-red-100",
    accentColor: "from-red-500 to-pink-500",
    tables: [
      {
        name: "User",
        description: "Comptes utilisateurs de la plateforme",
        icon: "👤",
        count: 1248,
      },
      {
        name: "Session",
        description: "Sessions actives des utilisateurs",
        icon: "🔐",
        count: 342,
      },
      {
        name: "Account",
        description: "Comptes de connexion (OAuth, etc.)",
        icon: "🔑",
        count: 1456,
      },
      {
        name: "Verification",
        description: "Codes de vérification email/SMS",
        icon: "✅",
        count: 89,
      },
    ],
  },

  {
    family: "Géographie & Localisation",
    description: "Organisation territoriale et géographique",
    icon: <MapPin className="h-6 w-6 text-green-600" />,
    color: "bg-gradient-to-br from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-100",
    accentColor: "from-green-500 to-emerald-500",
    tables: [
      {
        name: "Country",
        description: "Pays disponibles sur la plateforme",
        icon: "🌍",
        count: 25,
      },
      {
        name: "City",
        description: "Villes avec hébergements",
        icon: "🏙️",
        count: 156,
      },
      {
        name: "Neighborhood",
        description: "Quartiers et zones locales",
        icon: "🏘️",
        count: 234,
      },
      {
        name: "Landmark",
        description: "Points d'intérêt touristiques",
        icon: "🗺️",
        count: 567,
      },
      {
        name: "Address",
        description: "Adresses physiques complètes",
        icon: "📍",
        count: 1890,
      },
    ],
  },

  {
    family: "Référentiel Hôtelier",
    description: "Données de référence pour la classification des hébergements",
    icon: <Building className="h-6 w-6 text-blue-600" />,
    color: "bg-gradient-to-br from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    accentColor: "from-blue-500 to-cyan-500",
    tables: [
      {
        name: "AccommodationType",
        description: "Types d'hébergement (Hôtel, Villa, etc.)",
        icon: "🏨",
        count: 12,
      },
      {
        name: "Destination",
        description: "Destinations touristiques populaires",
        icon: "🌟",
        count: 45,
      },
      {
        name: "Label",
        description: "Labels et certifications",
        icon: "🏷️",
        count: 28,
      },
      {
        name: "HotelGroup",
        description: "Groupes hôteliers et chaînes",
        icon: "🏢",
        count: 18,
      },
    ],
  },

  {
    family: "Services & Équipements",
    description: "Équipements, services et options disponibles",
    icon: <Cog className="h-6 w-6 text-purple-600" />,
    color: "bg-gradient-to-br from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-100",
    accentColor: "from-purple-500 to-violet-500",
    tables: [
      {
        name: "HotelAmenity",
        description: "Équipements de l'hôtel",
        icon: "🛠️",
        count: 67,
      },
      {
        name: "RoomAmenity",
        description: "Équipements des chambres",
        icon: "🛏️",
        count: 45,
      },
      {
        name: "HotelHighlight",
        description: "Points forts mis en avant",
        icon: "⭐",
        count: 134,
      },
      {
        name: "AccessibilityOption",
        description: "Options d'accessibilité",
        icon: "♿",
        count: 23,
      },
      {
        name: "HotelParking",
        description: "Informations parking",
        icon: "🅿️",
        count: 89,
      },
    ],
  },

  {
    family: "Hébergement Principal",
    description: "Données centrales des hébergements et leurs détails",
    icon: <Database className="h-6 w-6 text-orange-600" />,
    color: "bg-gradient-to-br from-orange-50 to-amber-50",
    borderColor: "border-orange-200",
    iconBg: "bg-orange-100",
    accentColor: "from-orange-500 to-amber-500",
    tables: [
      {
        name: "HotelCard",
        description: "Fiches synthétiques des hébergements",
        icon: "🏨",
        count: 156,
      },
      {
        name: "HotelDetails",
        description: "Informations détaillées des hôtels",
        icon: "📋",
        count: 156,
      },
      {
        name: "HotelImage",
        description: "Galerie photos des hébergements",
        icon: "📸",
        count: 2340,
      },
    ],
  },

  // 🆕 NOUVELLE SECTION AJOUTÉE
  {
    family: "Réservation & Contenu",
    description: "Avis clients, chambres, politiques et support",
    icon: <Users className="h-6 w-6 text-teal-600" />,
    color: "bg-gradient-to-br from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    iconBg: "bg-teal-100",
    accentColor: "from-teal-500 to-cyan-500",
    tables: [
      {
        name: "HotelReview",
        description: "Avis et évaluations des clients",
        icon: "⭐",
        count: 3247,
      },
      {
        name: "HotelRoom",
        description: "Chambres et tarifs disponibles",
        icon: "🛏️",
        count: 892,
      },
      {
        name: "HotelPolicy",
        description: "Conditions et règlements des hôtels",
        icon: "📜",
        count: 156,
      },
      {
        name: "HotelFAQ",
        description: "Questions fréquemment posées",
        icon: "❓",
        count: 445,
      },
    ],
  },
];

export default familyClassification;
