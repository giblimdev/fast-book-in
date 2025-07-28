// @/components/admin/LabelForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Loader2, Tag, Code, Plus, Trash2 } from "lucide-react";

interface LabelData {
  id: string;
  name: string;
  order: number | null;
  code: string;
  description: string | null;
  category: string;
  icon: string | null;
  color: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
  hotelDetailsId?: string | null; // ✅ Ajout du champ manquant
}

interface LabelFormData {
  name: string;
  order: number;
  code: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  priority: number;
  hotelDetailsId?: string; // ✅ Ajout du champ optionnel
}

// ✅ Type pour les créations multiples
interface BulkLabelData {
  labels: LabelFormData[];
}

interface LabelFormErrors {
  name?: string;
  code?: string;
  category?: string;
  priority?: string;
  order?: string;
  json?: string;
  bulk?: string;
}

interface LabelFormProps {
  label?: LabelData | null;
  onSubmit: (data: LabelFormData) => Promise<void>;
  onBulkSubmit?: (data: BulkLabelData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  allowBulk?: boolean;
}

// ✅ Catégories de labels selon votre schéma
const LABEL_CATEGORIES = [
  { value: "Quality", label: "Qualité" },
  { value: "Location", label: "Emplacement" },
  { value: "Service", label: "Service" },
  { value: "Amenity", label: "Équipement" },
  { value: "Experience", label: "Expérience" },
  { value: "Value", label: "Rapport qualité-prix" },
  { value: "Accessibility", label: "Accessibilité" },
  { value: "Sustainability", label: "Durabilité" },
  { value: "Business", label: "Affaires" },
  { value: "Family", label: "Famille" },
  { value: "Romantic", label: "Romantique" },
  { value: "Adventure", label: "Aventure" },
  { value: "Luxury", label: "Luxe" },
  { value: "Budget", label: "Économique" },
  { value: "Popular", label: "Populaire" },
  { value: "New", label: "Nouveau" },
  { value: "Promoted", label: "Promu" },
  { value: "Special", label: "Spécial" },
];

// ✅ Couleurs prédéfinies
const LABEL_COLORS = [
  { value: "", label: "Aucune couleur" },
  { value: "#3B82F6", label: "🔵 Bleu" },
  { value: "#EF4444", label: "🔴 Rouge" },
  { value: "#10B981", label: "🟢 Vert" },
  { value: "#F59E0B", label: "🟡 Orange" },
  { value: "#8B5CF6", label: "🟣 Violet" },
  { value: "#EC4899", label: "🌸 Rose" },
  { value: "#06B6D4", label: "🔷 Cyan" },
  { value: "#84CC16", label: "🟢 Vert clair" },
  { value: "#F97316", label: "🟠 Orange foncé" },
  { value: "#6B7280", label: "⚫ Gris" },
];

// ✅ Icônes courantes
const COMMON_ICONS = [
  { value: "", label: "Aucune icône" },
  { value: "star", label: "⭐ Étoile" },
  { value: "heart", label: "❤️ Cœur" },
  { value: "award", label: "🏆 Récompense" },
  { value: "crown", label: "👑 Couronne" },
  { value: "fire", label: "🔥 Feu" },
  { value: "thumbs-up", label: "👍 Pouce levé" },
  { value: "check", label: "✅ Coche" },
  { value: "shield", label: "🛡️ Bouclier" },
  { value: "diamond", label: "💎 Diamant" },
  { value: "bolt", label: "⚡ Éclair" },
  { value: "sparkles", label: "✨ Étincelles" },
  { value: "sun", label: "☀️ Soleil" },
  { value: "moon", label: "🌙 Lune" },
  { value: "mountain", label: "🏔️ Montagne" },
  { value: "beach", label: "🏖️ Plage" },
  { value: "city", label: "🏙️ Ville" },
  { value: "building", label: "🏢 Bâtiment" },
];

export default function LabelForm({
  label,
  onSubmit,
  onBulkSubmit,
  onCancel,
  isLoading = false,
  allowBulk = false,
}: LabelFormProps) {
  const [formData, setFormData] = useState<LabelFormData>({
    name: label?.name || "",
    order: label?.order || 100,
    code: label?.code || "",
    description: label?.description || "",
    category: label?.category || "Quality",
    icon: label?.icon || "",
    color: label?.color || "",
    priority: label?.priority || 0,
    hotelDetailsId: label?.hotelDetailsId || "", // ✅ Ajout
  });

  // ✅ État pour les labels multiples
  const [bulkLabels, setBulkLabels] = useState<LabelFormData[]>([
    {
      name: "",
      order: 100,
      code: "",
      description: "",
      category: "Quality",
      icon: "",
      color: "",
      priority: 0,
      hotelDetailsId: "",
    },
  ]);

  const [errors, setErrors] = useState<LabelFormErrors>({});
  const [jsonData, setJsonData] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);

