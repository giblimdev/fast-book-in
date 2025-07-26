import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/landmark - Récupérer tous les landmarks
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    const type = searchParams.get("type");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (cityId) whereClause.cityId = cityId;
    if (type) whereClause.type = type;

    const landmarks = await prisma.landmark.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            city: {
              include: {
                country: true,
              },
            },
          }
        : {
            city: {
              include: {
                country: true,
              },
            },
          },
    });

    return NextResponse.json(landmarks);
  } catch (error) {
    console.error("Error fetching landmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch landmarks" },
      { status: 500 }
    );
  }
}

// POST /api/landmark - Créer un nouveau landmark
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, cityId, description, order, latitude, longitude } =
      body;

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

    const landmark = await prisma.landmark.create({
      data: {
        name,
        type,
        cityId,
        description,
        order: order || 100,
        latitude,
        longitude,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(landmark, { status: 201 });
  } catch (error) {
    console.error("Error creating landmark:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Landmark with this name already exists in this city" },
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
      { error: "Failed to create landmark" },
      { status: 500 }
    );
  }
}
