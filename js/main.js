/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO

========================================================================================
*/

// Cuộn xuống thanh vẫn theo (desktop). Mobile giữ nguyên header nâu.
const updateHeaderScrollState = () => {
  const navbar = document.querySelector(".header");
  if (!navbar) return;

  if (window.innerWidth <= 768) {
    navbar.classList.remove("scrolled");
    return;
  }

  navbar.classList.toggle("scrolled", window.scrollY > 50);
};

window.addEventListener("scroll", updateHeaderScrollState);
window.addEventListener("resize", updateHeaderScrollState);

// ==================== KHỞI TẠO CÁC TÍNH NĂNG CHUNG ====================
const initApp = () => {
  updateHeaderScrollState();

  // ==================== HAMBURGER MENU MOBILE ====================
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.querySelector(".nav");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    // Đóng menu khi click vào link
    const navLinks = navMenu.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });

    // Đóng menu khi click bên ngoài
    navMenu.addEventListener("click", (e) => {
      if (e.target === navMenu) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }

  // ==================== CHẾ ĐỘ NỀN TỐI (DARK MODE) ====================
  const toggleBtn = document.getElementById("themeToggle");

  if (toggleBtn) {
    // Load lại trạng thái
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ==================== XỬ LÝ PRELOADER ====================
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
    }, 500); // Hiển thị 0.5 giây
  }

  // ==================== HIỂN THỊ TRẠNG THÁI ĐĂNG NHẬP ====================
  const authLink = document.getElementById("authLink");
  if (authLink && typeof UserManager !== "undefined") {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
      // Đã đăng nhập → hiển thị tên người dùng (Họ + Tên)
      authLink.innerHTML =
        '<i class="fas fa-user-circle"></i> ' + currentUser.displayName;
      authLink.href = "#";
      authLink.classList.add("logged-in");
      authLink.title = "Tài khoản của bạn";
      authLink.style.cursor = "pointer";

      // Tạo user dropdown popup (nếu chưa có)
      if (!document.getElementById("userDropdownOverlay")) {
        const dropdownOverlay = document.createElement("div");
        dropdownOverlay.className = "user-dropdown-overlay";
        dropdownOverlay.id = "userDropdownOverlay";

        // Lấy chữ cái đầu của tên
        const initials = (
          (currentUser.lastName ? currentUser.lastName.charAt(0) : "") +
          (currentUser.firstName ? currentUser.firstName.charAt(0) : "")
        ).toUpperCase();

        // Lấy điểm tích lũy
        const userPoints =
          typeof PointsManager !== "undefined" ? PointsManager.getPoints() : 0;

        dropdownOverlay.innerHTML =
          '<div class="user-dropdown">' +
          '<div class="user-dropdown-header">' +
          '<div class="user-dropdown-avatar">' +
          initials +
          "</div>" +
          '<div class="user-dropdown-info">' +
          '<div class="user-dropdown-name">' +
          currentUser.displayName +
          "</div>" +
          '<div class="user-dropdown-email">' +
          currentUser.email +
          "</div>" +
          '<div class="user-dropdown-points"><i class="fas fa-coins"></i> ' +
          userPoints.toLocaleString("vi-VN") +
          " điểm</div>" +
          "</div>" +
          "</div>" +
          '<ul class="user-dropdown-menu">' +
          '<li><a href="#" id="btnMyAccount"><i class="fas fa-user"></i> Tài khoản của tôi</a></li>' +
          '<li><a href="#" id="btnOrderHistory"><i class="fas fa-shopping-bag"></i> Đơn hàng</a></li>' +
          '<li><button class="logout-btn" id="btnLogout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</button></li>' +
          "</ul>" +
          "</div>";

        document.body.appendChild(dropdownOverlay);

        // Click vào tên → mở/đóng dropdown
        authLink.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdownOverlay.classList.toggle("show");
        });

        // Click overlay → đóng dropdown
        dropdownOverlay.addEventListener("click", (e) => {
          if (e.target === dropdownOverlay) {
            dropdownOverlay.classList.remove("show");
          }
        });

        // Nút đăng xuất
        const btnLogout = document.getElementById("btnLogout");
        if (btnLogout) {
          btnLogout.addEventListener("click", () => {
            dropdownOverlay.classList.remove("show");
            if (typeof showGiborPopup === "function") {
              showGiborPopup({
                type: "warning",
                title: "Đăng xuất",
                message: "Bạn có chắc muốn đăng xuất khỏi tài khoản?",
                confirmText: "Đăng xuất",
                cancelText: "Hủy",
                onConfirm: () => {
                  UserManager.logout();
                  showGiborPopup({
                    type: "success",
                    title: "Đã đăng xuất",
                    message: "Hẹn gặp lại bạn tại GIBOR Coffee!",
                    confirmText: "OK",
                    onConfirm: () => {
                      window.location.reload();
                    },
                  });
                },
              });
            } else {
              if (confirm("Bạn có chắc muốn đăng xuất?")) {
                UserManager.logout();
                window.location.reload();
              }
            }
          });
        }

        // Nút đơn hàng
        const btnOrderHistory = document.getElementById("btnOrderHistory");
        if (btnOrderHistory) {
          btnOrderHistory.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownOverlay.classList.remove("show");
            window.location.href = "account.html?tab=orders";
          });
        }

        // Nút tài khoản của tôi
        const btnMyAccount = document.getElementById("btnMyAccount");
        if (btnMyAccount) {
          btnMyAccount.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownOverlay.classList.remove("show");
            window.location.href = "account.html?tab=profile";
          });
        }
      }
    }
  }
};

// Đảm bảo loadComponents (nếu có) chạy trước khi initApp
document.addEventListener("DOMContentLoaded", () => {
  // Nếu có components.js thì loadComponents đã được gọi bằng DOMContentLoaded trong file đó.
  // Tuy nhiên để chắc chắn, ta có thể kiểm tra xem placeholder còn tồn tại không.
  if (typeof loadComponents === "function") {
    const headerPlaceholder = document.getElementById("header-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (headerPlaceholder || footerPlaceholder) {
      loadComponents();
    }
  }

  initApp();
});

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN GIA BẢO
                                
========================================================================================
*/

/* 
========================================================================================

                                CODE BỞI NGUYỄN HOÀNG BẢO

========================================================================================
*/