  // ✅ Onglet actif
  const [activeTab, setActiveTab] = useState<"form" | "json" | "bulk">("form");

  // ✅ Effet pour mettre à jour le formulaire
  useEffect(() => {
    if (label) {
      const newFormData = {
        name: label.name || "",
        order: label.order || 100,
        code: label.code || "",
        description: label.description || "",
        category: label.category || "Quality",
        icon: label.icon || "",
        color: label.color || "",
        priority: label.priority || 0,
        hotelDetailsId: label.hotelDetailsId || "",
      };
      setFormData(newFormData);
      updateJsonFromForm(newFormData);
    }
  }, [label]);

  // ✅ Mettre à jour le JSON depuis le formulaire
  const updateJsonFromForm = (data: LabelFormData) => {
    const jsonObject = {
      name: data.name,
      order: data.order,
      code: data.code,
      description: data.description || null,
      category: data.category,
      icon: data.icon || null,
      color: data.color || null,
      priority: data.priority,
      hotelDetailsId: data.hotelDetailsId || null,
      ...(label && {
        id: label.id,
        createdAt: label.createdAt,
        updatedAt: label.updatedAt,
      }),
    };
    setJsonData(JSON.stringify(jsonObject, null, 2));
  };

  // ✅ Mettre à jour le JSON pour le mode bulk
  const updateJsonFromBulk = (labels: LabelFormData[]) => {
    const jsonObject = {
      labels: labels.map((label) => ({
        name: label.name,
        order: label.order,
        code: label.code,
        description: label.description || null,
        category: label.category,
        icon: label.icon || null,
        color: label.color || null,
        priority: label.priority,
        hotelDetailsId: label.hotelDetailsId || null,
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
        parsed.labels &&
        Array.isArray(parsed.labels)
      ) {
        // Mode bulk
        const newBulkLabels = parsed.labels.map((item: any) => ({
          name: item.name || "",
          order: item.order || 100,
          code: item.code || "",
          description: item.description || "",
          category: item.category || "Quality",
          icon: item.icon || "",
          color: item.color || "",
          priority: item.priority || 0,
          hotelDetailsId: item.hotelDetailsId || "",
        }));
        setBulkLabels(newBulkLabels);
      } else {
        // Mode simple
        const newFormData = {
          name: parsed.name || "",
          order: parsed.order || 100,
          code: parsed.code || "",
          description: parsed.description || "",
          category: parsed.category || "Quality",
          icon: parsed.icon || "",
          color: parsed.color || "",
          priority: parsed.priority || 0,
          hotelDetailsId: parsed.hotelDetailsId || "",
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
    const newErrors: LabelFormErrors = {};

    if (activeTab === "form") {
      if (!formData.name.trim()) {
        newErrors.name = "Le nom est requis";
      }
      if (!formData.code.trim()) {
        newErrors.code = "Le code est requis";
      }
      if (!formData.category) {
        newErrors.category = "La catégorie est requise";
      }
      if (formData.priority < 0 || formData.priority > 100) {
        newErrors.priority = "La priorité doit être entre 0 et 100";
      }
      if (formData.order < 0 || formData.order > 9999) {
        newErrors.order = "L'ordre doit être entre 0 et 9999";
      }
    }

    if (activeTab === "bulk") {
      const hasEmptyRequired = bulkLabels.some(
        (label) => !label.name.trim() || !label.code.trim() || !label.category
      );
      if (hasEmptyRequired) {
        newErrors.bulk =
          "Tous les labels doivent avoir un nom, un code et une catégorie";
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
        const validLabels = bulkLabels.filter(
          (label) => label.name.trim() && label.code.trim() && label.category
        );
        await onBulkSubmit({ labels: validLabels });
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
    field: keyof LabelFormData,
    value: string | number
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updateJsonFromForm(newFormData);

    if (errors[field as keyof LabelFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Gestion des labels multiples
  const handleBulkInputChange = (
    index: number,
    field: keyof LabelFormData,
    value: string | number
  ) => {
    const newBulkLabels = [...bulkLabels];
    newBulkLabels[index] = { ...newBulkLabels[index], [field]: value };
    setBulkLabels(newBulkLabels);
    updateJsonFromBulk(newBulkLabels);
  };

  const addBulkLabel = () => {
    setBulkLabels([
      ...bulkLabels,
      {
        name: "",
        order: 100,
        code: "",
        description: "",
        category: "Quality",
        icon: "",
        color: "",
        priority: 0,
        hotelDetailsId: "",
      },
    ]);
  };

  const removeBulkLabel = (index: number) => {
    if (bulkLabels.length > 1) {
      const newBulkLabels = bulkLabels.filter((_, i) => i !== index);
      setBulkLabels(newBulkLabels);
      updateJsonFromBulk(newBulkLabels);
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
      updateJsonFromBulk(bulkLabels);
    } else if (tab === "form") {
      updateJsonFromForm(formData);
    }
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {label ? "Modifier le label" : "Ajouter des labels"}
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
            disabled={label !== null}
          >
            <Tag className="h-4 w-4" />
            Formulaire
          </button>

          {allowBulk && !label && (
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
              Ajout multiple ({bulkLabels.length})
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
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations de base
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div className="md:col-span-2">
                    <Label htmlFor="name">
                      Nom du label <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Meilleur rapport qualité-prix, Vue mer..."
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
                      placeholder="BEST_VALUE"
                      disabled={isLoading}
                      className={errors.code ? "border-red-500" : ""}
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500 mt-1">{errors.code}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Code unique pour identifier le label
                    </p>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <Label htmlFor="category">
                      Catégorie <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      disabled={isLoading}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    >
                      {LABEL_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Priorité */}
                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange(
                          "priority",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={isLoading}
                      className={errors.priority ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Priorité de 0 à 100 (plus élevé = plus important)
                    </p>
                    {errors.priority && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.priority}
                      </p>
                    )}
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
                  </div>

                  {/* Hotel Details ID */}
                  <div className="md:col-span-2">
                    <Label htmlFor="hotelDetailsId">
                      Hôtel associé (optionnel)
                    </Label>
                    <Input
                      id="hotelDetailsId"
                      value={formData.hotelDetailsId || ""}
                      onChange={(e) =>
                        handleInputChange("hotelDetailsId", e.target.value)
                      }
                      placeholder="ID de l'hôtel à associer (optionnel)"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Laisser vide pour un label global
                    </p>
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
                      placeholder="Description détaillée du label..."
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Apparence */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Apparence
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Icône */}
                  <div>
                    <Label htmlFor="icon">Icône</Label>
                    <select
                      id="icon"
                      value={formData.icon}
                      onChange={(e) =>
                        handleInputChange("icon", e.target.value)
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

                  {/* Couleur */}
                  <div>
                    <Label htmlFor="color">Couleur</Label>
                    <select
                      id="color"
                      value={formData.color}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {LABEL_COLORS.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aperçu */}
                  {(formData.name || formData.color || formData.icon) && (
                    <div className="md:col-span-2">
                      <Label>Aperçu</Label>
                      <div className="mt-2">
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: formData.color || "#E5E7EB",
                            color: formData.color ? "#FFFFFF" : "#374151",
                          }}
                        >
                          {formData.icon && (
                            <span className="text-xs">
                              {COMMON_ICONS.find(
                                (i) => i.value === formData.icon
                              )?.label?.split(" ")[0] || "🏷️"}
                            </span>
                          )}
                          {formData.name || "Nom du label"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ✅ Onglet Ajout multiple */}
          {activeTab === "bulk" && allowBulk && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ajout de plusieurs labels
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBulkLabel}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un label
                </Button>
              </div>

              {errors.bulk && (
                <p className="text-sm text-red-500">{errors.bulk}</p>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bulkLabels.map((label, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Label #{index + 1}</h4>
                      {bulkLabels.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBulkLabel(index)}
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
                          value={label.name}
                          onChange={(e) =>
                            handleBulkInputChange(index, "name", e.target.value)
                          }
                          placeholder="Nom du label"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Code *</Label>
                        <Input
                          value={label.code}
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
                        <Label>Catégorie *</Label>
                        <select
                          value={label.category}
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
                          {LABEL_CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Priorité</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={label.priority}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "priority",
                              parseInt(e.target.value) || 0
                            )
                          }
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label>Couleur</Label>
                        <select
                          value={label.color}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "color",
                              e.target.value
                            )
                          }
                          disabled={isLoading}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {LABEL_COLORS.map((color) => (
                            <option key={color.value} value={color.value}>
                              {color.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Icône</Label>
                        <select
                          value={label.icon}
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

                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={label.description}
                          onChange={(e) =>
                            handleBulkInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description du label..."
                          disabled={isLoading}
                          rows={2}
                        />
                      </div>

                      {/* Aperçu pour chaque label */}
                      {(label.name || label.color) && (
                        <div className="md:col-span-2">
                          <Label>Aperçu</Label>
                          <div className="mt-1">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: label.color || "#E5E7EB",
                                color: label.color ? "#FFFFFF" : "#374151",
                              }}
                            >
                              {label.icon && (
                                <span>
                                  {COMMON_ICONS.find(
                                    (i) => i.value === label.icon
                                  )?.label?.split(" ")[0] || "🏷️"}
                                </span>
                              )}
                              {label.name || "Sans nom"}
                            </span>
                          </div>
                        </div>
                      )}
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
                  {jsonData.includes('"labels"')
                    ? 'Format JSON pour plusieurs labels : { "labels": [...] }'
                    : 'Format JSON pour un label : { "name": "...", "code": "...", ... }'}
                </p>
              </div>

              {/* ✅ Aperçu des données */}
              {isJsonValid && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Aperçu des données
                  </h4>
                  {jsonData.includes('"labels"') ? (
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Nombre de labels:</strong> {bulkLabels.length}
                      </div>
                      {bulkLabels.slice(0, 3).map((label, index) => (
                        <div
                          key={index}
                          className="ml-4 flex items-center gap-2"
                        >
                          <strong>#{index + 1}:</strong>
                          {label.name || "Sans nom"} (
                          {label.code || "Pas de code"})
                          {label.color && (
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: label.color }}
                            />
                          )}
                        </div>
                      ))}
                      {bulkLabels.length > 3 && (
                        <div className="ml-4 text-gray-500">
                          ... et {bulkLabels.length - 3} autres
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <strong>Nom:</strong> {formData.name || "Non défini"}
                        {formData.color && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: formData.color }}
                          />
                        )}
                      </div>
                      <div>
                        <strong>Code:</strong> {formData.code || "Non défini"}
                      </div>
                      <div>
                        <strong>Catégorie:</strong> {formData.category}
                      </div>
                      <div>
                        <strong>Priorité:</strong> {formData.priority}
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
                    bulkLabels.filter(
                      (l) => l.name.trim() && l.code.trim() && l.category
                    ).length
                  } labels`
                : label
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
