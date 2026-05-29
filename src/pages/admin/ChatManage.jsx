import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  User, 
  MessageSquare, 
  CheckCheck,
  Clock,
  Sparkles,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatManage = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeThreadId, threads]);

  const fetchThreads = async () => {
    try {
      const res = await fetch('http://localhost:3000/chats');
      const data = await res.json();
      // Sort threads by updatedAt descending
      const sorted = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setThreads(sorted);
      if (sorted.length > 0 && !activeThreadId) {
        setActiveThreadId(sorted[0].id);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading chat threads:", err);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      sender: 'staff',
      text: replyText.trim(),
      time: new Date().toISOString()
    };

    const updatedMessages = [...activeThread.messages, newMessage];
    const updatedThread = {
      ...activeThread,
      messages: updatedMessages,
      lastMessage: replyText.trim(),
      updatedAt: new Date().toISOString(),
      unread: false
    };

    // Update locally immediately for instant feedback
    setThreads(threads.map(t => t.id === activeThread.id ? updatedThread : t));
    setReplyText('');

    try {
      await fetch(`http://localhost:3000/chats/${activeThread.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedThread)
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  const handleSelectThread = async (thread) => {
    setActiveThreadId(thread.id);
    if (thread.unread) {
      const updatedThread = { ...thread, unread: false };
      setThreads(threads.map(t => t.id === thread.id ? updatedThread : t));
      try {
        await fetch(`http://localhost:3000/chats/${thread.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedThread)
        });
      } catch (err) {
        console.error("Error marking chat read:", err);
      }
    }
  };

  const filteredThreads = threads.filter(t => 
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cannedReplies = [
    "Dạ chào bạn, sách này hiện đang còn hàng ạ!",
    "Đơn hàng của bạn đang được đóng gói và giao sớm nhé.",
    "Cảm ơn bạn đã phản hồi, shop có thể hỗ trợ gì thêm không?",
    "Thông tin chuyển khoản của shop là: Techcombank - 1903xxx..."
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Hộp thư hỗ trợ</h1>
        <p className="text-slate-500 font-medium">Trò chuyện trực tuyến và hỗ trợ khách hàng mua sách.</p>
      </div>

      <div className="flex flex-row gap-6 h-[72vh] min-h-[500px] w-full">
        {/* Thread Sidebar */}
        <div className="w-80 shrink-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-6 border-b border-slate-50 space-y-4">
            <h2 className="text-lg font-black text-navy-900">Cuộc hội thoại</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm khách hàng hoặc tin nhắn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-cam-500 outline-none text-slate-800"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {filteredThreads.map(thread => {
              const isActive = thread.id === activeThreadId;
              const formattedTime = new Date(thread.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelectThread(thread)}
                  className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/10' 
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img 
                      src={thread.avatar} 
                      alt={thread.customerName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100" 
                    />
                    {thread.unread && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-cam-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-white">
                        !
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-black text-sm truncate ${isActive ? 'text-white' : 'text-navy-900'}`}>
                        {thread.customerName}
                      </h4>
                      <span className={`text-[10px] ${isActive ? 'text-slate-400' : 'text-slate-400'} font-bold`}>
                        {formattedTime}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${isActive ? 'text-slate-300' : 'text-slate-500'} font-medium`}>
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
            {filteredThreads.length === 0 && (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto opacity-55" />
                <p className="text-xs font-bold italic">Không tìm thấy hội thoại nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Chat Pane */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full">
          {activeThread ? (
            <>
              {/* Chat Pane Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <img 
                    src={activeThread.avatar} 
                    alt={activeThread.customerName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100" 
                  />
                  <div>
                    <h3 className="font-black text-navy-900 text-base leading-none mb-1">{activeThread.customerName}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-slate-400 font-bold">Khách hàng trực tuyến</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 space-y-4">
                {activeThread.messages.map((msg, i) => {
                  const isStaff = msg.sender === 'staff';
                  const formattedTime = new Date(msg.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={msg.id || i} className={`flex ${isStaff ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[70%] rounded-3xl px-5 py-3.5 shadow-sm space-y-1.5 ${
                        isStaff 
                          ? 'bg-navy-900 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                      }`}>
                        <p className="text-sm font-medium leading-relaxed break-words">{msg.text}</p>
                        <div className={`flex items-center gap-1.5 text-[9px] font-bold ${isStaff ? 'text-slate-400 justify-end' : 'text-slate-400'}`}>
                          <span>{formattedTime}</span>
                          {isStaff && <CheckCheck className="w-3.5 h-3.5 text-cam-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Panel */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 shrink-0 overflow-x-auto whitespace-nowrap flex gap-2 custom-scrollbar">
                <div className="flex items-center gap-1 text-[10px] text-cam-600 font-bold uppercase tracking-wider mr-2 bg-cam-50 px-2 py-1 rounded-lg shrink-0">
                  <Sparkles className="w-3 h-3" /> Trả lời nhanh:
                </div>
                {cannedReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => setReplyText(reply)}
                    className="text-xs bg-white text-slate-600 font-semibold border border-slate-200 px-3.5 py-1.5 rounded-full hover:border-cam-500 hover:text-cam-600 transition-all shrink-0 active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-50 flex items-center gap-4 shrink-0">
                <input
                  type="text"
                  placeholder={`Trả lời ${activeThread.customerName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-cam-500 outline-none text-slate-800 font-medium"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-4 bg-cam-500 hover:bg-cam-600 disabled:opacity-50 disabled:hover:bg-cam-500 text-navy-900 rounded-2xl transition-all shadow-lg shadow-cam-500/20 flex items-center justify-center shrink-0 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-4">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="font-black text-navy-900 text-lg mb-1">Chưa chọn cuộc hội thoại</h3>
                <p className="text-xs text-slate-500 font-medium">Hãy chọn một khách hàng ở thanh bên để bắt đầu tư vấn.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManage;
