// components/FilterSideBarSmart.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";

// Filtres intelligents factices pour l'exemple
const SMART_FILTERS = [
  { label: "Recommandé par l'algorithme", value: "recommended" },
  { label: "Bon rapport qualité/prix", value: "best_value" },
  { label: "Populaire auprès des familles", value: "family_popular" },
  { label: "Idéal pour les affaires", value: "business_friendly" },
  { label: "Séjours longue durée", value: "long_stay" },
];

export default function FilterSideBarSmart() {
  const [checked, setChecked] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Filtres intelligents
      </legend>
      <div className="text-gray-600 flex flex-col gap-2 mt-0">
        {SMART_FILTERS.map((filter) => (
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
      </div>
    </fieldset>
  );
}
