"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap, Download, Gift, CheckCircle } from "lucide-react";
import axios from "axios";

export const CertificatePromoSection = () => {
  const [promoCode, setPromoCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      toast.error("يرجى إدخال رمز الشهادة");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/certificates/validate", {
        promoCode: promoCode.trim(),
        studentName: studentName.trim() || null,
        studentEmail: studentEmail.trim() || null,
      });

      if (response.data.success) {
        setCertificate(response.data.certificate);
        setIsValidated(true);
        toast.success("تم التحقق من رمز الشهادة بنجاح!");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("رمز الشهادة غير صحيح أو منتهي الصلاحية");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data || "حدث خطأ أثناء التحقق من رمز الشهادة");
      } else {
        toast.error("حدث خطأ أثناء التحقق من رمز الشهادة");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (certificate?.fileUrl) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = certificate.fileUrl;
      link.download = `${certificate.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("تم بدء تحميل الشهادة");
    }
  };

  const resetForm = () => {
    setPromoCode("");
    setStudentName("");
    setStudentEmail("");
    setCertificate(null);
    setIsValidated(false);
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
            <GraduationCap className="h-8 w-8 text-[#052c4b]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            احصل على شهادتك
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أدخل رمز الشهادة الخاص بك لتحميل شهادتك المعتمدة
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {!isValidated ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Gift className="h-5 w-5 text-[#052c4b]" />
                  إدخال رمز الشهادة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleValidatePromoCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="promoCode">رمز الشهادة *</Label>
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="أدخل رمز الشهادة هنا"
                      className="text-center font-mono text-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">الاسم (اختياري)</Label>
                      <Input
                        id="studentName"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentEmail">البريد الإلكتروني (اختياري)</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#052c4b] hover:bg-[#052c4b]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري التحقق..." : "تحقق من الرمز"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  تم التحقق بنجاح!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                    {certificate.title}
                  </h3>
                  {certificate.description && (
                    <p className="text-green-700 dark:text-green-300">
                      {certificate.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleDownloadCertificate}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تحميل الشهادة
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    رمز خصم جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
