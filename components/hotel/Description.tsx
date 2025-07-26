// @/components/hotel/Description.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Users,
  Calendar,
  Shield,
  Award,
  Building2,
  Globe,
} from "lucide-react";

// Types basés sur votre schéma Prisma
interface DescriptionProps {
  hotel?: {
    id: string;
    name: string;
    shortDescription?: string;
    starRating: number;
    overallRating?: number;
    reviewCount: number;
    ratingAdjective?: string;
    currency: string;
    accommodationType?: {
      name: string;
      category: string;
    };
    destination?: {
      name: string;
      type: string;
    };
    hotelGroup?: {
      name: string;
    };
    details?: {
      description?: string;
      address: {
        streetNumber?: string;
        streetName: string;
        postalCode: string;
        city: { name: string };
        neighborhood?: { name: string };
      };
    };
    amenities?: Array<{
      name: string;
      category: string;
      icon?: string;
      description?: string;
    }>;
    highlights?: Array<{
      title: string;
      category: string;
      icon?: string;
      description?: string;
    }>;
    labels?: Array<{
      name: string;
      color: string;
      icon?: string;
      category: string;
    }>;
    parking?: Array<{
      isAvailable: boolean;
      spaces?: number;
      notes?: string;
    }>;
    cancellationPolicy?: string;
  };
}

// Données simulées enrichies
const mockHotel = {
  id: "hotel-001",
  name: "Hotel Le Grand Paris",
  shortDescription: "Hôtel de luxe au cœur de Paris avec vue sur la Seine",
  starRating: 4,
  overallRating: 4.5,
  reviewCount: 342,
  ratingAdjective: "Excellent",
  currency: "EUR",
  accommodationType: {
    name: "Hôtel de Luxe",
    category: "Premium",
  },
  destination: {
    name: "Centre Historique de Paris",
    type: "Zone touristique",
  },
  hotelGroup: {
    name: "Collection Paris Hotels",
  },
  details: {
    description: `Situé dans un magnifique bâtiment haussmannien du 19ème siècle, l'Hotel Le Grand Paris incarne l'élégance française dans toute sa splendeur. 

    Chaque chambre et suite a été méticuleusement conçue pour offrir un parfait équilibre entre le charme d'antan et le confort moderne. Les hauts plafonds ornés de moulures, les parquets en chêne massif et les tissus précieux créent une atmosphère raffinée et chaleureuse.

    Notre établissement dispose de 120 chambres et suites, dont 15 suites avec vue panoramique sur la Seine. Le restaurant gastronomique "Le Rivoli", dirigé par le chef étoilé Antoine Dubois, propose une cuisine française contemporaine sublimant les produits du terroir.

    L'hôtel abrite également un spa de 800m² avec hammam, sauna, piscine intérieure chauffée et 6 cabines de soins. Notre équipe de concierges, membre des "Clefs d'Or", sera ravie de vous faire découvrir les secrets les mieux gardés de Paris.

    Idéalement situé à deux pas du Louvre et des Tuileries, l'hôtel constitue le point de départ parfait pour explorer la Ville Lumière. Les stations de métro Palais-Royal et Châtelet-Les Halles sont accessibles à pied en moins de 5 minutes.`,
    address: {
      streetNumber: "123",
      streetName: "Rue de Rivoli",
      postalCode: "75001",
      city: { name: "Paris" },
      neighborhood: { name: "Louvre - Châtelet" },
    },
  },
  amenities: [
    {
      name: "Restaurant gastronomique",
      category: "Restauration",
      icon: "restaurant",
      description: "Restaurant étoilé avec chef reconnu",
    },
    {
      name: "Spa & Piscine",
      category: "Bien-être",
      icon: "spa",
      description: "Spa de 800m² avec piscine intérieure chauffée",
    },
    {
      name: "Service de conciergerie",
      category: "Service",
      icon: "concierge",
      description: "Concierges membres des Clefs d'Or",
    },
    {
      name: "WiFi haut débit gratuit",
      category: "Connectivité",
      icon: "wifi",
      description: "Internet très haut débit dans tout l'établissement",
    },
    {
      name: "Centre d'affaires",
      category: "Travail",
      icon: "business",
      description: "Salles de réunion et équipements professionnels",
    },
    {
      name: "Service en chambre 24h/24",
      category: "Service",
      icon: "room-service",
      description: "Service en chambre disponible à toute heure",
    },
  ],
  highlights: [
    {
      title: "Architecture haussmannienne",
      category: "Histoire",
      icon: "🏛️",
      description:
        "Bâtiment historique du 19ème siècle magnifiquement préservé",
    },
    {
      title: "Vue sur la Seine",
      category: "Vue",
      icon: "🌊",
      description: "15 suites avec vue panoramique sur la Seine et ses ponts",
    },
    {
      title: "Chef étoilé Michelin",
      category: "Gastronomie",
      icon: "⭐",
      description: "Restaurant dirigé par Antoine Dubois, chef étoilé",
    },
    {
      title: "Emplacement privilégié",
      category: "Localisation",
      icon: "📍",
      description: "À 2 minutes à pied du Louvre et des Tuileries",
    },
  ],
  labels: [
    {
      name: "Éco-responsable",
      color: "green",
      icon: "🌱",
      category: "Environnement",
    },
    {
      name: "Petit-déjeuner inclus",
      color: "blue",
      icon: "🥐",
      category: "Restauration",
    },
    {
      name: "Monument historique",
      color: "purple",
      icon: "🏛️",
      category: "Patrimoine",
    },
  ],
  parking: [
    {
      isAvailable: true,
      spaces: 50,
      notes: "Parking souterrain sécurisé avec service voiturier disponible",
    },
  ],
  cancellationPolicy: "Annulation gratuite jusqu'à 24h avant l'arrivée",
};

