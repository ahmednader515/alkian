import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Generate a random promo code
function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "TEACHER") {
      return new NextResponse("Forbidden - Teacher access required", { status: 403 });
    }

    const { title, description, fileUrl, maxDownloads, expiresAt } = await req.json();

    if (!title || !fileUrl) {
      return new NextResponse("Title and file URL are required", { status: 400 });
    }

    // Generate unique promo code
    let promoCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      promoCode = generatePromoCode();
      const existing = await db.certificate.findUnique({
        where: { promoCode }
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return new NextResponse("Failed to generate unique promo code", { status: 500 });
    }

    // Create certificate
    const certificate = await db.certificate.create({
      data: {
        title,
        description,
        fileUrl,
        promoCode: promoCode!,
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
