import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/city/[id] - Récupérer une ville par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const city = await prisma.city.findUnique({
      where: { id },
      include: includeRelations
        ? {
            country: true,
            neighborhoods: {
              orderBy: { order: "asc" },
            },
            landmarks: {
              orderBy: { order: "asc" },
            },
            addresses: true,
            destinations: {
              orderBy: { order: "asc" },
            },
            DestinationToCity: {
              include: {
                destination: true,
              },
              orderBy: { order: "asc" },
            },
          }
        : {
            country: true,
          },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      { error: "Failed to fetch city" },
      { status: 500 }
    );
  }
}

// PUT /api/city/[id] - Mettre à jour une ville
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, countryId, order } = body;

    // Vérifier si la ville existe
    const existingCity = await prisma.city.findUnique({
      where: { id },
    });

    if (!existingCity) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    // Si countryId est fourni, vérifier que le pays existe
    if (countryId && countryId !== existingCity.countryId) {
      const country = await prisma.country.findUnique({
        where: { id: countryId },
      });

      if (!country) {
        return NextResponse.json(
          { error: "Country not found" },
          { status: 404 }
        );
      }
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(countryId && { countryId }),
        ...(order !== undefined && { order }),
      },
      include: {
        country: true,
      },
    });

    return NextResponse.json(updatedCity);
  } catch (error) {
    console.error("Error updating city:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "City with this name already exists in this country" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid country reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update city" },
      { status: 500 }
    );
  }
}

// DELETE /api/city/[id] - Supprimer une ville
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la ville existe et récupérer les relations
    const existingCity = await prisma.city.findUnique({
      where: { id },
      include: {
        neighborhoods: true,
        landmarks: true,
        addresses: true,
        destinations: true,
        DestinationToCity: true,
      },
    });

    if (!existingCity) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    // Vérifier s'il y a des entités associées
    const hasRelatedData =
      existingCity.neighborhoods.length > 0 ||
      existingCity.landmarks.length > 0 ||
      existingCity.addresses.length > 0 ||
      existingCity.destinations.length > 0 ||
      existingCity.DestinationToCity.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete city with associated data",
          details: {
            neighborhoods: existingCity.neighborhoods.length,
            landmarks: existingCity.landmarks.length,
            addresses: existingCity.addresses.length,
            destinations: existingCity.destinations.length,
            destinationLinks: existingCity.DestinationToCity.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "City deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { error: "Failed to delete city" },
      { status: 500 }
    );
  }
}
