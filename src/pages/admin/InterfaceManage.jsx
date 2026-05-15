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
  Info
} from 'lucide-react';

const InterfaceManage = () => {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

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

  const toggleFeaturedId = (id) => {
    const current = settings.homeFeaturedIds || [];
    const next = current.includes(id) 
      ? current.filter(i => i !== id) 
      : [...current, id];
    setSettings({ ...settings, homeFeaturedIds: next });
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">Đang tải cấu hình hệ thống...</p>
    </div>
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
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
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
                    value={settings.siteName}
                    onChange={(e) => handleChange(null, 'siteName', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Slogan (Câu khẩu hiệu)</label>
                  <input 
                    type="text"
                    value={settings.siteSlogan}
                    onChange={(e) => handleChange(null, 'siteSlogan', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 italic"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-3 text-navy-900 font-black">
                <Mail className="w-6 h-6 text-cam-500" />
                <h2 className="text-xl">Thông tin liên hệ</h2>
              </div>
              <div className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
                  <input 
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => handleChange('contact', 'email', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
                    placeholder="Email liên hệ"
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
                  <input 
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
                    placeholder="Số điện thoại"
                  />
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
                  <textarea 
                    value={settings.contact.address}
                    onChange={(e) => handleChange('contact', 'address', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 min-h-[80px]"
                    placeholder="Địa chỉ trụ sở"
                  />
                </div>
              </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar p-1">
                {products.map(p => {
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
                        <p className="font-black text-xs line-clamp-1 group-hover:text-cam-500 transition-colors">{p.name}</p>
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
