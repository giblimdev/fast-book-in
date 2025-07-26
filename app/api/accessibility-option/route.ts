import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/accessibility-option - Récupérer toutes les options d'accessibilité
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = category ? { category } : {};

    const accessibilityOptions = await prisma.accessibilityOption.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            HotelCardToAccessibilityOption: {
              include: {
                hotelCard: {
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
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : undefined,
    });

    return NextResponse.json(accessibilityOptions);
  } catch (error) {
    console.error("Error fetching accessibility options:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessibility options" },
      { status: 500 }
    );
  }
}

// POST /api/accessibility-option - Créer une nouvelle option d'accessibilité
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, category, description, icon, order } = body;

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

    const accessibilityOption = await prisma.accessibilityOption.create({
      data: {
        name,
        code,
        category,
        description,
        icon,
        order: order || 100,
      },
    });

    return NextResponse.json(accessibilityOption, { status: 201 });
  } catch (error) {
    console.error("Error creating accessibility option:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Accessibility option code already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create accessibility option" },
      { status: 500 }
    );
  }
}
