import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, Loader2, CheckCircle2, Zap, Home, Sparkles } from 'lucide-react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { createNewBooking } from '../redux/thunks/bookingThunks';
import { createRazorpayOrder } from '../redux/thunks/paymentThunks';
import { handleRazorpayPayment } from '../PaymentSection/RazorpayPayment';
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';
import useTranslation from '../hooks/useTranslation';
import { calculateGSCoin } from '../utils/coinUtils';
import { Coins } from 'lucide-react';

const socket = io(BASE_URL);

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const { user } = useSelector((state) => state.auth); // Get user from auth slice

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(!!user?.area);

  // Form States
  const [address, setAddress] = useState(
    user?.area ? `${user.houseNumber}, ${user.area}, ${user.landmark ? `${user.landmark}, ` : ''}${user.city}, ${user.state} - ${user.pincode}` : ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleClearCart = () => dispatch(clearCart());

  const saveBookingToDB = async (transactionId = "COD") => {
    try {
      const userData = user || JSON.parse(localStorage.getItem('user')) || {};
      const serviceInfo = cart[0];

      if (!serviceInfo) return toast.error(t('empty_cart_error'));

      // Try to get live coordinates
      let liveCoords = { lat: 0, lng: 0 };
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        liveCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
      } catch (e) {
        console.log("Location not captured during checkout, falling back to profile.");
      }

      const bookingData = {
        customerUserId: userData?._id || userData?.id,
        serviceCategory: serviceInfo.serviceCategory || serviceInfo.category || "General",
        packageName: serviceInfo.packageName,
        totalPrice: cartTotal,
        customerLocation: address, // Changed from serviceAddress
        coordinates: liveCoords, // Send captured coordinates
        bookingDate: date,
        bookingStartTime: time, // Changed from bookingTime
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        paymentStatus: paymentMethod === 'RAZORPAY' ? 'Paid' : 'Pending',
        bookingStatus: 'Pending'
      };

      const resultAction = await dispatch(createNewBooking(bookingData));

      if (createNewBooking.fulfilled.match(resultAction)) {
        // socket.emit('new_booking_alert', { message: "New Booking Received!" }); // Backend handles this now
        setOrderSuccess(true);
        handleClearCart();
        setTimeout(() => { navigate("/"); }, 3000);
      } else {
        toast.error("Booking failed: " + resultAction.payload);
      }
    } catch (err) {
      console.error(err);
      toast.error(t('something_wrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!address) return toast.error(t('address_error'));
    if (!date) return toast.error(t('date_error'));
    if (!time) return toast.error(t('time_error'));
    if (cart.length === 0) return toast.error(t('empty_cart_error'));

    setLoading(true);

    if (paymentMethod === 'RAZORPAY') {
      const resultAction = await dispatch(createRazorpayOrder(cartTotal));
      if (createRazorpayOrder.fulfilled.match(resultAction)) {
        const orderData = resultAction.payload;

        await handleRazorpayPayment({
          orderData: orderData,
          userData: user,
          onSuccess: (paymentId) => {
            saveBookingToDB(paymentId);
          },
          onFailure: () => {
            setLoading(false);
          }
        });
      } else {
        toast.error("Failed to initiate payment");
        setLoading(false);
      }
    } else {
      saveBookingToDB("COD");
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 animate-bounce transition-all">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase uppercase">{t('booking_confirmed')}</h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">{t('professional_reach_soon')}</p>
        <div className="mt-12 flex items-center gap-2">
          <Loader2 className="animate-spin text-[#0c8182]" size={16} />
          <p className="text-[10px] text-[#0c8182] font-black uppercase tracking-widest">{t('redirecting_dashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 font-sans">
      {/* Sophisticated Header */}
      <header className="bg-white/60 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#0c8182] transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{t('back')}</span>
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#0c8182]" size={16} />
            <h1 className="text-sm font-black uppercase text-slate-900 tracking-tighter">{t('checkout_details')}</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left Form */}
        <div className="lg:col-span-8 space-y-8">

          {/* Address Section - Refined */}
          <section className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#0c8182]"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#effafa] text-[#0c8182] rounded-xl"><MapPin size={18} /></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('service_address_title')}</h3>
              </div>
              {user?.area && (
                <button
                  onClick={() => setUseSavedAddress(!useSavedAddress)}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${useSavedAddress ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {useSavedAddress ? t('using_profile_address') : t('use_saved_address')}
                </button>
              )}
            </div>

            {useSavedAddress && user?.area ? (
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <Home className="text-[#0c8182] shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    {user.houseNumber}, {user.area}, {user.landmark ? `Need ${user.landmark}, ` : ''}{user.city}, {user.state} - {user.pincode}
                  </p>
                  <button onClick={() => setUseSavedAddress(false)} className="mt-3 text-[9px] font-black text-[#0c8182] uppercase tracking-widest hover:underline transition-all">{t('change_address')}</button>
                </div>
              </div>
            ) : (
              <textarea
                required
                placeholder={t('enter_full_address')}
                className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#0c8182] focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-sm text-slate-700 min-h-[120px] shadow-inner"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}
          </section>

          {/* Schedule Grid - Refined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><Calendar size={18} /></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('preferred_date')}</h3>
              </div>
              <input
                type="date"
                required
                className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#0c8182] rounded-xl p-4 outline-none font-bold text-sm text-slate-700"
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#0c8182]"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#effafa] text-[#0c8182] rounded-xl"><Clock size={18} /></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('time_slot')}</h3>
              </div>
              <div className="relative">
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#0c8182] rounded-xl p-4 outline-none font-bold text-sm text-slate-700 appearance-none pr-10"
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">{t('select_slot')}</option>
                  <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="12:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                  <option value="07:00 PM">07:00 PM - 09:00 PM</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <Clock size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment - Refined */}
          <section className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{t('payment_method')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'COD' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                <div className="flex flex-col">
                  <span className="font-black text-xs uppercase tracking-widest">{t('cash_on_service')}</span>
                  <span className={`text-[9px] font-bold ${paymentMethod === 'COD' ? 'text-white/60' : 'text-slate-400'}`}>{t('pay_after_completion')}</span>
                </div>
                <input type="radio" name="pay" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                {paymentMethod === 'COD' && <CheckCircle2 size={18} className="text-[#0c8182]" />}
              </label>

              <label className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === 'RAZORPAY' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`}>
                <div className="flex flex-col">
                  <span className="font-black text-xs uppercase tracking-widest">{t('online_payment')}</span>
                  <span className={`text-[9px] font-bold ${paymentMethod === 'RAZORPAY' ? 'text-white/60' : 'text-slate-400'}`}>{t('secure_razorpay')}</span>
                </div>
                <input type="radio" name="pay" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} className="hidden" />
                {paymentMethod === 'RAZORPAY' && <CheckCircle2 size={18} className="text-[#0c8182]" />}
              </label>
            </div>
          </section>

          <div className="bg-[#effafa]/50 backdrop-blur-sm border border-[#0c8182]/50 rounded-2xl p-5 flex items-center gap-4">
            <ShieldCheck className="text-[#0c8182] shrink-0" size={20} />
            <p className="text-[10px] font-black text-[#0c8182] uppercase tracking-[0.2em]">
              {t('secure_transaction_msg')}
            </p>
          </div>
        </div>

        {/* Right Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-28 border border-white/5 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0c8182]/20 rounded-full blur-[80px]"></div>

            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 pb-4 border-b border-white/10">{t('order_summary')}</h3>

            <div className="space-y-6 mb-10 relative z-10">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="flex flex-col group">
                    <span className="font-black text-sm tracking-tight text-white/90 group-hover:text-[#0c8182] transition-colors uppercase italic">{item.packageName}</span>
                    <span className="text-[9px] font-bold text-white/40 leading-none mt-1">PROFESSIONAL SERVICE</span>
                  </div>
                  <span className="font-black text-sm tracking-tighter">₹{item.priceAmount}</span>
                </div>
              ))}

              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('platform_fee')}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('free')}</span>
                </div>
                <div className="flex justify-between items-center text-[#0c8182]">
                  <span className="font-black text-xs uppercase tracking-widest italic">{t('total_payable')}</span>
                  <span className="text-3xl font-black tracking-tighter">₹{cartTotal}</span>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t('you_will_earn')}</span>
                  </div>
                  <span className="text-sm font-black text-amber-500">{calculateGSCoin(cartTotal)} {t('gs_coins')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={loading || cart.length === 0}
              className="w-full py-5 bg-[#0c8182] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-teal-900/40 hover:bg-[#0a6d6d] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {paymentMethod === 'COD' ? t('confirm_booking') : t('pay_book_now')}
                  <Zap size={14} className="fill-white group-hover:animate-pulse" />
                </>
              )}
            </button>

            <p className="text-[9px] text-center mt-6 text-white/30 font-bold uppercase tracking-widest px-4 leading-relaxed">
              {t('sla_agreement')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;