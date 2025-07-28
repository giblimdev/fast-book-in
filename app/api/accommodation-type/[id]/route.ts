// @/app/api/accommodation-type/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/accommodation-type/[id]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const accommodationType = await prisma.accommodationType.findUnique({
      where: { id },
      include: {
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
      },
    });

    if (!accommodationType) {
      return NextResponse.json(
        { error: "Accommodation type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(accommodationType);
  } catch (error) {
    console.error("Error fetching accommodation type:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodation type" },
      { status: 500 }
    );
  }
}

// PUT /api/accommodation-type/[id]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, code, category, description, order } = body;

    // Vérifier si le type existe
    const existingType = await prisma.accommodationType.findUnique({
      where: { id },
    });

    if (!existingType) {
      return NextResponse.json(
        { error: "Accommodation type not found" },
        { status: 404 }
      );
    }

    // Validations (identiques au POST mais optionnelles)
    if (name !== undefined) {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }

      // Vérifier l'unicité du nom (sauf si c'est le même)
      const nameExists = await prisma.accommodationType.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
          NOT: { id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Accommodation type with this name already exists" },
          { status: 409 }
        );
      }
    }

    if (code !== undefined) {
      if (!code || typeof code !== "string" || code.trim().length === 0) {
        return NextResponse.json(
          { error: "Code must be a non-empty string" },
          { status: 400 }
        );
      }

      const cleanCode = code.trim().toUpperCase();
      if (!/^[A-Z0-9_]{2,50}$/.test(cleanCode)) {
        return NextResponse.json(
          {
            error:
              "Code must be 2-50 characters (uppercase letters, numbers, underscores only)",
          },
          { status: 400 }
        );
      }

      // Vérifier l'unicité du code (seulement si changé)
      if (cleanCode !== existingType.code) {
        const codeExists = await prisma.accommodationType.findFirst({
          where: {
            code: {
              equals: cleanCode,
              mode: "insensitive",
            },
            NOT: { id },
          },
        });

        if (codeExists) {
          return NextResponse.json(
            { error: "Accommodation type with this code already exists" },
            { status: 409 }
          );
        }
      }
    }

    const updatedType = await prisma.accommodationType.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(code !== undefined && { code: code.trim().toUpperCase() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(order !== undefined && { order: order ? parseInt(order) : 100 }),
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    return NextResponse.json(updatedType);
  } catch (error) {
    console.error("Error updating accommodation type:", error);
    return NextResponse.json(
      { error: "Failed to update accommodation type" },
      { status: 500 }
    );
  }
}

// DELETE /api/accommodation-type/[id]
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Vérifier si le type existe et s'il est utilisé
    const existingType = await prisma.accommodationType.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    if (!existingType) {
      return NextResponse.json(
        { error: "Accommodation type not found" },
        { status: 404 }
      );
    }

    // Empêcher la suppression si utilisé
    if (existingType._count.HotelCard > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete accommodation type with associated hotels",
          details: {
            hotelCards: existingType._count.HotelCard,
            typeName: existingType.name,
            typeCode: existingType.code,
          },
        },
        { status: 409 }
      );
    }

    await prisma.accommodationType.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Accommodation type deleted successfully",
        deletedType: {
          id: existingType.id,
          name: existingType.name,
          code: existingType.code,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting accommodation type:", error);
    return NextResponse.json(
      { error: "Failed to delete accommodation type" },
      { status: 500 }
    );
  }
}
