// @/components/admin/HotelAmenityForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2, Star, Code, Plus, Trash2 } from "lucide-react";

interface HotelAmenity {
  id: string;
  name: string;
  order: number | null;
  category: string | null;
  icon: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HotelAmenityFormData {
  name: string;
  order: number;
  category: string;
  icon: string;
  description: string;
}

// ✅ Nouveau type pour les créations multiples
interface BulkHotelAmenityData {
  amenities: HotelAmenityFormData[];
}

interface HotelAmenityFormErrors {
  name?: string;
  order?: string;
  category?: string;
  json?: string;
  bulk?: string;
}

interface HotelAmenityFormProps {
  amenity?: HotelAmenity | null;
  onSubmit: (data: HotelAmenityFormData) => Promise<void>;
  onBulkSubmit?: (data: BulkHotelAmenityData) => Promise<void>; // ✅ Nouvelle prop
  onCancel: () => void;
  isLoading?: boolean;
  allowBulk?: boolean; // ✅ Nouvelle prop pour activer le mode bulk
}

// ✅ Catégories prédéfinies selon votre schéma
const AMENITY_CATEGORIES = [
  { value: "", label: "Non spécifiée" },
  { value: "Location", label: "Emplacement" },
  { value: "Amenity", label: "Équipement" },
  { value: "Service", label: "Service" },
  { value: "View", label: "Vue" },
  { value: "Offer", label: "Offre" },
  { value: "Food", label: "Restauration" },
  { value: "Wellness", label: "Bien-être" },
  { value: "Business", label: "Affaires" },
  { value: "Entertainment", label: "Divertissement" },
  { value: "Transport", label: "Transport" },
];

const COMMON_ICONS = [
  { value: "", label: "Aucune icône" },
  { value: "wifi", label: "📶 WiFi" },
  { value: "parking", label: "🚗 Parking" },
  { value: "pool", label: "🏊 Piscine" },
  { value: "gym", label: "💪 Salle de sport" },
  { value: "spa", label: "🧖 Spa" },
  { value: "restaurant", label: "🍽️ Restaurant" },
  { value: "bar", label: "🍺 Bar" },
  { value: "breakfast", label: "🥐 Petit-déjeuner" },
  { value: "air-conditioning", label: "❄️ Climatisation" },
  { value: "elevator", label: "🛗 Ascenseur" },
  { value: "balcony", label: "🏠 Balcon" },
  { value: "sea-view", label: "🌊 Vue mer" },
  { value: "mountain-view", label: "🏔️ Vue montagne" },
  { value: "room-service", label: "🛎️ Service en chambre" },
  { value: "concierge", label: "🤵 Conciergerie" },
  { value: "laundry", label: "🧺 Blanchisserie" },
  { value: "pets", label: "🐕 Animaux acceptés" },
];

export default function HotelAmenityForm({
  amenity,
  onSubmit,
  onBulkSubmit,
  onCancel,
  isLoading = false,
  allowBulk = false,
}: HotelAmenityFormProps) {
  const [formData, setFormData] = useState<HotelAmenityFormData>({
    name: amenity?.name || "",
    order: amenity?.order || 100,
    category: amenity?.category || "",
    icon: amenity?.icon || "",
    description: amenity?.description || "",
  });

  // ✅ État pour les équipements multiples
  const [bulkAmenities, setBulkAmenities] = useState<HotelAmenityFormData[]>([
    {
      name: "",
      order: 100,
      category: "",
      icon: "",
      description: "",
    },
  ]);

  const [errors, setErrors] = useState<HotelAmenityFormErrors>({});
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);

  // ✅ Onglet actif avec mode bulk
  const [activeTab, setActiveTab] = useState<"form" | "json" | "bulk">("form");

  // ✅ Effet pour mettre à jour le formulaire quand l'amenity change
  useEffect(() => {
    if (amenity) {
      const newFormData = {
        name: amenity.name || "",
        order: amenity.order || 100,
        category: amenity.category || "",
        icon: amenity.icon || "",
        description: amenity.description || "",
      };
      setFormData(newFormData);
      updateJsonFromForm(newFormData);
    }
  }, [amenity]);

  // ✅ Mettre à jour le JSON depuis les données du formulaire
  const updateJsonFromForm = (data: HotelAmenityFormData) => {
    const jsonObject = {
      name: data.name,
      order: data.order,
      category: data.category || null,
      icon: data.icon || null,
      description: data.description || null,
      ...(amenity && {
        id: amenity.id,
        createdAt: amenity.createdAt,
        updatedAt: amenity.updatedAt,
      }),
    };
    setJsonData(JSON.stringify(jsonObject, null, 2));
  };

