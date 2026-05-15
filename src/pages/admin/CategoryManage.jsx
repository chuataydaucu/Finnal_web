import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderTree, 
  BookCopy, 
  Eye, 
  Sparkles, 
  History,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  PlusCircle
} from 'lucide-react';
import Modal from '../../components/ui/Modal';

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '', status: 'visible' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [resCats, resProds] = await Promise.all([
        fetch('http://localhost:3000/categories'),
        fetch('http://localhost:3000/products')
      ]);
      setCategories(await resCats.json());
      setProducts(await resProds.json());
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setCurrentCategory({ name: '', status: 'visible' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory({
      ...category,
      status: category.status || 'visible'
    });
    setError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) {
      setError('Tên danh mục không được để trống.');
      return;
    }

    const method = currentCategory.id ? 'PUT' : 'POST';
    const url = currentCategory.id 
      ? `http://localhost:3000/categories/${currentCategory.id}`
      : 'http://localhost:3000/categories';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...currentCategory,
          name: currentCategory.name.trim(),
          status: currentCategory.status || 'visible',
          createdAt: currentCategory.createdAt || new Date().toISOString()
        })
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError('Lỗi khi lưu dữ liệu.');
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await fetch(`http://localhost:3000/categories/${categoryToDelete.id}`, { method: 'DELETE' });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Quản lý danh mục</h1>
          <p className="text-slate-500 font-medium">Tổ chức và quản lý các phân loại sách trong hệ thống TayfBook.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-navy-900 hover:bg-cam-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-navy-900/20 flex items-center gap-2 transition-all active:scale-95 group"
        >
          <PlusCircle className="w-5 h-5 text-cam-500 group-hover:text-white transition-colors" /> Thêm danh mục mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-cam-50 text-cam-500 rounded-2xl flex items-center justify-center">
            <FolderTree className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng danh mục</p>
            <p className="text-2xl font-black text-navy-900 leading-none">{categories.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-navy-50 text-navy-900 rounded-2xl flex items-center justify-center">
            <BookCopy className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sách đã phân loại</p>
            <p className="text-2xl font-black text-navy-900 leading-none">
              {products.filter(p => p.categoryIds && p.categoryIds.length > 0).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang hiển thị</p>
            <p className="text-2xl font-black text-navy-900 leading-none">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Tên danh mục</th>
                <th className="px-8 py-5">Số lượng sách</th>
                <th className="px-8 py-5">Ngày tạo</th>
                <th className="px-8 py-5">Trạng thái</th>
                <th className="px-8 py-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td></tr>
              ) : categories.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-navy-900 ${i % 2 === 0 ? 'bg-navy-50' : 'bg-cam-50 text-cam-500'}`}>
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-navy-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">
                    {products.filter(p => p.categoryIds?.includes(cat.id)).length}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">
                    {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('vi-VN') : '12/05/2023'}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${cat.status === 'hidden' ? 'bg-slate-100 text-slate-400' : 'bg-green-100 text-green-600'}`}>
                      {cat.status === 'hidden' ? 'Ẩn' : 'Hiện'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(cat)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400">Hiển thị 1 - 5 trong tổng số {categories.length} danh mục</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-navy-900 text-white rounded-xl text-xs font-black shadow-lg shadow-navy-900/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-navy-900 font-bold text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-navy-900 font-bold text-xs">3</button>
            <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smart Filter Banner */}
        <div className="lg:col-span-2 bg-navy-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 max-w-md">
            <h2 className="text-2xl font-black tracking-tight mb-4">Phân loại thông minh</h2>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              Sử dụng tính năng gợi ý danh mục dựa trên AI để tối ưu hóa trải nghiệm khách hàng tại TayfBook.
            </p>
            <button className="bg-cam-500 hover:bg-cam-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-cam-500/20 transition-all active:scale-95">
              Khám phá ngay
            </button>
          </div>
          <div className="absolute top-10 right-10 opacity-10">
            <Sparkles className="w-40 h-40" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cam-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-navy-900 tracking-tight">Hoạt động gần đây</h2>
            <History className="w-5 h-5 text-navy-900" />
          </div>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-navy-900 mt-2 shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-navy-900 leading-tight mb-1">Admin đã cập nhật trạng thái danh mục <span className="text-cam-600">Văn học</span> thành "Hiện".</p>
                <p className="text-xs text-slate-400 font-medium italic">10 phút trước</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-navy-900 mt-2 shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-navy-900 leading-tight mb-1">Danh mục <span className="text-cam-600">Truyện tranh</span> vừa có thêm 12 đầu sách mới.</p>
                <p className="text-xs text-slate-400 font-medium italic">2 giờ trước</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-navy-900 mt-2 shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-navy-900 leading-tight mb-1">Hệ thống đã tự động sao lưu dữ liệu danh mục thành công.</p>
                <p className="text-xs text-slate-400 font-medium italic">5 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCategory.id ? "Sửa danh mục" : "Thêm danh mục mới"}>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên danh mục *</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none"
              value={currentCategory.name}
              onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              placeholder="VD: Văn học cổ điển"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Trạng thái hiển thị</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentCategory({...currentCategory, status: 'visible'})}
                className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${currentCategory.status !== 'hidden' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                HIỆN
              </button>
              <button
                type="button"
                onClick={() => setCurrentCategory({...currentCategory, status: 'hidden'})}
                className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${currentCategory.status === 'hidden' ? 'bg-slate-500 text-white shadow-lg shadow-slate-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                ẨN
              </button>
            </div>
          </div>
          {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-navy-900">Hủy</button>
            <button type="submit" className="px-8 py-3 bg-navy-900 text-white rounded-2xl font-black shadow-lg shadow-navy-900/20 hover:bg-navy-800 transition-all">
              {currentCategory.id ? "Cập nhật" : "Lưu danh mục"}
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
          <p className="text-slate-600 font-medium mb-8">Bạn có chắc chắn muốn xóa danh mục <br/><span className="font-black text-navy-900 leading-relaxed text-lg">"{categoryToDelete?.name}"</span> không?</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-navy-900">Hủy</button>
            <button onClick={handleDelete} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Đồng ý xóa</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManage;
