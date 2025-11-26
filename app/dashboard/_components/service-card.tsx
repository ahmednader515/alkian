"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
    id: string;
    title: string;
    icon: LucideIcon;
    href: string;
}

export const ServiceCard = ({
    id,
    title,
    icon: Icon,
    href,
}: ServiceCardProps) => {
    return (
        <Link href={href}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full flex flex-col">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex flex-col pt-2 flex-1 min-h-0 justify-center">
                    <div className="text-xs font-medium group-hover:text-sky-700 transition line-clamp-3 text-center leading-tight">
                        {title}
                    </div>
                </div>
            </div>
        </Link>
    );
};

