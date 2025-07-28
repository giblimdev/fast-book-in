// @/app/api/hotel-amenity/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/hotel-amenity/[id] - Récupérer un équipement d'hôtel par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const hotelAmenity = await prisma.hotelAmenity.findUnique({
      where: { id },
      include: includeHotels
        ? {
            // ✅ Relation directe many-to-many selon votre schéma
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
                basePricePerNight: true,
                currency: true,
                accommodationType: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
                destination: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                  },
                },
                hotelGroup: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
            // ✅ Table de jointure avec ordre personnalisé
            HotelCardToHotelAmenity: {
              select: {
                hotelCardId: true,
                order: true,
                createdAt: true,
                hotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                    accommodationType: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    destination: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            // ✅ Compteurs d'utilisation
            _count: {
              select: {
                HotelCard: true,
                HotelCardToHotelAmenity: true,
              },
            },
          }
        : {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
              },
            },
            _count: {
              select: {
                HotelCard: true,
                HotelCardToHotelAmenity: true,
              },
            },
          },
    });

    if (!hotelAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotelAmenity);
  } catch (error) {
    console.error("Error fetching hotel amenity:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel amenity" },
      { status: 500 }
    );
  }
}

// PUT /api/hotel-amenity/[id] - Mettre à jour un équipement d'hôtel
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // Vérifier si l'équipement d'hôtel existe
    const existingHotelAmenity = await prisma.hotelAmenity.findUnique({
      where: { id },
    });

    if (!existingHotelAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity not found" },
        { status: 404 }
      );
    }

    // ✅ Validation du nom si fourni
    if (name !== undefined) {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }

      // Vérifier l'unicité du nom (sauf si c'est le même équipement)
      const nameExists = await prisma.hotelAmenity.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
          NOT: { id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Hotel amenity with this name already exists" },
          { status: 409 }
        );
      }
    }

    // ✅ Validation de la catégorie avec toutes les catégories selon votre schéma
    if (category !== undefined && category !== null) {
      const validCategories = [
        "Location",
        "Amenity",
        "Service",
        "View",
        "Offer",
        "Food",
        "Wellness", // ✅ Ajouté selon les commentaires du schéma
        "Business", // ✅ Ajouté selon les commentaires du schéma
        "Entertainment", // ✅ Ajouté selon les commentaires du schéma
        "Transport", // ✅ Ajouté selon les commentaires du schéma
      ];

      if (category && !validCategories.includes(category)) {
        return NextResponse.json(
          {
            error: `Category must be one of: ${validCategories.join(", ")}`,
            received: category,
          },
          { status: 400 }
        );
      }
    }

    // ✅ Validation de l'ordre
    if (order !== undefined && order !== null) {
      const orderNum = parseFloat(order);
      if (isNaN(orderNum) || orderNum < 0 || orderNum > 9999) {
        return NextResponse.json(
          { error: "Order must be a number between 0 and 9999" },
          { status: 400 }
        );
      }
    }

    // ✅ Validation des autres champs
    if (icon !== undefined && icon !== null && typeof icon !== "string") {
      return NextResponse.json(
        { error: "Icon must be a string" },
        { status: 400 }
      );
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    const updatedHotelAmenity = await prisma.hotelAmenity.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(icon !== undefined && { icon: icon?.trim() || null }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(order !== undefined && { order: order ? parseFloat(order) : 100 }),
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
            HotelCardToHotelAmenity: true,
          },
        },
      },
    });

    return NextResponse.json(updatedHotelAmenity);
  } catch (error) {
    console.error("Error updating hotel amenity:", error);

    // ✅ Gestion d'erreurs Prisma améliorée
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { error: "Hotel amenity with this name already exists" },
            { status: 409 }
          );
        case "P2003":
          return NextResponse.json(
            { error: "Invalid reference in the data provided" },
            { status: 400 }
          );
        case "P2025":
          return NextResponse.json(
            { error: "Hotel amenity not found" },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { error: "Failed to update hotel amenity" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotel-amenity/[id] - Supprimer un équipement d'hôtel
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'équipement d'hôtel existe et récupérer les relations
    const existingHotelAmenity = await prisma.hotelAmenity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCard: true,
            HotelCardToHotelAmenity: true,
          },
        },
      },
    });

    if (!existingHotelAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity not found" },
        { status: 404 }
      );
    }

    // ✅ Vérifier s'il y a des relations en utilisant les compteurs
    const hasRelatedData =
      existingHotelAmenity._count.HotelCard > 0 ||
      existingHotelAmenity._count.HotelCardToHotelAmenity > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel amenity with associated hotels",
          details: {
            directHotelCards: existingHotelAmenity._count.HotelCard,
            linkedHotelCards:
              existingHotelAmenity._count.HotelCardToHotelAmenity,
          },
        },
        { status: 409 }
      );
    }

    await prisma.hotelAmenity.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Hotel amenity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting hotel amenity:", error);

    // ✅ Gestion d'erreurs spécifiques
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Hotel amenity not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete hotel amenity" },
      { status: 500 }
    );
  }
}