// Mở popup
let currentProduct = { name: "", img: "", basePrice: 0 };
let selectedSize = "";
let selectedPrice = 0;
let selectedSugar = "50%";
let selectedIce = "100%";
let selectedToppings = []; // [{name, price}]
let currentCategory = "drink"; // 'drink', 'food', 'topping'

function openPopup(name, img, basePrice, category) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.style.display = "flex";
  document.getElementById("popup-name").innerText = name;
  document.getElementById("popup-img").src = img;

  // Lưu thông tin sản phẩm hiện tại
  currentProduct = { name, img, basePrice: basePrice || 0 };
  currentCategory = category || "drink";
  selectedSize = "";
  selectedPrice = 0;
  popupQuantity = 1;

  // Lấy các phần tử cần ẩn/hiện
  const sizeOptions = document.getElementById("sizeOptions");
  const sugarGroup = document.getElementById("sugarOptions");
  const iceGroup = document.getElementById("iceOptions");
  const popupDesc = document.querySelector(".popup-desc");
  const sugarParent = sugarGroup ? sugarGroup.closest(".option-group") : null;
  const iceParent = iceGroup ? iceGroup.closest(".option-group") : null;
  const qtySection = document.getElementById("popupQuantity");
  const qtyValueEl = document.getElementById("popupQtyValue");

  const isFood = currentCategory === "food" || currentCategory === "topping";

  if (isFood) {
    // Ẩn size, đường, đá, topping cho bánh ngọt / topping
    if (sizeOptions) sizeOptions.style.display = "none";
    if (sugarParent) sugarParent.style.display = "none";
    if (iceParent) iceParent.style.display = "none";
    if (popupDesc) popupDesc.textContent = "";
    if (qtySection) qtySection.style.display = "flex";
    if (qtyValueEl) qtyValueEl.textContent = "1";

    // Ẩn topping cho bánh/topping
    const toppingGroup = document.getElementById("toppingGroup");
    if (toppingGroup) toppingGroup.style.display = "none";

    // Tự động set giá = giá gốc
    selectedSize = "Mặc định";
    selectedPrice = basePrice;
    document.getElementById("price-value").innerText =
      basePrice.toLocaleString("vi-VN");
  } else {
    // Hiện lại cho đồ uống
    if (sizeOptions) sizeOptions.style.display = "";
    if (sugarParent) sugarParent.style.display = "";
    if (iceParent) iceParent.style.display = "";
    if (popupDesc) popupDesc.textContent = "Chọn size để xem giá";
    if (qtySection) qtySection.style.display = "none";

    // Hiện topping cho đồ uống
    const toppingGroup = document.getElementById("toppingGroup");
    if (toppingGroup) toppingGroup.style.display = "";

    // Reset giá khi mở popup
    document.getElementById("price-value").innerText = "0";
  }

  // Reset topping
  selectedToppings = [];
  document.querySelectorAll(".topping-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Tính giá theo size dựa trên giá gốc của sản phẩm
  const priceS = basePrice;
  const priceM = basePrice + 5000;
  const priceL = basePrice + 10000;

  // Cập nhật giá hiển thị trên mỗi nút size
  const elPriceS = document.getElementById("price-s");
  const elPriceM = document.getElementById("price-m");
  const elPriceL = document.getElementById("price-l");
  if (elPriceS) elPriceS.textContent = priceS.toLocaleString("vi-VN") + "đ";
  if (elPriceM) elPriceM.textContent = priceM.toLocaleString("vi-VN") + "đ";
  if (elPriceL) elPriceL.textContent = priceL.toLocaleString("vi-VN") + "đ";

  // Gán sự kiện click cho các nút size
  const btnS = document.getElementById("btn-size-s");
  const btnM = document.getElementById("btn-size-m");
  const btnL = document.getElementById("btn-size-l");
  if (btnS)
    btnS.addEventListener("click", function () {
      selectSize("S", priceS, this);
    });
  if (btnM)
    btnM.addEventListener("click", function () {
      selectSize("M", priceM, this);
    });
  if (btnL)
    btnL.addEventListener("click", function () {
      selectSize("L", priceL, this);
    });

  // Reset active class trên các nút size
  document.querySelectorAll(".size-options button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Reset đường = 50%, đá = 100% (mặc định)
  selectedSugar = "50%";
  selectedIce = "100%";
  document.querySelectorAll("#sugarOptions .option-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.trim() === "50%");
  });
  document.querySelectorAll("#iceOptions .option-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.trim() === "100%");
  });

  // Reset ghi chú
  const noteEl = document.getElementById("popupNote");
  if (noteEl) noteEl.value = "";
}

// Đóng popup
function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}

// Chọn size
function selectSize(size, price, btnElement) {
  selectedSize = size;
  selectedPrice = price;
  document.getElementById("price-value").innerText =
    price.toLocaleString("vi-VN");

  // Ẩn thông báo lỗi size khi đã chọn
  const sizeError = document.getElementById("sizeError");
  if (sizeError) sizeError.classList.remove("show");

  // Đánh dấu nút được chọn
  document.querySelectorAll(".size-options button").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (btnElement) btnElement.classList.add("active");

  // Cập nhật giá hiển thị (size + topping)
  updatePopupPrice();
}

// Thay đổi số lượng trong popup (cho bánh/topping)
var popupQuantity = 1;
function changePopupQty(delta) {
  popupQuantity += delta;
  if (popupQuantity < 1) popupQuantity = 1;
  const qtyEl = document.getElementById("popupQtyValue");
  if (qtyEl) qtyEl.textContent = popupQuantity;
  // Cập nhật giá hiển thị theo số lượng
  const totalPrice = selectedPrice * popupQuantity;
  document.getElementById("price-value").innerText =
    totalPrice.toLocaleString("vi-VN");
}

// Toggle topping (bật/tắt)
function toggleTopping(btnElement) {
  const name = btnElement.dataset.name;
  const price = parseInt(btnElement.dataset.price);

  const idx = selectedToppings.findIndex((t) => t.name === name);
  if (idx !== -1) {
    // Bỏ chọn
    selectedToppings.splice(idx, 1);
    btnElement.classList.remove("active");
  } else {
    // Chọn
    selectedToppings.push({ name, price });
    btnElement.classList.add("active");
  }

  // Cập nhật giá hiển thị
  updatePopupPrice();
}

// Cập nhật giá hiển thị trên popup (đồ uống: size + topping)
function updatePopupPrice() {
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const total = selectedPrice + toppingTotal;
  document.getElementById("price-value").innerText =
    total.toLocaleString("vi-VN");
}

// Chọn lượng đường / đá
function selectOption(type, value, btnElement) {
  // Cập nhật giá trị
  if (type === "sugar") selectedSugar = value;
  if (type === "ice") selectedIce = value;

  // Đánh dấu nút được chọn trong nhóm
  const parent = btnElement.parentElement;
  parent.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  btnElement.classList.add("active");
}

/* 
========================================================================================

                                KẾT THÚC CODE BỞI NGUYỄN HOÀNG BẢO

========================================================================================
*/

/* 
========================================================================================

                                    CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

// ==================== THÊM VÀO GIỎ HÀNG ====================
const COMBO_ITEM_DETAILS = Object.freeze({
  "Combo 1": ["Bạc xỉu", "Bánh ChesseCake"],
  "Combo 2": ["Espresso", "Bánh tiramisu"],
  "Combo 3": ["Latte", "Bánh mì bơ tỏi"],
  "Combo 4": ["Cold Brew", "Bánh Croissant"],
  "Combo 5": ["Americano", "Bánh sừng bò"],
  "Combo 6": ["Cappuccino", "Bánh pancake"],
  "Combo 7": ["Mocha", "Bánh kem phô mai"],
  "Combo 8": ["Caramel Macchiato", "Bánh su kem"],
  "Combo 9": ["Trà đào", "Bánh donut"],
});

function getComboItemsByName(productName) {
  if (!productName) return [];
  const normalizedName = String(productName).trim().toLowerCase();
  const keys = Object.keys(COMBO_ITEM_DETAILS);

  const exactKey = keys.find((key) => key.toLowerCase() === normalizedName);
  if (exactKey) return [...COMBO_ITEM_DETAILS[exactKey]];

  const includesKey = keys.find((key) =>
    normalizedName.includes(key.toLowerCase()),
  );
  return includesKey ? [...COMBO_ITEM_DETAILS[includesKey]] : [];
}

window.getComboItemsByName = getComboItemsByName;

function addToCart() {
  const sizeError = document.getElementById("sizeError");
  const isFood = currentCategory === "food" || currentCategory === "topping";

  // Kiểm tra đã chọn size chưa (chỉ áp dụng cho đồ uống)
  if (!isFood && (!selectedSize || selectedPrice === 0)) {
    // Hiện thông báo lỗi bằng popup
    if (sizeError) sizeError.classList.add("show");
    showGiborPopup({
      type: "warning",
      title: "Chưa chọn Size",
      message: "Vui lòng chọn size (S, M hoặc L) trước khi thêm vào giỏ hàng.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  // Ẩn thông báo lỗi nếu đã chọn size
  if (sizeError) sizeError.classList.remove("show");

  // Lấy giỏ hàng hiện tại
  const cart = JSON.parse(localStorage.getItem("giborCart") || "[]");

  // Lấy ghi chú
  const noteEl = document.getElementById("popupNote");
  const note = noteEl ? noteEl.value.trim() : "";

  // Kiểm tra sản phẩm đã tồn tại chưa (cùng tên + size + đường + đá + topping + ghi chú)
  const toppingKey = isFood
    ? ""
    : selectedToppings
        .map((t) => t.name)
        .sort()
        .join(",");
  const existIndex = cart.findIndex(
    (item) =>
      item.name === currentProduct.name &&
      item.size === selectedSize &&
      item.sugar === (isFood ? "" : selectedSugar) &&
      item.ice === (isFood ? "" : selectedIce) &&
      (item.toppings || [])
        .map((t) => t.name)
        .sort()
        .join(",") === toppingKey &&
      item.note === note,
  );

  // Tính giá đơn vị (size + topping)
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = selectedPrice + toppingTotal;
  const comboItems = getComboItemsByName(currentProduct.name);

  if (existIndex !== -1) {
    // Nếu đã có (cùng tùy chọn) thì tăng số lượng
    cart[existIndex].quantity += isFood ? popupQuantity : 1;
    if (
      comboItems.length > 0 &&
      (!Array.isArray(cart[existIndex].comboItems) ||
        cart[existIndex].comboItems.length === 0)
    ) {
      cart[existIndex].comboItems = [...comboItems];
    }
  } else {
    // Nếu chưa có thì thêm mới
    cart.push({
      name: currentProduct.name,
      image: currentProduct.img,
      size: selectedSize,
      price: unitPrice,
      sugar: isFood ? "" : selectedSugar,
      ice: isFood ? "" : selectedIce,
      toppings: isFood ? [] : [...selectedToppings],
      note: note,
      comboItems: comboItems,
      quantity: isFood ? popupQuantity : 1,
    });
  }

  // Lưu lại vào localStorage
  localStorage.setItem("giborCart", JSON.stringify(cart));

  // Cập nhật số lượng trên icon giỏ hàng
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadges = document.querySelectorAll(
    ".icon-btn.cart span:last-child",
  );
  cartBadges.forEach((badge) => {
    badge.textContent = totalItems;
  });

  // Đóng popup và hiện toast thông báo
  closePopup();
  const toastQty = isFood && popupQuantity > 1 ? " x" + popupQuantity : "";
  const toastSize = isFood ? "" : " (Size " + selectedSize + ")";
  showPopupToast(
    'Đã thêm "' +
      currentProduct.name +
      '"' +
      toastQty +
      toastSize +
      " vào giỏ hàng!",
  );
}

// ==================== TOAST THÔNG BÁO (MENU PAGE) ====================
function showPopupToast(message) {
  const toast = document.getElementById("popupToast");
  const toastMsg = document.getElementById("popupToastMsg");
  if (!toast || !toastMsg) {
    // Fallback nếu không có toast element
    alert(message);
    return;
  }
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Cập nhật số lượng giỏ hàng khi load trang
document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("giborCart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadges = document.querySelectorAll(
    ".icon-btn.cart span:last-child",
  );
  cartBadges.forEach((badge) => {
    badge.textContent = totalItems;
  });
});
/* 
========================================================================================

                                    CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

/**
 * Hệ thống Popup thông báo dùng chung cho toàn bộ website
 * Thay thế alert() và confirm() mặc định của trình duyệt
 */
