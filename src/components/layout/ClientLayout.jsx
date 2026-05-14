import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, SlidersHorizontal, X, Search, Book } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ClientLayout = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Advanced filter states
  const [categories, setCategories] = useState([]);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const filterRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/products').then(res => res.json()),
      fetch('http://localhost:3000/categories').then(res => res.json())
    ])
    .then(([productsData, categoriesData]) => {
      setAllProducts(productsData);
      setCategories(categoriesData);
    })
    .catch(err => console.error("Could not load data for layout", err));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const lowerQ = searchQuery.toLowerCase();
    const filtered = allProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(lowerQ)) ||
      (p.author && p.author.toLowerCase().includes(lowerQ))
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && !filterRef.current?.contains(event.target)) {
        setIsFocused(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsAdvancedFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef, filterRef]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsFocused(false);
    setIsAdvancedFilterOpen(false);
    
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (filterCategory !== 'all') params.append('category', filterCategory);
    if (filterMinPrice) params.append('minPrice', filterMinPrice);
    if (filterMaxPrice) params.append('maxPrice', filterMaxPrice);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white fixed top-0 left-0 right-0 z-50 py-4 border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center group-hover:bg-cam-500 transition-colors duration-300 shadow-lg shadow-navy-900/10">
              <Book className="w-6 h-6 text-cam-500 group-hover:text-white transition-colors" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-extrabold text-2xl tracking-tighter text-navy-900 leading-tight">TayfBook</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Modern Academic</span>
            </div>
          </Link>
          
          {/* Search Bar */}
          <div ref={filterRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="w-full flex relative items-center">
              <Search className="w-4 h-4 text-neutral absolute left-4" />
              <input 
                ref={searchRef}
                type="text" 
                placeholder="Tìm tên sách, tác giả, ISBN..." 
                className="w-full bg-slate-100 text-primary border border-transparent rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-secondary focus:bg-white placeholder-neutral text-sm transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
              />
              <button 
                type="button"
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                className={`absolute right-4 text-neutral hover:text-secondary transition-colors ${isAdvancedFilterOpen ? 'text-secondary' : ''}`}
                title="Lọc nâng cao"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </form>

            {/* Advanced Filter Dropdown */}
            {isAdvancedFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-50 text-slate-800">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-secondary" />
                    Bộ Lọc Nâng Cao
                  </h3>
                  <button onClick={() => setIsAdvancedFilterOpen(false)} className="text-neutral hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Danh mục sách</label>
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary bg-slate-50"
                    >
                      <option value="all">Tất cả danh mục</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Khoảng giá (VNĐ)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        placeholder="Từ..." 
                        value={filterMinPrice}
                        onChange={(e) => setFilterMinPrice(e.target.value)}
                        className="w-1/2 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary bg-slate-50"
                      />
                      <span className="text-neutral font-medium">-</span>
                      <input 
                        type="number" 
                        placeholder="Đến..." 
                        value={filterMaxPrice}
                        onChange={(e) => setFilterMaxPrice(e.target.value)}
                        className="w-1/2 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary bg-slate-50"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        setFilterCategory('all');
                        setFilterMinPrice('');
                        setFilterMaxPrice('');
                      }}
                      className="flex-1 py-2.5 border border-slate-300 rounded-lg text-neutral font-medium hover:bg-slate-50 transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                    <button 
                      onClick={handleSearch}
                      className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm"
                    >
                      Áp dụng lọc
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Dropdown */}
            {isFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 text-slate-800">
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {suggestions.map(product => (
                      <li key={product.id}>
                        <Link 
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setIsFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                        >
                          <img src={product.image} alt="" className="w-10 h-14 object-cover rounded shadow-sm" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-primary line-clamp-1">{product.name}</span>
                            <span className="text-xs text-secondary">{product.author || 'Đang cập nhật'}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button 
                        type="submit"
                        className="w-full text-center p-3 text-sm font-medium text-neutral hover:text-primary hover:bg-slate-50 bg-slate-50/50"
                      >
                        Xem tất cả kết quả cho "{searchQuery}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-neutral">
                    Không tìm thấy sách phù hợp
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right Navigation */}
          <div className="flex items-center gap-8 shrink-0">
            <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-neutral">
              <Link to="/" className={`pb-1 border-b-2 ${location.pathname === '/' ? 'text-secondary border-secondary' : 'border-transparent hover:text-primary transition-colors'}`}>
                Trang Chủ
              </Link>
              <Link to="/search?sort=bestseller" className="hover:text-primary transition-colors pb-1 border-b-2 border-transparent">Bán chạy</Link>
              <Link to="/search?sort=sale" className="hover:text-primary transition-colors pb-1 border-b-2 border-transparent">Khuyến mãi</Link>
            </nav>

            <div className="flex items-center gap-6">
              <button className="text-neutral hover:text-secondary transition-colors relative">
                <Heart className="w-6 h-6" />
              </button>
              <Link to="/cart" className="relative text-neutral hover:text-secondary transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/profile'} 
                    className="text-neutral hover:text-secondary transition-colors"
                    title={user.username}
                  >
                    <User className="w-6 h-6" />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-neutral hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    location.pathname === '/login' || location.pathname === '/register'
                      ? 'bg-secondary text-white' 
                      : 'text-neutral hover:text-secondary'
                  }`}
                  title="Đăng nhập"
                >
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-slate-50 pt-[88px]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-10 border-t border-slate-200 text-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-headline font-bold text-xl tracking-tight text-primary">
                TayfBook
              </Link>
              <span className="text-neutral border-l border-slate-300 pl-4">
                © 2024 TayfBook. Mở trang sách, mở ra thế giới mới.
              </span>
            </div>
            
            <div className="flex flex-wrap gap-8 text-neutral font-medium">
              <Link to="#" className="hover:text-primary transition-colors">Về chúng tôi</Link>
              <Link to="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
              <Link to="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link>
              <Link to="#" className="hover:text-primary transition-colors">Liên hệ</Link>
            </div>

            <div className="flex gap-4 text-neutral">
              <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
              <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
