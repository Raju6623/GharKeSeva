import React, { useState, useEffect } from 'react';
import { fetchServices } from '../redux/thunks/serviceThunks';
import { useNavigate } from 'react-router-dom'; // Navigation add ki
import {
  CheckCircle2, Star, Clock, ShieldCheck, Zap, Info,
  HelpCircle, ChevronDown, Lightbulb, Power, Loader2, ShoppingCart, Trash2, X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';

const ElectricianServicePage = () => {
  // --- REDUX HOOKS ---
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartCount = cart.length;
  const navigate = useNavigate();

  const [selectedServiceType, setSelectedServiceType] = useState('Repair');
  const [selectedFixArea, setSelectedFixArea] = useState('');
  // --- REDUX STATE ---
  const { availableServices: services, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices(selectedServiceType));
  }, [selectedServiceType, dispatch]);

  const electricalAreas = ["Switchboard", "Ceiling Fan", "Lighting", "MCB Box", "AC Wiring", "Other"];

  // --- CHECKOUT HANDLER ---
  const handleCheckout = () => {
    if (cartCount > 0) {
      navigate('/checkout', { state: { from: 'electrician' } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-yellow-600 mb-4 font-bold">
                <Zap size={20} className="fill-yellow-500" />
                <span className="text-sm uppercase tracking-widest text-slate-900">Expert Power Solutions</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Certified <span className="text-blue-600">Electricians</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                  <Star size={14} className="fill-orange-500 mr-1" /> 4.9 (18k+ Reviews)
                </div>
                <div className="flex items-center text-green-600 font-bold">
                  <ShieldCheck size={18} className="mr-1" /> ISO Certified Safety
                </div>
              </div>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200">
              {['Repair', 'Installation'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedServiceType(type)}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${selectedServiceType === type
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

      {/* 2. Fix Area Selection */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            Where is the issue? <ChevronDown size={18} className="ml-1 text-blue-600" />
          </h2>
          <div className="flex flex-wrap gap-3">
            {electricalAreas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedFixArea(area)}
                className={`px-6 py-2 rounded-full border text-sm font-semibold transition-all ${selectedFixArea === area
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
                  }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Available {selectedServiceType} Packages</h2>

              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
              ) : services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((pkg) => {
                    const isInCart = cart.some(item => item._id === pkg._id);
                    return (
                      <div key={pkg._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{pkg.packageName}</h3>
                          <p className="text-gray-500 text-sm mb-3">{pkg.description || "Expert electrical solution by certified pro."}</p>
                          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 space-x-6">
                            <span className="flex items-center"><Clock size={14} className="mr-1.5 text-blue-500" /> {pkg.estimatedTime}</span>
                            <span className="text-emerald-600">Safety Check Included</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2 w-full md:w-auto">
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{pkg.priceAmount}</span>

                          {isInCart ? (
                            <button
                              onClick={() => dispatch(removeItemFromCart(pkg._id || pkg.id))}
                              className="px-10 py-3.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition flex items-center gap-2"
                            >
                              Remove <X size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => dispatch(addItemToCart(pkg))}
                              disabled={!pkg.isServiceActive}
                              className={`px-10 py-3.5 rounded-xl font-bold text-sm transition shadow-lg active:scale-95 ${pkg.isServiceActive
                                ? 'bg-blue-600 text-white hover:bg-slate-900'
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
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed text-gray-400">
                  No electrical services found in database for {selectedServiceType}.
                </div>
              )}
            </section>

            {/* Safety Protocol */}
            <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Power size={150} />
              </div>
              <h2 className="text-2xl font-black mb-8 relative z-10">Electrical Safety Protocol</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {services[0]?.inclusions?.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={24} />
                    <p className="text-slate-100 font-bold text-sm leading-tight">{inclusion}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Synchronized Basket */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-xl sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                <ShoppingCart className="mr-2 text-blue-600" /> Your Basket
              </h3>
              {cartCount > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.packageName}</p>
                        <p className="text-xs text-gray-400">₹{item.priceAmount}</p>
                      </div>
                      <button onClick={() => dispatch(removeItemFromCart(item._id || item.id))} className="text-red-500 hover:bg-red-50 p-1 rounded transition">
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
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition"
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">Your basket is empty.</p>
                </div>
              )}
            </div>

            {/* GharKeSeva Security Section */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100">
              <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">GharKeSeva Security</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-yellow-500 flex-shrink-0" size={20} />
                  <p className="text-xs text-gray-500">We use high-grade voltage testers and insulated tools for every repair.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Mobile) */}
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

export default ElectricianServicePage;