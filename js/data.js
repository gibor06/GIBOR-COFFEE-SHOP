/* 
  ========================================================================================

                                    CODE BỞI TRẦN DƯƠNG GIA BẢO

  ========================================================================================
  QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG - data.js
  Lưu trữ & xử lý dữ liệu người dùng bằng localStorage
*/

const UserManager = {
  /**
   * Lấy danh sách tất cả người dùng từ localStorage
   * @returns {Array} Mảng các đối tượng user
   */
  getUsers() {
    const users = localStorage.getItem("gibor_users");
    return users ? JSON.parse(users) : [];
  },

  /**
   * Lưu danh sách người dùng vào localStorage
   * @param {Array} users - Mảng người dùng
   */
  saveUsers(users) {
    localStorage.setItem("gibor_users", JSON.stringify(users));
  },

  /**
   * Đăng ký tài khoản mới
   * @param {Object} param0
   * @param {string} param0.lastName - Họ
   * @param {string} param0.firstName - Tên
   * @param {string} param0.email - Email
   * @param {string} param0.phone - Số điện thoại
   * @param {string} param0.password - Mật khẩu
   * @returns {Object} { success, message, user }
   */
  register({ lastName, firstName, email, phone, password }) {
    const users = this.getUsers();

    // Kiểm tra email đã tồn tại chưa
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "Email đã được dùng để đăng ký." };
    }

    // Kiểm tra mật khẩu tối thiểu 6 ký tự
    if (password.length < 6) {
      return {
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      };
    }

    const newUser = {
      id: Date.now(),
      lastName: lastName,
      firstName: firstName,
      displayName: (lastName + " " + firstName).trim(),
      email: email,
      phone: phone,
      password: password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Tự động đăng nhập sau khi đăng ký
    this.setCurrentUser(newUser);

    return { success: true, message: "Đăng ký thành công!", user: newUser };
  },

  /**
   * Đăng nhập
   * @param {string} email
   * @param {string} password
   * @returns {Object} { success, message, user }
   */
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return {
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      };
    }

    this.setCurrentUser(user);
    return {
      success: true,
      message: "Đăng nhập thành công!",
      user: user,
    };
  },

  /**
   * Lưu thông tin user đang đăng nhập (không lưu password)
   * @param {Object} user
   */
  setCurrentUser(user) {
    const safeUser = {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
    };
    localStorage.setItem("gibor_current_user", JSON.stringify(safeUser));
  },

  /**
   * Lấy thông tin user đang đăng nhập
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem("gibor_current_user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem("gibor_current_user");
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Cập nhật thông tin cá nhân (họ, tên, email, sđt)
   * @param {Object} updates - { lastName, firstName, email, phone }
   * @returns {Object} { success, message }
   */
  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: "Chưa đăng nhập." };

    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx === -1)
      return { success: false, message: "Không tìm thấy tài khoản." };

    // Nếu đổi email → kiểm tra email mới chưa ai dùng
    if (updates.email && updates.email !== users[idx].email) {
      if (
        users.find((u) => u.email === updates.email && u.id !== currentUser.id)
      ) {
        return {
          success: false,
          message: "Email mới đã được dùng bởi tài khoản khác.",
        };
      }
    }

    // Cập nhật các trường
    if (updates.lastName !== undefined) users[idx].lastName = updates.lastName;
    if (updates.firstName !== undefined)
      users[idx].firstName = updates.firstName;
    if (updates.email !== undefined) users[idx].email = updates.email;
    if (updates.phone !== undefined) users[idx].phone = updates.phone;
    users[idx].displayName = (
      users[idx].lastName +
      " " +
      users[idx].firstName
    ).trim();

    this.saveUsers(users);
    this.setCurrentUser(users[idx]);

    return {
      success: true,
      message: "Cập nhật thông tin thành công!",
      user: users[idx],
    };
  },

  /**
   * Đổi mật khẩu
   * @param {string} oldPassword - Mật khẩu cũ
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Object} { success, message }
   */
  updatePassword(oldPassword, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: "Chưa đăng nhập." };

    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx === -1)
      return { success: false, message: "Không tìm thấy tài khoản." };

    // Xác minh mật khẩu cũ
    if (users[idx].password !== oldPassword) {
      return { success: false, message: "Mật khẩu cũ không đúng." };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      };
    }

    users[idx].password = newPassword;
    this.saveUsers(users);

    return { success: true, message: "Đổi mật khẩu thành công!" };
  },

  /**
   * Đăng nhập/Đăng ký bằng Google (Firebase Auth)
   * Nếu email đã tồn tại trong localStorage → đăng nhập luôn
   * Nếu chưa → tạo tài khoản mới từ thông tin Google
   * @param {Object} googleUser - { displayName, email, photoURL, uid }
   * @returns {Object} { success, message, user, isNew }
   */
  loginWithGoogle(googleUser) {
    const users = this.getUsers();
    let user = users.find((u) => u.email === googleUser.email);

    if (user) {
      // Đã có tài khoản → đăng nhập
      user.googleUid = googleUser.uid;
      user.photoURL = googleUser.photoURL || user.photoURL;
      this.saveUsers(users);
      this.setCurrentUser(user);
      return {
        success: true,
        message: "Đăng nhập thành công!",
        user,
        isNew: false,
      };
    }

    // Chưa có → tạo mới
    const nameParts = (googleUser.displayName || "Google User")
      .trim()
      .split(" ");
    const firstName = nameParts.pop();
    const lastName = nameParts.join(" ");

    const newUser = {
      id: Date.now(),
      lastName: lastName,
      firstName: firstName,
      displayName: googleUser.displayName || "Google User",
      email: googleUser.email,
      phone: "",
      password: "",
      googleUid: googleUser.uid,
      photoURL: googleUser.photoURL || "",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return {
      success: true,
      message: "Đăng ký thành công!",
      user: newUser,
      isNew: true,
    };
  },
};

/**
 * Quản lý điểm tích lũy - lưu vào localStorage theo userId
 * Quy tắc: 1.000đ = 1 điểm (tích), 100 điểm = 1.000đ (dùng)
 */
const PointsManager = {
  /**
   * Lấy điểm hiện tại của user đang đăng nhập
   * @returns {number}
   */
  getPoints() {
    const user = UserManager.getCurrentUser();
    if (!user) return 0;
    const allPoints = JSON.parse(localStorage.getItem("gibor_points") || "{}");
    return allPoints[user.id] || 0;
  },

  /**
   * Cập nhật điểm cho user hiện tại
   * @param {number} points - Số điểm mới
   */
  setPoints(points) {
    const user = UserManager.getCurrentUser();
    if (!user) return;
    const allPoints = JSON.parse(localStorage.getItem("gibor_points") || "{}");
    allPoints[user.id] = Math.max(0, Math.floor(points));
    localStorage.setItem("gibor_points", JSON.stringify(allPoints));
  },

  /**
   * Cộng điểm (sau khi thanh toán)
   * @param {number} amount - Tổng tiền đơn hàng (VNĐ)
   * @returns {number} Số điểm được cộng
   */
  earnPoints(amount) {
    const earned = Math.floor(amount / 1000);
    this.setPoints(this.getPoints() + earned);
    return earned;
  },

  /**
   * Trừ điểm (khi sử dụng)
   * @param {number} points - Số điểm muốn dùng
   * @returns {boolean}
   */
  usePoints(points) {
    const current = this.getPoints();
    if (points > current) return false;
    this.setPoints(current - points);
    return true;
  },

  /**
   * Tính số tiền giảm từ điểm
   * @param {number} points - Số điểm dùng
   * @returns {number} Số tiền giảm (VNĐ)
   */
  pointsToMoney(points) {
    return Math.floor(points / 100) * 1000;
  },

  /**
   * Tính số điểm nhận được từ tổng tiền
   * @param {number} amount - Tổng tiền (VNĐ)
   * @returns {number} Số điểm
   */
  moneyToPoints(amount) {
    return Math.floor(amount / 1000);
  },
};

/**
 * Quản lý lịch sử đơn hàng - lưu vào localStorage
 */
const OrderManager = {
  /**
   * Lấy tất cả đơn hàng của user hiện tại
   * @returns {Array}
   */
  getOrders() {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return [];
    const allOrders = JSON.parse(localStorage.getItem("gibor_orders") || "[]");
    return allOrders.filter((o) => o.userId === currentUser.id);
  },

  /**
   * Lưu đơn hàng mới
   * @param {Object} order - { code, items, total, payment, shipping, date }
   */
  saveOrder(order) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) return;

    const allOrders = JSON.parse(localStorage.getItem("gibor_orders") || "[]");
    allOrders.push({
      ...order,
      userId: currentUser.id,
      userName: currentUser.displayName,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("gibor_orders", JSON.stringify(allOrders));
  },
};

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/
