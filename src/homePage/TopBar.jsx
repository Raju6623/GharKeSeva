import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL, getImageUrl } from '../config';
import { Search, MapPin, User, ChevronDown, ShoppingBag, Menu, Loader2, Globe, X, Scissors, Wind, Droplets, Zap, Wrench, Paintbrush, Home, Star, Calendar, MessageSquare, Wallet, Megaphone, Briefcase, BookOpen, ChevronRight, LogOut, Phone, Share2, Info, ShieldCheck, FileText, Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../redux/slices/locationSlice';
import { setLanguage } from '../redux/slices/authSlice';
import useTranslation from '../hooks/useTranslation';

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('salon')) return <Scissors size={28} className="text-[#0c8182]" />;
  if (cat.includes('ac')) return <Wind size={28} className="text-[#0c8182]" />;
  if (cat.includes('plumb')) return <Droplets size={28} className="text-[#0c8182]" />;
  if (cat.includes('electric')) return <Zap size={28} className="text-[#0c8182]" />;
  if (cat.includes('repair') || cat.includes('appliance')) return <Wrench size={28} className="text-[#0c8182]" />;
  if (cat.includes('paint')) return <Paintbrush size={28} className="text-[#0c8182]" />;
  if (cat.includes('clean')) return <Home size={28} className="text-[#0c8182]" />;
  return <Search size={28} className="text-slate-300" />;
};


function TopBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const globalLocation = useSelector((state) => state.location.fullLocation);
  const user = useSelector((state) => state.auth.user);
  const cartCount = cartItems.length;

  const [activeLocation, setActiveLocation] = useState(globalLocation || "Detecting location...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveLocation(globalLocation);
  }, [globalLocation]);

  const [isPincodeBoxOpen, setIsPincodeBoxOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [error, setError] = useState("");

  const { language } = useSelector((state) => state.auth);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const mobileBoxRef = useRef(null);

  const [membershipPlans, setMembershipPlans] = useState([]);
  const [isMembershipLoading, setIsMembershipLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (membershipPlans.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: clientWidth + 16, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [membershipPlans]);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/membership/plans`);
        const data = await response.json();
        // Assuming data is an array since sendResponse sends it directly
        if (Array.isArray(data)) {
          setMembershipPlans(data.filter(p => p.isActive));
        } else if (data && Array.isArray(data.data)) {
          setMembershipPlans(data.data.filter(p => p.isActive));
        }
      } catch (err) {
        console.error("Error fetching membership plans:", err);
      } finally {
        setIsMembershipLoading(false);
      }
    };
    fetchMembership();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/services?q=${searchQuery}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchTerm = typeof suggestion === 'string' ? suggestion : suggestion.name;
    setSearchQuery(searchTerm);
    setShowSuggestions(false);

    if (typeof suggestion === 'object' && suggestion.category && suggestion.category !== 'Service') {
      const catSlug = suggestion.category.toLowerCase().replace(/\s+/g, '-');
      navigate(`/services/${catSlug}?q=${searchTerm}`);
    } else {
      navigate(`/services?q=${searchTerm}`);
    }
  };

  // Debounced Search Suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const response = await fetch(`${API_URL}/services?category=${searchQuery}`);
          const data = await response.json();
          const results = Array.isArray(data) ? data : (data.services || []);

          // Get full service objects instead of just names
          const uniqueServices = [];
          const seenNames = new Set();

          results.forEach(service => {
            if (!seenNames.has(service.packageName) && uniqueServices.length < 5) {
              seenNames.add(service.packageName);

              let ratingVal = Number(service.rating) || 0;
              const reviewCountVal = Number(service.reviewCount) || 0;

              // HEURISTIC: If rating is exactly 4.8 (default) and no reviews, treat as 0
              if (ratingVal === 4.8 && reviewCountVal === 0) {
                ratingVal = 0;
              }

              uniqueServices.push({
                name: service.packageName,
                price: service.priceAmount || service.price || 299,
                rating: ratingVal,
                reviews: reviewCountVal,
                image: service.packageImage || service.image || null,
                category: service.category || service.serviceCategory || 'Service'
              });
            }
          });

          setSuggestions(uniqueServices);
          setShowSuggestions(uniqueServices.length > 0);
        } catch (error) {
          console.error("Suggestion fetch failed", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const langCode = language === 'Hindi' ? 'hi' : 'en';
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${langCode}`
            );
            const data = await response.json();
            const city = data.city || data.locality || "Unknown Location";
            const state = data.principalSubdivision || "";
            const locationString = `${city}, ${state}`;

            dispatch(setLocation({ fullLocation: locationString, city }));
            setActiveLocation(locationString);
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
  }, [dispatch, language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target) &&
        mobileBoxRef.current && !mobileBoxRef.current.contains(event.target)) {
        setIsPincodeBoxOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [boxRef, mobileBoxRef, languageRef]);

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
        const locationString = `${details.District}, ${details.State}`;
        const city = details.District;
        dispatch(setLocation({ fullLocation: locationString, city }));
        setActiveLocation(locationString);
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
      className="flex items-center space-x-2 ml-2 md:ml-0 md:pl-0 group cursor-pointer p-1.5 rounded-lg transition"
    >
      <div className="p-1.5 rounded-full">
        {isLoading ? (
          <Loader2 size={16} className="text-[#0c8182] animate-spin md:size-[18px]" />
        ) : (
          <MapPin size={16} className="text-[#0c8182] md:size-[18px]" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="hidden md:block text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">{t('location')}</span>
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
            className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:border-[#0c8182] outline-none transition-all text-sm font-bold"
            autoFocus
          />
          {isPincodeLoading && (
            <Loader2 size={16} className="absolute right-3 top-2.5 text-[#0c8182] animate-spin" />
          )}
        </div>
        {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
        <button type="submit" disabled={isPincodeLoading} className="w-full bg-[#0c8182] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#0a6d6d] transition">
          Update Location
        </button>
      </form>
    </div>
  );

  const renderLanguageSelector = () => (
    <div className="relative ml-2" ref={languageRef}>
      <div
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        className="flex items-center space-x-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition"
      >
        <div className="p-1.5 bg-slate-50 rounded-full text-slate-500">
          <Globe size={16} className="md:size-[18px]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-xs md:text-sm font-bold text-slate-700">
            <span>{language === 'Hindi' ? 'हिंदी' : 'English'}</span>
            <ChevronDown size={14} className={`ml-1 text-gray-400 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {isLanguageOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            onClick={() => { dispatch(setLanguage("English")); setIsLanguageOpen(false); }}
            className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors ${language === "English" ? "text-[#0c8182] bg-teal-50" : "text-slate-700"}`}
          >
            English
          </div>
          <div
            onClick={() => { dispatch(setLanguage("Hindi")); setIsLanguageOpen(false); }}
            className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors ${language === "Hindi" ? "text-[#0c8182] bg-teal-50" : "text-slate-700"}`}
          >
            हिंदी
          </div>
        </div>
      )}
    </div>
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 lg:h-20 space-y-3 lg:space-y-0">

          <div className="flex items-center justify-between lg:justify-start lg:flex-1">
            {/* Mobile Menu + Logo */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 lg:hidden text-gray-600 hover:text-[#0c8182] transition-colors"
                onClick={toggleMenu}
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex-shrink-0 cursor-pointer">
                <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
                  GHARKE <span className="text-[#0c8182]">SEVA</span>
                </span>
              </Link>
            </div>

            {/* Location Selector - Desktop */}
            <div className="hidden lg:block relative ml-20" ref={boxRef}>
              {renderLocationTrigger()}
              {renderPincodeModal()}
            </div>

            {/* Mobile Right Icons */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link to="/basket" className="p-2 text-gray-700 relative">
                <ShoppingBag size={22} className="text-[#0c8182]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0c8182] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{cartCount}</span>
                )}
              </Link>
              <Link to={user ? "/profile" : "/login"} className="p-2 text-slate-900">
                <User size={22} />
              </Link>
            </div>
          </div>

          {/* Mobile Location Selector - Below Logo */}
          <div className="lg:hidden relative" ref={mobileBoxRef}>
            {renderLocationTrigger()}
            {renderPincodeModal()}
          </div>

          <div className="w-full lg:flex-1 lg:max-w-md lg:mx-10">
            <form onSubmit={handleSearch} className="relative group search-container">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0c8182] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 lg:py-3 pl-11 pr-10 focus:ring-2 focus:ring-[#0c8182]/20 focus:border-[#0c8182] outline-none transition-all shadow-sm font-semibold text-slate-700 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setSuggestions([]); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <div className="bg-gray-200 rounded-full p-0.5"><X size={14} /></div>
                </button>
              )}

              {showSuggestions && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[110] max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  {suggestions.length > 0 ? (
                    <div className="p-3">
                      {suggestions.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(service)}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-all mb-2 last:mb-0 border border-transparent hover:border-slate-200"
                        >
                          {/* Service Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                            {service.image ? (
                              <img
                                src={getImageUrl(service.image)}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = getCategoryIcon(service.category).props.children;
                                }}
                              />
                            ) : (
                              getCategoryIcon(service.category)
                            )}
                          </div>

                          {/* Service Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate">{service.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {(service.rating > 0 || service.reviews > 0) ? (
                                <>
                                  <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                                    <Star size={10} fill="currentColor" /> {service.rating}
                                  </span>
                                  <span className="text-xs text-slate-400">({service.reviews})</span>
                                </>
                              ) : (
                                <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                  New
                                </span>
                              )}
                              <span className="text-xs text-slate-300">•</span>
                              <span className="text-xs text-slate-700 font-bold">₹{service.price}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5 block uppercase tracking-wide">{service.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <Search size={32} className="text-slate-300 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No results found</h3>
                        <p className="text-xs text-slate-500 max-w-[200px] mt-1 font-medium">
                          We couldn't find what you were looking for. Try different keywords!
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-5">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 px-1">Trending searches</h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "AC Service",
                            "Salon",
                            "Cleaning",
                            "Plumbing",
                            "Electrician"
                          ].map((tag, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSuggestionClick(tag)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-slate-600 hover:border-[#0c8182] hover:text-[#0c8182] hover:bg-teal-50 transition-all shadow-sm"
                            >
                              <Search size={12} className="text-slate-400" />
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {renderLanguageSelector()}

            <Link to="/basket" className="flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition relative">
              <div className="relative">
                <ShoppingBag size={22} className="text-[#0c8182]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0c8182] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{cartCount}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-bold text-slate-800">{t('basket')}</span>
            </Link>

            {user ? (
              <Link to="/profile" className="flex items-center justify-center w-11 h-11 bg-[#0c8182] text-white rounded-full hover:bg-[#0a6d6d] transition-all active:scale-95 shadow-lg shadow-teal-200/50 overflow-hidden" title={t('profile')}>
                {user.image || user.photo ? (
                  <img src={getImageUrl(user.image || user.photo)} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-black uppercase tracking-tight">
                    {user.name ? user.name.charAt(0) : <User size={22} />}
                  </span>
                )}
              </Link>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 bg-[#0c8182] text-white px-5 py-2.5 rounded-xl hover:bg-[#0a6d6d] transition-all active:scale-95 shadow-lg shadow-teal-200">
                <User size={20} />
                <span className="text-sm font-black uppercase tracking-tight">{t('login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden bg-slate-900/50 backdrop-blur-sm shadow-xl" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-[85%] max-w-[320px] h-screen bg-slate-50 shadow-2xl flex flex-col font-sans" onClick={e => e.stopPropagation()}>

            {/* Header / Profile Section */}
            <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-black tracking-tighter text-slate-900">GHARKE <span className="text-[#0c8182]">SEVA</span></span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-50 overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative">
                    {user.image || user.photo ? (
                      <img src={getImageUrl(user.image || user.photo)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-slate-400" />
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{user.name || "User"}</h3>
                    <p className="text-xs font-bold text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      {user.phone || user.email || "+91 XXXXXXXXXX"}
                    </p>
                  </div>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#0c8182] transition-colors">
                    <User size={24} className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Guest User</h3>
                    <p className="text-xs font-bold text-[#0c8182] uppercase tracking-wide">Login to continue</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Membership Banners - Horizontal Scrollable */}
              {membershipPlans.length > 0 && (
                <div className="relative group">
                  <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar scroll-smooth">
                    {membershipPlans.map((plan, idx) => (
                      <div
                        key={plan._id || idx}
                        className="min-w-full snap-center bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg shadow-slate-200"
                        style={{
                          background: `linear-gradient(135deg, #0f172a 0%, ${plan.color || '#1e293b'} 100%)`
                        }}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 opacity-20 rounded-full blur-3xl -mr-8 -mt-8" style={{ backgroundColor: plan.color }}></div>
                        <div className="flex items-center justify-between relative z-10 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold border border-white/20 shadow-inner backdrop-blur-sm">
                              {plan.title?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm italic tracking-wide">{plan.title}</h4>
                              <p className="text-[10px] text-white/70 font-medium">{plan.subtitle}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-white/40" />
                        </div>
                        <div className="flex items-center justify-between pl-1 relative z-10">
                          <p className="text-[10px] text-white/80 font-bold">{plan.tagline}</p>
                          <button className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-black rounded-lg hover:scale-105 transition-all uppercase tracking-wider">
                            Join @ ₹{plan.price}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Indicators if more than one */}
                  {membershipPlans.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-1">
                      {membershipPlans.map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-slate-200"></div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  // If user is not logged in, these links might redirect to login. Assuming protected routes handle that or user logs in.
                  { label: t('bookings') || "My Bookings", icon: Calendar, link: "/bookings" },
                  { label: t('addresses') || "Addresses", icon: MapPin, link: "/profile?tab=addresses" },
                  { label: t('help') || "Help Center", icon: MessageSquare, link: "/help" }
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.link}
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-[#0c8182]/30 transition-all active:scale-95"
                  >
                    <item.icon size={22} className="text-slate-600" />
                    <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Wallet */}
              <Link to="/wallet" onClick={() => setIsMenuOpen(false)} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">GKS Wallet</h4>
                    <p className="text-xs font-black text-[#0c8182] mt-0.5">₹0.00</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </Link>

              {/* Refer & Earn */}
              <Link to="/refer" onClick={() => setIsMenuOpen(false)} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Refer & Earn</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Win coins & free services</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 border border-amber-200">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> 0
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </Link>

              {/* Earn With Us Section */}
              <div className="pt-2">
                <h4 className="text-xs font-black text-slate-900 mb-3 px-1 uppercase tracking-widest">{t('earn_with_us') || "Earn With Us"}</h4>
                <a
                  href="https://gharkesva-partner.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                      <Briefcase size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Register as a Partner</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </a>
              </div>

              {/* Read Something Section */}
              <div className="pt-2">
                <h4 className="text-xs font-black text-slate-900 mb-3 px-1 uppercase tracking-widest">Wanna Read Something?</h4>
                <Link
                  to="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                      <BookOpen size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Blog</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </Link>
              </div>

              {/* Other Information Section */}
              <div className="pt-2">
                <h4 className="text-xs font-black text-slate-900 mb-3 px-1 uppercase tracking-widest">Other Information</h4>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  {[
                    { label: "Share the App", icon: Share2, action: "share" },
                    { label: "About Us", icon: Info, link: "/about" },
                    { label: "Privacy Policy", icon: ShieldCheck, link: "/privacy" },
                    { label: "Terms & Conditions", icon: FileText, link: "/terms" },
                    { label: "Notification preferences", icon: Bell, link: "/notifications" },
                    { label: "Contact Us", icon: Phone, link: "/contact" }
                  ].map((item, idx, arr) => {
                    const Component = item.link ? Link : 'button';
                    return (
                      <Component
                        key={idx}
                        to={item.link}
                        onClick={(e) => {
                          setIsMenuOpen(false);
                          if (item.action === 'share' && navigator.share) {
                            e.preventDefault();
                            navigator.share({
                              title: 'GharKe Seva',
                              text: 'Check out GharKe Seva for all your home services!',
                              url: window.location.origin
                            }).catch(console.error);
                          }
                        }}
                        className={`flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-all active:bg-slate-100 w-full text-left ${idx !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-6 flex justify-center text-slate-500">
                            <item.icon size={20} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </Component>
                    );
                  })}
                </div>
              </div>

              {/* Language & Logout */}
              <div className="mt-4 border-t border-slate-100 pt-6 pb-20 md:pb-6 space-y-4">
                <button
                  onClick={() => { dispatch(setLanguage(language === 'English' ? 'Hindi' : 'English')); }}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <Globe size={14} />
                  Change Language: <span className="text-[#0c8182] uppercase">{language}</span>
                </button>

                {user && (
                  <button
                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-100 transition-colors"
                    // Add logout logic here if needed, or link to logout route. Assuming just a visual button for now or reusing existing logout if available.
                    onClick={() => {
                      // Simple logout simulation or dispatch if available. 
                      // Ideally: dispatch(logout()); 
                      // For now just close menu
                      setIsMenuOpen(false);
                      window.location.href = '/login'; // Force logout/login redirect
                    }}
                  >
                    <LogOut size={16} />
                    {t('logout') || "Logout"}
                  </button>
                )}

                <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-widest mt-4">App Version 1.2.0</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default TopBar;