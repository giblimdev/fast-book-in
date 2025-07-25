// app/finedHotel/layout.tsx
import React from "react";
import FilterSidebar from "@/components/FilterSideBar/FilterSideBar";

interface FinedHotelLayoutProps {
  children: React.ReactNode;
}

export default function FinedHotelLayout({ children }: FinedHotelLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Section Filtres - 1/5 sur grand écran, pleine largeur sur mobile */}
        <aside className="w-full md:w-1/5 bg-white border-r border-gray-200 md:h-screen md:overflow-y-auto md:sticky md:top-0">
          <div className="">
            <h2 className="sr-only">Filtres de recherche d'hôtels</h2>
            <FilterSidebar />
          </div>
        </aside>

        {/* Section Contenu principal - 4/5 sur grand écran, pleine largeur sur mobile */}
        <main className="flex-1 md:w-4/5" role="main">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
