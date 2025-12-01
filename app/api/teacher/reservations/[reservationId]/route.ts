import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { error: "حالة غير صحيحة" },
        { status: 400 }
      );
    }

    // Check if reservation exists
    const existingReservation = await db.reservation.findUnique({
      where: {
        id: resolvedParams.reservationId,
      },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "طلب الحجز غير موجود" },
        { status: 404 }
      );
    }

    // Update the reservation
    const updatedReservation = await db.reservation.update({
      where: { id: resolvedParams.reservationId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      reservation: updatedReservation,
    });

  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث طلب الحجز" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const resolvedParams = await params;

    // Check if reservation exists
    const existingReservation = await db.reservation.findUnique({
      where: {
        id: resolvedParams.reservationId,
      },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "طلب الحجز غير موجود" },
        { status: 404 }
      );
    }

    // Delete the reservation
    await db.reservation.delete({
      where: { id: resolvedParams.reservationId },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف طلب الحجز بنجاح",
    });

  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف طلب الحجز" },
      { status: 500 }
    );
  }
}
