// components/FilterSideBarService.tsx

"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

// Filtres pour les services proposés
const SERVICE_FILTERS = [
  { label: "Réception 24h/24", value: "reception_24h" },
  { label: "Navette aéroport", value: "airport_shuttle" },
  { label: "Blanchisserie", value: "laundry" },
  { label: "Service de conciergerie", value: "concierge" },
  { label: "Bagagerie", value: "luggage" },
  { label: "Bar", value: "bar" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Casino", value: "casino" },
  { label: "Spa / Massage", value: "spa_massage" },
  { label: "Salle de sport", value: "gym" },
  { label: "Centre d'affaires", value: "business_center" },
  { label: "Boutique", value: "boutique" },
  { label: "Piscine", value: "pool" },
  { label: "Parc aquatique", value: "water_park" },
  { label: "Golf", value: "golf" },
  { label: "Service en chambre", value: "room_service" },
  { label: "Change de devises", value: "currency_exchange" },
  { label: "Service de réveil", value: "wake_up_service" },
  { label: "Enregistrement automatique", value: "self_check_in" },
  { label: "Location de vélos", value: "bike_rental" },
  { label: "Location de scooters", value: "scooter_rental" },
  { label: "Location de voitures", value: "car_rental" },
  { label: "Service de navette", value: "shuttle_service" },
  { label: "Animaux acceptés", value: "pets_allowed" },
  { label: "Zone fumeurs", value: "smoking_area" },
];

const INITIAL_DISPLAY_COUNT = 7;

export default function FilterSideBarService() {
  const [checked, setChecked] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleChange = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const displayedFilters = showAll
    ? SERVICE_FILTERS
    : SERVICE_FILTERS.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreItems = SERVICE_FILTERS.length > INITIAL_DISPLAY_COUNT;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Services
      </legend>
      <div className="flex flex-col gap-2 mt-0">
        {displayedFilters.map((filter) => (
          <ShadcnLabel
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
