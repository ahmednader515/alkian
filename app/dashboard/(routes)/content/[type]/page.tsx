"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

interface CertificateTemplate {
  id: string;
  title: string | null;
  imageUrl: string;
  description: string | null;
}

interface ContentItem {
  id: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
}

const contentTypes: Record<string, { title: string }> = {
  "certificate-templates": {
    title: "نموذج للشهادات",
  },
  "about-us": {
    title: "اعرفنا أكثر",
  },
  "general-news": {
    title: "أخبار عامة",
  },
  "about-lecturers": {
    title: "نبذة عن المحاضرين",
  },
  "goals-achievements": {
    title: "هدفنا وإنجازاتنا",
  },
  "membership-job-request": {
    title: "طلب عضوية و وظيفة",
  },
  "renewal-request": {
    title: "طلب تجديد",
  },
};

export default function ContentViewPage() {
  const params = useParams();
  const type = params.type as string;
  const contentType = contentTypes[type] || { title: "المحتوى" };

  const [content, setContent] = useState<any>(null);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const contentTypesWithMultipleItems = ["about-us", "general-news", "about-lecturers", "goals-achievements"];

  useEffect(() => {
    if (type === "certificate-templates") {
      fetchTemplates();
    } else if (contentTypesWithMultipleItems.includes(type)) {
      fetchContentItems();
    } else {
      fetchContent();
    }
  }, [type]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/certificate-templates");
      setTemplates(response.data.templates || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب النماذج");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/content-items/${type}`);
      setContentItems(response.data.items || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب المحتوى");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/content/${type}`);
      if (response.data.content) {
        setContent(response.data.content);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setContent(null);
      } else {
        toast.error("حدث خطأ أثناء جلب المحتوى");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
      </div>
    );
  }

  // Certificate templates gallery view
  if (type === "certificate-templates") {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {contentType.title}
          </h1>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للخلف
            </Link>
          </Button>
        </div>

        {templates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                لا توجد نماذج شهادات متاحة حالياً
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={template.imageUrl}
                    alt={template.title || "نموذج شهادة"}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  {template.title && (
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  )}
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {template.description}
                    </p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Content items gallery view (about-us, general-news, about-lecturers, goals-achievements)
  if (contentTypesWithMultipleItems.includes(type)) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {contentType.title}
          </h1>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للخلف
            </Link>
          </Button>
        </div>

        {contentItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                لا يوجد محتوى متاح حالياً
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "صورة المحتوى"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  {item.title && (
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert line-clamp-4">
                    <div dangerouslySetInnerHTML={{ __html: item.content.substring(0, 200) }} />
                    {item.content.length > 200 && <span>...</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Legacy single content view (for backward compatibility)
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {contentType.title}
        </h1>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للخلف
          </Link>
        </Button>
      </div>

      {content ? (
        <Card>
          <CardHeader>
            {content.title && (
              <CardTitle className="text-2xl">{content.title}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {content.imageUrl && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={content.imageUrl}
                  alt={content.title || contentType.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap">
              {content.content}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              لا يوجد محتوى متاح حالياً
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

