// @/app/api/label/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/label/[id]
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeHotels = searchParams.get("includeHotels") === "true";

    const label = await prisma.label.findUnique({
      where: { id },
      include: {
        HotelDetails: {
          include: {
            address: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },
        HotelCardToLabel: includeHotels
          ? {
              include: {
                hotelCard: {
                  select: {
                    id: true,
                    name: true,
                    starRating: true,
                    overallRating: true,
                    basePricePerNight: true,
                    currency: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            }
          : {
              select: {
                hotelCardId: true,
              },
            },
        _count: {
          select: {
            HotelCardToLabel: true,
          },
        },
      },
    });

    if (!label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    return NextResponse.json(label);
  } catch (error) {
    console.error("Error fetching label:", error);
    return NextResponse.json(
      { error: "Failed to fetch label" },
      { status: 500 }
    );
  }
}

// PUT /api/label/[id]
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      name,
      code,
      category,
      description,
      icon,
      color,
      priority,
      order,
      hotelDetailsId,
    } = body;

    const existingLabel = await prisma.label.findUnique({
      where: { id },
    });

    if (!existingLabel) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    // Validations similaires au POST mais optionnelles
    if (name !== undefined) {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }

      const nameExists = await prisma.label.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: "insensitive",
          },
          NOT: { id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "Label with this name already exists" },
          { status: 409 }
        );
      }
    }

    if (code !== undefined) {
      if (!code || typeof code !== "string" || code.trim().length === 0) {
        return NextResponse.json(
          { error: "Code must be a non-empty string" },
          { status: 400 }
        );
      }

      const cleanCode = code.trim().toUpperCase();
      if (!/^[A-Z0-9_]{2,50}$/.test(cleanCode)) {
        return NextResponse.json(
          {
            error:
              "Code must be 2-50 characters (uppercase letters, numbers, underscores only)",
          },
          { status: 400 }
        );
      }

      if (cleanCode !== existingLabel.code) {
        const codeExists = await prisma.label.findFirst({
          where: {
            code: {
              equals: cleanCode,
              mode: "insensitive",
            },
            NOT: { id },
          },
        });

        if (codeExists) {
          return NextResponse.json(
            { error: "Label with this code already exists" },
            { status: 409 }
          );
        }
      }
    }

    if (hotelDetailsId && hotelDetailsId !== existingLabel.hotelDetailsId) {
      const hotelDetails = await prisma.hotelDetails.findUnique({
        where: { id: hotelDetailsId },
      });

      if (!hotelDetails) {
        return NextResponse.json(
          { error: "Hotel details not found" },
          { status: 404 }
        );
      }
    }

    const updatedLabel = await prisma.label.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(code !== undefined && { code: code.trim().toUpperCase() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(icon !== undefined && { icon: icon?.trim() || null }),
        ...(color !== undefined && { color: color?.trim() || null }),
        ...(priority !== undefined && {
          priority: priority ? parseInt(priority) : 0,
        }),
        ...(order !== undefined && { order: order ? parseInt(order) : 100 }),
        ...(hotelDetailsId !== undefined && {
          hotelDetailsId: hotelDetailsId?.trim() || null,
        }),
      },
      include: {
        _count: {
          select: {
            HotelCardToLabel: true,
          },
        },
      },
    });

    return NextResponse.json(updatedLabel);
  } catch (error) {
    console.error("Error updating label:", error);
    return NextResponse.json(
      { error: "Failed to update label" },
      { status: 500 }
    );
  }
}

// DELETE /api/label/[id]
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existingLabel = await prisma.label.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            HotelCardToLabel: true,
          },
        },
      },
    });

    if (!existingLabel) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    if (existingLabel._count.HotelCardToLabel > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete label with associated hotel cards",
          details: {
            hotelCardCount: existingLabel._count.HotelCardToLabel,
          },
        },
        { status: 409 }
      );
    }

    await prisma.label.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Label deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting label:", error);
    return NextResponse.json(
      { error: "Failed to delete label" },
      { status: 500 }
    );
  }
}
