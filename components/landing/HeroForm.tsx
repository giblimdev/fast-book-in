"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar, 
  Users,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function HeroForm() {
  const [destination, setDestination] = useState("");
  const [dateArrivee, setDateArrivee] = useState("");
  const [dateDepart, setDateDepart] = useState("");
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [chambres, setChambres] = useState([
    { adultes: 2, enfants: 0, animaux: 0 },
  ]);

  const ajouterChambre = () => {
    setChambres([...chambres, { adultes: 2, enfants: 0, animaux: 0 }]);
  };

  const supprimerChambre = (index: number) => {
    if (chambres.length > 1) {
      setChambres(chambres.filter((_, i) => i !== index));
    }
  };

  const modifierChambre = (index: number, field: string, value: number) => {
    const newChambres = [...chambres];
    newChambres[index] = { ...newChambres[index], [field]: Math.max(0, value) };
    setChambres(newChambres);
  };

  const totalPersonnes = chambres.reduce(
    (total, chambre) => total + chambre.adultes + chambre.enfants,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto -mt-20 relative z-20 ">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Destination */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Où voulez-vous aller ?
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ville, région, hôtel..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dates de séjour
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={dateArrivee}
                onChange={(e) => setDateArrivee(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={dateDepart}
                onChange={(e) => setDateDepart(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Voyageurs */}
        <div className="lg:col-span-3 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voyageurs et chambres
          </label>
          <button
            onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-2" />
              <span>
                {totalPersonnes} voyageur{totalPersonnes > 1 ? "s" : ""},{" "}
                {chambres.length} chambre{chambres.length > 1 ? "s" : ""}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          {/* Dropdown des voyageurs */}
          {showGuestsDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 p-4">
              {chambres.map((chambre, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-100 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">
                      Chambre {index + 1}
                    </h4>
                    {chambres.length > 1 && (
                      <button
                        onClick={() => supprimerChambre(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  {/* Adultes */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Adultes</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          modifierChambre(index, "adultes", chambre.adultes - 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{chambre.adultes}</span>
                      <button
                        onClick={() =>
                          modifierChambre(index, "adultes", chambre.adultes + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Enfants */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Enfants (0-17 ans)</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          modifierChambre(index, "enfants", chambre.enfants - 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{chambre.enfants}</span>
                      <button
                        onClick={() =>
                          modifierChambre(index, "enfants", chambre.enfants + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Animaux */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-700">
                        Animaux de compagnie
                      </span>
                      <p className="text-xs text-gray-500">
                        Les chiens d'assistance ne sont pas considérés comme
                        animaux de compagnie
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          modifierChambre(index, "animaux", chambre.animaux - 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{chambre.animaux}</span>
                      <button
                        onClick={() =>
                          modifierChambre(index, "animaux", chambre.animaux + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Ajouter une chambre */}
              <button
                onClick={ajouterChambre}
                className="w-full flex items-center justify-center py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter une chambre
              </button>

              <button
                onClick={() => setShowGuestsDropdown(false)}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          )}
        </div>

        {/* Bouton Recherche */}
        <div className="lg:col-span-2">
          <Link href="/demo/findedHotel">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
