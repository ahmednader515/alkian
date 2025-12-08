"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { parseQuizOptions } from "@/lib/utils";

interface Question {
    id: string;
    text: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
    options?: string[] | string;
    correctAnswer?: string;
    points: number;
    imageUrl?: string;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    timer?: number; // Timer in minutes
    maxAttempts: number;
    currentAttempt?: number;
    previousAttempts?: number;
    questions: Question[];
    canTakeQuiz?: boolean;
}

interface QuizAnswer {
    questionId: string;
    answer: string;
}

export default function StandaloneQuizPage({
    params,
}: {
    params: Promise<{ quizId: string }>;
}) {
    const router = useRouter();
    const { quizId } = use(params);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [redirectToResult, setRedirectToResult] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        if (redirectToResult) {
            router.push(`/quizzes/${quizId}/result`);
        }
    }, [redirectToResult, quizId, router]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quiz) {
            handleSubmit();
        }
    }, [timeLeft]);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/quizzes/${quizId}`);
            if (response.ok) {
                const data = await response.json();
                setQuiz(data);
                // Set timer from database or default to 30 minutes
                const timerInSeconds = (data.timer || 30) * 60;
                setTimeLeft(timerInSeconds);
            } else {
                const errorText = await response.text();
                if (errorText.includes("Maximum attempts reached")) {
                    toast.error("لقد استنفذت جميع المحاولات المسموحة لهذا الاختبار");
                    setRedirectToResult(true);
                } else {
                    toast.error("حدث خطأ أثناء تحميل الاختبار");
                }
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            toast.error("حدث خطأ أثناء تحميل الاختبار");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => {
            const existing = prev.find(a => a.questionId === questionId);
            if (existing) {
                return prev.map(a => a.questionId === questionId ? { ...a, answer } : a);
            } else {
                return [...prev, { questionId, answer }];
            }
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/quizzes/${quizId}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answers }),
            });

            if (response.ok) {
                toast.success("تم إرسال الاختبار بنجاح!");
                router.push(`/quizzes/${quizId}/result`);
            } else {
                const error = await response.text();
                toast.error(error || "حدث خطأ أثناء إرسال الاختبار");
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error("حدث خطأ أثناء إرسال الاختبار");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
            </div>
        );
    }

    if (redirectToResult) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b] mx-auto mb-4"></div>
                    <p className="text-muted-foreground">جاري تحميل النتيجة...</p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">الاختبار غير موجود</h1>
                    <Button onClick={() => router.back()}>العودة</Button>
                </div>
            </div>
        );
    }

    if (!quiz.canTakeQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">لقد استنفذت جميع المحاولات</h1>
                    <p className="text-muted-foreground mb-4">
                        لقد استخدمت جميع المحاولات المسموحة ({quiz.maxAttempts}) لهذا الاختبار
                    </p>
                    <Button onClick={() => router.push(`/quizzes/${quizId}/result`)}>
                        عرض النتائج السابقة
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestionData = quiz.questions[currentQuestion];
    const totalQuestions = quiz.questions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    // Parse options if they're a string
    const questionOptions = currentQuestionData.options 
        ? (typeof currentQuestionData.options === 'string' 
            ? parseQuizOptions(currentQuestionData.options) 
            : currentQuestionData.options)
        : [];

    const currentAnswer = answers.find(a => a.questionId === currentQuestionData.id)?.answer || "";

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
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
                                    {quiz.description && (
                                        <CardDescription className="text-base">
                                            {quiz.description}
                                        </CardDescription>
                                    )}
                                </div>
                                {quiz.timer && (
                                    <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                                        <Clock className="h-5 w-5 text-red-600" />
                                        <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        السؤال {currentQuestion + 1} من {totalQuestions}
                                    </Badge>
                                    {quiz.currentAttempt && (
                                        <Badge variant="outline">
                                            المحاولة {quiz.currentAttempt} من {quiz.maxAttempts}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div 
                                            className="bg-[#052c4b] h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {currentQuestionData.text}
                        </CardTitle>
                        {currentQuestionData.imageUrl && (
                            <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                                <img 
                                    src={currentQuestionData.imageUrl} 
                                    alt="Question image"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {currentQuestionData.type === "MULTIPLE_CHOICE" && (
                            <RadioGroup
                                value={currentAnswer}
                                onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                            >
                                {questionOptions.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2 space-x-reverse mb-4 p-3 border rounded-lg hover:bg-muted transition-colors">
                                        <RadioGroupItem value={option} id={`option-${optionIndex}`} />
                                        <Label htmlFor={`option-${optionIndex}`} className="flex-1 cursor-pointer">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {currentQuestionData.type === "TRUE_FALSE" && (
                            <RadioGroup
                                value={currentAnswer}
                                onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                            >
                                <div className="flex items-center space-x-2 space-x-reverse mb-4 p-3 border rounded-lg hover:bg-muted transition-colors">
                                    <RadioGroupItem value="true" id="true" />
                                    <Label htmlFor="true" className="flex-1 cursor-pointer">صح</Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse mb-4 p-3 border rounded-lg hover:bg-muted transition-colors">
                                    <RadioGroupItem value="false" id="false" />
                                    <Label htmlFor="false" className="flex-1 cursor-pointer">خطأ</Label>
                                </div>
                            </RadioGroup>
                        )}

                        {currentQuestionData.type === "SHORT_ANSWER" && (
                            <Textarea
                                value={currentAnswer}
                                onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                                placeholder="أدخل إجابتك هنا..."
                                rows={5}
                                className="w-full"
                            />
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                    >
                        السابق
                    </Button>
                    {currentQuestion === totalQuestions - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || answers.length < totalQuestions}
                            className="bg-[#052c4b] hover:bg-[#052c4b]/90"
                        >
                            {submitting ? "جاري الإرسال..." : "إرسال الاختبار"}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
                            disabled={currentQuestion === totalQuestions - 1}
                        >
                            التالي
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

