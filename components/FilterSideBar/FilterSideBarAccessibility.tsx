// components/FilterSideBarAccessibility.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres d'accessibilité
const ACCESSIBILITY_FILTERS = [
  { label: "Accès fauteuil roulant", value: "wheelchair" },
  { label: "Ascenseur", value: "elevator" },
  { label: "Salle de bain adaptée", value: "adapted_bathroom" },
  { label: "Signalétique en braille", value: "braille" },
  { label: "Parking PMR", value: "disabled_parking" },
  { label: "Animaux d'assistance autorisés", value: "assistance_animals" },
  { label: "Chemin sans marches", value: "step_free_path" },
  { label: "Douche accessible en fauteuil", value: "wheelchair_shower" },
  { label: "Parking accessible fauteuil", value: "wheelchair_parking" },
  { label: "Chambres adaptées PMR", value: "accessible_rooms" },
  { label: "Réception accessible", value: "accessible_reception" },
  { label: "Restaurant accessible", value: "accessible_restaurant" },
  { label: "Piscine accessible", value: "accessible_pool" },
  { label: "Équipements audio-visuels", value: "audio_visual_aids" },
  { label: "Personnel formé handicap", value: "trained_staff" },
  { label: "Rampes d'accès", value: "access_ramps" },
  { label: "Portes automatiques", value: "automatic_doors" },
  { label: "Toilettes adaptées", value: "accessible_toilets" },
  { label: "Éclairage adapté malvoyants", value: "adapted_lighting" },
  { label: "Système d'alerte visuelle", value: "visual_alert_system" }
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarAccessibility() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll 
    ? ACCESSIBILITY_FILTERS 
    : ACCESSIBILITY_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = ACCESSIBILITY_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Accessibilité
      </legend>
      <div className="text-gray-600 flex flex-col gap-2 mt-0">
        {displayedFilters.map((filter) => (
          <Label
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
