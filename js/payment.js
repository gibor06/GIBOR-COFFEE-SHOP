/* 
========================================================================================

                            CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

// ===== ĐỌC GIỎ HÀNG TỪ LOCALSTORAGE =====
function getCart() {
  return JSON.parse(localStorage.getItem("giborCart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("giborCart", JSON.stringify(cart));
}
function formatPrice(p) {
  return p.toLocaleString("vi-VN") + "đ";
}

// ===== CẬP NHẬT SỐ LƯỢNG ICON GIỎ =====
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  document
    .querySelectorAll(".cart-count")
    .forEach((el) => (el.textContent = total));
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.querySelector("span").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ===== RENDER ĐƠN HÀNG (CỘT PHẢI) =====
function renderOrderSummary() {
  const cart = getCart();
  const orderItems = document.getElementById("orderItems");
  const orderCount = document.getElementById("orderCount");

  if (!orderItems || !orderCount) return;

  orderCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);

  if (cart.length === 0) {
    orderItems.innerHTML = `
      <p style="text-align:center; opacity:0.6; padding:25px 0;">
        <i class="fas fa-shopping-cart" style="font-size:30px; display:block; margin-bottom:8px;"></i>
        Giỏ hàng trống
      </p>`;
    updateTotals(0);
    return;
  }

  let html = "";
  cart.forEach((item) => {
    const total = item.price * item.quantity;
    html += `
      <div class="order-item">
        <div class="order-item-img">
          <img src="${item.image}" alt="${item.name}" />
          <span class="order-item-qty">${item.quantity}</span>
        </div>
        <div class="order-item-info">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-meta">${item.size === "Mặc định" ? "" : "Size " + item.size}${item.sugar ? " | Đường " + item.sugar : ""}${item.ice ? " | Đá " + item.ice : ""}${item.toppings && item.toppings.length > 0 ? " | Topping: " + item.toppings.map(t => t.name).join(", ") : ""}</div>
          ${item.note ? `<div class="order-item-note">Ghi chú: ${item.note}</div>` : ""}
        </div>
        <div class="order-item-price">${formatPrice(total)}</div>
      </div>`;
  });

  orderItems.innerHTML = html;

  // Tính tổng
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  updateTotals(subtotal);
}

// ===== CẬP NHẬT TỔNG TIỀN =====
let currentDiscount = 0;
let isFreeShip = false;
let pointsDiscount = 0; // Số tiền giảm từ điểm
let usedPoints = 0; // Số điểm đã dùng

function updateTotals(subtotal) {
  const subEl = document.getElementById("subtotalPrice");
  const shipEl = document.getElementById("shippingFee");
  const discountRow = document.getElementById("discountRow");
  const discountEl = document.getElementById("discountAmount");
  const grandEl = document.getElementById("grandTotal");

  if (!subEl) return;

  // Tính phí ship: miễn phí nếu uống tại quán, đơn >= 200k, hoặc có mã FREESHIP
  let shippingFee = 0;
  if (selectedShipping === "delivery") {
    shippingFee = subtotal > 0 ? (subtotal >= 200000 ? 0 : 30000) : 0;
  }
  if (isFreeShip && subtotal > 0) shippingFee = 0;

  const grand = subtotal - currentDiscount - pointsDiscount + shippingFee;

  subEl.textContent = formatPrice(subtotal);
  shipEl.textContent =
    shippingFee === 0 && subtotal > 0 ? "Miễn phí" : formatPrice(shippingFee);

  if (currentDiscount > 0 || isFreeShip) {
    discountRow.style.display = "flex";
    if (isFreeShip && currentDiscount === 0) {
      discountEl.textContent = "Miễn phí vận chuyển";
    } else {
      discountEl.textContent = "- " + formatPrice(currentDiscount);
    }
  } else {
    discountRow.style.display = "none";
  }

  // Hiển thị giảm giá từ điểm (trong points-section)
  const pointsDiscountRow = document.getElementById("pointsDiscountRow");
  const pointsDiscountEl = document.getElementById("pointsDiscountAmount");
  if (pointsDiscountRow && pointsDiscountEl) {
    if (pointsDiscount > 0) {
      pointsDiscountRow.style.display = "flex";
      pointsDiscountEl.textContent = "- " + formatPrice(pointsDiscount);
    } else {
      pointsDiscountRow.style.display = "none";
    }
  }

  // Hiển thị giảm giá từ điểm (trong phần tính tiền - màu xanh)
  const pCalcRow = document.getElementById("pointsDiscountCalcRow");
  const pCalcEl = document.getElementById("pointsDiscountCalc");
  if (pCalcRow && pCalcEl) {
    if (pointsDiscount > 0) {
      pCalcRow.style.display = "flex";
      pCalcEl.textContent = "- " + formatPrice(pointsDiscount);
    } else {
      pCalcRow.style.display = "none";
    }
  }

  // Cập nhật điểm nhận được (chỉ tính trên tiền hàng, KHÔNG tính phí ship)
  const productTotal = Math.max(0, subtotal - currentDiscount - pointsDiscount);
  const earnEl = document.getElementById("pointsEarn");
  if (earnEl && typeof PointsManager !== "undefined") {
    const earnedPoints = PointsManager.moneyToPoints(productTotal);
    earnEl.textContent = "+" + earnedPoints.toLocaleString("vi-VN") + " điểm";
  }

  grandEl.textContent = formatPrice(Math.max(0, grand));
}

// ===== MÃ GIẢM GIÁ =====
const COUPONS = {
  GIBOR10: { type: "percent", value: 10, max: 50000 },
  GIBOR20K: { type: "fixed", value: 20000 },
  FREESHIP: { type: "freeship", value: 0 },
};

function applyCoupon() {
  const input = document.getElementById("couponCode");
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast("Vui lòng nhập mã giảm giá!");
    return;
  }

  const coupon = COUPONS[code];
  if (!coupon) {
    showToast("Mã giảm giá không hợp lệ!");
    currentDiscount = 0;
    isFreeShip = false;
    renderOrderSummary();
    return;
  }

  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  // Reset trạng thái trước khi áp dụng mã mới
  isFreeShip = false;
  currentDiscount = 0;

  if (coupon.type === "percent") {
    currentDiscount = Math.min((subtotal * coupon.value) / 100, coupon.max);
  } else if (coupon.type === "fixed") {
    currentDiscount = coupon.value;
  } else if (coupon.type === "freeship") {
    isFreeShip = true;
  }

  showToast(`Áp dụng mã "${code}" thành công!`);
  updateTotals(subtotal);
}

// ===== ĐIỂM TÍCH LŨY =====
function initPoints() {
  const section = document.getElementById("pointsSection");
  if (!section) return;

  // Chỉ hiện khi đã đăng nhập
  if (typeof UserManager === "undefined" || !UserManager.isLoggedIn() || typeof PointsManager === "undefined") {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  // Hiển điểm hiện tại
  const currentPoints = PointsManager.getPoints();
  const currentEl = document.getElementById("pointsCurrent");
  if (currentEl) currentEl.textContent = currentPoints.toLocaleString("vi-VN") + " điểm";

  // Set max cho input
  const input = document.getElementById("pointsInput");
  if (input) {
    input.max = currentPoints;
    input.value = 0;
  }

  // Cập nhật điểm nhận được
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const earnEl = document.getElementById("pointsEarn");
  if (earnEl) {
    const earned = PointsManager.moneyToPoints(subtotal);
    earnEl.textContent = "+" + earned.toLocaleString("vi-VN") + " điểm";
  }

  // Sự kiện nút áp dụng điểm
  const btn = document.getElementById("btnUsePoints");
  if (btn) btn.addEventListener("click", applyPoints);
}

function applyPoints() {
  if (typeof PointsManager === "undefined") return;

  const input = document.getElementById("pointsInput");
  const points = parseInt(input.value) || 0;
  const currentPoints = PointsManager.getPoints();

  if (points < 0) {
    showToast("Số điểm không hợp lệ!");
    return;
  }

  if (points > currentPoints) {
    showToast("Bạn không đủ điểm! Hiện có: " + currentPoints.toLocaleString("vi-VN") + " điểm.");
    input.value = currentPoints;
    return;
  }

  // Tính số tiền giảm
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  let discount = PointsManager.pointsToMoney(points);

  // Không cho giảm vượt quá tổng tiền
  if (discount > subtotal - currentDiscount) {
    discount = subtotal - currentDiscount;
    // Tính ngược số điểm cần dùng
    const actualPoints = Math.ceil(discount / 10);
    input.value = actualPoints;
    usedPoints = actualPoints;
    pointsDiscount = PointsManager.pointsToMoney(actualPoints);
  } else {
    usedPoints = points;
    pointsDiscount = discount;
  }

  if (points === 0) {
    pointsDiscount = 0;
    usedPoints = 0;
    showToast("Đã hủy sử dụng điểm.");
  } else {
    showToast(`Áp dụng ${usedPoints.toLocaleString("vi-VN")} điểm, giảm ${formatPrice(pointsDiscount)}!`);
  }

  updateTotals(subtotal);
}

// ===== CHỌN PHƯƠNG THỨC THANH TOÁN =====
let selectedPayment = "cod"; // Biến lưu phương thức thanh toán: 'cod' hoặc 'banking'

function selectPayment(method) {
  selectedPayment = method; // Lưu phương thức đã chọn

  // Xóa class active cũ
  document
    .querySelectorAll(".payment-option")
    .forEach((el) => el.classList.remove("active"));

  // Thêm class active cho option được chọn
  const selected = document.querySelector(
    `.payment-option[data-method="${method}"]`,
  );
  if (selected) {
    selected.classList.add("active");
    selected.querySelector("input[type=radio]").checked = true;
  }

  // Ẩn/hiện phần thông tin chuyển khoản + QR code
  const bankInfo = document.getElementById("bankingInfo");
  const btnPlace = document.getElementById("btnPlaceOrder");

  if (method === "banking") {
    // Hiện QR thanh toán
    if (bankInfo) bankInfo.style.display = "block";
    // Đổi text nút thành "ĐẶ HÀNG"
    if (btnPlace)
      btnPlace.innerHTML =
        '<i class="fa-solid fa-credit-card"></i> ĐẶT HÀNG';
    // Cập nhật QR code với số tiền hiện tại
    updateQRCode();
  } else {
    // Ẩn QR thanh toán khi chọn COD
    if (bankInfo) bankInfo.style.display = "none";
    // Đổi text nút về "ĐẶT HÀNG"
    if (btnPlace)
      btnPlace.innerHTML = '<i class="fa-solid fa-check"></i> ĐẶT HÀNG';
  }
}

// ===== DỮ LIỆU CHI NHÁNH =====
const BRANCHES = {
  hcm: [
    {
      id: "hcm1",
      name: "GIBOR Lê Trọng Tấn",
      address: "140 Lê Trọng Tấn, Tây Thạnh, Tân Phú, TP. Hồ Chí Minh",
    },
    {
      id: "hcm2",
      name: "GIBOR Nguyễn Huệ",
      address: "263 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    },
    {
      id: "hcm3",
      name: "GIBOR Võ Văn Tần",
      address: "108 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh",
    },
    {
      id: "hcm4",
      name: "GIBOR Xa lộ Hà Nội",
      address: "77 Xa lộ Hà Nội, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
    },
    {
      id: "hcm5",
      name: "GIBOR Điện Biên Phủ",
      address: "23 Điện Biên Phủ, Phường 15, Bình Thạnh, TP. Hồ Chí Minh",
    },
  ],
  hn: [
    {
      id: "hn1",
      name: "GIBOR Trần Duy Hưng",
      address: "81 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
    },
    {
      id: "hn2",
      name: "GIBOR Láng Hạ",
      address: "66 Láng Hạ, Láng Hạ, Đống Đa, Hà Nội",
    },
    {
      id: "hn3",
      name: "GIBOR Bạch Mai",
      address: "115 Bạch Mai, Bạch Mai, Hai Bà Trưng, Hà Nội",
    },
    {
      id: "hn4",
      name: "GIBOR Hoàng Hoa Thám",
      address: "632 Hoàng Hoa Thám, Vĩnh Phúc, Ba Đình, Hà Nội",
    },
    {
      id: "hn5",
      name: "GIBOR Nguyễn Văn Cừ",
      address: "334 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội",
    },
  ],
  dn: [
    {
      id: "dn1",
      name: "GIBOR Võ Nguyên Giáp",
      address: "567 Võ Nguyên Giáp, Mỹ An, Ngũ Hành Sơn, Đà Nẵng",
    },
    {
      id: "dn2",
      name: "GIBOR Bạch Đằng",
      address: "453 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng",
    },
    {
      id: "dn3",
      name: "GIBOR Nguyễn Văn Linh",
      address: "638 Nguyễn Văn Linh, Nam Dương, Hải Châu, Đà Nẵng",
    },
    {
      id: "dn4",
      name: "GIBOR Tôn Đức Thắng",
      address: "53 Tôn Đức Thắng, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng",
    },
    {
      id: "dn5",
      name: "GIBOR Cách Mạng Tháng Tám",
      address: "55 Cách Mạng Tháng Tám, Khuê Trung, Cẩm Lệ, Đà Nẵng",
    },
  ],
};

let selectedBranch = null;

function renderBranches(city) {
  const branchList = document.getElementById("branchList");
  if (!branchList) return;

  selectedBranch = null;

  if (!city || !BRANCHES[city]) {
    branchList.innerHTML = "";
    return;
  }

  let html = "";
  BRANCHES[city].forEach((branch) => {
    html += `
      <label class="branch-card" data-branch-id="${branch.id}" onclick="selectBranch('${branch.id}', '${city}')">
        <input type="radio" name="branch" value="${branch.id}" />
        <span class="branch-radio"></span>
        <div class="branch-info">
          <span class="branch-name">${branch.name}</span>
          <span class="branch-address"><i class="fa-solid fa-map-pin"></i> ${branch.address}</span>
        </div>
      </label>`;
  });

  branchList.innerHTML = html;
}

function selectBranch(branchId, city) {
  selectedBranch = BRANCHES[city].find((b) => b.id === branchId);

  document.querySelectorAll(".branch-card").forEach((card) => {
    card.classList.remove("active");
  });

  const selected = document.querySelector(
    `.branch-card[data-branch-id="${branchId}"]`,
  );
  if (selected) {
    selected.classList.add("active");
    selected.querySelector("input[type=radio]").checked = true;
  }
}

// ===== CHỌN HÌNH THỨC NHẬN HÀNG =====
let selectedShipping = "delivery";

function selectShipping(method) {
  selectedShipping = method;
  document
    .querySelectorAll(".shipping-option")
    .forEach((el) => el.classList.remove("active"));

  const selected = document.querySelector(
    `.shipping-option[data-method="${method}"]`,
  );
  if (selected) {
    selected.classList.add("active");
    selected.querySelector("input[type=radio]").checked = true;
  }

  const shippingNotice = document.getElementById("shippingNotice");
  const requiredFields = document.querySelectorAll(".form-group .required");
  const branchSection = document.getElementById("branchSection");
  const addressFields = ["groupAddress", "groupCity", "groupWard"];

  if (method === "delivery") {
    // Hiện thông báo và bắt buộc các trường
    if (shippingNotice) shippingNotice.style.display = "flex";
    requiredFields.forEach((el) => (el.style.display = "inline"));
    // Hiện địa chỉ, tỉnh/tp, phường/xã
    addressFields.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "block";
    });
    // Ẩn chi nhánh
    if (branchSection) branchSection.style.display = "none";
    selectedBranch = null;
    // Xóa lỗi cũ
    clearAllErrors();
  } else {
    // Ẩn thông báo và không bắt buộc
    if (shippingNotice) shippingNotice.style.display = "none";
    requiredFields.forEach((el) => (el.style.display = "none"));
    // Ẩn địa chỉ, tỉnh/tp, phường/xã
    addressFields.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    // Hiện chi nhánh
    if (branchSection) branchSection.style.display = "block";
    // Xóa lỗi cũ
    clearAllErrors();
  }

  // Cập nhật phí ship
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  updateTotals(subtotal);
}

// ===== XÓA LỖI =====
function clearAllErrors() {
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("has-error");
    const errorMsg = group.querySelector(".error-message");
    if (errorMsg) errorMsg.remove();
  });
}

function showFieldError(inputId, message, shouldFocus = false) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const formGroup = input.closest(".form-group");
  if (!formGroup) return;

  // Xóa lỗi cũ nếu có
  formGroup.classList.remove("has-error");
  const oldError = formGroup.querySelector(".error-message");
  if (oldError) oldError.remove();

  // Thêm lỗi mới
  formGroup.classList.add("has-error");
  const errorEl = document.createElement("span");
  errorEl.className = "error-message";
  errorEl.textContent = message;
  formGroup.appendChild(errorEl);

  // Focus vào input nếu là lỗi đầu tiên
  if (shouldFocus) input.focus();
}

// ===== VALIDATE FORM =====
function validateForm() {
  // Xóa tất cả lỗi cũ
  clearAllErrors();

  const name = document.getElementById("ckName").value.trim();
  let errors = [];

  // Luôn yêu cầu tên khách hàng
  if (!name) errors.push({ id: "ckName", msg: "Vui lòng nhập họ tên" });

  // Nếu sử dụng tại quán, validate tên + chi nhánh
  if (selectedShipping === "dine-in") {
    if (errors.length > 0) {
      showFieldError("ckName", "Vui lòng nhập họ tên", true);
      showToast("Vui lòng nhập tên khách hàng!");
      return false;
    }
    if (!selectedBranch) {
      showToast("Vui lòng chọn chi nhánh!");
      return false;
    }
    // Kiểm tra phương thức thanh toán nếu chọn banking
    if (selectedPayment === "banking") {
      // Sẽ được xử lý bằng popup tùy chỉnh trong placeOrder()
      return "NEED_CONFIRM";
    }
    return true;
  }

  // Nếu giao hàng, phải validate các trường bắt buộc
  const phone = document.getElementById("ckPhone").value.trim();
  const email = document.getElementById("ckEmail").value.trim();
  const address = document.getElementById("ckAddress").value.trim();
  const city = document.getElementById("ckCity").value;
  const ward = document.getElementById("ckWard").value;

  if (!phone || phone.length < 9)
    errors.push({ id: "ckPhone", msg: "Vui lòng nhập số điện thoại hợp lệ" });
  if (!email || !email.includes("@"))
    errors.push({ id: "ckEmail", msg: "Vui lòng nhập email hợp lệ" });
  if (!address) errors.push({ id: "ckAddress", msg: "Vui lòng nhập địa chỉ" });
  if (!city) errors.push({ id: "ckCity", msg: "Vui lòng chọn Tỉnh/Thành phố" });
  if (!ward) errors.push({ id: "ckWard", msg: "Vui lòng chọn Phường/Xã" });

  // Hiển thị tất cả lỗi, focus vào lỗi đầu tiên
  errors.forEach((err, idx) => {
    showFieldError(err.id, err.msg, idx === 0);
  });

  if (errors.length > 0) {
    showToast("Vui lòng điền đầy đủ thông tin giao hàng!");
    return false;
  }

  // Kiểm tra xác nhận thanh toán nếu chọn chuyển khoản ngân hàng
  if (selectedPayment === "banking") {
    // Sẽ được xử lý bằng popup tùy chỉnh trong placeOrder()
    return "NEED_CONFIRM";
  }

  return true;
}

// ===== HIỆN POPUP XÁC NHẬN THANH TOÁN =====
function showConfirmPayment() {
  return new Promise((resolve) => {
    const overlay = document.getElementById("confirmOverlay");
    const btnOk = document.getElementById("btnConfirmOk");
    const btnCancel = document.getElementById("btnConfirmCancel");

    if (!overlay) {
      resolve(true);
      return;
    }

    overlay.classList.add("show");

    const handleOk = () => {
      overlay.classList.remove("show");
      btnOk.removeEventListener("click", handleOk);
      btnCancel.removeEventListener("click", handleCancel);
      resolve(true);
    };

    const handleCancel = () => {
      overlay.classList.remove("show");
      btnOk.removeEventListener("click", handleOk);
      btnCancel.removeEventListener("click", handleCancel);
      resolve(false);
    };

    btnOk.addEventListener("click", handleOk);
    btnCancel.addEventListener("click", handleCancel);
  });
}

// ===== ĐẶT HÀNG =====
async function placeOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    showToast("Giỏ hàng trống, không thể đặt hàng!");
    return;
  }

  const validationResult = validateForm();

  // Nếu cần xác nhận thanh toán (chọn Banking)
  if (validationResult === "NEED_CONFIRM") {
    const confirmed = await showConfirmPayment();
    if (!confirmed) {
      showToast("Vui lòng hoàn tất thanh toán trước khi đặt hàng!");
      return;
    }
  } else if (!validationResult) {
    // Validate thất bại
    return;
  }

  // Tạo mã đơn hàng
  const code = "GBR-" + Date.now().toString(36).toUpperCase();
  const orderCodeEl = document.getElementById("orderCode");
  if (orderCodeEl) orderCodeEl.textContent = code;

  // Lưu đơn hàng vào lịch sử (nếu đã đăng nhập)
  if (
    typeof OrderManager !== "undefined" &&
    typeof UserManager !== "undefined" &&
    UserManager.isLoggedIn()
  ) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    // Lấy thông tin người đặt hàng từ form
    const ckNameEl = document.getElementById("ckName");
    const ckPhoneEl = document.getElementById("ckPhone");
    const ckEmailEl = document.getElementById("ckEmail");
    const ckAddressEl = document.getElementById("ckAddress");
    const ckCityEl = document.getElementById("ckCity");
    const ckWardEl = document.getElementById("ckWard");

    // Ghép địa chỉ đầy đủ: số nhà + phường/xã + tỉnh/thành phố
    let fullAddress = "";
    if (selectedShipping === "delivery") {
      const streetAddr = ckAddressEl ? ckAddressEl.value.trim() : "";
      const wardName = ckWardEl ? ckWardEl.options[ckWardEl.selectedIndex]?.text : "";
      const cityName = ckCityEl ? ckCityEl.options[ckCityEl.selectedIndex]?.text : "";
      const parts = [streetAddr, wardName, cityName].filter(
        (p) => p && p !== "--- Chọn ---"
      );
      fullAddress = parts.join(", ");
    }

    OrderManager.saveOrder({
      code: code,
      customer: {
        name: ckNameEl ? ckNameEl.value.trim() : "",
        phone: ckPhoneEl ? ckPhoneEl.value.trim() : "",
        email: ckEmailEl ? ckEmailEl.value.trim() : "",
        address: fullAddress,
      },
      items: cart.map((i) => ({
        name: i.name,
        size: i.size,
        price: i.price,
        quantity: i.quantity,
        sugar: i.sugar || "",
        ice: i.ice || "",
        toppings: i.toppings || [],
        note: i.note || "",
      })),
      total: Math.max(0, subtotal - currentDiscount - pointsDiscount),
      subtotal: subtotal,
      couponDiscount: currentDiscount,
      pointsUsed: usedPoints,
      pointsDiscount: pointsDiscount,
      payment:
        selectedPayment === "banking"
          ? "Chuyển khoản"
          : "Thanh toán khi nhận hàng",
      shipping: selectedShipping === "delivery" ? "Giao hàng" : "Uống tại quán",
      branch: selectedBranch
        ? { name: selectedBranch.name, address: selectedBranch.address }
        : null,
    });

    // Xử lý điểm tích lũy
    if (typeof PointsManager !== "undefined") {
      // Trừ điểm đã dùng
      if (usedPoints > 0) {
        PointsManager.usePoints(usedPoints);
      }
      // Cộng điểm mới (chỉ tính trên tiền hàng, không tính phí ship)
      const productOnly = Math.max(0, subtotal - currentDiscount - pointsDiscount);
      const earnedPoints = PointsManager.earnPoints(productOnly);
    }
  }

  // Xóa giỏ hàng
  localStorage.removeItem("giborCart");
  updateCartCount();

  // Hiện popup thành công
  const overlay = document.getElementById("successOverlay");
  if (overlay) overlay.classList.add("show");
}

// ===== DỮ LIỆU PHƯỜNG/XÃ THEO TỈNH/THÀNH PHỐ =====
const WARD_NAMES = {
  hcm: [
    "Phường An Hội Tây",
    "Phường An Hội Đông",
    "Phường An Khánh",
    "Phường An Lạc",
    "Phường An Nhơn",
    "Phường An Phú",
    "Phường An Phú Đông",
    "Phường An Đông",
    "Phường Bà Rịa",
    "Phường Bàn Cờ",
    "Phường Bình Cơ",
    "Phường Bình Dương",
    "Phường Bình Hòa",
    "Phường Bình Hưng Hòa",
    "Phường Bình Lợi Trung",
    "Phường Bình Phú",
    "Phường Bình Quới",
    "Phường Bình Thạnh",
    "Phường Bình Thới",
    "Phường Bình Tiên",
    "Phường Bình Trưng",
    "Phường Bình Trị Đông",
    "Phường Bình Tân",
    "Phường Bình Tây",
    "Phường Bình Đông",
    "Phường Bảy Hiền",
    "Phường Bến Cát",
    "Phường Bến Thành",
    "Phường Chánh Hiệp",
    "Phường Chánh Hưng",
    "Phường Chánh Phú Hòa",
    "Phường Chợ Lớn",
    "Phường Chợ Quán",
    "Phường Cát Lái",
    "Phường Cầu Kiệu",
    "Phường Cầu Ông Lãnh",
    "Phường Diên Hồng",
    "Phường Dĩ An",
    "Phường Gia Định",
    "Phường Gò Vấp",
    "Phường Hiệp Bình",
    "Phường Hòa Bình",
    "Phường Hòa Hưng",
    "Phường Hòa Lợi",
    "Phường Hạnh Thông",
    "Phường Khánh Hội",
    "Phường Linh Xuân",
    "Phường Long Bình",
    "Phường Long Phước",
    "Phường Long Trường",
    "Phường Lái Thiêu",
    "Phường Lê Minh Xuân",
    "Phường Lộc An",
    "Phường Lý Thường Kiệt",
    "Phường Minh Phụng",
    "Phường Mỹ Thạnh",
    "Phường Phú An",
    "Phường Phú Hòa",
    "Phường Phú Lâm",
    "Phường Phú Lợi",
    "Phường Phú Mỹ",
    "Phường Phú Nhuận",
    "Phường Phú Thạnh",
    "Phường Phú Thọ",
    "Phường Phú Thọ Hòa",
    "Phường Phước Long",
    "Phường Phước Thành",
    "Phường Phước Thắng",
    "Phường Phước Long B",
    "Phường Phước Tân",
    "Phường Phước Vĩnh",
    "Phường Rạch Dừa",
    "Phường Sài Gòn",
    "Phường Tam Bình",
    "Phường Tam Long",
    "Phường Tam Phước",
    "Phường Tam Thắng",
    "Phường Tân An",
    "Phường Tân Bình",
    "Phường Tân Chánh Hiệp",
    "Phường Tân Hưng",
    "Phường Tân Khánh",
    "Phường Tân Phú",
    "Phường Tân Phước",
    "Phường Tân Sơn",
    "Phường Tân Sơn Nhất",
    "Phường Tân Thành",
    "Phường Tân Thới Hiệp",
    "Phường Tân Thuận",
    "Phường Tân Tạo",
    "Phường Thạnh Lộc",
    "Phường Thạnh Mỹ Tây",
    "Phường Thủ Dầu Một",
    "Phường Thủ Đức",
    "Phường Trảng Dài",
    "Phường Trung Mỹ Tây",
    "Phường Vĩnh Hội",
    "Phường Vũng Tàu",
    "Phường Võ Thị Sáu",
    "Phường Xuân Hòa",
    "Phường Xuân Thành",
    "Phường Đông Hòa",
    "Phường Đông Hưng Thuận",
    "Phường Định Hòa",
    "Phường Đoàn Kết",
    "Phường 30/4",
    "Xã An Bình",
    "Xã An Long",
    "Xã An Nhơn Tây",
    "Xã An Phú",
    "Xã An Thới Đông",
    "Xã Bàu Bàng",
    "Xã Bàu Lâm",
    "Xã Bình Chánh",
    "Xã Bình Giã",
    "Xã Bình Hưng",
    "Xã Bình Khánh",
    "Xã Bình Lợi",
    "Xã Bình Mỹ",
    "Xã Bình Phước",
    "Xã Bình Sơn",
    "Xã Bình Xuyên",
    "Xã Bưng Riềng",
    "Xã Cần Giờ",
    "Xã Châu Pha",
    "Xã Chánh Phú Hòa",
    "Xã Củ Chi",
    "Xã Dầu Tiếng",
    "Xã Hóc Môn",
    "Xã Hòa Hiệp",
    "Xã Hòa Hội",
    "Xã Hòa Hưng",
    "Xã Hưng Long",
    "Xã Long Điền",
    "Xã Long Hải",
    "Xã Long Hòa",
    "Xã Long Hưng",
    "Xã Long Sơn",
    "Xã Lộc An",
    "Xã Minh Thạnh",
    "Xã Mỹ Hạnh",
    "Xã Mỹ Yên",
    "Xã Nhuận Đức",
    "Xã Phú Giáo",
    "Xã Phú Hòa Đông",
    "Xã Phước Hòa",
    "Xã Phước Hải",
    "Xã Phước Thành",
    "Xã Thanh An",
    "Xã Thái Mỹ",
    "Xã Thường Tân",
    "Xã Thạnh An",
    "Xã Trừ Văn Thố",
    "Xã Tân An Hội",
    "Xã Tân Nhựt",
    "Xã Tân Vĩnh Lộc",
    "Xã Vĩnh Lộc",
    "Xã Xuyên Mộc",
    "Xã Xuân Sơn",
    "Xã Xuân Thới Sơn",
    "Xã Đông Thạnh",
    "Xã Đất Đỏ",
    "Đặc khu Côn Đảo",
  ],

  hn: [
    "Phường Ba Đình",
    "Phường Bạch Mai",
    "Phường Bồ Đề",
    "Phường Chương Mỹ",
    "Phường Cầu Giấy",
    "Phường Cửa Nam",
    "Phường Dương Nội",
    "Phường Giảng Võ",
    "Phường Hai Bà Trưng",
    "Phường Hoàn Kiếm",
    "Phường Hoàng Liệt",
    "Phường Hoàng Mai",
    "Phường Hà Đông",
    "Phường Hồng Hà",
    "Phường Khương Đình",
    "Phường Kim Liên",
    "Phường Kiến Hưng",
    "Phường Long Biên",
    "Phường Láng",
    "Phường Lĩnh Nam",
    "Phường Nghĩa Đô",
    "Phường Ngọc Hà",
    "Phường Phú Diễn",
    "Phường Phú Lương",
    "Phường Phú Thượng",
    "Phường Phúc Lợi",
    "Phường Phương Liệt",
    "Phường Sơn Tây",
    "Phường Thanh Liệt",
    "Phường Thanh Xuân",
    "Phường Thượng Cát",
    "Phường Tây Hồ",
    "Phường Tây Mỗ",
    "Phường Tây Tựu",
    "Phường Tùng Thiện",
    "Phường Tương Mai",
    "Phường Từ Liêm",
    "Phường Việt Hưng",
    "Phường Văn Miếu - Quốc Tử Giám",
    "Phường Vĩnh Hưng",
    "Phường Vĩnh Tuy",
    "Phường Xuân Đỉnh",
    "Phường Yên Hòa",
    "Phường Yên Nghĩa",
    "Phường Yên Sở",
    "Phường Ô Chợ Dừa",
    "Phường Đông Ngạc",
    "Phường Đống Đa",
    "Xã Ba Vì",
    "Xã Bát Tràng",
    "Xã Chân Mây",
    "Xã Chương Dương",
    "Xã Cổ Loa",
    "Xã Duyên Hà",
    "Xã Gia Lâm",
    "Xã Gióng",
    "Xã Hạ Mỗ",
    "Xã Hát Môn",
    "Xã Hoài Đức",
    "Xã Hồng Vân",
    "Xã Khánh Hà",
    "Xã Liên Minh",
    "Xã Mai Hoa",
    "Xã Minh Châu",
    "Xã Mê Linh",
    "Xã Nam Phù",
    "Xã Ngọc Hồi",
    "Xã Nguyên Khê",
    "Xã Nội Bài",
    "Xã Phúc Thịnh",
    "Xã Phú Nghĩa",
    "Xã Phú Xuyên",
    "Xã Phượng Dực",
    "Xã Quang Minh",
    "Xã Sóc Sơn",
    "Xã Sơn Đồng",
    "Xã Thanh Oai",
    "Xã Thường Tín",
    "Xã Thuận An",
    "Xã Thư Lâm",
    "Xã Thạch Thất",
    "Xã Tiến Thắng",
    "Xã Trần Phú",
    "Xã Tùng Thiện",
    "Xã Tân Hội",
    "Xã Tản Lĩnh",
    "Xã Vân Đình",
    "Xã Vân Nội",
    "Xã Vĩnh Thanh",
    "Xã Xuân Mai",
    "Xã Yên Bài",
    "Xã Yên Lãng",
    "Xã Yên Mỹ",
    "Xã Yên Sơn",
    "Xã Yên Trung",
    "Xã Yên Xuân",
    "Xã Ô Diên",
    "Xã Đa Phúc",
    "Xã Đan Phượng",
    "Xã Đoài Phương",
    "Xã Đông Anh",
    "Xã Đại Thanh",
    "Xã Đại Xuyên",
    "Xã Ứng Hòa",
    "Xã Ứng Thiên",
  ],

  dn: [
    "Phường An Hải",
    "Phường An Khê",
    "Phường An Thắng",
    "Phường Bàn Thạch",
    "Phường Cẩm Lệ",
    "Phường Cẩm Phô",
    "Phường Cẩm Thanh",
    "Phường Cửa Đại",
    "Phường Duy Tân",
    "Phường Duy Trinh",
    "Phường Duy Xuyên",
    "Phường Điện Bàn",
    "Phường Hòa Cường",
    "Phường Hòa Khánh",
    "Phường Hòa Vang",
    "Phường Hương Trà",
    "Phường Hội An",
    "Phường Kỳ Hà",
    "Phường Kỳ Phương",
    "Phường Kỳ Thịnh",
    "Phường Kỳ Trinh",
    "Phường Liên Chiểu",
    "Phường Minh An",
    "Phường Nam Trà My",
    "Phường Ngũ Hành Sơn",
    "Phường Núi Thành",
    "Phường Phước Mỹ",
    "Phường Sơn Trà",
    "Phường Tam Kỳ",
    "Phường Thanh Khê",
    "Phường Thăng Bình",
    "Phường Thạch Thang",
    "Phường Tiên Phước",
    "Phường Trường Xuân",
    "Phường Trà My",
    "Phường Tân Hiệp",
    "Phường Tân Thạnh",
    "Phường Vĩnh Điện",
    "Phường Võng Nhi",
    "Phường Xuân Hà",
    "Xã A Vương",
    "Xã A Xan",
    "Xã Bến Giằng",
    "Xã Bến Hiên",
    "Xã Cù Lao Chàm",
    "Xã Duy Nghĩa",
    "Xã Duy Phú",
    "Xã Duy Sơn",
    "Xã Duy Trung",
    "Xã Giang Nam",
    "Xã Hòa Bắc",
    "Xã Hòa Châu",
    "Xã Hòa Liên",
    "Xã Hòa Ninh",
    "Xã Hòa Nhơn",
    "Xã Hòa Phong",
    "Xã Hòa Phú",
    "Xã Hòa Phước",
    "Xã Hòa Sơn",
    "Xã Hòa Tiến",
    "Xã La Dêê",
    "Xã Nam Giang",
    "Xã Phú Ninh",
    "Xã Phước Hiệp",
    "Xã Phước Trà",
    "Xã Quế Sơn",
    "Xã Sông Vàng",
    "Xã Tây Giang",
    "Xã Thạnh Mỹ",
    "Xã Tiên Lãnh",
    "Xã Tiên Phước",
    "Xã Trà Don",
    "Xã Trà Linh",
    "Xã Trà Tập",
    "Xã Trà Vân",
    "Xã Trung Phước",
    "Xã Tư",
    "Xã Đại Lộc",
    "Xã Đông Giang",
    "Xã Đăk Pring",
    "Xã Đăk Tôi",
    "Xã Đoàn Kết",
    "Xã Đại Hồng",
    "Xã Ứng Dương",
  ],
};

// ===== CẬP NHẬT PHƯỜNG/XÃ THEO TỈNH/THÀNH PHỐ =====
function updateWards() {
  const citySelect = document.getElementById("ckCity");
  const wardSelect = document.getElementById("ckWard");

  if (!citySelect || !wardSelect) return;

  const selectedCity = citySelect.value;

  // Xóa tất cả các option cũ (trừ option đầu tiên)
  wardSelect.innerHTML = '<option value="">--- Chọn ---</option>';

  if (!selectedCity) {
    refreshSearchable("ckWard");
    return;
  }

  // Lấy danh sách phường/xã cho tỉnh đã chọn
  const wards = WARD_NAMES[selectedCity];

  if (!wards) {
    refreshSearchable("ckWard");
    return;
  }

  // Thêm các option mới
  wards.forEach((ward) => {
    const option = document.createElement("option");
    option.value = ward;
    option.textContent = ward;
    wardSelect.appendChild(option);
  });

  // Cập nhật giao diện tìm kiếm
  refreshSearchable("ckWard");
}

// ===== ĐÓNG POPUP =====
function closeSuccess() {
  const overlay = document.getElementById("successOverlay");
  if (overlay) overlay.classList.remove("show");
}

// ===== TÌM KIẾM PHƯỜNG/XÃ, TỈNH/THÀNH PHỐ =====
function makeSearchable(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // Ẩn select gốc
  select.style.display = "none";

  // Tạo wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "ss-wrapper";
  wrapper.dataset.for = selectId;

  // Nút hiển thị giá trị đã chọn
  const display = document.createElement("div");
  display.className = "ss-display";
  display.innerHTML = '<span class="ss-display-text">--- Chọn ---</span><i class="fa-solid fa-magnifying-glass-location ss-arrow"></i>';

  // Dropdown
  const dropdown = document.createElement("div");
  dropdown.className = "ss-dropdown";

  // Ô tìm kiếm
  const search = document.createElement("input");
  search.type = "text";
  search.className = "ss-search";
  search.placeholder = "Tìm kiếm";

  // Danh sách kết quả
  const optList = document.createElement("div");
  optList.className = "ss-options";

  dropdown.appendChild(search);
  dropdown.appendChild(optList);
  wrapper.appendChild(display);
  wrapper.appendChild(dropdown);

  // Chèn sau select
  select.parentElement.insertBefore(wrapper, select.nextSibling);

  // Dựng danh sách options
  refreshSearchable(selectId);

  // Mở/đóng dropdown
  display.addEventListener("click", (e) => {
    e.stopPropagation();
    // Đóng các dropdown khác
    document.querySelectorAll(".ss-wrapper.open").forEach((w) => {
      if (w !== wrapper) w.classList.remove("open");
    });
    wrapper.classList.toggle("open");
    if (wrapper.classList.contains("open")) {
      search.value = "";
      filterSSOptions(optList, "");
      setTimeout(() => search.focus(), 50);
    }
  });

  // Tìm kiếm
  search.addEventListener("input", () => {
    filterSSOptions(optList, search.value);
  });

  // Không đóng khi click trong dropdown
  dropdown.addEventListener("click", (e) => e.stopPropagation());

  // Click ngoài → đóng
  document.addEventListener("click", () => {
    wrapper.classList.remove("open");
  });
}

function refreshSearchable(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  const wrapper = select.parentElement.querySelector('.ss-wrapper[data-for="' + selectId + '"]');
  if (!wrapper) return;

  const optList = wrapper.querySelector(".ss-options");
  const displayText = wrapper.querySelector(".ss-display-text");
  optList.innerHTML = "";

  let hasOptions = false;

  Array.from(select.options).forEach((opt) => {
    if (!opt.value) return; // Bỏ placeholder
    hasOptions = true;
    const div = document.createElement("div");
    div.className = "ss-option";
    div.textContent = opt.textContent;
    div.dataset.value = opt.value;

    div.addEventListener("click", () => {
      select.value = opt.value;
      select.dispatchEvent(new Event("change"));
      displayText.textContent = opt.textContent;
      wrapper.querySelector(".ss-display").classList.add("selected");
      wrapper.classList.remove("open");
      // Highlight
      optList.querySelectorAll(".ss-option").forEach((o) => o.classList.remove("active"));
      div.classList.add("active");
    });

    optList.appendChild(div);
  });

  // Reset nếu select chưa chọn hoặc không có options
  if (!select.value || !hasOptions) {
    displayText.textContent = "--- Chọn ---";
    wrapper.querySelector(".ss-display").classList.remove("selected");
  }
}

function filterSSOptions(optList, query) {
  const q = query
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const options = optList.querySelectorAll(".ss-option");
  let visibleCount = 0;

  options.forEach((opt) => {
    const text = opt.textContent
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (!q || text.includes(q)) {
      opt.style.display = "";
      visibleCount++;
    } else {
      opt.style.display = "none";
    }
  });

  // Hiển thị thông báo nếu không tìm thấy
  let noResult = optList.querySelector(".ss-no-result");
  if (visibleCount === 0) {
    if (!noResult) {
      noResult = document.createElement("div");
      noResult.className = "ss-no-result";
      noResult.textContent = "Không tìm thấy kết quả";
      optList.appendChild(noResult);
    }
    noResult.style.display = "";
  } else if (noResult) {
    noResult.style.display = "none";
  }
}

// ===== SỰ KIỆN KHI TẢI TRANG =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderOrderSummary();

  // ===== ĐIỀN SẴN THÔNG TIN NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP =====
  // CODE BỞI TRẦN DƯƠNG GIA BẢO
  if (typeof UserManager !== "undefined" && UserManager.isLoggedIn()) {
    const user = UserManager.getCurrentUser();
    const ckName = document.getElementById("ckName");
    const ckPhone = document.getElementById("ckPhone");
    const ckEmail = document.getElementById("ckEmail");
    if (ckName && user.displayName) ckName.value = user.displayName;
    if (ckPhone && user.phone) ckPhone.value = user.phone;
    if (ckEmail && user.email) ckEmail.value = user.email;
  }
  // KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

  // Nút áp dụng mã giảm giá
  const btnCoupon = document.querySelector(".btn-coupon");
  if (btnCoupon) btnCoupon.addEventListener("click", applyCoupon);

  // Enter trên input mã giảm giá
  const couponInput = document.getElementById("couponCode");
  if (couponInput) {
    couponInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") applyCoupon();
    });
  }

  // Chọn phương thức thanh toán
  document.querySelectorAll(".payment-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const method = opt.dataset.method;
      selectPayment(method);
    });
  });

  // Chọn hình thức nhận hàng
  document.querySelectorAll(".shipping-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const method = opt.dataset.method;
      selectShipping(method);
    });
  });

  // Khởi tạo trạng thái mặc định
  selectShipping("delivery"); // Giao hàng tận nơi
  selectPayment("cod"); // Thanh toán khi giao hàng
  initPoints(); // Khởi tạo điểm tích lũy

  // Khởi tạo tìm kiếm cho Tỉnh/TP và Phường/Xã
  makeSearchable("ckCity");
  makeSearchable("ckWard");

  // Chọn khu vực chi nhánh
  const branchCity = document.getElementById("branchCity");
  if (branchCity) {
    branchCity.addEventListener("change", () => {
      renderBranches(branchCity.value);
    });
  }

  // Chọn tỉnh/thành phố - cập nhật phường/xã
  const citySelect = document.getElementById("ckCity");
  if (citySelect) {
    citySelect.addEventListener("change", updateWards);
  }

  // Nút đặt hàng
  const btnPlace = document.getElementById("btnPlaceOrder");
  if (btnPlace) btnPlace.addEventListener("click", placeOrder);

  // Click overlay popup thành công
  const overlay = document.getElementById("successOverlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSuccess();
    });
  }
});

/* 
========================================================================================

                            KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

/* 
========================================================================================

                            BẮT ĐẦU CODE BỞI TRẦN GIA BẢO

========================================================================================
*/

