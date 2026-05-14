# Ngữ cảnh Dự án: TayfBook Store

**Role (Vai trò Dự án):** Đây là tài liệu định hướng cốt lõi dành cho AI Agent khi thiết kế và lập trình thống website bán sách TayfBook.

**Objective (Mục tiêu):** Xây dựng một ứng dụng Web bán sách hoàn chỉnh, chuyên nghiệp, sử dụng ReactJS và Tailwind CSS nhằm trình diễn kỹ năng xử lý Frontend hiện đại và tích hợp Fake API.

**Details (Chi tiết Yêu cầu):**

1. **Phạm vi (Scope)**
   - ✅ IN-SCOPE: 
      - Client: Đăng ký/Đăng nhập, xem danh sách & chi tiết sách, giỏ hàng, thanh toán, lịch sử mua hàng.
      - Admin: Quản lý sách, tài khoản, đơn hàng và đặc biệt là Quản lý danh mục (Truyện tranh, tiểu thuyết...).
      - Dữ liệu: Lưu trữ phiên đăng nhập/giỏ hàng vào localStorage, đồng bộ dữ liệu với json-server.
   - ❌ OUT-OF-SCOPE (Tuyệt đối KHÔNG làm): Thanh toán qua cổng ngân hàng thực tế, vận chuyển thực tế, hệ thống đề xuất sách bằng AI phức tạp.

2. **Công nghệ (Tech Stack)**
   - Framework: ReactJS (Hooks, Router).
   - Giao diện: Tailwind CSS. Phong cách thiết kế Modern Academic (Xanh Navy #0f172a & Cam/Vàng #f59e0b).
   - LBackend & Auth: json-server và json-server-auth để giả lập API.
   - Quản lý dữ liệu: React State kết hợp localStorage cho các dữ liệu tạm thời.
   - Kiến trúc file: React Project (Component-based).

3. **Mục tiêu Thẩm mỹ (UI/UX)**
   - Typography: Sử dụng font chữ hiện đại (Inter cho nội dung, Playfair Display cho tiêu đề sách).
   - Tương tác: Sử dụng Toast notification (màu cam/vàng) khi thành công. Các Form nhập liệu (thêm sách/danh mục) phải có validation báo lỗi rõ ràng.
   - Modal Xác nhận: BẮT BUỘC dùng Custom Modal thiết kế bằng Tailwind cho các hành động xác nhận xóa hoặc thông báo quan trọng. TUYỆT ĐỐI KHÔNG dùng hộp thoại mặc định của trình duyệt (`alert()`, `confirm()`).
   - Hiệu ứng: Card sách có hiệu ứng hover phóng to nhẹ và đổ bóng tinh tế.

**Guiding Principles (Nguyên tắc Tự ra Quyết định):**
Khi đứng trước nhiều lựa chọn mà không có chỉ thị rõ ràng, bạn (Agent) BẮT BUỘC phải ưu tiên:
1. Tối giản (Minimalist):Luôn bám sát phối màu Navy & Cam, ít thao tác, ít nút bấm thừa nhất cho người dùng.
2. Chống lỗi (Fool-proof): Chặn lỗi ngay tại Form input (ví dụ: cấm giá sách âm, tên danh mục không được để trống,...).
3. Độc lập & Tốc độ: Code ReactJS tối ưu, chạy nhanh, không dùng thư viện ngoài nếu không thực sự cần.

**Sense Check (Kiểm chứng):**
Trước khi chốt phương án, hãy tự hỏi: "Giao diện này đã đủ mang tinh thần tri thức của TayfBook chưa? Mình có lỡ tay dùng `confirm()` mặc định không? Phối màu Navy & Cam có được sử dụng làm điểm nhấn ấn tượng không?". Nếu vi phạm, hãy tự động sửa đổi!
