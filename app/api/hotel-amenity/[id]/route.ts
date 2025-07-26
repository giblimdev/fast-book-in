import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-amenity/[id] - Récupérer un équipement d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelAmenity = await prisma.hotelAmenity.findUnique({
      where: { id },
      include: includeHotels
        ? {
            HotelCard: {
              include: {
                accommodationType: true,
                destination: {
                  include: {
                    City: {
                      include: {
                        country: true,
                      },
                    },
                  },
                },
                hotelGroup: true,
                details: {
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
                  },
                },
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
            HotelCardToHotelAmenity: {
              include: {
                hotelCard: {
                  include: {
                    accommodationType: true,
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
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
              },
            },
          },
    });

    if (!hotelAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelAmenity);
  } catch (error) {
    console.error("Error fetching hotel amenity:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel amenity" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-amenity/[id] - Mettre à jour un équipement d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // Vérifier si l'équipement d'hôtel existe
    const existingHotelAmenity = await prisma.hotelAmenity.findUnique({
      where: { id },
    });

    if (!existingHotelAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity not found" },
        { status: 404 }
      );
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

    const updatedHotelAmenity = await prisma.hotelAmenity.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category !== undefined && { category }),
        ...(icon !== undefined && { icon }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedHotelAmenity);
  } catch (error) {
    console.error("Error updating hotel amenity:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Hotel amenity with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update hotel amenity" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-amenity/[id] - Supprimer un équipement d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'équipement d'hôtel existe et récupérer les relations
    const existingHotelAmenity = await prisma.hotelAmenity.findUnique({
      where: { id },
      include: {
        HotelCard: true,
        HotelCardToHotelAmenity: true,
      },
    });

    if (!existingHotelAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    const hasRelatedData =
      existingHotelAmenity.HotelCard.length > 0 ||
      existingHotelAmenity.HotelCardToHotelAmenity.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel amenity with associated hotels",
          details: {
            directHotelCards: existingHotelAmenity.HotelCard.length,
            linkedHotelCards:
              existingHotelAmenity.HotelCardToHotelAmenity.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.hotelAmenity.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel amenity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel amenity:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel amenity" },
      { status: 500 }
    );
  }
}
