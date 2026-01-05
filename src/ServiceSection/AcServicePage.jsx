import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Star, Clock, ShieldCheck, Snowflake, Zap, 
  Info, HelpCircle, ChevronDown, Loader2, ShoppingBag, X 
} from 'lucide-react';
import { useCart } from '../Cart';


const AcServicePage = () => {
  const { cart, addToCart, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('Split AC');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:3001";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/services?category=${selectedServiceType}`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedServiceType]);

  const acBrands = ["Voltas", "LG", "Samsung", "Daikin", "Hitachi", "Blue Star", "Lloyd", "Carrier"];
  const defaultInclusions = [
    "Indoor Coil Jet Wash", 
    "Outdoor Unit Cleaning", 
    "Drainage Pipe Clearout", 
    "10-Point Health Check"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white border-b border-gray-100 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Snowflake size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">Premium AC Solutions</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                {selectedServiceType} <span className="text-blue-600">Specialist</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                  <Star size={14} className="fill-orange-500 mr-1" /> 4.9 (12k+ Reviews)
                </div>
                <div className="flex items-center">
                  <ShieldCheck size={18} className="text-green-600 mr-1" /> Verified Pros Only
                </div>
              </div>
            </div>
            
            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner">
              {['Split AC', 'Window AC'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedServiceType(type)}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedServiceType === type 
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

      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             Select your AC Brand <ChevronDown size={18} className="ml-1 text-blue-600" />
          </h2>
          <div className="flex flex-wrap gap-3">
            {acBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all ${
                  selectedBrand === brand 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
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
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                Available {selectedServiceType} Packages {selectedBrand && <span className="text-blue-600">for {selectedBrand}</span>}
              </h2>

              {loading ? (
                <div className="flex items-center justify-center p-20">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((pkg) => {
                    const isInCart = cart.some(item => item._id === pkg._id);
                    return (
                      <div key={pkg._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
                        
                        <div className="w-full md:w-32 h-32 flex-shrink-0">
                          {pkg.packageImage ? (
                            <img 
                              src={pkg.packageImage.startsWith('http') ? pkg.packageImage : `${BACKEND_URL}/${pkg.packageImage}`} 
                              alt={pkg.packageName} 
                              className="w-full h-full object-cover rounded-2xl border border-gray-100 shadow-inner"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                               <Zap size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-slate-900 text-lg">{pkg.packageName}</h3>
                             {!pkg.isServiceActive && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded">Inactive</span>}
                          </div>
                          <p className="text-gray-500 text-sm mb-3">
                            {pkg.description || `Professional ${pkg.serviceCategory} service with skilled technicians.`}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 space-x-4">
                            <span className="flex items-center"><Clock size={14} className="mr-1" /> {pkg.estimatedTime}</span>
                            <span className="flex items-center font-bold text-blue-600">Expert Assigned</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-2">
                          <span className="text-2xl font-black text-slate-900">₹{pkg.priceAmount}</span>
                          
                          {isInCart ? (
                            <button 
                              onClick={() => removeFromCart(pkg._id)}
                              className="px-8 py-3 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition flex items-center gap-2"
                            >
                              Remove <X size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => addToCart(pkg)}
                              disabled={!pkg.isServiceActive}
                              className={`px-8 py-3 rounded-xl font-bold text-sm transition active:scale-95 shadow-lg ${
                                pkg.isServiceActive 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100' 
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
                <div className="bg-white p-10 rounded-3xl text-center border border-dashed border-gray-300">
                   <p className="text-gray-500">No packages found for this category in database.</p>
                </div>
              )}
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Snowflake size={120} />
               </div>
              <h2 className="text-2xl font-black mb-8">What's included in {selectedServiceType} service?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {defaultInclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-blue-400 flex-shrink-0" size={20} />
                    <p className="text-slate-200 font-medium">{inclusion}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">GharKeSeva Promise</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600"><ShieldCheck size={24} /></div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">30-Day Guarantee</h4>
                    <p className="text-xs text-gray-500 mt-1">Complete peace of mind with our service warranty.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Info size={24} /></div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">No Hidden Costs</h4>
                    <p className="text-xs text-gray-500 mt-1">Prices are inclusive of visiting charges.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl border border-white/10 flex items-center justify-between animate-in fade-in slide-in-from-bottom-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag className="text-blue-400" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
                <p className="text-xl font-black">₹{cartTotal}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/basket')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2"
            >
              View Cart <Zap size={16} fill="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcServicePage;