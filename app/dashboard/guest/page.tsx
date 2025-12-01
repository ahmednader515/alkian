"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Reservation {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string | null;
  preferredDate: string;
  preferredTime: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function GuestDashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/guest/reservations", { cache: "no-store" });
        const data = await response.json();
        setReservations(data.reservations || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">حجوزاتي</h1>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            لا توجد حجوزات حتى الآن. يمكنك طلب حجز من الصفحة الرئيسية.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  {reservation.studentName}
                </CardTitle>
                <Badge
                  className={
                    reservation.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : reservation.status === "CONFIRMED"
                      ? "bg-green-600 text-white"
                      : reservation.status === "CANCELLED"
                      ? "bg-red-600 text-white"
                      : "bg-gray-500 text-white"
                  }
                >
                  {reservation.status === "PENDING"
                    ? "قيد المراجعة"
                    : reservation.status === "CONFIRMED"
                    ? "تم التأكيد"
                    : reservation.status === "CANCELLED"
                    ? "تم الإلغاء"
                    : reservation.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">التاريخ</span>
                  <span className="font-medium">{formatDate(reservation.preferredDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الوقت</span>
                  <span className="font-medium">{reservation.preferredTime}</span>
                </div>
                {reservation.message && (
                  <div>
                    <div className="text-muted-foreground mb-1">الرسالة</div>
                    <div className="whitespace-pre-wrap">{reservation.message}</div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم الهاتف</span>
                  <span className="font-medium">{reservation.studentPhone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

