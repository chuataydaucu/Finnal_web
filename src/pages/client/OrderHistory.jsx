import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Package, Calendar, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/orders?userId=${user.id}`);
        const data = await response.json();
        // Sort by newest first
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã hoàn thành': 
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">Đã hoàn thành</span>;
      case 'Đang giao': 
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">Đang giao</span>;
      case 'Đã hủy': 
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-200">Đã hủy</span>;
      default: 
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">Chờ xử lý</span>;
    }
  };

  if (!user) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-serif text-navy-900 mb-4">Vui lòng đăng nhập</h2>
        <Link to="/login" className="text-cam-500 hover:underline">Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6 flex items-center gap-3">
        <Package className="w-6 h-6 text-cam-500" /> 
        Lịch sử đơn hàng
      </h2>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Đang tải lịch sử...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
          <div className="flex justify-center text-slate-300 mb-4">
            <Package className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">Bạn chưa có đơn hàng nào</h3>
          <p className="text-slate-500 mb-6">Hãy khám phá thêm các cuốn sách tuyệt vời của chúng tôi.</p>
          <Link to="/" className="inline-block bg-cam-500 text-white px-6 py-2 rounded font-medium hover:bg-cam-600 transition-colors">
            Khám phá sách
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Mã đơn hàng</p>
                    <p className="font-bold text-navy-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Ngày đặt</p>
                    <p className="font-medium text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tổng tiền</p>
                    <p className="font-bold text-cam-500">{formatCurrency(order.total)}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 flex flex-col md:flex-row gap-8">
                {/* Items */}
                <div className="flex-1 space-y-4">
                  <h4 className="font-semibold text-navy-900 mb-3 border-b border-slate-100 pb-2">Sản phẩm</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded border border-slate-200 shadow-sm" />
                      <div>
                        <Link to={`/product/${item.id}`} className="font-medium text-navy-900 hover:text-cam-500 transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-sm text-slate-500 mt-1">Số lượng: {item.quantity}</p>
                        <p className="text-sm font-semibold text-cam-500 mt-1">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="md:w-1/3 bg-slate-50 p-4 rounded-lg border border-slate-100 h-fit">
                  <h4 className="font-semibold text-navy-900 mb-3 border-b border-slate-200 pb-2">Thông tin nhận hàng</h4>
                  <div className="space-y-3 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-800">{order.customerName}</span></p>
                    <p className="flex items-start gap-2">
                      <Phone className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> 
                      {order.phone}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> 
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
