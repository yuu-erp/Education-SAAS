# Tài Liệu Phân Tích & Giải Thích Chi Tiết Prisma Schema

Hệ thống cơ sở dữ liệu này được thiết kế theo mô hình **Multi-Tenant (Đa khách thuê)** dành cho nền tảng quản lý trung tâm giáo dục hoặc nhà trường (School/Education Center Management System). Mỗi `Organization` (Tổ chức/Trung tâm) hoạt động như một thực thể độc lập với dữ liệu được cô lập riêng biệt.

---

## 1. Tổng Quan Kiến Trúc & Thiết Kế

### Tính Năng Multi-Tenancy (Cô Lập Dữ Liệu)
Hầu hết các bảng cốt lõi (`Student`, `Teacher`, `Class`, `Enrollment`, `Invoice`, `Notification`) đều có trường `organizationId` và liên kết trực tiếp với bảng `Organization`. 
* **Hiệu năng (Performance):** Giúp tăng tốc độ truy vấn khi lọc dữ liệu theo từng trung tâm nhờ vào việc tận dụng chỉ mục (Index).
* **Bảo mật (Security):** Dễ dàng áp dụng các lớp phần mềm trung gian (Middleware/Row-level security) để đảm bảo dữ liệu của tổ chức này không bị truy cập trái phép bởi tổ chức khác.

### Cơ Chế Xóa Mềm (Soft Delete)
Các bảng quan trọng như `User`, `Organization`, `Student`, `Parent`, `Teacher`, `Class` đều sở hữu trường `deletedAt DateTime?`. 
* Thay vì xóa cứng khỏi DB, hệ thống chỉ cập nhật timestamp vào trường này.
* Giúp khôi phục dữ liệu dễ dàng khi người dùng lỡ tay xóa và giữ toàn vẹn dữ liệu lịch sử cho các báo cáo tài chính hoặc điểm danh.

---

## 2. Hệ Thống Danh Mục Chuẩn Hóa (Enums)

Hệ thống sử dụng các Enum để chuẩn hóa dữ liệu đầu vào, tăng tính tường minh và hạn chế sai sót trong quá trình vận hành logic:

| Tên Enum | Các Giá Trị Hỗ Trợ | Ý Nghĩa Thực Tế & Nghiệp Vụ |
| :--- | :--- | :--- |
| `Role` | `OWNER`, `ADMIN`, `TEACHER`, `PARENT`, `STUDENT` | Phân quyền truy cập và phân định vai trò trên hệ thống. |
| `UserStatus` | `ACTIVE`, `INVITED`, `SUSPENDED` | Quản lý vòng đời tài khoản (Mới được mời, đang hoạt động, bị khóa). |
| `Gender` | `MALE`, `FEMALE`, `OTHER` | Giới tính của học sinh hoặc các thực thể liên quan. |
| `SubscriptionPlan` | `BASIC`, `PRO`, `CENTER_PLUS` | Các gói dịch vụ SaaS mà Trung tâm đăng ký mua từ nền tảng. |
| `SubscriptionStatus` | `TRIAL`, `ACTIVE`, `EXPIRED`, `CANCELED` | Trạng thái thanh toán/bản quyền của Trung tâm. |
| `EnrollmentStatus` | `ACTIVE`, `COMPLETED`, `DROPPED` | Tình trạng học tập của học sinh tại lớp (Đang học, Hoàn thành, Nghỉ học). |
| `AttendanceStatus` | `PRESENT`, `ABSENT`, `LATE`, `EXCUSED` | Kết quả điểm danh buổi học (Có mặt, Vắng mặt, Đi muộn, Vắng có phép). |
| `InvoiceStatus` | `PENDING`, `PAID`, `OVERDUE`, `CANCELED` | Trạng thái của hóa đơn học phí (Chờ thu, Đã đóng, Quá hạn, Đã hủy). |
| `PaymentMethod` | `CASH`, `BANK_TRANSFER`, `MOMO`, `ZALOPAY` | Hình thức thanh toán học phí được hệ thống hỗ trợ. |
| `ParentRelationship` | `FATHER`, `MOTHER`, `GUARDIAN`, `OTHER` | Mối quan hệ giữa phụ huynh và học sinh (Bố, Mẹ, Người giám hộ...). |
| `NotificationType` | `SYSTEM`, `ATTENDANCE`, `TUITION`, `ANNOUNCEMENT` | Phân loại thông báo để điều hướng hiển thị hoặc đẩy thông báo đẩy (Push). |

---

## 3. Chi Tiết Các Phân Hệ Thực Thể (Models)

