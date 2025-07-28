// @/app/api/label/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/label - Récupérer tous les labels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minPriority = searchParams.get("minPriority");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (minPriority) {
      whereClause.priority = {
        gte: parseInt(minPriority),
      };
    }

    const labels = await prisma.label.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { order: "asc" }, { name: "asc" }],
      include: includeRelations
        ? {
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
            },
            HotelCardToLabel: {
              include: {
                hotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                    basePricePerNight: true,
                    currency: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                HotelCardToLabel: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCardToLabel: true,
              },
            },
          },
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}

// POST /api/label - Créer un nouveau label ou plusieurs labels
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔍 Received data:", body);

    // ✅ Vérifier si c'est un ajout multiple
    if (body.labels && Array.isArray(body.labels)) {
      return await handleBulkCreate(body.labels);
    } else {
      return await handleSingleCreate(body);
    }
  } catch (error) {
    console.error("❌ Error in POST /api/label:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON format in request body",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ✅ Fonction pour créer un seul label
async function handleSingleCreate(data: any) {
  const validation = validateLabelData(data);
  if (!validation.isValid) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const {
    name,
    code,
    category,
    description,
    icon,
    color,
    priority,
    order,
    hotelDetailsId,
  } = data;

  const cleanCode = code.trim().toUpperCase();

  // ✅ Vérifier l'unicité du code
  const existingCode = await prisma.label.findFirst({
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
        error: "Label with this code already exists",
        field: "code",
        existingLabel: {
          id: existingCode.id,
          name: existingCode.name,
          code: existingCode.code,
        },
      },
      { status: 409 }
    );
  }

  // ✅ Vérifier l'unicité du nom
  const existingName = await prisma.label.findFirst({
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
        error: "Label with this name already exists",
        field: "name",
        existingLabel: {
          id: existingName.id,
          name: existingName.name,
          code: existingName.code,
        },
      },
      { status: 409 }
    );
  }

  // ✅ Vérifier hotelDetailsId si fourni
  if (hotelDetailsId && hotelDetailsId.trim()) {
    const hotelDetails = await prisma.hotelDetails.findUnique({
      where: { id: hotelDetailsId },
    });

    if (!hotelDetails) {
      return NextResponse.json(
        { error: "Hotel details not found", field: "hotelDetailsId" },
        { status: 404 }
      );
    }
  }

  try {
    const label = await prisma.label.create({
      data: {
        name: name.trim(),
        code: cleanCode,
        category: category.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        color: color?.trim() || null,
        priority: priority ? parseInt(priority) : 0,
        order: order ? parseInt(order) : 100,
        ...(hotelDetailsId?.trim() && {
          hotelDetailsId: hotelDetailsId.trim(),
        }),
      },
      include: {
        HotelDetails: hotelDetailsId
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
              },
            }
          : undefined,
        _count: {
          select: {
            HotelCardToLabel: true,
          },
        },
      },
    });

    console.log("✅ Label created successfully:", label);
    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// ✅ Fonction pour créer plusieurs labels
async function handleBulkCreate(labels: any[]) {
  const results = {
    success: [] as any[],
    errors: [] as any[],
  };

  for (let i = 0; i < labels.length; i++) {
    const labelData = labels[i];
    const validation = validateLabelData(labelData, i);

    if (!validation.isValid) {
      results.errors.push({
        index: i,
        data: labelData,
        ...validation.error,
      });
      continue;
    }

    const cleanCode = labelData.code.trim().toUpperCase();

    try {
      // Vérifier l'unicité
      const [existingCode, existingName] = await Promise.all([
        prisma.label.findFirst({
          where: {
            code: { equals: cleanCode, mode: "insensitive" },
          },
        }),
        prisma.label.findFirst({
          where: {
            name: { equals: labelData.name.trim(), mode: "insensitive" },
          },
        }),
      ]);

      if (existingCode) {
        results.errors.push({
          index: i,
          data: labelData,
          error: `Label with code "${cleanCode}" already exists`,
          field: "code",
          existingLabel: {
            id: existingCode.id,
            name: existingCode.name,
            code: existingCode.code,
          },
        });
        continue;
      }

      if (existingName) {
        results.errors.push({
          index: i,
          data: labelData,
          error: `Label with name "${labelData.name}" already exists`,
          field: "name",
          existingLabel: {
            id: existingName.id,
            name: existingName.name,
            code: existingName.code,
          },
        });
        continue;
      }

      // Créer le label
      const label = await prisma.label.create({
        data: {
          name: labelData.name.trim(),
          code: cleanCode,
          category: labelData.category.trim(),
          description: labelData.description?.trim() || null,
          icon: labelData.icon?.trim() || null,
          color: labelData.color?.trim() || null,
          priority: labelData.priority ? parseInt(labelData.priority) : 0,
          order: labelData.order ? parseInt(labelData.order) : 100,
          ...(labelData.hotelDetailsId?.trim() && {
            hotelDetailsId: labelData.hotelDetailsId.trim(),
          }),
        },
        include: {
          _count: {
            select: {
              HotelCardToLabel: true,
            },
          },
        },
      });

      results.success.push({
        index: i,
        label,
      });
    } catch (error) {
      results.errors.push({
        index: i,
        data: labelData,
        error: `Database error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }

  const status =
    results.errors.length === 0
      ? 201
      : results.success.length === 0
      ? 400
      : 207; // 207 = Multi-Status

  return NextResponse.json(
    {
      summary: {
        total: labels.length,
        success: results.success.length,
        errors: results.errors.length,
      },
      results,
    },
    { status }
  );
}

// ✅ Fonction de validation
function validateLabelData(data: any, index?: number) {
  const prefix = index !== undefined ? `Label #${index + 1}: ` : "";

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Name is required and must be a non-empty string`,
      },
    };
  }

  if (
    !data.code ||
    typeof data.code !== "string" ||
    data.code.trim().length === 0
  ) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Code is required and must be a non-empty string`,
      },
    };
  }

  // ✅ Validation du code - minimum 1 caractère (corrigé)
  const cleanCode = data.code.trim().toUpperCase();
  if (!/^[A-Z0-9_]{1,50}$/.test(cleanCode)) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Code must be 1-50 characters (uppercase letters, numbers, underscores only)`,
        received: data.code,
        cleaned: cleanCode,
        field: "code",
      },
    };
  }

  if (
    !data.category ||
    typeof data.category !== "string" ||
    data.category.trim().length === 0
  ) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Category is required and must be a non-empty string`,
      },
    };
  }

  // ✅ Validation des catégories
  const validCategories = [
    "Quality",
    "Location",
    "Service",
    "Amenity",
    "Experience",
    "Value",
    "Accessibility",
    "Sustainability",
    "Business",
    "Family",
    "Romantic",
    "Adventure",
    "Luxury",
    "Budget",
    "Popular",
    "New",
    "Promoted",
    "Special",
  ];

  if (!validCategories.includes(data.category.trim())) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Category must be one of: ${validCategories.join(
          ", "
        )}`,
        received: data.category,
        validOptions: validCategories,
        field: "category",
      },
    };
  }

  // ✅ Validation de la couleur
  if (
    data.color &&
    data.color.trim() &&
    !/^#[0-9A-Fa-f]{6}$/.test(data.color.trim())
  ) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Color must be a valid hex color (e.g., #FF0000) or empty`,
        received: data.color,
        field: "color",
      },
    };
  }

  // ✅ Validation de la priorité
  if (data.priority !== undefined && data.priority !== null) {
    const priorityNum = parseInt(data.priority);
    if (isNaN(priorityNum) || priorityNum < 0 || priorityNum > 100) {
      return {
        isValid: false,
        error: {
          error: `${prefix}Priority must be a number between 0 and 100`,
          received: data.priority,
          field: "priority",
        },
      };
    }
  }

  // ✅ Validation de l'ordre
  if (data.order !== undefined && data.order !== null) {
    const orderNum = parseInt(data.order);
    if (isNaN(orderNum) || orderNum < 0 || orderNum > 9999) {
      return {
        isValid: false,
        error: {
          error: `${prefix}Order must be a number between 0 and 9999`,
          received: data.order,
          field: "order",
        },
      };
    }
  }

  return { isValid: true };
}

// ✅ Gestion des erreurs Prisma
function handlePrismaError(error: any) {
  if (error && typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "P2002":
        const target = error.meta?.target;
        return NextResponse.json(
          {
            error: `Label with this ${target?.[0] || "field"} already exists`,
            prismaError: error.code,
            details: error.meta,
            field: target?.[0],
          },
          { status: 409 }
        );
      case "P2003":
        return NextResponse.json(
          {
            error:
              "Invalid reference in the data provided (e.g., hotelDetailsId)",
            prismaError: error.code,
            details: error.meta,
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
            message: error.message,
          },
          { status: 500 }
        );
    }
  }

  return NextResponse.json(
    {
      error: "Failed to create label",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
