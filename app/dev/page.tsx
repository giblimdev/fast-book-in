import Link from "next/link";
import React from "react";

export default function DevDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Tableau de bord de développement
        </h1>
        <p className="text-gray-600 mt-2">
          Espace dédié aux outils et ressources pour les développeurs
        </p>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h2>
          <div className="flex gap-4">
            <Link
              href="/dev/features"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/dev/schema"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Schéma
            </Link>
            <Link
              href="/dev/displayComponent"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              SelectCity
            </Link>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Bienvenue
          </h2>
          <p className="text-gray-600">
            Bienvenue sur l'espace de développement. Cet espace vous donne accès
            aux différentes ressources et outils nécessaires pour le
            développement et la maintenance de l'application.
          </p>
        </section>
      </main>

      <footer className="mt-12 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} - Tableau de bord de développement</p>
      </footer>
    </div>
  );
}
