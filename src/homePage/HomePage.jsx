import React from 'react';
import {
  ShieldCheck, Star, Clock,
  ShieldAlert, Receipt, Headphones, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import PatnaSpecialBanner from './PatnaSpecialBanner';
import GharKeSevaHero from './GharKeSevaHero';
import PromotionalBanners from './PromotionalBanners';
import TrendingServices from './TrendingServices';
import CustomerReviews from './CustomerReviews';
import HowItWorks from './HowItWorks';
import SpotlightBanner from './SpotlightBanner';
import ThoughtfulCurations from './ThoughtfulCurations';
// import SafetySection from './SafetySection'; // Removed as per user request
// import MobileAppSection from './MobileAppSection'; // Removed as per user request
import ServicePackages from './ServicePackages';
// import CouponSection from './CouponSection'; // Removed per user request

import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../redux/thunks/serviceThunks';
import CategorySection from './CategorySection';
import useTranslation from '../hooks/useTranslation';

function HomePage() {
  const { t } = useTranslation();
  const { availableServices } = useSelector((state) => state.services);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchServices("All Services"));
  }, [dispatch]);

  const TRUST_STATISTICS = [
    {
      id: 1,
      label: t('verified_professionals') || "Verified Professionals",
      subtext: t('background_checked') || "100% Background Checked",
      icon: <ShieldCheck size={28} />,
      theme: "bg-teal-50 text-teal-700"
    },
    {
      id: 2,
      label: t('client_rating') || "4.8+ Client Rating",
      subtext: t('based_on_reviews') || "Based on 10k+ reviews",
      icon: <Star size={28} className="fill-slate-500 text-slate-500" />,
      theme: "bg-slate-50 text-slate-700"
    },
    {
      id: 3,
      label: t('instant_booking') || "Instant Booking",
      subtext: t('technician_arrival') || "Technician arrives in 60 mins",
      icon: <Clock size={28} />,
      theme: "bg-teal-50 text-teal-700"
    }
  ];

  const SERVICE_BRAND_GUARANTEES = [
    { title: t('warranty') || "Up to 30 days warranty", icon: <ShieldCheck size={24} />, desc: t('repair_services') || "On all repair services" },
    { title: t('protection') || "Damage Protection", icon: <ShieldAlert size={24} />, desc: t('cover_amount') || "Up to ₹10,000 cover" },
    { title: t('pricing') || "Transparent Pricing", icon: <Receipt size={24} />, desc: t('rate_card') || "Standard rate card" },
    { title: t('support') || "24/7 Support", icon: <Headphones size={24} />, desc: t('instant_resolution') || "Instant resolution" }
  ];

  // Group Services by Category
  const servicesByCategory = availableServices.reduce((acc, service) => {
    let cat = service.serviceCategory || service.category || "Other";

    // Normalization for consistency and translation support
    const lowerCat = cat.toLowerCase();
    const packageName = (service.packageName || "").toLowerCase();
    const serviceTags = (service.tag || "").toLowerCase();

    // Combining searchable text to check for forbidden keywords
    const searchStr = `${packageName} ${lowerCat} ${serviceTags}`;

    // HELPER: Strict word boundary check
    const hasStrict = (term) => new RegExp(`\\b${term}\\b`, 'i').test(searchStr);

    if (hasStrict('ac') || lowerCat.includes('condit')) {
      // Safety check: if it's AC, it shouldn't have salon keywords
      const salonKeywords = ['facial', 'massage', 'salon', 'waxing', 'haircut', 'cleanup', 'makeup'];
      const isSalonExclusion = salonKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchStr));

      if (!isSalonExclusion) {
        cat = "ac_service_title";
      } else {
        cat = "salon"; // Fallback if it's actually salon
      }
    } else if (lowerCat.includes('salon')) {
      if (packageName.includes('women') || lowerCat.includes('women')) cat = "salon_women";
      else if (packageName.includes('men') || lowerCat.includes('men')) cat = "salon_men";
      else cat = "salon";
    } else if (lowerCat.includes('plumb')) {
      cat = "plumbing_title";
    } else if (lowerCat.includes('elect')) {
      cat = "electrician_title";
    } else if (lowerCat.includes('carpenter')) {
      cat = "carpenter_title";
    } else if (lowerCat.includes('cleaning') || lowerCat.includes('maid')) {
      cat = "cleaning_title";
    } else if (hasStrict('ro') || lowerCat.includes('purifier')) {
      cat = "ro_title";
    } else if (lowerCat.includes('paint')) {
      cat = "painting_title";
    } else if (lowerCat.includes('appliance')) {
      cat = "appliance_title";
    }

    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  // Get list of categories
  const categories = Object.keys(servicesByCategory);

  const categorySections = categories.map((category) => (
    <CategorySection
      key={category}
      title={category}
      services={servicesByCategory[category]}
      categoryLink={`/services/${category.toLowerCase().replace(/_title$/, '').replace(/\s+/g, '-')}`}
    />
  ));

  const brandGuaranteeCards = SERVICE_BRAND_GUARANTEES.map((item, idx) => (
    <div key={idx} className="bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-200 transition-all duration-300 group hover:shadow-xl hover:shadow-teal-100/50 flex flex-col items-start">
      <div className="w-12 h-12 bg-white group-hover:bg-teal-50 border border-slate-200 group-hover:border-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-4 transition-colors">
        {item.icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
    </div>
  ));

  const trustStatItems = TRUST_STATISTICS.map((stat) => (
    <div key={stat.id} className="flex items-center gap-4 justify-center md:justify-start">
      <div className={`w-14 h-14 ${stat.theme} rounded-2xl flex items-center justify-center shrink-0`}>
        {stat.icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 leading-tight">{stat.label}</h3>
        <p className="text-sm text-slate-500 font-medium">{stat.subtext}</p>
      </div>
    </div>
  ));

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">

      {/* 1. HERO SECTION (Cinematic Motion - Restored) */}
      <HeroSection />

      {/* NEW: PATNA SPECIAL BANNER */}
      <PatnaSpecialBanner />

      {/* 2. CATEGORIES (GharKeSeva Style Grid) */}
      <div className="relative z-20">
        <GharKeSevaHero />
      </div>

      {/* 3. SPOTLIGHT BANNER */}
      <SpotlightBanner />

      {/* 4. PROMOTIONAL BANNERS */}
      <PromotionalBanners />

      {/* 6. TRENDING SERVICES(Horizontal Scroll) */}
      <TrendingServices />

      {/* 7. THOUGHTFUL CURATIONS(Stories Style) */}
      <ThoughtfulCurations />

      {/* NEW: SERVICE PACKAGES (Replaces Safety Section) */}
      <ServicePackages />

      {/* NEW: SAFETY SECTION REMOVED */}


      {/* 8. BRAND PROMISE - Refined Container */}
      <section className="py-10 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {t('gharkeseva_promise')} <span className="text-[#0c8182]">{t('promise_suffix')}</span>
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-lg mt-2 font-medium">
                {t('promise_desc')}
              </p>
            </div>

            <div className="h-px flex-1 bg-slate-100 mx-8 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {brandGuaranteeCards}
          </div>
        </div>
      </section>

      {/* 8. DYNAMIC CATEGORY SECTIONS(All Services) */}
      <div id="services-grid">
        {categorySections}
      </div>



      {/* 5. TRUST STATS BAR (Moved below Promise) */}
      <div className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustStatItems}
        </div>
      </div>

      {/* 9. REVIEWS(Photo Cards) */}
      <CustomerReviews />

      {/* NEW: MOBILE APP SECTION REMOVED */}

      {/* 9. HOW IT WORKS */}
      <HowItWorks />

      {/* 10. REFINED INTEGRATED CTA */}

    </div>
  );
}

export default HomePage;