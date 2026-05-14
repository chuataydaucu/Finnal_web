import React, { useState, useEffect } from 'react';
import { LayoutGrid, ArrowRight, Bookmark, Quote } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/categories').then(res => res.json()),
      fetch('http://localhost:3000/products').then(res => res.json())
    ]).then(([catData, prodData]) => {
      setCategories(catData);
      setProducts(prodData);
      setLoading(false);
      if (!location.hash) window.scrollTo(0, 0);
    });
  }, []);

  useEffect(() => {
    // Handle anchor scrolling
    if (!loading && location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading, location.hash]);

  if (loading) return (
    <div className="container mx-auto px-6 py-20 text-center text-slate-400">Đang sắp xếp thư viện...</div>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Enhanced Header Section */}
      <div className="relative mb-20 p-12 lg:p-16 bg-navy-900 rounded-[3.5rem] overflow-hidden shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cam-500/10 -skew-x-12 translate-x-1/4"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side: Title & Description */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-cam-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
              <LayoutGrid className="w-4 h-4" /> THƯ VIỆN TRI THỨC
            </div>
            <h1 className="font-headline font-black text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tight">
              Tất cả <span className="text-cam-500 italic">Danh mục</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed italic">
              Khám phá toàn bộ kho tri thức của TayfBook được phân loại khoa học và chi tiết, giúp bạn dễ dàng tìm thấy những hành trình trí tuệ phù hợp nhất.
            </p>
          </div>

          {/* Right Side: Inspirational Quote Card */}
          <div className="lg:w-5/12">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] relative group hover:bg-white/10 transition-all duration-500">
              <Quote className="absolute -top-6 -left-6 w-12 h-12 text-cam-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <p className="text-xl lg:text-2xl font-medium text-white leading-relaxed italic relative z-10">
                "Đọc một cuốn sách hay cũng giống như trò chuyện với những trí tuệ tuyệt vời nhất của nhân loại."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-10 h-1 bg-cam-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">René Descartes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Chips */}
      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => {
              const el = document.getElementById(`cat-${cat.id}`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-navy-900 hover:border-cam-500 hover:text-cam-600 transition-all shadow-sm hover:shadow-md"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Categories Sections */}
      <div className="space-y-16">
        {categories.map(cat => {
          const catProducts = products.filter(p => p.categoryIds?.includes(cat.id));
          if (catProducts.length === 0) return null;

          return (
            <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32 group">
              <div className="flex items-center justify-between mb-10 pb-6 border-b-2 border-slate-100 group-hover:border-cam-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center text-cam-500 shadow-lg">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-headline font-black text-navy-900">{cat.name}</h2>
                  <span className="bg-slate-100 text-slate-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    {catProducts.length} cuốn sách
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} compact={true} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-32 p-12 bg-navy-900 rounded-[3rem] text-center">
        <h2 className="text-3xl font-headline font-black text-white mb-6">Bạn đang tìm kiếm một chủ đề khác?</h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto italic">
          Nếu không tìm thấy danh mục bạn quan tâm, hãy liên hệ với chúng tôi để được hỗ trợ tìm kiếm những đầu sách hiếm nhất.
        </p>
        <button className="px-10 py-4 bg-cam-500 text-white font-black rounded-2xl hover:bg-cam-600 transition-all transform hover:-translate-y-1 shadow-lg">
          Gửi yêu cầu tìm sách
        </button>
      </div>
    </div>
  );
};

export default AllCategories;
