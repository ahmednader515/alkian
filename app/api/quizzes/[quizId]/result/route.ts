import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

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

        // Get the most recent quiz result for this user and quiz
        const result = await db.quizResult.findFirst({
            where: {
                studentId: userId,
                quizId: resolvedParams.quizId,
            },
            include: {
                answers: {
                    include: {
                        question: {
                            select: {
                                id: true,
                                text: true,
                                type: true,
                                options: true,
                                points: true,
                                imageUrl: true,
                            }
                        }
                    },
                    orderBy: {
                        question: {
                            position: 'asc'
                        }
                    }
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        maxAttempts: true,
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });

        if (!result) {
            return new NextResponse("Result not found", { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.log("[QUIZ_RESULT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

