"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import type { HomePageContent } from "@/lib/home-page-settings";
import { DEFAULT_HOME_PAGE_CONTENT } from "@/lib/home-page-settings";

export default function TeacherHomePageSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get<{ data: HomePageContent }>("/api/teacher/homepage-settings");
        if (!cancelled && res.data?.data) setData(res.data.data);
      } catch {
        toast.error("تعذر تحميل إعدادات الصفحة الرئيسية");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = <K extends keyof HomePageContent>(key: K, value: HomePageContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setSessionName = (index: number, name: string) => {
    setData((prev) => {
      const next = [...prev.sessionCards];
      if (next[index]) next[index] = { ...next[index], name };
      return { ...prev, sessionCards: next };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/teacher/homepage-settings", { data });
      toast.success("تم حفظ إعدادات الصفحة الرئيسية");
    } catch {
      toast.error("فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الصفحة الرئيسية للموقع</h1>
          <p className="text-muted-foreground text-sm mt-1">
            تعديل الشعار، الألوان، نصوص منطقة البداية، والعناوين. الصفحة العامة تستخدم هذه القيم فور الحفظ.
          </p>
        </div>
        <Button onClick={save} disabled={saving} className="shrink-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
          حفظ الكل
        </Button>
      </div>

      <Tabs defaultValue="theme" dir="rtl" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="theme">الألوان</TabsTrigger>
          <TabsTrigger value="media">الشعار والصور</TabsTrigger>
          <TabsTrigger value="dashboard">بانر الداشبورد</TabsTrigger>
          <TabsTrigger value="hero">قسم منطقة البداية</TabsTrigger>
          <TabsTrigger value="sections">عناوين الأقسام</TabsTrigger>
          <TabsTrigger value="sessions">جلسات الحجز</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ألوان المظهر</CardTitle>
              <CardDescription>
                اللون الأساسي يُستخدم في الأزرار والعناوين والتدرجات. يمكنك ضبط تدرج الخلفية في منطقة البداية.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["themePrimary", "اللون الأساسي"],
                  ["themeNavbar", "لون شريط التنقل (الأزرار)"],
                  ["themeGradientVia", "وسط التدرج (منطقة البداية)"],
                  ["themeGradientTo", "نهاية تدرج منطقة البداية"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      className="w-14 h-10 p-1 cursor-pointer shrink-0"
                      value={/^#[0-9A-Fa-f]{6}$/.test(data[key]) ? data[key] : "#052c4b"}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                    <Input
                      value={data[key]}
                      onChange={(e) => setField(key, e.target.value)}
                      dir="ltr"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الشعار والصور</CardTitle>
              <CardDescription>اترك الحقل فارغاً بعد الرفع لإبقاء الرابط الحالي؛ لإعادة التعيين استخدم زر الحذف في المرفق.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>شعار الموقع (يظهر في الشريط العلوي)</Label>
                <FileUpload
                  endpoint="courseImage"
                  value={data.logoUrl.startsWith("http") ? data.logoUrl : undefined}
                  onChange={(url) => setField("logoUrl", url ?? "")}
                />
                <Input
                  dir="ltr"
                  placeholder="/logo.png أو رابط كامل"
                  value={data.logoUrl}
                  onChange={(e) => setField("logoUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>صورة المحاضر (دائرة منطقة البداية)</Label>
                <FileUpload
                  endpoint="courseImage"
                  value={data.teacherImageUrl.startsWith("http") ? data.teacherImageUrl : undefined}
                  onChange={(url) => setField("teacherImageUrl", url ?? "")}
                />
                <Input dir="ltr" value={data.teacherImageUrl} onChange={(e) => setField("teacherImageUrl", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>صورة اعتماد ITC (عند عدم وجود اعتمادات من قاعدة البيانات)</Label>
                <FileUpload
                  endpoint="courseImage"
                  value={data.itcImageUrl.startsWith("http") ? data.itcImageUrl : undefined}
                  onChange={(url) => setField("itcImageUrl", url ?? "")}
                />
                <Input dir="ltr" value={data.itcImageUrl} onChange={(e) => setField("itcImageUrl", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>بانر أعلى صفحات الداشبورد</CardTitle>
              <CardDescription>
                هذه الصورة تظهر أعلى صفحات الداشبورد (Teacher/User/Admin/Guest). يفضل رفع صورة عريضة (مثل 1920×400).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FileUpload
                endpoint="courseImage"
                value={data.dashboardBannerUrl?.startsWith("http") ? data.dashboardBannerUrl : undefined}
                onChange={(url) => setField("dashboardBannerUrl", url ?? "")}
              />
              <Input
                dir="ltr"
                placeholder="/dashboard-banner.png أو رابط كامل"
                value={data.dashboardBannerUrl}
                onChange={(e) => setField("dashboardBannerUrl", e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>قسم منطقة البداية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>نص بديل لصورة المحاضر (SEO)</Label>
                <Input value={data.teacherImageAlt} onChange={(e) => setField("teacherImageAlt", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>اسم المحاضر</Label>
                <Input value={data.teacherName} onChange={(e) => setField("teacherName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>المسمى الوظيفي تحت الاسم</Label>
                <Input value={data.teacherTitle} onChange={(e) => setField("teacherTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>العنوان الرئيسي</Label>
                <Input value={data.heroTitle} onChange={(e) => setField("heroTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>الوصف أسفل العنوان</Label>
                <Textarea rows={3} value={data.heroSubtitle} onChange={(e) => setField("heroSubtitle", e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>زر التسجيل</Label>
                  <Input value={data.heroCtaPrimary} onChange={(e) => setField("heroCtaPrimary", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>زر اكتشف الخدمات</Label>
                  <Input value={data.heroCtaSecondary} onChange={(e) => setField("heroCtaSecondary", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>العناوين والنصوص</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              {(
                [
                  ["servicesTitle", "عنوان: خدماتنا"],
                  ["servicesSubtitle", "نص تحت خدماتنا"],
                  ["coursesCarouselTitle", "عنوان سلايدر الكورسات"],
                  ["accreditationsTitle", "عنوان: الاعتمادات"],
                  ["accreditationsSubtitle", "نص تحت الاعتمادات"],
                  ["itcImageAlt", "نص بديل صورة ITC"],
                  ["itcTitle", "عنوان بطاقة ITC"],
                  ["itcSubtitle", "نص فرعي ITC"],
                  ["accreditation2Title", "اعتماد 2 (نقابة)"],
                  ["accreditation2Subtitle", "نص فرعي 2"],
                  ["accreditation3Title", "اعتماد 3 (محلي)"],
                  ["accreditation3Subtitle", "نص فرعي 3"],
                  ["certificatesTitle", "عنوان: الشهادات"],
                  ["certificatesMoreLabel", "نص قبل واتساب"],
                  ["certificatesWhatsappLabel", "نص واتساب"],
                  ["sessionsTitle", "عنوان: الجلسات"],
                  ["sessionsSubtitle", "نص تحت الجلسات"],
                  ["sessionBookLabel", "زر احجز الآن"],
                  ["generalServicesTitle", "الخدمات العامة"],
                  ["certificateTemplatesTitle", "نماذج الشهادات"],
                  ["certificateTemplatesSubtitle", "نص تحت النماذج"],
                  ["aboutUsTitle", "اعرفنا أكثر"],
                  ["aboutUsSubtitle", "نص فرعي"],
                  ["onlineCourseTitle", "تسجيل أونلاين"],
                  ["onlineCourseButton", "زر التسجيل"],
                  ["membershipTitle", "عضوية ووظيفة"],
                  ["membershipButton", "زر الطلب"],
                  ["newsTitle", "أخبار عامة"],
                  ["newsSubtitle", "نص الأخبار"],
                  ["quizzesTitle", "الاختبارات"],
                  ["quizzesSubtitle", "نص الاختبارات"],
                  ["quizzesFreeLabel", "تسمية مجاني"],
                  ["quizzesStartButton", "ابدأ الاختبار"],
                  ["fromCoursePrefix", "بادئة من الكورس"],
                  ["questionCountPrefix", "بادئة عدد الأسئلة"],
                  ["lecturersTitle", "المحاضرون"],
                  ["lecturersSubtitle", "نص المحاضرون"],
                  ["renewalTitle", "التجديد"],
                  ["renewalButton", "زر التجديد"],
                  ["goalsTitle", "الأهداف والإنجازات"],
                  ["goalsSubtitle", "نص الأهداف"],
                  ["ctaTitle", "عنوان الدعوة الأخيرة"],
                  ["ctaSubtitle", "نص الدعوة"],
                  ["ctaPrimary", "زر أول"],
                  ["ctaSecondary", "زر ثانٍ"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input value={data[key]} onChange={(e) => setField(key, e.target.value)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أسماء جلسات الحجز</CardTitle>
              <CardDescription>المعرف (في الرابط) ثابت؛ يمكنك تغيير العنوان المعروض فقط.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.sessionCards.map((card, i) => (
                <div key={card.id} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <code className="text-xs bg-muted px-2 py-1 rounded shrink-0" dir="ltr">
                    {card.id}
                  </code>
                  <Input value={card.name} onChange={(e) => setSessionName(i, e.target.value)} className="flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
