"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function RenewalRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    serialNumber: "",
    renewalRequest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/reservations", {
        studentName: formData.fullName,
        studentPhone: formData.phoneNumber,
        governorate: "غير محدد",
        reservationType: "GENERAL",
        preferredDate: new Date().toISOString(),
        preferredTime: "",
        message: `طلب تجديد\nسريل نمبر الكارنيه او الشهاده: ${formData.serialNumber}\nطلب التجديد: ${formData.renewalRequest}`,
      });

      toast.success("تم إرسال طلب التجديد بنجاح");
      setFormData({ fullName: "", phoneNumber: "", serialNumber: "", renewalRequest: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">طلب تجديد</h1>
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
            <RefreshCw className="h-5 w-5 text-red-600" />
            نموذج طلب التجديد
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
              <Label htmlFor="serialNumber">سريل نمبر الكارنيه او الشهاده *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                required
                placeholder="أدخل سريل نمبر الكارنيه او الشهاده"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewalRequest">طلب التجديد *</Label>
              <Textarea
                id="renewalRequest"
                value={formData.renewalRequest}
                onChange={(e) =>
                  setFormData({ ...formData, renewalRequest: e.target.value })
                }
                required
                placeholder="أدخل تفاصيل طلب التجديد"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال طلب التجديد"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

