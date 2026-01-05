import React, { useState, useEffect } from 'react';
import { fetchServices } from '../redux/thunks/serviceThunks';
import { useNavigate } from 'react-router-dom'; // Navigation add ki
import {
  CheckCircle2, Star, Clock, ShieldCheck, Zap, Info, ChevronDown,
  Monitor, Refrigerator, Tablet as Device, Loader2, ShoppingCart, Trash2, X
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';

const AppliancesServicePage = () => {
  // --- REDUX HOOKS ---
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const cartCount = cart.length;
  const navigate = useNavigate();

  const [selectedAppliance, setSelectedAppliance] = useState('Washing Machine');
  const [selectedBrand, setSelectedBrand] = useState('');
  // --- REDUX STATE ---
  const { availableServices: services, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices(selectedAppliance));
  }, [selectedAppliance, dispatch]);

  const applianceBrands = ["Samsung", "LG", "Whirlpool", "Haier", "Godrej", "Bosch", "IFB", "Panasonic", "Other"];

  // --- CHECKOUT HANDLER ---
  const handleCheckout = () => {
    if (cartCount > 0) {
      navigate('/checkout', { state: { from: 'appliances' } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-red-600 mb-4 font-bold">
                <Zap size={20} />
                <span className="text-sm uppercase tracking-widest text-slate-900">Appliance Care Specialists</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Fix Your <span className="text-blue-600">{selectedAppliance}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
                  <Star size={14} className="fill-red-600 mr-1" /> 4.7 (20k+ Reviews)
                </div>
                <div className="flex items-center text-green-600">
                  <ShieldCheck size={18} className="mr-1" /> Original Spare Parts
                </div>
              </div>
            </div>

            {/* APPLIANCE SWITCHER */}
            <div className="grid grid-cols-3 bg-gray-100 p-1.5 rounded-2xl shadow-inner border border-gray-200">
              {['Washing Machine', 'Refrigerator', 'Microwave'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedAppliance(type)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${selectedAppliance === type ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-gray-500'
                    }`}
                >
                  {type === 'Washing Machine' && <Device size={16} />}
                  {type === 'Refrigerator' && <Refrigerator size={16} />}
                  {type === 'Microwave' && <Zap size={16} />}
                  <span className="hidden sm:block">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brand Selection */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            Select Brand for {selectedAppliance} <ChevronDown size={18} className="ml-1 text-blue-600" />
          </h2>
          <div className="flex flex-wrap gap-3">
            {applianceBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${selectedBrand === brand ? 'bg-slate-900 text-white' : 'bg-white text-gray-600'
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Expert Packages</h2>

              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
              ) : services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((pkg) => {
                    const isInCart = cart.some(item => item._id === pkg._id);
                    return (
                      <div key={pkg._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-red-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-red-600">{pkg.packageName}</h3>
                          <p className="text-gray-500 text-sm mb-3 leading-relaxed">{pkg.description || "Professional doorstep service."}</p>
                          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 space-x-6">
                            <span className="flex items-center"><Clock size={14} className="mr-1.5 text-blue-500" /> {pkg.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                          <span className="text-3xl font-black text-slate-900">₹{pkg.priceAmount}</span>

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
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed">No packages found in database.</div>
              )}
            </section>

            {/* Maintenance Checklist */}
            <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
              <h2 className="text-2xl font-black mb-8 relative z-10">Maintenance Checklist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {services[0]?.inclusions?.map((inc, i) => (
                  <div key={i} className="flex items-center space-x-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-red-400 flex-shrink-0" size={24} />
                    <p className="text-slate-100 font-bold text-sm">{inc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Sync with Global Cart */}
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
                      <button onClick={() => dispatch(removeItemFromCart(item._id || item.id))} className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition">
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
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-colors"
                  >
                    Checkout Now
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="text-gray-300" size={30} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Your basket is empty</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- FLOATING ACTION BAR --- */}
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
              className="bg-blue-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliancesServicePage;