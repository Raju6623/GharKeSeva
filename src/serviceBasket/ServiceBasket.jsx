import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  ChevronRight, CreditCard, ShieldCheck, Zap,
  Home, Edit2, TicketPercent
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';

const ServiceBasket = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartCount = cart.length;
  const navigate = useNavigate();

  // Tipping State
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);

  // User Address (Mock/Redux)
  // const userAddress = "Home - Fffgg, Yella Reddy Guda, Hyderabad, ..."; 
  // Let's grab it closer to the real data if available, or just mocking for the UI match
  const authUser = useSelector((state) => state.auth.user);
  const userAddress = authUser
    ? (authUser.houseNo ? `${authUser.houseNo}, ${authUser.streetArea}, ${authUser.city}` : "Add Address")
    : "Home - Fffgg, Yella Reddy Guda, Hyderabad, ...";


  const handleQuantityUpdate = (item, action) => {
    if (action === 'increase') {
      dispatch(addItemToCart(item));
    } else {
      dispatch(removeItemFromCart(item._id || item.id));
    }
  };

  const handleTipSelection = (amount) => {
    setIsCustomTip(false);
    if (tip === amount) {
      setTip(0); // Toggle off
    } else {
      setTip(amount);
    }
  };

  const handleCustomTipChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setCustomTip(val);
      setTip(Number(val));
    }
  };

  const BACKEND_URL = "http://localhost:3001";

  // Calculations
  const discount = 600; // Fixed "Free service offer" as per screenshot
  // Ensure we don't go negative if total is low, though typically this offer implies a waiver
  const finalTotal = cartTotal + tip - discount;
  const payAmount = finalTotal > 0 ? finalTotal : 0;

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Basket is Empty!</h2>
          <p className="text-gray-400 font-medium mb-8">Looks like you haven't added any services yet.</p>
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
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40 px-4 py-4 flex items-center gap-4 border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
        <span className="text-lg font-bold text-slate-900">Your cart</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN: Items */}
        <div className="lg:col-span-7 space-y-6">

          {/* Savings Banner */}
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg text-green-700 text-sm font-medium mb-6">
            <TicketPercent size={18} className="fill-green-700 text-white" />
            <span>Saving ₹6900 on this order</span>
            {/* Mock text from screenshot */}
          </div>

          {/* Cart Items */}
          <div className="space-y-8">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-start border-b border-gray-50 pb-6 last:border-0">
                <div>
                  <h3 className="font-medium text-slate-900 text-sm mb-1">{item.packageName}</h3>
                  <p className="text-xs text-gray-500">Includes installation and demo</p>
                  <p className="font-medium text-slate-900 text-sm mt-1">₹{item.priceAmount}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-purple-100 rounded-lg bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => dispatch(removeItemFromCart(item._id || item.id))}
                      className="w-8 h-8 flex items-center justify-center text-[#6e42e5] hover:bg-purple-50"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#6e42e5]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(addItemToCart(item))}
                      className="w-8 h-8 flex items-center justify-center text-[#6e42e5] hover:bg-purple-50"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                  {/* Mock Original Price for visual if needed */}
                  {/* <span className="text-xs text-gray-400 line-through">₹{item.priceAmount * 1.2}</span> */}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Summary & Tipping */}
        <div className="lg:col-span-5 space-y-8">

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Payment summary</h3>

            <div className="flex justify-between text-sm py-1">
              <span className="text-slate-600">Item total</span>
              <div className="flex gap-2">
                <span className="text-gray-400 line-through text-xs mt-0.5">₹{cartTotal + 6400}</span>
                <span className="font-bold text-slate-900">₹{cartTotal}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm py-1 border-b border-gray-100 pb-4">
              <span className="text-slate-600">Free service offer</span>
              <span className="text-emerald-500 font-medium">-₹{discount}</span>
            </div>

            <div className="flex justify-between text-sm font-bold py-1">
              <span className="text-slate-900">Total amount</span>
              <span className="text-slate-900">₹{cartTotal - discount}</span>
            </div>

            <div className="flex justify-between text-sm font-bold py-1">
              <span className="text-slate-900">Amount to pay</span>
              <span className="text-slate-900">₹{payAmount}</span>
            </div>
          </div>

          {/* Coupons */}
          <div className="py-4 border-t border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition -mx-2 px-2 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                <TicketPercent size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-900">Coupons and offers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6e42e5] font-bold">3 offers</span>
              <ChevronRight size={16} className="text-[#6e42e5]" />
            </div>
          </div>

          {/* Tipping Section */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4">Add a tip to thank the Professional</h3>
            <div className="flex gap-3 mb-2">
              {[50, 75, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleTipSelection(amt)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${tip === amt && !isCustomTip
                      ? 'bg-white border-green-500 shadow-sm relative overflow-hidden'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {tip === amt && !isCustomTip && <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-bl" />}
                  ₹{amt}
                  {amt === 75 && <span className="block text-[8px] font-bold text-green-600 uppercase tracking-wide -mt-0.5">Popular</span>}
                </button>
              ))}
              <button
                onClick={() => { setIsCustomTip(true); setTip(0); setCustomTip(''); }}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${isCustomTip
                    ? 'bg-white border-green-500 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                Custom
              </button>
            </div>

            {isCustomTip && (
              <input
                type="text"
                placeholder="Enter amount"
                value={customTip}
                onChange={handleCustomTipChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-2 focus:border-green-500 outline-none"
              />
            )}

            <p className="text-xs text-gray-400 mt-3">100% of the tip goes to the professional.</p>
          </div>

        </div>
      </div>

      {/* FIXED BOTTOM FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          {/* Address Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <Home size={16} className="text-slate-900 shrink-0" />
              <span className="text-xs font-medium text-slate-700 truncate">
                {userAddress}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-900">
              <Edit2 size={14} />
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#6e42e5] hover:bg-[#5b36bf] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-purple-100"
          >
            Select slots
          </button>
        </div>
      </div>

    </div>
  );
};

export default ServiceBasket;