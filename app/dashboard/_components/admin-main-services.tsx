"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { DashboardBigButton, HomePageContent } from "@/lib/home-page-settings";
import { DEFAULT_HOME_PAGE_CONTENT } from "@/lib/home-page-settings";
import {
    Layout,
    Users,
    List,
    FileText,
    Shield,
    Eye,
    Wallet,
    TrendingUp,
    BookOpen,
} from "lucide-react";

const FALLBACK = DEFAULT_HOME_PAGE_CONTENT.dashboardBigButtons.admin;

const DEFAULT_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
    dashboard: Layout,
    users: Users,
    courses: List,
    quizzes: FileText,
    "create-account": Shield,
    passwords: Eye,
    balances: Wallet,
    progress: TrendingUp,
    "add-courses": BookOpen,
};

export const AdminMainServices = () => {
    const [items, setItems] = useState<DashboardBigButton[]>(FALLBACK);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/public/homepage-settings", { cache: "no-store" });
                const json = (await res.json()) as { data?: HomePageContent };
                const next = json?.data?.dashboardBigButtons?.admin;
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
        <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-red-600">الخدمات الرئيسية</h2>
            <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
                {items.map((service, index) => {
                    return (
                        <Link
                            key={index}
                            href={service.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-xl bg-white text-black transition-all duration-200 hover:scale-105 shadow-md border-2 border-gray-200 hover:border-gray-300 h-32"
                            )}
                        >
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-3">
                                {service.iconUrl ? (
                                    <div className="relative w-10 h-10">
                                        <Image
                                            src={service.iconUrl}
                                            alt={service.label}
                                            fill
                                            className="object-contain"
                                            unoptimized={service.iconUrl.startsWith("http")}
                                        />
                                    </div>
                                ) : (
                                    (() => {
                                        const Icon = DEFAULT_ICONS[service.id] ?? Layout;
                                        return <Icon className="h-8 w-8 text-red-600" />;
                                    })()
                                )}
                            </div>
                            <span className="text-sm font-medium text-center leading-tight">{service.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};



