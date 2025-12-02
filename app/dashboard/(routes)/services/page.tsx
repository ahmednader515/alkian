"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
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
    </div>
  );
}