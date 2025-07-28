//@/app/admin/accessibility-option

"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Shield,
  Accessibility,
  AlertCircle,
  Users,
} from "lucide-react";
import AccessibilityOptionFilter from "@/components/admin/AccessibilityOptionFilter";
import AccessibilityOptionForm from "@/components/admin/AccessibilityOptionForm";

interface AccessibilityOption {
  id: string;
  name: string;
  code: string;
  category: string;
  description?: string | null;
  icon?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    HotelCardToAccessibilityOption: number;
  };
}

interface FilterParams {
  search?: string;
  category?: string;
  includeRelations?: boolean;
}

export default function AccessibilityOptionPage() {
  const [accessibilityOptions, setAccessibilityOptions] = useState<
    AccessibilityOption[]
  >([]);
  const [filteredOptions, setFilteredOptions] = useState<AccessibilityOption[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOption, setEditingOption] =
    useState<AccessibilityOption | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Charger les options d'accessibilité
  const fetchAccessibilityOptions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filterParams.category) {
        queryParams.set("category", filterParams.category);
      }
      if (filterParams.search) {
        queryParams.set("search", filterParams.search);
      }
      if (filterParams.includeRelations) {
        queryParams.set("include", "true");
      }

      const response = await fetch(`/api/accessibility-option?${queryParams}`);
      if (!response.ok) {
        throw new Error(
          "Erreur lors du chargement des options d'accessibilité"
        );
      }

      const data = await response.json();
      setAccessibilityOptions(data);
      setFilteredOptions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessibilityOptions();
  }, [filterParams]);

  // Créer une nouvelle option
  const handleCreate = async (data: Partial<AccessibilityOption>) => {
    try {
      const response = await fetch("/api/accessibility-option", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      await fetchAccessibilityOptions();
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
      throw err;
    }
  };

  // Mettre à jour une option
  const handleUpdate = async (
    id: string,
    data: Partial<AccessibilityOption>
  ) => {
    try {
      const response = await fetch(`/api/accessibility-option/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      await fetchAccessibilityOptions();
      setEditingOption(null);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      );
      throw err;
    }
  };

  // Supprimer une option
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/accessibility-option?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          const message = `Cette option est utilisée par ${errorData.usageCount} hôtel(s). Suppression impossible.`;
          throw new Error(message);
        }
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchAccessibilityOptions();
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (option: AccessibilityOption) => {
    setEditingOption(option);
    setIsFormOpen(true);
  };

  // Appliquer les filtres
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOption(null);
  };

  // Obtenir l'icône emoji
  const getIconEmoji = (iconName: string | null) => {
    const iconMap: { [key: string]: string } = {
      wheelchair: "♿",
      blind: "🦯",
      deaf: "🦻",
      hearing: "👂",
      visual: "👁️",
      cognitive: "🧠",
      mobility: "🚶",
      elevator: "🛗",
      ramp: "🛤️",
      braille: "⠃",
      sign: "🤟",
      assistance: "🤝",
      guide: "🦮",
      parking: "🅿️",
      bathroom: "🚿",
      phone: "📞",
    };
    return iconName ? iconMap[iconName] || "♿" : null;
  };

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Mobility: "bg-blue-100 text-blue-800",
      Visual: "bg-purple-100 text-purple-800",
      Hearing: "bg-orange-100 text-orange-800",
      Cognitive: "bg-pink-100 text-pink-800",
      Physical: "bg-green-100 text-green-800",
      Communication: "bg-cyan-100 text-cyan-800",
      General: "bg-gray-100 text-gray-800",
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
            <Accessibility className="h-7 w-7 text-blue-600" />
            Options d&apos;Accessibilité
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les options d&apos;accessibilité pour les hôtels
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
            Nouvelle Option
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
          <AccessibilityOptionFilter
            onFilterChange={handleFilterChange}
            initialFilters={filterParams}
          />
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Accessibility className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Options</p>
              <p className="text-2xl font-semibold text-gray-900">
                {accessibilityOptions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Catégories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(accessibilityOptions.map((o) => o.category)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {accessibilityOptions.reduce(
                  (acc, o) =>
                    acc + (o._count?.HotelCardToAccessibilityOption || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des options */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredOptions.length === 0 ? (
          <div className="text-center py-12">
            <Accessibility className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune option trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre première option d&apos;accessibilité
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Créer une option
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Option
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordre
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOptions.map((option) => (
                  <tr key={option.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          {option.icon ? (
                            <span className="text-xl">
                              {getIconEmoji(option.icon)}
                            </span>
                          ) : (
                            <Accessibility className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {option.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {option.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {option.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          option.category
                        )}`}
                      >
                        {option.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {option.description || (
                          <span className="text-gray-400 italic">
                            Aucune description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {option._count?.HotelCardToAccessibilityOption || 0}{" "}
                        hôtel(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {option.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(option)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(option.id)}
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
        <AccessibilityOptionForm
          option={editingOption}
          onSubmit={
            editingOption
              ? (data: Partial<AccessibilityOption>) =>
                  handleUpdate(editingOption.id, data)
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
              Êtes-vous sûr de vouloir supprimer cette option
              d&apos;accessibilité ? Cette action est irréversible.
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
