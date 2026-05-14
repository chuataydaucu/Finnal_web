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
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Quản lý sản phẩm' },
    { path: '/admin/categories', icon: FolderTree, label: 'Quản lý danh mục' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Quản lý đơn hàng' },
    { path: '/admin/users', icon: Users, label: 'Quản lý người dùng' },
    { path: '/admin/interface', icon: Monitor, label: 'Quản lý giao diện' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt hệ thống' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cam-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg leading-tight text-navy-900">TayfBook Admin</span>
              <span className="text-[10px] text-slate-500 font-medium">Modern Academic Portal</span>
            </div>
          </Link>

          <div className="max-w-md w-full relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm hệ thống..." 
              className="w-full bg-slate-100 border-transparent rounded-full py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-1 focus:ring-cam-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-navy-900 leading-none">{user.username}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Super User</div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 bg-cam-100 flex items-center justify-center">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.username}&background=f59e0b&color=fff`} 
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-navy-900 text-white flex flex-col fixed left-0 bottom-0 top-16 z-40">
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
