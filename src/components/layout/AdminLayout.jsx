import React from 'react';
import { Outlet, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Users, 
  LogOut, 
  ShoppingCart, 
  Search, 
  Bell, 
  HelpCircle,
  PlusCircle,
  Settings,
  Monitor
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Trang Chủ' },
    { path: '/admin/products', icon: Package, label: 'Quản lý sản phẩm' },
    { path: '/admin/categories', icon: FolderTree, label: 'Quản lý danh mục' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Quản lý đơn hàng' },
    { path: '/admin/users', icon: Users, label: 'Quản lý người dùng' },
    { path: '/admin/interface', icon: Settings, label: 'Cài đặt hệ thống' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-5 group">
            <img 
              src="/logo.png" 
              alt="TayfBook Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="h-8 w-[1.5px] bg-slate-200 hidden lg:block"></div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Hệ Thống</span>
              <span className="text-sm font-headline font-black text-navy-900 uppercase tracking-tight">Quản Trị Viên</span>
            </div>
          </Link>
        </div>

        {/* Centered Search Bar */}
        <div className="max-w-xl w-full relative hidden md:block mx-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cam-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm kiếm dữ liệu, đơn hàng, người dùng..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-cam-500/20 focus:border-cam-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button className="relative p-2.5 text-slate-500 hover:bg-white hover:text-cam-600 rounded-xl transition-all hover:shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 text-slate-500 hover:bg-white hover:text-cam-600 rounded-xl transition-all hover:shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-4 pl-2 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-black text-navy-900 leading-none mb-1">{user.username}</div>
              <div className="text-[9px] text-cam-600 font-black uppercase tracking-widest">Admin Power</div>
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-cam-500 transition-all">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20 h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-navy-900 text-white flex flex-col fixed left-0 bottom-0 top-20 z-40">
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-cam-500 text-white shadow-lg shadow-cam-500/20' 
                      : 'text-slate-400 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-cam-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
};

export default AdminLayout;
