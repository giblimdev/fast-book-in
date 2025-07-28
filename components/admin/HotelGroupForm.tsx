"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, Globe, Image, Hash, AlertCircle } from "lucide-react";

interface HotelGroup {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    HotelCard: number;
  };
}

interface HotelGroupFormProps {
  group?: HotelGroup | null;
  onSubmit: (data: Partial<HotelGroup>) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  order: number;
}

interface FormErrors {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  order?: string;
  general?: string;
}

export default function HotelGroupForm({
  group,
  onSubmit,
  onClose,
}: HotelGroupFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    website: "",
    logoUrl: "",
    order: 100,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données du groupe en édition
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || "",
        description: group.description || "",
        website: group.website || "",
        logoUrl: group.logoUrl || "",
        order: group.order || 100,
      });
    } else {
      // Réinitialiser le formulaire pour un nouveau groupe
      setFormData({
        name: "",
        description: "",
        website: "",
        logoUrl: "",
        order: 100,
      });
    }
    // Effacer les erreurs lors du changement de groupe
    setErrors({});
  }, [group]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Nom requis selon le schéma (String non-nullable)
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "Le nom doit faire moins de 255 caractères";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    // Description optionnelle mais limitée (String? nullable dans le schéma)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description =
        "La description doit faire moins de 1000 caractères";
    }

    // Validation URL site web (String? nullable dans le schéma)
    if (formData.website && formData.website.trim()) {
      if (!isValidUrl(formData.website.trim())) {
        newErrors.website = "L'URL du site web n'est pas valide";
      } else if (formData.website.trim().length > 500) {
        newErrors.website = "L'URL du site web est trop longue";
      }
    }

    // Validation URL logo (String? nullable dans le schéma)
    if (formData.logoUrl && formData.logoUrl.trim()) {
      if (!isValidUrl(formData.logoUrl.trim())) {
        newErrors.logoUrl = "L'URL du logo n'est pas valide";
      } else if (formData.logoUrl.trim().length > 500) {
        newErrors.logoUrl = "L'URL du logo est trop longue";
      }
    }

    // Validation ordre (Int avec défaut 100 dans le schéma)
    if (isNaN(formData.order) || formData.order < 0 || formData.order > 9999) {
      newErrors.order = "L'ordre doit être un nombre entre 0 et 9999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction helper pour valider les URLs
  const isValidUrl = (string: string): boolean => {
    if (!string || string.trim() === "") return false;

    try {
      const url = new URL(string.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Effacer l'erreur du champ modifié
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

      // Préparer les données selon le schéma Prisma
      const submitData: Partial<HotelGroup> = {
        name: formData.name.trim(),
        description: formData.description.trim() || null, // nullable dans le schéma
        website: formData.website.trim() || null, // nullable dans le schéma
        logoUrl: formData.logoUrl.trim() || null, // nullable dans le schéma
        order: formData.order,
      };

      await onSubmit(submitData);
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);

      // Gestion des erreurs spécifiques du serveur
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

  // Fonction pour fermer le modal avec confirmation si des changements non sauvegardés
  const handleClose = () => {
    const hasChanges = group
      ? formData.name !== (group.name || "") ||
        formData.description !== (group.description || "") ||
        formData.website !== (group.website || "") ||
        formData.logoUrl !== (group.logoUrl || "") ||
        formData.order !== (group.order || 100)
      : formData.name.trim() !== "" ||
        formData.description.trim() !== "" ||
        formData.website.trim() !== "" ||
        formData.logoUrl.trim() !== "" ||
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

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            {group ? "Modifier le groupe" : "Nouveau groupe d'hôtels"}
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
            {/* Nom - Champ requis selon le schéma */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom du groupe *
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
                placeholder="Ex: Marriott International, Accor Group..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/255 caractères
              </p>
            </div>

            {/* Site Web - Champ optionnel selon le schéma */}
            <div>
              <label
                htmlFor="website"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Globe className="h-4 w-4" />
                Site Web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                maxLength={500}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.website
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="https://www.example.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Ordre - Champ avec valeur par défaut selon le schéma */}
            <div>
              <label
                htmlFor="order"
                className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
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

            {/* URL du Logo - Champ optionnel selon le schéma */}
            <div className="md:col-span-2">
              <label
                htmlFor="logoUrl"
                className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Image className="h-4 w-4" />
                URL du Logo
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                maxLength={500}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.logoUrl
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="https://www.example.com/logo.png"
              />
              {errors.logoUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.logoUrl}</p>
              )}
              {formData.logoUrl && isValidUrl(formData.logoUrl) && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-2">Aperçu du logo:</p>
                  <img
                    src={formData.logoUrl}
                    alt="Aperçu du logo"
                    className="h-12 w-auto object-contain border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description - Champ optionnel selon le schéma */}
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
                placeholder="Description du groupe hôtelier, historique, services proposés..."
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
          {group && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Informations
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">ID:</span> {group.id}
                </div>
                {group._count && (
                  <div>
                    <span className="font-medium">Hôtels associés:</span>{" "}
                    {group._count.HotelCard}
                  </div>
                )}
                {group.createdAt && (
                  <div>
                    <span className="font-medium">Créé le:</span>{" "}
                    {new Date(group.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
                {group.updatedAt && (
                  <div>
                    <span className="font-medium">Modifié le:</span>{" "}
                    {new Date(group.updatedAt).toLocaleDateString("fr-FR")}
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
                  {group ? "Modification..." : "Création..."}
                </>
              ) : (
                <>{group ? "Modifier le groupe" : "Créer le groupe"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
