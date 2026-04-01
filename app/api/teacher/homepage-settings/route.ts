import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { mergeHomePageContent } from "@/lib/home-page-settings";

const SETTINGS_ID = "default";

function canEdit(role: string | undefined) {
  return role === "TEACHER" || role === "ADMIN";
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !canEdit(session.user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const row = await db.homePageSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    return NextResponse.json({
      data: mergeHomePageContent(row?.data),
    });
  } catch (e) {
    console.error("[homepage-settings GET]", e);
    return NextResponse.json({ error: "خطأ في جلب الإعدادات" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !canEdit(session.user.role)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body.data !== "object" || body.data === null) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const current = await db.homePageSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    const prev =
      current?.data && typeof current.data === "object" && !Array.isArray(current.data)
        ? { ...(current.data as Record<string, unknown>) }
        : {};
    const incoming = body.data as Record<string, unknown>;
    const cleaned = mergeHomePageContent({ ...prev, ...incoming } as Prisma.JsonObject);

    await db.homePageSettings.upsert({
      where: { id: SETTINGS_ID },
      create: {
        id: SETTINGS_ID,
        data: cleaned as Prisma.InputJsonValue,
      },
      update: {
        data: cleaned as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ success: true, data: cleaned });
  } catch (e) {
    console.error("[homepage-settings PATCH]", e);
    return NextResponse.json({ error: "خطأ في حفظ الإعدادات" }, { status: 500 });
  }
}
