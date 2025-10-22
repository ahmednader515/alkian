import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { promoCode, studentName, studentEmail } = await req.json();

    if (!promoCode) {
      return new NextResponse("Promo code is required", { status: 400 });
    }

    // Find certificate by promo code
    const certificate = await db.certificate.findUnique({
      where: {
        promoCode,
        isActive: true,
      },
    });

    if (!certificate) {
      return new NextResponse("Invalid or expired promo code", { status: 404 });
    }

    // Check if certificate has expired
    if (certificate.expiresAt && new Date() > certificate.expiresAt) {
      return new NextResponse("Certificate has expired", { status: 400 });
    }

    // Check if max downloads reached
    if (certificate.maxDownloads && certificate.downloadCount >= certificate.maxDownloads) {
      return new NextResponse("Certificate download limit reached", { status: 400 });
    }

    // Record the download
    const download = await db.certificateDownload.create({
      data: {
        certificateId: certificate.id,
        studentName: studentName || null,
        studentEmail: studentEmail || null,
      },
    });

    // Update download count
    await db.certificate.update({
      where: { id: certificate.id },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        title: certificate.title,
        description: certificate.downloadCount,
        fileUrl: certificate.fileUrl,
        downloadId: download.id,
      }
    });
  } catch (error) {
    console.error("[CERTIFICATE_VALIDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
