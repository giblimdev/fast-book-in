// app/demo/creation-hotel/page.tsx - Version avec accordéons et navigation par ID
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHotelStore } from "@/store/useHotelStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Settings,
  Bed,
  Zap,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Composants existants
import HotelCardPreview from "@/components/host/HotelCardPreview";
import HotelBasicInfo from "@/components/host/HotelBasicInfo";
import HotelAdress from "@/components/host/HotelAdress";
import HotelDetails from "@/components/host/HotelDetails";
import HotelFeatures from "@/components/host/HotelFeatures";
import HotelRoomTypes from "@/components/host/HotelRoomTypes";
import HotelGallery from "@/components/host/HotelGallery";

export default function CreateHotelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("edit"); // Si on édite un hôtel existant

  const {
    isEditing,
    isCreating,
    isUpdating,
    operationError,
    createHotel,
    updateHotel,
    validateForSave,
    isReadyToSave,
    clearSelectedHotel,
    setOperationError,
    isStepComplete,
    getStepErrors,
  } = useHotelStore();

  const [showPreview, setShowPreview] = useState(false); // Masqué par défaut
  const [openAccordion, setOpenAccordion] = useState(["basic"]); // Première section ouverte

  // Déterminer si on est en mode édition
  const isEditMode = Boolean(hotelId);
  const isProcessing = isCreating || isUpdating;

  useEffect(() => {
    // Nettoyer les erreurs au montage
    setOperationError(null);
  }, [setOperationError]);

  // Configuration des sections avec ID pour navigation
  const sections = [
    {
      id: "basic",
      title: "Informations de base",
      icon: Building2,
      required: true,
      component: <HotelBasicInfo />,
      description: "Nom, étoiles, prix de base",
    },
    {
      id: "address",
      title: "Adresse",
      icon: MapPin,
      required: true,
      component: <HotelAdress />,
      description: "Localisation de votre établissement",
    },
    {
      id: "details",
      title: "Détails de l'établissement",
      icon: Settings,
      required: false,
      component: <HotelDetails />,
      description: "Check-in/out, langues, description",
    },
    {
      id: "rooms",
      title: "Types de chambres",
      icon: Bed,
      required: false,
      component: <HotelRoomTypes />,
      description: "Configuration des chambres",
    },
    {
      id: "features",
      title: "Équipements et services",
      icon: Zap,
      required: false,
      component: <HotelFeatures />,
      description: "Aménagements et services proposés",
    },
    {
      id: "gallery",
      title: "Galerie d'images",
      icon: Camera,
      required: false,
      component: <HotelGallery />,
      description: "Photos de votre établissement",
    },
  ];

  // Fonction pour obtenir le statut d'une section
  const getSectionStatus = (sectionId: string, index: number) => {
    const stepNumber = index + 1;
    const complete = isStepComplete(stepNumber);
    const errors = getStepErrors(stepNumber);

    return {
      complete,
      hasErrors: errors.length > 0,
      errors,
      status: complete ? "complete" : errors.length > 0 ? "error" : "pending",
    };
  };

  // Fonction pour faire défiler vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Ouvrir l'accordéon de cette section
      if (!openAccordion.includes(sectionId)) {
        setOpenAccordion([...openAccordion, sectionId]);
      }
    }
  };

  // Gestion de la sauvegarde
  const handleSaveHotel = async () => {
    try {
      // Validation avant sauvegarde
      const validation = validateForSave();
      if (!validation.isValid) {
        toast.error(`Erreurs de validation: ${validation.errors.join(", ")}`);
        return;
      }

      let result;
      if (isEditMode && hotelId) {
        result = await updateHotel(hotelId);
      } else {
        result = await createHotel();
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/demo/manage-hotels");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(errorMessage);
    }
  };

  // Gestion de la navigation
  const handleBackToManage = () => {
    if (isProcessing) {
      toast.warning("Opération en cours, veuillez patienter...");
      return;
    }
    router.push("/demo/manage-hotels");
  };

  const handleClearAndRestart = () => {
    if (isProcessing) {
      toast.warning("Opération en cours, veuillez patienter...");
      return;
    }
    clearSelectedHotel();
    toast.info("Données effacées, vous pouvez recommencer");
  };

  // Validation en temps réel
  const validation = validateForSave();
  const canSave = isReadyToSave() && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToManage}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à la gestion</span>
              </Button>

              <div className="h-6 w-px bg-gray-300" />

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
                </h1>
                <p className="text-sm text-gray-500">
                  {isEditMode
                    ? "Mettez à jour les informations de votre établissement"
                    : "Ajoutez votre établissement à la plateforme"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Toggle Preview */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{showPreview ? "Masquer aperçu" : "Voir aperçu"}</span>
              </Button>

              {/* Clear Button */}
              {!isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAndRestart}
                  disabled={isProcessing}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  Recommencer
                </Button>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSaveHotel}
                disabled={!canSave}
                size="lg"
                className={`min-w-[140px] ${
                  canSave
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isCreating ? "Création..." : "Mise à jour..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? "Mettre à jour" : "Créer l'hôtel"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      {!validation.isValid && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Données incomplètes :</strong>
              <ul className="mt-2 list-disc list-inside text-sm">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Warnings */}
      {validation.isValid &&
        validation.warnings &&
        validation.warnings.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Recommandations :</strong>
                <ul className="mt-2 list-disc list-inside text-sm">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

      {/* Operation Error */}
      {operationError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Erreur :</strong> {operationError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Success Status */}
      {validation.isValid && !operationError && !isProcessing && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Prêt à sauvegarder !</strong> Toutes les informations
              requises sont complètes.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Navigation rapide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>Navigation rapide</span>
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {sections.map((section, index) => {
                  const status = getSectionStatus(section.id, index);
                  const Icon = section.icon;

                  return (
                    <Button
                      key={section.id}
                      variant="outline"
                      size="sm"
                      onClick={() => scrollToSection(section.id)}
                      className={`flex flex-col items-center p-3 h-auto ${
                        status.complete
                          ? "border-green-500 bg-green-50 text-green-700"
                          : status.hasErrors
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <Icon className="w-4 h-4" />
                        {section.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                        {status.complete && (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        )}
                        {status.hasErrors && (
                          <AlertCircle className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-center">
                        {section.title}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Formulaires avec accordéons */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'établissement</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                value={openAccordion}
                onValueChange={setOpenAccordion}
                className="space-y-4"
              >
                {sections.map((section, index) => {
                  const status = getSectionStatus(section.id, index);
                  const Icon = section.icon;

                  return (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      id={section.id}
                      className={`border rounded-lg ${
                        status.complete
                          ? "border-green-500 bg-green-50"
                          : status.hasErrors
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`w-5 h-5 ${
                                status.complete
                                  ? "text-green-600"
                                  : status.hasErrors
                                  ? "text-red-600"
                                  : "text-gray-500"
                              }`}
                            />
                            <div className="text-left">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">
                                  {section.title}
                                </h3>
                                {section.required && (
                                  <span className="text-red-500 text-sm">
                                    *
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                {section.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {status.complete && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {status.hasErrors && (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                status.complete
                                  ? "bg-green-100 text-green-800"
                                  : status.hasErrors
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {status.complete
                                ? "Complété"
                                : status.hasErrors
                                ? "À corriger"
                                : "En attente"}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {status.hasErrors && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <ul className="list-disc list-inside text-sm">
                                {status.errors.map((error, errorIndex) => (
                                  <li key={errorIndex}>{error}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                        {section.component}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>

          {/* Prévisualisation à la fin */}
          {showPreview && (
            <Card id="preview">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Aperçu de votre hôtel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HotelCardPreview />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Action Button (mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          onClick={handleSaveHotel}
          disabled={!canSave}
          size="lg"
          className={`rounded-full h-14 w-14 shadow-lg ${
            canSave
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Save className="w-6 h-6" />
          )}
        </Button>
        <div className="m-3">
          <HotelCardPreview />
        </div>
      </div>
    </div>
  );
}
