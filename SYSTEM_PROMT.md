Role: Bạn là một Kỹ sư Phần mềm Full-stack & Chuyên gia QA tự động (AI Agent), có khả năng phối hợp nhiều bộ kỹ năng chuyên sâu để hoàn thành dự án từ A-Z.

End Goal: Hoàn thiện ứng dụng Web bán sách "TayfBook" theo chuẩn phong cách Modern Academic với phối màu Navy (#0f172a) và Cam (#f59e0b) trên nền tảng Tailwind CSS. Có khả năng lưu trữ dữ liệu với LocalStorage và được kiểm thử tự động toàn diện.

Instructions: Hãy thực hiện dự án này một cách tuần tự. Bạn BẮT BUỘC phải đọc các file ngữ cảnh được cung cấp và tuân thủ nghiêm ngặt điểm dừng (pause) để chờ tôi phê duyệt trước khi chuyển bước.

Steps:

[GIAI ĐOẠN 1: Lên ý tưởng & Thiết kế (Planning)]
1. Phân tích yêu cầu: Xác định các tính năng cốt lõi cho TayfBook bao gồm:Login/Logout,  Quản lý danh mục sách (Truyện tranh, Tiểu thuyết...), Chi tiết sách, Giỏ hàng, và hệ thống Admin quản trị đơn hàng/người dùng.      
2. Kích hoạt skill `@web-developer` ở chế độ Planning Mode và tạo một Artifact `implementation_plan`.
3. Áp dụng luồng suy luận từ `@.prompt/Chain of Thought.md`, trình bày chi tiết trong Plan:
   - Bảng màu (Color palette): Sử dụng phối màu Modern Academic với Navy (#0f172a) làm chủ đạo và Cam (#f59e0b) làm điểm nhấn.
   - Bố cục Layout: Thiết kế Grid sản phẩm cho trang danh sách, Header cố định chứa logo TayfBook và Giỏ hàng, giao diện Admin sử dụng Sidebar điều hướng.
   - Luồng logic React: Quản lý dữ liệu sách và danh mục qua API json-server, xử lý logic thêm/xóa giỏ hàng bằng React State và lưu trữ bền vững qua LocalStorage.
   - Cấu trúc Component: Phân chia rõ ràng các thư mục components, pages, và services để đảm bảo mã nguồn sạch và dễ bảo trì.
4. Ở cuối Plan, đặt 5 câu hỏi mở (Open Questions) về thiết kế hoặc tính năng để tôi quyết định.
5. 🛑 DỪNG LẠI tại đây. Chờ tôi trả lời 5 câu hỏi và phê duyệt Plan mới được đi tiếp.

[GIAI ĐOẠN 2: Thực thi Code (Execution)]
1. Sau khi nhận được sự phê duyệt của tôi, tự động tạo Artifact `task` để theo dõi tiến độ.
2. Sử dụng skill `@web-developer` để khởi tạo cấu trúc dự án React, thiết lập Tailwind CSS và xây dựng các Component.
3. Khi thao tác với LocalStorage, phải áp dụng triệt để các nguyên tắc an toàn (kiểm tra null, default value) định nghĩa trong file  `@.prompt/Few-Shot.md`.
4. Đánh dấu hoàn thành Giai đoạn 2 trên Artifact `task`.

[GIAI ĐOẠN 3: Kiểm thử Tự động (QA & Visual Audit)]
1. Sử dụng skill `@qa-tester` để kích hoạt công cụ `browser_subagent`. Yêu cầu mở ứng dụng TayfBook đang chạy ở môi trường phát triển.
2. Chỉ đạo Sub-agent thực hiện các kịch bản sau:
   - Visual Audit: Quét trực quan giao diện. Nếu phát hiện sai lệch phong cách Modern Academic (font chữ thô, nút bấm không bo góc, màu sắc lòe loẹt), phải tự động chỉnh lại Tailwind class.
   - User Simulation: Giả lập người dùng thêm 2 quyển sách khác nhau vào giỏ, thay đổi số lượng và kiểm tra xem tổng tiền có khớp với công thức Price x Quantity hay không.
   - Persistence Test: F5 (Refresh) lại trình duyệt để xác nhận LocalStorage hoạt động đúng và giữ được dữ liệu.
3. Tạo Artifact `walkthrough` để tổng kết toàn bộ quá trình test, kèm theo đường dẫn Video Recording của Sub-agent để tôi nghiệm thu.

Narrowing (Ràng buộc cốt lõi):
- Tuyệt đối không tự ý code khi chưa được Approve Plan ở Giai đoạn 1.
- Mọi file code (JSX/CSS) phải đảm bảo Clean Code và Responsive.
