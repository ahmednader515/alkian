import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseQuizOptions } from "@/lib/utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { userId } = await auth();
        const resolvedParams = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get the quiz (no course requirement for standalone quizzes)
        const quiz = await db.quiz.findFirst({
            where: {
                id: resolvedParams.quizId,
                isPublished: true
            },
            include: {
                questions: {
                    select: {
                        id: true,
                        text: true,
                        type: true,
                        options: true,
                        points: true,
                        imageUrl: true,
                        position: true
                    },
                    orderBy: {
                        position: 'asc'
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", { status: 404 });
        }

        // Check attempt limits
        const existingResults = await db.quizResult.findMany({
            where: {
                studentId: userId,
                quizId: resolvedParams.quizId
            },
            orderBy: {
                attemptNumber: 'desc'
            }
        });

        const currentAttemptNumber = existingResults.length + 1;
        const canTakeQuiz = existingResults.length < quiz.maxAttempts;

        // Parse options for multiple choice questions
        const quizWithParsedOptions = {
            ...quiz,
            questions: quiz.questions.map(question => ({
                ...question,
                options: question.options ? parseQuizOptions(question.options) : null
            })),
            currentAttempt: currentAttemptNumber,
            previousAttempts: existingResults.length,
            canTakeQuiz
        };

        return NextResponse.json(quizWithParsedOptions);
    } catch (error) {
        console.log("[QUIZ_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

