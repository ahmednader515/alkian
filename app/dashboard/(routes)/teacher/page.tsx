import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TeacherMainServices } from "../../_components/teacher-main-services";

const TeacherDashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/");
  }

  // Redirect non-teachers
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    const dashboardUrl = session.user.role === "USER" ? "/dashboard" : "/";
    return redirect(dashboardUrl);
  }

  return (
    <div>
      <TeacherMainServices />
    </div>
  );
}

export default TeacherDashboardPage;



