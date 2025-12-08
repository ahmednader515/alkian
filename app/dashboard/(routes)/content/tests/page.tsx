"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, BookOpen, RefreshCw } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  courseId: string | null;
  course: {
    id: string;
    title: string;
    price?: number | null;
  } | null;
  questions: { id: string }[];
  createdAt: string;
  hasPurchased: boolean;
  isStandalone?: boolean;
  hasSubmitted?: boolean;
}

export default function TestsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/quizzes");
      setQuizzes(response.data.quizzes || []);
    } catch (error: any) {
      console.error("Error fetching quizzes:", error);
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء جلب الاختبارات");
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">الاختبارات</h1>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للخلف
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-[#052c4b]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الاختبارات</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              لا توجد اختبارات متاحة حالياً
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
                  </div>
                </div>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {quiz.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {quiz.course && (
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{quiz.course.title}</span>
                  </div>
                )}
                {quiz.isStandalone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      مجاني
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {quiz.questions.length} {quiz.questions.length === 1 ? "سؤال" : "أسئلة"}
                  </Badge>
                  {quiz.hasPurchased ? (
                    quiz.hasSubmitted ? (
                      <Button asChild size="sm" variant="outline" className="border-[#052c4b] text-[#052c4b] hover:bg-[#052c4b]/10">
                        <Link href={quiz.isStandalone ? `/quizzes/${quiz.id}/result` : `/courses/${quiz.courseId}/quizzes/${quiz.id}/result`}>
                          عرض إجاباتك
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" className="bg-[#052c4b] hover:bg-[#052c4b]/90">
                        <Link href={quiz.isStandalone ? `/quizzes/${quiz.id}` : `/courses/${quiz.courseId}/quizzes/${quiz.id}`}>
                          بدء الاختبار
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                      <Link href={`/courses/${quiz.courseId}/purchase`}>
                        شراء الكورس
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

