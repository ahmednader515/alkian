"use client";
import { Navbar } from "./_components/navbar";
import { DashboardBanner } from "./_components/dashboard-banner";
import { BottomNav } from "./_components/bottom-nav";

const DashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className="min-h-screen flex flex-col dashboard-layout">
            <div className="h-[80px] fixed inset-x-0 top-0 w-full z-50">
                <Navbar />
            </div>
            <main className="pt-[80px] pb-16 flex-1">
                <DashboardBanner />
                {children}
            </main>
            <BottomNav />
        </div>
     );
}
 
export default DashboardLayout;