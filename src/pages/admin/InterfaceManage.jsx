import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  Image as ImageIcon, 
  Book, 
  Layout, 
  Sparkles, 
  CheckCircle,
  Settings as SettingsIcon,
  Globe,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  Check,
  Info,
  Share2,
  Plus,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const InterfaceManage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);

  if (user && user.role !== 'admin') {
    return (
      <div className="h-[70vh] flex items-center justify-center p-6 animate-fade-in-up">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-lg border border-slate-100 rounded-[2.5rem] p-10 text-center shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
          
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-navy-900 tracking-tight mb-4">
            Từ chối truy cập
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Xin lỗi, tài khoản của bạn (vai trò <span className="font-bold text-navy-900">{user.role === 'staff' ? 'Nhân viên' : user.role}</span>) không được phân quyền truy cập trang quản lý cài đặt hệ thống này.
          </p>

          <Link 
            to="/admin" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-navy-900 text-white font-black rounded-2xl hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 active:scale-95"
          >
            Quay lại bảng điều khiển
          </Link>
        </div>
      </div>
    );
  }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/settings').then(res => res.json()),
      fetch('http://localhost:3000/products').then(res => res.json())
    ]).then(([settingsData, productsData]) => {
      setSettings(settingsData);
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:3000/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setMessage('Đã lưu cấu hình hệ thống thành công!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: { ...settings[section], [field]: value }
      });
    } else {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSocialChange = (id, field, value) => {
    const updated = (settings.socialLinks || []).map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    setSettings({ ...settings, socialLinks: updated });
  };

  const handleAddSocial = () => {
    const newLink = {
      id: Date.now().toString(),
      platform: 'Facebook',
      url: ''
    };
    const current = settings.socialLinks || [];
    setSettings({ ...settings, socialLinks: [...current, newLink] });
  };

  const handleRemoveSocial = (id) => {
    const updated = (settings.socialLinks || []).filter(link => link.id !== id);
    setSettings({ ...settings, socialLinks: updated });
  };

  const toggleFeaturedId = (id) => {
    const current = settings.homeFeaturedIds || [];
    const next = current.includes(id) 
      ? current.filter(i => i !== id) 
      : [...current, id];
    setSettings({ ...settings, homeFeaturedIds: next });
  };

  const moveFeatured = (index, direction) => {
    const list = [...(settings.homeFeaturedIds || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setSettings({ ...settings, homeFeaturedIds: list });
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">Đang tải cấu hình hệ thống...</p>
    </div>
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: Globe },
    { id: 'appearance', label: 'Giao diện & Tiêu điểm', icon: Layout },
    { id: 'system', label: 'Thông báo & Hệ thống', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-navy-900 text-cam-500 rounded-xl">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-navy-900 tracking-tight">Cài đặt hệ thống</h1>
          </div>
          <p className="text-slate-500 font-medium">Quản lý cấu hình toàn diện, giao diện và thông tin vận hành của TayfBook.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-10 py-4 bg-navy-900 text-white font-black rounded-2xl hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 active:scale-95 disabled:opacity-50 group"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-cam-500 group-hover:scale-110 transition-transform" />}
          Lưu thay đổi
        </button>
      </div>

      {message && (
        <div className="bg-green-50 text-green-600 p-5 rounded-[1.5rem] border border-green-100 flex items-center gap-4 animate-zoom-in shadow-sm">
          <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
            <Check className="w-6 h-6" />
          </div>
          <span className="font-bold">{message}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-100/50 rounded-3xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-navy-900 shadow-md' 
                : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-cam-500' : 'text-slate-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Tab Content: General */}
        {activeTab === 'general' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Định danh trang web */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center gap-3 text-navy-900 font-black">
                  <Globe className="w-6 h-6 text-cam-500" />
                  <h2 className="text-xl">Định danh trang web</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên Website</label>
                    <input 
                      type="text"
                      value={settings.siteName || ''}
                      onChange={(e) => handleChange(null, 'siteName', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Slogan (Câu khẩu hiệu)</label>
                    <input 
                      type="text"
                      value={settings.siteSlogan || ''}
                      onChange={(e) => handleChange(null, 'siteSlogan', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 italic"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logo Website (URL)</label>
                    <div className="flex gap-4">
                      <input 
                        type="text"
                        value={settings.logoUrl || ''}
                        onChange={(e) => handleChange(null, 'logoUrl', e.target.value)}
                        className="flex-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 text-sm"
                        placeholder="/logo.png"
                      />
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                        <img src={settings.logoUrl || "/logo.png"} alt="Preview Logo" className="w-full h-full object-contain" onError={(e) => e.target.src = "/logo.png"} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả chân trang (Giới thiệu)</label>
                    <textarea 
                      value={settings.aboutText || ''}
                      onChange={(e) => handleChange(null, 'aboutText', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 min-h-[100px] leading-relaxed"
                      placeholder="Mô tả ngắn gọn hiển thị ở chân trang..."
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center gap-3 text-navy-900 font-black">
                  <Mail className="w-6 h-6 text-cam-500" />
                  <h2 className="text-xl">Thông tin liên hệ</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email liên hệ</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
                      <input 
                        type="email"
                        value={settings.contact?.email || ''}
                        onChange={(e) => handleChange('contact', 'email', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
                        placeholder="Email liên hệ"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số điện thoại</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
                      <input 
                        type="text"
                        value={settings.contact?.phone || ''}
                        onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
                        placeholder="Số điện thoại"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Địa chỉ trụ sở</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
                      <textarea 
                        value={settings.contact?.address || ''}
                        onChange={(e) => handleChange('contact', 'address', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 min-h-[120px]"
                        placeholder="Địa chỉ trụ sở"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-navy-900 font-black">
                  <Share2 className="w-6 h-6 text-cam-500" />
                  <h2 className="text-xl">Liên kết mạng xã hội</h2>
                </div>
                <button 
                  onClick={handleAddSocial}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cam-50 text-cam-600 hover:bg-cam-100 font-black text-xs rounded-xl transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Thêm liên kết
                </button>
              </div>

              {settings.socialLinks && settings.socialLinks.length > 0 ? (
                <div className="space-y-4">
                  {settings.socialLinks.map((link, index) => (
                    <div key={link.id || index} className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-slate-200">
                      <div className="w-full sm:w-1/4">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nền tảng</label>
                        <select 
                          value={link.platform}
                          onChange={(e) => handleSocialChange(link.id, 'platform', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all text-sm cursor-pointer"
                        >
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Youtube">Youtube</option>
                          <option value="Twitter">Twitter/X</option>
                          <option value="Github">Github</option>
                          <option value="Linkedin">LinkedIn</option>
                          <option value="Globe">Website/Khác</option>
                        </select>
                      </div>
                      <div className="w-full sm:flex-1">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Địa chỉ liên kết (URL)</label>
                        <input 
                          type="url"
                          value={link.url}
                          onChange={(e) => handleSocialChange(link.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="pt-5 sm:pt-0 shrink-0">
                        <button 
                          onClick={() => handleRemoveSocial(link.id)}
                          className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all active:scale-95 shadow-sm hover:shadow"
                          title="Xóa liên kết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold text-sm">
                  Chưa cấu hình liên kết mạng xã hội nào. Nhấp "Thêm liên kết" để bắt đầu.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 text-navy-900 font-black mb-8">
                <Layout className="w-6 h-6 text-cam-500" />
                <h2 className="text-xl">Cấu hình Hero Banner (Đầu trang)</h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Headline (Tiêu đề chính)</label>
                    <textarea 
                      value={settings.heroBanner.headline}
                      onChange={(e) => handleChange('heroBanner', 'headline', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-black text-navy-900 min-h-[120px] text-lg leading-tight uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sub Headline (Tiêu đề phụ)</label>
                    <input 
                      type="text"
                      value={settings.heroBanner.subHeadline}
                      onChange={(e) => handleChange('heroBanner', 'subHeadline', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hình ảnh Banner</label>
                    <div className="flex gap-4">
                      <input 
                        type="text"
                        value={settings.heroBanner.image}
                        onChange={(e) => handleChange('heroBanner', 'image', e.target.value)}
                        className="flex-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-medium text-slate-500 text-xs"
                      />
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md">
                        <img src={settings.heroBanner.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sách đề cử nổi bật</label>
                    <select 
                      value={settings.heroBanner.featuredBookId}
                      onChange={(e) => handleChange('heroBanner', 'featuredBookId', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-black text-navy-900 appearance-none cursor-pointer"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-navy-900 font-black">
                  <Sparkles className="w-6 h-6 text-cam-500" />
                  <h2 className="text-xl">Sách tiêu biểu trên trang chủ</h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-cam-50 text-cam-600 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest">Đã chọn:</span>
                  <span className="text-sm font-black">{settings.homeFeaturedIds.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Cột trái: Thứ tự hiển thị thực tế (Bố cục Trang chủ) */}
                <div className="lg:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Bố cục trang chủ</span>
                      <span className="text-sm font-black text-navy-900">Thứ tự hiển thị ({settings.homeFeaturedIds.length})</span>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-navy-900 text-white px-3 py-1 rounded-full">Sắp xếp</span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                    {settings.homeFeaturedIds.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 p-6 border-2 border-dashed border-slate-200 rounded-2xl">
                        <Book className="w-10 h-10 mb-3 opacity-40 animate-pulse text-cam-500" />
                        <p className="text-xs font-black uppercase tracking-wider mb-1">Chưa chọn sách nào</p>
                        <p className="text-[10px] text-slate-400 font-medium">Click vào kho sách bên phải để chọn sách tiêu biểu</p>
                      </div>
                    ) : (
                      settings.homeFeaturedIds.map((id, index) => {
                        const product = products.find(p => p.id === id);
                        if (!product) return null;

                        // Xác định vai trò hiển thị dựa trên index
                        let roleBadge = null;
                        if (index === 0) {
                          roleBadge = { text: 'Banner chính (Hero)', bg: 'bg-rose-500 text-white animate-pulse' };
                        } else if (index >= 1 && index <= 4) {
                          roleBadge = { text: 'Lưới phụ (Top)', bg: 'bg-amber-500 text-white' };
                        } else {
                          roleBadge = { text: 'Lưới đề xuất dưới', bg: 'bg-emerald-500 text-white' };
                        }

                        return (
                          <div 
                            key={id}
                            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                              {index + 1}
                            </div>
                            
                            <img src={product.image} className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0 border border-slate-100" alt="" />
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-xs text-navy-900 line-clamp-1 group-hover:text-cam-600 transition-colors uppercase tracking-tight">{product.name}</p>
                              {roleBadge && (
                                <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-md mt-1 tracking-wider ${roleBadge.bg}`}>
                                  {roleBadge.text}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Nút lên */}
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveFeatured(index, 'up')}
                                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              
                              {/* Nút xuống */}
                              <button
                                type="button"
                                disabled={index === settings.homeFeaturedIds.length - 1}
                                onClick={() => moveFeatured(index, 'down')}
                                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>

                              {/* Nút hủy chọn */}
                              <button
                                type="button"
                                onClick={() => toggleFeaturedId(id)}
                                className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Cột phải: Kho sách khả dụng */}
                <div className="lg:col-span-7 flex flex-col">
                  {/* Thanh tìm kiếm */}
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm sách theo tên hoặc tác giả..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-cam-500 font-medium text-xs text-navy-900 bg-slate-50/50 focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar p-1 bg-slate-50/30 rounded-2xl border border-slate-100/50">
                    {filteredProducts.map(p => {
                      const isSelected = settings.homeFeaturedIds.includes(p.id);
                      return (
                        <div 
                          key={p.id}
                          onClick={() => toggleFeaturedId(p.id)}
                          className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.02] active:scale-98 ${
                            isSelected 
                              ? 'bg-navy-900 border-navy-900 text-white shadow-xl shadow-navy-900/20' 
                              : 'bg-slate-50 border-white text-navy-900 hover:border-cam-200 shadow-sm'
                          }`}
                        >
                          <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-white/20 shadow-md">
                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-xs line-clamp-1 group-hover:text-cam-500 transition-colors uppercase tracking-tight">{p.name}</p>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                              {p.author || 'Tác giả'}
                            </p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-cam-500 border-cam-500 text-white rotate-0' : 'border-slate-300 text-transparent rotate-90'
                          }`}>
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-full h-64 flex flex-col items-center justify-center text-center text-slate-400 p-6">
                        <Book className="w-8 h-8 mb-2 opacity-30 animate-bounce" />
                        <p className="text-xs font-black uppercase tracking-wider">Không tìm thấy sách phù hợp</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: System */}
        {activeTab === 'system' && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8 overflow-hidden relative">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-navy-900 font-black">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl">Chế độ bảo trì</h2>
                </div>
                <button 
                  onClick={() => handleChange('maintenance', 'enabled', !settings.maintenance.enabled)}
                  className={`w-14 h-7 rounded-full p-1 transition-all ${settings.maintenance.enabled ? 'bg-red-500' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${settings.maintenance.enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className={`space-y-6 relative z-10 transition-opacity ${settings.maintenance.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
                  <Info className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-medium text-red-600 leading-relaxed">
                    Khi kích hoạt, người dùng sẽ không thể truy cập trang web. Họ sẽ thấy thông điệp bảo trì bên dưới.
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thông điệp hiển thị</label>
                  <textarea 
                    value={settings.maintenance.message}
                    onChange={(e) => handleChange('maintenance', 'message', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-navy-900 min-h-[100px]"
                  />
                </div>
              </div>
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-2xl transition-opacity ${settings.maintenance.enabled ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterfaceManage;
