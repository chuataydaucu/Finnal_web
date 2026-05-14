import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, SlidersHorizontal, X, Search, Book } from 'lucide-react';
import Breadcrumbs from '../ui/Breadcrumbs';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const ClientLayout = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
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

  // Highlight logic for right icons
  const isCartActive = location.pathname === '/cart';
  const isWishlistActive = location.pathname === '/wishlist';
  const isProfileActive = location.pathname === '/profile' || location.pathname === '/login' || location.pathname === '/register';

  const NavIconWrapper = ({ children, isActive, badgeCount }) => (
    <div className="relative flex items-center justify-center">
      {isActive && (
        <div className="absolute inset-0 w-12 h-12 -m-3 bg-cam-100 rounded-full animate-fade-in opacity-80 z-[-1]"></div>
      )}
      {children}
      {badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {badgeCount}
        </span>
      )}
    </div>
  );

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
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Modern Academic</span>
            </div>
          </Link>
          
          {/* Search Bar - Removed for clarity in header redesign if needed, but keeping for now */}
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

            {/* Advanced Filter Dropdown (Logic remains same) */}
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

            {/* Suggestions (Logic remains same) */}
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
            <nav className="hidden lg:flex items-center gap-8 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className={`transition-all ${location.pathname === '/' ? 'text-navy-900 border-b-2 border-cam-500 pb-1' : 'hover:text-cam-500'}`}>
                Trang Chủ
              </Link>
              <Link to="/book-hot" className={`transition-all ${location.pathname === '/book-hot' ? 'text-navy-900 border-b-2 border-cam-500 pb-1' : 'hover:text-cam-500'}`}>
                Sách Hot
              </Link>
              <Link to="/blog" className={`transition-all ${location.pathname === '/blog' ? 'text-navy-900 border-b-2 border-cam-500 pb-1' : 'hover:text-cam-500'}`}>
                Blog Sách
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <Link to="/wishlist">
                <NavIconWrapper isActive={isWishlistActive} badgeCount={wishlist.length}>
                  <Heart className={`w-5 h-5 transition-colors ${isWishlistActive ? 'text-secondary fill-current' : 'text-slate-400 hover:text-secondary'}`} />
                </NavIconWrapper>
              </Link>
              
              <Link to="/cart">
                <NavIconWrapper isActive={isCartActive} badgeCount={cartCount}>
                  <ShoppingCart className={`w-5 h-5 transition-colors ${isCartActive ? 'text-secondary fill-current' : 'text-slate-400 hover:text-secondary'}`} />
                </NavIconWrapper>
              </Link>
              
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to={user.role === 'admin' ? '/admin' : '/profile'}>
                    <NavIconWrapper isActive={location.pathname === '/profile' || location.pathname === '/admin'}>
                      <div className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${location.pathname === '/profile' ? 'border-secondary' : 'border-slate-200'}`}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.username}&background=f59e0b&color=fff`} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </NavIconWrapper>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <NavIconWrapper isActive={isProfileActive}>
                    <User className={`w-6 h-6 transition-colors ${isProfileActive ? 'text-secondary' : 'text-slate-400 hover:text-secondary'}`} />
                  </NavIconWrapper>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-slate-50 pt-[88px]">
        <Breadcrumbs />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-slate-100 text-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Logo & Info */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center group-hover:bg-cam-500 transition-all duration-300 shadow-xl">
                  <Book className="w-7 h-7 text-cam-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-black text-3xl tracking-tighter text-navy-900 leading-none">TayfBook</span>
                  <span className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Modern Academic</span>
                </div>
              </Link>
              <p className="text-slate-500 leading-relaxed max-w-xs font-medium">
                © 2024 TayfBook. Trải nghiệm đọc sách tinh tế cho người Việt. Nâng tầm trí thức Việt.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="font-headline font-black text-2xl text-slate-200 tracking-widest opacity-50">DIAGRAM</div>
              </div>
            </div>

            {/* Column 2: Sản phẩm */}
            <div>
              <h4 className="font-black text-navy-900 uppercase tracking-[0.2em] text-[13px] mb-8">Sản phẩm</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-[15px]">
                <li><Link to="/all-categories#cat-1" className="hover:text-cam-600 transition-colors">Truyện tranh</Link></li>
                <li><Link to="/all-categories#cat-2" className="hover:text-cam-600 transition-colors">Tiểu thuyết</Link></li>
                <li><Link to="/all-categories#cat-3" className="hover:text-cam-600 transition-colors">Sách kỹ năng</Link></li>
                <li><Link to="/book-hot" className="hover:text-cam-600 transition-colors">Sách bán chạy</Link></li>
              </ul>
            </div>

            {/* Column 3: Hỗ trợ */}
            <div>
              <h4 className="font-black text-navy-900 uppercase tracking-[0.2em] text-[13px] mb-8">Hỗ trợ</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-[15px]">
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Câu hỏi thường gặp</Link></li>
                <li><Link to="/about" className="hover:text-cam-600 transition-colors">Liên hệ</Link></li>
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Chính sách vận chuyển</Link></li>
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Tra cứu đơn hàng</Link></li>
              </ul>
            </div>

            {/* Column 4: Pháp lý */}
            <div>
              <h4 className="font-black text-navy-900 uppercase tracking-[0.2em] text-[13px] mb-8">Pháp lý</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-[15px]">
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Chính sách bảo mật</Link></li>
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Điều khoản sử dụng</Link></li>
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Chính sách đổi trả</Link></li>
                <li><Link to="#" className="hover:text-cam-600 transition-colors">Bản quyền nội dung</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">
              Hệ thống quản lý sách TayfBook v2.0 - Phục vụ 24/7
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
