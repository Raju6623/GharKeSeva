import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Star } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookings } from '../redux/thunks/bookingThunks';
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';
import TrackOrderModal from './TrackOrderModal'; // Import Modal
import ReviewModal from './ReviewModal'; // Import Review Modal
import { AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

function MyBookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [trackBooking, setTrackBooking] = useState(null); // State for modal
  const [reviewBooking, setReviewBooking] = useState(null); // State for Review modal
  const { list: bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());

    // Real-time updates
    const socket = io(BASE_URL);
    socket.on('booking_status_updated', () => {
      dispatch(fetchBookings());
    });

    return () => socket.disconnect();
  }, [dispatch]);

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
          bookings.map((order, index) => (
            <div key={order._id || order.customBookingId || index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-black text-lg text-slate-800">{order.packageName}</h3>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full mt-2 inline-block">
                    Order ID: {order.customBookingId}
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
                  <span>{order.bookingStartTime}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-medium col-span-full">
                  <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{order.customerLocation}</span>
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

              {/* Service Partner Section (In Progress / Accepted) */}
              {(order.bookingStatus === 'In Progress' || order.bookingStatus === 'Accepted' || order.bookingStatus === 'Pending') && (
                order.vendorDetails ? (
                  <div className="mt-5 bg-[#fafcff] p-4 rounded-2xl border border-teal-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Vendor Image with Rating Badge */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                          <img
                            src={order.vendorDetails.photo || order.vendorDetails.vendorPhoto || "https://placehold.co/150"}
                            alt="Vendor"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150"; }}
                          />
                        </div>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-0.5 z-10 whitespace-nowrap">
                          <span className="text-[8px] font-black text-slate-800">{order.vendorDetails.rating ? Number(order.vendorDetails.rating).toFixed(1) : 'New'}</span>
                          <Star size={6} className="fill-amber-400 text-amber-400" />
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase text-[#0c8182] tracking-widest leading-none mb-1.5">Service Partner</p>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {order.vendorDetails.userFullName || order.vendorDetails.name || 'Assigned Professional'}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => setTrackBooking(order)}
                      className="px-6 py-3 bg-[#0c8182] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#0a6d6d] active:scale-95 transition-all flex items-center justify-center gap-2 sm:w-auto w-full"
                    >
                      <Clock size={14} /> Track & Chat
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setTrackBooking(order)}
                    className="w-full mt-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-[#0c8182] transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin size={18} /> Track Application
                  </button>
                )
              )}

              {/* Rate Vendor Button - Only for Completed orders */}
              {order.bookingStatus === 'Completed' && (
                <button
                  onClick={() => setReviewBooking(order)}
                  className="w-full mt-4 py-3 rounded-xl bg-amber-400 text-slate-900 font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-100 hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                >
                  <Star size={18} className="fill-slate-900" /> Rate Vendor
                </button>
              )}
            </div>
          ))
        )}
      </main>

      <AnimatePresence>
        {trackBooking && <TrackOrderModal booking={trackBooking} onClose={() => setTrackBooking(null)} />}
        {reviewBooking && (
          <ReviewModal
            booking={reviewBooking}
            onClose={() => setReviewBooking(null)}
            onSubmitSuccess={() => {
              // Optional: Refresh bookings to show "Reviewed" status if we adding that logic later
              toast.success("Review Added!");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyBookings;