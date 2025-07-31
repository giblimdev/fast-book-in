//@/app/host/accomodations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Bed,
  Star,
  MessageSquare, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useHotelStore } from "@/store/useHotelStore";

interface HotelCard {
  id: string;
  name: string;
  idCity: string;
  order: number;
  shortDescription?: string;
  starRating: number;
  overallRating?: number;
  ratingAdjective?: string;
  reviewCount: number;
  basePricePerNight: number;
  regularPrice?: number;
  currency: string;
  isPartner: boolean;
  promoMessage?: string;
  imageMessage?: string;
  cancellationPolicy?: string;
  accommodationTypeId?: string;
  destinationId?: string;
  hotelGroupId?: string;
  latitude?: number;
  longitude?: number;
  hotelParkingId?: string;
  images?: Array<{
    id: string;
    imageCategories: string;
    order: number;
    alt: string | null;
    image: Array<{
      id: string;
      slug: string | null;
      description: string | null;
      path: string | null;
    }>;
  }>;
  HotelDetails?: Array<{
    id: string;
    description: string | null;
  }>;
  HotelRoomType?: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
}

interface HotelDetails {
  id: string;
  idHotelCard: string;
  description: string | null;
  addressId: string;
  order: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  numberOfRooms: number | null;
  numberOfFloors: number | null;
  languages: string[];
}

