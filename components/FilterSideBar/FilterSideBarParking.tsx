// components/FilterSideBarParking.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour le stationnement
const PARKING_FILTERS = [
  { label: "Parking sécurisé", value: "secure_parking" },
  { label: "Parking couvert", value: "covered_parking" },
  { label: "Parking gratuit", value: "free_parking" },
  { label: "Parking payant", value: "paid_parking" },
  { label: "Borne de recharge électrique", value: "ev_charging" },
  { label: "Parking privé", value: "private_parking" },
  { label: "Parking surveillé", value: "monitored_parking" },
  { label: "Garage fermé", value: "closed_garage" },
  { label: "Places PMR", value: "disabled_parking_spaces" },
  { label: "Parking extérieur", value: "outdoor_parking" },
  { label: "Parking souterrain", value: "underground_parking" },
  { label: "Voiturier", value: "valet_parking" },
  { label: "Parking moto", value: "motorcycle_parking" },
  { label: "Parking vélos", value: "bicycle_parking" },
  { label: "Parking bus/cars", value: "bus_parking" },
  { label: "Réservation parking", value: "parking_reservation" },
  { label: "Accès 24h/24", value: "24h_parking_access" },
  { label: "Parking proche centre", value: "city_center_parking" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarParking() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? PARKING_FILTERS
    : PARKING_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = PARKING_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Stationnement
      </legend>
      <div className="flex flex-col gap-2 mt-0">
        {displayedFilters.map((filter) => (
          <Label
            key={filter.value}
            className="text-gray-600 flex items-center gap-2 cursor-pointer"
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
