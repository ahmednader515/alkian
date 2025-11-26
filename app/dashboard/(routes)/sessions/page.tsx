"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

const sessionTypes = [
  { id: "rehabilitation", label: "حجز جلسة تأهيل" },
  { id: "cupping", label: "حجز جلسه حجامه" },
  { id: "massage", label: "حجز جلسه تدليك" },
  { id: "spiritual", label: "حجز جلسة روحانيه" },
  { id: "consultation", label: "حجز استشاره" },
  { id: "personal", label: "حجز مقابله شخصيه" },
];

export default function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    governorate: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedSession && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find the session type label
      const sessionType = sessionTypes.find((s) => s.id === selectedSession);
      
      const response = await axios.post("/api/reservations", {
        studentName: formData.fullName,
        studentPhone: formData.phoneNumber,
        governorate: formData.governorate,
        reservationType: selectedSession?.toUpperCase() || "GENERAL",
        preferredDate: formData.preferredDate || new Date().toISOString(),
        preferredTime: formData.preferredTime || "09:00",
        message: `حجز: ${sessionType?.label || ""}`,
      });

      toast.success("تم إرسال طلب الحجز بنجاح");
      setFormData({ fullName: "", phoneNumber: "", governorate: "", preferredDate: "", preferredTime: "" });
      setSelectedSession(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الجلسات</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sessionTypes.map((session) => (
          <Card
            key={session.id}
            className={`cursor-pointer transition-all ${
              selectedSession === session.id
                ? "border-red-600 bg-red-50"
                : "hover:border-gray-300"
            }`}
            onClick={() => setSelectedSession(session.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <p className="text-lg font-medium">{session.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSession && (
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle>حجز {sessionTypes.find((s) => s.id === selectedSession)?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الثلاثي *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  placeholder="أدخل الاسم الثلاثي"
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
                <Label htmlFor="preferredDate">التاريخ المفضل *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">الوقت المفضل *</Label>
                <Input
                  id="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "جاري الإرسال..." : "حجز"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

