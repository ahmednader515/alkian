"use client";

import Link from "next/link";
import {
    Layout,
    Users,
    List,
    FileText,
    Shield,
    Eye,
    Wallet,
    TrendingUp,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        icon: Layout,
        label: "لوحة التحكم",
        href: "/dashboard/admin",
        color: "bg-red-500 hover:bg-red-600"
    },
    {
        icon: Users,
        label: "إدارة المستخدمين",
        href: "/dashboard/admin/users",
        color: "bg-blue-500 hover:bg-blue-600"
    },
    {
        icon: List,
        label: "إدارة الكورسات",
        href: "/dashboard/admin/courses",
        color: "bg-green-500 hover:bg-green-600"
    },
    {
        icon: FileText,
        label: "الاختبارات",
        href: "/dashboard/admin/quizzes",
        color: "bg-purple-500 hover:bg-purple-600"
    },
    {
        icon: Shield,
        label: "إنشاء حساب طالب",
        href: "/dashboard/admin/create-account",
        color: "bg-orange-500 hover:bg-orange-600"
    },
    {
        icon: Eye,
        label: "كلمات المرور",
        href: "/dashboard/admin/passwords",
        color: "bg-pink-500 hover:bg-pink-600"
    },
    {
        icon: Wallet,
        label: "إدارة الأرصدة",
        href: "/dashboard/admin/balances",
        color: "bg-cyan-500 hover:bg-cyan-600"
    },
    {
        icon: TrendingUp,
        label: "تقدم الطلاب",
        href: "/dashboard/admin/progress",
        color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
        icon: BookOpen,
        label: "إضافة / حذف كورسات",
        href: "/dashboard/admin/add-courses",
        color: "bg-indigo-500 hover:bg-indigo-600"
    },
];

export const AdminMainServices = () => {
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



