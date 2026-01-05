import React, { useState } from 'react';
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, 
  ShieldCheck, CheckCircle2, Sparkles, Loader2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const LoginScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        userEmail: formData.email,
        userPassword: formData.password
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // --- ADDED: Socket join room logic ---
        const userId = res.data.user._id || res.data.user.id;
        socket.emit('join_room', userId);
        
        alert(`Welcome back, ${res.data.user.name}!`);
        navigate('/'); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const renderBrandingSide = () => (
    <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative">
      <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
        <Sparkles size={300} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-12">
          <div className="p-2 bg-blue-600 rounded-xl"><ShieldCheck size={24}/></div>
          <span className="text-2xl font-black tracking-tighter">GharKeSeva</span>
        </div>
        <h1 className="text-5xl font-black leading-tight tracking-tighter mb-6">
          Premium Care <br/>
          <span className="text-blue-500">Back in Action.</span>
        </h1>
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
          <CheckCircle2 className="text-blue-400" />
          <span className="text-sm font-bold italic">Safe & Secure Payments</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {renderBrandingSide()}
        <div className="p-8 md:p-16 lg:p-20">
          <div className="max-w-sm mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Sign In</h2>
              <p className="text-slate-400 mt-2 text-sm font-medium">Customer Login</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input name="email" type="email" placeholder="Email Address" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={handleInputChange} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={handleInputChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button disabled={isLoading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] mt-4 hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-70 flex justify-center items-center">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Enter Dashboard"}
              </button>
            </form>
            <p className="text-center mt-12 text-sm font-bold text-slate-400">
              New to GharKeSeva? <Link to="/register" className="ml-2 text-blue-600 hover:underline font-black">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;