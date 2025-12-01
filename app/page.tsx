import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardUrlByRole } from "@/lib/utils";
import { HomePageClient } from "./_components/home-page-client";

export default async function HomePage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  // Redirect authenticated users (except guests) to dashboard
  if (session?.user && session.user.role !== "GUEST") {
    const dashboardUrl = getDashboardUrlByRole(session.user.role);
    redirect(dashboardUrl);
  }

  // Fetch published courses from database
  let courses = [];
  
  try {
    courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        price: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12, // Limit to 12 courses for homepage
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    // If there's an error, courses will remain an empty array
  }

  return <HomePageClient courses={courses} />;
}
