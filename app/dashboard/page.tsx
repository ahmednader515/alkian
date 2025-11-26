import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDashboardUrlByRole } from "@/lib/utils";
import { DashboardServices } from "./_components/dashboard-services";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/");
  }

  // Only allow USER role to see this dashboard page
  // Other roles should be redirected to their specific dashboards
  const userRole = session.user.role || "USER";
  if (userRole !== "USER") {
    const dashboardUrl = getDashboardUrlByRole(userRole);
    return redirect(dashboardUrl);
  }

  return <DashboardServices />;
}

export default DashboardPage;
