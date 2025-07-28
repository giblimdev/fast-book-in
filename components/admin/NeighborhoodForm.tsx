/*

Paris

Paris (et environs)

Centre-ville de Paris

Paris (CDG-Roissy-Charles de Gaulle)

Montparnasse

9e arrondissement

17e arrondissement

Gare de Paris-Lyon

15e arrondissement

14e arrondissement

8e arrondissement

12e arrondissement

Bercy

13e arrondissement

Saint-Denis

Boulogne-Billancourt

Nanterre

Issy-les-Moulineaux

Roissy-en-France

Levallois-Perret

*/

// @/components/admin/NeighborhoodForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2 } from "lucide-react";

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
  city?: City;
}

interface NeighborhoodFormData {
  name: string;
  cityId: string;
  order: number;
}

interface NeighborhoodFormErrors {
  name?: string;
  cityId?: string;
  order?: string;
}

interface NeighborhoodFormProps {
  neighborhood?: Neighborhood | null;
  onSubmit: (data: NeighborhoodFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  preselectedCityId?: string; // ✅ Ville présélectionnée
}

export default function NeighborhoodForm({
  neighborhood,
  onSubmit,
  onCancel,
  isLoading = false,
  preselectedCityId,
}: NeighborhoodFormProps) {
  const [formData, setFormData] = useState<NeighborhoodFormData>({
    name: neighborhood?.name || "",
    cityId: neighborhood?.cityId || preselectedCityId || "",
    order: neighborhood?.order || 100,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [errors, setErrors] = useState<NeighborhoodFormErrors>({});

  // Charger les pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch("/api/country");
        if (response.ok) {
          const data = await response.json();
          setCountries(data);

          // ✅ Si une ville est présélectionnée, charger son pays
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
    const newErrors: NeighborhoodFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du quartier est requis";
    }

    if (!formData.cityId) {
      newErrors.cityId = "La ville est requise";
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
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (
    field: keyof NeighborhoodFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof NeighborhoodFormErrors]) {
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {neighborhood ? "Modifier le quartier" : "Ajouter un quartier"}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom du quartier */}
            <div className="md:col-span-2">
              <Label htmlFor="name">
                Nom du quartier <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Champs-Élysées"
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

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
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
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
              {neighborhood ? "Modifier" : "Ajouter"}
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
