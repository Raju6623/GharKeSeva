import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
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

  const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm font-medium focus:border-[#0c8182] outline-none transition-all";
  const labelClass = "text-[10px] font-black uppercase text-slate-500 mb-1 block tracking-wider";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
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
                placeholder="name@example.com / 9876543210"
                required
                className={inputClass}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={labelClass}>{t('password')}</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className={inputClass}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0c8182] text-white rounded font-bold mt-4 uppercase tracking-widest text-xs disabled:opacity-70 hover:bg-[#0a6d6d] transition-all"
            >
              {loading ? t('logging_in') : t('sign_in')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;