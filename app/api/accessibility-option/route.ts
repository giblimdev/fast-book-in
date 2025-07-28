import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/accessibility-option - Récupérer toutes les options d'accessibilité
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    const accessibilityOptions = await prisma.accessibilityOption.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: includeRelations
        ? {
            HotelCardToAccessibilityOption: {
              include: {
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
            _count: {
              select: {
                HotelCardToAccessibilityOption: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCardToAccessibilityOption: true,
              },
            },
          },
    });

    return NextResponse.json(accessibilityOptions);
  } catch (error) {
    console.error("Error fetching accessibility options:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessibility options" },
      { status: 500 }
    );
  }
}

// POST /api/accessibility-option - Créer une nouvelle option d'accessibilité
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔍 Received data:", body);

    // Vérifier si c'est un ajout multiple
    if (body.options && Array.isArray(body.options)) {
      return await handleBulkCreate(body.options);
    } else {
      return await handleSingleCreate(body);
    }
  } catch (error) {
    console.error("❌ Error in POST /api/accessibility-option:", error);

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

// Fonction pour créer une seule option
async function handleSingleCreate(data: any) {
  const validation = validateAccessibilityOptionData(data);
  if (!validation.isValid) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const { name, code, category, description, icon, order } = data;

  // Vérifier l'unicité du code
  const existingCode = await prisma.accessibilityOption.findFirst({
    where: {
      code: {
        equals: code.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existingCode) {
    return NextResponse.json(
      {
        error: "Accessibility option with this code already exists",
        field: "code",
        existingOption: {
          id: existingCode.id,
          name: existingCode.name,
          code: existingCode.code,
        },
      },
      { status: 409 }
    );
  }

  // Vérifier l'unicité du nom
  const existingName = await prisma.accessibilityOption.findFirst({
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
        error: "Accessibility option with this name already exists",
        field: "name",
        existingOption: {
          id: existingName.id,
          name: existingName.name,
          code: existingName.code,
        },
      },
      { status: 409 }
    );
  }

  try {
    const accessibilityOption = await prisma.accessibilityOption.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        category: category.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        order: order || 100,
      },
      include: {
        _count: {
          select: {
            HotelCardToAccessibilityOption: true,
          },
        },
      },
    });

    console.log(
      "✅ Accessibility option created successfully:",
      accessibilityOption
    );
    return NextResponse.json(accessibilityOption, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// Fonction pour créer plusieurs options
async function handleBulkCreate(options: any[]) {
  const results = {
    success: [] as any[],
    errors: [] as any[],
  };

  for (let i = 0; i < options.length; i++) {
    const optionData = options[i];
    const validation = validateAccessibilityOptionData(optionData, i);

    if (!validation.isValid) {
      results.errors.push({
        index: i,
        data: optionData,
        ...validation.error,
      });
      continue;
    }

    const cleanCode = optionData.code.trim().toUpperCase();

    try {
      // Vérifier l'unicité
      const [existingCode, existingName] = await Promise.all([
        prisma.accessibilityOption.findFirst({
          where: {
            code: { equals: cleanCode, mode: "insensitive" },
          },
        }),
        prisma.accessibilityOption.findFirst({
          where: {
            name: { equals: optionData.name.trim(), mode: "insensitive" },
          },
        }),
      ]);

      if (existingCode) {
        results.errors.push({
          index: i,
          data: optionData,
          error: `Accessibility option with code "${cleanCode}" already exists`,
          field: "code",
          existingOption: {
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
          data: optionData,
          error: `Accessibility option with name "${optionData.name}" already exists`,
          field: "name",
          existingOption: {
            id: existingName.id,
            name: existingName.name,
            code: existingName.code,
          },
        });
        continue;
      }

      // Créer l'option
      const accessibilityOption = await prisma.accessibilityOption.create({
        data: {
          name: optionData.name.trim(),
          code: cleanCode,
          category: optionData.category.trim(),
          description: optionData.description?.trim() || null,
          icon: optionData.icon?.trim() || null,
          order: optionData.order || 100,
        },
        include: {
          _count: {
            select: {
              HotelCardToAccessibilityOption: true,
            },
          },
        },
      });

      results.success.push({
        index: i,
        option: accessibilityOption,
      });
    } catch (error) {
      results.errors.push({
        index: i,
        data: optionData,
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
        total: options.length,
        success: results.success.length,
        errors: results.errors.length,
      },
      results,
    },
    { status }
  );
}

// Fonction de validation
function validateAccessibilityOptionData(data: any, index?: number) {
  const prefix = index !== undefined ? `Option #${index + 1}: ` : "";

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

  if (data.name.trim().length > 255) {
    return {
      isValid: false,
      error: { error: `${prefix}Name must be less than 255 characters` },
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

  // Validation du code - format unique
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

  // Validation des catégories d'accessibilité
  const validCategories = [
    "Mobility",
    "Visual",
    "Hearing",
    "Cognitive",
    "Physical",
    "Communication",
    "General",
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

  if (data.description && data.description.length > 1000) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Description must be less than 1000 characters`,
        received: data.description?.length,
        field: "description",
      },
    };
  }

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

// PUT /api/accessibility-option - Mettre à jour une option
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Accessibility option ID is required" },
        { status: 400 }
      );
    }

    const validation = validateAccessibilityOptionData(updateData);
    if (!validation.isValid) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const cleanCode = updateData.code.trim().toUpperCase();

    // Vérifier l'unicité du code (exclure l'option actuelle)
    const existingCode = await prisma.accessibilityOption.findFirst({
      where: {
        code: {
          equals: cleanCode,
          mode: "insensitive",
        },
        NOT: {
          id: id,
        },
      },
    });

    if (existingCode) {
      return NextResponse.json(
        {
          error: "Accessibility option with this code already exists",
          field: "code",
          existingOption: {
            id: existingCode.id,
            name: existingCode.name,
            code: existingCode.code,
          },
        },
        { status: 409 }
      );
    }

    // Vérifier l'unicité du nom (exclure l'option actuelle)
    const existingName = await prisma.accessibilityOption.findFirst({
      where: {
        name: {
          equals: updateData.name.trim(),
          mode: "insensitive",
        },
        NOT: {
          id: id,
        },
      },
    });

    if (existingName) {
      return NextResponse.json(
        {
          error: "Accessibility option with this name already exists",
          field: "name",
          existingOption: {
            id: existingName.id,
            name: existingName.name,
            code: existingName.code,
          },
        },
        { status: 409 }
      );
    }

    const updatedOption = await prisma.accessibilityOption.update({
      where: { id },
      data: {
        name: updateData.name.trim(),
        code: cleanCode,
        category: updateData.category.trim(),
        description: updateData.description?.trim() || null,
        icon: updateData.icon?.trim() || null,
        order: updateData.order || 100,
      },
      include: {
        _count: {
          select: {
            HotelCardToAccessibilityOption: true,
          },
        },
      },
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error("Error updating accessibility option:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/accessibility-option - Supprimer une option
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Accessibility option ID is required" },
        { status: 400 }
      );
    }

    // Vérifier si l'option existe
    const existingOption = await prisma.accessibilityOption.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCardToAccessibilityOption: true,
          },
        },
      },
    });

    if (!existingOption) {
      return NextResponse.json(
        { error: "Accessibility option not found" },
        { status: 404 }
      );
    }

    // Vérifier si l'option est utilisée
    if (existingOption._count.HotelCardToAccessibilityOption > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete accessibility option that is being used",
          usageCount: existingOption._count.HotelCardToAccessibilityOption,
        },
        { status: 409 }
      );
    }

    await prisma.accessibilityOption.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Accessibility option deleted successfully",
      deletedOption: {
        id: existingOption.id,
        name: existingOption.name,
        code: existingOption.code,
      },
    });
  } catch (error) {
    console.error("Error deleting accessibility option:", error);
    return handlePrismaError(error);
  }
}

// Gestion des erreurs Prisma
function handlePrismaError(error: any) {
  if (error && typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "P2002":
        const target = error.meta?.target;
        return NextResponse.json(
          {
            error: `Accessibility option with this ${
              target?.[0] || "field"
            } already exists`,
            prismaError: error.code,
            details: error.meta,
            field: target?.[0],
          },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          {
            error: "Accessibility option not found",
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
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
