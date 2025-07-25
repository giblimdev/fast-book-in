// components/FilterSideBarPopular.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const POPULAR_FILTERS = [
  { label: "Petit-déjeuner inclus", value: "breakfast" },
  { label: "Annulation gratuite", value: "free_cancel" },
  { label: "Payez à l'hôtel", value: "pay_at_hotel" },
  { label: "Offre spéciale", value: "special_offer" },
  { label: "Réservable sans carte", value: "no_card" },
];

export default function FilterSideBarPopular() {
  const [checked, setChecked] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Filtre populaire
      </legend>
      <div className="text-gray-600 flex flex-col gap-2 mt-0">
        {POPULAR_FILTERS.map((filter) => (
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
      </div>
    </fieldset>
  );
}
