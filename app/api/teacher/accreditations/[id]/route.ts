import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// PATCH - Update an accreditation
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();
    const { title, position } = body;

    // Check if accreditation exists and belongs to teacher
    const existing = await db.accreditation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "الاعتماد غير موجود" }, { status: 404 });
    }

    if (existing.teacherId !== userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const updateData: any = {};
    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
      }
      updateData.title = title.trim();
    }
    if (position !== undefined) {
      updateData.position = position;
    }

    const accreditation = await db.accreditation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true,
      accreditation,
    });
  } catch (error) {
    console.error("[ACCREDITATIONS_PATCH]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الاعتماد" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an accreditation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Check if accreditation exists and belongs to teacher
    const existing = await db.accreditation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "الاعتماد غير موجود" }, { status: 404 });
    }

    if (existing.teacherId !== userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    await db.accreditation.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
    });
  } catch (error) {
    console.error("[ACCREDITATIONS_DELETE]", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الاعتماد" },
      { status: 500 }
    );
  }
}