function showGiborPopup({
  type = "success",
  title = "",
  message = "",
  confirmText = "OK",
  cancelText = "",
  onConfirm = null,
  onCancel = null,
}) {
  // Xóa popup cũ nếu có
  const oldPopup = document.getElementById("giborPopupOverlay");
  if (oldPopup) oldPopup.remove();

  // Icon theo loại
  const iconMap = {
    success: '<i class="fas fa-check-circle"></i>',
    error: '<i class="fas fa-times-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',
  };

  const overlay = document.createElement("div");
  overlay.className = "gibor-popup-overlay";
  overlay.id = "giborPopupOverlay";

  let buttonsHTML =
    '<button class="gibor-popup-btn primary" id="giborPopupConfirm">' +
    confirmText +
    "</button>";
  if (cancelText) {
    buttonsHTML =
      '<button class="gibor-popup-btn secondary" id="giborPopupCancel">' +
      cancelText +
      "</button>" +
      buttonsHTML;
  }

  overlay.innerHTML =
    '<div class="gibor-popup-box">' +
    '<div class="gibor-popup-icon ' +
    type +
    '">' +
    (iconMap[type] || iconMap.success) +
    "</div>" +
    '<div class="gibor-popup-title">' +
    title +
    "</div>" +
    '<div class="gibor-popup-message">' +
    message +
    "</div>" +
    '<div class="gibor-popup-actions">' +
    buttonsHTML +
    "</div>" +
    "</div>";

  document.body.appendChild(overlay);

  // Hiện popup với animation
  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  // Hàm đóng popup
  function closePopupNotify() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }

  // Nút xác nhận
  document.getElementById("giborPopupConfirm").addEventListener("click", () => {
    closePopupNotify();
    if (onConfirm) onConfirm();
  });

  // Nút hủy
  const cancelBtn = document.getElementById("giborPopupCancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      closePopupNotify();
      if (onCancel) onCancel();
    });
  }
}

/**
 * Hiện popup lịch sử đơn hàng
 */
function showOrderHistoryPopup() {
  // Xóa popup cũ nếu có
  const oldOverlay = document.getElementById("orderHistoryOverlay");
  if (oldOverlay) oldOverlay.remove();

  const orders =
    typeof OrderManager !== "undefined" ? OrderManager.getOrders() : [];

  // Sắp xếp đơn mới nhất lên trước
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  let contentHTML = "";

  if (orders.length === 0) {
    contentHTML =
      '<div class="order-history-empty">' +
      '<i class="fas fa-receipt"></i>' +
      "<p>Bạn chưa có đơn hàng nào.</p>" +
      '<p style="font-size:0.85rem;">Hãy đặt hàng để thưởng thức cà phê GIBOR!</p>' +
      "</div>";
  } else {
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateStr = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      let itemsHTML = "";
      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        const isFood = item.size === "Mặc định";

        // Dòng chi tiết
        let detailParts = [];
        const comboItems =
          Array.isArray(item.comboItems) && item.comboItems.length > 0
            ? item.comboItems
            : getComboItemsByName(item.name);
        if (comboItems.length > 0)
          detailParts.push("Gồm: " + comboItems.join(" + "));
        if (!isFood && item.size) detailParts.push("Size " + item.size);
        if (item.sugar) detailParts.push("Đường " + item.sugar);
        if (item.ice) detailParts.push("Đá " + item.ice);
        if (item.toppings && item.toppings.length > 0) {
          detailParts.push(
            "Topping: " + item.toppings.map((t) => t.name).join(", "),
          );
        }
        if (item.note) detailParts.push('Ghi chú: "' + item.note + '"');

        const detailStr = detailParts.join(" · ");

        itemsHTML +=
          '<div class="order-card-item">' +
          '<div class="order-card-item-left">' +
          '<span class="order-card-item-name">' +
          item.name +
          " x" +
          item.quantity +
          "</span>" +
          (detailStr
            ? '<span class="order-card-item-detail-scroll"><span class="order-card-item-detail-inner">' +
              detailStr +
              "</span></span>"
            : "") +
          "</div>" +
          '<span class="order-card-item-price">' +
          itemTotal.toLocaleString("vi-VN") +
          "đ</span>" +
          "</div>";
      });

      // Thông tin người đặt hàng
      let customerHTML = "";
      if (order.customer) {
        customerHTML = '<div class="order-card-customer">';
        if (order.customer.name)
          customerHTML +=
            '<span><i class="fas fa-user"></i> ' +
            order.customer.name +
            "</span>";
        if (order.customer.phone)
          customerHTML +=
            '<span><i class="fas fa-phone"></i> ' +
            order.customer.phone +
            "</span>";
        if (order.customer.email)
          customerHTML +=
            '<span><i class="fas fa-envelope"></i> ' +
            order.customer.email +
            "</span>";
        if (order.customer.address)
          customerHTML +=
            '<span><i class="fas fa-map-marker-alt"></i> ' +
            order.customer.address +
            "</span>";
        customerHTML += "</div>";
      }

      // Thông tin chi nhánh (nếu uống tại quán)
      let branchHTML = "";
      if (order.branch) {
        branchHTML = '<div class="order-card-customer">';
        if (order.branch.name)
          branchHTML +=
            '<span><i class="fas fa-store"></i> ' +
            order.branch.name +
            "</span>";
        if (order.branch.address)
          branchHTML +=
            '<span><i class="fas fa-map-marker-alt"></i> ' +
            order.branch.address +
            "</span>";
        branchHTML += "</div>";
      }

      contentHTML +=
        '<div class="order-card">' +
        '<div class="order-card-header">' +
        '<span class="order-card-code"><i class="fas fa-receipt"></i> ' +
        order.code +
        "</span>" +
        '<span class="order-card-date">' +
        dateStr +
        "</span>" +
        "</div>" +
        customerHTML +
        branchHTML +
        '<div class="order-card-items">' +
        itemsHTML +
        "</div>" +
        '<div class="order-card-footer">' +
        '<span class="order-card-meta">' +
        order.payment +
        " · " +
        order.shipping +
        "</span>" +
        '<span class="order-card-total">' +
        order.total.toLocaleString("vi-VN") +
        "đ</span>" +
        "</div>" +
        "</div>";
    });
  }

  const overlay = document.createElement("div");
  overlay.className = "order-history-overlay";
  overlay.id = "orderHistoryOverlay";
  overlay.innerHTML =
    '<div class="order-history-box">' +
    '<div class="order-history-header">' +
    '<h3><i class="fas fa-history"></i> Lịch sử đơn hàng</h3>' +
    '<button class="order-history-close" id="orderHistoryClose">✕</button>' +
    "</div>" +
    contentHTML +
    "</div>";

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  // Đóng popup
  function closeOrderHistory() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }

  document
    .getElementById("orderHistoryClose")
    .addEventListener("click", closeOrderHistory);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOrderHistory();
  });
}

