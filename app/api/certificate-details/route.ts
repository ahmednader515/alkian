import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get all certificate details (public endpoint for students)
export async function GET(req: NextRequest) {
  try {
    const certificateDetails = await db.certificateDetail.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json({ certificateDetails });
  } catch (error) {
    console.error("[CERTIFICATE_DETAILS_PUBLIC_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الشهادات" },
      { status: 500 }
    );
  }
}

