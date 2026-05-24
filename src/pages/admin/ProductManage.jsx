import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ChevronDown, 
  BookOpen, 
  AlertTriangle,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', price: '', categoryIds: [], image: '', description: '', author: '', publishedYear: '', stock: 0 });
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [resProducts, resCategories] = await Promise.all([
        fetch('http://localhost:3000/products'),
        fetch('http://localhost:3000/categories')
      ]);
      const productsData = await resProducts.json();
      setProducts(productsData);
      setCategories(await resCategories.json());
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered and sorted products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryIds?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'stock-low') return (a.stock || 0) - (b.stock || 0);
    return b.id - a.id; // Newest
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAddModal = () => {
    setCurrentProduct({ name: '', price: '', categoryIds: [], image: '', description: '', author: '', publishedYear: '', stock: 0 });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    const safeProduct = { ...product };
    if (safeProduct.categoryId && !safeProduct.categoryIds) {
      safeProduct.categoryIds = [safeProduct.categoryId];
    } else if (!safeProduct.categoryIds) {
      safeProduct.categoryIds = [];
    }
    
    setCurrentProduct(safeProduct);
    setError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price || currentProduct.categoryIds.length === 0) {
      setError('Vui lòng điền các trường bắt buộc (Tên, Giá) và chọn ít nhất 1 danh mục.');
      return;
    }
    
    const method = currentProduct.id ? 'PUT' : 'POST';
    const url = currentProduct.id 
      ? `http://localhost:3000/products/${currentProduct.id}`
      : 'http://localhost:3000/products';

    const payload = {
      ...currentProduct,
      price: Number(currentProduct.price),
      stock: Number(currentProduct.stock || 0),
      discountPercentage: currentProduct.discountPercentage ? Number(currentProduct.discountPercentage) : 0,
      oldPrice: currentProduct.oldPrice ? Number(currentProduct.oldPrice) : 0
    };
    delete payload.categoryId;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError('Lỗi khi lưu dữ liệu.');
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await fetch(`http://localhost:3000/products/${productToDelete.id}`, { method: 'DELETE' });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  const getCategoryNames = (product) => {
    let ids = product.categoryIds || [];
    if (product.categoryId && ids.length === 0) ids = [product.categoryId];
    if (ids.length === 0) return [];
    
    return ids.map(id => {
      const cat = categories.find(c => c.id === id);
      return cat ? cat.name : 'Unknown';
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-navy-900 tracking-tight mb-2">Quản lý sản phẩm</h1>
          <p className="text-slate-500 font-medium">Duyệt và quản lý toàn bộ kho sách hiện có trong hệ thống TayfBook.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-900">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tổng số sách</p>
              <p className="text-xl font-black text-navy-900 leading-none">{products.length.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 bg-cam-50 rounded-2xl flex items-center justify-center text-cam-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sắp hết hàng</p>
              <p className="text-xl font-black text-navy-900 leading-none">
                {products.filter(p => (p.stock || 0) < 10).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm tên sách, tác giả..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-navy-900 focus:ring-1 focus:ring-cam-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-navy-900 focus:ring-1 focus:ring-cam-500 outline-none pr-10"
              value={selectedCategory}
              onChange={(e) => {setSelectedCategory(e.target.value); setCurrentPage(1);}}
            >
              <option value="all">Tất cả thể loại</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-navy-900 focus:ring-1 focus:ring-cam-500 outline-none pr-10"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-high">Giá: Cao đến thấp</option>
              <option value="price-low">Giá: Thấp đến cao</option>
              <option value="stock-low">Tồn kho ít nhất</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="bg-black text-white hover:bg-cam-500 hover:text-black px-6 py-2.5 rounded-xl font-black shadow-lg shadow-black/20 flex items-center gap-2 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 text-cam-500 group-hover:text-black transition-colors" /> Thêm sách
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">Hình ảnh</th>
                <th className="px-8 py-5">Tên sách</th>
                <th className="px-8 py-5">Tác giả</th>
                <th className="px-8 py-5">Thể loại</th>
                <th className="px-8 py-5">Giá</th>
                <th className="px-8 py-5">Kho</th>
                <th className="px-8 py-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="8" className="px-8 py-20 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td></tr>
              ) : paginatedProducts.length === 0 ? (
                <tr><td colSpan="8" className="px-8 py-20 text-center text-slate-400 font-medium">Không tìm thấy sản phẩm nào phù hợp.</td></tr>
              ) : paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-400 text-xs">#TB-{product.id.toString().substring(0, 4)}</td>
                  <td className="px-8 py-5">
                    <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                      <img src={product.image || 'https://via.placeholder.com/100x150'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-navy-900 leading-tight mb-1">{product.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">ISBN: {product.isbn || '978-3-16-148410-0'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{product.author || 'Chưa cập nhật'}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1">
                      {getCategoryNames(product).map((name, i) => (
                        <span key={i} className="px-2 py-1 bg-navy-50 text-navy-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-cam-600">{formatCurrency(product.price)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500 shadow-lg shadow-green-500/50' : product.stock > 0 ? 'bg-cam-500 shadow-lg shadow-cam-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`}></div>
                      <span className={`text-sm font-bold ${product.stock <= 0 ? 'text-red-500' : 'text-slate-700'}`}>
                        {product.stock || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(product)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
            <p className="text-xs font-bold text-slate-400">
              Đang hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} trên tổng số {filteredProducts.length} cuốn sách
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1 ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' : 'text-slate-400 hover:text-navy-900 hover:bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-slate-400 hover:text-navy-900 hover:bg-white rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentProduct.id ? "Sửa thông tin sách" : "Thêm sách mới"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên sách *</label>
                <input type="text" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none"
                  value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tác giả</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none"
                  value={currentProduct.author || ''} onChange={(e) => setCurrentProduct({...currentProduct, author: e.target.value})} placeholder="VD: Nam Cao" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Giá bán (VND) *</label>
                  <input type="number" required min="0" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none"
                    value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số lượng kho</label>
                  <input type="number" min="0" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none"
                    value={currentProduct.stock} onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Danh mục *</label>
                <div className="w-full bg-slate-50 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                  {categories.map(c => (
                    <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${currentProduct.categoryIds?.includes(c.id) ? 'bg-cam-500 border-cam-500' : 'bg-white border-slate-200 group-hover:border-cam-200'}`}>
                        {currentProduct.categoryIds?.includes(c.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={currentProduct.categoryIds?.includes(c.id) || false}
                        onChange={(e) => {
                          const newIds = e.target.checked 
                            ? [...(currentProduct.categoryIds || []), c.id]
                            : (currentProduct.categoryIds || []).filter(id => id !== c.id);
                          setCurrentProduct({...currentProduct, categoryIds: newIds});
                        }}
                      />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-navy-900 transition-colors">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL Hình ảnh</label>
                <input type="url" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none"
                  value={currentProduct.image} onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} placeholder="https://..." />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả sản phẩm</label>
            <textarea className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 transition-all outline-none" rows="4"
              value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}></textarea>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">{error}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-navy-900 transition-colors">Hủy</button>
            <button type="submit" className="px-8 py-3 bg-navy-900 text-white rounded-2xl font-black shadow-lg shadow-navy-900/20 hover:bg-navy-800 transition-all">
              {currentProduct.id ? "Cập nhật" : "Lưu sách mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Xác nhận xóa">
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-medium mb-8">Bạn có chắc chắn muốn xóa cuốn sách <br/><span className="font-black text-navy-900 leading-relaxed text-lg">"{productToDelete?.name}"</span> không?</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-navy-900">Hủy</button>
            <button onClick={handleDelete} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Đồng ý xóa</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManage;
