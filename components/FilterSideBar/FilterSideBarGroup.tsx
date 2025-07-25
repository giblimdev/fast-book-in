// components/FilterSideBarGroup.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour la chaîne/groupe hôtelier
const GROUP_FILTERS = [
  { label: "Accor", value: "accor" },
  { label: "Marriott", value: "marriott" },
  { label: "Hilton", value: "hilton" },
  { label: "Best Western", value: "bestwestern" },
  { label: "InterContinental", value: "ihg" },
  { label: "Particulier", value: "particulier" },
  { label: "Professionnel", value: "professionnel" },
  { label: "Formule 1", value: "formule1" },
  { label: "B&B Hotels", value: "bb_hotels" },
  { label: "Ibis", value: "ibis" },
  { label: "Novotel", value: "novotel" },
  { label: "Mercure", value: "mercure" },
  { label: "Holiday Inn", value: "holiday_inn" },
  { label: "Premier Inn", value: "premier_inn" },
  { label: "Campanile", value: "campanile" },
  { label: "Kyriad", value: "kyriad" },
  { label: "Première Classe", value: "premiere_classe" },
  { label: "Logis", value: "logis" },
  { label: "Relais & Châteaux", value: "relais_chateaux" },
  { label: "Châteaux & Hôtels", value: "chateaux_hotels" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarGroup() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? GROUP_FILTERS
    : GROUP_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = GROUP_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Chaîne d'hôtels
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
