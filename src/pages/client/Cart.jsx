import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-4">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-navy-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-400 font-medium mb-10 text-center max-w-sm">Có vẻ như bạn chưa chọn được cuốn sách ưng ý nào. Hãy quay lại cửa hàng để khám phá nhé!</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-navy-900 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-navy-900/20 hover:bg-navy-800 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-cam-500" /> Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-black text-navy-900 tracking-tight">Giỏ hàng <span className="text-slate-300">({cart.length})</span></h1>
        <Link to="/" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-cam-500 flex items-center gap-2 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Tiếp tục mua sắm
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Cart Items */}
        <div className="lg:flex-1 space-y-6">
          <div className="grid grid-cols-12 px-8 py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            <div className="col-span-7">Sản phẩm</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-3 text-right">Thành tiền</div>
          </div>
          
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                <div className="grid grid-cols-12 gap-8 items-center">
                  <div className="col-span-12 sm:col-span-7 flex gap-6">
                    <div className="w-24 h-32 bg-slate-50 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <h3 className="text-lg font-black text-navy-900 line-clamp-2 leading-tight group-hover:text-cam-600 transition-colors">{item.name}</h3>
                      <p className="text-sm font-bold text-slate-400">{formatCurrency(item.price)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors mt-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Gỡ bỏ
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-2">
                    <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-navy-900 hover:bg-white rounded-lg transition-all"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center text-sm font-black text-navy-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-navy-900 hover:bg-white rounded-lg transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3 text-right">
                    <span className="text-lg font-black text-navy-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-cam-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-cam-100/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-cam-600 shadow-sm">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-navy-900 leading-none mb-1">Mã giảm giá</h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ưu đãi dành riêng cho bạn</p>
              </div>
            </div>
            <div className="flex-1 flex gap-4 w-full md:max-w-xs">
              <input 
                type="text" 
                placeholder="Nhập mã ưu đãi..." 
                className="flex-1 bg-white border-none rounded-2xl px-6 py-3.5 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none shadow-sm"
              />
              <button className="bg-navy-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-navy-800 transition-all shadow-lg active:scale-95">Áp dụng</button>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:w-[400px]">
          <div className="bg-navy-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-navy-900/30 sticky top-32">
            <h2 className="text-2xl font-black mb-8 tracking-tight">Tổng thanh toán</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                <span>Tạm tính</span>
                <span className="text-white">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                <span>Phí vận chuyển</span>
                <span className="text-green-400">Miễn phí</span>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-widest text-slate-400">Tổng cộng</span>
                <span className="text-4xl font-black text-cam-500 leading-none">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout"
              className="w-full bg-cam-500 hover:bg-cam-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-cam-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              Thanh toán ngay
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-relaxed">
              Vận chuyển nhanh chóng & Bảo mật tuyệt đối <br/> bởi hệ thống TayfBook
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
