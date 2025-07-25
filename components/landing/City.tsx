"use client";
import React, { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { city } from "@/lib/data/city";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

export default function City() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1280px)": {
        slides: {
          perView: 3,
          spacing: 16,
        },
      },
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 12,
        },
      },
      "(max-width: 640px)": {
        slides: {
          perView: 1,
          spacing: 8,
        },
      },
    },
  });

  // AUTOPLAY LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4500);
    return () => clearInterval(interval);
  }, [instanceRef]);

  const handlePrev = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Destinations populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez les villes les plus prisées au monde et trouvez votre
              prochaine destination de rêve parmi notre sélection soigneusement
              choisie
            </p>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 rounded-full p-4 hover:bg-white hover:scale-110 transition-all duration-300 group"
            aria-label="Ville précédente"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 rounded-full p-4 hover:bg-white hover:scale-110 transition-all duration-300 group"
            aria-label="Ville suivante"
            type="button"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Carousel */}
          <div ref={sliderRef} className="keen-slider px-16">
            {city
              .sort((a, b) => a.order - b.order)
              .map((cityItem, idx) => (
                <motion.div
                  key={cityItem.label}
                  className="keen-slider__slide"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-[420px] cursor-pointer">
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={`${cityItem.image}`}
                        alt={`${cityItem.label}, ${cityItem.country}`}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-city.png";
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                      {/* Popular Badge */}
                      {idx < 3 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                          ⭐ Top {idx + 1}
                        </div>
                      )}

                      {/* Country Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        {cityItem.country}
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6 h-40 flex flex-col justify-between">
                      {/* City Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {cityItem.label}
                          </h3>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {cityItem.description}
                        </p>
                      </div>

                      {/* Destination Types */}
                      <div className="flex flex-wrap gap-1.5">
                        {cityItem.destinationType
                          .slice(0, 3)
                          .map((type, typeIdx) => (
                            <span
                              key={typeIdx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors duration-200"
                            >
                              {type}
                            </span>
                          ))}
                        {cityItem.destinationType.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            +{cityItem.destinationType.length - 3}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {Array.from({ length: Math.ceil(city.length / 4) }).map((_, idx) => (
            <button
              key={idx}
              className="w-3 h-3 rounded-full bg-gray-300 hover:bg-blue-500 transition-all duration-300 hover:scale-125"
              onClick={() => instanceRef.current?.moveToIdx(idx * 4)}
              aria-label={`Aller à la page ${idx + 1}`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Voir toutes les destinations
          </button>
        </motion.div>
      </div>
    </section>
  );
}
