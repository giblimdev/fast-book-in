import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/room-amenity - Récupérer tous les équipements de chambre
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
      ];
    }

    const roomAmenities = await prisma.roomAmenity.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: includeRelations
        ? {
            HotelDetails: {
              select: {
                id: true,
                HotelCard: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            HotelDetailsToRoomAmenity: {
              include: {
                hotelDetails: {
                  include: {
                    HotelCard: {
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
            _count: {
              select: {
                HotelDetails: true,
                HotelDetailsToRoomAmenity: true,
              },
            },
          }
        : {
            _count: {
              select: {
                HotelDetails: true,
                HotelDetailsToRoomAmenity: true,
              },
            },
          },
    });

    return NextResponse.json(roomAmenities);
  } catch (error) {
    console.error("Error fetching room amenities:", error);
    return NextResponse.json(
      { error: "Failed to fetch room amenities" },
      { status: 500 }
    );
  }
}

// POST /api/room-amenity - Créer un nouvel équipement de chambre
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔍 Received data:", body);

    // Vérifier si c'est un ajout multiple
    if (body.amenities && Array.isArray(body.amenities)) {
      return await handleBulkCreate(body.amenities);
    } else {
      return await handleSingleCreate(body);
    }
  } catch (error) {
    console.error("❌ Error in POST /api/room-amenity:", error);

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

// Fonction pour créer un seul équipement
async function handleSingleCreate(data: any) {
  const validation = validateRoomAmenityData(data);
  if (!validation.isValid) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const { name, category, icon, description, order } = data;

  // Vérifier l'unicité du nom
  const existingAmenity = await prisma.roomAmenity.findFirst({
    where: {
      name: {
        equals: name.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existingAmenity) {
    return NextResponse.json(
      {
        error: "Room amenity with this name already exists",
        field: "name",
        existingAmenity: {
          id: existingAmenity.id,
          name: existingAmenity.name,
        },
      },
      { status: 409 }
    );
  }

  try {
    const roomAmenity = await prisma.roomAmenity.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        icon: icon?.trim() || null,
        description: description?.trim() || null,
        order: order || 100,
      },
      include: {
        _count: {
          select: {
            HotelDetails: true,
            HotelDetailsToRoomAmenity: true,
          },
        },
      },
    });

    console.log("✅ Room amenity created successfully:", roomAmenity);
    return NextResponse.json(roomAmenity, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// Fonction pour créer plusieurs équipements
async function handleBulkCreate(amenities: any[]) {
  const results = {
    success: [] as any[],
    errors: [] as any[],
  };

  for (let i = 0; i < amenities.length; i++) {
    const amenityData = amenities[i];
    const validation = validateRoomAmenityData(amenityData, i);

    if (!validation.isValid) {
      results.errors.push({
        index: i,
        data: amenityData,
        ...validation.error,
      });
      continue;
    }

    try {
      // Vérifier l'unicité
      const existingAmenity = await prisma.roomAmenity.findFirst({
        where: {
          name: { equals: amenityData.name.trim(), mode: "insensitive" },
        },
      });

      if (existingAmenity) {
        results.errors.push({
          index: i,
          data: amenityData,
          error: `Room amenity with name "${amenityData.name}" already exists`,
          field: "name",
          existingAmenity: {
            id: existingAmenity.id,
            name: existingAmenity.name,
          },
        });
        continue;
      }

      // Créer l'équipement
      const roomAmenity = await prisma.roomAmenity.create({
        data: {
          name: amenityData.name.trim(),
          category: amenityData.category.trim(),
          icon: amenityData.icon?.trim() || null,
          description: amenityData.description?.trim() || null,
          order: amenityData.order || 100,
        },
        include: {
          _count: {
            select: {
              HotelDetails: true,
              HotelDetailsToRoomAmenity: true,
            },
          },
        },
      });

      results.success.push({
        index: i,
        amenity: roomAmenity,
      });
    } catch (error) {
      results.errors.push({
        index: i,
        data: amenityData,
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
        total: amenities.length,
        success: results.success.length,
        errors: results.errors.length,
      },
      results,
    },
    { status }
  );
}

// Fonction de validation
function validateRoomAmenityData(data: any, index?: number) {
  const prefix = index !== undefined ? `Amenity #${index + 1}: ` : "";

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
    "Comfort",
    "Technology",
    "Entertainment",
    "Bathroom",
    "Kitchen",
    "Bedroom",
    "Safety",
    "Accessibility",
    "Climate",
    "Storage",
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

// PUT /api/room-amenity - Mettre à jour un équipement
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Room amenity ID is required" },
        { status: 400 }
      );
    }

    const validation = validateRoomAmenityData(updateData);
    if (!validation.isValid) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    // Vérifier l'unicité du nom (exclure l'équipement actuel)
    const existingAmenity = await prisma.roomAmenity.findFirst({
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

    if (existingAmenity) {
      return NextResponse.json(
        {
          error: "Room amenity with this name already exists",
          field: "name",
          existingAmenity: {
            id: existingAmenity.id,
            name: existingAmenity.name,
          },
        },
        { status: 409 }
      );
    }

    const updatedAmenity = await prisma.roomAmenity.update({
      where: { id },
      data: {
        name: updateData.name.trim(),
        category: updateData.category.trim(),
        icon: updateData.icon?.trim() || null,
        description: updateData.description?.trim() || null,
        order: updateData.order || 100,
      },
      include: {
        _count: {
          select: {
            HotelDetails: true,
            HotelDetailsToRoomAmenity: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAmenity);
  } catch (error) {
    console.error("Error updating room amenity:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/room-amenity - Supprimer un équipement
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Room amenity ID is required" },
        { status: 400 }
      );
    }

    // Vérifier si l'équipement existe
    const existingAmenity = await prisma.roomAmenity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelDetails: true,
            HotelDetailsToRoomAmenity: true,
          },
        },
      },
    });

    if (!existingAmenity) {
      return NextResponse.json(
        { error: "Room amenity not found" },
        { status: 404 }
      );
    }

    // Vérifier si l'équipement est utilisé
    const totalUsage =
      existingAmenity._count.HotelDetails +
      existingAmenity._count.HotelDetailsToRoomAmenity;
    if (totalUsage > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete room amenity that is being used",
          usageCount: totalUsage,
          details: {
            directRelations: existingAmenity._count.HotelDetails,
            relationshipTable: existingAmenity._count.HotelDetailsToRoomAmenity,
          },
        },
        { status: 409 }
      );
    }

    await prisma.roomAmenity.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Room amenity deleted successfully",
      deletedAmenity: {
        id: existingAmenity.id,
        name: existingAmenity.name,
      },
    });
  } catch (error) {
    console.error("Error deleting room amenity:", error);
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
            error: `Room amenity with this ${
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
            error: "Room amenity not found",
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
