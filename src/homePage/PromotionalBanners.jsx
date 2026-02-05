import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { ArrowRight, Tag, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

/**
 * PromotionalBanners Component
 * Displays rich, visual offer banners with functional links.
 */
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanners } from '../redux/thunks/marketingThunks';
import { io } from 'socket.io-client';
import { BASE_URL, getImageUrl } from '../config';

const socket = io(BASE_URL);
// ... existing imports

import useTranslation from '../hooks/useTranslation';

function PromotionalBanners() {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector((state) => state.marketing);
    const { t } = useTranslation();

    React.useEffect(() => {
        dispatch(fetchBanners());

        // Real-time listener for banner updates
        socket.on('banner_update', () => {
            // Re-fetch banners to ensure Redux state is consistent
            dispatch(fetchBanners());
        });

        return () => {
            socket.off('banner_update');
        };
    }, [dispatch]);

    if (loading) return null;

    const displayBanners = banners && banners.length > 0 ? banners : [];
    if (displayBanners.length === 0) return null;

    const bannerSlides = displayBanners.map((banner) => (
        <SwiperSlide key={banner.id} className="!w-auto">
            <Link
                to={banner.link}
                className="block w-[300px] md:w-[380px] aspect-[16/8] rounded-[1.5rem] relative overflow-hidden group border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
                {/* Image Background */}
                <img
                    src={getImageUrl(banner.image)}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent p-6 flex flex-col justify-center items-start">
                    {banner.tag && (
                        <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-black text-white uppercase tracking-widest mb-3 border border-white/10">
                            {banner.tag}
                        </span>
                    )}
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight max-w-[200px]">
                        {banner.title}
                    </h3>
                    {banner.subtitle && (
                        <p className="text-white/80 text-xs font-bold mb-6 max-w-[180px] line-clamp-2">
                            {banner.subtitle}
                        </p>
                    )}

                    <button className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg mt-auto">
                        {banner.cta || t('book_now')}
                    </button>
                </div>
            </Link>
        </SwiperSlide>
    ));

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <h2 className="text-2xl md:text-3xl font-[900] text-slate-900 mb-8 tracking-tight">
                    {t('offers_discounts')}
                </h2>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={16}
                    slidesPerView={'auto'}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="w-full !overflow-visible"
                >
                    {bannerSlides}
                </Swiper>
            </div>
        </section>
    );
}

export default PromotionalBanners;
