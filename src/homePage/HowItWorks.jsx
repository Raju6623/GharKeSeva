import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Smile, Sparkles } from 'lucide-react';

/**
 * HowItWorks Component - Redesigned
 * Premium glassmorphism approach with staggered animations.
 */
import useTranslation from '../hooks/useTranslation';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

function HowItWorks() {
    const { t } = useTranslation();

    const STEPS = [
        {
            id: 1,
            title: t('pick'),
            description: t('pick_desc'),
            icon: <Search className="w-8 h-8 md:w-10 md:h-10" />,
            gradient: "from-[#0c8182]/20 to-[#0c8182]/10",
            iconColor: "text-[#0c8182]",
            glow: "group-hover:shadow-[#0c8182]/20"
        },
        {
            id: 2,
            title: t('book'),
            description: t('book_desc'),
            icon: <CalendarCheck className="w-8 h-8 md:w-10 md:h-10" />,
            gradient: "from-[#0c8182]/20 to-[#0c8182]/10",
            iconColor: "text-[#0c8182]",
            glow: "group-hover:shadow-[#0c8182]/20"
        },
        {
            id: 3,
            title: t('relax'),
            description: t('relax_desc'),
            icon: <Smile className="w-8 h-8 md:w-10 md:h-10" />,
            gradient: "from-[#0c8182]/20 to-[#0c8182]/10",
            iconColor: "text-[#0c8182]",
            glow: "group-hover:shadow-[#0c8182]/20"
        }
    ];

    return (
        <section className="relative py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-16 lg:gap-24">

                    {/* Left Side: Sticky Header */}
                    <div className="md:w-5/12">
                        <div className="sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-[#0c8182] text-xs font-black uppercase tracking-widest mb-6 border border-teal-100"
                            >
                                <Sparkles size={14} />
                                {t('our_process')}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6"
                            >
                                {t('experience_excellence')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0c8182] to-teal-500">{t('in_3_steps')}</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm"
                            >
                                {t('process_desc')}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 hidden md:block"
                            >
                                <p className="text-sm text-slate-400 italic">"{t('promise_desc')}"</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side: Timeline Steps */}
                    <div className="md:w-7/12 relative pl-8 md:pl-0">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-12 top-8 bottom-0 w-px bg-slate-200 hidden md:block" />

                        <div className="space-y-12 relative">
                            {STEPS.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative flex gap-8 md:pl-12 group"
                                >
                                    {/* Timeline Dot (Desktop) */}
                                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-white border-4 border-[#0c8182] z-10 hidden md:block group-hover:scale-150 transition-transform duration-300 shadow-[0_0_0_4px_rgba(12,129,130,0.1)]" />

                                    {/* Icon Box */}
                                    <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} ${step.iconColor} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-300 z-10 border border-white`}>
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-5xl font-black text-slate-100 -ml-4 -mt-4 absolute z-0 select-none opacity-50">{step.id}</span>
                                            <h3 className="text-xl font-bold text-slate-900 relative z-10">{step.title}</h3>
                                        </div>
                                        <p className="text-slate-500 font-medium leading-relaxed relative z-10 group-hover:text-slate-700 transition-colors">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
