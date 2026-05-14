import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  BookOpen, 
  Users, 
  MoreVertical, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const StatCard = ({ title, value, subValue, icon: Icon, percentage, isPositive }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${isPositive ? 'bg-cam-50 text-cam-500' : 'bg-navy-50 text-navy-500'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-cam-600' : 'text-navy-400'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {percentage}%
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-navy-900 tracking-tight">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    newOrders: 0,
    totalBooks: 0,
    newUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch('http://localhost:3000/orders'),
          fetch('http://localhost:3000/products'),
          fetch('http://localhost:3000/users')
        ]);

        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const users = await usersRes.json();

        setStats({
          revenue: 128450000, // Hardcoded for demo to match design
          newOrders: 342,
          totalBooks: 4892,
          newUsers: 1204
        });

        const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Lỗi tải dữ liệu Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Greeting */}
      <div>
        <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Chào buổi sáng, Admin!</h1>
        <p className="text-slate-500 font-medium">Dưới đây là tóm tắt hoạt động của cửa hàng sách trong 24 giờ qua.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value="128.450.000đ" 
          icon={TrendingUp} 
          percentage="12.5" 
          isPositive={true}
        />
        <StatCard 
          title="Đơn hàng mới" 
          value="342" 
          icon={ShoppingCart} 
          percentage="8" 
          isPositive={true}
        />
        <StatCard 
          title="Tổng số sách" 
          value="4.892" 
          icon={BookOpen} 
          percentage="0" 
          isPositive={true}
        />
        <StatCard 
          title="Người dùng mới" 
          value="1.204" 
          icon={Users} 
          percentage="5.2" 
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-navy-900 tracking-tight">Biểu đồ doanh thu</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi tăng trưởng hàng tháng năm 2024</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-navy-900 focus:ring-0">
              <option>6 tháng gần nhất</option>
              <option>1 năm gần nhất</option>
            </select>
          </div>
          
          {/* Mockup Chart Area */}
          <div className="h-64 flex items-end justify-between gap-4 px-4 relative mt-12">
            {[40, 60, 45, 80, 55, 90].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div 
                  className="w-full bg-slate-50 rounded-2xl relative overflow-hidden flex items-end transition-all duration-500 group-hover:bg-slate-100"
                  style={{ height: '100%' }}
                >
                  <div 
                    className="w-full bg-cam-500 rounded-2xl transition-all duration-1000 ease-out shadow-lg shadow-cam-500/20"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="bg-navy-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col">
          <div className="relative z-10">
            <h2 className="text-xl font-black tracking-tight mb-6">Thống kê nhanh</h2>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Tổng hợp hiệu suất hệ thống hôm nay.</p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-cam-500 mt-2 shrink-0 shadow-lg shadow-cam-500/50"></div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Sách bán chạy nhất</h4>
                  <p className="text-xs text-slate-400">Modern Literature - Vol. 4</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-lg shadow-blue-500/50"></div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Khu vực mua nhiều</h4>
                  <p className="text-xs text-slate-400">Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-slate-500 mt-2 shrink-0"></div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Phiên truy cập</h4>
                  <p className="text-xs text-slate-400">4,321 người dùng/giờ</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-navy-800">
              <p className="text-[10px] text-cam-500 font-black uppercase tracking-[0.2em] mb-4">Lời khuyên hệ thống</p>
              <p className="text-sm italic text-slate-400 leading-relaxed">
                "Doanh thu tăng mạnh vào cuối tuần. Hãy cân nhắc chạy thêm chiến dịch flash sale vào tối Thứ 7."
              </p>
            </div>
          </div>
          
          {/* Abstract background shape */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cam-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-navy-900 tracking-tight">5 đơn hàng gần nhất</h2>
          <button className="flex items-center gap-2 text-sm font-bold text-cam-600 hover:text-cam-700 transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
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
              {[
                { id: 'ORD-8921', name: 'Nguyễn Văn Hùng', date: '10/10/2024', total: '1.250.000đ', status: 'Hoàn tất', statusColor: 'bg-green-100 text-green-700', avatar: 'NH' },
                { id: 'ORD-8920', name: 'Trần Mỹ Linh', date: '10/10/2024', total: '840.000đ', status: 'Đang giao', statusColor: 'bg-blue-100 text-blue-700', avatar: 'TL' },
                { id: 'ORD-8919', name: 'Quốc Minh', date: '09/10/2024', total: '2.100.000đ', status: 'Hủy đơn', statusColor: 'bg-red-100 text-red-700', avatar: 'QM' },
                { id: 'ORD-8918', name: 'Phan Thanh Tùng', date: '09/10/2024', total: '560.000đ', status: 'Hoàn tất', statusColor: 'bg-green-100 text-green-700', avatar: 'PT' },
                { id: 'ORD-8917', name: 'Kiều Anh', date: '09/10/2024', total: '3.450.000đ', status: 'Chờ xác nhận', statusColor: 'bg-slate-100 text-slate-700', avatar: 'KA' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-navy-900 text-sm">{order.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shadow-sm">
                        {order.avatar}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{order.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{order.date}</td>
                  <td className="px-8 py-5 text-sm font-black text-navy-900">{order.total}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
