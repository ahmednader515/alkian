"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Check } from "lucide-react";
import Link from "next/link";

const services = [
  "خدمة المحاضرات المجانيه",
  "خدمة استشارة  في الكورسات  مجانيه",
  "خدمة حضور مؤتمر مجاني",
  "خدمات عامه اخري",
];

export default function GeneralServicesPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الخدمات العامة</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-red-600" />
                <p className="text-lg">{service}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

