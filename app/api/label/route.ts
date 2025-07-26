import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/label - Récupérer tous les labels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minPriority = searchParams.get("minPriority");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (minPriority) {
      whereClause.priority = {
        gte: parseInt(minPriority),
      };
    }

    const labels = await prisma.label.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { order: "asc" }],
      include: includeRelations
        ? {
            HotelDetails: {
              include: {
                address: {
                  include: {
                    city: {
                      include: {
                        country: true,
                      },
                    },
                  },
                },
              },
            },
            HotelCardToLabel: {
              include: {
                hotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                    basePricePerNight: true,
                    currency: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : undefined,
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}

// POST /api/label - Créer un nouveau label
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      category,
      description,
      icon,
      color,
      priority,
      order,
      hotelDetailsId,
    } = body;

    // Validation basique
    if (!name || !code || !category) {
      return NextResponse.json(
        { error: "Name, code and category are required" },
        { status: 400 }
      );
    }

    // Validation du code (format suggéré)
    if (!/^[A-Z_]{2,20}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 2-20 uppercase letters or underscores" },
        { status: 400 }
      );
    }

    // Validation de la couleur (format hex)
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return NextResponse.json(
        { error: "Color must be a valid hex color (e.g., #FF0000)" },
        { status: 400 }
      );
    }

    // Validation de la priorité
    if (priority && (priority < 0 || priority > 10)) {
      return NextResponse.json(
        { error: "Priority must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Si hotelDetailsId est fourni, vérifier qu'il existe
    if (hotelDetailsId) {
      const hotelDetails = await prisma.hotelDetails.findUnique({
        where: { id: hotelDetailsId },
      });

      if (!hotelDetails) {
        return NextResponse.json(
          { error: "Hotel details not found" },
          { status: 404 }
        );
      }
    }

    const label = await prisma.label.create({
      data: {
        name,
        code,
        category,
        description,
        icon,
        color,
        priority: priority || 0,
        order: order || 100,
        hotelDetailsId,
      },
      include: {
        HotelDetails: {
          include: {
            address: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error("Error creating label:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Label code already exists" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel details reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create label" },
      { status: 500 }
    );
  }
}
