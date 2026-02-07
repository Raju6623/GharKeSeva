import React, { useState } from 'react';
import { MapPin, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PatnaSpecialBanner = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('PATNA15');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-1 shadow-2xl shadow-indigo-500/20">

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">

                    {/* Left Content */}
                    <div className="flex-1 text-center md:text-left z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-xs font-black uppercase tracking-widest mb-4 shadow-lg shadow-amber-500/20"
                        >
                            <Sparkles size={14} className="fill-amber-900" />
                            Exclusive Offer
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight"
                        >
                            Patna Residents <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">Special</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-slate-300 text-base md:text-lg font-medium max-w-lg mx-auto md:mx-0"
                        >
                            Get <span className="text-white font-bold underline decoration-amber-400 decoration-2 underline-offset-4">15% EXTRA OFF</span> on all services every Sunday!
                        </motion.p>
                    </div>

                    {/* Right Content - Coupon Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative group cursor-pointer"
                        onClick={handleCopy}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-300 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 min-w-[280px]">

                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Use Code at Checkout</div>

                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-6 py-3 w-full justify-between group-hover:bg-white/10 transition-colors">
                                <span className="text-2xl font-mono font-black text-white tracking-widest">PATNA15</span>
                                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-slate-400 group-hover:text-white" />}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-bold text-teal-400">
                                <MapPin size={12} />
                                Valid Only in Patna Region
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default PatnaSpecialBanner;
