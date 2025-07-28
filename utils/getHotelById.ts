// utils/getHotelById.ts
import {
  useHotelSelectedStore,
  type HotelCardWithDetails,
} from "@/store/useHotelSelectedStore";

/**
 * Récupère les détails complets d'un hôtel par son ID
 * Met à jour automatiquement le store HotelSelected
 */
export async function getHotelById(
  hotelId: string
): Promise<HotelCardWithDetails | null> {
  const { setLoading, setSelectedHotel, setError } =
    useHotelSelectedStore.getState();

  try {
    setLoading(true);
    setError(null);

    // Appel à votre API avec toutes les relations nécessaires
    const response = await fetch(`/api/hotels/${hotelId}?include=all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Hôtel non trouvé");
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const hotel: HotelCardWithDetails = await response.json();

    // Validation basique des données
    if (!hotel.id || !hotel.name) {
      throw new Error("Données de l'hôtel invalides");
    }

    // Mise à jour du store avec les données de l'hôtel
    setSelectedHotel(hotel);

    return hotel;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur inconnue lors de la récupération de l'hôtel";
    console.error("Error fetching hotel:", error);
    setError(errorMessage);
    return null;
  } finally {
    setLoading(false);
  }
}

/**
 * Version alternative qui ne gère pas le store (pour usage sans store)
 */
export async function fetchHotelById(
  hotelId: string
): Promise<HotelCardWithDetails | null> {
  try {
    const response = await fetch(`/api/hotels/${hotelId}?include=all`);

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: Hôtel non trouvé`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'hôtel:", error);
    return null;
  }
}

/**
 * Vérifie si un hôtel est déjà chargé dans le store
 */
export function isHotelLoaded(hotelId: string): boolean {
  const { selectedHotel } = useHotelSelectedStore.getState();
  return selectedHotel?.id === hotelId;
}

/**
 * Précharge un hôtel uniquement s'il n'est pas déjà en mémoire
 */
export async function preloadHotelIfNeeded(
  hotelId: string
): Promise<HotelCardWithDetails | null> {
  if (isHotelLoaded(hotelId)) {
    return useHotelSelectedStore.getState().selectedHotel;
  }

  return await getHotelById(hotelId);
}
