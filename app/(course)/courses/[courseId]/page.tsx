"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, BookOpen, FileText, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  isFree: boolean;
  position: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  position: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  chapters: Chapter[];
  quizzes: Quiz[];
  user: {
    id: string;
    fullName: string;
    image: string;
  };
}

export default function CoursePage() {
  const router = useRouter();
  const params = useParams() as { courseId: string };
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (session?.user) {
      checkAccess();
    }
  }, [params.courseId, session]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${params.courseId}`);
      if (response.data) {
        setCourse(response.data);
      } else {
        toast.error("الكورس غير موجود");
      }
    } catch (error: any) {
      console.error("Error fetching course:", error);
      if (error.response?.status === 404) {
        toast.error("الكورس غير موجود");
      } else {
        toast.error("حدث خطأ أثناء تحميل الكورس");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      const response = await axios.get(`/api/courses/${params.courseId}/access`);
      setHasAccess(response.data.hasAccess);
    } catch (error) {
      // If user is not authenticated, hasAccess will remain false
      setHasAccess(false);
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (!chapter.isFree && !hasAccess) {
      toast.error("يجب شراء الكورس للوصول إلى هذا الفصل");
      return;
    }
    router.push(`/courses/${params.courseId}/chapters/${chapter.id}`);
  };

  const handleQuizClick = (quiz: Quiz) => {
    if (!hasAccess) {
      toast.error("يجب شراء الكورس للوصول إلى هذا الاختبار");
      return;
    }
    router.push(`/courses/${params.courseId}/quizzes/${quiz.id}`);
  };

  const handlePurchase = () => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }
    router.push(`/courses/${params.courseId}/purchase`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الكورس غير موجود</h1>
          <Button asChild>
            <Link href="/">العودة إلى الصفحة الرئيسية</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Combine chapters and quizzes, sort by position
  const allContent = [
    ...course.chapters.map(ch => ({ ...ch, type: 'chapter' as const })),
    ...course.quizzes.map(q => ({ ...q, type: 'quiz' as const }))
  ].sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                if (session?.user) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </Button>
          </div>

          {/* Course Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                {course.imageUrl && course.imageUrl.trim() !== "" && (
                  <div className="relative w-full md:w-64 h-48 md:h-64 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-4">{course.title}</CardTitle>
                  {course.description ? (
                    <div 
                      className="text-base text-muted-foreground mb-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  ) : (
                    <CardDescription className="text-base mb-4">
                      لا يوجد وصف للكورس
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {course.user.image && course.user.image.trim() !== "" && (
                        <Image
                          src={course.user.image}
                          alt={course.user.fullName}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm text-muted-foreground">{course.user.fullName}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#052c4b]">
                    {course.price === 0 ? "مجاني" : formatPrice(course.price)}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                محتوى الكورس
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allContent.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  لا يوجد محتوى متاح حالياً
                </p>
              ) : (
                <div className="space-y-2">
                  {allContent.map((content) => {
                    const isChapter = content.type === 'chapter';
                    const isFree = isChapter && (content as Chapter).isFree;
                    const isLocked = isChapter ? (!isFree && !hasAccess) : (!hasAccess);
                    const canAccess = isChapter ? (isFree || hasAccess) : hasAccess;

                    return (
                      <div
                        key={content.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                          isLocked
                            ? 'bg-muted cursor-not-allowed opacity-60'
                            : canAccess
                            ? 'bg-card hover:bg-accent cursor-pointer'
                            : 'bg-muted cursor-not-allowed opacity-60'
                        }`}
                        onClick={() => {
                          if (isLocked) {
                            if (!session?.user) {
                              toast.error("يجب تسجيل الدخول وشراء الكورس للوصول إلى هذا المحتوى");
                              router.push("/sign-in");
                            } else {
                              toast.error("يجب شراء الكورس للوصول إلى هذا المحتوى");
                              router.push(`/courses/${params.courseId}/purchase`);
                            }
                            return;
                          }
                          if (isChapter) {
                            handleChapterClick(content as Chapter);
                          } else {
                            handleQuizClick(content as Quiz);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {isLocked ? (
                            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{content.title}</span>
                              {isChapter && isFree && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                  مجاني
                                </span>
                              )}
                              {!isChapter && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                  اختبار
                                </span>
                              )}
                            </div>
                            {content.description && (
                              <div 
                                className="text-sm text-muted-foreground mt-1 line-clamp-2 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: content.description }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Button */}
          {(!hasAccess && course.price > 0) && (
            <Card className="border-[#052c4b]">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">شراء الكورس للوصول إلى جميع المحتويات</h3>
                  <Button
                    onClick={handlePurchase}
                    className="w-full md:w-auto bg-[#052c4b] hover:bg-[#052c4b]/90 text-white"
                    size="lg"
                  >
                    {session?.user ? "شراء الكورس" : "تسجيل الدخول للشراء"}
                  </Button>
                  {!session?.user && (
                    <p className="text-sm text-muted-foreground">
                      ستحتاج إلى تسجيل الدخول أولاً للشراء
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

