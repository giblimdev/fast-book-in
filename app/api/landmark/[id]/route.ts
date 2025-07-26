import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Type corrigé pour Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/landmark/[id] - Récupérer un landmark par ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres (obligatoire en Next.js 15)
    const { id } = await context.params;

    const landmark = await prisma.landmark.findUnique({
      where: { id },
      include: {
        city: {
          include: {
            country: true,
            neighborhoods: true,
          },
        },
      },
    });

    if (!landmark) {
      return NextResponse.json(
        { error: "Landmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(landmark);
  } catch (error) {
    console.error("Error fetching landmark:", error);
    return NextResponse.json(
      { error: "Failed to fetch landmark" },
      { status: 500 }
    );
  }
}

// PUT /api/landmark/[id] - Mettre à jour un landmark
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;
    const body = await request.json();
    const { name, type, cityId, description, order, latitude, longitude } =
      body;

    // Vérifier si le landmark existe
    const existingLandmark = await prisma.landmark.findUnique({
      where: { id },
    });

    if (!existingLandmark) {
      return NextResponse.json(
        { error: "Landmark not found" },
        { status: 404 }
      );
    }

    // Validation des coordonnées GPS si fournies
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      return NextResponse.json(
        { error: "Latitude must be between -90 and 90" },
        { status: 400 }
      );
    }

    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      return NextResponse.json(
        { error: "Longitude must be between -180 and 180" },
        { status: 400 }
      );
    }

    // Si cityId est fourni, vérifier que la ville existe
    if (cityId && cityId !== existingLandmark.cityId) {
      const city = await prisma.city.findUnique({
        where: { id: cityId },
      });

      if (!city) {
        return NextResponse.json({ error: "City not found" }, { status: 404 });
      }
    }

    const updatedLandmark = await prisma.landmark.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(cityId && { cityId }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return NextResponse.json(updatedLandmark);
  } catch (error) {
    console.error("Error updating landmark:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Landmark with this name already exists in this city" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid city reference" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update landmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/landmark/[id] - Supprimer un landmark
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // ✅ Await des paramètres
    const { id } = await context.params;

    // Vérifier si le landmark existe
    const existingLandmark = await prisma.landmark.findUnique({
      where: { id },
    });

    if (!existingLandmark) {
      return NextResponse.json(
        { error: "Landmark not found" },
        { status: 404 }
      );
    }

    await prisma.landmark.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Landmark deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting landmark:", error);
    return NextResponse.json(
      { error: "Failed to delete landmark" },
      { status: 500 }
    );
  }
}
