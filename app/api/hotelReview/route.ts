// app/api/admin/hotelReviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/reviews - Récupérer toutes les reviews (vue admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const hotelCardId = searchParams.get("hotelCardId");
    const rating = searchParams.get("rating");
    const verified = searchParams.get("verified");
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");
    const includeRelations = searchParams.get("include") === "true";

    const skip = (page - 1) * limit;

    // Construction de la clause WHERE
    const whereClause: any = {};
    if (hotelCardId) whereClause.hotelCardId = hotelCardId;
    if (rating) whereClause.rating = Number(rating);
    if (verified === "true") whereClause.isVerified = true;
    if (verified === "false") whereClause.isVerified = false;
    if (userId) whereClause.userId = userId;

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    const reviews = await prisma.hotelReview.findMany({
      where: whereClause,
      orderBy: { [sortBy]: order as "asc" | "desc" },
      skip,
      take: limit,
      include: includeRelations
        ? {
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                role: true,
              },
            },
            hotelCard: {
              select: {
                id: true,
                name: true,
                starRating: true,
                overallRating: true,
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
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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
    const total = await prisma.hotelReview.count({ where: whereClause });

    // Statistiques
    const stats = await prisma.hotelReview.aggregate({
      _avg: { rating: true, helpfulCount: true },
      _count: { rating: true },
      _sum: { helpfulCount: true },
    });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      statistics: {
        total: stats._count.rating,
        averageRating: stats._avg.rating || 0,
        averageHelpful: stats._avg.helpfulCount || 0,
        totalHelpful: stats._sum.helpfulCount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/admin/reviews - Créer un nouvel avis (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hotelCardId,
      userId,
      rating,
      title,
      comment,
      pros,
      cons,
      roomType,
      stayDate,
      isVerified,
      helpfulCount,
    } = body;

    // Validation basique
    if (!hotelCardId || !userId || !rating || !comment) {
      return NextResponse.json(
        { error: "Hotel ID, user ID, rating and comment are required" },
        { status: 400 }
      );
    }

    // Validation du rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validation du commentaire
    if (comment.length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters long" },
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

    // Vérifier si l'utilisateur existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Vérifier si l'avis existe déjà
    const existingReview = await prisma.hotelReview.findFirst({
      where: {
        hotelCardId,
        userId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "User has already reviewed this hotel" },
        { status: 400 }
      );
    }

    // Créer l'avis
    const review = await prisma.hotelReview.create({
      data: {
        hotelCardId,
        userId,
        rating: Number(rating),
        title,
        comment,
        pros: pros || [],
        cons: cons || [],
        roomType,
        stayDate: stayDate ? new Date(stayDate) : new Date(),
        isVerified: Boolean(isVerified),
        helpfulCount: Number(helpfulCount) || 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        hotelCard: {
          select: {
            id: true,
            name: true,
            starRating: true,
          },
        },
      },
    });

    // Mettre à jour les statistiques de l'hôtel
    const hotelStats = await prisma.hotelReview.aggregate({
      where: { hotelCardId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.hotelCard.update({
      where: { id: hotelCardId },
      data: {
        overallRating: hotelStats._avg.rating,
        reviewCount: hotelStats._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    // Gestion des erreurs Prisma
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid hotel or user reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
