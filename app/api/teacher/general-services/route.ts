import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET - Get all general services for teacher
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const generalServices = await db.generalService.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({ generalServices });
  } catch (error) {
    console.error("[GENERAL_SERVICES_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الخدمات العامة" },
      { status: 500 }
    );
  }
}

// POST - Create a new general service
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    }

    // Get the max position to add at the end
    const maxPosition = await db.generalService.findFirst({
      where: {
        teacherId: userId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const newPosition = maxPosition ? maxPosition.position + 1 : 0;

    const generalService = await db.generalService.create({
      data: {
        title: title.trim(),
        position: newPosition,
        teacherId: userId,
      },
    });

    return NextResponse.json({ 
      success: true,
      generalService,
    });
  } catch (error) {
    console.error("[GENERAL_SERVICES_POST]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة الخدمة العامة" },
      { status: 500 }
    );
  }
}

