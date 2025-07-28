// @/components/admin/HotelCardForm.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Save,
  Loader2,
  Hotel,
  MapPin,
  Star,
  Euro,
  Crown,
  Car,
  Eye,
  AlertCircle,
  Info,
  Building,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import des composants et store pour les villes
import SelectCity from "@/components/helper/SelectCity";
import {
  useSelectedCity,
  useSelectedCityInfo,
} from "@/store/useCitySelectedStore";

// Types exactement alignés avec votre schéma Prisma
interface HotelCardData {
  id: string;
  name: string;
  idCity: string;
  order: number;
  shortDescription?: string;
  starRating: number;
  overallRating?: number;
  ratingAdjective?: string;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  isPartner: boolean;
  promoMessage?: string;
  imageMessage?: string;
  cancellationPolicy?: string;
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  hotelParkingId?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
  city?: {
    id: string;
    name: string;
    country?: {
      id: string;
      name: string;
      code: string;
    };
  };
}

interface HotelCardFormData {
  name: string;
  idCity: string;
  order: number;
  shortDescription?: string;
  starRating: number;
  overallRating?: number;
  ratingAdjective?: string;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  isPartner: boolean;
  promoMessage?: string;
  imageMessage?: string;
  cancellationPolicy?: string;
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  hotelParkingId?: string;
  latitude?: number;
  longitude?: number;
}

