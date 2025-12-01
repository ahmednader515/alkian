"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Reservation {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  governorate?: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  reservationType: string;
  courseId?: string;
  course?: { title: string };
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

const reservationTypeLabels: Record<string, string> = {
  GENERAL: "عام",
  REHABILITATION: "جلسة تأهيل",
  CUPPING: "جلسة حجامة",
  MASSAGE: "جلسة تدليك",
  SPIRITUAL: "جلسة روحانية",
  CONSULTATION: "استشارة",
  PERSONAL: "مقابلة شخصية",
  ONLINE_COURSE: "تسجيل كورس أون لاين",
  MEMBERSHIP: "طلب عضوية/وظيفة",
  RENEWAL: "طلب تجديد",
};

const statusConfig = {
  PENDING: { 
    label: "في الانتظار", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    icon: AlertCircle
  },
  CONFIRMED: { 
    label: "مؤكد", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: CheckCircle
  },
  CANCELLED: { 
    label: "ملغي", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    icon: XCircle
  },
  COMPLETED: { 
    label: "مكتمل", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: CheckCircle
  },
};

export default function TeacherReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED">("ALL");

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/reservations");
      setReservations(response.data.reservations);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب طلبات الحجز");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/teacher/reservations/${reservationId}`, {
        status: newStatus
      });
      
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: newStatus as any }
            : res
        )
      );
      
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    
    try {
      await axios.delete(`/api/teacher/reservations/${reservationId}`);
      
      setReservations(prev => 
        prev.filter(res => res.id !== reservationId)
      );
      
      toast.success("تم حذف الطلب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الطلب");
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    filter === "ALL" || reservation.status === filter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "gregory"
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "مساءً" : "صباحاً";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[#052c4b]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة طلبات الحجز
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع طلبات الحجز من الطلاب
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#052c4b]"
          >
            <option value="ALL">جميع الطلبات</option>
            <option value="PENDING">في الانتظار</option>
            <option value="CONFIRMED">مؤكدة</option>
            <option value="CANCELLED">ملغية</option>
            <option value="COMPLETED">مكتملة</option>
          </select>
          
          <Button onClick={fetchReservations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              لا توجد طلبات حجز
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              {filter === "ALL" 
                ? "لم يتم إرسال أي طلبات حجز بعد"
                : `لا توجد طلبات بحالة "${statusConfig[filter as keyof typeof statusConfig]?.label}"`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredReservations.map((reservation) => {
            const StatusIcon = statusConfig[reservation.status].icon;
            
            return (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#052c4b]/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#052c4b]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{reservation.studentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {reservationTypeLabels[reservation.reservationType] || reservation.reservationType}
                          {reservation.governorate && ` - ${reservation.governorate}`}
                        </p>
                        {reservation.preferredDate && reservation.preferredTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(reservation.preferredDate)} - {formatTime(reservation.preferredTime)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig[reservation.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[reservation.status].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.studentPhone}</span>
                    </div>
                    
                    {reservation.governorate && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>المحافظة: {reservation.governorate}</span>
                      </div>
                    )}
                    
                    {reservation.studentEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.studentEmail}</span>
                      </div>
                    )}
                    
                    {reservation.course && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>الكورس: {reservation.course.title}</span>
                      </div>
                    )}
                    
                    {reservation.preferredDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(reservation.preferredDate)}</span>
                      </div>
                    )}
                    
                    {reservation.preferredTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(reservation.preferredTime)}</span>
                      </div>
                    )}
                  </div>
                  
                  {reservation.message && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground">{reservation.message}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {reservation.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(reservation.id, "CONFIRMED")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          تأكيد
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(reservation.id, "CANCELLED")}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          إلغاء
                        </Button>
                      </>
                    )}
                    
                    {reservation.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(reservation.id, "COMPLETED")}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        تم الانتهاء
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteReservation(reservation.id)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
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
