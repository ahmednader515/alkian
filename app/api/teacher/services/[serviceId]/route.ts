import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH - Update service
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
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
    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "العنوان مطلوب" },
        { status: 400 }
      );
    }

    const existingService = await db.service.findUnique({
      where: {
        id: resolvedParams.serviceId,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 404 }
      );
    }

    const updatedService = await db.service.update({
      where: {
        id: resolvedParams.serviceId,
      },
      data: {
        title: title.trim(),
      },
    });

    return NextResponse.json({ service: updatedService });
  } catch (error) {
    console.error("[TEACHER_SERVICE_UPDATE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الخدمة" },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
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

    const existingService = await db.service.findUnique({
      where: {
        id: resolvedParams.serviceId,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 404 }
      );
    }

    await db.service.delete({
      where: {
        id: resolvedParams.serviceId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEACHER_SERVICE_DELETE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الخدمة" },
      { status: 500 }
    );
  }
}
