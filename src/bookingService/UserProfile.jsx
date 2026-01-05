import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, User, LogOut, Package, CreditCard, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../redux/slices/authSlice';

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'

    const BACKEND_URL = "http://localhost:3001";

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const userId = user._id || user.id;
        fetchHistory(userId);
    }, [user, navigate]);

    const fetchHistory = async (id) => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/auth/bookings/user/${id}`);
            setBookings(res.data);
        } catch (err) {
            console.error(err);
            // Silent fail or toast
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        toast.success("Successfully logged out");
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-black text-slate-400 uppercase tracking-widest">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-10">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition">
                        <ArrowLeft size={20} />
                        <span className="font-bold text-sm uppercase tracking-wide">Back to Home</span>
                    </button>
                    <h1 className="text-xl font-black italic uppercase text-slate-900">My Account</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Sidebar: Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4 text-blue-600">
                            <User size={40} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">{user?.name || user?.userFullName || "User"}</h2>
                        <p className="text-sm font-bold text-slate-400 mb-6">{user?.email || user?.userEmail}</p>

                        <div className="grid grid-cols-2 gap-2 text-center border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-2xl font-black text-slate-900">{bookings.length}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Orders</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">
                                    ₹{bookings.reduce((acc, curr) => acc + (curr.paymentStatus === 'Paid' ? curr.totalPrice : 0), 0).toLocaleString()}
                                </p>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Spent</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left px-6 py-4 font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-gray-50'}`}
                        >
                            <Package size={18} /> My Orders
                        </button>
                        <button
                            onClick={() => toast("Profile settings coming soon!")}
                            className={`w-full text-left px-6 py-4 font-bold text-sm flex items-center gap-3 transition-colors text-slate-600 hover:bg-gray-50`}
                        >
                            <ShieldCheck size={18} /> Privacy & Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-4 font-bold text-sm flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="md:col-span-2">
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Package size={20} className="text-blue-600" /> Recent Bookings
                            </h3>

                            {bookings.length === 0 ? (
                                <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center">
                                    <p className="font-bold text-slate-400">No bookings found yet.</p>
                                    <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow hover:bg-blue-700 transition">
                                        Book a Service
                                    </button>
                                </div>
                            ) : (
                                bookings.map((order) => (
                                    <div key={order.customBookingId} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-50">
                                            <div>
                                                <h4 className="font-black text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{order.packageName}</h4>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID: {order.customBookingId}</span>
                                            </div>
                                            <div className={`mt-2 sm:mt-0 self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.bookingStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    order.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.bookingStatus}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-300" /> {order.bookingDate}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-300" /> {order.bookingTime}
                                            </div>
                                            <div className="col-span-2 flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-300" /> <span className="truncate">{order.serviceAddress}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Payment</p>
                                                    <p className={`text-xs font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {order.paymentMethod} • {order.paymentStatus}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900">₹{order.totalPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
