import React, { useEffect, useState } from 'react';
import { Ticket, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { BASE_URL } from '../config';

function CouponSection() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const socket = io(BASE_URL);

        // Initial Fetch
        axios.get(`${BASE_URL}/api/auth/coupons`)
            .then(res => setCoupons(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        // Real-time Listener
        socket.on('coupon_update', (payload) => {
            if (payload.type === 'add') {
                setCoupons(prev => [payload.data, ...prev]);
            } else if (payload.type === 'delete') {
                setCoupons(prev => prev.filter(c => c._id !== payload.id));
            }
        });

        return () => {
            socket.off('coupon_update');
        };
    }, []);

    const copyToClipboard = (id, code) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading || coupons.length === 0) return null;

    const backgroundDecor = (
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-[#0c8182] rounded-full blur-[100px]" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#0c8182] rounded-full blur-[100px]" />
        </div>
    );

    const couponItems = coupons.map((coupon) => (
        <motion.div
            key={coupon._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all flex justify-between items-center group relative overflow-hidden"
        >
            {/* ZigZag Border Effect (CSS) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-[#0c8182]" />

            <div>
                <h3 className="text-2xl font-black text-white leading-none mb-1">
                    {coupon.discountType === 'FLAT' ? `₹${coupon.discountValue} ` : `${coupon.discountValue}% `}
                    <span className="text-sm font-bold text-teal-300 ml-1">OFF</span>
                </h3>
                <p className="text-teal-100/80 text-xs mb-3 max-w-[180px] leading-relaxed">
                    {coupon.description}
                </p>
                <div className="inline-flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="font-mono font-bold text-teal-300 tracking-wider text-sm">{coupon.code}</span>
                </div>
            </div>

            <button
                onClick={() => copyToClipboard(coupon._id, coupon.code)}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 group-hover:shadow-[0_0_20px_rgba(12,129,130,0.4)]"
            >
                {copiedId === coupon._id ? <Check size={20} className="text-teal-400" /> : <Copy size={20} className="text-white" />}
            </button>
        </motion.div>
    ));

    return (
        <section className="py-12 bg-gradient-to-r from-teal-950 to-slate-950 relative overflow-hidden">
            {backgroundDecor}

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                        <Ticket className="text-[#0c8182]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Exclusive Offers</h2>
                        <p className="text-teal-200 text-sm font-medium">Save big on your next service</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {couponItems}
                </div>
            </div>
        </section>
    );
}

export default CouponSection;
