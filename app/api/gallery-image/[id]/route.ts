// @/app/api/gallery-image/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/gallery-image/[id] - Récupérer une image de galerie par ID
export async function GET(request: NextRequest, context: RouteContext) {
  console.log("🚀 [GET] Début de la récupération d'image par ID");

  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;
    console.log("📋 [GET] ID reçu:", id);

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    // ✅ Requête selon votre schéma GalleryImage avec inclusions corrigées
    const galleryImage = await prisma.galleryImage.findUnique({
      where: { id },
      include: {
        // ✅ Toujours inclure les images liées (relation many-to-many)
        image: true,

        // ✅ Inclusions conditionnelles selon votre schéma
        ...(includeRelations && {
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
              accommodationType: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              // ✅ Correction : destination avec DestinationToCity
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
              hotelGroup: {
                select: {
                  id: true,
                  name: true,
                },
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
                },
                orderBy: { order: "asc" },
              },
            },
          },
          city: {
            include: {
              country: true,
              neighborhoods: {
                take: 5,
                orderBy: { order: "asc" },
              },
              landmarks: {
                take: 5,
                orderBy: { order: "asc" },
              },
            },
          },
          country: {
            include: {
              cities: {
                take: 10,
                orderBy: { order: "asc" },
              },
            },
          },
          neighborhood: {
            include: {
              city: {
                include: {
                  country: true,
                },
              },
            },
          },
          // ✅ Correction : destination directe avec DestinationToCity
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
              CancellationPolicy: {
                select: {
                  id: true,
                  name: true,
                },
              },
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
        }),

        // ✅ Inclusions de base même sans relations complètes
        ...(!includeRelations && {
          HotelCard: {
            select: {
              id: true,
              name: true,
              starRating: true,
            },
          },
          city: {
            select: {
              id: true,
              name: true,
              country: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
          // ✅ Inclusion de base pour destination
          destination: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        }),
      },
    });

    if (!galleryImage) {
      console.warn("❌ [GET] Image de galerie non trouvée:", id);
      return NextResponse.json(
        { error: "Image de galerie non trouvée" },
        { status: 404 }
      );
    }

    console.log("✅ [GET] Image trouvée:", galleryImage.imageCategories);

    // ✅ Formatage de la réponse enrichie avec vérification des types
    const enrichedImage = {
      ...galleryImage,
      // Entité liée principal
      entity: {
        type: galleryImage.imageCategories,
        hotel: galleryImage.HotelCard || null,
        city: galleryImage.city || null,
        country: galleryImage.country || null,
        neighborhood: galleryImage.neighborhood || null,
        // ✅ Correction : vérification de l'existence de DestinationToCity
        destination: galleryImage.destination
          ? {
              ...galleryImage.destination,
              cities:
                (galleryImage.destination as any).DestinationToCity?.map(
                  (rel: { city: any }) => rel.city
                ) || [],
            }
          : null,
        roomType: galleryImage.hotelRoomtype || null,
        landmark: galleryImage.landmark || null,
      },
      // URLs des images liées
      imageUrls:
        galleryImage.image?.map((img) => ({
          id: img.id,
          slug: img.slug,
          description: img.description,
          path: img.path,
        })) || [],
    };

    return NextResponse.json(enrichedImage);
  } catch (error) {
    console.error("❌ [GET] Erreur lors de la récupération de l'image:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'image",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/gallery-image/[id] - Mettre à jour une image de galerie
export async function PUT(request: NextRequest, context: RouteContext) {
  console.log("🚀 [PUT] Début de la mise à jour d'image");

  try {
    const { id } = await context.params;
    const body = await request.json();

    console.log("📋 [PUT] ID:", id);
    console.log("📋 [PUT] Données reçues:", JSON.stringify(body, null, 2));

    const {
      imageCategories,
      order,
      alt,
      hotelCardId,
      cityId,
      countryId,
      neighborhoodId,
      destinationId,
      hotelRoomtypeId,
      landmarkId,
      imageIds,
      imageData,
    } = body;

    // ✅ Vérifier si l'image de galerie existe
    const existingGalleryImage = await prisma.galleryImage.findUnique({
      where: { id },
      include: {
        image: true,
      },
    });

    if (!existingGalleryImage) {
      console.warn("❌ [PUT] Image de galerie non trouvée:", id);
      return NextResponse.json(
        { error: "Image de galerie non trouvée" },
        { status: 404 }
      );
    }

    console.log(
      "✅ [PUT] Image existante trouvée:",
      existingGalleryImage.imageCategories
    );

    // ✅ Validation du type d'image selon votre schéma
    if (imageCategories) {
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
    }

    // Validation de l'ordre
    if (order !== undefined && (order < 1 || order > 100)) {
      return NextResponse.json(
        { error: "L'ordre doit être entre 1 et 100" },
        { status: 400 }
      );
    }

    // ✅ Vérifications des entités liées si modifiées
    const validationErrors = [];

    if (hotelCardId && hotelCardId !== existingGalleryImage.hotelCardId) {
      const hotelExists = await prisma.hotelCard.findUnique({
        where: { id: hotelCardId },
        select: { id: true, name: true },
      });
      if (!hotelExists) {
        validationErrors.push(`Hôtel avec l'ID ${hotelCardId} n'existe pas`);
      }
    }

    if (cityId && cityId !== existingGalleryImage.cityId) {
      const cityExists = await prisma.city.findUnique({
        where: { id: cityId },
        select: { id: true, name: true },
      });
      if (!cityExists) {
        validationErrors.push(`Ville avec l'ID ${cityId} n'existe pas`);
      }
    }

    if (countryId && countryId !== existingGalleryImage.countryId) {
      const countryExists = await prisma.country.findUnique({
        where: { id: countryId },
        select: { id: true, name: true },
      });
      if (!countryExists) {
        validationErrors.push(`Pays avec l'ID ${countryId} n'existe pas`);
      }
    }

    if (
      neighborhoodId &&
      neighborhoodId !== existingGalleryImage.neighborhoodId
    ) {
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

    if (destinationId && destinationId !== existingGalleryImage.destinationId) {
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

    if (
      hotelRoomtypeId &&
      hotelRoomtypeId !== existingGalleryImage.hotelRoomtypeId
    ) {
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

    if (landmarkId && landmarkId !== existingGalleryImage.landmarkId) {
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

    // Validation des images à connecter
    if (imageIds && Array.isArray(imageIds)) {
      for (const imageId of imageIds) {
        const imageExists = await prisma.image.findUnique({
          where: { id: imageId },
          select: { id: true },
        });
        if (!imageExists) {
          validationErrors.push(`Image avec l'ID ${imageId} n'existe pas`);
        }
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

    console.log("✅ [PUT] Toutes les validations réussies");

    // ✅ Mise à jour avec transaction
    const updatedGalleryImage = await prisma.$transaction(async (tx) => {
      // Créer de nouvelles images si nécessaire
      const createdImages = [];
      if (imageData && Array.isArray(imageData)) {
        for (const imgData of imageData) {
          if (imgData.slug || imgData.description || imgData.path) {
            const createdImage = await tx.image.create({
              data: {
                slug: imgData.slug?.trim() || null,
                description: imgData.description?.trim() || null,
                path: imgData.path?.trim() || null,
              },
            });
            createdImages.push(createdImage);
          }
        }
      }

      // Mettre à jour l'entrée de galerie
      const updated = await tx.galleryImage.update({
        where: { id },
        data: {
          imageCategories:
            imageCategories || existingGalleryImage.imageCategories,
          order: order !== undefined ? order : existingGalleryImage.order,
          alt: alt !== undefined ? alt?.trim() : existingGalleryImage.alt,
          // Relations optionnelles
          hotelCardId:
            hotelCardId !== undefined
              ? hotelCardId
              : existingGalleryImage.hotelCardId,
          cityId: cityId !== undefined ? cityId : existingGalleryImage.cityId,
          countryId:
            countryId !== undefined
              ? countryId
              : existingGalleryImage.countryId,
          neighborhoodId:
            neighborhoodId !== undefined
              ? neighborhoodId
              : existingGalleryImage.neighborhoodId,
          destinationId:
            destinationId !== undefined
              ? destinationId
              : existingGalleryImage.destinationId,
          hotelRoomtypeId:
            hotelRoomtypeId !== undefined
              ? hotelRoomtypeId
              : existingGalleryImage.hotelRoomtypeId,
          landmarkId:
            landmarkId !== undefined
              ? landmarkId
              : existingGalleryImage.landmarkId,
        },
        include: {
          image: true,
          HotelCard: {
            select: {
              id: true,
              name: true,
              starRating: true,
            },
          },
          city: {
            include: {
              country: true,
            },
          },
          country: true,
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
      });

      // Gérer les images (connecter nouvelles/existantes)
      if (imageIds || createdImages.length > 0) {
        const imagesToConnect = [
          ...createdImages.map((img) => ({ id: img.id })),
          ...(imageIds || []).map((imgId: string) => ({ id: imgId })),
        ];

        if (imagesToConnect.length > 0) {
          await tx.galleryImage.update({
            where: { id },
            data: {
              image: {
                set: [], // Déconnecter toutes les anciennes images
                connect: imagesToConnect, // Connecter les nouvelles
              },
            },
          });
        }
      }

      return updated;
    });

    console.log(
      "✅ [PUT] Image de galerie mise à jour avec succès:",
      updatedGalleryImage.id
    );

    return NextResponse.json(updatedGalleryImage);
  } catch (error) {
    console.error("❌ [PUT] Erreur lors de la mise à jour:", error);

    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2003":
          return NextResponse.json(
            { error: "Référence invalide vers une entité liée" },
            { status: 400 }
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
        error: "Erreur lors de la mise à jour de l'image",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Identique à votre version actuelle
export async function DELETE(request: NextRequest, context: RouteContext) {
  console.log("🚀 [DELETE] Début de la suppression d'image");

  try {
    const { id } = await context.params;
    console.log("📋 [DELETE] ID:", id);

    const existingGalleryImage = await prisma.galleryImage.findUnique({
      where: { id },
      include: {
        image: true,
        HotelCard: {
          select: {
            id: true,
            name: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingGalleryImage) {
      console.warn("❌ [DELETE] Image de galerie non trouvée:", id);
      return NextResponse.json(
        { error: "Image de galerie non trouvée" },
        { status: 404 }
      );
    }

    console.log(
      "✅ [DELETE] Image existante trouvée:",
      existingGalleryImage.imageCategories
    );

    const linkedEntity =
      existingGalleryImage.HotelCard || existingGalleryImage.city;
    if (linkedEntity) {
      console.log(
        `🔗 [DELETE] Image liée à l'entité: ${linkedEntity.name} (${existingGalleryImage.imageCategories})`
      );
    }

    await prisma.galleryImage.delete({
      where: { id },
    });

    console.log("✅ [DELETE] Image de galerie supprimée avec succès:", id);

    return NextResponse.json(
      {
        message: "Image de galerie supprimée avec succès",
        deletedImage: {
          id: existingGalleryImage.id,
          imageCategories: existingGalleryImage.imageCategories,
          linkedImages: existingGalleryImage.image?.length || 0,
          linkedEntity: linkedEntity
            ? {
                id: linkedEntity.id,
                name: linkedEntity.name,
                type: existingGalleryImage.imageCategories,
              }
            : null,
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
              "Impossible de supprimer cette image car elle est référencée par d'autres données",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la suppression de l'image",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
