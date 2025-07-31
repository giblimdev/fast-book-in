// File: /app/api/hotel-card/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Récupérer la liste des hôtels avec relations et statistiques optionnelles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const include = searchParams.get("include") === "true";
    const hostId = searchParams.get("hostId") || undefined;

    // Filtrage par hostId (adapter selon ta logique si besoin)
    const whereClause = hostId ? {} : {};

    const hotels = await prisma.hotelCard.findMany({
      where: whereClause,
      include: include
        ? {
            hotelDetails: {
              include: {
                address: {
                  include: {
                    city: {
                      include: { country: true },
                    },
                  },
                },
                hotelDetailsToRoomAmenity: {
                  include: { roomAmenity: true },
                  orderBy: { order: "asc" },
                },
                label: true,
                room: true,
              },
            },
            hotelRoomType: {
              include: {
                images: { include: { image: true } },
                CancellationPolicy: true,
              },
            },
            hotelFAQ: true,
            hotelPolicy: true,
            hotelReview: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                  },
                },
                replies: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        firstName: true,
                        lastName: true,
                        image: true,
                      },
                    },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            images: {
              include: { image: true },
              orderBy: { order: "asc" },
            },
            destination: true,
            accommodationType: true,
            hotelGroup: true,
            parking: true,
            hotelCardToHotelHighlight: {
              include: { hotelHighlight: true },
              orderBy: { order: "asc" },
            },
            hotelCardToLabel: {
              include: { label: true },
              orderBy: { order: "asc" },
            },
            hotelCardToAccessibilityOption: {
              include: { accessibilityOption: true },
              orderBy: { order: "asc" },
            },
            hotelCardToHotelAmenity: {
              include: { hotelAmenity: true },
              orderBy: { order: "asc" },
            },
            hostDashboard: true,
            userWishList: true,
          }
        : {
            images: {
              take: 1,
              include: { image: true },
              orderBy: { order: "asc" },
            },
            hotelReview: {
              select: { rating: true },
            },
          },
      orderBy: { order: "asc" },
    });

    // Calcul des statistiques avec gestion prudente de la présence des relations
    const hotelsWithStats = await Promise.all(
      hotels.map(async (hotel) => {
        if (!include) return hotel;

        const reviews = (hotel as any).hotelReview || [];
        const avgRating =
          reviews.length > 0
            ? reviews.reduce(
                (sum: number, r: any) => sum + (r.rating ?? 0),
                0
              ) / reviews.filter((r: any) => r.rating !== null).length
            : null;

        const activeReservations = await prisma.reservation.count({
          where: {
            hotelRoom: {
              HotelDetails: {
                HotelCard: { some: { id: hotel.id } },
              },
            },
            status: { in: ["confirmed", "checked_in"] },
            checkOut: { gte: new Date() },
          },
        });

        return {
          ...hotel,
          calculatedStats: {
            averageRating: avgRating,
            activeReservations,
            wishlistCount: (hotel as any).userWishList?.length ?? 0,
          },
        };
      })
    );

    return NextResponse.json(hotelsWithStats);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}

// POST - Création d'un hôtel (sans authentification)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.idCity || !body.basePricePerNight) {
      return NextResponse.json(
        { error: "Missing required fields: name, idCity, basePricePerNight" },
        { status: 400 }
      );
    }

    const cityExists = await prisma.city.findUnique({
      where: { id: body.idCity },
    });
    if (!cityExists) {
      return NextResponse.json({ error: "Invalid city ID" }, { status: 400 });
    }

    const newHotel = await prisma.$transaction(async (tx) => {
      const hotel = await tx.hotelCard.create({
        data: {
          name: body.name,
          idCity: body.idCity,
          shortDescription: body.shortDescription,
          starRating: body.starRating,
          basePricePerNight: parseFloat(body.basePricePerNight),
          regularPrice: body.regularPrice
            ? parseFloat(body.regularPrice)
            : null,
          currency: body.currency ?? "EUR",
          isPartner: body.isPartner || false,
          promoMessage: body.promoMessage,
          imageMessage: body.imageMessage,
          hotelGroupId: body.hotelGroupId,
          hotelParkingId: body.hotelParkingId,
          order: body.order ?? 20,
        },
      });

      if (body.hotelDetails) {
        await tx.hotelDetails.create({
          data: {
            description: body.hotelDetails.description,
            checkInTime: body.hotelDetails.checkInTime || "15:00",
            checkOutTime: body.hotelDetails.checkOutTime || "11:00",
            numberOfRooms: body.hotelDetails.numberOfRooms,
            numberOfFloors: body.hotelDetails.numberOfFloors,
            languages: body.hotelDetails.languages || [],
            address: {
              create: {
                name: body.hotelDetails.address.name,
                streetNumber: body.hotelDetails.address.streetNumber,
                streetType: body.hotelDetails.address.streetType,
                streetName: body.hotelDetails.address.streetName,
                addressLine2: body.hotelDetails.address.addressLine2,
                postalCode: body.hotelDetails.address.postalCode,
                cityId: body.hotelDetails.address.cityId || body.idCity,
                neighborhoodId: body.hotelDetails.address.neighborhoodId,
                latitude: body.hotelDetails.address.latitude,
                longitude: body.hotelDetails.address.longitude,
              },
            },
            hotelCardid: hotel.id,
          },
        });
      }

      if (body.destinationIds?.length) {
        await tx.hotelCard.update({
          where: { id: hotel.id },
          data: {
            destination: {
              connect: body.destinationIds.map((id: string) => ({ id })),
            },
          },
        });
      }

      if (body.accommodationTypeIds?.length) {
        await tx.hotelCard.update({
          where: { id: hotel.id },
          data: {
            accommodationType: {
              connect: body.accommodationTypeIds.map((id: string) => ({ id })),
            },
          },
        });
      }

      await tx.hostDashboard.create({
        data: {
          hotelCardId: hotel.id,
          totalBookings: 0,
          upcomingBookings: 0,
          currentGuests: 0,
          monthlyRevenue: 0,
          occupancyRate: 0,
          averageRating: 0,
          totalReviews: 0,
          availableRooms: body.hotelDetails?.numberOfRooms ?? 0,
        },
      });

      if (body.roomTypes?.length) {
        for (const rt of body.roomTypes) {
          await tx.hotelRoomType.create({
            data: {
              hotelCardId: hotel.id,
              name: rt.name,
              description: rt.description,
              maxGuests: rt.maxGuests,
              bedCount: rt.bedCount,
              bedType: rt.bedType,
              roomSize: rt.roomSize,
              pricePerNight: parseFloat(rt.pricePerNight),
              currency: rt.currency ?? "EUR",
              isAvailable: rt.isAvailable ?? true,
            },
          });
        }
      }

      await tx.hotelPolicy.create({
        data: {
          hotelCardId: hotel.id,
          checkIn: body.hotelDetails?.checkInTime ?? "15:00",
          checkOut: body.hotelDetails?.checkOutTime ?? "11:00",
          cancellation:
            body.cancellationPolicy ??
            "Annulation gratuite jusqu'à 24h avant l'arrivée",
          pets: body.pets || false,
          smoking: body.smoking || false,
          parties: body.parties || false,
          children: body.childrenPolicy ?? "",
        },
      });

      return hotel;
    });

    const fullHotel = await prisma.hotelCard.findUnique({
      where: { id: newHotel.id },
      include: {
        hotelDetails: { include: { address: { include: { city: true } } } },
        hotelRoomType: true,
        hotelPolicy: true,
        hostDashboard: true,
        destination: true,
        accommodationType: true,
      },
    });

    return NextResponse.json(fullHotel, { status: 201 });
  } catch (e: any) {
    console.error("Failed to create hotel:", e);
    return NextResponse.json(
      { error: "Failed to create hotel", details: e.message ?? e.toString() },
      { status: 500 }
    );
  }
}

// PUT - Mise à jour d'un hôtel (sans authentification et contrôle)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("id");

    if (!hotelId)
      return NextResponse.json({ error: "Hotel ID required" }, { status: 400 });

    const existing = await prisma.hotelCard.findUnique({
      where: { id: hotelId },
    });
    if (!existing)
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    const body = await request.json();

    const updated = await prisma.hotelCard.update({
      where: { id: hotelId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.shortDescription && {
          shortDescription: body.shortDescription,
        }),
        ...(body.starRating !== undefined && { starRating: body.starRating }),
        ...(body.basePricePerNight && {
          basePricePerNight: parseFloat(body.basePricePerNight),
        }),
        ...(body.regularPrice && {
          regularPrice: parseFloat(body.regularPrice),
        }),
        ...(body.currency && { currency: body.currency }),
        ...(body.isPartner !== undefined && { isPartner: body.isPartner }),
        ...(body.promoMessage && { promoMessage: body.promoMessage }),
        ...(body.imageMessage && { imageMessage: body.imageMessage }),
        updatedAt: new Date(),
      },
      include: {
        hotelDetails: { include: { address: { include: { city: true } } } },
        hotelRoomType: true,
        hostDashboard: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Failed to update hotel:", e);
    return NextResponse.json(
      { error: "Failed to update hotel" },
      { status: 500 }
    );
  }
}

// DELETE - Suppression d'un hôtel (sans contrôle des rôles)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("id");

    if (!hotelId)
      return NextResponse.json({ error: "Hotel ID required" }, { status: 400 });

    // Vérifier les réservations actives avant suppression
    const activeReservations = await prisma.reservation.count({
      where: {
        hotelRoom: {
          HotelDetails: {
            HotelCard: { some: { id: hotelId } },
          },
        },
        status: { in: ["confirmed", "checked_in"] },
        checkOut: { gte: new Date() },
      },
    });

    if (activeReservations > 0) {
      return NextResponse.json(
        { error: "Cannot delete hotel with active reservations" },
        { status: 400 }
      );
    }

    await prisma.hotelCard.delete({ where: { id: hotelId } });

    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (e) {
    console.error("Failed to delete hotel:", e);
    return NextResponse.json(
      { error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
