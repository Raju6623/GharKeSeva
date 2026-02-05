import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorCoupons } from '../redux/thunks/marketingThunks';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import useTranslation from '../hooks/useTranslation';

function VendorOffers() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { vendorCoupons, loading } = useSelector((state) => state.marketing);

    useEffect(() => {
        dispatch(fetchVendorCoupons());
    }, [dispatch]);

    if (!vendorCoupons || vendorCoupons.length === 0) return null; // Don't show if empty

    const offerCards = vendorCoupons.map((coupon) => (
        <div key={coupon._id} className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image Background Effect */}
            <div className="h-40 bg-gradient-to-br from-[#0c8182] to-[#1a1c21] relative overflow-hidden">
                {coupon.offerImage ? (
                    <img
                        src={coupon.offerImage}
                        alt={coupon.code}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Tag size={80} className="text-white" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg">{coupon.code}</p>
                    <p className="text-xs opacity-90 flex items-center gap-1">
                        <Clock size={12} /> {t('ends')} {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#effafa] text-[#0c8182] px-2 py-1 rounded text-xs font-bold uppercase">
                        {t('save_amount')} ₹{coupon.discountValue}
                    </span>
                </div>
                <p className="text-slate-600 font-medium text-sm line-clamp-2 mb-4">
                    {coupon.description}
                </p>

                <button
                    onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        alert(t('coupon_copied') + " " + coupon.code);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-[#0c8182] hover:text-white transition flex items-center justify-center gap-2 group-hover:bg-[#0c8182] group-hover:text-white"
                >
                    {t('copy_code')} <ArrowRight size={16} />
                </button>
            </div>
        </div>
    ));

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-[#0c8182] font-bold uppercase tracking-wider text-sm">{t('limited_time_deals')}</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
                            {t('exclusive')} <span className="text-[#0c8182]">{t('partner_offers')}</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offerCards}
                </div>
            </div>
        </section>
    );
}

export default VendorOffers;
