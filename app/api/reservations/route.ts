import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      studentName, 
      studentPhone, 
      studentEmail, 
      governorate,
      preferredDate, 
      preferredTime, 
      message,
      reservationType,
      courseId,
      serialNumber,
      previousExperience
    } = body;

    // Validate required fields
    if (!studentName || !studentPhone || !governorate) {
      return NextResponse.json(
        { error: "الاسم ورقم الهاتف والمحافظة مطلوبة" },
        { status: 400 }
      );
    }

    // Validate date/time for session types
    const sessionTypes = ["REHABILITATION", "CUPPING", "MASSAGE", "SPIRITUAL", "CONSULTATION", "PERSONAL"];
    if (sessionTypes.includes(reservationType) && (!preferredDate || !preferredTime)) {
      return NextResponse.json(
        { error: "التاريخ والوقت مطلوبة لهذا النوع من الحجوزات" },
        { status: 400 }
      );
    }

    // Validate course for online course registration
    if (reservationType === "ONLINE_COURSE" && !courseId) {
      return NextResponse.json(
        { error: "يجب اختيار الكورس" },
        { status: 400 }
      );
    }

    // Validate serial number for renewal
    if (reservationType === "RENEWAL" && !serialNumber) {
      return NextResponse.json(
        { error: "سريل نمبر الكارنيه أو الشهادة مطلوب" },
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

    // Prepare reservation data
    const reservationData: any = {
      studentName,
      studentPhone,
      studentEmail: studentEmail || null,
      governorate,
      reservationType: reservationType || "GENERAL",
      message: message || null,
      teacherId: teacher.id,
    };

    // Add date/time - required field, so always set it
    if (preferredDate && preferredTime) {
      reservationData.preferredDate = new Date(preferredDate);
      reservationData.preferredTime = preferredTime;
    } else {
      // Set default date/time if not provided (for non-session types or missing input)
      reservationData.preferredDate = new Date();
      reservationData.preferredTime = preferredTime || "09:00";
    }

    // Add course ID for online course registration
    if (courseId) {
      reservationData.courseId = courseId;
    }

    // Add additional message for renewal and membership
    if (reservationType === "RENEWAL" && message) {
      reservationData.message = `طلب تجديد - السريل نمبر: ${serialNumber}\n${message}`;
    } else if (reservationType === "MEMBERSHIP" && previousExperience) {
      reservationData.message = `طلب عضوية/وظيفة\nالخبرات السابقة: ${previousExperience}${message ? `\n${message}` : ''}`;
    }

    // Create the reservation
    const reservation = await db.reservation.create({
      data: reservationData,
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

    const { searchParams } = new URL(req.url);
    const reservationType = searchParams.get("type");

    // Build where clause - show all reservations to all teachers
    // (since reservations are general requests, all teachers should see them)
    let whereClause: any = {};
    
    if (reservationType) {
      if (reservationType === "RENEWAL") {
        // Renewal requests use GENERAL type with "طلب تجديد" in message
        whereClause = {
          reservationType: "GENERAL",
          message: {
            not: null,
            contains: "طلب تجديد",
          },
        };
      } else {
        whereClause.reservationType = reservationType;
      }
    }
    
    console.log("Fetching reservations with where clause:", JSON.stringify(whereClause, null, 2));

    const reservations = await db.reservation.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${reservations.length} reservations`);
    return NextResponse.json({ reservations: reservations || [] });

  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب طلبات الحجز" },
      { status: 500 }
    );
  }
}
