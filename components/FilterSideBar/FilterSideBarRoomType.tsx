// components/FilterSideBarRoomType.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour le type de chambre
const ROOM_TYPE_FILTERS = [
  { label: "Dortoir", value: "dormitory" },
  { label: "Chambre simple", value: "single" },
  { label: "Chambre double", value: "double" },
  { label: "Chambre triple", value: "triple" },
  { label: "Suite", value: "suite" },
  { label: "Appartement", value: "apartment" },
  { label: "Chambre familiale", value: "family" },
  { label: "Chambre deluxe", value: "deluxe" },
  { label: "Suite junior", value: "junior_suite" },
  { label: "Suite présidentielle", value: "presidential_suite" },
  { label: "Studio", value: "studio" },
  { label: "Loft", value: "loft" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Chambre twin", value: "twin" },
  { label: "Chambre quadruple", value: "quad" },
  { label: "Bungalow", value: "bungalow" },
  { label: "Villa", value: "villa" },
  { label: "Chalet", value: "chalet" },
  { label: "Chambre standard", value: "standard" },
  { label: "Chambre supérieure", value: "superior" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarRoomType() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? ROOM_TYPE_FILTERS
    : ROOM_TYPE_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = ROOM_TYPE_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Type de chambre
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
