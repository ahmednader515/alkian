"use client";

import Link from "next/link";
import {
    List,
    FileText,
    Award,
    BarChart,
    Users,
    Wallet,
    BookOpen,
    Key,
    GraduationCap,
    Calendar,
    Shield,
    FileCheck,
    UserCircle,
    Newspaper,
    Target,
    UserPlus,
    RefreshCw,
    AlertCircle,
    Briefcase,
    MapPin,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        icon: List,
        label: "الكورسات",
        href: "/dashboard/teacher/courses",
    },
    {
        icon: FileText,
        label: "الاختبارات",
        href: "/dashboard/teacher/quizzes",
    },
    {
        icon: Award,
        label: "الدرجات",
        href: "/dashboard/teacher/grades",
    },
    {
        icon: BarChart,
        label: "الاحصائيات",
        href: "/dashboard/teacher/analytics",
    },
    {
        icon: Users,
        label: "إدارة الطلاب",
        href: "/dashboard/teacher/users",
    },
    {
        icon: Wallet,
        label: "إدارة الأرصدة",
        href: "/dashboard/teacher/balances",
    },
    {
        icon: BookOpen,
        label: "إضافة / حذف كورسات",
        href: "/dashboard/teacher/add-courses",
    },
    {
        icon: Key,
        label: "كلمات المرور",
        href: "/dashboard/teacher/passwords",
    },
    {
        icon: GraduationCap,
        label: "إدارة الشهادات",
        href: "/dashboard/teacher/certificates",
    },
    {
        icon: Calendar,
        label: "إدارة الحجوزات",
        href: "/dashboard/teacher/reservations",
    },
    {
        icon: FileCheck,
        label: "نموذج للشهادات",
        href: "/dashboard/teacher/content/certificate-templates",
    },
    {
        icon: UserCircle,
        label: "اعرفنا أكثر",
        href: "/dashboard/teacher/content/about-us",
    },
    {
        icon: Newspaper,
        label: "أخبار عامة",
        href: "/dashboard/teacher/content/general-news",
    },
    {
        icon: Users,
        label: "نبذة عن المحاضرين",
        href: "/dashboard/teacher/content/about-lecturers",
    },
    {
        icon: Target,
        label: "هدفنا وإنجازاتنا",
        href: "/dashboard/teacher/content/goals-achievements",
    },
    {
        icon: MapPin,
        label: "فروعنا",
        href: "/dashboard/teacher/content/our-branches",
    },
    {
        icon: Shield,
        label: "إنشاء حساب طالب",
        href: "/dashboard/teacher/create-account",
    },
    {
        icon: BookOpen,
        label: "طلبات التسجيل في الكورسات",
        href: "/dashboard/teacher/online-course-registrations",
    },
    {
        icon: UserPlus,
        label: "طلبات العضوية والوظيفة",
        href: "/dashboard/teacher/membership-job-requests",
    },
    {
        icon: RefreshCw,
        label: "طلبات التجديد",
        href: "/dashboard/teacher/renewal-requests",
    },
    {
        icon: AlertCircle,
        label: "الشكاوى",
        href: "/dashboard/teacher/complaints",
    },
    {
        icon: Briefcase,
        label: "إدارة الخدمات",
        href: "/dashboard/teacher/services",
    },
    {
        icon: GraduationCap,
        label: "بيانات الشهادات",
        href: "/dashboard/teacher/certificate-details",
    },
    {
        icon: Award,
        label: "الاعتمادات",
        href: "/dashboard/teacher/accreditations",
    },
    {
        icon: Globe,
        label: "الخدمات العامة",
        href: "/dashboard/teacher/general-services",
    },
];

export const TeacherMainServices = () => {
    return (
        <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-red-600">الخدمات الرئيسية</h2>
            <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
                {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <Link
                            key={index}
                            href={service.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-xl bg-white text-black transition-all duration-200 hover:scale-105 shadow-md border-2 border-gray-200 hover:border-gray-300 h-32"
                            )}
                        >
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-3">
                                <Icon className="h-8 w-8 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-center leading-tight">{service.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};



