"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

const reservationTypes: Record<string, { title: string; description: string }> = {
  rehabilitation: { title: "حجز جلسة تأهيل", description: "احجز جلسة تأهيل متخصصة" },
  cupping: { title: "حجز جلسة حجامة", description: "احجز جلسة حجامة علاجية" },
  massage: { title: "حجز جلسة تدليك", description: "احجز جلسة تدليك متخصصة" },
  spiritual: { title: "حجز جلسة روحانية", description: "احجز جلسة روحانية" },
  consultation: { title: "حجز استشارة", description: "احجز استشارة متخصصة" },
  personal: { title: "حجز مقابلة شخصية", description: "احجز مقابلة شخصية" },
  "online-course": { title: "تسجيل في كورس أون لاين", description: "سجل في أحد الكورسات المتاحة" },
  membership: { title: "طلب عضوية ووظيفة", description: "قدم طلب للعضوية أو الوظيفة" },
  renewal: { title: "طلب تجديد", description: "قدم طلب لتجديد الشهادة أو الكارنيه" },
};

export default function ReservationFormPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const reservationType = reservationTypes[type] || reservationTypes.rehabilitation;

  const [formData, setFormData] = useState({
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    governorate: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    courseId: "",
    serialNumber: "",
    previousExperience: "",
  });

  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (type === "online-course") {
      // Fetch courses for online course registration
      axios.get("/api/courses/public")
        .then((res) => {
          setCourses(res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
        });
    }
  }, [type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const reservationData = {
        ...formData,
        reservationType: type.toUpperCase().replace("-", "_"),
      };

      await axios.post("/api/reservations", reservationData);
      
      toast.success("تم إرسال طلب الحجز بنجاح!");
      setIsSubmitted(true);
      
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      console.error("Reservation error:", error);
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{reservationType.title}</h1>
            <p className="text-muted-foreground">{reservationType.description}</p>
          </div>

          {!isSubmitted ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5 text-[#052c4b]" />
                  {reservationType.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        الاسم الثلاثي *
                      </Label>
                      <Input
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="أدخل الاسم الكامل"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentPhone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        رقم الموبايل *
                      </Label>
                      <Input
                        id="studentPhone"
                        name="studentPhone"
                        type="tel"
                        value={formData.studentPhone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="governorate" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      المحافظة *
                    </Label>
                    <Input
                      id="governorate"
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleInputChange}
                      placeholder="أدخل المحافظة"
                      required
                    />
                  </div>

                  {(type === "online-course" || type === "membership" || type === "renewal") && (
                    <>
                      {type === "online-course" && (
                        <div className="space-y-2">
                          <Label htmlFor="courseId">الكورس المطلوب *</Label>
                          <Select
                            value={formData.courseId}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
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
                      )}

                      {type === "membership" && (
                        <div className="space-y-2">
                          <Label htmlFor="previousExperience">الخبرات السابقة</Label>
                          <Textarea
                            id="previousExperience"
                            name="previousExperience"
                            value={formData.previousExperience}
                            onChange={handleInputChange}
                            placeholder="أدخل الخبرات السابقة"
                            rows={4}
                          />
                        </div>
                      )}

                      {type === "renewal" && (
                        <div className="space-y-2">
                          <Label htmlFor="serialNumber">سريل نمبر الكارنيه أو الشهادة *</Label>
                          <Input
                            id="serialNumber"
                            name="serialNumber"
                            value={formData.serialNumber}
                            onChange={handleInputChange}
                            placeholder="أدخل السريل نمبر"
                            required
                          />
                        </div>
                      )}
                    </>
                  )}

                  {type !== "online-course" && type !== "membership" && type !== "renewal" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            التاريخ المفضل *
                          </Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            الوقت المفضل *
                          </Label>
                          <Input
                            id="preferredTime"
                            name="preferredTime"
                            type="time"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          البريد الإلكتروني (اختياري)
                        </Label>
                        <Input
                          id="studentEmail"
                          name="studentEmail"
                          type="email"
                          value={formData.studentEmail}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                        />
                      </div>
                    </>
                  )}

                  {type === "renewal" && (
                    <div className="space-y-2">
                      <Label htmlFor="message">طلب التجديد *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="أدخل تفاصيل طلب التجديد"
                        rows={4}
                        required
                      />
                    </div>
                  )}

                  {type !== "renewal" && (
                    <div className="space-y-2">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        رسالة إضافية (اختياري)
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="أضف أي معلومات إضافية..."
                        rows={4}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#052c4b] hover:bg-[#052c4b]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-800 mb-2">تم إرسال طلبك بنجاح!</h2>
                  <p className="text-green-700 mb-4">
                    شكراً لك، سيتم التواصل معك قريباً
                  </p>
                  <Button asChild className="bg-[#052c4b] hover:bg-[#052c4b]/90">
                    <Link href="/">
                      العودة للصفحة الرئيسية <ArrowRight className="mr-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

