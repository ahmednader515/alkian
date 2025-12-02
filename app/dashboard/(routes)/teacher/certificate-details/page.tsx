"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, Edit, Trash2, Save, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
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

interface CertificateDetail {
  id: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export default function CertificateDetailsPage() {
  const [certificateDetails, setCertificateDetails] = useState<CertificateDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<CertificateDetail | null>(null);
  const [detailToDelete, setDetailToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCertificateDetails();
  }, []);

  const fetchCertificateDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/teacher/certificate-details");
      setCertificateDetails(response.data.certificateDetails || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب بيانات الشهادات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingDetail(null);
    setFormData({ title: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (detail: CertificateDetail) => {
    setEditingDetail(detail);
    setFormData({ title: detail.title });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingDetail) {
        await axios.patch(`/api/teacher/certificate-details/${editingDetail.id}`, formData);
        toast.success("تم تحديث بيانات الشهادة بنجاح");
      } else {
        await axios.post("/api/teacher/certificate-details", formData);
        toast.success("تم إضافة بيانات الشهادة بنجاح");
      }
      setIsDialogOpen(false);
      fetchCertificateDetails();
      setFormData({ title: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حفظ بيانات الشهادة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!detailToDelete) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`/api/teacher/certificate-details/${detailToDelete}`);
      toast.success("تم حذف بيانات الشهادة بنجاح");
      setIsDeleteDialogOpen(false);
      setDetailToDelete(null);
      fetchCertificateDetails();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حذف بيانات الشهادة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            بيانات الشهادات
          </h1>
          <p className="text-muted-foreground mt-2">
            أضف وعدّل بيانات الشهادات المعروضة في صفحة "الشهادات" للطلاب
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-[#052c4b] hover:bg-[#052c4b]/90">
          <Plus className="h-4 w-4 mr-2" />
          إضافة بيانات شهادة
        </Button>
      </div>

      {certificateDetails.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              لا توجد بيانات شهادات متاحة حالياً
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificateDetails.map((detail) => (
            <Card key={detail.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-red-600" />
                  {detail.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(detail)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDetailToDelete(detail.id);
                      setIsDeleteDialogOpen(true);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingDetail ? "تعديل بيانات الشهادة" : "إضافة بيانات شهادة جديدة"}</DialogTitle>
            <DialogDescription>
              {editingDetail ? "عدّل تفاصيل بيانات الشهادة." : "أضف بيانات شهادة جديدة إلى صفحة الشهادات."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="detailTitle">عنوان بيانات الشهادة *</Label>
              <Input
                id="detailTitle"
                value={formData.title}
                onChange={(e) => setFormData({ title: e.target.value })}
                placeholder="أدخل عنوان بيانات الشهادة"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#052c4b] hover:bg-[#052c4b]/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف بيانات الشهادة بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

