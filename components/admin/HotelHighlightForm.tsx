"use client";

import React, { useState, useEffect } from "react";
import { X, Star, Building2, Hash, AlertCircle, Sparkles } from "lucide-react";

interface HotelHighlight {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  icon?: string | null;
  priority: number;
  order: number;
  isPromoted: boolean;
  hotelId: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    HotelCardToHotelHighlight: number;
  };
}

interface HotelHighlightFormProps {
  highlight?: HotelHighlight | null;
  onSubmit: (data: Partial<HotelHighlight>) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  icon: string;
  priority: number;
  order: number;
  isPromoted: boolean;
  hotelId: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  icon?: string;
  priority?: string;
  order?: string;
  hotelId?: string;
  general?: string;
}

const HIGHLIGHT_CATEGORIES = [
  { value: "Location", label: "Emplacement" },
  { value: "Amenity", label: "Équipement" },
  { value: "Service", label: "Service" },
  { value: "View", label: "Vue" },
  { value: "Offer", label: "Offre" },
  { value: "Food", label: "Restauration" },
];

const COMMON_ICONS = [
  { value: "", label: "Aucune icône" },
  { value: "star", label: "⭐ Étoile" },
  { value: "award", label: "🏆 Récompense" },
  { value: "crown", label: "👑 Couronne" },
  { value: "fire", label: "🔥 Populaire" },
  { value: "sparkles", label: "✨ Spécial" },
  { value: "heart", label: "❤️ Favori" },
  { value: "check", label: "✅ Validé" },
  { value: "diamond", label: "💎 Premium" },
  { value: "location", label: "📍 Emplacement" },
  { value: "food", label: "🍽️ Restaurant" },
  { value: "service", label: "🛎️ Service" },
  { value: "view", label: "🌅 Vue" },
  { value: "offer", label: "🎁 Offre" },
];

export default function HotelHighlightForm({
  highlight,
  onSubmit,
  onClose,
}: HotelHighlightFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "Location",
    icon: "",
    priority: 0,
    order: 100,
    isPromoted: false,
    hotelId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données du highlight en édition
  useEffect(() => {
    if (highlight) {
      setFormData({
        title: highlight.title || "",
        description: highlight.description || "",
        category: highlight.category || "Location",
        icon: highlight.icon || "",
        priority: highlight.priority || 0,
        order: highlight.order || 100,
        isPromoted: highlight.isPromoted || false,
        hotelId: highlight.hotelId || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Location",
        icon: "",
        priority: 0,
        order: 100,
        isPromoted: false,
        hotelId: "",
      });
    }
    setErrors({});
  }, [highlight]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.trim().length > 255) {
      newErrors.title = "Le titre doit faire moins de 255 caractères";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Le titre doit contenir au moins 2 caractères";
    }

    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
    }

    if (!formData.hotelId.trim()) {
      newErrors.hotelId = "L'ID de l'hôtel est requis";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description =
        "La description doit faire moins de 1000 caractères";
    }

    if (
      isNaN(formData.priority) ||
      formData.priority < 0 ||
      formData.priority > 100
    ) {
      newErrors.priority = "La priorité doit être un nombre entre 0 et 100";
    }

    if (isNaN(formData.order) || formData.order < 0 || formData.order > 9999) {
      newErrors.order = "L'ordre doit être un nombre entre 0 et 9999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setErrors({});

      const submitData: Partial<HotelHighlight> = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        icon: formData.icon.trim() || null,
        priority: formData.priority,
        order: formData.order,
        isPromoted: formData.isPromoted,
        hotelId: formData.hotelId.trim(),
      };

      await onSubmit(submitData);
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);

      if (error.response?.data?.error) {
        const serverError = error.response.data;
        if (serverError.field) {
          setErrors((prev) => ({
            ...prev,
            [serverError.field]: serverError.error,
          }));
        } else {
          setErrors((prev) => ({ ...prev, general: serverError.error }));
        }
      } else if (error.message) {
        setErrors((prev) => ({ ...prev, general: error.message }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Une erreur est survenue lors de l'enregistrement",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    const hasChanges = highlight
      ? formData.title !== (highlight.title || "") ||
        formData.description !== (highlight.description || "") ||
        formData.category !== (highlight.category || "Location") ||
        formData.icon !== (highlight.icon || "") ||
        formData.priority !== (highlight.priority || 0) ||
        formData.order !== (highlight.order || 100) ||
        formData.isPromoted !== (highlight.isPromoted || false) ||
        formData.hotelId !== (highlight.hotelId || "")
      : formData.title.trim() !== "" ||
        formData.description.trim() !== "" ||
        formData.category !== "Location" ||
        formData.icon.trim() !== "" ||
        formData.priority !== 0 ||
        formData.order !== 100 ||
        formData.isPromoted !== false ||
        formData.hotelId.trim() !== "";

    if (
      hasChanges &&
      !window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous vraiment fermer ?"
      )
    ) {
      return;
    }

    onClose();
  };

  // Obtenir l'icône emoji
  const getIconEmoji = (iconName: string) => {
    const icon = COMMON_ICONS.find((i) => i.value === iconName);
    return icon ? icon.label.split(" ")[0] : "⭐";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-blue-600" />
            {highlight ? "Modifier le highlight" : "Nouveau highlight d'hôtel"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message d'erreur général */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <p className="text-sm text-red-700 mt-1">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Titre du highlight *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={255}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.title
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Ex: Vue mer exceptionnelle, Piscine à débordement..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/255 caractères
              </p>
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Building2 className="h-4 w-4" />
                Catégorie *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.category
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              >
                {HIGHLIGHT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* ID Hôtel */}
            <div>
              <label
                htmlFor="hotelId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID de l&apos;hôtel *
              </label>
              <input
                type="text"
                id="hotelId"
                name="hotelId"
                value={formData.hotelId}
                onChange={handleInputChange}
                required
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.hotelId
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="ID de l'hôtel associé"
              />
              {errors.hotelId && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelId}</p>
              )}
            </div>

            {/* Priorité */}
            <div>
              <label
                htmlFor="priority"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Hash className="h-4 w-4" />
                Priorité
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                min="0"
                max="100"
                value={formData.priority}
                onChange={handleNumberChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.priority
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                0-100 (plus élevé = plus important)
              </p>
            </div>

            {/* Ordre */}
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                id="order"
                name="order"
                min="0"
                max="9999"
                value={formData.order}
                onChange={handleNumberChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.order
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Plus faible = affiché en premier (défaut: 100)
              </p>
            </div>

            {/* Icône */}
            <div className="md:col-span-2">
              <label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Icône
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.icon
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              >
                {COMMON_ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
              {formData.icon && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Aperçu:</span>
                  <span className="text-lg">{getIconEmoji(formData.icon)}</span>
                </div>
              )}
            </div>

            {/* Statut promu */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPromoted"
                  name="isPromoted"
                  checked={formData.isPromoted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPromoted"
                  className="ml-2 text-sm text-gray-700 flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Highlight promu (mis en avant)
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Les highlights promus sont affichés en priorité
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                maxLength={1000}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 resize-none ${
                  errors.description
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Description détaillée du highlight..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/1000 caractères
              </p>
            </div>
          </div>

          {/* Aperçu */}
          {(formData.title || formData.icon) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Aperçu</h4>
              <div className="flex items-center gap-2">
                {formData.icon && (
                  <span className="text-xl">{getIconEmoji(formData.icon)}</span>
                )}
                <span className="font-medium">
                  {formData.title || "Titre du highlight"}
                </span>
                {formData.isPromoted && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Promu
                  </span>
                )}
              </div>
              {formData.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.description}
                </p>
              )}
            </div>
          )}

          {/* Informations additionnelles en mode édition */}
          {highlight && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Informations
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">ID:</span> {highlight.id}
                </div>
                {highlight._count && (
                  <div>
                    <span className="font-medium">Utilisations:</span>{" "}
                    {highlight._count.HotelCardToHotelHighlight}
                  </div>
                )}
                {highlight.createdAt && (
                  <div>
                    <span className="font-medium">Créé le:</span>{" "}
                    {new Date(highlight.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
                {highlight.updatedAt && (
                  <div>
                    <span className="font-medium">Modifié le:</span>{" "}
                    {new Date(highlight.updatedAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.title.trim() ||
                !formData.hotelId.trim()
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {highlight ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  {highlight ? "Modifier le highlight" : "Créer le highlight"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
