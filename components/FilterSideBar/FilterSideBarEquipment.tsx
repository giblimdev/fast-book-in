// components/FilterSideBarCategory.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Filtres factices pour la catégorie
const CATEGORY_FILTERS = [
  { label: "1 étoile", value: "1star" },
  { label: "2 étoiles", value: "2star" },
  { label: "3 étoiles", value: "3star" },
  { label: "4 étoiles", value: "4star" },
  { label: "5 étoiles", value: "5star" },
];

export default function FilterSideBarCategory() {
  const [checked, setChecked] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white mt-0">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Catégorie
      </legend>
      <div className="text-gray-600 flex flex-col gap-2 mt-0">
        {CATEGORY_FILTERS.map((filter) => (
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
