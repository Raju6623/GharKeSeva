
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, Loader2, CheckCircle2, Zap } from 'lucide-react';

// import { handleRazorpayPayment } from './RazorpayPayment';
// import { useCart } from '../Cart';

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart } = useCart();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   // Form States
//   const [address, setAddress] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("COD");

//   const BACKEND_URL = "http://localhost:3001";

//   // --- SAVE BOOKING TO DATABASE ---
//   const saveBookingToDB = async (transactionId = "COD") => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('userData'));
//       const serviceInfo = cart[0]; // Assuming single service checkout

//       const bookingData = {
//         // Aapke Schema ke hisaab se fields:
//         customerUserId: userData?._id || null, // MongoDB ObjectId
//         serviceCategory: serviceInfo.serviceCategory, // Required in Schema
//         packageName: serviceInfo.packageName,
//         totalPrice: cartTotal,
//         serviceAddress: address,
//         bookingDate: date,
//         bookingTime: time,
//         paymentMethod: paymentMethod,
//         transactionId: transactionId,
//         paymentStatus: paymentMethod === 'RAZORPAY' ? 'Paid' : 'Pending',
//         bookingStatus: 'Pending'
//       };

//       const res = await axios.post(`${BACKEND_URL}/api/auth/bookings/create`, bookingData);
      
//       if (res.data.success) {
//         setOrderSuccess(true);
//         clearCart(); // Cart khali karein
//         setTimeout(() => { navigate("/"); }, 3000);
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Booking failed to save in Database.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- MAIN BUTTON HANDLER ---
//   const handleBookingSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!address || !date || !time) return alert("Please fill address, date and time.");

//     setLoading(true);

//     if (paymentMethod === 'RAZORPAY') {
//       await handleRazorpayPayment({
//         amount: cartTotal,
//         packageName: cart[0].packageName,
//         userData: JSON.parse(localStorage.getItem('userData')),
//         onSuccess: (paymentId) => saveBookingToDB(paymentId),
//         onFailure: () => setLoading(false)
//       });
//     } else {
//       saveBookingToDB("COD");
//     }
//   };

//   if (orderSuccess) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
//         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
//           <CheckCircle2 size={60} />
//         </div>
//         <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter">ORDER PLACED!</h1>
//         <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Professional will reach you soon</p>
//         <p className="mt-4 text-xs text-blue-500 font-bold">Redirecting to Home...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-40 px-4 py-6">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
//             <ArrowLeft size={24} />
//           </button>
//           <h1 className="text-xl font-black italic uppercase tracking-tight">Checkout Details</h1>
//           <div className="w-10"></div>
//         </div>
//       </div>

//       <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Address Section */}
//           <div className="bg-white p-6 rounded-[2rem] shadow-sm border">
//             <div className="flex items-center gap-3 mb-4">
//               <MapPin className="text-blue-600" size={20}/>
//               <h3 className="font-black uppercase text-sm tracking-widest">Address</h3>
//             </div>
//             <textarea 
//               placeholder="House No, Building, Landmark..."
//               className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold"
//               rows="3"
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </div>

//           {/* Date & Time Section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
//               <Calendar className="text-orange-500 mb-3" size={20}/>
//               <input type="date" className="w-full bg-transparent font-bold outline-none" onChange={(e) => setDate(e.target.value)} />
//             </div>
//             <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
//               <Clock className="text-purple-500 mb-3" size={20}/>
//               <select className="w-full bg-transparent font-bold outline-none" onChange={(e) => setTime(e.target.value)}>
//                 <option value="">Choose Time</option>
//                 <option value="10:00 AM">10:00 AM</option>
//                 <option value="02:00 PM">02:00 PM</option>
//                 <option value="06:00 PM">06:00 PM</option>
//               </select>
//             </div>
//           </div>

