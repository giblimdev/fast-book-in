import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-details/[id] - Récupérer des détails d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    const hotelDetails = await prisma.hotelDetails.findUnique({
      where: { id },
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
        RoomAmenity: includeAll
          ? {
              orderBy: { order: "asc" },
            }
          : {
              take: 5,
              orderBy: { order: "asc" },
            },
        Label: includeAll
          ? {
              orderBy: { order: "asc" },
            }
          : {
              take: 10,
              orderBy: { priority: "desc" },
            },
        HotelCard: {
          include: {
            accommodationType: true,
            destination: {
              include: {
                City: {
                  include: {
                    country: true,
                  },
                },
              },
            },
            hotelGroup: true,
            images: {
              take: includeAll ? undefined : 5,
              orderBy: { order: "asc" },
            },
          },
        },
        HotelDetailsToRoomAmenity: {
          include: {
            roomAmenity: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!hotelDetails) {
      return NextResponse.json(
        { error: "Hotel details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelDetails);
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel details" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-details/[id] - Mettre à jour des détails d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { idHotelCard, description, addressId, order } = body;

    // Vérifier si les détails d'hôtel existent
    const existingHotelDetails = await prisma.hotelDetails.findUnique({
      where: { id },
    });

    if (!existingHotelDetails) {
      return NextResponse.json(
        { error: "Hotel details not found" },
        { status: 404 }
      );
    }

    // Vérifier la nouvelle adresse si fournie
    if (addressId && addressId !== existingHotelDetails.addressId) {
      const address = await prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!address) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 }
        );
      }
    }

    // Vérifier l'unicité de idHotelCard si modifié
    if (idHotelCard && idHotelCard !== existingHotelDetails.idHotelCard) {
      const existingWithSameHotelCard = await prisma.hotelDetails.findFirst({
        where: {
          idHotelCard,
          id: { not: id },
        },
      });

      if (existingWithSameHotelCard) {
        return NextResponse.json(
          { error: "Hotel details already exist for this hotel card" },
          { status: 409 }
        );
      }
    }

    const updatedHotelDetails = await prisma.hotelDetails.update({
      where: { id },
      data: {
        ...(idHotelCard && { idHotelCard }),
        ...(description !== undefined && { description }),
        ...(addressId && { addressId }),
        ...(order !== undefined && { order }),
      },
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
      },
    });

    return NextResponse.json(updatedHotelDetails);
  } catch (error) {
    console.error("Error updating hotel details:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Hotel details with this hotel card ID already exist" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid address reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update hotel details" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-details/[id] - Supprimer des détails d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si les détails d'hôtel existent et récupérer les relations
    const existingHotelDetails = await prisma.hotelDetails.findUnique({
      where: { id },
      include: {
        HotelCard: true,
        HotelDetailsToRoomAmenity: true,
        Label: true,
        RoomAmenity: true,
      },
    });

    if (!existingHotelDetails) {
      return NextResponse.json(
        { error: "Hotel details not found" },
        { status: 404 }
      );
    }

    // ✅ Vérification corrigée : HotelCard est un objet unique, pas un tableau
    const hasRelatedData =
      existingHotelDetails.HotelCard !== null ||
      existingHotelDetails.HotelDetailsToRoomAmenity.length > 0 ||
      existingHotelDetails.Label.length > 0 ||
      existingHotelDetails.RoomAmenity.length > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel details with associated data",
          details: {
            hasHotelCard: existingHotelDetails.HotelCard !== null,
            roomAmenityLinks:
              existingHotelDetails.HotelDetailsToRoomAmenity.length,
            labels: existingHotelDetails.Label.length,
            directRoomAmenities: existingHotelDetails.RoomAmenity.length,
          },
        },
        { status: 409 }
      );
    }

    await prisma.hotelDetails.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel details deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel details:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel details" },
      { status: 500 }
    );
  }
}
