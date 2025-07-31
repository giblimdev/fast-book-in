// components/host/HotelBasicInfo.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useHotelStore } from "@/store/useHotelStore";
import { getHotelGroupe, HotelGroupOption } from "@/utils/getHotelGroupe";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function HotelBasicInfo() {
  const { hotelCardData, setHotelCardData } = useHotelStore();
  const [groups, setGroups] = useState<HotelGroupOption[]>([]);

  useEffect(() => {
    getHotelGroupe().then((data) => {
      console.log("Received hotel groups from getHotelGroupe:", data);
      setGroups(data);
    });
  }, []);

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'hôtel *</Label>
        <Input
          id="name"
          value={hotelCardData.name || ""}
          onChange={(e) => setHotelCardData({ name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="order">Ordre d'affichage</Label>
        <Input
          id="order"
          type="number"
          value={hotelCardData.order ?? ""}
          onChange={(e) => setHotelCardData({ order: Number(e.target.value) })}
          min={1}
        />
      </div>
      <div>
        <Label htmlFor="shortDescription">Description courte</Label>
        <Input
          id="shortDescription"
          value={hotelCardData.shortDescription || ""}
          onChange={(e) =>
            setHotelCardData({ shortDescription: e.target.value })
          }
          maxLength={120}
        />
      </div>
      <div>
        <Label htmlFor="starRating">Nombre d'étoiles *</Label>
        <Input
          id="starRating"
          type="number"
          min={1}
          max={5}
          value={hotelCardData.starRating ?? ""}
          onChange={(e) =>
            setHotelCardData({ starRating: Number(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="basePricePerNight">Prix de base par nuit (€) *</Label>
        <Input
          id="basePricePerNight"
          type="number"
          min={0}
          step={1}
          value={hotelCardData.basePricePerNight ?? ""}
          onChange={(e) =>
            setHotelCardData({ basePricePerNight: Number(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="regularPrice">Prix habituel (optionnel)</Label>
        <Input
          id="regularPrice"
          type="number"
          min={0}
          step={1}
          value={hotelCardData.regularPrice ?? ""}
          onChange={(e) =>
            setHotelCardData({
              regularPrice: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="currency">Devise</Label>
        <Input
          id="currency"
          value={hotelCardData.currency || "EUR"}
          onChange={(e) => setHotelCardData({ currency: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hotelGroupId">Groupe hôtelier</Label>
        <select
          id="hotelGroupId"
          value={hotelCardData.hotelGroupId || ""}
          onChange={(e) =>
            setHotelCardData({ hotelGroupId: e.target.value || null })
          }
          className="w-full border rounded px-2 py-2"
        >
          <option value="">Aucun</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
