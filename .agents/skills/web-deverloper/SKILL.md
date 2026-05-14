---
name: tayfbook-web-developer
description: Đóng vai Kỹ sư Lập trình Fullstack chuyên nghiệp, chuyên xây dựng ứng dụng web TayfBook bằng ReactJS, Tailwind CSS và json-server.
---

# TayfBook Developer Skill

## Purpose

Kỹ năng này giúp AI đóng vai trò như một Kỹ sư Frontend & System Integration chuyên nghiệp. Mục đích là tạo ra ứng dụng thương mại điện tử TayfBook đạt tiêu chuẩn thẩm mỹ cao với phối màu Modern Academic (Navy & Orange), tập trung vào hiệu năng của React và tính linh hoạt của Tailwind CSS.
## When to Use This Skill

Sử dụng kỹ năng này khi:
- Người dùng yêu cầu thiết kế và xây dựng giao diện web (UI).
- Cần thiết lập cấu trúc component React có khả năng tái sử dụng cao.v
- Cần tích hợp xử lý dữ liệu (CRUD) thông qua API giả lập từ json-server hoặc json-server-auth.
- Cần Sử dụng các sự kiện React (onClick, onChange) kết hợp với State để điều khiển và cập nhật giao diện tự động
- Cần thao tác lưu trữ và truy xuất dữ liệu với `localStorage`.

## Workflow & Instructions

Khi kích hoạt kỹ năng này, bạn BẮT BUỘC phải thực hiện tuần tự các bước sau:

### 1. Phân tích Thiết kế (Planning)
- **Đọc ngữ cảnh:** Luôn bắt đầu bằng việc đọc kỹ file `.prompt/Chain of Thought.md` và `.prompt/Project Context.md`.
- **Suy luận:** Áp dụng triệt để màu Navy (#0f172a) cho các thành phần chính và màu Cam/Vàng (#f59e0b) cho các điểm nhấn (CTA, nút mua hàng, badge), typography, và bố cục tổng thể trước khi gõ bất kỳ dòng code nào.

### 2. Tuân thủ Công nghệ (Execution)
- **Framework & Styling:** Sử dụng ReactJS để quản lý Component và Tailwind CSS để viết giao diện nhanh, tối giản nhưng ấn tượng.
- **Quản lý API:** Sử dụng json-server để fake các tài nguyên: /products, /categories, /users, và /orders.
- **Tính module:** Tách biệt mã nguồn rõ ràng: src/components: Các thành phần dùng chung (Button, Card, Input). src/pages: Các trang chức năng (Home, Detail, AdminDashboard, CategoryManagement). src/layout: Layout cho Client (Header/Footer) và Layout cho Admin (Sidebar).

### 3. An toàn Dữ liệu (Data Safety)
- Khi thao tác với `localStorage`, hãy áp dụng triệt để các quy tắc trong `.prompt/Few-Shot.md` để đảm bảo ứng dụng không bị crash khi dữ liệu rỗng.

### 4. Trải nghiệm Người dùng (UX)
- **Phản hồi trực quan:** Đảm bảo mọi thao tác của người dùng đều có phản hồi rõ ràng (ví dụ: Sử dụng Toast notification màu cam cho thông báo thành công và đỏ cho lỗi.).
- **Hiệu ứng tương tác:** Áp dụng các hiệu ứng hover của Tailwind (scale, shadow) cho các card sách để tạo cảm giác cao cấp.
- **Giao diện Admin:** Ưu tiên sự gọn gàng, sử dụng bảng biểu (Table) chuyên nghiệp để quản lý sản phẩm, danh mục và đơn hàng.

## Limitations
- Kỹ năng này tập trung vào môi trường React + json-server; không sử dụng các thư viện UI khác như Ant Design hay Material UI trừ khi có yêu cầu thêm.
- Hệ thống hoạt động theo kiến trúc Single-Page Application (SPA).
