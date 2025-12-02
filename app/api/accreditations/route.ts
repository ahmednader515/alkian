import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get all accreditations (public endpoint for students)
export async function GET(req: NextRequest) {
  try {
    const accreditations = await db.accreditation.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });

    return NextResponse.json({ accreditations });
  } catch (error) {
    console.error("[ACCREDITATIONS_PUBLIC_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الاعتمادات" },
      { status: 500 }
    );
  }
}

