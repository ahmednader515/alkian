"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";

const accreditations = [
  "إعتماد كلية التدريب الدول البريطاني بإنجلترا",
  "إعتماد اللجنه النقابية للعاملين بالمهن التجميليه",
  "إعتماد محلي وترخيص مزاوله التدريب",
];

export default function AccreditationsPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الاعتمادات</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {accreditations.map((accreditation, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-7 w-7 text-red-600" />
                <span className="text-base">{accreditation}</span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

