// @/components/helper/SelectCity.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSelectedCity } from "@/store/useCitySelectedStore";
import { City } from "@/store/useCitySelectedStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Globe, MapPin, RefreshCw } from "lucide-react";

interface Country {
  id: string;
  name: string;
  code: string;
  cities?: City[];
}

export default function SelectCity() {
  const cityStore = useSelectedCity();

  // États locaux pour les données API
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les pays au montage
  useEffect(() => {
    fetchCountries();
  }, []);

  // Charger les villes quand un pays est sélectionné
  useEffect(() => {
    if (cityStore.selectedCountryId) {
      fetchCities(cityStore.selectedCountryId);
    } else {
      setCities([]);
    }
  }, [cityStore.selectedCountryId]);

  // Fonction pour récupérer les pays
  const fetchCountries = async () => {
    setLoadingCountries(true);
    setError(null);

    try {
      const response = await fetch("/api/country");
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // ✅ Filtrer les pays avec des IDs valides
      const validCountries = data.filter(
        (country: Country) => country.id && country.id.trim() !== ""
      );
      setCountries(validCountries);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des pays";
      setError(errorMessage);
      console.error("Erreur lors du chargement des pays:", err);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fonction pour récupérer les villes d'un pays
  const fetchCities = async (countryId: string) => {
    setLoadingCities(true);
    setError(null);

    try {
      const response = await fetch(`/api/city?countryId=${countryId}`);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // ✅ Filtrer les villes avec des IDs valides
      const validCities = data.filter(
        (city: City) => city.id && city.id.trim() !== ""
      );
      setCities(validCities);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des villes";
      setError(errorMessage);
      console.error("Erreur lors du chargement des villes:", err);
    } finally {
      setLoadingCities(false);
    }
  };

  // Gestion de la sélection d'un pays
  const handleCountrySelect = (countryId: string) => {
    if (countryId === "RESET_COUNTRY") {
      // ✅ Valeur explicite et unique
      cityStore.selectCountry(null);
      return;
    }
    cityStore.selectCountry(countryId);
  };

  // Gestion de la sélection d'une ville
  const handleCitySelect = (cityId: string) => {
    if (cityId === "RESET_CITY") {
      // ✅ Valeur explicite et unique
      cityStore.selectCity(null);
      return;
    }

    const selectedCity = cities.find((city) => city.id === cityId);
    if (selectedCity) {
      cityStore.selectCity(cityId, selectedCity);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélection du pays */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Sélectionner un pays
        </label>

        <Select
          value={cityStore.selectedCountryId || "RESET_COUNTRY"} // ✅ Valeur par défaut explicite
          onValueChange={handleCountrySelect}
          disabled={loadingCountries}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                loadingCountries ? "Chargement des pays..." : "Choisir un pays"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RESET_COUNTRY">
              {" "}
              {/* ✅ Valeur unique et explicite */}
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Aucun pays sélectionné
              </div>
            </SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name} ({country.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sélection de la ville */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Sélectionner une ville
        </label>

        <Select
          value={cityStore.selectedCityId || "RESET_CITY"} // ✅ Valeur par défaut explicite
          onValueChange={handleCitySelect}
          disabled={!cityStore.selectedCountryId || loadingCities}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !cityStore.selectedCountryId
                  ? "Sélectionnez d'abord un pays"
                  : loadingCities
                  ? "Chargement des villes..."
                  : "Choisir une ville"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RESET_CITY">
              {" "}
              {/* ✅ Valeur unique et explicite */}
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Aucune ville sélectionnée
              </div>
            </SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* État de chargement */}
      {(loadingCountries || loadingCities) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingCountries
            ? "Chargement des pays..."
            : "Chargement des villes..."}
        </div>
      )}

      {/* Gestion des erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null);
                if (!countries.length) {
                  fetchCountries();
                } else if (cityStore.selectedCountryId && !cities.length) {
                  fetchCities(cityStore.selectedCountryId);
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Informations sur la sélection actuelle */}
      {cityStore.selectedCity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sélection actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ville:</span>
                <span className="text-sm font-medium">
                  {cityStore.selectedCity.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pays:</span>
                <span className="text-sm">
                  {cityStore.selectedCity.country?.name || "Non spécifié"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {cityStore.selectedCity.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">{countries.length}</div>
          <div className="text-xs text-muted-foreground">Pays</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{cities.length}</div>
          <div className="text-xs text-muted-foreground">Villes</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {cityStore.recentCities.length}
          </div>
          <div className="text-xs text-muted-foreground">Récentes</div>
        </div>
      </div>

      {/* Debug des données (uniquement en développement) */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug - Données du store</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>
                <strong>Selected Country ID:</strong>{" "}
                {cityStore.selectedCountryId || "null"}
              </div>
              <div>
                <strong>Selected City ID:</strong>{" "}
                {cityStore.selectedCityId || "null"}
              </div>
              <div>
                <strong>Countries loaded:</strong> {countries.length}
              </div>
              <div>
                <strong>Cities loaded:</strong> {cities.length}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
