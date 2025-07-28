// @/components/admin/LabelFilter.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Tag, Star } from "lucide-react";

export interface LabelFilterState {
  searchTerm: string;
  selectedCategory: string;
  minPriority: number;
  maxPriority: number;
  hasIcon: string;
  hasColor: string;
}

interface LabelFilterProps {
  filters: LabelFilterState;
  onFiltersChange: (filters: LabelFilterState) => void;
  onReset: () => void;
}

const LABEL_CATEGORIES = [
  { value: "", label: "Toutes les catégories" },
  { value: "Quality", label: "Qualité" },
  { value: "Location", label: "Emplacement" },
  { value: "Service", label: "Service" },
  { value: "Amenity", label: "Équipement" },
  { value: "Experience", label: "Expérience" },
  { value: "Value", label: "Rapport qualité-prix" },
  { value: "Accessibility", label: "Accessibilité" },
  { value: "Sustainability", label: "Durabilité" },
  { value: "Business", label: "Affaires" },
  { value: "Family", label: "Famille" },
  { value: "Romantic", label: "Romantique" },
  { value: "Adventure", label: "Aventure" },
  { value: "Luxury", label: "Luxe" },
  { value: "Budget", label: "Économique" },
  { value: "Popular", label: "Populaire" },
  { value: "New", label: "Nouveau" },
  { value: "Promoted", label: "Promu" },
  { value: "Special", label: "Spécial" },
];

export default function LabelFilter({
  filters,
  onFiltersChange,
  onReset,
}: LabelFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    field: keyof LabelFilterState,
    value: string | number
  ) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCategory) count++;
    if (filters.minPriority > 0) count++;
    if (filters.maxPriority < 100) count++;
    if (filters.hasIcon !== "all") count++;
    if (filters.hasColor !== "all") count++;
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
                    <Tag className="h-4 w-4" />
                    Catégorie
                  </label>
                  <select
                    value={filters.selectedCategory}
                    onChange={(e) =>
                      handleFilterChange("selectedCategory", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {LABEL_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Icône */}
                <div>
                  <label className="text-sm font-medium mb-2">Icône</label>
                  <select
                    value={filters.hasIcon}
                    onChange={(e) =>
                      handleFilterChange("hasIcon", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">Tous</option>
                    <option value="yes">Avec icône</option>
                    <option value="no">Sans icône</option>
                  </select>
                </div>

                {/* Couleur */}
                <div>
                  <label className="text-sm font-medium mb-2">Couleur</label>
                  <select
                    value={filters.hasColor}
                    onChange={(e) =>
                      handleFilterChange("hasColor", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">Tous</option>
                    <option value="yes">Avec couleur</option>
                    <option value="no">Sans couleur</option>
                  </select>
                </div>
              </div>

              {/* Priorité */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Priorité
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Minimum</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={filters.minPriority}
                      onChange={(e) =>
                        handleFilterChange(
                          "minPriority",
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
                      value={filters.maxPriority}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxPriority",
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
              {filters.selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Catégorie:{" "}
                  {
                    LABEL_CATEGORIES.find(
                      (c) => c.value === filters.selectedCategory
                    )?.label
                  }
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("selectedCategory", "")}
                  />
                </Badge>
              )}

              {filters.hasIcon !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Icône: {filters.hasIcon === "yes" ? "Avec" : "Sans"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("hasIcon", "all")}
                  />
                </Badge>
              )}

              {filters.hasColor !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Couleur: {filters.hasColor === "yes" ? "Avec" : "Sans"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("hasColor", "all")}
                  />
                </Badge>
              )}

              {(filters.minPriority > 0 || filters.maxPriority < 100) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Priorité: {filters.minPriority}-{filters.maxPriority}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      handleFilterChange("minPriority", 0);
                      handleFilterChange("maxPriority", 100);
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