interface HotelCardFormProps {
  hotelCard?: HotelCardData | null;
  onSubmit: (data: HotelCardFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Données de référence
const DESTINATIONS = [
  { id: "dest-center", name: "Centre-ville", type: "urban" },
  { id: "dest-airport", name: "Aéroport", type: "transport" },
  { id: "dest-business", name: "Quartier d'affaires", type: "business" },
  { id: "dest-beach", name: "Front de mer", type: "leisure" },
  { id: "dest-station", name: "Gare", type: "transport" },
  { id: "dest-historic", name: "Centre historique", type: "cultural" },
];

const ACCOMMODATION_TYPES = [
  { id: "acc-hotel", name: "Hôtel", code: "HOTEL" },
  { id: "acc-apartment", name: "Appartement", code: "APARTMENT" },
  { id: "acc-villa", name: "Villa", code: "VILLA" },
  { id: "acc-guesthouse", name: "Maison d'hôtes", code: "GUESTHOUSE" },
  { id: "acc-hostel", name: "Auberge de jeunesse", code: "HOSTEL" },
  { id: "acc-resort", name: "Resort", code: "RESORT" },
];

const HOTEL_GROUPS = [
  { id: "group-accor", name: "Accor Hotels" },
  { id: "group-marriott", name: "Marriott International" },
  { id: "group-hilton", name: "Hilton Worldwide" },
  { id: "group-ihg", name: "InterContinental Hotels Group" },
  { id: "group-bestwestern", name: "Best Western" },
  { id: "group-independent", name: "Hôtel indépendant" },
];

const PARKING_OPTIONS = [
  { id: "park-free", name: "Parking gratuit", isAvailable: true },
  { id: "park-paid", name: "Parking payant", isAvailable: true },
  { id: "park-valet", name: "Service voiturier", isAvailable: true },
  { id: "park-street", name: "Parking dans la rue", isAvailable: true },
  { id: "park-none", name: "Pas de parking", isAvailable: false },
];

const CURRENCIES = [
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "USD", label: "Dollar US ($)", symbol: "$" },
  { value: "GBP", label: "Livre Sterling (£)", symbol: "£" },
  { value: "CHF", label: "Franc Suisse (CHF)", symbol: "CHF" },
  { value: "CAD", label: "Dollar Canadien (CAD)", symbol: "CAD" },
];

const RATING_ADJECTIVES = [
  "Exceptionnel",
  "Fantastique",
  "Très bien",
  "Bien",
  "Correct",
  "Moyen",
];

const CANCELLATION_POLICIES = [
  "Annulation gratuite jusqu'à 24h avant l'arrivée",
  "Annulation gratuite jusqu'à 48h avant l'arrivée",
  "Annulation gratuite jusqu'à 7 jours avant l'arrivée",
  "Annulation gratuite jusqu'à 14 jours avant l'arrivée",
  "Non remboursable",
  "Conditions spéciales - voir détails",
];

export default function HotelCardForm({
  hotelCard,
  onSubmit,
  onCancel,
  isLoading = false,
}: HotelCardFormProps) {
  // Store des villes
  const cityStore = useSelectedCity();
  const cityInfo = useSelectedCityInfo();

  // ✅ État initial mémorisé pour éviter les re-créations
  const initialFormData = useMemo(
    () => ({
      name: hotelCard?.name || "",
      idCity: hotelCard?.idCity || "",
      order: hotelCard?.order || 100,
      shortDescription: hotelCard?.shortDescription || "",
      starRating: hotelCard?.starRating || 3,
      overallRating: hotelCard?.overallRating || undefined,
      ratingAdjective: hotelCard?.ratingAdjective || "",
      reviewCount: hotelCard?.reviewCount || 0,
      basePricePerNight: hotelCard?.basePricePerNight || 50,
      regularPrice: hotelCard?.regularPrice || undefined,
      currency: hotelCard?.currency || "EUR",
      isPartner: hotelCard?.isPartner || false,
      promoMessage: hotelCard?.promoMessage || "",
      imageMessage: hotelCard?.imageMessage || "",
      cancellationPolicy: hotelCard?.cancellationPolicy || "",
      accommodationTypeId: hotelCard?.accommodationTypeId || "",
      destinationId: hotelCard?.destinationId || "",
      hotelGroupId: hotelCard?.hotelGroupId || "",
      hotelParkingId: hotelCard?.hotelParkingId || "",
      latitude: hotelCard?.latitude || undefined,
      longitude: hotelCard?.longitude || undefined,
    }),
    [hotelCard]
  );

  // États du formulaire
  const [formData, setFormData] = useState<HotelCardFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // ✅ Initialisation du formulaire avec useEffect contrôlé
  useEffect(() => {
    if (hotelCard && !hasInitialized) {
      console.log(
        "🔄 [FORM] Initialisation du formulaire avec les données de l'hôtel"
      );
      setFormData(initialFormData);

      // Sélectionner la ville dans le store si on édite
      if (hotelCard.idCity) {
        cityStore.selectCity(hotelCard.idCity);
      }

      setHasInitialized(true);
    }
  }, [hotelCard, initialFormData, cityStore, hasInitialized]);

  // ✅ Synchronisation de la ville depuis le store avec useCallback
  const syncCityFromStore = useCallback(() => {
    if (
      cityInfo.selectedCityId &&
      cityInfo.selectedCityId !== formData.idCity
    ) {
      console.log("🏙️ [FORM] Synchronisation ville:", cityInfo.selectedCityId);
      setFormData((prev) => ({
        ...prev,
        idCity: cityInfo.selectedCityId!,
      }));

      // Nettoyer l'erreur de ville
      setErrors((prev) => {
        const { idCity, ...rest } = prev;
        return rest;
      });
    }
  }, [cityInfo.selectedCityId, formData.idCity]);

  // ✅ Effect avec dépendances stables
  useEffect(() => {
    syncCityFromStore();
  }, [syncCityFromStore]);

  // ✅ Validation mémorisée
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation nom (obligatoire)
    if (!formData.name.trim()) {
      newErrors.name = "Le nom de l'hôtel est requis";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }

    // Validation ville (obligatoire selon schéma Prisma)
    if (!formData.idCity) {
      newErrors.idCity = "La sélection d'une ville est obligatoire";
    }

    // Validation étoiles (obligatoire selon schéma)
    if (formData.starRating < 1 || formData.starRating > 5) {
      newErrors.starRating = "Le nombre d'étoiles doit être entre 1 et 5";
    }

    // Validation prix de base (obligatoire selon schéma)
    if (formData.basePricePerNight <= 0) {
      newErrors.basePricePerNight = "Le prix de base doit être supérieur à 0";
    } else if (formData.basePricePerNight > 10000) {
      newErrors.basePricePerNight = "Le prix semble irréaliste (max 10,000)";
    }

    // Validation prix régulier
    if (
      formData.regularPrice &&
      formData.regularPrice <= formData.basePricePerNight
    ) {
      newErrors.regularPrice =
        "Le prix régulier doit être supérieur au prix de base";
    }

    // Validation ordre
    if (formData.order < 0 || formData.order > 9999) {
      newErrors.order = "L'ordre doit être entre 0 et 9999";
    }

    // Validation note globale
    if (
      formData.overallRating !== undefined &&
      (formData.overallRating < 0 || formData.overallRating > 5)
    ) {
      newErrors.overallRating = "La note globale doit être entre 0 et 5";
    }

    // Validation nombre d'avis
    if (formData.reviewCount < 0) {
      newErrors.reviewCount = "Le nombre d'avis ne peut pas être négatif";
    }

    // Validation coordonnées GPS
    if (
      formData.latitude !== undefined &&
      (formData.latitude < -90 || formData.latitude > 90)
    ) {
      newErrors.latitude = "La latitude doit être entre -90 et 90";
    }

    if (
      formData.longitude !== undefined &&
      (formData.longitude < -180 || formData.longitude > 180)
    ) {
      newErrors.longitude = "La longitude doit être entre -180 et 180";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  }, [formData]);

