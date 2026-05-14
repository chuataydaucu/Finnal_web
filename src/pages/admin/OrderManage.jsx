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

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã hoàn thành': return 'bg-green-100 text-green-700';
      case 'Đang giao': return 'bg-blue-100 text-blue-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Doanh thu tháng</p>
            <p className="text-xl font-black text-navy-900 leading-none">42.8M</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đang vận chuyển</p>
            <p className="text-xl font-black text-navy-900 leading-none">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đã hủy</p>
            <p className="text-xl font-black text-navy-900 leading-none">05</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 min-w-[300px] items-center gap-4 bg-slate-50 rounded-2xl px-4 py-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn hàng, tên khách hàng..." 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-navy-900 w-full placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-navy-900 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
            Lọc theo trạng thái
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
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
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">Chưa có đơn hàng nào.</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-navy-900 text-sm">#ORD-{order.id.toString().padStart(4, '0')}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-white shadow-sm">
                        {order.customerName?.split(' ').map(n => n[0]).join('')}
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
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                      {order.status || 'Chờ xử lý'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400">Hiển thị 1 - 5 trong tổng số {orders.length} đơn hàng</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-navy-900 text-white rounded-xl text-xs font-black shadow-lg shadow-navy-900/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-navy-900 font-bold text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-navy-900 font-bold text-xs">3</button>
            <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManage;
