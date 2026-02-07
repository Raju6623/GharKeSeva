import React from 'react';
import { Link } from 'react-router-dom';
import {
    Instagram,
    Facebook,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

import useTranslation from '../hooks/useTranslation';

function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { name: t('footer_ac_service'), link: "/services/acservice" },
            { name: t('footer_salon_women'), link: "/services/salon-for-women" },
            { name: t('footer_plumbing'), link: "/services/plumbing-service" },
            { name: t('footer_cleaning'), link: "/services/house-maid-service" },
            { name: t('footer_painters'), link: "/services/painting-service" }
        ],
        company: [
            { name: t('about_us'), link: "/contact" },
            { name: t('contact_us'), link: "/contact" },
            { name: t('terms_conditions'), link: "/contact" },
            { name: t('privacy_policy'), link: "/contact" },
            { name: t('service_warranty'), link: "/contact" }
        ]
    };

    const socialIcons = [Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
        <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0c8182] hover:text-white transition-all duration-300">
            <Icon size={18} />
        </a>
    ));

    const serviceLinksList = footerLinks.services.map((link, i) => (
        <li key={i}>
            <Link to={link.link} className="hover:text-[#0c8182] text-sm transition-colors flex items-center group">
                <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#0c8182]" />
                {link.name}
            </Link>
        </li>
    ));

    const companyLinksList = footerLinks.company.map((link, i) => (
        <li key={i}>
            <Link to={link.link} className="hover:text-[#0c8182] text-sm transition-colors flex items-center group">
                <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#0c8182]" />
                {link.name}
            </Link>
        </li>
    ));

    return (
        <footer className="bg-slate-900 pt-20 pb-10 text-slate-300 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0c8182]/5 blur-[120px] rounded-full -mr-48 -mt-48" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-black tracking-tighter text-white">
                                GHARKE<span className="text-[#0c8182]">SEVA</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            {t('footer_desc')}
                        </p>
                        <div className="flex items-center gap-4">
                            {socialIcons}
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 tracking-wide">{t('services')}</h4>
                        <ul className="space-y-4">
                            {serviceLinksList}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 tracking-wide">{t('company')}</h4>
                        <ul className="space-y-4">
                            {companyLinksList}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 tracking-wide">{t('contact_us')}</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-[#0c8182]">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">{t('email_label')}</p>
                                    <p className="text-sm font-medium">support@gharkeseva.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-[#0c8182]">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">{t('call_us')}</p>
                                    <p className="text-sm font-medium">+91 92413 33130</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-[#0c8182]">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">{t('location')}</p>
                                    <p className="text-sm font-medium">{t('new_delhi_india')}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Trust Banner */}
                <div className="border-t border-slate-800/50 pt-10 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#0c8182] group-hover:bg-[#0c8182] group-hover:text-white transition-all border border-white/5">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-white block">{t('secure_payments')}</span>
                            <span className="text-xs text-slate-500">{t('encrypted_transactions')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#0c8182] group-hover:bg-[#0c8182] group-hover:text-white transition-all border border-white/5">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-white block">{t('verified_pros')}</span>
                            <span className="text-xs text-slate-500">{t('background_checks')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#0c8182] group-hover:bg-[#0c8182] group-hover:text-white transition-all border border-white/5">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-white block">{t('damage_protection')}</span>
                            <span className="text-xs text-slate-500">{t('peace_of_mind')}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-800/50">
                    <p className="text-xs text-slate-500 font-medium">
                        © {currentYear} GHARKESEVA. {t('all_rights_reserved')}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wide">
                        {t('designed_with')} <span className="text-red-500 animate-pulse">❤️</span> {t('in_india')}
                    </div>
                    <div className="flex gap-6">
                        <Link to="/contact" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{t('safety')}</Link>
                        <Link to="/contact" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{t('privacy')}</Link>
                        <Link to="/contact" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{t('terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
