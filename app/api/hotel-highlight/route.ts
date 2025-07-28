import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-highlight - Récupérer tous les highlights d'hôtel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isPromoted = searchParams.get("isPromoted");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isPromoted !== null && isPromoted !== undefined) {
      whereClause.isPromoted = isPromoted === "true";
    }

    const hotelHighlights = await prisma.hotelHighlight.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { order: "asc" }, { title: "asc" }],
      include: includeRelations
        ? {
            HotelCardToHotelHighlight: {
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
                HotelCardToHotelHighlight: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelCardToHotelHighlight: true,
              },
            },
          },
    });

    return NextResponse.json(hotelHighlights);
  } catch (error) {
    console.error("Error fetching hotel highlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel highlights" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-highlight - Créer un nouveau highlight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔍 Received data:", body);

    // Vérifier si c'est un ajout multiple
    if (body.highlights && Array.isArray(body.highlights)) {
      return await handleBulkCreate(body.highlights);
    } else {
      return await handleSingleCreate(body);
    }
  } catch (error) {
    console.error("❌ Error in POST /api/hotel-highlight:", error);

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

// Fonction pour créer un seul highlight
async function handleSingleCreate(data: any) {
  const validation = validateHotelHighlightData(data);
  if (!validation.isValid) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const {
    title,
    description,
    category,
    icon,
    priority,
    order,
    isPromoted,
    hotelId,
  } = data;

  // Vérifier l'unicité du titre par hôtel
  const existingHighlight = await prisma.hotelHighlight.findFirst({
    where: {
      title: {
        equals: title.trim(),
        mode: "insensitive",
      },
      hotelId: hotelId,
    },
  });

  if (existingHighlight) {
    return NextResponse.json(
      {
        error: "Hotel highlight with this title already exists for this hotel",
        field: "title",
        existingHighlight: {
          id: existingHighlight.id,
          title: existingHighlight.title,
        },
      },
      { status: 409 }
    );
  }

  try {
    const hotelHighlight = await prisma.hotelHighlight.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category.trim(),
        icon: icon?.trim() || null,
        priority: priority || 0,
        order: order || 100,
        isPromoted: isPromoted || false,
        hotelId: hotelId,
      },
      include: {
        _count: {
          select: {
            HotelCardToHotelHighlight: true,
          },
        },
      },
    });

    console.log("✅ Hotel highlight created successfully:", hotelHighlight);
    return NextResponse.json(hotelHighlight, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// Fonction pour créer plusieurs highlights
async function handleBulkCreate(highlights: any[]) {
  const results = {
    success: [] as any[],
    errors: [] as any[],
  };

  for (let i = 0; i < highlights.length; i++) {
    const highlightData = highlights[i];
    const validation = validateHotelHighlightData(highlightData, i);

    if (!validation.isValid) {
      results.errors.push({
        index: i,
        data: highlightData,
        ...validation.error,
      });
      continue;
    }

    try {
      // Vérifier l'unicité
      const existingHighlight = await prisma.hotelHighlight.findFirst({
        where: {
          title: { equals: highlightData.title.trim(), mode: "insensitive" },
          hotelId: highlightData.hotelId,
        },
      });

      if (existingHighlight) {
        results.errors.push({
          index: i,
          data: highlightData,
          error: `Hotel highlight with title "${highlightData.title}" already exists for this hotel`,
          field: "title",
          existingHighlight: {
            id: existingHighlight.id,
            title: existingHighlight.title,
          },
        });
        continue;
      }

      // Créer le highlight
      const hotelHighlight = await prisma.hotelHighlight.create({
        data: {
          title: highlightData.title.trim(),
          description: highlightData.description?.trim() || null,
          category: highlightData.category.trim(),
          icon: highlightData.icon?.trim() || null,
          priority: highlightData.priority || 0,
          order: highlightData.order || 100,
          isPromoted: highlightData.isPromoted || false,
          hotelId: highlightData.hotelId,
        },
        include: {
          _count: {
            select: {
              HotelCardToHotelHighlight: true,
            },
          },
        },
      });

      results.success.push({
        index: i,
        highlight: hotelHighlight,
      });
    } catch (error) {
      results.errors.push({
        index: i,
        data: highlightData,
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
        total: highlights.length,
        success: results.success.length,
        errors: results.errors.length,
      },
      results,
    },
    { status }
  );
}

// Fonction de validation
function validateHotelHighlightData(data: any, index?: number) {
  const prefix = index !== undefined ? `Highlight #${index + 1}: ` : "";

  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim().length === 0
  ) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Title is required and must be a non-empty string`,
      },
    };
  }

  if (data.title.trim().length > 255) {
    return {
      isValid: false,
      error: { error: `${prefix}Title must be less than 255 characters` },
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

  // Validation des catégories
  const validCategories = [
    "Location",
    "Amenity",
    "Service",
    "View",
    "Offer",
    "Food",
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

  if (
    !data.hotelId ||
    typeof data.hotelId !== "string" ||
    data.hotelId.trim().length === 0
  ) {
    return {
      isValid: false,
      error: { error: `${prefix}Hotel ID is required` },
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

// PUT /api/hotel-highlight - Mettre à jour un highlight
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Hotel highlight ID is required" },
        { status: 400 }
      );
    }

    const validation = validateHotelHighlightData(updateData);
    if (!validation.isValid) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    // Vérifier l'unicité du titre (exclure le highlight actuel)
    const existingHighlight = await prisma.hotelHighlight.findFirst({
      where: {
        title: {
          equals: updateData.title.trim(),
          mode: "insensitive",
        },
        hotelId: updateData.hotelId,
        NOT: {
          id: id,
        },
      },
    });

    if (existingHighlight) {
      return NextResponse.json(
        {
          error:
            "Hotel highlight with this title already exists for this hotel",
          field: "title",
          existingHighlight: {
            id: existingHighlight.id,
            title: existingHighlight.title,
          },
        },
        { status: 409 }
      );
    }

    const updatedHighlight = await prisma.hotelHighlight.update({
      where: { id },
      data: {
        title: updateData.title.trim(),
        description: updateData.description?.trim() || null,
        category: updateData.category.trim(),
        icon: updateData.icon?.trim() || null,
        priority: updateData.priority || 0,
        order: updateData.order || 100,
        isPromoted: updateData.isPromoted || false,
        hotelId: updateData.hotelId,
      },
      include: {
        _count: {
          select: {
            HotelCardToHotelHighlight: true,
          },
        },
      },
    });

    return NextResponse.json(updatedHighlight);
  } catch (error) {
    console.error("Error updating hotel highlight:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/hotel-highlight - Supprimer un highlight
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hotel highlight ID is required" },
        { status: 400 }
      );
    }

    // Vérifier si le highlight existe
    const existingHighlight = await prisma.hotelHighlight.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCardToHotelHighlight: true,
          },
        },
      },
    });

    if (!existingHighlight) {
      return NextResponse.json(
        { error: "Hotel highlight not found" },
        { status: 404 }
      );
    }

    // Vérifier si le highlight est utilisé
    if (existingHighlight._count.HotelCardToHotelHighlight > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel highlight that is being used",
          usageCount: existingHighlight._count.HotelCardToHotelHighlight,
        },
        { status: 409 }
      );
    }

    await prisma.hotelHighlight.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hotel highlight deleted successfully",
      deletedHighlight: {
        id: existingHighlight.id,
        title: existingHighlight.title,
      },
    });
  } catch (error) {
    console.error("Error deleting hotel highlight:", error);
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
            error: `Hotel highlight with this ${
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
            error: "Hotel highlight not found",
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
