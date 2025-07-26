// app/api/admin/hotelRooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/rooms - Récupérer toutes les chambres (vue admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const hotelCardId = searchParams.get("hotelCardId");
    const isAvailable = searchParams.get("available");
    const maxGuests = searchParams.get("maxGuests");
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");
    const bedType = searchParams.get("bedType");
    const search = searchParams.get("search");
    const includeRelations = searchParams.get("include") === "true";

    const skip = (page - 1) * limit;

    // Construction de la clause WHERE
    const whereClause: any = {};
    if (hotelCardId) whereClause.hotelCardId = hotelCardId;
    if (isAvailable === "true") whereClause.isAvailable = true;
    if (isAvailable === "false") whereClause.isAvailable = false;
    if (maxGuests) whereClause.maxGuests = { gte: Number(maxGuests) };
    if (maxPrice)
      whereClause.pricePerNight = {
        ...whereClause.pricePerNight,
        lte: Number(maxPrice),
      };
    if (minPrice)
      whereClause.pricePerNight = {
        ...whereClause.pricePerNight,
        gte: Number(minPrice),
      };
    if (bedType)
      whereClause.bedType = { contains: bedType, mode: "insensitive" };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { bedType: { contains: search, mode: "insensitive" } },
      ];
    }

    const rooms = await prisma.hotelRoom.findMany({
      where: whereClause,
      orderBy: { [sortBy]: order as "asc" | "desc" },
      skip,
      take: limit,
      include: includeRelations
        ? {
            hotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                accommodationType: {
                  select: { name: true },
                },
                destination: {
                  select: { name: true },
                },
              },
            },
          }
        : {
            hotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
              },
            },
          },
    });

    // Comptage total
    const total = await prisma.hotelRoom.count({ where: whereClause });

    // Statistiques
    const stats = await prisma.hotelRoom.aggregate({
      _avg: { pricePerNight: true, maxGuests: true, roomSize: true },
      _count: { id: true },
      _min: { pricePerNight: true },
      _max: { pricePerNight: true },
    });

    // Statistiques de disponibilité
    const availabilityStats = await prisma.hotelRoom.groupBy({
      by: ["isAvailable"],
      _count: { isAvailable: true },
    });

    return NextResponse.json({
      rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      statistics: {
        total: stats._count.id,
        averagePrice: stats._avg.pricePerNight || 0,
        averageGuests: stats._avg.maxGuests || 0,
        averageSize: stats._avg.roomSize || 0,
        minPrice: stats._min.pricePerNight || 0,
        maxPrice: stats._max.pricePerNight || 0,
        availability: {
          available:
            availabilityStats.find((s) => s.isAvailable)?._count.isAvailable ||
            0,
          unavailable:
            availabilityStats.find((s) => !s.isAvailable)?._count.isAvailable ||
            0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// POST /api/admin/rooms - Créer une nouvelle chambre (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelCardId,
      name,
      description,
      maxGuests,
      bedCount,
      bedType,
      roomSize,
      pricePerNight,
      currency,
      isAvailable,
      images,
    } = body;

    // Validation basique
    if (
      !hotelCardId ||
      !name ||
      !maxGuests ||
      !bedCount ||
      !bedType ||
      !pricePerNight
    ) {
      return NextResponse.json(
        {
          error:
            "Hotel ID, name, maxGuests, bedCount, bedType and pricePerNight are required",
        },
        { status: 400 }
      );
    }

    // Validation des nombres
    if (maxGuests < 1 || bedCount < 1 || pricePerNight < 0) {
      return NextResponse.json(
        {
          error:
            "Invalid numeric values: maxGuests and bedCount must be >= 1, pricePerNight must be >= 0",
        },
        { status: 400 }
      );
    }

    // Validation de la taille si fournie
    if (roomSize && roomSize <= 0) {
      return NextResponse.json(
        { error: "Room size must be greater than 0" },
        { status: 400 }
      );
    }

    // Vérifier si l'hôtel existe
    const hotelExists = await prisma.hotelCard.findUnique({
      where: { id: hotelCardId },
      select: { id: true, name: true },
    });

    if (!hotelExists) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Créer la chambre
    const room = await prisma.hotelRoom.create({
      data: {
        hotelCardId,
        name,
        description,
        maxGuests: Number(maxGuests),
        bedCount: Number(bedCount),
        bedType,
        roomSize: roomSize ? Number(roomSize) : null,
        pricePerNight: Number(pricePerNight),
        currency: currency || "EUR",
        isAvailable: Boolean(isAvailable !== false), // Default true
        images: images || [],
      },
      include: {
        hotelCard: {
          select: {
            id: true,
            name: true,
            starRating: true,
          },
        },
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
