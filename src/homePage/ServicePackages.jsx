import React, { useEffect, useState } from 'react';
import { Package, Check, ArrowRight, Tag, Star, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, getImageUrl } from '../config';

import useTranslation from '../hooks/useTranslation';

function ServicePackages() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        // Fetch Real Packages from Backend
        axios.get(`${API_URL}/packages`)
            .then(res => {
                if (res.data.success) {
                    setPackages(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching packages:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return null; // Or a skeleton loader
    if (packages.length === 0) return null;

    // Helper to pick color - Unified to Teal
    const getColor = (idx) => {
        return { bg: "bg-[#effafa] border-[#0c8182]/20", btn: "bg-[#0c8182] hover:bg-[#0a6d6d]" };
    };

    const packageCards = packages.map((pkg, idx) => {
        const theme = getColor(idx);
        return (
            <div key={pkg._id} className={`relative p-8 rounded-[2rem] border ${theme.bg} flex flex-col justify-between hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 group min-h-[460px] bg-white`}>
                {/* Floating Tag */}
                {(pkg.tag || pkg.discount > 0) && (
                    <div className="absolute -top-3 left-6 bg-[#0c8182] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Tag size={12} className="text-white" /> {pkg.tag || `${pkg.discount}% OFF`}
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-3 mt-4 leading-tight">{pkg.packageName}</h3>
                    <p className="text-xs text-slate-500 mb-6 h-12 overflow-hidden leading-relaxed">{pkg.description}</p>

                    <ul className="space-y-4 mb-8">
                        {pkg.includedServices && pkg.includedServices.slice(0, 4).map((s, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:bg-[#0c8182] group-hover:text-white transition-colors duration-300">
                                    <Check size={12} className="text-[#0c8182] group-hover:text-white" />
                                </div>
                                <span className="leading-snug font-medium">{s.name ? s.name : s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">₹{pkg.priceAmount}</span>
                        {pkg.originalPrice && (
                            <span className="text-sm text-slate-400 line-through font-bold">₹{pkg.originalPrice}</span>
                        )}
                    </div>
                    <button onClick={() => navigate('/services')} className={`w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl shadow-teal-100 transition-all active:scale-95 flex items-center justify-center gap-2 ${theme.btn}`}>
                        {t('book_package')} <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    });

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200">
                            <Sparkles size={14} className="text-[#0c8182]" /> {t('curated_deals')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('best_selling_packages')}</h2>
                        <p className="text-lg text-slate-500 mt-3 font-medium">{t('bundle_save')}</p>
                    </div>
                    <button onClick={() => navigate('/services')} className="text-[#0c8182] text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                        {t('view_all_offers')} <ArrowRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {packageCards}
                </div>
            </div>
        </section>
    );
}

export default ServicePackages;
