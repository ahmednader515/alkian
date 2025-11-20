"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Layout,
    Compass,
    Wallet,
    GraduationCap,
    List,
    FileText,
    Award,
    Users,
    Wallet as WalletIcon,
    BarChart,
    BookOpen,
    Key,
    Calendar,
    Shield,
    TrendingUp,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const userBottomNavItems = [
    {
        id: "dashboard",
        icon: Layout,
        label: "لوحة التحكم",
        href: "/dashboard",
    },
    {
        id: "courses",
        icon: Compass,
        label: "الكورسات",
        href: "/dashboard/search",
    },
    {
        id: "balance",
        icon: Wallet,
        label: "الرصيد",
        href: "/dashboard/balance",
    },
    {
        id: "certificates",
        icon: GraduationCap,
        label: "الشهادات",
        href: "/dashboard/certificates",
    },
];

const teacherBottomNavItems = [
    { id: "dashboard", icon: Layout, label: "لوحة التحكم", href: "/dashboard/teacher" },
    { id: "courses", icon: List, label: "الكورسات", href: "/dashboard/teacher/courses" },
    { id: "quizzes", icon: FileText, label: "الاختبارات", href: "/dashboard/teacher/quizzes" },
    { id: "grades", icon: Award, label: "الدرجات", href: "/dashboard/teacher/grades" },
    { id: "analytics", icon: BarChart, label: "الاحصائيات", href: "/dashboard/teacher/analytics" },
    { id: "users", icon: Users, label: "إدارة الطلاب", href: "/dashboard/teacher/users" },
    { id: "balances", icon: WalletIcon, label: "الأرصدة", href: "/dashboard/teacher/balances" },
    { id: "add-courses", icon: BookOpen, label: "إضافة/حذف كورسات", href: "/dashboard/teacher/add-courses" },
    { id: "passwords", icon: Key, label: "كلمات المرور", href: "/dashboard/teacher/passwords" },
    { id: "certificates", icon: GraduationCap, label: "الشهادات", href: "/dashboard/teacher/certificates" },
    { id: "reservations", icon: Calendar, label: "الحجوزات", href: "/dashboard/teacher/reservations" },
    { id: "create-account", icon: Shield, label: "إنشاء حساب", href: "/dashboard/teacher/create-account" },
];

const adminBottomNavItems = [
    { id: "dashboard", icon: Layout, label: "لوحة التحكم", href: "/dashboard/admin" },
    { id: "users", icon: Users, label: "المستخدمين", href: "/dashboard/admin/users" },
    { id: "courses", icon: List, label: "الكورسات", href: "/dashboard/admin/courses" },
    { id: "quizzes", icon: FileText, label: "الاختبارات", href: "/dashboard/admin/quizzes" },
    { id: "create-account", icon: Shield, label: "إنشاء حساب", href: "/dashboard/admin/create-account" },
    { id: "passwords", icon: Eye, label: "كلمات المرور", href: "/dashboard/admin/passwords" },
    { id: "balances", icon: WalletIcon, label: "الأرصدة", href: "/dashboard/admin/balances" },
    { id: "progress", icon: TrendingUp, label: "تقدم الطلاب", href: "/dashboard/admin/progress" },
    { id: "add-courses", icon: BookOpen, label: "إضافة/حذف كورسات", href: "/dashboard/admin/add-courses" },
];

export const BottomNav = () => {
    const pathname = usePathname();
    
    const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
    const isAdminPage = pathname?.startsWith("/dashboard/admin");

    const bottomNavItems = isAdminPage
        ? adminBottomNavItems
        : isTeacherPage
            ? teacherBottomNavItems
            : userBottomNavItems;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
            <div className="flex items-center h-16 px-2 max-w-screen-xl mx-auto overflow-x-auto gap-2">
                {bottomNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center h-full transition-colors min-w-[90px]",
                                isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <div className="relative mb-1">
                                <Icon className={cn("h-5 w-5", isActive && "text-red-600")} />
                            </div>
                            <span className={cn("text-xs font-medium text-center leading-tight", isActive && "text-red-600")}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

