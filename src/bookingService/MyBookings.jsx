import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, Calendar, Clock, MapPin, 
  MessageCircle, X, Send, Download, 
  ChevronRight, CheckCircle2, Loader2 
} from 'lucide-react';
import io from 'socket.io-client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const socket = io('http://localhost:3001');

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // Chat window state
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (userData) {
      fetchUserBookings();
      // Socket Room join karna taaki real-time updates mil sakein
      socket.emit('join_room', userData._id || userData.id);
    }

    // Real-time Status Update Listener
    socket.on('order_status_updated', (data) => {
      alert(`Update: Your booking #${data.bookingId} is now ${data.newStatus}`);
      fetchUserBookings();
    });

    // Real-time Chat Message Listener
    socket.on('receive_message', (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    return () => {
      socket.off('order_status_updated');
      socket.off('receive_message');
    };
  }, []);

  const fetchUserBookings = async () => {
    try {
      // Backend route jo humne service.js me define kiya tha (Vendor history logic reuse)
      const res = await axios.get(`http://localhost:3001/api/auth/vendor/history/${userData._id || userData.id}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const chatData = {
      receiverId: activeChat.vendorId, // Assigned Vendor ID
      senderId: userData._id || userData.id,
      senderName: userData.name,
      message: message
    };

    socket.emit('send_message', chatData);
    setChatHistory((prev) => [...prev, { ...chatData, isMe: true, timestamp: new Date() }]);
    setMessage("");
  };

  const downloadInvoice = (b) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("GharKeSeva - Invoice", 14, 20);
    doc.setFontSize(10);
    doc.text(`Booking ID: ${b.customBookingId}`, 14, 30);
    doc.text(`Customer: ${userData.name}`, 14, 35);
    
    doc.autoTable({
      startY: 45,
      head: [['Service Name', 'Category', 'Price']],
      body: [[b.packageName, b.serviceCategory, `INR ${b.totalPrice}`]],
      theme: 'grid'
    });
    
    doc.text(`Total Paid: INR ${b.totalPrice}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`Invoice_${b.customBookingId}.pdf`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">My Bookings</h1>
            <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Track your service history</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-black">
            {bookings.length} TOTAL
          </div>
        </header>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
              <Package className="mx-auto text-slate-200 mb-4" size={60} />
              <p className="text-slate-400 font-bold uppercase tracking-widest">No Bookings Found</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-8">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-blue-500 shadow-xl">
                        <Package size={28} />
                      </div>
                      <div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                          b.bookingStatus === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {b.bookingStatus}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{b.packageName}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{b.totalPrice}</p>
                      <button onClick={() => downloadInvoice(b)} className="text-[10px] font-black text-blue-600 flex items-center gap-1 mt-1 hover:underline uppercase">
                        <Download size={12}/> Get Invoice
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-slate-50">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-slate-400" size={18}/>
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{b.bookingDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="text-slate-400" size={18}/>
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{b.bookingTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="text-slate-400" size={18}/>
                      <span className="text-sm font-bold text-slate-600 truncate">{b.serviceAddress}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       {b.assignedVendorId ? (
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                               <CheckCircle2 className="text-orange-600" size={16}/>
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Expert Assigned</span>
                         </div>
                       ) : (
                         <span className="text-xs font-bold text-slate-400 uppercase italic">Waiting for expert...</span>
                       )}
                    </div>
                    
                    {b.assignedVendorId && b.bookingStatus !== 'Completed' && (
                      <button 
                        onClick={() => {
                          setActiveChat({ vendorId: b.assignedVendorId, name: b.packageName + " Expert" });
                          setChatHistory([]); // Real history should ideally fetch from DB
                        }}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                      >
                        <MessageCircle size={16}/> Live Chat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- LIVE CHAT FLOATING UI --- */}
      {activeChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic">GKS</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{activeChat.name}</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/> Online
                </p>
              </div>
            </div>
            <button onClick={() => setActiveChat(null)} className="hover:bg-white/10 p-2 rounded-xl transition">
              <X size={20}/>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-[10px] font-bold text-blue-600 uppercase text-center tracking-widest border border-blue-100">
              Chat started for your service request
            </div>
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold shadow-sm ${
                  chat.isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border rounded-tl-none'
                }`}>
                  {chat.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-50 flex gap-3">
            <input 
              type="text" 
              placeholder="Tell something to your expert..." 
              className="flex-1 bg-slate-100 rounded-2xl px-5 text-xs font-bold outline-none focus:ring-2 ring-blue-500/20 transition-all border-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              <Send size={18}/>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyBookings;