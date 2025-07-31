//@/components/host/HotelCardForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface HotelCardFormProps {
  hotelCard?: {
    id: string;
    name: string;
    idCity: string;
    order: number;
    shortDescription: string | null;
    starRating: number;
    overallRating: number | null;
    ratingAdjective: string | null;
    reviewCount: number;
    basePricePerNight: number;
    regularPrice: number | null;
    currency: string;
    isPartner: boolean;
    promoMessage: string | null;
    imageMessage: string | null;
    cancellationPolicy: string | null;
    accommodationTypeId: string | null;
    destinationId: string | null;
    hotelGroupId: string | null;
    latitude: number | null;
    longitude: number | null;
    hotelParkingId: string | null;
  } | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface AccommodationType {
  id: string;
  name: string;
  category: string;
}

interface Destination {
  id: string;
  name: string;
  type: string;
}

interface HotelGroup {
  id: string;
  name: string;
}

interface HotelParking {
  id: string;
  name: string;
  isAvailable: boolean;
}

interface City {
  id: string;
  name: string;
  country: {
    name: string;
  };
}

export default function HotelCardForm({
  hotelCard,
  onSave,
  onCancel,
  isLoading = false,
}: HotelCardFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    idCity: "",
    order: 20,
    shortDescription: "",
    starRating: 3,
    overallRating: null as number | null,
    ratingAdjective: "",
    reviewCount: 0,
    basePricePerNight: 0,
    regularPrice: null as number | null,
    currency: "EUR",
    isPartner: false,
    promoMessage: "",
    imageMessage: "",
    cancellationPolicy: "",
    accommodationTypeId: "",
    destinationId: "",
    hotelGroupId: "",
    latitude: null as number | null,
    longitude: null as number | null,
    hotelParkingId: "",
  });

  const [accommodationTypes, setAccommodationTypes] = useState<
    AccommodationType[]
  >([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotelGroups, setHotelGroups] = useState<HotelGroup[]>([]);
  const [hotelParkings, setHotelParkings] = useState<HotelParking[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (hotelCard) {
      setFormData({
        name: hotelCard.name,
        idCity: hotelCard.idCity,
        order: hotelCard.order,
        shortDescription: hotelCard.shortDescription || "",
        starRating: hotelCard.starRating,
        overallRating: hotelCard.overallRating,
        ratingAdjective: hotelCard.ratingAdjective || "",
        reviewCount: hotelCard.reviewCount,
        basePricePerNight: hotelCard.basePricePerNight,
        regularPrice: hotelCard.regularPrice,
        currency: hotelCard.currency,
        isPartner: hotelCard.isPartner,
        promoMessage: hotelCard.promoMessage || "",
        imageMessage: hotelCard.imageMessage || "",
        cancellationPolicy: hotelCard.cancellationPolicy || "",
        accommodationTypeId: hotelCard.accommodationTypeId || "",
        destinationId: hotelCard.destinationId || "",
        hotelGroupId: hotelCard.hotelGroupId || "",
        latitude: hotelCard.latitude,
        longitude: hotelCard.longitude,
        hotelParkingId: hotelCard.hotelParkingId || "",
      });
    }
  }, [hotelCard]);

  // Charger les données de référence
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [
          accommodationTypesRes,
          destinationsRes,
          hotelGroupsRes,
          hotelParkingsRes,
          citiesRes,
        ] = await Promise.all([
          fetch("/api/accommodation-types"),
          fetch("/api/destinations"),
          fetch("/api/hotel-groups"),
          fetch("/api/hotel-parking"),
          fetch("/api/cities?include=true"),
        ]);

        if (accommodationTypesRes.ok) {
          const data = await accommodationTypesRes.json();
          setAccommodationTypes(data);
        }

        if (destinationsRes.ok) {
          const data = await destinationsRes.json();
          setDestinations(data);
        }

        if (hotelGroupsRes.ok) {
          const data = await hotelGroupsRes.json();
          setHotelGroups(data);
        }

        if (hotelParkingsRes.ok) {
          const data = await hotelParkingsRes.json();
          setHotelParkings(data);
        }

        if (citiesRes.ok) {
          const data = await citiesRes.json();
          setCities(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données de référence:",
          error
        );
        toast.error("Erreur lors du chargement des données");
      }
    };

    loadReferenceData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!formData.name.trim()) {
      toast.error("Le nom de l'hôtel est requis");
      return;
    }

    if (!formData.idCity) {
      toast.error("La ville est requise");
      return;
    }

    if (formData.basePricePerNight <= 0) {
      toast.error("Le prix de base doit être supérieur à 0");
      return;
    }

    if (formData.starRating < 1 || formData.starRating > 5) {
      toast.error("Le nombre d'étoiles doit être entre 1 et 5");
      return;
    }

    // Nettoyer les données avant envoi
    const cleanedData = {
      ...formData,
      shortDescription: formData.shortDescription || null,
      overallRating: formData.overallRating || null,
      ratingAdjective: formData.ratingAdjective || null,
      regularPrice: formData.regularPrice || null,
      promoMessage: formData.promoMessage || null,
      imageMessage: formData.imageMessage || null,
      cancellationPolicy: formData.cancellationPolicy || null,
      accommodationTypeId: formData.accommodationTypeId || null,
      destinationId: formData.destinationId || null,
      hotelGroupId: formData.hotelGroupId || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      hotelParkingId: formData.hotelParkingId || null,
    };

    onSave(cleanedData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {hotelCard ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'hôtel *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Hôtel de la Paix"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idCity">Ville *</Label>
              <Select
                value={formData.idCity}
                onValueChange={(value) => handleInputChange("idCity", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name} - {city.country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="starRating">Nombre d'étoiles *</Label>
              <Select
                value={formData.starRating.toString()}
                onValueChange={(value) =>
                  handleInputChange("starRating", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <SelectItem key={stars} value={stars.toString()}>
                      {stars} étoile{stars > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Ordre d'affichage</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  handleInputChange("order", parseInt(e.target.value) || 20)
                }
                min="0"
                max="9999"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Description courte</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              placeholder="Une description attrayante de votre hôtel..."
              rows={3}
            />
          </div>

          {/* Prix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePricePerNight">Prix de base/nuit *</Label>
              <Input
                id="basePricePerNight"
                type="number"
                step="0.01"
                value={formData.basePricePerNight}
                onChange={(e) =>
                  handleInputChange(
                    "basePricePerNight",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regularPrice">Prix régulier</Label>
              <Input
                id="regularPrice"
                type="number"
                step="0.01"
                value={formData.regularPrice || ""}
                onChange={(e) =>
                  handleInputChange(
                    "regularPrice",
                    parseFloat(e.target.value) || null
                  )
                }
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Évaluations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overallRating">Note globale</Label>
              <Input
                id="overallRating"
                type="number"
                step="0.1"
                value={formData.overallRating || ""}
                onChange={(e) =>
                  handleInputChange(
                    "overallRating",
                    parseFloat(e.target.value) || null
                  )
                }
                min="0"
                max="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ratingAdjective">Adjectif de note</Label>
              <Input
                id="ratingAdjective"
                value={formData.ratingAdjective}
                onChange={(e) =>
                  handleInputChange("ratingAdjective", e.target.value)
                }
                placeholder="Ex: Excellent, Très bien..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewCount">Nombre d'avis</Label>
              <Input
                id="reviewCount"
                type="number"
                value={formData.reviewCount}
                onChange={(e) =>
                  handleInputChange(
                    "reviewCount",
                    parseInt(e.target.value) || 0
                  )
                }
                min="0"
              />
            </div>
          </div>

          {/* Relations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accommodationTypeId">Type d'hébergement</Label>
              <Select
                value={formData.accommodationTypeId}
                onValueChange={(value) =>
                  handleInputChange("accommodationTypeId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {accommodationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - {type.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationId">Destination</Label>
              <Select
                value={formData.destinationId}
                onValueChange={(value) =>
                  handleInputChange("destinationId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {destinations.map((destination) => (
                    <SelectItem key={destination.id} value={destination.id}>
                      {destination.name} - {destination.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotelGroupId">Groupe hôtelier</Label>
              <Select
                value={formData.hotelGroupId}
                onValueChange={(value) =>
                  handleInputChange("hotelGroupId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un groupe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {hotelGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotelParkingId">Parking</Label>
              <Select
                value={formData.hotelParkingId}
                onValueChange={(value) =>
                  handleInputChange("hotelParkingId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un parking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {hotelParkings.map((parking) => (
                    <SelectItem key={parking.id} value={parking.id}>
                      {parking.name} {parking.isAvailable ? "✅" : "❌"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Position GPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude || ""}
                onChange={(e) =>
                  handleInputChange(
                    "latitude",
                    parseFloat(e.target.value) || null
                  )
                }
                placeholder="Ex: 48.8566"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude || ""}
                onChange={(e) =>
                  handleInputChange(
                    "longitude",
                    parseFloat(e.target.value) || null
                  )
                }
                placeholder="Ex: 2.3522"
              />
            </div>
          </div>

          {/* Messages et politiques */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promoMessage">Message promotionnel</Label>
              <Input
                id="promoMessage"
                value={formData.promoMessage}
                onChange={(e) =>
                  handleInputChange("promoMessage", e.target.value)
                }
                placeholder="Ex: -20% sur votre première réservation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageMessage">Message sur image</Label>
              <Input
                id="imageMessage"
                value={formData.imageMessage}
                onChange={(e) =>
                  handleInputChange("imageMessage", e.target.value)
                }
                placeholder="Texte affiché sur les images"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Politique d'annulation</Label>
              <Textarea
                id="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={(e) =>
                  handleInputChange("cancellationPolicy", e.target.value)
                }
                rows={3}
                placeholder="Décrivez votre politique d'annulation..."
              />
            </div>
          </div>

          {/* Switch partenaire */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPartner"
              checked={formData.isPartner}
              onCheckedChange={(checked) =>
                handleInputChange("isPartner", checked)
              }
            />
            <Label htmlFor="isPartner">Hôtel partenaire</Label>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : hotelCard
                ? "Mettre à jour"
                : "Créer"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
