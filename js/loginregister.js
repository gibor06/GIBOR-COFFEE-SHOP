/* 
========================================================================================

                                     CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/

/**
 * loginregister.js - Xử lý logic Đăng nhập & Đăng ký
 *
 * Chức năng:
 *  1. Đăng nhập bằng Email/Password (dùng data.js + localStorage)
 *  2. Đăng ký tài khoản mới bằng Email/Password
 *
 * Lưu ý: File data.js và main.js phải được load trước file này
 */

/* ===== HÀM TIỆN ÍCH ===== */

/**
 * Tìm phần tử DOM theo ID (viết tắt)
 * @param {string} id - ID của phần tử
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

/**
 * Chuyển hướng sau khi đăng nhập thành công (dùng popup thay vì alert)
 */
function redirectAfterLogin() {
  window.location.href = "index.html";
}

/* =============================================================
   TRANG ĐĂNG NHẬP (login.html)
   ============================================================= */
const loginForm = $("loginForm");

if (loginForm) {
  // Xử lý submit form đăng nhập
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    if (!email || !password) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ email và mật khẩu.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    // Nút loading
    const submitBtn = loginForm.querySelector(".form-button-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    // BƯỚC 1: XÁC THỰC VỚI FIREBASE (Ưu tiên Firebase vì có link quên mật khẩu)
    try {
      if (typeof firebase !== "undefined" && firebase.auth) {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // Đăng nhập Firebase THÀNH CÔNG -> Pass này là pass CHUẨN NHẤT
        // Đồng bộ pass về localStorage (lỡ user vừa reset pass qua email)
        const users = UserManager.getUsers();
        if (users.find(u => u.email === email)) {
          UserManager.resetPassword(email, password);
        } else {
          // Lưu pass vào tài khoản mới phòng hờ (như lúc Login bằng Google)
          UserManager.register({
            lastName: "Người dùng",
            firstName: "Firebase",
            email: email,
            phone: "",
            password: password,
          });
        }
      }
    } catch (error) {
      // BƯỚC 2: Rơi rớt (Fallback) - Nếu Firebase không có user này hoặc sai pass
      // Nhưng localStorage lại có? 
      // Chỉ check localStorage nếu user chưa đăng ký Firebase (auth/user-not-found)
      if (error.code !== "auth/user-not-found" && error.code !== "auth/invalid-credential") {
         console.error("Firebase Login Error", error);
      }
    }

    // BƯỚC 3: Xử lý Đăng nhập Local (dùng đúng pass mà chúng ta vừa nhập/hoặc vừa được đồng bộ)
    const result = UserManager.login(email, password);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    if (result.success) {
      showGiborPopup({
        type: "success",
        title: "Đăng nhập thành công!",
        message:
          "Chào mừng " +
          result.user.displayName +
          " quay trở lại GIBOR Coffee!",
        confirmText: "Tiếp tục",
        onConfirm: () => {
          redirectAfterLogin();
        },
      });
    } else {
      showGiborPopup({
        type: "error",
        title: "Đăng nhập thất bại",
        message: result.message,
        confirmText: "Thử lại",
      });
    }
  });
}

/* =============================================================
   TRANG ĐĂNG KÝ (register.html)
   ============================================================= */
const registerForm = $("registerForm");

if (registerForm) {
  // Xử lý submit form đăng ký
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lastName = $("regLastName").value.trim();
    const firstName = $("regFirstName").value.trim();
    const email = $("regEmail").value.trim();
    const phone = $("regPhone").value.trim();
    const password = $("regPassword").value;

    if (!lastName || !firstName || !email || !phone || !password) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ thông tin đăng ký.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    const submitBtn = registerForm.querySelector(".form-button-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo tài khoản...';

    // BƯỚC 0: Kiểm tra email đã tồn tại trong localStorage chưa (kiểm tra trước cả Firebase)
    const users = UserManager.getUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      let errorMsg = "Email đã được dùng để đăng ký.";
      if (existingUser.provider === "google") {
        errorMsg = "Email này đã được đăng ký bằng tài khoản Google. Vui lòng đăng nhập bằng Google.";
      } else if (existingUser.provider === "github") {
        errorMsg = "Email này đã được đăng ký bằng tài khoản GitHub. Vui lòng đăng nhập bằng GitHub.";
      } else {
        errorMsg = "Email đã được dùng để đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.";
      }
      
      showGiborPopup({
        type: "error",
        title: "Email đã tồn tại",
        message: errorMsg,
        confirmText: "Đã hiểu",
      });
      return;
    }

    // BƯỚC 1: Đăng ký trên Firebase (để dùng tính năng Quên Mật Khẩu qua email)
    if (typeof firebase !== "undefined" && firebase.auth) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      } catch (error) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        let msg = "Không thể tạo tài khoản.";
        if (error.code === "auth/email-already-in-use") {
          msg = "Email này đã được đăng ký trên Firebase. Nếu bạn đã đăng ký bằng Google/GitHub, vui lòng đăng nhập bằng phương thức đó.";
        } else if (error.code === "auth/weak-password") {
          msg = "Mật khẩu quá yếu. Tối thiểu 6 ký tự.";
        } else if (error.code === "auth/invalid-email") {
          msg = "Địa chỉ email không hợp lệ.";
        }
        showGiborPopup({
          type: "error",
          title: "Đăng ký thất bại",
          message: msg,
          confirmText: "Thử lại",
        });
        return; // Dừng nếu Firebase lỗi
      }
    }

    // BƯỚC 2: Lưu xuống LocalStorage (dùng chung cho app)
    const result = UserManager.register({
      lastName,
      firstName,
      email,
      phone,
      password,
    });

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    if (result.success) {
      showGiborPopup({
        type: "success",
        title: "Đăng ký thành công!",
        message:
          "Chào mừng " + result.user.displayName + " đến với GIBOR Coffee!",
        confirmText: "Bắt đầu khám phá",
        onConfirm: () => {
          redirectAfterLogin();
        },
      });
    } else {
      showGiborPopup({
        type: "error",
        title: "Đăng ký thất bại",
        message: result.message,
        confirmText: "Thử lại",
      });
    }
  });
}

// Toggle ẩn/hiện mật khẩu
document.addEventListener("DOMContentLoaded", () => {
  // Lấy tất cả nút toggle password trên trang
  const toggleBtns = document.querySelectorAll(".toggle-password");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Tìm ô input cùng nhóm
      const input = btn.parentElement.querySelector(".input-field");
      // Đổi type giữa password <-> text
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      // Đổi icon mắt
      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  });
});

/**
 * Xử lý đăng nhập bằng Google qua Firebase Auth
 * Dùng cho cả trang Login và Register
 */
function handleGoogleSignIn() {
  if (typeof firebase === "undefined" || !firebase.auth) {
    showGiborPopup({
      type: "error",
      title: "Lỗi hệ thống",
      message: "Không thể kết nối Firebase. Vui lòng thử lại sau.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const googleUser = {
        displayName: result.user.displayName || "",
        email: result.user.email || "",
        photoURL: result.user.photoURL || "",
        uid: result.user.uid,
      };

      const loginResult = UserManager.loginWithGoogle(googleUser);

      if (loginResult.success) {
        const welcomeMsg = loginResult.isNew
          ? "Chào mừng " +
            loginResult.user.displayName +
            " đến với GIBOR Coffee!"
          : "Chào mừng " +
            loginResult.user.displayName +
            " quay trở lại GIBOR Coffee!";

        showGiborPopup({
          type: "success",
          title: loginResult.isNew
            ? "Đăng ký thành công!"
            : "Đăng nhập thành công!",
          message: welcomeMsg,
          confirmText: loginResult.isNew ? "Bắt đầu khám phá" : "Tiếp tục",
          onConfirm: () => {
            redirectAfterLogin();
          },
        });
      } else {
        // Trường hợp email đã được đăng ký bằng phương thức khác
        showGiborPopup({
          type: "error",
          title: "Không thể đăng nhập",
          message: loginResult.message,
          confirmText: "Đã hiểu",
        });
      }
    })
    .catch((error) => {
      console.error("Google Sign-In error:", error);

      // Nếu user đóng popup → không hiện lỗi
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      let errorMsg = "Không thể đăng nhập bằng Google. Vui lòng thử lại.";
      if (error.code === "auth/network-request-failed") {
        errorMsg = "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMsg = "Email này đã được liên kết với phương thức đăng nhập khác.";
      }

      showGiborPopup({
        type: "error",
        title: "Đăng nhập Google thất bại",
        message: errorMsg,
        confirmText: "Thử lại",
      });
    });
}

