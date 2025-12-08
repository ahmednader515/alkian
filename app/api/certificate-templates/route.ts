import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all certificate templates (public endpoint)
export async function GET(req: NextRequest) {
  try {
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

