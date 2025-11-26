import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get all services for teacher
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const services = await db.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("[TEACHER_SERVICES_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الخدمات" },
      { status: 500 }
    );
  }
}

// POST - Create a new service
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "العنوان مطلوب" },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        title: title.trim(),
        teacherId: session.user.id,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error("[TEACHER_SERVICE_CREATE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الخدمة" },
      { status: 500 }
    );
  }
}
