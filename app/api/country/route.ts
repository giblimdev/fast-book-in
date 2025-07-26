//@/app/api/country/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/country - Récupérer tous les pays
export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        cities: true, // Inclure les villes si nécessaire
      },
    });

    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

// POST /api/country - Créer un nouveau pays
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, language, currency, order } = body;

    // Validation basique
    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    const country = await prisma.country.create({
      data: {
        name,
        code,
        language,
        currency: currency || "€",
        order: order || 100,
      },
    });

    return NextResponse.json(country, { status: 201 });
  } catch (error) {
    console.error("Error creating country:", error);

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
      { error: "Failed to create country" },
      { status: 500 }
    );
  }
}
