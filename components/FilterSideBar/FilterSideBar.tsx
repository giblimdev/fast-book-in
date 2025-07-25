// components/componentsDemo/FilterSideBar/FilterSideBar.tsx

"use client";
import React from "react";
import FilterSideBarDestination from "./FilterSideBarDestination";
import FilterSideBarRoomType from "./FilterSideBarRoomType";
import FilterSideBarAccommodationType from "./FilterSideBarAccommodationType";
import FilterSideBarNeighborhood from "./FilterSideBarNeighborhood";
import FilterSideBarLandmark from "./FilterSideBarLandmark";
import FilterSideBarHighlights from "./FilterSideBarHighlights";
import FilterSideBarService from "./FilterSideBarService";
import FilterSideBarRestaurant from "./FilterSideBarRestaurant";
import FilterSideBarAccessibility from "./FilterSideBarAccessibility";
import FilterSideBarParking from "./FilterSideBarParking";
import FilterSideBarGroup from "./FilterSideBarGroup";
import FilterSideBarLabel from "./FilterSideBarLabel";
import FilterSideBarMap from "./FilterSideBarMap";
import FilterSideBarPrice from "./FilterSideBarPrice";

export default function FilterSideBar() {
  return (
    <div className="px-3 space-y-4 max-h-full overflow-y-auto">
      {/* En-tête des filtres */}
      <div className="sticky top-0 bg-white z-10 pb-2 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900 mb-2">Filtres</h1>
        <FilterSideBarMap /><button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Effacer tous les filtres
        </button>
      </div>

<FilterSideBarPrice />
      {/* 1. CRITÈRES DE BASE - Les plus utilisés */}
      <FilterSideBarDestination />
      <FilterSideBarRoomType />
      <FilterSideBarAccommodationType />

      {/* 2. LOCALISATION - Critères géographiques */}
      <FilterSideBarNeighborhood />
      <FilterSideBarLandmark />

      {/* 3. CARACTÉRISTIQUES PRINCIPALES - Ce qui différencie */}
      <FilterSideBarHighlights />
      <FilterSideBarService />
      <FilterSideBarRestaurant />

      {/* 4. BESOINS SPÉCIFIQUES - Critères d'accessibilité et commodités */}
      <FilterSideBarAccessibility />
      <FilterSideBarParking />

      {/* 5. MARQUES ET LABELS - Critères commerciaux en fin */}
      <FilterSideBarGroup />
      <FilterSideBarLabel />
    </div>
  );
}
