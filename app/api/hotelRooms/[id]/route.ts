// app/api/admin/hotelRooms/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/hotelRooms/[id] - Récupérer une chambre spécifique (admin)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const room = await prisma.hotelRoom.findUnique({
      where: { id },
      include: includeRelations
        ? {
            // ✅ Relations correctes selon votre schéma
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
              take: 10, // Dernières réservations
            },
            availability: {
              where: {
                date: {
                  gte: new Date(),
                },
              },
              orderBy: { date: "asc" },
              take: 30, // Prochains 30 jours
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
                  include: {
                    accommodationType: {
                      select: { name: true, category: true },
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
                      select: { name: true, type: true },
                    },
                    hotelGroup: {
                      select: { name: true },
                    },
                    images: {
                      take: 3,
                      include: {
                        image: {
                          select: {
                            path: true,
                            description: true,
                          },
                        },
                      },
                      select: {
                        alt: true,
                        order: true,
                      },
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

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // ✅ Statistiques basées sur les vraies relations
    let roomStats = null;
    if (room.HotelDetails?.HotelCard) {
      const hotelRoomStats = await prisma.hotelRoom.aggregate({
        where: {
          HotelDetails: {
            HotelCard: {
              id: room.HotelDetails.HotelCard.id,
            },
          },
        },
        _count: { id: true },
      });

      // Statistiques des réservations pour cette chambre
      const reservationStats = await prisma.reservation.aggregate({
        where: {
          hotelRoomId: id,
          status: { in: ["confirmed", "checked_in", "checked_out"] },
        },
        _count: { id: true },
      });

      roomStats = {
        totalRoomsInHotel: hotelRoomStats._count.id,
        totalReservations: reservationStats._count.id,
      };
    }

    return NextResponse.json({
      room,
      stats: roomStats,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/hotelRooms/[id] - Modifier une chambre (admin)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();

    const {
      slug,
      hotelDetailsId, // ✅ Seuls champs modifiables selon votre schéma
    } = body;

    // Vérifier si la chambre existe
    const existingRoom = await prisma.hotelRoom.findUnique({
      where: { id },
      include: {
        HotelDetails: {
          include: {
            HotelCard: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // ✅ Validation pour hotelDetailsId si fourni
    if (hotelDetailsId && hotelDetailsId !== existingRoom.hotelDetailsId) {
      const hotelDetailsExists = await prisma.hotelDetails.findUnique({
        where: { id: hotelDetailsId },
        select: { id: true },
      });

      if (!hotelDetailsExists) {
        return NextResponse.json(
          { error: "Hotel details not found" },
          { status: 404 }
        );
      }
    }

    // ✅ Validation du slug si fourni
    if (slug && slug !== existingRoom.slug) {
      const existingSlug = await prisma.hotelRoom.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: "Room with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // ✅ Mettre à jour la chambre (seulement les champs existants)
    const updatedRoom = await prisma.hotelRoom.update({
      where: { id },
      data: {
        ...(slug !== undefined && { slug }),
        ...(hotelDetailsId !== undefined && { hotelDetailsId }),
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

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Room with this slug already exists" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference in update" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/hotelRooms/[id] - Supprimer une chambre (admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la chambre existe et récupérer les dépendances
    const existingRoom = await prisma.hotelRoom.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: {
              in: ["confirmed", "checked_in"], // ✅ Réservations actives
            },
          },
          select: { id: true },
        },
        availability: {
          select: { id: true },
        },
        RoomUnavailability: {
          select: { id: true },
        },
        HotelDetails: {
          include: {
            HotelCard: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // ✅ Vérifier s'il y a des réservations actives
    if (existingRoom.reservations.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete room with active reservations",
          activeReservations: existingRoom.reservations.length,
        },
        { status: 409 }
      );
    }

    // ✅ Supprimer les dépendances en cascade
    if (existingRoom.availability.length > 0) {
      await prisma.calendarAvailability.deleteMany({
        where: { hotelRoomId: id },
      });
    }

    if (existingRoom.RoomUnavailability.length > 0) {
      await prisma.roomUnavailability.deleteMany({
        where: { hotelRoomId: id },
      });
    }

    // Supprimer la chambre
    await prisma.hotelRoom.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Room deleted successfully",
        deletedRoom: {
          id,
          slug: existingRoom.slug,
          hotelName: existingRoom.HotelDetails?.HotelCard?.name || "Unknown",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
