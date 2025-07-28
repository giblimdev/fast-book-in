// @/store/useCitySelectedStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Interface simplifiée pour City (ne dépend plus d'un autre store)
export interface City {
  id: string;
  name: string;
  countryId: string;
  population?: number;
  order?: number;
  country?: {
    id: string;
    name: string;
    code: string;
  };
  destinations?: Array<{
    id: string;
    name: string;
  }>;
}

interface SelectedCityState {
  // État de sélection
  selectedCityId: string | null;
  selectedCountryId: string | null;
  selectedCity: City | null;

  // Historique de sélection (pour navigation rapide)
  recentCities: City[];

  // Actions de sélection
  selectCity: (cityId: string | null, city?: City | null) => void;
  selectCountry: (countryId: string | null) => void;
  clearSelection: () => void;

  // Actions d'historique
  addToRecentCities: (city: City) => void;
  clearRecent: () => void;

  // Utilitaires
  isSelected: (cityId: string) => boolean;
  getSelectedCityName: () => string;
  getSelectedCityWithCountry: () => string;
}

export const useCitySelectedStore = create<SelectedCityState>()(
  devtools(
    persist(
      (set, get) => ({
        // États initiaux
        selectedCityId: null,
        selectedCountryId: null,
        selectedCity: null,
        recentCities: [],

        // Sélection d'une ville
        selectCity: (cityId: string | null, city?: City | null) => {
          const state = get();

          // Si on désélectionne
          if (!cityId) {
            set({
              selectedCityId: null,
              selectedCity: null,
              selectedCountryId: null,
            });
            return;
          }

          // Mise à jour de la sélection
          const updatedState: Partial<SelectedCityState> = {
            selectedCityId: cityId,
            selectedCity: city || null,
          };

          // Mise à jour du pays si la ville en a un
          if (city?.countryId) {
            updatedState.selectedCountryId = city.countryId;
          }

          set(updatedState);

          // Ajouter à l'historique récent si on a les données de la ville
          if (city) {
            state.addToRecentCities(city);
          }

          console.log(`🏙️ Ville sélectionnée: ${city?.name || cityId}`);
        },

        // Sélection d'un pays
        selectCountry: (countryId: string | null) => {
          set({
            selectedCountryId: countryId,
            // Réinitialiser la ville si on change de pays
            selectedCityId: null,
            selectedCity: null,
          });

          console.log(`🌍 Pays sélectionné: ${countryId || "Aucun"}`);
        },

        // Effacer la sélection
        clearSelection: () => {
          set({
            selectedCityId: null,
            selectedCountryId: null,
            selectedCity: null,
          });
          console.log("🗑️ Sélection effacée");
        },

        // Ajouter à l'historique récent
        addToRecentCities: (city: City) => {
          const state = get();
          const recentCities = state.recentCities.filter(
            (c) => c.id !== city.id
          );

          set({
            recentCities: [city, ...recentCities].slice(0, 10), // Garder seulement les 10 dernières
          });
        },

        // Nettoyer l'historique récent
        clearRecent: () => {
          set({ recentCities: [] });
          console.log("🗑️ Historique récent effacé");
        },

        // Vérifier si une ville est sélectionnée
        isSelected: (cityId: string) => {
          return get().selectedCityId === cityId;
        },

        // Obtenir le nom de la ville sélectionnée
        getSelectedCityName: () => {
          const state = get();
          return state.selectedCity?.name || "Aucune ville sélectionnée";
        },

        // Obtenir le nom complet avec pays
        getSelectedCityWithCountry: () => {
          const state = get();
          const city = state.selectedCity;

          if (!city) return "Aucune ville sélectionnée";

          if (city.country) {
            return `${city.name}, ${city.country.name}`;
          }
          return city.name;
        },
      }),
      {
        name: "city-selected-store",
        partialize: (state) => ({
          selectedCityId: state.selectedCityId,
          selectedCountryId: state.selectedCountryId,
          selectedCity: state.selectedCity,
          recentCities: state.recentCities,
        }),
      }
    ),
    {
      name: "city-selected-store",
    }
  )
);

// Hook personnalisé pour la sélection des villes
export function useSelectedCity() {
  const store = useCitySelectedStore();
  return store;
}

// Hook pour obtenir uniquement les informations de sélection (sans les actions)
export function useSelectedCityInfo() {
  const {
    selectedCityId,
    selectedCountryId,
    selectedCity,
    getSelectedCityName,
    getSelectedCityWithCountry,
    isSelected,
  } = useCitySelectedStore();

  return {
    selectedCityId,
    selectedCountryId,
    selectedCity,
    getSelectedCityName,
    getSelectedCityWithCountry,
    isSelected,
  };
}
