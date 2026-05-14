# Tiêu chuẩn Code An toàn (Few-Shot Examples)

Dưới đây là các ví dụ (Few-Shot) BẮT BUỘC phải tuân theo khi làm việc với LocalStorage để tránh lỗi crash ứng dụng.

## 1. Khởi tạo và Lưu dữ liệu

❌ **BAD PRACTICE (Dễ gây lỗi null pointer):**
```javascript
// Nếu localStorage rỗng, việc parse sẽ gây lỗi ngay lập tức
const savedCart = JSON.parse(localStorage.getItem('cart')); 
return savedCart.length; // Lỗi: Cannot read properties of null
```

✅ **GOOD PRACTICE (An toàn, có giá trị mặc định):**
```javascript
// Luôn trả về mảng rỗng hoặc giá trị mặc định an toàn
const getCartFromLS = () => {
  try {
    const data = localStorage.getItem('tayfbook_cart');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Lỗi đọc dữ liệu giỏ hàng:", error);
    return [];
  }
};
```

## 2. Render dữ liệu từ LocalStorage ra UI

✅ **GOOD PRACTICE (Cập nhật giao diện an toàn):**
```javascript
import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Thay thế cho DOMContentLoaded: Sử dụng useEffect để fetch dữ liệu
  useEffect(() => {
    // Giả lập fetch từ json-server
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6">
      {products.length === 0 ? (
        <p className="text-slate-500">Đang tải sách hoặc danh sách trống...</p>
      ) : (
        products.map(book => (
          <div key={book.id} className="bg-white p-4 shadow-sm border border-slate-200 hover:scale-105 transition-all">
            <h3 className="font-bold text-slate-900">{book.name}</h3>
            <span className="text-amber-500 font-semibold">{book.price.toLocaleString()} đ</span>
            <button className="mt-4 w-full bg-[#f59e0b] text-white py-2 rounded-md hover:bg-amber-600">
              Thêm vào giỏ
            </button>
          </div>
        ))
      )}
    </div>
  );
};;
}

// Gọi hàm này ngay khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    renderTransactions();
    // Gọi thêm hàm calculateTotalBalance() ở đây
});
```

Tuân thủ các ví dụ trên sẽ giúp hệ thống của bạn chống lại các lỗi thường gặp với LocalStorage.
