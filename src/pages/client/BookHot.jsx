import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Flame, Filter, ChevronDown, Quote, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';

const BookHot = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/products').then(res => res.json()),
      fetch('http://localhost:3000/categories').then(res => res.json())
    ]).then(([products, cats]) => {
      setAllProducts(products);
      setCategories(cats);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryIds?.includes(selectedCategory));
    }

    // Sort Logic
    if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'hot') {
      result.sort(() => 0.5 - Math.random()); // Random for "hot" simulation
    }

    setFilteredBooks(result);
  }, [allProducts, selectedCategory, sortBy]);

  if (loading) return (
    <div className="container mx-auto px-6 py-20 text-center text-slate-400">Đang tìm những cuốn sách "hot" nhất...</div>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header Section - Modern Floating Style */}
      <div className="relative mb-20 z-40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cam-500/5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-cam-600 font-black uppercase tracking-[0.3em] text-[10px] mb-6 bg-cam-50 w-fit px-4 py-2 rounded-full border border-cam-100 animate-fade-in-down">
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>BẢNG XẾP HẠNG TUẦN NÀY</span>
            </div>
            <h1 className="font-headline font-black text-6xl lg:text-7xl text-navy-900 mb-8 leading-[1.1] tracking-tight animate-fade-in-up">
              Sách <span className="text-cam-500 italic">Hot</span> <br/>
              Nhất <span className="underline decoration-cam-500 decoration-8 underline-offset-8">Tuần</span>
            </h1>
            
            <div className="flex flex-wrap gap-4 mt-10 animate-fade-in-up delay-200">
              {/* Category Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                  className={`group flex items-center gap-3 px-8 py-4 ${selectedCategory !== 'all' ? 'bg-cam-500 text-white' : 'bg-navy-900 text-white'} rounded-[2rem] font-black text-xs shadow-2xl shadow-navy-900/20 hover:bg-cam-500 transition-all active:scale-95`}
                >
                  <Filter className="w-4 h-4" />
                  {selectedCategory === 'all' ? 'Lọc Thể loại' : categories.find(c => c.id === selectedCategory)?.name}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilters && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 animate-fade-in-up">
                    <button 
                      onClick={() => { setSelectedCategory('all'); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs mb-1 transition-colors ${selectedCategory === 'all' ? 'bg-cam-50 text-cam-600' : 'hover:bg-slate-50 text-navy-900'}`}
                    >
                      Tất cả thể loại
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setShowFilters(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs mb-1 transition-colors ${selectedCategory === cat.id ? 'bg-cam-50 text-cam-600' : 'hover:bg-slate-50 text-navy-900'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-navy-900 rounded-[2rem] font-black text-xs shadow-sm hover:border-cam-500 hover:text-cam-500 transition-all"
                >
                  Sắp xếp: {sortBy === 'newest' ? 'Mới nhất' : sortBy === 'price-asc' ? 'Giá tăng dần' : sortBy === 'price-desc' ? 'Giá giảm dần' : 'Hot nhất'}
                  <ChevronDown className={`w-4 h-4 text-cam-500 transition-transform ${showSort ? 'rotate-180' : ''}`} />
                </button>

                {showSort && (
                  <div className="absolute top-full right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 animate-fade-in-up">
                    {[
                      { id: 'newest', label: 'Mới nhất' },
                      { id: 'hot', label: 'Hot nhất' },
                      { id: 'price-asc', label: 'Giá tăng dần' },
                      { id: 'price-desc', label: 'Giá giảm dần' }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setShowSort(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs mb-1 transition-colors ${sortBy === opt.id ? 'bg-cam-50 text-cam-600' : 'hover:bg-slate-50 text-navy-900'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-fade-in-right delay-300">
            <div className="p-1 w-full rounded-[3rem] bg-gradient-to-br from-cam-500/20 via-transparent to-blue-500/10">
              <div className="bg-white/80 backdrop-blur-xl border border-white p-12 rounded-[2.9rem] shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cam-500/10 rounded-full blur-2xl group-hover:bg-cam-500/20 transition-colors"></div>
                <Quote className="w-12 h-12 text-cam-500/20 mb-6 group-hover:text-cam-500/40 transition-colors" />
                <p className="text-xl lg:text-2xl font-medium text-navy-900 leading-relaxed italic relative z-10 mb-8">
                  "Sách không chỉ là những trang giấy, mà là những cửa sổ nhìn ra thế giới rộng lớn."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-cam-600" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Thế Mà Lại Hay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up delay-500">
        {[
          { icon: TrendingUp, label: "Lượt mua tăng", value: "+450%", desc: "Trong 24h qua" },
          { icon: Award, label: "Đánh giá cao", value: "4.9/5", desc: "Từ 12,000+ độc giả" },
          { icon: Flame, label: "Cháy hàng", value: "15", desc: "Tựa sách sắp hết" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="w-16 h-16 bg-cam-50 rounded-2xl flex items-center justify-center text-cam-500">
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-navy-900">{stat.value}</div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
              <div className="text-[10px] text-slate-500">{stat.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 animate-fade-in-up delay-500">
        {filteredBooks.slice(0, visibleCount).map((product, idx) => (
          <div key={product.id} className="relative group" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="absolute -top-4 -left-4 z-10 w-12 h-12 bg-cam-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-cam-500/30 transform -rotate-12 group-hover:rotate-0 transition-transform">
              HOT
            </div>
            <ProductCard product={product} compact={true} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredBooks.length && (
        <div className="mt-16 flex justify-center animate-fade-in-up">
          <button 
            onClick={() => setVisibleCount(prev => prev + 8)}
            className="group flex items-center gap-3 px-8 py-3.5 bg-white border-2 border-navy-900 text-navy-900 font-black rounded-2xl hover:bg-cam-500 hover:border-cam-500 hover:text-white transition-all shadow-xl hover:shadow-cam-500/20 transform hover:-translate-y-1 text-xs"
          >
            XEM THÊM
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-24 p-1 rounded-[3rem] bg-gradient-to-r from-cam-400 to-secondary shadow-2xl">
        <div className="bg-white rounded-[2.9rem] p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-cam-100 rounded-full flex items-center justify-center text-cam-500 mb-8 animate-bounce-slow">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-headline font-black text-navy-900 mb-6 max-w-2xl leading-tight">
            Chưa tìm thấy cuốn sách ưng ý?
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-xl">
            Hãy khám phá kho sách khổng lồ của chúng tôi với đầy đủ các thể loại từ văn học đến kỹ năng.
          </p>
          <button className="px-12 py-5 bg-navy-900 text-white font-black rounded-2xl hover:bg-cam-500 transition-all transform hover:-translate-y-1 shadow-2xl">
            Khám phá toàn bộ cửa hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookHot;
