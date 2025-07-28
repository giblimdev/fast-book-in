// @/app/host/accommodations/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Hotel,
  Building,
  Users,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Camera,
  Home,
  Bed,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import HotelCardForm from "@/components/host/HotelCardForm";
import HotelDetailsForm from "@/components/host/HotelDetailsForm";
import AddressForm from "@/components/host/AddressForm";
import ImageGalleryManager from "@/components/host/ImageGalleryManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types selon votre schéma Prisma
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
  hotelParkingId?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  accommodationType?: {
    id: string;
    name: string;
    code: string;
  };
  destination?: {
    id: string;
    name: string;
  };
  hotelGroup?: {
    id: string;
    name: string;
  };
  parking?: {
    id: string;
    name: string;
    isAvailable: boolean;
  };
  images: GalleryImage[];
  HotelDetails: HotelDetail[];
  HotelRoomType: HotelRoomType[];
  _count: {
    HotelReview: number;
    UserWishList: number;
    HotelDetails: number;
    HotelRoomType: number;
  };
}

interface HotelDetail {
  id: string;
  idHotelCard: string;
  description?: string;
  addressId: string;
  order: number;
  checkInTime?: string;
  checkOutTime?: string;
  numberOfRooms?: number;
  numberOfFloors?: number;
  languages: string[];
  createdAt: string;
  updatedAt: string;

  address: Address;
}

interface Address {
  id: string;
  name?: string;
  streetNumber?: string;
  streetType?: string;
  streetName: string;
  addressLine2?: string;
  postalCode: string;
  cityId: string;
  neighborhoodId?: string;
  createdAt: string;
  updatedAt: string;

  city: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
      code: string;
    };
  };
}

interface GalleryImage {
  id: string;
  imageCategories: string;
  order: number;
  alt?: string;
  hotelCardId?: string;
  createdAt: string;
  updatedAt: string;

  image?: {
    id: string;
    slug?: string;
    description?: string;
    path?: string;
  };
}

interface HotelRoomType {
  id: string;
  hotelCardId: string;
  name: string;
  description?: string;
  maxGuests: number;
  bedCount: number;
  bedType: string;
  roomSize?: number;
  pricePerNight: number;
  currency: string;
  isAvailable: boolean;
}

