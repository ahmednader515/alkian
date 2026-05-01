import type { CSSProperties } from "react";
import { Prisma } from "@prisma/client";

export type SessionCard = { name: string; id: string };

export type DashboardNavItem = {
  id: string;
  label: string;
  icon: string; // lucide icon name
  href: string;
};

export type DashboardNavConfig = {
  user: DashboardNavItem[];
  teacher: DashboardNavItem[];
  admin: DashboardNavItem[];
  guest: DashboardNavItem[];
};

export type DashboardBigButton = {
  id: string;
  label: string;
  iconUrl: string;
  href: string;
};

export type DashboardBigButtonsConfig = {
  teacher: DashboardBigButton[];
  admin: DashboardBigButton[];
  user: DashboardBigButton[];
};

export type HomePageContent = {
  themePrimary: string;
  themeNavbar: string;
  themeGradientVia: string;
  themeGradientTo: string;
  logoUrl: string;
  dashboardBannerUrl: string;
  dashboardNav: DashboardNavConfig;
  dashboardBigButtons: DashboardBigButtonsConfig;
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
  contactWhatsappNumber: string;
  contactFacebookUrl: string;
};

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  themePrimary: "#052c4b",
  themeNavbar: "#052b4a",
  themeGradientVia: "#1e3a8a",
  themeGradientTo: "#3b82f6",
  logoUrl: "/logo.png",
  dashboardBannerUrl: "/dashboard-banner.png",
  dashboardNav: {
    user: [
      { id: "courses", icon: "Home", label: "الرئيسية", href: "/dashboard" },
      { id: "balance", icon: "Wallet", label: "الرصيد", href: "/dashboard/balance" },
      { id: "dashboard", icon: "Compass", label: "لوحة التحكم", href: "/dashboard/search" },
      { id: "certificates", icon: "GraduationCap", label: "الشهادات", href: "/dashboard/certificates" },
      { id: "account", icon: "User", label: "حسابي", href: "/dashboard/account" },
    ],
    teacher: [
      { id: "courses", icon: "List", label: "الكورسات", href: "/dashboard/teacher/courses" },
      { id: "analytics", icon: "BarChart", label: "الاحصائيات", href: "/dashboard/teacher/analytics" },
      { id: "dashboard", icon: "Home", label: "لوحة التحكم", href: "/dashboard/teacher" },
      { id: "certificates", icon: "GraduationCap", label: "الشهادات", href: "/dashboard/teacher/certificates" },
      { id: "account", icon: "User", label: "حسابي", href: "/dashboard/teacher/account" },
    ],
    admin: [
      { id: "users", icon: "Users", label: "المستخدمين", href: "/dashboard/admin/users" },
      { id: "courses", icon: "List", label: "الكورسات", href: "/dashboard/admin/courses" },
      { id: "dashboard", icon: "Home", label: "لوحة التحكم", href: "/dashboard/admin" },
      { id: "progress", icon: "TrendingUp", label: "تقدم الطلاب", href: "/dashboard/admin/progress" },
      { id: "account", icon: "User", label: "حسابي", href: "/dashboard/admin/account" },
    ],
    guest: [
      { id: "home", icon: "Home", label: "الرئيسية", href: "/dashboard/guest" },
      { id: "account", icon: "User", label: "حسابي", href: "/dashboard/guest/account" },
    ],
  },
  dashboardBigButtons: {
    teacher: [
      { id: "homepage", label: "الصفحة الرئيسية للموقع", iconUrl: "", href: "/dashboard/teacher/homepage" },
      { id: "courses", label: "الكورسات", iconUrl: "", href: "/dashboard/teacher/courses" },
      { id: "quizzes", label: "الاختبارات", iconUrl: "", href: "/dashboard/teacher/quizzes" },
      { id: "grades", label: "الدرجات", iconUrl: "", href: "/dashboard/teacher/grades" },
      { id: "analytics", label: "الاحصائيات", iconUrl: "", href: "/dashboard/teacher/analytics" },
      { id: "users", label: "إدارة الطلاب", iconUrl: "", href: "/dashboard/teacher/users" },
      { id: "balances", label: "إدارة الأرصدة", iconUrl: "", href: "/dashboard/teacher/balances" },
      { id: "add-courses", label: "إضافة / حذف كورسات", iconUrl: "", href: "/dashboard/teacher/add-courses" },
      { id: "passwords", label: "كلمات المرور", iconUrl: "", href: "/dashboard/teacher/passwords" },
      { id: "certificates", label: "إدارة الشهادات", iconUrl: "", href: "/dashboard/teacher/certificates" },
      { id: "reservations", label: "إدارة الحجوزات", iconUrl: "", href: "/dashboard/teacher/reservations" },
      { id: "certificate-templates", label: "نموذج للشهادات", iconUrl: "", href: "/dashboard/teacher/content/certificate-templates" },
      { id: "about-us", label: "اعرفنا أكثر", iconUrl: "", href: "/dashboard/teacher/content/about-us" },
      { id: "general-news", label: "أخبار عامة", iconUrl: "", href: "/dashboard/teacher/content/general-news" },
      { id: "about-lecturers", label: "نبذة عن المحاضرين", iconUrl: "", href: "/dashboard/teacher/content/about-lecturers" },
      { id: "goals-achievements", label: "هدفنا وإنجازاتنا", iconUrl: "", href: "/dashboard/teacher/content/goals-achievements" },
      { id: "our-branches", label: "فروعنا", iconUrl: "", href: "/dashboard/teacher/content/our-branches" },
      { id: "create-account", label: "إنشاء حساب طالب", iconUrl: "", href: "/dashboard/teacher/create-account" },
      { id: "online-course-registrations", label: "طلبات التسجيل في الكورسات", iconUrl: "", href: "/dashboard/teacher/online-course-registrations" },
      { id: "membership-job-requests", label: "طلبات العضوية والوظيفة", iconUrl: "", href: "/dashboard/teacher/membership-job-requests" },
      { id: "renewal-requests", label: "طلبات التجديد", iconUrl: "", href: "/dashboard/teacher/renewal-requests" },
      { id: "complaints", label: "الشكاوى", iconUrl: "", href: "/dashboard/teacher/complaints" },
      { id: "services", label: "إدارة الخدمات", iconUrl: "", href: "/dashboard/teacher/services" },
      { id: "certificate-details", label: "بيانات الشهادات", iconUrl: "", href: "/dashboard/teacher/certificate-details" },
      { id: "accreditations", label: "الاعتمادات", iconUrl: "", href: "/dashboard/teacher/accreditations" },
      { id: "general-services", label: "الخدمات العامة", iconUrl: "", href: "/dashboard/teacher/general-services" },
    ],
    admin: [
      { id: "dashboard", label: "لوحة التحكم", iconUrl: "", href: "/dashboard/admin" },
      { id: "users", label: "إدارة المستخدمين", iconUrl: "", href: "/dashboard/admin/users" },
      { id: "courses", label: "إدارة الكورسات", iconUrl: "", href: "/dashboard/admin/courses" },
      { id: "quizzes", label: "الاختبارات", iconUrl: "", href: "/dashboard/admin/quizzes" },
      { id: "create-account", label: "إنشاء حساب طالب", iconUrl: "", href: "/dashboard/admin/create-account" },
      { id: "passwords", label: "كلمات المرور", iconUrl: "", href: "/dashboard/admin/passwords" },
      { id: "balances", label: "إدارة الأرصدة", iconUrl: "", href: "/dashboard/admin/balances" },
      { id: "progress", label: "تقدم الطلاب", iconUrl: "", href: "/dashboard/admin/progress" },
      { id: "add-courses", label: "إضافة / حذف كورسات", iconUrl: "", href: "/dashboard/admin/add-courses" },
    ],
    user: [
      { id: "1", label: "خدماتنا", iconUrl: "", href: "/dashboard/services" },
      { id: "2", label: "الاعتمادات", iconUrl: "", href: "/dashboard/accreditations" },
      { id: "3", label: "الشهادات", iconUrl: "", href: "/dashboard/certificates-details" },
      { id: "4", label: "الجلسات", iconUrl: "", href: "/dashboard/sessions" },
      { id: "5", label: "الخدمات العامة", iconUrl: "", href: "/dashboard/general-services" },
      { id: "6", label: "نموذج للشهادات", iconUrl: "", href: "/dashboard/content/certificate-templates" },
      { id: "7", label: "اعرفنا اكثر", iconUrl: "", href: "/dashboard/content/about-us" },
      { id: "8", label: "تسجيل في كورس اونلاين", iconUrl: "", href: "/dashboard/register-course" },
      { id: "9", label: "طلب عضوية و وظيفة", iconUrl: "", href: "/dashboard/membership-job-request" },
      { id: "10", label: "اخبار عامة", iconUrl: "", href: "/dashboard/content/general-news" },
      { id: "11", label: "الاختبارات", iconUrl: "", href: "/dashboard/content/tests" },
      { id: "12", label: "نبذه عن المحاضرين", iconUrl: "", href: "/dashboard/content/about-lecturers" },
      { id: "13", label: "طلب تجديد", iconUrl: "", href: "/dashboard/renewal-request" },
      { id: "14", label: "هدفنا وانجازتنا", iconUrl: "", href: "/dashboard/content/goals-achievements" },
      { id: "15", label: "تقديم شكوى", iconUrl: "", href: "/dashboard/complaint" },
      { id: "16", label: "الكورسات المسجلة", iconUrl: "", href: "/dashboard/my-courses" },
      { id: "17", label: "فروعنا", iconUrl: "", href: "/dashboard/content/our-branches" },
    ],
  },
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
  certificatesWhatsappLabel: "كلمنا واتس:",
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
  contactWhatsappNumber: "01146450551",
  contactFacebookUrl: "",
};

