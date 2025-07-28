// @/components/admin/AccommodationTypeForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2, Building2, Code, Plus, Trash2 } from "lucide-react";

interface AccommodationType {
  id: string;
  name: string;
  order: number | null;
  code: string;
  description: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface AccommodationTypeFormData {
  name: string;
  order: number;
  code: string;
  description: string;
  category: string;
}

// ✅ Type pour les créations multiples
interface BulkAccommodationTypeData {
  accommodationTypes: AccommodationTypeFormData[];
}

interface AccommodationTypeFormErrors {
  name?: string;
  code?: string;
  category?: string;
  order?: string;
  json?: string;
  bulk?: string;
}

interface AccommodationTypeFormProps {
  accommodationType?: AccommodationType | null;
  onSubmit: (data: AccommodationTypeFormData) => Promise<void>;
  onBulkSubmit?: (data: BulkAccommodationTypeData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  allowBulk?: boolean;
}

// ✅ Catégories d'hébergement
const ACCOMMODATION_CATEGORIES = [
  { value: "Hotel", label: "Hôtel" },
  { value: "Apartment", label: "Appartement" },
  { value: "House", label: "Maison" },
  { value: "Resort", label: "Resort" },
  { value: "BnB", label: "Bed & Breakfast" },
  { value: "Hostel", label: "Auberge de jeunesse" },
  { value: "Villa", label: "Villa" },
  { value: "Chalet", label: "Chalet" },
  { value: "Cabin", label: "Cabane" },
  { value: "Camping", label: "Camping" },
  { value: "Glamping", label: "Glamping" },
  { value: "Boat", label: "Bateau" },
  { value: "Other", label: "Autre" },
];

export default function AccommodationTypeForm({
  accommodationType,
  onSubmit,
  onBulkSubmit,
  onCancel,
  isLoading = false,
  allowBulk = false,
}: AccommodationTypeFormProps) {
  const [formData, setFormData] = useState<AccommodationTypeFormData>({
    name: accommodationType?.name || "",
    order: accommodationType?.order || 100,
    code: accommodationType?.code || "",
    description: accommodationType?.description || "",
    category: accommodationType?.category || "Hotel",
  });

  // ✅ État pour les types d'hébergement multiples
  const [bulkAccommodationTypes, setBulkAccommodationTypes] = useState<
    AccommodationTypeFormData[]
  >([
    {
      name: "",
      order: 100,
      code: "",
      description: "",
      category: "Hotel",
    },
  ]);

  const [errors, setErrors] = useState<AccommodationTypeFormErrors>({});
  const [jsonData, setJsonData] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);

  // ✅ Onglet actif
  const [activeTab, setActiveTab] = useState<"form" | "json" | "bulk">("form");

  // ✅ Effet pour mettre à jour le formulaire
  useEffect(() => {
    if (accommodationType) {
      const newFormData = {
        name: accommodationType.name || "",
        order: accommodationType.order || 100,
        code: accommodationType.code || "",
        description: accommodationType.description || "",
        category: accommodationType.category || "Hotel",
      };
      setFormData(newFormData);
      updateJsonFromForm(newFormData);
    }
  }, [accommodationType]);

  // ✅ Mettre à jour le JSON depuis le formulaire
  const updateJsonFromForm = (data: AccommodationTypeFormData) => {
    const jsonObject = {
      name: data.name,
      order: data.order,
      code: data.code,
      description: data.description || null,
      category: data.category,
      ...(accommodationType && {
        id: accommodationType.id,
        createdAt: accommodationType.createdAt,
        updatedAt: accommodationType.updatedAt,
      }),
    };
    setJsonData(JSON.stringify(jsonObject, null, 2));
  };

  // ✅ Mettre à jour le JSON pour le mode bulk
  const updateJsonFromBulk = (
    accommodationTypes: AccommodationTypeFormData[]
  ) => {
    const jsonObject = {
      accommodationTypes: accommodationTypes.map((type) => ({
        name: type.name,
        order: type.order,
        code: type.code,
        description: type.description || null,
        category: type.category,
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
        parsed.accommodationTypes &&
        Array.isArray(parsed.accommodationTypes)
      ) {
        // Mode bulk
        const newBulkTypes = parsed.accommodationTypes.map((item: any) => ({
          name: item.name || "",
          order: item.order || 100,
          code: item.code || "",
          description: item.description || "",
          category: item.category || "Hotel",
        }));
        setBulkAccommodationTypes(newBulkTypes);
      } else {
        // Mode simple
        const newFormData = {
          name: parsed.name || "",
          order: parsed.order || 100,
          code: parsed.code || "",
          description: parsed.description || "",
          category: parsed.category || "Hotel",
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
    const newErrors: AccommodationTypeFormErrors = {};

    if (activeTab === "form") {
      if (!formData.name.trim()) {
        newErrors.name = "Le nom est requis";
      }
      if (!formData.code.trim()) {
        newErrors.code = "Le code est requis";
      }
      if (formData.order < 0 || formData.order > 9999) {
        newErrors.order = "L'ordre doit être entre 0 et 9999";
      }
    }

    if (activeTab === "bulk") {
      const hasEmptyRequired = bulkAccommodationTypes.some(
        (type) => !type.name.trim() || !type.code.trim()
      );
      if (hasEmptyRequired) {
        newErrors.bulk = "Tous les types doivent avoir un nom et un code";
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
        const validTypes = bulkAccommodationTypes.filter(
          (type) => type.name.trim() && type.code.trim()
        );
        await onBulkSubmit({ accommodationTypes: validTypes });
      } else {
        // Soumission simple
        await onSubmit({
          ...formData,
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          description: formData.description.trim() || "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleInputChange = (
    field: keyof AccommodationTypeFormData,
    value: string | number
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateJsonFromForm(newFormData);

    if (errors[field as keyof AccommodationTypeFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Gestion des types multiples
  const handleBulkInputChange = (
    index: number,
    field: keyof AccommodationTypeFormData,
    value: string | number
  ) => {
    const newBulkTypes = [...bulkAccommodationTypes];
    newBulkTypes[index] = { ...newBulkTypes[index], [field]: value };
    setBulkAccommodationTypes(newBulkTypes);
    updateJsonFromBulk(newBulkTypes);
  };

  const addBulkType = () => {
    setBulkAccommodationTypes([
      ...bulkAccommodationTypes,
      {
        name: "",
        order: 100,
        code: "",
        description: "",
        category: "Hotel",
      },
    ]);
  };

  const removeBulkType = (index: number) => {
    if (bulkAccommodationTypes.length > 1) {
      const newBulkTypes = bulkAccommodationTypes.filter((_, i) => i !== index);
      setBulkAccommodationTypes(newBulkTypes);
      updateJsonFromBulk(newBulkTypes);
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

  // ✅ Changement d'onglet
  const handleTabChange = (tab: "form" | "json" | "bulk") => {
    setActiveTab(tab);
    if (tab === "bulk") {
      updateJsonFromBulk(bulkAccommodationTypes);
    } else if (tab === "form") {
      updateJsonFromForm(formData);
    }
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {accommodationType
              ? "Modifier le type d'hébergement"
              : "Ajouter des types d'hébergement"}
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

        {/* ✅ Onglets */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleTabChange("form")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "form"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            disabled={accommodationType !== null}
          >
            <Building2 className="h-4 w-4" />
            Formulaire
          </button>

          {allowBulk && !accommodationType && (
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
              Ajout multiple ({bulkAccommodationTypes.length})
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
                Informations du type d'hébergement
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom */}
                <div className="md:col-span-2">
                  <Label htmlFor="name">
                    Nom du type d'hébergement{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Hôtel de luxe, Appartement moderne..."
                    disabled={isLoading}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Code */}
                <div>
                  <Label htmlFor="code">
                    Code unique <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      handleInputChange("code", e.target.value.toUpperCase())
                    }
                    placeholder="HOTEL_LUXURY"
                    disabled={isLoading}
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500 mt-1">{errors.code}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Code unique pour identifier le type d'hébergement
                  </p>
                </div>

                {/* Ordre */}
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
                  {errors.order && (
                    <p className="text-sm text-red-500 mt-1">{errors.order}</p>
                  )}
                </div>

                {/* Catégorie */}
                <div className="md:col-span-2">
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
                    {ACCOMMODATION_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                    placeholder="Description détaillée du type d'hébergement..."
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
                  Ajout de plusieurs types d'hébergement
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBulkType}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un type
                </Button>
              </div>

              {errors.bulk && (
                <p className="text-sm text-red-500">{errors.bulk}</p>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bulkAccommodationTypes.map((type, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        Type d'hébergement #{index + 1}
                      </h4>
                      {bulkAccommodationTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBulkType(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Nom *</Label>
                        <Input
                          value={type.name}
                          onChange={(e) =>
                            handleBulkInputChange(index, "name", e.target.value)
                          }
                          placeholder="Nom du type d'hébergement"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Code *</Label>
                        <Input
                          value={type.code}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "code",
                              e.target.value.toUpperCase()
                            )
                          }
                          placeholder="CODE_UNIQUE"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Ordre</Label>
                        <Input
                          type="number"
                          value={type.order}
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
                          value={type.category}
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
                          {ACCOMMODATION_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={type.description}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description du type d'hébergement..."
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

          {/* ✅ Onglet JSON */}
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
                  {jsonData.includes('"accommodationTypes"')
                    ? 'Format JSON pour plusieurs types : { "accommodationTypes": [...] }'
                    : 'Format JSON pour un type : { "name": "...", "code": "...", ... }'}
                </p>
              </div>

              {/* ✅ Aperçu des données */}
              {isJsonValid && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Aperçu des données
                  </h4>
                  {jsonData.includes('"accommodationTypes"') ? (
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Nombre de types:</strong>{" "}
                        {bulkAccommodationTypes.length}
                      </div>
                      {bulkAccommodationTypes.slice(0, 3).map((type, index) => (
                        <div key={index} className="ml-4">
                          <strong>#{index + 1}:</strong>{" "}
                          {type.name || "Sans nom"} (
                          {type.code || "Pas de code"})
                        </div>
                      ))}
                      {bulkAccommodationTypes.length > 3 && (
                        <div className="ml-4 text-gray-500">
                          ... et {bulkAccommodationTypes.length - 3} autres
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Nom:</strong> {formData.name || "Non défini"}
                      </div>
                      <div>
                        <strong>Code:</strong> {formData.code || "Non défini"}
                      </div>
                      <div>
                        <strong>Catégorie:</strong> {formData.category}
                      </div>
                      <div>
                        <strong>Ordre:</strong> {formData.order}
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
                    bulkAccommodationTypes.filter(
                      (t) => t.name.trim() && t.code.trim()
                    ).length
                  } types`
                : accommodationType
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
