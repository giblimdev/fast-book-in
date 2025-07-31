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
            images: {
              include: {
                image: {
                  select: {
                    path: true,
                    description: true,
                  },
                },
              },
              orderBy: { order: "asc" },
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

    // ✅ Si on veut récupérer les adresses, on fait une requête séparée
    let addressesInNeighborhood = null;
    if (includeRelations) {
      addressesInNeighborhood = await prisma.address.findMany({
        where: { neighborhoodId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
        orderBy: {
          streetName: "asc",
        },
      });
    }

    return NextResponse.json({
      ...neighborhood,
      ...(includeRelations && { addresses: addressesInNeighborhood }),
    });
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

    // ✅ Validation du nom si fourni
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

      // Vérifier l'unicité du nom dans la ville
      const cityIdToCheck = cityId || existingNeighborhood.cityId;
      const existingName = await prisma.neighborhood.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
          cityId: cityIdToCheck,
          NOT: { id },
        },
      });

      if (existingName) {
        return NextResponse.json(
          { error: "Neighborhood with this name already exists in this city" },
          { status: 409 }
        );
      }
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

    // ✅ Validation de l'ordre
    if (
      order !== undefined &&
      (typeof order !== "number" || order < 0 || order > 9999)
    ) {
      return NextResponse.json(
        { error: "Order must be a number between 0 and 9999" },
        { status: 400 }
      );
    }

    const updatedNeighborhood = await prisma.neighborhood.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
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

    // Vérifier si le quartier existe
    const existingNeighborhood = await prisma.neighborhood.findUnique({
      where: { id },
      include: {
        images: {
          select: { id: true },
        },
      },
    });

    if (!existingNeighborhood) {
      return NextResponse.json(
        { error: "Neighborhood not found" },
        { status: 404 }
      );
    }

    // ✅ Vérifier s'il y a des adresses associées (requête séparée)
    const addressesUsingNeighborhood = await prisma.address.findMany({
      where: { neighborhoodId: id },
      select: { id: true },
    });

    if (addressesUsingNeighborhood.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete neighborhood with associated addresses",
          details: {
            addressCount: addressesUsingNeighborhood.length,
          },
        },
        { status: 409 }
      );
    }

    // ✅ Supprimer les images associées si nécessaire
    if (existingNeighborhood.images.length > 0) {
      await prisma.galleryImage.deleteMany({
        where: { neighborhoodId: id },
      });
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
