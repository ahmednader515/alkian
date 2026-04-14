"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  Award, 
  ChevronDown, 
  GraduationCap, 
  Building2, 
  Shield,
  MessageSquare,
  User,
  Phone,
  CheckCircle,
  Heart,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import CoursesCarousel from "@/components/courses-carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HomePageContent } from "@/lib/home-page-settings";
import { homePageCssVars } from "@/lib/home-page-settings";
import type { LucideIcon } from "lucide-react";

const SESSION_ICONS: Record<string, LucideIcon> = {
  rehabilitation: GraduationCap,
  cupping: Heart,
  massage: Shield,
  spiritual: Heart,
  consultation: MessageSquare,
  personal: User,
};

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
}

interface Accreditation {
  id: string;
  title: string;
}

interface CertificateDetail {
  id: string;
  title: string;
}

interface GeneralService {
  id: string;
  title: string;
}

interface CertificateTemplate {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
}

interface ContentItem {
  id: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  courseId: string | null;
  course: {
    id: string;
    title: string;
    price: number | null;
  } | null;
  questions: {
    id: string;
  }[];
}

interface HomePageClientProps {
  homeContent: HomePageContent;
  courses: Course[];
  accreditations: Accreditation[];
  certificateDetails: CertificateDetail[];
  generalServices: GeneralService[];
  certificateTemplates: CertificateTemplate[];
  aboutUsItems: ContentItem[];
  generalNewsItems: ContentItem[];
  aboutLecturersItems: ContentItem[];
  goalsAchievementsItems: ContentItem[];
  quizzes: Quiz[];
}

