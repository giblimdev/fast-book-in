// @/app/api/gallery-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/gallery-image - Récupérer toutes les images
export async function GET(request: NextRequest) {
  console.log("🚀 [GET] Début de la récupération des images");

  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId");
    const imageCategories = searchParams.get("imageCategories");
    const includeRelations = searchParams.get("include") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    console.log("📋 [GET] Paramètres:", {
      entityId,
      imageCategories,
      includeRelations,
      limit,
      page,
    });

    // ✅ Construction du where clause selon votre schéma
    const whereClause: any = {};

    if (entityId) {
      // Recherche dans tous les champs d'ID possibles selon votre schéma
      whereClause.OR = [
        { hotelCardId: entityId },
        { cityId: entityId },
        { countryId: entityId },
        { neighborhoodId: entityId },
        { destinationId: entityId },
        { hotelRoomtypeId: entityId },
        { landmarkId: entityId },
      ];
    }

    if (imageCategories) {
      whereClause.imageCategories = imageCategories;
    }

    const galleryImages = await prisma.galleryImage.findMany({
      where: whereClause,
      orderBy: {
        order: "asc",
      },
      include: includeRelations
        ? {
            // ✅ Inclusions selon votre schéma avec relations correctes
            image: true,
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
                shortDescription: true,
                basePricePerNight: true,
                currency: true,
                isPartner: true,
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
              },
            },
            city: {
              include: {
                country: true,
                neighborhoods: {
                  take: 3,
                  orderBy: { order: "asc" },
                },
              },
            },
            country: true,
            neighborhood: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
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
            },
            hotelRoomtype: {
              include: {
                hotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                  },
                },
                images: true,
              },
            },
            landmark: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          }
        : {
            image: true, // Toujours inclure l'image de base
          },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.galleryImage.count({ where: whereClause });

    console.log(
      `✅ [GET] ${galleryImages.length} images récupérées sur ${total} total`
    );

    // ✅ Formatage des données pour améliorer la structure de réponse
    const formattedImages = galleryImages.map((galleryImage) => ({
      ...galleryImage,
    }));

    return NextResponse.json({
      data: formattedImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      metadata: {
        categories: await getImageCategoriesStats(),
        totalByEntity: await getImagesByEntityCount(),
      },
    });
  } catch (error) {
    console.error("❌ [GET] Erreur lors de la récupération des images:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des images",
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

// POST /api/gallery-image - Créer une nouvelle image
export async function POST(request: NextRequest) {
  console.log("🚀 [POST] Début de la création d'image");

  try {
    const body = await request.json();
    console.log("📋 [POST] Données reçues:", JSON.stringify(body, null, 2));

    const {
      imageCategories,
      order,
      alt,
      // Relations possibles selon votre schéma
      hotelCardId,
      cityId,
      countryId,
      neighborhoodId,
      destinationId,
      hotelRoomtypeId,
      landmarkId,
      // Données d'image - structure améliorée
      imageData,
    } = body;

    // ✅ Validation selon votre schéma avec catégories exactes
    if (!imageCategories) {
      return NextResponse.json(
        { error: "Le champ imageCategories est requis" },
        { status: 400 }
      );
    }

    // Validation du type d'image selon votre schéma commenté
    const validImageCategories = [
      "hotelCard",
      "hotelRoom",
      "city",
      "country",
      "neighborhood",
      "destination",
      "landmark",
    ];

    if (!validImageCategories.includes(imageCategories)) {
      return NextResponse.json(
        {
          error: `imageCategories doit être l'un de : ${validImageCategories.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validation qu'au moins une relation est fournie
    const relationFields = [
      hotelCardId,
      cityId,
      countryId,
      neighborhoodId,
      destinationId,
      hotelRoomtypeId,
      landmarkId,
    ];

    if (!relationFields.some((field) => field)) {
      return NextResponse.json(
        {
          error:
            "Au moins une relation doit être spécifiée (hotelCardId, cityId, etc.)",
        },
        { status: 400 }
      );
    }

    // Validation de l'ordre
    if (order !== undefined && (order < 1 || order > 100)) {
      return NextResponse.json(
        { error: "L'ordre doit être entre 1 et 100" },
        { status: 400 }
      );
    }

    // ✅ Vérifications d'existence des entités liées avec détails
    const validationErrors = [];

    if (hotelCardId) {
      const hotelExists = await prisma.hotelCard.findUnique({
        where: { id: hotelCardId },
        select: { id: true, name: true },
      });
      if (!hotelExists) {
        validationErrors.push(`Hôtel avec l'ID ${hotelCardId} n'existe pas`);
      }
    }

    if (cityId) {
      const cityExists = await prisma.city.findUnique({
        where: { id: cityId },
        select: { id: true, name: true },
      });
      if (!cityExists) {
        validationErrors.push(`Ville avec l'ID ${cityId} n'existe pas`);
      }
    }

    if (countryId) {
      const countryExists = await prisma.country.findUnique({
        where: { id: countryId },
        select: { id: true, name: true },
      });
      if (!countryExists) {
        validationErrors.push(`Pays avec l'ID ${countryId} n'existe pas`);
      }
    }

    if (neighborhoodId) {
      const neighborhoodExists = await prisma.neighborhood.findUnique({
        where: { id: neighborhoodId },
        select: { id: true, name: true },
      });
      if (!neighborhoodExists) {
        validationErrors.push(
          `Quartier avec l'ID ${neighborhoodId} n'existe pas`
        );
      }
    }

    if (destinationId) {
      const destinationExists = await prisma.destination.findUnique({
        where: { id: destinationId },
        select: { id: true, name: true },
      });
      if (!destinationExists) {
        validationErrors.push(
          `Destination avec l'ID ${destinationId} n'existe pas`
        );
      }
    }

    if (hotelRoomtypeId) {
      const roomTypeExists = await prisma.hotelRoomType.findUnique({
        where: { id: hotelRoomtypeId },
        select: { id: true, name: true },
      });
      if (!roomTypeExists) {
        validationErrors.push(
          `Type de chambre avec l'ID ${hotelRoomtypeId} n'existe pas`
        );
      }
    }

    if (landmarkId) {
      const landmarkExists = await prisma.landmark.findUnique({
        where: { id: landmarkId },
        select: { id: true, name: true },
      });
      if (!landmarkExists) {
        validationErrors.push(
          `Point d'intérêt avec l'ID ${landmarkId} n'existe pas`
        );
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Erreurs de validation",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    console.log("✅ [POST] Toutes les validations réussies");

    // ✅ Gestion transactionnelle pour créer l'image et la gallerie
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'image d'abord si des données d'image sont fournies
      let createdImage = null;
      if (
        imageData &&
        (imageData.slug || imageData.description || imageData.path)
      ) {
        createdImage = await tx.image.create({
          data: {
            slug: imageData.slug?.trim() || null,
            description: imageData.description?.trim() || null,
            path: imageData.path?.trim() || null,
          },
        });
      }

      // Créer l'entrée de galerie
      const galleryImage = await tx.galleryImage.create({
        data: {
          imageCategories,
          order: order || 20,
          alt: alt?.trim() || null,
          // Relations optionnelles
          hotelCardId: hotelCardId || null,
          cityId: cityId || null,
          countryId: countryId || null,
          neighborhoodId: neighborhoodId || null,
          destinationId: destinationId || null,
          hotelRoomtypeId: hotelRoomtypeId || null,
          landmarkId: landmarkId || null,
        },
        include: {
          image: true,
          HotelCard: hotelCardId
            ? {
                select: {
                  id: true,
                  name: true,
                  starRating: true,
                },
              }
            : false,
          city: cityId
            ? {
                include: {
                  country: true,
                },
              }
            : false,
          country: countryId ? true : false,
          neighborhood: neighborhoodId
            ? {
                include: {
                  city: {
                    include: {
                      country: true,
                    },
                  },
                },
              }
            : false,
          destination: destinationId
            ? {
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
              }
            : false,
          hotelRoomtype: hotelRoomtypeId
            ? {
                include: {
                  hotelCard: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              }
            : false,
          landmark: landmarkId
            ? {
                include: {
                  city: {
                    include: {
                      country: true,
                    },
                  },
                },
              }
            : false,
        },
      });

      // Connecter l'image créée si elle existe - utilisation de la relation many-to-many
      if (createdImage && galleryImage.id) {
        await tx.galleryImage.update({
          where: { id: galleryImage.id },
          data: {
            image: {
              connect: { id: createdImage.id },
            },
          },
        });
      }

      return galleryImage;
    });

    console.log("✅ [POST] Image de galerie créée avec succès:", result.id);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("❌ [POST] Erreur lors de la création de l'image:", error);

    // Gestion spécifique des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2003":
          return NextResponse.json(
            { error: "Référence invalide vers une entité liée" },
            { status: 400 }
          );
        case "P2002":
          return NextResponse.json(
            { error: "Cette combinaison d'image existe déjà" },
            { status: 409 }
          );
        case "P2025":
          return NextResponse.json(
            { error: "Enregistrement non trouvé" },
            { status: 404 }
          );
        default:
          console.error("Code d'erreur Prisma non géré:", error.code);
      }
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la création de l'image",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ Fonctions utilitaires pour les statistiques
async function getImageCategoriesStats() {
  try {
    const stats = await prisma.galleryImage.groupBy({
      by: ["imageCategories"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    return stats.map((stat) => ({
      category: stat.imageCategories,
      count: stat._count.id,
    }));
  } catch (error) {
    console.error(
      "Erreur lors du calcul des statistiques par catégorie:",
      error
    );
    return [];
  }
}

async function getImagesByEntityCount() {
  try {
    const entities = {
      hotels: await prisma.galleryImage.count({
        where: { hotelCardId: { not: null } },
      }),
      cities: await prisma.galleryImage.count({
        where: { cityId: { not: null } },
      }),
      countries: await prisma.galleryImage.count({
        where: { countryId: { not: null } },
      }),
      neighborhoods: await prisma.galleryImage.count({
        where: { neighborhoodId: { not: null } },
      }),
      destinations: await prisma.galleryImage.count({
        where: { destinationId: { not: null } },
      }),
      roomTypes: await prisma.galleryImage.count({
        where: { hotelRoomtypeId: { not: null } },
      }),
      landmarks: await prisma.galleryImage.count({
        where: { landmarkId: { not: null } },
      }),
    };

    return entities;
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques par entité:", error);
    return {};
  }
}
