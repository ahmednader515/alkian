import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Only guests (and optionally students) can list their own reservations by phone
    const role = session.user.role;
    if (role !== "GUEST" && role !== "USER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const phoneNumber = session.user.phoneNumber;
    if (!phoneNumber) {
      return NextResponse.json({ reservations: [] });
    }

    const reservations = await db.reservation.findMany({
      where: { studentPhone: phoneNumber },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("[GUEST_RESERVATIONS_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب طلبات الحجز" },
      { status: 500 }
    );
  }
}

