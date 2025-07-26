// app/com/documentation/schema/page.tsx
"use client";
import React, { useState } from "react";
import {
  Database,
  Users,
  MapPin,
  Building,
  Shield,
  Tag,
  Settings,
  Link,
  Search,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
  Filter,
  Code,
} from "lucide-react";

interface FieldInfo {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  example?: string;
}

interface TableInfo {
  name: string;
  description: string;
  purpose: string;
  keyFields: string[];
  relationships: string[];
  category: string;
  icon: React.ReactNode;
  fields: FieldInfo[];
}

const schemaDocumentation: TableInfo[] = [
  // Tables d'authentification
  {
    name: "User",
    description: "Gestion des utilisateurs de l'application",
    purpose:
      "Stocke les informations des utilisateurs (clients, administrateurs, partenaires)",
    keyFields: ["id", "name", "email", "role", "emailVerified"],
    relationships: ["Session", "Account", "Address"],
    category: "Authentification",
    icon: <Users className="w-6 h-6" />,
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique généré automatiquement",
        required: true,
        example: "cuid_abc123",
      },
      {
        name: "name",
        type: "String",
        description: "Nom complet de l'utilisateur",
        required: true,
        example: "Jean Dupont",
      },
      {
        name: "email",
        type: "String",
        description: "Adresse email unique",
        required: true,
        example: "jean.dupont@example.com",
      },
      {
        name: "emailVerified",
        type: "Boolean",
        description: "Statut de vérification de l'email",
        required: true,
        defaultValue: "false",
      },
      {
        name: "image",
        type: "String?",
        description: "URL de l'avatar utilisateur",
        required: false,
        example: "https://...",
      },
      {
        name: "firstName",
        type: "String?",
        description: "Prénom de l'utilisateur",
        required: false,
        example: "Jean",
      },
      {
        name: "lastName",
        type: "String?",
        description: "Nom de famille de l'utilisateur",
        required: false,
        example: "Dupont",
      },
      {
        name: "role",
        type: "String",
        description: "Rôle de l'utilisateur dans l'application",
        required: true,
        defaultValue: "guest",
        example: "admin, user, partner",
      },
      {
        name: "createdAt",
        type: "DateTime",
        description: "Date de création du compte",
        required: true,
        defaultValue: "now()",
      },
      {
        name: "updatedAt",
        type: "DateTime",
        description: "Date de dernière modification",
        required: true,
      },
    ],
  },
  {
    name: "Session",
    description: "Sessions utilisateur actives",
    purpose: "Gère les sessions de connexion et la sécurité",
    keyFields: ["id", "userId", "token", "expiresAt"],
    relationships: ["User"],
    category: "Authentification",
    icon: <Shield className="w-6 h-6" />,
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique de la session",
        required: true,
        example: "cuid_sess123",
      },
      {
        name: "userId",
        type: "String",
        description: "Référence vers l'utilisateur",
        required: true,
        example: "cuid_abc123",
      },
      {
        name: "token",
        type: "String",
        description: "Token de session unique",
        required: true,
        example: "jwt_token_...",
      },
      {
        name: "expiresAt",
        type: "DateTime",
        description: "Date d'expiration de la session",
        required: true,
        example: "2024-12-31T23:59:59Z",
      },
      {
        name: "ipAddress",
        type: "String?",
        description: "Adresse IP de connexion",
        required: false,
        example: "192.168.1.1",
      },
      {
        name: "userAgent",
        type: "String?",
        description: "Navigateur utilisé",
        required: false,
        example: "Mozilla/5.0...",
      },
    ],
  },
  {
    name: "Country",
    description: "Pays disponibles sur la plateforme",
    purpose: "Organisation géographique de premier niveau",
    keyFields: ["id", "name", "code", "currency", "language"],
    relationships: ["City"],
    category: "Géographie",
    icon: <MapPin className="w-6 h-6" />,
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique du pays",
        required: true,
        example: "uuid_france",
      },
      {
        name: "name",
        type: "String",
        description: "Nom du pays",
        required: true,
        example: "France",
      },
      {
        name: "code",
        type: "String",
        description: "Code ISO du pays",
        required: true,
        example: "FR",
      },
      {
        name: "currency",
        type: "String?",
        description: "Devise principale",
        required: false,
        defaultValue: "€",
        example: "EUR, USD",
      },
      {
        name: "language",
        type: "String?",
        description: "Langue principale",
        required: false,
        example: "fr, en",
      },
      {
        name: "order",
        type: "Int?",
        description: "Ordre d'affichage",
        required: false,
        defaultValue: "100",
      },
    ],
  },
  {
    name: "HotelCard",
    description: "Carte de présentation synthétique des hébergements",
    purpose: "Informations principales pour l'affichage en liste et recherche",
    keyFields: [
      "id",
      "name",
      "starRating",
      "basePricePerNight",
      "overallRating",
    ],
    relationships: [
      "AccommodationType",
      "Destination",
      "HotelGroup",
      "HotelDetails",
    ],
    category: "Hébergement",
    icon: <Building className="w-6 h-6" />,
    fields: [
      {
        name: "id",
        type: "String",
        description: "Identifiant unique de l'hébergement",
        required: true,
        example: "uuid_hotel123",
      },
      {
        name: "name",
        type: "String",
        description: "Nom de l'hébergement",
        required: true,
        example: "Grand Hôtel de Paris",
      },
      {
        name: "starRating",
        type: "Int",
        description: "Classification en étoiles (1-5)",
        required: true,
        example: "4",
      },
      {
        name: "overallRating",
        type: "Float?",
        description: "Note moyenne des clients",
        required: false,
        example: "4.2",
      },
      {
        name: "reviewCount",
        type: "Int",
        description: "Nombre total d'avis",
        required: true,
        defaultValue: "0",
        example: "156",
      },
      {
        name: "basePricePerNight",
        type: "Float",
        description: "Prix de base par nuit",
        required: true,
        example: "120.50",
      },
      {
        name: "regularPrice",
        type: "Float?",
        description: "Prix régulier avant promotion",
        required: false,
        example: "180.00",
      },
      {
        name: "currency",
        type: "String",
        description: "Devise des prix",
        required: true,
        defaultValue: "EUR",
      },
      {
        name: "promoMessage",
        type: "String?",
        description: "Message promotionnel",
        required: false,
        example: "Offre spéciale -30%",
      },
      {
        name: "latitude",
        type: "Float?",
        description: "Coordonnée GPS latitude",
        required: false,
        example: "48.8566",
      },
      {
        name: "longitude",
        type: "Float?",
        description: "Coordonnée GPS longitude",
        required: false,
        example: "2.3522",
      },
    ],
  },
  // Ajoutez les autres tables ici avec leurs champs détaillés...
];

const joinTables = [
  {
    name: "HotelCardToHotelHighlight",
    description: "Liaison entre hébergements and leurs points forts",
    tables: ["HotelCard", "HotelHighlight"],
    purpose: "Permet d'associer plusieurs points forts à un hébergement",
    fields: [
      {
        name: "hotelCardId",
        type: "String",
        description: "Référence vers l'hébergement",
        required: true,
      },
      {
        name: "hotelHighlightId",
        type: "String",
        description: "Référence vers le point fort",
        required: true,
      },
      {
        name: "order",
        type: "Int?",
        description: "Ordre d'affichage",
        required: false,
        defaultValue: "100",
      },
    ],
  },
  // Autres tables de jointure...
];

const FieldDetails = ({ fields }: { fields: FieldInfo[] }) => {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Code className="w-4 h-4 mr-2" />
        Détail des champs
      </h5>
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.name}
            className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                  {field.name}
                </code>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                  {field.type}
                </span>
                {field.required && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                    Requis
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{field.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {field.defaultValue && (
                <span>
                  Défaut:{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    {field.defaultValue}
                  </code>
                </span>
              )}
              {field.example && (
                <span>
                  Exemple:{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    {field.example}
                  </code>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableCard = ({ table }: { table: TableInfo }) => {
  const [showFields, setShowFields] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Authentification":
        return "bg-red-100 text-red-800 border-red-200";
      case "Géographie":
        return "bg-green-100 text-green-800 border-green-200";
      case "Référentiel":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Services":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Hébergement":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border hover:shadow-xl transition-all duration-300 hover:border-blue-300">
      <div className="p-6">
        {/* En-tête avec icône et catégorie */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              {table.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{table.name}</h3>
              <span className="text-sm text-gray-500">
                {table.fields?.length || 0} champs
              </span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
              table.category
            )}`}
          >
            {table.category}
          </span>
        </div>

        {/* Description avec icône d'info */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                {table.description}
              </p>
              <p className="text-sm text-blue-600">{table.purpose}</p>
            </div>
          </div>
        </div>

        {/* Champs clés avec design amélioré */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Champs principaux
          </h4>
          <div className="flex flex-wrap gap-2">
            {table.keyFields.map((field) => (
              <span
                key={field}
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-mono border hover:from-gray-200 hover:to-gray-300 transition-colors"
              >
                {field}
              </span>
            ))}
          </div>
        </div>

        {/* Relations avec design amélioré */}
        {table.relationships.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Link className="w-4 h-4 mr-2" />
              Relations ({table.relationships.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {table.relationships.map((relation) => (
                <span
                  key={relation}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200 hover:from-blue-100 hover:to-blue-150 transition-colors"
                >
                  {relation}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bouton pour afficher/masquer les détails des champs */}
        {table.fields && table.fields.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowFields(!showFields)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors w-full justify-center py-2 rounded-lg hover:bg-blue-50"
            >
              {showFields ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {showFields ? "Masquer" : "Voir"} les détails des champs
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  showFields ? "rotate-90" : ""
                }`}
              />
            </button>

            {showFields && <FieldDetails fields={table.fields} />}
          </div>
        )}
      </div>
    </div>
  );
};

const JoinTableCard = ({ joinTable }: { joinTable: any }) => {
  const [showFields, setShowFields] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Link className="w-5 h-5 text-gray-600" />
        </div>
        <h4 className="font-semibold text-gray-900">{joinTable.name}</h4>
      </div>

      <p className="text-sm text-gray-600 mb-3">{joinTable.description}</p>

      {joinTable.purpose && (
        <p className="text-xs text-gray-500 mb-4 italic">{joinTable.purpose}</p>
      )}

      <div className="flex items-center justify-center space-x-2 mb-4">
        {joinTable.tables.map((table: string, index: number) => (
          <React.Fragment key={table}>
            <span className="bg-white text-gray-700 px-3 py-2 rounded-lg text-sm border shadow-sm font-medium">
              {table}
            </span>
            {index < joinTable.tables.length - 1 && (
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <ChevronRight className="w-4 h-4 text-gray-400 -ml-2" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {joinTable.fields && (
        <div>
          <button
            onClick={() => setShowFields(!showFields)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            {showFields ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>Détails des champs</span>
          </button>

          {showFields && (
            <div className="mt-3 space-y-2">
              {joinTable.fields.map((field: any) => (
                <div
                  key={field.name}
                  className="bg-white rounded-lg p-3 border"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {field.name}
                    </code>
                    <span className="text-xs text-gray-500">{field.type}</span>
                  </div>
                  <p className="text-xs text-gray-600">{field.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function SchemaDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    ...new Set(schemaDocumentation.map((table) => table.category)),
  ];

  const filteredTables = schemaDocumentation.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || table.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header moderne */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Database className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Documentation du Schéma
              </h1>
              <p className="text-xl text-gray-600 mt-3">
                Architecture complète de la base de données FastBooking
              </p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <span>{schemaDocumentation.length} tables principales</span>
                <span>•</span>
                <span>{joinTables.length} tables de jointure</span>
                <span>•</span>
                <span>5 catégories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une table..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vue d'ensemble avec design moderne */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Vue d'ensemble
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => {
              const count = schemaDocumentation.filter(
                (table) => table.category === category
              ).length;
              const isSelected = selectedCategory === category;
              return (
                <div
                  key={category}
                  className={`text-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : category)
                  }
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {count}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Résultats de recherche */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredTables.length} résultat(s) pour "{searchTerm}"
            </p>
          </div>
        )}

        {/* Tables par catégorie */}
        {categories
          .filter(
            (category) => !selectedCategory || selectedCategory === category
          )
          .map((category) => {
            const categoryTables = filteredTables.filter(
              (table) => table.category === category
            );
            if (categoryTables.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <div className="flex items-center space-x-4 mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {category}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {categoryTables.length} table
                    {categoryTables.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {categoryTables.map((table) => (
                    <TableCard key={table.name} table={table} />
                  ))}
                </div>
              </div>
            );
          })}

        {/* Tables de jointure avec design amélioré */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Tables de Jointure
            </h2>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
              {joinTables.length} table{joinTables.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {joinTables.map((joinTable) => (
              <JoinTableCard key={joinTable.name} joinTable={joinTable} />
            ))}
          </div>
        </div>

        {/* Architecture générale avec design moderne */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Architecture Générale
          </h2>
          <div className="prose max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Le schéma FastBooking est conçu selon une architecture modulaire
                organisée en 5 grandes catégories logiques interconnectées :
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <strong className="text-red-800">Authentification</strong>
                    <p className="text-gray-600 text-sm">
                      Gestion sécurisée des utilisateurs, sessions et mécanismes
                      d'authentification
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <strong className="text-green-800">Géographie</strong>
                    <p className="text-gray-600 text-sm">
                      Organisation territoriale hiérarchique (pays → villes →
                      quartiers)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <strong className="text-blue-800">Référentiel</strong>
                    <p className="text-gray-600 text-sm">
                      Données de référence pour la classification des
                      hébergements
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <strong className="text-purple-800">Services</strong>
                    <p className="text-gray-600 text-sm">
                      Équipements, services et options d'accessibilité
                      disponibles
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Building className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <strong className="text-orange-800">Hébergement</strong>
                    <p className="text-gray-600 text-sm">
                      Données centrales des logements et leurs caractéristiques
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Principe des relations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Les tables de jointure implémentent des relations many-to-many
                flexibles qui permettent une modélisation riche des associations
                entre entités. Cette approche garantit l'évolutivité du système
                et facilite l'ajout de nouvelles fonctionnalités sans
                modifications structurelles majeures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
