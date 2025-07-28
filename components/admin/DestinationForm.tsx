// @/components/admin/DestinationForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2, MapPin, Code, Plus, Trash2 } from "lucide-react";

interface City {
  id: string;
  name: string;
  countryId: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
}

interface Country {
  id: string;
  name: string;
  code: string;
}

interface Destination {
  id: string;
  name: string;
  order: number | null;
  description: string | null;
  type: string;
  popularityScore: number;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  createdAt: string;
  updatedAt: string;
  city?: City;
}

interface DestinationFormData {
  name: string;
  order: number;
  description: string;
  type: string;
  popularityScore: number;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
}

// ✅ Type pour les créations multiples
interface BulkDestinationData {
  destinations: DestinationFormData[];
}

interface DestinationFormErrors {
  name?: string;
  type?: string;
  cityId?: string;
  popularityScore?: string;
  order?: string;
  json?: string;
  bulk?: string;
}

interface DestinationFormProps {
  destination?: Destination | null;
  onSubmit: (data: DestinationFormData) => Promise<void>;
  onBulkSubmit?: (data: BulkDestinationData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  allowBulk?: boolean;
}

// ✅ Types de destinations
const DESTINATION_TYPES = [
  { value: "City", label: "Ville" },
  { value: "Beach", label: "Plage" },
  { value: "Mountain", label: "Montagne" },
  { value: "Countryside", label: "Campagne" },
  { value: "Historic", label: "Historique" },
  { value: "Modern", label: "Moderne" },
  { value: "Cultural", label: "Culturel" },
  { value: "Adventure", label: "Aventure" },
  { value: "Relaxation", label: "Détente" },
  { value: "Business", label: "Affaires" },
  { value: "Shopping", label: "Shopping" },
  { value: "Nightlife", label: "Vie nocturne" },
  { value: "Family", label: "Famille" },
  { value: "Romantic", label: "Romantique" },
  { value: "Luxury", label: "Luxe" },
  { value: "Budget", label: "Économique" },
];

export default function DestinationForm({
  destination,
  onSubmit,
  onBulkSubmit,
  onCancel,
  isLoading = false,
  allowBulk = false,
}: DestinationFormProps) {
  const [formData, setFormData] = useState<DestinationFormData>({
    name: destination?.name || "",
    order: destination?.order || 100,
    description: destination?.description || "",
    type: destination?.type || "City",
    popularityScore: destination?.popularityScore || 0,
    cityId: destination?.cityId || "",
    latitude: destination?.latitude || null,
    longitude: destination?.longitude || null,
    radius: destination?.radius || null,
  });

  // ✅ État pour les destinations multiples
  const [bulkDestinations, setBulkDestinations] = useState<
    DestinationFormData[]
  >([
    {
      name: "",
      order: 100,
      description: "",
      type: "City",
      popularityScore: 0,
      cityId: "",
      latitude: null,
      longitude: null,
      radius: null,
    },
  ]);

  const [errors, setErrors] = useState<DestinationFormErrors>({});
  const [jsonData, setJsonData] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);

  // ✅ États pour les données externes
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // ✅ Onglet actif
  const [activeTab, setActiveTab] = useState<"form" | "json" | "bulk">("form");

  // ✅ Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch("/api/country");
        if (response.ok) {
          const countriesData = await response.json();
          setCountries(Array.isArray(countriesData) ? countriesData : []);

          // Définir le pays par défaut
          if (destination?.city?.countryId) {
            setSelectedCountryId(destination.city.countryId);
          } else {
            const france = countriesData.find((c: Country) => c.code === "FR");
            if (france) {
              setSelectedCountryId(france.id);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchInitialData();
  }, [destination]);

  // ✅ Charger les villes quand un pays est sélectionné
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountryId) {
        setCities([]);
        return;
      }

