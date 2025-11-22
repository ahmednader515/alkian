"use client";
import { usePathname } from "next/navigation";
import { DashboardBanner } from "./_components/dashboard-banner";
import { BottomNav } from "./_components/bottom-nav";

const DashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const pathname = usePathname();
    const isGuestPage = pathname?.startsWith("/dashboard/guest");
    
    return ( 
        <div className="min-h-screen flex flex-col dashboard-layout">
            <main className="pb-16 flex-1">
                {!isGuestPage && <DashboardBanner />}
                {children}
            </main>
            <BottomNav />
        </div>
     );
}
 
export default DashboardLayout;