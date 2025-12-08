"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText } from "lucide-react";
import { parseQuizOptions } from "@/lib/utils";

interface QuizAnswer {
    questionId: string;
    studentAnswer: string;
    correctAnswer?: string | null;
    question: {
        id: string;
        text: string;
        type: string;
        options?: string | null;
        points: number;
        imageUrl?: string | null;
    };
}

interface QuizResult {
    id: string;
    submittedAt: string;
    answers: QuizAnswer[];
    quiz: {
        id: string;
        title: string;
        description: string | null;
        maxAttempts: number;
    };
}

export default function StandaloneQuizResultPage({
    params,
}: {
    params: Promise<{ quizId: string }>;
}) {
    const router = useRouter();
    const { quizId } = use(params);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, [quizId]);

    const fetchResult = async () => {
        try {
            const response = await fetch(`/api/quizzes/${quizId}/result`);
            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                console.error("Error fetching result");
            }
        } catch (error) {
            console.error("Error fetching result:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">النتيجة غير موجودة</h1>
                    <Button onClick={() => router.back()}>العودة</Button>
                </div>
            </div>
        );
    }

    const questionOptions = (options: string | null | undefined) => {
        if (!options) return [];
        return typeof options === 'string' ? parseQuizOptions(options) : options;
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        العودة
                    </Button>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl mb-2">{result.quiz.title}</CardTitle>
                            {result.quiz.description && (
                                <CardDescription className="text-base">
                                    {result.quiz.description}
                                </CardDescription>
                            )}
                            <div className="mt-4 flex items-center gap-2">
                                <Badge variant="secondary">
                                    تم الإرسال: {(() => {
                                        const date = new Date(result.submittedAt);
                                        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                                        const day = date.getDate();
                                        const month = months[date.getMonth()];
                                        const year = date.getFullYear();
                                        const hours = date.getHours().toString().padStart(2, '0');
                                        const minutes = date.getMinutes().toString().padStart(2, '0');
                                        return `${day} ${month} ${year} في ${hours}:${minutes}`;
                                    })()}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold">إجاباتك:</h2>
                    {result.answers.map((answer, index) => {
                        const options = questionOptions(answer.question.options);
                        return (
                            <Card key={answer.questionId}>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-lg">
                                            السؤال {index + 1}: {answer.question.text}
                                        </CardTitle>
                                        <Badge variant="outline">
                                            {answer.question.points} درجة
                                        </Badge>
                                    </div>
                                    {answer.question.imageUrl && (
                                        <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                                            <img 
                                                src={answer.question.imageUrl} 
                                                alt="Question image"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {answer.question.type === "MULTIPLE_CHOICE" && (
                                        <div className="space-y-2">
                                            {options.map((option, optIndex) => (
                                                <div 
                                                    key={optIndex}
                                                    className={`p-3 border rounded-lg ${
                                                        option === answer.studentAnswer 
                                                            ? 'bg-blue-50 border-blue-300' 
                                                            : 'bg-muted'
                                                    }`}
                                                >
                                                    {option}
                                                    {option === answer.studentAnswer && (
                                                        <Badge variant="outline" className="mr-2">
                                                            إجابتك
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {answer.question.type === "TRUE_FALSE" && (
                                        <div className="space-y-2">
                                            <div 
                                                className={`p-3 border rounded-lg ${
                                                    answer.studentAnswer === "true"
                                                        ? 'bg-blue-50 border-blue-300' 
                                                        : 'bg-muted'
                                                }`}
                                            >
                                                صح
                                                {answer.studentAnswer === "true" && (
                                                    <Badge variant="outline" className="mr-2">
                                                        إجابتك
                                                    </Badge>
                                                )}
                                            </div>
                                            <div 
                                                className={`p-3 border rounded-lg ${
                                                    answer.studentAnswer === "false"
                                                        ? 'bg-blue-50 border-blue-300' 
                                                        : 'bg-muted'
                                                }`}
                                            >
                                                خطأ
                                                {answer.studentAnswer === "false" && (
                                                    <Badge variant="outline" className="mr-2">
                                                        إجابتك
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {answer.question.type === "SHORT_ANSWER" && (
                                        <div className="p-4 border rounded-lg bg-blue-50 border-blue-300">
                                            <p className="font-medium mb-2">إجابتك:</p>
                                            <p className="whitespace-pre-wrap">{answer.studentAnswer || "لم يتم الإجابة"}</p>
                                        </div>
                                    )}

                                    {answer.correctAnswer && (
                                        <div className="mt-4 p-4 border rounded-lg bg-green-50 border-green-300">
                                            <p className="font-medium mb-2">الإجابة الصحيحة:</p>
                                            <p>{answer.correctAnswer}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <Button 
                        onClick={() => router.push(`/quizzes/${quizId}`)}
                        className="bg-[#052c4b] hover:bg-[#052c4b]/90"
                    >
                        إعادة الاختبار
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => router.push('/dashboard/content/tests')}
                    >
                        العودة للاختبارات
                    </Button>
                </div>
            </div>
        </div>
    );
}

