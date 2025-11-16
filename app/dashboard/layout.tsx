"use client";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { usePathname } from "next/navigation";

const DashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const pathname = usePathname();
    const isGuestDashboard = pathname?.startsWith("/dashboard/guest");
    const showSidebar = !isGuestDashboard;
    return ( 
        <div className="min-h-screen flex flex-col dashboard-layout">
            <div className="h-[80px] fixed inset-x-0 top-0 w-full z-50">
                <Navbar />
            </div>
            {showSidebar && (
                <div className="hidden md:flex h-[calc(100vh-80px)] w-56 flex-col fixed inset-x-0 top-[80px] rtl:right-0 ltr:left-0 z-40">
                    <Sidebar />
                </div>
            )}
            <main className={`${showSidebar ? "md:rtl:pr-56 md:ltr:pl-56" : ""} pt-[80px] flex-1`}>
                {children}
            </main>
        </div>
     );
}
 
export default DashboardLayout;