export function buildWhatsAppLink(input: string): string {
  const digits = (input || "").replace(/[^0-9]/g, "");
  if (!digits) return "https://wa.me/";
  // If it looks like an Egyptian local mobile number (starts with 0), prefix country code 20.
  const wa = digits.startsWith("0") ? `20${digits.slice(1)}` : digits;
  return `https://wa.me/${wa}`;
}

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

function normalizeDashboardNav(input: unknown): DashboardNavConfig {
  const defaults = DEFAULT_HOME_PAGE_CONTENT.dashboardNav;
  if (!input || typeof input !== "object" || Array.isArray(input)) return defaults;
  const obj = input as Record<string, unknown>;

  const normalizeList = (key: keyof DashboardNavConfig): DashboardNavItem[] => {
    const def = defaults[key];
    const raw = obj[key];
    if (!Array.isArray(raw)) return def;
    const byId = new Map<string, Partial<DashboardNavItem>>();
    for (const row of raw) {
      if (!row || typeof row !== "object") continue;
      const r = row as Partial<DashboardNavItem>;
      if (typeof r.id !== "string") continue;
      byId.set(r.id, r);
    }
    return def.map((d) => {
      const r = byId.get(d.id);
      return {
        id: d.id,
        href: d.href,
        label: typeof r?.label === "string" && r.label.trim() ? r.label : d.label,
        icon: typeof r?.icon === "string" && r.icon.trim() ? r.icon : d.icon,
      };
    });
  };

  return {
    user: normalizeList("user"),
    teacher: normalizeList("teacher"),
    admin: normalizeList("admin"),
    guest: normalizeList("guest"),
  };
}

