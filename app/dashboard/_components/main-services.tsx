"use client";

import Link from "next/link";
import { BookOpen, Wallet, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        icon: BookOpen,
        label: "تسجيل دورة تدريبة",
        href: "/dashboard/search",
        color: "bg-green-500 hover:bg-green-600"
    },
    {
        icon: Wallet,
        label: "الرصيد",
        href: "/dashboard/balance",
        color: "bg-blue-500 hover:bg-blue-600"
    },
    {
        icon: GraduationCap,
        label: "الشهادات",
        href: "/dashboard/certificates",
        color: "bg-purple-500 hover:bg-purple-600"
    },
];

export const MainServices = () => {
    return (
        <div className="p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6 text-red-600">الخدمات الرئيسية</h2>
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                {services.map((service, index) => {
                    const Icon = service.icon;
                    const isThirdButton = index === 2;
                    return (
                        <Link
                            key={index}
                            href={service.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-lg text-white transition-all duration-200 hover:scale-105 shadow-lg",
                                service.color,
                                isThirdButton ? "col-span-2 aspect-[2/1]" : "aspect-square"
                            )}
                        >
                            <Icon className="h-8 w-8 mb-3" />
                            <span className="text-sm font-medium text-center leading-tight">{service.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