// Cấu hình ngân hàng
const CONFIG = {
  BANK_ID: "MB", // Ngân hàng MB Bank
  ACC_NO: "398383979",
  ACC_NAME: "TRAN GIA BAO",
  TEMPLATE: "qr_only", // 'compact', 'compact2', hoặc 'qr_only'
};

// Hàm updateQRCode() - Cập nhật mã QR thanh toán với số tiền hiện tại
function updateQRCode() {
  const loader = document.getElementById("qrLoader");
  const qrImg = document.getElementById("qrImage");

  // 1. Lấy số tiền từ giao diện
  let totalStr = document.getElementById("grandTotal").innerText;
  let amount = totalStr.replace(/[^0-9]/g, ""); // Chỉ lấy số

  // 2. Tạo nội dung chuyển khoản
  let orderId = "GB" + Math.floor(1000 + Math.random() * 9000);
  let desc = `GIBOR ${orderId}`;

  // Cập nhật text hiển thị
  document.getElementById("displayAmount").innerText =
    parseInt(amount).toLocaleString() + "đ";
  document.getElementById("displayDesc").innerText = desc;

  // 3. Gọi API VietQR
  // Cấu trúc: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<NAME>
  const qrUrl = `https://img.vietqr.io/image/${CONFIG.BANK_ID}-${CONFIG.ACC_NO}-${CONFIG.TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(CONFIG.ACC_NAME)}`;

  // Hiển thị loader trong khi tải ảnh
  qrImg.style.display = "none";
  loader.style.display = "block";

  qrImg.src = qrUrl;

  qrImg.onload = function () {
    loader.style.display = "none";
    qrImg.style.display = "block";
  };

  qrImg.onerror = function () {
    loader.style.display = "none";
    alert("Không thể tải mã QR. Vui lòng kiểm tra kết nối mạng.");
  };
}

/* 
========================================================================================

                            KẾT THÚC CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
