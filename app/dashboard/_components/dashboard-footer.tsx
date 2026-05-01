"use client";

import { Facebook, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomePageContent } from "@/lib/home-page-settings";
import { DEFAULT_HOME_PAGE_CONTENT, buildWhatsAppLink } from "@/lib/home-page-settings";

export const DashboardFooter = () => {
  const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);

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

  return (
    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 pb-6">
        {/* Facebook Link */}
        {content.contactFacebookUrl?.trim() ? (
          <Link
            href={content.contactFacebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <Facebook className="h-5 w-5" />
            <span className="font-medium">صفحتنا على فيسبوك</span>
          </Link>
        ) : null}

        {/* Support Phone */}
        <a
          href={`tel:${(content.contactWhatsappNumber || "").replace(/[^0-9]/g, "")}`}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <Phone className="h-5 w-5" />
          <span className="font-medium">الرقم الخاص بنا : {content.contactWhatsappNumber}</span>
        </a>
      </div>
    </div>
  );
};