// Gắn sự kiện cho nút Google trên trang Login
const btnGoogleLogin = document.getElementById("btnGoogleLogin");
if (btnGoogleLogin) {
  btnGoogleLogin.addEventListener("click", handleGoogleSignIn);
}

// Gắn sự kiện cho nút Google trên trang Register
const btnGoogleRegister = document.getElementById("btnGoogleRegister");
if (btnGoogleRegister) {
  btnGoogleRegister.addEventListener("click", handleGoogleSignIn);
}
// Gắn sự kiện cho nút GitHub trên trang Register
const btnGithubRegister = document.getElementById("btnGithubRegister");
if (btnGithubRegister) {
  btnGithubRegister.addEventListener("click", handleGithubSignIn);
}

// =================== GitHub sign-in ===================
function handleGithubSignIn() {
  if (typeof firebase === "undefined" || !firebase.auth) {
    showGiborPopup({
      type: "error",
      title: "Lỗi hệ thống",
      message: "Không thể kết nối Firebase. Vui lòng thử lại sau.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  const provider = new firebase.auth.GithubAuthProvider();
  provider.addScope("user:email");

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const githubUser = {
        displayName: result.user.displayName || "",
        email: result.user.email || "",
        photoURL: result.user.photoURL || "",
        uid: result.user.uid,
      };

      const loginResult = UserManager.loginWithGithub(githubUser);

      if (loginResult.success) {
        const welcomeMsg = loginResult.isNew
          ? "Chào mừng " + loginResult.user.displayName + " đến với GIBOR Coffee!"
          : "Chào mừng " + loginResult.user.displayName + " quay trở lại GIBOR Coffee!";

        showGiborPopup({
          type: "success",
          title: loginResult.isNew ? "Đăng ký thành công!" : "Đăng nhập thành công!",
          message: welcomeMsg,
          confirmText: loginResult.isNew ? "Bắt đầu khám phá" : "Tiếp tục",
          onConfirm: () => {
            redirectAfterLogin();
          },
        });
      } else {
        // Trường hợp email đã được đăng ký bằng phương thức khác
        showGiborPopup({
          type: "error",
          title: "Không thể đăng nhập",
          message: loginResult.message,
          confirmText: "Đã hiểu",
        });
      }
    })
    .catch((error) => {
      console.error("GitHub Sign-In error:", error);

      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      let errorMsg = "Không thể đăng nhập bằng GitHub. Vui lòng thử lại.";
      if (error.code === "auth/network-request-failed") {
        errorMsg = "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMsg = "Email này đã được liên kết với phương thức đăng nhập khác.";
      }

      showGiborPopup({
        type: "error",
        title: "Đăng nhập GitHub thất bại",
        message: errorMsg,
        confirmText: "Thử lại",
      });
    });
}

// Gắn sự kiện cho nút GitHub
const btnGithubLogin = document.getElementById("btnGithubLogin");
if (btnGithubLogin) {
  btnGithubLogin.addEventListener("click", handleGithubSignIn);
}
/* =============================================================
   CHỨC NĂNG QUÊN MẬT KHẨU
   - Hiện popup nhập email
   - Gửi email đặt lại mật khẩu qua Firebase Auth
   ============================================================= */

/**
 * Hiện popup nhập email để gửi link đặt lại mật khẩu bằng Firebase
 */
function showForgotPasswordPopup() {
  // Xóa popup cũ nếu có
  const oldOverlay = document.getElementById("forgotPwOverlay");
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement("div");
  overlay.className = "gibor-popup-overlay";
  overlay.id = "forgotPwOverlay";

  overlay.innerHTML =
    '<div class="gibor-popup-box">' +
    '<div class="gibor-popup-icon warning"><i class="fas fa-key"></i></div>' +
    '<div class="gibor-popup-title">Quên mật khẩu?</div>' +
    '<div class="gibor-popup-message">Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</div>' +
    '<div style="margin: 12px 0;">' +
    '<input id="forgotPwEmail" type="email" placeholder="Nhập địa chỉ email..." ' +
    'style="width:100%;padding:10px 14px;border:1.5px solid #ccc;border-radius:8px;font-size:0.95rem;box-sizing:border-box;outline:none;" />' +
    "</div>" +
    '<div class="gibor-popup-actions">' +
    '<button class="gibor-popup-btn secondary" id="forgotPwCancel">Hủy</button>' +
    '<button class="gibor-popup-btn primary" id="forgotPwSubmit"><i class="fas fa-paper-plane"></i> Gửi Email Reset</button>' +
    "</div>" +
    "</div>";

  document.body.appendChild(overlay);

  // Hiện popup với animation
  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  // Focus vào ô email
  setTimeout(() => {
    const emailInput = document.getElementById("forgotPwEmail");
    if (emailInput) emailInput.focus();
  }, 100);

  function closeOverlay() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }

  // Nút hủy
  document.getElementById("forgotPwCancel").addEventListener("click", closeOverlay);

  // Nút gửi
  document.getElementById("forgotPwSubmit").addEventListener("click", () => {
    const email = document.getElementById("forgotPwEmail").value.trim();

    if (!email) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ email.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    // Kiểm tra Firebase
    if (typeof firebase === "undefined" || !firebase.auth) {
      showGiborPopup({
        type: "error",
        title: "Lỗi hệ thống",
        message: "Không thể kết nối Firebase. Vui lòng thử lại sau.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    // Nút loading
    const submitBtn = document.getElementById("forgotPwSubmit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

    // Gửi yêu cầu lấy link thay đổi mật khẩu từ Firebase
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        closeOverlay();
        showGiborPopup({
          type: "success",
          title: "Đã gửi Email!",
          message:
            "Link thay đổi mật khẩu đã được gửi đến hộp thư: <strong>" +
            email +
            "</strong>.<br><br>📝 <i>Lưu ý: Bạn hãy kiểm tra cả thư mục Spam/Junk nhé. Đăng nhập lại bằng mật khẩu mới sau khi thay đổi trên email thành công.</i>",
          confirmText: "Xong",
        });
      })
      .catch((error) => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Email Reset';

        let errorMsg = "Không thể gửi email. Vui lòng thử lại.";
        if (error.code === "auth/user-not-found") {
          errorMsg = "Email này chưa được đăng ký trong hệ thống Firebase.";
        } else if (error.code === "auth/invalid-email") {
          errorMsg = "Địa chỉ email không hợp lệ.";
        }

        showGiborPopup({
          type: "error",
          title: "Lỗi",
          message: errorMsg,
          confirmText: "Đã hiểu",
        });
      });
  });

  // Enter nhấn gửi
  document.getElementById("forgotPwEmail").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("forgotPwSubmit").click();
    }
  });
}

// Gắn sự kiện cho link "Quên mật khẩu?" (id="reset")
const btnForgotPassword = document.getElementById("reset");
if (btnForgotPassword) {
  btnForgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    showForgotPasswordPopup();
  });
}

/* 
========================================================================================

                                    KẾT THÚC CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/