"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  chapters: { id: string }[];
}

export default function ServicesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">خدماتنا</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={course.chapters.length > 0 ? `/courses/${course.id}/chapters/${course.chapters[0].id}` : `/courses/${course.id}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-black transition-all duration-200 hover:scale-105 shadow-md border-2 border-gray-200 hover:border-gray-300 min-h-40"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 mb-2">
                  <BookOpen className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-center leading-tight px-2">{course.title}</span>
              </Link>
            ))}
          </div>

          {courses.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  لا توجد كورسات متاحة حالياً
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
