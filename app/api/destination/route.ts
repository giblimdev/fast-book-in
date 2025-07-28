// @/app/api/destination/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const cityId = searchParams.get("cityId");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (type) whereClause.type = type;
    if (cityId) whereClause.cityId = cityId;

    console.log("Fetching destinations with where clause:", whereClause);

    const destinations = await prisma.destination.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { popularityScore: "desc" }, { name: "asc" }],
      include: {
        // ✅ Selon votre schéma : relation many-to-many avec City
        City: {
          include: {
            country: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        // ✅ Table de jointure
        DestinationToCity: {
          include: {
            city: {
              include: {
                country: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    console.log("Destinations found:", destinations.length);
    console.log("First destination:", destinations[0]);

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      order,
      description,
      type,
      popularityScore,
      cityId,
      latitude,
      longitude,
      radius,
    } = body;

    console.log("Creating destination with data:", body);

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    if (
      popularityScore !== undefined &&
      (popularityScore < 0 || popularityScore > 100)
    ) {
      return NextResponse.json(
        { error: "Popularity score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // ✅ Création de la destination selon votre schéma
    const destination = await prisma.destination.create({
      data: {
        name: name.trim(),
        order: order || 100,
        description: description?.trim() || null,
        type: type.trim(),
        popularityScore: popularityScore || 0,
        cityId: cityId || "", // Garde le cityId même si pas utilisé directement
        latitude: latitude || null,
        longitude: longitude || null,
        radius: radius || null,
        // ✅ Connecter à la ville via la relation many-to-many si cityId fourni
        ...(cityId && {
          City: {
            connect: { id: cityId },
          },
        }),
      },
      include: {
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
        },
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    console.log("Destination created:", destination);

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
