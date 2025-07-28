// @/components/admin/CityForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2 } from "lucide-react";

interface Country {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  name: string;
  order: number;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  country?: Country;
}

interface CityFormData {
  name: string;
  countryId: string;
  order: number;
}

// ✅ Interface séparée pour les erreurs
interface CityFormErrors {
  name?: string;
  countryId?: string;
  order?: string;
}

interface CityFormProps {
  city?: City | null;
  onSubmit: (data: CityFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CityForm({
  city,
  onSubmit,
  onCancel,
  isLoading = false,
}: CityFormProps) {
  const [formData, setFormData] = useState<CityFormData>({
    name: city?.name || "",
    countryId: city?.countryId || "",
    order: city?.order || 100,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  // ✅ Utilisation du bon type pour les erreurs
  const [errors, setErrors] = useState<CityFormErrors>({});

  // Charger les pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch("/api/country");
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const validateForm = (): boolean => {
    // ✅ Utilisation du bon type
    const newErrors: CityFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la ville est requis";
    }

    if (!formData.countryId) {
      newErrors.countryId = "Le pays est requis";
    }

    if (formData.order < 1) {
      newErrors.order = "L'ordre doit être supérieur à 0";
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
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  // ✅ Fonction de gestion des changements avec types corrects
  const handleInputChange = (
    field: keyof CityFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof CityFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {city ? "Modifier la ville" : "Ajouter une ville"}
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
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom de la ville */}
            <div className="md:col-span-2">
              <Label htmlFor="name">
                Nom de la ville <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Paris"
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Pays */}
            <div>
              <Label htmlFor="countryId">
                Pays <span className="text-red-500">*</span>
              </Label>
              <select
                id="countryId"
                value={formData.countryId}
                onChange={(e) => handleInputChange("countryId", e.target.value)}
                disabled={isLoading || countriesLoading}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.countryId ? "border-red-500" : ""
                }`}
              >
                <option value="">Sélectionner un pays</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.code} - {country.name}
                  </option>
                ))}
              </select>
              {errors.countryId && (
                <p className="text-sm text-red-500 mt-1">{errors.countryId}</p>
              )}
              {countriesLoading && (
                <p className="text-xs text-gray-500 mt-1">
                  Chargement des pays...
                </p>
              )}
            </div>

            {/* Ordre - ✅ Correction principale ici */}
            <div>
              <Label htmlFor="order">Ordre d'affichage</Label>
              <Input
                id="order"
                type="number"
                value={formData.order.toString()} // ✅ Conversion explicite en string pour l'input
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  handleInputChange("order", value); // ✅ Passer un number
                }}
                min="1"
                disabled={isLoading}
                className={errors.order ? "border-red-500" : ""}
              />
              {errors.order && (
                <p className="text-sm text-red-500 mt-1">{errors.order}</p>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || countriesLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {city ? "Modifier" : "Ajouter"}
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
