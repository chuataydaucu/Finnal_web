# Tiêu chuẩn Tư duy Thiết kế (Chain of Thought)

Trước khi viết code, bạn (AI Agent) BẮT BUỘC phải viết ra quá trình suy luận từng bước. Điều này giúp đảm bảo logic không có sai sót và thiết kế nhất quán cho TayfBook.

Hãy suy luận theo các bước sau và ghi rõ ra trong kế hoạch (Implementation Plan):

1. **Phân tích UI/UX (Mỹ thuật):**
   - *Suy nghĩ:* Phối màu Navy (#0f172a) và Cam (#f59e0b) đã được áp dụng cân bằng chưa? Điểm nhấn (Accent) có đủ nổi bật cho các nút CTA như "Mua ngay" hay "Thanh toán" không?
   - *Suy nghĩ:* Bố cục các component (Card sách, Sidebar Admin, Cart) đã tối ưu cho trải nghiệm người dùng chưa?
   - *Suy nghĩ:* Typography (Inter/Playfair Display) và khoảng trắng (Whitespace) của Tailwind đã đủ để tạo cảm giác tri thức và sang trọng cho TayfBook chưa?
   - *Kết luận:* Đưa ra quyết định cuối cùng về UI (Bảng màu, Layout, Component structure).

2. **Phân tích Logic Javascript:**
   - *Suy nghĩ:* Khi người dùng tương tác (onClick, onSubmit), dữ liệu sẽ đi qua những bước xác thực và cập nhật State (useState) nào?
   - *Suy nghĩ:* Làm sao để đồng bộ dữ liệu giữa React State và localStorage (cho giỏ hàng/phiên đăng nhập) một cách an toàn nhất(tham khảo `Few-Shot.md`)?
   - *Suy nghĩ:* Khi nào cần gọi API (json-server) thông qua useEffect để render lại danh sách sản phẩm hoặc danh mục?
   - *Kết luận:* Mô tả ngắn gọn luồng dữ liệu (Data Flow) và các Hooks sẽ sử dụng.

3. **Dự báo Lỗi (Edge Cases):**
   - *Suy nghĩ:* Nếu API json-server trả về rỗng hoặc lỗi kết nối thì giao diện sẽ hiển thị gì (Loading/Error state)?
   - *Suy nghĩ:* Nếu người dùng nhập liệu sai (giá tiền âm, bỏ trống tên danh mục), logic validation sẽ xử lý ra sao?
   - *Suy nghĩ:* Nếu nhấn F5 reload trang, thông tin đăng nhập và giỏ hàng có được khôi phục từ localStorage không?
   - *Kết luận:* Đưa ra giải pháp phòng ngừa lỗi và trạng thái chờ (Loading).

*Lưu ý: Mọi quyết định xác nhận (ví dụ xóa sách/danh mục) phải dùng Custom Modal thiết kế bằng Tailwind CSS (kết hợp `backdrop-filter: blur`), tuyệt đối KHÔNG dùng `confirm()` hay `alert()` mặc định của trình duyệt* 
