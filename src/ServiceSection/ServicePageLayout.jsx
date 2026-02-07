import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { fetchServices } from '../redux/thunks/serviceThunks';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BASE_URL, API_URL } from '../config';

const socket = io(BASE_URL);
import {
    ShieldCheck, ShoppingCart, ChevronRight, Tag, Star, Clock, Info, CheckCircle, SearchX, Scissors
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import ServiceCard from '../components/ServiceCard';
import PackageCard from '../components/PackageCard';
import ServiceReviewForm from '../components/ServiceReviewForm';
import Footer from '../homePage/Footer';
import useTranslation from '../hooks/useTranslation';

const JUNK_WORDS = ['yaha pr', 'test', 'dummy', 'garbage', 'service', 'services', 'none', 'null', 'undefined', 'category'];

function detectEarliestSlot(t) {
    const now = new Date();
    const hour = now.getHours();

    // Case 1: Before 7 AM -> Opens at 7 AM Today
    if (hour < 7) return `${t('today')}, 07:00 AM`;

    // Case 2: After 10 PM -> Closes at Midnight, so next slot is Tomorrow 7 AM
    if (hour >= 22) return `${t('tomorrow')}, 07:00 AM`;

    // Case 3: Operating Hours
    now.setHours(now.getHours() + 2);
    now.setMinutes(30);
    return `${t('today')}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

function getGksCoverTitle(category) {
    const categoryLower = (category || "").toLowerCase();
    if (categoryLower === 'salon') return "salon_promise";
    if (categoryLower === 'cleaning') return "cleaning_guarantee";
    if (categoryLower === 'painting') return "painting_assurance";
    if (categoryLower === 'ro') return "purity_promise";
    if (categoryLower === 'smart lock') return "security_cover";
    return "gks_cover";
}

function getGksCoverText(category) {
    const categoryLower = (category || "").toLowerCase();
    if (categoryLower === 'salon') return "cover_desc_salon";
    if (categoryLower === 'cleaning') return "cover_desc_cleaning";
    if (categoryLower === 'painting') return "cover_desc_painting";
    if (categoryLower === 'ro') return "cover_desc_ro";
    if (categoryLower === 'smart lock') return "cover_desc_smartlock";
    return "cover_desc_default";
}

function ServicePageLayout({
    title,
    breadcrumb,
    initialServiceType,
    categories,
    reviewServiceId,

    category = "",
    genderType, // NEW: 'men', 'women', or null
    searchQuery // NEW: Passed from SearchResultsPage
}) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const cartTotal = useSelector((state) => state.cart.totalAmount);
    const cartCount = cart.length;
    const navigate = useNavigate();

    // Manage service type state here
    const [selectedServiceType, setSelectedServiceType] = useState(initialServiceType);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.label || t('all_services'));
    const [showOffers, setShowOffers] = useState(false);
    const [stats, setStats] = useState({ avgRating: 0, count: 0, bookingCount: 0 });

    // Fetch category-level statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // category is the prop passed from parent (e.g., "AC", "Salon")
                const res = await axios.get(`${API_URL}/reviews/stats/${category}`);
                if (res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch category stats", error);
            }
        };
        if (category) fetchStats();
    }, [category]);

    // --- REDUX STATE ---
    const { availableServices: services, loading } = useSelector((state) => state.services);

    // Sync state with prop changes (Critical for searching while already on the page)
    useEffect(() => {
        if (initialServiceType) {
            setSelectedServiceType(initialServiceType); // Keep this for fetching logic

            const lowerInit = initialServiceType.toLowerCase().trim();
            const normalizedInit = lowerInit.replace(/-/g, ' ');

            // --- Aggressive Matching Logic ---

            // 1. Try Exact/Strong Match first
            let matchingCat = categories.find(cat => {
                const label = cat.label.toLowerCase();
                return label === lowerInit || label === normalizedInit ||
                    label === `${lowerInit} service` || label === `${normalizedInit} service`;
            });

            // 2. Try Partial/Fuzzy Match (e.g. "saloon" matches "Salon", "ac" matches "AC Service")
            if (!matchingCat) {
                matchingCat = categories.find(cat => {
                    const label = cat.label.toLowerCase();
                    // Check if either label includes input OR input includes label
                    // This handles typos like "saloon" (contains "salon") effectively
                    return label.includes(lowerInit) || lowerInit.includes(label) ||
                        label.includes(normalizedInit) || normalizedInit.includes(label);
                });
            }

            // 3. Fallback Alias Mapping
            if (!matchingCat) {
                if (lowerInit.includes('ac') || lowerInit.includes('cool')) matchingCat = categories.find(c => c.label.toLowerCase().includes('ac'));
                if (lowerInit.includes('salon') || lowerInit.includes('beauty') || lowerInit.includes('hair')) matchingCat = categories.find(c => c.label.toLowerCase().includes('salon'));
                if (lowerInit.includes('maid') || lowerInit.includes('clean')) matchingCat = categories.find(c => c.label.toLowerCase().includes('maid') || c.label.toLowerCase().includes('cleaning'));
                if (lowerInit.includes('electric') || lowerInit.includes('wire')) matchingCat = categories.find(c => c.label.toLowerCase().includes('electrician'));
                if (lowerInit.includes('plumb') || lowerInit.includes('water')) matchingCat = categories.find(c => c.label.toLowerCase().includes('plumbing'));
                if (lowerInit.includes('paint')) matchingCat = categories.find(c => c.label.toLowerCase().includes('painting'));
            }

            if (matchingCat) {
                setSelectedCategory(matchingCat.label);
            } else {
                // Default to first category if it contains "All" or is generic
                setSelectedCategory(categories[0]?.label || t('all_services'));
            }
        }
    }, [initialServiceType, categories]);

    useEffect(() => {
        // CRITICAL FIX: Always fetch based on the page's category prop, not selectedServiceType
        // This ensures AC page only gets AC data, Salon page only gets Salon data
        dispatch(fetchServices(category));
    }, [category, dispatch]);

    // REAL-TIME UPDATE LISTENER
    useEffect(() => {
        socket.on('service_update', (data) => {
            console.log("🔄 [Layout] Service Update Received:", data);
            // Always re-fetch using the page's category
            dispatch(fetchServices(category));
        });

        return () => {
            socket.off('service_update');
        };
    }, [dispatch, category]);

    // --- SMART DYNAMIC CATEGORY LOGIC ---
    // Auto-generate categories from services, but filter out garbage/incomplete names
    const allDetailedCategories = useMemo(() => {
        // For Salon, ALWAYS use only the predefined categories (no dynamic generation)
        if (category.toLowerCase() === "salon") {
            return categories;
        }

        if (!services || services.length === 0) return categories;

        // Only look at services from THIS category page
        const relevantServices = services.filter(s =>
            s.category === category ||
            s.serviceCategory?.toLowerCase().includes(category.toLowerCase())
        );

        // Get unique serviceCategory values
        const actualCategories = [...new Set(relevantServices.map(s => s.serviceCategory).filter(Boolean))];

        // Map existing labels for quick lookup
        const existingLabels = new Set(categories.map(c => c.label.toLowerCase()));

        // SMART FILTERING: Only create categories for valid names
        const dynamicCategories = actualCategories
            .filter(cat => {
                const lower = cat.toLowerCase().trim();
                // Exclude if already exists
                if (existingLabels.has(lower)) return false;
                // Exclude if too short (likely incomplete)
                if (lower.length < 3) return false;
                // Exclude if in junk list
                if (JUNK_WORDS.includes(lower)) return false;
                // Exclude if ends with '&' or other incomplete patterns
                if (/[&\s]+$/.test(cat)) return false;
                // Exclude if it's just special characters
                if (!/[a-zA-Z]/.test(cat)) return false;
                return true;
            })
            .map(cat => {
                let label = cat;
                const lowerCat = cat.toLowerCase();
                const pageCat = (category || "").toLowerCase();

                // Custom Renaming for better UX
                if (lowerCat === 'fan') label = "Fan Services";
                if (lowerCat === 'standard') label = "Standard Plans";
                if (lowerCat === 'hair cut') label = "Haircut Services";
                if (lowerCat === 'makeup') label = "Makeup Services";
                if (lowerCat === 'instapower') label = "InstaPower (Urgent)";
                if (lowerCat === 'instahelp') label = "InstaHelp (Urgent)";

                // Context-aware Renaming
                if (pageCat.includes('electrician') && lowerCat === 'switch') label = "Switch & Sockets";
                if (pageCat.includes('plumbing') && lowerCat === 'tap') label = "Tap & Mixer Repair";

                return {
                    id: `dynamic-${cat.replace(/\s+/g, '-').toLowerCase()}`,
                    label: label,
                    icon: <Scissors size={32} />,
                    isDynamic: true
                };
            });

        return [...categories, ...dynamicCategories];
    }, [categories, services, category]);

    // --- SCROLL SPY & GROUPING LOGIC ---
    const sectionRefs = useRef({});
    const scrollContainerRef = useRef(null);
    const [isManualScroll, setIsManualScroll] = useState(false);

    // Group services by the categories provided in props
    const groupedServices = useMemo(() => {
        // CRITICAL: First filter to ONLY show services from this category page
        const categoryFilteredServices = services.filter(item => {
            const itemCategory = (item.category || "").toLowerCase();
            const pageCategory = category.toLowerCase();
            const itemName = (item.packageName || "").toLowerCase();
            const itemServiceCategory = (item.serviceCategory || "").toLowerCase();
            const itemTags = (item.tag || "").toLowerCase();

            // If pageCategory exists and is not "all services", do strict filtering
            if (pageCategory && pageCategory !== "all services") {
                // Check if item matches the page category
                const categoryMatch = itemCategory === pageCategory ||
                    itemServiceCategory === pageCategory ||
                    itemName.includes(pageCategory) ||
                    itemTags.includes(pageCategory);

                // If no match found, filter out this service
                if (!categoryMatch) return false;
            }

            // GENDER-BASED FILTERING FOR SALON SERVICES
            if (pageCategory.toLowerCase().includes("salon") && genderType) {
                const menKeywords = ['men', 'male', 'gents', 'beard', 'shave', 'moustache'];
                const womenKeywords = ['women', 'female', 'ladies', 'waxing', 'bridal', 'bleach'];

                const searchStr = `${itemName} ${itemServiceCategory} ${itemTags}`;

                const hasMenStrict = menKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchStr));
                const hasWomenStrict = womenKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(searchStr));

                if (genderType === "women") {
                    // Women's page: Block services with explicit MEN keywords UNLESS they also have WOMEN keywords
                    // (e.g. "Men & Women Package" should show on both, but "Men's Salon" only on Men's)
                    if (hasMenStrict && !hasWomenStrict) return false;
                }

                if (genderType === "men") {
                    // Men's page: Block services with explicit WOMEN keywords UNLESS they also have MEN keywords
                    if (hasWomenStrict && !hasMenStrict) return false;
                }
            }

            // EXTRA SAFETY: Check for forbidden keywords based on page type
            if (pageCategory === "ac") {
                // AC page should NOT show salon/beauty services
                const salonKeywords = ['facial', 'cleanup', 'manicure', 'pedicure', 'waxing', 'salon', 'massage', 'haircut', 'hair cut', 'beard'];
                const hasSalonKeyword = salonKeywords.some(kw =>
                    itemName.includes(kw) || itemServiceCategory.includes(kw)
                );
                if (hasSalonKeyword) return false;
            }

            return true;
        });

        const shownIds = new Set();
        const groups = allDetailedCategories
            .filter(cat => !cat.label.toLowerCase().includes("all") && cat.label.toLowerCase() !== category.toLowerCase())
            .map(cat => {
                const filtered = categoryFilteredServices.filter(item => {
                    const itemId = item._id || item.customServiceId;
                    if (shownIds.has(itemId)) return false;

                    const itemCat = (item.serviceCategory || item.category || "").toLowerCase();
                    const itemTags = (item.tag || "").toLowerCase();
                    const itemName = (item.packageName || "").toLowerCase();
                    const selected = cat.label.toLowerCase();

                    // Helper to check for keywords in all searchable fields with word boundaries
                    const hasStrict = (keyword) => {
                        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                        return regex.test(itemCat) || regex.test(itemName) || regex.test(itemTags);
                    };

                    const isMenCategory = selected.includes("men's") || selected.includes("male") || selected.includes("gents") || (selected.includes('men') && !selected.includes('women'));
                    const isWomenCategory = selected.includes('women') || selected.includes("female") || selected.includes("ladies");

                    // 1. GENDER SAFETY (Absolute exclusion using page context)
                    if (genderType === "women") {
                        // On Women's page, block services that are strictly for men
                        if (hasStrict('men') && !hasStrict('women') && !hasStrict('female') && !hasStrict('ladies')) return false;
                        if (hasStrict('male') || hasStrict('gents') || hasStrict('beard') || hasStrict('shave')) return false;
                    }
                    if (genderType === "men") {
                        // On Men's page, block services that are strictly for women
                        if ((hasStrict('women') || hasStrict('female') || hasStrict('ladies') || hasStrict('waxing') || hasStrict('bridal')) && !hasStrict('men')) return false;
                    }

                    // 2. EXACT CATEGORY MATCH (Highest Priority)
                    // If Admin specifically set the sub-category name, use it.
                    if (item.serviceCategory && item.serviceCategory.toLowerCase() === selected.toLowerCase()) {
                        shownIds.add(itemId);
                        return true;
                    }

                    // 3. STRICT KEYWORD MATCHING (Updated to support Translated Labels via ID checks)
                    let isMatch = false;

                    if (cat.id === 'split' || selected.includes('split ac')) {
                        isMatch = hasStrict('split') && !hasStrict('window');
                    } else if (cat.id === 'window_ac' || selected.includes('window ac')) {
                        // Note: serviceConfig ID is usually just 'window_ac' or similar if added, currently 'split' is there.
                        // Checking existing config: currently AC has 'split', 'installation', 'repair'. 
                        // If 'window' isn't in config but is dynamic, label check covers it.
                        isMatch = hasStrict('window') && !hasStrict('split');
                    } else if (cat.id === 'installation' || cat.id === 'install_ro' || selected.includes('installation') || selected.includes('uninstallation')) {
                        isMatch = hasStrict('installation') || hasStrict('uninstallation') || hasStrict('install') || hasStrict('uninstall');
                    } else if (cat.id === 'repair' || cat.id === 'repair_ro' || selected.includes('repair') || selected.includes('gas refill')) {
                        isMatch = hasStrict('repair') || hasStrict('gas') || hasStrict('refill');
                    } else if (cat.id === 'haircut' || selected.includes('haircut')) {
                        isMatch = hasStrict('haircut') || hasStrict('hair cut');
                    } else if (cat.id === 'facial' || selected.includes('facial')) {
                        isMatch = hasStrict('facial') || hasStrict('cleanup');
                    } else if (cat.id === 'manicure' || selected.includes('manicure') || selected.includes('pedicure')) {
                        isMatch = hasStrict('manicure') || hasStrict('pedicure');
                    } else if (cat.id === 'waxing' || selected.includes('waxing')) {
                        isMatch = hasStrict('waxing') || (hasStrict('wax') && !hasStrict('tank'));
                    } else if (cat.id === 'massage' || selected.includes('massage')) {
                        isMatch = hasStrict('massage');
                    } else if (cat.id === 'beard' || selected.includes('beard') || selected.includes('shave')) {
                        isMatch = hasStrict('beard') || hasStrict('shave');
                    } else if (cat.id === 'bathroom' || cat.id === 'kitchen' || cat.id === 'fullhome' || selected.includes('cleaning')) {
                        // Specific cleaning sub-categories
                        if (cat.id === 'bathroom') isMatch = hasStrict('bathroom');
                        else if (cat.id === 'kitchen') isMatch = hasStrict('kitchen');
                        else if (cat.id === 'fullhome') isMatch = hasStrict('full') || hasStrict('deep');
                        else isMatch = hasStrict('cleaning') || hasStrict('clean');
                    } else if (cat.id === 'fullhome_paint' || selected.includes('painting')) {
                        isMatch = hasStrict('painting') || hasStrict('paint');
                    } else if (cat.id === 'switch' || selected.includes('switch') || selected.includes('socket')) {
                        isMatch = hasStrict('switch') || hasStrict('socket');
                    } else if (cat.id === 'fan' || selected.includes('fan')) {
                        isMatch = hasStrict('fan') && !hasStrict('exhaust');
                    } else if (cat.id === 'light' || selected.includes('light')) {
                        isMatch = hasStrict('light') || hasStrict('bulb') || hasStrict('led');
                    } else if (cat.id === 'mcb' || selected.includes('mcb') || selected.includes('fuse')) {
                        isMatch = hasStrict('mcb') || hasStrict('fuse');
                    } else if (selected.includes('wiring')) {
                        isMatch = hasStrict('wiring') || hasStrict('wire');
                    } else if (cat.id === 'tap' || selected.includes('tap') || selected.includes('mixer')) {
                        isMatch = hasStrict('tap') || hasStrict('mixer');
                    } else if (cat.id === 'basin' || selected.includes('basin') || selected.includes('sink')) {
                        isMatch = hasStrict('basin') || hasStrict('sink');
                    } else if (cat.id === 'toilet' || selected.includes('toilet')) {
                        isMatch = hasStrict('toilet') || hasStrict('commode');
                    } else if (cat.id === 'tank' || cat.id === 'water_tank' || selected.includes('tank')) {
                        isMatch = hasStrict('tank');
                    } else if (cat.id === 'blockage' || selected.includes('blockage')) {
                        isMatch = hasStrict('blockage') || hasStrict('block');
                    } else if (cat.id === 'drill' || selected.includes('drill') || selected.includes('hang')) {
                        isMatch = hasStrict('drill') || hasStrict('hang');
                    } else if (cat.id === 'furniture' || selected.includes('furniture')) {
                        isMatch = hasStrict('furniture') || hasStrict('repair');
                    } else if (cat.id === 'cupboard' || selected.includes('cupboard')) {
                        isMatch = hasStrict('cupboard') || hasStrict('drawer');
                    } else if (cat.id === 'door' || selected.includes('door')) {
                        isMatch = hasStrict('door') || hasStrict('lock');
                    } else if (cat.id === 'tv' || selected.includes('tv')) {
                        isMatch = hasStrict('tv');
                    } else if (cat.id === 'laptop' || selected.includes('laptop')) {
                        isMatch = hasStrict('laptop');
                    } else if (cat.id === 'fridge' || selected.includes('refrigerator')) {
                        isMatch = hasStrict('refrigerator') || hasStrict('fridge');
                    } else if (cat.id === 'microwave' || selected.includes('microwave')) {
                        isMatch = hasStrict('microwave');
                    } else if (selected.includes('other')) {
                        // "Other Services" catch-all: any item not already shown in other groups
                        isMatch = !shownIds.has(itemId);
                    }

                    if (isMatch || itemCat.includes(selected) || itemName.includes(selected)) {
                        shownIds.add(itemId);
                        return true;
                    }
                    return false;
                });
                return { ...cat, items: filtered };
            }).filter(group => group.items.length > 0);

        // FALLBACK: Anything left over goes into an "Other Services" group
        // This ensures "All" truly shows everything.
        const leftovers = categoryFilteredServices.filter(item => !shownIds.has(item._id || item.customServiceId));
        if (leftovers.length > 0) {
            groups.push({
                id: 'other-services',
                label: t('other_services'),
                icon: <Scissors size={32} />,
                items: leftovers
            });
        }

        return groups;
    }, [services, allDetailedCategories, category, t]);

    // NEW SCROLL EFFECT: Scroll to searched service
    useEffect(() => {
        if (!loading && searchQuery) {
            // Slight delay to ensure DOM is rendered
            const timer = setTimeout(() => {
                const elements = document.querySelectorAll('[data-service-name]');
                // Fuzzy match helper
                const normalize = (str) => str.toLowerCase().replace(/\s+/g, ' ').trim();
                const targetQuery = normalize(searchQuery);

                const target = Array.from(elements).find(el => {
                    const elName = normalize(el.getAttribute('data-service-name') || "");
                    return elName === targetQuery || elName.includes(targetQuery);
                });

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add a temporary highlight class
                    target.classList.add('ring-4', 'ring-[#0c8182]', 'ring-offset-2', 'transition-all', 'duration-1000', 'rounded-xl');
                    setTimeout(() => {
                        target.classList.remove('ring-4', 'ring-[#0c8182]', 'ring-offset-2');
                    }, 3000);
                }
            }, 800); // 800ms delay to ensure everything rendered
            return () => clearTimeout(timer);
        }
    }, [loading, searchQuery, services]);

    // Use a ref for manual scroll state to avoid closure staleness
    const manualScrollRef = useRef(false);

    // Sync ref with state
    useEffect(() => {
        manualScrollRef.current = isManualScroll;
    }, [isManualScroll]);

    // Intersection Observer to update state on scroll
    useEffect(() => {
        if (loading) return;

        const container = scrollContainerRef.current;
        if (!container) return;

        const observerOptions = {
            root: container,
            // A tighter detection zone: from 10% down to 30% from top
            rootMargin: '-10% 0px -70% 0px',
            threshold: 0
        };

        const callback = (entries) => {
            if (manualScrollRef.current) return;

            // Sort intersecting entries by top position to find the one closest to the trigger zone
            const visibleEntries = entries.filter(e => e.isIntersecting);

            if (visibleEntries.length > 0) {
                // Find entry with top closest to 0 (or positive small value)
                // Since rootMargin pushes the "top" down by ~10%, we look for the one closest to that line
                // But simplified: Just take the one with the smallest positive `boundingClientRect.top` relative to root
                // actually, just taking the first one that triggered is usually unreliable.
                // Better heuristic: sort by intersection ratio? No, sort by DOM order?

                // SIMPLEST FIX: The last entry in the list of intersections is usually the one scrolling INTO view from bottom
                // OR the one we just landed on.
                // However, let's look at all *currently* intersecting elements.
                // Since this callback only gives *changes*, we might miss context.
                // BUT for a simple spy, just taking the `target` of the first intersecting entry is okay IF the zone is small.

                // Let's use the entry that is closest to the top of the root
                const bestEntry = visibleEntries.reduce((prev, curr) => {
                    return Math.abs(curr.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top) ? curr : prev;
                });

                if (bestEntry) {
                    const catLabel = bestEntry.target.getAttribute('data-category');
                    setSelectedCategory(catLabel);
                }
            }
        };

        const observer = new IntersectionObserver(callback, observerOptions);
        Object.values(sectionRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        // Add a scroll listener for extra precision at the top
        const handleScroll = () => {
            if (manualScrollRef.current) return;
            // If we are at the very bottom, force select the last item (for short lists)
            const isAtBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 20;

            if (container.scrollTop < 20) {
                const allCat = allDetailedCategories.find(c => c.label.toLowerCase().includes("all"));
                if (allCat) setSelectedCategory(allCat.label);
            } else if (isAtBottom && groupedServices.length > 0) {
                // Select the last group
                const lastGroup = groupedServices[groupedServices.length - 1];
                setSelectedCategory(lastGroup.label);
            }
        };


        container.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            container.removeEventListener('scroll', handleScroll);
        };
    }, [loading, isManualScroll, category, services?.length]);

    const scrollToSection = (cat) => {
        setIsManualScroll(true);
        setSelectedCategory(cat.label);

        const section = sectionRefs.current[cat.id];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (cat.label.toLowerCase().includes("all")) {
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setTimeout(() => setIsManualScroll(false), 1000);
    };


    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">

            {/* Header / Breadcrumb */}
            <div className="border-b border-gray-100 sticky top-0 bg-white z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="cursor-pointer hover:text-slate-900" onClick={() => navigate('/')}>{t('home_text')}</span>
                    <ChevronRight size={12} />
                    <span className="text-slate-900">{breadcrumb}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 items-start">

                    {/* --- LEFT SIDEBAR: Categories (Desktop Sticky) --- */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start h-fit">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>

                        <div className="border border-gray-100 rounded-2xl p-4 shadow-sm bg-white">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-2">{t('select_service')}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {allDetailedCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => scrollToSection(cat)}
                                        className={`relative overflow-hidden w-full flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 border-2 aspect-[4/3]
                                            ${selectedCategory === cat.label
                                                ? 'bg-white border-slate-900 shadow-sm scale-[1.02]'
                                                : 'bg-slate-50 border-transparent hover:bg-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center mb-1.5">
                                            {/* Clone to ensure size fits grid if needed, or just render */}
                                            {cat.icon}
                                        </div>
                                        <span className={`text-[10px] w-full block font-bold text-center leading-tight break-words line-clamp-2 px-1 ${selectedCategory === cat.label ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* --- CENTER: Main Content --- */}
                    <div className="col-span-1 lg:col-span-5">

                        {/* Mobile Header (Title Only) */}
                        <div className="lg:hidden mb-6">
                            <h1 className="text-2xl font-black text-slate-900">{title}</h1>
                            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                <Star size={14} className="fill-slate-900" />
                                <span className="font-bold">{stats.avgRating > 0 ? stats.avgRating : t('new_rating')}</span>
                                <span className="text-slate-400">({stats.bookingCount > 0 ? `${stats.bookingCount} ${t('bookings')}` : t('no_bookings')})</span>
                            </div>
                        </div>

                        <div className="lg:hidden sticky top-[53px] bg-white z-30 py-3 shadow-sm border-b border-gray-100/50 -mx-4 px-4 mb-6">
                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                                {allDetailedCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => scrollToSection(cat)}
                                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 border
                                            ${selectedCategory === cat.label
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <span>
                                            {cat.icon}
                                        </span>
                                        <span className="whitespace-nowrap leading-tight text-center">
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title & Reviews Header (Desktop) */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 mb-2">{selectedCategory}</h1>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                        <Star size={8} fill="white" /> {stats.avgRating > 0 ? stats.avgRating : t('new_rating')}
                                    </div>
                                    <span className="text-slate-400 font-medium underline decoration-slate-300 underline-offset-4">
                                        {stats.bookingCount > 0 ? `${stats.bookingCount} ${t('bookings')}` : t('no_bookings')}
                                    </span>
                                </div>
                            </div>

                            {/* Earliest Slot Badge */}
                            <div className="flex flex-col items-end">
                                <div className="bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                    <Clock size={12} /> {t('earliest_slot')}
                                </div>
                                <span className="text-xs font-bold text-slate-900 mt-1">
                                    {detectEarliestSlot(t)}
                                </span>
                            </div>
                        </div>

                        {/* GKS Cover Banner */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-8 flex items-center justify-between border border-slate-100 cursor-pointer group hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-teal-600 fill-teal-100" />
                                <div>
                                    <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-0.5">
                                        {t(getGksCoverTitle(category))}
                                    </div>
                                    <div className="text-sm font-medium text-slate-700">
                                        {t(getGksCoverText(category))}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
                        </div>

                        <div
                            ref={scrollContainerRef}
                            className="space-y-12 h-[calc(100vh-140px)] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-24 pr-2 scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <span className="loading loading-spinner loading-lg text-teal-600"></span>
                                    <p className="text-slate-400 text-sm font-medium">{t('loading_services')}</p>
                                </div>
                            ) : groupedServices.length > 0 ? (
                                groupedServices.map((group, groupIdx) => (
                                    <div
                                        key={group.id}
                                        ref={el => sectionRefs.current[group.id] = el}
                                        data-category={group.label}
                                        className="scroll-mt-24"
                                    >
                                        {/* Section Header */}
                                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 py-3 mb-6 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                                <span className="text-teal-600">#</span> {group.label}
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                                                {group.items.length} {group.items.length === 1 ? t('service_count') : t('services_count')}
                                            </span>
                                        </div>

                                        <div className="space-y-8">
                                            {group.items.map(service => (
                                                <div key={service._id} data-service-name={service.packageName}>
                                                    {service.isPackage || group.label === 'Super saver packages' ? (
                                                        <PackageCard service={service} pageCategory={category} />
                                                    ) : (
                                                        <ServiceCard service={service} categoryName={group.label} pageCategory={category} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                        <SearchX size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {t('no_services_found')}
                                    </h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                                        {t('onboarding_msg')}
                                    </p>
                                    <button
                                        onClick={() => scrollToSection(categories[0])}
                                        className="bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
                                    >
                                        {t('browse_all_services')}
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>


                    {/* --- RIGHT SIDEBAR: Cart & Trust (Sticky) --- */}
                    <div className="hidden lg:block lg:col-span-4 space-y-4 sticky top-24">

                        {/* Cart Widget */}
                        {cartCount > 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-teal-50 overflow-hidden animate-in slide-in-from-right-4 duration-500">
                                <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
                                            <ShoppingCart size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">₹{cartTotal}</div>
                                            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('total')}</div>
                                        </div>
                                    </div>
                                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md">{cartCount} {t('items')}</span>
                                </div>
                                <div className="p-2 bg-slate-50">
                                    <button
                                        onClick={() => navigate('/basket')}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold text-sm transition flex justify-center items-center gap-2 shadow-lg shadow-teal-200"
                                    >
                                        {t('view_cart')} <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart size={24} className="text-slate-300" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">{t('cart_empty')}</h4>
                                <p className="text-xs text-slate-400">{t('cart_empty_desc')}</p>
                            </div>
                        )}

                        {/* Offers Widget (Matching Screenshot visual style) */}
                        <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                                    <Tag size={16} className="text-teal-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{t('amazon_offer')}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{t('amazon_offer_desc')}</p>
                                    <button className="text-teal-600 text-xs font-bold mt-3 hover:underline">
                                        {t('view_more_offers')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* GKS Promise Widget */}
                        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-slate-900 text-[15px]">
                                    {t(getGksCoverTitle(category))}
                                </h4>
                                <ShieldCheck size={24} className="text-teal-600 opacity-80" />
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-xs font-medium text-slate-600">
                                    <CheckCircle size={16} className="text-slate-900 shrink-0" />
                                    {t('verified_professionals')}
                                </li>
                                <li className="flex gap-3 text-xs font-medium text-slate-600">
                                    <Info size={16} className="text-slate-900 shrink-0" />
                                    {t('hassle_free')}
                                </li>
                                <li className="flex gap-3 text-xs font-medium text-slate-600">
                                    <Tag size={16} className="text-slate-900 shrink-0" />
                                    {t('transparent_pricing')}
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>




            {/* Mobile Footer Cart Overlay */}
            {
                cartCount > 0 && (
                    <div className="lg:hidden fixed bottom-4 w-[95%] left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl shadow-2xl p-4 flex justify-between items-center z-50 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{cartCount} {t('items')}</span>
                            <span className="font-bold text-white text-base">₹{cartTotal}</span>
                        </div>
                        <button
                            onClick={() => navigate('/basket')}
                            className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition"
                        >
                            {t('view_cart')}
                        </button>
                    </div>
                )
            }

            {/* Reviews Section at bottom */}
            <div className="w-full bg-slate-50 py-12 mt-12 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4">
                    <ServiceReviewForm serviceId={reviewServiceId} category={category || initialServiceType || title} />
                </div>
            </div>

            <Footer />

        </div>
    );
}

export default ServicePageLayout;
