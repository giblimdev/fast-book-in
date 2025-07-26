import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/room-amenity - Récupérer tous les équipements de chambre
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = category ? { category } : {};

    const roomAmenities = await prisma.roomAmenity.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            HotelDetails: {
              include: {
                address: {
                  include: {
                    city: {
                      include: {
                        country: true,
                      },
                    },
                    neighborhood: true,
                  },
                },
                HotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                    basePricePerNight: true,
                    currency: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            HotelDetailsToRoomAmenity: {
              include: {
                hotelDetails: {
                  include: {
                    address: {
                      include: {
                        city: {
                          include: {
                            country: true,
                          },
                        },
                      },
                    },
                    HotelCard: {
                      select: {
                        id: true,
                        name: true,
                        starRating: true,
                      },
                    },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : undefined,
    });

    return NextResponse.json(roomAmenities);
  } catch (error) {
    console.error("Error fetching room amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch room amenities" },
      { status: 500 }
    );
  }
}

// POST /api/room-amenity - Créer un nouvel équipement de chambre
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // Validation basique
    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Validation de la catégorie
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

    const roomAmenity = await prisma.roomAmenity.create({
      data: {
        name,
        category,
        icon,
        description,
        order: order || 100,
      },
    });

    return NextResponse.json(roomAmenity, { status: 201 });
  } catch (error) {
    console.error("Error creating room amenity:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Room amenity with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create room amenity" },
      { status: 500 }
    );
  }
}
