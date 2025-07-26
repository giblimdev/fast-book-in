import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-group/[id] - Récupérer un groupe d'hôtels par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelGroup = await prisma.hotelGroup.findUnique({
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
                overallRating: true,
              },
            },
          },
    });

    if (!hotelGroup) {
      return NextResponse.json(
        { error: "Hotel group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelGroup);
  } catch (error) {
    console.error("Error fetching hotel group:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel group" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-group/[id] - Mettre à jour un groupe d'hôtels
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, description, website, logoUrl, order } = body;

    // Vérifier si le groupe d'hôtels existe
    const existingHotelGroup = await prisma.hotelGroup.findUnique({
      where: { id },
    });

    if (!existingHotelGroup) {
      return NextResponse.json(
        { error: "Hotel group not found" },
        { status: 404 }
      );
    }

    // Validation de l'URL du site web si fournie
    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: "Website must be a valid URL" },
        { status: 400 }
      );
    }

    // Validation de l'URL du logo si fournie
    if (logoUrl && !isValidUrl(logoUrl)) {
      return NextResponse.json(
        { error: "Logo URL must be a valid URL" },
        { status: 400 }
      );
    }

    const updatedHotelGroup = await prisma.hotelGroup.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(website !== undefined && { website }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedHotelGroup);
  } catch (error) {
    console.error("Error updating hotel group:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Hotel group with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update hotel group" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-group/[id] - Supprimer un groupe d'hôtels
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si le groupe d'hôtels existe et récupérer les hôtels associés
    const existingHotelGroup = await prisma.hotelGroup.findUnique({
      where: { id },
      include: {
        HotelCard: true,
      },
    });

    if (!existingHotelGroup) {
      return NextResponse.json(
        { error: "Hotel group not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    if (existingHotelGroup.HotelCard.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel group with associated hotels",
          details: {
            hotelCount: existingHotelGroup.HotelCard.length,
            hotels: existingHotelGroup.HotelCard.map((hotel) => ({
              id: hotel.id,
              name: hotel.name,
            })),
          },
        },
        { status: 409 }
      );
    }

    await prisma.hotelGroup.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel group deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel group:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel group" },
      { status: 500 }
    );
  }
}

// Fonction helper pour valider les URLs
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
