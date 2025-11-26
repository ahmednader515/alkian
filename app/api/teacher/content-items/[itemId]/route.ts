import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH update a content item
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
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
    const { itemId } = resolvedParams;
    const { title, content, imageUrl } = await req.json();

    // Check if item exists and belongs to the teacher
    const existingItem = await db.contentItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return new NextResponse("Content item not found", { status: 404 });
    }

    if (existingItem.teacherId !== session.user.id) {
      return new NextResponse("Forbidden - You can only edit your own content", { status: 403 });
    }

    const item = await db.contentItem.update({
      where: { id: itemId },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      },
    });

    return NextResponse.json({ 
      success: true, 
      item,
    });
  } catch (error) {
    console.error("[TEACHER_CONTENT_ITEM_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE a content item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
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
    const { itemId } = resolvedParams;

    // Check if item exists and belongs to the teacher
    const existingItem = await db.contentItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return new NextResponse("Content item not found", { status: 404 });
    }

    if (existingItem.teacherId !== session.user.id) {
      return new NextResponse("Forbidden - You can only delete your own content", { status: 403 });
    }

    await db.contentItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ 
      success: true,
    });
  } catch (error) {
    console.error("[TEACHER_CONTENT_ITEM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

