import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-card/[id] - Récupérer une carte d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    const hotelCard = await prisma.hotelCard.findUnique({
      where: { id },
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
        parking: true,
        images: {
          orderBy: { order: "asc" },
        },
        details: {
          include: {
            address: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
                neighborhood: true,
              },
            },
            RoomAmenity: includeAll
              ? {
                  orderBy: { order: "asc" },
                }
              : undefined,
            HotelDetailsToRoomAmenity: includeAll
              ? {
                  include: {
                    roomAmenity: true,
                  },
                  orderBy: { order: "asc" },
                }
              : undefined,
          },
        },
        HotelAmenity: {
          orderBy: { order: "asc" },
        },
        HotelCardToHotelHighlight: {
          include: {
            hotelHighlight: true,
          },
          orderBy: { order: "asc" },
        },
        HotelCardToLabel: {
          include: {
            label: true,
          },
          orderBy: { order: "asc" },
        },
        HotelCardToAccessibilityOption: {
          include: {
            accessibilityOption: true,
          },
          orderBy: { order: "asc" },
        },
        HotelCardToHotelAmenity: {
          include: {
            hotelAmenity: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!hotelCard) {
      return NextResponse.json(
        { error: "Hotel card not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelCard);
  } catch (error) {
    console.error("Error fetching hotel card:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel card" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-card/[id] - Mettre à jour une carte d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const {
      name,
      idCity,
      starRating,
      basePricePerNight,
      shortDescription,
      overallRating,
      ratingAdjective,
      reviewCount,
      regularPrice,
      currency,
      isPartner,
      promoMessage,
      imageMessage,
      cancellationPolicy,
      accommodationTypeId,
      destinationId,
      hotelGroupId,
      latitude,
      longitude,
      order,
    } = body;

    // Vérifier si la carte d'hôtel existe
    const existingHotelCard = await prisma.hotelCard.findUnique({
      where: { id },
    });

    if (!existingHotelCard) {
      return NextResponse.json(
        { error: "Hotel card not found" },
        { status: 404 }
      );
    }

    // Validations similaires au POST
    if (starRating && (starRating < 1 || starRating > 5)) {
      return NextResponse.json(
        { error: "Star rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (basePricePerNight && basePricePerNight <= 0) {
      return NextResponse.json(
        { error: "Base price per night must be positive" },
        { status: 400 }
      );
    }

    if (
      overallRating !== undefined &&
      (overallRating < 0 || overallRating > 10)
    ) {
      return NextResponse.json(
        { error: "Overall rating must be between 0 and 10" },
        { status: 400 }
      );
    }

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

    // Vérifier les nouvelles références étrangères si fournies
    if (
      accommodationTypeId &&
      accommodationTypeId !== existingHotelCard.accommodationTypeId
    ) {
      const accommodationType = await prisma.accommodationType.findUnique({
        where: { id: accommodationTypeId },
      });
      if (!accommodationType) {
        return NextResponse.json(
          { error: "Accommodation type not found" },
          { status: 404 }
        );
      }
    }

    if (destinationId && destinationId !== existingHotelCard.destinationId) {
      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
      });
      if (!destination) {
        return NextResponse.json(
          { error: "Destination not found" },
          { status: 404 }
        );
      }
    }

    if (hotelGroupId && hotelGroupId !== existingHotelCard.hotelGroupId) {
      const hotelGroup = await prisma.hotelGroup.findUnique({
        where: { id: hotelGroupId },
      });
      if (!hotelGroup) {
        return NextResponse.json(
          { error: "Hotel group not found" },
          { status: 404 }
        );
      }
    }

    const updatedHotelCard = await prisma.hotelCard.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(idCity && { idCity }),
        ...(starRating && { starRating }),
        ...(basePricePerNight && { basePricePerNight }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(overallRating !== undefined && { overallRating }),
        ...(ratingAdjective !== undefined && { ratingAdjective }),
        ...(reviewCount !== undefined && { reviewCount }),
        ...(regularPrice !== undefined && { regularPrice }),
        ...(currency && { currency }),
        ...(isPartner !== undefined && { isPartner }),
        ...(promoMessage !== undefined && { promoMessage }),
        ...(imageMessage !== undefined && { imageMessage }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy }),
        ...(accommodationTypeId !== undefined && { accommodationTypeId }),
        ...(destinationId !== undefined && { destinationId }),
        ...(hotelGroupId !== undefined && { hotelGroupId }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(order !== undefined && { order }),
      },
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
      },
    });

    return NextResponse.json(updatedHotelCard);
  } catch (error) {
    console.error("Error updating hotel card:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "Invalid reference to accommodation type, destination, or hotel group",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update hotel card" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-card/[id] - Supprimer une carte d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la carte d'hôtel existe
    const existingHotelCard = await prisma.hotelCard.findUnique({
      where: { id },
      include: {
        details: true,
        HotelCardToHotelHighlight: true,
        HotelCardToLabel: true,
        HotelCardToAccessibilityOption: true,
        HotelCardToHotelAmenity: true,
      },
    });

    if (!existingHotelCard) {
      return NextResponse.json(
        { error: "Hotel card not found" },
        { status: 404 }
      );
    }

    // Supprimer en cascade (Prisma gère automatiquement les relations many-to-many)
    await prisma.hotelCard.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel card deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel card:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel card" },
      { status: 500 }
    );
  }
}
