// HotelAdress.tsx
// Composant d'adresse avec mise à jour temps réel du store HotelStore
// Compatible avec le schéma Prisma FastBooking modifié
// ✅ streetName et postalCode maintenant optionnels

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SelectCity from "@/components/helper/SelectCity";
import { useHotelStore } from "@/store/useHotelStore";
import { useSelectedCity } from "@/store/useCitySelectedStore";

export default function HotelAdress() {
  const { addressData, setAddressData, syncAddressWithCity } = useHotelStore();
  const cityStore = useSelectedCity();

  // État local formulaire avec types cohérents
  const [form, setForm] = useState({
    id: addressData?.id || "",
    name: addressData?.name || "",
    streetNumber: addressData?.streetNumber || "",
    streetType: addressData?.streetType || "",
    streetName: addressData?.streetName || "",
    addressLine2: addressData?.addressLine2 || "",
    postalCode: addressData?.postalCode || "",
    cityId: addressData?.cityId || "",
    neighborhoodId: addressData?.neighborhoodId || "",
    latitude: addressData?.latitude != null ? String(addressData.latitude) : "",
    longitude:
      addressData?.longitude != null ? String(addressData.longitude) : "",
  });

  // Synchronisation du formulaire avec le store addressData
  useEffect(() => {
    setForm({
      id: addressData?.id || "",
      name: addressData?.name || "",
      streetNumber: addressData?.streetNumber || "",
      streetType: addressData?.streetType || "",
      streetName: addressData?.streetName || "",
      addressLine2: addressData?.addressLine2 || "",
      postalCode: addressData?.postalCode || "",
      cityId: addressData?.cityId || "",
      neighborhoodId: addressData?.neighborhoodId || "",
      latitude:
        addressData?.latitude != null ? String(addressData.latitude) : "",
      longitude:
        addressData?.longitude != null ? String(addressData.longitude) : "",
    });
  }, [addressData]);

  // Synchronisation avec la ville sélectionnée globalement
  useEffect(() => {
    if (cityStore.selectedCityId && cityStore.selectedCityId !== form.cityId) {
      const newCityId = cityStore.selectedCityId || "";

      // Mise à jour du formulaire local
      setForm((prev) => ({
        ...prev,
        cityId: newCityId,
        neighborhoodId: "", // Reset quartier au changement de ville
      }));

      // ✅ Mise à jour immédiate du store avec synchronisation
      syncAddressWithCity(newCityId);

      // ✅ CORRECTION : Vérification que selectedCity n'est pas null
      if (cityStore.selectedCity && cityStore.selectedCity.name) {
        toast.success(`Ville synchronisée : ${cityStore.selectedCity.name}`);
      } else {
        toast.success("Ville synchronisée");
      }
    }
  }, [
    cityStore.selectedCityId,
    form.cityId,
    syncAddressWithCity,
    cityStore.selectedCity,
  ]);

  // ✅ FONCTION DE MISE À JOUR TEMPS RÉEL - MISE À JOUR
  const updateStoreRealTime = (field: keyof typeof form, value: string) => {
    // Mise à jour du formulaire local
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // ✅ Conversion et validation des données avant mise à jour du store
    const getStoreValue = (fieldName: keyof typeof form, val: string) => {
      switch (fieldName) {
        case "id":
          return val || undefined;
        case "name":
        case "streetNumber":
        case "streetType":
        case "streetName": // ✅ CHANGÉ : Maintenant optionnel
        case "postalCode": // ✅ CHANGÉ : Maintenant optionnel
        case "addressLine2":
        case "neighborhoodId":
          return val.trim() || null; // ✅ Retourne null si vide
        case "cityId":
          return val.trim(); // ✅ Reste obligatoire
        case "latitude":
        case "longitude":
          return val ? parseFloat(val) : null;
        default:
          return val;
      }
    };

    // ✅ Mise à jour immédiate du store
    setAddressData({
      ...addressData,
      [field]: getStoreValue(field, value),
    });
  };

  // ✅ Validation en temps réel mise à jour - CHAMPS OPTIONNELS
  const getFieldError = (field: keyof typeof form): string | null => {
    const value = form[field];

    switch (field) {
      case "streetName":
        // ✅ SUPPRIMÉ : Plus d'obligation pour streetName
        return null;
      case "postalCode":
        // ✅ MODIFIÉ : Validation seulement si rempli
        if (value.trim() && !/^\d{5}$/.test(value.trim())) {
          return "Le code postal doit contenir 5 chiffres";
        }
        return null;
      case "cityId":
        return !value ? "Veuillez sélectionner une ville" : null;
      case "latitude":
      case "longitude":
        if (value && isNaN(parseFloat(value))) return "Coordonnée invalide";
        return null;
      default:
        return null;
    }
  };

  // ✅ Helper pour obtenir le nom de la ville de manière sûre
  const getCityDisplayName = (): string => {
    if (cityStore.selectedCity && cityStore.selectedCity.name) {
      return cityStore.selectedCity.name;
    }
    return "Aucune ville sélectionnée";
  };

  // ✅ Helper pour vérifier si une ville est sélectionnée
  const isCitySelected = (): boolean => {
    return !!(cityStore.selectedCity && cityStore.selectedCity.name);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Adresse de l'hébergement
        </h2>
        <p className="text-gray-600 mt-2">
          Renseignez l'adresse de votre établissement. Seule la ville est
          obligatoire. Les modifications sont sauvegardées automatiquement.
        </p>
      </div>

      {/* Indication de ville sélectionnée - ✅ CORRECTION */}
      {isCitySelected() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>🏙️ Ville sélectionnée :</strong> {getCityDisplayName()}
          </p>
        </div>
      )}

      {/* Message si aucune ville sélectionnée */}
      {!isCitySelected() && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800">
            <strong>⚠️ Aucune ville sélectionnée</strong> - Veuillez
            sélectionner une ville ci-dessous.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom de l'adresse (optionnel) */}
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nom de l'adresse (optionnel)
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="ex: Entrée principale, Réception..."
            value={form.name}
            onChange={(e) => updateStoreRealTime("name", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Numéro de rue */}
        <div>
          <Label
            htmlFor="streetNumber"
            className="text-sm font-medium text-gray-700"
          >
            Numéro (optionnel)
          </Label>
          <Input
            id="streetNumber"
            type="text"
            placeholder="ex: 123"
            value={form.streetNumber}
            onChange={(e) =>
              updateStoreRealTime("streetNumber", e.target.value)
            }
            className="mt-1"
          />
        </div>

        {/* Type de rue */}
        <div>
          <Label
            htmlFor="streetType"
            className="text-sm font-medium text-gray-700"
          >
            Type de voie (optionnel)
          </Label>
          <Input
            id="streetType"
            type="text"
            placeholder="ex: rue, avenue, boulevard..."
            value={form.streetType}
            onChange={(e) => updateStoreRealTime("streetType", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* ✅ Nom de rue (maintenant optionnel) */}
        <div className="md:col-span-2">
          <Label
            htmlFor="streetName"
            className="text-sm font-medium text-gray-700"
          >
            Nom de la rue (optionnel)
          </Label>
          <Input
            id="streetName"
            type="text"
            placeholder="ex: de Rivoli"
            value={form.streetName}
            onChange={(e) => updateStoreRealTime("streetName", e.target.value)}
            className={`mt-1 ${
              getFieldError("streetName") ? "border-red-500" : ""
            }`}
          />
          {getFieldError("streetName") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("streetName")}
            </p>
          )}
        </div>

        {/* Complément d'adresse */}
        <div className="md:col-span-2">
          <Label
            htmlFor="addressLine2"
            className="text-sm font-medium text-gray-700"
          >
            Complément d'adresse (optionnel)
          </Label>
          <Input
            id="addressLine2"
            type="text"
            placeholder="ex: Bâtiment A, Étage 3, Proche métro..."
            value={form.addressLine2}
            onChange={(e) =>
              updateStoreRealTime("addressLine2", e.target.value)
            }
            className="mt-1"
          />
        </div>

        {/* ✅ Code postal (maintenant optionnel) */}
        <div>
          <Label
            htmlFor="postalCode"
            className="text-sm font-medium text-gray-700"
          >
            Code postal (optionnel)
          </Label>
          <Input
            id="postalCode"
            type="text"
            placeholder="ex: 75001"
            value={form.postalCode}
            onChange={(e) => updateStoreRealTime("postalCode", e.target.value)}
            className={`mt-1 ${
              getFieldError("postalCode") ? "border-red-500" : ""
            }`}
            maxLength={5}
          />
          {getFieldError("postalCode") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("postalCode")}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Si renseigné, doit contenir 5 chiffres
          </p>
        </div>

        {/* Sélection de ville - RESTE OBLIGATOIRE */}
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Ville <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1">
            <SelectCity />
          </div>
          {getFieldError("cityId") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("cityId")}
            </p>
          )}
        </div>

        {/* Quartier (optionnel) */}
        <div>
          <Label
            htmlFor="neighborhoodId"
            className="text-sm font-medium text-gray-700"
          >
            Quartier (optionnel)
          </Label>
          <Input
            id="neighborhoodId"
            type="text"
            placeholder="ex: 1er arrondissement"
            value={form.neighborhoodId}
            onChange={(e) =>
              updateStoreRealTime("neighborhoodId", e.target.value)
            }
            className="mt-1"
          />
        </div>

        {/* Coordonnées GPS */}
        <div>
          <Label
            htmlFor="latitude"
            className="text-sm font-medium text-gray-700"
          >
            Latitude GPS (optionnel)
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="ex: 48.8606"
            value={form.latitude}
            onChange={(e) => updateStoreRealTime("latitude", e.target.value)}
            className={`mt-1 ${
              getFieldError("latitude") ? "border-red-500" : ""
            }`}
          />
          {getFieldError("latitude") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("latitude")}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="longitude"
            className="text-sm font-medium text-gray-700"
          >
            Longitude GPS (optionnel)
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="ex: 2.3376"
            value={form.longitude}
            onChange={(e) => updateStoreRealTime("longitude", e.target.value)}
            className={`mt-1 ${
              getFieldError("longitude") ? "border-red-500" : ""
            }`}
          />
          {getFieldError("longitude") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("longitude")}
            </p>
          )}
        </div>
      </div>

      {/* ✅ Message informatif sur les champs optionnels */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="w-5 h-5 text-amber-600 mr-3 mt-0.5">💡</div>
          <div className="text-amber-800 text-sm">
            <strong>Information :</strong> Seule la ville est obligatoire.
            L'adresse complète est recommandée pour une meilleure localisation
            de votre établissement, mais vous pouvez la compléter
            ultérieurement.
          </div>
        </div>
      </div>

      {/* Indicateur de sauvegarde automatique */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <p className="text-green-800 text-sm">
            <strong>✅ Sauvegarde automatique activée</strong> - Vos
            modifications sont sauvegardées en temps réel dans le store.
          </p>
        </div>
      </div>

      {/* ✅ Résumé de l'adresse mis à jour - Affichage conditionnel */}
      {(form.streetName || form.postalCode || isCitySelected()) && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            📍 Aperçu de l'adresse :
          </h3>
          <p className="text-gray-600">
            {form.streetNumber && `${form.streetNumber} `}
            {form.streetType && `${form.streetType} `}
            {form.streetName && `${form.streetName}`}
            {form.addressLine2 && `, ${form.addressLine2}`}
            {(form.streetName || form.addressLine2) && <br />}
            {form.postalCode && `${form.postalCode} `}
            {getCityDisplayName()}
            {form.neighborhoodId && `, ${form.neighborhoodId}`}
          </p>
          {form.latitude && form.longitude && (
            <p className="text-xs text-gray-500 mt-1">
              GPS: {form.latitude}, {form.longitude}
            </p>
          )}
          {!form.streetName && !form.postalCode && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Adresse incomplète - Ajouter rue et code postal recommandé
            </p>
          )}
        </div>
      )}

      {/* Section debug des valeurs du store (optionnelle) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-700 mb-2">
          🔍 Debug Store Values:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
          <div>
            <strong>cityStore.selectedCityId:</strong>{" "}
            {cityStore.selectedCityId || "null"}
          </div>
          <div>
            <strong>cityStore.selectedCity:</strong>{" "}
            {cityStore.selectedCity?.name || "null"}
          </div>
          <div>
            <strong>form.cityId:</strong> {form.cityId || "empty"}
          </div>
          <div>
            <strong>addressData.cityId:</strong> {addressData.cityId || "null"}
          </div>
          <div>
            <strong>streetName:</strong> {form.streetName || "empty"}
          </div>
          <div>
            <strong>postalCode:</strong> {form.postalCode || "empty"}
          </div>
        </div>
      </div>
    </div>
  );
}
