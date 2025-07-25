//@/app/host/accommodations/page.tsx

import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Capture d'écran FastBooking
        </h1>

        <div className="relative w-full">
          <Image
            src="/Capture d’écran 2025-07-26 001429.png"
            alt="Capture d'écran FastBooking - Interface de démonstration"
            width={1800}
            height={1200}
            className="rounded-lg border border-gray-200 shadow-sm w-full h-auto"
            priority
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Aperçu de l'interface FastBooking</p>
        </div>
      </div>
    </div>
  );
}
