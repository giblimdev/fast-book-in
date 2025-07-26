// @/components/layout/header/Setting.tsx
"use client";

import React, { useState } from "react";
import {
  Globe,
  DollarSign,
  Settings,
  ChevronDown,
  Check,
  Languages,
} from "lucide-react";

// Types basés sur votre schéma Country
interface Country {
  id: string;
  name: string;
  code: string;
  language?: string;
  currency?: string;
}

// Données simulées basées sur votre schéma
const countries: Country[] = [
  { id: "1", name: "France", code: "FR", language: "fr", currency: "EUR" },
  { id: "2", name: "Spain", code: "ES", language: "es", currency: "EUR" },
  {
    id: "3",
    name: "United Kingdom",
    code: "GB",
    language: "en",
    currency: "GBP",
  },
  {
    id: "4",
    name: "United States",
    code: "US",
    language: "en",
    currency: "USD",
  },
  { id: "5", name: "Germany", code: "DE", language: "de", currency: "EUR" },
  { id: "6", name: "Italy", code: "IT", language: "it", currency: "EUR" },
  { id: "7", name: "Switzerland", code: "CH", language: "fr", currency: "CHF" },
];

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

const currencies = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
];

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [activeTab, setActiveTab] = useState<"language" | "currency">(
    "language"
  );

  const currentLanguage = languages.find(
    (lang) => lang.code === selectedLanguage
  );
  const currentCurrency = currencies.find(
    (curr) => curr.code === selectedCurrency
  );

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Ici vous pourriez intégrer avec i18n ou votre système de localisation
    console.log("Language changed to:", languageCode);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // Ici vous pourriez mettre à jour le contexte global de devise
    console.log("Currency changed to:", currencyCode);
  };

  return (
    <div className="relative">
      {/* Bouton trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 bg-white shadow-sm"
        aria-label="Paramètres de langue et devise"
      >
        <Settings className="w-4 h-4 text-gray-600" />
        <div className="hidden sm:flex items-center space-x-1 text-sm">
          <span className="text-gray-600">{currentLanguage?.flag}</span>
          <span className="text-gray-800 font-medium">
            {currentLanguage?.code.toUpperCase()}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-800 font-medium">
            {currentCurrency?.symbol}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu content */}
          <div className=" absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* Header avec tabs */}
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("language")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "language"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Languages className="w-4 h-4" />
                    <span>Langue</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("currency")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "currency"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Devise</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-64 overflow-y-auto">
              {activeTab === "language" && (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                    Sélectionner une langue
                  </div>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                        selectedLanguage === language.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                        <span className="text-xs text-gray-500 uppercase">
                          {language.code}
                        </span>
                      </div>
                      {selectedLanguage === language.code && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "currency" && (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                    Sélectionner une devise
                  </div>
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        handleCurrencyChange(currency.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                        selectedCurrency === currency.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
                          {currency.symbol}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{currency.name}</div>
                          <div className="text-xs text-gray-500">
                            {currency.code}
                          </div>
                        </div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec info */}
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                Sélection actuelle : {currentLanguage?.name} •{" "}
                {currentCurrency?.name}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
