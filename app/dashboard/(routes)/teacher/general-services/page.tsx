"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Plus, Edit, Trash2, Save, X } from "lucide-react";
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

interface GeneralService {
  id: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export default function GeneralServicesPage() {
  const [generalServices, setGeneralServices] = useState<GeneralService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<GeneralService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGeneralServices();
  }, []);

  const fetchGeneralServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/teacher/general-services");
      setGeneralServices(response.data.generalServices || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب الخدمات العامة");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingService(null);
    setFormData({ title: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (service: GeneralService) => {
    setEditingService(service);
    setFormData({ title: service.title });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        await axios.patch(`/api/teacher/general-services/${editingService.id}`, formData);
        toast.success("تم تحديث الخدمة العامة بنجاح");
      } else {
        await axios.post("/api/teacher/general-services", formData);
        toast.success("تم إضافة الخدمة العامة بنجاح");
      }
      setIsDialogOpen(false);
      fetchGeneralServices();
      setFormData({ title: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حفظ الخدمة العامة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`/api/teacher/general-services/${serviceToDelete}`);
      toast.success("تم حذف الخدمة العامة بنجاح");
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
      fetchGeneralServices();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء حذف الخدمة العامة");
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
            الخدمات العامة
          </h1>
          <p className="text-muted-foreground mt-2">
            أضف وعدّل الخدمات العامة المعروضة في صفحة "الخدمات العامة" للطلاب
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-[#052c4b] hover:bg-[#052c4b]/90">
          <Plus className="h-4 w-4 mr-2" />
          إضافة خدمة عامة
        </Button>
      </div>

      {generalServices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              لا توجد خدمات عامة متاحة حالياً
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-600" />
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(service)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setServiceToDelete(service.id);
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
            <DialogTitle>{editingService ? "تعديل الخدمة العامة" : "إضافة خدمة عامة جديدة"}</DialogTitle>
            <DialogDescription>
              {editingService ? "عدّل تفاصيل الخدمة العامة." : "أضف خدمة عامة جديدة إلى صفحة الخدمات العامة."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceTitle">عنوان الخدمة العامة *</Label>
              <Input
                id="serviceTitle"
                value={formData.title}
                onChange={(e) => setFormData({ title: e.target.value })}
                placeholder="أدخل عنوان الخدمة العامة"
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
              سيتم حذف الخدمة العامة بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
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

