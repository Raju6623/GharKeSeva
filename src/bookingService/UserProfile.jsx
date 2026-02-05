import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, MapPin, Clock, User, LogOut, Package,
    CreditCard, ShieldCheck, Mail, Phone, Home, Sparkles, CheckCircle2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../redux/slices/authSlice';
import { fetchBookings } from '../redux/thunks/bookingThunks';
import { io } from 'socket.io-client';
import { AnimatePresence } from 'framer-motion';
import TrackOrderModal from './TrackOrderModal';
import BookingReviewModal from '../components/BookingReviewModal';
import { BASE_URL } from '../config';
import useTranslation from '../hooks/useTranslation';

// Initial Generator
const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
};

function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const { list: bookings, loading } = useSelector((state) => state.bookings);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'settings'
    const [trackBooking, setTrackBooking] = useState(null);
    const [reviewBooking, setReviewBooking] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(fetchBookings());

        // Real-time updates
        const socket = io(BASE_URL);
        socket.on('booking_status_updated', () => {
            dispatch(fetchBookings());
        });

        // Listen for new messages to update unread counts
        socket.on('receive_message', () => {
            dispatch(fetchBookings());
        });

        return () => socket.disconnect();
    }, [user, navigate, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success(t('logout_success'));
    };

    const handleModalClose = () => {
        setTrackBooking(null);
        dispatch(fetchBookings()); // Refresh to clear unread count if read in modal
    };

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c8182]"></div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">{t('loading_profile')}</p>
            </div>
        </div>
    );

    // Derived Stats
    const totalSpent = bookings.reduce((acc, curr) => acc + (curr.paymentStatus === 'Paid' ? curr.totalPrice : 0), 0);

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-sans pb-20">
            {/* Sophisticated Header */}
            <header className="bg-white/60 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-[#0c8182] transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-[10px] uppercase tracking-[0.2em] hidden sm:block">{t('back')}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-[#0c8182]" size={16} />
                        <h1 className="text-sm font-black uppercase text-slate-900 tracking-tighter">{t('my_account')}</h1>
                    </div>
                    <div className="w-10 sm:w-20"></div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">
                    {/* ID Card - Refined */}
                    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#0c8182] z-10"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-black text-[#0c8182] shadow-inner mb-4">
                                {getInitials(user.name)}
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6 flex items-center gap-1">
                                <ShieldCheck size={12} className="text-[#0c8182]" /> {t('id_label')} {user.id || user.customUserId}
                            </p>

                            <div className="grid grid-cols-2 w-full gap-3">
                                <div className="text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all group-hover:bg-[#effafa] group-hover:border-teal-100">
                                    <p className="text-xl font-black text-[#0c8182]">{bookings.length}</p>
                                    <p className="text-[9px] uppercase font-black text-teal-400 tracking-widest">{t('orders')}</p>
                                </div>
                                <div className="text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all group-hover:bg-emerald-50 group-hover:border-emerald-100">
                                    <p className="text-xl font-black text-emerald-600">₹{totalSpent.toLocaleString()}</p>
                                    <p className="text-[9px] uppercase font-black text-emerald-400 tracking-widest">{t('spent')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation - Refined */}
                    <nav className="bg-white/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden p-1.5 space-y-1">
                        {[
                            { id: 'orders', label: t('my_bookings'), icon: Package },
                            { id: 'profile', label: t('profile_details'), icon: User },
                            { id: 'settings', label: t('privacy_settings'), icon: ShieldCheck },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === item.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={16} /> {item.label}
                            </button>
                        ))}
                        <div className="h-px bg-slate-200/50 my-1.5 mx-2"></div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-xs text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} /> {t('logout')}
                        </button>
                    </nav>
                </div>

                {/* RIGHT CONTENT */}
                <div className="lg:col-span-8">

                    {/* ANIMATED SECTION SWITCHER */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6 animate-in slide-in-from-right-2 fade-in duration-300">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('service_history')}</h3>

                            {bookings.length === 0 ? (
                                <div className="bg-white/70 backdrop-blur-xl p-16 rounded-3xl border border-slate-200/60 text-center flex flex-col items-center">
                                    <Package size={40} className="text-slate-200 mb-4" />
                                    <p className="font-bold text-slate-400 text-sm mb-6">{t('no_bookings')}</p>
                                    <button onClick={() => navigate('/')} className="px-10 py-3.5 bg-[#0c8182] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#0a6d6d] transition active:scale-95">
                                        {t('explore_services')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((order) => (
                                        <div key={order._id} className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 hover:shadow-lg transition-all duration-500 group">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 pb-6 border-b border-slate-100 gap-4">
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0c8182] shrink-0 group-hover:bg-[#0c8182] group-hover:text-white transition-all">
                                                        <Package size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-base text-slate-900">{order.packageName}</h4>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('id_label')} {order.customBookingId}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${order.bookingStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    order.bookingStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-[#effafa] text-[#0c8182] border-teal-100'
                                                    }`}>
                                                    {order.bookingStatus}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                        <Calendar size={14} className="text-[#0c8182]" /> {order.bookingDate}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                        <Clock size={14} className="text-[#0c8182]" /> {order.bookingStartTime}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 truncate">
                                                    <MapPin size={14} className="text-[#0c8182] shrink-0" /> <span className="truncate">{order.customerLocation}</span>
                                                </div>
                                            </div>

                                            {/* Vendor Action Area */}
                                            {(['Accepted', 'In Progress'].includes(order.bookingStatus)) && (
                                                <div className="mb-6 p-4 bg-teal-50/50 rounded-2xl border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <div className="w-10 h-10 rounded-full bg-white border border-teal-100 flex items-center justify-center overflow-hidden shrink-0">
                                                            {order.vendorDetails?.photo ?
                                                                <img src={order.vendorDetails.photo} className="w-full h-full object-cover" /> :
                                                                <User size={18} className="text-teal-300" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest">{t('service_partner')}</p>
                                                            <p className="font-bold text-sm text-slate-900">{order.vendorDetails?.name || t('assigned_vendor')}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setTrackBooking(order)}
                                                        className="w-full sm:w-auto px-6 py-2.5 bg-[#0c8182] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#0a6d6d] transition active:scale-95 flex items-center justify-center gap-2 relative"
                                                    >
                                                        <Clock size={14} /> {t('track_chat')}
                                                        {(order.unreadCount || 0) > 0 && (
                                                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] text-white items-center justify-center border border-white">
                                                                    {order.unreadCount}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Review Action Area */}
                                            {order.bookingStatus === 'Completed' && (
                                                <div className="mb-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                            <ShieldCheck size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t('job_completed')}</p>
                                                            <p className="font-bold text-sm text-slate-900">{t('rate_experience')}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setReviewBooking(order)}
                                                        className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <Sparkles size={14} /> {t('rate_service')}
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    {order.paymentMethod} • <span className={order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-[#0c8182]'}>{order.paymentStatus}</span>
                                                </p>
                                                <p className="text-xl font-black text-slate-900 tracking-tighter">₹{order.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in slide-in-from-right-2 fade-in duration-300">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('personal_profile')}</h3>

                            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('full_name')}</label>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <User size={16} className="text-[#0c8182]" />
                                            <span className="font-bold text-sm text-slate-700">{user.name}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('email_id')}</label>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <Mail size={16} className="text-[#0c8182]" />
                                            <span className="font-bold text-sm text-slate-700">{user.email || '—'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('phone_number')}</label>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <Phone size={16} className="text-[#0c8182]" />
                                            <span className="font-bold text-sm text-slate-700">{user.phone}</span>
                                            {user.isMobileVerified && <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-1">{t('additional_details')}</label>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <span className="text-[10px] font-black uppercase bg-white px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600">{user.gender || 'N/A'}</span>
                                            <span className="h-4 w-px bg-slate-200"></span>
                                            <span className="text-[10px] font-bold text-slate-500">{user.dob || 'DOB Not Set'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mt-12">{t('service_address')}</h3>
                            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-6">
                                <div className="p-4 bg-[#effafa] border border-teal-100 rounded-2xl text-[#0c8182] shrink-0">
                                    <Home size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">{t('main_residence')}</h4>
                                        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">{t('default_label')}</span>
                                    </div>
                                    <p className="text-slate-600 font-bold text-sm leading-relaxed max-w-lg">
                                        {user.houseNumber ? `${user.houseNumber}, ` : ''}
                                        {user.area}, {user.landmark ? `Need ${user.landmark}, ` : ''}
                                        {user.city}, {user.state} - {user.pincode}
                                    </p>
                                    {!user.houseNumber && <p className="mt-4 text-[#0c8182] text-[10px] font-bold tracking-widest uppercase">⚠️ {t('update_details_warning')}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white/70 backdrop-blur-xl p-16 rounded-3xl border border-slate-200/60 text-center animate-in slide-in-from-right-2 fade-in duration-300">
                            <ShieldCheck size={48} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-lg font-black text-slate-900 mb-2">{t('account_privacy')}</h3>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-10 max-w-xs mx-auto">{t('privacy_desc')}</p>
                            <button className="px-12 py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition duration-300">{t('update_settings')}</button>
                        </div>
                    )}

                </div>
            </main >

            <AnimatePresence>
                {trackBooking && <TrackOrderModal booking={trackBooking} onClose={handleModalClose} />}
                {reviewBooking && <BookingReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />}
            </AnimatePresence>
        </div >
    );
};

export default UserProfile;
