import React from "react";
import HeroForm from "@/components/landing/HeroForm";
import HotelCardsDisplay from "@/components/HotelCard/HotelCardsDisplay";
import SortOptions from "@/components/HotelCard/SortOptions";
import FilterSidebar from "@/components/FilterSideBar/FilterSideBar";

export default function HotelSearchPage() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Section Filtres - 1/5 sur grand écran, pleine largeur sur mobile */}
      <aside className="w-full md:w-1/5 bg-white border-r border-gray-200 md:h-screen md:overflow-y-auto md:sticky md:top-0">
        <div className="p-4">
          <h2 className="sr-only">Filtres de recherche d'hôtels</h2>
          <FilterSidebar />
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-4 md:p-6">
        {/* 1. Formulaire de recherche en haut */}
        <div className="pt-20 mb-5">
          <HeroForm />
        </div>

        {/* 2. Header avec titre et options de tri */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
      </main>
    </div>
  );
}
