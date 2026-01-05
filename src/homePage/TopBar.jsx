import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, User, ChevronDown, ShoppingBag, Menu, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';


const TopBar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  const [activeLocation, setActiveLocation] = useState("Detecting location...");
  const [isLoading, setIsLoading] = useState(true);
  const [isPincodeBoxOpen, setIsPincodeBoxOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.suburb || "Unknown Location";
            const state = data.address.state || "";
            setActiveLocation(`${city}, ${state}`);
            setIsLoading(false);
          } catch (err) {
            setActiveLocation("Location error");
            setIsLoading(false);
          }
        },
        () => {
          setActiveLocation("Location Access Denied");
          setIsLoading(false);
        }
      );
    } else {
      setActiveLocation("Not supported");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsPincodeBoxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [boxRef]);

  const handlePincodeSubmit = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setIsPincodeLoading(true);
    setError("");
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        setActiveLocation(`${details.District}, ${details.State}`);
        setIsPincodeBoxOpen(false);
        setPincode("");
      } else {
        setError("Invalid Pincode.");
      }
    } catch (err) {
      setError("Error fetching.");
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const renderLocationTrigger = () => (
    <div
      onClick={() => setIsPincodeBoxOpen(!isPincodeBoxOpen)}
      className="flex items-center space-x-2 ml-2 md:ml-8 md:pl-6 md:border-l border-gray-200 group cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition"
    >
      <div className="p-1.5 bg-blue-50 rounded-full">
        {isLoading ? (
          <Loader2 size={16} className="text-blue-600 animate-spin md:size-[18px]" />
        ) : (
          <MapPin size={16} className="text-blue-600 md:size-[18px]" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="hidden md:block text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">Location</span>
        <div className="flex items-center text-xs md:text-sm font-semibold text-gray-700">
          <span className="truncate max-w-[80px] md:max-w-[150px]">{activeLocation}</span>
          <ChevronDown size={14} className={`ml-1 text-gray-400 transition-transform ${isPincodeBoxOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );

  const renderPincodeModal = () => isPincodeBoxOpen && (
    <div className="absolute top-full left-0 md:left-8 mt-2 w-60 md:w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Enter Pincode</h4>
      <form onSubmit={handlePincodeSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            maxLength="6"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit Pincode"
            className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:border-blue-500 outline-none transition-all text-sm font-bold"
            autoFocus
          />
          {isPincodeLoading && (
            <Loader2 size={16} className="absolute right-3 top-2.5 text-blue-600 animate-spin" />
          )}
        </div>
        {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
        <button type="submit" disabled={isPincodeLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
          Update Location
        </button>
      </form>
    </div>
  );

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 lg:h-20 space-y-3 lg:space-y-0">

          <div className="flex items-center justify-between lg:justify-start lg:flex-1">
            <div className="flex items-center">
              <button className="p-2 mr-2 lg:hidden text-gray-600">
                <Menu size={24} />
              </button>

              <Link to="/" className="flex-shrink-0 cursor-pointer">
                <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
                  GHARKE<span className="text-blue-600">SEVA</span>
                </span>
              </Link>

              <div className="relative" ref={boxRef}>
                {renderLocationTrigger()}
                {renderPincodeModal()}
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:hidden">
              <Link to="/basket" className="p-2 text-gray-700 relative">
                <ShoppingBag size={22} className="text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{cartCount}</span>
                )}
              </Link>
              <Link to="/login" className="p-2 text-slate-900">
                <User size={22} />
              </Link>
            </div>
          </div>

          <div className="w-full lg:flex-1 lg:max-w-md lg:mx-10">
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 lg:py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/basket" className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition relative">
              <div className="relative">
                <ShoppingBag size={22} className="text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{cartCount}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-bold text-slate-800">Service Basket</span>
            </Link>

            {useSelector(state => state.auth.user) ? (
              <Link to="/profile" className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200">
                <User size={20} />
                <span className="text-sm font-black uppercase tracking-tight">My Profile</span>
              </Link>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                <User size={20} />
                <span className="text-sm font-semibold">Sign In</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopBar;