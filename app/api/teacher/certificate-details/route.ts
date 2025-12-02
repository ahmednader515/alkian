import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET - Get all certificate details for teacher
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const certificateDetails = await db.certificateDetail.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({ certificateDetails });
  } catch (error) {
    console.error("[CERTIFICATE_DETAILS_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الشهادات" },
      { status: 500 }
    );
  }
}

// POST - Create a new certificate detail
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
    const maxPosition = await db.certificateDetail.findFirst({
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

    const certificateDetail = await db.certificateDetail.create({
      data: {
        title: title.trim(),
        position: newPosition,
        teacherId: userId,
      },
    });

    return NextResponse.json({ 
      success: true,
      certificateDetail,
    });
  } catch (error) {
    console.error("[CERTIFICATE_DETAILS_POST]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة بيانات الشهادة" },
      { status: 500 }
    );
  }
}

