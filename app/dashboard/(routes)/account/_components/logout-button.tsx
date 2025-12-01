"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";

export const LogoutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <LoadingButton 
      size="lg" 
      variant="destructive" 
      onClick={handleLogout}
      loading={isLoggingOut}
      loadingText="جاري تسجيل الخروج..."
      className="w-full"
    >
      <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2"/>
      تسجيل الخروج
    </LoadingButton>
  );
};

