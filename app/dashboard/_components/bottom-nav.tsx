"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Layout,
    Home,
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
    Eye,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";

const userBottomNavItems = [
    {
        id: "courses",
        icon: Home,
        label: "الرئيسية",
        href: "/dashboard",
    },
    {
        id: "balance",
        icon: Wallet,
        label: "الرصيد",
        href: "/dashboard/balance",
    },
    {
        id: "dashboard",
        icon: Compass,
        label: "لوحة التحكم",
        href: "/dashboard/search",
    },
    {
        id: "certificates",
        icon: GraduationCap,
        label: "الشهادات",
        href: "/dashboard/certificates",
    },
    {
        id: "account",
        icon: User,
        label: "حسابي",
        href: "/dashboard/account",
    },
];

const teacherBottomNavItems = [
    {
        id: "courses",
        icon: List,
        label: "الكورسات",
        href: "/dashboard/teacher/courses",
    },
    {
        id: "analytics",
        icon: BarChart,
        label: "الاحصائيات",
        href: "/dashboard/teacher/analytics",
    },
    {
        id: "dashboard",
        icon: Home,
        label: "لوحة التحكم",
        href: "/dashboard/teacher",
    },
    {
        id: "certificates",
        icon: GraduationCap,
        label: "الشهادات",
        href: "/dashboard/teacher/certificates",
    },
    {
        id: "account",
        icon: User,
        label: "حسابي",
        href: "/dashboard/teacher/account",
    },
];

const adminBottomNavItems = [
    {
        id: "users",
        icon: Users,
        label: "المستخدمين",
        href: "/dashboard/admin/users",
    },
    {
        id: "courses",
        icon: List,
        label: "الكورسات",
        href: "/dashboard/admin/courses",
    },
    {
        id: "dashboard",
        icon: Home,
        label: "لوحة التحكم",
        href: "/dashboard/admin",
    },
    {
        id: "progress",
        icon: TrendingUp,
        label: "تقدم الطلاب",
        href: "/dashboard/admin/progress",
    },
    {
        id: "account",
        icon: User,
        label: "حسابي",
        href: "/dashboard/admin/account",
    },
];

const guestBottomNavItems = [
    {
        id: "home",
        icon: Home,
        label: "الرئيسية",
        href: "/dashboard/guest",
    },
    {
        id: "account",
        icon: User,
        label: "حسابي",
        href: "/dashboard/guest/account",
    },
];

export const BottomNav = () => {
    const pathname = usePathname();
    
    const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
    const isAdminPage = pathname?.startsWith("/dashboard/admin");
    const isGuestPage = pathname?.startsWith("/dashboard/guest");

    const bottomNavItems = isAdminPage
        ? adminBottomNavItems
        : isTeacherPage
            ? teacherBottomNavItems
            : isGuestPage
                ? guestBottomNavItems
                : userBottomNavItems;

    // For guest pages with only 2 items, show them evenly without floating button
    const isGuestNav = isGuestPage && bottomNavItems.length <= 2;

    // Find the dashboard button index to use as the middle floating button
    const dashboardIndex = bottomNavItems.findIndex(item => item.id === "dashboard" || item.id === "home");
    const middleIndex = dashboardIndex >= 0 ? dashboardIndex : Math.floor(bottomNavItems.length / 2);

    // Split items into left and right groups (excluding middle)
    const leftItems = bottomNavItems.slice(0, middleIndex);
    const middleItem = bottomNavItems[middleIndex];
    const rightItems = bottomNavItems.slice(middleIndex + 1);

    // Helper function to check if a button is active
    const isButtonActive = (item: typeof bottomNavItems[0]) => {
        // For dashboard/home button, only match exact path
        if (item.href === "/dashboard" || item.href === "/dashboard/teacher" || item.href === "/dashboard/admin" || item.href === "/dashboard/guest") {
            return pathname === item.href;
        }
        // For other buttons, match exact or sub-paths
        return pathname === item.href || pathname?.startsWith(item.href + "/");
    };

    // Guest nav: simple layout with 2 buttons
    if (isGuestNav) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2 max-w-screen-xl mx-auto">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isButtonActive(item);
                        
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center transition-colors flex-1 h-full min-w-0",
                                    isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <div className="relative mb-1 flex items-center justify-center">
                                    <Icon className={cn(
                                        "h-5 w-5",
                                        isActive && "text-red-600",
                                        !isActive && "text-gray-600"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-xs font-medium text-center leading-tight",
                                    isActive ? "text-red-600" : "text-gray-600"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2 max-w-screen-xl mx-auto relative">
                {/* Left side buttons */}
                <div className="flex items-center justify-around flex-1">
                    {leftItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isButtonActive(item);
                        
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center transition-colors flex-1 h-full min-w-0",
                                    isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <div className="relative mb-1 flex items-center justify-center">
                                    <Icon className={cn(
                                        "h-5 w-5",
                                        isActive && "text-red-600",
                                        !isActive && "text-gray-600"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-xs font-medium text-center leading-tight",
                                    isActive ? "text-red-600" : "text-gray-600"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Spacer for middle button */}
                <div className="w-16 flex-shrink-0"></div>

                {/* Floating middle button with red background */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                    {(() => {
                        const Icon = middleItem.icon;
                        const isActive = isButtonActive(middleItem);
                        
                        return (
                            <Link
                                href={middleItem.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-14 h-14 rounded-xl shadow-lg transition-all duration-200 hover:scale-110",
                                    "bg-red-600 text-white hover:bg-red-700"
                                )}
                            >
                                <Icon className="h-6 w-6 text-white" />
                            </Link>
                        );
                    })()}
                </div>

                {/* Right side buttons */}
                <div className="flex items-center justify-around flex-1">
                    {rightItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isButtonActive(item);
                        
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center transition-colors flex-1 h-full min-w-0",
                                    isActive ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <div className="relative mb-1 flex items-center justify-center">
                                    <Icon className={cn(
                                        "h-5 w-5",
                                        isActive && "text-red-600",
                                        !isActive && "text-gray-600"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-xs font-medium text-center leading-tight",
                                    isActive ? "text-red-600" : "text-gray-600"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

