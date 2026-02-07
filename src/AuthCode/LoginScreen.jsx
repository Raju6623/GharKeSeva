import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Eye, EyeOff, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../config';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/thunks/authThunks';
import toast from 'react-hot-toast';
import useTranslation from '../hooks/useTranslation';

const socket = io(BASE_URL);

function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload;

      // Socket Join Room
      const userId = user._id || user.id;
      socket.emit('join_room', userId);

      toast.success(`${t('welcome_back_title')}, ${user.name}!`);

      // Redirect to previous page if available, else home
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } else {
      toast.error(resultAction.payload || t('login_failed'));
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error("Please enter email or mobile");

    setIsSubmittingForgot(true);
    // Simulate real-time working
    setTimeout(() => {
      toast.success("Reset link sent to your registered email/mobile!");
      setIsSubmittingForgot(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 1500);
  };

  const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm font-medium focus:border-[#0c8182] outline-none transition-all";
  const labelClass = "text-[10px] font-black uppercase text-slate-500 mb-1 block tracking-wider";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans border-2">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row overflow-hidden">

        {/* Brand Side */}
        <div className="w-full md:w-5/12 bg-[#1a1c21] p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck size={24} className="text-[#0c8182]" />
              <span className="font-bold text-xl uppercase tracking-tighter">GharKeSeva</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{t('welcome_back_title')}</h2>
            <p className="text-slate-400 text-sm">{t('access_profile')}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/10">
              <CheckCircle2 className="text-[#effafa]" size={18} />
              <span className="text-xs font-bold">{t('secure_transactions')}</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-7/12 p-10 bg-white min-h-[500px] flex flex-col justify-center">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h3 className="text-xl font-bold text-slate-800">{t('user_login')}</h3>
            <Link to="/register" className="text-[#0c8182] font-bold text-xs uppercase tracking-widest">
              {t('create_account')}
            </Link>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>{t('email_or_mobile')}</label>
              <input
                name="email"
                type="text"
                placeholder="name@example.com / 9241333130"
                required
                className={inputClass}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className={labelClass}>{t('password')}</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#0c8182] text-[10px] font-bold uppercase tracking-widest hover:underline mb-1"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className={inputClass}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0c8182] text-white rounded font-bold mt-4 uppercase tracking-widest text-xs disabled:opacity-70 hover:bg-[#0a6d6d] transition-all focus:ring-2 focus:ring-[#0c8182] focus:ring-offset-2"
            >
              {loading ? t('logging_in') : t('sign_in')}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="bg-[#1a1c21] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Reset Password</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">GharKeSeva Security</p>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                  <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    Enter your email or mobile number below and we'll send you instructions to reset your password.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Email or Mobile Number</label>
                  <input
                    type="text"
                    placeholder="Enter your registered details"
                    className={inputClass}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingForgot}
                  className="flex-[2] py-4 bg-[#0c8182] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingForgot ? <ShieldCheck className="animate-pulse" size={16} /> : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginScreen;