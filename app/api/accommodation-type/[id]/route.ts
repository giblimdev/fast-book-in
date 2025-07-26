import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/accommodation-type/[id] - Récupérer un type d'hébergement par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const accommodationType = await prisma.accommodationType.findUnique({
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
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
          }
        : undefined,
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

// PUT /api/accommodation-type/[id] - Mettre à jour un type d'hébergement
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, code, category, description, order } = body;

    // Vérifier si le type d'hébergement existe
    const existingAccommodationType = await prisma.accommodationType.findUnique(
      {
        where: { id },
      }
    );

    if (!existingAccommodationType) {
      return NextResponse.json(
        { error: "Accommodation type not found" },
        { status: 404 }
      );
    }

    // Validation du code si fourni
    if (code && !/^[A-Z_]{2,10}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 2-10 uppercase letters or underscores" },
        { status: 400 }
      );
    }

    const updatedAccommodationType = await prisma.accommodationType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedAccommodationType);
  } catch (error) {
    console.error("Error updating accommodation type:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Accommodation type code already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update accommodation type" },
      { status: 500 }
    );
  }
}

// DELETE /api/accommodation-type/[id] - Supprimer un type d'hébergement
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si le type d'hébergement existe et récupérer les hôtels associés
    const existingAccommodationType = await prisma.accommodationType.findUnique(
      {
        where: { id },
        include: {
          HotelCard: true,
        },
      }
    );

    if (!existingAccommodationType) {
      return NextResponse.json(
        { error: "Accommodation type not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des hôtels associés
    if (existingAccommodationType.HotelCard.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete accommodation type with associated hotels",
          details: {
            hotelCount: existingAccommodationType.HotelCard.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.accommodationType.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Accommodation type deleted successfully" },
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
