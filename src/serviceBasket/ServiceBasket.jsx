import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  ChevronRight, CreditCard, ShieldCheck, Zap,
  Home, Edit2, TicketPercent, X, Coins
} from 'lucide-react';
import { calculateGSCoin } from '../utils/coinUtils';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';
import { fetchCoupons } from '../redux/thunks/marketingThunks';
import { BASE_URL, getImageUrl } from '../config';
import useTranslation from '../hooks/useTranslation';

// Normalize Coupon Data Helper (Handle Legacy vs New Schema)
const normalizeCoupon = (coupon) => ({
  ...coupon,
  code: coupon.code,
  description: coupon.description || coupon.desc || "Special Offer",
  discountValue: coupon.discountValue || coupon.save || 0,
  discountType: coupon.discountType || 'FLAT', // Default to FLAT if missing (legacy)
  minOrderValue: coupon.minOrderValue || coupon.minOrder || 0,
  termsConditions: coupon.termsConditions || [], // Map terms
  _id: coupon._id || coupon.id
});

function ServiceBasket() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);

  const rawCoupons = useSelector((state) => state.marketing.coupons);
  const COUPONS = rawCoupons.map(normalizeCoupon); // Simple map, sort if needed

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const cartCount = cart.length;
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  // Tipping State
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [isCustomTip, setIsCustomTip] = useState(false);

  // User Address (Mock/Redux)
  const authUser = useSelector((state) => state.auth.user);

  // Handlers
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

  // Calculations
  const calculatedDiscount = appliedCoupon ? (() => {
    let discount = 0;
    const normalized = normalizeCoupon(appliedCoupon);

    if (normalized.discountType === 'PERCENTAGE') {
      discount = Math.ceil(cartTotal * (normalized.discountValue / 100));
      if (normalized.maxDiscount) {
        discount = Math.min(discount, normalized.maxDiscount);
      }
    } else {
      discount = normalized.discountValue || 0;
    }
    return Math.min(discount, cartTotal);
  })() : 0;

  const promoDiscount = 0;

  const totalDiscount = calculatedDiscount + promoDiscount;
  const finalTotal = cartTotal + tip - totalDiscount;
  const payAmount = finalTotal > 0 ? finalTotal : 0;

  // Calculate Total MRP (Original Price) for Savings Banner
  const totalMRP = cart.reduce((acc, item) => {
    let itemMRP = item.originalPrice;
    if (!itemMRP && item.discount && item.discount > 0) {
      itemMRP = Math.round(item.priceAmount * (100 / (100 - item.discount)));
    }
    return acc + ((itemMRP || item.priceAmount) * item.quantity);
  }, 0);

  const totalItemSavings = totalMRP - cartTotal;
  const totalOrderSavings = totalItemSavings + totalDiscount;

  const handleApplyCoupon = (coupon) => {
    const minOrder = coupon.minOrderValue || 0;
    if (cartTotal < minOrder) {
      alert(`Min order of ₹${minOrder} required`);
      return;
    }
    setAppliedCoupon(coupon);
    setIsCouponModalOpen(false);
  };

  const handleRemoveCoupon = (e) => {
    e.stopPropagation(); // Prevent parent click if any
    setAppliedCoupon(null);
  };

  // --- Address Logic ---
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Initialize saved addresses from local storage
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('userSavedAddresses');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: authUser?.userFullName || "",
    mobile: authUser?.userPhone || "",
    pincode: "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: ""
  });

  // Sync Form with Auth User if available
  React.useEffect(() => {
    if (authUser) {
      setAddressForm(prev => ({
        ...prev,
        fullName: prev.fullName || authUser.userFullName || "",
        mobile: prev.mobile || authUser.userPhone || ""
      }));
    }
  }, [authUser]);

  // Auto-fetch City/State from Pincode
  React.useEffect(() => {
    const pin = addressForm.pincode;
    if (pin && pin.length === 6) {
      const fetchPincode = async () => {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();
          if (data && data[0].Status === "Success") {
            const info = data[0].PostOffice[0];
            setAddressForm(prev => ({
              ...prev,
              city: info.District,
              state: info.State
            }));
          }
        } catch (error) {
          console.error("Pincode fetch error:", error);
        }
      };
      fetchPincode();
    }
  }, [addressForm.pincode]);

  // Determine Display Address
  const primaryAddress = selectedAddressId
    ? savedAddresses.find(a => a.id === selectedAddressId)
    : savedAddresses.length > 0 ? savedAddresses[0] : null;

  const displayAddress = primaryAddress
    ? (primaryAddress.formatted || `${primaryAddress.houseNo}, ${primaryAddress.area}, ${primaryAddress.city}`)
    : (authUser?.houseNo ? `${authUser.houseNo}, ${authUser.streetArea}, ${authUser.city}` : "Add Address");

  // Handlers
  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    const { houseNo, area, city, pincode, fullName, mobile } = addressForm;
    if (!houseNo || !area || !city || !pincode || !fullName || !mobile) {
      alert("Please fill all required fields");
      return;
    }

    const newAddress = {
      id: Date.now(),
      ...addressForm,
      formatted: `${houseNo}, ${area}, ${city} - ${pincode}`
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('userSavedAddresses', JSON.stringify(updatedAddresses));
    setSelectedAddressId(newAddress.id);
    setIsAddingAddress(false);
    setIsAddressModalOpen(false);
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setIsAddressModalOpen(false);
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
    setIsAddingAddress(false);
  };

  const handleAddNewClick = () => {
    if (savedAddresses.length >= 5) {
      alert("You can add maximum 5 addresses.");
      return;
    }
    setAddressForm({
      fullName: authUser?.userFullName || "",
      mobile: authUser?.userPhone || "",
      pincode: "",
      houseNo: "",
      area: "",
      landmark: "",
      city: "",
      state: ""
    });
    setIsAddingAddress(true);
  };
  // --- End Address Logic ---

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-24 h-24 bg-[#effafa] text-[#0c8182] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 italic">{t('basket_empty')}</h2>
          <p className="text-gray-400 font-medium mb-8">{t('looks_like_empty')}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#0c8182] transition-all shadow-lg"
          >
            {t('explore_services')}
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
        <span className="text-lg font-bold text-slate-900">{t('your_cart')}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN: Items */}
        <div className="lg:col-span-7 space-y-6">

          {/* Savings Banner */}
          {totalOrderSavings > 0 && (
            <div className="flex items-center gap-3 bg-[#effafa] p-3 rounded-lg text-[#0c8182] text-sm font-medium mb-6">
              <TicketPercent size={18} className="fill-[#0c8182] text-white" />
              <span>{t('saving')} ₹{totalOrderSavings} {t('on_this_order')}</span>
            </div>
          )}

          {/* Login Prompt Card (If not logged in) */}
          {!authUser && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('account')}</h3>
              <p className="text-slate-500 text-sm mb-4">{t('login_msg')}</p>
              <Link
                to="/login"
                state={{ from: location }}
                className="block w-full bg-[#0c8182] hover:bg-[#0a6d6d] text-white text-center font-bold py-3 rounded-xl transition shadow-md shadow-teal-100"
              >
                {t('sign_in') || "Login"}
              </Link>
            </div>
          )}

          {/* Cart Items */}
          <div className="space-y-8">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={getImageUrl(item.packageImage)}
                    alt={item.packageName}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://via.placeholder.com/80"}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 text-sm mb-1">{item.packageName}</h3>
                  <p className="text-xs text-gray-500">{t('includes_installation')}</p>
                  <p className="font-medium text-slate-900 text-sm mt-1">₹{item.priceAmount}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-teal-100 rounded-lg bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => dispatch(removeItemFromCart(item._id || item.id))}
                      className="w-8 h-8 flex items-center justify-center text-[#0c8182] hover:bg-[#effafa]"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#0c8182]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(addItemToCart(item))}
                      disabled={item.quantity >= 1}
                      className={`w-8 h-8 flex items-center justify-center text-[#0c8182] hover:bg-[#effafa] ${item.quantity >= 1 ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Summary & Tipping */}
        <div className="lg:col-span-5 space-y-8">

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">{t('payment_summary')}</h3>

            <div className="flex justify-between text-sm py-1">
              <span className="text-slate-600">{t('item_total')}</span>
              <div className="flex gap-2">
                {totalMRP > cartTotal && <span className="text-gray-400 line-through text-xs mt-0.5">₹{totalMRP}</span>}
                <span className="font-bold text-slate-900">₹{cartTotal}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm py-1 border-b border-gray-100 pb-4">
              <span className="text-slate-600">{t('discount')}</span>
              <span className="text-[#0c8182] font-medium">-₹{totalDiscount}</span>
            </div>

            <div className="flex justify-between text-sm font-bold py-1">
              <span className="text-slate-900">{t('total_amount')}</span>
              <span className="text-slate-900">₹{payAmount}</span>
            </div>

            <div className="flex justify-between text-sm font-bold py-1">
              <span className="text-slate-900">{t('amount_to_pay')}</span>
              <span className="text-slate-900">₹{payAmount}</span>
            </div>

            {/* Coins Reward */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">{t('you_will_earn')}</span>
              </div>
              <span className="text-sm font-black text-amber-600">{calculateGSCoin(payAmount)} {t('gs_coins')}</span>
            </div>
          </div>

          {/* Coupons */}
          <div
            onClick={() => authUser ? setIsCouponModalOpen(true) : null}
            className={`py-4 border-t border-b border-gray-100 flex justify-between items-center ${authUser ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-70'} transition -mx-2 px-2 rounded-lg`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${authUser ? 'bg-[#0c8182]' : 'bg-gray-400'}`}>
                <TicketPercent size={14} className="text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900">
                  {authUser ? t('coupons_offers') : t('login_view_offers')}
                </span>
                {appliedCoupon && <span className="text-[10px] text-[#0c8182] font-bold">{t('applied')}: {appliedCoupon.code}</span>}
              </div>
            </div>
            {authUser && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#0c8182] font-bold">{rawCoupons.length} {t('offers')}</span>
                <ChevronRight size={16} className="text-[#0c8182]" />
              </div>
            )}
          </div>

          {/* Tipping Section */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4">{t('add_tip')}</h3>
            <div className="flex gap-3 mb-2">
              {[50, 75, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleTipSelection(amt)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${tip === amt && !isCustomTip
                    ? 'bg-white border-[#0c8182] shadow-sm relative overflow-hidden'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {tip === amt && !isCustomTip && <div className="absolute top-0 right-0 w-2 h-2 bg-[#0c8182] rounded-bl" />}
                  ₹{amt}
                  {amt === 75 && <span className="block text-[8px] font-bold text-[#0c8182] uppercase tracking-wide -mt-0.5">{t('popular')}</span>}
                </button>
              ))}
              <button
                onClick={() => { setIsCustomTip(true); setTip(0); setCustomTip(''); }}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${isCustomTip
                  ? 'bg-white border-[#0c8182] shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                {t('custom')}
              </button>
            </div>

            {isCustomTip && (
              <input
                type="text"
                placeholder={t('enter_amount')}
                value={customTip}
                onChange={handleCustomTipChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-2 focus:border-[#0c8182] outline-none"
              />
            )}

            <p className="text-xs text-gray-400 mt-3">{t('tip_policy')}</p>
          </div>

        </div>
      </div>

      {/* FIXED BOTTOM FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          {/* Address Bar - Only show if Logged In */}
          {authUser && (
            <div className="flex items-center justify-between" onClick={openAddressModal}>
              <div className="flex items-center gap-3 overflow-hidden cursor-pointer">
                <Home size={16} className="text-slate-900 shrink-0" />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {displayAddress}
                </span>
              </div>
              <button onClick={openAddressModal} className="text-[#0c8182] font-black text-[10px] uppercase tracking-wider hover:underline">
                {t('change_address')}
              </button>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => authUser ? navigate('/checkout') : navigate('/login', { state: { from: location } })}
            className="w-full bg-[#0c8182] hover:bg-[#0a6d6d] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-teal-100"
          >
            {authUser ? t('select_slots') : t('login_proceed')}
          </button>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-50">
              <h2 className="text-xl font-black text-slate-900">
                {isAddingAddress ? t('add_new_address') : t('select_address')}
              </h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <X size={20} className="text-slate-900" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {!isAddingAddress ? (
                <div className="space-y-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex gap-3 items-start ${selectedAddressId === addr.id ? 'border-[#0c8182] bg-[#effafa]' : 'border-gray-100'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${selectedAddressId === addr.id ? 'border-[#0c8182]' : 'border-gray-300'}`}>
                        {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0c8182]" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{addr.fullName}</p>
                        <p className="text-xs text-gray-500 mt-1">{addr.formatted}</p>
                        <p className="text-xs font-bold text-slate-700 mt-1">{addr.mobile}</p>
                      </div>
                    </div>
                  ))}
                  {savedAddresses.length < 5 && (
                    <button onClick={handleAddNewClick} className="w-full py-3 border-2 border-dashed border-[#0c8182] text-[#0c8182] font-bold rounded-xl hover:bg-[#effafa] flex items-center justify-center gap-2">
                      <Plus size={16} /> {t('add_new_address')}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <input name="fullName" placeholder={t('full_name')} value={addressForm.fullName} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm" />
                  <input name="mobile" placeholder={t('mobile_number')} value={addressForm.mobile} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm" />
                  <input name="houseNo" placeholder={t('house_no_flat')} value={addressForm.houseNo} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm" />
                  <input name="area" placeholder={t('area_sector')} value={addressForm.area} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm" />
                  <div className="flex gap-3">
                    <input name="pincode" placeholder={t('pincode')} value={addressForm.pincode} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm" />
                    <input name="city" placeholder={t('city')} value={addressForm.city} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm bg-gray-50" readOnly />
                  </div>
                  <input name="state" placeholder={t('state')} value={addressForm.state} onChange={handleAddressFormChange} className="w-full border p-3 rounded-lg text-sm bg-gray-50" readOnly />

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setIsAddingAddress(false)} className="flex-1 py-3 border border-gray-300 font-bold rounded-xl">{t('back')}</button>
                    <button onClick={handleSaveAddress} className="flex-1 py-3 bg-[#0c8182] text-white font-bold rounded-xl">{t('save_address')}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {
        isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-50 mb-2">
                <h2 className="text-xl font-black text-slate-900">{t('apply_coupon')}</h2>
                <button onClick={() => setIsCouponModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                  <X size={20} className="text-slate-900" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 pt-0 no-scrollbar">
                <style>{`
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                  .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}</style>
                {COUPONS.map(c => {
                  const isApplied = appliedCoupon && (appliedCoupon._id === c._id || appliedCoupon.code === c.code);
                  return (
                    <div key={c._id} className={`border p-4 rounded-xl flex justify-between items-center shadow-sm ${isApplied ? 'bg-[#effafa] border-teal-200' : 'bg-white border-gray-100'}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-slate-900 text-lg">{c.code}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isApplied ? 'bg-teal-200 text-teal-800' : 'bg-[#effafa] text-[#0c8182]'}`}>
                            {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{c.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {t('min_order')}: ₹{c.minOrderValue}
                          {c.maxDiscount && ` • ${t('max_discount')}: ₹${c.maxDiscount}`}
                        </p>
                      </div>
                      {isApplied ? (
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                        >
                          {t('remove')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyCoupon(c)}
                          className="text-[#0c8182] bg-[#effafa] hover:bg-teal-100 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                        >
                          {t('apply')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ServiceBasket;