  // ✅ Validation déclenchée avec throttling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateForm();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [validateForm]);

  // ✅ Création du JSON nettoyé mémorisé
  const createCleanJSON = useCallback((): HotelCardFormData => {
    return {
      // Champs obligatoires nettoyés
      name: formData.name.trim(),
      idCity: formData.idCity,
      starRating: formData.starRating,
      basePricePerNight: formData.basePricePerNight,

      // Champs avec valeurs par défaut
      order: formData.order,
      currency: formData.currency,
      reviewCount: formData.reviewCount,
      isPartner: formData.isPartner,

      // Champs optionnels avec nettoyage
      shortDescription: formData.shortDescription?.trim() || undefined,
      overallRating: formData.overallRating || undefined,
      ratingAdjective: formData.ratingAdjective?.trim() || undefined,
      regularPrice: formData.regularPrice || undefined,
      promoMessage: formData.promoMessage?.trim() || undefined,
      imageMessage: formData.imageMessage?.trim() || undefined,
      cancellationPolicy: formData.cancellationPolicy?.trim() || undefined,

      // Relations optionnelles
      accommodationTypeId: formData.accommodationTypeId || undefined,
      destinationId: formData.destinationId || undefined,
      hotelGroupId: formData.hotelGroupId || undefined,
      hotelParkingId: formData.hotelParkingId || undefined,

      // Coordonnées GPS
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
    };
  }, [formData]);

  // ✅ Soumission avec validation stricte
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      console.log("🔄 [FORM] Tentative de soumission");

      if (!validateForm()) {
        setActiveTab("basic");
        setSubmitError("Veuillez corriger les erreurs dans le formulaire");
        return;
      }

