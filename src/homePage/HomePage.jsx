import React from 'react';
import { 
  ShieldCheck, Star, ArrowRight, 
  Users, Sparkles, TrendingUp, ChevronRight,
  Activity, Cpu, Fingerprint, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';

const HomePage = () => {
  // --- 1. DATA CONFIGURATION (Outside Return) ---
  const luxuryStats = [
    { label: "Elite Experts", value: "2.5k+", icon: <Users size={18}/> },
    { label: "Quality Score", value: "4.9/5", icon: <Star size={18}/> },
    { label: "Patna Hubs", value: "120+", icon: <TrendingUp size={18}/> }
  ];

  const techNodes = [
    { label: "GKS Matching", icon: <Cpu size={14}/>, position: "top-[15%] left-[10%]" },
    { label: "Secure Auth", icon: <Fingerprint size={14}/>, position: "bottom-[25%] right-[10%]" },
    { label: "Patna Live", icon: <MapPin size={14}/>, position: "top-[45%] right-[5%]" },
  ];

  // --- 2. LOGIC FUNCTIONS (Outside Return) ---

  const renderAbstractVisual = () => (
    <div className="lg:col-span-5 relative hidden lg:block h-[600px]">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-20" />

      {/* Glassmorphic Terminal Card */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-white/20 shadow-2xl flex flex-col justify-center items-center overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        {/* Central Logo/Brand Mark */}
        <div className="relative z-10 w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)] border border-blue-500/20">
          <span className="text-3xl font-black italic tracking-tighter">GKS</span>
        </div>

        {/* Floating Intelligence Nodes */}
        {techNodes.map((node, i) => (
          <div key={i} className={`absolute ${node.position} bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce-slow`}>
            <div className="text-blue-400">{node.icon}</div>
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{node.label}</span>
          </div>
        ))}
      </div>
      {/* System Integrity Badge Removed */}
    </div>
  );

  // --- 3. MAIN DISPLAY RENDER ---
  return (
    <div className="bg-white min-h-screen">
      {/* 1. IMMERSIVE HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-12 pb-24 overflow-hidden">
        {/* Editorial Dark Sweep */}
        <div className="absolute top-0 right-0 -z-10 w-[55%] h-full bg-slate-900 rounded-bl-[20rem] hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Content Block */}
          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-600 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] mb-12 shadow-sm">
              <MapPin size={16}/> Bihar's Premium Service Network
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-10">
              Ghar Ke <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Excellence.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mb-14 border-l-4 border-blue-600 pl-8 italic">
              "Ab har kaam hoga asaan." <br/>Professional experts, local trust, and premium quality service now across Bihar.
            </p>

            <div className="flex flex-wrap items-center gap-8">
              <Link to="/services" className="group bg-slate-900 text-white px-14 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-2xl flex items-center gap-4 active:scale-95">
                Initialize Portal <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
              </Link>
            </div>

            <div className="mt-24 grid grid-cols-3 gap-12 border-t border-slate-100 pt-12 max-w-lg">
              {luxuryStats.map((s, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">{s.icon} {s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Abstract Visual Render */}
          {renderAbstractVisual()}
        </div>
      </section>

      {/* 2. STYLIST CALL-TO-ACTION */}
      <section className="py-40 bg-white relative overflow-hidden border-t border-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-16 uppercase">
            Elevate Bihar's <br/>
            <span className="text-blue-600 italic font-serif font-light normal-case">Standard of Living.</span>
          </h2>
          <Link to="/services" className="relative inline-flex overflow-hidden group bg-slate-900 text-white px-20 py-8 rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-all hover:bg-blue-600">
             <span className="relative z-10 flex items-center gap-4">
                Enter The Portal <ChevronRight size={18}/>
             </span>
          </Link>
        </div>
        
        {/* Scrolling Text Ticker Backdrop */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
           <p className="text-[15rem] font-black whitespace-nowrap tracking-tighter leading-none">
             GHARKESEVA BIHAR GHARKESEVA PATNA
           </p>
        </div>
      </section>

      {/* HeroSection handles the category filtering or search logic below */}
      <HeroSection/>
    </div>
  );
};

export default HomePage;