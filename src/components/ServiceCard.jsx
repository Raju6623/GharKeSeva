import React, { useState, useEffect } from 'react';
import { Star, Plus, Minus, Tag, Coins } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';
import { BASE_URL, getImageUrl, API_URL } from '../config';
import ServiceDetailModal from './ServiceDetailModal';
import ReviewsModal from './ReviewsModal';
import axios from 'axios';
import useTranslation from '../hooks/useTranslation';
import { calculateGSCoin } from '../utils/coinUtils';

// Normalize category - map all AC variants to "AC"
function normalizeCategory(cat) {
    if (!cat) return "General";
    const lowerCat = cat.toLowerCase();
    // Check for AC-related keywords
    if (lowerCat.includes('ac') ||
        lowerCat.includes('split') ||
        lowerCat.includes('window') ||
        lowerCat.includes('air conditioner') ||
        lowerCat.includes('cooling')) {
        return "AC";
    }
    // Check for RO-related keywords
    if (lowerCat.includes('ro') ||
        lowerCat.includes('water purifier') ||
        lowerCat.includes('purifier')) {
        return "RO";
    }
    // Check for Salon-related keywords
    if (lowerCat.includes('salon') ||
        lowerCat.includes('beauty') ||
        lowerCat.includes('spa')) {
        return "Salon";
    }
    // Check for Plumbing-related keywords
    if (lowerCat.includes('plumb') ||
        lowerCat.includes('tap') ||
        lowerCat.includes('pipe')) {
        return "Plumbing";
    }
    return cat;
}