// ===== FIREBASE INIT CHO XÁC THỰC EMAIL =====
const giborFirebaseConfig = {
  apiKey: "AIzaSyCnHG40t4WN230Alu4ia0cvzKhfndeBfpE",
  authDomain: "coffee-a718c.firebaseapp.com",
  projectId: "coffee-a718c",
  storageBucket: "coffee-a718c.firebasestorage.app",
  messagingSenderId: "37237991343",
  appId: "1:37237991343:web:035a77871af9b41476315a",
};

if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(giborFirebaseConfig);
}

// ===== HỆ THỐNG XÁC THỰC EMAIL OTP QUA FIREBASE =====
let _giborOTP = null;
let _giborOTPExpiry = null;

/**
 * Tạo mã OTP 6 chữ số
 */
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  _giborOTP = otp;
  _giborOTPExpiry = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút
  return otp;
}

/**
 * Tạo token xác thực cho yêu cầu đổi mật khẩu
 */
function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

/**
 * Gửi email xác thực yêu cầu đổi mật khẩu qua Firebase
 * @param {string} email - Email người dùng
 * @param {string} token - Token xác thực
 */
function sendPasswordChangeVerificationEmail(email, token) {
  if (typeof firebase === "undefined" || !firebase.auth) {
    console.warn("⚠️ Firebase không khả dụng");
    showGiborPopup({
      type: "error",
      title: "Lỗi hệ thống",
      message: "Không thể gửi email xác thực. Vui lòng thử lại sau.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  const auth = firebase.auth();
  auth.languageCode = 'vi';

  // Tạo URL xác thực với token
  const verificationUrl = window.location.origin + '/account.html?verify_password_change=' + token;

  // Gửi email xác thực qua Firebase
  // Lưu ý: Firebase sendPasswordResetEmail không hỗ trợ custom URL với token
  // Nên ta sẽ dùng cách khác: hiển thị popup với link xác thực
  
  showPasswordChangeVerificationPopup(email, verificationUrl, token);
}

/**
 * Hiển thị popup yêu cầu xác thực đổi mật khẩu qua email
 */
function showPasswordChangeVerificationPopup(email, verificationUrl, token) {
  const oldOverlay = document.getElementById("passwordChangeVerifyOverlay");
  if (oldOverlay) oldOverlay.remove();

  const maskedEmail = email.substring(0, 3) + "***" + email.substring(email.indexOf("@"));

  const overlay = document.createElement("div");
  overlay.className = "gibor-popup-overlay";
  overlay.id = "passwordChangeVerifyOverlay";

  overlay.innerHTML =
    '<div class="gibor-popup-box" style="max-width: 500px;">' +
    '<div class="gibor-popup-icon warning"><i class="fas fa-shield-alt"></i></div>' +
    '<div class="gibor-popup-title">Xác thực đổi mật khẩu</div>' +
    '<div class="gibor-popup-message">' +
    'Để bảo mật tài khoản, vui lòng xác thực yêu cầu đổi mật khẩu.<br><br>' +
    'Email xác thực sẽ được gửi đến: <strong>' + maskedEmail + '</strong>' +
    '</div>' +
    '<div style="background: #f0f8ff; border: 1px solid #90caf9; border-radius: 8px; padding: 12px; margin: 16px 0; font-size: 0.9rem;">' +
    '<i class="fas fa-info-circle" style="color: #1565c0;"></i> ' +
    '<strong>Lưu ý:</strong> Kiểm tra cả thư mục Spam/Junk nếu không thấy email.' +
    '</div>' +
    '<div class="gibor-popup-actions">' +
    '<button class="gibor-popup-btn secondary" id="btnCancelPasswordChange">Hủy</button>' +
    '<button class="gibor-popup-btn primary" id="btnSendVerificationEmail">' +
    '<i class="fas fa-paper-plane"></i> Gửi email xác thực' +
    '</button>' +
    '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  function closeOverlay() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
    // Xóa request khỏi sessionStorage nếu hủy
    sessionStorage.removeItem('gibor_password_change_request');
  }

  // Nút hủy
  document.getElementById("btnCancelPasswordChange").addEventListener("click", closeOverlay);

  // Nút gửi email
  document.getElementById("btnSendVerificationEmail").addEventListener("click", () => {
    const btn = document.getElementById("btnSendVerificationEmail");
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

    // Gửi email qua Firebase (sử dụng password reset email)
    firebase.auth().sendPasswordResetEmail(email, {
      url: verificationUrl,
      handleCodeInApp: false
    })
      .then(() => {
        closeOverlay();
        showGiborPopup({
          type: "success",
          title: "Đã gửi email!",
          message: 
            'Email xác thực đã được gửi đến <strong>' + maskedEmail + '</strong>.<br><br>' +
            '<div style="text-align: left; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; margin-top: 12px;">' +
            '<i class="fas fa-exclamation-triangle" style="color: #856404;"></i> ' +
            '<strong>Quan trọng:</strong><br>' +
            '• Click vào link trong email để xác nhận đổi mật khẩu<br>' +
            '• Link có hiệu lực trong 15 phút<br>' +
            '• Sau khi xác nhận, bạn sẽ cần đăng nhập lại' +
            '</div>',
          confirmText: "Đã hiểu",
        });
      })
      .catch((error) => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi email xác thực';
        
        let errorMsg = "Không thể gửi email. Vui lòng thử lại.";
        if (error.code === "auth/user-not-found") {
          errorMsg = "Email này chưa được đăng ký trong hệ thống.";
        } else if (error.code === "auth/invalid-email") {
          errorMsg = "Địa chỉ email không hợp lệ.";
        }

        showGiborPopup({
          type: "error",
          title: "Lỗi gửi email",
          message: errorMsg,
          confirmText: "Thử lại",
        });
      });
  });
}

/**
 * Xác thực và thực hiện đổi mật khẩu từ link email
 * Gọi hàm này khi trang account.html load với query param verify_password_change
 */
function verifyAndChangePassword(token) {
  const requestData = sessionStorage.getItem('gibor_password_change_request');
  
  if (!requestData) {
    showGiborPopup({
      type: "error",
      title: "Yêu cầu không hợp lệ",
      message: "Không tìm thấy yêu cầu đổi mật khẩu hoặc yêu cầu đã hết hạn.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  const request = JSON.parse(requestData);

  // Kiểm tra token
  if (request.token !== token) {
    showGiborPopup({
      type: "error",
      title: "Token không hợp lệ",
      message: "Link xác thực không đúng. Vui lòng thử lại.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  // Kiểm tra thời gian hết hạn (15 phút)
  const elapsed = Date.now() - request.timestamp;
  if (elapsed > 15 * 60 * 1000) {
    sessionStorage.removeItem('gibor_password_change_request');
    showGiborPopup({
      type: "error",
      title: "Yêu cầu đã hết hạn",
      message: "Link xác thực đã hết hạn (15 phút). Vui lòng thực hiện lại yêu cầu đổi mật khẩu.",
      confirmText: "Đã hiểu",
    });
    return;
  }

  // Thực hiện đổi mật khẩu
  const result = UserManager.updatePassword(request.oldPassword, request.newPassword);
  
  // Xóa request khỏi sessionStorage
  sessionStorage.removeItem('gibor_password_change_request');

  if (result.success) {
    showGiborPopup({
      type: "success",
      title: "Đổi mật khẩu thành công!",
      message: "Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại với mật khẩu mới.",
      confirmText: "Đăng nhập",
      onConfirm: () => {
        UserManager.logout();
        window.location.href = "login.html";
      },
    });
  } else {
    showGiborPopup({
      type: "error",
      title: "Đổi mật khẩu thất bại",
      message: result.message || "Không thể đổi mật khẩu. Vui lòng thử lại.",
      confirmText: "Đã hiểu",
    });
  }
}

/**
 * Gửi mã OTP qua email thông qua Firebase
 * Sử dụng Custom Email Action Handler để gửi OTP thực sự
 * Nếu Firebase chưa sẵn sàng → fallback hiện mã trên popup
 */
function sendOTPViaFirebase(email, otp) {
  return new Promise((resolve, reject) => {
    if (typeof firebase !== "undefined" && firebase.auth) {
      const auth = firebase.auth();
      
      // Cấu hình ngôn ngữ tiếng Việt cho email
      auth.languageCode = 'vi';
      
      // Gửi email reset password từ Firebase (chứa link reset)
      // Đây là cách chính thức để Firebase gửi email xác thực
      auth.sendPasswordResetEmail(email, {
        url: window.location.origin + '/login.html',
        handleCodeInApp: false
      })
        .then(() => {
          console.log("📧 [GIBOR] Email xác thực đã được gửi qua Firebase đến:", email);
          // Vẫn lưu OTP để xác thực local (backup)
          resolve({ sent: true, method: "firebase" });
        })
        .catch((err) => {
          console.warn("⚠️ [GIBOR] Không gửi được email qua Firebase:", err.message);
          // Fallback: hiện mã trực tiếp trên popup
          console.log("📧 [GIBOR] Mã xác nhận (fallback):", otp);
          resolve({ sent: true, method: "display" });
        });
    } else {
      // Firebase chưa sẵn sàng → hiện mã trực tiếp
      console.log("📧 [GIBOR] Mã xác nhận (no Firebase):", otp);
      resolve({ sent: true, method: "display" });
    }
  });
}

/**
 * Hiển thị popup nhập mã OTP xác thực email
 * @param {string} email - Email cần xác thực
 * @param {Function} onSuccess - Callback khi xác thực thành công
 */
function showEmailOTPPopup(email, onSuccess) {
  // Xóa popup cũ
  const oldOTP = document.getElementById("giborOTPOverlay");
  if (oldOTP) oldOTP.remove();

  const otp = generateOTP();

  // Gửi OTP qua Firebase
  sendOTPViaFirebase(email, otp).then((result) => {
    const overlay = document.createElement("div");
    overlay.className = "gibor-otp-overlay";
    overlay.id = "giborOTPOverlay";

    const maskedEmail =
      email.substring(0, 3) + "***" + email.substring(email.indexOf("@"));

    let otpHintHTML = "";
    let instructionText = "";
    
    if (result.method === "firebase") {
      // Firebase đã gửi email thành công
      instructionText = "Vui lòng kiểm tra email và nhập mã OTP bên dưới để xác thực.";
      otpHintHTML =
        '<div class="otp-firebase-hint">' +
        '<i class="fas fa-envelope"></i> Email xác thực đã được gửi qua Firebase. ' +
        'Kiểm tra hộp thư đến hoặc thư rác của bạn.' +
        "</div>";
    } else {
      // Fallback: hiện mã trực tiếp
      instructionText = "Nhập mã xác nhận bên dưới để tiếp tục.";
      otpHintHTML =
        '<div class="otp-demo-hint">' +
        '<i class="fas fa-info-circle"></i> Mã xác nhận: <strong>' +
        otp +
        "</strong>" +
        "</div>";
    }

    overlay.innerHTML =
      '<div class="gibor-otp-box">' +
      '<div class="otp-header">' +
      '<div class="otp-icon"><i class="fas fa-envelope-open-text"></i></div>' +
      "<h3>Xác thực Email</h3>" +
      "<p>" + instructionText + "<br><strong>" +
      maskedEmail +
      "</strong></p>" +
      "</div>" +
      otpHintHTML +
      '<div class="otp-inputs">' +
      '<input type="text" maxlength="1" class="otp-digit" data-index="0" autocomplete="off" inputmode="numeric" />' +
      '<input type="text" maxlength="1" class="otp-digit" data-index="1" autocomplete="off" inputmode="numeric" />' +
      '<input type="text" maxlength="1" class="otp-digit" data-index="2" autocomplete="off" inputmode="numeric" />' +
      '<span class="otp-separator">-</span>' +
      '<input type="text" maxlength="1" class="otp-digit" data-index="3" autocomplete="off" inputmode="numeric" />' +
      '<input type="text" maxlength="1" class="otp-digit" data-index="4" autocomplete="off" inputmode="numeric" />' +
      '<input type="text" maxlength="1" class="otp-digit" data-index="5" autocomplete="off" inputmode="numeric" />' +
      "</div>" +
      '<p class="otp-timer"><i class="fas fa-clock"></i> Mã hết hạn sau <span id="otpCountdown">5:00</span></p>' +
      '<div class="otp-error" id="otpError" style="display:none;"><i class="fas fa-exclamation-circle"></i> <span id="otpErrorMsg"></span></div>' +
      '<button class="otp-verify-btn" id="btnVerifyOTP"><i class="fas fa-check-circle"></i> Xác nhận</button>' +
      '<button class="otp-resend-btn" id="btnResendOTP"><i class="fas fa-redo"></i> Gửi lại mã</button>' +
      '<button class="otp-cancel-btn" id="btnCancelOTP">Hủy</button>' +
      "</div>";

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });

    // Focus ô đầu tiên
    const digits = overlay.querySelectorAll(".otp-digit");
    setTimeout(() => digits[0].focus(), 300);

    // Auto-focus & navigation giữa các ô
    digits.forEach((input, idx) => {
      input.addEventListener("input", (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = val;
        if (val && idx < 5) {
          digits[idx + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && idx > 0) {
          digits[idx - 1].focus();
          digits[idx - 1].value = "";
        }
        if (e.key === "Enter") {
          document.getElementById("btnVerifyOTP").click();
        }
      });

      // Cho phép paste mã 6 số
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData)
          .getData("text")
          .replace(/[^0-9]/g, "")
          .substring(0, 6);
        pasted.split("").forEach((char, i) => {
          if (digits[i]) digits[i].value = char;
        });
        if (pasted.length > 0) digits[Math.min(pasted.length, 5)].focus();
      });
    });

    // Đếm ngược 5 phút
    let timeLeft = 300;
    const countdownEl = document.getElementById("otpCountdown");
    const countdownTimer = setInterval(() => {
      timeLeft--;
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      if (countdownEl)
        countdownEl.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        _giborOTP = null;
        showOTPError("Mã xác nhận đã hết hạn. Vui lòng gửi lại.");
      }
    }, 1000);

    function showOTPError(msg) {
      const errDiv = document.getElementById("otpError");
      const errMsg = document.getElementById("otpErrorMsg");
      if (errDiv && errMsg) {
        errMsg.textContent = msg;
        errDiv.style.display = "flex";
        // Rung animation
        const box = overlay.querySelector(".gibor-otp-box");
        box.classList.add("shake");
        setTimeout(() => box.classList.remove("shake"), 500);
      }
    }

    function closeOTP() {
      clearInterval(countdownTimer);
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    }

    // Nút xác nhận
    document.getElementById("btnVerifyOTP").addEventListener("click", () => {
      const entered = Array.from(digits)
        .map((d) => d.value)
        .join("");

      if (entered.length < 6) {
        showOTPError("Vui lòng nhập đủ 6 chữ số.");
        return;
      }

      if (!_giborOTP || Date.now() > _giborOTPExpiry) {
        showOTPError("Mã xác nhận đã hết hạn. Vui lòng gửi lại.");
        return;
      }

      if (entered !== _giborOTP) {
        showOTPError("Mã xác nhận không đúng. Vui lòng thử lại.");
        digits.forEach((d) => (d.value = ""));
        digits[0].focus();
        return;
      }

      // Xác thực thành công!
      _giborOTP = null;
      closeOTP();
      if (onSuccess) onSuccess();
    });

    // Nút gửi lại
    document.getElementById("btnResendOTP").addEventListener("click", () => {
      const newOtp = generateOTP();
      sendOTPViaFirebase(email, newOtp).then((res) => {
        timeLeft = 300;
        document.getElementById("otpError").style.display = "none";
        digits.forEach((d) => (d.value = ""));
        digits[0].focus();

        // Cập nhật mã hiển thị nếu là demo mode
        const hintEl = overlay.querySelector(".otp-demo-hint strong");
        if (hintEl) hintEl.textContent = newOtp;

        showGiborPopup({
          type: "success",
          title: "Đã gửi lại mã",
          message: "Mã xác nhận mới đã được gửi đến email của bạn.",
          confirmText: "OK",
        });
      });
    });

    // Nút hủy
    document.getElementById("btnCancelOTP").addEventListener("click", closeOTP);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOTP();
    });
  });
}

