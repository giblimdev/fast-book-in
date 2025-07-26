// app/api/admin/hotelRooms/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/rooms/[id] - Récupérer une chambre spécifique (admin)
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
                images: {
                  take: 3,
                  select: { imageUrl: true, alt: true },
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

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Statistiques additionnelles pour cette chambre
    const hotelRoomStats = await prisma.hotelRoom.aggregate({
      where: { hotelCardId: room.hotelCardId },
      _avg: { pricePerNight: true },
      _count: { id: true },
    });

    return NextResponse.json({
      room,
      hotelStats: {
        averageRoomPrice: hotelRoomStats._avg.pricePerNight,
        totalRooms: hotelRoomStats._count.id,
      },
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/rooms/[id] - Modifier une chambre (admin)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();

    const {
      name,
      description,
      maxGuests,
      bedCount,
      bedType,
      roomSize,
      pricePerNight,
      currency,
      isAvailable,
      images,
    } = body;

    // Vérifier si la chambre existe
    const existingRoom = await prisma.hotelRoom.findUnique({
      where: { id },
      select: { hotelCardId: true },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Validation des nombres si fournis
    if (maxGuests !== undefined && maxGuests < 1) {
      return NextResponse.json(
        { error: "maxGuests must be at least 1" },
        { status: 400 }
      );
    }

    if (bedCount !== undefined && bedCount < 1) {
      return NextResponse.json(
        { error: "bedCount must be at least 1" },
        { status: 400 }
      );
    }

    if (pricePerNight !== undefined && pricePerNight < 0) {
      return NextResponse.json(
        { error: "pricePerNight must be non-negative" },
        { status: 400 }
      );
    }

    if (roomSize !== undefined && roomSize <= 0) {
      return NextResponse.json(
        { error: "roomSize must be greater than 0" },
        { status: 400 }
      );
    }

    // Mettre à jour la chambre
    const updatedRoom = await prisma.hotelRoom.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(maxGuests !== undefined && { maxGuests: Number(maxGuests) }),
        ...(bedCount !== undefined && { bedCount: Number(bedCount) }),
        ...(bedType && { bedType }),
        ...(roomSize !== undefined && {
          roomSize: roomSize ? Number(roomSize) : null,
        }),
        ...(pricePerNight !== undefined && {
          pricePerNight: Number(pricePerNight),
        }),
        ...(currency && { currency }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        ...(images !== undefined && { images }),
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

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    if (error && typeof error === "object" && "code" in error) {
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

// DELETE /api/admin/rooms/[id] - Supprimer une chambre (admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la chambre existe
    const existingRoom = await prisma.hotelRoom.findUnique({
      where: { id },
      select: {
        hotelCardId: true,
        name: true,
        hotelCard: {
          select: { name: true },
        },
      },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // TODO: Vérifier s'il y a des réservations actives pour cette chambre
    // Cela dépendra de votre modèle de réservation futur

    // Supprimer la chambre
    await prisma.hotelRoom.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Room deleted successfully",
        deletedRoom: {
          id,
          name: existingRoom.name,
          hotel: existingRoom.hotelCard.name,
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
