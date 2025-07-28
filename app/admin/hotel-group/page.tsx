"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Building2,
  Globe,
  AlertCircle,
  Check,
} from "lucide-react";
import HotelGroupFilter from "@/components/admin/HotelGroupFilter";
import HotelGroupForm from "@/components/admin/HotelGroupForm";

interface HotelGroup {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    HotelCard: number;
  };
  HotelCard?: Array<{
    id: string;
    name: string;
    starRating: number;
    overallRating?: number;
    basePricePerNight: number;
    currency: string;
  }>;
}

interface FilterParams {
  hasWebsite?: boolean;
  search?: string;
  includeRelations?: boolean;
}

export default function HotelGroupPage() {
  const [hotelGroups, setHotelGroups] = useState<HotelGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<HotelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<HotelGroup | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Charger les groupes d'hôtels
  const fetchHotelGroups = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filterParams.hasWebsite !== undefined) {
        queryParams.set("hasWebsite", filterParams.hasWebsite.toString());
      }
      if (filterParams.search) {
        queryParams.set("search", filterParams.search);
      }
      if (filterParams.includeRelations) {
        queryParams.set("include", "true");
      }

      const response = await fetch(`/api/hotel-group?${queryParams}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des groupes d'hôtels");
      }

      const data = await response.json();
      setHotelGroups(data);
      setFilteredGroups(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelGroups();
  }, [filterParams]);

  // Créer un nouveau groupe
  const handleCreate = async (data: Partial<HotelGroup>) => {
    try {
      const response = await fetch("/api/hotel-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      await fetchHotelGroups();
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
      throw err;
    }
  };

  // Mettre à jour un groupe
  const handleUpdate = async (id: string, data: Partial<HotelGroup>) => {
    try {
      const response = await fetch(`/api/hotel-group/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      await fetchHotelGroups();
      setEditingGroup(null);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      );
      throw err;
    }
  };

  // Supprimer un groupe
  const handleDelete = async (id: string, force = false) => {
    try {
      const url = force
        ? `/api/hotel-group/${id}?force=true`
        : `/api/hotel-group/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && !force) {
          // Conflit - groupe avec hôtels associés
          if (
            confirm(
              `Ce groupe contient ${
                errorData.details?.hotelCount || "plusieurs"
              } hôtel(s). Voulez-vous vraiment le supprimer et détacher les hôtels ?`
            )
          ) {
            return handleDelete(id, true);
          }
          return;
        }
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchHotelGroups();
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (group: HotelGroup) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  // Appliquer les filtres
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGroup(null);
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
            <Building2 className="h-7 w-7 text-blue-600" />
            Groupes d&apos;Hôtels
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les groupes et chaînes hôtelières
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
            Nouveau Groupe
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
          <HotelGroupFilter
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
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Groupes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelGroups.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avec Site Web</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelGroups.filter((g) => g.website).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hôtels Totaux</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelGroups.reduce(
                  (acc, g) => acc + (g._count?.HotelCard || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des groupes */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun groupe trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre premier groupe d&apos;hôtels
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Créer un groupe
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groupe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site Web
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hôtels
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
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {group.logoUrl ? (
                          <img
                            src={group.logoUrl}
                            alt={group.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {group.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {group.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {group.description || (
                          <span className="text-gray-400 italic">
                            Aucune description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {group.website ? (
                        <a
                          href={group.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Globe className="h-4 w-4" />
                          Visiter
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          Aucun site
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {group._count?.HotelCard || 0} hôtel(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(group.id)}
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
        <HotelGroupForm
          group={editingGroup}
          onSubmit={
            editingGroup
              ? (data) => handleUpdate(editingGroup.id, data)
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
              Êtes-vous sûr de vouloir supprimer ce groupe d&apos;hôtels ? Cette
              action est irréversible.
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
