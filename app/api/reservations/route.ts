import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, studentPhone, studentEmail, preferredDate, preferredTime, message } = body;

    // Validate required fields
    if (!studentName || !studentPhone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "الاسم ورقم الهاتف والتاريخ والوقت مطلوبة" },
        { status: 400 }
      );
    }

    // Get the first teacher (assuming there's at least one teacher in the system)
    const teacher = await db.user.findFirst({
      where: { role: "TEACHER" }
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "لا يوجد مدرس متاح حالياً" },
        { status: 404 }
      );
    }

    // Create the reservation
    const reservation = await db.reservation.create({
      data: {
        studentName,
        studentPhone,
        studentEmail: studentEmail || null,
        preferredDate: new Date(preferredDate),
        preferredTime,
        message: message || null,
        teacherId: teacher.id,
      },
    });

    return NextResponse.json({
      success: true,
      reservation,
      message: "تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً."
    });

  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال طلب الحجز" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Only teachers can view reservations
    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const reservations = await db.reservation.findMany({
      where: { teacherId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reservations });

  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب طلبات الحجز" },
      { status: 500 }
    );
  }
}
