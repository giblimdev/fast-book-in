// @/app/api/accommodation-type/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/accommodation-type - Récupérer tous les types d'hébergement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause = category ? { category } : {};

    const accommodationTypes = await prisma.accommodationType.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: includeRelations
        ? {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
                basePricePerNight: true,
                currency: true,
              },
              orderBy: [{ overallRating: "desc" }, { name: "asc" }],
            },
            _count: {
              select: {
                HotelCard: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCard: true,
              },
            },
          },
    });

    return NextResponse.json(accommodationTypes);
  } catch (error) {
    console.error("Error fetching accommodation types:", error);
    return NextResponse.json(
      { error: "Failed to fetch accommodation types" },
      { status: 500 }
    );
  }
}

// POST /api/accommodation-type - Créer un nouveau type d'hébergement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, category, description, order } = body;

    console.log("Received data:", { name, code, category, description, order });

    // ✅ Validation complète et détaillée
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Code is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      !category ||
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Category is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // ✅ Validation du code - format plus flexible selon votre schéma
    const cleanCode = code.trim().toUpperCase();
    if (!/^[A-Z0-9_]{2,50}$/.test(cleanCode)) {
      return NextResponse.json(
        {
          error:
            "Code must be 2-50 characters (uppercase letters, numbers, underscores only)",
          received: code,
          cleaned: cleanCode,
        },
        { status: 400 }
      );
    }

    // ✅ Validation des catégories selon votre utilisation
    const validCategories = [
      "Hotel",
      "Apartment",
      "House",
      "Resort",
      "BnB",
      "Hostel",
      "Villa",
      "Chalet",
      "Cabin",
      "Camping",
      "Glamping",
      "Boat",
      "Other",
    ];

    if (!validCategories.includes(category.trim())) {
      return NextResponse.json(
        {
          error: `Category must be one of: ${validCategories.join(", ")}`,
          received: category,
          validOptions: validCategories,
        },
        { status: 400 }
      );
    }

    // ✅ Validation de l'ordre
    let finalOrder = 100; // Valeur par défaut
    if (order !== undefined && order !== null && order !== "") {
      const orderNum = parseInt(order);
      if (isNaN(orderNum) || orderNum < 0 || orderNum > 9999) {
        return NextResponse.json(
          {
            error: "Order must be a number between 0 and 9999",
            received: order,
          },
          { status: 400 }
        );
      }
      finalOrder = orderNum;
    }

    // ✅ Validation de la description
    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { error: "Description must be a string if provided" },
        { status: 400 }
      );
    }

    // ✅ Vérifier l'unicité du code
    const existingCode = await prisma.accommodationType.findFirst({
      where: {
        code: {
          equals: cleanCode,
          mode: "insensitive",
        },
      },
    });

    if (existingCode) {
      return NextResponse.json(
        {
          error: "Accommodation type with this code already exists",
          existingType: {
            id: existingCode.id,
            name: existingCode.name,
            code: existingCode.code,
          },
        },
        { status: 409 }
      );
    }

    // ✅ Vérifier l'unicité du nom
    const existingName = await prisma.accommodationType.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingName) {
      return NextResponse.json(
        {
          error: "Accommodation type with this name already exists",
          existingType: {
            id: existingName.id,
            name: existingName.name,
            code: existingName.code,
          },
        },
        { status: 409 }
      );
    }

    console.log("Creating accommodation type with validated data:", {
      name: name.trim(),
      code: cleanCode,
      category: category.trim(),
      description: description?.trim() || null,
      order: finalOrder,
    });

    // ✅ Créer le type d'hébergement
    const accommodationType = await prisma.accommodationType.create({
      data: {
        name: name.trim(),
        code: cleanCode,
        category: category.trim(),
        description: description?.trim() || null,
        order: finalOrder,
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    console.log("Accommodation type created successfully:", accommodationType);

    return NextResponse.json(accommodationType, { status: 201 });
  } catch (error) {
    console.error("Error creating accommodation type:", error);

    // ✅ Gestion d'erreurs Prisma détaillée
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          // Contrainte d'unicité violée
          const target = (error as any).meta?.target;
          return NextResponse.json(
            {
              error: `Accommodation type with this ${
                target?.[0] || "field"
              } already exists`,
              prismaError: error.code,
              details: (error as any).meta,
            },
            { status: 409 }
          );
        case "P2003":
          return NextResponse.json(
            {
              error: "Invalid reference in the data provided",
              prismaError: error.code,
              details: (error as any).meta,
            },
            { status: 400 }
          );
        case "P2025":
          return NextResponse.json(
            {
              error: "Related record not found",
              prismaError: error.code,
            },
            { status: 404 }
          );
        default:
          console.error("Unhandled Prisma error:", error);
          return NextResponse.json(
            {
              error: "Database error occurred",
              prismaError: error.code,
              message: (error as any).message,
            },
            { status: 500 }
          );
      }
    }

    // ✅ Erreur de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON format in request body",
          details: error.message,
        },
        { status: 400 }
      );
    }

    // ✅ Erreur générique avec plus de détails
    return NextResponse.json(
      {
        error: "Failed to create accommodation type",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
