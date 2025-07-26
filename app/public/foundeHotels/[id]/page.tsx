// @/app/demo/foundeHotels/[id]/page.tsx
import InfoHotel from "@/components/hotel/InfoHotel";
import NavSectionHotel from "@/components/hotel/NavSectionHotel";
import HeroForm from "@/components/landing/HeroForm";
import Description from "@/components/hotel/Description";
import Room from "@/components/hotel/Room";
import Evaluation from "@/components/hotel/Evaluation";
import Amenities from "@/components/hotel/RoomAmenities";
import Policy from "@/components/hotel/Policy";
import Faq from "@/components/hotel/Faq";
import React from "react";
import RelatedHotels from "@/components/hotel/RelatedHotels";

// ✅ Type corrigé pour Next.js 15+
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ✅ Fonction async avec await des paramètres
export default async function Page({ params }: PageProps) {
  // ✅ Await obligatoire en Next.js 15+
  const { id } = await params;

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
      <div className="m-3 bg-amber-100 p-3 rounded-xl">
        <InfoHotel />
      </div>
      <div className="m-3 bg-blue-200 p-3 rounded-xl">
        <NavSectionHotel />
      </div>
      <div id="description" className="m-3 bg-cyan-200 p-3 rounded-xl">
        <Description />
      </div>
      <div id="room" className="m-3 bg-emerald-200 p-3 rounded-xl">
        <Room />
      </div>
      <div id="notes" className="m-3 bg-fuchsia-200 p-3 rounded-xl">
        <Evaluation />
      </div>
      <div id="reviews" className="m-3 bg-gray-200 p-3 rounded-xl">
        Avis Voyageurs (à développer)
      </div>
      <div id="amenities" className="m-3 bg-green-200 p-3 rounded-xl">
        <Amenities />
      </div>
      <div id="location" className="m-3 bg-indigo-200 p-3 rounded-xl">
        Emplacement (à développer)
      </div>
      <div id="activities" className="m-3 bg-rose-200 p-3 rounded-xl">
        Activités (à développer)
      </div>
      <div id="accessibility" className="m-3 bg-lime-200 p-3 rounded-xl">
        Accessibilité (à développer)
      </div>
      <div id="parking" className="m-3 bg-orange-300 p-3 rounded-xl">
        Parking (à développer)
      </div>
      <div id="policies" className="m-3 bg-pink-300 p-3 rounded-xl">
        <Policy hotelId={id} />
      </div>
      <div id="faq" className="m-3 bg-purple-200 p-3 rounded-xl">
        <Faq hotelId={id} />
      </div>
      <div id="suggestions" className="m-3 bg-red-200 p-3 rounded-xl">
        <RelatedHotels
          currentHotelId={id}
          destination="Centre historique"
          maxPrice={300}
          limit={9}
        />
      </div>
    </div>
  );
}
