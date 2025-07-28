// @/components/admin/AccommodationTypeFilter.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Building2 } from "lucide-react";

export interface AccommodationTypeFilterState {
  searchTerm: string;
  selectedCategory: string;
}

interface AccommodationTypeFilterProps {
  filters: AccommodationTypeFilterState;
  onFiltersChange: (filters: AccommodationTypeFilterState) => void;
  onReset: () => void;
}

const ACCOMMODATION_CATEGORIES = [
  { value: "", label: "Toutes les catégories" },
  { value: "Hotel", label: "Hôtel" },
  { value: "Apartment", label: "Appartement" },
  { value: "House", label: "Maison" },
  { value: "Resort", label: "Resort" },
  { value: "BnB", label: "Bed & Breakfast" },
  { value: "Hostel", label: "Auberge de jeunesse" },
  { value: "Villa", label: "Villa" },
  { value: "Chalet", label: "Chalet" },
  { value: "Cabin", label: "Cabane" },
  { value: "Camping", label: "Camping" },
  { value: "Glamping", label: "Glamping" },
  { value: "Boat", label: "Bateau" },
  { value: "Other", label: "Autre" },
];

export default function AccommodationTypeFilter({
  filters,
  onFiltersChange,
  onReset,
}: AccommodationTypeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    field: keyof AccommodationTypeFilterState,
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
          {/* Ligne principale */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, code ou description..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Catégorie */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Catégorie
                  </label>
                  <select
                    value={filters.selectedCategory}
                    onChange={(e) =>
                      handleFilterChange("selectedCategory", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {ACCOMMODATION_CATEGORIES.map((category) => (
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
                    ACCOMMODATION_CATEGORIES.find(
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
