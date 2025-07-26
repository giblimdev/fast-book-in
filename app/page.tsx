"use client";

import React from "react";
import HeroForm from "@/components/landing/HeroForm";
import HeroImage from "@/components/landing/HeroImage";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HistoriqueNav from "@/components/landing/HistoriqueNav";
import RodmapResa from "@/components/landing/RodmapResa";
import AccomodationTypes from "@/components/landing/AccomodationTypes";
import DestinationTypes from "@/components/landing/DestinationTypes";
import City from "@/components/landing/City";
import BeMember from "@/components/landing/BeMember";
import InstallApp from "@/components/landing/InstallApp";
import Landingpromo from "@/components/landing/Landingpromo";

export default function Home() {
  return (
    <div className="max-w min-h-screen bg-gradient-to-br from-blue-50 to-purple-200 ">
      <div className="">
        <HeroImage />
      </div>

      {/* HeroForm Section */}
      <div className="max-w-7xl mx-auto ">
        <div className="text-center">
          <HeroForm />
        </div>
      </div>
      <div className="-mt-20">
        <WhyChooseUs />
      </div>
      <div>
        <HistoriqueNav />
      </div>
      <div>
        <div>
          <AccomodationTypes />
        </div>
        <div>
          <DestinationTypes />
        </div>
        <div>
          <City />
        </div>
        <div>
          <BeMember />
        </div>
        <div id="download-app">
          <InstallApp />
        </div>
        <div>
          <Landingpromo />
        </div>
      </div>

      <div>
        <RodmapResa />{" "}
      </div>
    </div>
  );
}
