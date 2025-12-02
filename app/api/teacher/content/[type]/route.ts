import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const contentTypeMap: Record<string, string> = {
  "certificate-templates": "CERTIFICATE_TEMPLATES",
  "about-us": "ABOUT_US",
  "general-news": "GENERAL_NEWS",
  "about-lecturers": "ABOUT_LECTURERS",
  "goals-achievements": "GOALS_ACHIEVEMENTS",
  "our-branches": "OUR_BRANCHES",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const resolvedParams = await params;
    const type = resolvedParams.type;
    const contentType = contentTypeMap[type];

    if (!contentType) {
      return NextResponse.json({ error: "نوع المحتوى غير صحيح" }, { status: 400 });
    }

    // Get the first available content of this type (all teachers can see all content)
    const content = await db.content.findFirst({
      where: {
        type: contentType,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ content });

  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المحتوى" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const resolvedParams = await params;
    const type = resolvedParams.type;
    const contentType = contentTypeMap[type];

    if (!contentType) {
      return NextResponse.json({ error: "نوع المحتوى غير صحيح" }, { status: 400 });
    }

    const body = await req.json();
    const { title, content, imageUrl } = body;

    if (!content) {
      return NextResponse.json({ error: "المحتوى مطلوب" }, { status: 400 });
    }

    const savedContent = await db.content.upsert({
      where: {
        teacherId_type: {
          teacherId: userId,
          type: contentType,
        },
      },
      update: {
        title: title || null,
        content,
        imageUrl: imageUrl || null,
      },
      create: {
        type: contentType,
        title: title || null,
        content,
        imageUrl: imageUrl || null,
        teacherId: userId,
      },
    });

    return NextResponse.json({ 
      success: true,
      content: savedContent 
    });

  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ المحتوى" },
      { status: 500 }
    );
  }
}

