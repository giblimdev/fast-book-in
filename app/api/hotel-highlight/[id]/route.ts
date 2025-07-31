import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-highlight/[id] - Récupérer un highlight par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const hotelHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
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
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                HotelCardToHotelHighlight: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCardToHotelHighlight: true,
              },
            },
          },
    });

    if (!hotelHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelHighlight);
  } catch (error) {
    console.error("Error fetching hotel highlight:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel highlight" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-highlight/[id] - Mettre à jour un highlight
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      title,
      description,
      category,
      icon,
      priority,
      order,
      isPromoted,
      hotelId, // ✅ Gardé car le champ existe dans le schéma
    } = body;

    // Vérifier si le highlight existe
    const existingHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
    });

    if (!existingHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
        { status: 404 }
      );
    }

    // Validation des données
    if (title !== undefined) {
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title must be a non-empty string" },
          { status: 400 }
        );
      }

      if (title.trim().length > 255) {
        return NextResponse.json(
          { error: "Title must be less than 255 characters" },
          { status: 400 }
        );
      }

      // ✅ Vérification d'unicité corrigée
      const existingTitle = await prisma.hotelHighlight.findFirst({
        where: {
          title: {
            equals: title.trim(),
            mode: "insensitive",
          },
          hotelId: hotelId || existingHighlight.hotelId,
          NOT: { id },
        },
      });

      if (existingTitle) {
        return NextResponse.json(
          {
            error:
              "Hotel highlight with this title already exists for this hotel",
            existingHighlight: {
              id: existingTitle.id,
              title: existingTitle.title,
            },
          },
          { status: 409 }
        );
      }
    }

    // ✅ Validation de l'existence du hotelId si fourni
    if (hotelId && hotelId !== existingHighlight.hotelId) {
      const hotelExists = await prisma.hotelCard.findUnique({
        where: { id: hotelId },
        select: { id: true },
      });

      if (!hotelExists) {
        return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
      }
    }

    if (category !== undefined) {
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
          {
            error: `Category must be one of: ${validCategories.join(", ")}`,
            received: category,
            validOptions: validCategories,
          },
          { status: 400 }
        );
      }
    }

    if (
      description !== undefined &&
      description !== null &&
      description.length > 1000
    ) {
      return NextResponse.json(
        { error: "Description must be less than 1000 characters" },
        { status: 400 }
      );
    }

    if (
      priority !== undefined &&
      (typeof priority !== "number" || priority < 0 || priority > 100)
    ) {
      return NextResponse.json(
        { error: "Priority must be a number between 0 and 100" },
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

    const updatedHighlight = await prisma.hotelHighlight.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(category !== undefined && { category: category.trim() }),
        ...(icon !== undefined && { icon: icon?.trim() || null }),
        ...(priority !== undefined && { priority }),
        ...(order !== undefined && { order }),
        ...(isPromoted !== undefined && { isPromoted }),
        ...(hotelId !== undefined && { hotelId }),
      },
      include: {
        _count: {
          select: {
            HotelCardToHotelHighlight: true,
          },
        },
      },
    });

    return NextResponse.json(updatedHighlight);
  } catch (error) {
    console.error("Error updating hotel highlight:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/hotel-highlight/[id] - Supprimer un highlight
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Vérifier si le highlight existe et récupérer les relations
    const existingHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCardToHotelHighlight: true,
          },
        },
      },
    });

    if (!existingHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des relations
    if (existingHighlight._count.HotelCardToHotelHighlight > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel highlight that is being used",
          usageCount: existingHighlight._count.HotelCardToHotelHighlight,
        },
        { status: 409 }
      );
    }

    await prisma.hotelHighlight.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hotel highlight deleted successfully",
      deletedHighlight: {
        id: existingHighlight.id,
        title: existingHighlight.title,
      },
    });
  } catch (error) {
    console.error("Error deleting hotel highlight:", error);
    return handlePrismaError(error);
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
            error: `Hotel highlight with this ${
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
            error: "Hotel highlight not found",
            prismaError: error.code,
          },
          { status: 404 }
        );
      case "P2003":
        return NextResponse.json(
          {
            error: "Invalid hotel reference",
            prismaError: error.code,
          },
          { status: 400 }
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
