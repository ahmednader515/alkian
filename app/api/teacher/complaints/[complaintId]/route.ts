import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH - Update complaint status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ complaintId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { status } = await req.json();

    const validStatuses = ["PENDING", "REVIEWED", "RESOLVED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "حالة غير صالحة" },
        { status: 400 }
      );
    }

    const existingComplaint = await db.complaint.findUnique({
      where: {
        id: resolvedParams.complaintId,
      },
    });

    if (!existingComplaint) {
      return NextResponse.json(
        { error: "الشكوى غير موجودة" },
        { status: 404 }
      );
    }

    const updatedComplaint = await db.complaint.update({
      where: {
        id: resolvedParams.complaintId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ complaint: updatedComplaint });

  } catch (error) {
    console.error("[COMPLAINT_UPDATE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الشكوى" },
      { status: 500 }
    );
  }
}

// DELETE - Delete complaint
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ complaintId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const resolvedParams = await params;

    const existingComplaint = await db.complaint.findUnique({
      where: {
        id: resolvedParams.complaintId,
      },
    });

    if (!existingComplaint) {
      return NextResponse.json(
        { error: "الشكوى غير موجودة" },
        { status: 404 }
      );
    }

    await db.complaint.delete({
      where: {
        id: resolvedParams.complaintId,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[COMPLAINT_DELETE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الشكوى" },
      { status: 500 }
    );
  }
}
