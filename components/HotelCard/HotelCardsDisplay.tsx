// components/HotelCardsDisplay.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  getAllHotels,
  getPartnerHotels,
  sortHotelsByRatingDesc,
  sortHotelsByPriceAsc,
  Hotel,
} from "@/utils/getHotel";
import HotelCard from "@/components/HotelCard/HotelCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star } from "lucide-react";

export default function HotelCardsDisplay() {
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");
  const [showOnlyPartners, setShowOnlyPartners] = useState(false);

  const hotels = useMemo(() => {
    let baseHotels: Hotel[] = showOnlyPartners
      ? getPartnerHotels()
      : getAllHotels();

    switch (sortBy) {
      case "rating":
        return sortHotelsByRatingDesc(baseHotels);
      case "price":
        return sortHotelsByPriceAsc(baseHotels);
      case "name":
        return [...baseHotels].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return baseHotels;
    }
  }, [sortBy, showOnlyPartners]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Contrôles de filtrage */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rating")}
              >
                <Star className="w-4 h-4 mr-1" />
                Meilleure note
              </Button>
              <Button
                variant={sortBy === "price" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("price")}
              >
                Prix croissant
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
              >
                Nom A-Z
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyPartners}
                  onChange={(e) => setShowOnlyPartners(e.target.checked)}
                  className="rounded"
                />
                Partenaires uniquement
              </label>
              <Badge variant="secondary">
                {hotels.length} hôtel{hotels.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des hôtels */}
      <div className="space-y-6">
        {hotels.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun hôtel trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres pour voir plus de résultats.
              </p>
            </CardContent>
          </Card>
        ) : (
          hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
        )}
      </div>
    </div>
  );
}
