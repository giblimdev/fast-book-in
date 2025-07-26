import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/accessibility-option/[id] - Récupérer une option d'accessibilité par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const accessibilityOption = await prisma.accessibilityOption.findUnique({
      where: { id },
      include: includeHotels
        ? {
            HotelCardToAccessibilityOption: {
              include: {
                hotelCard: {
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
                },
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            HotelCardToAccessibilityOption: {
              select: {
                hotelCardId: true,
                order: true,
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

// PUT /api/accessibility-option/[id] - Mettre à jour une option d'accessibilité
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, code, category, description, icon, order } = body;

    // Vérifier si l'option d'accessibilité existe
    const existingAccessibilityOption =
      await prisma.accessibilityOption.findUnique({
        where: { id },
      });

    if (!existingAccessibilityOption) {
      return NextResponse.json(
        { error: "Accessibility option not found" },
        { status: 404 }
      );
    }

    // Validation du code si fourni
    if (code && !/^[A-Z_]{2,20}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 2-20 uppercase letters or underscores" },
        { status: 400 }
      );
    }

    const updatedAccessibilityOption = await prisma.accessibilityOption.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedAccessibilityOption);
  } catch (error) {
    console.error("Error updating accessibility option:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Accessibility option code already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update accessibility option" },
      { status: 500 }
    );
  }
}

// DELETE /api/accessibility-option/[id] - Supprimer une option d'accessibilité
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'option d'accessibilité existe et récupérer les relations
    const existingAccessibilityOption =
      await prisma.accessibilityOption.findUnique({
        where: { id },
        include: {
          HotelCardToAccessibilityOption: true,
        },
      });

    if (!existingAccessibilityOption) {
      return NextResponse.json(
        { error: "Accessibility option not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    if (existingAccessibilityOption.HotelCardToAccessibilityOption.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete accessibility option with associated hotel cards",
          details: {
            hotelCardCount:
              existingAccessibilityOption.HotelCardToAccessibilityOption.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.accessibilityOption.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Accessibility option deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting accessibility option:", error);
    return NextResponse.json(
      { error: "Failed to delete accessibility option" },
      { status: 500 }
    );
  }
}
