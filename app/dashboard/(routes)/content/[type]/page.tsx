"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface CertificateTemplate {
  id: string;
  title: string | null;
  imageUrl: string;
  description: string | null;
}

interface ContentItem {
  id: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
}

const contentTypes: Record<string, { title: string }> = {
  "certificate-templates": {
    title: "نموذج للشهادات",
  },
  "about-us": {
    title: "اعرفنا أكثر",
  },
  "general-news": {
    title: "أخبار عامة",
  },
  "about-lecturers": {
    title: "نبذة عن المحاضرين",
  },
  "goals-achievements": {
    title: "هدفنا وإنجازاتنا",
  },
  "our-branches": {
    title: "فروعنا",
  },
  "membership-job-request": {
    title: "طلب عضوية و وظيفة",
  },
  "renewal-request": {
    title: "طلب تجديد",
  },
};

export default function ContentViewPage() {
  const params = useParams();
  const type = params.type as string;
  const contentType = contentTypes[type] || { title: "المحتوى" };

  const [content, setContent] = useState<any>(null);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const contentTypesWithMultipleItems = ["about-us", "general-news", "about-lecturers", "goals-achievements", "our-branches"];

  useEffect(() => {
    if (type === "certificate-templates") {
      fetchTemplates();
    } else if (contentTypesWithMultipleItems.includes(type)) {
      fetchContentItems();
    } else {
      fetchContent();
    }
  }, [type]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/certificate-templates");
      setTemplates(response.data.templates || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب النماذج");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContentItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/content-items/${type}`);
      setContentItems(response.data.items || []);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء جلب المحتوى");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/content/${type}`);
      if (response.data.content) {
        setContent(response.data.content);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setContent(null);
      } else {
        toast.error("حدث خطأ أثناء جلب المحتوى");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedImage) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Touch handler for opening image modal on mobile
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleImageTouchStart = (e: React.TouchEvent, imageUrl: string) => {
    // Store touch start position and time
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleImageTouchEnd = (e: React.TouchEvent, imageUrl: string) => {
    // Only open modal if it was a tap (not a scroll)
    if (touchStartRef.current && e.changedTouches.length === 1) {
      const touchEnd = e.changedTouches[0];
      const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      // If movement is small and time is short, it's a tap
      if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
        e.preventDefault();
        e.stopPropagation();
        openImageModal(imageUrl);
      }
      touchStartRef.current = null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b]"></div>
      </div>
    );
  }

  // Certificate templates gallery view
  if (type === "certificate-templates") {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {contentType.title}
          </h1>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للخلف
            </Link>
          </Button>
        </div>

        {templates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                لا توجد نماذج شهادات متاحة حالياً
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="relative aspect-[4/3] bg-muted cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openImageModal(template.imageUrl);
                  }}
                >
                  <Image
                    src={template.imageUrl}
                    alt={template.title || "نموذج شهادة"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <CardHeader>
                  {template.title && (
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  )}
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {template.description}
                    </p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Image Zoom Modal */}
        <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
            <DialogTitle className="sr-only">صورة مكبرة</DialogTitle>
            <div className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closeImageModal}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <div className="absolute top-4 left-4 z-50 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleReset}
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              </div>

              <div
                className="w-full h-full flex items-center justify-center"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                {selectedImage && (
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Zoomed image"
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                      transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Content items gallery view (about-us, general-news, about-lecturers, goals-achievements)
  if (contentTypesWithMultipleItems.includes(type)) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {contentType.title}
          </h1>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للخلف
            </Link>
          </Button>
        </div>

        {contentItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                لا يوجد محتوى متاح حالياً
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <div 
                    className="relative aspect-video bg-muted cursor-pointer group"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openImageModal(item.imageUrl!);
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "صورة المحتوى"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
                <CardHeader>
                  {item.title && (
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert line-clamp-4 [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG' && target.getAttribute('src')) {
                        openImageModal(target.getAttribute('src')!);
                      }
                    }}
                    onTouchStart={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG' && e.touches.length === 1) {
                        touchStartRef.current = {
                          x: e.touches[0].clientX,
                          y: e.touches[0].clientY,
                          time: Date.now(),
                        };
                      }
                    }}
                    onTouchEnd={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG' && target.getAttribute('src') && touchStartRef.current && e.changedTouches.length === 1) {
                        const touchEnd = e.changedTouches[0];
                        const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
                        const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
                        const deltaTime = Date.now() - touchStartRef.current.time;
                        
                        if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
                          e.preventDefault();
                          e.stopPropagation();
                          openImageModal(target.getAttribute('src')!);
                        }
                        touchStartRef.current = null;
                      }
                    }}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.content.substring(0, 200) }} />
                    {item.content.length > 200 && <span>...</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Image Zoom Modal */}
        <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
            <DialogTitle className="sr-only">صورة مكبرة</DialogTitle>
            <div className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closeImageModal}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <div className="absolute top-4 left-4 z-50 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleReset}
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              </div>

              <div
                className="w-full h-full flex items-center justify-center"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                {selectedImage && (
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Zoomed image"
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                      transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                    draggable={false}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Legacy single content view (for backward compatibility)
  return (
    <>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {contentType.title}
          </h1>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للخلف
            </Link>
          </Button>
        </div>

        {content ? (
          <Card>
            <CardHeader>
              {content.title && (
                <CardTitle className="text-2xl">{content.title}</CardTitle>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {content.imageUrl && (
                <div 
                  className="relative w-full h-64 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openImageModal(content.imageUrl);
                  }}
                >
                  <Image
                    src={content.imageUrl}
                    alt={content.title || contentType.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'IMG' && target.getAttribute('src')) {
                    openImageModal(target.getAttribute('src')!);
                  }
                }}
                onTouchStart={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'IMG' && e.touches.length === 1) {
                    touchStartRef.current = {
                      x: e.touches[0].clientX,
                      y: e.touches[0].clientY,
                      time: Date.now(),
                    };
                  }
                }}
                onTouchEnd={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'IMG' && target.getAttribute('src') && touchStartRef.current && e.changedTouches.length === 1) {
                    const touchEnd = e.changedTouches[0];
                    const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
                    const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
                    const deltaTime = Date.now() - touchStartRef.current.time;
                    
                    if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
                      e.preventDefault();
                      e.stopPropagation();
                      openImageModal(target.getAttribute('src')!);
                    }
                    touchStartRef.current = null;
                  }
                }}
                style={{ touchAction: 'manipulation' }}
              >
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                لا يوجد محتوى متاح حالياً
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Zoom Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">صورة مكبرة</DialogTitle>
          <div className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeImageModal}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleReset}
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>

            <div
              className="w-full h-full flex items-center justify-center"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              {selectedImage && (
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Zoomed image"
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                  draggable={false}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

