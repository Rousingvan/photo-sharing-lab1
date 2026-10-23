# Kế hoạch Triển khai Lab 1: Single Page Applications (Photo Sharing Web App)

> **Mục tiêu:** Xây dựng ứng dụng chia sẻ ảnh Single Page Application (SPA) hoàn chỉnh sử dụng **React 18**, **React Router v6**, và **Material-UI v5 (MUI)** dựa trên dữ liệu mô phỏng (`models.js`). Đảm bảo đáp ứng đầy đủ yêu cầu Problem 1 của giảng viên, hỗ trợ deep-linking và refresh trang không bị lỗi.

---

## 1. Tổng quan Kiến trúc & Nguyên lý Hoạt động (Logic hệ thống)

### 1.1 Mô hình Single Page Application (SPA) & Master-Detail Pattern
Ứng dụng sử dụng mô hình **Master-Detail**:
- **Khung cố định (Layout shell)**:
  - Phía trên cùng: `TopBar` (AppBar của Material-UI) hiển thị thông tin sinh viên và ngữ cảnh trang đang xem.
  - Phía bên trái (chiếm 3/12 cột lưới - Grid xs=12 sm=3): `UserList` (Master navigation) luôn hiển thị danh sách người dùng.
- **Vùng nội dung động (Detail area - chiếm 9/12 cột lưới - Grid sm=9)**:
  - Thay đổi nội dung theo URL thông qua `React Router`:
    - `/users/:userId` -> Component `UserDetail` (hiển thị thông tin cá nhân và nút bấm chuyển sang xem ảnh).
    - `/photos/:userId` -> Component `UserPhotos` (hiển thị danh sách ảnh, ngày giờ chụp, bình luận và người bình luận).
    - `/users` hoặc `/` -> Trang danh sách / hướng dẫn chọn người dùng.

```mermaid
graph TD
    App["App.js (BrowserRouter & Grid Layout)"]
    App --> TopBar["TopBar (Header: Tên SV & Ngữ cảnh hiển thị)"]
    App --> GridContainer["Grid Body (Master - Detail)"]
    GridContainer --> UserList["UserList (Sidebar 3/12)"]
    GridContainer --> Routes["Routes & Route (Content 9/12)"]
    
    Routes -->|/users/:userId| UserDetail["UserDetail (Chi tiết cá nhân)"]
    Routes -->|/photos/:userId| UserPhotos["UserPhotos (Ảnh & Bình luận)"]
    
    UserList -.->|Click user item| UserDetail
    UserDetail -.->|Click 'View Photos'| UserPhotos
    UserPhotos -.->|Click comment author| UserDetail
    
    Models[("models.js (Fake Database)")]
    Models -->|userListModel()| UserList
    Models -->|userModel(userId)| UserDetail
    Models -->|photoOfUserModel(userId)| UserPhotos
    Models -->|userModel(userId)| TopBar
```

### 1.2 Deep-Linking & Quản lý State qua URL
- **Không dùng State toàn cục phức tạp**: Tất cả các component lấy ID trực tiếp từ URL thông qua hook `useParams()` của React Router v6.
- **Deep-linking & Refresh an toàn**: Khi người dùng nhấn F5 ở bất kỳ URL nào (ví dụ `/photos/57231f1a30e4351f4e9f4bd7`), component tự động đọc `userId` từ URL và gọi `models.photoOfUserModel(userId)` hoặc `models.userModel(userId)`, giúp dữ liệu được khôi phục ngay lập tức mà không phụ thuộc vào trạng thái trước đó.

---

## 2. Cấu trúc Dữ liệu (Model Data Schema)

Dữ liệu được cung cấp qua module `src/modelData/models.js`:
1. **User Object (`models.userModel(userId)` / `models.userListModel()`)**:
   - `_id`: ID người dùng (string).
   - `first_name`, `last_name`: Tên và họ.
   - `location`: Địa chỉ sinh sống.
   - `description`: Mô tả tiểu sử.
   - `occupation`: Nghề nghiệp.
2. **Photo Object (`models.photoOfUserModel(userId)`)**:
   - `_id`: ID ảnh.
   - `user_id`: ID người tạo ảnh.
   - `date_time`: Thời gian tải ảnh (chuỗi thời gian).
   - `file_name`: Tên file ảnh (nằm trong thư mục `src/images/`).
   - `comments`: Mảng các đối tượng comment.
3. **Comment Object**:
   - `_id`: ID bình luận.
   - `photo_id`: ID ảnh chứa bình luận.
   - `user`: Đối tượng user của người bình luận (gồm `_id`, `first_name`, `last_name`).
   - `date_time`: Thời gian bình luận.
   - `comment`: Nội dung bình luận.

---

## 3. Các Lệnh Thực hiện (Terminal Commands)

Dưới đây là các lệnh cần chạy trong thư mục dự án (`d:/Giaotrinh/PTIT/07_Ky_1_Nam_4/photo-sharing-v3`):

```bash
# 1. Cài đặt các gói phụ thuộc (nếu chưa cài)
npm install

# 2. Khởi động ứng dụng React ở môi trường development
npm start

# 3. Chạy kiểm thử tự động (Unit Test / Integration Test)
npm test -- --watchAll=false
```

---

## 4. Kế hoạch Triển khai Từng Bước (Tasks Breakdown)

### Task 1: Cấu hình Định dạng Ngày tháng & Tối ưu Điều hướng tại `App.js`
- **Files**:
  - `src/App.js`
  - Tạo mới `src/lib/formatDateTime.js` (hàm tiện ích format ngày giờ sang dạng thân thiện với người dùng).