  // ✅ Mettre à jour le JSON pour le mode bulk
  const updateJsonFromBulk = (amenities: HotelAmenityFormData[]) => {
    const jsonObject = {
      amenities: amenities.map((amenity) => ({
        name: amenity.name,
        order: amenity.order,
        category: amenity.category || null,
        icon: amenity.icon || null,
        description: amenity.description || null,
      })),
    };
    setJsonData(JSON.stringify(jsonObject, null, 2));
  };

  // ✅ Mettre à jour depuis le JSON
  const updateFormFromJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (
        activeTab === "bulk" &&
        parsed.amenities &&
        Array.isArray(parsed.amenities)
      ) {
        // Mode bulk
        const newBulkAmenities = parsed.amenities.map((item: any) => ({
          name: item.name || "",
          order: item.order || 100,
          category: item.category || "",
          icon: item.icon || "",
          description: item.description || "",
        }));
        setBulkAmenities(newBulkAmenities);
      } else {
        // Mode simple
        const newFormData = {
          name: parsed.name || "",
          order: parsed.order || 100,
          category: parsed.category || "",
          icon: parsed.icon || "",
          description: parsed.description || "",
        };
        setFormData(newFormData);
      }

      setIsJsonValid(true);
      setErrors((prev) => ({ ...prev, json: undefined }));
    } catch (error) {
      setIsJsonValid(false);
      setErrors((prev) => ({ ...prev, json: "JSON invalide" }));
    }
  };

  // ✅ Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: HotelAmenityFormErrors = {};

    if (activeTab === "form") {
      if (!formData.name.trim()) {
        newErrors.name = "Le nom est requis";
      }
      if (formData.order < 0 || formData.order > 9999) {
        newErrors.order = "L'ordre doit être entre 0 et 9999";
      }
    }

    if (activeTab === "bulk") {
      const emptyNames = bulkAmenities.some((amenity) => !amenity.name.trim());
      if (emptyNames) {
        newErrors.bulk = "Tous les équipements doivent avoir un nom";
      }
    }

    if (activeTab === "json" && !isJsonValid) {
      newErrors.json = "Le JSON doit être valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (activeTab === "bulk" && onBulkSubmit) {
        // Soumission multiple
        const validAmenities = bulkAmenities.filter((amenity) =>
          amenity.name.trim()
        );
        await onBulkSubmit({ amenities: validAmenities });
      } else {
        // Soumission simple
        await onSubmit({
          ...formData,
          name: formData.name.trim(),
          category: formData.category.trim() || "",
          icon: formData.icon.trim() || "",
          description: formData.description.trim() || "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (
    field: keyof HotelAmenityFormData,
    value: string | number
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateJsonFromForm(newFormData);

    if (errors[field as keyof HotelAmenityFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Gestion des équipements multiples
  const handleBulkInputChange = (
    index: number,
    field: keyof HotelAmenityFormData,
    value: string | number
  ) => {
    const newBulkAmenities = [...bulkAmenities];
    newBulkAmenities[index] = { ...newBulkAmenities[index], [field]: value };
    setBulkAmenities(newBulkAmenities);
    updateJsonFromBulk(newBulkAmenities);
  };

  const addBulkAmenity = () => {
    setBulkAmenities([
      ...bulkAmenities,
      {
        name: "",
        order: 100,
        category: "",
        icon: "",
        description: "",
      },
    ]);
  };

  const removeBulkAmenity = (index: number) => {
    if (bulkAmenities.length > 1) {
      const newBulkAmenities = bulkAmenities.filter((_, i) => i !== index);
      setBulkAmenities(newBulkAmenities);
      updateJsonFromBulk(newBulkAmenities);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonData(value);
    updateFormFromJson(value);
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2));
      setIsJsonValid(true);
    } catch (error) {
      setIsJsonValid(false);
    }
  };

  // ✅ Changement d'onglet avec mise à jour du JSON
  const handleTabChange = (tab: "form" | "json" | "bulk") => {
    setActiveTab(tab);
    if (tab === "bulk") {
      updateJsonFromBulk(bulkAmenities);
    } else if (tab === "form") {
      updateJsonFromForm(formData);
    }
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            {amenity ? "Modifier l'équipement" : "Ajouter des équipements"}
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

        {/* ✅ Onglets avec mode bulk */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleTabChange("form")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "form"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            disabled={amenity !== null}
          >
            <Star className="h-4 w-4" />
            Formulaire
          </button>

          {allowBulk && !amenity && (
            <button
              type="button"
              onClick={() => handleTabChange("bulk")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "bulk"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Plus className="h-4 w-4" />
              Ajout multiple ({bulkAmenities.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTabChange("json")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "json"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Code className="h-4 w-4" />
            JSON {!isJsonValid && <span className="text-red-500">⚠️</span>}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Onglet Formulaire simple */}
          {activeTab === "form" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations de l'équipement
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom */}
                <div className="md:col-span-2">
                  <Label htmlFor="name">
                    Nom de l'équipement <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="WiFi gratuit, Piscine, Salle de sport..."
                    disabled={isLoading}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Ordre d'affichage */}
                <div>
                  <Label htmlFor="order">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    max="9999"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange(
                        "order",
                        parseInt(e.target.value) || 100
                      )
                    }
                    disabled={isLoading}
                    className={errors.order ? "border-red-500" : ""}
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {AMENITY_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Icône */}
                <div className="md:col-span-2">
                  <Label htmlFor="icon">Icône</Label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => handleInputChange("icon", e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {COMMON_ICONS.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Description détaillée de l'équipement..."
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ✅ Onglet Ajout multiple */}
          {activeTab === "bulk" && allowBulk && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ajout de plusieurs équipements
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBulkAmenity}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un équipement
                </Button>
              </div>

              {errors.bulk && (
                <p className="text-sm text-red-500">{errors.bulk}</p>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bulkAmenities.map((amenity, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Équipement #{index + 1}</h4>
                      {bulkAmenities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBulkAmenity(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Label>Nom *</Label>
                        <Input
                          value={amenity.name}
                          onChange={(e) =>
                            handleBulkInputChange(index, "name", e.target.value)
                          }
                          placeholder="Nom de l'équipement"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Ordre</Label>
                        <Input
                          type="number"
                          value={amenity.order}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "order",
                              parseInt(e.target.value) || 100
                            )
                          }
                          min="0"
                          max="9999"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Catégorie</Label>
                        <select
                          value={amenity.category}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "category",
                              e.target.value
                            )
                          }
                          disabled={isLoading}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {AMENITY_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Icône</Label>
                        <select
                          value={amenity.icon}
                          onChange={(e) =>
                            handleBulkInputChange(index, "icon", e.target.value)
                          }
                          disabled={isLoading}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {COMMON_ICONS.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <Label>Description</Label>
                        <Textarea
                          value={amenity.description}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description de l'équipement..."
                          disabled={isLoading}
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Onglet JSON avec corrections TypeScript */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Édition JSON
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={formatJson}
                    disabled={isLoading}
                  >
                    Formater
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyJsonToClipboard}
                    disabled={isLoading}
                  >
                    Copier
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jsonEditor">
                  Données JSON
                  {!isJsonValid && (
                    <span className="text-red-500 ml-2">⚠️ JSON invalide</span>
                  )}
                </Label>
                <Textarea
                  id="jsonEditor"
                  value={jsonData}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder="Données en format JSON..."
                  disabled={isLoading}
                  rows={15}
                  className={`font-mono text-sm ${
                    !isJsonValid ? "border-red-500 bg-red-50" : "bg-gray-50"
                  }`}
                />
                {errors.json && (
                  <p className="text-sm text-red-500 mt-1">{errors.json}</p>
                )}
                <p className="text-xs text-gray-500">
                  {/* ✅ Correction de la logique de détection du format */}
                  {jsonData.includes('"amenities"')
                    ? 'Format JSON pour plusieurs équipements : { "amenities": [...] }'
                    : 'Format JSON pour un équipement : { "name": "...", "order": 100, ... }'}
                </p>
              </div>

              {/* ✅ Aperçu des données corrigé */}
              {isJsonValid && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Aperçu des données
                  </h4>
                  {/* ✅ Correction de la condition logique */}
                  {jsonData.includes('"amenities"') ? (
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Nombre d'équipements:</strong>{" "}
                        {bulkAmenities.length}
                      </div>
                      {bulkAmenities.slice(0, 3).map((amenity, index) => (
                        <div key={index} className="ml-4">
                          <strong>#{index + 1}:</strong>{" "}
                          {amenity.name || "Sans nom"}
                        </div>
                      ))}
                      {bulkAmenities.length > 3 && (
                        <div className="ml-4 text-gray-500">
                          ... et {bulkAmenities.length - 3} autres
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Nom:</strong> {formData.name || "Non défini"}
                      </div>
                      <div>
                        <strong>Ordre:</strong> {formData.order}
                      </div>
                      <div>
                        <strong>Catégorie:</strong>{" "}
                        {formData.category || "Non spécifiée"}
                      </div>
                      <div>
                        <strong>Icône:</strong> {formData.icon || "Aucune"}
                      </div>
                      <div>
                        <strong>Description:</strong>{" "}
                        {formData.description || "Aucune description"}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || !isJsonValid}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {activeTab === "bulk"
                ? `Ajouter ${
                    bulkAmenities.filter((a) => a.name.trim()).length
                  } équipements`
                : amenity
                ? "Modifier"
                : "Ajouter"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>

            {activeTab === "json" && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {isJsonValid ? (
                  <span className="text-green-600">✅ JSON valide</span>
                ) : (
                  <span className="text-red-600">❌ JSON invalide</span>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
