import React from 'react';
import { Star, Clock, Zap, Plus, Minus, CreditCard } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/thunks/cartThunks';

const BACKEND_URL = "http://localhost:3001";

const ServiceCard = ({ service }) => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);

    // Check if item is in cart
    const cartItem = cart.find(item => (item._id || item.id) === service._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    // Image Helper
    const imageUrl = service.packageImage?.startsWith('http')
        ? service.packageImage
        : `${BACKEND_URL}/${service.packageImage}`;

    return (
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[180px] hover:shadow-md transition-shadow">
            {/* Left Content */}
            <div className="flex-1 p-5 pr-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2">
                    {service.packageName}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1 text-sm font-bold text-slate-800 mb-3">
                    <div className="bg-slate-900 text-white p-1 rounded-full">
                        <Star size={10} fill="white" />
                    </div>
                    <span>4.82</span>
                    <span className="text-gray-400 font-normal text-xs">(1.5M reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="font-black text-slate-900">₹{service.priceAmount}</span>
                    <span className="text-gray-400 text-sm line-through decoration-gray-400 decoration-1">
                        ₹{Math.round(service.priceAmount * 1.2)}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {service.estimatedTime || '60 mins'}
                    </span>
                </div>

                {/* Description List */}
                <ul className="text-gray-500 text-xs space-y-1 mb-3 list-disc pl-4 marker:text-gray-300">
                    {service.description ? (
                        <li>{service.description.slice(0, 60)}...</li>
                    ) : (
                        <>
                            <li>Foam jet technology cleaning</li>
                            <li>Spare parts charges applicable</li>
                        </>
                    )}
                </ul>

                <button className="text-[#6e42e5] text-sm font-bold hover:underline">
                    View details
                </button>
            </div>

            {/* Right Image & Action */}
            <div className="w-36 relative p-4 flex flex-col items-center">
                <div className="w-full h-28 rounded-xl overflow-hidden shadow-inner bg-gray-50 mb-[-16px] z-0">
                    <img
                        src={imageUrl}
                        alt={service.packageName}
                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Add Button - Floating over image bottom */}
                <div className="z-10 bg-white rounded-lg shadow-lg border border-gray-100 p-1 min-w-[90px]">
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between gap-2 px-1">
                            <button
                                onClick={() => dispatch(removeItemFromCart(service._id))}
                                className="text-[#6e42e5] hover:bg-purple-50 rounded p-1"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-[#6e42e5] font-black text-sm">{quantity}</span>
                            <button
                                onClick={() => dispatch(addItemToCart(service))}
                                className="text-[#6e42e5] hover:bg-purple-50 rounded p-1"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => dispatch(addItemToCart(service))}
                            className="w-full text-[#6e42e5] font-black text-sm py-1.5 uppercase hover:bg-purple-50 rounded transition"
                        >
                            Add
                        </button>
                    )}
                </div>

                {quantity > 0 && (
                    <span className="text-[9px] text-gray-400 mt-2 font-medium">Customizable</span>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;