export function HomePageClient({ 
  homeContent: content,
  courses,
  accreditations,
  certificateDetails,
  generalServices,
  certificateTemplates,
  aboutUsItems,
  generalNewsItems,
  aboutLecturersItems,
  goalsAchievementsItems,
  quizzes,
}: HomePageClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  // Image zoom state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleQuizClick = (e: React.MouseEvent, quizId: string, courseId: string | null) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }
    const quizUrl = courseId ? `/courses/${courseId}/quizzes/${quizId}` : `/quizzes/${quizId}`;
    router.push(quizUrl);
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

  const handleImageTouchStart = (e: React.TouchEvent, imageUrl: string) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleImageTouchEnd = (e: React.TouchEvent, imageUrl: string) => {
    if (touchStartRef.current && e.changedTouches.length === 1) {
      const touchEnd = e.changedTouches[0];
      const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
        e.preventDefault();
        e.stopPropagation();
        openImageModal(imageUrl);
      }
      touchStartRef.current = null;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollIndicator(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      const offset = servicesSection.offsetTop - 80;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-full w-full bg-background" style={homePageCssVars(content)}>
        <Navbar logoSrc={content.logoUrl} navPrimary={content.themeNavbar} />
      
      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
        style={{
          background: `linear-gradient(to bottom right, ${content.themePrimary}, ${content.themeGradientVia}, ${content.themeGradientTo})`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center justify-center mb-8">
              <div 
                className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer group"
                onClick={() => openImageModal(content.teacherImageUrl)}
                onTouchStart={(e) => handleImageTouchStart(e, content.teacherImageUrl)}
                onTouchEnd={(e) => handleImageTouchEnd(e, content.teacherImageUrl)}
                style={{ touchAction: 'manipulation' }}
              >
                <Image
                  src={content.teacherImageUrl}
                  alt={content.teacherImageAlt}
                  fill
                  className="object-contain bg-white/10 transition-transform group-hover:scale-105 pointer-events-none"
                  priority
                  unoptimized={content.teacherImageUrl.startsWith("http")}
                />
              </div>
              <div className="mt-4 text-center">
                <div className="text-white text-xl md:text-2xl font-semibold">
                  {content.teacherName}
                </div>
                <div className="text-blue-100 text-sm md:text-base mt-1">
                  {content.teacherTitle}
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              {content.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-8">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-[color:var(--home-primary)] hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/sign-up">
                  {content.heroCtaPrimary} <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToServices} className="border-white text-[color:var(--home-primary)] bg-white hover:bg-[var(--home-primary)] hover:text-white text-lg px-8 py-4">
                {content.heroCtaSecondary}
              </Button>
            </div>
          </motion.div>

          {showScrollIndicator && (
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2 cursor-pointer hidden md:flex"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={scrollToServices}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-8 w-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <ChevronDown className="h-8 w-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <ChevronDown className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Services Section - Courses */}
      <section id="services-section" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.servicesTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.servicesSubtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CoursesCarousel 
              courses={courses} 
              title={content.coursesCarouselTitle} 
            />
          </motion.div>
        </div>
      </section>

      {/* Accreditations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.accreditationsTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.accreditationsSubtitle}</p>
          </motion.div>

          {accreditations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {accreditations.map((accreditation, index) => (
                <motion.div
                  key={accreditation.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 bg-[color-mix(in_srgb,var(--home-primary)_12%,transparent)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-[color:var(--home-primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[color:var(--home-primary)]">{accreditation.title}</h3>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
              >
                <div 
                  className="w-20 h-20 mx-auto mb-4 relative cursor-pointer group"
                  onClick={() => openImageModal(content.itcImageUrl)}
                  onTouchStart={(e) => handleImageTouchStart(e, content.itcImageUrl)}
                  onTouchEnd={(e) => handleImageTouchEnd(e, content.itcImageUrl)}
                  style={{ touchAction: 'manipulation' }}
                >
                  <Image
                    src={content.itcImageUrl}
                    alt={content.itcImageAlt}
                    fill
                    className="object-contain transition-transform group-hover:scale-105 pointer-events-none"
                    unoptimized={content.itcImageUrl.startsWith("http")}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[color:var(--home-primary)]">{content.itcTitle}</h3>
                <p className="text-sm text-muted-foreground">{content.itcSubtitle}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-[color-mix(in_srgb,var(--home-primary)_12%,transparent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-[color:var(--home-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[color:var(--home-primary)]">{content.accreditation2Title}</h3>
                <p className="text-sm text-muted-foreground">{content.accreditation2Subtitle}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-[color-mix(in_srgb,var(--home-primary)_12%,transparent)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[color:var(--home-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[color:var(--home-primary)]">{content.accreditation3Title}</h3>
                <p className="text-sm text-muted-foreground">{content.accreditation3Subtitle}</p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.certificatesTitle}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {certificateDetails.length > 0 ? (
              certificateDetails.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all"
                >
                  <Award className="h-5 w-5 text-[color:var(--home-primary)] flex-shrink-0" />
                  <span className="text-sm font-medium">{cert.title}</span>
                </motion.div>
              ))
            ) : (
              [
                "شهادة الاعتماد الدولي",
                "شهادة خبرة من الأكاديمية",
                "شهادة تخرج بسريل نمبر",
                "كارنيه تخصص",
                "كارنيه النقابة",
                "شهادة قيد من النقابة",
                "شهادة الجامعة الأمريكية",
                "ماجستير مهني",
                "دكتوراه مهنية",
                "دكتوراه بحثية",
                "توثيق الخارجية والقنصلية",
                "شهادات مفتوحة الخبرة"
              ].map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all"
                >
                  <Award className="h-5 w-5 text-[color:var(--home-primary)] flex-shrink-0" />
                  <span className="text-sm font-medium">{cert}</span>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">{content.certificatesMoreLabel}</p>
            <a 
              href="https://wa.me/201146450551" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <Phone className="h-5 w-5" />
              {content.certificatesWhatsappLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Sessions Booking Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.sessionsTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.sessionsSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.sessionCards.map((session, index) => {
              const SessionIcon = SESSION_ICONS[session.id] ?? GraduationCap;
              return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[color-mix(in_srgb,var(--home-primary)_12%,transparent)] rounded-full flex items-center justify-center">
                    <SessionIcon className="h-6 w-6 text-[color:var(--home-primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold">{session.name}</h3>
                </div>
                <Button asChild className="w-full bg-[var(--home-primary)] hover:opacity-90">
                  <Link href={`/reservation/${session.id}`}>
                    {content.sessionBookLabel}
                  </Link>
                </Button>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* General Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.generalServicesTitle}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {generalServices.length > 0 ? (
              generalServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all"
                >
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg font-medium">{service.title}</span>
                </motion.div>
              ))
            ) : (
              [
                "خدمة المحاضرات المجانية",
                "خدمة استشارة في الكورسات مجانية",
                "خدمة حضور مؤتمر مجاني",
                "خدمات عامة أخرى"
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all"
                >
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg font-medium">{service}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Certificate Templates Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.certificateTemplatesTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.certificateTemplatesSubtitle}</p>
          </motion.div>
          {certificateTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {certificateTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {template.imageUrl && (
                    <div 
                      className="relative w-full h-48 cursor-pointer group overflow-hidden"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openImageModal(template.imageUrl!);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchStart(e, template.imageUrl!);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchEnd(e, template.imageUrl!);
                      }}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Image
                        src={template.imageUrl}
                        alt={template.title || "نموذج شهادة"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                        unoptimized={template.imageUrl?.startsWith("http") ?? false}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    {template.title && (
                      <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                    )}
                    {template.description && (
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
              <p className="text-center text-muted-foreground">سيتم إضافة نماذج الشهادات هنا</p>
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.aboutUsTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.aboutUsSubtitle}</p>
          </motion.div>
          {aboutUsItems.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {aboutUsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-8 border shadow-sm"
                >
                  {item.title && (
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  )}
                  {item.imageUrl && (
                    <div 
                      className="relative w-full h-64 mb-4 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openImageModal(item.imageUrl!);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchStart(e, item.imageUrl!);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchEnd(e, item.imageUrl!);
                      }}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "صورة"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  <div 
                    className="prose prose-lg max-w-none [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG') {
                        e.preventDefault();
                        e.stopPropagation();
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
                      if (target.tagName === 'IMG' && touchStartRef.current && e.changedTouches.length === 1) {
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
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
              <p className="text-center text-muted-foreground">سيتم إضافة معلومات عن المركز هنا</p>
            </div>
          )}
        </div>
      </section>

      {/* Online Course Registration Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.onlineCourseTitle}</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto text-center">
            <Button asChild size="lg" className="bg-[var(--home-primary)] hover:opacity-90 text-lg px-8 py-4">
              <Link href="/reservation/online-course">
                {content.onlineCourseButton}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Membership and Job Application Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.membershipTitle}</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto text-center">
            <Button asChild size="lg" className="bg-[var(--home-primary)] hover:opacity-90 text-lg px-8 py-4">
              <Link href="/reservation/membership">
                {content.membershipButton}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* General News Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.newsTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.newsSubtitle}</p>
          </motion.div>
          {generalNewsItems.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {generalNewsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-8 border shadow-sm"
                >
                  {item.title && (
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  )}
                  {item.imageUrl && (
                    <div 
                      className="relative w-full h-64 mb-4 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openImageModal(item.imageUrl!);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchStart(e, item.imageUrl!);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchEnd(e, item.imageUrl!);
                      }}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "صورة"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  <div 
                    className="prose prose-lg max-w-none [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG') {
                        e.preventDefault();
                        e.stopPropagation();
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
                      if (target.tagName === 'IMG' && touchStartRef.current && e.changedTouches.length === 1) {
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
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
              <p className="text-center text-muted-foreground">سيتم إضافة الأخبار هنا</p>
            </div>
          )}
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.quizzesTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.quizzesSubtitle}</p>
          </motion.div>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-[color:var(--home-primary)]">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {quiz.description}
                        </p>
                      )}
                      {quiz.course && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {content.fromCoursePrefix} {quiz.course.title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {content.questionCountPrefix} {quiz.questions.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm font-medium text-[color:var(--home-primary)]">
                      {content.quizzesFreeLabel}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-[var(--home-primary)] hover:opacity-90"
                      onClick={(e) => handleQuizClick(e, quiz.id, quiz.courseId)}
                    >
                      {content.quizzesStartButton}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
              <p className="text-center text-muted-foreground">لا توجد اختبارات متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* About Lecturers Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.lecturersTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.lecturersSubtitle}</p>
          </motion.div>
          {aboutLecturersItems.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {aboutLecturersItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-8 border shadow-sm"
                >
                  {item.title && (
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  )}
                  {item.imageUrl && (
                    <div 
                      className="relative w-full h-64 mb-4 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openImageModal(item.imageUrl!);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchStart(e, item.imageUrl!);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchEnd(e, item.imageUrl!);
                      }}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "صورة"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  <div 
                    className="prose prose-lg max-w-none [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG') {
                        e.preventDefault();
                        e.stopPropagation();
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
                      if (target.tagName === 'IMG' && touchStartRef.current && e.changedTouches.length === 1) {
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
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
              <p className="text-center text-muted-foreground">سيتم إضافة معلومات المحاضرين هنا</p>
            </div>
          )}
        </div>
      </section>

      {/* Renewal Request Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.renewalTitle}</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto text-center">
            <Button asChild size="lg" className="bg-[var(--home-primary)] hover:opacity-90 text-lg px-8 py-4">
              <Link href="/reservation/renewal">
                {content.renewalButton}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Goals and Achievements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.goalsTitle}</h2>
            <p className="text-muted-foreground text-lg">{content.goalsSubtitle}</p>
          </motion.div>
          {goalsAchievementsItems.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {goalsAchievementsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-8 border shadow-sm"
                >
                  {item.title && (
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  )}
                  {item.imageUrl && (
                    <div 
                      className="relative w-full h-64 mb-4 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openImageModal(item.imageUrl!);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchStart(e, item.imageUrl!);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageTouchEnd(e, item.imageUrl!);
                      }}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "صورة"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  <div 
                    className="prose prose-lg max-w-none [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG') {
                        e.preventDefault();
                        e.stopPropagation();
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
                      if (target.tagName === 'IMG' && touchStartRef.current && e.changedTouches.length === 1) {
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
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
              <p className="text-center text-muted-foreground">سيتم إضافة الأهداف والإنجازات هنا</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{
          background: `linear-gradient(to right, ${content.themePrimary}, ${content.themeGradientVia})`,
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{content.ctaTitle}</h2>
            <p className="text-blue-100 mb-8 text-lg">
              {content.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-[color:var(--home-primary)] hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/sign-up">
                  {content.ctaPrimary} <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-[color:var(--home-primary)] bg-white hover:bg-[var(--home-primary)] hover:text-white text-lg px-8 py-4">
                {content.ctaSecondary}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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

