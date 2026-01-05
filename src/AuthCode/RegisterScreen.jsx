import React, { useState } from 'react';
import { 
  Mail, Lock, User, Smartphone, ShieldCheck, 
  CheckCircle2, Sparkles, Loader2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Backend Schema ke keys ke mutabiq payload
    const payload = {
      userFullName: formData.fullName,
      userEmail: formData.email,
      userPhone: formData.phone,
      userPassword: formData.password
    };

    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', payload);
      if (res.data.success) {
        alert("Registration Successful! Redirecting to login...");
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed. Email/Phone might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFeatureList = () => (
    <div className="hidden lg:flex flex-col justify-between p-16 bg-blue-600 text-white relative">
      <div className="absolute top-0 left-0 p-12 opacity-20 -rotate-12">
        <Sparkles size={300} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-12">
          <div className="p-2 bg-white text-blue-600 rounded-xl"><ShieldCheck size={24}/></div>
          <span className="text-2xl font-black tracking-tighter">GharKeSeva</span>
        </div>
        <h1 className="text-5xl font-black leading-tight tracking-tighter mb-6">
          Join the <br/>
          <span className="text-slate-900">Service Hub.</span>
        </h1>
        <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
          Bihar's most trusted home service network.
        </p>
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 bg-slate-900/20 p-4 rounded-2xl backdrop-blur-md border border-white/20">
          <CheckCircle2 className="text-white" />
          <span className="text-sm font-bold italic">Background Verified Experts</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {renderFeatureList()}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="max-w-sm mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Get Started</h2>
              <p className="text-slate-400 mt-2 text-sm font-medium">Create a customer account.</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input name="fullName" type="text" placeholder="Full Name" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={handleInputChange} />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input name="email" type="email" placeholder="Email Address" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={handleInputChange} />
              </div>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input name="phone" type="tel" placeholder="Phone Number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={handleInputChange} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input name="password" type="password" placeholder="Create Password" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all" onChange={handleInputChange} />
              </div>
              <button disabled={isLoading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] mt-4 hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-70 flex justify-center items-center">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Join GharKeSeva"}
              </button>
            </form>
            <p className="text-center mt-10 text-sm font-bold text-slate-400">
              Already have an account? <Link to="/login" className="ml-2 text-blue-600 hover:underline font-black">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;