import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/room-amenity/[id] - Récupérer un équipement de chambre par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const roomAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
      include: includeHotels
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
                        neighborhood: true,
                      },
                    },
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
                      },
                    },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            HotelDetails: {
              select: {
                id: true,
                order: true,
              },
            },
          },
    });

    if (!roomAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(roomAmenity);
  } catch (error) {
    console.error("Error fetching room amenity:", error);
    return NextResponse.json(
      { error: "Failed to fetch room amenity" },
      { status: 500 }
    );
  }
}

// PUT /api/room-amenity/[id] - Mettre à jour un équipement de chambre
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // Vérifier si l'équipement de chambre existe
    const existingRoomAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
    });

    if (!existingRoomAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
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

    const updatedRoomAmenity = await prisma.roomAmenity.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(icon !== undefined && { icon }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedRoomAmenity);
  } catch (error) {
    console.error("Error updating room amenity:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Room amenity with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update room amenity" },
      { status: 500 }
    );
  }
}

// DELETE /api/room-amenity/[id] - Supprimer un équipement de chambre
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'équipement de chambre existe et récupérer les relations
    const existingRoomAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
      include: {
        HotelDetails: true,
        HotelDetailsToRoomAmenity: true,
      },
    });

    if (!existingRoomAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    const hasRelatedData =
      existingRoomAmenity.HotelDetails.length > 0 ||
      existingRoomAmenity.HotelDetailsToRoomAmenity.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete room amenity with associated hotel details",
          details: {
            directHotelDetails: existingRoomAmenity.HotelDetails.length,
            linkedHotelDetails:
              existingRoomAmenity.HotelDetailsToRoomAmenity.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.roomAmenity.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Room amenity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting room amenity:", error);
    return NextResponse.json(
      { error: "Failed to delete room amenity" },
      { status: 500 }
    );
  }
}
