// @/components/admin/Footer.tsx
import React from "react";
import Link from "next/link";
import { Heart, Github, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gradient-to-r from-slate-50 via-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FastBooking Admin
                </h3>
                <p className="text-sm text-gray-600">
                  Dashboard d'administration
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Plateforme complète de gestion hôtelière avec interface
              d'administration intuitive pour gérer vos hébergements,
              destinations et réservations.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Gestion</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/hotel-card"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Hôtels
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/destination"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/user"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Utilisateurs
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/country"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Géographie
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/docs"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/api/docs"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  API Docs
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@fastbooking.com"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Support
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/votre-repo"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">1,248</div>
              <div className="text-xs text-gray-600">Utilisateurs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">156</div>
              <div className="text-xs text-gray-600">Hôtels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-xs text-gray-600">Destinations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">3,400</div>
              <div className="text-xs text-gray-600">Réservations</div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2025 Fast Book Inn. All rights reserved.</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Système opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
