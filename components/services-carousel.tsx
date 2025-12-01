'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { CheckCircle, Heart, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Service {
  name: string;
  icon: any;
  description: string;
}

interface ServicesCarouselProps {
  services: Service[];
  title: string;
}

export default function ServicesCarousel({ services, title }: ServicesCarouselProps) {
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

      <div className="relative">
        <div className="swiper-container relative" style={{ minHeight: '500px', paddingBottom: '60px' }}>
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:block">
            <button 
              onClick={goToNext}
              className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-[#052c4b]" />
            </button>
            <button 
              onClick={goToPrev}
              className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
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
            loop={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            // Touch/Swipe functionality
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
            className="pb-16"
            style={{
              '--swiper-navigation-color': '#052c4b',
              '--swiper-pagination-color': '#052c4b',
            } as React.CSSProperties}
          >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <div
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === 1 ? 'bg-[#052c4b] text-white transform scale-105' : 'bg-white text-[#052c4b]'
              }`}
            >
              {/* Service Icon and Title */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  index === 1 ? 'bg-white/20' : 'bg-[#052c4b]/10'
                }`}>
                  <service.icon className={`h-8 w-8 ${index === 1 ? 'text-white' : 'text-[#052c4b]'}`} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className={`text-sm ${index === 1 ? 'text-white/80' : 'text-gray-600'}`}>
                  {service.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-3 ${index === 1 ? 'text-white' : 'text-[#052c4b]'}`} />
                  <span className="text-sm">علاج متخصص</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-3 ${index === 1 ? 'text-white' : 'text-[#052c4b]'}`} />
                  <span className="text-sm">جلسات فردية</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-3 ${index === 1 ? 'text-white' : 'text-[#052c4b]'}`} />
                  <span className="text-sm">متابعة مستمرة</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-3 ${index === 1 ? 'text-white' : 'text-[#052c4b]'}`} />
                  <span className="text-sm">شهادة معتمدة</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                  index === 1 
                    ? 'bg-white text-[#052c4b] hover:bg-gray-100' 
                    : 'bg-[#052c4b] text-white hover:bg-[#052c4b]/90'
                }`}
              >
                احجز الآن
              </Button>
            </div>
          </SwiperSlide>
        ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
