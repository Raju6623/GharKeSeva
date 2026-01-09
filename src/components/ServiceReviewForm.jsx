import React, { useState, useEffect } from 'react';
import { Star, User, Send, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceReviewForm = ({ serviceId = "general" }) => {
    const STORAGE_KEY = `reviews_${serviceId}`;

    // Initial Mock Reviews
    const INITIAL_REVIEWS = [
        { id: 1, name: "Rahul Sharma", rating: 5, date: "2 days ago", text: "Excellent service! The professional was very polite and did a great job with my AC cleaning.", likes: 12 },
        { id: 2, name: "Priya Singh", rating: 4, date: "1 week ago", text: "Good experience overall. arrived on time but took a bit longer than expected.", likes: 4 },
        { id: 3, name: "Amit Verma", rating: 5, date: "3 weeks ago", text: "Highly recommended for AC installation. Very professional team.", likes: 8 }
    ];

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ name: '', rating: 1, text: '' });
    const [hoverRating, setHoverRating] = useState(0);


    // Load from LocalStorage
    useEffect(() => {
        const savedReviews = localStorage.getItem(STORAGE_KEY);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        } else {
            setReviews(INITIAL_REVIEWS);
        }
    }, [serviceId]);

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
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!newReview.name || !newReview.text) {
            toast.error("Please fill in all fields");
            return;
        }

        const review = {
            id: Date.now(),
            name: newReview.name,
            rating: newReview.rating,
            text: newReview.text,
            date: "Just now",
            likes: 0
        };

        const updatedReviews = [review, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));

        setNewReview({ name: '', rating: 1, text: '' });
        toast.success("Review submitted successfully!");
    };

    return (
        <div className="bg-white py-8 border-t border-gray-100 mt-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Customer Reviews</h2>
                    <p className="text-gray-500 text-sm">Share your experience with us!</p>
                </div>

                {/* Review Form */}
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`transition hover:scale-110 ${star <= (hoverRating || newReview.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    <Star size={24} fill="currentColor" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={newReview.name}
                            onChange={handleInputChange}
                            className="w-full bg-white p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#6e42e5]"
                        />
                    </div>

                    <div className="mb-4">
                        <textarea
                            name="text"
                            placeholder="Share your experience..."
                            value={newReview.text}
                            onChange={handleInputChange}
                            className="w-full h-24 bg-white p-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#6e42e5] resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-[#6e42e5] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-[#5b36bf] flex items-center gap-2"
                    >
                        <Send size={16} /> Submit Review
                    </button>
                </form>


                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                    <User size={20} className="text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900">{review.name}</h3>
                                        <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-200" : ""} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 ml-1">{review.rating}.0</span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                                        {review.text}
                                    </p>
                                    <button className="text-gray-400 text-xs font-bold flex items-center gap-1 hover:text-slate-600">
                                        <ThumbsUp size={14} /> Helpful ({review.likes})
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceReviewForm;
