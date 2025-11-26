"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, MessageCircle, Check } from "lucide-react";
import Link from "next/link";

const certificates = [
  "شهاده الاعتماد الدولي",
  "شهادة  خبره من الأكاديمية",
  "شهاده تخرج بسريل نمبر",
  "كارنيه تخصص",
  "يوجد كارنيه النقابه",
  "يوجد شهادة قيد من النقابه",
  "يوجد شهادة الجامعه الامريكيه",
  "يوجد ماجستير مهني",
  "دكتوراه مهنيه",
  "دكتوراه بحثيه",
  "توثيق الخارجيه والقنصليه",
  "شهدات مفتوحه الخبره",
];

export default function CertificatesDetailsPage() {
  const whatsappNumber = "01146450551";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الشهادات</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {certificates.map((certificate, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <p className="text-lg">{certificate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <MessageCircle className="h-5 w-5" />
            لتفاصيل اكثر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">كلمنا واتس</p>
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 ml-2" />
              {whatsappNumber}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

