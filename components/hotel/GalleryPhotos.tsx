// @/components/hotel/GalleryPhotos.tsx
"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";

// Types basés sur votre schéma Prisma
type HotelImage = {
  id: string;
  imageUrl: string;
  imageType: string;
  order: number;
  alt?: string;
};

type GalleryPhotosProps = {
  images?: HotelImage[];
  hotelName: string;
  imageMessage?: string;
};

function GalleryPhotos({
  images = [],
  hotelName,
  imageMessage,
}: GalleryPhotosProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images par défaut si aucune image n'est fournie
  const defaultImages: HotelImage[] = [
    {
      id: "1",
      imageUrl: "/hotel-main.jpg",
      imageType: "main",
      order: 1,
      alt: `${hotelName} - Vue principale`,
    },
    {
      id: "2",
      imageUrl: "/hotel-room.jpg",
      imageType: "room",
      order: 2,
      alt: `${hotelName} - Chambre`,
    },
    {
      id: "3",
      imageUrl: "/hotel-lobby.jpg",
      imageType: "lobby",
      order: 3,
      alt: `${hotelName} - Hall d'accueil`,
    },
    {
      id: "4",
      imageUrl: "/hotel-restaurant.jpg",
      imageType: "restaurant",
      order: 4,
      alt: `${hotelName} - Restaurant`,
    },
    {
      id: "5",
      imageUrl: "/hotel-pool.jpg",
      imageType: "amenity",
      order: 5,
      alt: `${hotelName} - Piscine`,
    },
  ];

  const displayImages = images.length > 0 ? images : defaultImages;
  const sortedImages = displayImages.sort((a, b) => a.order - b.order);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const getImageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      main: "Vue principale",
      room: "Chambre",
      lobby: "Hall",
      restaurant: "Restaurant",
      amenity: "Équipements",
      exterior: "Extérieur",
      pool: "Piscine",
      spa: "Spa",
    };
    return labels[type] || "Photo";
  };

  return (
    <div className="space-y-4">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 relative group cursor-pointer">
          <Image
            src={sortedImages[0]?.imageUrl || "/placeholder-hotel.jpg"}
            alt={sortedImages[0]?.alt || `${hotelName} - Image principale`}
            fill
            className="object-cover rounded-lg"
            onClick={() => openLightbox(0)}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {sortedImages[0]?.imageType && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {getImageTypeLabel(sortedImages[0].imageType)}
            </div>
          )}
        </div>

        {/* Secondary Images */}
        <div className="col-span-2 grid grid-cols-2 gap-2">
          {sortedImages.slice(1, 5).map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-pointer h-full"
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image.imageUrl}
                alt={image.alt || `${hotelName} - Image ${index + 2}`}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {image.imageType && (
                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                  {getImageTypeLabel(image.imageType)}
                </div>
              )}
              {index === 3 && sortedImages.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-medium">
                    +{sortedImages.length - 5} photos
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Show All Photos Button */}
      {sortedImages.length > 5 && (
        <button
          onClick={() => openLightbox(0)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
          <span>Voir toutes les photos ({sortedImages.length})</span>
        </button>
      )}

      {/* Image Message */}
      {imageMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 italic">💡 {imageMessage}</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Current Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={
                  sortedImages[currentImageIndex]?.imageUrl ||
                  "/placeholder-hotel.jpg"
                }
                alt={
                  sortedImages[currentImageIndex]?.alt ||
                  `${hotelName} - Image ${currentImageIndex + 1}`
                }
                fill
                className="object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded">
              {currentImageIndex + 1} / {sortedImages.length}
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded max-w-xs">
              <p className="text-sm font-medium">
                {getImageTypeLabel(
                  sortedImages[currentImageIndex]?.imageType || ""
                )}
              </p>
              {sortedImages[currentImageIndex]?.alt && (
                <p className="text-xs text-gray-300 mt-1">
                  {sortedImages[currentImageIndex].alt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPhotos;
