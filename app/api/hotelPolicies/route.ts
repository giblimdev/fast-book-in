// app/api/admin/hotelPolicies/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/policies - Récupérer toutes les politiques (vue admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const hotelCardId = searchParams.get("hotelCardId");
    const pets = searchParams.get("pets");
    const smoking = searchParams.get("smoking");
    const parties = searchParams.get("parties");
    const search = searchParams.get("search");
    const includeRelations = searchParams.get("include") === "true";

    const skip = (page - 1) * limit;

    // Construction de la clause WHERE
    const whereClause: any = {};
    if (hotelCardId) whereClause.hotelCardId = hotelCardId;
    if (pets === "true") whereClause.pets = true;
    if (pets === "false") whereClause.pets = false;
    if (smoking === "true") whereClause.smoking = true;
    if (smoking === "false") whereClause.smoking = false;
    if (parties === "true") whereClause.parties = true;
    if (parties === "false") whereClause.parties = false;

    if (search) {
      whereClause.OR = [
        { cancellation: { contains: search, mode: "insensitive" } },
        { children: { contains: search, mode: "insensitive" } },
        { extraBed: { contains: search, mode: "insensitive" } },
        { breakfast: { contains: search, mode: "insensitive" } },
      ];
    }

    const policies = await prisma.hotelPolicy.findMany({
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
    const total = await prisma.hotelPolicy.count({ where: whereClause });

    // Statistiques sur les politiques
    const stats = await Promise.all([
      prisma.hotelPolicy.count({ where: { pets: true } }),
      prisma.hotelPolicy.count({ where: { smoking: true } }),
      prisma.hotelPolicy.count({ where: { parties: true } }),
    ]);

    return NextResponse.json({
      policies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      statistics: {
        total,
        petsAllowed: stats[0],
        smokingAllowed: stats[1],
        partiesAllowed: stats[2],
        petsNotAllowed: total - stats[0],
        smokingNotAllowed: total - stats[1],
        partiesNotAllowed: total - stats[2],
      },
    });
  } catch (error) {
    console.error("Error fetching admin policies:", error);
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}

// POST /api/admin/policies - Créer une nouvelle politique (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelCardId,
      checkIn,
      checkOut,
      cancellation,
      pets,
      smoking,
      parties,
      children,
      extraBed,
      breakfast,
    } = body;

    // Validation basique
    if (!hotelCardId || !checkIn || !checkOut || !cancellation) {
      return NextResponse.json(
        { error: "Hotel ID, checkIn, checkOut and cancellation are required" },
        { status: 400 }
      );
    }

    // Validation du format des heures (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(checkIn)) {
      return NextResponse.json(
        { error: "CheckIn time must be in HH:MM format" },
        { status: 400 }
      );
    }

    if (!timeRegex.test(checkOut)) {
      return NextResponse.json(
        { error: "CheckOut time must be in HH:MM format" },
        { status: 400 }
      );
    }

    // Validation du texte d'annulation
    if (cancellation.length < 10) {
      return NextResponse.json(
        { error: "Cancellation policy must be at least 10 characters long" },
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

    // Vérifier si une politique existe déjà pour cet hôtel
    const existingPolicy = await prisma.hotelPolicy.findUnique({
      where: { hotelCardId },
    });

    if (existingPolicy) {
      return NextResponse.json(
        {
          error: "Policy already exists for this hotel. Use PUT to update it.",
        },
        { status: 400 }
      );
    }

    // Créer la politique
    const policy = await prisma.hotelPolicy.create({
      data: {
        hotelCardId,
        checkIn,
        checkOut,
        cancellation,
        pets: Boolean(pets),
        smoking: Boolean(smoking),
        parties: Boolean(parties),
        children,
        extraBed,
        breakfast,
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

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error("Error creating policy:", error);
    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel reference" },
          { status: 400 }
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Policy already exists for this hotel" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create policy" },
      { status: 500 }
    );
  }
}
