// @/app/admin/landmark/page.tsx
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
  MapPin,
  ExternalLink,
  Eye,
  Map,
} from "lucide-react";
import LandmarkForm from "@/components/admin/LandmarkForm";
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

interface Landmark {
  id: string;
  name: string;
  order: number;
  description: string | null;
  type: string;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  city: City;
}

interface LandmarkFormData {
  name: string;
  description: string;
  type: string;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
  order: number;
}

// Types de landmarks avec emojis
const LANDMARK_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  monument: { label: "Monument", emoji: "🏛️" },
  museum: { label: "Musée", emoji: "🏛️" },
  religious: { label: "Site religieux", emoji: "⛪" },
  park: { label: "Parc / Jardin", emoji: "🌳" },
  shopping: { label: "Shopping", emoji: "🛍️" },
  entertainment: { label: "Divertissement", emoji: "🎭" },
  transport: { label: "Transport", emoji: "🚇" },
  business: { label: "Centre d'affaires", emoji: "🏢" },
  restaurant: { label: "Restaurant", emoji: "🍽️" },
  beach: { label: "Plage", emoji: "🏖️" },
  viewpoint: { label: "Point de vue", emoji: "📍" },
  other: { label: "Autre", emoji: "📍" },
};

export default function LandmarkPage() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState<Landmark | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    Promise.all([fetchLandmarks(), fetchCountries()]);
  }, []);

  // Effet pour définir la France par défaut
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
      if (!selectedCountry || selectedCountry === "all-countries") {
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

  const fetchLandmarks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/landmark");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setLandmarks(data);
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

  // Filtrer les landmarks
  const filteredLandmarks = landmarks.filter((landmark) => {
    const matchesSearch =
      landmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landmark.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landmark.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landmark.city.country.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCountry =
      !selectedCountry ||
      selectedCountry === "all-countries" ||
      landmark.city.countryId === selectedCountry;
    const matchesCity = !selectedCity || landmark.cityId === selectedCity;
    const matchesType = !selectedType || landmark.type === selectedType;

    return matchesSearch && matchesCountry && matchesCity && matchesType;
  });

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (formData: LandmarkFormData) => {
    setFormLoading(true);

    try {
      const url = editingLandmark
        ? `/api/landmark/${editingLandmark.id}`
        : "/api/landmark";

      const method = editingLandmark ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchLandmarks();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer un landmark
  const handleDelete = async (id: string) => {
    const landmark = landmarks.find((l) => l.id === id);
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${landmark?.name}" ?`))
      return;

    try {
      const response = await fetch(`/api/landmark/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchLandmarks();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (landmark: Landmark) => {
    setEditingLandmark(landmark);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingLandmark(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLandmark(null);
    setError(null);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedType("");
    // Remettre la France par défaut
    const france = countries.find((c) => c.code === "FR");
    setSelectedCountry(france?.id || "");
  };

  // Ouvrir dans Google Maps
  const openInMaps = (landmark: Landmark) => {
    if (landmark.latitude && landmark.longitude) {
      const url = `https://www.google.com/maps?q=${landmark.latitude},${landmark.longitude}`;
      window.open(url, "_blank");
    }
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <LandmarkForm
            landmark={editingLandmark}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
            preselectedCityId={selectedCity}
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
          <h1 className="text-3xl font-bold">Gestion des Points d'Intérêt</h1>
          <p className="text-gray-600">
            {landmarks.length} points d'intérêt enregistrés
            {selectedCountry && selectedCountry !== "all-countries" && (
              <span className="ml-2">
                • Pays : {countries.find((c) => c.id === selectedCountry)?.name}
              </span>
            )}
            {selectedCity && (
              <span className="ml-2">
                • Ville : {cities.find((c) => c.id === selectedCity)?.name}
              </span>
            )}
            {selectedType && (
              <span className="ml-2">
                • Type : {LANDMARK_TYPE_LABELS[selectedType]?.label}
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
            Ajouter un point d'intérêt
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, description, ville ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre par pays */}
            <div className="xl:w-40">
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
            <div className="xl:w-40">
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
            </div>

            {/* Filtre par type */}
            <div className="xl:w-40">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Tous les types</option>
                {Object.entries(LANDMARK_TYPE_LABELS).map(
                  ([value, { label, emoji }]) => (
                    <option key={value} value={value}>
                      {emoji} {label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Bouton reset */}
            {(searchTerm ||
              selectedCity ||
              selectedType ||
              (selectedCountry && selectedCountry !== "all-countries")) && (
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Résumé des filtres */}
          {filteredLandmarks.length !== landmarks.length && (
            <div className="mt-3 text-sm text-gray-600">
              Affichage de {filteredLandmarks.length} sur {landmarks.length}{" "}
              points d'intérêt
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
        !selectedCity &&
        !selectedType && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <p className="text-blue-700 text-sm">
                🇫🇷 Affichage par défaut : Points d'intérêt de France.
                <button
                  onClick={() => setSelectedCountry("all-countries")}
                  className="ml-2 underline hover:no-underline"
                >
                  Voir tous les points d'intérêt
                </button>
              </p>
            </CardContent>
          </Card>
        )}

      {/* Liste des landmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Points d'intérêt ({filteredLandmarks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : filteredLandmarks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ||
              selectedCity ||
              selectedType ||
              (selectedCountry && selectedCountry !== "all-countries")
                ? "Aucun point d'intérêt trouvé pour ces critères"
                : "Aucun point d'intérêt enregistré"}
              <div className="mt-4 space-x-2">
                {(selectedCity || selectedType) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCity("");
                      setSelectedType("");
                    }}
                  >
                    Élargir la recherche
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">
                      Point d'intérêt
                    </th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Ville</th>
                    <th className="text-left p-3 font-medium">Pays</th>
                    <th className="text-left p-3 font-medium">Coordonnées</th>
                    <th className="text-left p-3 font-medium">Ordre</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLandmarks.map((landmark) => {
                    const typeInfo =
                      LANDMARK_TYPE_LABELS[landmark.type] ||
                      LANDMARK_TYPE_LABELS.other;

                    return (
                      <tr
                        key={landmark.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{typeInfo.emoji}</span>
                              <span className="font-medium">
                                {landmark.name}
                              </span>
                            </div>
                            {landmark.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {landmark.description.length > 80
                                  ? `${landmark.description.substring(
                                      0,
                                      80
                                    )}...`
                                  : landmark.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{typeInfo.label}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{landmark.city.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={`font-mono ${
                              landmark.city.country.code === "FR"
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            }`}
                          >
                            {landmark.city.country.code}
                          </Badge>
                          <span className="ml-2 text-gray-600">
                            {landmark.city.country.name}
                          </span>
                        </td>
                        <td className="p-3">
                          {landmark.latitude && landmark.longitude ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                GPS
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openInMaps(landmark)}
                                title="Ouvrir dans Google Maps"
                                className="h-6 w-6 p-0"
                              >
                                <Map className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600">{landmark.order}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {landmark.latitude && landmark.longitude && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openInMaps(landmark)}
                                title="Voir sur la carte"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(landmark)}
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(landmark.id)}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
