// app/api/admin/hotelFaqs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/faqs/[id] - Récupérer une FAQ spécifique (admin)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const faq = await prisma.hotelFAQ.findUnique({
      where: { id },
      include: includeRelations
        ? {
            hotelCard: {
              include: {
                accommodationType: {
                  select: { name: true, category: true },
                },
                destination: {
                  select: { name: true, type: true },
                },
                hotelGroup: {
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

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Statistiques additionnelles pour cette FAQ
    const hotelFaqStats = await prisma.hotelFAQ.aggregate({
      where: { hotelCardId: faq.hotelCardId },
      _count: { id: true },
    });

    const categoryStats = await prisma.hotelFAQ.count({
      where: {
        hotelCardId: faq.hotelCardId,
        category: faq.category,
      },
    });

    return NextResponse.json({
      faq,
      hotelStats: {
        totalFaqs: hotelFaqStats._count.id,
        categoryFaqs: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

// PUT /api/admin/faqs/[id] - Modifier une FAQ (admin)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();

    const { question, answer, category, order, isPopular } = body;

    // Vérifier si la FAQ existe
    const existingFaq = await prisma.hotelFAQ.findUnique({
      where: { id },
      select: { hotelCardId: true, question: true },
    });

    if (!existingFaq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Validation de la longueur si fournie
    if (question && question.length < 5) {
      return NextResponse.json(
        { error: "Question must be at least 5 characters long" },
        { status: 400 }
      );
    }

    if (answer && answer.length < 10) {
      return NextResponse.json(
        { error: "Answer must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Vérifier si une FAQ identique existe déjà (si la question est modifiée)
    if (question && question !== existingFaq.question) {
      const duplicateFaq = await prisma.hotelFAQ.findFirst({
        where: {
          hotelCardId: existingFaq.hotelCardId,
          question: { equals: question, mode: "insensitive" },
          id: { not: id },
        },
      });

      if (duplicateFaq) {
        return NextResponse.json(
          { error: "A FAQ with this question already exists for this hotel" },
          { status: 400 }
        );
      }
    }

    // Validation de l'ordre si fourni
    if (order !== undefined && order < 0) {
      return NextResponse.json(
        { error: "Order must be non-negative" },
        { status: 400 }
      );
    }

    // Mettre à jour la FAQ
    const updatedFaq = await prisma.hotelFAQ.update({
      where: { id },
      data: {
        ...(question && { question }),
        ...(answer && { answer }),
        ...(category && { category }),
        ...(order !== undefined && { order: Number(order) }),
        ...(isPopular !== undefined && { isPopular: Boolean(isPopular) }),
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

    return NextResponse.json(updatedFaq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference in update" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/faqs/[id] - Supprimer une FAQ (admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si la FAQ existe
    const existingFaq = await prisma.hotelFAQ.findUnique({
      where: { id },
      select: {
        hotelCardId: true,
        question: true,
        category: true,
        hotelCard: {
          select: { name: true },
        },
      },
    });

    if (!existingFaq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Supprimer la FAQ
    await prisma.hotelFAQ.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "FAQ deleted successfully",
        deletedFaq: {
          id,
          question: existingFaq.question,
          category: existingFaq.category,
          hotel: existingFaq.hotelCard.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