export default function Description({ hotel = mockHotel }: DescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "amenities" | "highlights"
  >("description");

  const shortText = hotel.details?.description?.substring(0, 400) + "...";
  const shouldShowReadMore = (hotel.details?.description?.length || 0) > 400;

  const getAmenityIcon = (iconName?: string) => {
    switch (iconName) {
      case "restaurant":
        return "🍽️";
      case "spa":
        return "🧘";
      case "concierge":
        return "🛎️";
      case "wifi":
        return "📶";
      case "business":
        return "💼";
      case "room-service":
        return "🛏️";
      default:
        return "✨";
    }
  };

  return (
    <div id="description" className="space-y-6">
      {/* En-tête de section */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Découvrez {hotel.name}
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {hotel.shortDescription}
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {hotel.starRating}
            </div>
            <div className="text-sm text-gray-600">Étoiles</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {hotel.overallRating}
            </div>
            <div className="text-sm text-gray-600">{hotel.ratingAdjective}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {hotel.reviewCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Avis clients</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">
              {hotel.accommodationType?.category}
            </div>
            <div className="text-sm text-gray-600">Catégorie</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <Card>
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "description"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Description détaillée
            </button>
            <button
              onClick={() => setActiveTab("amenities")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "amenities"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Services & Équipements
            </button>
            <button
              onClick={() => setActiveTab("highlights")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "highlights"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Points forts
            </button>
          </nav>
        </div>

        <CardContent className="p-6">
          {/* Onglet Description */}
          {activeTab === "description" && (
            <div className="space-y-6">
              <div className="prose max-w-none">
                {hotel.details?.description && (
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {isExpanded || !shouldShowReadMore
                      ? hotel.details.description
                      : shortText}
                  </div>
                )}

                {shouldShowReadMore && (
                  <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {isExpanded ? (
                      <>
                        Voir moins <ChevronUp className="ml-1 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Lire la suite <ChevronDown className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Informations pratiques */}
              <div className="grid md:grid-cols-2 gap-6 mt-8 pt-6 border-t">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Localisation
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Quartier :</strong> {hotel.destination?.name}
                    </p>
                    <p>
                      <strong>Type de zone :</strong> {hotel.destination?.type}
                    </p>
                    {hotel.details?.address && (
                      <p>
                        <strong>Adresse :</strong>{" "}
                        {hotel.details.address.streetNumber}{" "}
                        {hotel.details.address.streetName},{" "}
                        {hotel.details.address.postalCode}{" "}
                        {hotel.details.address.city.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Établissement
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Groupe :</strong> {hotel.hotelGroup?.name}
                    </p>
                    <p>
                      <strong>Classification :</strong> {hotel.starRating}{" "}
                      étoiles
                    </p>
                    <p>
                      <strong>Catégorie :</strong>{" "}
                      {hotel.accommodationType?.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Politique d'annulation */}
              {hotel.cancellationPolicy && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">
                        Politique d'annulation
                      </h4>
                      <p className="text-sm text-green-800">
                        {hotel.cancellationPolicy}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Équipements */}
          {activeTab === "amenities" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Services & Équipements disponibles
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {hotel.amenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl">
                      {getAmenityIcon(amenity.icon)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {amenity.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {amenity.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {amenity.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Parking */}
              {hotel.parking && hotel.parking[0] && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🅿️</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Parking{" "}
                        {hotel.parking[0].isAvailable
                          ? "disponible"
                          : "non disponible"}
                      </h4>
                      {hotel.parking[0].spaces && (
                        <p className="text-sm text-blue-800 mb-1">
                          {hotel.parking[0].spaces} places disponibles
                        </p>
                      )}
                      {hotel.parking[0].notes && (
                        <p className="text-sm text-blue-800">
                          {hotel.parking[0].notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Onglet Points forts */}
          {activeTab === "highlights" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Points forts de l'établissement
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {hotel.highlights?.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl">{highlight.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {highlight.title}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {highlight.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {highlight.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Labels spéciaux */}
              {hotel.labels && hotel.labels.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Certifications & Labels
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {hotel.labels.map((label, index) => (
                      <div
                        key={index}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-${label.color}-50 border-${label.color}-200`}
                      >
                        {label.icon && (
                          <span className="text-lg">{label.icon}</span>
                        )}
                        <span className={`font-medium text-${label.color}-800`}>
                          {label.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
