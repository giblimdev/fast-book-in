import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-image - Récupérer toutes les images d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");
    const imageType = searchParams.get("imageType");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (entityId) whereClause.entityId = entityId;
    if (imageType) whereClause.imageType = imageType;

    const hotelImages = await prisma.hotelImage.findMany({
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

    return NextResponse.json(hotelImages);
  } catch (error) {
    console.error("Error fetching hotel images:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel images" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-image - Créer une nouvelle image d'hôtel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, imageUrl, imageType, order, alt } = body;

    // Validation basique
    if (!entityId || !imageUrl || !imageType) {
      return NextResponse.json(
        { error: "EntityId, imageUrl and imageType are required" },
        { status: 400 }
      );
    }

    // Validation de l'URL d'image
    if (!isValidImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: "Image URL must be a valid URL" },
        { status: 400 }
      );
    }

    // Validation du type d'image
    const validImageTypes = [
      "hotel",
      "room",
      "amenity",
      "restaurant",
      "spa",
      "pool",
      "exterior",
      "lobby",
      "suite",
      "view",
    ];
    if (!validImageTypes.includes(imageType)) {
      return NextResponse.json(
        { error: `Image type must be one of: ${validImageTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validation de l'ordre
    if (order !== undefined && (order < 1 || order > 100)) {
      return NextResponse.json(
        { error: "Order must be between 1 and 100" },
        { status: 400 }
      );
    }

    const hotelImage = await prisma.hotelImage.create({
      data: {
        entityId,
        imageUrl,
        imageType,
        order: order || 20,
        alt,
      },
    });

    return NextResponse.json(hotelImage, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel image:", error);

    return NextResponse.json(
      { error: "Failed to create hotel image" },
      { status: 500 }
    );
  }
}

// Fonction helper pour valider les URLs d'images
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Vérifier que l'URL a un protocole valide
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }
    // Vérifier l'extension d'image (optionnel mais recommandé)
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    const hasValidExtension = validExtensions.some((ext) =>
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
    return hasValidExtension || urlObj.pathname.includes("/"); // Permettre les URLs sans extension explicite
  } catch (_) {
    return false;
  }
}
