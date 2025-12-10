"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, MessageCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Service {
  id: string;
  title: string;
  type?: "course" | "service";
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">خدماتنا</h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white text-black transition-all duration-200 shadow-md border-2 border-gray-200 min-h-40"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 mb-2">
                  <Briefcase className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-center leading-tight px-2">{service.title}</span>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  لا توجد خدمات متاحة حالياً
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* WhatsApp Contact Banner */}
      <div className="mt-12 mb-6">
        <a
          href="https://wa.me/201146450551"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent"></div>
            <div className="relative px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    لتفاصيل الكورسات
                  </h3>
                  <p className="text-sm md:text-base text-white/90 font-medium">
                    كلمنا واتس 01146450551
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                  <span className="text-white font-semibold text-sm md:text-base">
                  تواصل معنا
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}