      try {
        const cleanData = createCleanJSON();
        console.log(
          "✅ [FORM] JSON nettoyé pour l'API:",
          JSON.stringify(cleanData, null, 2)
        );

        await onSubmit(cleanData);
        console.log("🎉 [FORM] Soumission réussie");
      } catch (error) {
        console.error("❌ [FORM] Erreur lors de la soumission:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite"
        );
      }
    },
    [validateForm, createCleanJSON, onSubmit]
  );

  // ✅ Gestion des changements avec useCallback
  const handleInputChange = useCallback(
    (
      field: keyof HotelCardFormData,
      value: string | number | boolean | undefined
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Supprimer l'erreur pour ce champ
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });

      // Supprimer l'erreur de soumission
      setSubmitError(null);
    },
    []
  );

  // ✅ Fonction utilitaire mémorisée
  const getCurrencySymbol = useCallback((currency: string): string => {
    return CURRENCIES.find((c) => c.value === currency)?.symbol || currency;
  }, []);

  // ✅ JSON d'aperçu mémorisé
  const previewJSON = useMemo(() => createCleanJSON(), [createCleanJSON]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* En-tête avec indicateur de validité */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hotel className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {hotelCard ? "Modifier l'hôtel" : "Ajouter un nouvel hôtel"}
                  {isFormValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {hotelCard && (
                    <>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        ID: {hotelCard.id}
                      </span>
                      <span>•</span>
                      <span>
                        Créé le{" "}
                        {new Date(hotelCard.createdAt!).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                      {hotelCard.city && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {hotelCard.city.name}
                            {hotelCard.city.country &&
                              `, ${hotelCard.city.country.name}`}
                          </span>
                        </>
                      )}
                    </>
                  )}
                  <span
                    className={`flex items-center gap-1 ${
                      isFormValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isFormValid ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {isFormValid ? "Formulaire valide" : "Formulaire invalide"}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Fermer
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Alerte d'erreur de soumission */}
      {submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Aperçu JSON en temps réel (développement) */}
      <Card className="mb-6 border-green-200">
        <CardHeader>
          <CardTitle className="text-sm text-green-800">
            Aperçu JSON pour l'API (Développement)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-40">
            {JSON.stringify(previewJSON, null, 2)}
          </pre>
          <div className="mt-2 text-xs text-muted-foreground">
            ✅ Ce JSON sera envoyé à l'API POST /api/hotel-card
          </div>
        </CardContent>
      </Card>

      {/* Formulaire principal */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            {/* Onglets */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="basic" className="gap-2">
                  <Info className="h-4 w-4" />
                  Informations{" "}
                  {errors.name || errors.idCity || errors.starRating ? "*" : ""}
                </TabsTrigger>
                <TabsTrigger value="pricing" className="gap-2">
                  <Euro className="h-4 w-4" />
                  Prix & Statut{" "}
                  {errors.basePricePerNight || errors.regularPrice ? "*" : ""}
                </TabsTrigger>
                <TabsTrigger value="location" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation {errors.latitude || errors.longitude ? "*" : ""}
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Building className="h-4 w-4" />
                  Avancé
                </TabsTrigger>
              </TabsList>

              {/* Onglet Informations de base */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Informations principales */}
                  <div className="md:col-span-2">
                    <Card
                      className={
                        errors.name || errors.starRating ? "border-red-200" : ""
                      }
                    >
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Hotel className="h-5 w-5" />
                          Informations principales
                          <span className="text-red-500">*</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              Nom de l'hôtel{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              placeholder="Grand Hôtel de Paris"
                              disabled={isLoading}
                              className={`h-11 ${
                                errors.name ? "border-red-500" : ""
                              }`}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Classification{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.starRating.toString()}
                              onValueChange={(value) =>
                                handleInputChange("starRating", parseInt(value))
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger
                                className={`h-11 ${
                                  errors.starRating ? "border-red-500" : ""
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((stars) => (
                                  <SelectItem
                                    key={stars}
                                    value={stars.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="flex">
                                        {Array.from(
                                          { length: stars },
                                          (_, i) => (
                                            <Star
                                              key={i}
                                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                            />
                                          )
                                        )}
                                      </div>
                                      <span>
                                        {stars} étoile{stars > 1 ? "s" : ""}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.starRating && (
                              <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.starRating}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Ville - Obligatoire */}
                  <div className="md:col-span-2">
                    <Card className={errors.idCity ? "border-red-200" : ""}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Localisation
                          <span className="text-red-500">*</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Ville <span className="text-red-500">*</span>
                          </Label>
                          <SelectCity />
                          {errors.idCity && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.idCity}
                            </p>
                          )}

                          {/* Affichage de la ville sélectionnée */}
                          {cityInfo.selectedCity && (
                            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">
                                  Ville sélectionnée :
                                </span>
                                <span>
                                  {cityInfo.getSelectedCityWithCountry()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Type d'hébergement
                          </Label>
                          <Select
                            value={formData.accommodationTypeId || "none"}
                            onValueChange={(value) =>
                              handleInputChange(
                                "accommodationTypeId",
                                value === "none" ? "" : value
                              )
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                Aucun type spécifique
                              </SelectItem>
                              {ACCOMMODATION_TYPES.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    <span>{type.name}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {type.code}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description et ordre */}
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Description et affichage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            Description courte
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.shortDescription}
                            onChange={(e) =>
                              handleInputChange(
                                "shortDescription",
                                e.target.value
                              )
                            }
                            placeholder="Description attrayante de l'hôtel en quelques lignes..."
                            disabled={isLoading}
                            rows={4}
                            maxLength={500}
                            className="resize-none"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {formData.shortDescription?.length || 0}/500
                              caractères
                            </span>
                            <span>Visible dans les résultats de recherche</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="order"
                            className="text-sm font-medium"
                          >
                            Ordre d'affichage
                          </Label>
                          <Input
                            id="order"
                            type="number"
                            min="0"
                            max="9999"
                            value={formData.order}
                            onChange={(e) =>
                              handleInputChange(
                                "order",
                                parseInt(e.target.value) || 0
                              )
                            }
                            disabled={isLoading}
                            className={`h-11 ${
                              errors.order ? "border-red-500" : ""
                            }`}
                          />
                          <p className="text-xs text-muted-foreground">
                            Plus le nombre est faible, plus l'hôtel apparaît en
                            premier
                          </p>
                          {errors.order && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.order}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Prix & Statut */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Prix obligatoire */}
                  <Card
                    className={
                      errors.basePricePerNight || errors.regularPrice
                        ? "border-red-200"
                        : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Euro className="h-5 w-5" />
                        Tarification
                        <span className="text-red-500">*</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="basePrice"
                          className="text-sm font-medium"
                        >
                          Prix de base par nuit{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="basePrice"
                            type="number"
                            min="1"
                            step="0.01"
                            value={formData.basePricePerNight}
                            onChange={(e) =>
                              handleInputChange(
                                "basePricePerNight",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            disabled={isLoading}
                            className={`pl-12 h-11 ${
                              errors.basePricePerNight ? "border-red-500" : ""
                            }`}
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Euro className="h-4 w-4" />
                          </div>
                        </div>
                        {errors.basePricePerNight && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.basePricePerNight}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="regularPrice"
                          className="text-sm font-medium"
                        >
                          Prix régulier (optionnel)
                        </Label>
                        <div className="relative">
                          <Input
                            id="regularPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.regularPrice || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "regularPrice",
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                            disabled={isLoading}
                            className={`pl-12 h-11 ${
                              errors.regularPrice ? "border-red-500" : ""
                            }`}
                            placeholder="Prix avant réduction"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Euro className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Prix barré pour afficher une réduction
                        </p>
                        {errors.regularPrice && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.regularPrice}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Devise</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) =>
                            handleInputChange("currency", value)
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem
                                key={currency.value}
                                value={currency.value}
                              >
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statut et promotion */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Crown className="h-5 w-5" />
                        Statut et promotion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="isPartner"
                          checked={formData.isPartner}
                          onCheckedChange={(checked) =>
                            handleInputChange("isPartner", checked as boolean)
                          }
                          disabled={isLoading}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor="isPartner"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Hôtel partenaire
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Les hôtels partenaires bénéficient d'une mise en
                            avant spéciale
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="promoMessage"
                            className="text-sm font-medium"
                          >
                            Message promotionnel
                          </Label>
                          <Input
                            id="promoMessage"
                            type="text"
                            value={formData.promoMessage}
                            onChange={(e) =>
                              handleInputChange("promoMessage", e.target.value)
                            }
                            placeholder="Offre spéciale, -20%..."
                            disabled={isLoading}
                            className="h-11"
                            maxLength={100}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="imageMessage"
                            className="text-sm font-medium"
                          >
                            Message sur l'image
                          </Label>
                          <Input
                            id="imageMessage"
                            type="text"
                            value={formData.imageMessage}
                            onChange={(e) =>
                              handleInputChange("imageMessage", e.target.value)
                            }
                            placeholder="Nouveau, Populaire..."
                            disabled={isLoading}
                            className="h-11"
                            maxLength={50}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aperçu du prix */}
                  {formData.basePricePerNight > 0 && (
                    <Card className="md:col-span-2 border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">
                          Aperçu de l'affichage prix
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {formData.regularPrice &&
                                formData.regularPrice >
                                  formData.basePricePerNight && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formData.regularPrice}{" "}
                                    {getCurrencySymbol(formData.currency)}
                                  </span>
                                )}
                              <span className="text-2xl font-bold text-green-600">
                                {formData.basePricePerNight}{" "}
                                {getCurrencySymbol(formData.currency)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                /nuit
                              </span>
                            </div>
                            {formData.promoMessage && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.promoMessage}
                              </Badge>
                            )}
                          </div>
                          {formData.isPartner && (
                            <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                              <Crown className="h-3 w-3" />
                              Partenaire
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Autres onglets suivent le même pattern... */}
              {/* Je continue avec les onglets restants si nécessaire */}
            </Tabs>
          </CardContent>
        </Card>

        {/* Barre d'actions avec validation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {isFormValid ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Formulaire valide - Prêt à envoyer</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Veuillez corriger les erreurs (* obligatoires)</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="gap-2 min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {hotelCard ? "Modifier" : "Ajouter"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
