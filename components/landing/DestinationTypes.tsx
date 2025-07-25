"use client";
import React, { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import stayTypes from "@/lib/data/destination";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

export default function DestinationTypes() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 6,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 1280px)": {
        slides: {
          perView: 5,
          spacing: 12,
        },
      },
      "(max-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 10,
        },
      },
      "(max-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 8,
        },
      },
      "(max-width: 640px)": {
        slides: {
          perView: 2,
          spacing: 6,
        },
      },
      "(max-width: 480px)": {
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
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  const handlePrev = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">
            Types de destinations
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explorez différents types de destinations selon vos préférences et
            découvrez ce qui vous correspond le mieux
          </p>
        </div>

        <div className="relative">
          {/* Flèche gauche */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110"
            aria-label="Précédent"
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Carrousel */}
          <div ref={sliderRef} className="keen-slider px-12">
            {stayTypes
              .sort((a, b) => a.order - b.order)
              .map((type, idx) => {
                return (
                  <motion.div
                    key={type.label}
                    className="keen-slider__slide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Card className="group bg-white border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 h-[180px] w-full overflow-hidden cursor-pointer">
                      <CardContent className="flex flex-col items-center justify-center p-0 h-full">
                        {/* Image container - sans marges */}
                        <div className="w-full h-32 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                          <img
                            src={type.image}
                            alt={type.label}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>

                        {/* Label */}
                        <div className="flex-1 flex items-center justify-center px-4">
                          <h3 className="font-semibold text-base text-gray-800 text-center leading-tight group-hover:text-gray-900 transition-colors duration-300">
                            {type.label}
                          </h3>
                        </div>

                        {/* Indicateur hover */}
                        <div className="w-8 h-0.5 bg-blue-500 mb-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>

          {/* Flèche droite */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110"
            aria-label="Suivant"
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Indicateurs de pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(stayTypes.length / 6) }).map(
            (_, idx) => (
              <button
                key={idx}
                className="w-2 h-2 rounded-full bg-gray-300 hover:bg-blue-400 transition-colors duration-200"
                onClick={() => instanceRef.current?.moveToIdx(idx * 6)}
                aria-label={`Aller à la page ${idx + 1}`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
