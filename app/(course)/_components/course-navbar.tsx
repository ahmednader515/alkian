"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

export const CourseNavbar = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard/my-courses");
  };

  return (
    <div className="p-4 h-full flex items-center justify-between bg-card text-foreground border-b shadow-sm">
      <div className="flex items-center">
        <CourseMobileSidebar />
      </div>
      <div className="flex items-center gap-x-4">
        <Button
          onClick={handleBackToDashboard}
          variant="ghost"
          size="sm"
          className="flex items-center gap-x-2 hover:bg-slate-100 rtl:mr-2 ltr:ml-2"
        >
          <span className="rtl:text-right ltr:text-left">الرجوع إلى الكورسات</span>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}; 