import { db } from "@/lib/db";
import { HomePageClient } from "./_components/home-page-client";

export default async function HomePage() {
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
