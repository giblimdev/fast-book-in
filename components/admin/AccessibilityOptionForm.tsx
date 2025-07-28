"use client";

import React, { useState, useEffect } from "react";
import { X, Accessibility, Shield, Hash, AlertCircle } from "lucide-react";

interface AccessibilityOption {
  id: string;
  name: string;
  code: string;
  category: string;
  description?: string | null;
  icon?: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    HotelCardToAccessibilityOption: number;
  };
}

interface AccessibilityOptionFormProps {
  option?: AccessibilityOption | null;
  onSubmit: (data: Partial<AccessibilityOption>) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  name: string;
  code: string;
  category: string;
  description: string;
  icon: string;
  order: number;
}

interface FormErrors {
  name?: string;
  code?: string;
  category?: string;
  description?: string;
  icon?: string;
  order?: string;
  general?: string;
}

const ACCESSIBILITY_CATEGORIES = [
  { value: "Mobility", label: "Mobilité" },
  { value: "Visual", label: "Visuel" },
  { value: "Hearing", label: "Auditif" },
  { value: "Cognitive", label: "Cognitif" },
  { value: "Physical", label: "Physique" },
  { value: "Communication", label: "Communication" },
  { value: "General", label: "Général" },
];

const COMMON_ICONS = [
  { value: "", label: "Aucune icône" },
  { value: "wheelchair", label: "♿ Fauteuil roulant" },
  { value: "blind", label: "🦯 Canne blanche" },
  { value: "deaf", label: "🦻 Appareil auditif" },
  { value: "hearing", label: "👂 Ouïe" },
  { value: "visual", label: "👁️ Vision" },
  { value: "cognitive", label: "🧠 Cognitif" },
  { value: "mobility", label: "🚶 Mobilité" },
  { value: "elevator", label: "🛗 Ascenseur" },
  { value: "ramp", label: "🛤️ Rampe" },
  { value: "braille", label: "⠃ Braille" },
  { value: "sign", label: "🤟 Langue des signes" },
  { value: "assistance", label: "🤝 Assistance" },
  { value: "guide", label: "🦮 Chien guide" },
  { value: "parking", label: "🅿️ Parking" },
  { value: "bathroom", label: "🚿 Salle de bain" },
  { value: "phone", label: "📞 Téléphone" },
];

export default function AccessibilityOptionForm({
  option,
  onSubmit,
  onClose,
}: AccessibilityOptionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    category: "General",
    description: "",
    icon: "",
    order: 100,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données de l'option en édition
  useEffect(() => {
    if (option) {
      setFormData({
        name: option.name || "",
        code: option.code || "",
        category: option.category || "General",
        description: option.description || "",
        icon: option.icon || "",
        order: option.order || 100,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        category: "General",
        description: "",
        icon: "",
        order: 100,
      });
    }
    setErrors({});
  }, [option]);

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

    if (!formData.code.trim()) {
      newErrors.code = "Le code est requis";
    } else if (!/^[A-Z0-9_]{1,50}$/.test(formData.code.trim().toUpperCase())) {
      newErrors.code =
        "Le code doit contenir entre 1 et 50 caractères (lettres majuscules, chiffres, underscore uniquement)";
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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const upperValue = value.toUpperCase();
    setFormData((prev) => ({ ...prev, code: upperValue }));

    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: undefined }));
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

      const submitData: Partial<AccessibilityOption> = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        category: formData.category,
        description: formData.description.trim() || null,
        icon: formData.icon.trim() || null,
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
    const hasChanges = option
      ? formData.name !== (option.name || "") ||
        formData.code !== (option.code || "") ||
        formData.category !== (option.category || "General") ||
        formData.description !== (option.description || "") ||
        formData.icon !== (option.icon || "") ||
        formData.order !== (option.order || 100)
      : formData.name.trim() !== "" ||
        formData.code.trim() !== "" ||
        formData.category !== "General" ||
        formData.description.trim() !== "" ||
        formData.icon.trim() !== "" ||
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
    return icon ? icon.label.split(" ")[0] : "♿";
  };

  return (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Accessibility className="h-6 w-6 text-blue-600" />
            {option ? "Modifier l'option" : "Nouvelle option d'accessibilité"}
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
                Nom de l&apos;option *
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
                placeholder="Ex: Accès fauteuil roulant, Audio description..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/255 caractères
              </p>
            </div>

            {/* Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Code unique *
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleCodeChange}
                required
                maxLength={50}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 font-mono ${
                  errors.code
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="WHEELCHAIR_ACCESS"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Code unique pour identifier l&apos;option (maj. auto)
              </p>
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="category"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Shield className="h-4 w-4" />
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
                {ACCESSIBILITY_CATEGORIES.map((category) => (
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
                placeholder="Description détaillée de l'option d'accessibilité..."
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
          {(formData.name || formData.icon) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Aperçu</h4>
              <div className="flex items-center gap-2">
                {formData.icon && (
                  <span className="text-xl">{getIconEmoji(formData.icon)}</span>
                )}
                <span className="font-medium">
                  {formData.name || "Nom de l'option"}
                </span>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {formData.code || "CODE"}
                </span>
              </div>
              {formData.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.description}
                </p>
              )}
            </div>
          )}

          {/* Informations additionnelles en mode édition */}
          {option && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Informations
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">ID:</span> {option.id}
                </div>
                {option._count && (
                  <div>
                    <span className="font-medium">Utilisations:</span>{" "}
                    {option._count.HotelCardToAccessibilityOption} hôtel(s)
                  </div>
                )}
                {option.createdAt && (
                  <div>
                    <span className="font-medium">Créé le:</span>{" "}
                    {new Date(option.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
                {option.updatedAt && (
                  <div>
                    <span className="font-medium">Modifié le:</span>{" "}
                    {new Date(option.updatedAt).toLocaleDateString("fr-FR")}
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
                isSubmitting || !formData.name.trim() || !formData.code.trim()
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {option ? "Modification..." : "Création..."}
                </>
              ) : (
                <>{option ? "Modifier l'option" : "Créer l'option"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
