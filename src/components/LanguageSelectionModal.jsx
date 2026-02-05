import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/slices/authSlice';
import { API_URL } from '../config';
import { Globe } from 'lucide-react';

const LanguageSelectionModal = () => {
    const dispatch = useDispatch();
    const { user, language, isAuthenticated } = useSelector((state) => state.auth);

    // Show if:
    // 1. User is authenticated (logged in)
    // 2. User object exists (has customUserId)
    // 3. Current language is NOT set in Redux OR matches default "English" but hasn't been explicitly saved (optional check, but checking if user.language is null/undefined is better)

    // Logic: Users created before this feature have user.language = undefined/null.
    // Newly created users default to null in DB.

    // We want to force choice if user.language is falsy.
    // The Redux `language` might default to "English" from local storage or fallback, 
    // so we specifically check `user.language`.

    const shouldShow = isAuthenticated && user && !user.language;

    if (!shouldShow) return null;

    const handleSelect = async (selectedLang) => {
        try {
            // 1. Update Backend
            const response = await fetch(`${API_URL}/update-language`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user.customUserId,
                    language: selectedLang
                })
            });

            const data = await response.json();
            if (data.success) {
                // 2. Update Redux (which also updates LocalStorage)
                dispatch(setLanguage(selectedLang));
            } else {
                console.error("Failed to update language:", data.error);
                // Fallback: Update local state anyway so user isn't stuck
                dispatch(setLanguage(selectedLang));
            }
        } catch (err) {
            console.error("Language update error:", err);
            dispatch(setLanguage(selectedLang));
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300 text-center relative overflow-hidden">

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0c8182] to-[#1a1c21]" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0c8182]/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1a1c21]/5 rounded-full blur-2xl" />

                <div className="relative z-10">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-teal-50 text-[#0c8182] rounded-full ring-8 ring-teal-50/50">
                            <Globe size={40} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2">Select your Language</h2>
                    <p className="text-slate-500 mb-8 font-medium">Please choose your preferred language to continue using GharKeSeva.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleSelect('English')}
                            className="group relative px-6 py-4 rounded-xl border-2 border-slate-100 hover:border-[#0c8182] bg-white hover:bg-teal-50 transition-all duration-200"
                        >
                            <span className="block text-lg font-bold text-slate-700 group-hover:text-[#0c8182]">English</span>
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-[#0c8182]/70">Default</span>
                            <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-[#0c8182] group-hover:bg-[#0c8182] transition-colors" />
                        </button>

                        <button
                            onClick={() => handleSelect('Hindi')}
                            className="group relative px-6 py-4 rounded-xl border-2 border-slate-100 hover:border-[#0c8182] bg-white hover:bg-teal-50 transition-all duration-200"
                        >
                            <span className="block text-lg font-bold text-slate-700 group-hover:text-[#0c8182]">Hindi</span>
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-[#0c8182]/70">हिंदी</span>
                            <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-[#0c8182] group-hover:bg-[#0c8182] transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelectionModal;
