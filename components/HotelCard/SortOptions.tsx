// components/SortOptions.tsx

"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown } from "lucide-react"; // ou ton icône préférée

const SORT_OPTIONS = [
  "Nos préférés",
  "Logements entiers en premier",
  "Tarif (le - cher en premier)",
  "Tarif (le + cher en premier)",
  "Meilleure note et tarif le plus bas",
  "Catégorie (ordre décroissant)",
  "Catégorie (ordre croissant)",
  "Catégorie et tarif",
  "Distance du centre-ville",
  "Le plus de commentaires positifs",
];

export default function SortOptions() {
  const [selected, setSelected] = useState(SORT_OPTIONS[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white shadow-sm hover:bg-gray-50 text-sm font-medium">
          <ArrowUpDown className="w-4 h-4" />
          Trier par : {selected}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => setSelected(option)}
            className={selected === option ? "font-semibold bg-gray-100" : ""}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
