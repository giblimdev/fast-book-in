"use client";

import React, { useState, useEffect } from "react";
import { Search, Globe, X, Filter } from "lucide-react";

interface FilterParams {
  hasWebsite?: boolean;
  search?: string;
  includeRelations?: boolean;
}

interface HotelGroupFilterProps {
  onFilterChange: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
}

export default function HotelGroupFilter({
  onFilterChange,
  initialFilters = {},
}: HotelGroupFilterProps) {
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || "");

  // Appliquer les filtres avec un délai pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters = {
        ...filters,
        search: searchTerm.trim() || undefined,
      };
      onFilterChange(newFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    onFilterChange({});
  };

  const hasActiveFilters =
    searchTerm || filters.hasWebsite !== undefined || filters.includeRelations;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Effacer les filtres
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recherche */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom ou description..."
              className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Site Web */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Site Web
          </label>
          <select
            value={
              filters.hasWebsite === undefined
                ? ""
                : filters.hasWebsite.toString()
            }
            onChange={(e) =>
              handleFilterChange(
                "hasWebsite",
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            <option value="true">Avec site web</option>
            <option value="false">Sans site web</option>
          </select>
        </div>

        {/* Relations */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Données détaillées
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeRelations"
              checked={filters.includeRelations || false}
              onChange={(e) =>
                handleFilterChange("includeRelations", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="includeRelations"
              className="ml-2 text-sm text-gray-700"
            >
              Inclure les hôtels associés
            </label>
          </div>
        </div>
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500">Filtres actifs:</span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              <Search className="h-3 w-3" />
              {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.hasWebsite !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <Globe className="h-3 w-3" />
              {filters.hasWebsite ? "Avec site" : "Sans site"}
              <button
                onClick={() => handleFilterChange("hasWebsite", undefined)}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.includeRelations && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Données détaillées
              <button
                onClick={() => handleFilterChange("includeRelations", false)}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
