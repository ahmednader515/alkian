import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH update a certificate template
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const resolvedParams = await params;
    const { templateId } = resolvedParams;
    const { title, imageUrl, description } = await req.json();

    // Check if template exists and belongs to the teacher
    const existingTemplate = await db.certificateTemplate.findUnique({
      where: { id: templateId },
    });

    if (!existingTemplate) {
      return new NextResponse("Template not found", { status: 404 });
    }

    if (existingTemplate.teacherId !== session.user.id) {
      return new NextResponse("Forbidden - You can only edit your own templates", { status: 403 });
    }

    const template = await db.certificateTemplate.update({
      where: { id: templateId },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(description !== undefined && { description: description || null }),
      },
    });

    return NextResponse.json({ 
      success: true, 
      template,
    });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_TEMPLATE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE a certificate template
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const resolvedParams = await params;
    const { templateId } = resolvedParams;

    // Check if template exists and belongs to the teacher
    const existingTemplate = await db.certificateTemplate.findUnique({
      where: { id: templateId },
    });

    if (!existingTemplate) {
      return new NextResponse("Template not found", { status: 404 });
    }

    if (existingTemplate.teacherId !== session.user.id) {
      return new NextResponse("Forbidden - You can only delete your own templates", { status: 403 });
    }

    await db.certificateTemplate.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ 
      success: true,
    });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_TEMPLATE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

