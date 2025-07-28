import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-group - Récupérer tous les groupes d'hôtels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";
    const hasWebsite = searchParams.get("hasWebsite") === "true";
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (hasWebsite) {
      whereClause.website = {
        not: null,
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const hotelGroups = await prisma.hotelGroup.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }],
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
            _count: {
              select: {
                HotelCard: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCard: true,
              },
            },
          },
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

    // ✅ Validation complète
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (name.trim().length > 255) {
      return NextResponse.json(
        { error: "Name must be less than 255 characters" },
        { status: 400 }
      );
    }

    if (description && typeof description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    if (description && description.length > 1000) {
      return NextResponse.json(
        { error: "Description must be less than 1000 characters" },
        { status: 400 }
      );
    }

    // Validation de l'URL du site web
    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: "Website must be a valid URL" },
        { status: 400 }
      );
    }

    // Validation de l'URL du logo
    if (logoUrl && !isValidUrl(logoUrl)) {
      return NextResponse.json(
        { error: "Logo URL must be a valid URL" },
        { status: 400 }
      );
    }

    // Validation de l'ordre
    if (
      order !== undefined &&
      (typeof order !== "number" || order < 0 || order > 9999)
    ) {
      return NextResponse.json(
        { error: "Order must be a number between 0 and 9999" },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du nom
    const existingGroup = await prisma.hotelGroup.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingGroup) {
      return NextResponse.json(
        {
          error: "Hotel group with this name already exists",
          existingGroup: {
            id: existingGroup.id,
            name: existingGroup.name,
          },
        },
        { status: 409 }
      );
    }

    const hotelGroup = await prisma.hotelGroup.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        website: website?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        order: order || 100,
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    return NextResponse.json(hotelGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel group:", error);
    return handlePrismaError(error);
  }
}

// Fonction helper pour valider les URLs
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

// Gestion des erreurs Prisma
function handlePrismaError(error: any) {
  if (error && typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "P2002":
        const target = error.meta?.target;
        return NextResponse.json(
          {
            error: `Hotel group with this ${
              target?.[0] || "field"
            } already exists`,
            prismaError: error.code,
            details: error.meta,
          },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          {
            error: "Related record not found",
            prismaError: error.code,
          },
          { status: 404 }
        );
      default:
        console.error("Unhandled Prisma error:", error);
        return NextResponse.json(
          {
            error: "Database error occurred",
            prismaError: error.code,
            message: error.message,
          },
          { status: 500 }
        );
    }
  }

  return NextResponse.json(
    {
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
