// components/FilterSideBarLabel.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour les labels
const LABEL_FILTERS = [
  { label: "Eco-responsable", value: "eco" },
  { label: "Famille", value: "family" },
  { label: "Luxe", value: "luxury" },
  { label: "Business", value: "business" },
  { label: "Romantique", value: "romantic" },
  { label: "Suite de Travail", value: "work_place_suite" },
  { label: "Nid Familial", value: "family_nest" },
  { label: "Choix Romantique", value: "romantic_choice" },
  { label: "Escale Loisirs", value: "leisure_landing" },
  { label: "Portail Doré", value: "gilded_gateway" },
  {
    label: "Hébergement Historique & Culturel",
    value: "historical_culture_hosting",
  },
  { label: "Hébergement Écologique", value: "eco_hosting" },
  { label: "Lieu Inclusif", value: "inclusive_place" },
  { label: "Base d'Aventure", value: "adventure_base" },
  { label: "Oasis Urbaine", value: "urban_oasis" },
  { label: "Refuge pour Animaux", value: "pet_haven" },
  { label: "Retraite Bien-être", value: "wellness_retreat" },
  { label: "Cabane Détox Numérique", value: "digital_detox_cabin" },
  { label: "Bord de Mer", value: "seaside" },
  { label: "Montagne", value: "mountain" },
  { label: "Campagne", value: "countryside" },
  { label: "Désert", value: "desert" },
  { label: "Urbain", value: "urban" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarLabel() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? LABEL_FILTERS
    : LABEL_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = LABEL_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Label
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
