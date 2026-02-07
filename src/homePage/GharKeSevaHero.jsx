import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ArrowLeft, Share2, Zap, MessageCircle,
    Scissors, Droplets, Hammer, Paintbrush,
    Fan, SprayCan as CleaningIcon, Wrench, Snowflake, Home,
    Laptop, Tv, Smartphone, Briefcase, User,
    Sparkles, Bath, Waves, Brush, Pipette,
    HeartPulse, ChefHat, PaintRoller, Layout, Palette,
    Power, Lightbulb, Plug, Drill, Microwave,
    Refrigerator, WashingMachine, MapPin
} from 'lucide-react';
import axios from 'axios';
import useTranslation from '../hooks/useTranslation';
import { API_URL } from '../config';

function GharKeSevaHero() {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [activeOption, setActiveOption] = useState(0); // Track which option is in view
    const { t } = useTranslation();

    // Scroll-based highlighting
    React.useEffect(() => {
        if (!activeModal) return;

        const options = document.querySelectorAll('[data-option-index]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-option-index'));
                        setActiveOption(index);
                    }
                });
            },
            { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' }
        );

        options.forEach((option) => observer.observe(option));
        return () => observer.disconnect();
    }, [activeModal]);

    // Hardcoded icon mapping
    const ICON_MAP = {
        'InstaHelp': '/3d-icons/instahelp_3d_icon_1770030049517.png',
        'Salon': '/3d-icons/salon_3d_icon_new_1770127291022.png',
        'Cleaning': '/3d-icons/cleaning_3d_icon_1770030164375.png',
        'Repairs': '/3d-icons/repairs_3d_icon_1770030199466.png',
        'Purifier': '/3d-icons/purifier_3d_icon_1770030383521.png',
        'Painting': '/3d-icons/painting_3d_icon_final_1770030628109.png',
        'Appliance': '/3d-icons/ac_repair_3d_icon_final_1770030726700.png',
        'Home Maids': '/3d-icons/home_maids_3d_icon_new_1770032229545.png',
        'Wall Makeover': '/3d-icons/wall_makeover_3d_icon_final_1770030872830.png'
    };

    React.useEffect(() => {
        axios.get(`${API_URL}/categories`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setDynamicCategories(res.data);
                }
            })
            .catch(err => console.error("Failed to fetch categories:", err));
    }, []);

    const FALLBACK_SERVICES = [
        { id: 1, title: t('instahelp') || "InstaHelp", img: "/3d-icons/instahelp_3d_icon_1770030049517.png", tag: t('tag_10min') || "10 MIN", link: "/services/electrician-service" },
        { id: 2, title: t('salon') || "Salon", img: "/3d-icons/salon_3d_icon_new_1770127291022.png", modalKey: 'Salon' },
        { id: 3, title: t('cleaning') || "Cleaning", img: "/3d-icons/cleaning_3d_icon_1770030164375.png", link: "/services/house-maid-service" },
        { id: 4, title: t('repairs') || "Repairs", img: "/3d-icons/repairs_3d_icon_1770030199466.png", modalKey: 'Repairs' },
        { id: 5, title: t('purifier') || "Purifier", img: "/3d-icons/purifier_3d_icon_1770030383521.png", tag: t('tag_sale') || "SALE", link: "/services/ro-service" },
        { id: 6, title: t('painting') || "Painting", img: "/3d-icons/painting_3d_icon_final_1770030628109.png", link: "/services/painting-service" },
        { id: 7, title: t('appliance') || "Appliance", img: "/3d-icons/ac_repair_3d_icon_final_1770030726700.png", modalKey: 'Appliance' },
        { id: 8, title: t('home_maids') || "Home Maids", img: "/3d-icons/home_maids_3d_icon_new_1770032229545.png", link: "/services/maid-service" },
        { id: 9, title: t('wall_makeover') || "Wall Makeover", img: "/3d-icons/wall_makeover_3d_icon_final_1770030872830.png", tag: t('tag_new') || "NEW", link: "/services/painting-service" }
    ];

    const HERO_SERVICES = dynamicCategories.length > 0
        ? dynamicCategories.map(cat => ({
            id: cat._id,
            title: t(cat.name.toLowerCase().replace(/\s+/g, '_')) || cat.name,
            img: ICON_MAP[cat.name] || '/3d-icons/instahelp_3d_icon_1770030049517.png', // Use hardcoded icon
            tag: cat.tag,
            link: cat.link,
            modalKey: cat.modalKey
        }))
        : FALLBACK_SERVICES;

    const SELECTION_MODALS = {
        'Salon': {
            title: t('salon') || "Salon",
            sections: [
                {
                    header: t('select_salon_type') || "Select Salon Type",
                    options: [
                        { label: t('salon_women') || "Women's Salon", link: "/services/salon-for-women", icon: <Scissors size={20} className="text-[#0c8182]" /> },
                        { label: t('salon_men') || "Men's Salon", link: "/services/salon-for-men", icon: <User size={20} className="text-[#0c8182]" /> }
                    ]
                }
            ]
        },
        'Repairs': {
            title: t('repairs') || "Repairs",
            sections: [
                {
                    header: t('select_expert_type') || "Select Expert Type",
                    options: [
                        { label: t('electrician') || "Electrician", link: "/services/electrician-service", icon: <Zap size={20} className="text-[#0c8182]" /> },
                        { label: t('plumber') || "Plumber", link: "/services/plumbing-service", icon: <Droplets size={20} className="text-[#0c8182]" /> },
                        { label: t('carpenter') || "Carpenter", link: "/services/carpenter-service", icon: <Hammer size={20} className="text-[#0c8182]" /> }
                    ]
                }
            ]
        },
        'Appliance': {
            title: t('appliance') || "Appliance",
            sections: [
                {
                    header: t('home_appliances') || "Home appliances",
                    options: [
                        { label: t('label_ac') || "AC", link: "/services/acservice", icon: <Snowflake size={20} className="text-[#0c8182]" /> },
                        { label: t('label_tv') || "TV", link: "/services/appliances-service", icon: <Tv size={20} className="text-[#0c8182]" /> },
                        { label: t('label_laptop') || "Laptop", link: "/services/appliances-service", icon: <Laptop size={20} className="text-[#0c8182]" /> }
                    ]
                },
                {
                    header: t('kitchen') || "Kitchen",
                    options: [
                        { label: t('refrigerator') || "Refrigerator", link: "/services/appliances-service", icon: <Snowflake size={20} className="text-[#0c8182]" /> },
                        { label: t('microwave') || "Microwave", link: "/services/appliances-service", icon: <Power size={20} className="text-[#0c8182]" /> }
                    ]
                }
            ]
        }
    };

    const handleServiceClick = (service) => {
        if (service.modalKey) {
            setActiveModal(SELECTION_MODALS[service.modalKey]);
        } else {
            navigate(service.link);
        }
    };

    return (
        <section className="bg-white pt-24 pb-16 relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
                    {/* Left Side: Service Grid */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-slate-100 p-8 py-10 relative">
                        <h2 className="text-2xl font-[1000] text-slate-800 mb-10 tracking-tight text-center sm:text-left">{t('what_looking_for') || "What are you looking for?"}</h2>

                        <div className="grid grid-cols-3 gap-x-4 gap-y-10 text-center">
                            {HERO_SERVICES.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className="flex flex-col items-center gap-2 cursor-pointer group relative"
                                >
                                    {service.tag && (
                                        <div className="absolute -top-3 -right-0 bg-[#0c8182] text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-md z-20">
                                            {service.tag}
                                        </div>
                                    )}

                                    {/* 3D ILLUSTRATIVE ICON CARD - COMPACT SIZE */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f4f7f6] rounded flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] group-hover:-translate-y-1 group-active:scale-95 relative overflow-hidden p-2">
                                        <img
                                            src={service.img}
                                            alt={service.title}
                                            className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
                                            loading="eager"
                                        />
                                    </div>

                                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-tight group-hover:text-slate-950 transition-colors leading-[1.3] mt-1 max-w-[100px] h-[30px] flex items-center justify-center text-center">
                                        {service.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Hero Images */}
                    <div className="hidden lg:grid grid-cols-2 gap-4 h-full">
                        <div className="col-span-2 h-72 rounded-[2.5rem] overflow-hidden relative group shadow-xl">
                            <img src="/service-man-adjusting-house-heating-system.webp" alt="Home Services" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="eager" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="h-64 rounded-[2.5rem] overflow-hidden relative group shadow-lg">
                            <img src="/man-servant-doing-chores-around-house.webp" alt="Cleaning" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="eager" />
                        </div>
                        <div className="h-64 rounded-[2.5rem] overflow-hidden relative group shadow-lg">
                            <img src="/HomePageHero/AC Checking.webp" alt="AC Repair" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="eager" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection Modal Implementation */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
                        >
                            {/* Modal Header */}
                            <div className="p-6 pb-2 flex items-center justify-between border-b border-gray-50">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight ml-2">{activeModal.title}</h3>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 max-h-[70vh] overflow-y-auto">
                                {activeModal.sections.map((section, sIdx) => (
                                    <div key={sIdx} className={sIdx > 0 ? "mt-8" : ""}>
                                        <h4 className="text-[17px] font-black text-slate-800 mb-6">{section.header}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {section.options.map((option, idx) => {
                                                const globalIndex = sIdx * 10 + idx; // Unique index across sections
                                                const isActive = activeOption === globalIndex;

                                                return (
                                                    <button
                                                        key={idx}
                                                        data-option-index={globalIndex}
                                                        onClick={() => {
                                                            navigate(option.link);
                                                            setActiveModal(null);
                                                        }}
                                                        className={`group flex items-center justify-between p-4 bg-white border rounded-2xl transition-all duration-300 shadow-sm ${isActive
                                                            ? 'border-[#0c8182] border-2 bg-slate-50 shadow-md scale-105'
                                                            : 'border-slate-100 hover:border-[#0c8182] hover:bg-slate-50 hover:shadow-md'
                                                            }`}
                                                    >
                                                        <span className={`text-sm font-extrabold transition-colors ${isActive ? 'text-[#0c8182]' : 'text-slate-700 group-hover:text-[#0c8182]'
                                                            }`}>
                                                            {option.label}
                                                        </span>
                                                        <div className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-colors ${isActive
                                                            ? 'bg-[#effafa] border-[#0c8182]/20'
                                                            : 'bg-slate-50 border-slate-50 group-hover:bg-[#effafa] group-hover:border-[#0c8182]/20'
                                                            }`}>
                                                            {React.cloneElement(option.icon, { className: "text-[#0c8182]" })}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Subtle Footer */}
                            <div className="p-6 pt-2 text-center border-t border-gray-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('premium_experience') || "GharKeSeva Premium Experience"}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/919241333130?text=Hi%20GharKeSeva,%20I%20need%20help%20with%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-4 border-white"
            >
                <MessageCircle size={28} fill="white" className="text-[#25D366]" />
            </a>
        </section>
    );
}

export default GharKeSevaHero;
