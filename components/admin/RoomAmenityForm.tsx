"use client";

import React, { useState, useEffect } from "react";
import { X, Bed, Home, Hash, AlertCircle } from "lucide-react";

interface RoomAmenity {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  description?: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    HotelDetails: number;
    HotelDetailsToRoomAmenity: number;
  };
}

interface RoomAmenityFormProps {
  amenity?: RoomAmenity | null;
  onSubmit: (data: Partial<RoomAmenity>) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  name: string;
  category: string;
  icon: string;
  description: string;
  order: number;
}

interface FormErrors {
  name?: string;
  category?: string;
  icon?: string;
  description?: string;
  order?: string;
  general?: string;
}

const AMENITY_CATEGORIES = [
  { value: "Comfort", label: "Confort" },
  { value: "Technology", label: "Technologie" },
  { value: "Entertainment", label: "Divertissement" },
  { value: "Bathroom", label: "Salle de bain" },
  { value: "Kitchen", label: "Cuisine" },
  { value: "Bedroom", label: "Chambre" },
  { value: "Safety", label: "Sécurité" },
  { value: "Accessibility", label: "Accessibilité" },
  { value: "Climate", label: "Climatisation" },
  { value: "Storage", label: "Rangement" },
];

const COMMON_ICONS = [
  { value: "", label: "Aucune icône" },
  { value: "bed", label: "🛏️ Lit" },
  { value: "tv", label: "📺 Télévision" },
  { value: "wifi", label: "📶 WiFi" },
  { value: "ac", label: "❄️ Climatisation" },
  { value: "shower", label: "🚿 Douche" },
  { value: "bath", label: "🛁 Baignoire" },
  { value: "kitchen", label: "🍳 Cuisine" },
  { value: "fridge", label: "🧊 Réfrigérateur" },
  { value: "safe", label: "🔒 Coffre-fort" },
  { value: "phone", label: "📞 Téléphone" },
  { value: "desk", label: "🖥️ Bureau" },
  { value: "chair", label: "🪑 Chaise" },
  { value: "closet", label: "👗 Placard" },
  { value: "balcony", label: "🏞️ Balcon" },
  { value: "window", label: "🪟 Fenêtre" },
  { value: "mirror", label: "🪞 Miroir" },
  { value: "towels", label: "🏊 Serviettes" },
  { value: "coffee", label: "☕ Machine à café" },
  { value: "minibar", label: "🍾 Minibar" },
  { value: "iron", label: "👔 Fer à repasser" },
];

export default function RoomAmenityForm({
  amenity,
  onSubmit,
  onClose,
}: RoomAmenityFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "Comfort",
    icon: "",
    description: "",
    order: 100,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données de l'équipement en édition
  useEffect(() => {
    if (amenity) {
      setFormData({
        name: amenity.name || "",
        category: amenity.category || "Comfort",
        icon: amenity.icon || "",
        description: amenity.description || "",
        order: amenity.order || 100,
      });
    } else {
      setFormData({
        name: "",
        category: "Comfort",
        icon: "",
        description: "",
        order: 100,
      });
    }
    setErrors({});
  }, [amenity]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "Le nom doit faire moins de 255 caractères";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.category) {
      newErrors.category = "La catégorie est requise";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description =
        "La description doit faire moins de 1000 caractères";
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

      const submitData: Partial<RoomAmenity> = {
        name: formData.name.trim(),
        category: formData.category,
        icon: formData.icon.trim() || null,
        description: formData.description.trim() || null,
        order: formData.order,
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
    const hasChanges = amenity
      ? formData.name !== (amenity.name || "") ||
        formData.category !== (amenity.category || "Comfort") ||
        formData.icon !== (amenity.icon || "") ||
        formData.description !== (amenity.description || "") ||
        formData.order !== (amenity.order || 100)
      : formData.name.trim() !== "" ||
        formData.category !== "Comfort" ||
        formData.icon.trim() !== "" ||
        formData.description.trim() !== "" ||
        formData.order !== 100;

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
    return icon ? icon.label.split(" ")[0] : "🏠";
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bed className="h-6 w-6 text-blue-600" />
            {amenity ? "Modifier l'équipement" : "Nouvel équipement de chambre"}
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
            {/* Nom */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom de l&apos;équipement *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={255}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Ex: Télévision écran plat, Climatisation..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/255 caractères
              </p>
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Home className="h-4 w-4" />
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
                {AMENITY_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Ordre */}
            <div>
              <label
                htmlFor="order"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Hash className="h-4 w-4" />
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
                placeholder="Description détaillée de l'équipement..."
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

          {/* Informations additionnelles en mode édition */}
          {amenity && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Informations
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">ID:</span> {amenity.id}
                </div>
                {amenity._count && (
                  <div>
                    <span className="font-medium">Utilisations:</span>{" "}
                    {amenity._count.HotelDetails +
                      amenity._count.HotelDetailsToRoomAmenity}{" "}
                    hôtel(s)
                  </div>
                )}
                {amenity.createdAt && (
                  <div>
                    <span className="font-medium">Créé le:</span>{" "}
                    {new Date(amenity.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
                {amenity.updatedAt && (
                  <div>
                    <span className="font-medium">Modifié le:</span>{" "}
                    {new Date(amenity.updatedAt).toLocaleDateString("fr-FR")}
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
              disabled={isSubmitting || !formData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {amenity ? "Modification..." : "Création..."}
                </>
              ) : (
                <>{amenity ? "Modifier l'équipement" : "Créer l'équipement"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
