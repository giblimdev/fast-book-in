import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/neighborhood/[id] - Récupérer un quartier par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id },
      include: includeRelations
        ? {
            city: {
              include: {
                country: true,
              },
            },
            addresses: {
              include: {
                user: true,
                hotelDetails: true,
              },
              orderBy: {
                streetName: "asc",
              },
            },
          }
        : {
            city: {
              include: {
                country: true,
              },
            },
          },
    });

    if (!neighborhood) {
      return NextResponse.json(
        { error: "Neighborhood not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(neighborhood);
  } catch (error) {
    console.error("Error fetching neighborhood:", error);
    return NextResponse.json(
      { error: "Failed to fetch neighborhood" },
      { status: 500 }
    );
  }
}

// PUT /api/neighborhood/[id] - Mettre à jour un quartier
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, cityId, order } = body;

    // Vérifier si le quartier existe
    const existingNeighborhood = await prisma.neighborhood.findUnique({
      where: { id },
    });

    if (!existingNeighborhood) {
      return NextResponse.json(
        { error: "Neighborhood not found" },
        { status: 404 }
      );
    }

    // Si cityId est fourni, vérifier que la ville existe
    if (cityId && cityId !== existingNeighborhood.cityId) {
      const city = await prisma.city.findUnique({
        where: { id: cityId },
      });

      if (!city) {
        return NextResponse.json({ error: "City not found" }, { status: 404 });
      }
    }

    const updatedNeighborhood = await prisma.neighborhood.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(cityId && { cityId }),
        ...(order !== undefined && { order }),
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(updatedNeighborhood);
  } catch (error) {
    console.error("Error updating neighborhood:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Neighborhood with this name already exists in this city" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid city reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update neighborhood" },
      { status: 500 }
    );
  }
}

// DELETE /api/neighborhood/[id] - Supprimer un quartier
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si le quartier existe et récupérer les relations
    const existingNeighborhood = await prisma.neighborhood.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });

    if (!existingNeighborhood) {
      return NextResponse.json(
        { error: "Neighborhood not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des adresses associées
    if (existingNeighborhood.addresses.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete neighborhood with associated addresses",
          details: {
            addressCount: existingNeighborhood.addresses.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.neighborhood.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Neighborhood deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting neighborhood:", error);
    return NextResponse.json(
      { error: "Failed to delete neighborhood" },
      { status: 500 }
    );
  }
}
