import type { CSSProperties } from "react";
import { Prisma } from "@prisma/client";

export type SessionCard = { name: string; id: string };

export type HomePageContent = {
  themePrimary: string;
  themeNavbar: string;
  themeGradientVia: string;
  themeGradientTo: string;
  logoUrl: string;
  dashboardBannerUrl: string;
  teacherImageUrl: string;
  teacherImageAlt: string;
  teacherName: string;
  teacherTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  servicesTitle: string;
  servicesSubtitle: string;
  coursesCarouselTitle: string;
  accreditationsTitle: string;
  accreditationsSubtitle: string;
  itcImageUrl: string;
  itcImageAlt: string;
  itcTitle: string;
  itcSubtitle: string;
  accreditation2Title: string;
  accreditation2Subtitle: string;
  accreditation3Title: string;
  accreditation3Subtitle: string;
  certificatesTitle: string;
  certificatesMoreLabel: string;
  certificatesWhatsappLabel: string;
  sessionsTitle: string;
  sessionsSubtitle: string;
  sessionCards: SessionCard[];
  sessionBookLabel: string;
  generalServicesTitle: string;
  certificateTemplatesTitle: string;
  certificateTemplatesSubtitle: string;
  aboutUsTitle: string;
  aboutUsSubtitle: string;
  onlineCourseTitle: string;
  onlineCourseButton: string;
  membershipTitle: string;
  membershipButton: string;
  newsTitle: string;
  newsSubtitle: string;
  quizzesTitle: string;
  quizzesSubtitle: string;
  quizzesFreeLabel: string;
  quizzesStartButton: string;
  fromCoursePrefix: string;
  questionCountPrefix: string;
  lecturersTitle: string;
  lecturersSubtitle: string;
  renewalTitle: string;
  renewalButton: string;
  goalsTitle: string;
  goalsSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  themePrimary: "#052c4b",
  themeNavbar: "#052b4a",
  themeGradientVia: "#1e3a8a",
  themeGradientTo: "#3b82f6",
  logoUrl: "/logo.png",
  dashboardBannerUrl: "/dashboard-banner.png",
  teacherImageUrl: "/teacher-image.png",
  teacherImageAlt: "Mr/ Mohamed khaled hassan",
  teacherName: "Mr/ Mohamed khaled hassan",
  teacherTitle: "عميد الكيآن اكاديمي للتأهيل والتدريب",
  heroTitle: "مركز الكيان للتأهيل والتدريب",
  heroSubtitle:
    "جميع مجالات الطب التكميلي والتأهيل الرياضي والتمنية البشرية والعناية بالبشرة والشعر والاستشارات",
  heroCtaPrimary: "ابدأ رحلتك معنا",
  heroCtaSecondary: "اكتشف خدماتنا",
  servicesTitle: "خدماتنا",
  servicesSubtitle: "اكتشف مجموعة متنوعة من الكورسات التعليمية المميزة",
  coursesCarouselTitle: "الكورسات المتاحة",
  accreditationsTitle: "الاعتمادات",
  accreditationsSubtitle:
    "نفتخر بحصولنا على اعتمادات من أرقى المؤسسات المحلية والدولية",
  itcImageUrl: "/ITC.png",
  itcImageAlt: "ITC UK",
  itcTitle: "إعتماد كلية التدريب الدولي البريطاني",
  itcSubtitle: "بإنجلترا - شريك معتمد",
  accreditation2Title: "إعتماد اللجنة النقابية للعاملين",
  accreditation2Subtitle: "بالمهن التجميلية",
  accreditation3Title: "إعتماد محلي وترخيص مزاولة التدريب",
  accreditation3Subtitle: "شهادة اعتماد رسمية",
  certificatesTitle: "الشهادات",
  certificatesMoreLabel: "لتفاصيل أكثر",
  certificatesWhatsappLabel: "كلمنا واتس: 01146450551",
  sessionsTitle: "الجلسات",
  sessionsSubtitle: "احجز جلسة مناسبة لك",
  sessionCards: [
    { name: "حجز جلسة تأهيل", id: "rehabilitation" },
    { name: "حجز جلسة حجامة", id: "cupping" },
    { name: "حجز جلسة تدليك", id: "massage" },
    { name: "حجز جلسة روحانية", id: "spiritual" },
    { name: "حجز استشارة", id: "consultation" },
    { name: "حجز مقابلة شخصية", id: "personal" },
  ],
  sessionBookLabel: "احجز الآن",
  generalServicesTitle: "الخدمات العامة",
  certificateTemplatesTitle: "نموذج للشهادات",
  certificateTemplatesSubtitle: "مساحة لإضافة الشهادات",
  aboutUsTitle: "اعرفنا أكثر",
  aboutUsSubtitle: "مساحة لإضافة المعلومات",
  onlineCourseTitle: "تسجيل في كورس أون لاين",
  onlineCourseButton: "سجل في كورس الآن",
  membershipTitle: "طلب عضوية ووظيفة",
  membershipButton: "قدم طلبك الآن",
  newsTitle: "أخبار عامة",
  newsSubtitle: "مساحة لإضافة الأخبار",
  quizzesTitle: "الاختبارات",
  quizzesSubtitle: "اكتشف الاختبارات المتاحة",
  quizzesFreeLabel: "مجاني",
  quizzesStartButton: "ابدأ الاختبار",
  fromCoursePrefix: "من الكورس:",
  questionCountPrefix: "عدد الأسئلة:",
  lecturersTitle: "نبذة عن المحاضرين",
  lecturersSubtitle: "مساحة لإضافة المحاضرين وصورهم",
  renewalTitle: "طلب تجديد",
  renewalButton: "قدم طلب التجديد",
  goalsTitle: "هدفنا وإنجازاتنا",
  goalsSubtitle: "مساحة لإضافة الأهداف والإنجازات",
  ctaTitle: "ابدأ رحلة الشفاء معنا",
  ctaSubtitle: "احجز موعدك اليوم واستمتع بخدماتنا المتخصصة",
  ctaPrimary: "احجز موعدك الآن",
  ctaSecondary: "تواصل معنا",
};

