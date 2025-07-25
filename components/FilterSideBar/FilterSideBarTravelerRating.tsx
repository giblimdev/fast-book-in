// components/FilterSideBarTravelerRating.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";

// Filtres factices pour les notes des voyageurs
const TRAVELER_RATING_FILTERS = [
  { label: "Exceptionnel (9+)", value: "exceptional" },
  { label: "Très bien (8+)", value: "very_good" },
  { label: "Bien (7+)", value: "good" },
  { label: "Satisfaisant (6+)", value: "satisfactory" },
  { label: "Sans préférence", value: "any" },
];

export default function FilterSideBarTravelerRating() {
  const [checked, setChecked] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Notes des voyageurs
      </legend>
      <div className="text-gray-600 flex flex-col gap-2 mt-0">
        {TRAVELER_RATING_FILTERS.map((filter) => (
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
