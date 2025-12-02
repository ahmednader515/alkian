import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const { title, description, fileUrl, promoCode, maxDownloads, expiresAt } = await req.json();

    if (!title || !fileUrl || !promoCode) {
      return new NextResponse("Title, file URL, and promo code are required", { status: 400 });
    }

    // Validate and check if promo code is unique
    const trimmedPromoCode = promoCode.trim().toUpperCase();
    
    if (trimmedPromoCode.length === 0) {
      return new NextResponse("Promo code cannot be empty", { status: 400 });
    }

    const existing = await db.certificate.findUnique({
      where: { promoCode: trimmedPromoCode }
    });

    if (existing) {
      return new NextResponse("This promo code is already in use. Please choose a different one.", { status: 400 });
    }

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        title,
        description,
        fileUrl,
        promoCode: trimmedPromoCode,
        teacherId: session.user.id,
        maxDownloads: maxDownloads ? parseInt(maxDownloads) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      certificate: {
        id: certificate.id,
        title: certificate.title,
        promoCode: certificate.promoCode,
        downloadCount: certificate.downloadCount,
        maxDownloads: certificate.maxDownloads,
        isActive: certificate.isActive,
        expiresAt: certificate.expiresAt,
        createdAt: certificate.createdAt,
      }
    });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATE_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const certificates = await db.certificate.findMany({
      where: {
        teacherId: session.user.id,
      },
      include: {
        downloads: {
          orderBy: {
            downloadedAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            downloads: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("[TEACHER_CERTIFICATES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
