// @/app/admin/neighborhood/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  Search,
  Building,
  MapPin,
  ExternalLink,
} from "lucide-react";
import NeighborhoodForm from "@/components/admin/NeighborhoodForm";
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

interface Neighborhood {
  id: string;
  name: string;
  order: number;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: City;
  _count?: {
    addresses: number;
  };
}

interface NeighborhoodFormData {
  name: string;
  cityId: string;
  order: number;
}

export default function NeighborhoodPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] =
    useState<Neighborhood | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    Promise.all([fetchNeighborhoods(), fetchCountries()]);
  }, []);

  // ✅ Effet pour définir la France par défaut
  useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      const france = countries.find((c) => c.code === "FR");
      if (france) {
        setSelectedCountry(france.id);
      }
    }
  }, [countries, selectedCountry]);

  // Charger les villes quand un pays est sélectionné
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setCities([]);
        setSelectedCity("");
        return;
      }

      try {
        setCitiesLoading(true);
        const response = await fetch(`/api/city?countryId=${selectedCountry}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des villes:", err);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [selectedCountry]);

  const fetchNeighborhoods = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/neighborhood");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setNeighborhoods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/country");
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des pays:", err);
    }
  };

  // Filtrer les quartiers
  const filteredNeighborhoods = neighborhoods.filter((neighborhood) => {
    const matchesSearch =
      neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighborhood.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighborhood.city.country.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCountry =
      !selectedCountry || neighborhood.city.countryId === selectedCountry;
    const matchesCity = !selectedCity || neighborhood.cityId === selectedCity;

    return matchesSearch && matchesCountry && matchesCity;
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (formData: NeighborhoodFormData) => {
    setFormLoading(true);

    try {
      const url = editingNeighborhood
        ? `/api/neighborhood/${editingNeighborhood.id}`
        : "/api/neighborhood";

      const method = editingNeighborhood ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchNeighborhoods();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer un quartier
  const handleDelete = async (id: string) => {
    const neighborhood = neighborhoods.find((n) => n.id === id);
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer "${neighborhood?.name}" ?`)
    )
      return;

    try {
      const response = await fetch(`/api/neighborhood/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchNeighborhoods();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (neighborhood: Neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingNeighborhood(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNeighborhood(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    // Remettre la France par défaut
    const france = countries.find((c) => c.code === "FR");
    setSelectedCountry(france?.id || "");
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <NeighborhoodForm
            neighborhood={editingNeighborhood}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
            preselectedCityId={selectedCity} // ✅ Passer la ville sélectionnée
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
          <h1 className="text-3xl font-bold">Gestion des Quartiers</h1>
          <p className="text-gray-600">
            {neighborhoods.length} quartiers enregistrés
            {selectedCountry && (
              <span className="ml-2">
                • Pays : {countries.find((c) => c.id === selectedCountry)?.name}
              </span>
            )}
            {selectedCity && (
              <span className="ml-2">
                • Ville : {cities.find((c) => c.id === selectedCity)?.name}
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
            Ajouter un quartier
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom de quartier, ville ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre par pays */}
            <div className="lg:w-48">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity(""); // Reset ville quand pays change
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all-countries">Tous les pays</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.code} - {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par ville */}
            <div className="lg:w-48">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={
                  !selectedCountry ||
                  selectedCountry === "all-countries" ||
                  citiesLoading
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {selectedCountry && selectedCountry !== "all-countries"
                    ? "Toutes les villes"
                    : "Sélectionnez un pays"}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {citiesLoading && (
                <p className="text-xs text-gray-500 mt-1">Chargement...</p>
              )}
            </div>

            {/* Bouton reset */}
            {(searchTerm ||
              selectedCity ||
              (selectedCountry && selectedCountry !== "all-countries")) && (
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Résumé des filtres */}
          {filteredNeighborhoods.length !== neighborhoods.length && (
            <div className="mt-3 text-sm text-gray-600">
              Affichage de {filteredNeighborhoods.length} sur{" "}
              {neighborhoods.length} quartiers
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Message d'information si France par défaut */}
      {selectedCountry &&
        countries.find((c) => c.id === selectedCountry)?.code === "FR" &&
        !selectedCity && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <p className="text-blue-700 text-sm">
                🇫🇷 Affichage par défaut : Quartiers de France.
                <button
                  onClick={() => setSelectedCountry("all-countries")}
                  className="ml-2 underline hover:no-underline"
                >
                  Voir tous les quartiers
                </button>
              </p>
            </CardContent>
          </Card>
        )}

      {/* Liste des quartiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Liste des quartiers ({filteredNeighborhoods.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : filteredNeighborhoods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ||
              selectedCity ||
              (selectedCountry && selectedCountry !== "all-countries")
                ? "Aucun quartier trouvé pour ces critères"
                : "Aucun quartier enregistré"}
              {selectedCity && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCity("")}
                  >
                    Voir tous les quartiers de ce pays
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Quartier</th>
                    <th className="text-left p-3 font-medium">Ville</th>
                    <th className="text-left p-3 font-medium">Pays</th>
                    <th className="text-left p-3 font-medium">Ordre</th>
                    <th className="text-left p-3 font-medium">Adresses</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNeighborhoods.map((neighborhood) => (
                    <tr
                      key={neighborhood.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {neighborhood.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{neighborhood.city.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`font-mono ${
                            neighborhood.city.country.code === "FR"
                              ? "bg-blue-50 border-blue-200"
                              : ""
                          }`}
                        >
                          {neighborhood.city.country.code}
                        </Badge>
                        <span className="ml-2 text-gray-600">
                          {neighborhood.city.country.name}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {neighborhood.order}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {neighborhood._count?.addresses || 0} adresses
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(neighborhood)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(neighborhood.id)}
                            title="Supprimer"
                            disabled={Boolean(
                              neighborhood._count?.addresses &&
                                neighborhood._count.addresses > 0
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
