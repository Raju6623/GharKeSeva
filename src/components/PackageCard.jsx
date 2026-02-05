import React, { useState, useEffect } from 'react';
import { Star, Plus, Minus, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';
import { BASE_URL, getImageUrl, API_URL } from '../config';
import ServiceDetailModal from './ServiceDetailModal';
import ReviewsModal from './ReviewsModal';
import axios from 'axios';
import useTranslation from '../hooks/useTranslation';


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

function PackageCard({ service, pageCategory }) {
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
                const res = await axios.get(`${API_URL}/api/auth/reviews/stats/${category}`);
                if (res.data) {
                    setReviewStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch review stats", error);
            }
        };
        fetchReviewStats();
    }, [service]);

    // Check if item is in cart
    const cartItem = cart.find(item => (item._id || item.id) === service._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const originalPrice = service.discount > 0
        ? Math.round(service.priceAmount * (100 / (100 - service.discount)))
        : Math.round(service.priceAmount * 1.33); // Fallback mock calculation

    const inclusionItems = service.includedServices && service.includedServices.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2 text-xs md:text-sm">
            <span className="font-bold text-slate-900 whitespace-nowrap">{item.name}:</span>
            <span className="text-gray-500 leading-snug">{item.detail}</span>
        </div>
    ));

    return (
        <div className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 p-4 md:p-6 mb-4 md:mb-8 relative overflow-hidden">
            {/* Top Left Badge - Removed to hide technical tags */}

            <div className="flex-1 mt-8 md:mt-6">
                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1 break-words line-clamp-2">
                    {service.packageName}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs md:text-sm mb-2 md:mb-3">
                    <div className="bg-[#0c8182] text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                        <Star size={8} fill="white" />
                    </div>
                    <span className="font-medium text-slate-900">{reviewStats.avgRating || 0}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsReviewsModalOpen(true);
                        }}
                        className="text-gray-400 text-[10px] md:text-xs decoration-gray-300 underline underline-offset-2 hover:text-[#0c8182] transition-colors cursor-pointer"
                    >
                        ({reviewStats.count} {t('reviews_count')})
                    </button>
                </div>

                {/* Price & Time */}
                <div className="flex items-center gap-2 mb-4 md:mb-6 text-sm">
                    <span className="font-bold text-slate-900">₹{service.priceAmount}</span>
                    <span className="text-gray-400 line-through decoration-gray-400 decoration-1 text-xs">₹{originalPrice}</span>
                    <span className="text-gray-400 text-xs mx-1">•</span>
                    <span className="text-gray-500 text-xs">{service.estimatedTime || '3 hrs 50 mins'}</span>
                </div>

                {/* Package Details Bullet Points */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {inclusionItems || (
                        <p className="text-gray-400 text-xs">{t('includes_premium')}</p>
                    )}
                </div>

                {/* View Details Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#0c8182] text-sm font-bold hover:text-[#0a6d6d] transition-colors"
                >
                    {t('view_details')}
                </button>
            </div>

            {/* Right Side - Offer & Add */}
            <div className="md:w-32 flex flex-col items-center justify-center pl-0 md:pl-4 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-4 md:pt-0">
                <div className="flex flex-col items-center bg-gray-100/50 rounded-xl p-4 w-full h-full justify-center relative">

                    {/* Package Image */}
                    <div className="w-24 h-24 mb-3 rounded-lg overflow-hidden bg-white shadow-sm">
                        <img
                            src={getImageUrl(service.packageImage)}
                            alt={service.packageName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>

                    {/* Discount Text */}
                    {service.discount > 0 ? (
                        <div className="text-center mb-4">
                            <div className="text-2xl font-black text-[#0c8182] leading-none">{service.discount}%</div>
                            <div className="text-xl font-black text-[#0c8182] leading-none">{t('off')}</div>
                        </div>
                    ) : null}

                    {/* Add Button */}
                    <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-0.5 w-full max-w-[80px]">
                        {quantity > 0 ? (
                            <div className="flex items-center justify-between gap-1">
                                <button onClick={() => dispatch(removeItemFromCart(service._id))} className="p-1 text-[#0c8182] hover:bg-[#effafa] rounded">
                                    <Minus size={14} />
                                </button>
                                <span className="text-[#0c8182] font-bold text-sm">{quantity}</span>
                                <button onClick={() => quantity < 1 && dispatch(addItemToCart(service))} disabled={quantity >= 1} className={`p-1 text-[#0c8182] rounded ${quantity >= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#effafa]'}`}>
                                    <Plus size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => dispatch(addItemToCart(service))}
                                className="w-full py-1.5 text-center text-[#0c8182] font-bold text-sm hover:bg-[#effafa] rounded"
                            >
                                {t('add')}
                            </button>
                        )}
                    </div>
                </div>
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

export default PackageCard;
