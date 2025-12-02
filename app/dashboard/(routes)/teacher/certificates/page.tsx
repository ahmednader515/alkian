"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Copy, Download, Eye, Trash2, Calendar, Users, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileUpload } from "@/components/file-upload";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  promoCode: string;
  downloadCount: number;
  maxDownloads: number | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  fileUrl: string;
  downloads: Array<{
    id: string;
    studentName: string | null;
    studentEmail: string | null;
    downloadedAt: string;
  }>;
  _count: {
    downloads: number;
  };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    promoCode: "",
    maxDownloads: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/teacher/certificates");
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("حدث خطأ أثناء تحميل الشهادات");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.fileUrl || !formData.promoCode) {
      toast.error("العنوان وملف الشهادة ورمز الشهادة مطلوبان");
      return;
    }

    try {
      const response = await fetch("/api/teacher/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          maxDownloads: formData.maxDownloads ? parseInt(formData.maxDownloads) : null,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("تم إنشاء الشهادة بنجاح");
        setFormData({
          title: "",
          description: "",
          fileUrl: "",
          promoCode: "",
          maxDownloads: "",
          expiresAt: "",
        });
        setIsCreateDialogOpen(false);
        fetchCertificates();
      } else {
        const errorText = await response.text();
        let errorMessage = "حدث خطأ أثناء إنشاء الشهادة";
        
        if (errorText.includes("already in use")) {
          errorMessage = "رمز الشهادة مستخدم بالفعل. يرجى اختيار رمز آخر";
        } else if (errorText.includes("required")) {
          errorMessage = "يرجى ملء جميع الحقول المطلوبة";
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      toast.error("حدث خطأ أثناء إنشاء الشهادة");
    }
  };

  const copyPromoCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    toast.success("تم نسخ رمز الشهادة");
  };

  const toggleCertificateStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/teacher/certificates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(isActive ? "تم إلغاء تفعيل الشهادة" : "تم تفعيل الشهادة");
        fetchCertificates();
      }
    } catch (error) {
      console.error("Error toggling certificate status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الشهادة");
    }
  };

  const deleteCertificate = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/teacher/certificates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("تم حذف الشهادة بنجاح");
        fetchCertificates();
      } else {
        toast.error("حدث خطأ أثناء حذف الشهادة");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("حدث خطأ أثناء حذف الشهادة");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          إدارة الشهادات
        </h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 h-auto bg-[#052c4b] hover:bg-[#052c4b]/90 text-white">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">إنشاء شهادة جديدة</span>
              <span className="sm:hidden">إنشاء</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg sm:text-xl">إنشاء شهادة جديدة</DialogTitle>
              <DialogDescription className="text-sm">
                قم بإنشاء شهادة جديدة وأدخل رمز الشهادة الفريد للمشاركة مع الطلاب
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الشهادة *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: شهادة إتمام دورة البرمجة"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">وصف الشهادة</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر للشهادة..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promoCode">رمز الشهادة *</Label>
                <Input
                  id="promoCode"
                  value={formData.promoCode}
                  onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                  placeholder="أدخل رمز الشهادة (مثال: CERT1234)"
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  يجب أن يكون الرمز فريداً وغير مستخدم من قبل
                </p>
              </div>

              <div className="space-y-2">
                <Label>ملف الشهادة * (صورة أو PDF)</Label>
                <FileUpload
                  endpoint="certificate"
                  value={formData.fileUrl}
                  onChange={(url) => setFormData({ ...formData, fileUrl: url || "" })}
                  accept="image/*,application/pdf"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDownloads">الحد الأقصى للتحميلات</Label>
                  <Input
                    id="maxDownloads"
                    type="number"
                    value={formData.maxDownloads}
                    onChange={(e) => setFormData({ ...formData, maxDownloads: e.target.value })}
                    placeholder="اتركه فارغاً للحد غير المحدود"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">تاريخ الانتهاء</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-[#052c4b] hover:bg-[#052c4b]/90 text-white order-1 sm:order-2"
                >
                  إنشاء الشهادة
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{certificate.title}</CardTitle>
                <Badge variant={certificate.isActive ? "default" : "secondary"}>
                  {certificate.isActive ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              {certificate.description && (
                <p className="text-sm text-muted-foreground">{certificate.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">رمز الشهادة</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={certificate.promoCode}
                    readOnly
                    className="font-mono text-sm flex-1 min-w-0"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyPromoCode(certificate.promoCode)}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>{certificate.downloadCount} تحميل</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {certificate.maxDownloads ? `${certificate.maxDownloads} حد أقصى` : "غير محدود"}
                  </span>
                </div>
              </div>

              {certificate.expiresAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    ينتهي في {format(new Date(certificate.expiresAt), "dd/MM/yyyy", { locale: ar })}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleCertificateStatus(certificate.id, certificate.isActive)}
                  className="w-full sm:w-auto"
                >
                  {certificate.isActive ? "إلغاء التفعيل" : "تفعيل"}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف هذه الشهادة؟ لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCertificate(certificate.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "جاري الحذف..." : "حذف"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            لا توجد شهادات
          </h3>
          <p className="text-muted-foreground">
            ابدأ بإنشاء شهادة جديدة للمشاركة مع طلابك
          </p>
        </div>
      )}
    </div>
  );
}
