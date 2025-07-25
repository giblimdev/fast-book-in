//@/app/public/foundeHotels/page.tsx
import React from "react";
import HeroForm from "@/components/landing/HeroForm";
import HotelCardsDisplay from "@/components/HotelCard/HotelCardsDisplay";
import SortOptions from "@/components/HotelCard/SortOptions";

export default function HotelSearchPage() {
  return (
    <div className="">
      {/* 1. Formulaire de recherche en haut */}
      <div className="  pt-20 mb-5">
        <HeroForm />
      </div>

      {/* 2. Header avec titre et options de tri */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hôtels à Marseille
          </h1>
          <p className="text-gray-600">
            Découvrez notre sélection d'hôtels à Marseille
          </p>
        </div>
        <div className="w-full md:w-auto">
          <SortOptions />
        </div>
      </div>

      {/* 3. Affichage des cartes d'hôtels */}
      <div>
        <HotelCardsDisplay />
      </div>
    </div>
  );
}
