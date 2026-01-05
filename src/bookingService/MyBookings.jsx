import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:3001";

  useEffect(() => {
    if (user?._id || user?.id) {
      const userId = user._id || user.id;
      fetchHistory(userId);
    }
  }, [user]);

  const fetchHistory = async (id) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth/bookings/user/${id}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-slate-400 uppercase tracking-widest">Loading Records...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-xl font-black italic uppercase tracking-tight text-slate-900">My Bookings</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <h2 className="text-xl font-black uppercase text-slate-400">No Past Bookings</h2>
            <p className="text-sm font-bold text-slate-300 mt-2">Your history is clean.</p>
          </div>
        ) : (
          bookings.map((order) => (
            <div key={order.customBookingId} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-800">{order.packageName}</h3>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full mt-2 inline-block">
                    ID: {order.customBookingId}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${order.bookingStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.bookingStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 text-slate-500 font-medium">
                  <Calendar size={16} className="text-slate-400" />
                  <span>{order.bookingDate}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-medium">
                  <Clock size={16} className="text-slate-400" />
                  <span>{order.bookingTime}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-medium col-span-full">
                  <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{order.serviceAddress}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-slate-900">₹{order.totalPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment</p>
                  <p className={`font-bold text-xs ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default MyBookings;