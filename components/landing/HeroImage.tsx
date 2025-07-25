"use client";

import React from "react";
import HeroForm from "./HeroForm";

const HERO_IMAGE_URL = "/hero.png";
const HERO_SLOGAN = "Réservez facilement, vivez pleinement";
const HERO_SUBTITLE = "L'application de réservation qui simplifie votre vie";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
      />

      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Contenu centré */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Titre principal */}
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="block drop-shadow-2xl">{HERO_SLOGAN}</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-12 max-w-3xl mx-auto drop-shadow-lg">
            {HERO_SUBTITLE}
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out">
              Commencer maintenant
            </button>
            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 ease-out">
              Découvrir l'app
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
