"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, BookOpen, Award, ChevronDown, Heart, Shield, CheckCircle, GraduationCap, Award as AwardIcon, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";
import ServicesCarousel from "@/components/services-carousel";
import { ReservationSection } from "@/components/reservation-section";

export default function HomePage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollIndicator(entry.isIntersecting);
      },
      {
        threshold: 0.5, // Trigger when 50% of the hero section is visible
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
      const offset = servicesSection.offsetTop - 80; // Adjust for navbar height
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  const complementaryServices = [
    { name: "الحجامة", icon: Heart, description: "علاج تقليدي فعال للعديد من الأمراض" },
    { name: "التدليك", icon: Shield, description: "جلسات تدليك علاجية متخصصة" },
    { name: "الإبر الصينية", icon: Award, description: "علاج بالوخز بالإبر الصينية" },
    { name: "الفوطة النارية", icon: Heart, description: "علاج بالحرارة والتدفئة" },
    { name: "مصل النحل", icon: Shield, description: "علاج طبيعي بمصل النحل" },
    { name: "دودة العلق", icon: Award, description: "علاج تقليدي بدودة العلق" },
    { name: "الموكسا الصينية", icon: Heart, description: "علاج بالحرارة والأعشاب" },
    { name: "السوجوك", icon: Shield, description: "علاج بالضغط على نقاط اليد والقدم" },
    { name: "الريكي", icon: Award, description: "علاج بالطاقة والشفاء" },
    { name: "الكايروبراكتيك", icon: Heart, description: "علاج العمود الفقري والمفاصل" },
    { name: "العناية بالبشرة والشعر", icon: Shield, description: "علاجات طبيعية للعناية بالجمال" },
    { name: "التغذية العامة", icon: Award, description: "استشارات غذائية متخصصة" }
  ];

  const sportsServices = [
    { name: "تأهيل الإصابات الرياضية", icon: Shield, description: "برامج تأهيل متخصصة للإصابات الرياضية" },
    { name: "تحسين الأداء الرياضي", icon: Award, description: "برامج تدريبية لتحسين الأداء" },
    { name: "العلاج الطبيعي", icon: Heart, description: "جلسات علاج طبيعي متخصصة" },
    { name: "التدريب الوظيفي", icon: Shield, description: "برامج تدريب وظيفي للرياضيين" }
  ];

  return (
    <div className="h-full w-full bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0 bg-gradient-to-br from-[#052c4b] via-[#1e3a8a] to-[#3b82f6]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              مركز الكيان للتأهيل والتدريب
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-8">
              جميع مجالات الطب التكميلي والتأهيل الرياضي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-[#052c4b] hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/sign-up">
                  ابدأ رحلتك معنا <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToServices} className="border-white text-[#052c4b] bg-white hover:bg-[#052c4b] hover:text-white text-lg px-8 py-4">
                اكتشف خدماتنا
              </Button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
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

      {/* Services Section */}
      <section id="services-section" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">خدماتنا المتخصصة</h2>
            <p className="text-muted-foreground text-lg">نقدم مجموعة شاملة من خدمات الطب التكميلي والتأهيل الرياضي</p>
          </motion.div>

          {/* Complementary Medicine Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <ServicesCarousel 
              services={complementaryServices} 
              title="الطب التكميلي" 
            />
          </motion.div>

          {/* Sports Rehabilitation Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ServicesCarousel 
              services={sportsServices} 
              title="التأهيل الرياضي" 
            />
          </motion.div>
        </div>
      </section>

      {/* Certifications and Accreditations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الشهادات والاعتمادات</h2>
            <p className="text-muted-foreground text-lg">نفتخر بحصولنا على اعتمادات من أرقى المؤسسات المحلية والدولية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ITC Partnership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <Image
                  src="/ITC.png"
                  alt="ITC UK"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#052c4b]">إعتماد كلية التدريب الدولي البريطاني</h3>
              <p className="text-sm text-muted-foreground">بإنجلترا - شريك معتمد</p>
            </motion.div>

            {/* Professional Union */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-[#052c4b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#052c4b]">اعتماد نقابة العاملين</h3>
              <p className="text-sm text-muted-foreground">بالمهن التجميلية</p>
            </motion.div>

            {/* Social Solidarity Ministry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#052c4b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#052c4b]">اعتماد وزارة التضامن الاجتماعي</h3>
              <p className="text-sm text-muted-foreground">شهادة اعتماد رسمية</p>
            </motion.div>

            {/* Investment Ministry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AwardIcon className="h-8 w-8 text-[#052c4b]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#052c4b]">اعتماد وزارة الاستثمار</h3>
              <p className="text-sm text-muted-foreground">سجل تجاري وبطاقة ضريبية ورقم ترخيص أمني</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختارنا؟</h2>
            <p className="text-muted-foreground text-lg">نقدم خدمات متميزة بمعايير عالمية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#052c4b]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">خبرة متخصصة</h3>
              <p className="text-muted-foreground">فريق من المتخصصين المؤهلين في جميع مجالات الطب التكميلي</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-[#052c4b]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">شهادات معتمدة</h3>
              <p className="text-muted-foreground">اعتمادات من مؤسسات محلية ودولية مرموقة</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 bg-[#052c4b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-[#052c4b]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">رعاية شاملة</h3>
              <p className="text-muted-foreground">نقدم رعاية متكاملة من التشخيص إلى العلاج والمتابعة</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <ReservationSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#052c4b] to-[#1e3a8a]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">ابدأ رحلة الشفاء معنا</h2>
            <p className="text-blue-100 mb-8 text-lg">
              احجز موعدك اليوم واستمتع بخدماتنا المتخصصة في الطب التكميلي والتأهيل الرياضي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-[#052c4b] hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/sign-up">
                  احجز موعدك الآن <ArrowRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-[#052c4b] bg-white hover:bg-[#052c4b] hover:text-white text-lg px-8 py-4">
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
