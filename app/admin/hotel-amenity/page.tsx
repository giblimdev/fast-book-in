// @/app/admin/hotel-amenity/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  Star,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Building,
} from "lucide-react";
import HotelAmenityForm from "@/components/admin/HotelAmenityForm";
import HotelAmenityFilter, {
  HotelAmenityFilterState,
} from "@/components/admin/HotelAmenityFilter";

interface HotelAmenity {
  id: string;
  name: string;
  order: number | null;
  category: string | null;
  icon: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    HotelCard: number;
    HotelCardToHotelAmenity: number;
  };
}

interface HotelAmenityFormData {
  name: string;
  order: number;
  category: string;
  icon: string;
  description: string;
}

export default function HotelAmenityPage() {
  const [amenities, setAmenities] = useState<HotelAmenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<HotelAmenity | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);

  // État des filtres
  const [filters, setFilters] = useState<HotelAmenityFilterState>({
    searchTerm: "",
    selectedCategory: "",
  });

  // Charger les équipements
  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hotel-amenity");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setAmenities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les équipements
  const filteredAmenities = amenities.filter((amenity) => {
    // Recherche textuelle
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        amenity.name.toLowerCase().includes(searchLower) ||
        (amenity.description &&
          amenity.description.toLowerCase().includes(searchLower)) ||
        (amenity.category &&
          amenity.category.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Filtre par catégorie
    if (
      filters.selectedCategory &&
      amenity.category !== filters.selectedCategory
    ) {
      return false;
    }

    return true;
  });

  // Trier par ordre d'affichage
  const sortedAmenities = [...filteredAmenities].sort((a, b) => {
    const orderA = a.order || 100;
    const orderB = b.order || 100;
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderA - orderB;
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (formData: HotelAmenityFormData) => {
    setFormLoading(true);

    try {
      const url = editingAmenity
        ? `/api/hotel-amenity/${editingAmenity.id}`
        : "/api/hotel-amenity";

      const method = editingAmenity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          order: formData.order,
          category: formData.category || null,
          icon: formData.icon || null,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchAmenities();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer un équipement
  const handleDelete = async (id: string) => {
    const amenity = amenities.find((a) => a.id === id);
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer l'équipement "${amenity?.name}" ?`
      )
    )
      return;

    try {
      const response = await fetch(`/api/hotel-amenity/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchAmenities();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Changer l'ordre d'affichage
  const handleOrderChange = async (id: string, direction: "up" | "down") => {
    const amenity = amenities.find((a) => a.id === id);
    if (!amenity) return;

    const currentOrder = amenity.order || 100;
    const newOrder =
      direction === "up" ? Math.max(0, currentOrder - 1) : currentOrder + 1;

    try {
      const response = await fetch(`/api/hotel-amenity/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...amenity,
          order: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de l'ordre"
        );
      }

      await fetchAmenities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (amenity: HotelAmenity) => {
    setEditingAmenity(amenity);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingAmenity(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAmenity(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: "",
    });
  };

  // Obtenir l'icône d'affichage
  const getIconDisplay = (icon: string | null) => {
    const iconMap: { [key: string]: string } = {
      wifi: "📶",
      parking: "🚗",
      pool: "🏊",
      gym: "💪",
      spa: "🧖",
      restaurant: "🍽️",
      bar: "🍺",
      breakfast: "🥐",
      "air-conditioning": "❄️",
      elevator: "🛗",
      balcony: "🏠",
      "sea-view": "🌊",
      "mountain-view": "🏔️",
      "room-service": "🛎️",
      concierge: "🤵",
      laundry: "🧺",
      pets: "🐕",
    };
    return icon ? iconMap[icon] || "⭐" : null;
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <HotelAmenityForm
            amenity={editingAmenity}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
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
          <h1 className="text-3xl font-bold">
            Gestion des Équipements Hôteliers
          </h1>
          <p className="text-gray-600">
            {amenities.length} équipements enregistrés
            {filteredAmenities.length !== amenities.length && (
              <span className="ml-2">
                • {filteredAmenities.length} visibles
              </span>
            )}
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un équipement
        </Button>
      </div>

      {/* Filtres */}
      <HotelAmenityFilter
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

      {/* Liste des équipements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Équipements ({sortedAmenities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : sortedAmenities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filters.searchTerm || filters.selectedCategory
                ? "Aucun équipement trouvé pour ces critères"
                : "Aucun équipement enregistré"}
              {Object.values(filters).some((v) => v !== "" && v !== null) && (
                <div className="mt-4">
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAmenities.map((amenity, index) => (
                <div
                  key={amenity.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Nom et informations principales */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 font-mono min-w-[3ch]">
                            #{amenity.order || 100}
                          </span>
                        </div>

                        {getIconDisplay(amenity.icon) && (
                          <span className="text-lg">
                            {getIconDisplay(amenity.icon)}
                          </span>
                        )}

                        <h3 className="font-semibold text-lg">
                          {amenity.name}
                        </h3>

                        {amenity.category && (
                          <Badge variant="outline">{amenity.category}</Badge>
                        )}
                      </div>

                      {/* Description */}
                      {amenity.description && (
                        <p className="text-gray-600 mb-2 text-sm">
                          {amenity.description}
                        </p>
                      )}

                      {/* Compteurs d'utilisation */}
                      {amenity._count && (
                        <div className="flex gap-3 flex-wrap">
                          {amenity._count.HotelCard > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Building className="h-3 w-3" />
                              {amenity._count.HotelCard} hôtel
                              {amenity._count.HotelCard > 1 ? "s" : ""}
                            </Badge>
                          )}
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
                          onClick={() => handleOrderChange(amenity.id, "up")}
                          title="Monter"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOrderChange(amenity.id, "down")}
                          title="Descendre"
                          disabled={index === sortedAmenities.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Actions principales */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(amenity)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(amenity.id)}
                          title="Supprimer"
                          disabled={Boolean(
                            amenity._count &&
                              (amenity._count.HotelCard > 0 ||
                                amenity._count.HotelCardToHotelAmenity > 0)
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
