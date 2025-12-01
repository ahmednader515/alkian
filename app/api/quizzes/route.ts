import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET all published quizzes for students
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Get all quizzes from all courses (show to everyone regardless of publish status)
    const quizzes = await db.quiz.findMany({
      where: {
        course: {
          isPublished: true, // Only show quizzes from published courses
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        questions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check purchase status for each course
    const quizzesWithPurchaseStatus = await Promise.all(
      quizzes.map(async (quiz) => {
        // Check if course is free (price is 0 or null)
        const isFree = !quiz.course.price || quiz.course.price === 0;
        
        // Check if user has purchased the course
        let hasPurchased = isFree;
        if (!isFree) {
          const purchase = await db.purchase.findUnique({
            where: {
              userId_courseId: {
                userId,
                courseId: quiz.courseId,
              },
            },
          });
          hasPurchased = purchase?.status === "ACTIVE" || false;
        }

        return {
          ...quiz,
          hasPurchased,
        };
      })
    );

    return NextResponse.json({ quizzes: quizzesWithPurchaseStatus });
  } catch (error) {
    console.error("[QUIZZES_GET]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الاختبارات" },
      { status: 500 }
    );
  }
}

