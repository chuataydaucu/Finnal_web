import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
  StickyNote
} from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user ? (user.fullName || user.username) : '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (cart.length === 0 && !showSuccessModal) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.address) {
      setError('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    setError('');

    const newOrder = {
      ...formData,
      userId: user ? user.id : null,
      total: cartTotal,
      items: cart,
      paymentMethod,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        clearCart();
        setShowSuccessModal(true);
      } else {
        setError('Lỗi hệ thống. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Không thể kết nối đến hệ thống thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-12">
        <Link to="/cart" className="hover:text-navy-900 transition-colors">Giỏ hàng</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-900">Thanh toán</span>
      </nav>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
        {/* Left: Form */}
        <div className="lg:flex-1">
          <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-12">Thông tin thanh toán</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="w-3 h-3" /> Họ và tên *
              </label>
              <input 
                type="text" name="customerName" required 
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                value={formData.customerName} onChange={handleChange} placeholder="Nhập họ và tên người nhận"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Phone className="w-3 h-3" /> Số điện thoại *
              </label>
              <input 
                type="tel" name="phone" required 
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                value={formData.phone} onChange={handleChange} placeholder="Nhập số điện thoại"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Địa chỉ Email *
              </label>
              <input 
                type="email" name="email" required 
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all"
                value={formData.email} onChange={handleChange} placeholder="example@gmail.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Địa chỉ giao hàng *
              </label>
              <textarea 
                name="address" required rows="3"
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all resize-none"
                value={formData.address} onChange={handleChange} placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <StickyNote className="w-3 h-3" /> Ghi chú đơn hàng (Tùy chọn)
              </label>
              <textarea 
                name="note" rows="2"
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm transition-all resize-none"
                value={formData.note} onChange={handleChange} placeholder="Lời nhắn cho shipper hoặc cửa hàng..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-[450px]">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 sticky top-32">
            <h2 className="text-2xl font-black text-navy-900 tracking-tight mb-8">Đơn hàng của bạn</h2>
            
            <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-4 scrollbar-hide">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-navy-900 truncate mb-1">{item.name}</h4>
                    <p className="text-xs font-bold text-slate-400">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <span className="text-sm font-black text-navy-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100 mb-8">
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>Tạm tính</span>
                <span className="text-navy-900">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>Giao hàng</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng cộng</span>
                <span className="text-3xl font-black text-cam-500 leading-none">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 mb-10">
              <label className={`block relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-cam-500 bg-cam-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-cam-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-cam-500 rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-3 font-black text-navy-900 text-sm">
                    <Truck className="w-4 h-4 text-cam-500" />
                    Thanh toán khi nhận hàng (COD)
                  </div>
                </div>
              </label>
              
              <label className={`block relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'bank' ? 'border-cam-500 bg-cam-50/30' : 'border-slate-100 hover:border-slate-200'}`}>
                <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="hidden" />
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-cam-500' : 'border-slate-300'}`}>
                    {paymentMethod === 'bank' && <div className="w-2.5 h-2.5 bg-cam-500 rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-3 font-black text-navy-900 text-sm">
                    <CreditCard className="w-4 h-4 text-cam-500" />
                    Chuyển khoản ngân hàng
                  </div>
                </div>
              </label>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-navy-900/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Thanh toán an toàn 100%
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => navigate('/')} title="Thành công!">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-navy-900 mb-4">Đặt hàng thành công!</h3>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Cảm ơn bạn đã tin tưởng TayfBook. <br/> Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-navy-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-navy-800 transition-all"
          >
            Về trang chủ
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