### 3.1. Phân Hệ Xác Thực & Quản Trị Hệ Thống (Auth & Core Multi-Tenant)
* **`User`**: Lưu trữ thông tin tài khoản định danh duy nhất qua `email`. Trường `passwordHash` đảm bảo an toàn mật khẩu.
* **`Organization`**: Đại diện cho một trung tâm giáo dục. Chứa cấu hình múi giờ (`timezone`) mặc định là `Asia/Ho_Chi_Minh`.
* **`Membership`**: Bảng trung gian giải quyết mối quan hệ **Nhiều - Nhiều (Many-to-Many)** giữa `User` và `Organization`. Một `User` có thể tham gia nhiều `Organization` với các vai trò (`Role`) riêng biệt. Ràng buộc `@@unique([userId, organizationId])` đảm bảo tính duy nhất của cặp thực thể này.
* **`Subscription`**: Liên kết **1 - 1** với `Organization` để kiểm soát thời hạn và gói dịch vụ mà trung tâm đó đang thuê.

### 3.2. Phân Hệ Quản Lý Học Sinh & Phụ Huynh (CRM Giáo Dục)
* **`Student` & `Parent`**: Thông tin chi tiết về học sinh và phụ huynh được tách biệt hoàn toàn khỏi tài khoản hệ thống (`User`) nhằm tối ưu cấu trúc dữ liệu chuyên biệt (ngày sinh, mã học sinh, địa chỉ...).
* **`StudentParent`**: Bảng liên kết trung gian **Nhiều - Nhiều** giữa Học sinh và Phụ huynh. 
  * Một phụ huynh có thể quản lý nhiều con học tại trung tâm.
  * Một học sinh có thể có nhiều người giám hộ (Bố, Mẹ).
  * Trường `isPrimary Boolean` dùng để đánh dấu phụ huynh nhận thông báo chính (Ví dụ: ưu tiên gửi SMS/Zalo nhắc học phí).

### 3.3. Phân Hệ Quản Lý Học Tập & Lớp Học (Academic & Scheduling)
* **`Teacher`**: Lưu trữ thông tin của giáo viên thuộc tổ chức.
* **`Class`**: Lớp học của trung tâm, liên kết **1 - Nhiều** với `Teacher` (Một giáo viên phụ trách phụ trách một lớp, trường này cho phép `null` để xử lý trường hợp lớp chưa được phân công giáo viên).
* **`Schedule` (Lịch học)**: Liên kết với `Class`. Một lớp có thể học nhiều buổi/tuần, biểu diễn qua trường `weekday` (Thứ) kết hợp thời gian bắt đầu (`startTime`) và kết thúc (`endTime`) dạng chuỗi (Ví dụ: `"18:00"`).
* **`Enrollment`**: Quản lý việc xếp lớp cho Học sinh. `@@unique([studentId, classId])` ngăn chặn việc xếp một học sinh vào một lớp nhiều lần.
* **`Attendance`**: Nhật ký điểm danh từng buổi học của học sinh tại lớp, lưu trạng thái và ghi chú cụ thể.

### 3.4. Phân Hệ Tài Chính & Thông Báo (Finance & Messaging)
* **`Invoice`**: Hóa đơn học phí được phát hành cho `Student`. Trường `amount` sử dụng kiểu dữ liệu `Decimal` để đảm bảo độ chính xác tuyệt đối, tránh sai số làm tròn của số thập phân (Floating-point error).
* **`Payment`**: Quản lý lịch sử đóng tiền. Thiết kế này hỗ trợ cơ chế **Thanh toán từng phần (Partial Payment)**. Một hóa đơn (`Invoice`) có thể tương ứng với nhiều đợt đóng tiền (`Payment`) cho tới khi tổng tiền các đợt bằng lượng cần thanh toán.
* **`Notification`**: Lưu trữ tin nhắn, thông báo nội bộ của trung tâm phát đi cho các thành viên.

---

## 4. Đánh Giá Các Điểm Cộng Về Thiết Kế (Best Practices)

1. **Sử dụng Định danh CUID (`cuid()`)**: Toàn bộ khóa chính (`@id`) đều dùng CUID. CUID an toàn hơn ID tự tăng (Integer) vì tránh bị dò đoán số lượng bản ghi của hệ thống, đồng thời tối ưu hiệu năng sắp xếp index và phân tán dữ liệu tốt hơn UUID thông thường.
2. **Ràng buộc Toàn vẹn với `onDelete: Cascade`**: Khi một thực thể cha bị xóa (ví dụ xóa cứng một `Class` hoặc `Student`), các bản ghi phụ thuộc liên quan ở bảng trung gian (`Enrollment`, `Attendance`, `StudentParent`) sẽ tự động được dọn dẹp sạch sẽ, giúp hệ thống không bao giờ bị lỗi mồ côi dữ liệu (Orphaned records).
3. **Tối ưu hóa Tốc độ Truy vấn (`@@index`)**: Các trường thường xuyên xuất hiện trong mệnh đề `WHERE` để lọc dữ liệu như `organizationId`, `userId`, `email` đều được cấu hình Index. Điều này giữ cho hệ thống hoạt động mượt mà với độ trễ cực thấp ngay cả khi lượng bản ghi tăng lên hàng triệu dòng.
