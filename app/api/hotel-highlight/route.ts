import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-highlight - Récupérer tous les highlights d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isPromoted = searchParams.get("isPromoted") === "true";
    const minPriority = searchParams.get("minPriority");
    const hotelId = searchParams.get("hotelId");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isPromoted !== undefined) whereClause.isPromoted = isPromoted;
    if (hotelId) whereClause.hotelId = hotelId;
    if (minPriority) {
      whereClause.priority = {
        gte: parseInt(minPriority),
      };
    }

    const hotelHighlights = await prisma.hotelHighlight.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { order: "asc" }],
      include: includeRelations
        ? {
            HotelCardToHotelHighlight: {
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

    return NextResponse.json(hotelHighlights);
  } catch (error) {
    console.error("Error fetching hotel highlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel highlights" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-highlight - Créer un nouveau highlight d'hôtel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      hotelId,
      category,
      description,
      icon,
      priority,
      order,
      isPromoted,
    } = body;

    // Validation basique
    if (!title || !hotelId || !category) {
      return NextResponse.json(
        { error: "Title, hotelId and category are required" },
        { status: 400 }
      );
    }

    // Validation de la catégorie
    const validCategories = [
      "Location",
      "Amenity",
      "Service",
      "View",
      "Offer",
      "Food",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Category must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    // Validation de la priorité
    if (priority !== undefined && (priority < 0 || priority > 10)) {
      return NextResponse.json(
        { error: "Priority must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Vérifier que l'hôtel existe (via hotelId - assumant une relation avec HotelCard)
    // Note: Le modèle montre hotelId mais pas de relation directe,
    // nous assumons que c'est lié via HotelCardToHotelHighlight

    const hotelHighlight = await prisma.hotelHighlight.create({
      data: {
        title,
        hotelId,
        category,
        description,
        icon,
        priority: priority || 0,
        order: order || 100,
        isPromoted: isPromoted || false,
      },
    });

    return NextResponse.json(hotelHighlight, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel highlight:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "Hotel highlight with this title already exists for this hotel",
          },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create hotel highlight" },
      { status: 500 }
    );
  }
}
