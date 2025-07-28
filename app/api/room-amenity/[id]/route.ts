import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/room-amenity/[id] - Récupérer un équipement par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const roomAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
      include: includeRelations
        ? {
            HotelDetails: {
              include: {
                HotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                  },
                },
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
            HotelDetailsToRoomAmenity: {
              include: {
                hotelDetails: {
                  include: {
                    HotelCard: {
                      select: {
                        id: true,
                        name: true,
                        starRating: true,
                      },
                    },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                HotelDetails: true,
                HotelDetailsToRoomAmenity: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelDetails: true,
                HotelDetailsToRoomAmenity: true,
              },
            },
          },
    });

    if (!roomAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(roomAmenity);
  } catch (error) {
    console.error("Error fetching room amenity:", error);
    return NextResponse.json(
      { error: "Failed to fetch room amenity" },
      { status: 500 }
    );
  }
}

// PUT /api/room-amenity/[id] - Mettre à jour un équipement
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // Vérifier si l'équipement existe
    const existingAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
    });

    if (!existingAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
        { status: 404 }
      );
    }

    // Validation des données
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

      // Vérifier l'unicité du nom (exclure l'équipement actuel)
      const existingName = await prisma.roomAmenity.findFirst({
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
            error: "Room amenity with this name already exists",
            existingAmenity: {
              id: existingName.id,
              name: existingName.name,
            },
          },
          { status: 409 }
        );
      }
    }

    if (category !== undefined) {
      const validCategories = [
        "Comfort",
        "Technology",
        "Entertainment",
        "Bathroom",
        "Kitchen",
        "Bedroom",
        "Safety",
        "Accessibility",
        "Climate",
        "Storage",
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
      order !== undefined &&
      (typeof order !== "number" || order < 0 || order > 9999)
    ) {
      return NextResponse.json(
        { error: "Order must be a number between 0 and 9999" },
        { status: 400 }
      );
    }

    const updatedAmenity = await prisma.roomAmenity.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(icon !== undefined && { icon: icon?.trim() || null }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(order !== undefined && { order }),
      },
      include: {
        _count: {
          select: {
            HotelDetails: true,
            HotelDetailsToRoomAmenity: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAmenity);
  } catch (error) {
    console.error("Error updating room amenity:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/room-amenity/[id] - Supprimer un équipement
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Vérifier si l'équipement existe et récupérer les relations
    const existingAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelDetails: true,
            HotelDetailsToRoomAmenity: true,
          },
        },
      },
    });

    if (!existingAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des relations
    const totalUsage =
      existingAmenity._count.HotelDetails +
      existingAmenity._count.HotelDetailsToRoomAmenity;
    if (totalUsage > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete room amenity that is being used",
          usageCount: totalUsage,
          details: {
            directRelations: existingAmenity._count.HotelDetails,
            relationshipTable: existingAmenity._count.HotelDetailsToRoomAmenity,
          },
        },
        { status: 409 }
      );
    }

    await prisma.roomAmenity.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Room amenity deleted successfully",
      deletedAmenity: {
        id: existingAmenity.id,
        name: existingAmenity.name,
      },
    });
  } catch (error) {
    console.error("Error deleting room amenity:", error);
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
            error: `Room amenity with this ${
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
            error: "Room amenity not found",
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