      try {
        setCitiesLoading(true);
        const response = await fetch(
          `/api/city?countryId=${selectedCountryId}`
        );
        if (response.ok) {
          const data = await response.json();
          setCities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
        setCities([]);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [selectedCountryId]);

  // ✅ Effet pour mettre à jour le formulaire
  useEffect(() => {
    if (destination) {
      const newFormData = {
        name: destination.name || "",
        order: destination.order || 100,
        description: destination.description || "",
        type: destination.type || "City",
        popularityScore: destination.popularityScore || 0,
        cityId: destination.cityId || "",
        latitude: destination.latitude || null,
        longitude: destination.longitude || null,
        radius: destination.radius || null,
      };
      setFormData(newFormData);
      updateJsonFromForm(newFormData);
    }
  }, [destination]);

  // ✅ Mettre à jour le JSON depuis le formulaire
  const updateJsonFromForm = (data: DestinationFormData) => {
    const jsonObject = {
      name: data.name,
      order: data.order,
      description: data.description || null,
      type: data.type,
      popularityScore: data.popularityScore,
      cityId: data.cityId,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      ...(destination && {
        id: destination.id,
        createdAt: destination.createdAt,
        updatedAt: destination.updatedAt,
      }),
    };
    setJsonData(JSON.stringify(jsonObject, null, 2));
  };

  // ✅ Mettre à jour le JSON pour le mode bulk
  const updateJsonFromBulk = (destinations: DestinationFormData[]) => {
    const jsonObject = {
      destinations: destinations.map((dest) => ({
        name: dest.name,
        order: dest.order,
        description: dest.description || null,
        type: dest.type,
        popularityScore: dest.popularityScore,
        cityId: dest.cityId,
        latitude: dest.latitude,
        longitude: dest.longitude,
        radius: dest.radius,
      })),
    };
    setJsonData(JSON.stringify(jsonObject, null, 2));
  };

  // ✅ Mettre à jour depuis le JSON
  const updateFormFromJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (
        activeTab === "bulk" &&
        parsed.destinations &&
        Array.isArray(parsed.destinations)
      ) {
        // Mode bulk
        const newBulkDestinations = parsed.destinations.map((item: any) => ({
          name: item.name || "",
          order: item.order || 100,
          description: item.description || "",
          type: item.type || "City",
          popularityScore: item.popularityScore || 0,
          cityId: item.cityId || "",
          latitude: item.latitude || null,
          longitude: item.longitude || null,
          radius: item.radius || null,
        }));
        setBulkDestinations(newBulkDestinations);
      } else {
        // Mode simple
        const newFormData = {
          name: parsed.name || "",
          order: parsed.order || 100,
          description: parsed.description || "",
          type: parsed.type || "City",
          popularityScore: parsed.popularityScore || 0,
          cityId: parsed.cityId || "",
          latitude: parsed.latitude || null,
          longitude: parsed.longitude || null,
          radius: parsed.radius || null,
        };
        setFormData(newFormData);
      }

      setIsJsonValid(true);
      setErrors((prev) => ({ ...prev, json: undefined }));
    } catch (error) {
      setIsJsonValid(false);
      setErrors((prev) => ({ ...prev, json: "JSON invalide" }));
    }
  };

  // ✅ Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: DestinationFormErrors = {};

    if (activeTab === "form") {
      if (!formData.name.trim()) {
        newErrors.name = "Le nom est requis";
      }
      if (!formData.type) {
        newErrors.type = "Le type est requis";
      }
      if (!formData.cityId) {
        newErrors.cityId = "La ville est requise";
      }
      if (formData.popularityScore < 0 || formData.popularityScore > 100) {
        newErrors.popularityScore =
          "Le score de popularité doit être entre 0 et 100";
      }
      if (formData.order < 0 || formData.order > 9999) {
        newErrors.order = "L'ordre doit être entre 0 et 9999";
      }
    }

    if (activeTab === "bulk") {
      const hasEmptyRequired = bulkDestinations.some(
        (dest) => !dest.name.trim() || !dest.type || !dest.cityId
      );
      if (hasEmptyRequired) {
        newErrors.bulk =
          "Toutes les destinations doivent avoir un nom, un type et une ville";
      }
    }

    if (activeTab === "json" && !isJsonValid) {
      newErrors.json = "Le JSON doit être valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (activeTab === "bulk" && onBulkSubmit) {
        // Soumission multiple
        const validDestinations = bulkDestinations.filter(
          (dest) => dest.name.trim() && dest.type && dest.cityId
        );
        await onBulkSubmit({ destinations: validDestinations });
      } else {
        // Soumission simple
        await onSubmit({
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim() || "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (
    field: keyof DestinationFormData,
    value: string | number | null
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateJsonFromForm(newFormData);

    if (errors[field as keyof DestinationFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Gestion des destinations multiples
  const handleBulkInputChange = (
    index: number,
    field: keyof DestinationFormData,
    value: string | number | null
  ) => {
    const newBulkDestinations = [...bulkDestinations];
    newBulkDestinations[index] = {
      ...newBulkDestinations[index],
      [field]: value,
    };
    setBulkDestinations(newBulkDestinations);
    updateJsonFromBulk(newBulkDestinations);
  };

  const addBulkDestination = () => {
    setBulkDestinations([
      ...bulkDestinations,
      {
        name: "",
        order: 100,
        description: "",
        type: "City",
        popularityScore: 0,
        cityId: "",
        latitude: null,
        longitude: null,
        radius: null,
      },
    ]);
  };

  const removeBulkDestination = (index: number) => {
    if (bulkDestinations.length > 1) {
      const newBulkDestinations = bulkDestinations.filter(
        (_, i) => i !== index
      );
      setBulkDestinations(newBulkDestinations);
      updateJsonFromBulk(newBulkDestinations);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonData(value);
    updateFormFromJson(value);
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2));
      setIsJsonValid(true);
    } catch (error) {
      setIsJsonValid(false);
    }
  };

  // ✅ Changement d'onglet
  const handleTabChange = (tab: "form" | "json" | "bulk") => {
    setActiveTab(tab);
    if (tab === "bulk") {
      updateJsonFromBulk(bulkDestinations);
    } else if (tab === "form") {
      updateJsonFromForm(formData);
    }
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    setFormData((prev) => ({ ...prev, cityId: "" }));
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {destination
              ? "Modifier la destination"
              : "Ajouter des destinations"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* ✅ Onglets */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleTabChange("form")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "form"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            disabled={destination !== null}
          >
            <MapPin className="h-4 w-4" />
            Formulaire
          </button>

          {allowBulk && !destination && (
            <button
              type="button"
              onClick={() => handleTabChange("bulk")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "bulk"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Plus className="h-4 w-4" />
              Ajout multiple ({bulkDestinations.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTabChange("json")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "json"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Code className="h-4 w-4" />
            JSON {!isJsonValid && <span className="text-red-500">⚠️</span>}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Onglet Formulaire simple */}
          {activeTab === "form" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations de base
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div className="md:col-span-2">
                    <Label htmlFor="name">
                      Nom de la destination{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Centre de Paris, Plage de Nice..."
                      disabled={isLoading}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <Label htmlFor="type">
                      Type <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      disabled={isLoading}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.type ? "border-red-500" : ""
                      }`}
                    >
                      {DESTINATION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                    )}
                  </div>

                  {/* Score de popularité */}
                  <div>
                    <Label htmlFor="popularityScore">Score de popularité</Label>
                    <Input
                      id="popularityScore"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.popularityScore}
                      onChange={(e) =>
                        handleInputChange(
                          "popularityScore",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={isLoading}
                      className={errors.popularityScore ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Score de 0 à 100 (plus élevé = plus populaire)
                    </p>
                    {errors.popularityScore && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.popularityScore}
                      </p>
                    )}
                  </div>

                  {/* Ordre */}
                  <div>
                    <Label htmlFor="order">Ordre d'affichage</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      max="9999"
                      value={formData.order}
                      onChange={(e) =>
                        handleInputChange(
                          "order",
                          parseInt(e.target.value) || 100
                        )
                      }
                      disabled={isLoading}
                      className={errors.order ? "border-red-500" : ""}
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Description de la destination..."
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Localisation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pays */}
                  <div>
                    <Label htmlFor="countryId">Pays</Label>
                    <select
                      id="countryId"
                      value={selectedCountryId}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      disabled={isLoading || countriesLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sélectionner un pays</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.code} - {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ville */}
                  <div>
                    <Label htmlFor="cityId">
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="cityId"
                      value={formData.cityId}
                      onChange={(e) =>
                        handleInputChange("cityId", e.target.value)
                      }
                      disabled={
                        isLoading || citiesLoading || !selectedCountryId
                      }
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.cityId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">
                        {selectedCountryId
                          ? "Sélectionner une ville"
                          : "Sélectionnez d'abord un pays"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.cityId && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.cityId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Coordonnées GPS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Coordonnées GPS (optionnel)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Latitude */}
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "latitude",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="48.8566"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "longitude",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="2.3522"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Rayon */}
                  <div>
                    <Label htmlFor="radius">Rayon (km)</Label>
                    <Input
                      id="radius"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.radius || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "radius",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="5.0"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Onglet Ajout multiple */}
          {activeTab === "bulk" && allowBulk && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ajout de plusieurs destinations
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBulkDestination}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une destination
                </Button>
              </div>

              {errors.bulk && (
                <p className="text-sm text-red-500">{errors.bulk}</p>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bulkDestinations.map((dest, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Destination #{index + 1}</h4>
                      {bulkDestinations.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBulkDestination(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Nom *</Label>
                        <Input
                          value={dest.name}
                          onChange={(e) =>
                            handleBulkInputChange(index, "name", e.target.value)
                          }
                          placeholder="Nom de la destination"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Type *</Label>
                        <select
                          value={dest.type}
                          onChange={(e) =>
                            handleBulkInputChange(index, "type", e.target.value)
                          }
                          disabled={isLoading}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {DESTINATION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Ville *</Label>
                        <select
                          value={dest.cityId}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "cityId",
                              e.target.value
                            )
                          }
                          disabled={isLoading || cities.length === 0}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Sélectionner une ville</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Score popularité</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={dest.popularityScore}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "popularityScore",
                              parseInt(e.target.value) || 0
                            )
                          }
                          disabled={isLoading}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={dest.description}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description de la destination..."
                          disabled={isLoading}
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Onglet JSON */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Édition JSON
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={formatJson}
                    disabled={isLoading}
                  >
                    Formater
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyJsonToClipboard}
                    disabled={isLoading}
                  >
                    Copier
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jsonEditor">
                  Données JSON
                  {!isJsonValid && (
                    <span className="text-red-500 ml-2">⚠️ JSON invalide</span>
                  )}
                </Label>
                <Textarea
                  id="jsonEditor"
                  value={jsonData}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder="Données en format JSON..."
                  disabled={isLoading}
                  rows={15}
                  className={`font-mono text-sm ${
                    !isJsonValid ? "border-red-500 bg-red-50" : "bg-gray-50"
                  }`}
                />
                {errors.json && (
                  <p className="text-sm text-red-500 mt-1">{errors.json}</p>
                )}
                <p className="text-xs text-gray-500">
                  {jsonData.includes('"destinations"')
                    ? 'Format JSON pour plusieurs destinations : { "destinations": [...] }'
                    : 'Format JSON pour une destination : { "name": "...", "type": "...", ... }'}
                </p>
              </div>

              {/* ✅ Aperçu des données */}
              {isJsonValid && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Aperçu des données
                  </h4>
                  {jsonData.includes('"destinations"') ? (
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Nombre de destinations:</strong>{" "}
                        {bulkDestinations.length}
                      </div>
                      {bulkDestinations.slice(0, 3).map((dest, index) => (
                        <div key={index} className="ml-4">
                          <strong>#{index + 1}:</strong>{" "}
                          {dest.name || "Sans nom"} ({dest.type})
                        </div>
                      ))}
                      {bulkDestinations.length > 3 && (
                        <div className="ml-4 text-gray-500">
                          ... et {bulkDestinations.length - 3} autres
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Nom:</strong> {formData.name || "Non défini"}
                      </div>
                      <div>
                        <strong>Type:</strong> {formData.type}
                      </div>
                      <div>
                        <strong>Score popularité:</strong>{" "}
                        {formData.popularityScore}
                      </div>
                      <div>
                        <strong>Ville:</strong>{" "}
                        {cities.find((c) => c.id === formData.cityId)?.name ||
                          "Non sélectionnée"}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || !isJsonValid}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {activeTab === "bulk"
                ? `Ajouter ${
                    bulkDestinations.filter(
                      (d) => d.name.trim() && d.type && d.cityId
                    ).length
                  } destinations`
                : destination
                ? "Modifier"
                : "Ajouter"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>

            {activeTab === "json" && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {isJsonValid ? (
                  <span className="text-green-600">✅ JSON valide</span>
                ) : (
                  <span className="text-red-600">❌ JSON invalide</span>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
