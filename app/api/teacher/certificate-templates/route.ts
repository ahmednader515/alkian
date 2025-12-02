import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all certificate templates for the current teacher
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    // All teachers can see all certificate templates regardless of creator
    const templates = await db.certificateTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_TEMPLATES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST create a new certificate template
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const { title, imageUrl, description } = await req.json();

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    const template = await db.certificateTemplate.create({
      data: {
        title: title || null,
        imageUrl,
        description: description || null,
        teacherId: session.user.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      template,
    });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_TEMPLATES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

