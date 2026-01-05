import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Star, Clock, Sparkles, 
  ArrowRight, ShieldAlert, CheckCircle, 
  Headphones, Receipt 
} from 'lucide-react';
import ServiceCategorySection from './ServiceCategorySection';
import CustomerReviews from './CustomerReviews';

/**
 * HeroSection Component
 * Provides a localized service search, trust metrics, and brand promises.
 */
const HeroSection = ({ onSearchTrigger }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. DATA CONFIGURATION (Separated from View) ---

  const heroMessaging = {
    badge: "Bihar's #1 Trusted Home Service",
    mainTitle: "Expert Services,",
    accentTitle: "On Command.",
    description: "From leaking taps to AC repairs, book verified professionals in Patna in 60 seconds. Quality service guaranteed at your doorstep.",
    searchPlaceholder: "What service do you need today?"
  };

  const trustStatistics = [
    { 
      id: 1, 
      label: "Verified Professionals", 
      subtext: "100% Background Checked", 
      icon: <ShieldCheck size={24} />, 
      theme: "bg-green-50 text-green-600" 
    },
    { 
      id: 2, 
      label: "4.8+ Client Rating", 
      subtext: "Based on 10k+ reviews", 
      icon: <Star size={24} className="fill-orange-500" />, 
      theme: "bg-orange-50 text-orange-600" 
    },
    { 
      id: 3, 
      label: "Instant Booking", 
      subtext: "Technician arrives in 60 mins", 
      icon: <Clock size={24} />, 
      theme: "bg-blue-50 text-blue-600" 
    }
  ];

  const operationalRequirements = [
    { label: "2 buckets", icon: "🪣" },
    { label: "Plug point", icon: "🔌" },
    { label: "Ladder/stool", icon: "🪜" }
  ];

  const serviceBrandGuarantees = [
    { title: "Up to 10 days warranty", icon: <ShieldCheck size={20}/> },
    { title: "Up to ₹10,000 damage cover", icon: <ShieldAlert size={20}/> },
    { title: "Fixed rate card", icon: <Receipt size={20}/> },
    { title: "On call repair quote verification", icon: <Headphones size={20}/> }
  ];

  // --- 2. LOGIC HANDLERS (Defined outside Return) ---

  const handleSearchExecution = (event) => {
    event.preventDefault();
    if (searchQuery.trim() && onSearchTrigger) {
      onSearchTrigger(searchQuery);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // --- 3. SUB-RENDER PIECES (Modular View logic) ---

  const renderTrustHeader = () => (
    <div className="max-w-4xl mx-auto w-full pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
      {trustStatistics.map((statistic) => (
        <div key={statistic.id} className="flex flex-col items-center">
          <div className={`w-12 h-12 ${statistic.theme} rounded-full flex items-center justify-center mb-3 shadow-sm`}>
            {statistic.icon}
          </div>
          <h4 className="font-bold text-slate-900">{statistic.label}</h4>
          <p className="text-xs text-gray-400 uppercase tracking-tighter">{statistic.subtext}</p>
        </div>
      ))}
    </div>
  );

  const renderRequirementsSection = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-4xl font-black text-slate-900 mb-12 tracking-tighter uppercase">
          What we’ll need from you
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {operationalRequirements.map((requirement) => (
            <div 
              key={requirement.label} 
              className="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] flex flex-col items-center group hover:bg-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                {requirement.icon}
              </div>
              <span className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPromiseSection = () => (
    <section className="py-20 bg-white border-t border-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <CheckCircle className="text-emerald-500" size={28} />
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            <span className="text-blue-600">GKS</span> Promise
          </h3>
        </div>
        <div className="space-y-6">
          {serviceBrandGuarantees.map((guarantee, index) => (
            <div 
              key={index} 
              className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="text-slate-600">{guarantee.icon}</div>
              <span className="text-xl font-bold text-slate-800">{guarantee.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderSearchHero = () => (
    <section className="relative pt-20 pb-32 overflow-hidden border-t border-slate-50 mt-10">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full mb-8 shadow-sm">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest italic">
            {heroMessaging.badge}
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
          {heroMessaging.mainTitle} <br className="hidden md:block" />
          <span className="text-blue-600">{heroMessaging.accentTitle}</span>
        </h1>

        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSearchExecution} 
            className="p-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full text-left">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={heroMessaging.searchPlaceholder}
                className="w-full pl-14 pr-6 py-5 rounded-2xl text-slate-900 outline-none font-bold placeholder:text-slate-300"
              />
            </div>
            <button 
              type="submit" 
              className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Find Pro
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  // --- 4. FINAL VIEW ASSEMBLY ---

  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* Visual Trust Indicators */}
      {renderTrustHeader()}

      {/* Main Service Selection Component */}
      <ServiceCategorySection />

      {/* Customer Expectations Section */}
      {renderRequirementsSection()}

      {/* Brand Integrity / Warranty Section */}
      {renderPromiseSection()}

      {/* Social Proof / Trust Section */}
      <CustomerReviews />

      {/* Final Search Interaction Section */}
      {renderSearchHero()}
    </main>
  );
};

export default HeroSection;