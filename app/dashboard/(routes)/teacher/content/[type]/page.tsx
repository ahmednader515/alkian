"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, FileText, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { FileUpload } from "@/components/file-upload";

const contentTypes: Record<string, { title: string; description: string }> = {
  "certificate-templates": {
    title: "نموذج للشهادات",
    description: "إدارة نماذج الشهادات"
  },
  "about-us": {
    title: "اعرفنا أكثر",
    description: "إدارة معلومات المركز"
  },
  "general-news": {
    title: "أخبار عامة",
    description: "إدارة الأخبار العامة"
  },
  "about-lecturers": {
    title: "نبذة عن المحاضرين",
    description: "إدارة معلومات المحاضرين"
  },
  "goals-achievements": {
    title: "هدفنا وإنجازاتنا",
    description: "إدارة الأهداف والإنجازات"
  },
};

export default function ContentManagementPage() {
  const params = useParams();
  const type = params.type as string;
  const contentType = contentTypes[type] || { title: "إدارة المحتوى", description: "" };

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [type]);

  const fetchContent = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(`/api/teacher/content/${type}`);
      if (response.data.content) {
        setFormData({
          title: response.data.content.title || "",
          content: response.data.content.content || "",
          imageUrl: response.data.content.imageUrl || "",
        });
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error("حدث خطأ أثناء جلب المحتوى");
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`/api/teacher/content/${type}`, formData);
      toast.success("تم حفظ المحتوى بنجاح");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حفظ المحتوى");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {contentType.title}
        </h1>
        <p className="text-muted-foreground mt-2">
          {contentType.description}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {contentType.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان (اختياري)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل العنوان"
              />
            </div>

            {(type === "about-lecturers" || type === "goals-achievements") && (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">الصورة (اختياري)</Label>
                <FileUpload
                  endpoint="courseImage"
                  onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url || "" }))}
                  value={formData.imageUrl}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="max-w-xs rounded-lg border"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">المحتوى *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="أدخل المحتوى هنا..."
                rows={15}
                required
                className="font-arabic"
              />
            </div>

            <Button
              type="submit"
              className="bg-[#052c4b] hover:bg-[#052c4b]/90"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "جاري الحفظ..." : "حفظ المحتوى"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

