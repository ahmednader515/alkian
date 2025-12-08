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

    // Get all published quizzes - both standalone and from published courses
    const quizzes = await db.quiz.findMany({
      where: {
        isPublished: true,
        OR: [
          { courseId: null }, // Standalone quizzes (always free)
          {
            course: {
              isPublished: true, // Quizzes from published courses
            },
          },
        ],
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

    // Check purchase status and submission status for each quiz
    const quizzesWithPurchaseStatus = await Promise.all(
      quizzes.map(async (quiz) => {
        // Check if user has submitted this quiz
        const hasSubmitted = await db.quizResult.findFirst({
          where: {
            studentId: userId,
            quizId: quiz.id,
          },
        }).then(result => !!result);

        // Standalone quizzes are always free and accessible
        if (!quiz.courseId || !quiz.course) {
          return {
            ...quiz,
            hasPurchased: true, // Always accessible
            isStandalone: true,
            hasSubmitted,
          };
        }

        // For course quizzes, check if course is free or if user has purchased
        const isFree = !quiz.course.price || quiz.course.price === 0;
        
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
          isStandalone: false,
          hasSubmitted,
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

