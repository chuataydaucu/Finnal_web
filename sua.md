2. Về Tính Năng
    - ở trang chủ có nút trái tim để thêm vào danh sách yêu thích, hãy xây dựng chức năng đó (chưa đăng nhập yêu cầu đăng nhập)
    - 3 nút chức năng bên phải trên thanh header khi người dùng ấn vào đâu thì ở đó có nút tròn màu cam bao quanh nút đó
    -khi ấn vào giỏ hàng, sau khi cần thanh toán, khi ấn vào nút tahnh toán sẽ hiện ra khung thanh toán, yêu cầu người dùng nhập thông tin cá nhân để thanh toán
    - Ở trang củ, khi người dùng ấn vào nút mua ngay thì sẽ cuộn chuột đến phần danh mục nổi bật. khi ấn vào nút tìm hiểu thêm thì sẽ chuyển sang mới như hình: "/src/assets/mota.png"
    - ở header, phần 3 nút chức năng (trang chủ, bán chạy, khuyến mãi) hãy đổi thành trang chủ, sách hot, blog sách. trang chủ khi ấn vào sẽ đưa người dùng về trang chủ, hãy xây dựng 2 trang còn lại (giữu nguyên phong cách thiết kế)
    - phần bộ lọc hãy xây dựng lại chi tiết và trông chuyên nghiệp hơn
    - xuống phần danh mục nổi bật, khi ấn vào danh mục nào thì sẽ hiện ra các sách thuộc danh mục đó, hãy xây dựng lại trang kết quả tìm kiếm  theo phong cách thiết kế cũ. khi ấn vào nút "xem tất cả" thì chuyển sang 1 trang khác, hãy thiết kế trang đó (ở đây người dùng sẽ thấy toàn bộ các thể loại sách ở đây đượng phân chia bố cục rõ ràng, và hiển thị tất cả các sách thuộc danh mục đó)
    - xuống phần sách mới, thịnh hành tạo thêm cjo tôi 1 nút "tải thêm"
        Nút "Tải thêm" (Load More) 
        Nút này được đặt ngay bên dưới lưới sản phẩm (Book Grid).

        Hành động: Khi ấn vào, trang web không chuyển trang mà sẽ tải thêm khoảng 5-10 cuốn sách nữa và hiện ra ngay bên dưới danh sách hiện tại.

        Mục đích: Giữ chân người dùng ở lại trang chủ lâu hơn để họ khám phá nhiều sách mà không bị ngắt quãng trải nghiệm.

        Hiệu ứng: Nên có hiệu ứng chuyển động mượt mà (Fade-in) khi các cuốn sách mới xuất hiện để trang web trông hiện đại và chuyên nghiệp.

        -Thêm nữa ở phần admin sẽ có phần chỉnh sửa phần này (1 lát nữa tôi sẽ nêu ở dưới)
    - tương tự phàn văn học ở dưới, thêm 1 nút "xem tất cả" và cũng như trên, khi ấn vào sẽ chuyển sang trang "xem tất cả đã tạo ở trên" nhưng sẽ tự động cuộn xuống phần "thể loại văn học"
    - hãy thiết kế lại phần footer mới trông nổi bật hơn
    - ơ trang quản trị admin, thêm 1 chức năng Quản lý giao diện
        Ý tưởng thiết kế mục " Quản lý giao diện" trong Admin

        Quản lý Hero Banner:

            Cho phép chọn một cuốn sách từ danh mục có sẵn để làm "Sách tiêu biểu".

            Ô nhập văn bản để thay đổi Headline (Câu slogan) và Sub-headline.

            Nơi upload hình ảnh mockup 3D mới cho banner.

        Quản lý sách:

            Checklist để chọn ra 5-6 sách bạn muốn ưu tiên hiển thị lên trang chủ (hiện nên chỗ sản phẩm nổi bật tôi đã nêu ở trên) thay vì hiện tất cả.

            Sắp xếp thứ tự hiển thị của các sách này.

        Tương tác khi chỉnh sửa
            Preview: Nếu có thể, hãy làm một nút "Xem trước" trong Admin để bạn biết thay đổi đó trông như thế nào trên trang chủ trước khi lưu chính thức.
            
            Phản hồi hệ thống: Sau khi ấn "Lưu", trang chủ sẽ ngay lập tức cập nhật cuốn sách mới với đầy đủ thông tin về giá và nút mua hàng tương ứng.

        Về cơ bản là mục này sẽ chỉnh sửa về những sản phẩm, hình ảnh, thông tin sẽ hiện lên trang chủ (trừ những phần cố định) để có thể tahy đổi trang web theo sự kiện,...
    - phần trang quản trị admin thì thanh header kéo dài ngang toàn bộ chiều rộng của trang
    - ở các trang của người dùng, khi ấn vào 1 trang nào đó thì đều có nút quay về trang chủ lần lượt ví dụ như ảnh: "/src/assets/trangchu.png"
    - cấu trúc thiết kế giữ nguyên

[GIAI ĐOẠN 1: Lên ý tưởng & Thiết kế (Planning)]
1. Phân tích các yêu cầu của tôi
2.  Ở cuối Plan, đặt 5 câu hỏi mở (Open Questions) về thiết kế hoặc tính năng để tôi quyết định.
3. 🛑 DỪNG LẠI tại đây. Chờ tôi trả lời 5 câu hỏi và phê duyệt Plan mới được đi tiếp.


[GIAI ĐOẠN 2: Thực thi Code (Execution)]
1. Sau khi nhận được sự phê duyệt của tôi, tự động tạo Artifact `task` để theo dõi tiến độ.
2. Tự động tạo Artifact `task` để theo dõi tiến độ.

[GIAI ĐOẠN 3: Kiểm thử Tự động (QA & Visual Audit)]
1. Sử dụng skill `@qa-tester` để kích hoạt công cụ `browser_subagent`. Yêu cầu mở ứng dụng TayfBook đang chạy ở môi trường phát triển.
2. Test lại toàn bộ chức năng của trang web và báo cáo kết quả.

Narrowing (Ràng buộc cốt lõi):
- Tuyệt đối không tự ý code khi chưa được Approve Plan ở Giai đoạn 1. 
- Phải giữ nguyên cấu trúc trang web, chỉ sửa, thêm những phần tôi yêu cầu
- phong cách thiết kế của trang web, giữ nguyên các màu sắc chủ đạo 