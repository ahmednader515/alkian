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
    },
    {
        icon: Users,
        label: "إدارة المستخدمين",
        href: "/dashboard/admin/users",
    },
    {
        icon: List,
        label: "إدارة الكورسات",
        href: "/dashboard/admin/courses",
    },
    {
        icon: FileText,
        label: "الاختبارات",
        href: "/dashboard/admin/quizzes",
    },
    {
        icon: Shield,
        label: "إنشاء حساب طالب",
        href: "/dashboard/admin/create-account",
    },
    {
        icon: Eye,
        label: "كلمات المرور",
        href: "/dashboard/admin/passwords",
    },
    {
        icon: Wallet,
        label: "إدارة الأرصدة",
        href: "/dashboard/admin/balances",
    },
    {
        icon: TrendingUp,
        label: "تقدم الطلاب",
        href: "/dashboard/admin/progress",
    },
    {
        icon: BookOpen,
        label: "إضافة / حذف كورسات",
        href: "/dashboard/admin/add-courses",
    },
];

export const AdminMainServices = () => {
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



