import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-parking/[id] - Récupérer une option de parking par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelParking = await prisma.hotelParking.findUnique({
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

    if (!hotelParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelParking);
  } catch (error) {
    console.error("Error fetching hotel parking:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel parking" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-parking/[id] - Mettre à jour une option de parking
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { isAvailable, spaces, notes, order } = body;

    // Vérifier si l'option de parking existe
    const existingHotelParking = await prisma.hotelParking.findUnique({
      where: { id },
    });

    if (!existingHotelParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    // Validation des espaces de parking si fournis
    if (spaces !== undefined && (spaces < 0 || spaces > 10000)) {
      return NextResponse.json(
        { error: "Parking spaces must be between 0 and 10000" },
        { status: 400 }
      );
    }

    // Validation de la logique métier
    const finalIsAvailable =
      isAvailable !== undefined
        ? isAvailable
        : existingHotelParking.isAvailable;
    const finalSpaces =
      spaces !== undefined ? spaces : existingHotelParking.spaces;

    if (finalIsAvailable === false && finalSpaces && finalSpaces > 0) {
      return NextResponse.json(
        { error: "Cannot have parking spaces when parking is not available" },
        { status: 400 }
      );
    }

    const updatedHotelParking = await prisma.hotelParking.update({
      where: { id },
      data: {
        ...(isAvailable !== undefined && { isAvailable }),
        ...(spaces !== undefined && { spaces }),
        ...(notes !== undefined && { notes }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedHotelParking);
  } catch (error) {
    console.error("Error updating hotel parking:", error);

    return NextResponse.json(
      { error: "Failed to update hotel parking" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-parking/[id] - Supprimer une option de parking
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'option de parking existe et récupérer les hôtels associés
    const existingHotelParking = await prisma.hotelParking.findUnique({
      where: { id },
      include: {
        HotelCard: true,
      },
    });

    if (!existingHotelParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    if (existingHotelParking.HotelCard.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel parking with associated hotels",
          details: {
            hotelCount: existingHotelParking.HotelCard.length,
            hotels: existingHotelParking.HotelCard.map((hotel) => ({
              id: hotel.id,
              name: hotel.name,
            })),
          },
        },
        { status: 409 }
      );
    }

    await prisma.hotelParking.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel parking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel parking:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel parking" },
      { status: 500 }
    );
  }
}
