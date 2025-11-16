import { Navbar } from "../_components/navbar";

const GuestDashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-[80px] fixed inset-x-0 top-0 w-full z-50">
                <Navbar />
            </div>
            <main className="pt-[80px] flex-1">
                {children}
            </main>
        </div>
    );
};

export default GuestDashboardLayout;

