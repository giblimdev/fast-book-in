// @/app/admin/address/page.tsx
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
  ExternalLink,
  Building,
  Users,
  Landmark,
} from "lucide-react";
import AddressForm from "@/components/admin/AddressForm";
import AddressFilter, {
  AddressFilterState,
} from "@/components/admin/AddressFilter";
import Link from "next/link";

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

// ✅ Interface Address mise à jour selon le nouveau schéma
interface Address {
  id: string;
  name: string | null; // ✅ Optionnel selon le schéma
  streetNumber: string | null;
  streetType: string | null; // ✅ Nouveau champ ajouté
  streetName: string;
  addressLine2: string | null;
  postalCode: string;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: City;
  _count?: {
    hotelDetails: number;
    user: number;
    landmarks: number;
  };
}

interface AddressFormData {
  name: string;
  streetNumber: string;
  streetType: string; // ✅ Nouveau champ ajouté
  streetName: string;
  addressLine2: string;
  postalCode: string;
  cityId: string;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // ✅ État des filtres
  const [filters, setFilters] = useState<AddressFilterState>({
    searchTerm: "",
    selectedCountry: "",
    selectedCity: "",
    selectedUser: "",
    selectedHotel: "",
    selectedLandmark: "",
  });

  // Charger les adresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/address"); // ✅ Route au singulier
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filtrer les adresses avec streetType
  const filteredAddresses = addresses.filter((address) => {
    // Recherche textuelle
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        (address.name && address.name.toLowerCase().includes(searchLower)) ||
        address.streetName.toLowerCase().includes(searchLower) ||
        (address.streetType &&
          address.streetType.toLowerCase().includes(searchLower)) || // ✅ Recherche sur streetType
        address.postalCode.toLowerCase().includes(searchLower) ||
        address.city.name.toLowerCase().includes(searchLower) ||
        address.city.country.name.toLowerCase().includes(searchLower) ||
        (address.streetNumber &&
          address.streetNumber.toLowerCase().includes(searchLower)) ||
        (address.addressLine2 &&
          address.addressLine2.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Filtres géographiques
    if (
      filters.selectedCountry &&
      address.city.countryId !== filters.selectedCountry
    )
      return false;
    if (filters.selectedCity && address.cityId !== filters.selectedCity)
      return false;

    return true;
  });

  // ✅ Gérer la soumission du formulaire avec streetType
  const handleFormSubmit = async (formData: AddressFormData) => {
    setFormLoading(true);

    try {
      const url = editingAddress
        ? `/api/address/${editingAddress.id}` // ✅ Route au singulier
        : "/api/address"; // ✅ Route au singulier

      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          streetNumber: formData.streetNumber || null,
          streetType: formData.streetType || null, // ✅ Nouveau champ
          streetName: formData.streetName,
          addressLine2: formData.addressLine2 || null,
          postalCode: formData.postalCode,
          cityId: formData.cityId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchAddresses();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer une adresse
  const handleDelete = async (id: string) => {
    const address = addresses.find((a) => a.id === id);
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer l'adresse "${
          address?.name || address?.streetName
        }" ?`
      )
    )
      return;

    try {
      const response = await fetch(`/api/address/${id}`, {
        // ✅ Route au singulier
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchAddresses();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCountry: "",
      selectedCity: "",
      selectedUser: "",
      selectedHotel: "",
      selectedLandmark: "",
    });
  };

  // ✅ Formater l'adresse complète avec streetType
  const formatFullAddress = (address: Address) => {
    const parts = [];
    if (address.streetNumber) parts.push(address.streetNumber);
    if (address.streetType) parts.push(address.streetType); // ✅ Ajouter le type de voie
    parts.push(address.streetName);
    if (address.addressLine2) parts.push(address.addressLine2);
    parts.push(address.postalCode);
    parts.push(address.city.name);
    return parts.join(", ");
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <AddressForm
            address={editingAddress}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
            preselectedCityId={filters.selectedCity}
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
          <h1 className="text-3xl font-bold">Gestion des Adresses</h1>
          <p className="text-gray-600">
            {addresses.length} adresses enregistrées
            {filteredAddresses.length !== addresses.length && (
              <span className="ml-2">
                • {filteredAddresses.length} visibles
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/demo/admin/city" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Gérer les villes
            </Link>
          </Button>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une adresse
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <AddressFilter
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

      {/* Liste des adresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Adresses ({filteredAddresses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filters.searchTerm ||
              filters.selectedCountry ||
              filters.selectedCity
                ? "Aucune adresse trouvée pour ces critères"
                : "Aucune adresse enregistrée"}
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
              {filteredAddresses.map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* ✅ Nom et adresse principale */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {address.name ||
                            `${address.streetNumber || ""} ${
                              address.streetType || ""
                            } ${address.streetName}`.trim()}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`font-mono ${
                            address.city.country.code === "FR"
                              ? "bg-blue-50 border-blue-200"
                              : ""
                          }`}
                        >
                          {address.city.country.code}
                        </Badge>
                      </div>

                      {/* Adresse complète */}
                      <div className="text-gray-600 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        {formatFullAddress(address)}
                      </div>

                      {/* Relations */}
                      {address._count && (
                        <div className="flex gap-3 flex-wrap">
                          {address._count.hotelDetails > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Building className="h-3 w-3" />
                              {address._count.hotelDetails} hôtel
                              {address._count.hotelDetails > 1 ? "s" : ""}
                            </Badge>
                          )}
                          {address._count.user > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Users className="h-3 w-3" />
                              {address._count.user} utilisateur
                              {address._count.user > 1 ? "s" : ""}
                            </Badge>
                          )}
                          {address._count.landmarks > 0 && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Landmark className="h-3 w-3" />
                              {address._count.landmarks} POI
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(address)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(address.id)}
                        title="Supprimer"
                        disabled={Boolean(
                          address._count &&
                            (address._count.hotelDetails > 0 ||
                              address._count.user > 0 ||
                              address._count.landmarks > 0)
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
