import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-parking - Récupérer toutes les options de parking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAvailable = searchParams.get("isAvailable");
    const minSpaces = searchParams.get("minSpaces");
    const maxSpaces = searchParams.get("maxSpaces");
    const search = searchParams.get("search");
    const includeRelations = searchParams.get("include") === "true";

    const whereClause: any = {};

    if (isAvailable !== null && isAvailable !== undefined) {
      whereClause.isAvailable = isAvailable === "true";
    }

    if (minSpaces) {
      whereClause.spaces = {
        ...whereClause.spaces,
        gte: parseInt(minSpaces),
      };
    }

    if (maxSpaces) {
      whereClause.spaces = {
        ...whereClause.spaces,
        lte: parseInt(maxSpaces),
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    const hotelParkings = await prisma.hotelParking.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { name: "asc" }, { spaces: "desc" }],
      include: includeRelations
        ? {
            HotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
              },
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

    return NextResponse.json(hotelParkings);
  } catch (error) {
    console.error("Error fetching hotel parkings:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel parkings" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-parking - Créer une nouvelle option de parking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔍 Received data:", body);

    // Vérifier si c'est un ajout multiple
    if (body.parkings && Array.isArray(body.parkings)) {
      return await handleBulkCreate(body.parkings);
    } else {
      return await handleSingleCreate(body);
    }
  } catch (error) {
    console.error("❌ Error in POST /api/hotel-parking:", error);

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

// Fonction pour créer une seule option de parking
async function handleSingleCreate(data: any) {
  const validation = validateHotelParkingData(data);
  if (!validation.isValid) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const { name, isAvailable, spaces, notes, order } = data;

  try {
    const hotelParking = await prisma.hotelParking.create({
      data: {
        name: name?.trim() || null,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        spaces: spaces || null,
        notes: notes?.trim() || null,
        order: order || 100,
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    console.log("✅ Hotel parking created successfully:", hotelParking);
    return NextResponse.json(hotelParking, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

// Fonction pour créer plusieurs options de parking
async function handleBulkCreate(parkings: any[]) {
  const results = {
    success: [] as any[],
    errors: [] as any[],
  };

  for (let i = 0; i < parkings.length; i++) {
    const parkingData = parkings[i];
    const validation = validateHotelParkingData(parkingData, i);

    if (!validation.isValid) {
      results.errors.push({
        index: i,
        data: parkingData,
        ...validation.error,
      });
      continue;
    }

    try {
      // Créer l'option de parking
      const hotelParking = await prisma.hotelParking.create({
        data: {
          name: parkingData.name?.trim() || null,
          isAvailable:
            parkingData.isAvailable !== undefined
              ? parkingData.isAvailable
              : true,
          spaces: parkingData.spaces || null,
          notes: parkingData.notes?.trim() || null,
          order: parkingData.order || 100,
        },
        include: {
          _count: {
            select: {
              HotelCard: true,
            },
          },
        },
      });

      results.success.push({
        index: i,
        parking: hotelParking,
      });
    } catch (error) {
      results.errors.push({
        index: i,
        data: parkingData,
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
        total: parkings.length,
        success: results.success.length,
        errors: results.errors.length,
      },
      results,
    },
    { status }
  );
}

// Fonction de validation
function validateHotelParkingData(data: any, index?: number) {
  const prefix = index !== undefined ? `Parking #${index + 1}: ` : "";

  // Validation du champ name (obligatoire selon le schéma)
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
      error: {
        error: `${prefix}Name must be less than 255 characters`,
        received: data.name?.length,
        field: "name",
      },
    };
  }

  if (data.isAvailable !== undefined && typeof data.isAvailable !== "boolean") {
    return {
      isValid: false,
      error: { error: `${prefix}isAvailable must be a boolean` },
    };
  }

  if (data.spaces !== undefined && data.spaces !== null) {
    const spacesNum = parseInt(data.spaces);
    if (isNaN(spacesNum) || spacesNum < 0 || spacesNum > 10000) {
      return {
        isValid: false,
        error: {
          error: `${prefix}Spaces must be a number between 0 and 10000`,
          received: data.spaces,
          field: "spaces",
        },
      };
    }
  }

  if (data.notes && typeof data.notes !== "string") {
    return {
      isValid: false,
      error: { error: `${prefix}Notes must be a string` },
    };
  }

  if (data.notes && data.notes.length > 1000) {
    return {
      isValid: false,
      error: {
        error: `${prefix}Notes must be less than 1000 characters`,
        received: data.notes?.length,
        field: "notes",
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

// PUT /api/hotel-parking - Mettre à jour une option
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Hotel parking ID is required" },
        { status: 400 }
      );
    }

    const validation = validateHotelParkingData(updateData);
    if (!validation.isValid) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const updatedParking = await prisma.hotelParking.update({
      where: { id },
      data: {
        name: updateData.name?.trim(),
        isAvailable:
          updateData.isAvailable !== undefined ? updateData.isAvailable : true,
        spaces: updateData.spaces || null,
        notes: updateData.notes?.trim() || null,
        order: updateData.order || 100,
      },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    return NextResponse.json(updatedParking);
  } catch (error) {
    console.error("Error updating hotel parking:", error);
    return handlePrismaError(error);
  }
}

// DELETE /api/hotel-parking - Supprimer une option
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Hotel parking ID is required" },
        { status: 400 }
      );
    }

    // Vérifier si l'option existe
    const existingParking = await prisma.hotelParking.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCard: true,
          },
        },
      },
    });

    if (!existingParking) {
      return NextResponse.json(
        { error: "Hotel parking not found" },
        { status: 404 }
      );
    }

    // Vérifier si l'option est utilisée
    if (existingParking._count.HotelCard > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete hotel parking that is being used",
          usageCount: existingParking._count.HotelCard,
        },
        { status: 409 }
      );
    }

    await prisma.hotelParking.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hotel parking deleted successfully",
      deletedParking: {
        id: existingParking.id,
        name: existingParking.name,
        spaces: existingParking.spaces,
      },
    });
  } catch (error) {
    console.error("Error deleting hotel parking:", error);
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
            error: `Hotel parking with this ${
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
            error: "Hotel parking not found",
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
