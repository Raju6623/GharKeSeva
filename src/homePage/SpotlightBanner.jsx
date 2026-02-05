import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import useTranslation from '../hooks/useTranslation';

function SpotlightBanner() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const SPOTLIGHTS = [
        {
            id: 1,
            tag: t('summer_special'),
            title: t('ac_repair_service'),
            highlight: "Service",
            desc: t('ac_desc'),
            bg: "bg-[#effafa]",
            border: "border-[#0c8182]/20",
            textAccent: "text-[#0c8182]",
            btnBg: "bg-[#0c8182] hover:bg-[#0a6d6d]",
            shadow: "shadow-teal-100",
            image: "/AC-refilling-air.webp",
            decor1: "bg-[#0c8182]/10",
            link: "/services/ac-service"
        },
        {
            id: 2,
            tag: t('leak_experts'),
            title: t('professional_plumbing'),
            highlight: "Plumbing",
            desc: t('plumbing_desc'),
            bg: "bg-[#effafa]",
            border: "border-[#0c8182]/20",
            textAccent: "text-[#0c8182]",
            btnBg: "bg-[#0c8182] hover:bg-[#0a6d6d]",
            shadow: "shadow-teal-100",
            image: "/asian-plumber-blue-overalls-clearing-blockage-drain.webp",
            decor1: "bg-[#0c8182]/10",
            link: "/services/plumbing-service"
        },
        {
            id: 3,
            tag: t('pure_water'),
            title: t('ro_water_purifier'),
            highlight: "Purifier",
            desc: t('ro_desc'),
            bg: "bg-[#effafa]",
            border: "border-[#0c8182]/20",
            textAccent: "text-[#0c8182]",
            btnBg: "bg-[#0c8182] hover:bg-[#0a6d6d]",
            shadow: "shadow-teal-100",
            image: "/Ro Installation Services.webp",
            decor1: "bg-[#0c8182]/10",
            link: "/services/ro-service"
        }
    ];

    const bannerSlides = SPOTLIGHTS.map((slide) => (
        <SwiperSlide key={slide.id}>
            <div className={`${slide.bg} rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden text-slate-900 border ${slide.border}`}>

                {/* Text Content */}
                <div className="flex-1 z-10 text-center md:text-left">
                    <span className={`inline-block bg-white ${slide.textAccent} px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm border ${slide.border}`}>
                        {slide.tag}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                        {slide.title}
                    </h2>
                    <p className="text-lg text-slate-600 font-medium mb-8 max-w-sm mx-auto md:mx-0">
                        {slide.desc}
                    </p>
                    <button
                        onClick={() => navigate(slide.link)}
                        className={`${slide.btnBg} text-white px-8 py-4 rounded-lg font-bold text-sm transition-all flex items-center gap-2 mx-auto md:mx-0 shadow-lg ${slide.shadow}`}
                    >
                        {t('book_now')} <ArrowRight size={16} />
                    </button>
                </div>

                {/* Image */}
                <div className="flex-1 w-full relative">
                    <div className="aspect-video md:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border-4 border-white transform md:rotate-2 hover:rotate-0 transition-all duration-500">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Decorative elements */}
                    <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${slide.decor1} rounded-full blur-3xl -z-10`}></div>
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl -z-10"></div>
                </div>

            </div>
        </SwiperSlide>
    ));

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    className="rounded-lg shadow-sm"
                >
                    {bannerSlides}
                </Swiper>
            </div>
        </section>
    );
}

export default SpotlightBanner;
