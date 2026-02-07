import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle2, AlertCircle, Loader2, Sparkles, Zap } from 'lucide-react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const QuizModal = ({ isOpen, onClose, userId, onRewardEarned }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [result, setResult] = useState(null); // { correct: boolean, reward: number }

    useEffect(() => {
        if (isOpen && userId) {
            fetchQuizzes();
        }
    }, [isOpen, userId]);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/user/quiz/${userId}`);
            if (res.data.success) {
                setQuizzes(res.data.data || []);
            }
        } catch (err) {
            toast.error("Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!selectedOption) return;
        setSubmitting(true);
        try {
            const res = await api.post('/user/quiz/submit', {
                userId,
                quizId: quizzes[currentIndex]._id,
                answer: selectedOption
            });
            if (res.data.success) {
                setResult({ correct: res.data.correct, reward: res.data.reward });
                if (res.data.correct) {
                    onRewardEarned();
                    toast.success(`Correct! You won ${res.data.reward} Coins!`);
                } else {
                    toast.error("Oops! That was incorrect.");
                }
            }
        } catch (err) {
            toast.error("Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const nextQuestion = () => {
        setResult(null);
        setSelectedOption(null);
        if (currentIndex < quizzes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
            toast("You've completed all of today's questions!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Zap size={20} className="fill-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Play & Win Coins</span>
                    </div>
                    <h2 className="text-xl font-black italic tracking-tighter">Daily Trivia Challenge</h2>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-pink-500 mb-4" size={32} />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Loading fresh questions...</p>
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="text-amber-400 mx-auto mb-4" size={48} />
                            <h3 className="text-lg font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Gold Medal!</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-8">You've answered all of today's questions. Come back tomorrow!</p>
                            <button onClick={onClose} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Close</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Progress Info */}
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {quizzes.length}</span>
                                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center gap-1">
                                    Reward: <Sparkles size={10} /> {quizzes[currentIndex].rewardCoins} Coins
                                </span>
                            </div>

                            {/* Question */}
                            <p className="text-lg font-black text-slate-800 leading-tight italic">{quizzes[currentIndex].question}</p>

                            {/* Options */}
                            {!result ? (
                                <div className="space-y-3">
                                    {quizzes[currentIndex].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedOption(opt)}
                                            className={`w-full p-4 rounded-2xl text-left text-sm font-bold transition-all border-2 ${selectedOption === opt
                                                ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-md'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{opt}</span>
                                                {selectedOption === opt && <CheckCircle2 size={16} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className={`p-6 rounded-3xl flex flex-col items-center text-center animate-in zoom-in duration-300 ${result.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                                    {result.correct ? (
                                        <>
                                            <Trophy className="text-emerald-500 mb-3" size={40} />
                                            <h4 className="text-xl font-black italic mb-1 uppercase tracking-tighter">Legendary!</h4>
                                            <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Correct Answer</p>
                                            <p className="text-sm font-black bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">+ {result.reward} Coins Earned</p>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="text-rose-500 mb-3" size={40} />
                                            <h4 className="text-xl font-black italic mb-1 uppercase tracking-tighter">Almost!</h4>
                                            <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-70">That was incorrect</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest italic opacity-60">Better luck next time!</p>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Footer Button */}
                            <button
                                onClick={result ? nextQuestion : handleAnswerSubmit}
                                disabled={!result && !selectedOption || submitting}
                                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-2 ${result ? 'bg-slate-900 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'
                                    }`}
                            >
                                {submitting ? <Loader2 className="animate-spin" size={16} /> : (
                                    <>
                                        {result ? (currentIndex === quizzes.length - 1 ? 'Finish Challenge' : 'Next Question') : 'Submit Answer'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
