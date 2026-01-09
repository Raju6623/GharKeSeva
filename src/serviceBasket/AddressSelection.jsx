import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  ChevronRight, CreditCard, ShieldCheck, Zap,
  Calendar, MapPin, User, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';
import { updateDraftBooking } from '../redux/slices/bookingSlice';
import { handleRazorpayPayment } from '../PaymentSection/RazorpayPayment';
import { createRazorpayOrder } from '../redux/thunks/paymentThunks';
import { fetchCoupons, fetchAddons } from '../redux/thunks/marketingThunks'; // Import

const BACKEND_URL = "http://localhost:3001";

const AddressSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Data
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const draftBooking = useSelector((state) => state.bookings?.draftBooking) || {};
  const { coupons: COUPONS, addons: ADDONS } = useSelector((state) => state.marketing); // Select dynamic data
  const authUser = useSelector((state) => state.auth.user);

  // User Data (Prefer Redux > LocalStorage > Guest)
  const user = authUser || JSON.parse(localStorage.getItem('user')) || { userFullName: "Guest", userPhone: "9876543210" };

  // Fetch Logic on Mount (if empty)
  React.useEffect(() => {
    if (COUPONS.length === 0) dispatch(fetchCoupons());
    if (ADDONS.length === 0) dispatch(fetchAddons());
  }, [dispatch, COUPONS.length, ADDONS.length]);

  const cartCount = cart.length;

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

  const backendAddress = getBackendAddress(authUser);

  // Local state for Logistics
  const [date, setDate] = useState(draftBooking.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(draftBooking.time || "10:00 AM - 12:00 PM");
  // Autofill address from backend if available
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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;
            setAddressForm((previousState) => ({
              ...previousState,
              houseNo: address.house_number || previousState.houseNo || "",
              area: address.road || address.suburb || address.neighbourhood || previousState.area || "",
              landmark: address.suburb || address.neighbourhood || "",
              city: address.city || address.town || address.village || previousState.city || "",
              state: address.state || previousState.state || "Delhi",
              pincode: address.postcode || previousState.pincode || "",
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
    // Also update form so if they edit it, it has the data
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
    // setIsChangeMode(false); // Don't close immediately on selection, wait for "Use this address" or user checks radio? 
    // User requested: "jb hum change pr click kre to jaake uske peche pura addresh ka list khulyea"
    // So selecting one from list should probably keep list open until confirmed? 
    // Or maybe selecting implies done? Let's assume selecting keeps it open until they click "Use this address".
    // Actually, distinct behavior: "ek he addresh chayea screen pr".
    // So if I select one, it should probably become the single view?
    // Let's stick to the "Use this Address" button confirming it.
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
    if (cartTotal < coupon.minOrder) {
      toast.error(`Min order of ₹${coupon.minOrder} required`);
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

  const discountAmount = appliedCoupon ? Math.min(appliedCoupon.save, Math.round(cartTotal * 0.1)) : 0; // Simplified logic (10% or max save)
  // Fix: If it's a fixed cashback like Amazon, logic might differ, but for now we treat 'save' as max discount.
  // Actually, let's just use 'save' as the discount for simplicity in this mock, or 10% capped at 'save'.
  const dynamicDiscount = appliedCoupon ? (appliedCoupon.code.includes('AMAZON') ? 0 : Math.ceil(cartTotal * 0.1)) : 0;
  // Let's use a flat discount from 'save' if it's small, otherwise 10%. 
  // For the USER's specific screenshot "Flat 10% off", let's use 10% logic.
  const calculatedDiscount = appliedCoupon ? Math.min(appliedCoupon.save, Math.ceil(cartTotal * 0.1)) : 0;

  const finalTotal = cartTotal + addonsTotal + 49 - calculatedDiscount;

  // Handlers
  const handleProceed = async () => {
    if (!cartCount) return;
    if (!address) return toast.error("Please select an address");

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
          onSuccess: (paymentId) => {
            toast.success("Payment Successful! ID: " + paymentId);
            navigate('/booking-success');
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
        toast.success("Booking Confirmed! Pay Cash on Service.");
        navigate('/booking-success');
      } catch (error) {
        toast.error("Booking failed");
      }
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" className="w-48 opacity-20 mb-6" alt="Empty" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Your basket is empty</h2>
        <button onClick={() => navigate('/')} className="text-[#6e42e5] font-bold hover:underline">Explore Services</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 relative">
      {/* Modal Overlay */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 pb-2 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Coupons & Offers</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X size={20} className="text-slate-900" />
              </button>
            </div>

            {/* Input Section */}
            <div className="p-6 pt-2">
              <div className="flex gap-2 border border-gray-200 rounded-xl p-2 pl-4 focus-within:border-[#6e42e5] focus-within:ring-1 focus-within:ring-[#6e42e5] transition">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  className="flex-1 outline-none text-sm font-bold text-slate-700 placeholder:text-gray-400"
                />
                <button onClick={handleManualCoupon} className="text-gray-400 font-bold text-sm hover:text-[#6e42e5] px-2">Apply</button>
              </div>
            </div>

            {/* Coupon List */}
            <div className="max-h-[60vh] overflow-y-auto hide-scrollbar bg-gray-50 p-6 space-y-4">
              {COUPONS.map(coupon => (
                <div key={coupon.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    {/* Mock Logos */}
                    <img src="https://cdn-icons-png.flaticon.com/512/217/217424.png" className="w-6 h-6 object-contain" alt="bank" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 text-sm">{coupon.title}</h3>
                      <button onClick={() => handleApplyCoupon(coupon)} className="text-[#6e42e5] font-black text-xs uppercase hover:underline">Apply</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{coupon.desc}</p>
                    <p className="text-[10px] font-bold text-green-600 mt-2 uppercase tracking-wide">Save ₹{coupon.save} on this order</p>
                    <button className="text-[10px] font-bold text-gray-400 mt-2 underline">View T&C</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-slate-900" />
          </button>
          <span className="text-lg font-bold text-slate-900">Cart</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Logistics (Steps) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Account / Phone */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1"><User size={20} className="text-gray-400" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base">Send booking details to</h3>
                <p className="font-black text-[#6e42e5] text-xl mt-1 tracking-wide">{user.userPhone}</p>
              </div>
            </div>
          </div>

          {/* 2. Address */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1"><MapPin size={20} className="text-gray-400" /></div>
              <div className="flex-1">
                {/* Address List View vs Add Form */}
                {!isAddingAddress ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Service Location</h3>

                    {savedAddresses.length > 0 ? (
                      savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#6e42e5] bg-purple-50/10' : 'border-gray-200 hover:border-purple-200'}`}
                        >
                          <div className="flex gap-3 items-start">
                            <div className="mt-1">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? 'border-[#6e42e5]' : 'border-gray-300'}`}>
                                {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#6e42e5]" />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-slate-900 text-base">{addr.fullName || "User"}</span>
                              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                {addr.formatted || `${addr.houseNo}, ${addr.area}, ${addr.city}`}
                              </p>
                              <p className="text-sm text-slate-800 font-bold mt-1">+91 {addr.mobile}</p>

                              <div className="flex gap-2 mt-3">
                                <button className="text-[#6e42e5] text-xs font-bold hover:underline">Edit</button>
                                <span className="text-gray-300">|</span>
                                <button className="text-[#6e42e5] text-xs font-bold hover:underline">Add instructions</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No saved addresses found. Add one below.</p>
                    )}

                    {/* Add New Button */}
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="w-full border-2 border-dashed border-[#6e42e5] text-[#6e42e5] py-3 rounded-xl font-bold text-sm hover:bg-purple-50 transition flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Service Location
                    </button>

                    {/* Use this Address Button */}
                    {selectedAddressId && (
                      <button
                        onClick={() => {
                          const selected = savedAddresses.find(a => a.id === selectedAddressId);
                          if (selected) {
                            setAddress(selected.formatted || `${selected.houseNo}, ${selected.city}`);
                            toast.success("Address Selected");
                          }
                        }}
                        className="bg-[#6e42e5] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md hover:bg-[#5b36bf] transition w-auto inline-block"
                      >
                        Use this Address
                      </button>
                    )}
                  </div>
                ) : (
                  // Add/Edit Address Form
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-800 text-sm">Add Service Location</h4>
                      <button onClick={() => setIsAddingAddress(false)} className="text-gray-400 hover:text-slate-900"><X size={16} /></button>
                    </div>

                    <div className="bg-white border border-purple-100 p-3 rounded-lg mb-4 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#6e42e5]" />
                        <span className="text-xs font-bold text-slate-700">Detect current location</span>
                      </div>
                      <button onClick={handleManualAutofill} className="bg-[#6e42e5] text-white px-3 py-1.5 rounded-md shadow-purple-200 shadow-sm text-[10px] font-bold hover:bg-[#5b36bf]">Use Current Location</button>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Name</label>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Who will receive the specialist?"
                          value={addressForm.fullName}
                          onChange={handleAddressFormChange}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                        <input
                          type="text"
                          name="mobile"
                          placeholder="For coordination"
                          value={addressForm.mobile}
                          onChange={handleAddressFormChange}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="e.g. 800001"
                          value={addressForm.pincode}
                          onChange={handleAddressFormChange}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                        />
                      </div>

                      {/* House No */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">House No / Flat / Building</label>
                        <input
                          type="text"
                          name="houseNo"
                          placeholder="Ex: Flat 401, Galaxy Apartment"
                          value={addressForm.houseNo}
                          onChange={handleAddressFormChange}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                        />
                      </div>

                      {/* Area */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Area / Colony / Sector</label>
                        <input
                          type="text"
                          name="area"
                          placeholder="Ex: Kankarbagh Main Road"
                          value={addressForm.area}
                          onChange={handleAddressFormChange}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                        />
                      </div>

                      {/* Landmark */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Easy to find)</label>
                        <input
                          type="text"
                          name="landmark"
                          placeholder="Near Hanuman Mandir..."
                          value={addressForm.landmark}
                          onChange={handleAddressFormChange}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                        />
                      </div>

                      {/* City & State (Locked to Bihar) */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            placeholder="Ex: Patna"
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            placeholder="Ex: Bihar"
                            value={addressForm.state}
                            onChange={handleAddressFormChange}
                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="defaultAddr"
                          className="accent-[#6e42e5]"
                          checked={saveForFuture}
                          onChange={(event) => setSaveForFuture(event.target.checked)}
                        />
                        <label htmlFor="defaultAddr" className="text-sm text-slate-700">Save for future bookings</label>
                      </div>

                      <button
                        onClick={handleSaveAddress}
                        className="w-full bg-[#6e42e5] hover:bg-[#5b36bf] text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-purple-200 transition mt-2"
                      >
                        Confirm Location
                      </button>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Slot */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1"><Calendar size={20} className="text-gray-400" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Slot</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold text-slate-700 outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                  />
                  <select
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold text-slate-700 outline-none focus:border-[#6e42e5] focus:ring-1 focus:ring-[#6e42e5]"
                  >
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1"><CreditCard size={20} className="text-gray-400" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Payment Method</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex-1 py-3 border-2 rounded-xl text-sm font-bold ${paymentMethod === 'cod' ? 'border-[#6e42e5] bg-[#f3f0ff] text-[#6e42e5]' : 'border-gray-100 text-gray-400'}`}
                  >
                    Cash After Service
                  </button>
                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={`flex-1 py-3 border-2 rounded-xl text-sm font-bold ${paymentMethod === 'online' ? 'border-[#6e42e5] bg-[#f3f0ff] text-[#6e42e5]' : 'border-gray-100 text-gray-400'}`}
                  >
                    Pay Online
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Summary */}
        <div className="lg:col-span-5 space-y-6">

          {/* Cart Items List */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4 border-b pb-2">CART ITEMS</h3>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  {/* Image & Name */}
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.packageImage?.startsWith('http') ? item.packageImage : `${BACKEND_URL}/${item.packageImage}`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{item.packageName}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">₹{item.priceAmount} × {item.quantity}</p>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-bold text-slate-900 text-sm">₹{item.priceAmount * item.quantity}</span>
                    <button onClick={() => dispatch(removeItemFromCart(item._id))} className="text-red-500 text-[10px] font-bold uppercase hover:underline">REMOVE</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Addons Section */}
            <div className="mt-6 pt-4 border-t border-dashed">
              <h4 className="font-bold text-slate-900 text-xs mb-3">Frequently added together</h4>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {ADDONS.map(addon => {
                  const isSelected = selectedAddons.find(item => item.id === addon.id);
                  return (
                    <div key={addon.id} className="min-w-[140px] border rounded-lg p-2 flex flex-col items-center text-center gap-2 cursor-pointer hover:border-[#6e42e5]" onClick={() => toggleAddon(addon)}>
                      <img src={addon.icon} className="w-8 h-8 opacity-70" alt="" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-700 leading-tight">{addon.name}</p>
                        <p className="text-[10px] font-black text-slate-900">₹{addon.price}</p>
                      </div>
                      <button className={`w-full py-1 rounded text-[10px] font-bold mt-1 ${isSelected ? 'bg-green-100 text-green-700' : 'bg-white border text-[#6e42e5] hover:bg-purple-50'}`}>
                        {isSelected ? 'ADDED' : 'ADD'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Coupons */}
          <div onClick={() => setIsCouponModalOpen(true)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Zap size={14} className="text-green-600 fill-green-600" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">Coupons and offers</span>
                {appliedCoupon && <span className="text-xs text-green-600 font-bold">{appliedCoupon.code} applied</span>}
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          {/* Payment Summary */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Payment summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item total</span>
                <span className="font-bold text-slate-900">₹{cartTotal}</span>
              </div>
              {addonsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Add-ons total</span>
                  <span className="font-bold text-slate-900">₹{addonsTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Taxes and Fee</span>
                <span className="font-bold text-slate-900">₹49</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="font-bold uppercase text-[10px] tracking-widest">Coupon Discount</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">-₹{calculatedDiscount}</span>
                    <button onClick={removeCoupon} className="p-1 hover:bg-red-50 text-red-500 rounded"><X size={12} /></button>
                  </div>
                </div>
              )}

              <div className="border-t border-dashed my-2"></div>
              <div className="flex justify-between text-base">
                <span className="font-bold text-slate-900">Total amount</span>
                <span className="font-black text-slate-900">₹{finalTotal}</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl flex justify-between items-center mb-4">
              <span className="text-[#6e42e5] font-black text-lg">₹{finalTotal}</span>
              <button
                onClick={handleProceed}
                className="bg-[#6e42e5] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-purple-200 hover:bg-[#5b36bf] transition"
              >
                Proceed to Pay
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </div>

          {/* Support Section: Gmail & WhatsApp */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Need Help?</h3>
            <div className="flex gap-4">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 border border-green-100 bg-green-50 rounded-xl hover:bg-green-100 transition">
                <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" className="w-5 h-5" alt="WhatsApp" />
                <span className="text-green-700 font-bold text-sm">WhatsApp</span>
              </a>
              <a href="mailto:support@gharkeseva.com" className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-5 h-5" alt="Gmail" />
                <span className="text-red-600 font-bold text-sm">Gmail</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AddressSelection;