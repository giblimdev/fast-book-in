//@/components/host/HotelDetailsForm.tsx
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
import { toast } from "sonner";

interface HotelDetailsFormProps {
  hotelDetails?: {
    id: string;
    idHotelCard: string;
    description: string | null;
    addressId: string;
    order: number | null;
    checkInTime: string | null;
    checkOutTime: string | null;
    numberOfRooms: number | null;
    numberOfFloors: number | null;
    languages: string[];
  } | null;
  hotelCardId?: string;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface Address {
  id: string;
  name: string | null;
  streetNumber: string | null;
  streetType: string | null;
  streetName: string;
  addressLine2: string | null;
  postalCode: string;
  city: {
    id: string;
    name: string;
    country: {
      name: string;
    };
  };
}

interface HotelCard {
  id: string;
  name: string;
}

const LANGUAGES = [
  "Français",
  "Anglais",
  "Espagnol",
  "Italien",
  "Allemand",
  "Portugais",
  "Néerlandais",
  "Russe",
  "Chinois",
  "Japonais",
  "Arabe",
];

export default function HotelDetailsForm({
  hotelDetails,
  hotelCardId,
  onSave,
  onCancel,
  isLoading = false,
}: HotelDetailsFormProps) {
  const [formData, setFormData] = useState({
    idHotelCard: hotelCardId || "",
    description: "",
    addressId: "",
    order: 20,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    numberOfRooms: null as number | null,
    numberOfFloors: null as number | null,
    languages: [] as string[],
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hotelCards, setHotelCards] = useState<HotelCard[]>([]);

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (hotelDetails) {
      setFormData({
        idHotelCard: hotelDetails.idHotelCard,
        description: hotelDetails.description || "",
        addressId: hotelDetails.addressId,
        order: hotelDetails.order || 20,
        checkInTime: hotelDetails.checkInTime || "15:00",
        checkOutTime: hotelDetails.checkOutTime || "11:00",
        numberOfRooms: hotelDetails.numberOfRooms,
        numberOfFloors: hotelDetails.numberOfFloors,
        languages: hotelDetails.languages || [],
      });
    } else if (hotelCardId) {
      setFormData((prev) => ({
        ...prev,
        idHotelCard: hotelCardId,
      }));
    }
  }, [hotelDetails, hotelCardId]);

  // Charger les données de référence
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [addressesRes, hotelCardsRes] = await Promise.all([
          fetch("/api/addresses?include=true"),
          fetch("/api/hotel-cards?include=false"),
        ]);

        if (addressesRes.ok) {
          const data = await addressesRes.json();
          setAddresses(data);
        }

        if (hotelCardsRes.ok) {
          const data = await hotelCardsRes.json();
          setHotelCards(data);
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

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((lang) => lang !== language)
        : [...prev.languages, language],
    }));
  };

  const formatAddress = (address: Address): string => {
    const parts = [address.streetNumber, address.streetType, address.streetName]
      .filter(Boolean)
      .join(" ");

    return `${parts}, ${address.postalCode} ${address.city.name}, ${address.city.country.name}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!formData.idHotelCard) {
      toast.error("Vous devez sélectionner un hôtel");
      return;
    }

    if (!formData.addressId) {
      toast.error("Vous devez sélectionner une adresse");
      return;
    }

    // Validation des heures
    if (
      formData.checkInTime &&
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.checkInTime)
    ) {
      toast.error("Format d'heure d'arrivée invalide (HH:MM)");
      return;
    }

    if (
      formData.checkOutTime &&
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.checkOutTime)
    ) {
      toast.error("Format d'heure de départ invalide (HH:MM)");
      return;
    }

    // Nettoyer les données avant envoi
    const cleanedData = {
      ...formData,
      description: formData.description || null,
      checkInTime: formData.checkInTime || null,
      checkOutTime: formData.checkOutTime || null,
      numberOfRooms: formData.numberOfRooms || null,
      numberOfFloors: formData.numberOfFloors || null,
    };

    onSave(cleanedData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {hotelDetails
            ? "Modifier les détails de l'hôtel"
            : "Créer les détails de l'hôtel"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de l'hôtel */}
          <div className="space-y-2">
            <Label htmlFor="idHotelCard">Hôtel *</Label>
            <Select
              value={formData.idHotelCard}
              onValueChange={(value) => handleInputChange("idHotelCard", value)}
              disabled={!!hotelCardId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un hôtel" />
              </SelectTrigger>
              <SelectContent>
                {hotelCards.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description complète de l'hôtel, ses services, son environnement..."
              rows={5}
            />
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="addressId">Adresse *</Label>
            <Select
              value={formData.addressId}
              onValueChange={(value) => handleInputChange("addressId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une adresse" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    {formatAddress(address)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informations de l'établissement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfRooms">Nombre de chambres</Label>
              <Input
                id="numberOfRooms"
                type="number"
                value={formData.numberOfRooms || ""}
                onChange={(e) =>
                  handleInputChange(
                    "numberOfRooms",
                    parseInt(e.target.value) || null
                  )
                }
                min="1"
                placeholder="Ex: 50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfFloors">Nombre d'étages</Label>
              <Input
                id="numberOfFloors"
                type="number"
                value={formData.numberOfFloors || ""}
                onChange={(e) =>
                  handleInputChange(
                    "numberOfFloors",
                    parseInt(e.target.value) || null
                  )
                }
                min="1"
                placeholder="Ex: 4"
              />
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

          {/* Horaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Heure d'arrivée</Label>
              <Input
                id="checkInTime"
                type="time"
                value={formData.checkInTime || ""}
                onChange={(e) =>
                  handleInputChange("checkInTime", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Heure de départ</Label>
              <Input
                id="checkOutTime"
                type="time"
                value={formData.checkOutTime || ""}
                onChange={(e) =>
                  handleInputChange("checkOutTime", e.target.value)
                }
              />
            </div>
          </div>

          {/* Langues parlées */}
          <div className="space-y-2">
            <Label>Langues parlées à la réception</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {LANGUAGES.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`lang-${language}`}
                    checked={formData.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`lang-${language}`} className="text-sm">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Enregistrement..."
                : hotelDetails
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
