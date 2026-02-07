import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, MapPin, User, CheckCircle2, Clock, Check, MoreVertical, MessageSquare, Shield, MessageCircle, Star, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { BASE_URL, API_URL, getImageUrl } from '../config';
import ReviewsModal from '../components/ReviewsModal';

const formatJoinedDuration = (date) => {
    if (!date) return "1 Yr";
    const joined = new Date(date);
    const now = new Date();
    const diffInMs = now - joined;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 30) return `${diffInDays} Days`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} Mon`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} Yr${diffInYears > 1 ? 's' : ''}`;
};

function TrackOrderModal({ booking, onClose }) {
    const [vendor, setVendor] = useState(booking.vendorDetails || null);
    const [chatMessages, setChatMessages] = useState(booking.chatMessages || []);
    const [newMessage, setNewMessage] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [showVendorProfile, setShowVendorProfile] = useState(false); // New State for Detailed Profile
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

    const [unreadCount, setUnreadCount] = useState(booking.unreadCount || 0);
    const [currentStatus, setCurrentStatus] = useState(booking.bookingStatus || 'Pending');
    const [isCompleted, setIsCompleted] = useState(booking.bookingStatus === 'Completed');

    // Refresh booking data on mount to get latest messages and unread count
    useEffect(() => {
        if (booking.customerUserId) {
            axios.get(`${API_URL}/bookings/user/${booking.customerUserId}`)
                .then(res => {
                    const freshBooking = res.data.find(b => b.customBookingId === booking.customBookingId);
                    if (freshBooking) {
                        setChatMessages(freshBooking.chatMessages || []);
                        setUnreadCount(freshBooking.unreadCount || 0);
                        if (freshBooking.vendorDetails) setVendor(freshBooking.vendorDetails);
                    }
                })
                .catch(console.error);
        }
    }, [booking.customBookingId, booking.customerUserId]);

    // Mark as read when chat opens
    useEffect(() => {
        if (showChat && unreadCount > 0) {
            axios.put(`${API_URL}/booking/chat/${booking.customBookingId}/read`, { role: 'Customer' })
                .then(() => setUnreadCount(0))
                .catch(console.error);
        }
    }, [showChat, booking.customBookingId, unreadCount]);

    useEffect(() => {
        if (booking.customBookingId) {
            const socket = io(BASE_URL);
            socket.emit('join_room', booking.customBookingId);

            const handleMsg = (data) => {
                setChatMessages(prev => {
                    // Deduplicate just in case
                    if (prev.some(m => m.timestamp === data.timestamp && m.message === data.message)) return prev;
                    return [...prev, data];
                });

                // If chat is closed and msg is from Vendor, increment unread
                if (!showChat && data.sender === 'Vendor') {
                    setUnreadCount(prev => prev + 1);
                }
            };
            const handleStatusUpdate = (data) => {
                if (data.bookingId === booking.customBookingId) {
                    setCurrentStatus(data.status);
                    if (data.status === 'Completed') {
                        setIsCompleted(true);
                    }
                }
            };

            socket.on('receive_message', handleMsg);
            socket.on('booking_status_updated', handleStatusUpdate);

            return () => {
                socket.off('receive_message', handleMsg);
                socket.off('booking_status_updated', handleStatusUpdate);
                socket.disconnect();
            };
        }
    }, [booking.customBookingId, showChat]);

    const handleSendChat = async () => {
        if (!newMessage.trim()) return;
        const msgData = { sender: 'User', message: newMessage, timestamp: new Date() };

        // REMOVED optimistic update to prevent duplication
        // setChatMessages(prev => [...prev, msgData]);
        setNewMessage("");

        try {
            await axios.put(`${API_URL}/booking/chat/${booking.customBookingId}`, msgData);
        } catch (e) {
            console.error("Chat Error", e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-md h-[95vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-[60]">
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100/80 hover:bg-slate-200 rounded-full transition-all text-slate-800 backdrop-blur-sm shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative overflow-hidden pt-12">
                    <div className="absolute top-5 left-6 z-[60]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID: {booking.customBookingId}</p>
                    </div>
                    <AnimatePresence initial={false} mode="wait">
                        {isCompleted ? (
                            <motion.div
                                key="completed"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100 shadow-xl shadow-emerald-100/50">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Service Completed!</h3>
                                <p className="text-sm font-bold text-slate-400 mb-8">Your professional has marked the job as finished. We hope you liked the service!</p>

                                <div className="w-full space-y-3">
                                    <button
                                        onClick={() => {
                                            // Trigger review modal logic if available or just close
                                            onClose();
                                        }}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg"
                                    >
                                        Back to My Orders
                                    </button>
                                </div>
                            </motion.div>
                        ) : !showChat && !showVendorProfile ? (
                            <motion.div
                                key="profile"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="flex-1 overflow-y-auto px-6 py-4"
                            >
                                {vendor ? (
                                    <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">

                                        {/* ... Vendor Header ... */}
                                        <div
                                            className="flex items-center gap-4 cursor-pointer group"
                                            onClick={() => setShowVendorProfile(true)}
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                                                    {(vendor.photo || vendor.vendorPhoto) ? (
                                                        <img
                                                            src={getImageUrl(vendor.photo || vendor.vendorPhoto)}
                                                            alt="Vendor"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                            <User size={24} className="text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white px-2.5 py-1 rounded-full shadow-md border border-slate-100 flex items-center gap-1 z-10 whitespace-nowrap">
                                                    <span className="text-[10px] font-black text-slate-800">{vendor.rating && Number(vendor.rating) > 0 ? Number(vendor.rating).toFixed(1) : '4.8'}</span>
                                                    <Star size={8} className="fill-amber-400 text-amber-400" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-[#0c8182] uppercase tracking-widest mb-1">Service Partner</p>
                                                <h3 className="font-black text-xl text-slate-900 truncate group-hover:text-[#0c8182] transition-colors">
                                                    {vendor.userFullName || vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`}
                                                </h3>
                                                {/* Labels */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star
                                                                key={s}
                                                                size={12}
                                                                className={`${s <= (vendor.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Grid */}
                                        <div className="grid grid-cols-1 gap-3 py-2 border-t border-b border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#effafa] text-[#0c8182] rounded-lg"><Phone size={14} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                                    <p className="text-sm font-bold text-slate-700">{vendor.userPhone || vendor.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#effafa] text-[#0c8182] rounded-lg"><MessageCircle size={14} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                                    <p className="text-sm font-bold text-slate-700 truncate">{vendor.userEmail || vendor.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MapPin size={14} /></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Address</p>
                                                    <p className="text-sm font-bold text-slate-700 truncate">{vendor.vendorAddress || vendor.address || 'Service Area Assigned'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-1">
                                            <a
                                                href={`tel:${vendor.userPhone || vendor.phone}`}
                                                className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                                            >
                                                <Phone size={14} className="fill-white" /> Call Now
                                            </a>
                                            <button
                                                onClick={() => setShowChat(true)}
                                                className="flex-1 py-3.5 bg-[#0c8182] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#0a6d6d] transition-all shadow-lg relative"
                                            >
                                                <MessageCircle size={14} className="fill-white" /> Chat Now
                                                {unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] text-white items-center justify-center border border-white">
                                                            {unreadCount}
                                                        </span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border border-slate-100 mt-10">
                                        <div className="w-16 h-16 bg-[#effafa] text-[#0c8182] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                            <Shield size={32} />
                                        </div>
                                        <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Finding Best Pro</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assigning nearby specialist shortly...</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : showVendorProfile ? (
                            <motion.div
                                key="detailed-profile"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="flex-1 flex flex-col h-full bg-white relative"
                            >
                                {/* Back Button */}
                                <button
                                    onClick={() => setShowVendorProfile(false)}
                                    className="absolute top-4 left-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>

                                {/* Header Image (Cityscape) */}
                                <div className="h-40 bg-gradient-to-r from-orange-400 to-amber-500 relative overflow-hidden flex items-end justify-center">
                                    {/* Abstract Cityscape SVG or similar */}
                                    <svg className="w-full text-amber-700/20 absolute bottom-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                                        <path fill="#ffffff" fillOpacity="0.3" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                                    </svg>
                                    <img
                                        src="https://img.freepik.com/free-vector/indian-skyline-silhouette-illustration_23-2148197771.jpg" // Placeholder for Indian city vibe
                                        className="w-full h-full object-cover opacity-40 mix-blend-overlay absolute inset-0"
                                        alt=""
                                    />
                                </div>

                                {/* Pofile Info - Overlapping */}
                                <div className="px-6 relative -mt-16 text-center">
                                    <div className="w-32 h-32 mx-auto rounded-full p-1 bg-white shadow-xl relative z-10">
                                        {(vendor?.photo || vendor?.vendorPhoto) ? (
                                            <img
                                                src={getImageUrl(vendor?.photo || vendor?.vendorPhoto)}
                                                alt="Vendor"
                                                className="w-full h-full object-cover rounded-full border-4 border-white"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                                                <User size={40} className="text-slate-300" />
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-800 mt-4 mb-1">
                                        {vendor?.userFullName || vendor?.name || `${vendor?.firstName || ''} ${vendor?.lastName || ''}`}
                                    </h2>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 divide-x divide-slate-100 my-8">
                                        <div className="text-center px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-lg font-black text-slate-800">{vendor?.rating && Number(vendor.rating) > 0 ? Number(vendor.rating).toFixed(1) : '4.8'}</span>
                                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                            </div>
                                        </div>
                                        <div className="text-center px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Services</p>
                                            <span className="text-lg font-black text-slate-800">
                                                {vendor?.reviewCount ? (vendor.reviewCount * 3 + 45) : (Math.floor(Math.random() * 50) + 100)}+
                                            </span>
                                        </div>
                                        <div className="text-center px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                                            <span className="text-lg font-black text-slate-800">
                                                {formatJoinedDuration(vendor?.joinedDate)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#effafa]/50 p-6 rounded-3xl border border-teal-50">
                                        <p className="text-xs font-bold text-teal-900 leading-relaxed opacity-80">
                                            "{vendor?.userFullName || 'Vendor'} has been a verified service partner with GharKeSeva for {formatJoinedDuration(vendor?.joinedDate)}, delivering excellent quality in {vendor?.category || 'General'} services."
                                        </p>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="mt-8 flex gap-3">
                                        <button onClick={() => setShowVendorProfile(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors">
                                            Back
                                        </button>
                                        <button onClick={() => setIsReviewsModalOpen(true)} className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors">
                                            See Reviews
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                className="flex-1 flex flex-col h-full bg-white"
                            >
                                <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3">
                                    <button
                                        onClick={() => setShowChat(false)}
                                        className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">Live Chat</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vendor?.name || 'Service Partner'}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                                    {chatMessages.length === 0 ? (
                                        <div className="text-center py-20 opacity-30 mt-10">
                                            <MessageCircle size={48} className="mx-auto mb-3" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Start the conversation</p>
                                        </div>
                                    ) : chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium ${msg.sender === 'User' ? 'bg-[#0c8182] text-white rounded-br-none shadow-md' : 'bg-white text-slate-600 border border-slate-200/60 rounded-bl-none shadow-sm'}`}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                    <input
                                        className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0c8182]/20 transition-all"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    />
                                    <button
                                        onClick={handleSendChat}
                                        className="p-3 bg-[#0c8182] text-white rounded-xl hover:bg-[#0a6d6d] transition-all shadow-lg"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            {/* Reviews Modal - Specific Z-Index to appear above this modal */}
            {
                isReviewsModalOpen && (
                    <div className="fixed inset-0 z-[150] pointer-events-none">
                        <div className="pointer-events-auto h-full w-full">
                            <ReviewsModal
                                isOpen={isReviewsModalOpen}
                                onClose={() => setIsReviewsModalOpen(false)}
                                category={booking.serviceCategory || 'General'}
                                vendorId={vendor?.customUserId || vendor?.id || booking.assignedVendorId}
                            />
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TrackOrderModal;
