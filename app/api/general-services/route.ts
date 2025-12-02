import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get all general services (public endpoint for students)
export async function GET(req: NextRequest) {
  try {
    const generalServices = await db.generalService.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json({ generalServices });
  } catch (error) {
    console.error("[GENERAL_SERVICES_PUBLIC_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الخدمات العامة" },
      { status: 500 }
    );
  }
}

