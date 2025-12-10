'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Course {
  id: string;
  title: string;
  price: number;
}

interface CoursesCarouselProps {
  courses: Course[];
  title: string;
}

export default function CoursesCarousel({ courses, title }: CoursesCarouselProps) {
  const swiperRef = useRef<any>(null);

  const goToPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  if (courses.length === 0) {
    return (
      <div className="w-full py-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#052c4b]">{title}</h2>
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد كورسات متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#052c4b]">{title}</h2>
      
      {/* Mobile Swipe Indicator */}
      <div className="md:hidden flex justify-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 swipe-indicator">
          <ChevronLeft className="h-4 w-4" />
          <span>اسحب للتنقل</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div className="relative courses-carousel">
        <div className="swiper-container relative">
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-30">
            <button 
              onClick={goToNext}
              className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-[#052c4b]" />
            </button>
            <button 
              onClick={goToPrev}
              className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-[#052c4b]" />
            </button>
          </div>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={false}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            touchRatio={1}
            grabCursor={true}
            simulateTouch={true}
            allowTouchMove={true}
            threshold={5}
            touchReleaseOnEdges={true}
            resistanceRatio={0.85}
            breakpoints={{
              640: { 
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: { 
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="courses-swiper"
            style={{
              '--swiper-navigation-color': '#052c4b',
              '--swiper-pagination-color': '#052c4b',
            } as React.CSSProperties}
          >
            {courses.map((course, index) => (
              <SwiperSlide key={course.id}>
                <div
                  className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    index % 3 === 1 ? 'bg-[#052c4b] text-white transform scale-105' : 'bg-white text-[#052c4b]'
                  }`}
                >
                  {/* Course Icon and Title */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      index % 3 === 1 ? 'bg-white/20' : 'bg-[#052c4b]/10'
                    }`}>
                      <BookOpen className={`h-8 w-8 ${index % 3 === 1 ? 'text-white' : 'text-[#052c4b]'}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3rem]">{course.title}</h3>
                    <div className={`text-2xl font-bold mb-6 ${index % 3 === 1 ? 'text-white' : 'text-[#052c4b]'}`}>
                      {course.price === 0 ? "مجاني" : `${course.price} جنيه`}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild
                    className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      index % 3 === 1 
                        ? 'bg-white text-[#052c4b] hover:bg-gray-100' 
                        : 'bg-[#052c4b] text-white hover:bg-[#052c4b]/90'
                    }`}
                  >
                    <Link href={`/courses/${course.id}`}>
                      عرض الكورس
                    </Link>
                  </Button>

                  {/* WhatsApp Contact Text */}
                  <div className={`mt-4 text-center text-sm ${index % 3 === 1 ? 'text-white/90' : 'text-muted-foreground'}`}>
                    <p>لتفاصيل الكورس</p>
                    <p>كلمنا واتس 01146450551</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

