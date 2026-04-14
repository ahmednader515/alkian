import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mergeHomePageContent } from "@/lib/home-page-settings";

export async function GET() {
  try {
    const row = await db.homePageSettings.findUnique({ where: { id: "default" } });
    return NextResponse.json({ data: mergeHomePageContent(row?.data) });
  } catch (e) {
    console.error("[public homepage-settings GET]", e);
    // Safe fallback for public consumers
    return NextResponse.json({ data: mergeHomePageContent(null) });
  }
}

