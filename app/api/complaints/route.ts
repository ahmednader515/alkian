import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST - Student submits a complaint
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { studentName, studentPhone, studentEmail, message } = body;

    // Validate required fields
    if (!studentName || !studentPhone || !message) {
      return NextResponse.json(
        { error: "الاسم ورقم الهاتف والرسالة مطلوبة" },
        { status: 400 }
      );
    }

    // Get the first teacher (assuming there's at least one teacher in the system)
    const teacher = await db.user.findFirst({
      where: { role: "TEACHER" }
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "لا يوجد مدرس في النظام" },
        { status: 500 }
      );
    }

    // Create complaint
    const complaint = await db.complaint.create({
      data: {
        studentName,
        studentPhone,
        studentEmail: studentEmail || null,
        message,
        teacherId: teacher.id,
      },
    });

    return NextResponse.json({
      success: true,
      complaint: {
        id: complaint.id,
        studentName: complaint.studentName,
        studentPhone: complaint.studentPhone,
        message: complaint.message,
        status: complaint.status,
        createdAt: complaint.createdAt,
      }
    });

  } catch (error) {
    console.error("[COMPLAINT_CREATE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال الشكوى" },
      { status: 500 }
    );
  }
}

// GET - Teacher views complaints
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Only teachers can view complaints
    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Build where clause
    let whereClause: any = {};
    
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const complaints = await db.complaint.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ complaints });

  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الشكاوى" },
      { status: 500 }
    );
  }
}
