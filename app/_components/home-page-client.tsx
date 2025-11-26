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
  Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import CoursesCarousel from "@/components/courses-carousel";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
}

interface HomePageClientProps {
  courses: Course[];
}

export function HomePageClient({ courses }: HomePageClientProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src="/teacher-image.png"
                  alt="Mr/ Mohamed khaled hassan"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 text-center">
                <div className="text-white text-xl md:text-2xl font-semibold">
                  Mr/ Mohamed khaled hassan
                </div>
                <div className="text-blue-100 text-sm md:text-base mt-1">
                  عميد الكيآن اكاديمي للتأهيل والتدريب
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              مركز الكيان للتأهيل والتدريب
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-8">
              جميع مجالات الطب التكميلي والتأهيل الرياضي والتمنية البشرية والعناية بالبشرة والشعر والاستشارات
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">خدماتنا</h2>
            <p className="text-muted-foreground text-lg">اكتشف مجموعة متنوعة من الكورسات التعليمية المميزة</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CoursesCarousel 
              courses={courses} 
              title="الكورسات المتاحة" 
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الاعتمادات</h2>
            <p className="text-muted-foreground text-lg">نفتخر بحصولنا على اعتمادات من أرقى المؤسسات المحلية والدولية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
              <h3 className="text-lg font-semibold mb-2 text-[#052c4b]">إعتماد اللجنة النقابية للعاملين</h3>
              <p className="text-sm text-muted-foreground">بالمهن التجميلية</p>
            </motion.div>

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
              <h3 className="text-lg font-semibold mb-2 text-[#052c4b]">إعتماد محلي وترخيص مزاولة التدريب</h3>
              <p className="text-sm text-muted-foreground">شهادة اعتماد رسمية</p>
            </motion.div>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الشهادات</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
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
                <Award className="h-5 w-5 text-[#052c4b] flex-shrink-0" />
                <span className="text-sm font-medium">{cert}</span>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">لتفاصيل أكثر</p>
            <a 
              href="https://wa.me/201146450551" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <Phone className="h-5 w-5" />
              كلمنا واتس: 01146450551
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الجلسات</h2>
            <p className="text-muted-foreground text-lg">احجز جلسة مناسبة لك</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "حجز جلسة تأهيل", icon: GraduationCap, id: "rehabilitation" },
              { name: "حجز جلسة حجامة", icon: Heart, id: "cupping" },
              { name: "حجز جلسة تدليك", icon: Shield, id: "massage" },
              { name: "حجز جلسة روحانية", icon: Heart, id: "spiritual" },
              { name: "حجز استشارة", icon: MessageSquare, id: "consultation" },
              { name: "حجز مقابلة شخصية", icon: User, id: "personal" },
            ].map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#052c4b]/10 rounded-full flex items-center justify-center">
                    <session.icon className="h-6 w-6 text-[#052c4b]" />
                  </div>
                  <h3 className="text-lg font-semibold">{session.name}</h3>
                </div>
                <Button asChild className="w-full bg-[#052c4b] hover:bg-[#052c4b]/90">
                  <Link href={`/reservation/${session.id}`}>
                    احجز الآن
                  </Link>
                </Button>
              </motion.div>
            ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الخدمات العامة</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
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
            ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">نموذج للشهادات</h2>
            <p className="text-muted-foreground text-lg">مساحة لإضافة الشهادات</p>
          </motion.div>
          <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
            <p className="text-center text-muted-foreground">سيتم إضافة نماذج الشهادات هنا</p>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">اعرفنا أكثر</h2>
            <p className="text-muted-foreground text-lg">مساحة لإضافة المعلومات</p>
          </motion.div>
          <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
            <p className="text-center text-muted-foreground">سيتم إضافة معلومات عن المركز هنا</p>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">تسجيل في كورس أون لاين</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto text-center">
            <Button asChild size="lg" className="bg-[#052c4b] hover:bg-[#052c4b]/90 text-lg px-8 py-4">
              <Link href="/reservation/online-course">
                سجل في كورس الآن
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">طلب عضوية ووظيفة</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto text-center">
            <Button asChild size="lg" className="bg-[#052c4b] hover:bg-[#052c4b]/90 text-lg px-8 py-4">
              <Link href="/reservation/membership">
                قدم طلبك الآن
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">أخبار عامة</h2>
            <p className="text-muted-foreground text-lg">مساحة لإضافة الأخبار</p>
          </motion.div>
          <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
            <p className="text-center text-muted-foreground">سيتم إضافة الأخبار هنا</p>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الاختبارات</h2>
            <p className="text-muted-foreground text-lg">مساحة لتسجيل الاختبارات</p>
          </motion.div>
          <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
            <p className="text-center text-muted-foreground">سيتم إضافة الاختبارات هنا</p>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">نبذة عن المحاضرين</h2>
            <p className="text-muted-foreground text-lg">مساحة لإضافة المحاضرين وصورهم</p>
          </motion.div>
          <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
            <p className="text-center text-muted-foreground">سيتم إضافة معلومات المحاضرين هنا</p>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">طلب تجديد</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto text-center">
            <Button asChild size="lg" className="bg-[#052c4b] hover:bg-[#052c4b]/90 text-lg px-8 py-4">
              <Link href="/reservation/renewal">
                قدم طلب التجديد
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">هدفنا وإنجازاتنا</h2>
            <p className="text-muted-foreground text-lg">مساحة لإضافة الأهداف والإنجازات</p>
          </motion.div>
          <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 border shadow-sm min-h-[200px]">
            <p className="text-center text-muted-foreground">سيتم إضافة الأهداف والإنجازات هنا</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#052c4b] to-[#1e3a8a]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">ابدأ رحلة الشفاء معنا</h2>
            <p className="text-blue-100 mb-8 text-lg">
              احجز موعدك اليوم واستمتع بخدماتنا المتخصصة
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

