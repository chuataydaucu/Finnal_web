import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  Send, 
  Filter, 
  Trash2, 
  Edit3, 
  Sparkles, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ReviewManage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState({});
  const [editStates, setEditStates] = useState({});
  const [filterTab, setFilterTab] = useState('all'); // all, unreplied, replied
  const [ratingFilter, setRatingFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, productsRes] = await Promise.all([
        fetch('http://localhost:3000/reviews'),
        fetch('http://localhost:3000/products')
      ]);

      const reviewsData = await reviewsRes.json();
      const productsData = await productsRes.json();

      // Convert products array to an object lookup table by ID
      const productsMap = {};
      productsData.forEach(p => {
        productsMap[p.id] = p;
      });

      // Sort reviews by date descending
      const sortedReviews = reviewsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReviews(sortedReviews);
      setProducts(productsMap);
      setLoading(false);
    } catch (err) {
      console.error("Error loading reviews data:", err);
      setLoading(false);
    }
  };

  const handleSendReply = async (reviewId, isEdit = false) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) return;

    const originalReview = reviews.find(r => r.id === reviewId);
    if (!originalReview) return;

    const updatedReview = {
      ...originalReview,
      replyContent: text,
      repliedAt: new Date().toISOString(),
      repliedBy: 'TayfBooks'
    };

    // Update locally
    setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
    setReplyInputs({ ...replyInputs, [reviewId]: '' });
    setEditStates({ ...editStates, [reviewId]: false });

    try {
      await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview)
      });
    } catch (err) {
      console.error("Error sending review reply:", err);
    }
  };

  const handleDeleteReply = async (reviewId) => {
    const originalReview = reviews.find(r => r.id === reviewId);
    if (!originalReview) return;

    // Remove the reply fields
    const updatedReview = { ...originalReview };
    delete updatedReview.replyContent;
    delete updatedReview.repliedAt;
    delete updatedReview.repliedBy;

    // Update locally
    setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
    setEditStates({ ...editStates, [reviewId]: false });

    try {
      await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview)
      });
    } catch (err) {
      console.error("Error deleting review reply:", err);
    }
  };

  const startEditReply = (reviewId, currentText) => {
    setEditStates({ ...editStates, [reviewId]: true });
    setReplyInputs({ ...replyInputs, [reviewId]: currentText });
  };

  const cancelEditReply = (reviewId) => {
    setEditStates({ ...editStates, [reviewId]: false });
    setReplyInputs({ ...replyInputs, [reviewId]: '' });
  };

  const filteredReviews = reviews.filter(r => {
    // Tab filter
    const hasReply = !!r.replyContent;
    if (filterTab === 'unreplied' && hasReply) return false;
    if (filterTab === 'replied' && !hasReply) return false;

    // Rating filter
    if (ratingFilter !== 'all' && r.rating !== parseInt(ratingFilter)) return false;

    return true;
  });

  // Calculate stats
  const totalReviewsCount = reviews.length;
  const unrepliedCount = reviews.filter(r => !r.replyContent).length;
  const avgRating = totalReviewsCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i <= rating ? 'fill-cam-500 text-cam-500' : 'text-slate-200'}`} 
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Đánh giá sách</h1>
        <p className="text-slate-500 font-medium">Xem và phản hồi ý kiến đánh giá từ độc giả về các tác phẩm.</p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all">
          <div className="p-4 bg-cam-50 text-cam-500 rounded-2xl">
            <Star className="w-6 h-6 fill-cam-500" />
          </div>
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Điểm đánh giá trung bình</h3>
            <p className="text-2xl font-black text-navy-900 leading-none">{avgRating} / 5.0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all">
          <div className="p-4 bg-navy-50 text-navy-500 rounded-2xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng số đánh giá</h3>
            <p className="text-2xl font-black text-navy-900 leading-none">{totalReviewsCount} lượt</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all">
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Chờ phản hồi</h3>
            <p className="text-2xl font-black text-red-500 leading-none">{unrepliedCount} lượt</p>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unreplied', label: `Chờ phản hồi (${unrepliedCount})` },
            { id: 'replied', label: 'Đã phản hồi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                filterTab === tab.id 
                  ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/10' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right rating filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4" /> Điểm đánh giá:
          </span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-1 focus:ring-cam-500"
          >
            <option value="all">Tất cả sao</option>
            <option value="5">5 Sao ⭐⭐⭐⭐⭐</option>
            <option value="4">4 Sao ⭐⭐⭐⭐</option>
            <option value="3">3 Sao ⭐⭐⭐</option>
            <option value="2">2 Sao ⭐⭐</option>
            <option value="1">1 Sao ⭐</option>
          </select>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {filteredReviews.map(review => {
          const product = products[review.productId] || { name: 'Sách đã xóa hoặc ẩn', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f' };
          const formattedDate = new Date(review.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const isEditing = editStates[review.id];

          return (
            <div key={review.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all duration-300">
              {/* Product Book Info Block */}
              <div className="md:w-48 shrink-0 flex md:flex-col items-center gap-4 border-r border-slate-100/80 pr-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 md:w-24 h-24 md:h-36 rounded-2xl object-cover shadow-sm border border-slate-100"
                />
                <div className="text-center md:text-left flex-1 md:flex-initial">
                  <h4 className="font-black text-navy-900 text-sm line-clamp-2 md:text-center mb-1 leading-tight">{product.name}</h4>
                  {product.author && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider md:text-center">{product.author}</p>
                  )}
                </div>
              </div>

              {/* Review details block */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-navy-900">{review.username}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      <span className="text-xs text-slate-400 font-medium">{formattedDate}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                    "{review.comment}"
                  </p>
                </div>

                {/* Reply section */}
                <div className="pt-4 border-t border-slate-50">
                  {review.replyContent && !isEditing ? (
                    <div className="bg-navy-900/5 border border-navy-900/10 p-5 rounded-[2rem] space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Đã phản hồi bởi: <span className="text-cam-600 font-black">{review.repliedBy}</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditReply(review.id, review.replyContent)}
                            className="p-2 text-slate-500 hover:text-navy-900 hover:bg-white rounded-xl transition-all"
                            title="Sửa phản hồi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReply(review.id)}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                            title="Xóa phản hồi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs font-medium italic leading-relaxed">
                        "{review.replyContent}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-cam-500" />
                        <span>{isEditing ? 'Sửa nội dung phản hồi:' : 'Gửi lời phản hồi tới khách hàng:'}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nhập nội dung trả lời..."
                          value={replyInputs[review.id] || ''}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [review.id]: e.target.value })}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs focus:ring-1 focus:ring-cam-500 outline-none text-slate-800 font-medium"
                        />
                        <button
                          onClick={() => handleSendReply(review.id, isEditing)}
                          disabled={!replyInputs[review.id]?.trim()}
                          className="px-5 py-3 bg-cam-500 hover:bg-cam-600 disabled:opacity-50 text-navy-900 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-cam-500/10"
                        >
                          <Send className="w-3.5 h-3.5" /> Gửi
                        </button>
                        {isEditing && (
                          <button
                            onClick={() => cancelEditReply(review.id)}
                            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold transition-all active:scale-95"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredReviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto opacity-70" />
            <div className="text-center">
              <h3 className="font-black text-navy-900 text-base mb-1">Không có đánh giá nào</h3>
              <p className="text-xs text-slate-500 font-medium">Không tìm thấy lượt đánh giá nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManage;
