// @/hooks/use-hotel-cards.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { HotelCardData, HotelCardFilters } from "@/types/hotel-card";

// Interface pour la réponse de l'API
interface ApiResponse {
  success: boolean;
  data: HotelCardData[];
  count: number;
  error?: string;
}

// Interface pour les options du hook
interface UseHotelCardsOptions {
  enabled?: boolean; // Permet de désactiver le fetch automatique
  refetchOnMount?: boolean; // Refetch lors du montage
  staleTime?: number; // Temps avant que les données soient considérées comme obsolètes
}

// Interface de retour du hook
interface UseHotelCardsReturn {
  // Données
  hotelCards: HotelCardData[];
  loading: boolean;
  error: string | null;

  // Métadonnées
  count: number;
  isEmpty: boolean;
  hasError: boolean;

  // Filtres
  filters: HotelCardFilters;
  updateFilters: (newFilters: Partial<HotelCardFilters>) => void;
  resetFilters: () => void;
  clearFilters: () => void;

  // Actions
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;

  // État de la requête
  isFirstLoad: boolean;
  lastFetch: Date | null;
}

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useHotelCards(
  initialFilters: HotelCardFilters = {},
  options: UseHotelCardsOptions = {}
): UseHotelCardsReturn {
  const {
    enabled = true,
    refetchOnMount = true,
    staleTime = 5 * 60 * 1000, // 5 minutes par défaut
  } = options;

  // États principaux
  const [hotelCards, setHotelCards] = useState<HotelCardData[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState<HotelCardFilters>(initialFilters);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Debounce des filtres pour éviter trop de requêtes
  const debouncedFilters = useDebounce(filters, 300);

  // Fonction pour construire l'URL avec les paramètres
  const buildUrl = useCallback((filterParams: HotelCardFilters): string => {
    const params = new URLSearchParams();

    // Ajouter tous les filtres non vides
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "boolean") {
          params.append(key, value.toString());
        } else if (typeof value === "number") {
          params.append(key, value.toString());
        } else if (typeof value === "string") {
          params.append(key, value);
        }
      }
    });

    return `/api/hotel-card?${params.toString()}`;
  }, []);

  // Fonction principale de récupération des données
  const fetchHotelCards = useCallback(
    async (
      filterParams: HotelCardFilters = debouncedFilters,
      showLoading: boolean = true
    ): Promise<void> => {
      if (!enabled) return;

      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      try {
        const url = buildUrl(filterParams);
        console.log("📡 Fetching hotel cards:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success) {
          setHotelCards(result.data || []);
          setCount(result.count || result.data?.length || 0);
          setLastFetch(new Date());

          console.log(`✅ Loaded ${result.count || 0} hotel cards`);
        } else {
          throw new Error(
            result.error || "Erreur lors de la récupération des données"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur réseau inconnue";

        console.error("❌ Error fetching hotel cards:", err);
        setError(errorMessage);

        // En cas d'erreur, on garde les données précédentes si elles existent
        if (hotelCards.length === 0) {
          setHotelCards([]);
          setCount(0);
        }
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    },
    [enabled, debouncedFilters, buildUrl, hotelCards.length]
  );

  // Effet pour le fetch automatique basé sur les filtres
  useEffect(() => {
    if (enabled) {
      fetchHotelCards(debouncedFilters);
    }
  }, [debouncedFilters, enabled, fetchHotelCards]);

  // Effet pour le fetch initial au montage
  useEffect(() => {
    if (enabled && refetchOnMount && isFirstLoad) {
      fetchHotelCards(filters, true);
    }
  }, [enabled, refetchOnMount, isFirstLoad, filters, fetchHotelCards]);

  // Gestion des filtres
  const updateFilters = useCallback((newFilters: Partial<HotelCardFilters>) => {
    console.log("🔄 Updating filters:", newFilters);
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    console.log("🔄 Resetting filters to initial state");
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilters = useCallback(() => {
    console.log("🔄 Clearing all filters");
    setFilters({});
  }, []);

  // Actions de rafraîchissement
  const refetch = useCallback(async () => {
    console.log("🔄 Manual refetch requested");
    await fetchHotelCards(filters, true);
  }, [fetchHotelCards, filters]);

  const refresh = useCallback(async () => {
    console.log("🔄 Manual refresh requested");
    await fetchHotelCards(filters, false);
  }, [fetchHotelCards, filters]);

  // Vérification de la fraîcheur des données
  const isStale = useCallback((): boolean => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch.getTime() > staleTime;
  }, [lastFetch, staleTime]);

  // Auto-refresh si les données sont obsolètes
  useEffect(() => {
    if (enabled && !loading && !isFirstLoad && isStale()) {
      console.log("⏰ Data is stale, auto-refreshing...");
      refresh();
    }

    // Interval pour vérifier la fraîcheur périodiquement
    const interval = setInterval(() => {
      if (enabled && !loading && isStale()) {
        console.log("⏰ Periodic refresh due to stale data");
        refresh();
      }
    }, staleTime);

    return () => clearInterval(interval);
  }, [enabled, loading, isFirstLoad, isStale, refresh, staleTime]);

  // Propriétés calculées
  const isEmpty = hotelCards.length === 0 && !loading;
  const hasError = error !== null;

  // Debug en mode développement
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🏨 useHotelCards state:", {
        count: hotelCards.length,
        loading,
        error,
        filters: debouncedFilters,
        isEmpty,
        hasError,
        isFirstLoad,
        lastFetch,
      });
    }
  }, [
    hotelCards.length,
    loading,
    error,
    debouncedFilters,
    isEmpty,
    hasError,
    isFirstLoad,
    lastFetch,
  ]);

  return {
    // Données
    hotelCards,
    loading,
    error,

    // Métadonnées
    count,
    isEmpty,
    hasError,

    // Filtres
    filters,
    updateFilters,
    resetFilters,
    clearFilters,

    // Actions
    refetch,
    refresh,

    // État de la requête
    isFirstLoad,
    lastFetch,
  };
}

// Hook spécialisé pour un seul hôtel
export function useHotelCard(id: string | null) {
  const [hotelCard, setHotelCard] = useState<HotelCardData | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchHotelCard = useCallback(async (hotelId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("📡 Fetching hotel card:", hotelId);

      const response = await fetch(`/api/hotel-cards/${hotelId}`, {
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

      const result = await response.json();

      if (result.success) {
        setHotelCard(result.data);
        setLastFetch(new Date());
        console.log("✅ Hotel card loaded:", result.data.name);
      } else {
        throw new Error(result.error || "Hôtel non trouvé");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur réseau";

      console.error("❌ Error fetching hotel card:", err);
      setError(errorMessage);
      setHotelCard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effet pour le fetch automatique
  useEffect(() => {
    if (id) {
      fetchHotelCard(id);
    } else {
      setHotelCard(null);
      setLoading(false);
      setError(null);
    }
  }, [id, fetchHotelCard]);

  const refetch = useCallback(async () => {
    if (id) {
      await fetchHotelCard(id);
    }
  }, [id, fetchHotelCard]);

  return {
    hotelCard,
    loading,
    error,
    refetch,
    lastFetch,
    isEmpty: !hotelCard && !loading,
    hasError: error !== null,
  };
}

// Hook pour les statistiques des hôtels
export function useHotelCardsStats(filters: HotelCardFilters = {}) {
  const [stats, setStats] = useState({
    total: 0,
    partners: 0,
    averageRating: 0,
    averagePrice: 0,
    cityDistribution: {} as Record<string, number>,
    starDistribution: {} as Record<number, number>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/hotel-cards/stats?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(
          result.error || "Erreur lors du calcul des statistiques"
        );
      }
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
