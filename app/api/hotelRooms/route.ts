// app/api/admin/hotelRooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/hotelRooms - Récupérer toutes les chambres (vue admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "id";
    const order = searchParams.get("order") || "desc";
    const hotelDetailsId = searchParams.get("hotelDetailsId");
    const slug = searchParams.get("slug");
    const includeRelations = searchParams.get("include") === "true";

    const skip = (page - 1) * limit;

    // ✅ Construction de la clause WHERE avec les vrais champs
    const whereClause: any = {};
    if (hotelDetailsId) whereClause.hotelDetailsId = hotelDetailsId;
    if (slug) whereClause.slug = { contains: slug, mode: "insensitive" };

    // ✅ Tri seulement sur les champs existants
    const validSortFields = ["id", "slug", "hotelDetailsId"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

    const rooms = await prisma.hotelRoom.findMany({
      where: whereClause,
      orderBy: { [finalSortBy]: order as "asc" | "desc" },
      skip,
      take: limit,
      include: includeRelations
        ? {
            reservations: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: { checkIn: "desc" },
              take: 5,
            },
            availability: {
              where: {
                date: {
                  gte: new Date(),
                },
              },
              orderBy: { date: "asc" },
              take: 30,
            },
            RoomUnavailability: {
              where: {
                endDate: {
                  gte: new Date(),
                },
              },
              orderBy: { startDate: "asc" },
            },
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
                HotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    accommodationType: {
                      select: { name: true },
                    },
                    destination: {
                      include: {
                        DestinationToCity: {
                          include: {
                            city: {
                              include: {
                                country: true,
                              },
                            },
                          },
                        },
                      },
                      select: { name: true },
                    },
                  },
                },
              },
            },
          }
        : {
            HotelDetails: {
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
    });

    // Comptage total
    const total = await prisma.hotelRoom.count({ where: whereClause });

    // ✅ Statistiques basées sur les vraies relations
    const reservationStats = await prisma.reservation.aggregate({
      where: {
        hotelRoom: {
          ...whereClause,
        },
      },
      _count: { id: true },
      _avg: { totalPrice: true },
    });

    // Statistiques de disponibilité future
    const availabilityStats = await prisma.calendarAvailability.groupBy({
      by: ["isAvailable"],
      where: {
        hotelRoom: {
          ...whereClause,
        },
        date: {
          gte: new Date(),
        },
      },
      _count: { isAvailable: true },
    });

    return NextResponse.json({
      rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      statistics: {
        total,
        totalReservations: reservationStats._count.id || 0,
        averageReservationPrice: reservationStats._avg.totalPrice || 0,
        availability: {
          available:
            availabilityStats.find((s) => s.isAvailable)?._count.isAvailable ||
            0,
          unavailable:
            availabilityStats.find((s) => !s.isAvailable)?._count.isAvailable ||
            0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// POST /api/admin/hotelRooms - Créer une nouvelle chambre (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelDetailsId, slug } = body;

    // ✅ Validation basique selon le vrai schéma
    if (!hotelDetailsId) {
      return NextResponse.json(
        { error: "hotelDetailsId is required" },
        { status: 400 }
      );
    }

    // ✅ Vérifier si les détails d'hôtel existent
    const hotelDetailsExists = await prisma.hotelDetails.findUnique({
      where: { id: hotelDetailsId },
      include: {
        HotelCard: {
          select: { id: true, name: true },
        },
      },
    });

    if (!hotelDetailsExists) {
      return NextResponse.json(
        { error: "Hotel details not found" },
        { status: 404 }
      );
    }

    // ✅ Vérifier l'unicité du slug si fourni
    if (slug) {
      const existingSlug = await prisma.hotelRoom.findFirst({
        where: { slug },
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: "Room with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // ✅ Créer la chambre avec les vrais champs
    const room = await prisma.hotelRoom.create({
      data: {
        hotelDetailsId,
        slug: slug || null,
      },
      include: {
        HotelDetails: {
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
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Room with this slug already exists" },
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
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
