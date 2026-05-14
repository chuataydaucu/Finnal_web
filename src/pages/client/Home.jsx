import React, { useState, useEffect } from 'react';
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
  Users
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error('Không thể kết nối đến máy chủ.');
        const productsData = await response.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CategoryBox = ({ icon: Icon, title, link, color }) => (
    <Link to={link} className="group relative flex flex-col items-center p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${color}`}>
        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
      </div>
      <span className="font-bold text-navy-900 text-sm tracking-tight">{title}</span>
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-4 h-4 text-slate-300" />
      </div>
    </Link>
  );

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product.id}`} className="group flex flex-col bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 border border-transparent hover:border-slate-100">
      <div className="aspect-[3/4] bg-slate-50 rounded-xl relative overflow-hidden mb-5">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-colors duration-500"></div>
        {product.id % 3 === 0 && (
          <div className="absolute top-4 left-4 bg-cam-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Bán chạy
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <h4 className="font-bold text-navy-900 mb-1 line-clamp-1 group-hover:text-cam-600 transition-colors text-lg tracking-tight">{product.name}</h4>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{product.author || 'Tác giả'}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-cam-600 font-black text-lg leading-none">{formatCurrency(product.price)}</span>
            <span className="text-slate-300 text-[10px] font-bold line-through mt-1">{formatCurrency(product.price * 1.2)}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-cam-500 group-hover:text-white transition-all duration-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="py-64 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-cam-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">TayfBook is loading...</p>
      </div>
    );
  }

  const trendingProduct = products[0];
  const featuredProducts = products.slice(1, 5);
  const literatureProducts = products.slice(0, 10);

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      
      {/* 1. Dynamic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-navy-900">
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
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-3/5 text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-cam-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-white/10 animate-fade-in-down">
                <Sparkles className="w-4 h-4" /> Kiến tạo tương lai qua tri thức
              </div>
              <h1 className="text-6xl lg:text-[7.5rem] font-black text-white leading-[0.9] tracking-tighter mb-12 animate-fade-in-up">
                NUÔI DƯỠNG <br/>
                <span className="text-cam-500 italic">TÂM HỒN</span> <br/>
                VIẾT NÊN <span className="underline decoration-white/20 underline-offset-8">ƯỚC MƠ</span>
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up delay-300">
                <button 
                  onClick={() => navigate('/search')}
                  className="w-full sm:w-auto bg-cam-500 hover:bg-cam-600 text-white px-12 py-6 rounded-[2rem] font-black text-sm transition-all shadow-2xl shadow-cam-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Khám phá ngay <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-navy-900 bg-slate-300 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white">12k+</span> thành viên tham gia
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/5 relative animate-fade-in-right">
              <div className="relative z-10 aspect-[3/4] w-full max-w-[400px] mx-auto group">
                <div className="absolute inset-0 bg-cam-500 rounded-[3rem] rotate-6 scale-95 group-hover:rotate-12 transition-transform duration-700 opacity-20"></div>
                <div className="absolute inset-0 bg-navy-400 rounded-[3rem] -rotate-3 scale-95 group-hover:-rotate-6 transition-transform duration-700 opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  className="w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-20 group-hover:-translate-y-4 transition-transform duration-700" 
                  alt="Featured Book"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl z-30 animate-bounce-slow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cam-50 rounded-2xl flex items-center justify-center text-cam-600">
                      <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Deal Hot</p>
                      <p className="text-lg font-black text-navy-900">-40% Hôm nay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats & Features */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Globe, label: "Toàn cầu", value: "50k+", desc: "Đầu sách từ khắp thế giới" },
            { icon: Users, label: "Cộng đồng", value: "12k+", desc: "Độc giả tri thức đồng hành" },
            { icon: BookOpen, label: "Tuyển tập", value: "24/7", desc: "Hỗ trợ độc giả tận tâm" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-6 p-10 bg-slate-50 rounded-[2.5rem] group hover:bg-navy-900 transition-colors duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy-900 group-hover:bg-cam-500 group-hover:text-white shadow-sm transition-all duration-500">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-navy-900 group-hover:text-white transition-colors">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-white/60">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <div className="text-cam-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Khám phá theo chủ đề</div>
              <h2 className="text-5xl font-black text-navy-900 tracking-tight leading-none">DANH MỤC NỔI BẬT</h2>
            </div>
            <Link to="/search" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-navy-900 hover:text-cam-600 transition-colors">
              Xem tất cả chủ đề <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-cam-500 transition-colors"><ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <CategoryBox icon={BookOpen} title="VĂN HỌC" link="/search?category=2" color="bg-blue-500" />
            <CategoryBox icon={Lightbulb} title="KỸ NĂNG" link="/search?category=3" color="bg-amber-500" />
            <CategoryBox icon={TrendingUp} title="KINH TẾ" link="/search?category=4" color="bg-emerald-500" />
            <CategoryBox icon={PenTool} title="TRUYỆN TRANH" link="/search?category=1" color="bg-rose-500" />
            <CategoryBox icon={Type} title="NGOẠI VĂN" link="/search?category=5" color="bg-violet-500" />
            <CategoryBox icon={FlaskConical} title="KHOA HỌC" link="/search?category=6" color="bg-indigo-500" />
          </div>
        </div>
      </section>

      {/* 4. Trending Books */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="text-cam-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Được yêu thích nhất</div>
            <h2 className="text-5xl font-black text-navy-900 tracking-tight leading-none">SÁCH ĐANG THỊNH HÀNH</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Hero Product */}
          <div className="lg:col-span-5">
            <Link to={`/product/${trendingProduct?.id}`} className="group relative block h-full min-h-[600px] rounded-[3rem] overflow-hidden bg-navy-900">
              <img 
                src={trendingProduct?.image} 
                alt={trendingProduct?.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 text-white">
                <div className="bg-cam-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit mb-6 shadow-xl">Best Seller</div>
                <h3 className="text-4xl font-black mb-4 leading-tight group-hover:text-cam-500 transition-colors">{trendingProduct?.name}</h3>
                <p className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-8">{trendingProduct?.author}</p>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-white">{formatCurrency(trendingProduct?.price)}</span>
                  <button className="w-14 h-14 rounded-full bg-white text-navy-900 flex items-center justify-center group-hover:bg-cam-500 group-hover:text-white transition-all shadow-xl">
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </Link>
          </div>

          {/* Grid of smaller products */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Literature Section with Horizontal Scroll-like Feel */}
      <section className="py-32 bg-navy-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <div className="text-cam-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Tuyển tập chọn lọc</div>
              <h2 className="text-5xl font-black tracking-tight leading-none">VĂN HỌC KINH ĐIỂN</h2>
            </div>
            <Link to="/search?category=2" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:text-cam-500 transition-colors">
              Xem tất cả tác phẩm <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-cam-500 transition-colors"><ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {literatureProducts.slice(0, 5).map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-cam-500 flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-1 group-hover:text-cam-500 transition-colors line-clamp-1">{product.name}</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{product.author}</p>
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
          <Quote className="w-20 h-20 text-cam-500/10 mx-auto mb-12" />
          <h2 className="text-4xl lg:text-5xl font-black text-navy-900 italic leading-tight mb-12 max-w-4xl mx-auto">
            "Sách không chỉ là giấy và mực. Chúng là những hành trình đưa bạn đến những nơi bạn chưa bao giờ tới, gặp những người bạn chưa bao giờ quen."
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-12 h-1 px-4 bg-cam-500 mb-6"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">TayfBook Philosophy</p>
          </div>
        </div>
      </section>

      {/* 7. Advanced Newsletter Section */}
      <section className="pb-32 container mx-auto px-6">
        <div className="bg-navy-900 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)]">
          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cam-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <div className="lg:w-1/2 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full text-cam-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/5">
                Bản tin độc quyền
              </div>
              <h2 className="text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                NHẬN THÔNG TIN <br/>
                <span className="text-cam-500 italic">MỚI NHẤT</span> TỪ CHÚNG TÔI
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
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
