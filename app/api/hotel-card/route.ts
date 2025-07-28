// @/app/api/hotel-card/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Récupérer tous les hôtels
export async function GET(request: NextRequest) {
  console.log("🚀 [GET] Début de la récupération des hôtels");

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");
    const cityId = searchParams.get("cityId");
    const starRating = searchParams.get("starRating");
    const isPartner = searchParams.get("isPartner");
    const includeAll = searchParams.get("includeAll") === "true";

    console.log("📋 [GET] Paramètres de recherche:", {
      page,
      limit,
      search,
      cityId,
      starRating,
      isPartner,
      includeAll,
    });

    // Construction du where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (cityId) where.idCity = cityId;
    if (starRating) where.starRating = parseInt(starRating);
    if (isPartner !== null && isPartner !== undefined) {
      where.isPartner = isPartner === "true";
    }

    const hotelCards = await prisma.hotelCard.findMany({
      where,
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
        images: {
          where: { imageCategories: "hotelCard" }, // ✅ Correction selon votre schéma
          orderBy: { order: "asc" },
          take: 5,
        },
        // ✅ Relations many-to-many selon votre schéma
        HotelCardToLabel: {
          include: {
            label: true,
          },
          orderBy: { order: "asc" },
        },
        HotelCardToHotelAmenity: {
          include: {
            hotelAmenity: true,
          },
          orderBy: { order: "asc" },
        },
        HotelCardToAccessibilityOption: {
          include: {
            accessibilityOption: true,
          },
          orderBy: { order: "asc" },
        },
        HotelCardToHotelHighlight: {
          include: {
            hotelHighlight: true,
          },
          orderBy: { order: "asc" },
        },
        // ✅ Relations directes selon votre nouveau schéma
        HotelAmenity: true, // Relation directe
        HotelFAQ: {
          orderBy: { order: "asc" },
        },
        HotelPolicy: true,
        HotelRoomType: includeAll
          ? {
              include: {
                images: true,
                CancellationPolicy: true,
                RoomUnavailability: true,
              },
            }
          : undefined,
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
          take: includeAll ? undefined : 5,
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
                room: true,
              },
            }
          : undefined,
        // ✅ Compteurs mis à jour selon votre schéma
        _count: {
          select: {
            HotelReview: true,
            UserWishList: true,
            HotelDetails: true,
            HotelRoomType: true,
            HotelFAQ: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log(`✅ [GET] ${hotelCards.length} hôtels récupérés`);

    // ✅ Enrichir les données avec les informations de ville
    const enrichedHotels = await Promise.all(
      hotelCards.map(async (hotel) => {
        let city = null;
        if (hotel.idCity) {
          try {
            city = await prisma.city.findUnique({
              where: { id: hotel.idCity },
              include: {
                country: true,
                neighborhoods: {
                  take: 3,
                  orderBy: { order: "asc" },
                },
              },
            });
          } catch (cityError) {
            console.warn(`Ville non trouvée pour l'ID: ${hotel.idCity}`);
          }
        }

        return {
          ...hotel,
          city,
          // Transformer la destination pour avoir un tableau de villes
          destination: hotel.destination
            ? {
                ...hotel.destination,
                cities:
                  hotel.destination.DestinationToCity?.map((rel) => rel.city) ||
                  [],
                DestinationToCity: undefined,
              }
            : null,
          // ✅ Formatage des relations many-to-many
          labels: hotel.HotelCardToLabel?.map((rel) => rel.label) || [],
          amenities:
            hotel.HotelCardToHotelAmenity?.map((rel) => rel.hotelAmenity) || [],
          accessibilityOptions:
            hotel.HotelCardToAccessibilityOption?.map(
              (rel) => rel.accessibilityOption
            ) || [],
          highlights:
            hotel.HotelCardToHotelHighlight?.map((rel) => rel.hotelHighlight) ||
            [],
          // ✅ Nouvelles propriétés formatées selon votre schéma
          directAmenities: hotel.HotelAmenity || [],
          faqs: hotel.HotelFAQ || [],
          policies: hotel.HotelPolicy || [],
          roomTypes: hotel.HotelRoomType || [],
          reviews: hotel.HotelReview || [],
          wishlistUsers: hotel.UserWishList || [],
          details: hotel.HotelDetails || [],
          // Suppression des relations intermédiaires
          HotelCardToLabel: undefined,
          HotelCardToHotelAmenity: undefined,
          HotelCardToAccessibilityOption: undefined,
          HotelCardToHotelHighlight: undefined,
          HotelAmenity: undefined,
          HotelFAQ: undefined,
          HotelPolicy: undefined,
          HotelRoomType: undefined,
          HotelReview: undefined,
          UserWishList: undefined,
          HotelDetails: undefined,
        };
      })
    );

    const total = await prisma.hotelCard.count({ where });

    console.log(
      `✅ [GET] Total: ${total} hôtels, Page: ${page}/${Math.ceil(
        total / limit
      )}`
    );

    return NextResponse.json({
      data: enrichedHotels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ [GET] Erreur lors de la récupération des hôtels:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des hôtels",
        details: error instanceof Error ? error.message : "Erreur inconnue",
        data: [],
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 0,
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Créer un nouvel hôtel
export async function POST(request: NextRequest) {
  console.log("🚀 [POST] Début de la création d'hôtel");

  try {
    const body = await request.json();
    console.log("📋 [POST] Données reçues:", JSON.stringify(body, null, 2));

    // ✅ Validation des champs requis selon votre schéma Prisma
    const requiredFields = [
      "name",
      "idCity",
      "starRating",
      "basePricePerNight",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`❌ [POST] Champ requis manquant: ${field}`);
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // ✅ Validations des valeurs
    if (body.starRating < 1 || body.starRating > 5) {
      return NextResponse.json(
        { error: "La note en étoiles doit être entre 1 et 5" },
        { status: 400 }
      );
    }

    if (body.basePricePerNight <= 0) {
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

    // ✅ Validation de la ville (obligatoire selon votre schéma)
    const cityExists = await prisma.city.findUnique({
      where: { id: body.idCity },
    });

    if (!cityExists) {
      console.error("❌ [POST] Ville non trouvée:", body.idCity);
      return NextResponse.json(
        { error: "La ville spécifiée n'existe pas" },
        { status: 400 }
      );
    }

    // ✅ Validation des références optionnelles
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

    console.log("✅ [POST] Toutes les validations réussies");

    // ✅ Création de l'hôtel avec les champs corrects selon votre nouveau schéma
    const newHotel = await prisma.hotelCard.create({
      data: {
        // Champs obligatoires
        name: body.name.trim(),
        idCity: body.idCity,
        starRating: parseInt(body.starRating),
        basePricePerNight: parseFloat(body.basePricePerNight),

        // Champs avec valeurs par défaut
        order: body.order || 100,
        currency: body.currency || "EUR",
        reviewCount: parseInt(body.reviewCount) || 0,
        isPartner: Boolean(body.isPartner),

        // Champs optionnels avec nettoyage
        shortDescription: body.shortDescription?.trim() || null,
        overallRating: body.overallRating
          ? parseFloat(body.overallRating)
          : null,
        ratingAdjective: body.ratingAdjective?.trim() || null,
        regularPrice: body.regularPrice ? parseFloat(body.regularPrice) : null,
        promoMessage: body.promoMessage?.trim() || null,
        imageMessage: body.imageMessage?.trim() || null,
        cancellationPolicy: body.cancellationPolicy?.trim() || null,

        // Relations optionnelles
        accommodationTypeId: body.accommodationTypeId || null,
        destinationId: body.destinationId || null,
        hotelGroupId: body.hotelGroupId || null,
        hotelParkingId: body.hotelParkingId || null,

        // Coordonnées GPS
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
        },
        // ✅ Inclusions selon votre nouveau schéma
        HotelFAQ: {
          orderBy: { order: "asc" },
        },
        HotelPolicy: true,
        _count: {
          select: {
            HotelReview: true,
            UserWishList: true,
            HotelDetails: true,
            HotelRoomType: true,
          },
        },
      },
    });

    console.log("✅ [POST] Hôtel créé avec succès:", newHotel.id);

    // ✅ Enrichir avec les informations de ville
    const city = await prisma.city.findUnique({
      where: { id: newHotel.idCity },
      include: {
        country: true,
        neighborhoods: true,
      },
    });

    // ✅ Formater la réponse selon la structure attendue
    const enrichedHotel = {
      ...newHotel,
      city,
      destination: newHotel.destination
        ? {
            ...newHotel.destination,
            cities:
              newHotel.destination.DestinationToCity?.map((rel) => rel.city) ||
              [],
            DestinationToCity: undefined,
          }
        : null,
      // ✅ Formatage des nouvelles propriétés
      faqs: newHotel.HotelFAQ || [],
      policies: newHotel.HotelPolicy || [],
      // Suppression des relations intermédiaires
      HotelFAQ: undefined,
      HotelPolicy: undefined,
    };

    return NextResponse.json(enrichedHotel, { status: 201 });
  } catch (error) {
    console.error("❌ [POST] Erreur lors de la création:", error);

    // ✅ Gestion spécifique des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Un hôtel avec ce nom existe déjà dans cette ville" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Référence invalide vers une entité liée" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la création de l'hôtel",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
