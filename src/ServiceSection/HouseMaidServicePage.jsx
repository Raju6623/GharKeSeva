import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Navigation add ki
import { 
  CheckCircle2, Star, Clock, ShieldCheck, Zap, Info, 
  HelpCircle, ChevronDown, UserCheck, Home, Sparkles, Loader2, ShoppingCart, Trash2, X 
} from 'lucide-react';
import { useCart } from '../Cart'; // Global Cart Hook add kiya

const HouseMaidServicePage = () => {
  // --- GLOBAL CART CONTEXT ---
  const { cart, addToCart, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const [bookingType, setBookingType] = useState('One-Time');
  const [selectedHomeSize, setSelectedHomeSize] = useState('');
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:3001";

  // --- 1. FETCH DATA FROM DATABASE ---
  const fetchMaidServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/services?category=${bookingType}`);
      setServices(response.data);
    } catch (error) {
      console.error("Maid service data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaidServices();
  }, [bookingType]);

  const homeSizes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK+", "Villa/Office"];

  // --- CHECKOUT HANDLER ---
  const handleCheckout = () => {
    if (cartCount > 0) {
      navigate('/checkout', { state: { from: 'house-maid' } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-pink-600 mb-4 font-bold">
                <Sparkles size={20} />
                <span className="text-sm uppercase tracking-widest text-slate-900">Home Hygiene Experts</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Verified <span className="text-blue-600">House Maids</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                  <Star size={14} className="fill-orange-500 mr-1" /> 4.8 (22k+ Reviews)
                </div>
                <div className="flex items-center">
                  <ShieldCheck size={18} className="text-green-600 mr-1" /> Police Verified Staff
                </div>
              </div>
            </div>
            
            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200">
              {['One-Time', 'Subscription'].map((type) => (
                <button
                  key={type}
                  onClick={() => setBookingType(type)}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    bookingType === type 
                    ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Home Size Selection */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              Select Home Size <ChevronDown size={18} className="ml-1 text-blue-600" />
          </h2>
          <div className="flex flex-wrap gap-3">
            {homeSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedHomeSize(size)}
                className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all ${
                  selectedHomeSize === size 
                  ? 'bg-pink-600 border-pink-600 text-white shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-pink-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Packages Section */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Available {bookingType} Packages</h2>
              
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
              ) : services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((pkg) => {
                    const isInCart = cart.some(item => item._id === pkg._id);
                    return (
                      <div key={pkg._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-pink-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-pink-600 transition-colors">{pkg.packageName}</h3>
                          <p className="text-gray-500 text-sm mb-3">{pkg.description || "Professional background-verified maid service."}</p>
                          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 space-x-6">
                            <span className="flex items-center"><Clock size={14} className="mr-1.5 text-blue-500" /> {pkg.estimatedTime}</span>
                            <span className="text-pink-600 flex items-center font-bold tracking-tight"><UserCheck size={14} className="mr-1.5"/> Trained Staff</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2 w-full md:w-auto">
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{pkg.priceAmount}</span>
                          
                          {isInCart ? (
                            <button 
                              onClick={() => removeFromCart(pkg._id)}
                              className="px-10 py-3.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition flex items-center gap-2"
                            >
                              Remove <X size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => addToCart(pkg)}
                              disabled={!pkg.isServiceActive}
                              className={`px-10 py-3.5 rounded-xl font-bold text-sm transition shadow-lg active:scale-95 shadow-blue-100 ${
                                pkg.isServiceActive 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Add to Basket
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 bg-white rounded-3xl text-center border-dashed border-2 text-gray-400">
                  No maid services found in database for {bookingType}.
                </div>
              )}
            </section>

            {/* Checklist Section */}
            <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Home size={150} />
               </div>
              <h2 className="text-2xl font-black mb-8 relative z-10">Standard Cleaning Checklist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {services[0]?.inclusions?.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <CheckCircle2 className="text-pink-400 flex-shrink-0" size={24} />
                    <p className="text-slate-100 font-bold text-sm leading-tight">{inclusion}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Synchronized Basket */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-pink-100 shadow-xl sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                <ShoppingCart className="mr-2 text-pink-600" /> Your Basket
              </h3>
              {cartCount > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.packageName}</p>
                        <p className="text-xs text-gray-400">₹{item.priceAmount}</p>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:bg-red-50 p-1 rounded transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex justify-between font-black text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-pink-600 transition"
                  >
                    Confirm Staff
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6 text-sm italic">Basket is empty.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Mobile Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 md:hidden">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart className="text-blue-400" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </div>
              <p className="text-xl font-black">₹{cartTotal}</p>
            </div>
            <button 
              onClick={handleCheckout}
              className="bg-blue-600 px-8 py-3 rounded-2xl font-black text-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseMaidServicePage;