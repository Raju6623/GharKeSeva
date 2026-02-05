import React, { useState } from 'react';
import { X, Star, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

function ReviewModal({ booking, onClose, onSubmitSuccess }) {
    const [rating, setRating] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewPayload = {
                review: reviewText,
                rating,
                serviceId: booking.serviceId || 'general',
                vendorId: booking.vendorId || booking.assignedVendorId || 'unassigned',
                userName: booking.customerName || 'Anonymous',
                userId: booking.customerId,
                bookingId: booking._id
            };

            const res = await axios.post(`${API_URL}/reviews/add`, reviewPayload);

            if (res.data.success || res.status === 201) {
                toast.success("Review submitted successfully! Thank you.");
                if (onSubmitSuccess) onSubmitSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Review Submit Error:", error);
            toast.error("Failed to submit review. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Rate Service</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{booking?.packageName || 'Service'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                        <X size={20} className="text-slate-900" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6 bg-gray-50 p-4 rounded-2xl flex justify-center">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`transition-all duration-200 hover:scale-125 p-1 ${star <= (hoverRating || rating) ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                                >
                                    <Star size={32} fill="currentColor" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            placeholder="Tell us about your experience..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full h-32 bg-white border border-gray-200 p-4 rounded-xl text-sm font-medium outline-none resize-none focus:border-[#0c8182] focus:ring-4 focus:ring-[#0c8182]/10 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base shadow-xl hover:bg-slate-800 mt-6 transition active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><Send size={18} /> Submit Review</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReviewModal;
