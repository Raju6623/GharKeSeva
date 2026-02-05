import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote, User } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';

import useTranslation from '../hooks/useTranslation';

function CustomerReviews() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    axios.get(`${API_URL}/reviews/featured`)
      .then(res => {
        if (Array.isArray(res.data)) setReviews(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Use a fallback if no reviews yet
  const displayReviews = reviews.length > 0 ? reviews : [
    { id: 1, userName: "Priya (Demo)", serviceId: "Painting", rating: 5, text: "Excellent service! (This is a placeholder until you add real reviews)" }
  ];

  // Auto Scroll Logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 10;

        if (isEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
          setActiveIndex(prev => (prev + 1) % displayReviews.length);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [displayReviews.length]);

  const reviewCards = displayReviews.map((rev) => {
    const stars = [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < (rev.rating || 5) ? "currentColor" : "none"}
        className={i < (rev.rating || 5) ? "" : "text-slate-200"}
      />
    ));

    return (
      <div
        key={rev.id || Math.random()}
        className="relative flex-shrink-0 w-[320px] md:w-[400px] h-[280px] bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-xl shadow-slate-200/40 snap-center hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 group"
      >
        {/* Quote Icon */}
        <div className="absolute top-10 right-10 text-slate-50 opacity-20 group-hover:text-teal-50 group-hover:opacity-100 transition-all duration-500">
          <Quote size={80} fill="currentColor" />
        </div>

        <div className="relative z-10">
          {/* Service Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
              {rev.serviceId || 'Verified Service'}
            </span>
            <div className="flex gap-0.5 text-yellow-400">
              {stars}
            </div>
          </div>

          {/* Comment */}
          <p className="text-slate-700 text-lg font-bold leading-relaxed line-clamp-3 italic">
            "{rev.text}"
          </p>
        </div>

        {/* Profile Footer */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-50 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-teal-200 transform transition-transform group-hover:rotate-6">
            {(rev.userName || "U")[0]}
          </div>
          <div>
            <p className="text-slate-900 font-bold text-base">{rev.userName}</p>
            <div className="flex items-center gap-1.5 text-[#0c8182] text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-[#0c8182] rounded-full animate-pulse" />
              {t('verified_customer')}
            </div>
          </div>
        </div>
      </div>
    );
  });

  const indicators = displayReviews.map((_, idx) => (
    <button
      key={idx}
      onClick={() => {
        scrollRef.current.scrollTo({ left: idx * 432, behavior: 'smooth' });
        setActiveIndex(idx);
      }}
      className={`h-2 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-10 bg-teal-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
      aria-label={`Go to slide ${idx + 1}`}
    />
  ));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="relative text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t('love_from_customers')} <span className="text-teal-600">{t('customers')}</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            {t('reviews_desc')}
          </p>
        </div>

        <div className="relative">
          {/* Horizontal Scroll Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-12 snap-x snap-mandatory px-4 -mx-4"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {reviewCards}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3">
            {indicators}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;