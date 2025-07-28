// @/stores/useCityStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface City {
  id: string;
  name: string;
  order?: number;
  countryId: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  country?: {
    id: string;
    name: string;
    code: string;
    currency?: string;
  };
  neighborhoods?: Array<{
    id: string;
    name: string;
  }>;
  landmarks?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  destinations?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface CityState {
  // États
  cities: City[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;

  // Filtres et recherche
  searchTerm: string;
  selectedCountry: string | null;

  // Actions de données
  fetchCities: () => Promise<void>;
  getCityById: (id: string) => City | undefined;
  getCitiesByCountry: (countryId: string) => City[];
  searchCities: (term: string) => City[];

  // Actions de filtrage
  setSearchTerm: (term: string) => void;
  setSelectedCountry: (countryId: string | null) => void;
  clearFilters: () => void;

  // Actions de cache
  refreshCities: () => Promise<void>;
  clearCache: () => void;

  // Actions CRUD (si nécessaire)
  addCity: (city: City) => void;
  updateCity: (id: string, updates: Partial<City>) => void;
  removeCity: (id: string) => void;
}

export const useCityStore = create<CityState>()(
  devtools(
    persist(
      (set, get) => ({
        // États initiaux
        cities: [],
        loading: false,
        error: null,
        lastFetch: null,
        searchTerm: "",
        selectedCountry: null,

        // Récupération des villes depuis l'API
        fetchCities: async () => {
          const state = get();

          // Éviter les appels multiples
          if (state.loading) return;

          // Cache de 5 minutes
          if (
            state.lastFetch &&
            Date.now() - state.lastFetch.getTime() < 5 * 60 * 1000
          ) {
            console.log("🏠 Using cached cities data");
            return;
          }

          set({ loading: true, error: null });

          try {
            console.log("📡 Fetching cities from API...");
            const response = await fetch(
              "/api/cities?include=country,destinations",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-cache",
                },
              }
            );

            if (!response.ok) {
              throw new Error(
                `Erreur ${response.status}: ${response.statusText}`
              );
            }

            const result = await response.json();

            if (result.success) {
              set({
                cities: result.data || [],
                loading: false,
                lastFetch: new Date(),
                error: null,
              });
              console.log(`✅ Loaded ${result.data?.length || 0} cities`);
            } else {
              throw new Error(
                result.error || "Erreur lors du chargement des villes"
              );
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Erreur réseau";
            console.error("❌ Error fetching cities:", error);
            set({
              loading: false,
              error: errorMessage,
            });
          }
        },

        // Recherche par ID
        getCityById: (id: string) => {
          return get().cities.find((city) => city.id === id);
        },

        // Filtrage par pays
        getCitiesByCountry: (countryId: string) => {
          return get().cities.filter((city) => city.countryId === countryId);
        },

        // Recherche textuelle
        searchCities: (term: string) => {
          const cities = get().cities;
          if (!term.trim()) return cities;

          const searchTerm = term.toLowerCase().trim();
          return cities.filter(
            (city) =>
              city.name.toLowerCase().includes(searchTerm) ||
              city.country?.name.toLowerCase().includes(searchTerm)
          );
        },

        // Actions de filtrage
        setSearchTerm: (term: string) => {
          set({ searchTerm: term });
        },

        setSelectedCountry: (countryId: string | null) => {
          set({ selectedCountry: countryId });
        },

        clearFilters: () => {
          set({
            searchTerm: "",
            selectedCountry: null,
          });
        },

        // Rafraîchissement forcé
        refreshCities: async () => {
          set({ lastFetch: null });
          await get().fetchCities();
        },

        // Nettoyage du cache
        clearCache: () => {
          set({
            cities: [],
            lastFetch: null,
            error: null,
            searchTerm: "",
            selectedCountry: null,
          });
        },

        // Actions CRUD
        addCity: (city: City) => {
          set((state) => ({
            cities: [...state.cities, city].sort((a, b) =>
              a.name.localeCompare(b.name)
            ),
          }));
        },

        updateCity: (id: string, updates: Partial<City>) => {
          set((state) => ({
            cities: state.cities.map((city) =>
              city.id === id ? { ...city, ...updates } : city
            ),
          }));
        },

        removeCity: (id: string) => {
          set((state) => ({
            cities: state.cities.filter((city) => city.id !== id),
          }));
        },
      }),
      {
        name: "city-store",
        partialize: (state) => ({
          cities: state.cities,
          lastFetch: state.lastFetch,
        }),
      }
    ),
    {
      name: "city-store",
    }
  )
);
