import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET - Get all accreditations for teacher
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const accreditations = await db.accreditation.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({ accreditations });
  } catch (error) {
    console.error("[ACCREDITATIONS_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الاعتمادات" },
      { status: 500 }
    );
  }
}

// POST - Create a new accreditation
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
    const maxPosition = await db.accreditation.findFirst({
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

    const accreditation = await db.accreditation.create({
      data: {
        title: title.trim(),
        position: newPosition,
        teacherId: userId,
      },
    });

    return NextResponse.json({ 
      success: true,
      accreditation,
    });
  } catch (error) {
    console.error("[ACCREDITATIONS_POST]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة الاعتماد" },
      { status: 500 }
    );
  }
}