function ServiceCard({ service, categoryName, pageCategory }) {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [reviewStats, setReviewStats] = useState({ avgRating: 0, count: 0 });

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);

    // Fetch real-time review stats
    useEffect(() => {
        const fetchReviewStats = async () => {
            try {
                // Use pageCategory if provided, otherwise normalize service category
                const category = pageCategory || normalizeCategory(service.serviceCategory || service.category);
                const res = await axios.get(`${API_URL}/reviews/stats/${category}`);
                if (res.data) {
                    setReviewStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch review stats", error);
            }
        };
        fetchReviewStats();
    }, [service, pageCategory]); // Added pageCategory to dependency array

    // Check if item is in cart
    const cartItem = cart.find(item => (item._id || item.id) === service._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    // imageUrl constant removed as getImageUrl is used directly

    const inclusionItems = (service.inclusions && service.inclusions.length > 0) ? (
        service.inclusions.slice(0, 2).map((item, i) => (
            <li key={i} className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                <span className="text-slate-300 mt-0.5">•</span> {item}
            </li>
        ))
    ) : (
        <li className="text-xs text-slate-400 italic">{t('includes_consultation')}</li>
    );

    // Helper to clean up messed up titles
    const cleanTitle = (title) => {
        if (!title) return "";
        let cleaned = title;
        // Fix double words "Women Women"
        cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");

        // Fix specific known concatenation errors
        if (cleaned.includes("Salon for Women") && cleaned.includes("Men's Salon")) {
            // Likely a bug, choose one based on first occurrence or page context
            // But usually the first one is the intended category prefix
            if (cleaned.startsWith("Salon for Women")) {
                cleaned = cleaned.replace("Men's Salon", "");
            }
        }
        if (cleaned.includes("Salon for Men") && cleaned.includes("Women's Salon")) {
            if (cleaned.startsWith("Salon for Men")) {
                cleaned = cleaned.replace("Women's Salon", "");
            }
        }

        return cleaned.replace(/\s+/g, ' ').trim();
    };

    return (
        <div className="flex bg-white py-6 border-b border-gray-100 last:border-0 group items-start gap-4">
            {/* Left Content */}
            <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1.5 break-words line-clamp-2">
                    {cleanTitle(service.packageName)}
                </h3>

                {/* Rating Row */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsReviewsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3 cursor-pointer hover:opacity-80 transition-opacity w-fit"
                >
                    {(reviewStats.count > 0 || reviewStats.avgRating > 0) ? (
                        <>
                            <div className="bg-purple-600 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                                <Star size={8} fill="white" />
                            </div>
                            <span className="text-slate-700 font-bold">{reviewStats.avgRating || 0}</span>
                            <span className="text-slate-400 decoration-slate-300 underline underline-offset-2">
                                ({reviewStats.count} {t('reviews_count')})
                            </span>
                        </>
                    ) : (
                        <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-wider">
                            {t('new_service')}
                        </span>
                    )}
                </div>

                {/* Price & Duration Row */}
                <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-black text-slate-900 text-base">₹{service.priceAmount}</span>
                    {service.originalPrice && (
                        <span className="text-slate-400 text-sm line-through decoration-slate-400">₹{service.originalPrice}</span>
                    )}
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-slate-500 text-xs font-medium">
                        {(service.estimatedTime || "").replace(/mins?|mint/gi, t('mins')).replace(/hours?|hrs?/gi, t('hours'))}
                    </span>
                </div>

                {/* Per Unit Tag */}
                {service.perUnitCost && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-4">
                        <Tag size={12} className="fill-emerald-50" />
                        {(service.perUnitCost || "").replace(/per\s*Service/gi, t('per_service'))}
                    </div>
                )}

                {/* Bullet Points */}
                <div className="mb-3 border-t border-dashed border-gray-100 pt-3">
                    <ul className="space-y-1.5">
                        {inclusionItems}
                    </ul>
                </div>

                {/* Coin Reward Message */}
                <div className="mb-3 flex items-center gap-1.5 bg-amber-50 w-fit px-2 py-1 rounded text-[10px] font-bold text-amber-800 border border-amber-100">
                    <Coins size={12} className="text-amber-500" /> {t('earn')} {calculateGSCoin(service.priceAmount)} {t('gs_coins')}
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#0c8182] text-sm font-bold hover:text-[#0a6d6d] transition-colors"
                >
                    {t('view_details')}
                </button>
            </div>

            {/* Right Image & Action */}
            <div className="w-24 md:w-32 flex flex-col items-center relative">
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="w-full h-24 md:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative cursor-pointer"
                >
                    <img
                        src={getImageUrl(service.packageImage)}
                        alt={service.packageName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>

                {/* Add Button - Floating Style overlap */}
                <div className="relative -mt-4 z-10 w-24 shadow-md bg-white rounded-lg">
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between border border-teal-100 rounded-lg p-0.5 bg-[#effafa]">
                            <button
                                onClick={() => dispatch(removeItemFromCart(service._id))}
                                className="text-[#0c8182] w-7 h-7 flex items-center justify-center hover:bg-white rounded shadow-sm transition-all"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-[#0c8182] font-bold text-sm">{quantity}</span>
                            <button
                                onClick={() => quantity < 1 && dispatch(addItemToCart(service))}
                                disabled={quantity >= 1}
                                className={`text-[#0c8182] w-7 h-7 flex items-center justify-center rounded transition-all ${quantity >= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white shadow-sm'}`}
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => dispatch(addItemToCart(service))}
                            className="w-full bg-white text-[#0c8182] font-bold text-sm py-2 rounded-lg border border-teal-100 hover:bg-[#effafa] transition active:scale-95"
                        >
                            {t('add')}
                        </button>
                    )}
                </div>

                {/* Options Text */}
                {service.optionsCount > 0 && (
                    <span className="text-[10px] text-gray-400 mt-2 font-medium">
                        {t('customizable')}
                    </span>
                )}
            </div>

            {/* Detail Modal */}
            <ServiceDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={service}
            />

            {/* Reviews Modal */}
            <ReviewsModal
                isOpen={isReviewsModalOpen}
                onClose={() => setIsReviewsModalOpen(false)}
                category={pageCategory || normalizeCategory(service.serviceCategory || service.category)}
            />
        </div>
    );
}

export default ServiceCard;
