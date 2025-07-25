// components/FilterSideBarPrice.tsx

"use client";

import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";

// Formatte un nombre en euro, avec "+" si besoin
function formatEuro(value: number, plus?: boolean) {
  return value.toLocaleString("fr-FR") + " €" + (plus ? "+" : "");
}

export default function FilterSideBarPrice() {
  const [value, setValue] = useState<[number, number]>([80, 500]);
  const min = 0;
  const max = 999;

  return (
    <fieldset className="mb-6 border-2 border-blue-500 rounded-lg p-4 bg-white">
      <legend className="px-2 text-blue-700 font-semibold text-sm">
        Prix par nuit
      </legend>
      <div className="flex gap-3 mb-3 mt-2">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1 font-medium font-sans">Min.</div>
          <div className="border-2 border-gray-300 rounded-lg px-3 py-2 text-center font-semibold bg-gray-50 text-base font-sans text-gray-800">
            {formatEuro(value[0])}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1 font-medium font-sans">Max.</div>
          <div className="border-2 border-gray-300 rounded-lg px-3 py-2 text-center font-semibold bg-gray-50 text-base font-sans text-gray-800">
            {formatEuro(value[1], value[1] === max)}
          </div>
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={10}
        value={value}
        onValueChange={(v: [number, number]) => setValue([v[0], v[1]])}
        className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-blue-200 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&>span:first-child>span]:bg-blue-600"
      />
    </fieldset>
  );
}
