"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Car,
  Hash,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";

interface HotelParking {
  id: string;
  name: string; // Obligatoire selon le schéma
  isAvailable: boolean;
  spaces?: number | null;
  notes?: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    HotelCard: number;
  };
}

interface HotelParkingFormProps {
  parking?: HotelParking | null;
  onSubmit: (data: Partial<HotelParking>) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  name: string;
  isAvailable: boolean;
  spaces: number | null;
  notes: string;
  order: number;
}

interface FormErrors {
  name?: string;
  isAvailable?: string;
  spaces?: string;
  notes?: string;
  order?: string;
  general?: string;
}

export default function HotelParkingForm({
  parking,
  onSubmit,
  onClose,
}: HotelParkingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    isAvailable: true,
    spaces: null,
    notes: "",
    order: 100,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données du parking en édition
  useEffect(() => {
    if (parking) {
      setFormData({
        name: parking.name || "",
        isAvailable: parking.isAvailable,
        spaces: parking.spaces || null,
        notes: parking.notes || "",
        order: parking.order || 100,
      });
    } else {
      setFormData({
        name: "",
        isAvailable: true,
        spaces: null,
        notes: "",
        order: 100,
      });
    }
    setErrors({});
  }, [parking]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Le nom est maintenant obligatoire selon le schéma
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "Le nom doit faire moins de 255 caractères";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (
      formData.spaces !== null &&
      (isNaN(formData.spaces) || formData.spaces < 0 || formData.spaces > 10000)
    ) {
      newErrors.spaces = "Le nombre de places doit être entre 0 et 10000";
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = "Les notes doivent faire moins de 1000 caractères";
    }

    if (isNaN(formData.order) || formData.order < 0 || formData.order > 9999) {
      newErrors.order = "L'ordre doit être un nombre entre 0 et 9999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    const numValue = value === "" ? null : parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numValue!) ? null : numValue,
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

      const submitData: Partial<HotelParking> = {
        name: formData.name.trim(), // Obligatoire maintenant
        isAvailable: formData.isAvailable,
        spaces: formData.spaces,
        notes: formData.notes.trim() || null,
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
    const hasChanges = parking
      ? formData.name !== (parking.name || "") ||
        formData.isAvailable !== parking.isAvailable ||
        formData.spaces !== parking.spaces ||
        formData.notes !== (parking.notes || "") ||
        formData.order !== (parking.order || 100)
      : formData.name.trim() !== "" ||
        formData.isAvailable !== true ||
        formData.spaces !== null ||
        formData.notes.trim() !== "" ||
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Car className="h-6 w-6 text-blue-600" />
            {parking ? "Modifier le parking" : "Nouvelle option de parking"}
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
            {/* Nom - Maintenant obligatoire */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Building className="h-4 w-4" />
                Nom du parking *
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
                placeholder="Ex: Parking principal, Parking souterrain..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/255 caractères • Obligatoire
              </p>
            </div>

            {/* Disponibilité */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isAvailable"
                  className="ml-2 text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  {formData.isAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  Parking disponible
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Cochez si le parking est disponible pour les clients
              </p>
            </div>

            {/* Nombre de places */}
            <div>
              <label
                htmlFor="spaces"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
              >
                <Car className="h-4 w-4" />
                Nombre de places
              </label>
              <input
                type="number"
                id="spaces"
                name="spaces"
                min="0"
                max="10000"
                value={formData.spaces || ""}
                onChange={handleNumberChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 ${
                  errors.spaces
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Ex: 50"
              />
              {errors.spaces && (
                <p className="mt-1 text-sm text-red-600">{errors.spaces}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Laisser vide si non spécifié
              </p>
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

            {/* Notes */}
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                maxLength={1000}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 resize-none ${
                  errors.notes
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Informations supplémentaires sur le parking..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.notes.length}/1000 caractères
              </p>
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Aperçu</h4>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-gray-600" />
              <span className="font-medium">
                {formData.name || "Nom du parking"}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {formData.isAvailable ? "Disponible" : "Non disponible"}
              </span>
              {formData.spaces && (
                <span className="text-sm text-gray-600">
                  • {formData.spaces} places
                </span>
              )}
            </div>
            {formData.notes && (
              <p className="text-sm text-gray-600 mt-1">{formData.notes}</p>
            )}
          </div>

          {/* Informations additionnelles en mode édition */}
          {parking && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Informations
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">ID:</span> {parking.id}
                </div>
                {parking._count && (
                  <div>
                    <span className="font-medium">Utilisations:</span>{" "}
                    {parking._count.HotelCard} hôtel(s)
                  </div>
                )}
                {parking.createdAt && (
                  <div>
                    <span className="font-medium">Créé le:</span>{" "}
                    {new Date(parking.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                )}
                {parking.updatedAt && (
                  <div>
                    <span className="font-medium">Modifié le:</span>{" "}
                    {new Date(parking.updatedAt).toLocaleDateString("fr-FR")}
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
                  {parking ? "Modification..." : "Création..."}
                </>
              ) : (
                <>{parking ? "Modifier le parking" : "Créer le parking"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
