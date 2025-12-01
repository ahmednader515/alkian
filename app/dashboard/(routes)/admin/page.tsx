import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminMainServices } from "../../_components/admin-main-services";

const AdminDashboardPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return redirect("/");
    }

    if (session.user.role !== "ADMIN") {
        if (session.user.role === "TEACHER") {
            return redirect("/dashboard/teacher");
        }
        return redirect("/dashboard");
    }

    return (
        <div>
            <AdminMainServices />
        </div>
    );
};

export default AdminDashboardPage;