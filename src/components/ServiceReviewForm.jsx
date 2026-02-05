import React, { useState, useEffect } from 'react';
import { Star, User, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';
import useTranslation from '../hooks/useTranslation';

function ServiceReviewForm({ category = "Plumbing" }) {
    const { t } = useTranslation();
    const STORAGE_KEY = `reviews_${category}`; // Changed serviceId to category as serviceId prop is removed

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ name: '', rating: 1, text: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch Reviews from Backend (Category-based)
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviews/category/${category}`);
                if (Array.isArray(res.data)) {
                    setReviews(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [category]);

    // Handle Input Change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewReview(previousReview => ({ ...previousReview, [name]: value }));
    };

    // Handle Star Click
    const handleRating = (rating) => {
        setNewReview(previousReview => ({ ...previousReview, rating }));
    };

    // Submit Review
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!newReview.name || !newReview.text) {
            toast.error(t('fill_all_fields'));
            return;
        }

        try {
            const payload = {
                // serviceId, // serviceId is no longer a prop, so it's removed from payload
                category, // Add category field
                userName: newReview.name,
                rating: newReview.rating,
                text: newReview.text,
                userId: null
            };

            const res = await axios.post(`${API_URL}/reviews/add`, payload);

            if (res.data.success) {
                setReviews([res.data.data, ...reviews]);
                setNewReview({ name: '', rating: 1, text: '' });
                toast.success(t('review_submitted'));
            }
        } catch (error) {
            toast.error(t('review_failed'));
            console.error(error);
        }
    };

    const starRatingElements = [1, 2, 3, 4, 5].map(star => (
        <button
            key={star}
            type="button"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`transition-all duration-200 hover:scale-125 p-1 ${star <= (hoverRating || newReview.rating) ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
        >
            <Star size={36} fill="currentColor" />
        </button>
    ));

    const reviewModal = isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#effafa] rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">{t('rate_experience')}</h3>
                        <p className="text-xs text-slate-500">{t('how_was_service')}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                        <span className="text-slate-900 font-bold text-lg leading-none block h-4 w-4 flex items-center justify-center">×</span>
                    </button>
                </div>

                <form onSubmit={(e) => { handleSubmit(e); setIsModalOpen(false); }}>
                    <div className="mb-6 bg-gray-50 p-4 rounded-2xl flex justify-center">
                        <div className="flex gap-2">
                            {starRatingElements}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder={t('your_name')}
                                value={newReview.name}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-200 p-4 pl-12 rounded-xl text-sm font-bold outline-none focus:border-[#0c8182] focus:ring-4 focus:ring-[#0c8182]/10 transition"
                            />
                        </div>
                        <textarea
                            name="text"
                            placeholder={t('tell_experience')}
                            value={newReview.text}
                            onChange={handleInputChange}
                            className="w-full h-32 bg-white border border-gray-200 p-4 rounded-xl text-sm font-medium outline-none resize-none focus:border-[#0c8182] focus:ring-4 focus:ring-[#0c8182]/10 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base shadow-xl hover:bg-slate-800 mt-6 transition active:scale-95"
                    >
                        {t('submit_review')}
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-b from-white to-[#effafa] py-12 border-t border-gray-100 mt-8 mb-8 overflow-hidden relative">

            <style dangerouslySetInnerHTML={{
                __html: `
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-marquee {
    animation: marquee 40s linear infinite;
}
.group:hover .animate-marquee {
    animation-play-state: paused;
}
`}} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('what_people_say')}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex bg-yellow-400 text-white px-2 py-0.5 rounded-lg text-xs font-bold shadow-sm">
                            4.8 <Star size={10} fill="currentColor" className="ml-1" />
                        </div>
                        <p className="text-gray-500 text-sm">{t('based_on_bookings')}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition flex items-center gap-2 ring-4 ring-slate-100"
                >
                    <Send size={16} /> {t('write_review')}
                </button>
            </div>

            <div className="pb-8"></div>

            {reviewModal}

        </div>
    );
}

export default ServiceReviewForm;
