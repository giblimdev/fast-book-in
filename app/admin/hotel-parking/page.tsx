"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  Car,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building,
} from "lucide-react";
import HotelParkingFilter from "@/components/admin/HotelParkingFilter";
import HotelParkingForm from "@/components/admin/HotelParkingForm";

interface HotelParking {
  id: string;
  name: string; // Obligatoire selon le schéma Prisma
  isAvailable: boolean;
  spaces?: number | null;
  notes?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    HotelCard: number;
  };
}

interface FilterParams {
  search?: string;
  isAvailable?: boolean;
  minSpaces?: number;
  maxSpaces?: number;
  includeRelations?: boolean;
}

export default function HotelParkingPage() {
  const [hotelParkings, setHotelParkings] = useState<HotelParking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<HotelParking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingParking, setEditingParking] = useState<HotelParking | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Charger les options de parking
  const fetchHotelParkings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filterParams.isAvailable !== undefined) {
        queryParams.set("isAvailable", filterParams.isAvailable.toString());
      }
      if (filterParams.search) {
        queryParams.set("search", filterParams.search);
      }
      if (filterParams.minSpaces) {
        queryParams.set("minSpaces", filterParams.minSpaces.toString());
      }
      if (filterParams.maxSpaces) {
        queryParams.set("maxSpaces", filterParams.maxSpaces.toString());
      }
      if (filterParams.includeRelations) {
        queryParams.set("include", "true");
      }

      const response = await fetch(`/api/hotel-parking?${queryParams}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des parkings");
      }

      const data = await response.json();
      setHotelParkings(data);
      setFilteredParkings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelParkings();
  }, [filterParams]);

  // Créer une nouvelle option
  const handleCreate = async (data: Partial<HotelParking>) => {
    try {
      const response = await fetch("/api/hotel-parking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      await fetchHotelParkings();
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
  const handleUpdate = async (id: string, data: Partial<HotelParking>) => {
    try {
      const response = await fetch(`/api/hotel-parking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      await fetchHotelParkings();
      setEditingParking(null);
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
      const response = await fetch(`/api/hotel-parking?id=${id}`, {
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

      await fetchHotelParkings();
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (parking: HotelParking) => {
    setEditingParking(parking);
    setIsFormOpen(true);
  };

  // Appliquer les filtres
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingParking(null);
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (isAvailable: boolean) => {
    return isAvailable ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  // Obtenir la couleur du statut
  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
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
            <Car className="h-7 w-7 text-blue-600" />
            Parkings d&apos;Hôtel
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les options de parking des hôtels
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
          <HotelParkingFilter
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
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Options</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelParkings.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Disponibles</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelParkings.filter((p) => p.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Non Disponibles
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelParkings.filter((p) => !p.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilisations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {hotelParkings.reduce(
                  (acc, p) => acc + (p._count?.HotelCard || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des options */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredParkings.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune option trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre première option de parking
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
                    Parking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Places
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
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
                {filteredParkings.map((parking) => (
                  <tr key={parking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          <Car className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {parking.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {parking.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(parking.isAvailable)}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            parking.isAvailable
                          )}`}
                        >
                          {parking.isAvailable
                            ? "Disponible"
                            : "Non disponible"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parking.spaces ? (
                          <span className="font-medium">
                            {parking.spaces} places
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Non spécifié
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {parking.notes || (
                          <span className="text-gray-400 italic">
                            Aucune note
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parking._count?.HotelCard || 0} hôtel(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parking.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(parking)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(parking.id)}
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
        <HotelParkingForm
          parking={editingParking}
          onSubmit={
            editingParking
              ? (data) => handleUpdate(editingParking.id, data)
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
              Êtes-vous sûr de vouloir supprimer cette option de parking ? Cette
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
