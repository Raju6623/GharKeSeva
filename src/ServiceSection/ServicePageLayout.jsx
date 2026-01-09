import React, { useState, useEffect } from 'react';
import { fetchServices } from '../redux/thunks/serviceThunks';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, ShoppingCart, LayoutGrid, ChevronRight, Tag
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import ServiceCard from '../components/ServiceCard';
import ServiceReviewForm from '../components/ServiceReviewForm';

const ServicePageLayout = ({
    title,
    breadcrumb,
    initialServiceType,
    categories,
    reviewServiceId
}) => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const cartTotal = useSelector((state) => state.cart.totalAmount);
    const cartCount = cart.length;
    const navigate = useNavigate();

    // Manage service type state here
    const [selectedServiceType, setSelectedServiceType] = useState(initialServiceType);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.label || 'All Services');

    // --- REDUX STATE ---
    const { availableServices: services, loading } = useSelector((state) => state.services);

    useEffect(() => {
        dispatch(fetchServices(selectedServiceType));
    }, [selectedServiceType, dispatch]);

    // FILTER LOGIC
    const filteredServices = (selectedCategory === 'All Services' || !selectedCategory)
        ? services
        : services.filter(service =>
            service.packageName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            service.serviceName?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

    const scrollToSection = (catLabel) => {
        setSelectedCategory(catLabel);
        // In a real app, this might scroll to a specific section ID
    };

    return (
        <div className="min-h-screen bg-white pb-32 font-sans">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
                    <span>Home</span> <ChevronRight size={14} />
                    <span>{breadcrumb}</span>
                </div>
            </div>

            {/* Category Selection (Top Section) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Select a service</h2>
                <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => scrollToSection(cat.label)}
                            className="flex flex-col items-center group min-w-[80px]"
                        >
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden mb-2 transition-all duration-300 ${selectedCategory === cat.label ? 'ring-2 ring-blue-600 ring-offset-2 shadow-md bg-blue-50' : 'ring-1 ring-gray-100 group-hover:ring-blue-200 bg-gray-50'}`}>
                                {cat.id === 'all' ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <LayoutGrid size={24} className={selectedCategory === cat.label ? "text-blue-600" : "text-gray-400"} />
                                    </div>
                                ) : (
                                    <img src={cat.icon} alt={cat.label} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <span className={`text-xs text-center transition-colors max-w-[80px] leading-tight ${selectedCategory === cat.label ? 'font-bold text-blue-600' : 'font-medium text-slate-500 group-hover:text-blue-500'}`}>
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

                {/* CENTER: Service Listings */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCategory === 'All Services' ? title : selectedCategory}</h1>
                        <span className="text-sm font-bold text-gray-500">{filteredServices.length} packages</span>
                    </div>

                    {/* List of Cards */}
                    <div className="space-y-8">
                        {loading ? (
                            <div className="flex justify-center p-10"><span className="loading loading-spinner text-[#6e42e5]"></span></div>
                        ) : filteredServices.length > 0 ? (
                            filteredServices.map(service => (
                                <ServiceCard key={service._id} service={service} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold">No services found in this category.</p>
                            </div>
                        )}
                    </div>

                    {/* Reviews embedded at bottom of list */}
                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <ServiceReviewForm serviceId={reviewServiceId} />
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Cart & Widgets (Sticky) - Width increased to col-span-4 */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">

                    {/* Cart Widget */}
                    {cartCount > 0 && (
                        <div className="sticky top-24 z-20 space-y-4">
                            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                                <div className="p-4 flex items-center justify-between bg-white border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#6e42e5]">
                                            <ShoppingCart size={14} strokeWidth={3} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cart Total</span>
                                            <span className="font-black text-slate-900">₹{cartTotal}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-purple-100 text-[#6e42e5] px-2 py-1 rounded">{cartCount} items</span>
                                </div>
                                <button
                                    onClick={() => navigate('/basket')}
                                    className="w-full bg-[#6e42e5] text-white py-4 font-bold text-sm hover:bg-[#5b36bf] transition flex justify-between px-6 items-center"
                                >
                                    <span>View Cart</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Offers Widget */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Tag size={18} className="text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Up to ₹100 cashback</h4>
                                <p className="text-xs text-slate-500 mt-1">Valid for BHIM app only</p>
                                <button className="text-[#6e42e5] text-xs font-bold mt-2 hover:underline">View More Offers ⌄</button>
                            </div>
                        </div>
                    </div>

                    {/* Promise Widget */}
                    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-slate-900 text-base">UC Promise</h4>
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <ShieldCheck size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-slate-600">
                                <span className="text-slate-900 font-bold">✓</span> Verified Professionals
                            </li>
                            <li className="flex gap-3 text-sm text-slate-600">
                                <span className="text-slate-900 font-bold">✓</span> Hassle Free Booking
                            </li>
                            <li className="flex gap-3 text-sm text-slate-600">
                                <span className="text-slate-900 font-bold">✓</span> Transparent Pricing
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Mobile Floating Cart */}
            {cartCount > 0 && (
                <div className="lg:hidden fixed bottom-4 w-[95%] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex justify-between items-center z-50 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400">{cartCount} items | ₹{cartTotal}</span>
                        <span className="font-bold text-slate-900 text-sm">view details</span>
                    </div>
                    <button
                        onClick={() => navigate('/basket')}
                        className="bg-[#6e42e5] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-purple-200"
                    >
                        View Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServicePageLayout;
