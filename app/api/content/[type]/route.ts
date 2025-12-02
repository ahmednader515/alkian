import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const contentTypeMap: Record<string, string> = {
  "certificate-templates": "CERTIFICATE_TEMPLATES",
  "about-us": "ABOUT_US",
  "general-news": "GENERAL_NEWS",
  "about-lecturers": "ABOUT_LECTURERS",
  "goals-achievements": "GOALS_ACHIEVEMENTS",
  "our-branches": "OUR_BRANCHES",
  "membership-job-request": "MEMBERSHIP_JOB_REQUEST",
  "renewal-request": "RENEWAL_REQUEST",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const resolvedParams = await params;
    const type = resolvedParams.type;
    const contentType = contentTypeMap[type];

    if (!contentType) {
      return NextResponse.json({ error: "نوع المحتوى غير صحيح" }, { status: 400 });
    }

    // Get the first available content of this type (students can view any teacher's content)
    const content = await db.content.findFirst({
      where: {
        type: contentType,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ content });

  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المحتوى" },
      { status: 500 }
    );
  }
}

