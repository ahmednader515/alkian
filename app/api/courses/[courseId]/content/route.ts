import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const resolvedParams = await params;
        
        // Try to get user, but don't require authentication for public access
        let userId = null;
        try {
            const session = await getServerSession(authOptions);
            userId = session?.user?.id || null;
        } catch (error) {
            // User is not authenticated, which is fine for public course viewing
            console.log("User not authenticated, showing public course content");
        }

        // Get chapters
        const chapters = await db.chapter.findMany({
            where: {
                courseId: resolvedParams.courseId,
                isPublished: true
            },
            include: {
                ...(userId ? {
                    userProgress: {
                        where: {
                            userId,
                        },
                        select: {
                            isCompleted: true
                        }
                    }
                } : {}),
            },
            orderBy: {
                position: "asc"
            }
        });

        // Get published quizzes
        const quizzes = await db.quiz.findMany({
            where: {
                courseId: resolvedParams.courseId,
                isPublished: true
            },
            include: {
                ...(userId ? {
                    quizResults: {
                        where: {
                            studentId: userId,
                        },
                        select: {
                            id: true,
                            score: true,
                            totalPoints: true,
                            percentage: true
                        }
                    }
                } : {}),
            },
            orderBy: {
                position: "asc"
            }
        });

        // Combine and sort by position
        const allContent = [
            ...chapters.map(chapter => ({
                ...chapter,
                type: 'chapter' as const
            })),
            ...quizzes.map(quiz => ({
                ...quiz,
                type: 'quiz' as const
            }))
        ].sort((a, b) => a.position - b.position);

        return NextResponse.json(allContent);
    } catch (error) {
        console.error("[COURSE_CONTENT] Error details:", error);
        if (error instanceof Error) {
            console.error("[COURSE_CONTENT] Error stack:", error.stack);
            return NextResponse.json(
                { error: `Internal Error: ${error.message}` },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "Internal Error" },
            { status: 500 }
        );
    }
} 