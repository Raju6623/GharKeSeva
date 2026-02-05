import React from 'react';
import { MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';

import useTranslation from '../hooks/useTranslation';

/**
 * HeroSection Component - Visual First (Airbnb/Lifestyle Style)
 * Full-screen background image with centered search + Cinematic Motion.
 */
function HeroSection() {
  const { t } = useTranslation();
  const globalCity = useSelector((state) => state.location.city);
  const user = useSelector((state) => state.auth.user);

  // Priority: Global Location Select (TopBar) > User Profile City > Patna
  const userCity = globalCity !== "Patna" ? globalCity : (user?.user?.city || user?.city || "Patna");

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* 1. CINEMATIC FIXED BACKGROUND (Parallax) */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('/HomePageHero/HomePageBack.jpeg')`
        }}
      >
        {/* Dark Protection Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
          <MapPin size={14} className="text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {userCity}{t('users_best_services')}
          </span>
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {t('make_home')} <br />
          <span className="italic font-serif font-light text-teal-100">{t('beautiful_again')}</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {t('expert_desc')}
        </p>
      </div>

      {/* Bottom Fade to blend with next section (White) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

export default HeroSection;