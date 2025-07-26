import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/accommodation-type - Récupérer tous les types d'hébergement
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = category ? { category } : {};

    const accommodationTypes = await prisma.accommodationType.findMany({
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
              },
              orderBy: {
                name: "asc",
              },
            },
          }
        : undefined,
    });

    return NextResponse.json(accommodationTypes);
  } catch (error) {
    console.error("Error fetching accommodation types:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodation types" },
      { status: 500 }
    );
  }
}

// POST /api/accommodation-type - Créer un nouveau type d'hébergement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, category, description, order } = body;

    // Validation basique
    if (!name || !code || !category) {
      return NextResponse.json(
        { error: "Name, code and category are required" },
        { status: 400 }
      );
    }

    // Validation du code (format suggéré)
    if (!/^[A-Z_]{2,10}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 2-10 uppercase letters or underscores" },
        { status: 400 }
      );
    }

    const accommodationType = await prisma.accommodationType.create({
      data: {
        name,
        code,
        category,
        description,
        order: order || 100,
      },
    });

    return NextResponse.json(accommodationType, { status: 201 });
  } catch (error) {
    console.error("Error creating accommodation type:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Accommodation type code already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create accommodation type" },
      { status: 500 }
    );
  }
}
