import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  ChevronRight, CreditCard, ShieldCheck, Zap,
  Calendar, MapPin, User, Check, X, Lock, Percent
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';
import { updateDraftBooking } from '../redux/slices/bookingSlice';
import { handleRazorpayPayment } from '../PaymentSection/RazorpayPayment';
import { createRazorpayOrder } from '../redux/thunks/paymentThunks';
import { createNewBooking } from '../redux/thunks/bookingThunks';
import { fetchCoupons, fetchAddons } from '../redux/thunks/marketingThunks'; // Import
import { io } from 'socket.io-client'; // Import socket

import { BASE_URL } from '../config';
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

// Helper to format address from backend data
const getBackendAddress = (user) => {
  if (!user) return "";
  const parts = [
    user.houseNo,
    user.streetArea,
    user.landmark,
    user.city,
    user.state,
    user.pincode
  ].filter(part => part && String(part).trim() !== "");
  return parts.join(", ");
};

function AddressSelection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Data
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const draftBooking = useSelector((state) => state.bookings?.draftBooking) || {};

  const rawCoupons = useSelector((state) => state.marketing.coupons);
  const COUPONS = rawCoupons.map(normalizeCoupon).sort((a, b) => {
    const isApplicableA = (a.minOrderValue || 0) <= cartTotal;
    const isApplicableB = (b.minOrderValue || 0) <= cartTotal;
    // Enabled first (true > false in sort when b-a)
    return isApplicableB - isApplicableA;
  });

  // Real-time Coupon Updates
  React.useEffect(() => {
    const socket = io(BASE_URL);

    socket.on('coupon_update', (payload) => {
      if (payload && payload.type === 'add') {
        toast.success("New Offer Available!");
        dispatch(fetchCoupons()); // Auto-refresh list
      }
    });

    return () => {
      socket.off('coupon_update');
      socket.disconnect();
    };
  }, [dispatch]);

  // T&C Toggle State
  const [viewingTermsId, setViewingTermsId] = useState(null);

  const { addons: ADDONS } = useSelector((state) => state.marketing); // Select dynamic data
  const authUser = useSelector((state) => state.auth.user);

  // User Data (Prefer Redux > LocalStorage > Guest)
  const user = authUser || JSON.parse(localStorage.getItem('user')) || { userFullName: "Guest", userPhone: "9241333130" };

  // Fetch Logic on Mount (if empty)
  React.useEffect(() => {
    if (COUPONS.length === 0) dispatch(fetchCoupons());
    if (ADDONS.length === 0) dispatch(fetchAddons());
  }, [dispatch, COUPONS.length, ADDONS.length]);

  const cartCount = cart.length;

  const backendAddress = getBackendAddress(authUser);

  // Local state for Logistics
  const [date, setDate] = useState(draftBooking.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(draftBooking.time || "10:00 AM - 12:00 PM");
  // Autofill address from backend if available
  const [address, setAddress] = useState(draftBooking.address || backendAddress || (localStorage.getItem('userAddress') || ""));

  // List of saved addresses
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const savedAddressString = localStorage.getItem('userSavedAddresses');
    return savedAddressString ? JSON.parse(savedAddressString) : [];
  });

  // Track selected ID to avoid duplicate highlighting
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Save for future checkbox state
  const [saveForFuture, setSaveForFuture] = useState(false);

  // Detailed Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isChangeMode, setIsChangeMode] = useState(false); // Controls List View vs Single View
  const [addressForm, setAddressForm] = useState({
    fullName: user.userFullName || "",
    mobile: user.userPhone || "",
    pincode: authUser?.pincode || "",
    houseNo: authUser?.houseNo || "",
    area: authUser?.streetArea || "",
    landmark: authUser?.landmark || "",
    city: authUser?.city || "",
    state: authUser?.state || "Delhi",
  });

  // Effect to update form if backend user data loads late
  React.useEffect(() => {
    if (authUser) {
      setAddressForm(previousState => ({
        ...previousState,
        fullName: previousState.fullName || authUser.userFullName || "",
        mobile: previousState.mobile || authUser.userPhone || "",
        pincode: previousState.pincode || authUser.pincode || "",
        houseNo: previousState.houseNo || authUser.houseNo || "",
        area: previousState.area || authUser.streetArea || "",
        landmark: previousState.landmark || authUser.landmark || "",
        city: previousState.city || authUser.city || "",
        state: previousState.state || authUser.state || "Delhi",
      }));
    }
  }, [authUser]);

  // Effect to populate saved addresses with registered address if list is empty
  React.useEffect(() => {
    if (authUser && backendAddress) {
      setSavedAddresses(prev => {
        if (prev.length === 0) {
          const registeredAddress = {
            id: 'default_registered',
            fullName: authUser.userFullName || user.userFullName || "My Address",
            mobile: authUser.userPhone || user.userPhone,
            formatted: backendAddress,
            houseNo: authUser.houseNo,
            area: authUser.streetArea,
            landmark: authUser.landmark,
            city: authUser.city,
            state: authUser.state,
            pincode: authUser.pincode
          };
          // Also set this as selected if none selected
          if (!selectedAddressId) setSelectedAddressId('default_registered');
          return [registeredAddress];
        }
        return prev;
      });
    }
  }, [authUser, backendAddress]);

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

            // Always autofill detected location
            setAddressForm(previousState => ({
              ...previousState,
              city: info.District,
              state: info.State
            }));

            toast.success(`Location detected: ${info.District}, ${info.State}`);
          }
        } catch (error) {
          console.error("Pincode fetch error:", error);
        }
      };
      fetchPincode();
    }
  }, [addressForm.pincode]);

  const handleAddressFormChange = (event) => {
    const { name, value } = event.target;
    setAddressForm(previousState => ({ ...previousState, [name]: value }));
  };

  const handleManualAutofill = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    const toastId = toast.loading("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          if (data && (data.city || data.locality)) {
            setAddressForm((previousState) => ({
              ...previousState,
              // BigDataCloud Key Mappings
              houseNo: previousState.houseNo || "",
              area: data.locality || data.principalSubdivision || previousState.area || "",
              landmark: data.locality || "",
              city: data.city || data.locality || previousState.city || "",
              state: data.principalSubdivision || previousState.state || "Delhi",
              pincode: data.postcode || previousState.pincode || "",
              // Keep personal details
              fullName: previousState.fullName,
              mobile: previousState.mobile
            }));
            toast.success("Location autofilled successfully!", { id: toastId });
          } else {
            toast.error("Could not fetch address details", { id: toastId });
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch location address", { id: toastId });
        }
      },
      (error) => {
        console.error(error);
        toast.error("Location permission denied or unavailable", { id: toastId });
      }
    );
  };

  const handleSaveAddress = () => {
    // Logic for Form Input (Restored)
    const { houseNo, area, landmark, city, state, pincode } = addressForm;

    // Check required fields
    if (isAddingAddress) {
      if (!houseNo || !area || !city || !state || !pincode) {
        toast.error("Please fill all address fields");
        return;
      }
    } else {
      // Simple select mode verification? 
      // Actually this function is primarily for the "Confirm Location" button in the form.
    }

    const formatted = `${houseNo}, ${area}, ${landmark}, ${city} - ${pincode}, ${state}`;

    if (saveForFuture) {
      const newId = Date.now();
      const newAddrObj = {
        id: newId,
        ...addressForm,
        formatted
      };
      const updatedList = [...savedAddresses, newAddrObj];
      setSavedAddresses(updatedList);
      localStorage.setItem('userSavedAddresses', JSON.stringify(updatedList));
      setSelectedAddressId(newId);
      // Determine selection
      setAddress(formatted);
      toast.success("Address saved for future bookings");
    } else {
      setAddress(formatted);
      setSelectedAddressId('temp_current');
    }

    setIsAddingAddress(false);
    // setIsChangeMode(false); // Legacy
    toast.success("Location Added");
  };

  const handleSelectAddress = (addressObject) => {
    setAddress(addressObject.formatted);
    setSelectedAddressId(addressObject.id);
    setAddressForm({
      fullName: addressObject.fullName,
      mobile: addressObject.mobile,
      pincode: addressObject.pincode,
      houseNo: addressObject.houseNo,
      area: addressObject.area,
      landmark: addressObject.landmark,
      city: addressObject.city,
      state: addressObject.state
    });
  };

  const handleEditAddress = (addr) => {
    setAddressForm({
      fullName: addr.fullName || "",
      mobile: addr.mobile || "",
      pincode: addr.pincode || "",
      houseNo: addr.houseNo || "",
      area: addr.area || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || ""
    });
    setIsAddingAddress(true); // Open Form
  };

  const [showAddressInput, setShowAddressInput] = useState(!address);
  // Ref to track if we have already autofilled the address to prevent overwriting user actions
  const hasAutoFilled = React.useRef(!!address);

  // Attempt to autofill if address was initially empty and backend data loads later
  React.useEffect(() => {
    if (!hasAutoFilled.current && !address && backendAddress) {
      setAddress(backendAddress);
      setShowAddressInput(false);
      hasAutoFilled.current = true;
    }
  }, [backendAddress, address]);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'


  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (addon) => {
    if (selectedAddons.find(item => item.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(item => item.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((accumulator, currentItem) => accumulator + currentItem.price, 0);

  const handleApplyCoupon = (coupon) => {
    // Default to 0 if minOrderValue missing
    const minOrder = coupon.minOrderValue || 0;
    if (cartTotal < minOrder) {
      toast.error(`Min order of ₹${minOrder} required`);
      return;
    }
    setAppliedCoupon(coupon);
    setIsCouponModalOpen(false);
    toast.success(`Coupon ${coupon.code} applied!`);
  };

  const handleManualCoupon = () => {
    const coupon = COUPONS.find(item => item.code === couponCode);
    if (coupon) {
      handleApplyCoupon(coupon);
    } else {
      toast.error('Invalid Coupon Code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  // Calculate Discount Logic
  const calculatedDiscount = appliedCoupon ? (() => {
    let discount = 0;
    const normalized = normalizeCoupon(appliedCoupon); // Ensure applied coupon is also normalized just in case

    if (normalized.discountType === 'PERCENTAGE') {
      discount = Math.ceil(cartTotal * (normalized.discountValue / 100));
      if (normalized.maxDiscount) {
        discount = Math.min(discount, normalized.maxDiscount);
      }
    } else {
      // FLAT or Default
      discount = normalized.discountValue || 0;
    }
    return Math.min(discount, cartTotal); // Cannot discount more than total
  })() : 0;

  const finalTotal = cartTotal + addonsTotal + 49 - calculatedDiscount;

  // Handlers
  const handleProceed = async () => {
    if (!cartCount) return;
    // if (!address) return toast.error("Please select an address"); // Removed per user request

    // Save Draft
    dispatch(updateDraftBooking({
      date,
      time,
      address,
      paymentMethod,
      discount: calculatedDiscount
    }));

    if (paymentMethod === 'online') {
      try {
        // Dispatch thunk to create order
        const actionResult = await dispatch(createRazorpayOrder(finalTotal));
        const orderData = unwrapResult(actionResult); // Need to import unwrapResult or use .unwrap()

        await handleRazorpayPayment({
          orderData: orderData,
          packageName: `Booking for ${cartCount} services`,
          userData: user,
          onSuccess: async (paymentId) => {
            // Create Booking on Backend
            try {
              await dispatch(createNewBooking({
                customerUserId: user._id || "guest",
                userName: user.userFullName || "Guest User",
                userEmail: user.userEmail || "",
                userPhone: user.userPhone,
                customerLocation: address,
                items: cart,
                packageName: cart[0]?.packageName || "Multi-Service Booking",
                serviceCategory: cart[0]?.serviceCategory || cart[0]?.category || "General",
                totalPrice: finalTotal,
                paymentId: paymentId,
                paymentStatus: 'Paid',
                paymentMethod: 'ONLINE',
                bookingDate: date,
                bookingStartTime: time,
                bookingStatus: 'Pending'
              })).unwrap();

              toast.success("Payment Successful! Booking Confirmed.");
              navigate('/booking-success');
            } catch (err) {
              console.error(err);
              const response = await fetch(`${BASE_URL}/api/auth/save-address`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}` // Ensure you send the token
                },
                body: JSON.stringify(payload)
              });
              toast.error("Payment successful but booking failed to save.");
            }
          },
          onFailure: () => {
            toast.error("Payment Failed or Cancelled");
          }
        });
      } catch (error) {
        console.error("Payment Error", error);
        toast.error(error.message || "An error occurred while initiating payment.");
      }
    } else {
      try {
        await dispatch(createNewBooking({
          customerUserId: user._id || "guest",
          userName: user.userFullName || "Guest User",
          userEmail: user.userEmail || "",
          userPhone: user.userPhone,
          customerLocation: address,
          items: cart,
          packageName: cart[0]?.packageName || "Multi-Service Booking",
          serviceCategory: cart[0]?.serviceCategory || cart[0]?.category || "General",
          totalPrice: finalTotal,
          paymentId: "COD",
          paymentStatus: 'Pending',
          paymentMethod: 'CASH',
          bookingDate: date,
          bookingStartTime: time,
          bookingStatus: 'Pending'
        })).unwrap();

        toast.success("Booking Confirmed! Pay Cash on Service.");
        navigate('/booking-success');
      } catch (error) {
        console.error("COD Booking Error:", error);
        toast.error("Booking failed to save.");
      }
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" className="w-48 opacity-20 mb-6" alt="Empty" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">{t('basket_empty')}</h2>
        <button onClick={() => navigate('/')} className="text-[#0c8182] font-bold hover:underline">{t('explore_services')}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-900 pb-12">
      {/* Coupon Modal Overlay */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-50 mb-2">
              <h2 className="text-xl font-black text-slate-900">{t('apply_coupon')}</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <X size={20} className="text-slate-900" />
              </button>
            </div>

            {/* Input Section */}
            <div className="px-6 py-2">
              <div className="flex gap-2 border border-gray-200 rounded-xl p-2 pl-4 focus-within:border-[#0c8182] focus-within:ring-1 focus-within:ring-[#0c8182] transition bg-gray-50">
                <input
                  type="text"
                  placeholder={t('enter_coupon_placeholder')}
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-gray-400"
                />
                <button onClick={handleManualCoupon} className="text-gray-400 font-bold text-xs uppercase tracking-wider hover:text-[#0c8182] px-2">{t('apply')}</button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 pt-2 no-scrollbar">
              <style>{`
                  .no-scrollbar::-webkit-scrollbar { display: none; }
                  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
              {COUPONS.map(c => {
                const minOrder = c.minOrderValue || 0;
                const shortfall = minOrder - cartTotal;
                const isApplicable = shortfall <= 0;
                const isApplied = appliedCoupon && (appliedCoupon._id === c._id || appliedCoupon.code === c.code);

                return (
                  <div key={c._id} className={`border p-4 rounded-xl flex justify-between items-center shadow-sm transition-all ${isApplied ? 'bg-green-50 border-green-200' : (isApplicable ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60')}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-slate-900 text-lg">{c.code}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isApplied ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700'}`}>
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
                        onClick={removeCoupon}
                        className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        {t('remove')}
                      </button>
                    ) : isApplicable ? (
                      <button
                        onClick={() => handleApplyCoupon(c)}
                        className="text-[#0c8182] bg-[#effafa] hover:bg-teal-100 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        {t('apply')}
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-50 px-2 py-1 rounded">
                        {t('add_amount')} ₹{shortfall}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-slate-600">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{t('checkout_header')}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} className="text-green-600" />
            {t('secure_payment_header')}
          </div>
        </div>
      </header>


      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: Details (Span 8) */}
        <section className="lg:col-span-8 space-y-6">

          {/* Section 0: Address Selection - MUST COME FIRST */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#effafa] flex items-center justify-center text-[#0c8182]">
                  <MapPin size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
              </div>
              {address && !isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="text-[#0c8182] text-sm font-bold hover:underline flex items-center gap-1"
                >
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            {/* Current Address Display */}
            {address && !isAddingAddress && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-xs font-black text-green-700 uppercase tracking-wider">Selected Address</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700">{address}</p>
                  </div>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="text-[#0c8182] text-xs font-bold hover:underline ml-4"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            {/* No Address Warning */}
            {!address && !isAddingAddress && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-700 mb-1">No address selected</p>
                    <p className="text-xs text-orange-600">Please add your delivery address to continue</p>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Addresses List */}
            {!isAddingAddress && savedAddresses.length > 0 && (
              <div className="space-y-3 mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</p>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                      ? 'border-[#0c8182] bg-[#effafa]'
                      : 'border-gray-100 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700 mb-1">{addr.fullName}</p>
                        <p className="text-xs text-slate-500">{addr.formatted}</p>
                        <p className="text-xs text-slate-400 mt-1">{addr.mobile}</p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <Check size={20} className="text-[#0c8182] flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Button */}
            {!address && !isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="w-full bg-[#0c8182] hover:bg-[#0a6d6d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={18} /> Add Delivery Address
              </button>
            )}

            {/* Address Form */}
            {isAddingAddress && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleAddressFormChange}
                      placeholder="Enter your name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={addressForm.mobile}
                      onChange={handleAddressFormChange}
                      placeholder="10-digit mobile number"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressFormChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">House/Flat No.</label>
                    <input
                      type="text"
                      name="houseNo"
                      value={addressForm.houseNo}
                      onChange={handleAddressFormChange}
                      placeholder="House/Flat number"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">Street/Area/Locality</label>
                  <input
                    type="text"
                    name="area"
                    value={addressForm.area}
                    onChange={handleAddressFormChange}
                    placeholder="Street name, area"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressFormChange}
                    placeholder="Nearby landmark"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="City"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 mb-1.5 block">State</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      placeholder="State"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all"
                    />
                  </div>
                </div>

                {/* Save for Future Checkbox */}
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl">
                  <input
                    type="checkbox"
                    id="saveForFuture"
                    checked={saveForFuture}
                    onChange={(e) => setSaveForFuture(e.target.checked)}
                    className="w-4 h-4 text-[#0c8182] border-gray-300 rounded focus:ring-[#0c8182]"
                  />
                  <label htmlFor="saveForFuture" className="text-xs font-bold text-slate-600 cursor-pointer">
                    Save this address for future bookings
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveAddress}
                    className="flex-1 bg-[#0c8182] hover:bg-[#0a6d6d] text-white py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    Confirm Address
                  </button>
                  {address && (
                    <button
                      onClick={() => setIsAddingAddress(false)}
                      className="px-6 bg-gray-100 hover:bg-gray-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Auto-detect Location Button */}
                <button
                  onClick={handleManualAutofill}
                  className="w-full border-2 border-dashed border-gray-300 hover:border-[#0c8182] text-slate-600 hover:text-[#0c8182] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MapPin size={14} /> Use Current Location
                </button>
              </div>
            )}
          </div>

          {/* Section 1: Slot Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#effafa] flex items-center justify-center text-[#0c8182]">
                <Calendar size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{t('schedule_service')}</h2>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!address ? 'pointer-events-none opacity-40' : ''}`}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">{t('date_label')}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={!address}
                  className="w-full bg-gray-50 border-input rounded-xl p-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">{t('time_slot_label')}</label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!address}
                    className="w-full bg-gray-50 border-input rounded-xl p-3.5 text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] transition-all disabled:cursor-not-allowed"
                  >
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                </div>
              </div>
            </div>

            {/* Address Required Overlay */}
            {!address && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-red-400">
                <div className="text-center p-6">
                  <MapPin size={40} className="mx-auto mb-3 text-red-500" />
                  <p className="text-base font-black text-red-600 mb-2 uppercase tracking-wide">⚠️ Address Required</p>
                  <p className="text-sm font-bold text-red-500">Please select delivery address first</p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Offers & Coupons (Moved Here) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#effafa] flex items-center justify-center text-[#0c8182]">
                  <Percent size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{t('offers_benefits')}</h2>
                  {appliedCoupon ? (
                    <p className="text-xs text-green-600 font-bold">{t('code_applied')} '{appliedCoupon.code}'</p>
                  ) : (
                    <p className="text-xs text-gray-400 font-medium">{t('best_deals_desc')}</p>
                  )}
                </div>
              </div>

              {appliedCoupon ? (
                <button onClick={removeCoupon} className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-xs transition-colors">
                  {t('remove')}
                </button>
              ) : (
                <button onClick={() => setIsCouponModalOpen(true)} className="text-[#0c8182] font-bold text-sm bg-[#effafa] hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                  {t('view_offers')} <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#effafa] flex items-center justify-center text-[#0c8182]">
                <CreditCard size={18} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{t('payment_method')}</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`flex-1 relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${paymentMethod === 'cod' ? 'border-[#0c8182] bg-[#effafa]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-black text-sm ${paymentMethod === 'cod' ? 'text-[#0c8182]' : 'text-slate-700'}`}>{t('pay_after_service')}</span>
                  {paymentMethod === 'cod' && <div className="w-5 h-5 rounded-full bg-[#0c8182] text-white flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>}
                </div>
                <p className="text-xs text-gray-400 font-medium">{t('pay_after_service_desc')}</p>
              </button>

              <button
                onClick={() => setPaymentMethod('online')}
                className={`flex-1 relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${paymentMethod === 'online' ? 'border-[#0c8182] bg-[#effafa]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-black text-sm ${paymentMethod === 'online' ? 'text-[#0c8182]' : 'text-slate-700'}`}>{t('pay_online')}</span>
                  {paymentMethod === 'online' && <div className="w-5 h-5 rounded-full bg-[#0c8182] text-white flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>}
                </div>
                <p className="text-xs text-gray-400 font-medium">{t('pay_online_desc')}</p>
              </button>
            </div>
          </div>

          {/* Quick Addons (Optional) */}
          {ADDONS.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">{t('frequently_added')}</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {ADDONS.map(addon => {
                  const isSelected = selectedAddons.find(item => item.id === addon.id);
                  return (
                    <div key={addon.id} onClick={() => toggleAddon(addon)} className={`min-w-[140px] p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-[#0c8182] bg-[#effafa]' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div className="flex justify-between items-start mb-2">
                        {addon.icon ? <img src={addon.icon} className="w-6 h-6 object-contain" alt="" /> : <div className="w-6 h-6 bg-gray-100 rounded-full" />}
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#0c8182] border-[#0c8182]' : 'border-gray-300'}`}>
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-700 line-clamp-1">{addon.name}</p>
                      <p className="text-xs font-black text-slate-900 mt-0.5">₹{addon.price}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </section>

        {/* RIGHT COLUMN: Summary (Span 4) */}
        <section className="lg:col-span-4 space-y-6 sticky top-24">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-slate-900 text-xl mb-4 tracking-tight">{t('payment_details_header')}</h3>

            <div className="overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <tr>
                    <th className="py-2 font-bold tracking-wider text-left">{t('description_th')}</th>
                    <th className="py-2 font-bold tracking-wider text-right">{t('amount_th')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="py-3 text-slate-600 font-medium">{t('item_total')}</td>
                    <td className="py-3 text-slate-900 font-bold text-right">₹{cartTotal}</td>
                  </tr>
                  {addonsTotal > 0 && (
                    <tr>
                      <td className="py-3 text-slate-600 font-medium">{t('addons')}</td>
                      <td className="py-3 text-slate-900 font-bold text-right">₹{addonsTotal}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-3 text-slate-600 font-medium">{t('taxes_fee')}</td>
                    <td className="py-3 text-right">
                      <span className="line-through text-gray-300 text-xs mr-2">₹99</span>
                      <span className="text-slate-900 font-bold">₹49</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-600 font-medium">{t('delivery_fee')}</td>
                    <td className="py-3 text-green-600 font-bold text-right">{t('free')}</td>
                  </tr>
                  {appliedCoupon && (
                    <tr>
                      <td className="py-3 text-green-600 font-medium">{t('coupon_discount')}</td>
                      <td className="py-3 text-green-600 font-bold text-right">-₹{calculatedDiscount}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-dashed border-gray-100">
                  <tr>
                    <td className="py-4 text-slate-900 font-black text-base">{t('total_payable')}</td>
                    <td className="py-4 text-slate-900 font-black text-xl text-right">₹{finalTotal}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Coins Reward */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Coins size={16} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">{t('you_will_earn')}</span>
                </div>
                <span className="text-sm font-black text-amber-600">{calculateGSCoin(finalTotal)} {t('gs_coins')}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-[#0c8182] hover:bg-[#0a6d6d] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-100 hover:shadow-teal-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {t('proceed_payment')}
              <ArrowLeft size={18} className="rotate-180" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold opacity-60">
              <Lock size={10} />
              <span>{t('secure_ssl_msg')}</span>
            </div>
          </div>

          {/* Support Links */}
          <div className="grid grid-cols-2 gap-4">
            <a href="https://wa.me/919241333130" target="_blank" rel="noopener noreferrer" className="bg-white/50 backdrop-blur-sm border border-green-100 hover:border-green-200 hover:bg-green-50/50 p-3 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-sm hover:shadow-md">
              <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="" />
              <span className="text-xs font-bold text-slate-600 group-hover:text-green-700">{t('whatsapp')}</span>
            </a>
            <a href="mailto:support@gharkeseva.com" className="bg-white/50 backdrop-blur-sm border border-blue-100 hover:border-blue-200 hover:bg-blue-50/50 p-3 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-sm hover:shadow-md">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="" />
              <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">{t('email_help')}</span>
            </a>
          </div>

        </section>
      </main>
    </div>
  );
};

export default AddressSelection;