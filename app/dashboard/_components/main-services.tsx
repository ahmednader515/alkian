"use client";

import Link from "next/link";
import { BookOpen, Wallet, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        icon: BookOpen,
        label: "الكورسات",
        href: "/dashboard/search",
    },
    {
        icon: Wallet,
        label: "الرصيد",
        href: "/dashboard/balance",
    },
    {
        icon: GraduationCap,
        label: "الشهادات",
        href: "/dashboard/certificates",
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
                                "flex flex-col items-center justify-center p-6 rounded-xl bg-white text-black transition-all duration-200 hover:scale-105 shadow-md border-2 border-gray-200 hover:border-gray-300 h-32",
                                isThirdButton && "col-span-2"
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

