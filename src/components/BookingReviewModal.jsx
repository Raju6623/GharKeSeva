import React, { useState } from 'react';
import { Star, X, Camera } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const BookingReviewModal = ({ isOpen, onClose, booking }) => {
    const [rating, setRating] = useState(1);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return toast.error("Please add a review comments");

        setIsSubmitting(true);
        try {
            const payload = {
                review: text,
                rating,
                bookingId: booking._id || booking.customBookingId,
                vendorId: booking.vendorId || booking.assignedVendorId,
                serviceId: booking.serviceId || booking.items?.[0]?.serviceId
            };

            await axios.post(`${API_URL}/reviews/add`, payload);
            toast.success("Review submitted successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const starRatingElements = [1, 2, 3, 4, 5].map(star => (
        <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`transition-all duration-200 hover:scale-125 p-1 ${star <= (hoverRating || rating) ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-300'}`}
        >
            <Star
                size={32}
                fill={star <= (hoverRating || rating) ? "currentColor" : "none"}
                strokeWidth={star <= (hoverRating || rating) ? 0 : 1.5}
            />
        </button>
    ));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Rate Service</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                            {booking.packageName}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6 bg-gray-50 p-4 rounded-2xl flex justify-center">
                        <div className="flex gap-2">
                            {starRatingElements}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            placeholder="How was the service partner?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-32 bg-white border border-gray-200 p-4 rounded-xl text-sm font-medium outline-none resize-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-50 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base shadow-xl hover:bg-slate-800 mt-6 transition active:scale-95 disabled:opacity-70"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingReviewModal;