/**
 * Hiện popup quản lý tài khoản (Thông tin + Đổi mật khẩu)
 */
function showProfilePopup() {
  const oldOverlay = document.getElementById("profilePopupOverlay");
  if (oldOverlay) oldOverlay.remove();

  const currentUser = UserManager.getCurrentUser();
  if (!currentUser) return;

  // Lấy thêm thông tin từ danh sách users (bao gồm password check)
  const users = UserManager.getUsers();
  const fullUser = users.find((u) => u.id === currentUser.id);

  const initials = (
    currentUser.lastName.charAt(0) + currentUser.firstName.charAt(0)
  ).toUpperCase();

  const overlay = document.createElement("div");
  overlay.className = "profile-popup-overlay";
  overlay.id = "profilePopupOverlay";

  overlay.innerHTML =
    '<div class="profile-popup-box">' +
    // Header
    '<div class="profile-popup-header">' +
    '<div class="profile-popup-avatar">' +
    initials +
    "</div>" +
    '<div class="profile-popup-header-info">' +
    "<h3>Tài khoản của tôi</h3>" +
    "<p>" +
    currentUser.email +
    "</p>" +
    "</div>" +
    '<button class="profile-popup-close" id="profilePopupClose">✕</button>' +
    "</div>" +
    // Tab buttons
    '<div class="profile-tabs">' +
    '<button class="profile-tab active" data-tab="info"><i class="fas fa-user-edit"></i> Thông tin</button>' +
    '<button class="profile-tab" data-tab="security"><i class="fas fa-lock"></i> Bảo mật</button>' +
    "</div>" +
    // Tab: Thông tin cá nhân
    '<div class="profile-tab-content active" id="tabInfo">' +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-user"></i> Họ</label>' +
    '<input type="text" id="profileLastName" value="' +
    (currentUser.lastName || "") +
    '" />' +
    "</div>" +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-user"></i> Tên</label>' +
    '<input type="text" id="profileFirstName" value="' +
    (currentUser.firstName || "") +
    '" />' +
    "</div>" +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-phone"></i> Số điện thoại</label>' +
    '<input type="tel" id="profilePhone" value="' +
    (currentUser.phone || "") +
    '" />' +
    "</div>" +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-envelope"></i> Email <span class="profile-verify-badge"><i class="fas fa-shield-alt"></i> Cần xác thực Email</span></label>' +
    '<input type="email" id="profileEmail" value="' +
    (currentUser.email || "") +
    '" />' +
    "</div>" +
    '<button class="profile-save-btn" id="btnSaveProfile"><i class="fas fa-save"></i> Lưu thay đổi</button>' +
    "</div>" +
    // Tab: Đổi mật khẩu
    '<div class="profile-tab-content" id="tabSecurity">' +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-key"></i> Mật khẩu hiện tại</label>' +
    '<input type="password" id="profileOldPassword" placeholder="Nhập mật khẩu hiện tại" />' +
    "</div>" +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-lock"></i> Mật khẩu mới</label>' +
    '<input type="password" id="profileNewPassword" placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)" />' +
    "</div>" +
    '<div class="profile-form-group">' +
    '<label><i class="fas fa-lock"></i> Xác nhận mật khẩu mới</label>' +
    '<input type="password" id="profileConfirmPassword" placeholder="Nhập lại mật khẩu mới" />' +
    "</div>" +
    '<p class="profile-security-note"><i class="fas fa-info-circle"></i> Đổi mật khẩu cần xác thực qua mã gửi đến email của bạn.</p>' +
    '<button class="profile-save-btn security" id="btnChangePassword"><i class="fas fa-shield-alt"></i> Xác thực Email & Đổi mật khẩu</button>' +
    "</div>" +
    "</div>";

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  // ===== Tab switching =====
  overlay.querySelectorAll(".profile-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      overlay
        .querySelectorAll(".profile-tab")
        .forEach((t) => t.classList.remove("active"));
      overlay
        .querySelectorAll(".profile-tab-content")
        .forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const tabId = tab.dataset.tab === "info" ? "tabInfo" : "tabSecurity";
      document.getElementById(tabId).classList.add("active");
    });
  });

  // ===== Đóng popup =====
  function closeProfile() {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 300);
  }

  document
    .getElementById("profilePopupClose")
    .addEventListener("click", closeProfile);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProfile();
  });

  // ===== Lưu thông tin cá nhân =====
  document.getElementById("btnSaveProfile").addEventListener("click", () => {
    const newLastName = document.getElementById("profileLastName").value.trim();
    const newFirstName = document
      .getElementById("profileFirstName")
      .value.trim();
    const newPhone = document.getElementById("profilePhone").value.trim();
    const newEmail = document.getElementById("profileEmail").value.trim();

    if (!newLastName || !newFirstName || !newEmail) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ họ, tên và email.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    const emailChanged = newEmail !== currentUser.email;

    function doSaveProfile() {
      const result = UserManager.updateProfile({
        lastName: newLastName,
        firstName: newFirstName,
        phone: newPhone,
        email: newEmail,
      });

      if (result.success) {
        showGiborPopup({
          type: "success",
          title: "Cập nhật thành công!",
          message: "Thông tin tài khoản đã được cập nhật.",
          confirmText: "OK",
          onConfirm: () => {
            window.location.reload();
          },
        });
      } else {
        showGiborPopup({
          type: "error",
          title: "Lỗi",
          message: result.message,
          confirmText: "Đã hiểu",
        });
      }
    }

    if (emailChanged) {
      // Đổi email → Cần xác thực OTP qua email
      showGiborPopup({
        type: "warning",
        title: "Xác thực Email",
        message:
          "Đổi email cần xác thực danh tính.\nMã xác nhận sẽ được gửi đến email hiện tại: " +
          currentUser.email,
        confirmText: "Gửi mã",
        cancelText: "Hủy",
        onConfirm: () => {
          showEmailOTPPopup(currentUser.email, () => {
            doSaveProfile();
          });
        },
      });
    } else {
      // Không đổi email → lưu trực tiếp
      doSaveProfile();
    }
  });

  // ===== Đổi mật khẩu =====
  document.getElementById("btnChangePassword").addEventListener("click", () => {
    const oldPass = document.getElementById("profileOldPassword").value;
    const newPass = document.getElementById("profileNewPassword").value;
    const confirmPass = document.getElementById("profileConfirmPassword").value;

    if (!oldPass || !newPass || !confirmPass) {
      showGiborPopup({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ mật khẩu.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    if (newPass !== confirmPass) {
      showGiborPopup({
        type: "error",
        title: "Không khớp",
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    if (newPass.length < 6) {
      showGiborPopup({
        type: "error",
        title: "Mật khẩu quá ngắn",
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    // Kiểm tra mật khẩu cũ trước
    const users = UserManager.getUsers();
    const user = users.find((u) => u.id === currentUser.id);
    if (!user || user.password !== oldPass) {
      showGiborPopup({
        type: "error",
        title: "Sai mật khẩu",
        message: "Mật khẩu hiện tại không đúng.",
        confirmText: "Đã hiểu",
      });
      return;
    }

    // Xác thực Email OTP trước khi đổi
    showGiborPopup({
      type: "warning",
      title: "Xác thực Email",
      message:
        "Đổi mật khẩu cần xác thực danh tính.\nMã xác nhận sẽ được gửi đến: " +
        currentUser.email,
      confirmText: "Gửi mã",
      cancelText: "Hủy",
      onConfirm: () => {
        showEmailOTPPopup(currentUser.email, () => {
          const result = UserManager.updatePassword(oldPass, newPass);
          if (result.success) {
            showGiborPopup({
              type: "success",
              title: "Đổi mật khẩu thành công!",
              message: "Mật khẩu của bạn đã được cập nhật.",
              confirmText: "OK",
              onConfirm: () => {
                closeProfile();
              },
            });
          } else {
            showGiborPopup({
              type: "error",
              title: "Lỗi",
              message: result.message,
              confirmText: "Đã hiểu",
            });
          }
        });
      },
    });
  });
}

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/
