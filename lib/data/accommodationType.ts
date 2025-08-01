// lib/data/accommodationType.ts
import {
  Hotel,
  Building2,
  Home,
  BedDouble,
  Landmark,
  HomeIcon,
  Tent,
  Building,
  Ship,
  House,
  MountainSnow,
  Palette,
  Store,
  Users,
  TreeDeciduous,
  Icon,
  Diamond,
} from "lucide-react";
import { cabin } from "@lucide/lab";

export const accommodationTypes = [
  {
    label: "Hôtel",
    icon: Hotel,
    order: 1,
    description: "",
    image: "/accomodationType/hotel.png",
  },
  {
    label: "Hôtel de luxe",
    icon: Diamond,
    order: 2,
    image: "/accomodationType/luxe.png",
  },
  {
    label: "Appartement",
    icon: Building2,
    order: 3,
    image: "/accomodationType/apartment.png",
  },
  {
    label: "Maison d'hôtes",
    icon: TreeDeciduous,
    order: 4,
    image: "/accomodationType/guesthouse.png",
  },
  {
    label: "Auberge",
    icon: BedDouble,
    order: 5,
    image: "/accomodationType/inn.png",
  },
  {
    label: "Résidence",
    icon: Building,
    order: 6,
    image: "/accomodationType/residence.png",
  },
  {
    label: "Villa",
    icon: HomeIcon,
    order: 7,
    image: "/accomodationType/villa.png",
  },
  {
    label: "Chambre d'hôtes",
    icon: BedDouble,
    order: 8,
    image: "/accomodationType/bedandbreakfast.png",
  },
  {
    label: "Gîte",
    icon: Home,
    order: 9,
    image: "/accomodationType/cottage.png",
  },
  {
    label: "Chalet",
    icon: MountainSnow,
    order: 10,
    image: "/accomodationType/chalet.png",
  },
  {
    label: "Camping",
    icon: Tent,
    order: 11,
    image: "/accomodationType/camping.png",
  },
  {
    label: "Hôtel historique",
    icon: Landmark,
    order: 12,
    image: "/accomodationType/historic-hotel.png",
  },
  {
    label: "Hôtel design",
    icon: Palette,
    order: 13,
    image: "/accomodationType/design-hotel.png",
  },
  {
    label: "Boutique hôtel",
    icon: Store,
    order: 14,
    image: "/accomodationType/boutique-hotel.png",
  },

  {
    label: "Condominium",
    icon: Building2,
    order: 15,
    image: "/accomodationType/condominium.png",
  },
  {
    label: "Guest house",
    icon: Home,
    order: 16,
    image: "/accomodationType/guest-house.png",
  },
  {
    label: "Auberge de jeunesse",
    icon: Users,
    order: 17,
    image: "/accomodationType/youth-hostel.png",
  },
  {
    label: "Houseboat",
    icon: Ship,
    order: 18,
    image: "/accomodationType/houseboat.png",
  },
  {
    label: "Maison de vacances privée",
    icon: House,
    order: 19,
    image: "/accomodationType/private-vacation-home.png",
  },
  {
    label: "Bungalow",
    icon: cabin,
    order: 20,
    image: "/accomodationType/bungalow.png",
  },
];
