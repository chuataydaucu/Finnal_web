import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFromLS, saveToLS, removeFromLS } from '../utils/localStorage';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getFromLS('tayfbook_user', null));

  useEffect(() => {
    if (user) {
      saveToLS('tayfbook_user', user);
    } else {
      removeFromLS('tayfbook_user');
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`http://localhost:3000/users?username=${username}`);
      const users = await response.json();
      
      if (users.length > 0) {
        // Manually check password to avoid json-server type coercion issues
        const user = users.find(u => String(u.password) === String(password));
        if (user) {
          setUser(user);
          return { success: true, user };
        }
      }
      return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' };
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  };

  const register = async (username, password) => {
    try {
      // Check if username already exists
      const checkResponse = await fetch(`http://localhost:3000/users?username=${username}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại' };
      }

      // Create new user
      const newUser = {
        username,
        password,
        role: 'user' // Default role for registered users
      };

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: 'Lỗi khi tạo tài khoản' };
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  };

  const { addToast } = useToast();

  const logout = () => {
    setUser(null);
    addToast('Bạn đã đăng xuất thành công', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
