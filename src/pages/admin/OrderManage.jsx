import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  XCircle,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Modal from '../../components/ui/Modal';

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders');
      const data = await response.json();
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Lỗi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // If cancelling order, return stock
      if (newStatus === 'Đã hủy' && order.status !== 'Đã hủy') {
        for (const item of order.items) {
          const prodRes = await fetch(`http://localhost:3000/products/${item.id}`);
          const product = await prodRes.json();
          await fetch(`http://localhost:3000/products/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: (product.stock || 0) + item.quantity })
          });
        }
      }

      await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã hoàn thành': return 'bg-green-100 text-green-700';
      case 'Đang giao': return 'bg-blue-100 text-blue-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchQuery) || 
                         order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter(o => o.status === 'Đã hoàn thành')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Quản lý đơn hàng</h1>
          <p className="text-slate-500 font-medium">Theo dõi và xử lý các giao dịch mua sắm từ khách hàng TayfBook.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tổng đơn hàng</p>
            <p className="text-xl font-black text-navy-900 leading-none">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-cam-50 text-cam-500 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Doanh thu (Giao xong)</p>
            <p className="text-xl font-black text-navy-900 leading-none">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đang giao</p>
            <p className="text-xl font-black text-navy-900 leading-none">{orders.filter(o => o.status === 'Đang giao').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đã hủy</p>
            <p className="text-xl font-black text-navy-900 leading-none">{orders.filter(o => o.status === 'Đã hủy').length}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 min-w-[300px] items-center gap-4 bg-slate-50 rounded-2xl px-4 py-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm mã đơn, tên khách..." 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-navy-900 w-full placeholder:text-slate-400 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-slate-50 border-none rounded-xl px-6 py-2.5 text-sm font-bold text-navy-900 focus:ring-1 focus:ring-cam-500 outline-none pr-10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Mã đơn hàng</th>
                <th className="px-8 py-5">Khách hàng</th>
                <th className="px-8 py-5">Ngày đặt</th>
                <th className="px-8 py-5">Tổng tiền</th>
                <th className="px-8 py-5">Trạng thái</th>
                <th className="px-8 py-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">Không tìm thấy đơn hàng phù hợp.</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-navy-900 text-sm">#ORD-{order.id.toString().substring(0, 8)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-white shadow-sm uppercase">
                        {order.customerName?.substring(0, 2)}
                      </div>
                      <span className="text-sm font-black text-navy-900">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Calendar className="w-4 h-4 opacity-40" />
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-navy-900">{formatCurrency(order.total)}</td>
                  <td className="px-8 py-5">
                    <div className="relative group/status">
                      <select 
                        value={order.status || 'Chờ xử lý'}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`appearance-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer border-none transition-all ${getStatusStyle(order.status || 'Chờ xử lý')}`}
                      >
                        <option value="Chờ xử lý">Chờ xử lý</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => {setSelectedOrder(order); setIsDetailModalOpen(true);}}
                        className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-navy-900">Chi tiết đơn hàng #ORD-{selectedOrder.id.toString().substring(0, 8)}</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-navy-900 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thông tin khách hàng</p>
                  <p className="text-sm font-black text-navy-900 mb-1">{selectedOrder.customerName}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.phone}</p>
                  <p className="text-sm text-slate-500 mt-2">{selectedOrder.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ngày đặt & Trạng thái</p>
                  <p className="text-sm font-bold text-slate-500 mb-2">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${getStatusStyle(selectedOrder.status)}`}>
                    {selectedOrder.status || 'Chờ xử lý'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sản phẩm đã đặt</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="w-12 h-16 bg-white rounded-lg overflow-hidden border border-slate-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-navy-900 leading-tight">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Số lượng: {item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-navy-900">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center">
                <p className="text-lg font-black text-navy-900">Tổng cộng</p>
                <p className="text-2xl font-black text-cam-600">{formatCurrency(selectedOrder.total)}</p>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-8 py-3 bg-navy-900 text-white rounded-2xl font-black shadow-lg shadow-navy-900/20 hover:bg-navy-800 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManage;
