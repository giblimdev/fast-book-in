// app/api/admin/policies/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/policies/[id] - Récupérer une politique spécifique (admin)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const policy = await prisma.hotelPolicy.findUnique({
      where: { id },
      include: includeRelations
        ? {
            hotelCard: {
              include: {
                accommodationType: {
                  select: { name: true, category: true },
                },
                destination: {
                  select: { name: true, type: true },
                },
                hotelGroup: {
                  select: { name: true },
                },
              },
            },
          }
        : {
            hotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
              },
            },
          },
    });

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error("Error fetching policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch policy" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/policies/[id] - Modifier une politique (admin)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();

    const {
      checkIn,
      checkOut,
      cancellation,
      pets,
      smoking,
      parties,
      children,
      extraBed,
      breakfast,
    } = body;

    // Vérifier si la politique existe
    const existingPolicy = await prisma.hotelPolicy.findUnique({
      where: { id },
      select: { hotelCardId: true },
    });

    if (!existingPolicy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Validation du format des heures si fourni
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (checkIn && !timeRegex.test(checkIn)) {
      return NextResponse.json(
        { error: "CheckIn time must be in HH:MM format" },
        { status: 400 }
      );
    }

    if (checkOut && !timeRegex.test(checkOut)) {
      return NextResponse.json(
        { error: "CheckOut time must be in HH:MM format" },
        { status: 400 }
      );
    }

    // Validation du texte d'annulation si fourni
    if (cancellation && cancellation.length < 10) {
      return NextResponse.json(
        { error: "Cancellation policy must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Mettre à jour la politique
    const updatedPolicy = await prisma.hotelPolicy.update({
      where: { id },
      data: {
        ...(checkIn && { checkIn }),
        ...(checkOut && { checkOut }),
        ...(cancellation && { cancellation }),
        ...(pets !== undefined && { pets: Boolean(pets) }),
        ...(smoking !== undefined && { smoking: Boolean(smoking) }),
        ...(parties !== undefined && { parties: Boolean(parties) }),
        ...(children !== undefined && { children }),
        ...(extraBed !== undefined && { extraBed }),
        ...(breakfast !== undefined && { breakfast }),
      },
      include: {
        hotelCard: {
          select: {
            id: true,
            name: true,
            starRating: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPolicy);
  } catch (error) {
    console.error("Error updating policy:", error);
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference in update" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update policy" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/policies/[id] - Supprimer une politique (admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la politique existe
    const existingPolicy = await prisma.hotelPolicy.findUnique({
      where: { id },
      select: {
        hotelCardId: true,
        hotelCard: {
          select: { name: true },
        },
      },
    });

    if (!existingPolicy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Supprimer la politique
    await prisma.hotelPolicy.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Policy deleted successfully",
        deletedPolicy: {
          id,
          hotel: existingPolicy.hotelCard.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting policy:", error);
    return NextResponse.json(
      { error: "Failed to delete policy" },
      { status: 500 }
    );
  }
}
