import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all content items for a specific type
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return new NextResponse("Type parameter is required", { status: 400 });
    }

    // Map URL type to database type
    const typeMap: Record<string, string> = {
      "about-us": "ABOUT_US",
      "general-news": "GENERAL_NEWS",
      "about-lecturers": "ABOUT_LECTURERS",
      "goals-achievements": "GOALS_ACHIEVEMENTS",
      "our-branches": "OUR_BRANCHES",
    };

    const dbType = typeMap[type];
    if (!dbType) {
      return new NextResponse("Invalid content type", { status: 400 });
    }

    // All teachers can see all content items regardless of creator
    const items = await db.contentItem.findMany({
      where: {
        type: dbType,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[TEACHER_CONTENT_ITEMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST create a new content item
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const { type, title, content, imageUrl } = await req.json();

    if (!type || !content) {
      return new NextResponse("Type and content are required", { status: 400 });
    }

    // Map URL type to database type
    const typeMap: Record<string, string> = {
      "about-us": "ABOUT_US",
      "general-news": "GENERAL_NEWS",
      "about-lecturers": "ABOUT_LECTURERS",
      "goals-achievements": "GOALS_ACHIEVEMENTS",
      "our-branches": "OUR_BRANCHES",
    };

    const dbType = typeMap[type];
    if (!dbType) {
      return new NextResponse("Invalid content type", { status: 400 });
    }

    const item = await db.contentItem.create({
      data: {
        type: dbType,
        title: title || null,
        content,
        imageUrl: imageUrl || null,
        teacherId: session.user.id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      item,
    });
  } catch (error) {
    console.error("[TEACHER_CONTENT_ITEMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

