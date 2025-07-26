import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-group - Récupérer tous les groupes d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";
    const hasWebsite = searchParams.get("hasWebsite") === "true";

    const whereClause: any = {};
    if (hasWebsite) {
      whereClause.website = {
        not: null,
      };
    }

    const hotelGroups = await prisma.hotelGroup.findMany({
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

    return NextResponse.json(hotelGroups);
  } catch (error) {
    console.error("Error fetching hotel groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel groups" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-group - Créer un nouveau groupe d'hôtels
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, website, logoUrl, order } = body;

    // Validation basique
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
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

    const hotelGroup = await prisma.hotelGroup.create({
      data: {
        name,
        description,
        website,
        logoUrl,
        order: order || 100,
      },
    });

    return NextResponse.json(hotelGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel group:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Hotel group with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create hotel group" },
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
