// HotelCardPreview.tsx
// Composant de prévisualisation d'une carte hôtel, utilisant HotelCard.tsx et le store useHotelStore
// Charge dynamiquement l'image base64 depuis public/HotelCardImageTXT.txt
// ✅ Affiche le nom de la ville depuis le store useHotelStore
// ✅ Debug complet avec toutes les sections restaurées

"use client";

import React, { useEffect, useState } from "react";
import HotelCard from "@/components/HotelCard/HotelCard";
import { useHotelStore } from "@/store/useHotelStore";
import { useSelectedCity } from "@/store/useCitySelectedStore";

export default function HotelCardPreview() {
  const storeData = useHotelStore();
  const {
    hotelCardData,
    addressData,
    hotelDetailsData,
    hotelFeaturesData,
    roomTypes,
    roomFeaturesData,
    galleryImages,
    isEditing,
    currentStep,
    selectedCity, // ✅ Récupération de la ville depuis le store principal
    setSelectedCity,
  } = storeData;

  const cityStore = useSelectedCity(); // Store externe pour synchronisation
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // ✅ CORRECTION : useEffect avec contrôle de boucle infinie
  useEffect(() => {
    // Vérification par ID plutôt que par référence d'objet
    const externalCityId = cityStore.selectedCityId;
    const currentCityId = selectedCity?.id;

    // Ne met à jour que si les IDs sont différents ET que la ville externe existe
    if (
      externalCityId &&
      externalCityId !== currentCityId &&
      cityStore.selectedCity?.name
    ) {
      console.log("🔄 Synchronisation ville:", {
        from: currentCityId,
        to: externalCityId,
        cityName: cityStore.selectedCity.name,
      });

      setSelectedCity({
        id: externalCityId,
        name: cityStore.selectedCity.name,
        countryId: cityStore.selectedCity.countryId,
        order: cityStore.selectedCity.order,
      });
    }
  }, [
    cityStore.selectedCityId, // ✅ Surveille seulement l'ID
    cityStore.selectedCity?.name, // ✅ Et le nom pour s'assurer qu'il existe
    selectedCity?.id, // ✅ Compare avec l'ID actuel
    setSelectedCity,
  ]);

  useEffect(() => {
    // Charger le contenu base64 depuis le fichier txt
    fetch("/HotelCardImageTXT.txt")
      .then((res) => res.text())
      .then((text) => {
        if (text.startsWith("data:image/")) {
          setBase64Image(text.trim());
        } else {
          setBase64Image(`data:image/png;base64,${text.trim()}`);
        }
      })
      .catch(() => {
        setBase64Image(null);
      });
  }, []);

  // Fake data cohérentes avec le schéma Prisma FastBooking
  const fakeData = {
    // HotelCardData fake values
    name: "Hôtel Le Grand Séjour",
    idCity: "paris-ile-de-france",
    order: 20,
    shortDescription:
      "Un hôtel élégant au cœur de Paris, offrant confort moderne et service impeccable pour un séjour mémorable.",
    starRating: 4,
    overallRating: 4.3,
    ratingAdjective: "Très bien",
    reviewCount: 247,
    basePricePerNight: 125.0,
    regularPrice: 165.0,
    currency: "EUR",
    isPartner: true,
    imageMessage: "Photos récentes",
    hotelGroupId: "groupe-premium-hotels",
    hotelParkingId: "parking-prive-securise",

    // AddressData fake values
    addressName: "Adresse principale",
    streetNumber: "45",
    streetType: "rue",
    streetName: "de Rivoli",
    addressLine2: "Proche Louvre",
    postalCode: "75001",
    cityId: "paris-ile-de-france",
    neighborhoodId: "1er-arrondissement",
    latitude: 48.8606,
    longitude: 2.3376,

    // Données complémentaires
    country: "France",
    cityName: "Paris", // ✅ Nom par défaut de la ville
    promoMessage: "Réservez maintenant et économisez 24%",
    cancellationPolicy: "Annulation gratuite jusqu'à 48h avant l'arrivée",
  };

  // Image principale avec priorité : base64 > galleryImages > image par défaut
  const mainImage =
    base64Image ||
    galleryImages.find(
      (img) => img.imageCategories === "hotelCard" && img.order === 1
    )?.imagePath ||
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AApABJQmQh4kAAAAASUVORK5CYII=";

  // ✅ SOLUTION : Récupération du nom de la ville depuis le store principal
  const getCityName = (): string => {
    // Priority : selectedCity.name > fakeData.cityName
    if (selectedCity && selectedCity.name) {
      return selectedCity.name;
    }
    return fakeData.cityName;
  };

  // Props finales avec fallback sur fake data
  const hotelProps = {
    // Données de base HotelCard
    name: hotelCardData.name || fakeData.name,
    starRating: hotelCardData.starRating ?? fakeData.starRating,
    overallRating: hotelCardData.overallRating ?? fakeData.overallRating,
    ratingAdjective: hotelCardData.ratingAdjective || fakeData.ratingAdjective,
    reviewCount: hotelCardData.reviewCount ?? fakeData.reviewCount,
    basePricePerNight:
      hotelCardData.basePricePerNight ?? fakeData.basePricePerNight,
    regularPrice: hotelCardData.regularPrice ?? fakeData.regularPrice,
    currency: hotelCardData.currency || fakeData.currency,
    shortDescription:
      hotelCardData.shortDescription || fakeData.shortDescription,
    isPartner: hotelCardData.isPartner ?? fakeData.isPartner,
    imageMessage: hotelCardData.imageMessage || fakeData.imageMessage,

    // ✅ CORRECTION : Affichage du nom de la ville depuis le store
    city: getCityName(),
    country: fakeData.country,

    // Messages et politiques
    promoMessage: fakeData.promoMessage,
    cancellationPolicy: fakeData.cancellationPolicy,

    // Image
    mainImage,

    // IDs de référence (optionnels pour l'affichage)
    hotelGroupId: hotelCardData.hotelGroupId || fakeData.hotelGroupId,
    hotelParkingId: hotelCardData.hotelParkingId || fakeData.hotelParkingId,
  };

  return (
    <div className="space-y-6">
      {/* Boutons de contrôle */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          {showDebug ? "Masquer Debug" : "Debug Store"}
        </button>
      </div>

      {/* 🔍 SECTION DEBUG COMPLÈTE DU STORE - ✅ TOUTES SECTIONS RESTAURÉES */}
      {showDebug && (
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            🔍 Debug Complet - Store HotelStore
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {/* SECTION 1: État global du store */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-indigo-600 border-b pb-1">
                📊 État Global
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <strong>isEditing:</strong>
                  <span
                    className={
                      isEditing
                        ? "text-green-600 font-semibold"
                        : "text-red-500"
                    }
                  >
                    {isEditing.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>currentStep:</strong>
                  <span className="text-blue-600 font-semibold">
                    {currentStep}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 2: Ville sélectionnée dans le store principal */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-cyan-600 border-b pb-1">
                🏙️ SelectedCity (Store Principal)
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>selectedCity.id:</strong>{" "}
                  <span
                    className={
                      selectedCity?.id ? "text-green-600" : "text-red-500"
                    }
                  >
                    {selectedCity?.id || "null"}
                  </span>
                </div>
                <div>
                  <strong>selectedCity.name:</strong>{" "}
                  <span
                    className={
                      selectedCity?.name ? "text-green-600" : "text-red-500"
                    }
                  >
                    {selectedCity?.name || "null"}
                  </span>
                </div>
                <div>
                  <strong>selectedCity.countryId:</strong>{" "}
                  <span className="text-gray-600">
                    {selectedCity?.countryId || "null"}
                  </span>
                </div>
                <div>
                  <strong>🎯 Nom ville affiché:</strong>{" "}
                  <span className="text-blue-600 font-semibold">
                    {getCityName()}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 3: CityStore externe (pour comparaison) */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-orange-600 border-b pb-1">
                🌍 CityStore Externe (Debug)
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>selectedCityId:</strong>{" "}
                  <span className="text-gray-600">
                    {cityStore.selectedCityId || "null"}
                  </span>
                </div>
                <div>
                  <strong>selectedCity.name:</strong>{" "}
                  <span className="text-gray-600">
                    {cityStore.selectedCity?.name || "null"}
                  </span>
                </div>
                <div>
                  <strong>🔄 Comparaison IDs:</strong>{" "}
                  <span
                    className={
                      cityStore.selectedCityId === selectedCity?.id
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {cityStore.selectedCityId === selectedCity?.id
                      ? "✅ Sync"
                      : "🔄 Diff"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 4: HotelCardData - COMPLÈTE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-blue-600 border-b pb-1">
                🏨 HotelCardData
              </h3>
              <div className="space-y-1 text-xs overflow-y-auto max-h-64">
                <div>
                  <strong>id:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.id || "null"}
                  </span>
                </div>
                <div>
                  <strong>name:</strong>{" "}
                  <span
                    className={
                      hotelCardData.name ? "text-green-600" : "text-red-500"
                    }
                  >
                    {hotelCardData.name || "null"}
                  </span>
                </div>
                <div>
                  <strong>idCity:</strong>{" "}
                  <span
                    className={
                      hotelCardData.idCity ? "text-green-600" : "text-red-500"
                    }
                  >
                    {hotelCardData.idCity || "null"}
                  </span>
                </div>
                <div>
                  <strong>order:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.order ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>shortDescription:</strong>{" "}
                  <span
                    className={
                      hotelCardData.shortDescription
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.shortDescription || "null"}
                  </span>
                </div>
                <div>
                  <strong>starRating:</strong>{" "}
                  <span
                    className={
                      hotelCardData.starRating
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.starRating ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>overallRating:</strong>{" "}
                  <span
                    className={
                      hotelCardData.overallRating
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.overallRating ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>ratingAdjective:</strong>{" "}
                  <span
                    className={
                      hotelCardData.ratingAdjective
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.ratingAdjective || "null"}
                  </span>
                </div>
                <div>
                  <strong>reviewCount:</strong>{" "}
                  <span
                    className={
                      hotelCardData.reviewCount
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.reviewCount ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>basePricePerNight:</strong>{" "}
                  <span
                    className={
                      hotelCardData.basePricePerNight
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.basePricePerNight ?? "null"}€
                  </span>
                </div>
                <div>
                  <strong>regularPrice:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.regularPrice ?? "null"}€
                  </span>
                </div>
                <div>
                  <strong>currency:</strong>{" "}
                  <span
                    className={
                      hotelCardData.currency ? "text-green-600" : "text-red-500"
                    }
                  >
                    {hotelCardData.currency || "null"}
                  </span>
                </div>
                <div>
                  <strong>isPartner:</strong>{" "}
                  <span
                    className={
                      hotelCardData.isPartner !== undefined
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {hotelCardData.isPartner?.toString() || "null"}
                  </span>
                </div>
                <div>
                  <strong>imageMessage:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.imageMessage || "null"}
                  </span>
                </div>
                <div>
                  <strong>hotelGroupId:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.hotelGroupId || "null"}
                  </span>
                </div>
                <div>
                  <strong>hotelParkingId:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.hotelParkingId || "null"}
                  </span>
                </div>
                <div>
                  <strong>accommodationTypeId:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.accommodationTypeId || "null"}
                  </span>
                </div>
                <div>
                  <strong>destinationId:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.destinationId || "null"}
                  </span>
                </div>
                <div>
                  <strong>hotelDetailsId:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelCardData.hotelDetailsId || "null"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 5: AddressData - COMPLÈTE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-green-600 border-b pb-1">
                📍 AddressData
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>id:</strong>{" "}
                  <span className="text-gray-600">
                    {addressData.id || "null"}
                  </span>
                </div>
                <div>
                  <strong>name:</strong>{" "}
                  <span className="text-gray-600">
                    {addressData.name || "null"}
                  </span>
                </div>
                <div>
                  <strong>streetNumber:</strong>{" "}
                  <span
                    className={
                      addressData.streetNumber
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {addressData.streetNumber || "null"}
                  </span>
                </div>
                <div>
                  <strong>streetType:</strong>{" "}
                  <span className="text-gray-600">
                    {addressData.streetType || "null"}
                  </span>
                </div>
                <div>
                  <strong>streetName:</strong>{" "}
                  <span
                    className={
                      addressData.streetName ? "text-green-600" : "text-red-500"
                    }
                  >
                    {addressData.streetName || "null"}
                  </span>
                </div>
                <div>
                  <strong>addressLine2:</strong>{" "}
                  <span className="text-gray-600">
                    {addressData.addressLine2 || "null"}
                  </span>
                </div>
                <div>
                  <strong>postalCode:</strong>{" "}
                  <span
                    className={
                      addressData.postalCode ? "text-green-600" : "text-red-500"
                    }
                  >
                    {addressData.postalCode || "null"}
                  </span>
                </div>
                <div>
                  <strong>cityId:</strong>{" "}
                  <span
                    className={
                      addressData.cityId ? "text-green-600" : "text-red-500"
                    }
                  >
                    {addressData.cityId || "null"}
                  </span>
                </div>
                <div>
                  <strong>neighborhoodId:</strong>{" "}
                  <span className="text-gray-600">
                    {addressData.neighborhoodId || "null"}
                  </span>
                </div>
                <div>
                  <strong>latitude:</strong>{" "}
                  <span
                    className={
                      addressData.latitude ? "text-green-600" : "text-red-500"
                    }
                  >
                    {addressData.latitude ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>longitude:</strong>{" "}
                  <span
                    className={
                      addressData.longitude ? "text-green-600" : "text-red-500"
                    }
                  >
                    {addressData.longitude ?? "null"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 6: HotelDetailsData - RESTAURÉE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-purple-600 border-b pb-1">
                🏢 HotelDetailsData
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>id:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.id || "null"}
                  </span>
                </div>
                <div>
                  <strong>description:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.description || "null"}
                  </span>
                </div>
                <div>
                  <strong>addressId:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.addressId || "null"}
                  </span>
                </div>
                <div>
                  <strong>checkInTime:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.checkInTime || "null"}
                  </span>
                </div>
                <div>
                  <strong>checkOutTime:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.checkOutTime || "null"}
                  </span>
                </div>
                <div>
                  <strong>numberOfRooms:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.numberOfRooms ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>numberOfFloors:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.numberOfFloors ?? "null"}
                  </span>
                </div>
                <div>
                  <strong>languages:</strong>{" "}
                  <span className="text-gray-600">
                    [{hotelDetailsData.languages?.join(", ") || "empty"}]
                  </span>
                </div>
                <div>
                  <strong>order:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelDetailsData.order ?? "null"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 7: HotelFeaturesData - RESTAURÉE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-orange-600 border-b pb-1">
                ⭐ HotelFeaturesData
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>selectedAmenities:</strong>{" "}
                  <span className="text-blue-600">
                    [{hotelFeaturesData.selectedAmenities?.length || 0}]
                  </span>
                </div>
                <div>
                  <strong>selectedLabels:</strong>{" "}
                  <span className="text-blue-600">
                    [{hotelFeaturesData.selectedLabels?.length || 0}]
                  </span>
                </div>
                <div>
                  <strong>selectedAccessibilityOptions:</strong>{" "}
                  <span className="text-blue-600">
                    [
                    {hotelFeaturesData.selectedAccessibilityOptions?.length ||
                      0}
                    ]
                  </span>
                </div>
                <div>
                  <strong>selectedHighlights:</strong>{" "}
                  <span className="text-blue-600">
                    [{hotelFeaturesData.selectedHighlights?.length || 0}]
                  </span>
                </div>
                <div>
                  <strong>amenities:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelFeaturesData.amenities ? "Loaded" : "null"}
                  </span>
                </div>
                <div>
                  <strong>highlights:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelFeaturesData.highlights ? "Loaded" : "null"}
                  </span>
                </div>
                <div>
                  <strong>accessibilityOptions:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelFeaturesData.accessibilityOptions ? "Loaded" : "null"}
                  </span>
                </div>
                <div>
                  <strong>labels:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelFeaturesData.labels ? "Loaded" : "null"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 8: RoomTypes - RESTAURÉE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-teal-600 border-b pb-1">
                🛏️ RoomTypes
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Count:</strong>{" "}
                  <span className="text-blue-600 font-semibold">
                    {roomTypes.length}
                  </span>
                </div>
                {roomTypes.length > 0 ? (
                  roomTypes.map((room, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-teal-200 pl-2 space-y-1"
                    >
                      <div>
                        <strong>#{index + 1} name:</strong> {room.name}
                      </div>
                      <div>
                        <strong>maxGuests:</strong> {room.maxGuests}
                      </div>
                      <div>
                        <strong>pricePerNight:</strong> {room.pricePerNight}
                        {room.currency}
                      </div>
                      <div>
                        <strong>isAvailable:</strong>{" "}
                        {room.isAvailable?.toString()}
                      </div>
                      <div>
                        <strong>hotelCardId:</strong>{" "}
                        {room.hotelCardId || "null"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-red-500 italic">Aucune chambre</div>
                )}
              </div>
            </div>

            {/* ✅ SECTION 9: RoomFeaturesData - RESTAURÉE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-indigo-600 border-b pb-1">
                🛋️ RoomFeaturesData
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>selectedAmenities:</strong>{" "}
                  <span className="text-blue-600">
                    [{roomFeaturesData.selectedAmenities?.length || 0}]
                  </span>
                </div>
                {roomFeaturesData.selectedAmenities?.length > 0 && (
                  <div className="border-l-2 border-indigo-200 pl-2">
                    <strong>IDs:</strong>{" "}
                    {roomFeaturesData.selectedAmenities.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* ✅ SECTION 10: GalleryImages - RESTAURÉE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-pink-600 border-b pb-1">
                🖼️ GalleryImages
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>Count:</strong>{" "}
                  <span className="text-blue-600 font-semibold">
                    {galleryImages.length}
                  </span>
                </div>
                {galleryImages.length > 0 ? (
                  galleryImages.map((img, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-pink-200 pl-2"
                    >
                      <div>
                        <strong>#{index + 1} category:</strong>{" "}
                        {img.imageCategories}
                      </div>
                      <div>
                        <strong>order:</strong> {img.order}
                      </div>
                      <div>
                        <strong>alt:</strong> {img.alt || "null"}
                      </div>
                      <div>
                        <strong>imagePath:</strong>{" "}
                        {img.imagePath ? "✅ Present" : "❌ Missing"}
                      </div>
                      <div>
                        <strong>hotelCardId:</strong>{" "}
                        {img.hotelCardId || "null"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-red-500 italic">Aucune image</div>
                )}
              </div>
            </div>

            {/* ✅ SECTION 11: Images locales - RESTAURÉE */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-violet-600 border-b pb-1">
                🎨 Images Locales
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>base64Image:</strong>{" "}
                  <span
                    className={base64Image ? "text-green-600" : "text-red-500"}
                  >
                    {base64Image ? "✅ Loaded" : "❌ Not loaded"}
                  </span>
                </div>
                <div>
                  <strong>mainImage:</strong>{" "}
                  <span className="text-blue-600">
                    {mainImage ? "✅ Available" : "❌ Missing"}
                  </span>
                </div>
                <div>
                  <strong>Source:</strong>
                  <span className="text-gray-600">
                    {base64Image
                      ? " Base64 file"
                      : galleryImages.some(
                          (img) => img.imageCategories === "hotelCard"
                        )
                      ? " Gallery"
                      : " Fallback pixel"}
                  </span>
                </div>
                <div>
                  <strong>File size:</strong>{" "}
                  <span className="text-gray-500">
                    {base64Image
                      ? `${Math.round(base64Image.length / 1024)}KB`
                      : "0KB"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ SECTION 12: Props Finales HotelCard */}
            <div className="bg-white p-4 rounded-lg border shadow-sm col-span-1 xl:col-span-2 2xl:col-span-1">
              <h3 className="font-bold text-lg mb-3 text-red-600 border-b pb-1">
                🎯 Props Finales HotelCard
              </h3>
              <div className="space-y-1 text-xs">
                <div>
                  <strong>name:</strong>{" "}
                  <span className="text-blue-600">{hotelProps.name}</span>
                </div>
                <div>
                  <strong>⭐ starRating:</strong>{" "}
                  <span className="text-yellow-600">
                    {hotelProps.starRating}/5
                  </span>
                </div>
                <div>
                  <strong>📊 overallRating:</strong>{" "}
                  <span className="text-green-600">
                    {hotelProps.overallRating}/5
                  </span>
                </div>
                <div>
                  <strong>🏙️ city:</strong>{" "}
                  <span className="text-blue-600 font-semibold">
                    {hotelProps.city}
                  </span>
                </div>
                <div>
                  <strong>💰 price:</strong>{" "}
                  <span className="text-green-600">
                    {hotelProps.basePricePerNight} {hotelProps.currency}
                  </span>
                </div>
                <div>
                  <strong>💬 reviews:</strong>{" "}
                  <span className="text-gray-600">
                    {hotelProps.reviewCount}
                  </span>
                </div>
                <div>
                  <strong>🤝 isPartner:</strong>{" "}
                  <span
                    className={
                      hotelProps.isPartner ? "text-green-600" : "text-gray-600"
                    }
                  >
                    {hotelProps.isPartner?.toString()}
                  </span>
                </div>
                <div>
                  <strong>🎯 Source données:</strong>{" "}
                  <span className="text-purple-600">
                    {hotelCardData.name ? "Store" : "Fake"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composant HotelCard avec les données finales */}
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          📋 Aperçu HotelCard (Ville: {getCityName()})
        </h3>
        <HotelCard hotel={hotelProps} />
      </div>
    </div>
  );
}
