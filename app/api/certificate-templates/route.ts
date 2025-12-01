import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET all certificate templates (public endpoint for students)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const templates = await db.certificateTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[CERTIFICATE_TEMPLATES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

