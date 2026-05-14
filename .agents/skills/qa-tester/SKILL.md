---
name: qa-tester
description: Đóng vai Kỹ sư Kiểm thử Tự động (Automation QA), sử dụng Browser Sub-agent để kiểm tra giao diện và luồng dữ liệu trên trình duyệt.
---

# QA Tester Skill

## Purpose

Kỹ năng này cung cấp khả năng tự động hóa kiểm thử End-to-End (E2E) và rà soát trực quan (Visual Audit). Kỹ năng sử dụng công cụ sub-agent để mô phỏng chính xác hành vi của người dùng thực, đảm bảo giao diện đẹp mắt và logic hoạt động không có lỗi.

## When to Use This Skill

Sử dụng kỹ năng này khi:
- Ứng dụng web vừa được xây dựng xong và cần được nghiệm thu (verify).
- Cần rà soát lỗi giao diện (Visual Audit) để đảm bảo tuân thủ thiết kế (ví dụ: phong cách Apple).
- Cần mô phỏng hành động thực tế của người dùng cuối (nhập liệu, click chuột).
- Cần kiểm tra độ bền dữ liệu trên client (đảm bảo `localStorage` không bị mất khi F5).

## Workflow & Instructions

Khi thực hiện kiểm thử, bạn phải tuân theo luồng công việc sau:

### 1. Khởi động Trình duyệt
- Sử dụng công cụ `browser_subagent` để mở file mục tiêu (ví dụ: `index.html`) hoặc URL public trên môi trường trình duyệt mô phỏng.

### 2. Rà soát Trực quan (Visual Audit)
- Yêu cầu Sub-agent tự "soi" lại giao diện. Kiểm tra xem các nút bấm có quá nhỏ không, văn bản có bị lệch không.
- **Tự sửa đổi:** Nếu phát hiện thiết kế sai lệch so với yêu cầu ban đầu, AI phải chủ động mở file CSS/HTML để tinh chỉnh lại cho chuẩn trước khi test tiếp.

### 3. Kiểm thử Chức năng (User Simulation)
- Yêu cầu Sub-agent thực hiện các kịch bản cụ thể theo ngữ cảnh của dự án (Ví dụ: Thêm 1 khoản Thu và 1 khoản Chi vào ứng dụng theo kịch bản).
- Xác minh xem màn hình có cập nhật đúng dữ liệu (danh sách lịch sử, số dư tổng) và có hiển thị thông báo thành công (Toast) hay không.

### 4. Kiểm tra Độ bền (Persistence Test)
- Chỉ đạo Sub-agent thực hiện thao tác Refresh (bấm F5) trang web.
- Kiểm tra lại toàn bộ dữ liệu vừa nhập có còn hiển thị chính xác không để chứng minh `localStorage` hoạt động hoàn hảo.

### 5. Lập Báo cáo Nghiệm thu
- Ghi nhận lại toàn bộ quá trình, kết quả và đặc biệt là **đường dẫn Video Recording** sinh ra từ công cụ `browser_subagent`.
- Tạo một Artifact tổng kết (ví dụ: `walkthrough`) để trình bày kết quả cho người dùng.

## Limitations
- Phụ thuộc hoàn toàn vào giới hạn khả năng tương tác của công cụ `browser_subagent`.
- Không thể kiểm thử các kịch bản yêu cầu mã xác thực OTP từ thiết bị vật lý.
