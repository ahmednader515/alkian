import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseQuizOptions, stringifyQuizOptions } from "@/lib/utils";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all quizzes - both standalone (courseId is null) and from all courses
        // All teachers can see all quizzes
        const quizzes = await db.quiz.findMany({
            include: {
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                questions: {
                    select: {
                        id: true,
                        text: true,
                        type: true,
                        options: true,
                        correctAnswer: true,
                        points: true,
                        imageUrl: true,
                        position: true
                    },
                    orderBy: {
                        position: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Parse options for multiple choice questions
        const quizzesWithParsedOptions = quizzes.map(quiz => ({
            ...quiz,
            questions: quiz.questions.map(question => ({
                ...question,
                options: parseQuizOptions(question.options)
            }))
        }));

        return NextResponse.json(quizzesWithParsedOptions);
    } catch (error) {
        console.log("[TEACHER_QUIZZES_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { title, description, courseId, questions, position, timer, maxAttempts } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Validate required fields
        if (!title || !title.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        // courseId is now optional - quizzes can be standalone
        if (courseId) {
            // Verify course exists if provided
            const course = await db.course.findUnique({
                where: {
                    id: courseId
                }
            });

            if (!course) {
                return NextResponse.json({ error: "Course not found" }, { status: 404 });
            }
        }

        // Get the next position if not provided
        let quizPosition = position;
        if (!quizPosition || quizPosition <= 0) {
            const lastQuiz = await db.quiz.findFirst({
                where: courseId ? { courseId } : { courseId: null },
                orderBy: {
                    position: 'desc'
                }
            });
            quizPosition = lastQuiz ? lastQuiz.position + 1 : 1;
        }

        // Validate questions
        if (!questions || questions.length === 0) {
            return NextResponse.json({ error: "At least one question is required" }, { status: 400 });
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            
            if (!question.text || !question.text.trim()) {
                return NextResponse.json({ error: `Question ${i + 1}: Text is required` }, { status: 400 });
            }

            if (question.type === "MULTIPLE_CHOICE") {
                if (!question.options || question.options.length < 2) {
                    return NextResponse.json({ error: `Question ${i + 1}: At least 2 options are required` }, { status: 400 });
                }

                const validOptions = question.options.filter((option: string) => option && option.trim() !== "");
                if (validOptions.length < 2) {
                    return NextResponse.json({ error: `Question ${i + 1}: At least 2 valid options are required` }, { status: 400 });
                }
                // correctAnswer is now optional - no validation needed
            }

            if (!question.points || question.points <= 0) {
                return NextResponse.json({ error: `Question ${i + 1}: Points must be greater than 0` }, { status: 400 });
            }
        }

        // Create the quiz (courseId is optional)
        const quizData = {
            title,
            description,
            position: Number(quizPosition),
            courseId: courseId || null, // Optional - quizzes can be standalone
            timer: timer || null,
            maxAttempts: maxAttempts || 1
        };
        
        const quiz = await db.quiz.create({
            data: quizData,
            include: {
                course: {
                    select: {
                        title: true
                    }
                }
            }
        });
        
        // Now add the questions separately (correctAnswer is optional)
        if (questions.length > 0) {
            await db.question.createMany({
                data: questions.map((question: any, index: number) => {
                    let correctAnswerValue = question.correctAnswer || null;
                    
                    // For multiple choice questions, convert index to actual option value if correctAnswer is provided
                    if (question.type === "MULTIPLE_CHOICE" && typeof question.correctAnswer === 'number') {
                        const validOptions = question.options.filter((option: string) => option && option.trim() !== "");
                        if (question.correctAnswer >= 0 && question.correctAnswer < validOptions.length) {
                            correctAnswerValue = validOptions[question.correctAnswer];
                        }
                    }
                    
                    return {
                        text: question.text,
                        type: question.type,
                        options: question.type === "MULTIPLE_CHOICE" ? stringifyQuizOptions(question.options) : null,
                        correctAnswer: correctAnswerValue, // Optional - no automatic grading
                        points: question.points,
                        imageUrl: question.imageUrl || null,
                        quizId: quiz.id,
                        position: index + 1
                    };
                })
            });
        }
        
        // Fetch the quiz with questions
        const quizWithQuestions = await db.quiz.findUnique({
            where: { id: quiz.id },
            include: {
                course: {
                    select: {
                        title: true
                    }
                },
                questions: {
                    orderBy: {
                        position: 'asc'
                    }
                }
            }
        });

        if (!quizWithQuestions) {
            return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
        }

        // Parse options for the response
        const quizWithParsedOptions = {
            ...quizWithQuestions,
            questions: quizWithQuestions.questions.map(question => ({
                ...question,
                options: parseQuizOptions(question.options)
            }))
        };

        return NextResponse.json(quizWithParsedOptions);
    } catch (error) {
        console.log("[TEACHER_QUIZZES_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
} 