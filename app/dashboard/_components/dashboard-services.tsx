"use client";

import { ServiceCard } from "./service-card";
import { DashboardSearch } from "./dashboard-search";
import { DashboardFooter } from "./dashboard-footer";
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

const services = [
  {
    id: "1",
    title: "خدماتنا",
    icon: Briefcase,
    href: "/dashboard/services",
  },
  {
    id: "2",
    title: "الاعتمادات",
    icon: Award,
    href: "/dashboard/accreditations",
  },
  {
    id: "3",
    title: "الشهادات",
    icon: GraduationCap,
    href: "/dashboard/certificates-details",
  },
  {
    id: "4",
    title: "الجلسات",
    icon: Calendar,
    href: "/dashboard/sessions",
  },
  {
    id: "5",
    title: "الخدمات العامة",
    icon: Globe,
    href: "/dashboard/general-services",
  },
  {
    id: "6",
    title: "نموذج للشهادات",
    icon: FileCheck,
    href: "/dashboard/content/certificate-templates",
  },
  {
    id: "7",
    title: "اعرفنا اكثر",
    icon: UserCircle,
    href: "/dashboard/content/about-us",
  },
  {
    id: "8",
    title: "تسجيل في كورس اونلاين",
    icon: BookOpen,
    href: "/dashboard/register-course",
  },
  {
    id: "9",
    title: "طلب عضوية و وظيفة",
    icon: UserPlus,
    href: "/dashboard/membership-job-request",
  },
  {
    id: "10",
    title: "اخبار عامة",
    icon: Newspaper,
    href: "/dashboard/content/general-news",
  },
  {
    id: "11",
    title: "الاختبارات",
    icon: FileText,
    href: "/dashboard/content/tests",
  },
  {
    id: "12",
    title: "نبذه عن المحاضرين",
    icon: Users,
    href: "/dashboard/content/about-lecturers",
  },
  {
    id: "13",
    title: "طلب تجديد",
    icon: RefreshCw,
    href: "/dashboard/renewal-request",
  },
  {
    id: "14",
    title: "هدفنا وانجازتنا",
    icon: Target,
    href: "/dashboard/content/goals-achievements",
  },
  {
    id: "15",
    title: "تقديم شكوى",
    icon: AlertCircle,
    href: "/dashboard/complaint",
  },
  {
    id: "16",
    title: "الكورسات المسجلة",
    icon: BookOpen,
    href: "/dashboard/my-courses",
  },
  {
    id: "17",
    title: "فروعنا",
    icon: MapPin,
    href: "/dashboard/content/our-branches",
  },
];

export const DashboardServices = () => {
  return (
    <div className="p-6 space-y-6">
      <DashboardSearch />
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-6">
          الخدمات الرئيسية
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              icon={service.icon}
              href={service.href}
            />
          ))}
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

