import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
          <Heart className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-headline font-black text-navy-900 mb-4">Danh sách yêu thích trống</h1>
        <p className="text-slate-500 mb-10 max-w-md mx-auto">
          Hãy thêm những cuốn sách bạn yêu thích vào danh sách này để dễ dàng theo dõi và mua sắm sau.
        </p>
        <Link to="/" className="inline-flex items-center gap-3 px-10 py-4 bg-navy-900 text-white font-black rounded-2xl hover:bg-cam-500 transition-all transform hover:-translate-y-1 shadow-xl">
          Tiếp tục khám phá <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl">
        <h1 className="font-headline font-black text-5xl text-navy-900 mb-6 leading-tight">
          Danh sách <span className="text-secondary italic">Yêu thích</span>
        </h1>
        <p className="text-xl text-slate-500 mb-16 italic">
          Lưu giữ những hành trình tri thức bạn dự định khám phá.
        </p>

        <div className="space-y-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group flex flex-col sm:flex-row items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-cam-100 transition-all duration-500">
              <div className="w-28 h-40 shrink-0 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-headline font-black text-navy-900 mb-2 group-hover:text-cam-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-4">
                  {item.author || 'Tác giả ẩn danh'}
                </p>
                <div className="text-2xl font-black text-secondary">
                  {formatCurrency(item.price)}
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <button 
                  onClick={() => addToCart(item)}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-navy-900 text-white font-black rounded-xl hover:bg-cam-500 transition-all shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
                </button>
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="flex items-center justify-center gap-3 px-6 py-3 border border-slate-200 text-slate-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mb-4" />
          <p className="text-slate-500 italic mb-0">
            "Sách là nguồn tri thức vô tận của nhân loại."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
