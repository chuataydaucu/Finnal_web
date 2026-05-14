import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Lightbulb, 
  TrendingUp, 
  PenTool, 
  Type, 
  FlaskConical, 
  ArrowRight, 
  Mail, 
  Lock,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Quote,
  Users,
  Award
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleTrending, setVisibleTrending] = useState(5);
  const [isAddingTrending, setIsAddingTrending] = useState(false);
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch('http://localhost:3000/products'),
          fetch('http://localhost:3000/settings')
        ]);
        
        const productsData = await prodRes.json();
        const settingsData = await settingsRes.json();
        
        setProducts(productsData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLoadMoreTrending = () => {
    setIsAddingTrending(true);
    setTimeout(() => {
      setVisibleTrending(prev => prev + 4);
      setIsAddingTrending(false);
    }, 600);
  };

  const CategoryBox = ({ icon: Icon, title, link, color }) => (
    <Link to={link} className="group relative flex flex-col items-center p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${color}`}>
        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
      </div>
      <span className="font-headline font-black text-navy-900 text-[10px] tracking-widest uppercase">{title}</span>
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-4 h-4 text-slate-300" />
      </div>
    </Link>
  );

  if (loading || !settings) {
    return (
      <div className="py-64 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-cam-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">TayfBook is loading...</p>
      </div>
    );
  }

  // Get data from settings
  const { heroBanner, homeFeaturedIds } = settings;
  const heroBook = products.find(p => p.id === heroBanner.featuredBookId) || products[0];
  const homeFeatured = products.filter(p => homeFeaturedIds.includes(p.id));
  
  // Sections
  const trendingProduct = homeFeatured[0];
  const featuredGrid = homeFeatured.slice(1, visibleTrending);
  const literatureProducts = products.filter(p => p.categoryIds?.includes("2")).slice(0, 5);

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      
      {/* 1. Dynamic Hero Section */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-navy-900">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            className="w-full h-full object-cover grayscale" 
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cam-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5 text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-cam-500 text-[9px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10 animate-fade-in-down">
                <Sparkles className="w-4 h-4" /> KIẾN TẠO TƯƠNG LAI QUA TRI THỨC
              </div>
              <h1 className="text-4xl lg:text-7xl font-headline font-black text-white leading-[1.1] tracking-tighter mb-6 animate-fade-in-up">
                NUÔI DƯỠNG <br/>
                <span className="text-cam-500 italic">TÂM HỒN</span> <br/>
                VIẾT NÊN <span className="text-cam-500 italic">ƯỚC MƠ</span>
              </h1>
              <p className="text-slate-400 text-base lg:text-lg mb-10 max-w-lg leading-relaxed animate-fade-in-up delay-200 font-medium">
                Khám phá kho tàng tri thức vô tận với những đầu sách tuyển chọn. 
                Nơi khởi đầu cho những hành trình trí tuệ và đam mê bất tận.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up delay-300">
                <button 
                  onClick={scrollToCategories}
                  className="w-full sm:w-auto bg-cam-500 hover:bg-cam-600 text-white px-8 py-3.5 rounded-[2rem] font-black text-xs transition-all shadow-2xl shadow-cam-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Mua ngay <ArrowRight className="w-5 h-5" />
                </button>
                <Link 
                  to="/about"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-[2rem] font-black text-xs transition-all border border-white/10 backdrop-blur-md flex items-center justify-center gap-3"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/5 relative animate-fade-in-right">
              <div className="relative z-10 aspect-[3/4] w-full max-w-[320px] mx-auto group">
                <div className="absolute inset-0 bg-cam-500 rounded-[2rem] rotate-6 scale-95 group-hover:rotate-12 transition-transform duration-700 opacity-20"></div>
                <div className="absolute inset-0 bg-navy-400 rounded-[2rem] -rotate-3 scale-95 group-hover:-rotate-6 transition-transform duration-700 opacity-20"></div>
                <img 
                  src={heroBanner.image || heroBook?.image} 
                  className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-20 group-hover:-translate-y-4 transition-transform duration-700" 
                  alt="Featured Book"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-2xl z-30 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 bg-cam-500 rounded-full flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">DEAL HOT</p>
                    <p className="text-lg font-black text-navy-900">-40% Hôm nay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Globe, label: "Toàn cầu", value: "18k+", desc: "Đầu sách từ khắp thế giới" },
            { icon: Users, label: "Cộng đồng", value: "36k+", desc: "Độc giả tri thức đồng hành" },
            { icon: BookOpen, label: "Tuyển tập", value: "24/7", desc: "Hỗ trợ độc giả tận tâm" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-6 p-10 bg-slate-50 rounded-[2.5rem] group hover:bg-navy-900 transition-colors duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy-900 group-hover:bg-cam-500 group-hover:text-white shadow-sm transition-all duration-500">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-navy-900 group-hover:text-white transition-colors">{stat.value}</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-white/60">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section ref={categoriesRef} className="py-24 bg-slate-50 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <div className="text-cam-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Khám phá theo chủ đề</div>
              <h2 className="text-5xl font-black text-navy-900 tracking-tight leading-none">DANH MỤC NỔI BẬT</h2>
            </div>
            <Link to="/all-categories" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-navy-900 hover:text-cam-600 transition-colors">
              Xem tất cả chủ đề <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-cam-500 transition-colors"><ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <CategoryBox icon={BookOpen} title="VĂN HỌC" link="/all-categories#cat-2" color="bg-blue-500" />
            <CategoryBox icon={Lightbulb} title="KỸ NĂNG" link="/all-categories#cat-3" color="bg-amber-500" />
            <CategoryBox icon={TrendingUp} title="KINH TẾ" link="/all-categories#cat-4" color="bg-emerald-500" />
            <CategoryBox icon={PenTool} title="TRUYỆN TRANH" link="/all-categories#cat-1" color="bg-rose-500" />
            <CategoryBox icon={Type} title="NGOẠI VĂN" link="/all-categories#cat-91SlIM7Y5P8" color="bg-violet-500" />
            <CategoryBox icon={FlaskConical} title="KHOA HỌC" link="/all-categories#cat-6" color="bg-indigo-500" />
          </div>
        </div>
      </section>

      {/* 4. Trending Books Section */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="text-cam-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Được yêu thích nhất</div>
            <h2 className="text-5xl font-black text-navy-900 tracking-tight leading-none">SÁCH ĐANG <span className="text-cam-500">THỊNH HÀNH</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Main Hero Product */}
          <div className="lg:col-span-5">
            <Link 
              to={`/product/${trendingProduct?.id}`} 
              state={{ from: '/', fromName: 'Sách thịnh hành' }}
              className="group relative block h-full min-h-[500px] rounded-[3rem] overflow-hidden bg-navy-900 shadow-2xl shadow-navy-900/20"
            >
              <img 
                src={trendingProduct?.image} 
                alt={trendingProduct?.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 text-white">
                <div className="bg-cam-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-6 shadow-xl">Top Trending</div>
                <h3 className="text-4xl font-headline font-black mb-4 leading-tight group-hover:text-cam-500 transition-colors uppercase tracking-tight">{trendingProduct?.name}</h3>
                <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px] mb-8 italic">{trendingProduct?.author}</p>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-white">{formatCurrency(trendingProduct?.price)}</span>
                  <div className="w-14 h-14 rounded-full bg-white text-navy-900 flex items-center justify-center group-hover:bg-cam-500 group-hover:text-white transition-all shadow-xl">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Grid of smaller products */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {featuredGrid.map((product, idx) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <ProductCard product={product} compact={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {visibleTrending < homeFeatured.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleLoadMoreTrending}
              disabled={isAddingTrending}
              className="group flex flex-col items-center gap-4 focus:outline-none"
            >
              <div className={`w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center transition-all duration-300 group-hover:border-cam-500 group-hover:bg-cam-500 ${isAddingTrending ? 'animate-spin border-cam-500' : ''}`}>
                <ChevronRight className={`w-6 h-6 transition-colors rotate-90 ${isAddingTrending ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-navy-900">
                {isAddingTrending ? 'Đang tải...' : 'Tải thêm sách'}
              </span>
            </button>
          </div>
        )}
      </section>

      {/* 5. Literature Section */}
      <section className="py-32 bg-navy-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <div className="text-cam-500 text-xs font-black uppercase tracking-[0.3em] mb-4">Tuyển tập chọn lọc</div>
              <h2 className="text-5xl font-black tracking-tight leading-none">VĂN HỌC KINH ĐIỂN</h2>
            </div>
            <Link to="/all-categories#cat-2" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white hover:text-cam-500 transition-colors">
              Xem tất cả tác phẩm <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-cam-500 transition-colors"><ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {literatureProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`} 
                state={{ from: '/', fromName: 'VĂN HỌC' }}
                className="group"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-cam-500 flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <h4 className="font-headline font-black text-lg mb-1 group-hover:text-cam-500 transition-colors line-clamp-1">{product.name}</h4>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{product.author}</p>
                <p className="text-cam-500 font-black mt-3">{formatCurrency(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quote Section */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Quote className="w-20 h-20 text-cam-500/30 mx-auto mb-12" />
          <h2 className="text-4xl lg:text-5xl font-headline font-black text-navy-900 italic leading-tight mb-12 max-w-4xl mx-auto">
            "Sách không chỉ là giấy và mực. Chúng là những hành trình đưa bạn đến những nơi bạn chưa bao giờ tới, gặp những người bạn chưa bao giờ quen."
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-12 h-1 px-4 bg-cam-500 mb-6"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">TayfBook Philosophy</p>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Section */}
      <section className="pb-32 container mx-auto px-6">
        <div className="bg-navy-900 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)]">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cam-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <div className="lg:w-1/2 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full text-cam-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/5">
                Bản tin độc quyền
              </div>
              <h2 className="text-5xl font-headline font-black text-white mb-8 leading-[1.1] tracking-tight">
                NHẬN THÔNG TIN <br/>
                <span className="text-cam-500 italic">MỚI NHẤT</span> TỪ CHÚNG TÔI
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md italic">
                Đăng ký ngay để không bỏ lỡ các đầu sách giới hạn và những chương trình tri ân độc giả hàng tháng.
              </p>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <div className="absolute inset-0 bg-cam-500/20 blur-2xl group-focus-within:bg-cam-500/40 transition-colors"></div>
                <div className="relative flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="email" 
                      placeholder="Email của bạn..." 
                      className="w-full bg-white/5 border-2 border-white/10 text-white rounded-[2rem] py-6 pl-16 pr-8 focus:outline-none focus:border-cam-500 transition-all font-bold"
                      required
                    />
                  </div>
                  <button type="submit" className="bg-white hover:bg-cam-500 hover:text-white text-navy-900 px-10 py-6 rounded-[2rem] font-black text-sm transition-all active:scale-[0.98]">
                    ĐĂNG KÝ NGAY
                  </button>
                </div>
              </form>
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-8 ml-4">
                <Lock className="w-4 h-4" /> Bảo mật thông tin tuyệt đối
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

