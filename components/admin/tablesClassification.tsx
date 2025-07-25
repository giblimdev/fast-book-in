// @/components/admin/tablesClassification.tsx
import { ReactNode } from "react";
import {
  Shield,
  Globe,
  Building2,
  Star,
  Image,
  Link as LinkIcon,
} from "lucide-react";

export interface TableItem {
  name: string;
  description: string;
  count: number;
  icon: string; // Emoji string
}

export interface FamilyClassification {
  family: string;
  description: string;
  icon: ReactNode;
  color: string;
  borderColor: string;
  accentColor: string;
  iconBg: string;
  tables: TableItem[];
}

const familyClassification: FamilyClassification[] = [
  {
    family: "🔐 Authentification & Utilisateurs",
    description: "Gestion des comptes, sessions et authentification",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100",
    borderColor: "border-blue-300",
    accentColor: "from-blue-500 to-indigo-600",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    tables: [
      {
        name: "User",
        description: "Utilisateurs principaux",
        count: 1248,
        icon: "👤",
      },
      {
        name: "Session",
        description: "Sessions actives",
        count: 42,
        icon: "🔑",
      },
      {
        name: "Account",
        description: "Comptes et providers OAuth",
        count: 1248,
        icon: "🆔",
      },
      {
        name: "Verification",
        description: "Vérifications email",
        count: 156,
        icon: "✅",
      },
    ],
  },
  {
    family: "🌍 Géographie & Destinations",
    description: "Structure géographique et destinations touristiques",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100",
    borderColor: "border-emerald-300",
    accentColor: "from-emerald-500 to-teal-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    tables: [
      {
        name: "Country",
        description: "Pays disponibles",
        count: 5,
        icon: "🌍",
      },
      { name: "City", description: "Villes par pays", count: 18, icon: "🏙️" },
      {
        name: "Neighborhood",
        description: "Quartiers par ville",
        count: 67,
        icon: "🏘️",
      },
      {
        name: "Landmark",
        description: "Points d'intérêt",
        count: 134,
        icon: "🗼",
      },
      {
        name: "Destination",
        description: "Destinations touristiques",
        count: 24,
        icon: "✈️",
      },
      {
        name: "Address",
        description: "Adresses détaillées",
        count: 234,
        icon: "📍",
      },
    ],
  },
  {
    family: "🏨 Hébergements Principaux",
    description: "Fiches hôtelières et informations principales",
    icon: <Building2 className="h-6 w-6" />,
    color: "bg-gradient-to-br from-purple-50 via-violet-100 to-fuchsia-100",
    borderColor: "border-purple-300",
    accentColor: "from-purple-500 to-violet-600",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
    tables: [
      {
        name: "HotelCard",
        description: "Fiches hôtels principales",
        count: 156,
        icon: "🏨",
      },
      {
        name: "HotelDetails",
        description: "Détails étendus",
        count: 156,
        icon: "📋",
      },
      {
        name: "AccommodationType",
        description: "Types d'hébergement",
        count: 12,
        icon: "🏠",
      },
      {
        name: "HotelGroup",
        description: "Groupes/chaînes hôtelières",
        count: 8,
        icon: "🏢",
      },
    ],
  },
  {
    family: "⭐ Aménités & Services",
    description: "Équipements, services et caractéristiques",
    icon: <Star className="h-6 w-6" />,
    color: "bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100",
    borderColor: "border-orange-300",
    accentColor: "from-orange-500 to-amber-600",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
    tables: [
      {
        name: "HotelAmenity",
        description: "Aménités hôtel",
        count: 45,
        icon: "🏊",
      },
      {
        name: "RoomAmenity",
        description: "Aménités chambre",
        count: 32,
        icon: "🛏️",
      },
      {
        name: "HotelHighlight",
        description: "Points forts",
        count: 78,
        icon: "✨",
      },
      {
        name: "Label",
        description: "Labels & certifications",
        count: 23,
        icon: "🏷️",
      },
      {
        name: "AccessibilityOption",
        description: "Options accessibilité",
        count: 15,
        icon: "♿",
      },
      {
        name: "HotelParking",
        description: "Gestion parking",
        count: 89,
        icon: "🚗",
      },
    ],
  },
  {
    family: "📸 Médias & Contenu",
    description: "Images et contenu visuel",
    icon: <Image className="h-6 w-6" />,
    color: "bg-gradient-to-br from-pink-50 via-rose-100 to-red-100",
    borderColor: "border-pink-300",
    accentColor: "from-pink-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    tables: [
      {
        name: "HotelImage",
        description: "Images des hébergements",
        count: 1456,
        icon: "📷",
      },
    ],
  },
  {
    family: "🔗 Relations & Jointures",
    description: "Tables de liaison many-to-many",
    icon: <LinkIcon className="h-6 w-6" />,
    color: "bg-gradient-to-br from-indigo-50 via-blue-100 to-cyan-100",
    borderColor: "border-indigo-300",
    accentColor: "from-indigo-500 to-cyan-600",
    iconBg: "bg-gradient-to-br from-indigo-500 to-cyan-600",
    tables: [
      {
        name: "HotelCardToHotelHighlight",
        description: "Hôtel ↔ Points forts",
        count: 156,
        icon: "🔗",
      },
      {
        name: "HotelCardToLabel",
        description: "Hôtel ↔ Labels",
        count: 234,
        icon: "🔗",
      },
      {
        name: "HotelCardToAccessibilityOption",
        description: "Hôtel ↔ Accessibilité",
        count: 78,
        icon: "🔗",
      },
      {
        name: "HotelCardToHotelAmenity",
        description: "Hôtel ↔ Aménités",
        count: 445,
        icon: "🔗",
      },
      {
        name: "HotelDetailsToRoomAmenity",
        description: "Détails ↔ Aménités chambre",
        count: 234,
        icon: "🔗",
      },
      {
        name: "DestinationToCity",
        description: "Destination ↔ Villes",
        count: 45,
        icon: "🔗",
      },
    ],
  },
];

export default familyClassification;

// Export des statistiques calculées pour faciliter la réutilisation
export const getGlobalStats = () => {
  const totalUsers =
    familyClassification[0].tables.find((t) => t.name === "User")?.count || 0;
  const totalHotels =
    familyClassification[2].tables.find((t) => t.name === "HotelCard")?.count ||
    0;
  const totalDestinations =
    familyClassification[1].tables.find((t) => t.name === "Destination")
      ?.count || 0;
  const totalBookings = 3400; // À connecter avec votre API

  return {
    users: totalUsers,
    hotels: totalHotels,
    destinations: totalDestinations,
    bookings: totalBookings,
    usersGrowth: "+12% ce mois",
    hotelsGrowth: "+8% ce mois",
    destinationsGrowth: "+3 nouvelles",
    bookingsGrowth: "+24% ce mois",
  };
};

export const getFamilyStats = () => {
  return familyClassification.map((family) => ({
    ...family,
    totalTables: family.tables.length,
    totalRecords: family.tables.reduce((sum, table) => sum + table.count, 0),
  }));
};
