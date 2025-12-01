import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Course, Purchase } from "@prisma/client";
import { cn } from "@/lib/utils";

type CourseWithDetails = Course & {
    chapters: { id: string }[];
    purchases: Purchase[];
    progress: number;
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return redirect("/");
    }

    const resolvedParams = await searchParams;
    const title = typeof resolvedParams.title === 'string' ? resolvedParams.title : '';

    const courses = await db.course.findMany({
        where: {
            isPublished: true,
            title: {
                contains: title,
            }
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                select: {
                    id: true,
                }
            },
            purchases: {
                where: {
                    userId: session.user.id,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
            const totalChapters = course.chapters.length;
            const completedChapters = await db.userProgress.count({
                where: {
                    userId: session.user.id,
                    chapterId: {
                        in: course.chapters.map(chapter => chapter.id)
                    },
                    isCompleted: true
                }
            });

            const progress = totalChapters > 0 
                ? (completedChapters / totalChapters) * 100 
                : 0;

            return {
                ...course,
                progress
            } as CourseWithDetails;
        })
    );

    // Combine all courses into one array
    const allCourses = coursesWithProgress;

    // Helper function to render course card
    const renderCourseCard = (course: CourseWithDetails) => (
        <Link
            key={course.id}
            href={course.chapters.length > 0 ? `/courses/${course.id}/chapters/${course.chapters[0].id}` : `/courses/${course.id}`}
            className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl bg-white text-black transition-all duration-200 hover:scale-105 shadow-md border-2 border-gray-200 hover:border-gray-300 min-h-40"
            )}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 mb-2">
                <BookOpen className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-xs font-medium text-center leading-tight px-2">{course.title}</span>
        </Link>
    );

    return (
        <div className="p-6 space-y-6">
            {/* All Courses Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {title 
                            ? `نتائج البحث (${allCourses.length})` 
                            : `جميع الكورسات (${allCourses.length})`
                        }
                    </h2>
                    {allCourses.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            {allCourses.length} كورس متاح
                        </p>
                    )}
                </div>

                {/* Course Grid */}
                {allCourses.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
                        {allCourses.map((course) => renderCourseCard(course))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-muted/50 rounded-2xl p-8 max-w-md mx-auto">
                            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {title ? "لم يتم العثور على كورسات" : "لا توجد كورسات متاحة"}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {title 
                                    ? "جرب البحث بكلمات مختلفة أو تصفح جميع الكورسات"
                                    : "سيتم إضافة كورسات جديدة قريباً"
                                }
                            </p>
                            {title && (
                                <Button asChild className="bg-[#052c4b] hover:bg-[#052c4b]/90 text-white font-semibold">
                                    <Link href="/dashboard/search">
                                        عرض جميع الكورسات
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}