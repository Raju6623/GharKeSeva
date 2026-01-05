import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  ChevronRight, CreditCard, ShieldCheck, Zap
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';

const ServiceBasket = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartCount = cart.length;
  const navigate = useNavigate();

  // Dynamic Quantity Control
  const handleQuantityUpdate = (item, action) => {
    if (action === 'increase') {
      dispatch(addItemToCart(item));
    } else {
      if (item.quantity > 1) {
        // Need a decrease action, but for now just prevent negative logic or implement decrease later
        // For simplicity assuming remove implies total removal if 1, or implement direct decrease logic if needed
      }
      dispatch(removeItemFromCart(item._id || item.id));
    }
  };

  const BACKEND_URL = "http://localhost:3001";

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Basket is Empty!</h2>
          <p className="text-gray-400 font-medium mb-8">Looks like you haven't added any services yet. Let's find some for you!</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
          >
            Explore Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-xl font-black italic text-slate-900 tracking-tight">SERVICE BASKET ({cartCount})</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Selected Services</h2>
          {cart.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-5">
              <img
                src={item.packageImage?.startsWith('http') ? item.packageImage : `${BACKEND_URL}/${item.packageImage}`}
                alt={item.packageName}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-50"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 leading-tight">{item.packageName}</h3>
                <p className="text-blue-600 font-black mt-1 text-lg">₹{item.priceAmount}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => dispatch(removeItemFromCart(item._id || item.id))}
                  className="p-2 text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-3">
                  <span className="px-3 font-black text-sm">{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Service Guarantee Card */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm italic">GharKeSeva Protection</h4>
              <p className="text-emerald-700 text-xs mt-1 leading-relaxed">Every service includes 30 days warranty and background verified experts.</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl sticky top-28">
            <h3 className="text-lg font-black text-slate-900 mb-6 italic">BILLING DETAILS</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Item Total</span>
                <span className="font-bold text-slate-800">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Convenience Fee</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="h-px bg-dashed bg-gray-100 my-4 border-t-2 border-dashed"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-black text-lg italic">TO PAY</span>
                <span className="text-2xl font-black text-slate-900">₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')} // Agla step: Payment/Address page
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <Zap size={16} fill="white" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 opacity-30 grayscale">
              <CreditCard size={16} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Secure 256-bit SSL Payment</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceBasket;