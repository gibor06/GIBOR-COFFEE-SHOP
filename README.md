# ☕ GIBOR COFFEE SHOP

> **Website Thương Mại Điện Tử - Hương vị nguyên bản từ nông trại đến tách cà phê**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 📌 Giới thiệu

**GIBOR Coffee Shop** là đồ án môn học xây dựng website thương mại điện tử hoàn chỉnh cho chuỗi cà phê GIBOR. Website cung cấp đầy đủ chức năng từ xem menu, đặt hàng, quản lý giỏ hàng, thanh toán trực tuyến, đến hệ thống xác thực người dùng tích hợp Firebase và hệ thống điểm tích lũy khách hàng thân thiết.

### 🎯 Đặc điểm nổi bật

✅ **Xác thực đa nền tảng** - Email/Password, Google OAuth, GitHub OAuth  
✅ **Giỏ hàng thông minh** - Lưu trữ local, tùy chỉnh chi tiết sản phẩm  
✅ **Thanh toán linh hoạt** - COD, Banking với QR code tự động  
✅ **Điểm tích lũy** - Hệ thống loyalty program hoàn chỉnh  
✅ **Responsive Design** - Tối ưu cho Desktop, Tablet, Mobile  
✅ **Dark Mode** - Chế độ tối hiện đại, lưu preferences  
✅ **15 Chi nhánh** - Hệ thống quản lý chi nhánh toàn quốc  
✅ **Bảo mật cao** - Email verification, provider tracking, session management  

### 📍 Thông tin

- **Địa chỉ:** 140 Lê Trọng Tấn, Tân Phú, TP.HCM
- **Chi nhánh:** 15 chi nhánh (5 TP.HCM · 5 Hà Nội · 5 Đà Nẵng)
- **Giờ mở cửa:** 07:00 – 22:00 hàng ngày
- **Trường:** Đại học Công Thương TP.HCM (HUIT)
- **Học kỳ:** Kỳ 4 (2025-2026) - Team 4

---

## 👥 Thành viên nhóm

| Thành viên | Vai trò | Phụ trách |
|------------|---------|-----------|
| **Trần Gia Bảo** | Leader Team | Home, About, Contact, Branches, Main Logic |
| **Trần Dương Gia Bảo** | Core Developer | Data Layer, Cart, Payment, Account, Mobile, Points System |
| **Nguyễn Thế Anh** | Firebase Specialist | Auth, Login, Register, OAuth Integration |
| **Nguyễn Hoàng Bảo** | Frontend Developer | Menu, Popup System, Ads, Product UI |

---

## 🗂️ Cấu trúc dự án

```
GIBOR-COFFEE-SHOP/
├── 📄 HTML Pages (11 files)
│   ├── index.html          # Trang chủ
│   ├── menu.html           # Menu sản phẩm
│   ├── cart.html           # Giỏ hàng
│   ├── payment.html        # Thanh toán
│   ├── account.html        # Quản lý tài khoản
│   ├── login.html          # Đăng nhập
│   ├── register.html       # Đăng ký
│   ├── about.html          # Giới thiệu
│   ├── contact.html        # Liên hệ
│   ├── branches.html       # Chi nhánh
│   └── ads.html            # Khuyến mãi
│
├── 🎨 CSS (13 files)
│   ├── style.css           # CSS chung + Dark mode
│   ├── home.css            # Trang chủ
│   ├── menu.css            # Menu
│   ├── cart.css            # Giỏ hàng
│   ├── payment.css         # Thanh toán
│   ├── account.css         # Tài khoản
│   ├── login.css           # Đăng nhập
│   ├── register.css        # Đăng ký
│   ├── about.css           # Giới thiệu
│   ├── contact.css         # Liên hệ
│   ├── branches.css        # Chi nhánh
│   ├── popup.css           # Popup system
│   ├── ads.css             # Ads popup
│   └── mobile.css          # Responsive mobile
│
├── 💻 JavaScript (12 files)
│   ├── data.js             # Data layer (UserManager, PointsManager, OrderManager)
│   ├── cart.js             # Logic giỏ hàng
│   ├── payment.js          # Logic thanh toán
│   ├── account.js          # Logic tài khoản
│   ├── firebase.js         # Firebase config
│   ├── loginregister.js    # Auth logic
│   ├── main.js             # Logic chung (popup, OTP, email verification)
│   ├── menu.js             # Logic menu
│   ├── mobile.js           # Mobile interactions
│   ├── about.js            # About page logic
│   ├── contact.js          # Contact form
│   ├── branches.js         # Branches logic
│   ├── branches-data.js    # Branches data
│   └── ads.js              # Ads popup logic
│
├── 🖼️ Images
    ├── logo/               # Logo & branding
    ├── banner/             # Hero banners
    ├── menu/               # Product images (50+ items)
    ├── about/              # About page images
    └── Branch/             # Branch photos (15 locations)

```

