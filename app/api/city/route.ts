import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/city - Récupérer toutes les villes
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = countryId ? { countryId } : {};

    const cities = await prisma.city.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            country: true,
            neighborhoods: true,
            landmarks: true,
            addresses: true,
            destinations: true,
            DestinationToCity: {
              include: {
                destination: true,
              },
            },
          }
        : {
            country: true, // Toujours inclure le pays pour le contexte
          },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}

// POST /api/city - Créer une nouvelle ville
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, countryId, order } = body;

    // Validation basique
    if (!name || !countryId) {
      return NextResponse.json(
        { error: "Name and countryId are required" },
        { status: 400 }
      );
    }

    // Vérifier que le pays existe
    const country = await prisma.country.findUnique({
      where: { id: countryId },
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const city = await prisma.city.create({
      data: {
        name,
        countryId,
        order: order || 100,
      },
      include: {
        country: true,
      },
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    console.error("Error creating city:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "City with this name already exists in this country" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid country reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create city" },
      { status: 500 }
    );
  }
}
