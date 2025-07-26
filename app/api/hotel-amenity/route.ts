import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-amenity - Récupérer tous les équipements d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = category ? { category } : {};

    const hotelAmenities = await prisma.hotelAmenity.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
                basePricePerNight: true,
                currency: true,
                destination: {
                  include: {
                    City: {
                      include: {
                        country: true,
                      },
                    },
                  },
                },
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
            HotelCardToHotelAmenity: {
              include: {
                hotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : undefined,
    });

    return NextResponse.json(hotelAmenities);
  } catch (error) {
    console.error("Error fetching hotel amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel amenities" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-amenity - Créer un nouvel équipement d'hôtel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // Validation basique
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validation de la catégorie si fournie
    if (category) {
      const validCategories = [
        "Location",
        "Amenity",
        "Service",
        "View",
        "Offer",
        "Food",
      ];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: `Category must be one of: ${validCategories.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const hotelAmenity = await prisma.hotelAmenity.create({
      data: {
        name,
        category,
        icon,
        description,
        order: order || 100,
      },
    });

    return NextResponse.json(hotelAmenity, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel amenity:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Hotel amenity with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create hotel amenity" },
      { status: 500 }
    );
  }
}