function normalizeDashboardBigButtons(input: unknown): DashboardBigButtonsConfig {
  const defaults = DEFAULT_HOME_PAGE_CONTENT.dashboardBigButtons;
  if (!input || typeof input !== "object" || Array.isArray(input)) return defaults;
  const obj = input as Record<string, unknown>;

  const normalizeList = (key: keyof DashboardBigButtonsConfig): DashboardBigButton[] => {
    const def = defaults[key];
    const raw = obj[key];
    if (!Array.isArray(raw)) return def;
    const byId = new Map<string, Partial<DashboardBigButton>>();
    for (const row of raw) {
      if (!row || typeof row !== "object") continue;
      const r = row as Partial<DashboardBigButton>;
      if (typeof r.id !== "string") continue;
      byId.set(r.id, r);
    }
    return def.map((d) => {
      const r = byId.get(d.id);
      return {
        id: d.id,
        href: d.href,
        label: typeof r?.label === "string" && r.label.trim() ? r.label : d.label,
        iconUrl: typeof r?.iconUrl === "string" ? r.iconUrl : d.iconUrl,
      };
    });
  };

  return {
    teacher: normalizeList("teacher"),
    admin: normalizeList("admin"),
    user: normalizeList("user"),
  };
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
    if (key === "dashboardNav") {
      merged.dashboardNav = normalizeDashboardNav(obj.dashboardNav);
      return;
    }
    if (key === "dashboardBigButtons") {
      merged.dashboardBigButtons = normalizeDashboardBigButtons(obj.dashboardBigButtons);
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
