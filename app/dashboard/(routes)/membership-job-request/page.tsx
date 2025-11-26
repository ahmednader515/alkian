"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function MembershipJobRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    governorate: "",
    previousExperience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/reservations", {
        studentName: formData.fullName,
        studentPhone: formData.phoneNumber,
        governorate: formData.governorate,
        reservationType: "MEMBERSHIP",
        preferredDate: new Date().toISOString(),
        preferredTime: "",
        message: `طلب عضوية ووظيفة\nالخبرات السابقة: ${formData.previousExperience}`,
      });

      toast.success("تم إرسال الطلب بنجاح");
      setFormData({ fullName: "", phoneNumber: "", governorate: "", previousExperience: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">طلب عضوية و وظيفة</h1>
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
            <UserPlus className="h-5 w-5 text-red-600" />
            نموذج التسجيل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الرجاء الاسم: *</Label>
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
              <Label htmlFor="governorate">المحافظة: *</Label>
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
              <Label htmlFor="previousExperience">الخبرات السابقه: *</Label>
              <Textarea
                id="previousExperience"
                value={formData.previousExperience}
                onChange={(e) =>
                  setFormData({ ...formData, previousExperience: e.target.value })
                }
                required
                placeholder="أدخل الخبرات السابقة"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

