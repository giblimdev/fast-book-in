// components/FilterSideBarAccommodationType.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour le type d'hébergement
const ACCOMMODATION_TYPE_FILTERS = [
  { label: "Hôtel", value: "hotel" },
  { label: "Appartement", value: "apartment" },
  { label: "Maison d'hôtes", value: "guesthouse" },
  { label: "Auberge de jeunesse", value: "hostel" },
  { label: "Villa", value: "villa" },
  { label: "Boutique hotel", value: "boutique_hotel" },
  { label: "Resort", value: "resort" },
  { label: "BnB", value: "bnb" },
  { label: "Hotel Historic", value: "hotel_historic" },
  { label: "Hotel Design", value: "hotel_design" },
  { label: "Serviced apartment", value: "serviced_apartment" },
  { label: "Condominium", value: "condominium" },
  { label: "Guest house", value: "guest_house" },
  { label: "Youth hostel", value: "youth_hostel" },
  { label: "Houseboat", value: "houseboat" },
  { label: "Private vacation home", value: "private_vacation_home" },
  { label: "Chalet", value: "chalet" },
  { label: "Camping", value: "camping" },
  { label: "Bungalow", value: "bungalow" },
  { label: "Cottage", value: "cottage" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarAccommodationType() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? ACCOMMODATION_TYPE_FILTERS
    : ACCOMMODATION_TYPE_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems =
    ACCOMMODATION_TYPE_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Type d&apos;hébergement
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
            type="button"
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
