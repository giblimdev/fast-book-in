// @/components/admin/HotelCardFilter.tsx
"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Star, MapPin } from "lucide-react";

// Types pour les filtres
interface FilterOptions {
  searchTerm: string;
  starRating: string;
  isPartner: string;
  currency: string;
  city: string;
  country: string;
}

interface HotelCardFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  availableCities?: Array<{
    id: string;
    name: string;
    country?: { name: string };
  }>;
  availableCountries?: Array<{ id: string; name: string }>;
  totalCount: number;
  filteredCount: number;
}

export default function HotelCardFilter({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  availableCities = [],
  availableCountries = [],
  totalCount,
  filteredCount,
}: HotelCardFilterProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Vérifier si des filtres sont actifs
  const hasActiveFilters =
    searchTerm || Object.keys(filters).some((key) => filters[key]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Barre de recherche principale */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom d'hôtel, ville ou pays..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => onSearchChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Filtres de base */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtres:</span>
            </div>

            {/* Filtre par étoiles */}
            <Select
              value={filters.starRating || ""}
              onValueChange={(value) => onFilterChange("starRating", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Étoiles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les étoiles</SelectItem>
                {[1, 2, 3, 4, 5].map((stars) => (
                  <SelectItem key={stars} value={stars.toString()}>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: stars }, (_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span>{stars}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre par statut partenaire */}
            <Select
              value={filters.isPartner || ""}
              onValueChange={(value) => onFilterChange("isPartner", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="true">Partenaires</SelectItem>
                <SelectItem value="false">Non partenaires</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre par devise */}
            <Select
              value={filters.currency || ""}
              onValueChange={(value) => onFilterChange("currency", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les devises</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="USD">Dollar US ($)</SelectItem>
                <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
              </SelectContent>
            </Select>

            {/* Bouton filtres avancés */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              Filtres avancés
            </Button>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              {/* Filtre par ville */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <Select
                  value={filters.city || ""}
                  onValueChange={(value) => onFilterChange("city", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les villes</SelectItem>
                    {availableCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {city.name}
                          {city.country && (
                            <span className="text-muted-foreground">
                              ({city.country.name})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par pays */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pays</label>
                <Select
                  value={filters.country || ""}
                  onValueChange={(value) => onFilterChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les pays</SelectItem>
                    {availableCountries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Placeholder pour futurs filtres */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Prix</label>
                <div className="flex gap-2">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
            </div>
          )}

          {/* Badges des filtres actifs et bouton effacer */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filtres actifs:
              </span>

              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />"{searchTerm}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onSearchChange("")}
                  />
                </Badge>
              )}

              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                let displayValue = value;
                let icon = null;

                switch (key) {
                  case "starRating":
                    displayValue = `${value} étoiles`;
                    icon = <Star className="h-3 w-3" />;
                    break;
                  case "isPartner":
                    displayValue =
                      value === "true" ? "Partenaire" : "Non partenaire";
                    break;
                  case "currency":
                    displayValue = value;
                    break;
                  default:
                    break;
                }

                return (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {icon}
                    {displayValue}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => onFilterChange(key, "")}
                    />
                  </Badge>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="gap-2"
              >
                <X className="h-3 w-3" />
                Effacer tout
              </Button>
            </div>
          )}

          {/* Compteurs de résultats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {filteredCount === totalCount ? (
                <span>
                  {totalCount} hôtel{totalCount > 1 ? "s" : ""} au total
                </span>
              ) : (
                <span>
                  {filteredCount} sur {totalCount} hôtel
                  {totalCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <div className="text-xs">
                {filteredCount === 0 ? (
                  <span className="text-destructive">Aucun résultat</span>
                ) : (
                  <span className="text-primary">
                    {Math.round((filteredCount / totalCount) * 100)}% des
                    résultats
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
