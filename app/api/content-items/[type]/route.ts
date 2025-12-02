import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET all content items for a specific type (public endpoint for students)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const type = resolvedParams.type;

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
    console.error("[CONTENT_ITEMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

