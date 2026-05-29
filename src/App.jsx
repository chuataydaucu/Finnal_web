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
import InterfaceManage from './pages/admin/InterfaceManage';
import ChatManage from './pages/admin/ChatManage';
import ReviewManage from './pages/admin/ReviewManage';
import ProductDetail from './pages/client/ProductDetail';
import BookHot from './pages/client/BookHot';
import BookBlog from './pages/client/BookBlog';
import About from './pages/client/About';
import AllCategories from './pages/client/AllCategories';
import Wishlist from './pages/client/Wishlist';
import ScrollToTop from './components/utils/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
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
          <Route path="book-hot" element={<BookHot />} />
          <Route path="blog" element={<BookBlog />} />
          <Route path="about" element={<About />} />
          <Route path="all-categories" element={<AllCategories />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManage />} />
          <Route path="categories" element={<CategoryManage />} />
          <Route path="orders" element={<OrderManage />} />
          <Route path="users" element={<UserManage />} />
          <Route path="interface" element={<InterfaceManage />} />
          <Route path="chats" element={<ChatManage />} />
          <Route path="reviews" element={<ReviewManage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
