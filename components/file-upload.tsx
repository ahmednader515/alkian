"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/lib/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, X, Image as ImageIcon, FileText } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value?: string;
    endpoint: keyof typeof ourFileRouter;
    accept?: string;
}

export const FileUpload = ({
    onChange,
    value,
    endpoint,
    accept = "image/*"
}: FileUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadComplete = (res: any) => {
        setIsUploading(false);
        if (res && res[0]) {
            const url = res[0].ufsUrl || res[0].url;
            onChange(url);
            toast.success("تم رفع الملف بنجاح");
        }
    };

    const handleUploadError = (error: Error) => {
        setIsUploading(false);
        toast.error(`خطأ في رفع الملف: ${error?.message}`);
    };

    const handleRemove = () => {
        onChange(undefined);
        toast.success("تم حذف الملف");
    };

    if (value) {
        return (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                {value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <ImageIcon className="h-6 w-6 text-green-600" />
                                ) : value.match(/\.(pdf)$/i) ? (
                                    <FileText className="h-6 w-6 text-red-600" />
                                ) : (
                                    <FileText className="h-6 w-6 text-green-600" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    تم رفع الملف بنجاح
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    {value.match(/\.(pdf)$/i) ? "ملف PDF" : "ملف صورة"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                onUploadBegin={() => setIsUploading(true)}
                appearance={{
                    container: "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors",
                    uploadIcon: "text-gray-400",
                    label: "text-gray-600 font-medium",
                    allowedContent: "text-gray-500 text-sm",
                }}
                content={{
                    uploadIcon: isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                    ) : undefined,
                    label: isUploading ? "جاري رفع الملف..." : "اسحب الملف هنا أو اضغط للاختيار",
                    allowedContent: accept === "image/*" ? "PNG, JPG, WEBP حتى 10MB" : accept === "application/pdf" ? "PDF حتى 10MB" : "PNG, JPG, WEBP, PDF حتى 10MB",
                }}
            />
        </div>
    );
}