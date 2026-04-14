"use client";

import { ServiceCard } from "./service-card";
import { DashboardSearch } from "./dashboard-search";
import { DashboardFooter } from "./dashboard-footer";
import { useEffect, useState } from "react";
import type { DashboardBigButton, HomePageContent } from "@/lib/home-page-settings";
import { DEFAULT_HOME_PAGE_CONTENT } from "@/lib/home-page-settings";
import { 
  Briefcase, 
  Award, 
  GraduationCap, 
  Calendar, 
  Globe, 
  FileCheck, 
  UserCircle, 
  BookOpen, 
  UserPlus, 
  Newspaper, 
  FileText, 
  Users, 
  RefreshCw, 
  Target,
  AlertCircle,
  MapPin
} from "lucide-react";

const FALLBACK = DEFAULT_HOME_PAGE_CONTENT.dashboardBigButtons.user;

const DEFAULT_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
  "1": Briefcase,
  "2": Award,
  "3": GraduationCap,
  "4": Calendar,
  "5": Globe,
  "6": FileCheck,
  "7": UserCircle,
  "8": BookOpen,
  "9": UserPlus,
  "10": Newspaper,
  "11": FileText,
  "12": Users,
  "13": RefreshCw,
  "14": Target,
  "15": AlertCircle,
  "16": BookOpen,
  "17": MapPin,
};

export const DashboardServices = () => {
  const [items, setItems] = useState<DashboardBigButton[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/homepage-settings", { cache: "no-store" });
        const json = (await res.json()) as { data?: HomePageContent };
        const next = json?.data?.dashboardBigButtons?.user;
        if (!cancelled && Array.isArray(next) && next.length) setItems(next);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <DashboardSearch />
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-6">
          الخدمات الرئيسية
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((service) => {
            const DefaultIcon = DEFAULT_ICONS[service.id] ?? Briefcase;
            return (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.label}
                icon={DefaultIcon}
                href={service.href}
                iconUrl={service.iconUrl || undefined}
              />
            );
          })}
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

