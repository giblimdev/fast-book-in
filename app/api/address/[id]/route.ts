import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/address/[id] - Récupérer une adresse par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const address = await prisma.address.findUnique({
      where: { id },
      include: includeRelations
        ? {
            city: {
              include: {
                country: true,
              },
            },
            neighborhood: true,
            hotelDetails: {
              include: {
                HotelCard: {
                  include: {
                    accommodationType: true,
                    destination: true,
                    hotelGroup: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          }
        : {
            city: {
              include: {
                country: true,
              },
            },
            neighborhood: true,
          },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

// PUT /api/address/[id] - Mettre à jour une adresse
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const {
      streetNumber,
      streetName,
      addressLine2,
      postalCode,
      cityId,
      neighborhoodId,
    } = body;

    // Vérifier si l'adresse existe
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Validation du code postal si fourni
    if (postalCode && !/^\d{5}$/.test(postalCode)) {
      return NextResponse.json(
        { error: "Postal code must be 5 digits" },
        { status: 400 }
      );
    }

    // Vérifier que la ville existe si fournie
    if (cityId && cityId !== existingAddress.cityId) {
      const city = await prisma.city.findUnique({
        where: { id: cityId },
      });

      if (!city) {
        return NextResponse.json({ error: "City not found" }, { status: 404 });
      }
    }

    // Vérifier le quartier si fourni
    if (neighborhoodId) {
      const neighborhood = await prisma.neighborhood.findUnique({
        where: { id: neighborhoodId },
      });

      if (!neighborhood) {
        return NextResponse.json(
          { error: "Neighborhood not found" },
          { status: 404 }
        );
      }

      // Vérifier que le quartier appartient à la ville (existante ou nouvelle)
      const finalCityId = cityId || existingAddress.cityId;
      if (neighborhood.cityId !== finalCityId) {
        return NextResponse.json(
          { error: "Neighborhood does not belong to the specified city" },
          { status: 400 }
        );
      }
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        ...(streetNumber !== undefined && { streetNumber }),
        ...(streetName && { streetName }),
        ...(addressLine2 !== undefined && { addressLine2 }),
        ...(postalCode && { postalCode }),
        ...(cityId && { cityId }),
        ...(neighborhoodId !== undefined && { neighborhoodId }),
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
        neighborhood: true,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid city or neighborhood reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE /api/address/[id] - Supprimer une adresse
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'adresse existe et récupérer les relations
    const existingAddress = await prisma.address.findUnique({
      where: { id },
      include: {
        hotelDetails: true,
        user: true,
      },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Vérifier s'il y a des entités associées
    const hasRelatedData =
      existingAddress.hotelDetails.length > 0 ||
      existingAddress.user.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete address with associated data",
          details: {
            hotelDetails: existingAddress.hotelDetails.length,
            users: existingAddress.user.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