//           {/* Payment Method Selector */}
//           <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
//             <h3 className="font-black uppercase text-sm tracking-widest mb-4">Payment Method</h3>
//             <div className="space-y-3">
//               <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
//                 <span className="font-bold">Cash After Service (COD)</span>
//                 <input type="radio" name="pay" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
//                 {paymentMethod === 'COD' && <CheckCircle2 size={20} className="text-blue-600" />}
//               </label>
//               <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'RAZORPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
//                 <span className="font-bold">Online Payment (Razorpay)</span>
//                 <input type="radio" name="pay" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} className="hidden" />
//                 {paymentMethod === 'RAZORPAY' && <CheckCircle2 size={20} className="text-blue-600" />}
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl sticky top-28">
//             <h3 className="font-black mb-6 italic border-b border-white/10 pb-4">SUMMARY</h3>
//             <div className="flex justify-between items-center mb-6">
//               <span className="opacity-60 font-bold">Total Amount</span>
//               <span className="text-2xl font-black text-blue-400">₹{cartTotal}</span>
//             </div>
//             <button 
//               onClick={handleBookingSubmit}
//               disabled={loading || cart.length === 0}
//               className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 disabled:bg-gray-700 flex items-center justify-center gap-2"
//             >
//               {loading ? <Loader2 className="animate-spin" /> : <>BOOK NOW <Zap size={18} fill="white"/></>}
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CheckoutPage;







































































// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, Loader2, CheckCircle2, Zap } from 'lucide-react';
// import { useCart } from '../Cart'; 
// import { handleRazorpayPayment } from './RazorpayPayment';

// const CheckoutPage = () => {
//   const { cart, cartTotal, clearCart } = useCart();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   // Form States
//   const [address, setAddress] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const BACKEND_URL = "http://localhost:3001";

//   // --- SAVE BOOKING TO DATABASE (Called only after successful payment) ---
//   const saveBookingToDB = async (paymentId) => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('userData'));
//       const serviceInfo = cart[0]; 

//       const bookingData = {
//         customerUserId: userData?._id || null, 
//         serviceCategory: serviceInfo.serviceCategory, 
//         packageName: serviceInfo.packageName,
//         totalPrice: cartTotal,
//         serviceAddress: address,
//         bookingDate: date,
//         bookingTime: time,
//         paymentMethod: 'RAZORPAY', // Fixed to Razorpay
//         transactionId: paymentId,
//         paymentStatus: 'Paid',
//         bookingStatus: 'Pending'
//       };

//       const res = await axios.post(`${BACKEND_URL}/api/auth/bookings/create`, bookingData);
      
//       if (res.data.success) {
//         setOrderSuccess(true);
//         clearCart(); 
//         setTimeout(() => { navigate("/"); }, 3000);
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || "Payment successful but failed to save booking. Please contact support.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- MAIN BUTTON HANDLER ---
//   const handleBookingSubmit = async (e) => {
//     if (e) e.preventDefault();
    
//     // Validations
//     if (!address) return alert("Please enter your service address.");
//     if (!date) return alert("Please select a date.");
//     if (!time) return alert("Please choose a time slot.");
//     if (cart.length === 0) return alert("Your cart is empty.");

//     setLoading(true);

//     // Sidha Razorpay Payment start karein
//     await handleRazorpayPayment({
//       amount: cartTotal,
//       packageName: cart[0].packageName,
//       userData: JSON.parse(localStorage.getItem('userData')),
//       onSuccess: (paymentId) => {
//         saveBookingToDB(paymentId); // Payment milne par hi DB entry hogi
//       },
//       onFailure: () => {
//         setLoading(false); // Agar user popup close kar de ya payment fail ho
//       }
//     });
//   };

//   if (orderSuccess) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
//         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
//           <CheckCircle2 size={60} />
//         </div>
//         <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Payment Received!</h1>
//         <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Your booking is confirmed</p>
//         <p className="mt-4 text-xs text-blue-500 font-bold">Redirecting to Home...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-40 px-4 py-6">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
//             <ArrowLeft size={24} className="text-slate-900" />
//           </button>
//           <h1 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Secure Checkout</h1>
//           <div className="w-10"></div>
//         </div>
//       </div>

//       <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* Address Section */}
//           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={20}/></div>
//               <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Service Address</h3>
//             </div>
//             <textarea 
//               required
//               placeholder="Flat No, Building Name, Street, Landmark..."
//               className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl p-5 outline-none transition-all font-bold text-slate-700 min-h-[120px]"
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </div>

//           {/* Date & Time Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Calendar size={20}/></div>
//                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Date</h3>
//               </div>
//               <input 
//                 type="date" 
//                 required
//                 className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold"
//                 onChange={(e) => setDate(e.target.value)} 
//               />
//             </div>

