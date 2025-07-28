// @/components/admin/DestinationFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, MapPin, Flag, Building2 } from "lucide-react";

export interface DestinationFilterState {
  searchTerm: string;
  selectedType: string;
  selectedCountry: string;
  selectedCity: string;
  minPopularityScore: number;
  maxPopularityScore: number;
}

interface DestinationFilterProps {
  filters: DestinationFilterState;
  onFiltersChange: (filters: DestinationFilterState) => void;
  onReset: () => void;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
}

const DESTINATION_TYPES = [
  { value: "", label: "Tous les types" },
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

export default function DestinationFilter({
  filters,
  onFiltersChange,
  onReset,
}: DestinationFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Charger les pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/country");
        if (response.ok) {
          const data = await response.json();
          setCountries(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
      }
    };

    fetchCountries();
  }, []);

  // Charger les villes quand un pays est sélectionné
  useEffect(() => {
    const fetchCities = async () => {
      if (!filters.selectedCountry) {
        setCities([]);
        return;
      }

      try {
        setCitiesLoading(true);
        const response = await fetch(
          `/api/city?countryId=${filters.selectedCountry}`
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
  }, [filters.selectedCountry]);

  const handleFilterChange = (
    field: keyof DestinationFilterState,
    value: string | number
  ) => {
    const newFilters = { ...filters, [field]: value };

    // Reset city if country changes
    if (field === "selectedCountry") {
      newFilters.selectedCity = "";
    }

    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedType) count++;
    if (filters.selectedCountry) count++;
    if (filters.selectedCity) count++;
    if (filters.minPopularityScore > 0) count++;
    if (filters.maxPopularityScore < 100) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Ligne principale */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou description..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Bouton filtres */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={onReset} size="sm">
                  <X className="h-4 w-4" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Filtres avancés */}
          {isExpanded && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Type de destination
                  </label>
                  <select
                    value={filters.selectedType}
                    onChange={(e) =>
                      handleFilterChange("selectedType", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {DESTINATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pays */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Pays
                  </label>
                  <select
                    value={filters.selectedCountry}
                    onChange={(e) =>
                      handleFilterChange("selectedCountry", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Tous les pays</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.code} - {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ville */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Ville
                  </label>
                  <select
                    value={filters.selectedCity}
                    onChange={(e) =>
                      handleFilterChange("selectedCity", e.target.value)
                    }
                    disabled={!filters.selectedCountry || citiesLoading}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {filters.selectedCountry
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
              </div>

              {/* Score de popularité */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Score de popularité
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Minimum</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={filters.minPopularityScore}
                      onChange={(e) =>
                        handleFilterChange(
                          "minPopularityScore",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Maximum</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={filters.maxPopularityScore}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxPopularityScore",
                          parseInt(e.target.value) || 100
                        )
                      }
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Résumé des filtres actifs */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.selectedType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type:{" "}
                  {
                    DESTINATION_TYPES.find(
                      (t) => t.value === filters.selectedType
                    )?.label
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedType", "")}
                  />
                </Badge>
              )}

              {filters.selectedCountry && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Pays:{" "}
                  {
                    countries.find((c) => c.id === filters.selectedCountry)
                      ?.name
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedCountry", "")}
                  />
                </Badge>
              )}

              {filters.selectedCity && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Ville:{" "}
                  {cities.find((c) => c.id === filters.selectedCity)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedCity", "")}
                  />
                </Badge>
              )}

              {(filters.minPopularityScore > 0 ||
                filters.maxPopularityScore < 100) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Score: {filters.minPopularityScore}-
                  {filters.maxPopularityScore}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      handleFilterChange("minPopularityScore", 0);
                      handleFilterChange("maxPopularityScore", 100);
                    }}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
