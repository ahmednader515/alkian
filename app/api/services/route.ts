import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get all services for students
export async function GET(req: NextRequest) {
  try {
    const services = await db.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("[SERVICES_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الخدمات" },
      { status: 500 }
    );
  }
}
