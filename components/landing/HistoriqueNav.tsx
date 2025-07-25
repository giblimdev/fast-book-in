"use client";
import { CalendarDays, ChevronRight, Hotel } from "lucide-react";
import Link from "next/link";

export default function HistoriqueNav() {
  return (
    <section className="w-full bg-blue-50 shadow p-6 flex flex-col gap-4 mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-blue-900">
          Reprenez là où vous en étiez
        </h2>
        <Link
          href="/historique"
          className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-200 transition"
        >
          Voir toutes les activités récentes
        </Link>
      </div>
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm px-4 py-3 w-fit">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Hotel className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Hôtels</span>
          <span className="font-semibold text-blue-900">
            Phnom Penh, Cambodge
          </span>
          <span className="text-xs text-blue-700 flex items-center gap-1">
            <CalendarDays className="w-4 h-4 inline-block" />
            Sun, Apr 13 - Mon, Apr 14
          </span>
        </div>
        <ChevronRight className="ml-4 w-5 h-5 text-blue-400" />
      </div>
    </section>
  );
}
