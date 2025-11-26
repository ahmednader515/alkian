"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Eye,
  Trash2,
  RefreshCw,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Complaint {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  message: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  PENDING: { 
    label: "في الانتظار", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: AlertCircle
  },
  REVIEWED: { 
    label: "قيد المراجعة", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: Eye
  },
  RESOLVED: { 
    label: "تم الحل", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: CheckCircle
  },
};

export default function TeacherComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "REVIEWED" | "RESOLVED">("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/complaints?status=${filter === "ALL" ? "" : filter}`);
      setComplaints(response.data.complaints || []);
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
      toast.error(error?.response?.data?.error || "حدث خطأ أثناء جلب الشكاوى");
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/teacher/complaints/${complaintId}`, {
        status: newStatus
      });
      
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus as any }
            : complaint
        )
      );
      
      toast.success("تم تحديث حالة الشكوى بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة الشكوى");
    }
  };

  const handleDelete = async (complaintId: string) => {
    setIsDeleting(complaintId);
    try {
      await axios.delete(`/api/teacher/complaints/${complaintId}`);
      toast.success("تم حذف الشكوى بنجاح");
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الشكوى");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const filteredComplaints = complaints;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">الشكاوى</h1>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">جميع الشكاوى</SelectItem>
            <SelectItem value="PENDING">في الانتظار</SelectItem>
            <SelectItem value="REVIEWED">قيد المراجعة</SelectItem>
            <SelectItem value="RESOLVED">تم الحل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              لا توجد شكاوى متاحة حالياً
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => {
            const StatusIcon = statusConfig[complaint.status].icon;
            
            return (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{complaint.studentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(complaint.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig[complaint.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[complaint.status].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{complaint.studentPhone}</span>
                    </div>
                    
                    {complaint.studentEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{complaint.studentEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-medium mb-1">رسالة الشكوى:</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{complaint.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">في الانتظار</SelectItem>
                        <SelectItem value="REVIEWED">قيد المراجعة</SelectItem>
                        <SelectItem value="RESOLVED">تم الحل</SelectItem>
                      </SelectContent>
                    </Select>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting === complaint.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف هذه الشكوى بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(complaint.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting === complaint.id ? "جاري الحذف..." : "حذف"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
