import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import Modal from '../../components/ui/Modal';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', password: '', role: 'user', email: '', fullName: '' });
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Lỗi tải người dùng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setCurrentUser({ username: '', password: '', role: 'user', email: '', fullName: '' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser({ ...user });
    setError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser.username.trim() || !currentUser.password) {
      setError('Vui lòng điền tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      if (!currentUser.id) {
        const checkResponse = await fetch(`http://localhost:3000/users?username=${currentUser.username.trim()}`);
        const existing = await checkResponse.json();
        if (existing.length > 0) {
          setError('Tên đăng nhập đã tồn tại trong hệ thống.');
          return;
        }
      }

      const method = currentUser.id ? 'PUT' : 'POST';
      const url = currentUser.id 
        ? `http://localhost:3000/users/${currentUser.id}`
        : 'http://localhost:3000/users';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentUser,
          username: currentUser.username.trim()
        })
      });
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Lỗi khi lưu dữ liệu.');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    if (userToDelete.username === 'admin' && userToDelete.id === '1') {
      alert("Không thể xóa tài khoản Admin gốc!");
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      await fetch(`http://localhost:3000/users/${userToDelete.id}`, { method: 'DELETE' });
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-navy-900 text-cam-500';
      case 'staff': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Quản lý người dùng</h1>
          <p className="text-slate-500 font-medium">Quản trị viên có thể quản lý tài khoản và phân quyền trong TayfBook.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-black text-white hover:bg-cam-500 hover:text-black px-8 py-3 rounded-2xl font-black shadow-lg shadow-black/20 flex items-center gap-2 transition-all active:scale-95 group"
        >
          <UserPlus className="w-5 h-5 text-cam-500 group-hover:text-black transition-colors" /> Thêm người dùng mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng người dùng</p>
            <p className="text-2xl font-black text-navy-900 leading-none">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-cam-50 text-cam-500 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ban quản trị</p>
            <p className="text-2xl font-black text-navy-900 leading-none">{users.filter(u => u.role === 'admin' || u.role === 'staff').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thành viên mới</p>
            <p className="text-2xl font-black text-navy-900 leading-none">{users.filter(u => u.role === 'user').length}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 min-w-[300px] items-center gap-4 bg-slate-50 rounded-2xl px-4 py-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email, vai trò..." 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-navy-900 w-full placeholder:text-slate-400 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            className="appearance-none bg-slate-50 border-none rounded-xl px-8 py-2.5 text-sm font-bold text-navy-900 focus:ring-1 focus:ring-cam-500 outline-none pr-10"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
            <option value="user">Người dùng</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Người dùng</th>
                <th className="px-8 py-5">Vai trò</th>
                <th className="px-8 py-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-medium">Không tìm thấy người dùng nào.</td></tr>
              ) : filteredUsers.map((u, i) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border border-white shadow-sm ${u.role === 'admin' ? 'bg-navy-900 text-cam-500' : u.role === 'staff' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-navy-900 leading-tight">{u.fullName || u.username}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{u.email || u.username + '@tayfbook.com'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : u.role === 'staff' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {u.role === 'admin' ? 'Quản trị viên' : u.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => openEditModal(u)}
                        className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(u)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                        disabled={u.id === '1' && u.username === 'admin'}
                      >
                        <Trash2 className={`w-4 h-4 ${u.id === '1' && u.username === 'admin' ? 'opacity-20' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400">Hiển thị {filteredUsers.length} người dùng</p>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser.id ? "Cập nhật tài khoản" : "Tạo người dùng mới"}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên đăng nhập *</label>
              <input type="text" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none"
                value={currentUser.username} onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                disabled={currentUser.id === '1' && currentUser.username === 'admin'} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vai trò *</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none appearance-none"
                value={currentUser.role} onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                disabled={currentUser.id === '1' && currentUser.username === 'admin'}>
                <option value="user">Người dùng (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input type="email" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none"
              value={currentUser.email || ''} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} placeholder="example@tayfbook.com" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mật khẩu *</label>
            <input type="text" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none font-mono"
              value={currentUser.password} onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})} />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-navy-900">Hủy</button>
            <button type="submit" className="px-8 py-3 bg-navy-900 text-white rounded-2xl font-black shadow-lg shadow-navy-900/20 hover:bg-navy-800">
              {currentUser.id ? "Cập nhật" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Xác nhận xóa">
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-medium mb-8">Bạn có chắc chắn muốn xóa tài khoản <br/><span className="font-black text-navy-900 text-lg">"{userToDelete?.username}"</span> không?</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-navy-900">Hủy</button>
            <button onClick={handleDelete} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700">Đồng ý xóa</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManage;
