import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/destination - Récupérer toutes les destinations
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    const type = searchParams.get("type");
    const minPopularity = searchParams.get("minPopularity");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (cityId) whereClause.cityId = cityId;
    if (type) whereClause.type = type;
    if (minPopularity) {
      whereClause.popularityScore = {
        gte: parseInt(minPopularity),
      };
    }

    const destinations = await prisma.destination.findMany({
      where: whereClause,
      orderBy: [{ popularityScore: "desc" }, { order: "asc" }],
      include: includeRelations
        ? {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
                basePricePerNight: true,
              },
            },
            City: {
              include: {
                country: true,
              },
            },
            DestinationToCity: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            City: {
              include: {
                country: true,
              },
            },
          },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

// POST /api/destination - Créer une nouvelle destination
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      cityId,
      description,
      popularityScore,
      order,
      latitude,
      longitude,
      radius,
    } = body;

    // Validation basique
    if (!name || !type || !cityId) {
      return NextResponse.json(
        { error: "Name, type and cityId are required" },
        { status: 400 }
      );
    }

    // Validation des coordonnées GPS si fournies
    if (latitude && (latitude < -90 || latitude > 90)) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }

    if (longitude && (longitude < -180 || longitude > 180)) {
      return NextResponse.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    // Validation du score de popularité
    if (popularityScore && (popularityScore < 0 || popularityScore > 100)) {
      return NextResponse.json(
        { error: "Popularity score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Validation du rayon
    if (radius && radius < 0) {
      return NextResponse.json(
        { error: "Radius must be positive" },
        { status: 400 }
      );
    }

    // Vérifier que la ville existe
    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: {
        country: true,
      },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        type,
        cityId,
        description,
        popularityScore: popularityScore || 0,
        order: order || 100,
        latitude,
        longitude,
        radius,
      },
      include: {
        City: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Destination with this name already exists in this city" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid city reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
