import React, { useState, useRef, useEffect } from 'react';
import { Star, CheckCircle2, Quote, User, ThumbsUp, Sparkles, Send, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEW_DATA = [
  { id: 1, name: "Ananya Iyer", location: "Banjara Hills", rating: 5, date: "2 days ago", service: "AC Deep Cleaning", comment: "The technician was very professional. He used a proper jet pump and covered my furniture before starting.", verified: true },
  { id: 2, name: "Vikram Malhotra", location: "Gachibowli", rating: 5, date: "1 week ago", service: "Full Home Painting", comment: "Exceptional finish. They managed to complete the living room in just 2 days. Looks amazing.", verified: true },
  { id: 3, name: "Sandeep Rao", location: "Kondapur", rating: 4, date: "3 days ago", service: "Kitchen Plumbing", comment: "Fixed a major leakage in the sink. Quick response time. Price was fair.", verified: true }
];

function HomeReviewsCarousel() {
  // --- 1. STATES ---
  const [newReview, setNewReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // To store the image preview
  const [isHovering, setIsHovering] = useState(false); // For pausing auto-slide

  // --- 2. DATA CONFIGURATION ---
  const [allReviews, setAllReviews] = useState([...REVIEW_DATA]);

  // Reference for the hidden file input
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  // --- 3. HELPER FUNCTIONS ---

  const scrollLink = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 400; // approx card width
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Load reviews from localStorage
  useEffect(() => {
    const fetched = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('reviews_')) {
        try {
          const val = localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              const formatted = parsed.map((r, idx) => ({
                id: `local-${key}-${idx}`,
                name: r.name || "Customer",
                location: "Verified User",
                rating: r.rating || 5,
                date: r.date || "Recent",
                service: key.replace('reviews_', '').replace(/-/g, ' ').toUpperCase(),
                comment: r.text || r.comment,
                verified: true
              }));
              fetched.push(...formatted);
            }
          }
        } catch (e) {
          console.error("Error parsing reviews", e);
        }
      }
    });
    if (fetched.length > 0) {
      setAllReviews(prev => [...prev, ...fetched]);
    }
  }, []);


  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setNewReview("");
    setSelectedRating(0);
    setSelectedImage(null);
    alert("Thank you! Your review with photo has been sent for verification.");
  };

  const handleCameraButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto-Slide Logic
  useEffect(() => {
    let interval;
    if (!isHovering) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // If near end (tolerance of 50px), reset to 0, else scroll right
          if (scrollLeft + clientWidth >= scrollWidth - 50) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollLink('right');
          }
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isHovering]);


  // --- 4. RENDER HELPERS ---

  const getStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <Star
          key={i}
          size={isInteractive ? 24 : 14}
          className={`transition-all duration-200 ${starValue <= (hoverRating || selectedRating || rating)
            ? "fill-[#0c8182] text-[#0c8182] scale-110"
            : "text-slate-200"
            } ${isInteractive ? "cursor-pointer hover:scale-125" : ""}`}
          onMouseEnter={() => isInteractive && setHoverRating(starValue)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          onClick={() => isInteractive && setSelectedRating(starValue)}
        />
      );
    });
  };

  const reviewInputContent = (
    <div className="bg-white p-8 rounded-[3rem] border-2 border-[#effafa] shadow-2xl shadow-teal-100/50 mb-20 animate-in fade-in zoom-in duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#0c8182] rounded-2xl text-white shadow-lg shadow-teal-200">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Share Your Experience</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Help others choose the best service</p>
        </div>
      </div>

      <form onSubmit={handleReviewSubmit} className="space-y-6">
        <div className="flex flex-col items-center py-4 bg-slate-50 rounded-[2rem] border border-slate-100">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3">Rate our professional</p>
          <div className="flex gap-2">
            {getStars(0, true)}
          </div>
        </div>

        <div className="relative group">
          {/* Image Preview Overlay inside text box */}
          {selectedImage && (
            <div className="absolute left-6 top-6 z-10 animate-in zoom-in duration-300">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:scale-110 transition-transform"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder={selectedImage ? "" : "Tell us about the service quality..."}
            className={`w-full bg-white border-2 border-slate-100 rounded-[2rem] p-6 pr-14 text-sm font-bold text-slate-700 outline-none focus:border-[#0c8182] focus:ring-4 focus:ring-[#0c8182]/5 transition-all min-h-[120px] resize-none shadow-inner ${selectedImage ? 'pt-28' : ''}`}
          />

          {/* Hidden Input for Camera/Gallery */}
          <input
            type="file"
            accept="image/*"
            capture="environment" // This triggers the camera directly on mobile
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="absolute right-6 bottom-6 flex gap-3">
            <button
              type="button"
              onClick={handleCameraButtonClick}
              className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-[#0c8182] transition-colors"
            >
              <Camera size={20} />
            </button>
            <button
              type="submit"
              disabled={!newReview || selectedRating === 0}
              className="p-3 bg-slate-900 text-white rounded-xl hover:bg-[#0c8182] transition-all shadow-xl active:scale-90 disabled:opacity-20 disabled:grayscale"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const reviewCards = allReviews.map((rev) => (
    <div key={rev.id} className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group snap-center">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0c8182] group-hover:text-white transition-colors"><User size={20} /></div>
          <div>
            <h4 className="font-black text-slate-900 tracking-tighter uppercase text-sm">{rev.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rev.location}</p>
          </div>
        </div>
        <div className="bg-slate-50 px-3 py-1 rounded-xl flex gap-0.5 items-center">{getStars(rev.rating)}</div>
      </div>
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 text-teal-50/50 -z-0" size={40} />
        <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10 italic font-medium">"{rev.comment}"</p>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <span className="bg-[#effafa] text-[#0c8182] text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{rev.service}</span>
        {rev.verified && <div className="flex items-center gap-1 text-[#0c8182] text-[9px] font-black uppercase tracking-tighter"><CheckCircle2 size={12} /> Verified</div>}
      </div>
    </div>
  ));

  const averageStars = getStars(5);

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#0c8182] mb-4 font-black uppercase tracking-[0.3em] text-[10px]">
              <Sparkles size={16} /> User Experiences
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Trusted by <span className="text-[#0c8182]">20,000+</span> <br />Happy Households.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button onClick={() => scrollLink('left')} className="p-4 bg-white rounded-full border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition shadow-sm"><ChevronLeft size={20} /></button>
              <button onClick={() => scrollLink('right')} className="p-4 bg-white rounded-full border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition shadow-sm"><ChevronRight size={20} /></button>
            </div>

            <div className="hidden md:flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">4.8</p>
                <div className="flex gap-0.5 mt-1">{averageStars}</div>
              </div>
              <div className="h-10 w-px bg-slate-100"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Average <br /> Service Rating</p>
            </div>
          </div>
        </div>

        {/* REVIEWS SLIDER */}
        <div className="relative mb-20">
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto hide-scrollbar pb-12 snap-x snap-mandatory px-4 -mx-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {reviewCards}
          </div>
          {/* Fade Gradients for visual cue */}
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent pointer-events-none hidden md:block"></div>
        </div>

        {/* INPUT BOX */}
        <div className="max-w-3xl mx-auto">
          {reviewInputContent}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#0c8182] transition-all shadow-xl active:scale-95">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomeReviewsCarousel;