import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/address - Récupérer toutes les adresses
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    const neighborhoodId = searchParams.get("neighborhoodId");
    const postalCode = searchParams.get("postalCode");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (cityId) whereClause.cityId = cityId;
    if (neighborhoodId) whereClause.neighborhoodId = neighborhoodId;
    if (postalCode) whereClause.postalCode = postalCode;

    const addresses = await prisma.address.findMany({
      where: whereClause,
      orderBy: [{ streetName: "asc" }, { streetNumber: "asc" }],
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
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST /api/address - Créer une nouvelle adresse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      streetNumber,
      streetName,
      addressLine2,
      postalCode,
      cityId,
      neighborhoodId,
    } = body;

    // Validation basique
    if (!streetName || !postalCode || !cityId) {
      return NextResponse.json(
        { error: "Street name, postal code and cityId are required" },
        { status: 400 }
      );
    }

    // Validation du code postal (format français basique)
    if (!/^\d{5}$/.test(postalCode)) {
      return NextResponse.json(
        { error: "Postal code must be 5 digits" },
        { status: 400 }
      );
    }

    // Vérifier que la ville existe
    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: {
        country: true,
      },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    // Vérifier que le quartier existe s'il est fourni
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

      // Vérifier que le quartier appartient à la ville
      if (neighborhood.cityId !== cityId) {
        return NextResponse.json(
          { error: "Neighborhood does not belong to the specified city" },
          { status: 400 }
        );
      }
    }

    const address = await prisma.address.create({
      data: {
        streetNumber,
        streetName,
        addressLine2,
        postalCode,
        cityId,
        neighborhoodId,
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

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);

    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid city or neighborhood reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