function normalizeSessionCards(input: unknown): SessionCard[] {
  const defaults = DEFAULT_HOME_PAGE_CONTENT.sessionCards;
  if (!Array.isArray(input)) return defaults;
  const byId = new Map<string, string>();
  for (const row of input) {
    if (
      row &&
      typeof row === "object" &&
      typeof (row as SessionCard).id === "string" &&
      typeof (row as SessionCard).name === "string"
    ) {
      byId.set((row as SessionCard).id, (row as SessionCard).name);
    }
  }
  return defaults.map((d) => ({
    id: d.id,
    name: byId.get(d.id)?.trim() || d.name,
  }));
}

function isHexColor(s: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s.trim());
}

export function mergeHomePageContent(raw: Prisma.JsonValue | null | undefined): HomePageContent {
  const merged: HomePageContent = { ...DEFAULT_HOME_PAGE_CONTENT };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return merged;
  }
  const obj = raw as Record<string, unknown>;
  const str = (k: keyof HomePageContent): string | undefined =>
    typeof obj[k] === "string" ? (obj[k] as string) : undefined;

  (Object.keys(DEFAULT_HOME_PAGE_CONTENT) as (keyof HomePageContent)[]).forEach((key) => {
    if (key === "sessionCards") {
      merged.sessionCards = normalizeSessionCards(obj.sessionCards);
      return;
    }
    const v = str(key);
    if (v !== undefined && v.trim() !== "") {
      if (
        (key === "themePrimary" || key === "themeNavbar" || key === "themeGradientVia" || key === "themeGradientTo") &&
        !isHexColor(v)
      ) {
        return;
      }
      (merged as Record<string, unknown>)[key] = v;
    }
  });

  return merged;
}

export function homePageCssVars(content: HomePageContent): CSSProperties {
  return {
    ["--home-primary" as string]: content.themePrimary,
    ["--home-navbar" as string]: content.themeNavbar,
    ["--home-gradient-via" as string]: content.themeGradientVia,
    ["--home-gradient-to" as string]: content.themeGradientTo,
  };
}
