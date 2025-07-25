// @/components/layout/header/Logo.tsx
import React from "react";
import { Bed, Star } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
      {/* Conteneur icône avec position relative contrôlée */}
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
          <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
          <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white fill-white" />
        </div>
      </div>

      {/* Texte responsive avec conteneur flex */}
      <div className="flex flex-col leading-none">
        <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          FastBook
        </span>
        <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent -mt-0.5 sm:-mt-1">
          Inn
        </span>
      </div>
    </Link>
  );
}
