import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/label/[id] - Récupérer un label par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const label = await prisma.label.findUnique({
      where: { id },
      include: {
        HotelDetails: {
          include: {
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
        HotelCardToLabel: includeHotels
          ? {
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
                  },
                },
              },
              orderBy: { order: "asc" },
            }
          : {
              select: {
                hotelCardId: true,
              },
            },
      },
    });

    if (!label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    return NextResponse.json(label);
  } catch (error) {
    console.error("Error fetching label:", error);
    return NextResponse.json(
      { error: "Failed to fetch label" },
      { status: 500 }
    );
  }
}

// PUT /api/label/[id] - Mettre à jour un label
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const {
      name,
      code,
      category,
      description,
      icon,
      color,
      priority,
      order,
      hotelDetailsId,
    } = body;

    // Vérifier si le label existe
    const existingLabel = await prisma.label.findUnique({
      where: { id },
    });

    if (!existingLabel) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    // Validation du code si fourni
    if (code && !/^[A-Z_]{2,20}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 2-20 uppercase letters or underscores" },
        { status: 400 }
      );
    }

    // Validation de la couleur si fournie
    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return NextResponse.json(
        { error: "Color must be a valid hex color (e.g., #FF0000)" },
        { status: 400 }
      );
    }

    // Validation de la priorité si fournie
    if (priority !== undefined && (priority < 0 || priority > 10)) {
      return NextResponse.json(
        { error: "Priority must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Si hotelDetailsId est fourni, vérifier qu'il existe
    if (hotelDetailsId && hotelDetailsId !== existingLabel.hotelDetailsId) {
      const hotelDetails = await prisma.hotelDetails.findUnique({
        where: { id: hotelDetailsId },
      });

      if (!hotelDetails) {
        return NextResponse.json(
          { error: "Hotel details not found" },
          { status: 404 }
        );
      }
    }

    const updatedLabel = await prisma.label.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(priority !== undefined && { priority }),
        ...(order !== undefined && { order }),
        ...(hotelDetailsId !== undefined && { hotelDetailsId }),
      },
      include: {
        HotelDetails: {
          include: {
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
      },
    });

    return NextResponse.json(updatedLabel);
  } catch (error) {
    console.error("Error updating label:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Label code already exists" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel details reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update label" },
      { status: 500 }
    );
  }
}

// DELETE /api/label/[id] - Supprimer un label
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si le label existe et récupérer les relations
    const existingLabel = await prisma.label.findUnique({
      where: { id },
      include: {
        HotelCardToLabel: true,
      },
    });

    if (!existingLabel) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    // Vérifier s'il y a des hôtels associés
    if (existingLabel.HotelCardToLabel.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete label with associated hotel cards",
          details: {
            hotelCardCount: existingLabel.HotelCardToLabel.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.label.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Label deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting label:", error);
    return NextResponse.json(
      { error: "Failed to delete label" },
      { status: 500 }
    );
  }
}
