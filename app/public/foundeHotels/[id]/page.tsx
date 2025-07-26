//@/app/public/foundeHotels/[id]/page.tsx
import InfoHotel from "@/components/hotel/InfoHotel";
import NavSectionHotel from "@/components/hotel/NavSectionHotel";
import HeroForm from "@/components/landing/HeroForm";
import React from "react";

export default function page() {
  return (
    <div>
      <br />
      <br />
      <br />
      <div className="p-3">
        <HeroForm />
      </div>
      <br />
      <br />
      <div className="m-3 bg-amber-100 p-3  rounded-xl">
        <InfoHotel />
      </div>
      <div className="m-3 bg-blue-200 p-3 rounded-xl">
        <NavSectionHotel />
      </div>
      <div className="m-3 bg-cyan-200 p-3 rounded-xl"> Description</div>
      <div className="m-3 bg-emerald-200 p-3  rounded-xl">
        Choix de la chambre
      </div>
      <div className="m-3 bg-fuchsia-200 p-3  rounded-xl">notes de l'hotel</div>

      <div className="m-3 bg-gray-200 p-3  rounded-xl"> avis Voyageurs </div>
      <div className="m-3 bg-green-200 p-3 rounded-xl">
        Service et equipement
      </div>
      <div className="m-3 bg-indigo-200 p-3  rounded-xl"> emplacement </div>
      <div className="m-3 bg-rose-200 p-3  rounded-xl"> Activités </div>

      <div className="m-3 bg-lime-200 p-3  rounded-xl"> accecibilité </div>
      <div className="m-3 bg-orange-300 p-3  rounded-xl"> Parcking </div>
      <div className="m-3 bg-pink-300 p-3  rounded-xl">
        condition (policies)
      </div>
      <div className="m-3 bg-purple-200 p-3  rounded-xl"> FaqHotel </div>
      <div className="m-3 bg-red-200 p-3  rounded-xl"> Sugestion </div>
    </div>
  );
}
