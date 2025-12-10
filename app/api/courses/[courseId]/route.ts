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
            console.log("User not authenticated, showing public course data:", error);
        }
        
        const { courseId } = resolvedParams;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
            include: {
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        isFree: true,
                        position: true,
                        videoUrl: true,
                        videoType: true,
                        youtubeVideoId: true,
                    },
                },
                quizzes: {
                    where: {
                        isPublished: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        position: true,
                    },
                },
                attachments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        image: true,
                    },
                },
                ...(userId ? {
                    purchases: {
                        where: {
                            userId,
                        },
                    },
                } : {}),
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID] Error details:", error);
        if (error instanceof Error) {
            console.error("[COURSE_ID] Error stack:", error.stack);
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

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId, user } = await auth();
        const resolvedParams = await params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // All teachers can edit courses (no ownership check)
        const course = await db.course.update({
            where: { id: resolvedParams.courseId },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId, user } = await auth();
        const resolvedParams = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Only owner or admin can delete
        if (user?.role !== "ADMIN" && course.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: resolvedParams.courseId,
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}