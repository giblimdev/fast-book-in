// components/FilterSideBarLandmark.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour les sites d'intérêt de Marseille
const LANDMARK_FILTERS = [
  { label: "Basilique Notre-Dame de la Garde", value: "notre_dame_garde" },
  { label: "Vieux-Port", value: "vieux_port" },
  { label: "Château d'If", value: "chateau_if" },
  { label: "Palais du Pharo", value: "palais_pharo" },
  { label: "Cathédrale La Major", value: "cathedrale_major" },
  { label: "MuCEM", value: "mucem" },
  { label: "Fort Saint-Nicolas", value: "fort_saint_nicolas" },
  { label: "Fort Saint-Jean", value: "fort_saint_jean" },
  { label: "Parc National des Calanques", value: "calanques" },
  { label: "Corniche Kennedy", value: "corniche_kennedy" },
  { label: "Palais Longchamp", value: "palais_longchamp" },
  { label: "Stade Vélodrome", value: "stade_velodrome" },
  { label: "Abbaye Saint-Victor", value: "abbaye_saint_victor" },
  { label: "Villa Méditerranée", value: "villa_mediterranee" },
  { label: "Musée d'Histoire de Marseille", value: "musee_histoire" },
  { label: "Parc Borély", value: "parc_borely" },
  { label: "Plage du Prado", value: "plage_prado" },
  { label: "Les Terrasses du Port", value: "terrasses_port" },
  { label: "Jardin du Pharo", value: "jardin_pharo" },
  { label: "Vallon des Auffes", value: "vallon_auffes" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarLandmark() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? LANDMARK_FILTERS
    : LANDMARK_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = LANDMARK_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Sites d'intérêt
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
