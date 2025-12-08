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

  // Fetch published courses from database (courses created by admins or teachers)
  let courses = [];
  
  try {
    courses = await db.course.findMany({
      where: {
        isPublished: true,
        user: {
          role: {
            in: ["ADMIN", "TEACHER"],
          },
        },
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

  // Fetch accreditations
  let accreditations = [];
  try {
    accreditations = await db.accreditation.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error) {
    console.error("Error fetching accreditations:", error);
  }

  // Fetch certificate details
  let certificateDetails = [];
  try {
    certificateDetails = await db.certificateDetail.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error) {
    console.error("Error fetching certificate details:", error);
  }

  // Fetch general services
  let generalServices = [];
  try {
    generalServices = await db.generalService.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });
  } catch (error) {
    console.error("Error fetching general services:", error);
  }

  // Fetch certificate templates
  let certificateTemplates = [];
  try {
    certificateTemplates = await db.certificateTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    console.error("Error fetching certificate templates:", error);
  }

  // Fetch content items for different sections
  let aboutUsItems = [];
  let generalNewsItems = [];
  let aboutLecturersItems = [];
  let goalsAchievementsItems = [];

  try {
    aboutUsItems = await db.contentItem.findMany({
      where: {
        type: "ABOUT_US",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching about-us items:", error);
  }

  try {
    generalNewsItems = await db.contentItem.findMany({
      where: {
        type: "GENERAL_NEWS",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching general-news items:", error);
  }

  try {
    aboutLecturersItems = await db.contentItem.findMany({
      where: {
        type: "ABOUT_LECTURERS",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching about-lecturers items:", error);
  }

  try {
    goalsAchievementsItems = await db.contentItem.findMany({
      where: {
        type: "GOALS_ACHIEVEMENTS",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching goals-achievements items:", error);
  }

  // Fetch all published standalone quizzes (quizzes without courseId or from published courses)
  let quizzes = [];
  try {
    quizzes = await db.quiz.findMany({
      where: {
        OR: [
          { courseId: null }, // Standalone quizzes
          { 
            course: {
              isPublished: true,
            }
          }
        ],
        isPublished: true,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        questions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12, // Limit to 12 quizzes for homepage
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
  }

  return (
    <HomePageClient 
      courses={courses}
      accreditations={accreditations}
      certificateDetails={certificateDetails}
      generalServices={generalServices}
      certificateTemplates={certificateTemplates}
      aboutUsItems={aboutUsItems}
      generalNewsItems={generalNewsItems}
      aboutLecturersItems={aboutLecturersItems}
      goalsAchievementsItems={goalsAchievementsItems}
      quizzes={quizzes}
    />
  );
}
