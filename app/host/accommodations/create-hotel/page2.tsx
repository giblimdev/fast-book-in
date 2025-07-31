//@//app/host/accomodations/create-hotel
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useHotelStore } from "@/store/useHotelStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Settings,
  Bed,
  Zap,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import HotelCardPreview from "@/components/host/HotelCardPreview";
import HotelBasicInfo from "@/components/host/HotelBasicInfo";
import HotelAdress from "@/components/host/HotelAdress";
import HotelGallery from "@/components/host/HotelGallery";
import HotelDetails from "@/components/host/HotelDetails";
import HotelFeatures from "@/components/host/HotelFeatures";
import HotelRoomTypes from "@/components/host/HotelRoomTypes";
import HotelRoomFeatures from "@/components/host/HotelRoomFeatures";
import RoomGallery from "@/components/host/RoomGallery";

export default function CreateHotelPage() {
  const router = useRouter();
  const {
    isEditing,
    hotelCardData,
    addressData,
    hotelDetailsData,
    hotelFeaturesData,
    roomTypes,
    roomFeaturesData,
    galleryImages,
    isStepComplete,
    getStepErrors,
    getAllData,
    clearSelectedHotel,
  } = useHotelStore();

  const stepStatus = (step: number) => {
    const complete = isStepComplete(step);
    const errors = getStepErrors(step);
    return {
      status: complete ? "complete" : errors.length > 0 ? "error" : "pending",
      color: complete
        ? "text-green-600"
        : errors.length > 0
        ? "text-red-600"
        : "text-gray-400",
    };
  };

  const renderField = (label: string, value: any) => (
    <div className="flex justify-between bg-gray-50 p-3 rounded mb-2">
      <span className="font-medium">{label}</span>
      <span className="text-gray-600 truncate max-w-xs">
        {value ?? "Non défini"}
      </span>
    </div>
  );

  const onSave = async () => {
    const requiredSteps = [1, 2, 3, 4, 6, 7];
    const missing = requiredSteps.filter((step) => !isStepComplete(step));
    if (missing.length) {
      toast.error(`Veuillez compléter les étapes: ${missing.join(", ")}`);
      return;
    }

    try {
      const payload = getAllData();
      const res = await fetch("/api/hotels/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Hôtel créé avec succès !");
        clearSelectedHotel();
        router.push("/host/accommodations");
      } else {
        const err = await res.json();
        toast.error(err.message ?? "Erreur lors de la création.");
      }
    } catch (error) {
      toast.error("Erreur serveur, veuillez réessayer plus tard.");
    }
  };

  const onBack = () => router.push("/host/accommodations");

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-1" /> Retour
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
        </h1>
        <Button size="lg" onClick={onSave}>
          {isEditing ? "Mettre à jour" : "Créer"}
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["step-1"]}
        className="space-y-4"
      >
        {/* Step 1 - Hotel Card */}
        <AccordionItem value="step-1" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Building2
                className={`${stepStatus(1).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">
                  Étape 1: Informations générales
                </div>
                <div className="text-sm text-gray-500">
                  Nom, ville, description, prix...
                </div>
                <div>
                  HotelBasicInfo.tsx verifie si un hotel est present dans le
                  store si oui affiche modifier ou ajouter des informations à
                  "hotel present dans le store" oui/non. si non creer un hotel
                  oui/non (si non retour a host/dashboard) (Informations
                  générales — nom, ville, étoiles, prix, description courte,
                  partenaire, devise, etc.)
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'hôtel</CardTitle>
              </CardHeader>
              <CardContent>
                {renderField("Nom", hotelCardData.name)}
                {renderField("Ville (ID)", hotelCardData.idCity)}
                {renderField("Ordre", hotelCardData.order ?? 20)}
                {renderField(
                  "Description courte",
                  hotelCardData.shortDescription
                )}
                {renderField("Étoiles", hotelCardData.starRating)}
                {renderField("Prix par nuit", hotelCardData.basePricePerNight)}
                {renderField("Devise", hotelCardData.currency ?? "EUR")}
                {renderField(
                  "Partenaire",
                  hotelCardData.isPartner ? "Oui" : "Non"
                )}
                <p className="text-sm italic text-gray-500 mt-2">
                  Note : une image GalleryImage associée doit être créée et son
                  ID lié dans le store.
                </p>
                <HotelBasicInfo />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 2 - Address */}
        <AccordionItem value="step-2" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <MapPin
                className={`${stepStatus(2).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">Étape 2: Adresse</div>
                <div className="text-sm text-gray-500">
                  Détails de l'adresse
                </div>
                <div>
                  HotelAdress.tsx verifie si un hotel est present dans le store
                  si oui creer ou met a jours l'adresse.
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Adresse de l'hôtel</CardTitle>
              </CardHeader>
              <CardContent>
                {renderField("Nom (optionnel)", addressData.name)}
                {renderField("Numéro", addressData.streetNumber)}
                {renderField("Type de rue", addressData.streetType)}
                {renderField("Nom de rue", addressData.streetName)}
                {renderField("Complément", addressData.addressLine2)}
                {renderField("Code postal", addressData.postalCode)}
                {renderField("Id ville", addressData.cityId)}
                {renderField(
                  "Quartier (optionnel)",
                  addressData.neighborhoodId
                )}
                {renderField("Latitude", addressData.latitude)}
                {renderField("Longitude", addressData.longitude)}
                <HotelAdress />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 3 - Hotel Images */}
        <AccordionItem value="step-3" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Camera
                className={`${stepStatus(3).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">
                  Étape 3: Galerie d'images de l'hôtel
                </div>
                <div className="text-sm text-gray-500">
                  Images générales de l'hôtel
                </div>
                <div>
                  HotelGallery.tsx (Galerie photo d'une chambre — upload,
                  gestion des images de l’hôtel et des chambres) HotelAddress
                  (Adresse détaillée — rue, numéro, ville, quartiers,
                  coordonnées GPS, etc.)
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Galerie d'images de l'hôtel</CardTitle>
              </CardHeader>
              <CardContent>
                {renderField("Nombre d'images", galleryImages.length)}
                <HotelGallery />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 4 - Hotel Details */}
        <AccordionItem value="step-4" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Settings
                className={`${stepStatus(4).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">Étape 4: Détails</div>
                <div className="text-sm text-gray-500">
                  Description, horaires, langues
                </div>
                <div>
                  HotelDetails.tsx (Détails spécifiques — description complète,
                  horaires, nombre de chambres, langues, etc.)
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Détails et caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                {renderField("Description", hotelDetailsData.description)}
                {renderField("Check-in", hotelDetailsData.checkInTime)}
                {renderField("Check-out", hotelDetailsData.checkOutTime)}
                {renderField("Nombre chambres", hotelDetailsData.numberOfRooms)}
                {renderField("Nombre étages", hotelDetailsData.numberOfFloors)}
                {renderField(
                  "Langues parlées",
                  hotelDetailsData.languages?.length
                )}
                <HotelDetails />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 5 - Hotel Features */}
        <AccordionItem value="step-6" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Zap
                className={`${stepStatus(6).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">
                  Étape 5: Équipements et options hôtel
                </div>
                <div className="text-sm text-gray-500">
                  Labels, accessibilité, équipements, points forts
                </div>
                <div>
                  HotelFeatures (Équipements et options liées à l’hôtel —
                  labels, accessibilité, équipements, points forts)
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Équipements et options liées à l’hôtel</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Labels sélectionnés : {hotelFeaturesData.labels?.length ?? 0}
                </p>
                <p>
                  Accessibilité :{" "}
                  {hotelFeaturesData.accessibilityOptions?.length ?? 0}
                </p>
                <p>Équipements : {hotelFeaturesData.amenities?.length ?? 0}</p>
                <p>
                  Points forts : {hotelFeaturesData.highlights?.length ?? 0}
                </p>
                <HotelFeatures />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 6 - Room Types */}
        <AccordionItem value="step-5" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Bed
                className={`${stepStatus(5).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">Étape 6: Types de chambres</div>
                <div className="text-sm text-gray-500">
                  Gestion des Types de chambres
                </div>
                HotelRoomTypes (Gestion des types de chambres — création,
                modification, suppression des chambres)
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Types de chambres</CardTitle>
              </CardHeader>
              <CardContent>
                {renderField("Nombre de types", roomTypes.length)}
                <HotelRoomTypes />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 7 - Room Features */}
        <AccordionItem value="step-6" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Zap
                className={`${stepStatus(6).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">
                  Étape 7: Équipements chambres
                </div>
                <div className="text-sm text-gray-500">
                  Gestion des équipements
                </div>
                HotelRoomFeatures.tsx (Équipements des chambres — services et
                équipements spécifiques par type de chambre)
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Équipements des chambres</CardTitle>
              </CardHeader>
              <CardContent>
                {renderField(
                  "Nombre équipements",
                  roomFeaturesData.selectedAmenities?.length ?? 0
                )}
                <HotelRoomFeatures />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Step 8 - Room Type Images */}
        <AccordionItem value="step-7" className="border rounded">
          <AccordionTrigger className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Camera
                className={`${stepStatus(7).color} bg-gray-100 p-1 rounded`}
              />
              <div>
                <div className="font-semibold">
                  Étape 8: Images des types de chambres
                </div>
                <div className="text-sm text-gray-500">
                  Gérer les images associées à chaque type de chambre
                </div>
                <div>
                  (Galerie photo d'une chambre — upload, gestion des images de
                  l’hôtel et des chambres)
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Images des types de chambres</CardTitle>
              </CardHeader>
              <CardContent>
                {roomTypes.length === 0 && <p>Aucun type de chambre défini.</p>}
                {roomTypes.map((room) => (
                  <div key={room.id} className="mb-4">
                    <h3 className="font-semibold">{room.name}</h3>
                    <p>Nombre d'images: {room.images?.length ?? 0}</p>
                    <RoomGallery />
                  </div>
                ))}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div>
        <HotelCardPreview />
      </div>
    </div>
  );
}

/*






model HotelCard {
 
  HotelCard.starRating          Int?
  HotelCard.overallRating       Float?
  HotelCard.ratingAdjective     String?
  HotelCard.reviewCount         Int            @default(0)
  HotelCard.basePricePerNight   Float
  HotelCard.regularPrice        Float?
  HotelCard.currency            String         @default("EUR")
  HotelCard.promoMessage        String?
  HotelCard.imageMessage        String?
  HotelCard.cancellationPolicy  String?
  HotelCard.accommodationTypeId String?
  HotelCard.destinationId       String?
  HotelCard.hotelGroupId        String?

  hotelParkingId         String?
  parking             HotelParking?  @relation(fields: [hotelParkingId], references: [id])
  images              GalleryImage[]
  HotelAmenity                   HotelAmenity[]
  detailsId                      String?
  accommodationType              AccommodationType?               @relation(fields: [accommodationTypeId], references: [id], onDelete: SetNull)
  destination                    Destination?                     @relation(fields: [destinationId], references: [id], onDelete: SetNull)
  hotelGroup                     HotelGroup?                      @relation(fields: [hotelGroupId], references: [id], onDelete: SetNull)
  HotelCardToHotelHighlight      HotelCardToHotelHighlight[]
  HotelCardToLabel               HotelCardToLabel[]
  HotelCardToAccessibilityOption HotelCardToAccessibilityOption[]
  HotelCardToHotelAmenity        HotelCardToHotelAmenity[]
  HotelFAQ HotelFAQ[]
  HotelPolicy HotelPolicy[]
  HotelRoomType HotelRoomType[]
  HotelReview HotelReview[]
  UserWishList UserWishList[]
  HotelierDashboard HostDashboard[]
  HotelDetails HotelDetails[]
  TravelerRecommendation TravelerRecommendation[]
}

model HotelDetails {
  id             String   @id @default(uuid())
  idHotelCard    String
  description    String?
  addressId      String
  order          Int?     @default(20)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  checkInTime    String? // "15:00"
  checkOutTime   String? // "11:00" 
  numberOfRooms  Int? // Nombre total de chambres
  numberOfFloors Int? // Nombre d'étages
  languages      String[] // Langues parlées à la réception

  address Address @relation(fields: [addressId], references: [id], onDelete: Cascade)

  RoomAmenity               RoomAmenity[]
  Label                     Label[]
  HotelCard                 HotelCard?                  @relation(fields: [HotelCardid], references: [id])
  HotelCardid               String?
  HotelDetailsToRoomAmenity HotelDetailsToRoomAmenity[]
  room                      HotelRoom[]

  @@map("hotel_details")
}

model HotelRoomType {
  id            String         @id @default(uuid())
  hotelCardId   String
  name          String
  description   String?
  images        GalleryImage[]
  maxGuests     Int
  bedCount      Int
  bedType       String
  roomSize      Float? // en m²
  pricePerNight Float
  currency      String         @default("EUR")
  isAvailable   Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  hotelCard          HotelCard            @relation(fields: [hotelCardId], references: [id])
  CancellationPolicy CancellationPolicy[]
  RoomUnavailability RoomUnavailability[]

  @@map("hotel_rooms")
}

model HotelRoom {
  id String @id @default(uuid())

  slug String?

  reservations Reservation[]
  availability CalendarAvailability[] // Nouveau modèle pour gérer les disponibilités joursp ar jours

  HotelDetails       HotelDetails?        @relation(fields: [hotelDetailsId], references: [id])
  hotelDetailsId     String?
  RoomUnavailability RoomUnavailability[]
}
*/
