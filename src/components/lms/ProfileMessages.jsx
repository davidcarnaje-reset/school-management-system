import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Loader2, MessageSquare, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const ProfileMessages = () => {
  const { user, API_BASE_URL } = useAuth();
  
  const userId = user?.id || user?.student_id || user?.username;
  const userRole = user?.role || 'student';

  // States
  const [contacts, setContacts] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  // Load Existing Conversations
  const fetchContacts = async () => {
    if (!userId) return;
    try {
      setLoadingContacts(true);
      const response = await axios.get(`${API_BASE_URL}/messages/get_contacts.php?user_id=${userId}&user_role=${userRole}`);
      if (response.data.status === 'success') {
        setContacts(response.data.contacts || []);
      }
    } catch (error) {
      console.error("Contacts Fetch Error:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [userId, userRole, API_BASE_URL]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Click on Sidebar Contact
  const handleContactClick = async (contact) => {
    setActiveContact(contact);
    setLoadingMessages(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/get_messages.php?user_id=${userId}&user_role=${userRole}&contact_id=${contact.contact_id}&contact_role=${contact.contact_role}`
      );
      if (response.data.status === 'success') {
        setMessages(response.data.data || []);
      }
    } catch (error) {
      console.error("Messages Fetch Error:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Open "New Message" Modal
  const handleOpenNewChat = async () => {
    setShowNewChatModal(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/messages/get_available_contacts.php?user_id=${userId}&user_role=${userRole}`);
      if (res.data.status === 'success') {
        setAvailableContacts(res.data.contacts);
      }
    } catch (err) {
      console.error("Available Contacts Error:", err);
    }
  };

  const startNewChat = (contact) => {
    setActiveContact(contact);
    setMessages([]); // Start with fresh window
    setShowNewChatModal(false);
  };

  // Send Message Logic
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;

    const tempMsg = newMessage;
    setNewMessage("");

    try {
      const payload = {
        sender_id: userId,
        sender_role: userRole,
        receiver_id: activeContact.contact_id,
        receiver_role: activeContact.contact_role,
        message: tempMsg
      };

      const response = await axios.post(`${API_BASE_URL}/messages/send_message.php`, payload);

      if (response.data.status === 'error') {
        if (response.data.error_code === 'LIMIT_REACHED') {
          alert(`Staff Protection: ${response.data.message}`);
        }
        setNewMessage(tempMsg);
        return;
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        text: tempMsg,
        is_you: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      // Refresh sidebar to show latest msg
      fetchContacts();

    } catch (error) {
      setNewMessage(tempMsg);
      console.error("Send Error:", error);
    }
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '??';

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex animate-in zoom-in-95 duration-500 font-sans">
      
      {/* 1. SIDEBAR */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-white shrink-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Messages</h2>
            <button 
              onClick={handleOpenNewChat}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-90"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={3} />
            <input type="text" placeholder="Search chats..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 ring-blue-500/10 outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {loadingContacts ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : contacts.map((c, i) => (
            <div 
              key={i} 
              onClick={() => handleContactClick(c)}
              className={`p-3 rounded-[1.5rem] flex items-center gap-3 cursor-pointer transition-all ${activeContact?.contact_id === c.contact_id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center font-black text-blue-600 shrink-0 text-sm">
                {c.profile_image ? <img src={`/assets/uploads/${c.profile_image}`} className="w-full h-full object-cover rounded-2xl" /> : getInitials(c.contact_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-sm font-black text-slate-800 truncate">{c.contact_name}</h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase">{c.display_time}</span>
                </div>
                <p className={`text-xs truncate ${!c.is_read && !c.is_you ? 'text-blue-600 font-black' : 'text-slate-500 font-bold'}`}>
                  {c.is_you && "You: "}{c.last_message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-slate-50/40">
        {activeContact ? (
          <>
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm border-2 border-blue-50">
                   {getInitials(activeContact.contact_name)}
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-800">{activeContact.contact_name}</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {activeContact.contact_role}
                    </p>
                 </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"><Phone size={18} strokeWidth={2.5} /></button>
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"><Video size={18} strokeWidth={2.5} /></button>
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={18} strokeWidth={2.5} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.is_you ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 shadow-sm ${m.is_you ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-slate-600 border border-slate-100 rounded-2xl rounded-tl-none'}`}>
                    <p className="text-sm font-bold leading-relaxed">{m.text}</p>
                    <p className={`text-[9px] font-black mt-2 uppercase ${m.is_you ? 'text-blue-200 text-right' : 'text-slate-300 text-left'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
               <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-2 flex items-center gap-2 focus-within:ring-4 ring-blue-500/5 transition-all">
                  <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors"><Paperclip size={20} strokeWidth={2.5} /></button>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-700 px-2" 
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50"
                  >
                    <Send size={18} strokeWidth={2.5} />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
            <MessageSquare size={48} strokeWidth={2.5} className="opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">Select a conversation to start</p>
          </div>
        )}
      </div>

      {/* 3. NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">New Message</h3>
              <button onClick={() => setShowNewChatModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
              {availableContacts.map((c, i) => (
                <div key={i} onClick={() => startNewChat(c)} className="flex items-center gap-4 p-3.5 hover:bg-blue-50 rounded-[1.5rem] cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs group-hover:scale-110 transition-transform">
                    {getInitials(c.contact_name)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{c.contact_name}</p>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{c.contact_role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMessages;