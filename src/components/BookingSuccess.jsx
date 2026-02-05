import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, Calendar, Clock, Coins } from 'lucide-react';

function BookingSuccess() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="bg-green-50 p-6 rounded-full mb-6 animate-bounce">
                <CheckCircle2 size={64} className="text-green-600" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-2 text-center">Booking Confirmed!</h1>
            <p className="text-gray-500 font-medium mb-4 text-center max-w-sm">
                Your service request has been placed successfully. A professional will be assigned shortly.
            </p>

            <div className="mb-8 bg-amber-50 text-amber-800 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 animate-pulse border border-amber-200 shadow-sm">
                <Coins size={14} className="text-amber-500" /> You earned <span className="text-amber-600 text-sm font-black">20 GS Coins</span> with this booking!
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-md border border-gray-100 mb-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">What happens next?</h3>
                <ul className="space-y-4 text-sm font-bold text-slate-700">
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#effafa] text-[#0c8182] flex items-center justify-center font-black">1</div>
                        Professional Assigned (within 30 mins)
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#effafa] text-[#0c8182] flex items-center justify-center font-black">2</div>
                        Receive Confirmation SMS/Call
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#effafa] text-[#0c8182] flex items-center justify-center font-black">3</div>
                        Service Delivery at Your Slot
                    </li>
                </ul>
            </div>

            <div className="flex flex-col w-full max-w-xs gap-3">
                <Link
                    to="/my-bookings"
                    className="w-full bg-[#0c8182] text-white py-4 rounded-2xl font-black text-sm text-center shadow-xl shadow-teal-100 hover:bg-[#0a6d6d] transition"
                >
                    Track Booking
                </Link>
                <Link
                    to="/"
                    className="w-full bg-gray-100 text-slate-900 py-4 rounded-2xl font-black text-sm text-center hover:bg-gray-200 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default BookingSuccess;
