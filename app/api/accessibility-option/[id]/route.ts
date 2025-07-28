import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/accessibility-option/[id] - Récupérer une option par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const accessibilityOption = await prisma.accessibilityOption.findUnique({
      where: { id },
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
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                HotelCardToAccessibilityOption: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCardToAccessibilityOption: true,
              },
            },
          },
    });

    if (!accessibilityOption) {
      return NextResponse.json(
        { error: "Accessibility option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(accessibilityOption);
  } catch (error) {
    console.error("Error fetching accessibility option:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessibility option" },
      { status: 500 }
    );
  }
}

// PUT /api/accessibility-option/[id] - Mettre à jour une option
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, code, category, description, icon, order } = body;

    // Vérifier si l'option existe
    const existingOption = await prisma.accessibilityOption.findUnique({
      where: { id },
    });

    if (!existingOption) {
      return NextResponse.json(
        { error: "Accessibility option not found" },
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

      // Vérifier l'unicité du nom (exclure l'option actuelle)
      const existingName = await prisma.accessibilityOption.findFirst({
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
            error: "Accessibility option with this name already exists",
            existingOption: {
              id: existingName.id,
              name: existingName.name,
              code: existingName.code,
            },
          },
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
      if (!/^[A-Z0-9_]{1,50}$/.test(cleanCode)) {
        return NextResponse.json(
          {
            error:
              "Code must be 1-50 characters (uppercase letters, numbers, underscores only)",
          },
          { status: 400 }
        );
      }

      // Vérifier l'unicité du code (exclure l'option actuelle)
      const existingCode = await prisma.accessibilityOption.findFirst({
        where: {
          code: {
            equals: cleanCode,
            mode: "insensitive",
          },
          NOT: { id },
        },
      });

      if (existingCode) {
        return NextResponse.json(
          {
            error: "Accessibility option with this code already exists",
            existingOption: {
              id: existingCode.id,
              name: existingCode.name,
              code: existingCode.code,
            },
          },
          { status: 409 }
        );
      }
    }

    if (category !== undefined) {
      const validCategories = [
        "Mobility",
        "Visual",
        "Hearing",
        "Cognitive",
        "Physical",
        "Communication",
        "General",
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

    const updatedOption = await prisma.accessibilityOption.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(code !== undefined && { code: code.trim().toUpperCase() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(icon !== undefined && { icon: icon?.trim() || null }),
        ...(order !== undefined && { order }),
      },
      include: {
        _count: {
          select: {
            HotelCardToAccessibilityOption: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error("Error updating accessibility option:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/accessibility-option/[id] - Supprimer une option
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Vérifier si l'option existe et récupérer les relations
    const existingOption = await prisma.accessibilityOption.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCardToAccessibilityOption: true,
          },
        },
      },
    });

    if (!existingOption) {
      return NextResponse.json(
        { error: "Accessibility option not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des relations
    if (existingOption._count.HotelCardToAccessibilityOption > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete accessibility option that is being used",
          usageCount: existingOption._count.HotelCardToAccessibilityOption,
        },
        { status: 409 }
      );
    }

    await prisma.accessibilityOption.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Accessibility option deleted successfully",
      deletedOption: {
        id: existingOption.id,
        name: existingOption.name,
        code: existingOption.code,
      },
    });
  } catch (error) {
    console.error("Error deleting accessibility option:", error);
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
            error: `Accessibility option with this ${
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
            error: "Accessibility option not found",
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
