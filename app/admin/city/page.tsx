// @/app/demo/admin/city/page.tsx
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
  Building2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import CityForm from "@/components/admin/CityForm";
import Link from "next/link";

interface Country {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  name: string;
  order: number;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  country: Country;
  _count?: {
    neighborhoods: number;
    landmarks: number;
    addresses: number;
    destinations: number;
  };
}

interface CityFormData {
  name: string;
  countryId: string;
  order: number;
}

export default function CityPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Charger les villes et pays
  useEffect(() => {
    Promise.all([fetchCities(), fetchCountries()]);
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

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/city");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setCities(data);
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

  // Filtrer les villes
  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry =
      !selectedCountry || city.countryId === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (formData: CityFormData) => {
    setFormLoading(true);

    try {
      const url = editingCity ? `/api/city/${editingCity.id}` : "/api/city";

      const method = editingCity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchCities();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer une ville
  const handleDelete = async (id: string) => {
    const city = cities.find((c) => c.id === id);
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${city?.name}" ?`))
      return;

    try {
      const response = await fetch(`/api/city/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchCities();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (city: City) => {
    setEditingCity(city);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingCity(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCity(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    // ✅ Remettre la France par défaut au lieu de vider
    const france = countries.find((c) => c.code === "FR");
    setSelectedCountry(france?.id || "");
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <CityForm
            city={editingCity}
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
          <h1 className="text-3xl font-bold">Gestion des Villes</h1>
          <p className="text-gray-600">
            {cities.length} villes enregistrées
            {selectedCountry && (
              <span className="ml-2">
                • Filtrées par pays :{" "}
                {countries.find((c) => c.id === selectedCountry)?.name}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/country" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Gérer les pays
            </Link>
          </Button>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une ville
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom de ville ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* ✅ Filtre par pays - Correction avec select HTML natif */}
            <div className="md:w-64">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
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

            {/* Bouton reset */}
            {(searchTerm ||
              (selectedCountry && selectedCountry !== "all-countries")) && (
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Résumé des filtres */}
          {filteredCities.length !== cities.length && (
            <div className="mt-3 text-sm text-gray-600">
              Affichage de {filteredCities.length} sur {cities.length} villes
              {selectedCountry && selectedCountry !== "all-countries" && (
                <span className="ml-2 font-medium">
                  • Pays :{" "}
                  {countries.find((c) => c.id === selectedCountry)?.name}
                </span>
              )}
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

      {/* ✅ Message d'information si France par défaut */}
      {selectedCountry &&
        countries.find((c) => c.id === selectedCountry)?.code === "FR" && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <p className="text-blue-700 text-sm">
                🇫🇷 Affichage par défaut : Villes de France.
                <button
                  onClick={() => setSelectedCountry("all-countries")}
                  className="ml-2 underline hover:no-underline"
                >
                  Voir toutes les villes
                </button>
              </p>
            </CardContent>
          </Card>
        )}

      {/* Liste des villes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Liste des villes ({filteredCities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ||
              (selectedCountry && selectedCountry !== "all-countries")
                ? "Aucune ville trouvée pour ces critères"
                : "Aucune ville enregistrée"}
              {selectedCountry && selectedCountry !== "all-countries" && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCountry("all-countries")}
                  >
                    Voir toutes les villes
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Ville</th>
                    <th className="text-left p-3 font-medium">Pays</th>
                    <th className="text-left p-3 font-medium">Ordre</th>
                    <th className="text-left p-3 font-medium">Quartiers</th>
                    <th className="text-left p-3 font-medium">
                      Points d'intérêt
                    </th>
                    <th className="text-left p-3 font-medium">Adresses</th>
                    <th className="text-left p-3 font-medium">Destinations</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCities.map((city) => (
                    <tr key={city.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{city.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`font-mono ${
                            city.country.code === "FR"
                              ? "bg-blue-50 border-blue-200"
                              : ""
                          }`}
                        >
                          {city.country.code}
                        </Badge>
                        <span className="ml-2 text-gray-600">
                          {city.country.name}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{city.order}</td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {city._count?.neighborhoods || 0} quartiers
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {city._count?.landmarks || 0} POI
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {city._count?.addresses || 0} adresses
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {city._count?.destinations || 0} destinations
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(city)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(city.id)}
                            title="Supprimer"
                            disabled={Boolean(
                              city._count &&
                                (city._count.neighborhoods > 0 ||
                                  city._count.landmarks > 0 ||
                                  city._count.addresses > 0 ||
                                  city._count.destinations > 0)
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
