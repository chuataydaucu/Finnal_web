import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isFavorite = isInWishlist(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 flex flex-col h-full group relative ${compact ? 'max-w-sm' : ''}`}>
      <Link 
        to={`/product/${product.id}`} 
        state={{ from: location.pathname }}
        className="absolute inset-0 z-10"
      ></Link>
      <div className={`relative ${compact ? 'pt-[100%]' : 'pt-[130%]'} bg-slate-50 border-b border-slate-50 overflow-hidden`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-navy-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg z-20">
          Mới Nhất
        </div>
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-xl shadow-lg z-20 transition-all duration-300 transform group-hover:scale-110 ${
            isFavorite ? 'bg-secondary text-white' : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-secondary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-[2px] flex items-center justify-center z-30">
            <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl transform -rotate-12 border-2 border-white/20">
              Hết hàng
            </div>
          </div>
        )}
      </div>
      <div className={`${compact ? 'p-5' : 'p-6'} flex flex-col flex-grow relative z-20 pointer-events-none`}>
        <h3 className={`${compact ? 'text-base' : 'text-lg'} font-headline font-black text-navy-900 mb-1 line-clamp-1 group-hover:text-cam-600 transition-colors uppercase tracking-tight`}>
          {product.name}
        </h3>
        {product.author && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            <span className="text-cam-500">Tác giả:</span>
            <span className="truncate max-w-[150px]">{product.author}</span>
          </div>
        )}
        
        {product.description && (
          <p className={`text-slate-500 leading-relaxed italic ${compact ? 'text-[11px] mb-4 line-clamp-1' : 'text-sm mb-6 line-clamp-2'} flex-grow`}>
            {product.description}
          </p>
        )}

        <div className={`flex items-center justify-between mt-auto ${compact ? 'pt-4' : 'pt-6'} border-t border-slate-50 pointer-events-auto`}>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Giá bán</span>
            <span className={`${compact ? 'text-lg' : 'text-xl'} text-cam-600 font-black leading-none`}>
              {formatCurrency(product.price)}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.stock <= 0) {
                addToast('Sản phẩm hiện đang hết hàng', 'error');
                return;
              }
              if (!user) {
                addToast('Vui lòng đăng nhập để thực hiện hành động này', 'info');
                navigate('/login');
                return;
              }
              addToCart(product);
            }}
            disabled={product.stock <= 0}
            className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} ${product.stock <= 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-navy-900 text-white hover:bg-cam-500 shadow-lg hover:shadow-cam-500/30 transform hover:-translate-y-1 active:scale-95'} rounded-2xl transition-all duration-300 flex items-center justify-center`}
            title={product.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
          >
            <ShoppingCart className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
