import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  Truck,
  RotateCcw,
  ChevronLeft
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [pRes, allRes] = await Promise.all([
          fetch(`http://localhost:3000/products/${id}`),
          fetch('http://localhost:3000/products')
        ]);
        
        if (!pRes.ok) {
          navigate('/');
          return;
        }
        
        const pData = await pRes.json();
        const allData = await allRes.json();
        
        setProduct(pData);
        setRelatedProducts(allData.filter(p => p.id !== pData.id).slice(0, 5));
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-medium">Đang tải...</p>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen pb-20 animate-fade-in bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-navy-900 transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/" className="hover:text-navy-900 transition-colors">Sách văn học</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/" className="hover:text-navy-900 transition-colors">Khoa học viễn tưởng</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy-900 font-bold">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Image Container */}
          <div className="lg:w-[45%]">
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-12">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right: Info Container */}
          <div className="lg:w-[55%] flex flex-col">
            <h1 className="text-4xl font-bold text-navy-900 leading-tight mb-2">
              {product.name} (Tái bản 2024)
            </h1>
            <p className="text-lg mb-6">
              <span className="text-slate-400 font-medium">Tác giả: </span>
              <span className="text-cam-600 font-bold">{product.author || 'Frank Herbert'}</span>
            </p>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-cam-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-xs font-medium text-slate-400">(428 đánh giá)</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-100">
              <div className="flex items-center gap-6 mb-2">
                <span className="text-4xl font-black text-cam-600">{formatCurrency(product.price)}</span>
                <span className="text-lg text-slate-300 line-through">350.000đ</span>
                <span className="bg-cam-500 text-white text-xs font-bold px-2 py-0.5 rounded">-30%</span>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
                Còn hàng
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-bold text-navy-900 mb-4 uppercase tracking-wider">Số lượng</p>
              <div className="flex items-center border border-slate-200 rounded-lg w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-navy-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center font-bold text-navy-900 bg-transparent"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-navy-900 transition-colors border-l border-slate-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#8B5E3C] hover:bg-[#70492E] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>
              <button 
                className="flex-1 bg-black hover:bg-slate-900 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
              >
                <span className="scale-x-[-1]"><ShoppingCart className="w-5 h-5" /></span>
                Mua ngay
              </button>
            </div>

            <div className="flex flex-wrap gap-8 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                <Truck className="w-5 h-5 text-slate-400" />
                Miễn phí giao hàng đơn {'>'} 300k
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                <RotateCcw className="w-5 h-5 text-slate-400" />
                Đổi trả trong 7 ngày
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Description */}
        <div className="mt-24 border-t border-slate-100 pt-8">
          <div className="flex gap-12 border-b border-slate-100 mb-12">
            <button className="pb-4 border-b-2 border-cam-600 text-sm font-bold text-navy-900">Mô tả</button>
            <button className="pb-4 text-sm font-bold text-slate-400 hover:text-navy-900">Thông tin chi tiết</button>
            <button className="pb-4 text-sm font-bold text-slate-400 hover:text-navy-900">Đánh giá (428)</button>
          </div>
          <div className="max-w-4xl space-y-6 text-slate-500 leading-relaxed font-medium">
            <p>
              {product.name} là kiệt tác khoa học viễn tưởng vĩ đại nhất mọi thời đại của Frank Herbert, lấy bối cảnh một tương lai xa xôi giữa một đế chế thiên hà liên tinh tú, nơi các gia tộc quý tộc tranh giành quyền kiểm soát hành tinh Arrakis - nguồn duy nhất của "hương dược" (spice melange), chất quý giá nhất trong vũ trụ.
            </p>
            <p>
              Câu chuyện theo chân Paul Atreides, người thừa kế trẻ tuổi của Gia tộc Atreides, khi gia đình anh bị đẩy vào trung tâm của những âm mưu chính trị tàn khốc. Paul phải đối mặt với số phận nghiệt ngã trên những cồn cát chết chóc, nơi anh sẽ gặp gỡ người bản địa Fremen và dần trở thành người dẫn dắt một cuộc cách mạng thay đổi vĩnh viễn vận mệnh của vũ trụ.
            </p>
            <p>
              Phiên bản tái bản 2024 mang đến chất lượng in ấn cao cấp, bản dịch được trau chuốt kỹ lưỡng và các phụ lục chi tiết, giúp độc giả mới lẫn cũ đều có thể đắm mình trọn vẹn vào thế giới đồ sộ và phức tạp của Frank Herbert.
            </p>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-navy-900">Sách cùng thể loại</h2>
            <Link to="/search" className="text-cam-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Xem tất cả <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group flex flex-col">
                <div className="aspect-[3/4] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden mb-4 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {p.id === 1 && <span className="absolute top-2 right-2 bg-cam-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">Mới</span>}
                </div>
                <h4 className="font-bold text-navy-900 mb-1 group-hover:text-cam-600 transition-colors line-clamp-1">{p.name}</h4>
                <p className="text-xs font-medium text-slate-400 mb-2">{p.author || 'Tác giả'}</p>
                <p className="text-sm font-black text-cam-600">{formatCurrency(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