export default function HostAccommodationsPage() {
  // États principaux
  const [hotelCards, setHotelCards] = useState<HotelCard[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États des modales
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelCard | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // États de recherche et filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Chargement des données
  const fetchHotelCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hotel-card?includeAll=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.data && Array.isArray(result.data)) {
        setHotelCards(result.data);
      } else {
        throw new Error("Format de données invalide");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      console.error("Erreur lors du chargement des hôtels:", err);
      setHotelCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelCards();
  }, []);

  // Gestion des actions CRUD
  const handleCreateHotel = async (data: any) => {
    setFormLoading(true);
    try {
      const response = await fetch("/api/hotel-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      await fetchHotelCards();
      setShowHotelForm(false);
      setEditingHotel(null);
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateHotel = async (data: any) => {
    if (!editingHotel) return;

    setFormLoading(true);
    try {
      const response = await fetch(`/api/hotel-card/${editingHotel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      await fetchHotelCards();
      setShowHotelForm(false);
      setEditingHotel(null);
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteHotel = async (hotel: HotelCard) => {
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer l'hôtel "${hotel.name}" ?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/hotel-card/${hotel.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      await fetchHotelCards();
      if (selectedHotel?.id === hotel.id) {
        setSelectedHotel(null);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert(
        `Erreur lors de la suppression: ${
          err instanceof Error ? err.message : "Erreur inconnue"
        }`
      );
    }
  };

  // Filtrage des hôtels
  const filteredHotels = hotelCards.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const totalHotels = hotelCards.length;
  const totalRooms = hotelCards.reduce(
    (sum, hotel) => sum + (hotel._count.HotelDetails || 0),
    0
  );
  const averageRating =
    hotelCards.length > 0
      ? hotelCards.reduce((sum, hotel) => sum + (hotel.overallRating || 0), 0) /
        hotelCards.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hotel className="h-8 w-8 text-blue-600" />
                  </div>
                  Mes Hébergements
                </h1>
                <p className="mt-2 text-gray-600">
                  Gérez vos établissements, chambres et réservations
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setEditingHotel(null);
                    setShowHotelForm(true);
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvel Hébergement
                </Button>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Hôtels</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalHotels}
                      </p>
                    </div>
                    <Hotel className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Chambres</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalRooms}
                      </p>
                    </div>
                    <Bed className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Note Moyenne</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}/5
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avis Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {hotelCards.reduce(
                          (sum, hotel) => sum + hotel.reviewCount,
                          0
                        )}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des hôtels */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Mes Établissements ({filteredHotels.length})
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchHotelCards}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un hôtel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* État de chargement */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Chargement...</span>
                  </div>
                )}

                {/* Gestion des erreurs */}
                {error && (
                  <div className="p-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Liste des hôtels */}
                {!loading && !error && (
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredHotels.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Hotel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun hébergement trouvé</p>
                        <Button
                          onClick={() => {
                            setEditingHotel(null);
                            setShowHotelForm(true);
                          }}
                          className="mt-4"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer le premier
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {filteredHotels.map((hotel) => (
                          <div
                            key={hotel.id}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                              selectedHotel?.id === hotel.id
                                ? "bg-blue-50 border-blue-200"
                                : ""
                            }`}
                            onClick={() => setSelectedHotel(hotel)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {hotel.name}
                                  </h3>
                                  {hotel.isPartner && (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      Partenaire
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    {Array.from(
                                      { length: hotel.starRating },
                                      (_, i) => (
                                        <Star
                                          key={i}
                                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                        />
                                      )
                                    )}
                                  </div>
                                  {hotel.overallRating && (
                                    <span className="flex items-center gap-1">
                                      {hotel.overallRating.toFixed(1)}/5
                                      {hotel.ratingAdjective && (
                                        <span>• {hotel.ratingAdjective}</span>
                                      )}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-600">
                                    {hotel._count.HotelDetails} détail(s) •{" "}
                                    {hotel._count.HotelRoomType} type(s) de
                                    chambre
                                  </div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {hotel.basePricePerNight} {hotel.currency}
                                    /nuit
                                  </div>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingHotel(hotel);
                                      setShowHotelForm(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedHotel(hotel);
                                      setShowDetailsForm(true);
                                    }}
                                  >
                                    <Building className="h-4 w-4 mr-2" />
                                    Détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedHotel(hotel);
                                      setShowImageManager(true);
                                    }}
                                  >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Images
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteHotel(hotel);
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Détails de l'hôtel sélectionné */}
          <div className="lg:col-span-2">
            {selectedHotel ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Hotel className="h-5 w-5" />
                        {selectedHotel.name}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        {selectedHotel.shortDescription || "Aucune description"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowDetailsForm(true);
                        }}
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowImageManager(true);
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Images
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Aperçu</TabsTrigger>
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="rooms">Chambres</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      {/* Informations générales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Informations Générales
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Classification:
                              </span>
                              <div className="flex">
                                {Array.from(
                                  { length: selectedHotel.starRating },
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Prix de base:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel.basePricePerNight}{" "}
                                {selectedHotel.currency}/nuit
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Note moyenne:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel.overallRating?.toFixed(1) ||
                                  "N/A"}
                                /5
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Nombre d'avis:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel.reviewCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Partenaire:</span>
                              <Badge
                                variant={
                                  selectedHotel.isPartner
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {selectedHotel.isPartner ? "Oui" : "Non"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Statistiques
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Détails d'hôtel:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel._count.HotelDetails}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Types de chambres:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel._count.HotelRoomType}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                En liste de souhaits:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel._count.UserWishList}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Avis clients:
                              </span>
                              <span className="font-semibold">
                                {selectedHotel._count.HotelReview}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Messages promotionnels */}
                      {(selectedHotel.promoMessage ||
                        selectedHotel.imageMessage) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Messages Promotionnels
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedHotel.promoMessage && (
                              <div>
                                <span className="text-gray-600">
                                  Message promo:
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                  {selectedHotel.promoMessage}
                                </Badge>
                              </div>
                            )}
                            {selectedHotel.imageMessage && (
                              <div>
                                <span className="text-gray-600">
                                  Message image:
                                </span>
                                <Badge variant="outline" className="ml-2">
                                  {selectedHotel.imageMessage}
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="details">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Détails de l'Hôtel
                          </h3>
                          <Button
                            onClick={() => setShowDetailsForm(true)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter des détails
                          </Button>
                        </div>

                        {selectedHotel.HotelDetails.length === 0 ? (
                          <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                              <Building className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-600 mb-4">
                                Aucun détail configuré
                              </p>
                              <Button
                                onClick={() => setShowDetailsForm(true)}
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter des détails
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="space-y-4">
                            {selectedHotel.HotelDetails.map((detail) => (
                              <Card key={detail.id}>
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-semibold">
                                          Détail #{detail.order}
                                        </h4>
                                        {detail.description && (
                                          <p className="text-gray-600 text-sm mt-1">
                                            {detail.description}
                                          </p>
                                        )}
                                      </div>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      {detail.checkInTime && (
                                        <div>
                                          <span className="text-gray-600">
                                            Check-in:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {detail.checkInTime}
                                          </span>
                                        </div>
                                      )}
                                      {detail.checkOutTime && (
                                        <div>
                                          <span className="text-gray-600">
                                            Check-out:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {detail.checkOutTime}
                                          </span>
                                        </div>
                                      )}
                                      {detail.numberOfRooms && (
                                        <div>
                                          <span className="text-gray-600">
                                            Chambres:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {detail.numberOfRooms}
                                          </span>
                                        </div>
                                      )}
                                      {detail.numberOfFloors && (
                                        <div>
                                          <span className="text-gray-600">
                                            Étages:
                                          </span>
                                          <span className="ml-2 font-medium">
                                            {detail.numberOfFloors}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {detail.languages.length > 0 && (
                                      <div>
                                        <span className="text-gray-600 text-sm">
                                          Langues parlées:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {detail.languages.map((lang) => (
                                            <Badge
                                              key={lang}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {lang}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Adresse */}
                                    <div className="pt-3 border-t">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium">
                                          Adresse
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {detail.address.name && (
                                          <div className="font-medium">
                                            {detail.address.name}
                                          </div>
                                        )}
                                        <div>
                                          {detail.address.streetNumber}{" "}
                                          {detail.address.streetType}{" "}
                                          {detail.address.streetName}
                                        </div>
                                        {detail.address.addressLine2 && (
                                          <div>
                                            {detail.address.addressLine2}
                                          </div>
                                        )}
                                        <div>
                                          {detail.address.postalCode}{" "}
                                          {detail.address.city.name}
                                        </div>
                                        <div>
                                          {detail.address.city.country.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="rooms">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Types de Chambres
                          </h3>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau type
                          </Button>
                        </div>

                        {selectedHotel.HotelRoomType.length === 0 ? (
                          <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                              <Bed className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-600 mb-4">
                                Aucun type de chambre configuré
                              </p>
                              <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Créer le premier type
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid gap-4">
                            {selectedHotel.HotelRoomType.map((roomType) => (
                              <Card key={roomType.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold">
                                          {roomType.name}
                                        </h4>
                                        <Badge
                                          variant={
                                            roomType.isAvailable
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {roomType.isAvailable
                                            ? "Disponible"
                                            : "Indisponible"}
                                        </Badge>
                                      </div>

                                      {roomType.description && (
                                        <p className="text-gray-600 text-sm mb-3">
                                          {roomType.description}
                                        </p>
                                      )}

                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                          <span className="text-gray-600">
                                            Capacité:
                                          </span>
                                          <span className="ml-1 font-medium">
                                            {roomType.maxGuests} pers.
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Lits:
                                          </span>
                                          <span className="ml-1 font-medium">
                                            {roomType.bedCount}{" "}
                                            {roomType.bedType}
                                          </span>
                                        </div>
                                        {roomType.roomSize && (
                                          <div>
                                            <span className="text-gray-600">
                                              Surface:
                                            </span>
                                            <span className="ml-1 font-medium">
                                              {roomType.roomSize} m²
                                            </span>
                                          </div>
                                        )}
                                        <div>
                                          <span className="text-gray-600">
                                            Prix:
                                          </span>
                                          <span className="ml-1 font-medium">
                                            {roomType.pricePerNight}{" "}
                                            {roomType.currency}/nuit
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Modifier
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Camera className="h-4 w-4 mr-2" />
                                          Images
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Supprimer
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="images">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Galerie d'Images
                          </h3>
                          <Button
                            onClick={() => setShowImageManager(true)}
                            size="sm"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Gérer les images
                          </Button>
                        </div>

                        {selectedHotel.images.length === 0 ? (
                          <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                              <Camera className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-600 mb-4">
                                Aucune image ajoutée
                              </p>
                              <Button
                                onClick={() => setShowImageManager(true)}
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter des images
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedHotel.images.map((galleryImage) => (
                              <Card
                                key={galleryImage.id}
                                className="overflow-hidden"
                              >
                                <div className="aspect-square relative bg-gray-100">
                                  {galleryImage.image?.path ? (
                                    <Image
                                      src={galleryImage.image.path}
                                      alt={
                                        galleryImage.alt ||
                                        galleryImage.image.description ||
                                        "Image d'hôtel"
                                      }
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <Camera className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {galleryImage.imageCategories}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-3">
                                  <div className="space-y-1">
                                    {galleryImage.alt && (
                                      <p className="text-sm font-medium truncate">
                                        {galleryImage.alt}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                      <span>Ordre: {galleryImage.order}</span>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            <Edit className="h-3 w-3 mr-2" />
                                            Modifier
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Supprimer
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Hotel className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Sélectionnez un Hébergement
                  </h3>
                  <p className="text-gray-500 text-center">
                    Choisissez un hôtel dans la liste pour voir ses détails et
                    le gérer
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {/* Formulaire Hôtel */}
      <Dialog open={showHotelForm} onOpenChange={setShowHotelForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHotel ? "Modifier l'Hôtel" : "Nouvel Hébergement"}
            </DialogTitle>
          </DialogHeader>
          <HotelCardForm
            hotelCard={editingHotel}
            onSubmit={editingHotel ? handleUpdateHotel : handleCreateHotel}
            onCancel={() => {
              setShowHotelForm(false);
              setEditingHotel(null);
            }}
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Formulaire Détails */}
      <Dialog open={showDetailsForm} onOpenChange={setShowDetailsForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Détails de l'Hôtel - {selectedHotel?.name}
            </DialogTitle>
          </DialogHeader>
          <HotelDetailsForm
            hotelCard={selectedHotel}
            onSubmit={async (data: any) => {
              // Logique de soumission des détails
              console.log("Détails soumis:", data);
              setShowDetailsForm(false);
              await fetchHotelCards();
            }}
            onCancel={() => setShowDetailsForm(false)}
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Gestionnaire d'Images */}
      <Dialog open={showImageManager} onOpenChange={setShowImageManager}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Galerie d'Images - {selectedHotel?.name}</DialogTitle>
          </DialogHeader>
          <ImageGalleryManager
            hotelCard={selectedHotel}
            onClose={() => setShowImageManager(false)}
            onUpdate={async () => {
              await fetchHotelCards();
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Capture d'écran FastBooking
        </h1>

        <div className="relative w-full">
          <Image
            src="/Capture d’écran 2025-07-26 001429.png"
            alt="Capture d'écran FastBooking - Interface de démonstration"
            width={1800}
            height={1200}
            className="rounded-lg border border-gray-200 shadow-sm w-full h-auto"
            priority
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Aperçu de l'interface FastBooking</p>
        </div>
      </div>
    </div>
  );
}
