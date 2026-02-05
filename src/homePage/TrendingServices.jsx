import React, { useRef } from 'react';
import { ArrowRight, ArrowLeft, Star, Coins } from 'lucide-react';
import { calculateGSCoin } from '../utils/coinUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getServiceRoute } from '../utils/routeUtils';
import { getImageUrl } from '../config';

import useTranslation from '../hooks/useTranslation';

function TrendingServices() {
    const { t } = useTranslation();
    const { availableServices } = useSelector((state) => state.services);
    const scrollRef = useRef(null);

    // Limit to top trends based on bookingCount
    const sortedServices = [...availableServices]
        .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
        .slice(0, 10);

    // Deduplicate services based on unique ID
    const uniqueServices = Array.from(new Map(sortedServices.map(item => [item._id, item])).values());

    // Scroll Handler
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (uniqueServices.length === 0) return null;

    const serviceCards = uniqueServices.map((service) => (
        <Link
            to={getServiceRoute(service.serviceCategory || service.category)}
            key={service._id}
            className="min-w-[220px] w-[220px] md:min-w-[260px] md:w-[260px] aspect-[3/4.2] bg-white border border-slate-100 rounded-[1.5rem] p-5 transition-all duration-500 relative overflow-hidden group shadow-sm hover:shadow-2xl hover:shadow-[#0c8182]/10 hover:-translate-y-1 snap-start"
        >
            {/* Title Top-Left */}
            <div className="z-10 relative">
                <h3 className="font-bold text-[15px] text-slate-800 leading-tight mb-1 line-clamp-2">
                    {service.packageName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <Star size={10} fill="#f59e0b" className="text-[#f59e0b]" /> 4.8
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                        <Coins size={10} /> {calculateGSCoin(service.priceAmount)}
                    </div>
                </div>
            </div>

            {/* Image Bottom */}
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

            <div className="absolute bottom-5 left-5 z-10">
                <span className="text-[13px] font-black text-slate-900 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                    ₹{service.priceAmount}
                </span>
            </div>
        </Link>
    ));

    return (
        <section className="py-8 bg-white relative group/section overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-[900] text-slate-900 tracking-tight">{t('most_booked')}</h2>
                    <Link
                        to="/services"
                        className="text-xs font-black text-[#0c8182] uppercase tracking-widest hover:text-[#0a6d6d] transition-colors"
                    >
                        {t('view_all')}
                    </Link>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover/section:opacity-100 cursor-pointer -translate-x-4"
                >
                    <ArrowLeft size={20} />
                </button>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover/section:opacity-100 cursor-pointer translate-x-4"
                >
                    <ArrowRight size={20} />
                </button>

                {/* Horizontal Scroll List */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
                    style={{ scrollPadding: '24px' }}
                >
                    {serviceCards}
                </div>
            </div>
            <style>{`
    .scrollbar-hide::-webkit-scrollbar {
    display: none;
}
                .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`}</style>
        </section>
    );
}

export default TrendingServices;
