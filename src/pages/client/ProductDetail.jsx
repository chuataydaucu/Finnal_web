import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  Truck,
  RotateCcw,
  ChevronLeft,
  Edit2,
  Save,
  X,
  Trash2,
  CheckCircle2
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Tabs & Gallery State
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Admin Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [hasPurchased, setHasPurchased] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [pRes, allRes, revRes] = await Promise.all([
          fetch(`http://localhost:3000/products/${id}`),
          fetch('http://localhost:3000/products'),
          fetch(`http://localhost:3000/reviews?productId=${id}`)
        ]);
        
        if (!pRes.ok) {
          navigate('/');
          return;
        }
        
        const pData = await pRes.json();
        const allData = await allRes.json();
        const revData = await revRes.json();
        
        setProduct(pData);
        setEditData(pData);
        setReviews(revData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        
        // Logic tìm sách cùng thể loại HOẶC cùng tác giả
        const related = allData.filter(p => 
          p.id !== pData.id && 
          (p.categoryIds?.some(cid => pData.categoryIds?.includes(cid)) || p.author === pData.author)
        ).slice(0, 5);
        setRelatedProducts(related);

        // Kiểm tra xem user đã mua hàng chưa
        if (user) {
          const orderRes = await fetch(`http://localhost:3000/orders?userId=${user.id}`);
          const orders = await orderRes.json();
          const purchased = orders.some(order => 
            order.items.some(item => String(item.id) === String(id)) && order.status === 'Đã hoàn thành'
          );
          setHasPurchased(purchased);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
    window.scrollTo(0, 0);
  }, [id, navigate, user]);

  const handleAddToCart = () => {
    if (!user) {
      addToast('Vui lòng đăng nhập để thêm vào giỏ hàng', 'info');
      navigate('/login');
      return;
    }
    addToCart({ ...product, quantity });
  };

  const handleAdminSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        const updated = await response.json();
        setProduct(updated);
        setIsEditing(false);
        alert('Đã lưu thay đổi thành công!');
      }
    } catch (err) {
      alert('Lỗi khi lưu thay đổi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !hasPurchased) return;
    
    setSubmittingReview(true);
    const newReview = {
      productId: id,
      userId: user.id,
      username: user.username,
      rating: userReview.rating,
      comment: userReview.comment,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        const savedReview = await response.json();
        setReviews([savedReview, ...reviews]);
        setUserReview({ rating: 5, comment: '' });
        alert('Cảm ơn bạn đã đánh giá!');
      }
    } catch (err) {
      alert('Lỗi khi gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (revId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await fetch(`http://localhost:3000/reviews/${revId}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== revId));
    } catch (err) {
      alert('Lỗi khi xóa đánh giá');
    }
  };

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-medium">Đang tải...</p>
    </div>
  );

  if (!product) return null;

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen pb-20 animate-fade-in bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Admin Controls Floating */}
        {user?.role === 'admin' && (
          <div className="flex justify-end mb-4 gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-cam-600 transition-all"
              >
                <Edit2 className="w-4 h-4" /> Chỉnh sửa trang này
              </button>
            ) : (
              <>
                <button 
                  onClick={handleAdminSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu tất cả'}
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setEditData(product); }}
                  className="flex items-center gap-2 bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all"
                >
                  <X className="w-4 h-4" /> Hủy
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Enhanced Image Gallery */}
          <div className="lg:w-[35%]">
            <div className="relative group">
              <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center p-4 lg:p-6 transition-all duration-500">
                <img 
                  src={productImages[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain drop-shadow-xl animate-fade-in"
                />
              </div>
              
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-navy-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-navy-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails & Admin Image Management */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-3 pb-2 justify-center">
                {/* Existing Images */}
                {(isEditing ? editData.images || [editData.image] : productImages).map((img, idx) => (
                  <div key={idx} className="relative group/thumb">
                    <button
                      onClick={() => setActiveImageIndex(idx)}
                      className={`shrink-0 w-14 h-14 rounded-xl border-2 overflow-hidden transition-all ${
                        activeImageIndex === idx ? 'border-cam-500 scale-105' : 'border-slate-100 grayscale hover:grayscale-0'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                    </button>
                    
                    {isEditing && (
                      <button 
                        onClick={() => {
                          const newImages = [...(editData.images || [editData.image])];
                          newImages.splice(idx, 1);
                          setEditData({...editData, images: newImages});
                          if (activeImageIndex >= newImages.length) setActiveImageIndex(Math.max(0, newImages.length - 1));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity z-30"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Image Button (Admin only) */}
                {isEditing && (
                  <button 
                    onClick={() => {
                      const currentImages = editData.images || [editData.image];
                      setEditData({...editData, images: [...currentImages, ""]});
                      setActiveImageIndex(currentImages.length);
                    }}
                    className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-cam-500 hover:text-cam-500 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* URL Input for the active image in Edit Mode */}
              {isEditing && (
                <div className="mt-4 animate-fade-in">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Đường dẫn ảnh {activeImageIndex + 1}</p>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 bg-slate-50 border border-cam-500 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none"
                      placeholder="Dán URL ảnh vào đây..."
                      value={(editData.images || [editData.image])[activeImageIndex] || ''}
                      onChange={(e) => {
                        const newImages = [...(editData.images || [editData.image])];
                        newImages[activeImageIndex] = e.target.value;
                        setEditData({...editData, images: newImages, image: newImages[0]}); // Update main image too if first
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info Container */}
          <div className="lg:w-[65%] flex flex-col">
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-4xl font-bold text-navy-900 leading-tight">
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 border border-cam-500 rounded-lg px-2 py-1"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                ) : product.name}
              </h1>
              
              <div className="flex items-center flex-wrap gap-4 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Tác giả: </span>
                  {isEditing ? (
                    <input 
                      className="bg-slate-50 border border-cam-500 rounded-lg px-2 py-1"
                      value={editData.author || ''}
                      onChange={(e) => setEditData({...editData, author: e.target.value})}
                    />
                  ) : (
                    <span className="text-cam-600 font-bold uppercase tracking-wider">{product.author || 'Đang cập nhật'}</span>
                  )}
                </p>
                <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="flex text-cam-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">({reviews.length} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Redesigned Price Section */}
            <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cam-500/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl font-black text-cam-600 tracking-tighter">
                    {isEditing ? (
                      <input 
                        type="number"
                        className="w-40 bg-white border border-cam-500 rounded-lg px-2 text-3xl"
                        value={editData.price}
                        onChange={(e) => setEditData({...editData, price: Number(e.target.value)})}
                      />
                    ) : formatCurrency(product.price)}
                  </span>
                  <div className="flex flex-col">
                    {(isEditing || (product.oldPrice && product.oldPrice > 0)) && (
                      <span className="text-slate-300 line-through text-lg font-bold">
                        {isEditing ? (
                          <input 
                            type="number"
                            className="w-24 bg-white border border-cam-500 rounded-lg px-1 text-sm"
                            value={editData.oldPrice || 0}
                            onChange={(e) => setEditData({...editData, oldPrice: Number(e.target.value)})}
                          />
                        ) : formatCurrency(product.oldPrice)}
                      </span>
                    )}
                    
                    {(isEditing || (product.discountPercentage && product.discountPercentage > 0)) && (
                      <span className="text-cam-500 text-sm font-black uppercase">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            -
                            <input 
                              type="number"
                              className="w-12 bg-white border border-cam-500 rounded-lg px-1 text-xs"
                              value={editData.discountPercentage || 0}
                              onChange={(e) => setEditData({...editData, discountPercentage: Number(e.target.value)})}
                            />
                            % GIẢM GIÁ
                          </div>
                        ) : (
                          `-${product.discountPercentage}% GIẢM GIÁ`
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 w-fit px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  Sẵn sàng giao hàng
                </div>
                {product.stock <= 0 && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 w-fit px-4 py-2 rounded-xl border border-red-100 animate-pulse">
                    <X className="w-4 h-4" />
                    Hiện tại đã hết hàng
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-black text-navy-900 uppercase tracking-[0.2em]">Số lượng</p>
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl w-fit p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock <= 0}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-cam-600 rounded-xl transition-all disabled:opacity-20"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-10 text-center font-black text-navy-900 bg-transparent text-base"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock <= 0}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-cam-600 rounded-xl transition-all disabled:opacity-20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 pt-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full ${product.stock <= 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-navy-900 text-white hover:bg-cam-600 shadow-xl shadow-navy-900/10 active:scale-[0.98]'} py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock <= 0 ? 'Sản phẩm hết hàng' : 'Thêm vào túi sách'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Truck className="w-5 h-5 text-cam-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-navy-900 uppercase">Giao hàng</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase">Miễn phí {'>'} 300k</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <RotateCcw className="w-5 h-5 text-cam-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-navy-900 uppercase">Đổi trả</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase">Trong 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="mt-24">
          <div className="flex justify-center gap-1 lg:gap-8 bg-slate-50 p-1.5 rounded-2xl mb-12 w-fit mx-auto">
            {[
              { id: 'description', label: 'Mô tả nội dung' },
              { id: 'details', label: 'Thông số kỹ thuật' },
              { id: 'reviews', label: `Đánh giá (${reviews.length})` }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-navy-900 text-white shadow-lg' : 'text-slate-400 hover:text-navy-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in">
            {activeTab === 'description' && (
              <div className="relative group">
                {isEditing ? (
                  <textarea 
                    className="w-full h-64 bg-slate-50 border-2 border-cam-500 rounded-2xl p-6 text-slate-600 leading-relaxed font-medium focus:outline-none"
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                  />
                ) : (
                  <div className="space-y-6 text-slate-600 leading-relaxed font-medium text-lg italic border-l-4 border-cam-500 pl-8">
                    {product.description?.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-3xl p-10 border border-slate-100">
                {[
                  { label: 'Mã hàng (ISBN)', key: 'isbn' },
                  { label: 'Nhà xuất bản', key: 'publisher' },
                  { label: 'Năm xuất bản', key: 'publishedYear' },
                  { label: 'Trọng lượng', key: 'weight' },
                  { label: 'Kích thước', key: 'dimensions' }
                ].map(spec => (
                  <div key={spec.key} className="flex flex-col gap-1 border-b border-white pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    {isEditing ? (
                      <input 
                        className="bg-white border border-cam-500 rounded-lg px-3 py-2 text-sm font-bold text-navy-900"
                        value={editData[spec.key] || ''}
                        onChange={(e) => setEditData({...editData, [spec.key]: e.target.value})}
                      />
                    ) : (
                      <span className="text-sm font-bold text-navy-900 uppercase">{product[spec.key] || 'Chưa cập nhật'}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12">
                {/* Add Review Form */}
                {user && hasPurchased && (
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                    <h3 className="text-xl font-bold text-navy-900 mb-6">Viết đánh giá của bạn</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star}
                            type="button"
                            onClick={() => setUserReview({...userReview, rating: star})}
                            className={`w-8 h-8 ${star <= userReview.rating ? 'text-cam-500' : 'text-slate-300'}`}
                          >
                            <Star className={`w-full h-full ${star <= userReview.rating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:border-cam-500 outline-none transition-all"
                        placeholder="Chia sẻ trải nghiệm của bạn về cuốn sách..."
                        rows="4"
                        required
                        value={userReview.comment}
                        onChange={(e) => setUserReview({...userReview, comment: e.target.value})}
                      />
                      <button 
                        type="submit"
                        disabled={submittingReview}
                        className="bg-navy-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cam-600 transition-all disabled:opacity-50"
                      >
                        {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                      </button>
                    </form>
                  </div>
                )}
                
                {user && !hasPurchased && user.role !== 'admin' && (
                  <div className="p-6 bg-cam-50 rounded-2xl border border-cam-200 flex items-center gap-4 text-cam-700">
                    <Star className="w-6 h-6 fill-current" />
                    <p className="font-bold">Bạn cần hoàn thành mua sản phẩm này để có thể đánh giá.</p>
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 italic">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </div>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="bg-white border-b border-slate-100 pb-8 group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-navy-900 font-bold uppercase">
                              {review.username.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-navy-900">{review.username}</p>
                              <div className="flex text-cam-400 scale-75 origin-left">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-400 font-medium">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                            {user?.role === 'admin' && (
                              <button 
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed pl-16 italic font-medium">"{review.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col gap-2">
              <span className="text-cam-500 text-xs font-black uppercase tracking-[0.3em]">Cùng bộ sưu tập</span>
              <h2 className="text-3xl font-black text-navy-900 uppercase">Khám phá thêm</h2>
            </div>
            <Link to="/all-categories" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-navy-900">
              Xem tất cả <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-navy-900 group-hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></div>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group flex flex-col h-full bg-white rounded-3xl border border-slate-50 hover:border-cam-500/20 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="aspect-[3/4] bg-slate-50 overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-all"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-navy-900 mb-1 group-hover:text-cam-600 transition-colors line-clamp-1">{p.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">{p.author || 'Đang cập nhật'}</p>
                  <p className="text-sm font-black text-cam-600 mt-auto">{formatCurrency(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
