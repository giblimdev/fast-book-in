//@/app/admin/hotel-highlight
"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Star,
  Badge,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import HotelHighlightFilter from "@/components/admin/HotelHighlightFilter";
import HotelHighlightForm from "@/components/admin/HotelHighlightForm";

interface HotelHighlight {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  icon?: string | null;
  priority: number;
  order: number;
  isPromoted: boolean;
  hotelId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    HotelCardToHotelHighlight: number;
  };
}

interface FilterParams {
  search?: string;
  category?: string;
  isPromoted?: boolean;
  includeRelations?: boolean;
}

export default function HotelHighlightPage() {
  const [hotelHighlights, setHotelHighlights] = useState<HotelHighlight[]>([]);
  const [filteredHighlights, setFilteredHighlights] = useState<
    HotelHighlight[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] =
    useState<HotelHighlight | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Charger les highlights d'hôtel
  const fetchHotelHighlights = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filterParams.category) {
        queryParams.set("category", filterParams.category);
      }
      if (filterParams.search) {
        queryParams.set("search", filterParams.search);
      }
      if (filterParams.isPromoted !== undefined) {
        queryParams.set("isPromoted", filterParams.isPromoted.toString());
      }
      if (filterParams.includeRelations) {
        queryParams.set("include", "true");
      }

      const response = await fetch(`/api/hotel-highlight?${queryParams}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des highlights");
      }

      const data = await response.json();
      setHotelHighlights(data);
      setFilteredHighlights(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelHighlights();
  }, [filterParams]);

  // Créer un nouveau highlight
  const handleCreate = async (data: Partial<HotelHighlight>) => {
    try {
      const response = await fetch("/api/hotel-highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      await fetchHotelHighlights();
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
      throw err;
    }
  };

  // Mettre à jour un highlight
  const handleUpdate = async (id: string, data: Partial<HotelHighlight>) => {
    try {
      const response = await fetch(`/api/hotel-highlight/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      await fetchHotelHighlights();
      setEditingHighlight(null);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      );
      throw err;
    }
  };

  // Supprimer un highlight
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/hotel-highlight?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          const message = `Ce highlight est utilisé par ${errorData.usageCount} hôtel(s). Suppression impossible.`;
          throw new Error(message);
        }
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchHotelHighlights();
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (highlight: HotelHighlight) => {
    setEditingHighlight(highlight);
    setIsFormOpen(true);
  };

  // Appliquer les filtres
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingHighlight(null);
  };

  // Obtenir l'icône emoji
  const getIconEmoji = (iconName: string | null) => {
    const iconMap: { [key: string]: string } = {
      star: "⭐",
      award: "🏆",
      crown: "👑",
      fire: "🔥",
      sparkles: "✨",
      heart: "❤️",
      check: "✅",
      diamond: "💎",
      location: "📍",
      food: "🍽️",
      service: "🛎️",
      view: "🌅",
      offer: "🎁",
    };
    return iconName ? iconMap[iconName] || "⭐" : null;
  };

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Location: "bg-blue-100 text-blue-800",
      Amenity: "bg-green-100 text-green-800",
      Service: "bg-purple-100 text-purple-800",
      View: "bg-cyan-100 text-cyan-800",
      Offer: "bg-orange-100 text-orange-800",
      Food: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="h-7 w-7 text-blue-600" />
            Highlights d&apos;Hôtel
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les points forts et caractéristiques des hôtels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4" />
            Filtres
          </button>

          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
            Nouveau Highlight
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Filtres */}
      {isFilterOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <HotelHighlightFilter
            onFilterChange={handleFilterChange}
            initialFilters={filterParams}
          />
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Highlights
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelHighlights.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Sparkles className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Promus</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelHighlights.filter((h) => h.isPromoted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Badge className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Catégories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(hotelHighlights.map((h) => h.category)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelHighlights.reduce(
                  (acc, h) => acc + (h._count?.HotelCardToHotelHighlight || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des highlights */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredHighlights.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun highlight trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre premier highlight d&apos;hôtel
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Créer un highlight
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Highlight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHighlights.map((highlight) => (
                  <tr key={highlight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          {highlight.icon ? (
                            <span className="text-xl">
                              {getIconEmoji(highlight.icon)}
                            </span>
                          ) : (
                            <Star className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {highlight.title}
                            {highlight.isPromoted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Promu
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {highlight.id.slice(0, 8)}... • Ordre:{" "}
                            {highlight.order}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          highlight.category
                        )}`}
                      >
                        {highlight.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {highlight.description || (
                          <span className="text-gray-400 italic">
                            Aucune description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${highlight.priority}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {highlight.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {highlight._count?.HotelCardToHotelHighlight || 0}{" "}
                        utilisation(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(highlight)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(highlight.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire */}
      {isFormOpen && (
        <HotelHighlightForm
          highlight={editingHighlight}
          onSubmit={
            editingHighlight
              ? (data: Partial<HotelHighlight>) =>
                  handleUpdate(editingHighlight.id, data)
              : handleCreate
          }
          onClose={handleCloseForm}
        />
      )}

      {/* Confirmation de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce highlight ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
