"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  chapters: { id: string }[];
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الكورسات المسجلة</h1>
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
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              لا توجد كورسات متاحة حالياً
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video bg-muted">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-bold text-red-600">
                    {course.price === null || course.price === 0
                      ? "مجاني"
                      : `${course.price} جنيه`}
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#052c4b] hover:bg-[#052c4b]/90"
                  >
                    <Link
                      href={
                        course.chapters.length > 0
                          ? `/courses/${course.id}/chapters/${course.chapters[0].id}`
                          : `/courses/${course.id}`
                      }
                    >
                      عرض الكورس
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
