/* ========================================================================
   MOBILE.JS — Drawer, Bottom Nav, Footer Accordion, Bottom Sheet helpers
   ======================================================================== */
(function () {
  'use strict';

  // ===== CONSTANTS =====
  const MOBILE_BP = 768;
  
  // Page detection
  const path = location.pathname.replace(/\\/g, '/');
  const page = path.split('/').pop() || 'index.html';

  // ===== UTILITY =====
  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  // ===== DRAWER =====
  function initDrawer() {
    // Create drawer overlay + drawer if not exists
    if (document.getElementById('m-drawer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'm-drawer-overlay';
    overlay.className = 'm-drawer-overlay';

    const isLoggedIn = localStorage.getItem('loggedInUser');
    const user = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    const authLabel = user ? `Xin chào, ${user.firstName || 'User'}` : 'Đăng nhập';
    const authHref = user ? '#' : 'login.html';
    const authId = user ? 'id="m-drawer-logout"' : '';

    overlay.innerHTML = `
      <div class="m-drawer">
        <div class="m-drawer-header">
          <span class="m-drawer-brand">GIBOR COFFEE</span>
          <button class="m-drawer-close" aria-label="Đóng menu"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <ul class="m-drawer-nav">
          <li><a href="index.html"  data-page="index.html"><i class="fa-solid fa-house"></i> Trang chủ</a></li>
          <li><a href="menu.html"   data-page="menu.html"><i class="fa-solid fa-mug-hot"></i> Menu</a></li>
          <li><a href="cart.html"   data-page="cart.html"><i class="fa-solid fa-cart-shopping"></i> Giỏ hàng</a></li>
          <li><a href="about.html"  data-page="about.html"><i class="fa-solid fa-award"></i> Về chúng tôi</a></li>
          <li><a href="contact.html" data-page="contact.html"><i class="fa-solid fa-paper-plane"></i> Liên hệ</a></li>
        </ul>
        <div class="m-drawer-footer">
          <a class="m-drawer-auth" href="${authHref}" ${authId}>${authLabel}</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Highlight current page
    overlay.querySelectorAll('.m-drawer-nav a').forEach(a => {
      if (a.dataset.page === page) a.classList.add('active');
    });

    // Close handlers
    const closeDrawer = () => overlay.classList.remove('open');
    overlay.querySelector('.m-drawer-close').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeDrawer();
    });

    // Logout handler
    const logoutBtn = document.getElementById('m-drawer-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof UserManager !== 'undefined') {
          UserManager.logout();
        } else {
          localStorage.removeItem('loggedInUser');
        }
        location.href = 'login.html';
      });
    }
  }

  // Toggle drawer from menu toggle btn
  function bindMenuToggle() {
    const toggle = document.querySelector('.menu-toggle, #menuToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById('m-drawer-overlay');
      if (overlay) overlay.classList.toggle('open');
    });
  }

  // ===== BOTTOM NAVIGATION =====
  function initBottomNav() {
    if (document.getElementById('m-bottom-nav')) return;

    const cartCount = getCartCount();
    const badgeHtml = cartCount > 0 ? `<span class="m-nav-badge">${cartCount}</span>` : '';

    const nav = document.createElement('nav');
    nav.id = 'm-bottom-nav';
    nav.className = 'm-bottom-nav';
    nav.setAttribute('aria-label', 'Điều hướng chính');
    nav.innerHTML = `
      <a href="index.html"  data-page="index.html"><i class="fa-solid fa-house"></i><span>Trang chủ</span></a>
      <a href="menu.html"   data-page="menu.html"><i class="fa-solid fa-mug-hot"></i><span>Menu</span></a>
      <a href="cart.html"   data-page="cart.html">${badgeHtml}<i class="fa-solid fa-cart-shopping"></i><span>Giỏ hàng</span></a>
      <a href="login.html"  data-page="login.html"><i class="fa-solid fa-user"></i><span>Tài khoản</span></a>
    `;

    // Detect logged-in user for Account btn
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      const accLink = nav.querySelector('[data-page="login.html"]');
      if (accLink) {
        accLink.href = '#';
        accLink.dataset.page = 'account';
        accLink.querySelector('span').textContent = 'Tài khoản';
        accLink.addEventListener('click', function (e) {
          e.preventDefault();
          // Trigger existing auth dropdown
          const authLink = document.getElementById('authLink');
          if (authLink) authLink.click();
        });
      }
    }

    // Mark active
    nav.querySelectorAll('a[data-page]').forEach(a => {
      if (a.dataset.page === page) a.classList.add('active');
    });

    document.body.appendChild(nav);
  }

  function getCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    } catch (e) {
      return 0;
    }
  }

  // Update badge externally (called when cart changes)
  window.updateBottomNavBadge = function () {
    const badge = document.querySelector('.m-bottom-nav [data-page="cart.html"] .m-nav-badge');
    const count = getCartCount();
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = '';
      } else {
        badge.style.display = 'none';
      }
    } else if (count > 0) {
      const cartLink = document.querySelector('.m-bottom-nav [data-page="cart.html"]');
      if (cartLink) {
        const b = document.createElement('span');
        b.className = 'm-nav-badge';
        b.textContent = count;
        cartLink.insertBefore(b, cartLink.firstChild);
      }
    }
  };

  // ===== FOOTER ACCORDION =====
  function initFooterAccordion() {
    if (!isMobile()) return;
    const cols = document.querySelectorAll('.footer-col');
    cols.forEach((col, i) => {
      if (i === 0) {
        col.classList.add('m-footer-open');
        return;
      }
      const h4 = col.querySelector('h4');
      if (!h4) return;
      h4.addEventListener('click', function () {
        col.classList.toggle('m-footer-open');
      });
    });
  }

  // ===== CATEGORY TABS (menu page) =====
  function initCategoryTabs() {
    if (page !== 'menu.html') return;
    if (document.querySelector('.m-category-tabs')) return;

    const sections = document.querySelectorAll('.menu-section');
    if (!sections.length) return;

    const tabs = document.createElement('div');
    tabs.className = 'm-category-tabs';

    const icons = {
      'Cà phê': '', 'Matcha': '', 'Trà': '', 'Bánh ngọt': '', 'Topping': ''
    };

    sections.forEach((sec, i) => {
      const titleEl = sec.querySelector('.section-title');
      if (!titleEl) return;
      const rawTitle = titleEl.textContent.trim();
      // Extract short name (first 2 words max)
      const shortTitle = rawTitle.split(' ').slice(0, 2).join(' ');
      const icon = Object.keys(icons).find(k => rawTitle.toLowerCase().includes(k.toLowerCase()));
      
      const btn = document.createElement('button');
      btn.className = 'm-category-tab' + (i === 0 ? ' active' : '');
      btn.textContent = (icon ? icons[icon] + ' ' : '') + shortTitle;
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('.m-category-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        // Scroll to section
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--m-header-h')) || 56;
        const tabsH = tabs.offsetHeight;
        const y = sec.getBoundingClientRect().top + window.scrollY - headerH - tabsH - 4;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
      tabs.appendChild(btn);
    });

    // Insert after header or at top of main content
    const menuContainer = document.querySelector('.menu-container') || document.querySelector('.menu-section')?.parentElement;
    if (menuContainer) {
      menuContainer.insertBefore(tabs, menuContainer.firstChild);
    }

    // Update active tab on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (!isMobile()) return;
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--m-header-h')) || 56;
        const tabsH = tabs.offsetHeight;
        const scrollY = window.scrollY + headerH + tabsH + 20;
        let activeIdx = 0;
        sections.forEach((sec, i) => {
          if (sec.offsetTop <= scrollY) activeIdx = i;
        });
        tabs.querySelectorAll('.m-category-tab').forEach((t, i) => {
          t.classList.toggle('active', i === activeIdx);
        });
        // Auto-scroll tab into view
        const activeTab = tabs.querySelector('.m-category-tab.active');
        if (activeTab) {
          activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });
  }

  // ===== INIT =====
  function init() {
    initDrawer();
    bindMenuToggle();
    initBottomNav();
    initFooterAccordion();
    initCategoryTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
