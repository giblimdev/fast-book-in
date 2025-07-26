// @/components/layout/header/Header.tsx
"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import NavHeader from "./NavHeader";
import IsConnected from "@/components/layout/header/IsConnected";
import Setting from "./Setting";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo à gauche */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavHeader />
          </div>
          {/* Navigation settting */}
          <div>
            <Setting />
          </div>
          {/* Zone de droite : connexion + burger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <IsConnected />
            </div>

            {/* Burger uniquement en mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Menu de navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-4 bg-white/95 backdrop-blur-sm rounded-b-lg border-t">
            {/* Navigation mobile */}
            <NavHeader isMobile={true} onLinkClick={handleMobileLinkClick} />

            {/* IsConnected en mobile */}
            <div className="pt-4 border-t border-gray-200">
              <IsConnected />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
