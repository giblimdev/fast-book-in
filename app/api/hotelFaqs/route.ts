// app/api/admin/hotelFaqs/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/faqs - Récupérer toutes les FAQ (vue admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const hotelCardId = searchParams.get("hotelCardId");
    const category = searchParams.get("category");
    const isPopular = searchParams.get("popular");
    const search = searchParams.get("search");
    const includeRelations = searchParams.get("include") === "true";

    const skip = (page - 1) * limit;

    // Construction de la clause WHERE
    const whereClause: any = {};
    if (hotelCardId) whereClause.hotelCardId = hotelCardId;
    if (category) whereClause.category = category;
    if (isPopular === "true") whereClause.isPopular = true;
    if (isPopular === "false") whereClause.isPopular = false;

    if (search) {
      whereClause.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { answer: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const faqs = await prisma.hotelFAQ.findMany({
      where: whereClause,
      orderBy: [
        { isPopular: "desc" },
        { order: "asc" },
        { [sortBy]: order as "asc" | "desc" },
      ],
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
    const total = await prisma.hotelFAQ.count({ where: whereClause });

    // Statistiques par catégorie
    const categoryStats = await prisma.hotelFAQ.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    // Statistiques de popularité
    const popularStats = await Promise.all([
      prisma.hotelFAQ.count({ where: { isPopular: true } }),
      prisma.hotelFAQ.count({ where: { isPopular: false } }),
    ]);

    return NextResponse.json({
      faqs,
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
        popular: popularStats[0],
        regular: popularStats[1],
        byCategory: categoryStats.map((stat) => ({
          category: stat.category,
          count: stat._count.category,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching admin FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST /api/admin/faqs - Créer une nouvelle FAQ (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelCardId, question, answer, category, order, isPopular } = body;

    // Validation basique
    if (!hotelCardId || !question || !answer) {
      return NextResponse.json(
        { error: "Hotel ID, question and answer are required" },
        { status: 400 }
      );
    }

    // Validation de la longueur
    if (question.length < 5) {
      return NextResponse.json(
        { error: "Question must be at least 5 characters long" },
        { status: 400 }
      );
    }

    if (answer.length < 10) {
      return NextResponse.json(
        { error: "Answer must be at least 10 characters long" },
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

    // Vérifier si une FAQ identique existe déjà
    const existingFaq = await prisma.hotelFAQ.findFirst({
      where: {
        hotelCardId,
        question: { equals: question, mode: "insensitive" },
      },
    });

    if (existingFaq) {
      return NextResponse.json(
        { error: "A FAQ with this question already exists for this hotel" },
        { status: 400 }
      );
    }

    // Créer la FAQ
    const faq = await prisma.hotelFAQ.create({
      data: {
        hotelCardId,
        question,
        answer,
        category: category || "Général",
        order: Number(order) || 100,
        isPopular: Boolean(isPopular),
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

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
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
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
