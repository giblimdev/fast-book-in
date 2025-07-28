// @/app/api/publics/hotels/[id]/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Types pour Next.js 15+
interface RouteParams {
  params: Promise<{ id: string }>;
}

// Type pour la réponse avec inclusions conditionnelles
type HotelWithInclusions = any; // On utilise any temporairement pour éviter les erreurs de typage complexes

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // ✅ Await obligatoire pour les params en Next.js 15+
    const { id } = await params;

    // Récupération des searchParams
    const { searchParams } = new URL(request.url);
    const include = searchParams.get("include");

    // Validation de l'ID
    if (!id || typeof id !== "string") {
      return Response.json({ error: "ID d'hôtel invalide" }, { status: 400 });
    }

    let includeOptions = {};

    // Configuration des inclusions basées sur le paramètre
    if (include === "all") {
      includeOptions = {
        // Relations principales
        accommodationType: true,
        destination: true,
        hotelGroup: true,
        parking: true,

        // Images
        images: {
          orderBy: { order: "asc" as const },
        },

        // Détails avec adresse complète
        HotelDetails: {
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

        // Chambres avec leurs images
        HotelRoom: {
          include: {
            images: {
              orderBy: { order: "asc" as const },
            },
          },
          orderBy: { pricePerNight: "asc" as const },
        },

        // Équipements
        HotelCardToHotelAmenity: {
          include: {
            hotelAmenity: true,
          },
        },

        // Labels
        HotelCardToLabel: {
          include: {
            label: true,
          },
        },

        // Options d'accessibilité
        HotelCardToAccessibilityOption: {
          include: {
            accessibilityOption: true,
          },
        },

        // Avis avec utilisateurs
        HotelReview: {
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
          where: {
            parentId: null, // Exclure les réponses aux avis
          },
          orderBy: { createdAt: "desc" as const },
          take: 50, // Limiter le nombre d'avis
        },

        // Politiques
        HotelPolicy: true,

        // FAQ
        HotelFAQ: {
          orderBy: { order: "asc" as const },
        },
      };
    } else if (include === "basic") {
      includeOptions = {
        accommodationType: true,
        destination: true,
        images: {
          orderBy: { order: "asc" as const },
          take: 5,
        },
        HotelRoom: {
          select: {
            id: true,
            name: true,
            pricePerNight: true,
            currency: true,
            maxGuests: true,
          },
          take: 3,
        },
      };
    }

    // Requête Prisma avec typage explicite
    const hotel = (await prisma.hotelCard.findUnique({
      where: { id },
      include: includeOptions,
    })) as HotelWithInclusions;

    if (!hotel) {
      return Response.json({ error: "Hôtel non trouvé" }, { status: 404 });
    }

    // Calcul sécurisé des métadonnées
    const totalRooms = hotel.HotelRoom?.length || 0;
    const averageRoomPrice =
      totalRooms > 0
        ? hotel.HotelRoom.reduce(
            (sum: number, room: any) => sum + room.pricePerNight,
            0
          ) / totalRooms
        : null;

    // Ajout de métadonnées calculées
    const hotelWithMetadata = {
      ...hotel,
      metadata: {
        totalRooms,
        averageRoomPrice,
        hasParking: !!hotel.parking?.isAvailable,
        amenitiesCount: hotel.HotelCardToHotelAmenity?.length || 0,
        reviewsCount: hotel.HotelReview?.length || 0,
        averageRating: hotel.overallRating,
        labelsCount: hotel.HotelCardToLabel?.length || 0,
        accessibilityOptionsCount:
          hotel.HotelCardToAccessibilityOption?.length || 0,
        imagesCount: hotel.images?.length || 0,
        faqCount: hotel.HotelFAQ?.length || 0,
        hasPolicy: !!hotel.HotelPolicy,
        lastUpdated: new Date().toISOString(),
      },
    };

    return Response.json(hotelWithMetadata, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'hôtel:", error);

    return Response.json(
      {
        error: "Erreur interne du serveur",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
