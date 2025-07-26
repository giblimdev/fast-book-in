// app/api/admin/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/admin/reviews/[id] - Récupérer un avis spécifique (admin)
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    // Paramètres de query optionnels
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get("include") === "true";

    const review = await prisma.hotelReview.findUnique({
      where: { id },
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
                createdAt: true,
              },
            },
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
                images: {
                  take: 3,
                  select: { imageUrl: true, alt: true },
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

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/reviews/[id] - Modifier un avis (admin)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();

    const {
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

    // Vérifier si l'avis existe
    const existingReview = await prisma.hotelReview.findUnique({
      where: { id },
      select: { hotelCardId: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Validation du rating si fourni
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validation du commentaire si fourni
    if (comment && comment.length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters long" },
        { status: 400 }
      );
    }

    // Mettre à jour l'avis
    const updatedReview = await prisma.hotelReview.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(title !== undefined && { title }),
        ...(comment && { comment }),
        ...(pros !== undefined && { pros }),
        ...(cons !== undefined && { cons }),
        ...(roomType !== undefined && { roomType }),
        ...(stayDate && { stayDate: new Date(stayDate) }),
        ...(isVerified !== undefined && { isVerified: Boolean(isVerified) }),
        ...(helpfulCount !== undefined && {
          helpfulCount: Number(helpfulCount),
        }),
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

    // Recalculer les statistiques si la note a changé
    if (rating !== undefined) {
      const hotelStats = await prisma.hotelReview.aggregate({
        where: { hotelCardId: existingReview.hotelCardId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.hotelCard.update({
        where: { id: existingReview.hotelCardId },
        data: {
          overallRating: hotelStats._avg.rating,
          reviewCount: hotelStats._count.rating,
        },
      });
    }

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference in update" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews/[id] - Supprimer un avis (admin)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si l'avis existe et récupérer les informations nécessaires
    const existingReview = await prisma.hotelReview.findUnique({
      where: { id },
      select: { hotelCardId: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Supprimer l'avis
    await prisma.hotelReview.delete({
      where: { id },
    });

    // Recalculer les statistiques de l'hôtel
    const hotelStats = await prisma.hotelReview.aggregate({
      where: { hotelCardId: existingReview.hotelCardId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.hotelCard.update({
      where: { id: existingReview.hotelCardId },
      data: {
        overallRating: hotelStats._avg.rating || null,
        reviewCount: hotelStats._count.rating,
      },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
