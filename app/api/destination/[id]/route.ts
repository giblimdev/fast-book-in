import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/destination/[id] - Récupérer une destination par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        City: {
          include: {
            country: true,
            neighborhoods: true,
          },
        },
        DestinationToCity: {
          include: {
            city: {
              include: {
                country: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        HotelCard: includeHotels
          ? {
              select: {
                id: true,
                name: true,
                shortDescription: true,
                starRating: true,
                overallRating: true,
                reviewCount: true,
                basePricePerNight: true,
                currency: true,
                latitude: true,
                longitude: true,
              },
              orderBy: {
                overallRating: "desc",
              },
            }
          : false,
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}

// PUT /api/destination/[id] - Mettre à jour une destination
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const {
      name,
      type,
      cityId,
      description,
      popularityScore,
      order,
      latitude,
      longitude,
      radius,
    } = body;

    // Vérifier si la destination existe
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!existingDestination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Validation des coordonnées GPS si fournies
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }

    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      return NextResponse.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    // Validation du score de popularité
    if (
      popularityScore !== undefined &&
      (popularityScore < 0 || popularityScore > 100)
    ) {
      return NextResponse.json(
        { error: "Popularity score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Validation du rayon
    if (radius !== undefined && radius < 0) {
      return NextResponse.json(
        { error: "Radius must be positive" },
        { status: 400 }
      );
    }

    // Si cityId est fourni, vérifier que la ville existe
    if (cityId && cityId !== existingDestination.cityId) {
      const city = await prisma.city.findUnique({
        where: { id: cityId },
      });

      if (!city) {
        return NextResponse.json({ error: "City not found" }, { status: 404 });
      }
    }

    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(cityId && { cityId }),
        ...(description !== undefined && { description }),
        ...(popularityScore !== undefined && { popularityScore }),
        ...(order !== undefined && { order }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(radius !== undefined && { radius }),
      },
      include: {
        City: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error("Error updating destination:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Destination with this name already exists in this city" },
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
      { error: "Failed to update destination" },
      { status: 500 }
    );
  }
}

// DELETE /api/destination/[id] - Supprimer une destination
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la destination existe et récupérer les relations
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
      include: {
        HotelCard: true,
        DestinationToCity: true,
      },
    });

    if (!existingDestination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des entités associées
    const hasRelatedData =
      existingDestination.HotelCard.length > 0 ||
      existingDestination.DestinationToCity.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete destination with associated data",
          details: {
            hotelCards: existingDestination.HotelCard.length,
            cityLinks: existingDestination.DestinationToCity.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Destination deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
