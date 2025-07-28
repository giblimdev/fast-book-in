// @/app/demo/admin/label/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  Tag,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Star,
  Building,
} from "lucide-react";
import LabelForm from "@/components/admin/LabelForm";
import LabelFilter, { LabelFilterState } from "@/components/admin/LabelFilter";

interface LabelData {
  id: string;
  name: string;
  order: number | null;
  code: string;
  description: string | null;
  category: string;
  icon: string | null;
  color: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
  hotelDetailsId?: string | null; // ✅ Ajout
  _count?: {
    HotelCardToLabel: number;
  };
}

interface LabelFormData {
  name: string;
  order: number;
  code: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  priority: number;
  hotelDetailsId?: string; // ✅ Ajout
}

interface BulkLabelData {
  labels: LabelFormData[];
}

export default function LabelPage() {
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelData | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // État des filtres
  const [filters, setFilters] = useState<LabelFilterState>({
    searchTerm: "",
    selectedCategory: "",
    minPriority: 0,
    maxPriority: 100,
    hasIcon: "all",
    hasColor: "all",
  });

  // Charger les labels
  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/label");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setLabels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les labels
  const filteredLabels = labels.filter((label) => {
    // Recherche textuelle
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        label.name.toLowerCase().includes(searchLower) ||
        label.code.toLowerCase().includes(searchLower) ||
        (label.description &&
          label.description.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Filtre par catégorie
    if (
      filters.selectedCategory &&
      label.category !== filters.selectedCategory
    ) {
      return false;
    }

    // Filtre par priorité
    if (
      label.priority < filters.minPriority ||
      label.priority > filters.maxPriority
    ) {
      return false;
    }

    // Filtre par icône
    if (filters.hasIcon === "yes" && !label.icon) {
      return false;
    }
    if (filters.hasIcon === "no" && label.icon) {
      return false;
    }

    // Filtre par couleur
    if (filters.hasColor === "yes" && !label.color) {
      return false;
    }
    if (filters.hasColor === "no" && label.color) {
      return false;
    }

    return true;
  });

  // Trier par priorité puis ordre
  const sortedLabels = [...filteredLabels].sort((a, b) => {
    // D'abord par priorité (décroissant)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Puis par ordre (croissant)
    const orderA = a.order || 100;
    const orderB = b.order || 100;
    if (orderA === orderB) {
      return a.name.localeCompare(b.name);
    }
    return orderA - orderB;
  });

  // Gérer la soumission simple
  const handleFormSubmit = async (formData: LabelFormData) => {
    setFormLoading(true);

    try {
      console.log("🔍 Submitting form data:", formData);

      const url = editingLabel ? `/api/label/${editingLabel.id}` : "/api/label";
      const method = editingLabel ? "PUT" : "POST";

      const payload = {
        name: formData.name,
        order: formData.order,
        code: formData.code,
        description: formData.description || null,
        category: formData.category,
        icon: formData.icon || null,
        color: formData.color || null,
        priority: formData.priority,
        hotelDetailsId: formData.hotelDetailsId || null, // ✅ Ajout
      };

      console.log("🔍 Sending payload:", payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("🔍 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      const result = await response.json();
      console.log("✅ Success:", result);

      await fetchLabels();
      handleCloseForm();
    } catch (err) {
      console.error("❌ Submit error:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ Gérer la soumission multiple
  const handleBulkFormSubmit = async (bulkData: BulkLabelData) => {
    setFormLoading(true);

    try {
      const results = [];

      for (const labelData of bulkData.labels) {
        const response = await fetch("/api/label", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: labelData.name,
            order: labelData.order,
            code: labelData.code,
            description: labelData.description || null,
            category: labelData.category,
            icon: labelData.icon || null,
            color: labelData.color || null,
            priority: labelData.priority,
            hotelDetailsId: labelData.hotelDetailsId || null, // ✅ Ajout
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Erreur pour "${labelData.name}": ${errorData.error}`
          );
        }

        const result = await response.json();
        results.push(result);
      }

      console.log(`${results.length} labels ajoutés avec succès`);
      await fetchLabels();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer un label
  const handleDelete = async (id: string) => {
    const label = labels.find((l) => l.id === id);
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer le label "${label?.name}" ?`)
    )
      return;

    try {
      const response = await fetch(`/api/label/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchLabels();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Changer l'ordre d'affichage
  const handleOrderChange = async (id: string, direction: "up" | "down") => {
    const label = labels.find((l) => l.id === id);
    if (!label) return;

    const currentOrder = label.order || 100;
    const newOrder =
      direction === "up" ? Math.max(0, currentOrder - 1) : currentOrder + 1;

    try {
      const response = await fetch(`/api/label/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...label,
          order: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de l'ordre"
        );
      }

      await fetchLabels();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (label: LabelData) => {
    setEditingLabel(label);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingLabel(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLabel(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: "",
      minPriority: 0,
      maxPriority: 100,
      hasIcon: "all",
      hasColor: "all",
    });
  };

  // Obtenir l'icône emoji
  const getIconEmoji = (iconName: string | null) => {
    const iconMap: { [key: string]: string } = {
      star: "⭐",
      heart: "❤️",
      award: "🏆",
      crown: "👑",
      fire: "🔥",
      "thumbs-up": "👍",
      check: "✅",
      shield: "🛡️",
      diamond: "💎",
      bolt: "⚡",
      sparkles: "✨",
      sun: "☀️",
      moon: "🌙",
      mountain: "🏔️",
      beach: "🏖️",
      city: "🏙️",
      building: "🏢",
    };
    return iconName ? iconMap[iconName] || "🏷️" : null;
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <LabelForm
            label={editingLabel}
            onSubmit={handleFormSubmit}
            onBulkSubmit={handleBulkFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
            allowBulk={!editingLabel}
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
          <h1 className="text-3xl font-bold">Gestion des Labels</h1>
          <p className="text-gray-600">
            {labels.length} labels enregistrés
            {filteredLabels.length !== labels.length && (
              <span className="ml-2">• {filteredLabels.length} visibles</span>
            )}
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un label
        </Button>
      </div>

      {/* Filtres */}
      <LabelFilter
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

      {/* Liste des labels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Labels ({sortedLabels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : sortedLabels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {Object.values(filters).some(
                (v) => v !== "" && v !== "all" && v !== 0 && v !== 100
              )
                ? "Aucun label trouvé pour ces critères"
                : "Aucun label enregistré"}
              {Object.values(filters).some(
                (v) => v !== "" && v !== "all" && v !== 0 && v !== 100
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
              {sortedLabels.map((label, index) => (
                <div
                  key={label.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Informations principales */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 font-mono min-w-[3ch]">
                            #{label.order || 100}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Aperçu du label */}
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: label.color || "#E5E7EB",
                              color: label.color ? "#FFFFFF" : "#374151",
                            }}
                          >
                            {label.icon && (
                              <span className="text-xs">
                                {getIconEmoji(label.icon)}
                              </span>
                            )}
                            {label.name}
                          </span>
                        </div>

                        <Badge variant="outline" className="font-mono">
                          {label.code}
                        </Badge>

                        <Badge variant="secondary">{label.category}</Badge>

                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Star className="h-3 w-3" />
                          {label.priority}
                        </Badge>
                      </div>

                      {/* Description */}
                      {label.description && (
                        <p className="text-gray-600 mb-2 text-sm">
                          {label.description}
                        </p>
                      )}

                      {/* Compteurs d'utilisation */}
                      {label._count && (
                        <div className="flex gap-3 flex-wrap">
                          {label._count.HotelCardToLabel > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Building className="h-3 w-3" />
                              {label._count.HotelCardToLabel} hôtel
                              {label._count.HotelCardToLabel > 1 ? "s" : ""}
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
                          onClick={() => handleOrderChange(label.id, "up")}
                          title="Monter"
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOrderChange(label.id, "down")}
                          title="Descendre"
                          disabled={index === sortedLabels.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Actions principales */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(label)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(label.id)}
                          title="Supprimer"
                          disabled={Boolean(
                            label._count && label._count.HotelCardToLabel > 0
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
