import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/country/[id] - Récupérer un pays par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        cities: true,
      },
    });

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(country);
  } catch (error) {
    console.error("Error fetching country:", error);
    return NextResponse.json(
      { error: "Failed to fetch country" },
      { status: 500 }
    );
  }
}

// PUT /api/country/[id] - Mettre à jour un pays
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, code, language, currency, order } = body;

    const existingCountry = await prisma.country.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const updatedCountry = await prisma.country.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(language !== undefined && { language }),
        ...(currency !== undefined && { currency }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedCountry);
  } catch (error) {
    console.error("Error updating country:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Country code already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update country" },
      { status: 500 }
    );
  }
}

// DELETE /api/country/[id] - Supprimer un pays
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    const existingCountry = await prisma.country.findUnique({
      where: { id },
      include: {
        cities: true,
      },
    });

    if (!existingCountry) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    if (existingCountry.cities.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete country with associated cities" },
        { status: 409 }
      );
    }

    await prisma.country.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Country deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { error: "Failed to delete country" },
      { status: 500 }
    );
  }
}
