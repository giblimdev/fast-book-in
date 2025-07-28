// @/components/admin/HotelAmenityFilter.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Star } from "lucide-react";

export interface HotelAmenityFilterState {
  searchTerm: string;
  selectedCategory: string;
}

interface HotelAmenityFilterProps {
  filters: HotelAmenityFilterState;
  onFiltersChange: (filters: HotelAmenityFilterState) => void;
  onReset: () => void;
}

const AMENITY_CATEGORIES = [
  { value: "", label: "Toutes les catégories" },
  { value: "Location", label: "Emplacement" },
  { value: "Amenity", label: "Équipement" },
  { value: "Service", label: "Service" },
  { value: "View", label: "Vue" },
  { value: "Offer", label: "Offre" },
  { value: "Food", label: "Restauration" },
  { value: "Wellness", label: "Bien-être" },
  { value: "Business", label: "Affaires" },
  { value: "Entertainment", label: "Divertissement" },
  { value: "Transport", label: "Transport" },
];

export default function HotelAmenityFilter({
  filters,
  onFiltersChange,
  onReset,
}: HotelAmenityFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    field: keyof HotelAmenityFilterState,
    value: string
  ) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCategory) count++;
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
                placeholder="Rechercher un équipement par nom, description..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Catégorie */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Catégorie
                  </label>
                  <select
                    value={filters.selectedCategory}
                    onChange={(e) =>
                      handleFilterChange("selectedCategory", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {AMENITY_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Résumé des filtres actifs */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Catégorie:{" "}
                  {
                    AMENITY_CATEGORIES.find(
                      (c) => c.value === filters.selectedCategory
                    )?.label
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedCategory", "")}
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
