import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/thunks/authThunks';
import toast from 'react-hot-toast';
import useTranslation from '../hooks/useTranslation';

function RegisterScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const pendingRef = localStorage.getItem('pendingReferral');
    if (pendingRef) {
      setFormData(prev => ({ ...prev, referralCode: pendingRef }));
    }
  }, []);

  // Simple Device Fingerprint (Screen + Browser Info)
  const getFingerprint = () => {
    return `${navigator.userAgent}-${window.screen.width}x${window.screen.height}-${navigator.language}`;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    gender: 'Male',
    dob: '',
    password: '',
    confirmPassword: '',
    // Address
    houseNumber: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    referralCode: '',
    termsAccepted: false
  });

  const handleInputChange = (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (e.target.name === 'phone' || e.target.name === 'alternatePhone') {
      value = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handlePincodeChange = (e) => {
    const pin = e.target.value;
    setFormData(prev => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      setFormData(prev => ({ ...prev, pincode: pin, city: 'Patna', state: 'Bihar' }));
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.dob) {
      toast.error(t('fill_details_error'));
      return;
    }
    setStep(2);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('password_mismatch_error'));
      return;
    }
    if (!formData.termsAccepted) {
      toast.error(t('terms_error'));
      return;
    }

    setIsLoading(true);

    const payload = {
      userFullName: formData.fullName,
      userEmail: formData.email,
      userPhone: formData.phone,
      alternatePhone: formData.alternatePhone,
      userPassword: formData.password,
      gender: formData.gender,
      dob: formData.dob,
      houseNumber: formData.houseNumber,
      area: formData.area,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      termsAccepted: formData.termsAccepted,
      referralCode: formData.referralCode,
      fingerprint: getFingerprint(),
      address: `${formData.houseNumber}, ${formData.area}, ${formData.landmark}, ${formData.city} - ${formData.pincode}`
    };

    try {
      const resultAction = await dispatch(registerUser(payload));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success(t('account_created'));
        // Clear pending referral after success
        localStorage.removeItem('pendingReferral');
        navigate('/login');
      } else {
        toast.error(resultAction.payload || t('reg_failed'));
      }
    } catch (err) {
      toast.error(t('something_wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm font-medium focus:border-[#0c8182] outline-none transition-all";
  const labelClass = "text-[10px] font-black uppercase text-slate-500 mb-1 block tracking-wider";

  const features = [t('verified_experts'), t('transparent_pricing'), t('warranty_services')];
  const featureElements = features.map((feat, i) => (
    <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-md border border-white/10">
      <CheckCircle2 className="text-[#effafa]" size={16} />
      <span className="text-xs font-bold uppercase tracking-widest">{feat}</span>
    </div>
  ));

  const step1Content = (
    <div className="space-y-4">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('personal_details')}</h4>
      <div><label className={labelClass}>{t('full_name')}</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>{t('mobile_no')}</label><input type="tel" inputMode="numeric" maxLength="10" name="phone" value={formData.phone} onChange={handleInputChange} required className={inputClass} /></div>
        <div><label className={labelClass}>{t('alt_phone')}</label><input type="tel" inputMode="numeric" maxLength="10" name="alternatePhone" value={formData.alternatePhone} onChange={handleInputChange} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>{t('email_optional')}</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} /></div>

      {/* Referral Code Field */}
      <div><label className={labelClass}>Referral Code (Optional)</label><input type="text" name="referralCode" value={formData.referralCode} onChange={handleInputChange} placeholder="e.g. GSUSER1234" className={`${inputClass} border-dashed border-2 focus:border-indigo-500`} /></div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('gender')}</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClass}>
            <option value="Male">{t('male')}</option>
            <option value="Female">{t('female')}</option>
            <option value="Other">{t('other')}</option>
          </select>
        </div>
        <div><label className={labelClass}>{t('dob')}</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required className={inputClass} /></div>
      </div>

      <button type="submit" className="w-full py-4 bg-[#0c8182] text-white rounded font-bold mt-4 uppercase tracking-widest text-xs shadow-lg hover:bg-[#0a6d6d] transition-all">
        {t('next_step')}
      </button>
    </div>
  );

  const step2Content = (
    <div className="space-y-4">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('address_security')}</h4>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>{t('house_no')}</label><input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} required className={inputClass} /></div>
        <div><label className={labelClass}>{t('pincode')}</label><input type="text" maxLength="6" name="pincode" value={formData.pincode} onChange={handlePincodeChange} required className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>{t('area_sector')}</label><input type="text" name="area" value={formData.area} onChange={handleInputChange} required className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={labelClass}>{t('city')}</label><input type="text" name="city" value={formData.city} readOnly className="bg-slate-50 w-full p-2.5 border rounded-md text-slate-500 font-bold text-sm" /></div>
        <div><label className={labelClass}>{t('state')}</label><input type="text" name="state" value={formData.state} readOnly className="bg-slate-50 w-full p-2.5 border rounded-md text-slate-500 font-bold text-sm" /></div>
      </div>
      <div><label className={labelClass}>{t('landmark')}</label><input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} className={inputClass} /></div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div><label className={labelClass}>{t('password')}</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} required className={inputClass} /></div>
        <div><label className={labelClass}>{t('confirm_password')}</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className={inputClass} /></div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" name="termsAccepted" id="terms" checked={formData.termsAccepted} onChange={handleInputChange} required className="w-4 h-4 cursor-pointer" />
        <label htmlFor="terms" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer">{t('accept_terms')}</label>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded font-bold hover:bg-slate-200 text-xs uppercase tracking-widest">{t('back')}</button>
        <button type="submit" disabled={isLoading} className="flex-[2] py-3 bg-[#0c8182] text-white rounded font-bold shadow-lg hover:bg-[#0a6d6d] text-xs uppercase tracking-widest disabled:opacity-70">
          {isLoading ? t('creating') : t('create_account')}
        </button>
      </div>
    </div>
  );

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
            <h2 className="text-3xl font-bold mb-4">{t('join_us')}</h2>
            <p className="text-slate-400 text-sm">{t('create_account_desc')}</p>
          </div>
          <div className="space-y-4">
            {featureElements}
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-7/12 p-10 bg-white max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h3 className="text-xl font-bold text-slate-800">{t('register')}</h3>
            <Link to="/login" className="text-[#0c8182] font-bold text-xs uppercase tracking-widest">
              {t('back_to_login')}
            </Link>
          </div>

          <div className="flex gap-1 mb-8">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#0c8182]' : 'bg-slate-100'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#0c8182]' : 'bg-slate-100'}`}></div>
          </div>

          <form onSubmit={step === 1 ? nextStep : handleRegisterSubmit} className="space-y-4">
            {step === 1 ? step1Content : step2Content}
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;