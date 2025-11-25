import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { SearchInput } from "./_components/search-input";
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

    // Split courses into purchased and unpurchased
    const purchasedCourses = coursesWithProgress.filter(course => course.purchases.length > 0);
    const otherCourses = coursesWithProgress.filter(course => course.purchases.length === 0);

    // Helper function to render course card
    const renderCourseCard = (course: CourseWithDetails) => (
        <Link
            key={course.id}
            href={course.chapters.length > 0 ? `/courses/${course.id}/chapters/${course.chapters[0].id}` : `/courses/${course.id}`}
            className={cn(
                "flex flex-col items-center justify-center p-6 rounded-xl bg-white text-black transition-all duration-200 hover:scale-105 shadow-md border-2 border-gray-200 hover:border-gray-300 h-32"
            )}
        >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-3">
                <BookOpen className="h-8 w-8 text-red-600" />
            </div>
            <span className="text-sm font-medium text-center leading-tight line-clamp-2">{course.title}</span>
        </Link>
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">البحث عن الكورسات</h1>
                <p className="text-muted-foreground text-lg">
                    {title 
                        ? `نتائج البحث عن "${title}"`
                        : "اكتشف مجموعة متنوعة من الكورسات التعليمية المميزة"
                    }
                </p>
            </div>

            {/* Search Input Section */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
                <div className="max-w-2xl mx-auto">
                    <SearchInput />
                </div>
            </div>

            {/* Section 1: Purchased Courses - Always shown first */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        الكورسات المشتراة ({purchasedCourses.length})
                    </h2>
                    {purchasedCourses.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            استمر من حيث توقفت
                        </p>
                    )}
                </div>

                {/* Course Grid */}
                {purchasedCourses.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                        {purchasedCourses.map((course) => renderCourseCard(course))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-muted/50 rounded-2xl p-8 max-w-md mx-auto">
                            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                لا توجد كورسات مشتراة
                            </h3>
                            <p className="text-muted-foreground">
                                ابدأ بشراء كورسات للاستمرار في التعلم
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Section 2: All Other Courses */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {title 
                            ? `نتائج البحث الأخرى (${otherCourses.length})` 
                            : `جميع الكورسات الأخرى (${otherCourses.length})`
                        }
                    </h2>
                    {otherCourses.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            {otherCourses.length} كورس متاح
                        </div>
                    )}
                </div>

                {/* Course Grid */}
                {otherCourses.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                        {otherCourses.map((course) => renderCourseCard(course))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-muted/50 rounded-2xl p-8 max-w-md mx-auto">
                            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {title ? "لم يتم العثور على كورسات أخرى" : "لا توجد كورسات أخرى متاحة"}
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