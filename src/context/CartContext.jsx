import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFromLS, saveToLS } from '../utils/localStorage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState([]);

  // Load cart based on current user
  useEffect(() => {
    if (user) {
      const savedCart = getFromLS(`tayfbook_cart_${user.id}`, []);
      setCart(savedCart);
    } else {
      setCart([]); // Clear cart in state when logged out
    }
  }, [user]);

  // Save cart whenever it changes
  useEffect(() => {
    if (user) {
      saveToLS(`tayfbook_cart_${user.id}`, cart);
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!user) {
      addToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'error');
      return { success: false, message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1 }];
    });
    
    addToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
    return { success: true };
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    addToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
