// @/app/api/hotel-card/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-card/[id] - Récupérer une carte d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  console.log("🚀 [GET] Début de la récupération d'hôtel par ID");

  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;
    console.log("📋 [GET] ID reçu:", id);

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";

    const hotelCard = await prisma.hotelCard.findUnique({
      where: { id },
      include: {
        accommodationType: true,
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
              orderBy: { order: "asc" },
            },
          },
        },
        hotelGroup: true,
        parking: true,
        // ✅ Correction selon votre schéma : imageCategories
        images: {
          where: { imageCategories: "hotelCard" },
          orderBy: { order: "asc" },
          include: {
            image: true, // ✅ Relation vers Image
          },
        },
        // ✅ HotelDetails avec la bonne relation
        HotelDetails: includeAll
          ? {
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
                HotelDetailsToRoomAmenity: {
                  include: {
                    roomAmenity: true,
                  },
                  orderBy: { order: "asc" },
                },
                Label: true,
                room: true, // Relation HotelRoom
              },
            }
          : undefined,
        // ✅ Relations many-to-many correctes
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
        // ✅ Relations directes selon votre schéma
        HotelAmenity: true,
        HotelFAQ: {
          orderBy: { order: "asc" },
        },
        HotelPolicy: true,
        HotelRoomType: {
          include: {
            images: {
              include: {
                image: true,
              },
            },
            CancellationPolicy: true,
            RoomUnavailability: true,
          },
        },
        HotelReview: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
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
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: includeAll ? undefined : 10,
        },
        UserWishList: includeAll
          ? {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            }
          : undefined,
        // ✅ Dashboards et recommandations
        HotelierDashboard: includeAll ? true : undefined,
        TravelerRecommendation: includeAll
          ? {
              include: {
                traveler: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            }
          : undefined,
        // ✅ Compteurs selon votre schéma
        _count: {
          select: {
            HotelReview: true,
            UserWishList: true,
            HotelDetails: true,
            HotelRoomType: true,
            HotelFAQ: true,
            HotelierDashboard: true,
            TravelerRecommendation: true,
          },
        },
      },
    });

    if (!hotelCard) {
      console.warn("❌ [GET] Hôtel non trouvé:", id);
      return NextResponse.json({ error: "Hôtel non trouvé" }, { status: 404 });
    }

    console.log("✅ [GET] Hôtel trouvé:", hotelCard.name);

    // ✅ Enrichir avec les informations de ville depuis idCity
    let city = null;
    if (hotelCard.idCity) {
      try {
        city = await prisma.city.findUnique({
          where: { id: hotelCard.idCity },
          include: {
            country: true,
            neighborhoods: {
              take: 3,
              orderBy: { order: "asc" },
            },
          },
        });
      } catch (cityError) {
        console.warn(`Ville non trouvée pour l'ID: ${hotelCard.idCity}`);
      }
    }

    // ✅ Formatage de la réponse cohérent avec votre schéma
    const enrichedHotel = {
      ...hotelCard,
      city,
      // Transformer la destination pour avoir un tableau de villes
      destination: hotelCard.destination
        ? {
            ...hotelCard.destination,
            cities:
              hotelCard.destination.DestinationToCity?.map((rel) => rel.city) ||
              [],
            DestinationToCity: undefined,
          }
        : null,
      // Formatage des relations many-to-many
      highlights:
        hotelCard.HotelCardToHotelHighlight?.map((rel) => rel.hotelHighlight) ||
        [],
      labels: hotelCard.HotelCardToLabel?.map((rel) => rel.label) || [],
      amenities:
        hotelCard.HotelCardToHotelAmenity?.map((rel) => rel.hotelAmenity) || [],
      accessibilityOptions:
        hotelCard.HotelCardToAccessibilityOption?.map(
          (rel) => rel.accessibilityOption
        ) || [],
      // ✅ Nouvelles propriétés formatées selon votre schéma
      directAmenities: hotelCard.HotelAmenity || [],
      faqs: hotelCard.HotelFAQ || [],
      policies: hotelCard.HotelPolicy,
      roomTypes: hotelCard.HotelRoomType || [],
      reviews: hotelCard.HotelReview || [],
      wishlistUsers: hotelCard.UserWishList || [],
      details: hotelCard.HotelDetails || [],
      dashboards: hotelCard.HotelierDashboard || [],
      recommendations: hotelCard.TravelerRecommendation || [],
      // Suppression des relations intermédiaires
      HotelCardToHotelHighlight: undefined,
      HotelCardToLabel: undefined,
      HotelCardToHotelAmenity: undefined,
      HotelCardToAccessibilityOption: undefined,
      HotelAmenity: undefined,
      HotelFAQ: undefined,
      HotelPolicy: undefined,
      HotelRoomType: undefined,
      HotelReview: undefined,
      UserWishList: undefined,
      HotelDetails: undefined,
      HotelierDashboard: undefined,
      TravelerRecommendation: undefined,
    };

    return NextResponse.json(enrichedHotel);
  } catch (error) {
    console.error("❌ [GET] Erreur lors de la récupération de l'hôtel:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'hôtel",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/hotel-card/[id] - Mettre à jour une carte d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  console.log("🚀 [PUT] Début de la mise à jour d'hôtel");

  try {
    const { id } = await context.params;
    const body = await request.json();

    console.log("📋 [PUT] ID:", id);
    console.log("📋 [PUT] Données reçues:", JSON.stringify(body, null, 2));

    // ✅ Validation des champs requis selon votre schéma
    const requiredFields = [
      "name",
      "idCity",
      "starRating",
      "basePricePerNight",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    const existingHotelCard = await prisma.hotelCard.findUnique({
      where: { id },
    });

    if (!existingHotelCard) {
      console.warn("❌ [PUT] Hôtel non trouvé:", id);
      return NextResponse.json({ error: "Hôtel non trouvé" }, { status: 404 });
    }

    console.log("✅ [PUT] Hôtel existant trouvé:", existingHotelCard.name);

    // ✅ Validations des données
    if (body.starRating && (body.starRating < 1 || body.starRating > 5)) {
      return NextResponse.json(
        { error: "La note en étoiles doit être entre 1 et 5" },
        { status: 400 }
      );
    }

    if (body.basePricePerNight && body.basePricePerNight <= 0) {
      return NextResponse.json(
        { error: "Le prix de base par nuit doit être positif" },
        { status: 400 }
      );
    }

    if (
      body.overallRating !== undefined &&
      (body.overallRating < 0 || body.overallRating > 5)
    ) {
      return NextResponse.json(
        { error: "La note globale doit être entre 0 et 5" },
        { status: 400 }
      );
    }

    if (
      body.latitude !== undefined &&
      (body.latitude < -90 || body.latitude > 90)
    ) {
      return NextResponse.json(
        { error: "La latitude doit être entre -90 et 90" },
        { status: 400 }
      );
    }

    if (
      body.longitude !== undefined &&
      (body.longitude < -180 || body.longitude > 180)
    ) {
      return NextResponse.json(
        { error: "La longitude doit être entre -180 et 180" },
        { status: 400 }
      );
    }

    // ✅ Vérifications des références étrangères
    if (body.idCity) {
      const cityExists = await prisma.city.findUnique({
        where: { id: body.idCity },
      });
      if (!cityExists) {
        return NextResponse.json(
          { error: "La ville spécifiée n'existe pas" },
          { status: 400 }
        );
      }
    }

    if (body.accommodationTypeId) {
      const accommodationTypeExists = await prisma.accommodationType.findUnique(
        {
          where: { id: body.accommodationTypeId },
        }
      );
      if (!accommodationTypeExists) {
        return NextResponse.json(
          { error: "Le type d'hébergement spécifié n'existe pas" },
          { status: 400 }
        );
      }
    }

    if (body.destinationId) {
      const destinationExists = await prisma.destination.findUnique({
        where: { id: body.destinationId },
      });
      if (!destinationExists) {
        return NextResponse.json(
          { error: "La destination spécifiée n'existe pas" },
          { status: 400 }
        );
      }
    }

    if (body.hotelGroupId) {
      const hotelGroupExists = await prisma.hotelGroup.findUnique({
        where: { id: body.hotelGroupId },
      });
      if (!hotelGroupExists) {
        return NextResponse.json(
          { error: "Le groupe hôtelier spécifié n'existe pas" },
          { status: 400 }
        );
      }
    }

    if (body.hotelParkingId) {
      const parkingExists = await prisma.hotelParking.findUnique({
        where: { id: body.hotelParkingId },
      });
      if (!parkingExists) {
        return NextResponse.json(
          { error: "L'option de parking spécifiée n'existe pas" },
          { status: 400 }
        );
      }
    }

    console.log("✅ [PUT] Toutes les validations réussies");

    // ✅ Mise à jour avec gestion correcte des types
    const updatedHotelCard = await prisma.hotelCard.update({
      where: { id },
      data: {
        name: body.name.trim(),
        idCity: body.idCity,
        starRating: parseInt(body.starRating),
        basePricePerNight: parseFloat(body.basePricePerNight),
        order:
          body.order !== undefined
            ? parseInt(body.order)
            : existingHotelCard.order,
        currency: body.currency || existingHotelCard.currency,
        reviewCount:
          body.reviewCount !== undefined
            ? parseInt(body.reviewCount)
            : existingHotelCard.reviewCount,
        isPartner:
          body.isPartner !== undefined
            ? Boolean(body.isPartner)
            : existingHotelCard.isPartner,
        shortDescription: body.shortDescription?.trim() || null,
        overallRating: body.overallRating
          ? parseFloat(body.overallRating)
          : null,
        ratingAdjective: body.ratingAdjective?.trim() || null,
        regularPrice: body.regularPrice ? parseFloat(body.regularPrice) : null,
        promoMessage: body.promoMessage?.trim() || null,
        imageMessage: body.imageMessage?.trim() || null,
        cancellationPolicy: body.cancellationPolicy?.trim() || null,
        accommodationTypeId: body.accommodationTypeId || null,
        destinationId: body.destinationId || null,
        hotelGroupId: body.hotelGroupId || null,
        hotelParkingId: body.hotelParkingId || null,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
      },
      include: {
        accommodationType: true,
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
        },
        hotelGroup: true,
        parking: true,
        images: {
          where: { imageCategories: "hotelCard" },
          orderBy: { order: "asc" },
          take: 5,
          include: {
            image: true,
          },
        },
      },
    });

    console.log(
      "✅ [PUT] Hôtel mis à jour avec succès:",
      updatedHotelCard.name
    );

    // ✅ Enrichir avec les informations de ville
    const city = await prisma.city.findUnique({
      where: { id: updatedHotelCard.idCity },
      include: {
        country: true,
        neighborhoods: true,
      },
    });

    const enrichedHotel = {
      ...updatedHotelCard,
      city,
      destination: updatedHotelCard.destination
        ? {
            ...updatedHotelCard.destination,
            cities:
              updatedHotelCard.destination.DestinationToCity?.map(
                (rel) => rel.city
              ) || [],
            DestinationToCity: undefined,
          }
        : null,
    };

    return NextResponse.json(enrichedHotel);
  } catch (error) {
    console.error("❌ [PUT] Erreur lors de la mise à jour:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "Référence invalide vers le type d'hébergement, la destination ou le groupe hôtelier",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour de l'hôtel",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/hotel-card/[id] - Supprimer une carte d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  console.log("🚀 [DELETE] Début de la suppression d'hôtel");

  try {
    const { id } = await context.params;
    console.log("📋 [DELETE] ID:", id);

    // ✅ Vérifier si la carte d'hôtel existe selon votre schéma
    const existingHotelCard = await prisma.hotelCard.findUnique({
      where: { id },
      include: {
        HotelDetails: true,
        HotelReview: true,
        UserWishList: true,
        HotelFAQ: true,
        HotelPolicy: true,
        HotelRoomType: true,
        HotelierDashboard: true,
        HotelCardToHotelHighlight: true,
        HotelCardToLabel: true,
        HotelCardToAccessibilityOption: true,
        HotelCardToHotelAmenity: true,
        _count: {
          select: {
            HotelReview: true,
            UserWishList: true,
            HotelDetails: true,
            HotelRoomType: true,
            HotelierDashboard: true,
          },
        },
      },
    });

    if (!existingHotelCard) {
      console.warn("❌ [DELETE] Hôtel non trouvé:", id);
      return NextResponse.json({ error: "Hôtel non trouvé" }, { status: 404 });
    }

    console.log("✅ [DELETE] Hôtel existant trouvé:", existingHotelCard.name);

    // ✅ Vérifier s'il y a des réservations actives
    // Selon votre schéma : HotelCard -> HotelDetails -> room (HotelRoom) -> reservations
    const activeReservations = await prisma.reservation.count({
      where: {
        hotelRoom: {
          hotelDetailsId: {
            in: existingHotelCard.HotelDetails.map((detail) => detail.id),
          },
        },
        status: {
          in: ["confirmed", "checked_in"],
        },
        checkOut: {
          gte: new Date(),
        },
      },
    });

    if (activeReservations > 0) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer cet hôtel car il a des réservations actives",
          details: `${activeReservations} réservation(s) active(s) trouvée(s)`,
        },
        { status: 409 }
      );
    }

    // ✅ Supprimer en cascade (Prisma gère automatiquement les relations)
    await prisma.hotelCard.delete({
      where: { id },
    });

    console.log(
      "✅ [DELETE] Hôtel supprimé avec succès:",
      existingHotelCard.name
    );

    return NextResponse.json(
      {
        message: "Hôtel supprimé avec succès",
        deletedHotel: {
          id: existingHotelCard.id,
          name: existingHotelCard.name,
          stats: {
            reviewsDeleted: existingHotelCard._count.HotelReview,
            wishlistEntriesDeleted: existingHotelCard._count.UserWishList,
            detailsDeleted: existingHotelCard._count.HotelDetails,
            roomTypesDeleted: existingHotelCard._count.HotelRoomType,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [DELETE] Erreur lors de la suppression:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "Impossible de supprimer cet hôtel car il est référencé par d'autres données",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la suppression de l'hôtel",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
