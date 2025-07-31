// File: /app/api/hotel-group/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/hotel-group - Récupérer les groupes d'hôteliers
export async function GET(request: Request) {
  try {
    const hotelGroups = await prisma.hotelGroup.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    console.log(`[API hotel-group] Retrieved ${hotelGroups.length} groups`);
    return NextResponse.json(hotelGroups);
  } catch (error) {
    console.error("[API hotel-group] Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel groups" },
      { status: 500 }
    );
  }
}

// POST /api/hotel-group - Créer un nouveau groupe hôtelier
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, website, logoUrl, order } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Vérifier unicité du nom (insensible à la casse)
    const existing = await prisma.hotelGroup.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Hotel group with this name already exists" },
        { status: 409 }
      );
    }

    // Optionnel : valider URL (tu peux réutiliser une fonction externe si tu souhaites)

    const newGroup = await prisma.hotelGroup.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        website: website?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        order: typeof order === "number" ? order : 100,
      },
      include: {
        _count: {
          select: { HotelCard: true },
        },
      },
    });

    console.log("[API hotel-group] Created new group:", newGroup.name);
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("[API hotel-group] Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create hotel group" },
      { status: 500 }
    );
  }
}