export default function AccommodationsPage() {
  const router = useRouter();
  const { setSelectedHotel, clearSelectedHotel } = useHotelStore();

  const [hotelCards, setHotelCards] = useState<HotelCard[]>([]);
  const [selectedHotel, setSelectedHotelLocal] = useState<HotelCard | null>(
    null
  );
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);

  // États de chargement
  const [loading, setLoading] = useState(true);

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState("");

  // Statistiques
  const totalHotels = hotelCards.length;
  const totalRooms = hotelCards.reduce(
    (sum, hotel) => sum + (hotel.HotelRoomType?.length || 0), 
    0
  );
  const averageRating =
    hotelCards.length > 0
      ? hotelCards.reduce((sum, hotel) => sum + (hotel.overallRating || 0), 0) /
        hotelCards.length
      : 0;

  // Charger les hôtels
  const fetchHotelCards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hotel-card?include=true");
      if (response.ok) {
        const data = await response.json();
        setHotelCards(data);
      } else {
        toast.error("Erreur lors du chargement des hôtels");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des hôtels");
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails d'un hôtel
  const fetchHotelDetails = async (hotelCardId: string) => {
    try {
      const response = await fetch(
        `/api/hotel-detail?idHotelCard=${hotelCardId}&include=true`
      );
      if (response.ok) {
        const data = await response.json();
        setHotelDetails(data[0] || null);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
    }
  };

  // Supprimer un hôtel
  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet hôtel ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/hotel-card/${hotelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Hôtel supprimé avec succès");
        await fetchHotelCards();
        if (selectedHotel?.id === hotelId) {
          setSelectedHotelLocal(null);
          clearSelectedHotel();
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    }
  };

  // Gérer la sélection d'un hôtel
  const handleSelectHotel = (hotel: HotelCard) => {
    setSelectedHotelLocal(hotel);
    // Mettre à jour le store global
    setSelectedHotel({
      id: hotel.id,
      name: hotel.name,
      idCity: hotel.idCity,
      order: hotel.order,
      shortDescription: hotel.shortDescription || null,
      starRating: hotel.starRating,
      overallRating: hotel.overallRating || null,
      ratingAdjective: hotel.ratingAdjective || null,
      reviewCount: hotel.reviewCount,
      basePricePerNight: hotel.basePricePerNight,
      regularPrice: hotel.regularPrice || null,
      currency: hotel.currency,
      isPartner: hotel.isPartner,
      promoMessage: hotel.promoMessage || null,
      imageMessage: hotel.imageMessage || null,
      cancellationPolicy: hotel.cancellationPolicy || null,
      accommodationTypeId: hotel.accommodationTypeId || null,
      destinationId: hotel.destinationId || null,
      hotelGroupId: hotel.hotelGroupId || null,
      hotelParkingId: hotel.hotelParkingId || null,
    });
  };

  // Naviguer vers la page d'édition
  const handleEditHotel = (hotel: HotelCard) => {
    // Mettre l'hôtel dans le store pour l'édition
    setSelectedHotel({
      id: hotel.id,
      name: hotel.name,
      idCity: hotel.idCity,
      order: hotel.order,
      shortDescription: hotel.shortDescription || null,
      starRating: hotel.starRating,
      overallRating: hotel.overallRating || null,
      ratingAdjective: hotel.ratingAdjective || null,
      reviewCount: hotel.reviewCount,
      basePricePerNight: hotel.basePricePerNight,
      regularPrice: hotel.regularPrice || null,
      currency: hotel.currency,
      isPartner: hotel.isPartner,
      promoMessage: hotel.promoMessage || null,
      imageMessage: hotel.imageMessage || null,
      cancellationPolicy: hotel.cancellationPolicy || null,
      accommodationTypeId: hotel.accommodationTypeId || null,
      destinationId: hotel.destinationId || null,
      hotelGroupId: hotel.hotelGroupId || null,
      hotelParkingId: hotel.hotelParkingId || null,
    });

    // Naviguer vers la page de création/édition
    router.push("/host/accommodations/create-hotel");
  };

  // Naviguer vers la page de création d'un nouvel hôtel
  const handleCreateHotel = () => {
    // Vider le store pour une nouvelle création
    clearSelectedHotel();
    // Naviguer vers la page de création
    router.push("/host/accommodations/create-hotel");
  };

  // Filtrer les hôtels
  const filteredHotels = hotelCards.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchHotelCards();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchHotelDetails(selectedHotel.id);
    }
  }, [selectedHotel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement de vos hébergements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Hébergements</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos établissements et visualisez vos performances
          </p>
        </div>
        <Button onClick={handleCreateHotel}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Hôtel
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Hôtels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalHotels}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bed className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Chambres
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Note Moyenne
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avis Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hotelCards.reduce(
                    (sum, hotel) => sum + hotel.reviewCount,
                    0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <Input
          placeholder="Rechercher un hébergement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des hôtels */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Vos Établissements</h2>

          {filteredHotels.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun hébergement trouvé</p>
                <p className="text-sm text-gray-400 mt-2">
                  Commencez par créer votre premier hôtel
                </p>
                <Button
                  onClick={handleCreateHotel}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un hôtel
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredHotels.map((hotel) => (
              <Card
                key={hotel.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedHotel?.id === hotel.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleSelectHotel(hotel)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditHotel(hotel);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHotel(hotel.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    {[...Array(hotel.starRating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {hotel.overallRating?.toFixed(1) || "N/A"} (
                      {hotel.reviewCount} avis)
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {hotel.shortDescription || "Aucune description"}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-green-600">
                      €{hotel.basePricePerNight}/nuit
                    </span>
                    {hotel.isPartner && (
                      <Badge variant="secondary">Partenaire</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Détails de l'hôtel sélectionné */}
        <div className="lg:col-span-2">
          {selectedHotel ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedHotel.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditHotel(selectedHotel)}
                        variant="default"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Gérer l'hôtel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Informations générales
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Étoiles:</span>{" "}
                          {selectedHotel.starRating}
                        </p>
                        <p>
                          <span className="font-medium">Note:</span>{" "}
                          {selectedHotel.overallRating?.toFixed(1) || "N/A"}/5
                        </p>
                        <p>
                          <span className="font-medium">Avis:</span>{" "}
                          {selectedHotel.reviewCount}
                        </p>
                        <p>
                          <span className="font-medium">Prix:</span> €
                          {selectedHotel.basePricePerNight}/nuit
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Statut</h4>
                      <div className="space-y-2">
                        {selectedHotel.isPartner && (
                          <Badge variant="secondary">Hôtel Partenaire</Badge>
                        )}
                        {selectedHotel.promoMessage && (
                          <Badge variant="outline">Promotion Active</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Aperçu des détails de l'hôtel */}
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu de l'établissement</CardTitle>
                </CardHeader>
                <CardContent>
                  {hotelDetails ? (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Description:</span>{" "}
                        {hotelDetails.description ||
                          "Aucune description détaillée"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Check-in:</span>{" "}
                        {hotelDetails.checkInTime || "Non défini"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Check-out:</span>{" "}
                        {hotelDetails.checkOutTime || "Non défini"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Chambres:</span>{" "}
                        {hotelDetails.numberOfRooms || "Non spécifié"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Étages:</span>{" "}
                        {hotelDetails.numberOfFloors || "Non spécifié"}
                      </p>
                      {hotelDetails.languages.length > 0 && (
                        <p className="text-sm">
                          <span className="font-medium">Langues:</span>{" "}
                          {hotelDetails.languages.join(", ")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">
                        Aucun détail configuré
                      </p>
                      <Button
                        onClick={() => handleEditHotel(selectedHotel)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Configurer les détails
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Types de chambres */}
              <Card>
                <CardHeader>
                  <CardTitle>Types de Chambres</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedHotel.HotelRoomType &&
                  selectedHotel.HotelRoomType.length > 0 ? (
                    <div className="space-y-2">
                      {selectedHotel.HotelRoomType.map((roomType) => (
                        <div
                          key={roomType.id}
                          className="p-3 border rounded-lg"
                        >
                          <h5 className="font-medium">{roomType.name}</h5>
                          <p className="text-sm text-gray-600">
                            {roomType.description || "Aucune description"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">
                        Aucun type de chambre configuré
                      </p>
                      <Button
                        onClick={() => handleEditHotel(selectedHotel)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Ajouter des chambres
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Galerie d'Images</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedHotel.images && selectedHotel.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedHotel.images.slice(0, 6).map((galleryImage) => (
                        <div
                          key={galleryImage.id}
                          className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img
                            src={
                              galleryImage.image[0]?.path || "/placeholder.jpg"
                            }
                            alt={galleryImage.alt || "Image de l'hôtel"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        Aucune image ajoutée
                      </p>
                      <Button
                        onClick={() => handleEditHotel(selectedHotel)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Ajouter des images
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Sélectionnez un hôtel dans la liste pour voir ses détails
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Ou créez votre premier établissement pour commencer
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
