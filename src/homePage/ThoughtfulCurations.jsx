import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight, Play, X } from 'lucide-react';

import useTranslation from '../hooks/useTranslation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

function ThoughtfulCurations() {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { t } = useTranslation();

    const thoughtfulCurations = [
        {
            id: 1,
            title: t('bathroom_cleaning'),
            image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
            youtubeId: "8m1-R1-yM9s",
            link: "/services/house-maid-service"
        },
        {
            id: 2,
            title: t('kitchen_cleaning'),
            image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800",
            youtubeId: "l7S50w_c6C8",
            link: "/services/house-maid-service"
        },
        {
            id: 3,
            title: t('painting_waterproofing'),
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
            youtubeId: "Xm-hX4Z_YvY",
            link: "/services/painting-service"
        },
        {
            id: 4,
            title: t('wall_panels'),
            image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800",
            youtubeId: "9fP6F7-S1Yk",
            link: "/services/carpenter-service"
        },
        {
            id: 5,
            title: t('smart_home_setup'),
            image: "https://images.unsplash.com/photo-1558002038-1091a166111c?auto=format&fit=crop&q=80&w=800",
            youtubeId: "K4TOrB4at0Y",
            link: "/services/smartlock-service"
        }
    ];

    const curationSlides = thoughtfulCurations.map((item) => (
        <SwiperSlide key={item.id} className="group">
            <div
                onClick={() => setSelectedVideo(item.youtubeId)}
                className="block relative h-[450px] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    {/* Play Button */}
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-auto mt-auto group-hover:bg-[#0c8182] transition-all duration-300 ring-1 ring-white/50 group-hover:scale-110">
                        <Play size={28} className="text-white fill-white ml-1" />
                    </div>

                    {/* Text Details */}
                    <div className="w-full text-left mt-auto">
                        <h3 className="text-2xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
                            {item.title}
                        </h3>
                        <div className="h-1 w-12 bg-[#0c8182] rounded-full transition-all duration-300 group-hover:w-24" />
                    </div>
                </div>
            </div>
        </SwiperSlide>
    ));

    const videoModal = selectedVideo && (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedVideo(null)}
        >
            <div
                className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );

    return (
        <section className="py-16 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {t('thoughtful_curations')}
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium">{t('finest_experiences')}</p>
                    </div>

                    {/* Custom Navigation Button */}
                    <button className="hidden md:flex curations-next-btn w-12 h-12 rounded-full border border-slate-200 items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer z-10">
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    navigation={{
                        nextEl: '.curations-next-btn',
                        prevEl: null,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2.2 },
                        768: { slidesPerView: 3.2 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="!pb-10"
                >
                    {curationSlides}
                </Swiper>
            </div>

            {/* VIDEO MODAL */}
            {videoModal}
        </section>
    );
}

export default ThoughtfulCurations;
