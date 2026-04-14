"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FALLBACK_BANNER = "/dashboard-banner.png";

export const DashboardBanner = () => {
  const [src, setSrc] = useState<string>(FALLBACK_BANNER);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/homepage-settings", { cache: "no-store" });
        const json = (await res.json()) as { data?: { dashboardBannerUrl?: string } };
        const nextSrc = json?.data?.dashboardBannerUrl;
        if (!cancelled && typeof nextSrc === "string" && nextSrc.trim() !== "") {
          setSrc(nextSrc);
        }
      } catch {
        // Keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full relative">
      <Image
        src={src}
        alt="Dashboard Banner"
        width={1920}
        height={400}
        className="w-full h-auto object-cover"
        priority
        unoptimized={src.startsWith("http")}
      />
    </div>
  );
};

