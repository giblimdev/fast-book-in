import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-image/[id] - Récupérer une image d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelImage = await prisma.hotelImage.findUnique({
      where: { id },
      include: includeHotels
        ? {
            HotelCard: {
              include: {
                accommodationType: true,
                destination: {
                  include: {
                    City: {
                      include: {
                        country: true,
                      },
                    },
                  },
                },
                hotelGroup: true,
                details: {
                  include: {
                    address: {
                      include: {
                        city: {
                          include: {
                            country: true,
                          },
                        },
                        neighborhood: true,
                      },
                    },
                  },
                },
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
          }
        : {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
              },
            },
          },
    });

    if (!hotelImage) {
      return NextResponse.json(
        { error: "Hotel image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelImage);
  } catch (error) {
    console.error("Error fetching hotel image:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel image" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-image/[id] - Mettre à jour une image d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { entityId, imageUrl, imageType, order, alt } = body;

    // Vérifier si l'image d'hôtel existe
    const existingHotelImage = await prisma.hotelImage.findUnique({
      where: { id },
    });

    if (!existingHotelImage) {
      return NextResponse.json(
        { error: "Hotel image not found" },
        { status: 404 }
      );
    }

    // Validation de l'URL d'image si fournie
    if (imageUrl && !isValidImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: "Image URL must be a valid URL" },
        { status: 400 }
      );
    }

    // Validation du type d'image si fourni
    if (imageType) {
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
    }

    // Validation de l'ordre si fourni
    if (order !== undefined && (order < 1 || order > 100)) {
      return NextResponse.json(
        { error: "Order must be between 1 and 100" },
        { status: 400 }
      );
    }

    const updatedHotelImage = await prisma.hotelImage.update({
      where: { id },
      data: {
        ...(entityId && { entityId }),
        ...(imageUrl && { imageUrl }),
        ...(imageType && { imageType }),
        ...(order !== undefined && { order }),
        ...(alt !== undefined && { alt }),
      },
    });

    return NextResponse.json(updatedHotelImage);
  } catch (error) {
    console.error("Error updating hotel image:", error);

    return NextResponse.json(
      { error: "Failed to update hotel image" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-image/[id] - Supprimer une image d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'image d'hôtel existe
    const existingHotelImage = await prisma.hotelImage.findUnique({
      where: { id },
      include: {
        HotelCard: true,
      },
    });

    if (!existingHotelImage) {
      return NextResponse.json(
        { error: "Hotel image not found" },
        { status: 404 }
      );
    }

    // Optionnel : Vérifier s'il y a des hôtels associés (warning mais pas de blocage)
    if (existingHotelImage.HotelCard.length > 0) {
      console.warn(
        `Deleting image used by ${existingHotelImage.HotelCard.length} hotel(s)`
      );
    }

    await prisma.hotelImage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel image:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel image" },
      { status: 500 }
    );
  }
}

// Fonction helper pour valider les URLs d'images
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    const hasValidExtension = validExtensions.some((ext) =>
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
    return hasValidExtension || urlObj.pathname.includes("/");
  } catch (_) {
    return false;
  }
}
