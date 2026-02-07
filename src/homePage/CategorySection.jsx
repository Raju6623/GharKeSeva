import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../config';
import { getServiceRoute } from '../utils/routeUtils';
import useTranslation from '../hooks/useTranslation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

function CategorySection({ title, services, categoryLink }) {
    const { t } = useTranslation();
    if (!services || services.length === 0) return null;

    const navId = title.replace(/[^a-zA-Z0-9]/g, '');
    const prevEl = `.swiper-button-prev-${navId}`;
    const nextEl = `.swiper-button-next-${navId}`;

    // Deduplicate services to prevent key errors
    const uniqueServices = Array.from(new Map(services.map(item => [item._id, item])).values());

    // Helper to clean up messed up titles
    const cleanTitle = (title) => {
        if (!title) return "";
        let cleaned = title;
        // Fix double words "Women Women"
        cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");

        // Fix specific known concatenation errors
        if (cleaned.includes("Salon for Women") && cleaned.includes("Men's Salon")) {
            if (cleaned.startsWith("Salon for Women")) cleaned = cleaned.replace("Men's Salon", "");
        }
        if (cleaned.includes("Salon for Men") && cleaned.includes("Women's Salon")) {
            if (cleaned.startsWith("Salon for Men")) cleaned = cleaned.replace("Women's Salon", "");
        }
        return cleaned.replace(/\s+/g, ' ').trim();
    };

    const serviceSlides = uniqueServices.map((service) => (
        <SwiperSlide key={service._id} className="h-auto">
            <Link
                to={categoryLink}
                className="block aspect-[3/4.2] bg-white border border-slate-100 rounded-[1.5rem] p-5 transition-all duration-500 relative overflow-hidden group shadow-sm hover:shadow-2xl hover:shadow-[#0c8182]/10 hover:-translate-y-1"
            >
                {/* Title Top-Left */}
                <div className="z-10 relative">
                    <h3 className="font-bold text-[15px] text-slate-800 leading-tight mb-1 line-clamp-2">
                        {cleanTitle(service.packageName)}
                    </h3>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        {t('starting')} ₹{service.priceAmount}
                    </p>
                </div>

                {/* Image Bottom - Filling the space */}
                <div className="absolute inset-x-0 bottom-0 top-1/3">
                    <img
                        src={getImageUrl(service.packageImage)}
                        alt={service.packageName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{
                            maskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)'
                        }}
                    />
                </div>

                {/* Hover Indicator - subtle dot */}
                <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-[#0c8182] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        </SwiperSlide>
    ));

    return (
        <section className="py-8 bg-white overflow-hidden group/section">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-[900] text-slate-900 tracking-tight transition-all duration-300">
                        {t(title)}
                    </h2>
                    <Link
                        to={categoryLink}
                        className="text-xs font-black text-[#0c8182] uppercase tracking-widest hover:text-[#0a6d6d] transition-colors"
                    >
                        {t('view_all')}
                    </Link>
                </div>

                {/* Navigation Arrows */}
                <div className={`swiper-button-prev-${navId} absolute left-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover/section:opacity-100 cursor-pointer -translate-x-4`}>
                    <ArrowLeft size={20} />
                </div>

                <div className={`swiper-button-next-${navId} absolute right-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover/section:opacity-100 cursor-pointer translate-x-4`}>
                    <ArrowRight size={20} />
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={1.3}
                    navigation={{
                        nextEl: nextEl,
                        prevEl: prevEl,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2.5 },
                        768: { slidesPerView: 3.5 },
                        1024: { slidesPerView: 4.5 },
                    }}
                    className="!pb-8"
                >
                    {serviceSlides}
                </Swiper>
            </div>
        </section>
    );
}

export default CategorySection;
