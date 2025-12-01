"use client";

import { useEffect, useState } from "react";

export const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get logo position
  const logoContainer = typeof window !== 'undefined' ? document.querySelector('[data-logo-container]') : null;
  const logoRect = logoContainer?.getBoundingClientRect();
  const containerWidth = typeof window !== 'undefined' ? document.documentElement.clientWidth : 0;
  
  const logoLeft = logoRect ? (logoRect.left / containerWidth) * 100 : 85;
  const logoRight = logoRect ? ((containerWidth - logoRect.right) / containerWidth) * 100 : 10;
  
  const progressWidth = scrollProgress * 100;
  const leftProgress = Math.min(progressWidth, logoLeft);
  const rightProgress = Math.max(0, progressWidth - logoLeft);

  return (
    <div className="fixed top-20 left-0 w-full h-1 z-30">
      {/* Left progress bar */}
      <div
        className="absolute top-0 left-0 h-full bg-[#052b4a]"
        style={{
          width: `${leftProgress}%`,
        }}
      />
      
      {/* Right progress bar */}
      <div
        className="absolute top-0 h-full bg-[#052b4a]"
        style={{
          left: `${100 - logoRight}%`,
          width: `${rightProgress}%`,
        }}
      />
    </div>
  );
}; 