- **Mục tiêu**:
  - Thêm route mặc định chuyển hướng `/` về `/users` hoặc trang chào mừng.
  - Chuẩn bị hàm format date: `formatDateTime(isoString)` trả về chuỗi trực quan như `"Oct 23, 2023, 3:30 PM"` thay vì chuỗi ISO thô.

### Task 2: Hoàn thiện Component `UserList` (Sidebar 3/12)
- **Files**: `src/components/UserList/index.jsx`, `src/components/UserList/styles.css`
- **Logic**:
  - Lấy danh sách users từ `models.userListModel()`.
  - Sử dụng `<List>`, `<ListItemButton>`, `<ListItemText>` từ `@mui/material`.
  - Dùng `<ListItemButton component={Link} to={`/users/${item._id}`}>` để khi click sẽ điều hướng mượt mà sang trang User Detail.
  - Hiển thị đầy đủ `first_name` và `last_name`.
  - Thêm hiệu ứng hover hoặc đánh dấu người dùng đang được chọn.

### Task 3: Hoàn thiện Component `UserDetail` (Detail View 9/12)
- **Files**: `src/components/UserDetail/index.jsx`, `src/components/UserDetail/styles.css`
- **Logic**:
  - Lấy `userId` từ URL bằng hook `useParams()`.
  - Lấy thông tin user bằng `models.userModel(userId)`.
  - Xử lý trường hợp không tìm thấy user (tránh crash ứng dụng).
  - Sử dụng `<Card>`, `<CardContent>`, `<Typography>` của MUI để hiển thị thông tin trang nhã:
    - Họ tên (Heading)
    - Nghề nghiệp (Occupation)
    - Nơi ở (Location)
    - Tiểu sử (Description)
  - Nút bấm (Button) nổi bật: "See Photos" / "Xem ảnh" liên kết đến `/photos/${user._id}` sử dụng `<Button component={Link} to={`/photos/${user._id}`} variant="contained">`.

### Task 4: Hoàn thiện Component `UserPhotos` (Photos & Comments View 9/12)
- **Files**: `src/components/UserPhotos/index.jsx`, `src/components/UserPhotos/styles.css`
- **Logic**:
  - Lấy `userId` từ URL bằng `useParams()`.
  - Lấy danh sách ảnh bằng `models.photoOfUserModel(userId)`.
  - Duyệt qua từng bức ảnh (`photos.map(...)`), hiển thị bằng `<Card>`:
    - **Ảnh**: Load động ảnh từ thư mục `images`: `<img src={require(`../../images/${photo.file_name}`)} alt={photo.file_name} />` với style responsive (`maxWidth: "100%"`).
    - **Thời gian đăng ảnh**: Sử dụng hàm format ngày tháng thân thiện.
    - **Khu vực bình luận (Comments)**:
      - Duyệt qua `photo.comments`.
      - Hiển thị ngày giờ bình luận.
      - Tên người bình luận hiển thị dưới dạng liên kết bấm được `<Link to={`/users/${comment.user._id}`}>` dẫn đến trang chi tiết của người đó.
      - Nội dung bình luận.
      - Nếu ảnh chưa có bình luận: hiển thị thông báo "Chưa có bình luận nào".

### Task 5: Hoàn thiện Component `TopBar` (Header theo ngữ cảnh)
- **Files**: `src/components/TopBar/index.jsx`, `src/components/TopBar/styles.css`
- **Logic**:
  - Bên trái: Tên sinh viên (ví dụ: `Họ và tên sinh viên - MSSV`).
  - Bên phải: Thay đổi động theo view đang hiển thị bằng hook `useMatch()` hoặc `useLocation()` từ `react-router-dom`:
    - Nếu match `/users/:userId`: hiển thị tên của user (lấy qua `models.userModel(userId)`).
    - Nếu match `/photos/:userId`: hiển thị `"Photos of " + <User Full Name>`.
    - Nếu đang ở `/users`: hiển thị `"User List"`.
  - Sử dụng `<Toolbar>` với `justifyContent: "space-between"` để tách biệt 2 bên rõ ràng.

### Task 6: Kiểm thử Toàn diện & Kiểm tra Deep-Linking
- **Quy trình kiểm thử**:
  1. Click lần lượt từng user ở danh sách bên trái -> Kiểm tra URL đổi sang `/users/:userId` và màn hình hiển thị đúng thông tin.
  2. Bấm nút "See Photos" -> Kiểm tra chuyển sang `/photos/:userId`, ảnh và bình luận hiển thị chính xác.
  3. Bấm vào tên người bình luận trong phần comment -> Kiểm tra chuyển đúng sang trang `/users/:authorId` của người đó.
  4. Kiểm tra `TopBar`: Xem bên phải có cập nhật đúng tên user hoặc `"Photos of ..."` không.
  5. **Kiểm tra Deep-linking & F5 Refresh**: Refresh trực tiếp trình duyệt tại `/users/:userId` và `/photos/:userId` xem giao diện và dữ liệu có giữ nguyên không.

---

## 5. Tiêu chí Hoàn thành (Acceptance Criteria)
- [x] Không còn thông báo lỗi hay crash trong console trình duyệt.
- [x] Giao diện hiển thị rõ ràng, gọn gàng bằng Material-UI components.
- [x] Định dạng ngày giờ thân thiện người dùng (không để nguyên định dạng Date ISO thô).
- [x] TopBar phản ánh đúng ngữ cảnh hiển thị bên phải và thông tin sinh viên bên trái.
- [x] Tất cả các liên kết (chuyển qua lại giữa UserDetail, UserPhotos, Commenters) hoạt động mượt mà.
- [x] Refresh trình duyệt ở bất cứ trang nào ứng dụng vẫn nạp đúng dữ liệu.
