// @/app/public/foundeHotels/[id]/page.tsx
"use client";

import InfoHotel from "@/components/hotel/InfoHotel";
import NavSectionHotel from "@/components/hotel/NavSectionHotel";
import HeroForm from "@/components/landing/HeroForm";
import Description from "@/components/hotel/Description";
import Room from "@/components/hotel/Room";
import Evaluation from "@/components/hotel/Evaluation";
import Amenities from "@/components/hotel/RoomAmenities";
import Policy from "@/components/hotel/Policy";
import Faq from "@/components/hotel/Faq";
import React, { useEffect } from "react";
import RelatedHotels from "@/components/hotel/RelatedHotels";
import HotelReview from "@/components/hotel/HotelReview";
import HotelLocation from "@/components/hotel/HotelLocation";
import HotelActivities from "@/components/hotel/HotelActivities";
import HotelAccesibility from "@/components/hotel/HotelAccesibility";
import HotelParking from "@/components/hotel/HotelParking";
import { useHotelSelectedStore } from "@/store/useHotelSelectedStore";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const {
    selectedHotel,
    isLoading,
    error,
    clearSelectedHotel,
    getAverageRating,
    getMainImage,
    getRoomCount,
    getAmenities,
    getLabels,
    getAddress,
    getRecentReviews,
  } = useHotelSelectedStore();

  useEffect(() => {
    console.log("🐛 DEBUG - Hotel ID:", id);
    console.log("🐛 DEBUG - Selected Hotel:", selectedHotel);
    console.log("🐛 DEBUG - Is Loading:", isLoading);
    console.log("🐛 DEBUG - Error:", error);
  }, [id, selectedHotel, isLoading, error]);

  // Calcul des données dérivées
  const averageRating = getAverageRating();
  const mainImage = getMainImage();
  const roomCount = getRoomCount();
  const amenities = getAmenities();
  const labels = getLabels();
  const address = getAddress();
  const recentReviews = getRecentReviews(3);

  return (
    <div>
      {/* 🐛 Section de débogage pour le store useHotelSelectedStore */}
      <div className="m-3 mt-20 bg-yellow-100 border-2 border-yellow-400 p-4 rounded-xl">
        <h2 className="text-lg font-bold text-yellow-800 mb-3">
          🐛 DEBUG - useHotelSelectedStore
        </h2>

        <div className="space-y-4">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Hotel ID (URL):</strong>
              <div className="bg-white p-2 rounded border font-mono text-xs">
                {id}
              </div>
            </div>

            <div>
              <strong>Loading State:</strong>
              <div className="bg-white p-2 rounded border">
                {isLoading ? "🔄 Loading..." : "✅ Loaded"}
              </div>
            </div>

            <div>
              <strong>Hotel Loaded:</strong>
              <div className="bg-white p-2 rounded border">
                {selectedHotel ? "✅ Yes" : "❌ No"}
              </div>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div>
              <strong>Error:</strong>
              <div className="bg-red-50 border border-red-200 p-2 rounded text-red-700 text-xs">
                {error}
              </div>
            </div>
          )}

          {/* Informations dérivées du store */}
          {selectedHotel && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <h3 className="font-bold text-blue-800 mb-2">
                📊 Données calculées par le store
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Note moyenne:</strong>
                  <div className="bg-white p-1 rounded border text-xs">
                    {averageRating ? `${averageRating}/10` : "N/A"}
                  </div>
                </div>

                <div>
                  <strong>Nombre de chambres:</strong>
                  <div className="bg-white p-1 rounded border text-xs">
                    {roomCount}
                  </div>
                </div>

                <div>
                  <strong>Image principale:</strong>
                  <div className="bg-white p-1 rounded border text-xs truncate">
                    {mainImage ? "✅ Disponible" : "❌ Aucune"}
                  </div>
                </div>

                <div>
                  <strong>Adresse complète:</strong>
                  <div className="bg-white p-1 rounded border text-xs truncate">
                    {address || "N/A"}
                  </div>
                </div>
              </div>

              {/* Équipements */}
              <div className="mt-3">
                <strong>Équipements ({amenities.length}):</strong>
                <div className="bg-white p-2 rounded border max-h-20 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {amenities.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                      >
                        {amenity.icon} {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="mt-3">
                <strong>Labels ({labels.length}):</strong>
                <div className="bg-white p-2 rounded border max-h-20 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {labels.map((label) => (
                      <span
                        key={label.id}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: label.color || undefined }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avis récents */}
              <div className="mt-3">
                <strong>Avis récents ({recentReviews.length}):</strong>
                <div className="bg-white p-2 rounded border max-h-32 overflow-y-auto">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-1 mb-1 last:border-b-0"
                    >
                      <div className="text-xs">
                        <strong>{review.user.name}</strong> - {review.rating}/10
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {review.comment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Données brutes */}
          <div>
            <strong>Données brutes de l'hôtel:</strong>
            <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
              {selectedHotel ? (
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      id: selectedHotel.id,
                      name: selectedHotel.name,
                      starRating: selectedHotel.starRating,
                      overallRating: selectedHotel.overallRating,
                      reviewCount: selectedHotel.reviewCount,
                      basePricePerNight: selectedHotel.basePricePerNight,
                      currency: selectedHotel.currency,
                      imagesCount: selectedHotel.images?.length || 0,
                      roomsCount: selectedHotel.HotelRoom?.length || 0,
                      amenitiesCount:
                        selectedHotel.HotelCardToHotelAmenity?.length || 0,
                      reviewsCount: selectedHotel.HotelReview?.length || 0,
                      hasDetails: !!selectedHotel.HotelDetails?.[0],
                      hasParking: !!selectedHotel.parking,
                    },
                    null,
                    2
                  )}
                </pre>
              ) : (
                <div className="text-gray-500 italic">
                  Aucun hôtel sélectionné
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={clearSelectedHotel}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Clear Store
            </button>

            <button
              onClick={() => {
                console.log("🐛 Current Store State:", {
                  selectedHotel,
                  isLoading,
                  error,
                  hotelId: id,
                  derivedData: {
                    averageRating,
                    mainImage,
                    roomCount,
                    amenitiesCount: amenities.length,
                    labelsCount: labels.length,
                    address,
                    recentReviewsCount: recentReviews.length,
                  },
                });
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Log to Console
            </button>

            <button
              onClick={() => {
                console.log("🐛 Store Getters Results:", {
                  getAverageRating: getAverageRating(),
                  getMainImage: getMainImage(),
                  getRoomCount: getRoomCount(),
                  getAmenities: getAmenities(),
                  getLabels: getLabels(),
                  getAddress: getAddress(),
                  getRecentReviews: getRecentReviews(5),
                });
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              Test Getters
            </button>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <div className="p-3">
        <HeroForm />
      </div>
      <br />
      <br />
      <div className="m-3 bg-amber-300 p-3 rounded-xl">
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
        Avis Voyageurs
        <HotelReview />
      </div>
      <div id="amenities" className="m-3 bg-green-200 p-3 rounded-xl">
        <Amenities />
      </div>
      <div id="location" className="m-3 bg-indigo-200 p-3 rounded-xl">
        Emplacement
        <HotelLocation />
      </div>
      <div id="activities" className="m-3 bg-rose-200 p-3 rounded-xl">
        Activités
        <HotelActivities />
      </div>
      <div id="accessibility" className="m-3 bg-lime-200 p-3 rounded-xl">
        Accessibilité
        <HotelAccesibility />
      </div>
      <div id="parking" className="m-3 bg-orange-300 p-3 rounded-xl">
        Parking
        <HotelParking />
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
