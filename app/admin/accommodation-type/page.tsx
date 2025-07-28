// @/app/admin/accommodation-type/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  Building2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import AccommodationTypeForm from "@/components/admin/AccommodationTypeForm";
import AccommodationTypeFilter, {
  AccommodationTypeFilterState,
} from "@/components/admin/AccommodationTypeFilter";

interface AccommodationType {
  id: string;
  name: string;
  order: number | null;
  code: string;
  description: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    HotelCard: number;
  };
}

interface AccommodationTypeFormData {
  name: string;
  order: number;
  code: string;
  description: string;
  category: string;
}

interface BulkAccommodationTypeData {
  accommodationTypes: AccommodationTypeFormData[];
}

export default function AccommodationTypePage() {
  const [accommodationTypes, setAccommodationTypes] = useState<
    AccommodationType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<AccommodationType | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);

  // État des filtres
  const [filters, setFilters] = useState<AccommodationTypeFilterState>({
    searchTerm: "",
    selectedCategory: "",
  });

  // Charger les types d'hébergement
  useEffect(() => {
    fetchAccommodationTypes();
  }, []);

  const fetchAccommodationTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/accommodation-type");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setAccommodationTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les types
  const filteredTypes = accommodationTypes.filter((type) => {
    // Recherche textuelle
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        type.name.toLowerCase().includes(searchLower) ||
        type.code.toLowerCase().includes(searchLower) ||
        (type.description &&
          type.description.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Filtre par catégorie
    if (
      filters.selectedCategory &&
      type.category !== filters.selectedCategory
    ) {
      return false;
    }

    return true;
  });

  // Trier par ordre d'affichage
  const sortedTypes = [...filteredTypes].sort((a, b) => {
    const orderA = a.order || 100;
    const orderB = b.order || 100;
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderA - orderB;
  });

  // Gérer la soumission simple
  const handleFormSubmit = async (formData: AccommodationTypeFormData) => {
    setFormLoading(true);

    try {
      const url = editingType
        ? `/api/accommodation-type/${editingType.id}`
        : "/api/accommodation-type";

      const method = editingType ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          order: formData.order,
          code: formData.code,
          description: formData.description || null,
          category: formData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchAccommodationTypes();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ Gérer la soumission multiple
  const handleBulkFormSubmit = async (bulkData: BulkAccommodationTypeData) => {
    setFormLoading(true);

    try {
      const results = [];

      for (const typeData of bulkData.accommodationTypes) {
        const response = await fetch("/api/accommodation-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: typeData.name,
            order: typeData.order,
            code: typeData.code,
            description: typeData.description || null,
            category: typeData.category,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erreur pour "${typeData.name}": ${errorData.error}`);
        }

        const result = await response.json();
        results.push(result);
      }

      console.log(`${results.length} types d'hébergement ajoutés avec succès`);
      await fetchAccommodationTypes();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer un type
  const handleDelete = async (id: string) => {
    const type = accommodationTypes.find((t) => t.id === id);
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer le type "${type?.name}" ?`)
    )
      return;

    try {
      const response = await fetch(`/api/accommodation-type/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchAccommodationTypes();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Changer l'ordre d'affichage
  const handleOrderChange = async (id: string, direction: "up" | "down") => {
    const type = accommodationTypes.find((t) => t.id === id);
    if (!type) return;

    const currentOrder = type.order || 100;
    const newOrder =
      direction === "up" ? Math.max(0, currentOrder - 1) : currentOrder + 1;

    try {
      const response = await fetch(`/api/accommodation-type/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...type,
          order: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de l'ordre"
        );
      }

      await fetchAccommodationTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (type: AccommodationType) => {
    setEditingType(type);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingType(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingType(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: "",
    });
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <AccommodationTypeForm
            accommodationType={editingType}
            onSubmit={handleFormSubmit}
            onBulkSubmit={handleBulkFormSubmit} // ✅ Nouvelle prop
            onCancel={handleCloseForm}
            isLoading={formLoading}
            allowBulk={!editingType} // ✅ Mode bulk seulement pour l'ajout
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
            Gestion des Types d'Hébergement
          </h1>
          <p className="text-gray-600">
            {accommodationTypes.length} types enregistrés
            {filteredTypes.length !== accommodationTypes.length && (
              <span className="ml-2">• {filteredTypes.length} visibles</span>
            )}
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un type d'hébergement
        </Button>
      </div>

      {/* Filtres */}
      <AccommodationTypeFilter
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

      {/* Liste des types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Types d'hébergement ({sortedTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : sortedTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filters.searchTerm || filters.selectedCategory
                ? "Aucun type trouvé pour ces critères"
                : "Aucun type d'hébergement enregistré"}
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
              {sortedTypes.map((type, index) => (
                <div
                  key={type.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Informations principales */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 font-mono min-w-[3ch]">
                            #{type.order || 100}
                          </span>
                        </div>

                        <h3 className="font-semibold text-lg">{type.name}</h3>

                        <Badge variant="outline" className="font-mono">
                          {type.code}
                        </Badge>

                        <Badge variant="secondary">{type.category}</Badge>
                      </div>

                      {/* Description */}
                      {type.description && (
                        <p className="text-gray-600 mb-2 text-sm">
                          {type.description}
                        </p>
                      )}

                      {/* Compteurs d'utilisation */}
                      {type._count && (
                        <div className="flex gap-3 flex-wrap">
                          {type._count.HotelCard > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Building2 className="h-3 w-3" />
                              {type._count.HotelCard} hôtel
                              {type._count.HotelCard > 1 ? "s" : ""}
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
                          onClick={() => handleOrderChange(type.id, "up")}
                          title="Monter"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOrderChange(type.id, "down")}
                          title="Descendre"
                          disabled={index === sortedTypes.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Actions principales */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(type)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(type.id)}
                          title="Supprimer"
                          disabled={Boolean(
                            type._count && type._count.HotelCard > 0
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
