"use client";

import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RecaptchaGateProps {
  children: React.ReactNode;
  storageKey?: string;
}

export function RecaptchaGate({ children, storageKey = "recaptcha_verified" }: RecaptchaGateProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Check if user has already verified in this session
    const verified = sessionStorage.getItem(storageKey);
    if (verified === "true") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [storageKey]);

  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      setRecaptchaToken(null);
      return;
    }

    setRecaptchaToken(token);
    setIsVerifying(true);

    try {
      // Verify token with backend
      const response = await fetch("/api/auth/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        // Store verification in sessionStorage
        sessionStorage.setItem(storageKey, "true");
        setIsVerified(true);
      } else {
        // Verification failed, reset reCaptcha
        toast.error("فشل التحقق. الرجاء المحاولة مرة أخرى");
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      }
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      toast.error("حدث خطأ أثناء التحقق");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // Show loading state while checking verification
  if (isVerified === null) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show reCaptcha gate if not verified
  if (!isVerified) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                التحقق من الأمان
              </h2>
              <p className="text-muted-foreground">
                يرجى إكمال التحقق من reCAPTCHA للوصول إلى الموقع
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={handleRecaptchaChange}
              theme="light"
            />
          </div>

          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري التحقق...</span>
            </div>
          )}

          <div className="text-xs text-center text-muted-foreground pt-4 border-t">
            <p>هذا التحقق يساعدنا في حماية الموقع من الروبوتات والهجمات</p>
          </div>
        </div>
      </div>
    );
  }

  // Show content if verified
  return <>{children}</>;
}