---

## ✨ Tính năng chính

### 🔐 Hệ thống xác thực (Authentication)

**Đăng ký/Đăng nhập đa nền tảng:**
- ✅ Email & Password (Firebase + LocalStorage)
- ✅ Google OAuth 2.0
- ✅ GitHub OAuth
- ✅ Quên mật khẩu qua email
- ✅ Email verification
- ✅ Provider tracking (ngăn trùng lặp email)

**Bảo mật:**
- Kiểm tra email duy nhất (case-insensitive)
- Mật khẩu tối thiểu 6 ký tự
- Session management
- Đổi mật khẩu với xác thực email (không dùng OTP)
- Token verification (15 phút hiệu lực)

### 🛒 Giỏ hàng (Shopping Cart)

- Thêm/xóa/cập nhật sản phẩm
- Tùy chỉnh: Size (S/M/L), Đường (0-100%), Đá (0-100%)
- Topping: Trân châu, thạch, pudding, kem cheese
- Ghi chú đặc biệt cho từng món
- Lưu trữ localStorage (persistent)
- Real-time update số lượng và giá
- Toast notifications

### 💳 Thanh toán (Payment)

**Phương thức giao hàng:**
- 🏠 Giao hàng tận nơi (phí 30.000đ, miễn phí đơn ≥200k)
- 🏪 Uống tại quán (15 chi nhánh, miễn phí)

**Phương thức thanh toán:**
- 💵 COD (Cash on Delivery)
- 🏦 Banking (QR code tự động với số tiền)

**Mã giảm giá:**
- `GIBOR10` - Giảm 10% (tối đa 50.000đ)
- `GIBOR20K` - Giảm 20.000đ
- `FREESHIP` - Miễn phí vận chuyển

**Điểm tích lũy:**
- Tích: 1.000đ = 1 điểm
- Đổi: 100 điểm = 1.000đ giảm giá
- Hiển thị điểm hiện có và điểm sẽ nhận
- Tự động tính toán và áp dụng

### 👤 Quản lý tài khoản (Account Management)

**Tab Thông tin:**
- Cập nhật họ tên, email, số điện thoại
- Avatar với initials
- Hiển thị điểm tích lũy

**Tab Bảo mật:**
- Đổi mật khẩu với xác thực email
- Kiểm tra mật khẩu cũ
- Tự động đăng xuất sau đổi mật khẩu

**Tab Đơn hàng:**
- Lịch sử đơn hàng đầy đủ
- Chi tiết sản phẩm, tùy chọn, ghi chú
- Thông tin giao hàng/chi nhánh
- Mã đơn hàng, ngày giờ, tổng tiền

### 🏢 Hệ thống chi nhánh (15 locations)

**TP. Hồ Chí Minh (5):**
- Lê Trọng Tấn, Tân Phú
- Nguyễn Huệ, Quận 1
- Võ Văn Tần, Quận 3
- Xa lộ Hà Nội, Quận 9
- Điện Biên Phủ, Bình Thạnh

**Hà Nội (5):**
- Trần Duy Hưng, Cầu Giấy
- Láng Hạ, Đống Đa
- Bạch Mai, Hai Bà Trưng
- Hoàng Hoa Thám, Ba Đình
- Nguyễn Văn Cừ, Long Biên

**Đà Nẵng (5):**
- Võ Nguyên Giáp, Sơn Trà
- Bạch Đằng, Hải Châu
- Nguyễn Văn Linh, Thanh Khê
- Tôn Đức Thắng, Hải Châu
- Cách Mạng Tháng Tám, Hải Châu

### 🎨 Giao diện & UX

- **Dark Mode** - Toggle sáng/tối, lưu preference
- **Responsive** - Desktop (≥1024px), Tablet (768-1023px), Mobile (<768px)
- **Preloader** - Loading animation với logo
- **Sticky Header** - Navigation cố định khi scroll
- **Hamburger Menu** - Mobile navigation
- **Toast Notifications** - Thông báo thao tác
- **Modal Popups** - Success/Error/Warning/Confirmation
- **Smooth Animations** - Transitions mượt mà

---

## 🛠️ Chi tiết kỹ thuật

### 📦 Data Layer (`data.js`) - Trần Dương Gia Bảo

**UserManager** - Quản lý tài khoản người dùng

```javascript
// LocalStorage key: gibor_users, gibor_current_user
UserManager.getUsers()                    // Lấy danh sách users
UserManager.register({...})               // Đăng ký (kiểm tra email + provider)
UserManager.login(email, password)        // Đăng nhập
UserManager.getCurrentUser()              // Lấy user hiện tại
UserManager.logout()                      // Đăng xuất
UserManager.updateProfile({...})          // Cập nhật thông tin
UserManager.updatePassword(old, new)      // Đổi mật khẩu
UserManager.resetPassword(email, pass)    // Reset password
UserManager.loginWithGoogle(googleUser)   // Google OAuth
UserManager.loginWithGithub(githubUser)   // GitHub OAuth
```

**PointsManager** - Hệ thống điểm tích lũy

```javascript
// LocalStorage key: gibor_points
// Quy tắc: 1.000đ = 1 điểm | 100 điểm = 1.000đ giảm
PointsManager.getPoints()           // Lấy điểm hiện tại
PointsManager.setPoints(points)     // Cập nhật điểm
PointsManager.earnPoints(amount)    // Cộng điểm (sau thanh toán)
PointsManager.usePoints(points)     // Trừ điểm (khi đổi)
PointsManager.pointsToMoney(points) // Quy đổi điểm → tiền
PointsManager.moneyToPoints(amount) // Quy đổi tiền → điểm
```

**OrderManager** - Quản lý đơn hàng

```javascript
// LocalStorage key: gibor_orders
OrderManager.getOrders()      // Lấy đơn hàng của user
OrderManager.saveOrder(order) // Lưu đơn hàng mới
```

### 🛒 Cart System (`cart.js`) - Trần Dương Gia Bảo

```javascript
// LocalStorage key: giborCart
getCart()                      // Đọc giỏ hàng
saveCart(cart)                 // Lưu giỏ hàng
renderCart()                   // Render bảng giỏ hàng
changeQuantity(index, delta)   // Tăng/giảm số lượng
removeItem(index)              // Xóa sản phẩm
clearCart()                    // Xóa toàn bộ giỏ
updateCartCount()              // Cập nhật badge số lượng
showToast(message)             // Hiển thị thông báo
```

**Cấu trúc CartItem:**
```javascript
{
  name: "Cà phê sữa",
  image: "images/menu/caphesua.jpg",
  size: "M",                    // S/M/L hoặc "Mặc định"
  price: 35000,                 // Giá đơn vị (đã bao gồm topping)
  sugar: "50%",                 // 0%, 25%, 50%, 75%, 100%
  ice: "100%",                  // 0%, 25%, 50%, 75%, 100%
  toppings: [                   // Mảng topping
    {name: "Trân châu", price: 5000}
  ],
  note: "Ít đá",               // Ghi chú đặc biệt
  comboItems: [],              // Món trong combo (nếu có)
  quantity: 2
}
```

### 💳 Payment System (`payment.js`) - Trần Dương Gia Bảo

**File lớn nhất dự án (~1.463 dòng)**

```javascript
renderOrderSummary()           // Render danh sách sản phẩm
updateTotals(subtotal)         // Tính tổng tiền
applyCoupon()                  // Áp dụng mã giảm giá
applyPoints()                  // Sử dụng điểm
selectPaymentMethod(method)    // Chọn COD/Banking
selectShippingMethod(method)   // Chọn giao hàng/tại quán
selectBranch(branchId)         // Chọn chi nhánh
generateQRCode(amount)         // Tạo QR Banking
validateCheckoutForm()         // Validate thông tin
completeOrder()                // Hoàn tất đơn hàng
```

**Logic phí vận chuyển:**
- Uống tại quán: Miễn phí
- Giao hàng: 30.000đ (miễn phí nếu đơn ≥200.000đ)
- Mã FREESHIP: Luôn miễn phí

**Cấu trúc Order:**
```javascript
{
  code: "GIBOR-123456",
  userId: 1234567890,
  userName: "Nguyễn Văn A",
  items: [...],                // Mảng CartItem
  customer: {                  // Thông tin khách hàng
    name, phone, email, address
  },
  branch: {                    // Thông tin chi nhánh (nếu uống tại quán)
    name, address
  },
  subtotal: 100000,
  shipping: 30000,
  discount: 10000,
  pointsDiscount: 5000,
  total: 115000,
  payment: "COD",              // COD | Banking
  shipping: "Giao hàng",       // Giao hàng | Uống tại quán
  createdAt: "2026-03-25T..."
}
```

### 🔐 Authentication (`loginregister.js`) - Nguyễn Thế Anh

**Đăng nhập:**
1. Xác thực Firebase (ưu tiên)
2. Đồng bộ password về localStorage
3. Đăng nhập local với UserManager

**Đăng ký:**
1. Kiểm tra email trong localStorage (provider tracking)
2. Đăng ký Firebase
3. Lưu vào localStorage với provider: "email"

**Google/GitHub OAuth:**
1. Firebase popup authentication
2. Kiểm tra email trong localStorage
3. Nếu email đã tồn tại với provider khác → Từ chối
4. Nếu chưa tồn tại → Tạo tài khoản mới

**Quên mật khẩu:**
- Firebase sendPasswordResetEmail()
- Email chứa link reset password
- Tự động đồng bộ về localStorage

### 🔑 Password Change (`account.js` + `main.js`) - Trần Dương Gia Bảo

**Quy trình đổi mật khẩu:**
1. User nhập: mật khẩu cũ + mật khẩu mới
2. Kiểm tra mật khẩu cũ đúng
3. Tạo token xác thực duy nhất
4. Lưu request vào sessionStorage
5. Gửi email xác thực qua Firebase
6. User click link trong email
7. Xác thực token (hiệu lực 15 phút)
8. Đổi mật khẩu → Đăng xuất → Login

**Functions:**
```javascript
generateVerificationToken()                    // Tạo token ngẫu nhiên
sendPasswordChangeVerificationEmail(email, token) // Gửi email
showPasswordChangeVerificationPopup(...)       // Popup xác nhận
verifyAndChangePassword(token)                 // Xác thực & đổi MK
```

**SessionStorage:**
```javascript
gibor_password_change_request: {
  userId, email, oldPassword, newPassword,
  timestamp, token
}
```

### 📱 Mobile Responsive (`mobile.js`) - Trần Dương Gia Bảo

**Features:**
- Bottom navigation bar (mobile only)
- Drawer menu với overlay
- Touch gestures
- Scroll lock khi mở menu
- Safe area insets (iOS)
- Android-specific handling
- Responsive breakpoints

**Functions:**
```javascript
isMobile()                     // Kiểm tra mobile
setBodyScrollLock(locked)      // Lock/unlock scroll
openAccountPanel()             // Mở trang account
syncHeaderHeightVar()          // Sync header height
cleanupDesktopArtifacts()      // Cleanup khi resize
```

### 🎨 Main Logic (`main.js`) - Trần Gia Bảo + Nguyễn Hoàng Bảo + Trần Dương Gia Bảo

**Chức năng chung:**
- Preloader animation
- Dark mode toggle
- Hamburger menu
- Sticky header
- User dropdown
- Popup system (success/error/warning)
- Email OTP verification
- Password change verification
- Order history popup
- Components loading (header/footer)

**Popup System:**
```javascript
showGiborPopup({
  type: "success" | "error" | "warning",
  title: "...",
  message: "...",
  confirmText: "OK",
  cancelText: "Hủy",
  onConfirm: () => {},
  onCancel: () => {}
})
```

### 🏢 Branches System (`branches.js` + `branches-data.js`) - Trần Gia Bảo

**Data structure:**
```javascript
branchesData = {
  "tphcm": [
    {
      id: "tphcm-1",
      name: "GIBOR Lê Trọng Tấn",
      address: "140 Lê Trọng Tấn, Tân Phú",
      phone: "028 xxxx xxxx",
      hours: "07:00 - 22:00",
      images: ["TPHCM1.JPG", "TPHCM2.jpg", ...],
      mapUrl: "https://maps.google.com/..."
    },
    ...
  ],
  "hanoi": [...],
  "danang": [...]
}
```

**Functions:**
```javascript
renderBranches(city)           // Render chi nhánh theo thành phố
filterBranches(city)           // Filter chi nhánh
showBranchDetail(branchId)     // Hiển thị chi tiết
```

### ☕ Menu System (`menu.js`) - Nguyễn Hoàng Bảo

**Product categories:**
- Cà phê (Coffee)
- Trà (Tea)
- Đồ ăn (Food)
- Topping
- Combo

**Popup selection:**
```javascript
openPopup(name, img, basePrice, category)  // Mở popup chọn
selectSize(size, price, btnElement)        // Chọn size
selectOption(type, value, btnElement)      // Chọn đường/đá
toggleTopping(btnElement)                  // Toggle topping
changePopupQty(delta)                      // Thay đổi số lượng
addToCart()                                // Thêm vào giỏ
```

**Price calculation:**
- Size S: basePrice
- Size M: basePrice + 5.000đ
- Size L: basePrice + 10.000đ
- Topping: +5.000đ/món

---

## 🎨 CSS Architecture

### Design Tokens (`style.css`)

```css
:root {
  /* Colors */
  --primary: #4b2c20;        /* Coffee brown */
  --accent: #d4a373;         /* Light brown */
  --bg: #fdfcfb;             /* Cream white */
  --text: #2c1b12;           /* Dark brown */
  
  /* Dark mode */
  --dark-bg: #1a1410;
  --dark-text: #f5e6d3;
  --dark-card: #2a1f1a;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-body: 'Montserrat', sans-serif;
  --font-heading: 'Playfair Display', serif;
  --font-script: 'Mrs Saint Delafield', cursive;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.2);
}
```

### Dark Mode Implementation

```css
body.dark {
  --bg: var(--dark-bg);
  --text: var(--dark-text);
  --card: var(--dark-card);
  /* ... */
}
```

