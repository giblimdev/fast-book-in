import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/neighborhood - Récupérer tous les quartiers
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");
    const includeRelations = searchParams.get("include") === "true";
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (cityId) {
      whereClause.cityId = cityId;
    }

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const neighborhoods = await prisma.neighborhood.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }],
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

    // ✅ Si on veut inclure les adresses, on fait une requête séparée
    let neighborhoodsWithAddresses = neighborhoods;
    if (includeRelations) {
      neighborhoodsWithAddresses = await Promise.all(
        neighborhoods.map(async (neighborhood) => {
          const addresses = await prisma.address.findMany({
            where: { neighborhoodId: neighborhood.id },
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
            orderBy: { streetName: "asc" },
          });

          return {
            ...neighborhood,
            addresses,
            _count: {
              addresses: addresses.length,
            },
          };
        })
      );
    }

    // ✅ Statistiques globales
    const totalCount = await prisma.neighborhood.count({ where: whereClause });

    const cityStats = cityId
      ? await prisma.neighborhood.groupBy({
          by: ["cityId"],
          where: { cityId },
          _count: { id: true },
        })
      : null;

    return NextResponse.json({
      neighborhoods: neighborhoodsWithAddresses,
      meta: {
        total: totalCount,
        cityCount: cityStats?.[0]?._count.id || totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return NextResponse.json(
      { error: "Failed to fetch neighborhoods" },
      { status: 500 }
    );
  }
}

// POST /api/neighborhood - Créer un nouveau quartier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cityId, order } = body;

    // ✅ Validation renforcée
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!cityId || typeof cityId !== "string") {
      return NextResponse.json(
        { error: "CityId is required and must be a string" },
        { status: 400 }
      );
    }

    if (name.trim().length > 255) {
      return NextResponse.json(
        { error: "Name must be less than 255 characters" },
        { status: 400 }
      );
    }

    if (
      order !== undefined &&
      (typeof order !== "number" || order < 0 || order > 9999)
    ) {
      return NextResponse.json(
        { error: "Order must be a number between 0 and 9999" },
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

    // ✅ Vérifier l'unicité du nom dans la ville
    const existingNeighborhood = await prisma.neighborhood.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        cityId,
      },
    });

    if (existingNeighborhood) {
      return NextResponse.json(
        {
          error: "Neighborhood with this name already exists in this city",
          existing: {
            id: existingNeighborhood.id,
            name: existingNeighborhood.name,
          },
        },
        { status: 409 }
      );
    }

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: name.trim(),
        cityId,
        order: order || 100,
      },
      include: {
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
      },
    });

    return NextResponse.json(neighborhood, { status: 201 });
  } catch (error) {
    console.error("Error creating neighborhood:", error);

    // Gestion des erreurs Prisma
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
      { error: "Failed to create neighborhood" },
      { status: 500 }
    );
  }
}
