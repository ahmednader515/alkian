"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";

interface Question {
    id: string;
    text: string;
    imageUrl?: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
    options?: string[];
    correctAnswer?: string | number; // Optional - no automatic grading
    points: number;
}

const CreateQuizPage = () => {
    const router = useRouter();
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [quizTimer, setQuizTimer] = useState<number | null>(null);
    const [quizMaxAttempts, setQuizMaxAttempts] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});


    const handleCreateQuiz = async () => {
        if (!quizTitle.trim()) {
            toast.error("يرجى إدخال عنوان الاختبار");
            return;
        }

        // Validate questions
        const validationErrors: string[] = [];

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            
            // Validate question text
            if (!question.text || question.text.trim() === "") {
                validationErrors.push(`السؤال ${i + 1}: نص السؤال مطلوب`);
                continue;
            }

            // Validate question options (correctAnswer is optional - no automatic grading)
            if (question.type === "MULTIPLE_CHOICE") {
                const validOptions = question.options?.filter(option => option.trim() !== "") || [];
                if (validOptions.length < 2) {
                    validationErrors.push(`السؤال ${i + 1}: يجب إضافة خيارين على الأقل`);
                    continue;
                }
            }

            // Check if points are valid
            if (question.points <= 0) {
                validationErrors.push(`السؤال ${i + 1}: الدرجات يجب أن تكون أكبر من صفر`);
                continue;
            }
        }

        if (validationErrors.length > 0) {
            toast.error(validationErrors.join('\n'));
            return;
        }

        // Additional validation: ensure no questions are empty
        if (questions.length === 0) {
            toast.error("يجب إضافة سؤال واحد على الأقل");
            return;
        }

        // Clean up questions before sending
        const cleanedQuestions = questions.map(question => {
            if (question.type === "MULTIPLE_CHOICE" && question.options) {
                // Filter out empty options and ensure correct answer is included
                const filteredOptions = question.options.filter(option => option.trim() !== "");
                return {
                    ...question,
                    options: filteredOptions
                };
            }
            return question;
        });

        setIsCreatingQuiz(true);
        try {
            const response = await fetch("/api/teacher/quizzes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: quizTitle,
                    description: quizDescription,
                    courseId: null, // Standalone quiz - no course required
                    questions: cleanedQuestions,
                    position: 1, // Position not needed for standalone quizzes
                    timer: quizTimer,
                    maxAttempts: quizMaxAttempts,
                }),
            });

            if (response.ok) {
                toast.success("تم إنشاء الاختبار بنجاح");
                router.push("/dashboard/teacher/quizzes");
            } else {
                const error = await response.json();
                toast.error(error.message || "حدث خطأ أثناء إنشاء الاختبار");
            }
        } catch (error) {
            console.error("Error creating quiz:", error);
            toast.error("حدث خطأ أثناء إنشاء الاختبار");
        } finally {
            setIsCreatingQuiz(false);
        }
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `question-${Date.now()}`,
            text: "",
            type: "MULTIPLE_CHOICE",
            options: ["", "", "", ""],
            correctAnswer: undefined, // Optional - no automatic grading
            points: 1,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };


    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    إنشاء اختبار جديد
                </h1>
                <Button variant="outline" onClick={() => router.push("/dashboard/teacher/quizzes")}>
                    العودة إلى الاختبارات
                </Button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>عنوان الاختبار</Label>
                    <Input
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="أدخل عنوان الاختبار"
                    />
                </div>


                <div className="space-y-2">
                    <Label>وصف الاختبار</Label>
                    <Textarea
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                        placeholder="أدخل وصف الاختبار"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>مدة الاختبار (بالدقائق)</Label>
                        <Input
                            type="number"
                            value={quizTimer || ""}
                            onChange={(e) => setQuizTimer(e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="اترك فارغاً لعدم تحديد مدة"
                            min="1"
                        />
                        <p className="text-sm text-muted-foreground">
                            اترك الحقل فارغاً إذا كنت لا تريد تحديد مدة للاختبار
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label>عدد المحاولات المسموحة</Label>
                        <Input
                            type="number"
                            value={quizMaxAttempts}
                            onChange={(e) => setQuizMaxAttempts(parseInt(e.target.value))}
                            min="1"
                            max="10"
                        />
                        <p className="text-sm text-muted-foreground">
                            عدد المرات التي يمكن للطالب إعادة الاختبار
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>الأسئلة</Label>
                        <Button type="button" variant="outline" onClick={addQuestion}>
                            <Plus className="h-4 w-4 mr-2" />
                            إضافة سؤال
                        </Button>
                    </div>

                    {questions.map((question, index) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">السؤال {index + 1}</CardTitle>
                                        {(!question.text.trim() || 
                                          (question.type === "MULTIPLE_CHOICE" && 
                                           (!question.options || question.options.filter(opt => opt.trim() !== "").length < 2))) && (
                                            <Badge variant="destructive" className="text-xs">
                                                غير مكتمل
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeQuestion(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>نص السؤال</Label>
                                    <Textarea
                                        value={question.text}
                                        onChange={(e) => updateQuestion(index, "text", e.target.value)}
                                        placeholder="أدخل نص السؤال"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>صورة السؤال (اختياري)</Label>
                                    <div className="space-y-2">
                                        {question.imageUrl ? (
                                            <div className="relative">
                                                <img 
                                                    src={question.imageUrl} 
                                                    alt="Question" 
                                                    className="max-w-full h-auto max-h-48 rounded-lg border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => updateQuestion(index, "imageUrl", "")}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                                <UploadDropzone
                                                    endpoint="courseAttachment"
                                                    onClientUploadComplete={(res) => {
                                                        if (res && res[0]) {
                                                            updateQuestion(index, "imageUrl", res[0].ufsUrl || res[0].url);
                                                            toast.success("تم رفع الصورة بنجاح");
                                                        }
                                                        setUploadingImages(prev => ({ ...prev, [index]: false }));
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error(`حدث خطأ أثناء رفع الصورة: ${error.message}`);
                                                        setUploadingImages(prev => ({ ...prev, [index]: false }));
                                                    }}
                                                    onUploadBegin={() => {
                                                        setUploadingImages(prev => ({ ...prev, [index]: true }));
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>نوع السؤال</Label>
                                        <Select
                                            value={question.type}
                                            onValueChange={(value: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER") =>
                                                updateQuestion(index, "type", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MULTIPLE_CHOICE">اختيار من متعدد</SelectItem>
                                                <SelectItem value="TRUE_FALSE">صح أو خطأ</SelectItem>
                                                <SelectItem value="SHORT_ANSWER">إجابة قصيرة</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>الدرجات</Label>
                                        <Input
                                            type="number"
                                            value={question.points}
                                            onChange={(e) => updateQuestion(index, "points", parseInt(e.target.value))}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {question.type === "MULTIPLE_CHOICE" && (
                                    <div className="space-y-2">
                                        <Label>الخيارات</Label>
                                        {(question.options || ["", "", "", ""]).map((option, optionIndex) => (
                                            <div key={`${question.id}-option-${optionIndex}`} className="flex items-center space-x-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...(question.options || ["", "", "", ""])];
                                                        newOptions[optionIndex] = e.target.value;
                                                        updateQuestion(index, "options", newOptions);
                                                    }}
                                                    placeholder={`الخيار ${optionIndex + 1}`}
                                                />
                                                <input
                                                    type="radio"
                                                    name={`correct-${index}`}
                                                    checked={typeof question.correctAnswer === 'number' && question.correctAnswer === optionIndex}
                                                    onChange={() => updateQuestion(index, "correctAnswer", optionIndex)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.type === "TRUE_FALSE" && (
                                    <div className="space-y-2">
                                        <Label>الإجابة الصحيحة (اختياري)</Label>
                                        <Select
                                            value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                                            onValueChange={(value) => updateQuestion(index, "correctAnswer", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="اختر الإجابة الصحيحة" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">صح</SelectItem>
                                                <SelectItem value="false">خطأ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {question.type === "SHORT_ANSWER" && (
                                    <div className="space-y-2">
                                        <Label>الإجابة الصحيحة (اختياري)</Label>
                                        <Input
                                            value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                                            onChange={(e) => updateQuestion(index, "correctAnswer", e.target.value)}
                                            placeholder="أدخل الإجابة الصحيحة"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard/teacher/quizzes")}
                    >
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleCreateQuiz}
                        disabled={isCreatingQuiz || questions.length === 0}
                    >
                        {isCreatingQuiz ? "جاري الحفظ..." : "إنشاء الاختبار"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPage; 