"use client";

import { usePathname } from "next/navigation";
import { Facebook } from "lucide-react";
import { useEffect, useState } from "react";
import type { HomePageContent } from "@/lib/home-page-settings";
import { DEFAULT_HOME_PAGE_CONTENT, buildWhatsAppLink } from "@/lib/home-page-settings";

// Custom TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Footer = () => {
  const pathname = usePathname();
  const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);
  
  // Hide footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/homepage-settings", { cache: "no-store" });
        const json = (await res.json()) as { data?: HomePageContent };
        if (!cancelled && json?.data) setContent(json.data);
      } catch {
        // keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  
  // Check if we're on a page with a sidebar
  const hasSidebar = pathname?.startsWith('/courses');
  
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4">
        <div className={`text-center text-muted-foreground ${
          hasSidebar 
            ? 'md:rtl:pr-56 md:ltr:pl-56 lg:rtl:pr-80 lg:ltr:pl-80' 
            : ''
        }`}>
          <div className="inline-block bg-[#052c4b]/10 border-2 border-[#052c4b]/20 rounded-lg px-6 py-3 mb-4">
            <a
              href={buildWhatsAppLink(content.contactWhatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lg text-[#052c4b] inline-flex items-center gap-2"
            >
              <span>واتساب :</span>
              <span dir="ltr">{content.contactWhatsappNumber}</span>
            </a>
          </div>

          {content.contactFacebookUrl?.trim() ? (
            <div className="mb-4">
              <a
                href={content.contactFacebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
            </div>
          ) : null}
          
          <p>© {new Date().getFullYear()} Mordesu Studio. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}; 