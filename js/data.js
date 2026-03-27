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

    // Kiểm tra email đã tồn tại chưa (bất kể đăng ký bằng cách nào)
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      // Kiểm tra xem tài khoản này đăng ký bằng phương thức nào
      if (existingUser.provider === "google") {
        return { 
          success: false, 
          message: "Email này đã được đăng ký bằng tài khoản Google. Vui lòng đăng nhập bằng Google." 
        };
      } else if (existingUser.provider === "github") {
        return { 
          success: false, 
          message: "Email này đã được đăng ký bằng tài khoản GitHub. Vui lòng đăng nhập bằng GitHub." 
        };
      } else {
        return { 
          success: false, 
          message: "Email đã được dùng để đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác." 
        };
      }
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
      provider: "email", // Đánh dấu đăng ký bằng email/password
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
   * Đặt lại mật khẩu (dành cho Quên mật khẩu)
   * @param {string} email - Email của tài khoản
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Object} { success, message }
   */
  resetPassword(email, newPassword) {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1)
      return { success: false, message: "Email không tồn tại trong hệ thống." };

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      };
    }

    users[idx].password = newPassword;
    this.saveUsers(users);

    return { success: true, message: "Lấy lại mật khẩu thành công!" };
  },

  /**
   * Đăng nhập/Đăng ký bằng Google (Firebase Auth)
   * Kiểm tra email đã tồn tại chưa:
   * - Nếu đã có trong localStorage → đăng nhập (nhưng kiểm tra provider)
   * - Nếu chưa có → tạo tài khoản mới
   * @param {Object} googleUser - { displayName, email, photoURL, uid }
   * @returns {Object} { success, message, user, isNew }
   */
  loginWithGoogle(googleUser) {
    const users = this.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === googleUser.email.toLowerCase());

    if (user) {
      // Email đã tồn tại - kiểm tra provider
      if (user.provider === "email" && !user.googleUid) {
        // Tài khoản đã đăng ký bằng email/password thông thường
        return {
          success: false,
          message: "Email này đã được đăng ký bằng tài khoản thông thường. Vui lòng đăng nhập bằng email và mật khẩu.",
          user: null,
          isNew: false,
        };
      }
      
      // Đã có tài khoản Google hoặc đã liên kết → đăng nhập
      user.googleUid = googleUser.uid;
      user.photoURL = googleUser.photoURL || user.photoURL;
      user.provider = user.provider || "google"; // Cập nhật provider nếu chưa có
      
      // Cập nhật lại thông tin
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        this.saveUsers(users);
      }
      
      this.setCurrentUser(user);
      return {
        success: true,
        message: "Đăng nhập thành công!",
        user,
        isNew: false,
      };
    }

    // Chưa có tài khoản → tạo mới
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
      password: "", // Không có password cho tài khoản Google
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

  /**
   * Đăng nhập/đăng ký bằng GitHub (Firebase Auth)
   * Kiểm tra email đã tồn tại chưa:
   * - Nếu đã có trong localStorage → đăng nhập (nhưng kiểm tra provider)
   * - Nếu chưa có → tạo tài khoản mới
   */
  loginWithGithub(githubUser) {
    const users = this.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === githubUser.email.toLowerCase());

    if (user) {
      // Email đã tồn tại - kiểm tra provider
      if (user.provider === "email" && !user.githubUid) {
        // Tài khoản đã đăng ký bằng email/password thông thường
        return {
          success: false,
          message: "Email này đã được đăng ký bằng tài khoản thông thường. Vui lòng đăng nhập bằng email và mật khẩu.",
          user: null,
          isNew: false,
        };
      }
      
      // Đã có tài khoản GitHub hoặc đã liên kết → đăng nhập
      user.githubUid = githubUser.uid;
      user.photoURL = githubUser.photoURL || user.photoURL;
      user.provider = user.provider || "github"; // Cập nhật provider nếu chưa có
      
      // Cập nhật lại thông tin
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = user;
        this.saveUsers(users);
      }
      
      this.setCurrentUser(user);
      return {
        success: true,
        message: "Đăng nhập thành công!",
        user,
        isNew: false,
      };
    }

    // Chưa có tài khoản tương ứng → tạo mới
    const nameParts = (githubUser.displayName || "GitHub User")
      .trim()
      .split(" ");
    const firstName = nameParts.pop();
    const lastName = nameParts.join(" ");

    const newUser = {
      id: Date.now(),
      lastName: lastName,
      firstName: firstName,
      displayName: githubUser.displayName || "GitHub User",
      email: githubUser.email,
      phone: "",
      password: "", // Không có password cho tài khoản GitHub
      githubUid: githubUser.uid,
      photoURL: githubUser.photoURL || "",
      provider: "github",
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
 * Quy tắc: 1.000đ = 1 điểm (tích), 1 điểm = 10đ (dùng)
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
   * @returns {number} Số tiền giảm (VNĐ) — 1 điểm = 10đ
   */
  pointsToMoney(points) {
    return points * 10;
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