//             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Clock size={20}/></div>
//                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Slot</h3>
//               </div>
//               <select 
//                 required
//                 className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none font-bold appearance-none"
//                 onChange={(e) => setTime(e.target.value)}
//               >
//                 <option value="">Select Time</option>
//                 <option value="09:00 AM">09:00 AM - 11:00 AM</option>
//                 <option value="12:00 PM">12:00 PM - 02:00 PM</option>
//                 <option value="04:00 PM">04:00 PM - 06:00 PM</option>
//                 <option value="07:00 PM">07:00 PM - 09:00 PM</option>
//               </select>
//             </div>
//           </div>

//           <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
//             <ShieldCheck className="text-blue-600" />
//             <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
//               100% Secure Payment powered by Razorpay
//             </p>
//           </div>
//         </div>

//         {/* Sidebar Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-28">
//             <h3 className="font-black mb-6 italic border-b border-white/10 pb-4 tracking-widest text-sm opacity-60">PAYMENT SUMMARY</h3>
            
//             <div className="space-y-4 mb-8">
//               {cart.map((item, idx) => (
//                 <div key={idx} className="flex justify-between items-center text-sm">
//                   <span className="font-bold opacity-70 truncate max-w-[150px]">{item.packageName}</span>
//                   <span className="font-black">₹{item.priceAmount}</span>
//                 </div>
//               ))}
//               <div className="border-t border-white/10 pt-4 flex justify-between items-center">
//                 <span className="font-black text-blue-400">TOTAL PAYABLE</span>
//                 <span className="text-2xl font-black">₹{cartTotal}</span>
//               </div>
//             </div>

//             <button 
//               onClick={handleBookingSubmit}
//               disabled={loading || cart.length === 0}
//               className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : (
//                 <>PAY & BOOK NOW <Zap size={18} fill="white"/></>
//               )}
//             </button>
//             <p className="text-[10px] text-center mt-4 opacity-40 font-bold uppercase tracking-tighter">
//               By clicking, you agree to our terms of service
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CheckoutPage;
























































import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, Loader2, CheckCircle2, Zap } from 'lucide-react';
import io from 'socket.io-client';
import { useCart } from '../Cart';
import { handleRazorpayPayment } from './RazorpayPayment';

const socket = io('http://localhost:3001');

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const BACKEND_URL = "http://localhost:3001";

  const saveBookingToDB = async (paymentId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const serviceInfo = cart[0]; 

      const bookingData = {
        customerUserId: userData?._id || userData?.id, 
        serviceCategory: serviceInfo.serviceCategory, 
        packageName: serviceInfo.packageName,
        totalPrice: cartTotal,
        serviceAddress: address,
        bookingDate: date,
        bookingTime: time,
        paymentMethod: 'RAZORPAY',
        transactionId: paymentId,
        paymentStatus: 'Paid',
        bookingStatus: 'Pending'
      };

      const res = await axios.post(`${BACKEND_URL}/api/auth/bookings/create`, bookingData);
      
      if (res.data.success) {
        // --- SOCKET TRIGGER ---
        socket.emit('new_booking_alert', { message: "Naya Order Aaya Hai!" });
        
        setOrderSuccess(true);
        clearCart(); 
        setTimeout(() => { navigate("/"); }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Payment successful but failed to save booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!address) return alert("Please enter your service address.");
    if (!date) return alert("Please select a date.");
    if (!time) return alert("Please choose a time slot.");
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);

    await handleRazorpayPayment({
      amount: cartTotal,
      packageName: cart[0].packageName,
      userData: JSON.parse(localStorage.getItem('user')),
      onSuccess: (paymentId) => {
        saveBookingToDB(paymentId);
      },
      onFailure: () => {
        setLoading(false);
      }
    });
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={60} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Payment Received!</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Your booking is confirmed</p>
        <p className="mt-4 text-xs text-blue-500 font-bold">Redirecting to Home...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Secure Checkout</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={20}/></div>
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">Service Address</h3>
            </div>
            <textarea 
              required
              placeholder="Flat No, Building Name, Street, Landmark..."
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl p-5 outline-none transition-all font-bold text-slate-700 min-h-[120px]"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Calendar size={20}/></div>
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
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Clock size={20}/></div>
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

          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center gap-4">
            <ShieldCheck className="text-blue-600" />
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              100% Secure Payment powered by Razorpay
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-28">
            <h3 className="font-black mb-6 italic border-b border-white/10 pb-4 tracking-widest text-sm opacity-60">PAYMENT SUMMARY</h3>
            
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
                <>PAY & BOOK NOW <Zap size={18} fill="white"/></>
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