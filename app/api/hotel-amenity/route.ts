// @/app/api/hotel-amenity/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-amenity - Récupérer tous les équipements d'hôtels
export async function GET(request: NextRequest) {
  try {
    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = category ? { category } : {};

    const hotelAmenities = await prisma.hotelAmenity.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: includeRelations
        ? {
            // ✅ Relation directe avec HotelCard selon votre schéma
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
                basePricePerNight: true,
                currency: true,
                destination: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                  },
                },
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
            // ✅ Table de jointure selon votre schéma
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
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            // ✅ Compteur d'utilisation
            _count: {
              select: {
                HotelCard: true,
                HotelCardToHotelAmenity: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCard: true,
                HotelCardToHotelAmenity: true,
              },
            },
          },
    });

    return NextResponse.json(hotelAmenities);
  } catch (error) {
    console.error("Error fetching hotel amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel amenities" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-amenity - Créer un nouvel équipement d'hôtel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, icon, description, order } = body;

    // ✅ Validation complète
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // ✅ Validation de la catégorie selon votre schéma (commentaire dans le schéma)
    if (category) {
      const validCategories = [
        "Location",
        "Amenity",
        "Service",
        "View",
        "Offer",
        "Food",
        "Wellness", // ✅ Ajouté selon les catégories courantes
        "Business", // ✅ Ajouté selon les catégories courantes
        "Entertainment", // ✅ Ajouté selon les catégories courantes
        "Transport", // ✅ Ajouté selon les catégories courantes
      ];

      if (!validCategories.includes(category)) {
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
      const orderNum = parseInt(order);
      if (isNaN(orderNum) || orderNum < 0 || orderNum > 9999) {
        return NextResponse.json(
          { error: "Order must be a number between 0 and 9999" },
          { status: 400 }
        );
      }
    }

    // ✅ Validation de l'icône (optionnelle mais si fournie, doit être valide)
    if (icon && typeof icon !== "string") {
      return NextResponse.json(
        { error: "Icon must be a string" },
        { status: 400 }
      );
    }

    // ✅ Validation de la description
    if (description && typeof description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    // ✅ Vérifier si un équipement avec le même nom existe déjà
    const existingAmenity = await prisma.hotelAmenity.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive", // Insensible à la casse
        },
      },
    });

    if (existingAmenity) {
      return NextResponse.json(
        { error: "Hotel amenity with this name already exists" },
        { status: 409 }
      );
    }

    const hotelAmenity = await prisma.hotelAmenity.create({
      data: {
        name: name.trim(),
        category: category?.trim() || null,
        icon: icon?.trim() || null,
        description: description?.trim() || null,
        order: order ? parseInt(order) : 100,
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

    return NextResponse.json(hotelAmenity, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel amenity:", error);

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
            { error: "Related record not found" },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { error: "Failed to create hotel amenity" },
      { status: 500 }
    );
  }
}
