"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export const PageLoader = () => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const prevPathnameRef = useRef<string>(pathname);
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if pathname actually changed
        if (prevPathnameRef.current !== pathname) {
            // Show loading immediately when pathname changes
            setLoading(true);
            
            // Clear any existing timeout
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }

            // Hide loading after a short delay to allow page to render
            // This gives Next.js time to compile and render the new page
            loadingTimeoutRef.current = setTimeout(() => {
                setLoading(false);
            }, 300);

            // Update previous pathname
            prevPathnameRef.current = pathname;
        }

        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [pathname]);

    // Listen to link clicks to show loading immediately
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            
            if (link && link.href) {
                const url = new URL(link.href);
                const currentUrl = new URL(window.location.href);
                
                // Only show loading for internal navigation (same origin)
                if (
                    url.origin === currentUrl.origin &&
                    url.pathname !== currentUrl.pathname &&
                    !link.href.startsWith('#')
                ) {
                    setLoading(true);
                }
            }
        };

        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, []);

    if (!loading) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300"
        >
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                <p className="text-sm text-gray-600">جاري التحميل...</p>
            </div>
        </div>
    );
};

