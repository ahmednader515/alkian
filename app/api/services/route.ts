import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Get all services for students (including published courses)
export async function GET(req: NextRequest) {
  try {
    const services = await db.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Fetch published courses
    const publishedCourses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Combine services and courses
    const allServices = [
      ...services,
      ...publishedCourses.map(course => ({
        id: course.id,
        title: course.title,
        type: "course" as const,
      })),
    ];

    return NextResponse.json({ services: allServices });
  } catch (error) {
    console.error("[SERVICES_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الخدمات" },
      { status: 500 }
    );
  }
}
