import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Heart, User, LogOut, SlidersHorizontal, X, Search, Book, Mail, Phone, MapPin, Globe,
  MessageSquare, Send, MessageCircle, Loader2
} from 'lucide-react';
import Breadcrumbs from '../ui/Breadcrumbs';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const SocialIcon = ({ platform, className }) => {
  const p = (platform || '').toLowerCase();
  
  if (p === 'facebook') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (p === 'instagram') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (p === 'youtube') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
      </svg>
    );
  }
  if (p === 'twitter' || p === 'x') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    );
  }
  if (p === 'github') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    );
  }
  if (p === 'linkedin') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  
  return <Globe className={className} />;
};

const ClientChatBubble = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState(null);
  const messageEndRef = useRef(null);

  // NOTE: No early return before hooks — that violates Rules of Hooks.
  // The admin/staff check is handled in the return below.

  const isStaffOrAdmin = user?.role === 'admin' || user?.role === 'staff';

  const fetchMessages = async () => {
    if (!user || isStaffOrAdmin) return;
    try {
      const res = await fetch(`http://localhost:3000/chats?userId=${encodeURIComponent(user.username)}`);
      if (res.ok) {
        const threads = await res.json();
        if (threads.length > 0) {
          const latest = threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
          setMessages(latest.messages || []);
          setChatId(latest.id);
        } else {
          setMessages([]);
          setChatId(null);
        }
      }
    } catch (err) {
      console.error("Error fetching client messages:", err);
    }
  };

  useEffect(() => {
    if (isOpen && user && !isStaffOrAdmin) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || !user) return;

    const newMessage = {
      id: 'm_' + Date.now(),
      sender: 'customer',
      text: text.trim(),
      time: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInputText('');

    try {
      if (chatId) {
        await fetch(`http://localhost:3000/chats/${chatId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: chatId,
            userId: user.username,
            customerName: user.fullName || user.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=0f172a&color=fff`,
            lastMessage: newMessage.text,
            updatedAt: new Date().toISOString(),
            unread: true,
            messages: updatedMessages
          })
        });
      } else {
        const newChat = {
          userId: user.username,
          customerName: user.fullName || user.username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=0f172a&color=fff`,
          lastMessage: newMessage.text,
          updatedAt: new Date().toISOString(),
          unread: true,
          messages: updatedMessages
        };

        const res = await fetch('http://localhost:3000/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChat)
        });

        if (res.ok) {
          const created = await res.json();
          setChatId(created.id);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const quickQuestions = [
    "Sách này còn hàng không?",
    "Cách thức thanh toán thế nào?",
    "Thời gian giao hàng mất bao lâu?"
  ];

  // Admin/staff don't see the chat bubble
  if (isStaffOrAdmin) return null;

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-cam-500 hover:bg-cam-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="absolute right-16 bg-navy-900 text-white text-[11px] font-black uppercase tracking-wider py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Hỗ trợ trực tuyến
        </span>
      </div>

      {/* Expanded Chat Popup Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-100/80 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-navy-900 p-5 text-white flex items-center justify-between">
            <div>
              <h3 className="font-headline font-black text-sm uppercase tracking-wider">TayfBook Support</h3>
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Hỗ trợ trực tuyến</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          {!user ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-cam-50 text-cam-500 rounded-full flex items-center justify-center shadow-lg shadow-cam-500/10">
                <MessageCircle className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h4 className="font-headline font-black text-navy-900 text-sm uppercase tracking-wider mb-2">Trò chuyện hỗ trợ</h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed px-4">
                  Bạn cần đăng nhập để bắt đầu cuộc trò chuyện hỗ trợ trực tuyến với nhân viên cửa hàng.
                </p>
              </div>
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-navy-900/10"
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <>
              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-6">
                    <div className="text-slate-400 font-medium text-xs max-w-[200px] leading-relaxed">
                      Chào bạn! Hãy gửi câu hỏi đầu tiên để kết nối với nhân viên hỗ trợ.
                    </div>
                    <div className="w-full space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Câu hỏi gợi ý</div>
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="w-full text-left bg-white border border-slate-100 hover:border-cam-500 hover:text-cam-600 rounded-xl p-3 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.sender === 'customer';
                    const timeString = new Date(msg.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] space-y-1`}>
                          <div className={`px-4 py-3 rounded-3xl text-xs shadow-sm font-medium leading-relaxed ${
                            isSelf 
                              ? 'bg-navy-900 text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`text-[9px] text-slate-400 font-bold px-2 ${isSelf ? 'text-right' : 'text-left'}`}>
                            {timeString}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messageEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Nhập tin nhắn hỗ trợ...`}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs focus:ring-1 focus:ring-cam-500 outline-none text-slate-800 font-medium"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-10 h-10 bg-cam-500 hover:bg-cam-600 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-md shadow-cam-500/10 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

const ClientLayout = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [settings, setSettings] = useState(null);
  const searchRef = useRef(null);

  // Advanced filter states
  const [categories, setCategories] = useState([]);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/products').then(res => res.json()),
      fetch('http://localhost:3000/categories').then(res => res.json()),
      fetch('http://localhost:3000/settings').then(res => res.json())
    ])
    .then(([productsData, categoriesData, settingsData]) => {
      setAllProducts(productsData);
      setCategories(categoriesData);
      setSettings(settingsData);
    })
    .catch(err => console.error("Could not load data for layout", err));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const lowerQ = searchQuery.toLowerCase();
    const filtered = allProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(lowerQ)) ||
      (p.author && p.author.toLowerCase().includes(lowerQ))
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && !filterRef.current?.contains(event.target)) {
        setIsFocused(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsAdvancedFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef, filterRef]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsFocused(false);
    setIsAdvancedFilterOpen(false);
    
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (filterCategory !== 'all') params.append('category', filterCategory);
    if (filterMinPrice) params.append('minPrice', filterMinPrice);
    if (filterMaxPrice) params.append('maxPrice', filterMaxPrice);
    
    navigate(`/search?${params.toString()}`);
  };

  // Highlight logic for right icons
  const isCartActive = location.pathname === '/cart';
  const isWishlistActive = location.pathname === '/wishlist';
  const isProfileActive = location.pathname === '/profile' || location.pathname === '/login' || location.pathname === '/register';

  const NavIconWrapper = ({ children, isActive, badgeCount }) => (
    <div className="relative flex items-center justify-center">
      {isActive && (
        <div className="absolute inset-0 w-12 h-12 -m-3 bg-cam-100 rounded-full animate-fade-in opacity-80 z-[-1]"></div>
      )}
      {children}
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {badgeCount}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Maintenance Mode Overlay */}
      {settings?.maintenance?.enabled && user?.role !== 'admin' && location.pathname !== '/login' && (
        <div className="fixed inset-0 z-[9999] bg-navy-900 flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center space-y-8 animate-zoom-in">
            <div className="w-24 h-24 bg-cam-100 text-cam-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cam-500/10">
              <Book className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-navy-900 tracking-tight">Hệ thống đang bảo trì</h2>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                "{settings.maintenance.message || 'Chúng tôi sẽ quay trở lại sớm nhất có thể.'}"
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              TayfBook System Maintenance
            </div>
          </div>
        </div>
      )}

      <header className="bg-white fixed top-0 left-0 right-0 z-50 py-4 border-b border-slate-200 shadow-sm transition-all">
        <div className="container mx-auto px-6 flex items-center justify-between gap-8">
          
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-5 shrink-0 group relative">
            <div className="relative">
              <img 
                src={settings?.logoUrl || "/logo.png"} 
                alt="TayfBook Logo" 
                className="h-14 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2" 
              />
              <div className="absolute -inset-2 bg-cam-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="hidden sm:flex flex-col border-l-2 border-slate-100 pl-5 py-1 transition-colors group-hover:border-cam-200">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1.5 transition-colors group-hover:text-cam-500">{settings?.siteName || 'TayfBook'}</span>
              <span className="text-lg font-headline font-black italic text-navy-900 tracking-tight group-hover:text-cam-600 transition-all duration-500">
                {settings?.siteSlogan || 'Đọc Để Khác Biệt'}
              </span>
            </div>
          </Link>
          
          {/* Search Bar - Removed for clarity in header redesign if needed, but keeping for now */}
          <div ref={filterRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="w-full flex relative items-center">
              <Search className="w-4 h-4 text-neutral absolute left-4" />
              <input 
                ref={searchRef}
                type="text" 
                placeholder="Tìm tên sách, tác giả, ISBN..." 
                className="w-full bg-slate-100 text-primary border border-transparent rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-secondary focus:bg-white placeholder-neutral text-sm transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
              />
              <button 
                type="button"
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                className={`absolute right-4 text-neutral hover:text-secondary transition-colors ${isAdvancedFilterOpen ? 'text-secondary' : ''}`}
                title="Lọc nâng cao"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </form>

            {/* Advanced Filter Dropdown (Redesigned) */}
            {isAdvancedFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100/80 p-8 z-50 animate-fade-in-up text-slate-800">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cam-50 text-cam-600 flex items-center justify-center shadow-inner">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-headline font-black text-navy-900 text-base uppercase tracking-tight">
                        Bộ lọc nâng cao
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tối ưu tìm kiếm tri thức</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsAdvancedFilterOpen(false)} 
                    className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all duration-300 hover:rotate-90 active:scale-95 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                      Danh mục tác phẩm
                    </label>
                    <div className="relative">
                      <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border border-slate-200/80 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-cam-500 bg-slate-50/50 focus:bg-white text-xs font-black text-navy-900 transition-all shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="all">TẤT CẢ DANH MỤC</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                      Khoảng giá mong muốn (VNĐ)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-1/2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">TỪ</span>
                        <input 
                          type="number" 
                          placeholder="0đ" 
                          min="0"
                          value={filterMinPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 0) setFilterMinPrice(val);
                          }}
                          className="w-full border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-cam-500 bg-slate-50/50 focus:bg-white text-xs font-black text-navy-900 transition-all shadow-inner"
                        />
                      </div>
                      <span className="text-slate-300 font-bold shrink-0">—</span>
                      <div className="relative w-1/2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">ĐẾN</span>
                        <input 
                          type="number" 
                          placeholder="Trở lên" 
                          min="0"
                          value={filterMaxPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || Number(val) >= 0) setFilterMaxPrice(val);
                          }}
                          className="w-full border border-slate-200/80 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-cam-500 bg-slate-50/50 focus:bg-white text-xs font-black text-navy-900 transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setFilterCategory('all');
                        setFilterMinPrice('');
                        setFilterMaxPrice('');
                      }}
                      className="flex-1 py-3.5 border border-slate-200 hover:border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:bg-rose-50/30 transition-all active:scale-95 duration-200 shadow-sm"
                    >
                      Xóa bộ lọc
                    </button>
                    <button 
                      type="button"
                      onClick={handleSearch}
                      className="flex-1 py-3.5 bg-gradient-to-r from-cam-500 to-cam-600 hover:from-cam-600 hover:to-cam-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-cam-500/20 active:scale-95"
                    >
                      Áp dụng lọc
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions (Logic remains same) */}
            {isFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 text-slate-800">
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {suggestions.map(product => (
                      <li key={product.id}>
                        <Link 
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setIsFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                        >
                          <img src={product.image} alt="" className="w-10 h-14 object-cover rounded shadow-sm" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-primary line-clamp-1">{product.name}</span>
                            <span className="text-xs text-secondary">{product.author || 'Đang cập nhật'}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button 
                        type="submit"
                        className="w-full text-center p-3 text-sm font-medium text-neutral hover:text-primary hover:bg-slate-50 bg-slate-50/50"
                      >
                        Xem tất cả kết quả cho "{searchQuery}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-neutral">
                    Không tìm thấy sách phù hợp
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right Navigation */}
          <div className="flex items-center gap-8 shrink-0">
            <nav className="hidden lg:flex items-center gap-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className={`transition-all ${location.pathname === '/' ? 'text-navy-900 border-b-2 border-cam-500 pb-1' : 'hover:text-cam-500'}`}>
                Trang Chủ
              </Link>
              <Link to="/book-hot" className={`transition-all ${location.pathname === '/book-hot' ? 'text-navy-900 border-b-2 border-cam-500 pb-1' : 'hover:text-cam-500'}`}>
                Sách Hot
              </Link>
              <Link to="/blog" className={`transition-all ${location.pathname === '/blog' ? 'text-navy-900 border-b-2 border-cam-500 pb-1' : 'hover:text-cam-500'}`}>
                Blog Sách
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <Link to="/wishlist">
                <NavIconWrapper isActive={isWishlistActive} badgeCount={wishlist.length}>
                  <Heart className={`w-5 h-5 transition-colors ${isWishlistActive ? 'text-secondary fill-current' : 'text-slate-400 hover:text-secondary'}`} />
                </NavIconWrapper>
              </Link>
              
              <Link to="/cart">
                <NavIconWrapper isActive={isCartActive} badgeCount={cartCount}>
                  <ShoppingCart className={`w-5 h-5 transition-colors ${isCartActive ? 'text-secondary fill-current' : 'text-slate-400 hover:text-secondary'}`} />
                </NavIconWrapper>
              </Link>
              
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to={(user.role === 'admin' || user.role === 'staff') ? '/admin' : '/profile'}>
                    <NavIconWrapper isActive={location.pathname === '/profile' || location.pathname === '/admin'}>
                      <div className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${(location.pathname === '/profile' || location.pathname === '/admin') ? 'border-secondary' : 'border-slate-200'}`}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.username}&background=f59e0b&color=fff`} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </NavIconWrapper>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <NavIconWrapper isActive={isProfileActive}>
                    <User className={`w-6 h-6 transition-colors ${isProfileActive ? 'text-secondary' : 'text-slate-400 hover:text-secondary'}`} />
                  </NavIconWrapper>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-slate-50 pt-[88px]">
        <Breadcrumbs />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-sm relative overflow-hidden border-t border-slate-900">
        {/* Decorative Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cam-500 via-cam-600 to-transparent"></div>
        
        {/* Background ambient glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cam-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cam-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 pt-20 pb-12 relative z-10">
          {/* Upper Section: Newsletter subscribe */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-slate-800/60 mb-16 items-center">
            <div className="lg:col-span-2">
              <h3 className="font-headline font-extrabold text-2xl text-white mb-2">Đăng ký nhận bản tin tri thức</h3>
              <p className="text-slate-400 text-sm font-medium">Nhận ngay thông tin sách mới, bài viết học thuật hấp dẫn và các chương trình ưu đãi đặc quyền.</p>
            </div>
            <div className="flex gap-2 w-full max-w-md lg:max-w-none">
              <input 
                type="email" 
                placeholder="Địa chỉ email của bạn..." 
                className="bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cam-500 focus:ring-1 focus:ring-cam-500 flex-grow transition-all"
              />
              <button className="bg-cam-500 hover:bg-cam-600 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-cam-500/20 hover:shadow-cam-500/35 whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>

          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Logo & Info */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center group self-start">
                <div className="bg-white px-4 py-2 rounded-2xl border border-slate-850 inline-flex items-center transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                  <img 
                    src={settings?.logoUrl || "/logo.png"} 
                    alt="TayfBook Logo" 
                    className="h-10 w-auto object-contain" 
                  />
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed font-medium italic text-[13.5px]">
                {settings?.aboutText || settings?.siteSlogan || 'TayfBook là cổng thông tin học thuật hiện đại, cung cấp kho tàng tri thức đa dạng cho cộng đồng học giả và người yêu sách.'} 
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {settings?.socialLinks && settings.socialLinks.length > 0 ? (
                  settings.socialLinks.map((link) => {
                    return (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-slate-900 border border-slate-800 hover:border-cam-500/50 hover:bg-cam-500 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-cam-500/20 hover:shadow-lg hover:-translate-y-1 duration-300"
                        title={link.platform}
                      >
                        <SocialIcon platform={link.platform} className="w-5 h-5" />
                      </a>
                    );
                  })
                ) : (
                  <div className="font-headline font-black text-2xl text-slate-800 tracking-widest opacity-50">TAYFBOOK</div>
                )}
              </div>
            </div>

            {/* Column 2: Sản phẩm */}
            <div>
              <h4 className="font-headline font-extrabold text-white uppercase tracking-[0.2em] text-[13px] mb-8 relative after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:w-8 after:h-[2px] after:bg-cam-500">
                Sản phẩm
              </h4>
              <ul className="space-y-4 text-[14px]">
                <li>
                  <Link to="/all-categories#cat-1" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Truyện tranh
                  </Link>
                </li>
                <li>
                  <Link to="/all-categories#cat-2" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Tiểu thuyết
                  </Link>
                </li>
                <li>
                  <Link to="/all-categories#cat-3" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Sách kỹ năng
                  </Link>
                </li>
                <li>
                  <Link to="/book-hot" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Sách bán chạy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Hỗ trợ */}
            <div>
              <h4 className="font-headline font-extrabold text-white uppercase tracking-[0.2em] text-[13px] mb-8 relative after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:w-8 after:h-[2px] after:bg-cam-500">
                Hỗ trợ
              </h4>
              <ul className="space-y-4 text-[14px]">
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Liên hệ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Chính sách vận chuyển
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Tra cứu đơn hàng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Pháp lý */}
            <div>
              <h4 className="font-headline font-extrabold text-white uppercase tracking-[0.2em] text-[13px] mb-8 relative after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:w-8 after:h-[2px] after:bg-cam-500">
                Pháp lý
              </h4>
              <ul className="space-y-4 text-[14px]">
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-400 hover:text-cam-500 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1.5 font-semibold">
                    <span className="text-[10px] text-cam-500">✦</span> Bản quyền nội dung
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-slate-400 font-bold text-xs">
              <span className="flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-pointer">
                <Mail className="w-4 h-4 text-cam-500" /> {settings?.contact?.email}
              </span>
              <span className="flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-pointer">
                <Phone className="w-4 h-4 text-cam-500" /> {settings?.contact?.phone}
              </span>
              <span className="hidden lg:flex items-center gap-2 hover:text-white transition-colors duration-200 cursor-pointer">
                <MapPin className="w-4 h-4 text-cam-500" /> {settings?.contact?.address}
              </span>
            </div>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} {settings?.siteName || 'TayfBook'} v2.0 - Phục vụ 24/7
            </p>
          </div>
        </div>
      </footer>
      <ClientChatBubble user={user} />
    </div>
  );
};

export default ClientLayout;
