// components/FilterSideBarNeighborhood.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour les quartiers de Marseille
const NEIGHBORHOOD_FILTERS = [
  { label: "Vieux-Port", value: "vieux_port" },
  { label: "Le Panier", value: "le_panier" },
  { label: "Notre-Dame-du-Mont", value: "notre_dame_du_mont" },
  { label: "La Canebière", value: "la_canebiere" },
  { label: "Castellane", value: "castellane" },
  { label: "Prado", value: "prado" },
  { label: "Corniche", value: "corniche" },
  { label: "Joliette", value: "joliette" },
  { label: "République", value: "republique" },
  { label: "Baille", value: "baille" },
  { label: "Périer", value: "perier" },
  { label: "Rond-Point du Prado", value: "rond_point_prado" },
  { label: "Vauban", value: "vauban" },
  { label: "Cours Julien", value: "cours_julien" },
  { label: "La Plaine", value: "la_plaine" },
  { label: "Endoume", value: "endoume" },
  { label: "Roucas-Blanc", value: "roucas_blanc" },
  { label: "Bonneveine", value: "bonneveine" },
  { label: "Pointe-Rouge", value: "pointe_rouge" },
  { label: "Les Goudes", value: "les_goudes" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarNeighborhood() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? NEIGHBORHOOD_FILTERS
    : NEIGHBORHOOD_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = NEIGHBORHOOD_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Quartier
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
