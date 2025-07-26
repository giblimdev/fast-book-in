import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/neighborhood - Récupérer tous les quartiers
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = cityId ? { cityId } : {};

    const neighborhoods = await prisma.neighborhood.findMany({
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
            addresses: true,
          }
        : {
            city: {
              include: {
                country: true,
              },
            },
          },
    });

    return NextResponse.json(neighborhoods);
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return NextResponse.json(
      { error: "Failed to fetch neighborhoods" },
      { status: 500 }
    );
  }
}

// POST /api/neighborhood - Créer un nouveau quartier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cityId, order } = body;

    // Validation basique
    if (!name || !cityId) {
      return NextResponse.json(
        { error: "Name and cityId are required" },
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

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name,
        cityId,
        order: order || 100,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(neighborhood, { status: 201 });
  } catch (error) {
    console.error("Error creating neighborhood:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Neighborhood with this name already exists in this city" },
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
      { error: "Failed to create neighborhood" },
      { status: 500 }
    );
  }
}
