import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderHistory from './OrderHistory';
import { 
  User, 
  Key, 
  Save, 
  Package, 
  Phone, 
  MapPin, 
  Mail,
  LogOut,
  Camera,
  ChevronRight,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'orders', 'security'
  
  const [infoData, setInfoData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    gender: user?.gender || 'nam'
  });
  const [infoMessage, setInfoMessage] = useState({ text: '', type: '' });
  const [infoLoading, setInfoLoading] = useState(false);

  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });
  const [passLoading, setPassLoading] = useState(false);

  if (!user) return null;

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setInfoMessage({ text: '', type: '' });
    setInfoLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infoData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setInfoMessage({ text: 'Cập nhật thông tin thành công!', type: 'success' });
      } else {
        setInfoMessage({ text: 'Lỗi khi cập nhật thông tin.', type: 'error' });
      }
    } catch (err) {
      setInfoMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassMessage({ text: '', type: '' });

    if (passData.new !== passData.confirm) {
      setPassMessage({ text: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }

    setPassLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passData.new })
      });

      if (response.ok) {
        setPassMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
        setPassData({ current: '', new: '', confirm: '' });
      } else {
        setPassMessage({ text: 'Lỗi khi cập nhật mật khẩu.', type: 'error' });
      }
    } catch (err) {
      setPassMessage({ text: 'Lỗi kết nối máy chủ.', type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
            {/* Header / Avatar */}
            <div className="p-10 text-center bg-navy-900 relative">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-cam-500 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white border-4 border-white shadow-xl">
                  {user.username[0].toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-navy-900 rounded-xl flex items-center justify-center shadow-lg hover:bg-cam-500 hover:text-white transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{user.fullName || user.username}</h2>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">Thành viên TayfBook</p>
            </div>

            {/* Nav */}
            <nav className="p-4 space-y-2">
              <button 
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'info' ? 'bg-cam-50 text-cam-600' : 'text-slate-400 hover:bg-slate-50 hover:text-navy-900'}`}
              >
                <div className="flex items-center gap-4">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">Hồ sơ cá nhân</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'info' ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>
              
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'orders' ? 'bg-cam-50 text-cam-600' : 'text-slate-400 hover:bg-slate-50 hover:text-navy-900'}`}
              >
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">Lịch sử đơn hàng</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>

              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'security' ? 'bg-cam-50 text-cam-600' : 'text-slate-400 hover:bg-slate-50 hover:text-navy-900'}`}
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">Bảo mật</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'security' ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>

              <div className="pt-4 mt-4 border-t border-slate-50">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">Đăng xuất</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50 min-h-[600px]">
            {activeTab === 'info' && (
              <div className="animate-fade-in-up">
                <h3 className="text-3xl font-black text-navy-900 tracking-tight mb-10">Thông tin hồ sơ</h3>
                <form onSubmit={handleUpdateInfo} className="space-y-8 max-w-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <User className="w-3 h-3" /> Họ và tên của bạn
                      </label>
                      <input 
                        type="text" required 
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                        value={infoData.fullName} onChange={(e) => setInfoData({...infoData, fullName: e.target.value})} placeholder="Nhập tên đầy đủ"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Địa chỉ Email
                      </label>
                      <input 
                        type="email" required 
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                        value={infoData.email} onChange={(e) => setInfoData({...infoData, email: e.target.value})} placeholder="example@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Số điện thoại
                      </label>
                      <input 
                        type="tel" required 
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                        value={infoData.phone} onChange={(e) => setInfoData({...infoData, phone: e.target.value})} placeholder="09xxxxxxx"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Địa chỉ nhận hàng
                      </label>
                      <textarea 
                        rows="3"
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all resize-none"
                        value={infoData.address} onChange={(e) => setInfoData({...infoData, address: e.target.value})} placeholder="Số nhà, tên đường, khu vực..."
                      ></textarea>
                    </div>
                  </div>

                  {infoMessage.text && (
                    <div className={`p-4 rounded-2xl text-xs font-bold border ${infoMessage.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {infoMessage.text}
                    </div>
                  )}

                  <button 
                    type="submit" disabled={infoLoading}
                    className="bg-navy-900 hover:bg-navy-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-navy-900/20 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5 text-cam-500" />
                    {infoLoading ? 'Đang lưu...' : 'Cập nhật thông tin'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fade-in-up">
                <h3 className="text-3xl font-black text-navy-900 tracking-tight mb-10">Lịch sử đơn hàng</h3>
                <OrderHistory />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in-up">
                <h3 className="text-3xl font-black text-navy-900 tracking-tight mb-10">Bảo mật tài khoản</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-md">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mật khẩu mới</label>
                    <input 
                      type="password" required 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                      value={passData.new} onChange={(e) => setPassData({...passData, new: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" required 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                      value={passData.confirm} onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                    />
                  </div>

                  {passMessage.text && (
                    <div className={`p-4 rounded-2xl text-xs font-bold border ${passMessage.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {passMessage.text}
                    </div>
                  )}

                  <button 
                    type="submit" disabled={passLoading}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-navy-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-5 h-5 text-cam-500" />
                    {passLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
