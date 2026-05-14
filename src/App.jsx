import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientLayout from './components/layout/ClientLayout';
import Home from './pages/client/Home';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import Profile from './pages/client/Profile';
import Search from './pages/client/Search';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManage from './pages/admin/ProductManage';
import CategoryManage from './pages/admin/CategoryManage';
import OrderManage from './pages/admin/OrderManage';
import UserManage from './pages/admin/UserManage';
import ProductDetail from './pages/client/ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManage />} />
          <Route path="categories" element={<CategoryManage />} />
          <Route path="orders" element={<OrderManage />} />
          <Route path="users" element={<UserManage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
