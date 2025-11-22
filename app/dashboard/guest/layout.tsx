import { DashboardBanner } from "../_components/dashboard-banner";
import { BottomNav } from "../_components/bottom-nav";

const GuestDashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="pb-16 flex-1">
                <DashboardBanner />
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default GuestDashboardLayout;

