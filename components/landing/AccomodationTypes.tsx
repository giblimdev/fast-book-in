"use client";
import React, { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { accommodationTypes } from "@/lib/data/accommodationType";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

export default function AccomodationTypes() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4,
      spacing: 8,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 6,
        },
      },
      "(max-width: 640px)": {
        slides: {
          perView: 1,
          spacing: 4,
        },
      },
    },
  });

  // AUTOPLAY LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3500);
    return () => clearInterval(interval);
  }, [instanceRef]);

  const handlePrev = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  return (
    <section className="py-14 bg-gradient-to-b from-blue-200 via-white to-blue-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold mb-2 text-center text-blue-800 drop-shadow">
          Types d'hébergement
        </h2>
        <p className="text-center text-gray-500 mb-10 text-lg">
          Trouvez l'hébergement qui correspond à vos envies et à votre style de
          voyage.
        </p>
        <div className="relative">
          {/* Flèche gauche */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg ring-2 ring-blue-100 rounded-full p-2 hover:bg-blue-100 transition"
            aria-label="Précédent"
            type="button"
          >
            <ChevronLeft className="w-7 h-7 text-blue-700" />
          </button>
          {/* Carrousel */}
          <div ref={sliderRef} className="keen-slider px-2">
            {accommodationTypes
              .sort((a, b) => a.order - b.order)
              .map((type, idx) => (
                <motion.div
                  key={type.label}
                  className="keen-slider__slide"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <Card className="group bg-gradient-to-tr from-blue-50 via-white to-blue-100 border border-blue-100 transition-all duration-300 h-[200px] w-[210px] mx-auto hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:border-blue-300 overflow-hidden p-0">
                    {/* IMAGE */}
                    <div className="w-full h-56 overflow-hidden border-b border-blue-100 shadow-sm relative">
                      <img
                        src={type.image}
                        alt={type.label}
                        className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                      />
                      {idx === 0 && (
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow font-semibold z-10">
                          Populaire
                        </span>
                      )}
                    </div>

                    {/* CONTENU */}
                    <CardContent className="flex flex-col items-center justify-center pb-3 h-16">
                      <span className="font-bold text-lg text-blue-900 text-center tracking-tight leading-tight">
                        {type.label}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
          {/* Flèche droite */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg ring-2 ring-blue-100 rounded-full p-2 hover:bg-blue-100 transition"
            aria-label="Suivant"
            type="button"
          >
            <ChevronRight className="w-7 h-7 text-blue-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
