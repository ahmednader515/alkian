"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, FileText, Image as ImageIcon, Plus, Edit, Trash2, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import axios from "axios";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  "our-branches": {
    title: "فروعنا",
    description: "إدارة فروع المركز"
  },
};

interface CertificateTemplate {
  id: string;
  title: string | null;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContentItem {
  id: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManagementPage() {
  const params = useParams();
  const type = params.type as string;
  const contentType = contentTypes[type] || { title: "إدارة المحتوى", description: "" };

  // For certificate templates
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isTemplateDeleteDialogOpen, setIsTemplateDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateFormData, setTemplateFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
  });
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isFetchingTemplates, setIsFetchingTemplates] = useState(true);

  // For content items (about-us, general-news, about-lecturers, goals-achievements)
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isContentDeleteDialogOpen, setIsContentDeleteDialogOpen] = useState(false);
  const [editingContentItem, setEditingContentItem] = useState<ContentItem | null>(null);
  const [contentItemToDelete, setContentItemToDelete] = useState<string | null>(null);
  const [contentItemFormData, setContentItemFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isFetchingContentItems, setIsFetchingContentItems] = useState(true);

  // For legacy single content (deprecated, keeping for backward compatibility)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Image zoom state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const contentTypesWithMultipleItems = ["about-us", "general-news", "about-lecturers", "goals-achievements", "our-branches"];

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
      setIsFetchingTemplates(true);
      const response = await axios.get("/api/teacher/certificate-templates");
      setTemplates(response.data.templates || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب النماذج");
    } finally {
      setIsFetchingTemplates(false);
    }
  };

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

  const fetchContentItems = async () => {
    try {
      setIsFetchingContentItems(true);
      const response = await axios.get(`/api/teacher/content-items?type=${type}`);
      setContentItems(response.data.items || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب المحتوى");
    } finally {
      setIsFetchingContentItems(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingTemplate(null);
    setTemplateFormData({
      title: "",
      imageUrl: "",
      description: "",
    });
    setIsTemplateDialogOpen(true);
  };

  const handleOpenAddContentDialog = () => {
    setEditingContentItem(null);
    setContentItemFormData({
      title: "",
      content: "",
      imageUrl: "",
    });
    setIsContentDialogOpen(true);
  };

  const handleOpenEditContentDialog = (item: ContentItem) => {
    setEditingContentItem(item);
    setContentItemFormData({
      title: item.title || "",
      content: item.content,
      imageUrl: item.imageUrl || "",
    });
    setIsContentDialogOpen(true);
  };

  const handleOpenEditDialog = (template: CertificateTemplate) => {
    setEditingTemplate(template);
    setTemplateFormData({
      title: template.title || "",
      imageUrl: template.imageUrl,
      description: template.description || "",
    });
    setIsTemplateDialogOpen(true);
  };

  const handleSubmitTemplate = async () => {
    if (!templateFormData.imageUrl) {
      toast.error("يرجى رفع صورة للنموذج");
      return;
    }

    setIsTemplateLoading(true);
    try {
      if (editingTemplate) {
        await axios.patch(`/api/teacher/certificate-templates/${editingTemplate.id}`, templateFormData);
        toast.success("تم تحديث النموذج بنجاح");
      } else {
        await axios.post("/api/teacher/certificate-templates", templateFormData);
        toast.success("تم إضافة النموذج بنجاح");
      }
      setIsTemplateDialogOpen(false);
      fetchTemplates();
      setTemplateFormData({
        title: "",
        imageUrl: "",
        description: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حفظ النموذج");
    } finally {
      setIsTemplateLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    setIsTemplateLoading(true);
    try {
      await axios.delete(`/api/teacher/certificate-templates/${templateToDelete}`);
      toast.success("تم حذف النموذج بنجاح");
      setIsTemplateDeleteDialogOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حذف النموذج");
    } finally {
      setIsTemplateLoading(false);
    }
  };

  // Image zoom handlers
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedImage) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSubmitContentItem = async () => {
    if (!contentItemFormData.content.trim()) {
      toast.error("يرجى إدخال المحتوى");
      return;
    }

    setIsContentLoading(true);
    try {
      if (editingContentItem) {
        await axios.patch(`/api/teacher/content-items/${editingContentItem.id}`, {
          ...contentItemFormData,
          type,
        });
        toast.success("تم تحديث المحتوى بنجاح");
      } else {
        await axios.post("/api/teacher/content-items", {
          ...contentItemFormData,
          type,
        });
        toast.success("تم إضافة المحتوى بنجاح");
      }
      setIsContentDialogOpen(false);
      fetchContentItems();
      setContentItemFormData({
        title: "",
        content: "",
        imageUrl: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حفظ المحتوى");
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleDeleteContentItem = async () => {
    if (!contentItemToDelete) return;

    setIsContentLoading(true);
    try {
      await axios.delete(`/api/teacher/content-items/${contentItemToDelete}`);
      toast.success("تم حذف المحتوى بنجاح");
      setIsContentDeleteDialogOpen(false);
      setContentItemToDelete(null);
      fetchContentItems();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حذف المحتوى");
    } finally {
      setIsContentLoading(false);
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

  // Certificate templates view
  if (type === "certificate-templates") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {contentType.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              {contentType.description}
            </p>
          </div>
          <Button onClick={handleOpenAddDialog} className="bg-[#052c4b] hover:bg-[#052c4b]/90">
            <Plus className="h-4 w-4 mr-2" />
            إضافة نموذج
          </Button>
        </div>

        {isFetchingTemplates ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                لا توجد نماذج شهادات حتى الآن
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div 
                  className="relative aspect-[4/3] bg-muted cursor-pointer group"
                  onClick={() => openImageModal(template.imageUrl)}
                >
                  <Image
                    src={template.imageUrl}
                    alt={template.title || "نموذج شهادة"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
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
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditDialog(template)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setTemplateToDelete(template.id);
                        setIsTemplateDeleteDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "تعديل النموذج" : "إضافة نموذج جديد"}
              </DialogTitle>
              <DialogDescription>
                {editingTemplate ? "قم بتعديل بيانات النموذج" : "أضف نموذج شهادة جديد"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-title">العنوان (اختياري)</Label>
                <Input
                  id="template-title"
                  value={templateFormData.title}
                  onChange={(e) =>
                    setTemplateFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="أدخل عنوان النموذج"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-image">صورة النموذج *</Label>
                <FileUpload
                  endpoint="certificateTemplate"
                  onChange={(url) =>
                    setTemplateFormData((prev) => ({ ...prev, imageUrl: url || "" }))
                  }
                  value={templateFormData.imageUrl}
                />
                {templateFormData.imageUrl && (
                  <div 
                    className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border cursor-pointer group"
                    onClick={() => openImageModal(templateFormData.imageUrl)}
                  >
                    <Image
                      src={templateFormData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">الوصف (اختياري)</Label>
                <Textarea
                  id="template-description"
                  value={templateFormData.description}
                  onChange={(e) =>
                    setTemplateFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="أدخل وصف للنموذج"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsTemplateDialogOpen(false)}
                disabled={isTemplateLoading}
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitTemplate}
                disabled={isTemplateLoading || !templateFormData.imageUrl}
                className="bg-[#052c4b] hover:bg-[#052c4b]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isTemplateLoading
                  ? "جاري الحفظ..."
                  : editingTemplate
                  ? "حفظ التعديلات"
                  : "إضافة النموذج"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isTemplateDeleteDialogOpen} onOpenChange={setIsTemplateDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف هذا النموذج؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isTemplateLoading}>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTemplate}
                disabled={isTemplateLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isTemplateLoading ? "جاري الحذف..." : "حذف"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Content items view (about-us, general-news, about-lecturers, goals-achievements)
  if (contentTypesWithMultipleItems.includes(type)) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {contentType.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              {contentType.description}
            </p>
          </div>
          <Button onClick={handleOpenAddContentDialog} className="bg-[#052c4b] hover:bg-[#052c4b]/90">
            <Plus className="h-4 w-4 mr-2" />
            إضافة محتوى
          </Button>
        </div>

        {isFetchingContentItems ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
          </div>
        ) : contentItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                لا يوجد محتوى حتى الآن
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.imageUrl && (
                  <div 
                    className="relative aspect-video bg-muted cursor-pointer group"
                    onClick={() => openImageModal(item.imageUrl!)}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "صورة المحتوى"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
                <CardHeader>
                  {item.title && (
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  )}
                  <div className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {item.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                    {item.content.replace(/<[^>]*>/g, "").length > 100 && "..."}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditContentDialog(item)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setContentItemToDelete(item.id);
                        setIsContentDeleteDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Content Item Dialog */}
        <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContentItem ? "تعديل المحتوى" : "إضافة محتوى جديد"}
              </DialogTitle>
              <DialogDescription>
                {editingContentItem ? "قم بتعديل بيانات المحتوى" : "أضف محتوى جديد"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-item-title">العنوان (اختياري)</Label>
                <Input
                  id="content-item-title"
                  value={contentItemFormData.title}
                  onChange={(e) =>
                    setContentItemFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="أدخل عنوان المحتوى"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-item-image">الصورة (اختياري)</Label>
                <FileUpload
                  endpoint="courseImage"
                  onChange={(url) =>
                    setContentItemFormData((prev) => ({ ...prev, imageUrl: url || "" }))
                  }
                  value={contentItemFormData.imageUrl}
                />
                {contentItemFormData.imageUrl && (
                  <div 
                    className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border cursor-pointer group"
                    onClick={() => openImageModal(contentItemFormData.imageUrl)}
                  >
                    <Image
                      src={contentItemFormData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-item-content">المحتوى *</Label>
                <Textarea
                  id="content-item-content"
                  value={contentItemFormData.content}
                  onChange={(e) =>
                    setContentItemFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="أدخل المحتوى هنا..."
                  rows={10}
                  required
                  className="font-arabic"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsContentDialogOpen(false)}
                disabled={isContentLoading}
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitContentItem}
                disabled={isContentLoading || !contentItemFormData.content.trim()}
                className="bg-[#052c4b] hover:bg-[#052c4b]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isContentLoading
                  ? "جاري الحفظ..."
                  : editingContentItem
                  ? "حفظ التعديلات"
                  : "إضافة المحتوى"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Content Item Confirmation Dialog */}
        <AlertDialog open={isContentDeleteDialogOpen} onOpenChange={setIsContentDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف هذا المحتوى؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isContentLoading}>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteContentItem}
                disabled={isContentLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isContentLoading ? "جاري الحذف..." : "حذف"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Legacy single content view (for backward compatibility)
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
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
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
                  <div 
                    className="mt-2 cursor-pointer group inline-block"
                    onClick={() => openImageModal(formData.imageUrl)}
                  >
                    <div className="relative">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="max-w-xs rounded-lg border transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center rounded-lg">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
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

      {/* Image Zoom Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">صورة مكبرة</DialogTitle>
          <div className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeImageModal}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleReset}
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>

            <div
              className="w-full h-full flex items-center justify-center"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              {selectedImage && (
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Zoomed image"
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  draggable={false}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

