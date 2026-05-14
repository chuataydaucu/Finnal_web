- tôi muốn trong trang chi tiết sản phẩm:
    - phần mô tả, nếu là tài khoản admin thì có thể chỉnh sửa được, còn tài khoản khách hàng thì không.  (nếu là tài khoản admin có thể sửa trực tiếp trong tranh chi tiết sản phẩm)
    - tạo 1 phần khi người dùng ấn vào "thông tin chi tiết" thì sẽ hiện ra thông tin của sản phẩm đó như:
        liệt kê các thông số kỹ thuật như:

        Mã hàng (ISBN).

        Nhà xuất bản.

        Năm xuất bản.

        Trọng lượng và Kích thước.
        (tất cả thông tin này nếu là admin thì có thể thêm sửa trực tiếp)
    - tương tự tạo phần đánh giá:
        nếu là tài khoản khách hàng thì có thể đánh giá và bình luận sản phẩm
        nếu là tài khoản admin thì có thể xem và xóa bình luận
    - phần "sách cùng thể loại" ở dưới thêm cái điều kiện nữa là sách cùng tác giả cũng sẽ hiện ở đây
    - phần sản phẩm ở trên, cho cái đánh giá lên trên ngang hàng với tên tác giả
    - phần hình ảnh chuyển thành dạng có thể chuyển tiếp sang ảnh tiếp theo, và có thể cuộn qua lại. các ảnh còn lại sẽ hiện bé ở ngay dưới ảnh chính và cũng có thể cuộn qua lại.(ví dụ giống như ảnh này![alt text](image-1.png))
    - phần giá, phần giá cũ và phần giảm giá (nếu có giảm giá) hãy thiết kế bố cục lại cho nó đẹp hơn

- các tính năng, nội dung trên nếu là admin thì có thể thay đổi được
[GIAI ĐOẠN 1: Lên ý tưởng & Thiết kế (Planning)]
1. Phân tích các yêu cầu của tôi
2.  Ở cuối Plan, đặt 3 câu hỏi mở (Open Questions) về thiết kế hoặc tính năng để tôi quyết định.
3. 🛑 DỪNG LẠI tại đây. Chờ tôi trả lời 3 câu hỏi và phê duyệt Plan mới được đi tiếp.


[GIAI ĐOẠN 2: Thực thi Code (Execution)]
1. Sau khi nhận được sự phê duyệt của tôi, tự động tạo Artifact `task` để theo dõi tiến độ.
2. Tự động tạo Artifact `task` để theo dõi tiến độ.

[GIAI ĐOẠN 3: Kiểm thử Tự động (QA & Visual Audit)]
1. Sử dụng skill `@qa-tester` 
2. Test lại toàn bộ chức năng của trang web và báo cáo kết quả.

Narrowing (Ràng buộc cốt lõi):
- Tuyệt đối không tự ý code khi chưa được Approve Plan ở Giai đoạn 1. 