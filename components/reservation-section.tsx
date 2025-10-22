"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";
import axios from "axios";

export const ReservationSection = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentPhone || !formData.preferredDate || !formData.preferredTime) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/reservations", formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        toast.success(response.data.message);
        setFormData({
          studentName: "",
          studentPhone: "",
          studentEmail: "",
          preferredDate: "",
          preferredTime: "",
          message: "",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء إرسال طلب الحجز");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#052c4b]/5 to-[#1e3a8a]/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-8 w-8 text-[#052c4b]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            احجز موعدك
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            احجز موعدك معنا وابدأ رحلتك التعليمية مع أفضل المدرسين
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5 text-[#052c4b]" />
                  طلب حجز موعد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentPhone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="studentPhone"
                        name="studentPhone"
                        type="tel"
                        value={formData.studentPhone}
                        onChange={handleInputChange}
                        placeholder="+20XXXXXXXXXX"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        التاريخ المناسب *
                      </Label>
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        الوقت المناسب *
                      </Label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">اختر الوقت</option>
                        <option value="09:00">9:00 صباحاً</option>
                        <option value="10:00">10:00 صباحاً</option>
                        <option value="11:00">11:00 صباحاً</option>
                        <option value="12:00">12:00 ظهراً</option>
                        <option value="13:00">1:00 ظهراً</option>
                        <option value="14:00">2:00 ظهراً</option>
                        <option value="15:00">3:00 عصراً</option>
                        <option value="16:00">4:00 عصراً</option>
                        <option value="17:00">5:00 مساءً</option>
                        <option value="18:00">6:00 مساءً</option>
                        <option value="19:00">7:00 مساءً</option>
                        <option value="20:00">8:00 مساءً</option>
                      </select>
                    </div>
                  </div>

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
                      placeholder="اكتب أي ملاحظات أو متطلبات خاصة..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#052c4b] hover:bg-[#052c4b]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  تم إرسال طلب الحجز بنجاح!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-green-800 dark:text-green-200 mb-4">
                    شكراً لك! تم إرسال طلب الحجز بنجاح. سنتواصل معك قريباً لتأكيد الموعد.
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    يمكنك إرسال طلب حجز آخر إذا كنت تريد ذلك.
                  </p>
                </div>

                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  إرسال طلب حجز جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
