// @/components/admin/AddressFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  X,
  MapPin,
  Building,
  Users,
  Landmark,
} from "lucide-react";

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

interface User {
  id: string;
  name: string;
  email: string;
}

interface HotelCard {
  id: string;
  name: string;
}

interface LandmarkData {
  id: string;
  name: string;
  type: string;
}

// ✅ Interface mise à jour sans Neighborhood
export interface AddressFilterState {
  searchTerm: string;
  selectedCountry: string;
  selectedCity: string;
  selectedUser: string;
  selectedHotel: string;
  selectedLandmark: string;
}

interface AddressFilterProps {
  filters: AddressFilterState;
  onFiltersChange: (filters: AddressFilterState) => void;
  onReset: () => void;
}

export default function AddressFilter({
  filters,
  onFiltersChange,
  onReset,
}: AddressFilterProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<HotelCard[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkData[]>([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Charger les données initiales avec routes corrigées
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countriesRes, usersRes, hotelsRes, landmarksRes] =
          await Promise.all([
            fetch("/api/country"), // ✅ Route corrigée
            fetch("/api/user"), // ✅ Route corrigée
            fetch("/api/hotel-card"), // ✅ Route corrigée
            fetch("/api/landmark"), // ✅ Route corrigée
          ]);

        if (countriesRes.ok) {
          const data = await countriesRes.json();
          setCountries(data);
        }

        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data);
        }

        if (hotelsRes.ok) {
          const data = await hotelsRes.json();
          setHotels(data);
        }

        if (landmarksRes.ok) {
          const data = await landmarksRes.json();
          setLandmarks(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Charger les villes quand un pays est sélectionné avec route corrigée
  useEffect(() => {
    const fetchCities = async () => {
      if (!filters.selectedCountry) {
        setCities([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/city?countryId=${filters.selectedCountry}` // ✅ Route corrigée
        );
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
      }
    };

    fetchCities();
  }, [filters.selectedCountry]);

  const handleFilterChange = (field: keyof AddressFilterState, value: any) => {
    let newFilters = { ...filters, [field]: value };

    // ✅ Réinitialiser les filtres dépendants (sans neighborhood)
    if (field === "selectedCountry") {
      newFilters.selectedCity = "";
    }

    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCountry) count++;
    if (filters.selectedCity) count++;
    if (filters.selectedUser) count++;
    if (filters.selectedHotel) count++;
    if (filters.selectedLandmark) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Ligne principale avec recherche et bouton filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une adresse par nom, rue, code postal..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="pl-10"
              />
            </div>

            {/* Bouton filtres avancés */}
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

          {/* Filtres avancés (collapsible) */}
          {isExpanded && (
            <div className="space-y-4 border-t pt-4">
              {/* ✅ Géographie sans quartier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pays
                  </label>
                  <select
                    value={filters.selectedCountry}
                    onChange={(e) =>
                      handleFilterChange("selectedCountry", e.target.value)
                    }
                    disabled={loading}
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

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ville
                  </label>
                  <select
                    value={filters.selectedCity}
                    onChange={(e) =>
                      handleFilterChange("selectedCity", e.target.value)
                    }
                    disabled={!filters.selectedCountry}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Toutes les villes</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Relations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Utilisateur
                  </label>
                  <select
                    value={filters.selectedUser}
                    onChange={(e) =>
                      handleFilterChange("selectedUser", e.target.value)
                    }
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Tous les utilisateurs</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Hôtel
                  </label>
                  <select
                    value={filters.selectedHotel}
                    onChange={(e) =>
                      handleFilterChange("selectedHotel", e.target.value)
                    }
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Tous les hôtels</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    Point d'intérêt
                  </label>
                  <select
                    value={filters.selectedLandmark}
                    onChange={(e) =>
                      handleFilterChange("selectedLandmark", e.target.value)
                    }
                    disabled={loading}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Tous les points d'intérêt</option>
                    {landmarks.map((landmark) => (
                      <option key={landmark.id} value={landmark.id}>
                        {landmark.name} ({landmark.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
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
              {filters.selectedUser && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Utilisateur:{" "}
                  {users.find((u) => u.id === filters.selectedUser)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedUser", "")}
                  />
                </Badge>
              )}
              {filters.selectedHotel && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Hôtel:{" "}
                  {hotels.find((h) => h.id === filters.selectedHotel)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedHotel", "")}
                  />
                </Badge>
              )}
              {filters.selectedLandmark && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  POI:{" "}
                  {
                    landmarks.find((l) => l.id === filters.selectedLandmark)
                      ?.name
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedLandmark", "")}
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
