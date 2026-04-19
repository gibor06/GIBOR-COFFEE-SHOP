/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO
                                    
========================================================================================
*/

const NAV_ITEMS = [
  { href: "index.html", label: "Trang chủ" },
  { href: "menu.html", label: "Menu" },
  { href: "branches.html", label: "Chi nhánh" },
  { href: "about.html", label: "Giới thiệu" },
  { href: "contact.html", label: "Liên hệ" },
];

const TOP_BANNER_ITEMS = [
  "Miễn phí giao hàng cho đơn từ 199K",
  "Mở cửa mỗi ngày từ 07:00 đến 22:00",
  "Ưu đãi thành viên mới: giảm 10% đơn đầu tiên",
  "Đặt trước trên website để nhận nhanh tại quầy",
];

function getCurrentPage() {
  const path = window.location.pathname.replace(/\\/g, "/");
  return (path.split("/").pop() || "index.html").toLowerCase();
}

function renderHeaderComponent() {
  const currentPage = getCurrentPage();
  const navLinks = NAV_ITEMS.map(({ href, label }) => {
    const active = currentPage === href.toLowerCase();
    const activeAttrs = active ? ' class="is-active" aria-current="page"' : "";
    return `<li><a href="${href}"${activeAttrs}>${label}</a></li>`;
  }).join("");
  const marqueeItems = TOP_BANNER_ITEMS.map(
    (text) =>
      `<span class="top-marquee__item">${text}</span><span class="top-marquee__dot" aria-hidden="true"></span>`
  ).join("");

  return `
    <div class="top-marquee" role="region" aria-label="Thông báo ưu đãi">
      <div class="top-marquee__track">
        <div class="top-marquee__group">${marqueeItems}</div>
        <div class="top-marquee__group" aria-hidden="true">${marqueeItems}</div>
      </div>
    </div>
    <header class="header">
      <div class="header-container container-xxl px-3 px-md-4">
        <a href="index.html" class="logo" aria-label="GIBOR Coffee - Trang chủ">
          <img src="images/logo/logo.jpg" alt="GIBOR Coffee" />
          <span class="logo-text">
            <strong>GIBOR COFFEE</strong>
          </span>
        </a>

        <nav class="nav" aria-label="Điều hướng chính">
          <ul class="nav-links list-unstyled mb-0">
            ${navLinks}
          </ul>
        </nav>

        <div class="header-actions d-flex align-items-center gap-2">
          <a href="login.html" class="icon-btn auth-btn" id="authLink">
            <i class="fas fa-user"></i>
            <span>Đăng nhập</span>
          </a>
          <a href="cart.html" class="icon-btn cart" aria-label="Giỏ hàng">
            <i class="fas fa-bag-shopping"></i>
            <span>Giỏ hàng</span>
            <span id="cart-count">0</span>
          </a>
          <button class="theme-toggle" id="themeToggle" aria-label="Đổi giao diện">
            🌙
          </button>
          <button class="menu-toggle" id="menuToggle" aria-label="Mở menu">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  `;
}

const FooterComponent = `
    <footer class="footer">
      <div class="footer-container container-xxl">
        <div class="footer-col footer-brand">
          <a href="index.html" class="footer-brand-link" aria-label="GIBOR Coffee">
            <img src="images/logo/logo.jpg" alt="Logo GIBOR Coffee" />
            <div>
              <h3 class="footer-logo">GIBOR COFFEE</h3>
            </div>
          </a>
          <p class="footer-description">
            GIBOR là thương hiệu cà phê rang mộc tập trung vào chất lượng hạt,
            quy trình minh bạch và trải nghiệm phục vụ tử tế mỗi ngày.
          </p>
          <ul class="footer-badges">
            <li><i class="fas fa-seedling"></i> Rang mộc nguyên bản</li>
            <li><i class="fas fa-award"></i> Chất lượng ổn định</li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Khám phá</h4>
          <ul class="footer-links">
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="branches.html">Chi nhánh</a></li>
            <li><a href="about.html">Giới thiệu</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Liên Hệ</h4>
          <ul class="footer-contact">
            <li>
              <i class="fas fa-location-dot"></i>
              <span>140 Lê Trọng Tấn, Tân Phú, TP.HCM</span>
            </li>
            <li>
              <i class="fas fa-phone-volume"></i>
              <a href="tel:0909999999">0909 999 999</a>
            </li>
            <li>
              <i class="fas fa-envelope"></i>
              <a href="mailto:hello@giborcoffee.vn">hello@giborcoffee.vn</a>
            </li>
            <li>
              <a href="branches.html" class="footer-branch-link">Xem tất cả chi nhánh</a>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Kết Nối</h4>
          <ul class="footer-social-note">
            <li>Theo dõi GIBOR để cập nhật menu mới và ưu đãi mỗi tuần.</li>
          </ul>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
            <img src="images/logo/logoHuit.png" alt="GIBOR Coffee" class="logo-footer-huit" />
          </div>
        </div>
      </div>

      <div class="footer-bottom d-flex flex-column flex-md-row justify-content-md-between align-items-md-center gap-2">
        <p>© 2026 GIBOR COFFEE. </p>
        <div class="footer-bottom-links">
          <a href="about.html">Về thương hiệu</a>
          <a href="contact.html">Hỗ trợ khách hàng</a>
        </div>
      </div>
    </footer>
`;

/**
 * Tự động chèn Header và Footer vào các thẻ placeholder
 */
function loadComponents() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = renderHeaderComponent();
  }

  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = FooterComponent;
  }

  // Sau khi chèn xong, nếu có hàm updateCartCount từ cart.js thì gọi để cập nhật số lượng
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

// Chạy ngay khi script được load (nếu placeholder đã có trong DOM)
// Hoặc có thể gọi trong DOMContentLoaded
document.addEventListener("DOMContentLoaded", loadComponents);
