import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-card - Récupérer toutes les cartes d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const idCity = searchParams.get("idCity");
    const destinationId = searchParams.get("destinationId");
    const hotelGroupId = searchParams.get("hotelGroupId");
    const accommodationTypeId = searchParams.get("accommodationTypeId");
    const minStarRating = searchParams.get("minStarRating");
    const maxPrice = searchParams.get("maxPrice");
    const isPartner = searchParams.get("isPartner");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (idCity) whereClause.idCity = idCity;
    if (destinationId) whereClause.destinationId = destinationId;
    if (hotelGroupId) whereClause.hotelGroupId = hotelGroupId;
    if (accommodationTypeId)
      whereClause.accommodationTypeId = accommodationTypeId;
    if (minStarRating) {
      whereClause.starRating = {
        gte: parseInt(minStarRating),
      };
    }
    if (maxPrice) {
      whereClause.basePricePerNight = {
        lte: parseFloat(maxPrice),
      };
    }
    if (isPartner !== null) {
      whereClause.isPartner = isPartner === "true";
    }

    const hotelCards = await prisma.hotelCard.findMany({
      where: whereClause,
      orderBy: [{ overallRating: "desc" }, { order: "asc" }],
      include: includeRelations
        ? {
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
          }
        : {
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
              where: { order: { lte: 3 } }, // Premières images seulement
              orderBy: { order: "asc" },
            },
          },
    });

    return NextResponse.json(hotelCards);
  } catch (error) {
    console.error("Error fetching hotel cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel cards" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-card - Créer une nouvelle carte d'hôtel
export async function POST(request: NextRequest) {
  try {
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

    // Validation basique
    if (!name || !idCity || !starRating || !basePricePerNight) {
      return NextResponse.json(
        {
          error: "Name, idCity, starRating and basePricePerNight are required",
        },
        { status: 400 }
      );
    }

    // Validation du nombre d'étoiles
    if (starRating < 1 || starRating > 5) {
      return NextResponse.json(
        { error: "Star rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validation du prix
    if (basePricePerNight <= 0) {
      return NextResponse.json(
        { error: "Base price per night must be positive" },
        { status: 400 }
      );
    }

    // Validation de la note globale
    if (overallRating && (overallRating < 0 || overallRating > 10)) {
      return NextResponse.json(
        { error: "Overall rating must be between 0 and 10" },
        { status: 400 }
      );
    }

    // Validation GPS
    if (latitude && (latitude < -90 || latitude > 90)) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }

    if (longitude && (longitude < -180 || longitude > 180)) {
      return NextResponse.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    // Vérifier les références étrangères
    if (accommodationTypeId) {
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

    if (destinationId) {
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

    if (hotelGroupId) {
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

    const hotelCard = await prisma.hotelCard.create({
      data: {
        name,
        idCity,
        starRating,
        basePricePerNight,
        shortDescription,
        overallRating,
        ratingAdjective,
        reviewCount: reviewCount || 0,
        regularPrice,
        currency: currency || "EUR",
        isPartner: isPartner || false,
        promoMessage,
        imageMessage,
        cancellationPolicy,
        accommodationTypeId,
        destinationId,
        hotelGroupId,
        latitude,
        longitude,
        order: order || 20,
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

    return NextResponse.json(hotelCard, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel card:", error);

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
      { error: "Failed to create hotel card" },
      { status: 500 }
    );
  }
}
