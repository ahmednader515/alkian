"use client";

import Link from "next/link";
import {
    Layout,
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
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        icon: Layout,
        label: "لوحة التحكم",
        href: "/dashboard/teacher",
        color: "bg-red-500 hover:bg-red-600"
    },
    {
        icon: List,
        label: "الكورسات",
        href: "/dashboard/teacher/courses",
        color: "bg-green-500 hover:bg-green-600"
    },
    {
        icon: FileText,
        label: "الاختبارات",
        href: "/dashboard/teacher/quizzes",
        color: "bg-blue-500 hover:bg-blue-600"
    },
    {
        icon: Award,
        label: "الدرجات",
        href: "/dashboard/teacher/grades",
        color: "bg-purple-500 hover:bg-purple-600"
    },
    {
        icon: BarChart,
        label: "الاحصائيات",
        href: "/dashboard/teacher/analytics",
        color: "bg-orange-500 hover:bg-orange-600"
    },
    {
        icon: Users,
        label: "إدارة الطلاب",
        href: "/dashboard/teacher/users",
        color: "bg-teal-500 hover:bg-teal-600"
    },
    {
        icon: Wallet,
        label: "إدارة الأرصدة",
        href: "/dashboard/teacher/balances",
        color: "bg-cyan-500 hover:bg-cyan-600"
    },
    {
        icon: BookOpen,
        label: "إضافة / حذف كورسات",
        href: "/dashboard/teacher/add-courses",
        color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
        icon: Key,
        label: "كلمات المرور",
        href: "/dashboard/teacher/passwords",
        color: "bg-pink-500 hover:bg-pink-600"
    },
    {
        icon: GraduationCap,
        label: "إدارة الشهادات",
        href: "/dashboard/teacher/certificates",
        color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
        icon: Calendar,
        label: "إدارة الحجوزات",
        href: "/dashboard/teacher/reservations",
        color: "bg-lime-500 hover:bg-lime-600"
    },
    {
        icon: Shield,
        label: "إنشاء حساب طالب",
        href: "/dashboard/teacher/create-account",
        color: "bg-slate-500 hover:bg-slate-600"
    },
];

export const TeacherMainServices = () => {
    return (
        <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-red-600">الخدمات الرئيسية</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <Link
                            key={index}
                            href={service.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-lg text-white transition-all duration-200 hover:scale-105 shadow-lg aspect-square",
                                service.color
                            )}
                        >
                            <Icon className="h-8 w-8 mb-3" />
                            <span className="text-sm font-medium text-center leading-tight px-1">{service.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};



