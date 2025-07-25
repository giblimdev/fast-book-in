// components/FilterSideBarHighlights.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour les points forts
const HIGHLIGHTS_FILTERS = [
  { label: "Vue remarquable", value: "remarkable_view" },
  { label: "Emplacement privilégié", value: "prime_location" },
  { label: "Vie nocturne animée", value: "vibrant_nightlife" },
  { label: "Atmosphère romantique", value: "romantic_atmosphere" },
  { label: "Calme et relaxant", value: "quiet_relaxing" },
  { label: "Accès direct à la plage", value: "beach_access" },
  { label: "Centre-ville", value: "city_center" },
  { label: "Proche des transports", value: "transport_nearby" },
  { label: "Vue sur mer", value: "sea_view" },
  { label: "Vue sur montagne", value: "mountain_view" },
  { label: "Jardin privé", value: "private_garden" },
  { label: "Piscine", value: "swimming_pool" },
  { label: "Spa et bien-être", value: "spa_wellness" },
  { label: "Restaurants gastronomiques", value: "fine_dining" },
  { label: "Activités familiales", value: "family_activities" },
  { label: "Sports nautiques", value: "water_sports" },
  { label: "Randonnée à proximité", value: "hiking_nearby" },
  { label: "Architecture historique", value: "historic_architecture" },
  { label: "Design moderne", value: "modern_design" },
  { label: "Service de conciergerie", value: "concierge_service" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarHighlights() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? HIGHLIGHTS_FILTERS
    : HIGHLIGHTS_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = HIGHLIGHTS_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Points forts
      </legend>
      <div className="flex flex-col gap-2 mt-0">
        {displayedFilters.map((filter) => (
          <Label
            key={filter.value}
            className="text-gray-600 flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={checked.includes(filter.value)}
              onCheckedChange={() => handleChange(filter.value)}
              id={filter.value}
              className="w-5 h-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-700"
            />
            <span className="text-sm">{filter.label}</span>
          </Label>
        ))}

        {hasMoreItems && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors"
          >
            {showAll ? (
              <>
                <span>Afficher moins</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Afficher plus</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </fieldset>
  );
}
