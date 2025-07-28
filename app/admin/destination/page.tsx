// @/app/demo/admin/destination/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  MapPin,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Star,
  Building,
} from "lucide-react";
import DestinationForm from "@/components/admin/DestinationForm";
import DestinationFilter, {
  DestinationFilterState,
} from "@/components/admin/DestinationFilter";

// ✅ Interfaces mises à jour selon votre schéma Prisma
interface Country {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
  country: Country;
}

interface Destination {
  id: string;
  name: string;
  order: number | null;
  description: string | null;
  type: string;
  popularityScore: number;
  cityId: string; // ✅ Selon votre schéma
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  createdAt: string;
  updatedAt: string;
  // ✅ Relations selon votre schéma
  City?: City[]; // Relation many-to-many
  DestinationToCity?: Array<{
    city: City;
    order?: number;
  }>;
  _count?: {
    HotelCard: number;
  };
}

interface DestinationFormData {
  name: string;
  order: number;
  description: string;
  type: string;
  popularityScore: number;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
}

interface BulkDestinationData {
  destinations: DestinationFormData[];
}

export default function DestinationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // État des filtres
  const [filters, setFilters] = useState<DestinationFilterState>({
    searchTerm: "",
    selectedType: "",
    selectedCountry: "",
    selectedCity: "",
    minPopularityScore: 0,
    maxPopularityScore: 100,
  });

  // Charger les destinations
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/destination?include=true");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();

      console.log("🔍 Destinations chargées:", data);
      console.log("🔍 Première destination:", data[0]);

      setDestinations(data);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des destinations:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction utilitaire pour récupérer les infos de ville selon votre schéma
  const getCityDisplayInfo = (destination: Destination) => {
    // Méthode 1: Via la relation directe City[] (many-to-many)
    if (destination.City && destination.City.length > 0) {
      const city = destination.City[0];
      return {
        cityName: city.name || "Ville inconnue",
        countryName: city.country?.name || "Pays inconnu",
        countryCode: city.country?.code || "XX",
      };
    }

    // Méthode 2: Via DestinationToCity
    if (
      destination.DestinationToCity &&
      destination.DestinationToCity.length > 0
    ) {
      const cityRelation = destination.DestinationToCity[0];
      return {
        cityName: cityRelation.city.name || "Ville inconnue",
        countryName: cityRelation.city.country?.name || "Pays inconnu",
        countryCode: cityRelation.city.country?.code || "XX",
      };
    }

    // Méthode 3: Valeurs par défaut si aucune relation trouvée
    return {
      cityName: "Ville non assignée",
      countryName: "Pays inconnu",
      countryCode: "XX",
    };
  };

  // ✅ Filtrer les destinations avec gestion des relations complexes
  const filteredDestinations = destinations.filter((destination) => {
    const cityInfo = getCityDisplayInfo(destination);

    // Recherche textuelle
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        destination.name.toLowerCase().includes(searchLower) ||
        (destination.description &&
          destination.description.toLowerCase().includes(searchLower)) ||
        destination.type.toLowerCase().includes(searchLower) ||
        cityInfo.cityName.toLowerCase().includes(searchLower) ||
        cityInfo.countryName.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Filtre par type
    if (filters.selectedType && destination.type !== filters.selectedType) {
      return false;
    }

    // Filtre par pays
    if (filters.selectedCountry) {
      // Chercher dans toutes les villes associées
      const countryIds = [
        ...(destination.City || []).map((c) => c.countryId),
        ...(destination.DestinationToCity || []).map(
          (dtc) => dtc.city.countryId
        ),
      ];

      if (!countryIds.includes(filters.selectedCountry)) {
        return false;
      }
    }

    // Filtre par ville
    if (filters.selectedCity) {
      // Vérifier le cityId direct et les relations
      if (destination.cityId === filters.selectedCity) {
        return true;
      }

      const cityIds = [
        ...(destination.City || []).map((c) => c.id),
        ...(destination.DestinationToCity || []).map((dtc) => dtc.city.id),
      ];

      if (!cityIds.includes(filters.selectedCity)) {
        return false;
      }
    }

    // Filtre par score de popularité
    if (
      destination.popularityScore < filters.minPopularityScore ||
      destination.popularityScore > filters.maxPopularityScore
    ) {
      return false;
    }

    return true;
  });

  // Trier par ordre d'affichage
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    const orderA = a.order || 100;
    const orderB = b.order || 100;
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderA - orderB;
  });

  // Gérer la soumission simple
  const handleFormSubmit = async (formData: DestinationFormData) => {
    setFormLoading(true);

    try {
      const url = editingDestination
        ? `/api/destination/${editingDestination.id}`
        : "/api/destination";

      const method = editingDestination ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          order: formData.order,
          description: formData.description || null,
          type: formData.type,
          popularityScore: formData.popularityScore,
          cityId: formData.cityId,
          latitude: formData.latitude,
          longitude: formData.longitude,
          radius: formData.radius,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchDestinations();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ Gérer la soumission multiple
  const handleBulkFormSubmit = async (bulkData: BulkDestinationData) => {
    setFormLoading(true);

    try {
      const results = [];

      for (const destData of bulkData.destinations) {
        const response = await fetch("/api/destination", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: destData.name,
            order: destData.order,
            description: destData.description || null,
            type: destData.type,
            popularityScore: destData.popularityScore,
            cityId: destData.cityId,
            latitude: destData.latitude,
            longitude: destData.longitude,
            radius: destData.radius,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur pour "${destData.name}": ${errorData.error}`);
        }

        const result = await response.json();
        results.push(result);
      }

      console.log(`✅ ${results.length} destinations ajoutées avec succès`);
      await fetchDestinations();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer une destination
  const handleDelete = async (id: string) => {
    const destination = destinations.find((d) => d.id === id);
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la destination "${destination?.name}" ?`
      )
    )
      return;

    try {
      const response = await fetch(`/api/destination/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchDestinations();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Changer l'ordre d'affichage
  const handleOrderChange = async (id: string, direction: "up" | "down") => {
    const destination = destinations.find((d) => d.id === id);
    if (!destination) return;

    const currentOrder = destination.order || 100;
    const newOrder =
      direction === "up" ? Math.max(0, currentOrder - 1) : currentOrder + 1;

    try {
      const response = await fetch(`/api/destination/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...destination,
          order: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de l'ordre"
        );
      }

      await fetchDestinations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingDestination(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDestination(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedType: "",
      selectedCountry: "",
      selectedCity: "",
      minPopularityScore: 0,
      maxPopularityScore: 100,
    });
  };

  // Obtenir le score de popularité en étoiles
  const getPopularityStars = (score: number) => {
    const stars = Math.round((score / 100) * 5);
    return "⭐".repeat(stars);
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <DestinationForm
            destination={editingDestination}
            onSubmit={handleFormSubmit}
            onBulkSubmit={handleBulkFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
            allowBulk={!editingDestination}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Destinations</h1>
          <p className="text-gray-600">
            {destinations.length} destinations enregistrées
            {filteredDestinations.length !== destinations.length && (
              <span className="ml-2">
                • {filteredDestinations.length} visibles
              </span>
            )}
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une destination
        </Button>
      </div>

      {/* Filtres */}
      <DestinationFilter
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* Messages d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2"
            >
              Fermer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Liste des destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Destinations ({sortedDestinations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : sortedDestinations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {Object.values(filters).some(
                (v) => v !== "" && v !== 0 && v !== 100
              )
                ? "Aucune destination trouvée pour ces critères"
                : "Aucune destination enregistrée"}
              {Object.values(filters).some(
                (v) => v !== "" && v !== 0 && v !== 100
              ) && (
                <div className="mt-4">
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDestinations.map((destination, index) => {
                // ✅ Utiliser la fonction utilitaire sécurisée
                const cityInfo = getCityDisplayInfo(destination);

                return (
                  <div
                    key={destination.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Informations principales */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500 font-mono min-w-[3ch]">
                              #{destination.order || 100}
                            </span>
                          </div>

                          <h3 className="font-semibold text-lg">
                            {destination.name}
                          </h3>

                          <Badge variant="outline">{destination.type}</Badge>

                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            {destination.popularityScore}/100
                          </Badge>

                          <span className="text-sm">
                            {getPopularityStars(destination.popularityScore)}
                          </span>
                        </div>

                        {/* ✅ Localisation avec gestion sécurisée */}
                        <div className="flex items-center gap-2 mb-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {cityInfo.cityName}, {cityInfo.countryName}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {cityInfo.countryCode}
                          </Badge>
                        </div>

                        {/* Description */}
                        {destination.description && (
                          <p className="text-gray-600 mb-2 text-sm">
                            {destination.description}
                          </p>
                        )}

                        {/* Coordonnées GPS */}
                        {(destination.latitude || destination.longitude) && (
                          <div className="text-xs text-gray-500 mb-2">
                            GPS: {destination.latitude?.toFixed(6)},{" "}
                            {destination.longitude?.toFixed(6)}
                            {destination.radius &&
                              ` • Rayon: ${destination.radius}km`}
                          </div>
                        )}

                        {/* Compteurs d'utilisation */}
                        {destination._count && (
                          <div className="flex gap-3 flex-wrap">
                            {destination._count.HotelCard > 0 && (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <Building className="h-3 w-3" />
                                {destination._count.HotelCard} hôtel
                                {destination._count.HotelCard > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* ✅ Informations de debug si aucune ville trouvée */}
                        {cityInfo.cityName === "Ville non assignée" && (
                          <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mt-2">
                            ⚠️ Aucune ville assignée (cityId:{" "}
                            {destination.cityId || "vide"})
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        {/* Boutons de réorganisation */}
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleOrderChange(destination.id, "up")
                            }
                            title="Monter"
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleOrderChange(destination.id, "down")
                            }
                            title="Descendre"
                            disabled={index === sortedDestinations.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Actions principales */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(destination)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(destination.id)}
                            title="Supprimer"
                            disabled={Boolean(
                              destination._count &&
                                destination._count.HotelCard > 0
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
