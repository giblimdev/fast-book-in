import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-highlight/[id] - Récupérer un highlight d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
      include: includeHotels
        ? {
            HotelCardToHotelHighlight: {
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
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            HotelCardToHotelHighlight: {
              select: {
                hotelCardId: true,
                order: true,
              },
            },
          },
    });

    if (!hotelHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelHighlight);
  } catch (error) {
    console.error("Error fetching hotel highlight:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel highlight" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-highlight/[id] - Mettre à jour un highlight d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const {
      title,
      hotelId,
      category,
      description,
      icon,
      priority,
      order,
      isPromoted,
    } = body;

    // Vérifier si le highlight d'hôtel existe
    const existingHotelHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
    });

    if (!existingHotelHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
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

    // Validation de la priorité si fournie
    if (priority !== undefined && (priority < 0 || priority > 10)) {
      return NextResponse.json(
        { error: "Priority must be between 0 and 10" },
        { status: 400 }
      );
    }

    const updatedHotelHighlight = await prisma.hotelHighlight.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(hotelId && { hotelId }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(priority !== undefined && { priority }),
        ...(order !== undefined && { order }),
        ...(isPromoted !== undefined && { isPromoted }),
      },
    });

    return NextResponse.json(updatedHotelHighlight);
  } catch (error) {
    console.error("Error updating hotel highlight:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "Hotel highlight with this title already exists for this hotel",
          },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update hotel highlight" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-highlight/[id] - Supprimer un highlight d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si le highlight d'hôtel existe et récupérer les relations
    const existingHotelHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
      include: {
        HotelCardToHotelHighlight: true,
      },
    });

    if (!existingHotelHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des cartes d'hôtel associées
    if (existingHotelHighlight.HotelCardToHotelHighlight.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel highlight with associated hotel cards",
          details: {
            hotelCardCount:
              existingHotelHighlight.HotelCardToHotelHighlight.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.hotelHighlight.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel highlight deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel highlight:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel highlight" },
      { status: 500 }
    );
  }
}
