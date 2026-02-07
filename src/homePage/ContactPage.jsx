import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Mail, Phone, MapPin, Send,
  MessageSquare, Clock, ShieldCheck, Globe
} from 'lucide-react';
import Footer from './Footer';

/**
 * ContactPage Component
 * Provides a dual-column layout with a functional contact form 
 * and localized Bihar service hub information.
 */
function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    serviceType: 'General Inquiry',
    userMessage: ''
  });

  // --- 1. DATA CONFIGURATION ---

  const contactMethods = [
    {
      id: 1,
      title: "Email Us",
      value: "support@gharkeseva.com",
      description: "Response within 24 hours",
      icon: <Mail className="text-[#0c8182]" size={24} />,
      link: "mailto:support@gharkeseva.com"
    },
    {
      id: 2,
      title: "Call Helpline",
      value: "+91 92413 33130",
      description: "Mon-Sat, 9am - 8pm",
      icon: <Phone className="text-[#0c8182]" size={24} />,
      link: "tel:+919241333130"
    },
    {
      id: 3,
      title: "Main Hub",
      value: "Fraser Road, Patna",
      description: "Bihar, 800001",
      icon: <MapPin className="text-[#0c8182]" size={24} />,
      link: "#"
    }
  ];

  // --- 2. HANDLER LOGIC ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Form Data Sent:", formState);
    toast.success("Message Transmitted! We'll reply shortly.");

    setFormState({
      userName: '',
      userEmail: '',
      userPhone: '',
      serviceType: 'General Inquiry',
      userMessage: ''
    });
    setIsSubmitting(false);
  };

  const serviceOptions = [
    'General Inquiry',
    'Booking Issue',
    'Partnership Request',
    'Wallet/Payment Issue',
    'Service Feedback',
    'Other'
  ].map((opt, i) => (
    <option key={i} value={opt}>{opt}</option>
  ));

  const contactCards = contactMethods.map((method) => (
    <a
      href={method.link}
      key={method.id}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center"
    >
      <div className="p-4 bg-[#effafa] rounded-2xl mb-6 group-hover:scale-110 transition-transform">
        {method.icon}
      </div>
      <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-1">
        {method.title}
      </h4>
      <p className="font-bold text-[#0c8182] mb-2">{method.value}</p>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
        {method.description}
      </p>
    </a>
  ));


  return (
    <>
      <main className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
        {/* Header Section */}
        <section className="bg-slate-900 pt-24 pb-40 text-white relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
            <Globe size={400} />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <span className="inline-flex items-center gap-2 bg-[#0c8182]/20 text-[#0c8182] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-[#0c8182]/20">
              <MessageSquare size={14} /> Support Hub
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
              Get in <span className="text-[#0c8182] italic font-serif normal-case font-light">Touch.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Bihar’s most trusted service network is just a message away. Our Patna-based support team is ready to help you.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactCards}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white rounded-[3.5rem] shadow-2xl p-8 md:p-12 border border-slate-50">
              <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
                Send a Message
              </h3>
              <form onSubmit={handleFormSubmission} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                    <input
                      type="text" required name="userName" value={formState.userName} onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#0c8182] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
                    <input
                      type="tel" required name="userPhone" value={formState.userPhone} onChange={handleInputChange}
                      placeholder="Phone number"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#0c8182] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                    <input
                      type="email" required name="userEmail" value={formState.userEmail} onChange={handleInputChange}
                      placeholder="example@mail.com"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#0c8182] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Service Type</label>
                    <select
                      name="serviceType" value={formState.serviceType} onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#0c8182] focus:bg-white transition-all appearance-none"
                    >
                      {serviceOptions}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Message</label>
                  <textarea
                    rows="4" required name="userMessage" value={formState.userMessage} onChange={handleInputChange}
                    placeholder="How can we help you?"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#0c8182] focus:bg-white transition-all"
                  ></textarea>
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-[#0c8182] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? "Transmitting..." : "Send Request"}
                  <Send size={18} />
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-xl">
                <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                  <ShieldCheck className="text-[#0c8182]" /> Bihar's Promise
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Clock size={18} /></div>
                    <div>
                      <p className="font-bold text-sm">60-Minute Resolution</p>
                      <p className="text-xs text-slate-400 mt-1">Our hub managers respond to urgent escalations within an hour.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><MapPin size={18} /></div>
                    <div>
                      <p className="font-bold text-sm">Pan-Bihar Operations</p>
                      <p className="text-xs text-slate-400 mt-1">Available in Patna, Muzaffarpur, Gaya, and growing.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Disclaimer Card */}
              <div className="p-8 bg-[#effafa] rounded-[2.5rem] border border-[#0c8182]/10">
                <p className="text-[10px] font-black text-[#0c8182] uppercase tracking-widest mb-2">Transparency Note</p>
                <p className="text-xs text-[#0c8182]/80 font-bold leading-relaxed">
                  GharKeSeva strictly verified all professional IDs. If you have concerns about a technician, please contact our emergency hub immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContactPage;