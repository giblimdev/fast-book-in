// @/app/demo/displayComponent/page.tsx
"use client";

import SelectCity from "@/components/helper/SelectCity";
import {
  useSelectedCity,
  useSelectedCityInfo,
} from "@/store/useCitySelectedStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Globe, Trash2, Info } from "lucide-react";

export default function DisplayComponentPage() {
  const cityStore = useSelectedCity();
  const cityInfo = useSelectedCityInfo();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Démonstration Sélecteur de Ville</h1>
        <p className="text-muted-foreground">
          Composant de sélection avec affichage du contenu du store
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Composant SelectCity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sélecteur de Ville
            </CardTitle>
            <CardDescription>
              Sélectionnez un pays puis une ville
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SelectCity />
          </CardContent>
        </Card>

        {/* Contenu du Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Contenu du Store
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* État actuel */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Ville sélectionnée:</span>
                <div className="text-lg font-semibold">
                  {cityInfo.getSelectedCityName()}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium">Ville avec pays:</span>
                <div className="text-base">
                  {cityInfo.getSelectedCityWithCountry()}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    ID Ville:
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {cityInfo.selectedCityId || "null"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    ID Pays:
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {cityInfo.selectedCountryId || "null"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Détails de la ville sélectionnée */}
            {cityInfo.selectedCity && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Détails de la ville:</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Nom:</strong> {cityInfo.selectedCity.name}
                  </div>
                  <div>
                    <strong>Pays:</strong>{" "}
                    {cityInfo.selectedCity.country?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Code pays:</strong>{" "}
                    {cityInfo.selectedCity.country?.code || "N/A"}
                  </div>
                  <div>
                    <strong>ID Pays:</strong> {cityInfo.selectedCity.countryId}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => cityStore.clearSelection()}
                disabled={!cityInfo.selectedCity}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer Sélection
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => cityStore.clearRecent()}
                disabled={cityStore.recentCities.length === 0}
              >
                <Clock className="h-4 w-4 mr-2" />
                Vider Historique ({cityStore.recentCities.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Villes Récentes ({cityStore.recentCities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cityStore.recentCities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune ville récente
            </p>
          ) : (
            <div className="grid gap-2">
              {cityStore.recentCities.map((city, index) => (
                <div
                  key={`${city.id}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    cityInfo.isSelected(city.id)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => cityStore.selectCity(city.id, city)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-full text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {city.country?.name}
                      </div>
                    </div>
                  </div>
                  {cityInfo.isSelected(city.id) && <Badge>Sélectionnée</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug du store */}
      <Card>
        <CardHeader>
          <CardTitle>Debug - État Complet du Store</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(
              {
                selectedCityId: cityStore.selectedCityId,
                selectedCountryId: cityStore.selectedCountryId,
                selectedCity: cityStore.selectedCity,
                recentCitiesCount: cityStore.recentCities.length,
                recentCities: cityStore.recentCities.map((c) => ({
                  id: c.id,
                  name: c.name,
                  country: c.country?.name,
                })),
              },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
