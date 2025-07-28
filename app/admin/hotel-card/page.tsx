// @/app/admin/hotel-cards/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HotelCardForm from "@/components/admin/HotelCardForm";
import HotelCardFilter from "@/components/admin/HotelCardFilter";
import ConfirmDelete, {
  useConfirmDelete,
} from "@/components/helper/ConfirmDelete";

// ✅ Types unifiés - exactement alignés avec le formulaire et l'API
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
  detailsId?: string;
  createdAt: string;
  updatedAt: string;
  city?: {
    id: string;
    name: string;
    country?: {
      id: string;
      name: string;
      code: string;
    };
  };
}

// ✅ Interface pour les données du formulaire - EXACTEMENT alignée avec le formulaire
interface HotelCardFormData {
  name: string;
  idCity: string;
  order: number;
  shortDescription?: string; // ✅ CHANGÉ: optionnel comme dans le formulaire
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
}

// ✅ Interface pour la réponse de l'API
interface ApiResponse {
  data: HotelCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HotelCardsPage() {
  // États principaux
  const [hotelCards, setHotelCards] = useState<HotelCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // État pour la pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  // États pour les données auxiliaires
  const [availableCities, setAvailableCities] = useState<
    Array<{ id: string; name: string; country?: { name: string } }>
  >([]);
  const [availableCountries, setAvailableCountries] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // États pour les modales
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelCard | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Hook personnalisé pour la suppression
  const deleteConfirm = useConfirmDelete();

  // ✅ Chargement des données
  const fetchHotelCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hotel-card", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      // Vérification de la structure de la réponse
      if (!result || typeof result !== "object") {
        throw new Error("Réponse invalide du serveur");
      }

      // Si c'est une erreur du serveur
      if ("error" in result) {
        throw new Error((result as any).error);
      }

      // Vérifier que data existe et est un tableau
      if (!result.data || !Array.isArray(result.data)) {
        console.error("Les données reçues ne sont pas un tableau:", result);
        throw new Error("Format de données invalide reçu du serveur");
      }

      // Utiliser result.data
      setHotelCards(result.data);
      setPagination(
        result.pagination || {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 0,
        }
      );

      // Extraire les villes et pays uniques pour les filtres
      const cities = result.data
        .filter((hotel) => hotel.city)
        .map((hotel) => ({
          id: hotel.city!.id,
          name: hotel.city!.name,
          country: hotel.city!.country,
        }))
        .filter(
          (city, index, self) =>
            index === self.findIndex((c) => c.id === city.id)
        );

      const countries = cities
        .filter((city) => city.country)
        .map((city) => city.country!)
        .filter(
          (country, index, self) =>
            index === self.findIndex((c) => c.id === country.id)
        );

      setAvailableCities(cities);
      setAvailableCountries(countries);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      console.error("Erreur lors du chargement des hôtels:", err);
      setHotelCards([]);
      setPagination({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchHotelCards();
  }, [fetchHotelCards]);

  // ✅ Fonction pour créer un hôtel avec gestion des types
  const handleCreateHotel = async (data: HotelCardFormData) => {
    console.log("🔄 [PAGE] Création d'hôtel avec données:", data);

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
        throw new Error(
          errorData.error || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const newHotel = await response.json();
      console.log("✅ [PAGE] Hôtel créé avec succès:", newHotel);

      await fetchHotelCards();
      setShowForm(false);
      setEditingHotel(null);
    } catch (err) {
      console.error("❌ [PAGE] Erreur lors de la création:", err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ Fonction pour modifier un hôtel
  const handleUpdateHotel = async (data: HotelCardFormData) => {
    if (!editingHotel) return;

    console.log("🔄 [PAGE] Modification d'hôtel avec données:", data);

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
        throw new Error(
          errorData.error || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const updatedHotel = await response.json();
      console.log("✅ [PAGE] Hôtel modifié avec succès:", updatedHotel);

      await fetchHotelCards();
      setEditingHotel(null);
      setShowForm(false);
    } catch (err) {
      console.error("❌ [PAGE] Erreur lors de la modification:", err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  // Fonction pour supprimer un hôtel
  const handleDeleteHotel = async (hotel: HotelCard) => {
    const response = await fetch(`/api/hotel-card/${hotel.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Erreur ${response.status}: ${response.statusText}`
      );
    }

    await fetchHotelCards();
  };

  // Filtrage des hôtels
  const filteredHotels = Array.isArray(hotelCards)
    ? hotelCards.filter((hotel) => {
        const matchesSearch =
          !searchTerm ||
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.city?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.city?.country?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          if (!value) return true;

          switch (key) {
            case "starRating":
              return hotel.starRating.toString() === value;
            case "isPartner":
              return hotel.isPartner.toString() === value;
            case "currency":
              return hotel.currency === value;
            case "city":
              return hotel.city?.id === value;
            case "country":
              return hotel.city?.country?.id === value;
            default:
              return true;
          }
        });

        return matchesSearch && matchesFilters;
      })
    : [];

  // Gestion des filtres
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({});
  };

  // Gestion des modales
  const openCreateForm = () => {
    setEditingHotel(null);
    setShowForm(true);
  };

  const openEditForm = (hotel: HotelCard) => {
    setEditingHotel(hotel);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingHotel(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Hotel className="h-6 w-6" />
                Gestion des Hôtels
              </CardTitle>
              <p className="text-muted-foreground">
                Gérez votre inventaire d'hébergements
              </p>
              {/* Affichage des statistiques de pagination */}
              <div className="text-sm text-muted-foreground mt-1">
                {pagination.total > 0 && (
                  <span>
                    {pagination.total} hôtel{pagination.total > 1 ? "s" : ""} au
                    total
                  </span>
                )}
              </div>
            </div>
            <Button onClick={openCreateForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un hôtel
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Composant de filtres */}
      <HotelCardFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        availableCities={availableCities}
        availableCountries={availableCountries}
        totalCount={hotelCards.length}
        filteredCount={filteredHotels.length}
      />

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{hotelCards.length}</div>
              <div className="text-sm text-muted-foreground">Total hôtels</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {hotelCards.filter((h) => h.isPartner).length}
              </div>
              <div className="text-sm text-muted-foreground">Partenaires</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{filteredHotels.length}</div>
              <div className="text-sm text-muted-foreground">Filtrés</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {hotelCards.length > 0
                  ? (
                      hotelCards.reduce((sum, h) => sum + h.starRating, 0) /
                      hotelCards.length
                    ).toFixed(1)
                  : "0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Étoiles moyennes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des hôtels */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filteredHotels.length} hôtel
              {filteredHotels.length > 1 ? "s" : ""}{" "}
              {searchTerm || Object.keys(filters).some((k) => filters[k])
                ? "trouvé"
                : "enregistré"}
              {filteredHotels.length > 1 ? "s" : ""}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHotelCards}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* État de chargement */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Chargement des hôtels...</span>
            </div>
          )}

          {/* Gestion des erreurs */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Erreur: {error}</span>
                <Button variant="outline" size="sm" onClick={fetchHotelCards}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Liste des hôtels */}
          {!loading && !error && (
            <>
              {filteredHotels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Hotel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">
                    {searchTerm || Object.keys(filters).some((k) => filters[k])
                      ? "Aucun hôtel ne correspond à vos critères de recherche."
                      : "Commencez par ajouter votre premier hôtel."}
                  </p>
                  {!searchTerm &&
                    !Object.keys(filters).some((k) => filters[k]) && (
                      <Button onClick={openCreateForm} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un hôtel
                      </Button>
                    )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredHotels.map((hotel) => (
                    <Card
                      key={hotel.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          {/* Informations principales */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold">
                                    {hotel.name}
                                  </h3>
                                  {hotel.isPartner && (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      Partenaire
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {hotel.city ? (
                                      <span>
                                        {hotel.city.name}
                                        {hotel.city.country && (
                                          <span>
                                            , {hotel.city.country.name}
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-red-500">
                                        Ville non trouvée (ID: {hotel.idCity})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {Array.from(
                                      { length: hotel.starRating },
                                      (_, i) => (
                                        <Star
                                          key={i}
                                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                        />
                                      )
                                    )}
                                    <span>({hotel.starRating})</span>
                                  </div>
                                  {hotel.overallRating && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">
                                        {hotel.overallRating}/5
                                      </span>
                                      {hotel.ratingAdjective && (
                                        <span>• {hotel.ratingAdjective}</span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {hotel.shortDescription && (
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {hotel.shortDescription.length > 150
                                      ? `${hotel.shortDescription.substring(
                                          0,
                                          150
                                        )}...`
                                      : hotel.shortDescription}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 text-sm">
                                  <div className="font-semibold">
                                    {hotel.basePricePerNight} {hotel.currency}
                                    /nuit
                                  </div>
                                  {hotel.reviewCount > 0 && (
                                    <div className="text-muted-foreground">
                                      {hotel.reviewCount} avis
                                    </div>
                                  )}
                                  <div className="text-muted-foreground">
                                    Ordre: {hotel.order}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Messages promotionnels */}
                            {(hotel.promoMessage || hotel.imageMessage) && (
                              <div className="flex gap-2">
                                {hotel.promoMessage && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    🏷️ {hotel.promoMessage}
                                  </Badge>
                                )}
                                {hotel.imageMessage && (
                                  <Badge variant="outline" className="text-xs">
                                    📸 {hotel.imageMessage}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(hotel)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteConfirm.openDialog(hotel)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de formulaire */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHotel ? "Modifier l'hôtel" : "Ajouter un nouvel hôtel"}
            </DialogTitle>
          </DialogHeader>
          <HotelCardForm
            hotelCard={editingHotel}
            onSubmit={editingHotel ? handleUpdateHotel : handleCreateHotel}
            onCancel={closeForm}
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Composant de confirmation de suppression */}
      <ConfirmDelete
        isOpen={deleteConfirm.isOpen}
        onClose={deleteConfirm.closeDialog}
        onConfirm={() => deleteConfirm.confirm(handleDeleteHotel)}
        title="Supprimer l'hôtel"
        itemName={deleteConfirm.itemToDelete?.name}
        isLoading={deleteConfirm.isLoading}
        description={
          <>
            Êtes-vous sûr de vouloir supprimer l'hôtel{" "}
            <strong>{deleteConfirm.itemToDelete?.name}</strong> ?<br />
            Cette action supprimera également :
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Toutes les réservations associées</li>
              <li>Les avis et commentaires</li>
              <li>Les images et données liées</li>
            </ul>
            <strong className="text-destructive">
              Cette action est irréversible.
            </strong>
          </>
        }
      />
    </div>
  );
}
