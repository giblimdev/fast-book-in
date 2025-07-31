import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-group/[id] - Récupérer un groupe d'hôtels par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelGroup = await prisma.hotelGroup.findUnique({
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
                images: {
                  take: 3,
                  orderBy: { order: "asc" },
                },
                _count: {
                  select: {
                    HotelReview: true,
                    HotelRoomType: true, // ✅ Corrigé: HotelRoomType au lieu de HotelRoom
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

    if (!hotelGroup) {
      return NextResponse.json(
        { error: "Hotel group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelGroup);
  } catch (error) {
    console.error("Error fetching hotel group:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel group" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-group/[id] - Mettre à jour un groupe d'hôtels
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, description, website, logoUrl, order } = body;

    // Vérifier si le groupe existe
    const existingHotelGroup = await prisma.hotelGroup.findUnique({
      where: { id },
    });

    if (!existingHotelGroup) {
      return NextResponse.json(
        { error: "Hotel group not found" },
        { status: 404 }
      );
    }

    // Validation des données (même logique que POST)
    if (name !== undefined) {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }

      if (name.trim().length > 255) {
        return NextResponse.json(
          { error: "Name must be less than 255 characters" },
          { status: 400 }
        );
      }

      // Vérifier l'unicité du nom (exclure le groupe actuel)
      const existingName = await prisma.hotelGroup.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
          NOT: { id },
        },
      });

      if (existingName) {
        return NextResponse.json(
          {
            error: "Hotel group with this name already exists",
            existingGroup: {
              id: existingName.id,
              name: existingName.name,
            },
          },
          { status: 409 }
        );
      }
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
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

    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: "Website must be a valid URL" },
        { status: 400 }
      );
    }

    if (logoUrl && !isValidUrl(logoUrl)) {
      return NextResponse.json(
        { error: "Logo URL must be a valid URL" },
        { status: 400 }
      );
    }

    if (
      order !== undefined &&
      (typeof order !== "number" || order < 0 || order > 9999)
    ) {
      return NextResponse.json(
        { error: "Order must be a number between 0 and 9999" },
        { status: 400 }
      );
    }

    const updatedHotelGroup = await prisma.hotelGroup.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(website !== undefined && { website: website?.trim() || null }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl?.trim() || null }),
        ...(order !== undefined && { order }),
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    return NextResponse.json(updatedHotelGroup);
  } catch (error) {
    console.error("Error updating hotel group:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/hotel-group/[id] - Supprimer un groupe d'hôtels
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    // Vérifier si le groupe existe et récupérer les hôtels associés
    const existingHotelGroup = await prisma.hotelGroup.findUnique({
      where: { id },
      include: {
        HotelCard: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingHotelGroup) {
      return NextResponse.json(
        { error: "Hotel group not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    if (existingHotelGroup.HotelCard.length > 0 && !force) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel group with associated hotels",
          details: {
            hotelCount: existingHotelGroup.HotelCard.length,
            hotels: existingHotelGroup.HotelCard,
            suggestion:
              "Use ?force=true to delete and set hotels' hotelGroupId to null",
          },
        },
        { status: 409 }
      );
    }

    // Si force=true, détacher les hôtels avant suppression
    if (force && existingHotelGroup.HotelCard.length > 0) {
      await prisma.hotelCard.updateMany({
        where: { hotelGroupId: id },
        data: { hotelGroupId: null },
      });
    }

    await prisma.hotelGroup.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hotel group deleted successfully",
      deletedGroup: {
        id: existingHotelGroup.id,
        name: existingHotelGroup.name,
      },
      ...(force &&
        existingHotelGroup.HotelCard.length > 0 && {
          detachedHotels: existingHotelGroup.HotelCard.length,
        }),
    });
  } catch (error) {
    console.error("Error deleting hotel group:", error);
    return handlePrismaError(error);
  }
}

// Fonctions helper
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

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
            error: "Hotel group not found",
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
