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
  Eye,
  Plus,
  Trash2,
  User,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Minus
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

  // States for manual order creation
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [addFormData, setAddFormData] = useState({
    customerType: 'guest', // 'guest' | 'member'
    userId: '',
    customerName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    paymentMethod: 'cod',
    status: 'Chờ xử lý',
    items: [] // { id, name, price, quantity, image, maxStock }
  });
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductQty, setSelectedProductQty] = useState(1);

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

  const fetchProductsAndUsers = async () => {
    try {
      const [prodRes, userRes] = await Promise.all([
        fetch('http://localhost:3000/products'),
        fetch('http://localhost:3000/users')
      ]);
      const prods = await prodRes.json();
      const usrs = await userRes.json();
      setAllProducts(prods);
      setAllUsers(usrs.filter(u => u.role !== 'admin')); // Only show members, not admin
    } catch (err) {
      console.error('Lỗi tải sản phẩm và thành viên:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProductsAndUsers();
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
      fetchProductsAndUsers(); // Reload stocks
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

  // Manual Order Creation functions
  const handleCustomerTypeChange = (type) => {
    setAddFormData({
      ...addFormData,
      customerType: type,
      userId: '',
      customerName: '',
      phone: '',
      email: '',
      address: ''
    });
  };

  const handleMemberSelect = (userId) => {
    const selectedUser = allUsers.find(u => String(u.id) === String(userId));
    if (selectedUser) {
      setAddFormData({
        ...addFormData,
        userId: selectedUser.id,
        customerName: selectedUser.fullName || selectedUser.username,
        phone: selectedUser.phone || '',
        email: selectedUser.email || '',
        address: selectedUser.address || ''
      });
    } else {
      setAddFormData({
        ...addFormData,
        userId: '',
        customerName: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const alreadyExists = addFormData.items.find(item => String(item.id) === String(selectedProductId));
    if (alreadyExists) {
      alert('Sản phẩm này đã có trong danh sách mua hàng.');
      return;
    }

    const prod = allProducts.find(p => String(p.id) === String(selectedProductId));
    if (prod) {
      if (prod.stock <= 0) {
        alert('Sản phẩm này hiện tại đã hết hàng.');
        return;
      }

      const qty = Math.min(selectedProductQty, prod.stock);
      const newItem = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: qty,
        image: prod.image,
        maxStock: prod.stock
      };

      setAddFormData({
        ...addFormData,
        items: [...addFormData.items, newItem]
      });
      setSelectedProductId('');
      setSelectedProductQty(1);
    }
  };

  const handleItemQtyChange = (itemId, newQty) => {
    const updatedItems = addFormData.items.map(item => {
      if (item.id === itemId) {
        const qty = Math.max(1, Math.min(newQty, item.maxStock));
        return { ...item, quantity: qty };
      }
      return item;
    });
    setAddFormData({ ...addFormData, items: updatedItems });
  };

  const handleRemoveItem = (itemId) => {
    setAddFormData({
      ...addFormData,
      items: addFormData.items.filter(item => item.id !== itemId)
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!addFormData.customerName || !addFormData.phone || !addFormData.address) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }
    if (addFormData.items.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm vào đơn hàng.');
      return;
    }

    const total = addFormData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = {
      customerName: addFormData.customerName,
      phone: addFormData.phone,
      email: addFormData.email,
      address: addFormData.address,
      note: addFormData.note,
      userId: addFormData.customerType === 'member' ? addFormData.userId : null,
      total: total,
      items: addFormData.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      paymentMethod: addFormData.paymentMethod,
      status: addFormData.status,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        // Deduct stock for each item if order is not cancelled initially
        if (addFormData.status !== 'Đã hủy') {
          await Promise.all(addFormData.items.map(async (item) => {
            const prodRes = await fetch(`http://localhost:3000/products/${item.id}`);
            const product = await prodRes.json();
            const newStock = Math.max(0, (product.stock || 0) - item.quantity);
            
            await fetch(`http://localhost:3000/products/${item.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stock: newStock })
            });
          }));
        }

        alert('Tạo đơn hàng thành công!');
        setIsAddModalOpen(false);
        setAddFormData({
          customerType: 'guest',
          userId: '',
          customerName: '',
          phone: '',
          email: '',
          address: '',
          note: '',
          paymentMethod: 'cod',
          status: 'Chờ xử lý',
          items: []
        });
        
        fetchOrders();
        fetchProductsAndUsers(); // Reload stocks
      } else {
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
      }
    } catch (err) {
      console.error('Lỗi tạo đơn hàng:', err);
      alert('Lỗi kết nối máy chủ.');
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
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-black text-white hover:bg-cam-500 hover:text-black px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-black/10 active:scale-95 shrink-0 flex items-center gap-2 group"
        >
          <ShoppingCart className="w-4 h-4 text-cam-500 group-hover:text-black transition-colors" />
          Tạo đơn hàng thủ công
        </button>
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
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={selectedOrder ? `Chi tiết đơn hàng #ORD-${selectedOrder.id.toString().substring(0, 8)}` : 'Chi tiết đơn hàng'}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8 mb-4">
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
            
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-8 py-3 bg-navy-900 text-white rounded-2xl font-black shadow-lg shadow-navy-900/20 hover:bg-navy-800 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add New Order Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Tạo đơn hàng thủ công"
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleCreateOrder} className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-0">
          {/* Left Column: Customer details */}
          <div className="lg:w-1/2 pr-0 lg:pr-8 pb-6 lg:pb-0 space-y-6">
            <div className="flex items-center gap-3 text-navy-900 font-black mb-2">
              <User className="w-5 h-5 text-cam-500" />
              <h3 className="text-base uppercase tracking-tight">Thông tin khách hàng</h3>
            </div>

            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => handleCustomerTypeChange('guest')}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  addFormData.customerType === 'guest' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                Khách vãng lai
              </button>
              <button
                type="button"
                onClick={() => handleCustomerTypeChange('member')}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  addFormData.customerType === 'member' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                Thành viên
              </button>
            </div>

            {addFormData.customerType === 'member' && (
              <div className="group relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Chọn thành viên</label>
                <select
                  value={addFormData.userId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="">-- Chọn thành viên đăng ký --</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.username} ({u.username})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Họ & Tên khách hàng *</label>
                <input
                  type="text"
                  name="customerName"
                  value={addFormData.customerName}
                  onChange={(e) => setAddFormData({...addFormData, customerName: e.target.value})}
                  placeholder="Nhập tên khách..."
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số điện thoại *</label>
                <input
                  type="text"
                  name="phone"
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({...addFormData, phone: e.target.value})}
                  placeholder="Nhập số điện thoại..."
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Địa chỉ Email</label>
              <input
                type="email"
                name="email"
                value={addFormData.email}
                onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                placeholder="vidu@email.com..."
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Địa chỉ nhận hàng *</label>
              <textarea
                name="address"
                value={addFormData.address}
                onChange={(e) => setAddFormData({...addFormData, address: e.target.value})}
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                required
                rows="2"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phương thức TT</label>
                <select
                  value={addFormData.paymentMethod}
                  onChange={(e) => setAddFormData({...addFormData, paymentMethod: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all cursor-pointer"
                >
                  <option value="cod">COD (Thanh toán khi nhận hàng)</option>
                  <option value="banking">Chuyển khoản ngân hàng</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trạng thái khởi tạo</label>
                <select
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({...addFormData, status: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all cursor-pointer"
                >
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ghi chú đơn hàng</label>
              <input
                type="text"
                name="note"
                value={addFormData.note}
                onChange={(e) => setAddFormData({...addFormData, note: e.target.value})}
                placeholder="Ghi chú đóng gói, thời gian giao..."
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Column: Order items and subtotal */}
          <div className="lg:w-1/2 pl-0 lg:pl-8 pt-6 lg:pt-0 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-navy-900 font-black mb-2 shrink-0">
                <ShoppingCart className="w-5 h-5 text-cam-500" />
                <h3 className="text-base uppercase tracking-tight">Chi tiết giỏ sách</h3>
              </div>

              {/* Sách selector */}
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shrink-0 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Chọn sách cần thêm</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">-- Chọn tác phẩm sách --</option>
                      {allProducts.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                          {p.name.toUpperCase()} (Tồn: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Số lượng</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedProductQty}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 1) setSelectedProductQty(val);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-navy-900 focus:ring-2 focus:ring-cam-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProductId}
                  className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                >
                  Thêm vào đơn hàng
                </button>
              </div>

              {/* Sách list in order */}
              <div className="overflow-y-auto max-h-[250px] border border-slate-100 rounded-3xl p-4 bg-slate-50/50 space-y-3 custom-scrollbar">
                {addFormData.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
                    <BookOpen className="w-8 h-8 mb-2 text-cam-500 opacity-40 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-wider">Đơn hàng trống</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Chọn tác phẩm bên trên để đưa vào đơn</p>
                  </div>
                ) : (
                  addFormData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm relative group">
                      <img src={item.image} alt="" className="w-10 h-14 object-cover rounded-lg shadow-sm border border-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-xs text-navy-900 line-clamp-1 uppercase tracking-tight">{item.name}</p>
                        <p className="text-[10px] font-black text-cam-600 mt-0.5">{formatCurrency(item.price)}</p>
                      </div>
                      
                      {/* Quantity adjuster */}
                      <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-cam-600 rounded-lg hover:bg-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-navy-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-cam-600 rounded-lg hover:bg-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right pl-2 shrink-0">
                        <p className="text-xs font-black text-navy-900">{formatCurrency(item.price * item.quantity)}</p>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block mt-0.5">Tối đa: {item.maxStock}</span>
                      </div>

                      {/* Remove item button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all shadow-sm active:scale-95 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Subtotals & Submit */}
            <div className="pt-6 border-t border-slate-100 shrink-0 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-black text-navy-900 uppercase tracking-wider">Tổng cộng đơn hàng</p>
                <p className="text-xl font-black text-cam-600">
                  {formatCurrency(addFormData.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 hover:border-rose-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:bg-rose-50/30 transition-all active:scale-95 duration-200"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={addFormData.items.length === 0}
                  className="flex-1 py-4 bg-navy-900 hover:bg-navy-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-navy-900/10 active:scale-95 disabled:opacity-30 disabled:shadow-none"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderManage;
