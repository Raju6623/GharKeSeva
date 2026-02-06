import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Coins, Ticket, Wallet, Zap, Copy, Share2, ChevronRight, Gamepad2, Gift, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchBookings } from '../redux/thunks/bookingThunks';
import { refreshUserProfile } from '../thunks/authThunks';
import { calculateGSCoin } from '../utils/coinUtils';
import api from '../../api/axiosConfig';
import QuizModal from '../components/QuizModal';

const ReferAndEarn = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { list: bookings } = useSelector((state) => state.bookings);
    const [referralCode] = useState(user?.referralCode || `GS${(user?.name || 'USER').toUpperCase().slice(0, 3)}${Math.floor(1000 + Math.random() * 9000)}`);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const [referralLogs, setReferralLogs] = useState([]);
    const [referralStats, setReferralStats] = useState({ totalEarned: 0, totalReferrals: 0 });

    React.useEffect(() => {
        dispatch(fetchBookings());
        if (user?.id) {
            dispatch(refreshUserProfile(user.id));
            fetchReferralHistory();
        }
    }, [dispatch, user?.id]);

    const fetchReferralHistory = async () => {
        try {
            const res = await api.get(`/user/referrals/${user.id}`);
            if (res.data.success) {
                setReferralLogs(res.data.logs);
                setReferralStats({
                    totalEarned: res.data.totalEarned,
                    totalReferrals: res.data.totalReferrals
                });
            }
        } catch (err) {
            console.error("Failed to fetch referrals", err);
        }
    };

    const dynamicLink = `${window.location.origin}?ref=${referralCode}`;

    const handleWalletTopup = async () => {
        const amount = prompt("Enter amount to add to wallet (₹):", "500");
        if (!amount || isNaN(amount) || amount <= 0) return;

        try {
            // 1. Create Order
            const orderRes = await api.post('/payments/create-order', { amount: Number(amount) });
            if (!orderRes.data.success) throw new Error("Order creation failed");

            const options = {
                key: orderRes.data.key_id,
                amount: orderRes.data.amount,
                currency: "INR",
                name: "GharKeSeva Wallet",
                description: "Wallet Top-up",
                order_id: orderRes.data.order_id,
                handler: async (response) => {
                    const topupRes = await api.post('/user/wallet/topup', {
                        userId: user.id,
                        amount: Number(amount),
                        razorpayPaymentId: response.razorpay_payment_id
                    });
                    if (topupRes.data.success) {
                        toast.success(`₹${amount} added successfully!`);
                        dispatch(refreshUserProfile(user.id));
                    }
                },
                theme: { color: "#0c8182" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Calculate Coins from bookings (1 Coin per ₹25)
    // Only count Paid, Completed, or Pending bookings (exclude Cancelled)
    const totalEarningsFromBookings = bookings.reduce((acc, curr) => {
        if (curr.bookingStatus !== 'Cancelled') {
            return acc + calculateGSCoin(curr.totalPrice);
        }
        return acc;
    }, 0);

    const copyLink = () => {
        navigator.clipboard.writeText(dynamicLink);
        toast.success("Dynamic Link Copied!");
    };

    const shareApp = () => {
        const shareText = `Use my link to join GharKeSeva and get ₹100 reward on your first booking! ${dynamicLink}`;
        if (navigator.share) {
            navigator.share({
                title: 'GharKe Seva',
                text: shareText,
                url: dynamicLink
            }).catch(console.error);
        } else {
            copyLink();
            toast.success("Link copied to clipboard!");
        }
    };

    const stats = [
        { label: "Refer Earned", value: `₹${referralStats.totalEarned}`, icon: <Gift className="text-amber-600" size={20} />, bg: "bg-amber-50", text: "text-amber-700" },
        { label: "Total Refers", value: referralStats.totalReferrals, icon: <Ticket className="text-indigo-600" size={20} />, bg: "bg-indigo-50", text: "text-indigo-700" },
        { label: "GS Wallet", value: `₹${user?.walletBalance || 0}`, icon: <Wallet className="text-emerald-600" size={20} />, bg: "bg-emerald-50", text: "text-emerald-700", actionable: true },
        { label: "My Coins", value: user?.gsCoins || 0, icon: <Zap className="text-amber-500" size={20} />, bg: "bg-amber-100", text: "text-amber-800" },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-24 pt-24 font-sans">
            <div className="max-w-md mx-auto px-4 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rewards & Referrals</h1>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white shadow-sm flex flex-col items-start gap-4 relative group`}>
                            <div className="flex justify-between items-center w-full">
                                <div className="p-2 bg-white rounded-xl shadow-sm">{stat.icon}</div>
                                {stat.actionable && (
                                    <button
                                        onClick={handleWalletTopup}
                                        className="p-1.5 bg-white rounded-lg shadow-sm text-[#0c8182] hover:scale-110 transition-transform"
                                    >
                                        <Plus size={14} />
                                    </button>
                                )}
                            </div>
                            <div>
                                <p className={`text-lg font-black ${stat.text}`}>{stat.value}</p>
                                <p className={`text-xs font-bold ${stat.text} opacity-70`}>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Milestone Tracker (5 Referrals Goal) */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Gift size={80} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-amber-500 fill-amber-500" /> Milestone Goal
                        </h3>

                        {/* Progress Logic */}
                        {(() => {
                            const completed = referralLogs.filter(l => l.status === 'Completed').length;
                            const target = 5;
                            const percentage = Math.min((completed / target) * 100, 100);
                            const remaining = Math.max(target - completed, 0);

                            return (
                                <>
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-2xl font-black text-[#0c8182] leading-none">{completed}/{target}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Friends Completed First Booking</p>
                                        </div>
                                        {remaining > 0 ? (
                                            <div className="text-right">
                                                <p className="text-xs font-black text-amber-600 uppercase italic leading-none">{remaining} More to go!</p>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <p className="text-xs font-black text-emerald-600 uppercase italic">Goal Reached! 🎉</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#0c8182] to-teal-400 transition-all duration-1000 ease-out shadow-sm"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <div className="flex -space-x-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black ${i < completed ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-400'}`}
                                                >
                                                    {i < completed ? '✓' : i + 1}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider self-center">
                                            Refer 5 friends to unlock a Special Bonus Reward!
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Play to Win Banner */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-pink-200 group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg inline-block mb-4 border border-white/20">
                            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Gamepad2 size={12} /> Play & Win</span>
                        </div>
                        <h2 className="text-2xl font-black leading-tight mb-2">Play to Win a Free Service & More</h2>
                        <button
                            onClick={() => setIsQuizModalOpen(true)}
                            className="mt-4 px-6 py-2.5 bg-white text-pink-600 text-xs font-black rounded-xl shadow-xl uppercase tracking-widest hover:bg-pink-50 transition-colors"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>

                {/* Refer & Earn Banner */}
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mb-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg inline-block mb-4 border border-white/20">
                                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Gift size={12} /> Refer & Earn</span>
                                </div>
                                <h2 className="text-3xl font-black leading-none mb-1">Refer & Earn</h2>
                                <h2 className="text-3xl font-black leading-none text-indigo-200">Free Services</h2>
                            </div>
                        </div>

                        {/* Referral Code Box */}
                        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Your Referral Code</p>
                            <div className="flex items-center justify-between gap-3 bg-white rounded-xl p-1.5 pl-4">
                                <span className="text-indigo-900 font-black tracking-widest text-lg">{referralCode}</span>
                                <button onClick={copyCode} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            <button onClick={shareApp} className="flex-1 py-3.5 bg-white text-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                                <Share2 size={16} /> Share Now
                            </button>
                            <button className="px-4 py-3.5 bg-indigo-800/50 text-white rounded-xl border border-indigo-400/30 hover:bg-indigo-800/70 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* How it Works Section */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">How it works</h3>
                    <div className="space-y-6 relative">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                        <Step number="1" title="Invite your friends" desc="Share your link with friends & family" />
                        <Step number="2" title="They book a service" desc="They get 20% OFF their first booking!" />
                        <Step number="3" title="You get rewarded" desc="Earn ₹100 Cashback in your wallet instantly!" icon={<Zap size={14} className="text-amber-500" />} />
                    </div>
                </div>

                {/* Referral History */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Referral History</h3>
                    <div className="space-y-4">
                        {referralLogs.length > 0 ? referralLogs.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${log.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <Gift size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tighter italic">User {log.referredUserId.slice(-4)}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-black ${log.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {log.status === 'Completed' ? `+₹${log.rewardAmount}` : 'Pending'}
                                    </p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{log.status}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No referrals yet. Share your link to start earning!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-4"></div>
            </div>

            {/* Quiz Trivia Modal */}
            <QuizModal
                isOpen={isQuizModalOpen}
                onClose={() => setIsQuizModalOpen(false)}
                userId={user?.id}
                onRewardEarned={() => dispatch(refreshUserProfile(user?.id))}
            />
        </div>
    );
};

const Step = ({ number, title, desc, icon }) => (
    <div className="flex gap-4 relative z-10">
        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-lg border-2 border-slate-50">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">{title} {icon}</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
        </div>
    </div>
);

export default ReferAndEarn;
