// utils/getHotelGroupe.ts
import hotelGroups from "@/lib/data/hotelGroupe"; // fallback static list
import { HotelGroup } from "@/lib/generated/prisma/client";

export interface HotelGroupOption {
  id: string;
  name: string;
}

export async function getHotelGroupe(): Promise<HotelGroupOption[]> {
  try {
    const res = await fetch("/api/hotel-group", { cache: "no-store" });
    if (!res.ok) throw new Error(`API fetch failed with status ${res.status}`);

    const data = await res.json();
    console.log("[getHotelGroupe] API data received:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn(
        "[getHotelGroupe] API data empty or invalid, using fallback"
      );
      throw new Error("API data empty or invalid");
    }

    const parsed = data.map((item: any) => {
      console.log("[getHotelGroupe] Parsing item:", item);
      return {
        id: item.id,
        name: item.name,
      };
    });

    return parsed;
  } catch (error) {
    console.error(
      "[getHotelGroupe] Error fetching API, fallback triggered:",
      error
    );
    return hotelGroups.map((grp: HotelGroup) => ({
      id: grp.id,
      name: grp.name,
    }));
  }
}
