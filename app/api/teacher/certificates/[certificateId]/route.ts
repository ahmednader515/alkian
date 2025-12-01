import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const { isActive } = await req.json();

    // Check if certificate exists and belongs to the teacher
    const certificate = await db.certificate.findFirst({
      where: {
        id: params.certificateId,
        teacherId: session.user.id,
      },
    });

    if (!certificate) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Update certificate
    const updatedCertificate = await db.certificate.update({
      where: { id: params.certificateId },
      data: { isActive },
    });

    return NextResponse.json({ 
      success: true, 
      certificate: updatedCertificate 
    });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    // Check if certificate exists and belongs to the teacher
    const certificate = await db.certificate.findFirst({
      where: {
        id: params.certificateId,
        teacherId: session.user.id,
      },
    });

    if (!certificate) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Delete certificate (this will cascade delete downloads)
    await db.certificate.delete({
      where: { id: params.certificateId },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Certificate deleted successfully" 
    });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
