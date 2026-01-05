import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ClipboardList, Wallet, Settings, 
  Search, Bell, MoreVertical, TrendingUp, UserCheck, 
  Clock, CheckCircle2, AlertCircle, Filter, Download
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // --- MOCK DATA FOR THE DASHBOARD ---
  const stats = [
    { label: 'Total Revenue', value: '₹4,52,900', icon: <Wallet className="text-emerald-600"/>, change: '+12.5%', color: 'bg-emerald-50' },
    { label: 'Active Bookings', value: '142', icon: <ClipboardList className="text-blue-600"/>, change: '+5.2%', color: 'bg-blue-50' },
    { label: 'Verified Techs', value: '86', icon: <UserCheck className="text-purple-600"/>, change: '+2', color: 'bg-purple-50' },
    { label: 'Satisfaction', value: '4.8/5', icon: <TrendingUp className="text-orange-600"/>, change: '+0.1', color: 'bg-orange-50' },
  ];

  const recentBookings = [
    { id: '#GS-9021', user: 'Rahul Sharma', service: 'Split AC Jet Wash', tech: 'Vikram Singh', status: 'In Progress', amount: '₹849' },
    { id: '#GS-9020', user: 'Sneha Reddy', service: 'Deep Home Cleaning', tech: 'Amit Kumar', status: 'Completed', amount: '₹2,499' },
    { id: '#GS-9019', user: 'Anil Kapoor', service: 'Tap Repair', tech: 'Unassigned', status: 'Pending', amount: '₹199' },
    { id: '#GS-9018', user: 'Priya Verma', service: 'Microwave Fix', tech: 'Suresh Raina', status: 'Cancelled', amount: '₹349' },
  ];

  // --- LOGIC FUNCTIONS (OUTSIDE RETURN) ---

  const renderStatusBadge = (status) => {
    const styles = {
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pending': 'bg-orange-100 text-orange-700 border-orange-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const renderSidebarItem = (name, icon) => (
    <button 
      onClick={() => setActiveTab(name)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
        activeTab === name 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-2' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      {icon}
      <span className="text-sm font-bold uppercase tracking-widest">{name}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-slate-900 rounded-xl"><ClipboardList className="text-white" size={24}/></div>
          <span className="text-xl font-black tracking-tighter uppercase italic">GharKe<span className="text-blue-600">Seva</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {renderSidebarItem('Dashboard', <LayoutDashboard size={20}/>)}
          {renderSidebarItem('Bookings', <ClipboardList size={20}/>)}
          {renderSidebarItem('Technicians', <Users size={20}/>)}
          {renderSidebarItem('Payments', <Wallet size={20}/>)}
          {renderSidebarItem('Settings', <Settings size={20}/>)}
        </nav>

        <div className="mt-auto p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">Admin Support</p>
           <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold shadow-xl">Contact Devs</button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">System {activeTab}</h1>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Welcome back, Super Admin</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Search orders, IDs..." className="bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all"/>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 relative">
              <Bell size={20}/>
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-200">SA</div>
          </div>
        </header>

        {/* 3. DASHBOARD STATS SECTION */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] group hover:translate-y-[-5px] transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 ${stat.color} rounded-2xl`}>{stat.icon}</div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.change}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </section>

        {/* 4. RECENT BOOKINGS TABLE SECTION */}
        <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Recent Operations</h2>
             <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100"><Filter size={14}/> Filter</button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 shadow-lg shadow-blue-100"><Download size={14}/> Export</button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Tech</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBookings.map((booking, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 font-black text-xs text-blue-600">{booking.id}</td>
                    <td className="p-6">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400">R</div>
                          <span className="font-bold text-sm text-slate-900">{booking.user}</span>
                       </div>
                    </td>
                    <td className="p-6 font-bold text-sm text-slate-500">{booking.service}</td>
                    <td className="p-6">
                       {booking.tech === 'Unassigned' ? (
                         <button className="text-[10px] font-black uppercase text-orange-500 flex items-center gap-1"><Clock size={12}/> Assign Now</button>
                       ) : (
                         <span className="font-bold text-sm text-slate-900">{booking.tech}</span>
                       )}
                    </td>
                    <td className="p-6">{renderStatusBadge(booking.status)}</td>
                    <td className="p-6 text-right font-black text-slate-900">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/50 text-center">
             <button className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] hover:underline">View All System Records</button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminPanel;