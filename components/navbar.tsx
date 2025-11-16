"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { getDashboardUrlByRole } from "@/lib/utils";

export const Navbar = () => {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const dashboardHref =
    session?.user?.role ? getDashboardUrlByRole(session.user.role) : "/dashboard";

  return (
    <div className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative mt-6 z-40" data-logo-container>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
              <div className="bg-white pt-4 px-4 pb-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border border-gray-200 flex items-end justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="mt-2"
                  unoptimized
                />
              </div>
            </div>
          </Link>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Button className="bg-[#052b4a] hover:bg-[#052b4a]/90 text-white" asChild>
                  <Link href="/sign-up">انشاء الحساب</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="border-[#052b4a] text-[#052b4a] hover:bg-[#052b4a]/10"
                >
                  <Link href="/sign-in">تسجيل الدخول</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href={dashboardHref}>لوحة التحكم</Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 ease-in-out"
                >
                  <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2"/>
                  تسجيل الخروج
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 