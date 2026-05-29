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
  ChevronRight,
  ListTodo,
  Plus,
  Trash2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, percentage, isPositive }) => (
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
  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    newOrders: 0,
    totalBooks: 0,
    newUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // To-do list logic for staff
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`tayfbook_tasks_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Kiểm tra 5 đơn hàng mới nhất', completed: false },
      { id: 2, text: 'Cập nhật tồn kho sách "OnePiece"', completed: true },
      { id: 3, text: 'Kiểm tra danh mục sách Truyện Hay vc', completed: false },
      { id: 4, text: 'Hỗ trợ email khách hàng trinhduy...', completed: false }
    ];
  });

  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    localStorage.setItem(`tayfbook_tasks_${user?.id || 'guest'}`, JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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

        // Calculate Revenue (Only Completed Orders)
        const completedOrders = orders.filter(o => o.status === 'Đã hoàn thành');
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

        setStats({
          revenue: totalRevenue,
          newOrders: orders.length,
          totalBooks: products.length,
          newUsers: users.length
        });

        // Calculate Daily Revenue for the current month
        const now = new Date();
        
        // Get last 6 days for the chart
        const dailyData = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          
          const dayRevenue = orders
            .filter(o => {
              if (!o.createdAt) return false;
              const oDate = new Date(o.createdAt);
              return o.status === 'Đã hoàn thành' && 
                     oDate.getFullYear() === date.getFullYear() &&
                     oDate.getMonth() === date.getMonth() &&
                     oDate.getDate() === date.getDate();
            })
            .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
            
          dailyData.push({
            label: date.getDate() + '/' + (date.getMonth() + 1),
            value: dayRevenue
          });
        }

        const maxRevenue = Math.max(...dailyData.map(d => d.value), 1);
        const processedChartData = dailyData.map(d => ({
          ...d,
          height: (d.value / maxRevenue) * 90 + 10 
        }));
        setChartData(processedChartData);

        const sortedOrders = orders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        }).slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Lỗi tải dữ liệu Dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cam-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Greeting */}
      <div>
        <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">
          {user?.role === 'staff' ? `Chào buổi sáng, ${user.fullName || user.username}!` : 'Chào buổi sáng, Admin!'}
        </h1>
        <p className="text-slate-500 font-medium">
          {user?.role === 'staff' 
            ? 'Hôm nay bạn có một số công việc quản lý sách, danh mục và đơn hàng cần xử lý.' 
            : 'Dưới đây là tóm tắt hoạt động của cửa hàng sách tính đến hiện tại.'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={formatCurrency(stats.revenue)} 
          icon={TrendingUp} 
          percentage="12.5" 
          isPositive={true}
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.newOrders.toString()} 
          icon={ShoppingCart} 
          percentage="8" 
          isPositive={true}
        />
        <StatCard 
          title="Tổng số sách" 
          value={stats.totalBooks.toLocaleString()} 
          icon={BookOpen} 
          percentage="0" 
          isPositive={true}
        />
        {user?.role === 'staff' ? (
          <StatCard 
            title="Công việc hôm nay" 
            value={`${completedCount}/${totalCount} việc`} 
            icon={ListTodo} 
            percentage={progressPercent.toString()} 
            isPositive={progressPercent > 50}
          />
        ) : (
          <StatCard 
            title="Người dùng" 
            value={stats.newUsers.toString()} 
            icon={Users} 
            percentage="5.2" 
            isPositive={true}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-navy-900 tracking-tight">Doanh thu theo ngày</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Dữ liệu thực tế 6 ngày gần nhất</p>
            </div>
            <div className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
              Đơn vị: VNĐ
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4 relative mt-12">
            {chartData.map((day, i) => (
              <div key={i} className="h-full flex-1 flex flex-col justify-end items-center gap-2 group relative">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg z-20 pointer-events-none whitespace-nowrap">
                  {formatCurrency(day.value)}
                </div>
                
                <div 
                  className="w-full flex-1 bg-slate-50 rounded-2xl relative overflow-hidden flex items-end transition-all duration-500 group-hover:bg-slate-100"
                >
                  <div 
                    className="w-full bg-cam-500 rounded-2xl transition-all duration-1000 ease-out shadow-lg shadow-cam-500/20"
                    style={{ height: `${day.height}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Sidebar / Tasks Checklist */}
        {user?.role === 'staff' ? (
          <div className="bg-navy-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-xl font-black tracking-tight mb-2">Nhiệm vụ của tôi</h2>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">Quản lý các đầu việc hàng ngày.</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Tiến độ hoàn thành</span>
                  <span className="text-cam-500">{progressPercent}%</span>
                </div>
                <div className="w-full bg-navy-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-cam-500 h-full rounded-full transition-all duration-500 shadow-lg shadow-cam-500/30"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between gap-3 bg-navy-800/40 p-3.5 rounded-2xl border border-navy-800 hover:border-navy-700 transition-all group">
                    <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={t.completed} 
                        onChange={() => toggleTask(t.id)}
                        className="w-4 h-4 rounded border-navy-700 bg-navy-800 text-cam-500 focus:ring-cam-500/20 cursor-pointer"
                      />
                      <span className={`text-xs font-medium truncate ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.text}
                      </span>
                    </label>
                    <button 
                      onClick={() => deleteTask(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                      title="Xóa nhiệm vụ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-6">Tuyệt vời! Không còn công việc nào.</p>
                )}
              </div>
            </div>

            {/* Add task form */}
            <form onSubmit={addTask} className="relative z-10 mt-6 pt-6 border-t border-navy-800 flex gap-2">
              <input 
                type="text" 
                placeholder="Thêm nhiệm vụ mới..." 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 bg-navy-800 border-none rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-cam-500 outline-none"
              />
              <button 
                type="submit"
                className="bg-cam-500 hover:bg-cam-600 text-navy-900 p-2.5 rounded-xl font-bold transition-all active:scale-95 shrink-0 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cam-500/10 rounded-full blur-3xl"></div>
          </div>
        ) : (
          <div className="bg-navy-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col">
            <div className="relative z-10">
              <h2 className="text-xl font-black tracking-tight mb-6">Thống kê nhanh</h2>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Tổng hợp hiệu suất hệ thống.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-cam-500 mt-2 shrink-0 shadow-lg shadow-cam-500/50"></div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Cửa hàng</h4>
                    <p className="text-xs text-slate-400">Đang hoạt động ổn định</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-lg shadow-blue-500/50"></div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Dữ liệu</h4>
                    <p className="text-xs text-slate-400">Tự động đồng bộ hóa</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-500 mt-2 shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Phiên bản</h4>
                    <p className="text-xs text-slate-400">TayfBook v2.0 (Academic)</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-navy-800">
                <p className="text-[10px] text-cam-500 font-black uppercase tracking-[0.2em] mb-4">Lời khuyên hệ thống</p>
                <p className="text-sm italic text-slate-400 leading-relaxed">
                  "Hãy kiểm tra các đơn hàng mới thường xuyên để đảm bảo tiến độ giao hàng cho khách."
                </p>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cam-500/10 rounded-full blur-3xl"></div>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-navy-900 tracking-tight">Đơn hàng mới nhất</h2>
          <Link to="/admin/orders" className="flex items-center gap-2 text-sm font-bold text-cam-600 hover:text-cam-700 transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders && recentOrders.length > 0 ? recentOrders.map((order, i) => {
                const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '---';
                return (
                  <tr key={order.id || i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-bold text-navy-900 text-sm">#ORD-{order.id ? order.id.toString().substring(0, 8) : '---'}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shadow-sm uppercase">
                          {order.customerName?.substring(0, 2) || 'U'}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{order.customerName || 'Khách hàng'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500">{dateStr}</td>
                    <td className="px-8 py-5 text-sm font-black text-navy-900">{formatCurrency(order.total || 0)}</td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status || 'Chờ xử lý'}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium italic">Không có đơn hàng nào gần đây</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
