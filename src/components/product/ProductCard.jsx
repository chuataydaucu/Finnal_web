import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col h-full group relative">
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-10"></Link>
      <div className="relative pt-[120%] bg-slate-100 border-b border-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded shadow">
          Mới
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow relative z-20 pointer-events-none">
        <h3 className="font-serif text-lg font-semibold text-navy-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.author && (
          <p className="text-xs text-cam-500 mb-2 flex items-center gap-1 font-medium">
            <User className="w-3 h-3" /> {product.author}
          </p>
        )}
        <p className="text-slate-500 text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 pointer-events-auto">
          <span className="text-cam-500 font-bold text-lg">
            {formatCurrency(product.price)}
          </span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-navy-900 text-white p-2.5 rounded hover:bg-cam-500 transition-colors flex items-center justify-center shadow-sm"
            title="Thêm vào giỏ"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
