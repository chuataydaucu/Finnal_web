import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Image as ImageIcon, Book, Layout, Sparkles, CheckCircle } from 'lucide-react';

const InterfaceManage = () => {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
        setMessage('Đã lưu thay đổi giao diện thành công!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setSettings({
      ...settings,
      heroBanner: { ...settings.heroBanner, [field]: value }
    });
  };

  const toggleFeaturedId = (id) => {
    const current = settings.homeFeaturedIds;
    const next = current.includes(id) 
      ? current.filter(i => i !== id) 
      : [...current, id];
    setSettings({ ...settings, homeFeaturedIds: next });
  };

  if (loading) return <div className="p-8">Đang tải cấu hình...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-headline font-black text-navy-900 mb-2">Quản lý giao diện</h1>
          <p className="text-slate-500">Tùy chỉnh nội dung hiển thị trên trang chủ và các khu vực tiêu điểm.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-4 bg-cam-500 text-white font-black rounded-2xl hover:bg-cam-600 transition-all shadow-xl shadow-cam-500/20 active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Lưu cấu hình
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Hero Section Config */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 text-navy-900 font-black mb-4">
            <Layout className="w-6 h-6 text-cam-500" />
            <h2 className="text-xl">Hero Banner (Đầu trang)</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Headline (Tiêu đề chính)</label>
              <textarea 
                value={settings.heroBanner.headline}
                onChange={(e) => handleHeroChange('headline', e.target.value)}
                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900 min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Sub Headline (Tiêu đề phụ)</label>
              <input 
                type="text"
                value={settings.heroBanner.subHeadline}
                onChange={(e) => handleHeroChange('subHeadline', e.target.value)}
                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">URL Hình ảnh</label>
              <div className="flex gap-4">
                <input 
                  type="text"
                  value={settings.heroBanner.image}
                  onChange={(e) => handleHeroChange('image', e.target.value)}
                  className="flex-1 bg-slate-50 border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-medium text-navy-900"
                />
                <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                  <img src={settings.heroBanner.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Sách đề cử (Featured ID)</label>
              <select 
                value={settings.heroBanner.featuredBookId}
                onChange={(e) => handleHeroChange('featuredBookId', e.target.value)}
                className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-cam-500 outline-none transition-all font-bold text-navy-900"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Home Featured Config */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-navy-900 font-black">
              <Sparkles className="w-6 h-6 text-cam-500" />
              <h2 className="text-xl">Sách tiêu biểu (Home Featured)</h2>
            </div>
            <span className="bg-cam-100 text-cam-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              {settings.homeFeaturedIds.length} đã chọn
            </span>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {products.map(p => {
              const isSelected = settings.homeFeaturedIds.includes(p.id);
              return (
                <div 
                  key={p.id}
                  onClick={() => toggleFeaturedId(p.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-navy-900 border-navy-900 text-white' : 'bg-slate-50 border-slate-100 text-navy-900 hover:border-cam-200'
                  }`}
                >
                  <img src={p.image} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>ID: {p.id}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-cam-500 border-cam-500 text-white' : 'border-slate-300'}`}>
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceManage;
