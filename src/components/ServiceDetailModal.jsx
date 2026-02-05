import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Check, Info } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';
import useTranslation from '../hooks/useTranslation';

function ServiceDetailModal({ isOpen, onClose, service }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            return;
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !service) return null;

    // Check cart status
    const cartItem = cart.find(item => item._id === service._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    // Use Real Variants or Fallback
    const variants = (service.variants && service.variants.length > 0)
        ? service.variants
        : [{
            id: 'default',
            name: 'Standard Service',
            price: service.priceAmount,
            description: service.description || 'Standard reliable service',
            isRecommended: true
        }];

    // Dynamic Content
    const content = {
        trustTitle: service.trustContent?.title || t('trusted_by_millions'),
        trustPoints: service.trustContent?.points?.filter(p => p) || [t('verified_professionals') || "Verified Professionals"],
        trustImage: service.trustContent?.image || "https://img.freepik.com/free-photo/repairman-doing-air-conditioner-service_1303-26534.jpg",

        tipsTitle: service.aftercareTips?.title || t('service_tips'),
        tips: service.aftercareTips?.points?.filter(p => p) || [t('follow_instructions') || "Follow professional advice"],
        tipsImage: service.aftercareTips?.image || null,
        tipsBg: "bg-[#effafa]",
        tipsBorder: "border-teal-100"
    };

    const variantElements = variants.map((variant, idx) => {
        // Create unique ID for variant
        const variantCompositeId = `${service._id}_${variant.name.replace(/\s+/g, '_')}`;
        const variantItem = cart.find(item => item._id === variantCompositeId);
        const variantQty = variantItem ? variantItem.quantity : 0;
        const isAdded = variantQty > 0;

        return (
            <div key={idx} className={`border rounded-2xl p-5 transition-all cursor-pointer group relative overflow-hidden bg-white ${isAdded ? 'border-teal-100 bg-[#effafa]/10' : 'border-gray-200 hover:border-[#0c8182] hover:shadow-lg hover:shadow-teal-50'}`}>
                {variant.isRecommended && (
                    <div className="absolute top-0 right-0 bg-[#0c8182] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                        {t('recommended')}
                    </div>
                )}

                <h4 className="font-bold text-slate-900 text-lg mb-1">{variant.name}</h4>
                <div className="text-sm text-slate-500 mb-4 h-10 leading-snug">
                    {variant.description}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="font-black text-slate-900 text-lg">₹{variant.price}</div>

                    {isAdded ? (
                        <button
                            onClick={() => dispatch(removeItemFromCart(variantCompositeId))}
                            className="px-6 py-2 bg-[#effafa] text-[#0c8182] font-bold text-sm rounded-xl cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                            {t('added')}
                        </button>
                    ) : (
                        <button
                            onClick={() => dispatch(addItemToCart({
                                ...service,
                                priceAmount: variant.price,
                                packageName: `${service.packageName} - ${variant.name}`,
                                description: variant.description,
                                _id: variantCompositeId, // Unique Variant ID
                                id: variantCompositeId
                            }))}
                            className="px-6 py-2 bg-white text-[#0c8182] border border-gray-200 font-bold text-sm rounded-xl shadow-sm hover:bg-[#0c8182] hover:text-white hover:border-[#0c8182] transition-all"
                        >
                            {t('add')}
                        </button>
                    )}
                </div>
            </div>
        );
    });

    const trustPointsElements = content.trustPoints.map((point, idx) => (
        <li key={idx} className="flex gap-2 text-xs font-medium text-slate-300">
            <Check size={14} className="text-white" /> {point}
        </li>
    ));

    const tipsElements = content.tips.map((tip, idx) => (
        <li key={idx} className="flex gap-3 text-sm text-slate-700 items-start">
            <Check size={18} className="text-slate-900 shrink-0 mt-0.5" />
            <span>{tip}</span>
        </li>
    ));

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto no-scrollbar">
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-800 hover:bg-white shadow-sm transition-all"
                >
                    <X size={20} />
                </button>

                {/* 1. Hero Image / Banner */}
                <div className="relative h-64 sm:h-72 w-full bg-slate-100">
                    <img
                        src={service.packageImage || "https://placehold.co/600x400/e2e8f0/1e293b?text=Service+Image"}
                        alt={service.packageName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                            <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                                {t('bestseller')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Content Body */}
                <div className="p-6 md:p-8">

                    {/* Header Info */}
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-2">
                            {service.packageName}
                        </h2>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            {(Number(service.rating) > 0 || Number(service.reviewCount) > 0) ? (
                                <>
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-slate-900 font-bold">{service.rating}</span>
                                    </div>
                                    <span>•</span>
                                    <span className="underline decoration-slate-300 underline-offset-4">{service.reviewCount} {t('reviews_count')}</span>
                                </>
                            ) : (
                                <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-teal-100">
                                    New Service
                                </span>
                            )}

                            <span>•</span>
                            <span>{service.estimatedTime || "45 mins"}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100 mb-8" />

                    {/* 3. Variant Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('select_package')}</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {variantElements}
                        </div>
                    </div>

                    {/* 4. Trust Marker (Category-Specific) */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8 flex items-center justify-between relative overflow-hidden">
                        <div className="relative z-10 max-w-[60%]">
                            <h3 className="text-xl font-bold mb-2">{content.trustTitle}</h3>
                            <ul className="space-y-2">
                                {trustPointsElements}
                            </ul>
                        </div>
                        <div className="absolute right-0 bottom-0 top-0 w-32 bg-gradient-to-l from-slate-800 to-transparent"></div>
                        <img
                            src={content.trustImage}
                            alt="Professional"
                            className="absolute right-0 bottom-0 h-full w-40 object-cover object-top opacity-80"
                        />
                    </div>

                    {/* 5. Aftercare Tips (Category-Specific) */}
                    <div className={`${content.tipsBg} rounded-2xl p-6 border ${content.tipsBorder} relative overflow-hidden flex items-center justify-between`}>
                        <div className="relative z-10 max-w-[60%]">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">{content.tipsTitle}</h3>
                            <ul className="space-y-4">
                                {tipsElements}
                            </ul>
                        </div>
                        {content.tipsImage && (
                            <>
                                <div className="absolute right-0 bottom-0 top-0 w-32 bg-gradient-to-l from-[#effafa] to-transparent pointer-events-none"></div>
                                <img
                                    src={content.tipsImage}
                                    alt="Aftercare"
                                    className="absolute right-0 bottom-0 h-full w-40 object-cover object-top opacity-80"
                                />
                            </>
                        )}
                    </div>

                </div>

            </div>
        </div>,
        document.body
    );
}

export default ServiceDetailModal;
