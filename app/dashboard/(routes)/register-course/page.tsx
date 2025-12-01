"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function RegisterCoursePage() {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    governorate: "",
    courseId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedCourse = courses.find((c) => c.id === formData.courseId);
      
      const response = await axios.post("/api/reservations", {
        studentName: formData.fullName,
        studentPhone: formData.phoneNumber,
        governorate: formData.governorate,
        reservationType: "ONLINE_COURSE",
        courseId: formData.courseId,
        preferredDate: new Date().toISOString(),
        preferredTime: "",
        message: `تسجيل في كورس: ${selectedCourse?.title || ""}`,
      });

      toast.success("تم إرسال طلب التسجيل بنجاح");
      setFormData({ fullName: "", phoneNumber: "", governorate: "", courseId: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">تسجيل في كورس اونلاين</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-red-600" />
            نموذج التسجيل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                placeholder="أدخل الاسم"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الموبايل *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
                placeholder="أدخل رقم الموبايل"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="governorate">المحافظة *</Label>
              <Input
                id="governorate"
                value={formData.governorate}
                onChange={(e) =>
                  setFormData({ ...formData, governorate: e.target.value })
                }
                required
                placeholder="أدخل المحافظة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">الكورس المطلوب *</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الكورس" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "جاري الإرسال..." : "تسجيل"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

