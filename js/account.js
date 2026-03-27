/* 
========================================================================================

                                    CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/
(function () {
  "use strict";

  const root = document.getElementById("accountPageRoot");
  if (!root) return;

  function notifySuccess(title, message, onConfirm) {
    if (typeof showGiborPopup === "function") {
      showGiborPopup({
        type: "success",
        title,
        message,
        confirmText: "OK",
        onConfirm,
      });
      return;
    }
    alert(message);
    if (typeof onConfirm === "function") onConfirm();
  }

  function notifyError(title, message) {
    if (typeof showGiborPopup === "function") {
      showGiborPopup({
        type: "error",
        title,
        message,
        confirmText: "Thử lại",
      });
      return;
    }
    alert(message);
  }

  function formatDate(value) {
    const d = new Date(value || Date.now());
    if (Number.isNaN(d.getTime())) return "Không rõ";
    return d.toLocaleString("vi-VN");
  }

  function parseTabFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "orders") return "orders";
    return "profile";
  }

  function setActivePanel(tab) {
    document.querySelectorAll(".account-menu-btn[data-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    document.querySelectorAll(".account-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === tab);
    });
  }

  function setActiveSubtab(subtab) {
    document.querySelectorAll(".subtab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.subtab === subtab);
    });

    document.querySelectorAll(".subtab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.subpanel === subtab);
    });
  }

  function renderUserHeader(currentUser) {
    const display = document.getElementById("accountDisplayName");
    const email = document.getElementById("accountEmail");
    const avatar = document.getElementById("accountAvatar");

    if (display) display.textContent = currentUser.displayName || "Tài khoản";
    if (email) email.textContent = currentUser.email || "-";

    const initials = (
      (currentUser.lastName ? currentUser.lastName.charAt(0) : "") +
      (currentUser.firstName ? currentUser.firstName.charAt(0) : "")
    ).toUpperCase();
    if (avatar) avatar.textContent = initials || "G";
  }

  function fillProfileForm(currentUser) {
    const lastName = document.getElementById("profileLastName");
    const firstName = document.getElementById("profileFirstName");
    const phone = document.getElementById("profilePhone");
    const email = document.getElementById("profileEmail");

    if (lastName) lastName.value = currentUser.lastName || "";
    if (firstName) firstName.value = currentUser.firstName || "";
    if (phone) phone.value = currentUser.phone || "";
    if (email) email.value = currentUser.email || "";
  }

  function renderOrders() {
    const list = document.getElementById("orderList");
    if (!list) return;

    const orders =
      typeof OrderManager !== "undefined" &&
      typeof OrderManager.getOrders === "function"
        ? OrderManager.getOrders()
        : [];

    if (!orders.length) {
      list.innerHTML =
        '<div class="order-empty"><i class="fas fa-box-open"></i><p>Bạn chưa có đơn hàng nào.</p></div>';
      return;
    }

    const sorted = orders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || Date.now()) -
          new Date(a.createdAt || a.date || Date.now()),
      );

    list.innerHTML = sorted
      .map((order) => {
        const itemRows = (order.items || [])
          .map((item) => {
            const qty = Number(item.quantity || 1);
            const name = item.name || "Sản phẩm";
            return `<li>${qty} x ${name}</li>`;
          })
          .join("");

        const createdLabel = formatDate(order.createdAt || order.date);
        const total = Number(order.total || 0).toLocaleString("vi-VN");
        const code = order.code || "DH" + Date.now();

        return `
          <article class="order-card">
            <div class="order-card-top">
              <div class="order-code">#${code}</div>
              <div class="order-date">${createdLabel}</div>
            </div>
            <ul class="order-items">${itemRows || "<li>Không có chi tiết sản phẩm</li>"}</ul>
            <div class="order-card-foot">
              <span>${order.payment || "Chưa rõ thanh toán"} · ${order.shipping || "Chưa rõ giao hàng"}</span>
              <strong>${total}đ</strong>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function bindTabEvents() {
    document.querySelectorAll(".account-menu-btn[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        setActivePanel(tab);
        const nextURL = `${window.location.pathname}?tab=${tab}`;
        history.replaceState(null, "", nextURL);
      });
    });

    document.querySelectorAll(".subtab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveSubtab(btn.dataset.subtab);
      });
    });
  }

  function bindProfileSave(currentUser) {
    const form = document.getElementById("profileInfoForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const newLastName = document.getElementById("profileLastName").value.trim();
      const newFirstName = document.getElementById("profileFirstName").value.trim();
      const newPhone = document.getElementById("profilePhone").value.trim();
      const newEmail = document.getElementById("profileEmail").value.trim();

      if (!newLastName || !newFirstName || !newEmail) {
        notifyError("Thiếu thông tin", "Vui lòng nhập đầy đủ họ, tên và email.");
        return;
      }

      const emailChanged =
        newEmail.toLowerCase() !== String(currentUser.email || "").toLowerCase();

      const doSave = () => {
        const result = UserManager.updateProfile({
          lastName: newLastName,
          firstName: newFirstName,
          phone: newPhone,
          email: newEmail,
        });

        if (!result.success) {
          notifyError("Cập nhật thất bại", result.message || "Không thể cập nhật thông tin.");
          return;
        }

        notifySuccess("Đã lưu", "Thông tin tài khoản đã được cập nhật.", () => {
          window.location.reload();
        });
      };

      if (emailChanged && typeof showEmailOTPPopup === "function") {
        showEmailOTPPopup(newEmail, doSave);
      } else {
        doSave();
      }
    });
  }

  function bindPasswordSave(currentUser) {
    const form = document.getElementById("profileSecurityForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const oldPassword = document.getElementById("oldPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!oldPassword || !newPassword || !confirmPassword) {
        notifyError("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin đổi mật khẩu.");
        return;
      }

      if (newPassword.length < 6) {
        notifyError("Mật khẩu yếu", "Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }

      if (newPassword !== confirmPassword) {
        notifyError("Không khớp", "Xác nhận mật khẩu mới không trùng khớp.");
        return;
      }

      // Kiểm tra mật khẩu cũ trước khi gửi email
      const users = UserManager.getUsers();
      const user = users.find((u) => u.id === currentUser.id);
      
      if (!user || user.password !== oldPassword) {
        notifyError("Sai mật khẩu", "Mật khẩu hiện tại không đúng. Vui lòng thử lại.");
        return;
      }

      // Lưu thông tin đổi mật khẩu tạm thời vào sessionStorage
      const changePasswordRequest = {
        userId: currentUser.id,
        email: currentUser.email,
        oldPassword: oldPassword,
        newPassword: newPassword,
        timestamp: Date.now(),
        token: generateVerificationToken()
      };
      
      sessionStorage.setItem('gibor_password_change_request', JSON.stringify(changePasswordRequest));

      // Gửi email xác thực qua Firebase
      if (typeof sendPasswordChangeVerificationEmail === "function") {
        sendPasswordChangeVerificationEmail(currentUser.email, changePasswordRequest.token);
      } else {
        // Fallback: Thực hiện đổi mật khẩu trực tiếp
        const result = UserManager.updatePassword(oldPassword, newPassword);
        if (!result.success) {
          notifyError("Đổi mật khẩu thất bại", result.message || "Không thể đổi mật khẩu.");
          return;
        }

        notifySuccess("Thành công", "Bạn đã đổi mật khẩu thành công. Vui lòng đăng nhập lại.", () => {
          form.reset();
          UserManager.logout();
          window.location.href = "login.html";
        });
      }
    });
  }

  function bindLogout() {
    const logoutBtn = document.getElementById("accountLogoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
      if (typeof showGiborPopup === "function") {
        showGiborPopup({
          type: "warning",
          title: "Đăng xuất",
          message: "Bạn có chắc muốn đăng xuất khỏi tài khoản?",
          confirmText: "Đăng xuất",
          cancelText: "Hủy",
          onConfirm: () => {
            UserManager.logout();
            window.location.href = "login.html";
          },
        });
        return;
      }

      if (confirm("Bạn có chắc muốn đăng xuất?")) {
        UserManager.logout();
        window.location.href = "login.html";
      }
    });
  }

  function init() {
    if (typeof UserManager === "undefined") return;

    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      window.location.href = "login.html";
      return;
    }

    // Kiểm tra xem có query param verify_password_change không
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('verify_password_change');
    
    if (verifyToken && typeof verifyAndChangePassword === "function") {
      // Xóa query param khỏi URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Thực hiện xác thực và đổi mật khẩu
      verifyAndChangePassword(verifyToken);
      return;
    }

    renderUserHeader(currentUser);
    fillProfileForm(currentUser);
    renderOrders();

    bindTabEvents();
    bindProfileSave(currentUser);
    bindPasswordSave(currentUser);
    bindLogout();

    setActiveSubtab("info");
    setActivePanel(parseTabFromURL());

    root.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
/* 
========================================================================================

                                    KẾT THÚC CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/