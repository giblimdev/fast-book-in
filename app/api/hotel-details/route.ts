import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-details - Récupérer tous les détails d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const idHotelCard = searchParams.get("idHotelCard");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = idHotelCard ? { idHotelCard } : {};

    const hotelDetails = await prisma.hotelDetails.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            address: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
            RoomAmenity: {
              orderBy: { order: "asc" },
            },
            Label: {
              orderBy: { order: "asc" },
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
              // ✅ Supprimé orderBy car HotelCard est une relation one-to-one
            },
            HotelDetailsToRoomAmenity: {
              include: {
                roomAmenity: true,
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            address: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
                // ✅ Supprimé neighborhood (n'existe plus dans le schéma)
              },
            },
          },
    });

    return NextResponse.json(hotelDetails);
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel details" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-details - Créer de nouveaux détails d'hôtel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idHotelCard, description, addressId, order } = body;

    // Validation basique
    if (!idHotelCard || !addressId) {
      return NextResponse.json(
        { error: "idHotelCard and addressId are required" },
        { status: 400 }
      );
    }

    // Vérifier que l'adresse existe
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      include: {
        city: {
          include: {
            country: true,
          },
        },
        // ✅ Supprimé neighborhood (n'existe plus dans le schéma)
      },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Vérifier qu'il n'existe pas déjà des détails pour cet hôtel
    const existingDetails = await prisma.hotelDetails.findFirst({
      where: { idHotelCard },
    });

    if (existingDetails) {
      return NextResponse.json(
        { error: "Hotel details already exist for this hotel card" },
        { status: 409 }
      );
    }

    const hotelDetails = await prisma.hotelDetails.create({
      data: {
        idHotelCard,
        description,
        addressId,
        order: order || 20,
      },
      include: {
        address: {
          include: {
            city: {
              include: {
                country: true,
              },
            },
            // ✅ Supprimé neighborhood (n'existe plus dans le schéma)
          },
        },
      },
    });

    return NextResponse.json(hotelDetails, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel details:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Hotel details with this hotel card ID already exist" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid address reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create hotel details" },
      { status: 500 }
    );
  }
}
