import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        courses: [],
        quizzes: [],
        contentItems: [],
        certificateTemplates: [],
      });
    }

    const searchTerm = query.trim();

    // Search courses (only published)
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            description: {
              contains: searchTerm,
            },
          },
        ],
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Search quizzes (from published courses)
    const quizzes = await db.quiz.findMany({
      where: {
        course: {
          isPublished: true,
        },
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            description: {
              contains: searchTerm,
            },
          },
        ],
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          select: {
            id: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Search content items
    const contentItems = await db.contentItem.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            content: {
              contains: searchTerm,
            },
          },
        ],
      },
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Search certificate templates
    const certificateTemplates = await db.certificateTemplate.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            description: {
              contains: searchTerm,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        type: "course",
        href: course.chapters.length > 0 
          ? `/courses/${course.id}/chapters/${course.chapters[0].id}` 
          : `/courses/${course.id}`,
      })),
      quizzes: quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.courseId,
        courseTitle: quiz.course.title,
        questionCount: quiz.questions.length,
        type: "quiz",
        href: `/courses/${quiz.courseId}/quizzes/${quiz.id}`,
      })),
      contentItems: contentItems.map((item) => {
        // Map content type to route
        const typeMap: Record<string, string> = {
          ABOUT_US: "/dashboard/content/about-us",
          GENERAL_NEWS: "/dashboard/content/general-news",
          ABOUT_LECTURERS: "/dashboard/content/about-lecturers",
          GOALS_ACHIEVEMENTS: "/dashboard/content/goals-achievements",
        };
        
        return {
          id: item.id,
          title: item.title || "محتوى",
          content: item.content.substring(0, 150) + (item.content.length > 150 ? "..." : ""),
          imageUrl: item.imageUrl,
          type: "content",
          contentType: item.type,
          href: typeMap[item.type] || "/dashboard",
        };
      }),
      certificateTemplates: certificateTemplates.map((template) => ({
        id: template.id,
        title: template.title || "نموذج شهادة",
        description: template.description,
        imageUrl: template.imageUrl,
        type: "certificate",
        href: "/dashboard/content/certificate-templates",
      })),
    });
  } catch (error) {
    console.error("[SEARCH_API]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث" },
      { status: 500 }
    );
  }
}
