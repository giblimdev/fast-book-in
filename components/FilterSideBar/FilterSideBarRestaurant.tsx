// components/FilterSideBarRestaurant.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour la restauration
const RESTAURANT_FILTERS = [
  { label: "Petit-déjeuner disponible", value: "breakfast" },
  { label: "Restaurant sur place", value: "onsite_restaurant" },
  { label: "Service en chambre", value: "room_service" },
  { label: "Bar / Lounge", value: "bar" },
  { label: "Options végétariennes", value: "vegetarian" },
  { label: "Petit-déjeuner continental", value: "continental_breakfast" },
  { label: "Petit-déjeuner anglais", value: "english_breakfast" },
  { label: "Petit-déjeuner américain", value: "american_breakfast" },
  { label: "Buffet petit-déjeuner", value: "breakfast_buffet" },
  { label: "Options véganes", value: "vegan" },
  { label: "Options sans gluten", value: "gluten_free" },
  { label: "Cuisine locale", value: "local_cuisine" },
  { label: "Cuisine internationale", value: "international_cuisine" },
  { label: "Restaurant gastronomique", value: "fine_dining" },
  { label: "Snack-bar", value: "snack_bar" },
  { label: "Café / Cafétéria", value: "cafe" },
  { label: "Minibar en chambre", value: "minibar" },
  { label: "Distributeurs automatiques", value: "vending_machines" },
  { label: "Terrasse restaurant", value: "restaurant_terrace" },
  { label: "Dîner aux chandelles", value: "candlelight_dinner" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarRestaurant() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? RESTAURANT_FILTERS
    : RESTAURANT_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = RESTAURANT_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Restauration
      </legend>
      <div className="text-gray-600 flex flex-col gap-2 mt-0">
        {displayedFilters.map((filter) => (
          <ShadcnLabel
            key={filter.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={checked.includes(filter.value)}
              onCheckedChange={() => handleChange(filter.value)}
              id={filter.value}
              className="w-5 h-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-700"
            />
            <span className="text-sm">{filter.label}</span>
          </ShadcnLabel>
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
