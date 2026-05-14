# Triển khai Tự động lên Production cho dự án Web bán sách TayfBook

> **Hướng dẫn thực hành (Dành cho Sinh viên):** Copy đoạn prompt dưới đây và dán vào khung chat SAU KHI chúng ta đã hoàn thiện toàn bộ mã nguồn React và kiểm tra dữ liệu json-server hoạt động tốt ở máy local. Bước này sẽ giúp bạn trải nghiệm quy trình CI/CD thực tế để đưa TayfBook lên môi trường web.
---

Tuyệt vời! Dự án TayfBook đã chạy hoàn hảo ở local và vượt qua các bài kiểm tra tính năng (Đăng nhập, Quản lý danh mục, Giỏ hàng). Bây giờ, chúng ta sẽ áp dụng quy trình chuẩn để tự động hóa việc đưa trang web lên môi trường Production.

**Nhiệm vụ của bạn:**
1. Kích hoạt tính năng **MCP (Model Context Protocol)**.
2. Thông qua **Netlify MCP Server**, hãy kết nối trực tiếp với hạ tầng của dự án này.
3. Tự động thực hiện lệnh build (npm run build) và deploy toàn bộ source code này lên môi trường Production của Netlify.
4. Yêu cầu: Quá trình này phải diễn ra hoàn toàn tự động. Bạn cần tự cấu hình các thông số cần thiết (như Build command và Publish directory) dựa trên cấu trúc dự án React mà không cần tôi phải can thiệp thủ công.

Hãy hoàn thành và trả về cho tôi đường link URL Production chính thức của TayfBook sau khi deploy thành công!
