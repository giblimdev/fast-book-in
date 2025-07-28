// @/components/admin/LandmarkForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2, MapPin } from "lucide-react";

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
  city?: City;
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

interface LandmarkFormErrors {
  name?: string;
  type?: string;
  cityId?: string;
  latitude?: string;
  longitude?: string;
  order?: string;
}

interface LandmarkFormProps {
  landmark?: Landmark | null;
  onSubmit: (data: LandmarkFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  preselectedCityId?: string;
}

// Types de landmarks prédéfinis
const LANDMARK_TYPES = [
  { value: "monument", label: "Monument" },
  { value: "museum", label: "Musée" },
  { value: "religious", label: "Site religieux" },
  { value: "park", label: "Parc / Jardin" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Divertissement" },
  { value: "transport", label: "Transport" },
  { value: "business", label: "Centre d'affaires" },
  { value: "restaurant", label: "Restaurant" },
  { value: "beach", label: "Plage" },
  { value: "viewpoint", label: "Point de vue" },
  { value: "other", label: "Autre" },
];

export default function LandmarkForm({
  landmark,
  onSubmit,
  onCancel,
  isLoading = false,
  preselectedCityId,
}: LandmarkFormProps) {
  const [formData, setFormData] = useState<LandmarkFormData>({
    name: landmark?.name || "",
    description: landmark?.description || "",
    type: landmark?.type || "monument",
    cityId: landmark?.cityId || preselectedCityId || "",
    latitude: landmark?.latitude || null,
    longitude: landmark?.longitude || null,
    order: landmark?.order || 100,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [errors, setErrors] = useState<LandmarkFormErrors>({});

  // Charger les pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch("/api/country");
        if (response.ok) {
          const data = await response.json();
          setCountries(data);

          // Si une ville est présélectionnée, charger son pays
          if (preselectedCityId && data.length > 0) {
            const cityResponse = await fetch(`/api/city/${preselectedCityId}`);
            if (cityResponse.ok) {
              const cityData = await cityResponse.json();
              setSelectedCountryId(cityData.countryId);
            }
          } else {
            // Définir la France par défaut
            const france = data.find((c: Country) => c.code === "FR");
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

    fetchCountries();
  }, [preselectedCityId]);

  // Charger les villes quand un pays est sélectionné
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
          setCities(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [selectedCountryId]);

  const validateForm = (): boolean => {
    const newErrors: LandmarkFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du point d'intérêt est requis";
    }

    if (!formData.type) {
      newErrors.type = "Le type est requis";
    }

    if (!formData.cityId) {
      newErrors.cityId = "La ville est requise";
    }

    if (
      formData.latitude !== null &&
      (formData.latitude < -90 || formData.latitude > 90)
    ) {
      newErrors.latitude = "La latitude doit être entre -90 et 90";
    }

    if (
      formData.longitude !== null &&
      (formData.longitude < -180 || formData.longitude > 180)
    ) {
      newErrors.longitude = "La longitude doit être entre -180 et 180";
    }

    if (formData.order < 1) {
      newErrors.order = "L'ordre doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (
    field: keyof LandmarkFormData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof LandmarkFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    // Réinitialiser la ville sélectionnée quand le pays change
    if (formData.cityId) {
      setFormData((prev) => ({ ...prev, cityId: "" }));
    }
  };

  // Fonction pour obtenir les coordonnées automatiquement
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: Number(position.coords.latitude.toFixed(6)),
            longitude: Number(position.coords.longitude.toFixed(6)),
          }));
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {landmark
              ? "Modifier le point d'intérêt"
              : "Ajouter un point d'intérêt"}
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
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informations générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="md:col-span-2">
                <Label htmlFor="name">
                  Nom du point d'intérêt <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Tour Eiffel"
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
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  disabled={isLoading}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.type ? "border-red-500" : ""
                  }`}
                >
                  {LANDMARK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                )}
              </div>

              {/* Ordre */}
              <div>
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("order", value);
                  }}
                  min="1"
                  disabled={isLoading}
                  className={errors.order ? "border-red-500" : ""}
                />
                {errors.order && (
                  <p className="text-sm text-red-500 mt-1">{errors.order}</p>
                )}
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
                  placeholder="Description détaillée du point d'intérêt..."
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
                {countriesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Chargement des pays...
                  </p>
                )}
              </div>

              {/* Ville */}
              <div>
                <Label htmlFor="cityId">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <select
                  id="cityId"
                  value={formData.cityId}
                  onChange={(e) => handleInputChange("cityId", e.target.value)}
                  disabled={isLoading || citiesLoading || !selectedCountryId}
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
                  <p className="text-sm text-red-500 mt-1">{errors.cityId}</p>
                )}
                {citiesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Chargement des villes...
                  </p>
                )}
                {selectedCountryId && cities.length === 0 && !citiesLoading && (
                  <p className="text-xs text-orange-600 mt-1">
                    Aucune ville disponible pour ce pays
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Coordonnées GPS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Coordonnées GPS (optionnel)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Utiliser ma position
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latitude */}
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseFloat(e.target.value)
                      : null;
                    handleInputChange("latitude", value);
                  }}
                  placeholder="48.858844"
                  disabled={isLoading}
                  className={errors.latitude ? "border-red-500" : ""}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Entre -90 et 90</p>
              </div>

              {/* Longitude */}
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseFloat(e.target.value)
                      : null;
                    handleInputChange("longitude", value);
                  }}
                  placeholder="2.294351"
                  disabled={isLoading}
                  className={errors.longitude ? "border-red-500" : ""}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.longitude}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Entre -180 et 180</p>
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Coordonnées :</strong> {formData.latitude},{" "}
                  {formData.longitude}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  <a
                    href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Voir sur Google Maps
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || countriesLoading || citiesLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {landmark ? "Modifier" : "Ajouter"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