**Toggle:**
```javascript
// Lưu vào localStorage
localStorage.setItem("theme", "dark" | "light");
// Apply class
document.body.classList.toggle("dark");
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (min-width: 769px) and (max-width: 1023px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lastName VARCHAR(50),
  firstName VARCHAR(50),
  displayName VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255),
  provider ENUM('email', 'google', 'github'),
  googleUid VARCHAR(100),
  githubUid VARCHAR(100),
  photoURL VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE,
  userId INT,
  userName VARCHAR(100),
  items JSON,
  customer JSON,
  branch JSON,
  subtotal DECIMAL(10,2),
  shipping DECIMAL(10,2),
  discount DECIMAL(10,2),
  pointsDiscount DECIMAL(10,2),
  total DECIMAL(10,2),
  payment VARCHAR(20),
  shippingMethod VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Points Table
```sql
CREATE TABLE points (
  userId INT PRIMARY KEY,
  points INT DEFAULT 0,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Trình duyệt:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js:** Không bắt buộc (website tĩnh)
- **Live Server:** Khuyến nghị (cho Firebase OAuth)

### Cài đặt

**Cách 1: Mở trực tiếp**
```bash
# Clone repository
git clone https://github.com/gibor06/GIBOR-COFFEE-SHOP.git

# Mở file index.html bằng trình duyệt
```

**Cách 2: Live Server (Khuyến nghị)**
```bash
# Cài VS Code extension: Live Server
# Click chuột phải vào index.html
# Chọn "Open with Live Server"
# Truy cập: http://127.0.0.1:5500
```

**Cách 3: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Truy cập: http://localhost:8000
```

### Cấu hình Firebase

1. Tạo project tại [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password, Google, GitHub)
3. Copy config vào `js/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Tài khoản thử nghiệm

**Đăng ký mới:**
- Truy cập `/register.html`
- Nhập thông tin đầy đủ
- Hoặc đăng nhập bằng Google/GitHub

**Mã giảm giá:**
- `GIBOR10` - Giảm 10% (max 50k)
- `GIBOR20K` - Giảm 20k
- `FREESHIP` - Miễn phí ship

---

## 📊 Thống kê dự án

| Thống kê | Số lượng |
|----------|----------|
| **Tổng số file HTML** | 11 |
| **Tổng số file CSS** | 13 |
| **Tổng số file JavaScript** | 12 |
| **Tổng dòng code** | ~18.500+ |
| **Số lượng sản phẩm** | 50+ |
| **Số lượng chi nhánh** | 15 |
| **Số lượng mã giảm giá** | 3 |
| **Responsive breakpoints** | 3 |
| **LocalStorage keys** | 6 |
| **SessionStorage keys** | 1 |

---

## 🤝 Contributing

Dự án này là đồ án học thuật, không nhận contributions từ bên ngoài. Tuy nhiên, nếu bạn phát hiện lỗi hoặc có đề xuất, vui lòng:

1. Tạo Issue trên GitHub
2. Mô tả chi tiết vấn đề
3. Đính kèm screenshots nếu có
4. Đề xuất giải pháp (nếu có)

---

## 📄 License

© 2026 **GIBOR COFFEE SHOP**. All rights reserved.

Đây là đồ án học thuật thuộc Trường Đại học Công Thương TP. Hồ Chí Minh (HUIT).

**Điều khoản sử dụng:**
- ✅ Được phép sử dụng cho mục đích học tập
- ✅ Được phép tham khảo code
- ❌ Không được sử dụng cho mục đích thương mại
- ❌ Không được copy toàn bộ dự án
- ⚠️ Phải ghi rõ nguồn khi tham khảo

---

## 👨‍💻 Contact

### Team Members

**Trần Gia Bảo** - Leader Team
- Email: gibor06.dev@gmail.com
- GitHub: [@gibor06](https://github.com/gibor06)
- Role: UI/UX, Home, About, Contact, Branches

**Trần Dương Gia Bảo** - Core Developer
- Email: tranduonggiabao0501@gmail.com
- GitHub: [@Peo051](https://github.com/Peo051)
- Role: Data Layer, Cart, Payment, Account

**Nguyễn Thế Anh** - Firebase Specialist
- Email: nguyentheanh1701@gmail.com
- GitHub: [@coffeee1701-lab](https://github.com/coffeee1701-lab)
- Role: Authentication, OAuth, Firebase Integration

**Nguyễn Hoàng Bảo** - Frontend Developer
- Email: baon05623@gmail.com
- GitHub: [@hbao0204](https://github.com/hbao0204)
- Role: Menu, Popup System, Product UI

### Project Links

- **GitHub Repository:** [GIBOR-COFFEE-SHOP](https://github.com/gibor06/GIBOR-COFFEE-SHOP)
- **Live Demo:** [giborcoffee.netlify.app](https://gibor06.github.io/Coffee_Shop_Management/)
- **Issue Tracker:** [GitHub Issues](https://github.com/yourusername/GIBOR-COFFEE-SHOP/issues)

### Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

1. **Email:** support@giborcoffee.vn
2. **GitHub Issues:** [Create an issue](https://github.com/yourusername/GIBOR-COFFEE-SHOP/issues/new)
3. **Facebook:** [GIBOR Coffee Official](https://facebook.com/giborcoffee)

---

## 🙏 Acknowledgments

### Technologies

- [Firebase](https://firebase.google.com/) - Authentication & Hosting
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Typography
- [Google Maps](https://maps.google.com/) - Location services

### Inspiration

- [Starbucks](https://www.starbucks.com/) - UI/UX inspiration
- [The Coffee House](https://thecoffeehouse.com/) - Local market insights
- [Highlands Coffee](https://highlandscoffee.com.vn/) - Business model

### Special Thanks

- **Giảng viên hướng dẫn** - Ths. Lữ Thị Cẩm Tú
- **Trường HUIT** - Cung cấp môi trường học tập
- **Nhóm phát triển** - Teamwork và dedication
- **Beta testers** - Feedback và bug reports

---

## 📸 Screenshots

### Desktop View

<div align="center">

<table>
  <tr>
    <td width="50%">
      <img src="docs/images/screenshots/desktop-home.png" alt="Home Page" width="100%"/>
      <p align="center"><em>Trang chủ với hero banner và giới thiệu</em></p>
    </td>
    <td width="50%">
      <img src="docs/images/screenshots/desktop-menu.png" alt="Menu Page" width="100%"/>
      <p align="center"><em>Trang menu với popup chọn sản phẩm</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/images/screenshots/desktop-cart.png" alt="Cart Page" width="100%"/>
      <p align="center"><em>Giỏ hàng với chi tiết sản phẩm</em></p>
    </td>
    <td width="50%">
      <img src="docs/images/screenshots/desktop-payment.png" alt="Payment Page" width="100%"/>
      <p align="center"><em>Trang thanh toán với QR code</em></p>
    </td>
  </tr>
</table>

</div>

### Mobile View

<div align="center">

<table>
  <tr>
    <td width="33%">
      <img src="docs/images/screenshots/mobile-home.png" alt="Mobile Home" width="100%"/>
      <p align="center"><em>Trang chủ responsive</em></p>
    </td>
    <td width="33%">
      <img src="docs/images/screenshots/mobile-menu.png" alt="Mobile Menu" width="100%"/>
      <p align="center"><em>Bottom navigation</em></p>
    </td>
    <td width="33%">
      <img src="docs/images/screenshots/mobile-cart.png" alt="Mobile Cart" width="100%"/>
      <p align="center"><em>Giỏ hàng mobile</em></p>
    </td>
  </tr>
</table>

</div>


---

## 🌟 Star History

## Star History

<a href="https://www.star-history.com/?repos=Peo051%2FGIBOR-COFFEE-SHOP&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=Peo051/GIBOR-COFFEE-SHOP&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=Peo051/GIBOR-COFFEE-SHOP&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/image?repos=Peo051/GIBOR-COFFEE-SHOP&type=date&legend=top-left" />
 </picture>
</a>

---

<div align="center">

### Made with ☕ by Team 4 - HUIT

**GIBOR COFFEE SHOP** © 2026

[⬆ Back to top](#-gibor-coffee-shop)

</div>
