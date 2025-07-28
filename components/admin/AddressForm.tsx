// @/components/admin/AddressForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Save,
  Loader2,
  MapPin,
  Building,
  Users,
  Landmark,
} from "lucide-react";

interface Country {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
  country: Country;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface HotelCard {
  id: string;
  name: string;
}

interface LandmarkData {
  id: string;
  name: string;
  type: string;
}

// ✅ Interface Address cohérente avec page.tsx
interface Address {
  id: string;
  name: string | null;
  streetNumber: string | null;
  streetType: string | null;
  streetName: string;
  addressLine2: string | null;
  postalCode: string;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city?: City; // ✅ Important pour l'édition
}

interface AddressFormData {
  name: string;
  streetNumber: string;
  streetType: string;
  streetName: string;
  addressLine2: string;
  postalCode: string;
  cityId: string;
}

interface AddressFormErrors {
  name?: string;
  streetName?: string;
  postalCode?: string;
  cityId?: string;
}

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  preselectedCityId?: string;
}

const STREET_TYPES = [
  { value: "", label: "Non spécifié" },
  { value: "rue", label: "Rue" },
  { value: "boulevard", label: "Boulevard" },
  { value: "avenue", label: "Avenue" },
  { value: "allée", label: "Allée" },
  { value: "place", label: "Place" },
  { value: "quai", label: "Quai" },
  { value: "route", label: "Route" },
  { value: "chemin", label: "Chemin" },
  { value: "impasse", label: "Impasse" },
  { value: "lieu-dit", label: "Lieu-dit" },
];

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isLoading = false,
  preselectedCityId,
}: AddressFormProps) {
  // ✅ Initialisation correcte des données de formulaire
  const [formData, setFormData] = useState<AddressFormData>({
    name: address?.name || "",
    streetNumber: address?.streetNumber || "",
    streetType: address?.streetType || "",
    streetName: address?.streetName || "",
    addressLine2: address?.addressLine2 || "",
    postalCode: address?.postalCode || "",
    cityId: address?.cityId || preselectedCityId || "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<HotelCard[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkData[]>([]);

  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [activeTab, setActiveTab] = useState<"address" | "relations">(
    "address"
  );

  // ✅ Effet pour mettre à jour le formulaire quand l'adresse change
  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name || "",
        streetNumber: address.streetNumber || "",
        streetType: address.streetType || "",
        streetName: address.streetName || "",
        addressLine2: address.addressLine2 || "",
        postalCode: address.postalCode || "",
        cityId: address.cityId || "",
      });
    }
  }, [address]);

  // ✅ Charger les données initiales avec vos routes corrigées
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setCountriesLoading(true);
        const [countriesRes, usersRes, hotelsRes, landmarksRes] =
          await Promise.all([
            fetch("/api/country"), // ✅ Route au singulier
            fetch("/api/user"), // ✅ Route au singulier
            fetch("/api/hotel-card"), // ✅ Route corrigée
            fetch("/api/landmark"), // ✅ Route au singulier
          ]);

        if (countriesRes.ok) {
          const countriesData = await countriesRes.json();
          setCountries(Array.isArray(countriesData) ? countriesData : []);

          // ✅ Logique améliorée pour définir le pays sélectionné
          if (address?.city?.countryId) {
            // Si on modifie une adresse existante avec city chargée
            setSelectedCountryId(address.city.countryId);
          } else if (address?.cityId && countriesData.length > 0) {
            // Si on a cityId mais pas city.countryId, on charge la ville
            try {
              const cityResponse = await fetch(`/api/city/${address.cityId}`);
              if (cityResponse.ok) {
                const cityData = await cityResponse.json();
                setSelectedCountryId(cityData.countryId);
              }
            } catch (error) {
              console.error("Erreur lors du chargement de la ville:", error);
            }
          } else if (preselectedCityId && countriesData.length > 0) {
            // Si une ville est présélectionnée
            try {
              const cityResponse = await fetch(
                `/api/city/${preselectedCityId}`
              );
              if (cityResponse.ok) {
                const cityData = await cityResponse.json();
                setSelectedCountryId(cityData.countryId);
              }
            } catch (error) {
              console.error(
                "Erreur lors du chargement de la ville présélectionnée:",
                error
              );
            }
          } else {
            // Définir la France par défaut
            const france = countriesData.find((c: Country) => c.code === "FR");
            if (france) {
              setSelectedCountryId(france.id);
            }
          }
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        }

        if (hotelsRes.ok) {
          const hotelsData = await hotelsRes.json();
          setHotels(Array.isArray(hotelsData) ? hotelsData : []);
        }

        if (landmarksRes.ok) {
          const landmarksData = await landmarksRes.json();
          setLandmarks(Array.isArray(landmarksData) ? landmarksData : []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchInitialData();
  }, [address, preselectedCityId]);

  // ✅ Charger les villes avec votre route corrigée
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountryId) {
        setCities([]);
        return;
      }

      try {
        setCitiesLoading(true);
        const response = await fetch(
          `/api/city?countryId=${selectedCountryId}`
        ); // ✅ Route au singulier
        if (response.ok) {
          const data = await response.json();
          setCities(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
        setCities([]);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, [selectedCountryId]);

  const validateForm = (): boolean => {
    const newErrors: AddressFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.streetName.trim()) {
      newErrors.streetName = "Le nom de rue est requis";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    }

    if (!formData.cityId) {
      newErrors.cityId = "La ville est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        streetName: formData.streetName.trim(),
        streetNumber: formData.streetNumber.trim() || "",
        streetType: formData.streetType || "",
        addressLine2: formData.addressLine2.trim() || "",
        postalCode: formData.postalCode.trim(),
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof AddressFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    // Ne réinitialiser la ville que si on n'édite pas une adresse existante
    if (!address || address.city?.countryId !== countryId) {
      setFormData((prev) => ({ ...prev, cityId: "" }));
    }
  };

  return (
    <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {address ? "Modifier l'adresse" : "Ajouter une adresse"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Onglets */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab("address")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "address"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Informations d'adresse
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("relations")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "relations"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building className="h-4 w-4" />
            Relations disponibles
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Onglet Adresse */}
          {activeTab === "address" && (
            <>
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations de base
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Nom de l'adresse */}
                  <div className="md:col-span-3">
                    <Label htmlFor="name">
                      Nom de l'adresse <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Nom descriptif de l'adresse"
                      disabled={isLoading}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Numéro de rue */}
                  <div>
                    <Label htmlFor="streetNumber">Numéro</Label>
                    <Input
                      id="streetNumber"
                      value={formData.streetNumber}
                      onChange={(e) =>
                        handleInputChange("streetNumber", e.target.value)
                      }
                      placeholder="123"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Type de voie */}
                  <div>
                    <Label htmlFor="streetType">Type de voie</Label>
                    <select
                      id="streetType"
                      value={formData.streetType}
                      onChange={(e) =>
                        handleInputChange("streetType", e.target.value)
                      }
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {STREET_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nom de rue */}
                  <div>
                    <Label htmlFor="streetName">
                      Nom de rue <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="streetName"
                      value={formData.streetName}
                      onChange={(e) =>
                        handleInputChange("streetName", e.target.value)
                      }
                      placeholder="des Champs-Élysées"
                      disabled={isLoading}
                      className={errors.streetName ? "border-red-500" : ""}
                    />
                    {errors.streetName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.streetName}
                      </p>
                    )}
                  </div>

                  {/* Complément d'adresse */}
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine2">Complément d'adresse</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) =>
                        handleInputChange("addressLine2", e.target.value)
                      }
                      placeholder="Appartement, étage, bâtiment..."
                      disabled={isLoading}
                    />
                  </div>

                  {/* Code postal */}
                  <div>
                    <Label htmlFor="postalCode">
                      Code postal <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      placeholder="75001"
                      disabled={isLoading}
                      className={errors.postalCode ? "border-red-500" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Localisation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pays */}
                  <div>
                    <Label htmlFor="countryId">Pays</Label>
                    <select
                      id="countryId"
                      value={selectedCountryId}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      disabled={isLoading || countriesLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sélectionner un pays</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.code} - {country.name}
                        </option>
                      ))}
                    </select>
                    {countriesLoading && (
                      <p className="text-xs text-gray-500 mt-1">
                        Chargement des pays...
                      </p>
                    )}
                  </div>

                  {/* Ville */}
                  <div>
                    <Label htmlFor="cityId">
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="cityId"
                      value={formData.cityId}
                      onChange={(e) =>
                        handleInputChange("cityId", e.target.value)
                      }
                      disabled={
                        isLoading || citiesLoading || !selectedCountryId
                      }
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.cityId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">
                        {selectedCountryId
                          ? "Sélectionner une ville"
                          : "Sélectionnez d'abord un pays"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.cityId && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.cityId}
                      </p>
                    )}
                    {citiesLoading && (
                      <p className="text-xs text-gray-500 mt-1">
                        Chargement des villes...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Onglet Relations */}
          {activeTab === "relations" && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Relations disponibles
                </h3>
                <p className="text-sm text-blue-700">
                  Cette adresse peut être associée aux entités suivantes après
                  sa création.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hôtels */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-600" />
                    <h4 className="font-semibold">Hôtels ({hotels.length})</h4>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {hotels.slice(0, 10).map((hotel) => (
                      <div
                        key={hotel.id}
                        className="text-sm p-2 bg-gray-50 rounded"
                      >
                        {hotel.name}
                      </div>
                    ))}
                    {hotels.length > 10 && (
                      <p className="text-xs text-gray-500">
                        et {hotels.length - 10} autres...
                      </p>
                    )}
                  </div>
                </div>

                {/* Utilisateurs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <h4 className="font-semibold">
                      Utilisateurs ({users.length})
                    </h4>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {users.slice(0, 10).map((user) => (
                      <div
                        key={user.id}
                        className="text-sm p-2 bg-gray-50 rounded"
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-600">{user.email}</div>
                      </div>
                    ))}
                    {users.length > 10 && (
                      <p className="text-xs text-gray-500">
                        et {users.length - 10} autres...
                      </p>
                    )}
                  </div>
                </div>

                {/* Points d'intérêt */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-gray-600" />
                    <h4 className="font-semibold">
                      Points d'intérêt ({landmarks.length})
                    </h4>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {landmarks.slice(0, 10).map((landmark) => (
                      <div
                        key={landmark.id}
                        className="text-sm p-2 bg-gray-50 rounded"
                      >
                        <div className="font-medium">{landmark.name}</div>
                        <div className="text-gray-600 capitalize">
                          {landmark.type}
                        </div>
                      </div>
                    ))}
                    {landmarks.length > 10 && (
                      <p className="text-xs text-gray-500">
                        et {landmarks.length - 10} autres...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || countriesLoading || citiesLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {address ? "Modifier" : "Ajouter"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
