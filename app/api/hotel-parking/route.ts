import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-parking - Récupérer toutes les options de parking
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const isAvailable = searchParams.get("isAvailable");
    const minSpaces = searchParams.get("minSpaces");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (isAvailable !== null) {
      whereClause.isAvailable = isAvailable === "true";
    }
    if (minSpaces) {
      whereClause.spaces = {
        gte: parseInt(minSpaces),
      };
    }

    const hotelParkings = await prisma.hotelParking.findMany({
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
          }
        : undefined,
    });

    return NextResponse.json(hotelParkings);
  } catch (error) {
    console.error("Error fetching hotel parkings:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel parkings" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-parking - Créer une nouvelle option de parking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isAvailable, spaces, notes, order } = body;

    // Validation des espaces de parking
    if (spaces !== undefined && (spaces < 0 || spaces > 10000)) {
      return NextResponse.json(
        { error: "Parking spaces must be between 0 and 10000" },
        { status: 400 }
      );
    }

    // Validation de la logique métier
    if (isAvailable === false && spaces && spaces > 0) {
      return NextResponse.json(
        { error: "Cannot have parking spaces when parking is not available" },
        { status: 400 }
      );
    }

    const hotelParking = await prisma.hotelParking.create({
      data: {
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        spaces,
        notes,
        order: order || 100,
      },
    });

    return NextResponse.json(hotelParking, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel parking:", error);

    return NextResponse.json(
      { error: "Failed to create hotel parking" },
      { status: 500 }
    );
  }
}
