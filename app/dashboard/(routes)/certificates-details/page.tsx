"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Check } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import type { HomePageContent } from "@/lib/home-page-settings";
import { DEFAULT_HOME_PAGE_CONTENT, buildWhatsAppLink } from "@/lib/home-page-settings";

interface CertificateDetail {
  id: string;
  title: string;
}

export default function CertificatesDetailsPage() {
  const [certificates, setCertificates] = useState<CertificateDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contact, setContact] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/homepage-settings", { cache: "no-store" });
        const json = (await res.json()) as { data?: HomePageContent };
        if (!cancelled && json?.data) setContact(json.data);
      } catch {
        // keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/certificate-details");
      setCertificates(response.data.certificateDetails || []);
    } catch (error) {
      console.error("Error fetching certificate details:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
        </div>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              لا توجد بيانات شهادات متاحة حالياً
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="text-lg">{certificate.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
            <a href={buildWhatsAppLink(contact.contactWhatsappNumber)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 ml-2" />
              {contact.contactWhatsappNumber}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

