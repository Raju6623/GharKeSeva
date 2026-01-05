import React, { useState, useRef } from 'react';
import { Star, CheckCircle2, Quote, User, ThumbsUp, Sparkles, Send, Camera, X } from 'lucide-react';

const CustomerReviews = () => {
  // --- 1. STATES (Outside Return) ---
  const [newReview, setNewReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // To store the image preview
  
  // Reference for the hidden file input
  const fileInputRef = useRef(null);

  // --- 2. DATA CONFIGURATION (Outside Return) ---
  const reviewData = [
    { id: 1, name: "Ananya Iyer", location: "Banjara Hills", rating: 5, date: "2 days ago", service: "AC Deep Cleaning", comment: "The technician was very professional. He used a proper jet pump and covered my furniture before starting.", verified: true },
    { id: 2, name: "Vikram Malhotra", location: "Gachibowli", rating: 5, date: "1 week ago", service: "Full Home Painting", comment: "Exceptional finish. They managed to complete the living room in just 2 days. Looks amazing.", verified: true },
    { id: 3, name: "Sandeep Rao", location: "Kondapur", rating: 4, date: "3 days ago", service: "Kitchen Plumbing", comment: "Fixed a major leakage in the sink. Quick response time. Price was fair.", verified: true }
  ];

  // --- 3. LOGIC FUNCTIONS (Outside Return) ---

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Review:", { 
        text: newReview, 
        rating: selectedRating,
        image: selectedImage 
    });
    setNewReview("");
    setSelectedRating(0);
    setSelectedImage(null);
    alert("Thank you! Your review with photo has been sent for verification.");
  };

  // Function to trigger the camera/file picker
  const handleCameraButtonClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle the file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set base64 string for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <Star 
          key={i} 
          size={isInteractive ? 24 : 14} 
          className={`transition-all duration-200 ${
            starValue <= (hoverRating || selectedRating || rating) 
            ? "fill-orange-500 text-orange-500 scale-110" 
            : "text-slate-200"
          } ${isInteractive ? "cursor-pointer hover:scale-125" : ""}`}
          onMouseEnter={() => isInteractive && setHoverRating(starValue)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          onClick={() => isInteractive && setSelectedRating(starValue)}
        />
      );
    });
  };

  const renderReviewInputBox = () => (
    <div className="bg-white p-8 rounded-[3rem] border-2 border-blue-50 shadow-2xl shadow-blue-100/50 mb-20 animate-in fade-in zoom-in duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
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
            {renderStars(0, true)}
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
            className={`w-full bg-white border-2 border-slate-100 rounded-[2rem] p-6 pr-14 text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all min-h-[120px] resize-none shadow-inner ${selectedImage ? 'pt-28' : ''}`}
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
                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-colors"
              >
                <Camera size={20} />
             </button>
             <button 
                type="submit" 
                disabled={!newReview || selectedRating === 0}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-xl active:scale-90 disabled:opacity-20 disabled:grayscale"
              >
                <Send size={20} />
             </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderReviewCards = () => {
    return reviewData.map((rev) => (
      <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors"><User size={20} /></div>
            <div>
              <h4 className="font-black text-slate-900 tracking-tighter uppercase text-sm">{rev.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rev.location}</p>
            </div>
          </div>
          <div className="bg-slate-50 px-3 py-1 rounded-xl flex gap-0.5 items-center">{renderStars(rev.rating)}</div>
        </div>
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 text-blue-50/50 -z-0" size={40} />
          <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10 italic font-medium">"{rev.comment}"</p>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">{rev.service}</span>
          {rev.verified && <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-black uppercase tracking-tighter"><CheckCircle2 size={12} /> Verified</div>}
        </div>
      </div>
    ));
  };

  // --- 4. MAIN RENDER ---
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-4 font-black uppercase tracking-[0.3em] text-[10px]">
              <Sparkles size={16} /> User Experiences
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Trusted by <span className="text-blue-600">20,000+</span> <br/>Happy Households.
            </h2>
          </div>
          
          <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="text-center">
                <p className="text-3xl font-black text-slate-900">4.8</p>
                <div className="flex gap-0.5 mt-1">{renderStars(5)}</div>
             </div>
             <div className="h-10 w-px bg-slate-100"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Average <br/> Service Rating</p>
          </div>
        </div>

        {/* INPUT BOX */}
        <div className="max-w-3xl mx-auto">
          {renderReviewInputBox()}
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderReviewCards()}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;