import React from 'react';
import { ArrowLeft, Calendar, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
    {
        id: 1,
        title: "5 Simple Ways to Boost Your AC's Cooling This Summer",
        category: "Appliances",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
        readTime: "3 min read",
        desc: "Is your AC blowing warm air? Before you call a technician, try these simple maintenance hacks to improve efficiency instanty."
    },
    {
        id: 2,
        title: "Monsoon Hacks: How to Protect your Walls from Dampness",
        category: "Home Maintenance",
        image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
        readTime: "4 min read",
        desc: "Seelan (dampness) can destroy your expensive paint. Learn how to spot early signs and fix them before it gets worse."
    },
    {
        id: 3,
        title: "Why Your RO Water Purifier Needs Service Every 6 Months",
        category: "Health",
        image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=600&auto=format&fit=crop",
        readTime: "2 min read",
        desc: "Drinking water from an unserviced RO can be more dangerous than tap water. Here is why you shouldn't skip the maintenance."
    }
];

const BlogPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Header */}
            <div className="bg-white p-6 sticky top-0 z-10 border-b border-slate-100 shadow-sm flex items-center gap-4">
                <Link to="/" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Expert Tips & Guides</h1>
            </div>

            <div className="max-w-xl mx-auto p-4 space-y-6">

                {/* Featured Card */}
                <div className="bg-[#1a1c21] rounded-2xl overflow-hidden shadow-xl shadow-slate-300 relative group cursor-pointer">
                    <div className="absolute top-4 left-4 bg-[#0c8182] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest z-10">
                        Trending
                    </div>
                    <img src="https://images.unsplash.com/photo-1581094794329-cd132c3a8f3c?q=80&w=800&auto=format&fit=crop" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Featured" />
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-white leading-tight mb-2">How to reduce electricity bill while using AC 24x7?</h2>
                        <p className="text-slate-400 text-sm mb-4">Save up to 30% on your next bill with these smart usage habits.</p>
                        <button className="text-[#0c8182] font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read Article <ArrowLeft size={16} className="rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Article List */}
                <div className="space-y-4">
                    {articles.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition-all">
                            <img src={item.image} alt={item.title} className="w-24 h-24 rounded-lg object-cover bg-slate-100 shrink-0" />
                            <div className="flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.category}</span>
                                    <h3 className="text-sm font-bold text-slate-800 leading-tight mt-1 line-clamp-2">{item.title}</h3>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                        <Calendar size={10} /> {item.readTime}
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                                            <MessageCircle size={14} />
                                        </button>
                                        <button className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEO Footer Text */}
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <h4 className="font-black text-blue-900 text-sm mb-2">Service That Cares</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        At GharKeSeva, we don't just fix things; we help you maintain your home better.
                        Stay tuned for more expert advice on home care, safety, and hygiene.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default BlogPage;
