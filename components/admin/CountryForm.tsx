// @/components/admin/CountryForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2 } from "lucide-react";

interface Country {
  id: string;
  name: string;
  order: number;
  code: string;
  language: string | null;
  currency: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CountryFormData {
  name: string;
  code: string;
  language: string;
  currency: string;
  order: number;
}

interface CountryFormProps {
  country?: Country | null;
  onSubmit: (data: CountryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CountryForm({
  country,
  onSubmit,
  onCancel,
  isLoading = false,
}: CountryFormProps) {
  const [formData, setFormData] = useState<CountryFormData>({
    name: country?.name || "",
    code: country?.code || "",
    language: country?.language || "",
    currency: country?.currency || "EUR",
    order: country?.order || 100,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CountryFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CountryFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Le code est requis";
    } else if (formData.code.length < 2 || formData.code.length > 3) {
      newErrors.code = "Le code doit contenir 2 ou 3 caractères";
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
        code: formData.code.toUpperCase(),
        name: formData.name.trim(),
        language: formData.language.trim() || "",
        currency: formData.currency.trim() || "EUR",
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (
    field: keyof CountryFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {country ? "Modifier le pays" : "Ajouter un pays"}
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
            {/* Nom du pays */}
            <div className="md:col-span-2">
              <Label htmlFor="name">
                Nom du pays <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="France"
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Code pays */}
            <div>
              <Label htmlFor="code">
                Code pays <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  handleInputChange("code", e.target.value.toUpperCase())
                }
                placeholder="FR"
                maxLength={3}
                disabled={isLoading}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-sm text-red-500 mt-1">{errors.code}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Code ISO (2-3 caractères)
              </p>
            </div>

            {/* Ordre - ✅ Correction ici */}
            <div>
              <Label htmlFor="order">Ordre d'affichage</Label>
              <Input
                id="order"
                type="number"
                value={formData.order.toString()}
                onChange={(e) =>
                  handleInputChange("order", parseInt(e.target.value) || 1)
                }
                min="1"
                disabled={isLoading}
                className={errors.order ? "border-red-500" : ""}
              />
              {errors.order && (
                <p className="text-sm text-red-500 mt-1">{errors.order}</p>
              )}
            </div>

            {/* Langue */}
            <div>
              <Label htmlFor="language">Langue principale</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                placeholder="Français"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Langue principale parlée
              </p>
            </div>

            {/* Devise */}
            <div>
              <Label htmlFor="currency">Devise</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                placeholder="EUR"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Code devise (EUR, USD, etc.)
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {country ? "Modifier" : "Ajouter"}
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
