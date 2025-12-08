import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { userId } = await auth();
        const resolvedParams = await params;
        const { answers } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get the quiz with questions (no course requirement)
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
                        imageUrl: true
                    },
                    orderBy: {
                        position: 'asc'
                    }
                }
            }
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", { status: 404 });
        }

        // Check if user has already taken this quiz and if they can take it again
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

        if (existingResults.length >= quiz.maxAttempts) {
            return new NextResponse("Maximum attempts reached for this quiz", { status: 400 });
        }

        // Save answers without grading (no correctAnswer, isCorrect, or pointsEarned)
        const quizAnswers = [];

        for (const question of quiz.questions) {
            const studentAnswer = answers.find((a: any) => a.questionId === question.id)?.answer || "";
            
            quizAnswers.push({
                questionId: question.id,
                studentAnswer,
                correctAnswer: null, // No correct answer stored
                isCorrect: null, // No grading
                pointsEarned: null // No grading
            });
        }

        // Create quiz result without score/percentage (no automatic grading)
        const quizResult = await db.quizResult.create({
            data: {
                studentId: userId,
                quizId: resolvedParams.quizId,
                score: null, // No automatic grading
                totalPoints: null, // No automatic grading
                percentage: null, // No automatic grading
                attemptNumber: currentAttemptNumber,
                answers: {
                    create: quizAnswers
                }
            },
            include: {
                answers: {
                    include: {
                        question: true
                    }
                }
            }
        });

        return NextResponse.json(quizResult);
    } catch (error) {
        console.log("[QUIZ_SUBMIT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

