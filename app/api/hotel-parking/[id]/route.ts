import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-parking/[id] - Récupérer une option par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const hotelParking = await prisma.hotelParking.findUnique({
      where: { id },
      include: includeRelations
        ? {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
              },
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

    if (!hotelParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelParking);
  } catch (error) {
    console.error("Error fetching hotel parking:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel parking" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-parking/[id] - Mettre à jour une option
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, isAvailable, spaces, notes, order } = body;

    // Vérifier si l'option existe
    const existingParking = await prisma.hotelParking.findUnique({
      where: { id },
    });

    if (!existingParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    // Validation des données - name est maintenant requis selon le schéma
    if (name !== undefined) {
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
    }

    if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
      return NextResponse.json(
        { error: "isAvailable must be a boolean" },
        { status: 400 }
      );
    }

    if (spaces !== undefined && spaces !== null) {
      const spacesNum = parseInt(spaces);
      if (isNaN(spacesNum) || spacesNum < 0 || spacesNum > 10000) {
        return NextResponse.json(
          { error: "Spaces must be a number between 0 and 10000" },
          { status: 400 }
        );
      }
    }

    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes must be a string" },
        { status: 400 }
      );
    }

    if (notes && notes.length > 1000) {
      return NextResponse.json(
        { error: "Notes must be less than 1000 characters" },
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

    const updatedParking = await prisma.hotelParking.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(spaces !== undefined && { spaces: spaces || null }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
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

    return NextResponse.json(updatedParking);
  } catch (error) {
    console.error("Error updating hotel parking:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/hotel-parking/[id] - Supprimer une option
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Vérifier si l'option existe et récupérer les relations
    const existingParking = await prisma.hotelParking.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    if (!existingParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des relations
    if (existingParking._count.HotelCard > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel parking that is being used",
          usageCount: existingParking._count.HotelCard,
          details: `This parking is currently associated with ${existingParking._count.HotelCard} hotel(s). Please remove these associations before deleting.`,
        },
        { status: 409 }
      );
    }

    await prisma.hotelParking.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hotel parking deleted successfully",
      deletedParking: {
        id: existingParking.id,
        name: existingParking.name,
        spaces: existingParking.spaces,
      },
    });
  } catch (error) {
    console.error("Error deleting hotel parking:", error);
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
            error: `Hotel parking with this ${
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
            error: "Hotel parking not found",
            prismaError: error.code,
          },
          { status: 404 }
        );
      case "P2003":
        return NextResponse.json(
          {
            error: "Cannot delete hotel parking due to foreign key constraint",
            prismaError: error.code,
            details: "This parking is still referenced by other records",
          },
          { status: 409 }
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
