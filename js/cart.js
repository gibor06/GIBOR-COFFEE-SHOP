/* 
========================================================================================

                             CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/

// ==================== LẤY GIỎ HÀNG TỪ LOCALSTORAGE ====================
function getCart() {
  const cart = localStorage.getItem("giborCart");
  return cart ? JSON.parse(cart) : [];
}

// ==================== LƯU GIỎ HÀNG VÀO LOCALSTORAGE ====================
function saveCart(cart) {
  localStorage.setItem("giborCart", JSON.stringify(cart));
}

// ==================== ĐỊNH DẠNG TIỀN VNĐ ====================
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

// ==================== CẬP NHẬT SỐ LƯỢNG TRÊN ICON GIỎ HÀNG (HEADER) ====================
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cập nhật tất cả badge giỏ hàng trên trang
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }

  // Cập nhật nếu có span thứ 3 trong .icon-btn.cart (format cũ)
  const cartBadges = document.querySelectorAll(
    ".icon-btn.cart span:last-child",
  );
  cartBadges.forEach((badge) => {
    badge.textContent = totalItems;
  });
}

// ==================== HIỂN THỊ TOAST THÔNG BÁO ====================
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMessage");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ==================== RENDER GIỎ HÀNG ====================
function renderCart() {
  const cart = getCart();
  const cartEmpty = document.getElementById("cartEmpty");
  const cartContent = document.getElementById("cartContent");
  const cartBody = document.getElementById("cartBody");
  const totalItemsEl = document.getElementById("totalItems");
  const totalPriceEl = document.getElementById("totalPrice");

  if (!cartEmpty || !cartContent || !cartBody) return;

  // Kiểm tra giỏ hàng có trống không
  const isCartEmpty = cart.length === 0;
  cartEmpty.classList.toggle("hidden", !isCartEmpty);
  cartContent.classList.toggle("hidden", isCartEmpty);

  if (isCartEmpty) {
    updateCartCount();
    return;
  }

  // Tính tổng
  let totalItems = 0;
  let totalPrice = 0;

  // Render từng sản phẩm
  let html = "";
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    totalItems += item.quantity;
    totalPrice += subtotal;

    const comboItems =
      Array.isArray(item.comboItems) && item.comboItems.length > 0
        ? item.comboItems
        : typeof window.getComboItemsByName === "function"
          ? window.getComboItemsByName(item.name)
          : [];
    const isCombo = comboItems.length > 0;
    const comboSuffix = isCombo ? ` (${comboItems.join(" + ")})` : "";
    const sugarText = item.sugar ? `Đường: ${item.sugar}` : "";
    const iceText = item.ice ? `Đá: ${item.ice}` : "";
    const noteText = item.note ? `📝 ${item.note}` : "";
    const isFood = item.size === "Mặc định";
    const toppingText =
      item.toppings && item.toppings.length > 0
        ? `Topping: ${item.toppings.map((t) => t.name).join(", ")}`
        : "";

    html += `
      <tr>
        <td data-label="Sản phẩm">
          <div class="cart-product">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-product-info">
              <span class="cart-product-name">${item.name}${comboSuffix}</span>
              ${!isFood ? `<span class="cart-product-options">🍬 ${sugarText} &nbsp;|&nbsp; 🧊 ${iceText}</span>` : ""}
              ${toppingText ? `<span class="cart-product-options">🧁 ${toppingText}</span>` : ""}
              ${noteText ? `<span class="cart-product-note">${noteText}</span>` : ""}
            </div>
          </div>
        </td>
        <td data-label="Size">
          <span class="cart-size">${isFood ? "-" : item.size}</span>
        </td>
        <td data-label="Đơn giá">
          <span class="cart-price">${formatPrice(item.price)}</span>
        </td>
        <td data-label="Số lượng">
          <div class="cart-quantity">
            <button class="btn-quantity" data-index="${index}" data-delta="-1">−</button>
            <span>${item.quantity}</span>
            <button class="btn-quantity" data-index="${index}" data-delta="1">+</button>
          </div>
        </td>
        <td data-label="Thành tiền">
          <span class="cart-subtotal">${formatPrice(subtotal)}</span>
        </td>
        <td data-label="Xóa">
          <button class="btn-remove" data-index="${index}" title="Xóa sản phẩm">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </td>
      </tr>
    `;
  });

  cartBody.innerHTML = html;
  totalItemsEl.textContent = totalItems;
  totalPriceEl.textContent = formatPrice(totalPrice);

  updateCartCount();
  addCartActionListeners();
}

// ==================== GÁN CÁC EVENT LISTENER CHO NÚT TRONG GIỎ HÀNG ====================
function addCartActionListeners() {
  // Nút thay đổi số lượng
  document.querySelectorAll(".btn-quantity").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      const delta = parseInt(e.currentTarget.dataset.delta, 10);
      changeQuantity(index, delta);
    });
  });

  // Nút xóa sản phẩm
  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      removeItem(index);
    });
  });
}

// ==================== THAY ĐỔI SỐ LƯỢNG ====================
function changeQuantity(index, delta) {
  const cart = getCart();

  if (index < 0 || index >= cart.length) return;

  cart[index].quantity += delta;

  // Nếu số lượng <= 0 thì xóa sản phẩm
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    showToast("Đã xóa sản phẩm khỏi giỏ hàng!");
  }

  saveCart(cart);
  renderCart();
}

// ==================== XÓA 1 SẢN PHẨM ====================
function removeItem(index) {
  const cart = getCart();

  if (index < 0 || index >= cart.length) return;

  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  showToast(`Đã xóa "${removedName}" khỏi giỏ hàng!`);
}

// ==================== XÓA TẤT CẢ ====================
function clearCart() {
  if (confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
    saveCart([]);
    renderCart();
    showToast("Đã xóa toàn bộ giỏ hàng!");
  }
}

// ==================== CHUYỂN ĐẾN TRANG THANH TOÁN ====================
function openCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Giỏ hàng trống, không thể thanh toán!");
    return;
  }
  window.location.href = "payment.html";
}

// ==================== KHỞI TẠO KHI TRANG LOAD ====================
document.addEventListener("DOMContentLoaded", () => {
  // Render giỏ hàng
  renderCart();

  // Gắn sự kiện cho các nút
  const btnClear = document.getElementById("btnClearCart");
  if (btnClear) {
    btnClear.addEventListener("click", clearCart);
  }

  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", openCheckout);
  }
});

/* 
========================================================================================

                            KẾT THÚC CODE BỞI TRẦN DƯƠNG GIA BẢO

========================================================================================
*/
