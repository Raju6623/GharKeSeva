import React, { useState } from 'react';
import { 
  Zap, MapPin, Phone, CheckCircle2, Clock, 
  Wallet, User, History, Power, Navigation,
  Calendar, Star, ChevronRight, Bell
} from 'lucide-react';

const VendorPanel = () => {
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeTab, setActiveTab] = useState('Jobs');

  // --- VENDOR DATA ---
  const vendorInfo = { name: "Vikram Singh", rating: "4.9", experience: "5+ Years", type: "AC Specialist" };

  const currentJobs = [
    { 
      id: '#GS-9021', 
      customer: 'Rahul Sharma', 
      address: 'Plot 12, Jubilee Hills, Hyderabad',
      time: '11:00 AM - 01:00 PM',
      service: 'Split AC Jet Wash',
      amount: '₹849'
    }
  ];

  const recentEarnings = [
    { day: 'Today', bookings: 4, earned: '₹3,200' },
    { day: 'Yesterday', bookings: 6, earned: '₹4,850' }
  ];

  // --- LOGIC FUNCTIONS (OUTSIDE RETURN) ---

  const renderJobCard = (job) => (
    <div key={job.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-6 group transition-all active:scale-[0.98]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">New Booking</span>
          <h3 className="text-xl font-black text-slate-900 mt-2 tracking-tighter">{job.service}</h3>
        </div>
        <p className="text-lg font-black text-slate-900 tracking-tighter">{job.amount}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Clock size={16}/></div>
          <span className="text-xs font-bold">{job.time}</span>
        </div>
        <div className="flex items-start gap-3 text-slate-500">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 flex-shrink-0"><MapPin size={16}/></div>
          <span className="text-xs font-bold leading-relaxed">{job.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">
          <Phone size={14}/> Call
        </button>
        <button className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
          <Navigation size={14}/> Directions
        </button>
      </div>
      
      <button className="w-full mt-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
        Start Job
      </button>
    </div>
  );

  const renderBottomNav = () => {
    const navItems = [
      { id: 'Jobs', icon: <Calendar size={20}/> },
      { id: 'Wallet', icon: <Wallet size={20}/> },
      { id: 'History', icon: <History size={20}/> },
      { id: 'Profile', icon: <User size={20}/> }
    ];
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-2' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    );
  };

  // --- MAIN UI RENDER ---

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24 font-sans selection:bg-blue-100">
      
      {/* 1. TOP HEADER SECTION */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-8 sticky top-0 z-40">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-xl">VS</div>
             <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter">Hi, {vendorInfo.name}</h1>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      <Star size={10} className="fill-emerald-600"/> {vendorInfo.rating}
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vendorInfo.type}</span>
                </div>
             </div>
          </div>
          
          {/* Duty Switcher */}
          <button 
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all duration-500 ${isOnDuty ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
          >
             <Power size={14}/>
             <span className="text-[10px] font-black uppercase tracking-widest">{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        
        {/* 2. SUMMARY CARDS */}
        <section className="grid grid-cols-2 gap-4 mb-10">
           <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Wallet size={40}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 text-blue-300">Earnings</p>
              <h3 className="text-2xl font-black tracking-tighter">₹12,450</h3>
           </div>
           <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Zap size={40}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bookings</p>
              <h3 className="text-2xl font-black tracking-tighter text-slate-900">42</h3>
           </div>
        </section>

        {/* 3. DYNAMIC CONTENT BASED ON TAB */}
        {activeTab === 'Jobs' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
              Assigned Jobs <span className="p-1.5 bg-blue-600 rounded-full text-white text-[10px] px-2">{currentJobs.length}</span>
            </h2>
            {isOnDuty ? (
              currentJobs.map(renderJobCard)
            ) : (
              <div className="py-20 text-center space-y-4">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <Power size={32}/>
                 </div>
                 <p className="text-slate-400 font-bold text-sm tracking-tight italic">You are currently Off Duty.<br/>Turn on duty to receive new jobs.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'Wallet' && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 tracking-tighter">Daily Reports</h2>
            <div className="space-y-4">
               {recentEarnings.map((report, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 font-black text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-all tracking-widest">{report.day.substring(0,3)}</div>
                       <div>
                          <p className="font-black text-slate-900 tracking-tight">{report.earned}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{report.bookings} Completed</p>
                       </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors"/>
                 </div>
               ))}
               <button className="w-full py-4 mt-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-emerald-100 transition-all">Withdraw to Bank</button>
            </div>
          </section>
        )}

      </main>

      {/* 4. BOTTOM NAVIGATION */}
      {renderBottomNav()}
    </div>
  );
};

export default VendorPanel;