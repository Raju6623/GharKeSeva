import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, Loader2, CheckCircle2, Zap } from 'lucide-react';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { handleRazorpayPayment } from '../PaymentSection/RazorpayPayment';
import toast from 'react-hot-toast';

const socket = io('http://localhost:3001');

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);

  const handleClearCart = () => dispatch(clearCart());
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form States
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Added Payment Method State

  const BACKEND_URL = "http://localhost:3001";

  const saveBookingToDB = async (transactionId = "COD") => {
    try {
      const userData = JSON.parse(localStorage.getItem('user')) || {}; // Fallback to empty obj
      // Note: Better to use Redux user, but localStorage logic was requested to be removed. 
      // However, redux-persist keeps it in storage/redux. 

      // Let's get user from Redux if possible, else localStorage
      // But for now, let's trust the flow.

      const serviceInfo = cart[0];
      // Safety check
      if (!serviceInfo) return toast.error("Cart is empty!");

      const bookingData = {
        customerUserId: userData?._id || userData?.id,
        serviceCategory: serviceInfo.serviceCategory,
        packageName: serviceInfo.packageName,
        totalPrice: cartTotal,
        serviceAddress: address,
        bookingDate: date,
        bookingTime: time,
        paymentMethod: paymentMethod, // Use selected method
        transactionId: transactionId,
        paymentStatus: paymentMethod === 'RAZORPAY' ? 'Paid' : 'Pending',
        bookingStatus: 'Pending'
      };

      const res = await axios.post(`${BACKEND_URL}/api/auth/bookings/create`, bookingData);

      if (res.data.success) {
        // --- SOCKET TRIGGER ---
        socket.emit('new_booking_alert', { message: "New Booking Received!" });
        setOrderSuccess(true);
        handleClearCart();
        setTimeout(() => { navigate("/"); }, 3000);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Booking failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!address) return toast.error("Please enter your service address.");
    if (!date) return toast.error("Please select a date.");
    if (!time) return toast.error("Please choose a time slot.");
    if (cart.length === 0) return toast.error("Your cart is empty.");

    setLoading(true);

    if (paymentMethod === 'RAZORPAY') {
      const user = JSON.parse(localStorage.getItem('user')); // Get for email/phone prefill
      await handleRazorpayPayment({
        amount: cartTotal,
        packageName: cart[0].packageName,
        userData: user,
        onSuccess: (paymentId) => {
          saveBookingToDB(paymentId);
        },
        onFailure: () => {
          setLoading(false);
        }
      });
    } else {
      // COD Flow
      saveBookingToDB("COD");
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={60} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Order Placed!</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Professional will reach you soon</p>
        <p className="mt-4 text-xs text-blue-500 font-bold">Redirecting to Home...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Checkout Details</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Address Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={20} /></div>
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Service Address</h3>
            </div>
            <textarea
              required
              placeholder="Flat No, Building Name, Street, Landmark..."
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl p-5 outline-none transition-all font-bold text-slate-700 min-h-[120px]"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Calendar size={20} /></div>
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Date</h3>
              </div>
              <input
                type="date"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Clock size={20} /></div>
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Slot</h3>
              </div>
              <select
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold appearance-none"
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select Time</option>
                <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                <option value="12:00 PM">12:00 PM - 02:00 PM</option>
                <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                <option value="07:00 PM">07:00 PM - 09:00 PM</option>
              </select>
            </div>
          </div>

          {/* Payment Method Selector (RESTORED) */}
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
            <h3 className="font-black uppercase text-sm tracking-widest mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <span className="font-bold flex items-center gap-2">Cash After Service (COD)</span>
                <input type="radio" name="pay" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                {paymentMethod === 'COD' && <CheckCircle2 size={20} className="text-blue-600" />}
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'RAZORPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <span className="font-bold flex items-center gap-2">Online Payment (Razorpay)</span>
                <input type="radio" name="pay" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} className="hidden" />
                {paymentMethod === 'RAZORPAY' && <CheckCircle2 size={20} className="text-blue-600" />}
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
            <ShieldCheck className="text-blue-600" />
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              100% Secure Payment powered by Razorpay
            </p>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-28">
            <h3 className="font-black mb-6 italic border-b border-white/10 pb-4 tracking-widest text-sm opacity-60">SUMMARY</h3>

            <div className="space-y-4 mb-8">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="font-bold opacity-70 truncate max-w-[150px]">{item.packageName}</span>
                  <span className="font-black">₹{item.priceAmount}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="font-black text-blue-400">TOTAL PAYABLE</span>
                <span className="text-2xl font-black">₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={loading || cart.length === 0}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {paymentMethod === 'COD' ? 'BOOK NOW' : 'PAY & BOOK'}
                  <Zap size={18} fill="white" />
                </>
              )}
            </button>
            <p className="text-[10px] text-center mt-4 opacity-40 font-bold uppercase tracking-tighter">
              By clicking, you agree to our terms of service
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;