/* ========================================================================
   MOBILE.JS — Drawer, Bottom Nav, Footer Accordion, Bottom Sheet helpers
   ======================================================================== */
(function () {
  'use strict';

  // ===== CONSTANTS =====
  const MOBILE_BP = 768;
  const IS_ANDROID = /Android/i.test(navigator.userAgent || '');
  
  // Page detection
  const path = location.pathname.replace(/\\/g, '/');
  const page = path.split('/').pop() || 'index.html';

  function safeParseJSON(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  }

  function getCurrentPageKey() {
    if (['login.html', 'register.html'].includes(page)) return 'account';
    return page;
  }

  function setBodyScrollLock(locked) {
    if (IS_ANDROID) {
      document.body.classList.remove('m-lock-scroll');
      return;
    }
    document.body.classList.toggle('m-lock-scroll', !!locked);
  }

  function recoverScrollLockState() {
    const overlay = document.getElementById('m-drawer-overlay');
    const shouldLock = !!(overlay && overlay.classList.contains('open') && isMobile());
    setBodyScrollLock(shouldLock);
    if (overlay) {
      overlay.style.pointerEvents = shouldLock ? 'auto' : 'none';
    }
  }

  function cleanupDesktopArtifacts() {
    const overlay = document.getElementById('m-drawer-overlay');
    if (overlay) overlay.remove();

    const bottomNav = document.getElementById('m-bottom-nav');
    if (bottomNav) bottomNav.remove();

    const tabs = document.querySelector('.m-category-tabs');
    if (tabs) tabs.remove();

    const menuContainer = document.querySelector('.menu-container') || document.querySelector('.menu-section')?.parentElement;
    if (menuContainer) menuContainer.style.removeProperty('padding-top');

    const header = document.querySelector('.header');
    if (header) {
      header.style.removeProperty('position');
      header.style.removeProperty('top');
      header.style.removeProperty('left');
      header.style.removeProperty('right');
      header.style.removeProperty('width');
      header.style.removeProperty('z-index');
    }

    setBodyScrollLock(false);
    window.setMobileDrawerState = null;
  }

  function syncHeaderHeightVar() {
    const header = document.querySelector('.header');
    if (!header) return;
    const height = Math.ceil(header.getBoundingClientRect().height || 56);
    document.documentElement.style.setProperty('--m-header-h', `${height}px`);
  }

  // ===== UTILITY =====
  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  // ===== DRAWER =====
  function initDrawer() {
    if (!isMobile()) return;
    // Create drawer overlay + drawer if not exists
    if (document.getElementById('m-drawer-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'm-drawer-overlay';
    overlay.className = 'm-drawer-overlay';

    const isLoggedIn = localStorage.getItem('loggedInUser');
    const user = isLoggedIn ? safeParseJSON(isLoggedIn, null) : null;
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
    const currentPageKey = getCurrentPageKey();
    overlay.querySelectorAll('.m-drawer-nav a').forEach(a => {
      if (a.dataset.page === currentPageKey) a.classList.add('active');
    });

    // Close handlers
    const setDrawerState = (open) => {
      overlay.classList.toggle('open', open);
      setBodyScrollLock(open && isMobile());
      overlay.style.pointerEvents = open ? 'auto' : 'none';
    };
    const closeDrawer = () => setDrawerState(false);
    overlay.querySelector('.m-drawer-close').addEventListener('click', closeDrawer);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeDrawer();
    });
    overlay.querySelectorAll('.m-drawer-nav a').forEach((a) => {
      a.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    // Handle viewport changes: always close drawer when leaving mobile layout.
    window.addEventListener('resize', function () {
      if (!isMobile()) closeDrawer();
    });

    window.setMobileDrawerState = setDrawerState;

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
    if (toggle.dataset.mDrawerBound === '1') return;
    toggle.dataset.mDrawerBound = '1';
    toggle.addEventListener('click', function (e) {
      if (!isMobile()) {
        recoverScrollLockState();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById('m-drawer-overlay');
      if (!overlay) return;
      const open = !overlay.classList.contains('open');
      if (typeof window.setMobileDrawerState === 'function') {
        window.setMobileDrawerState(open);
      } else {
        overlay.classList.toggle('open', open);
      }
    });
  }

  // ===== BOTTOM NAVIGATION =====
  function initBottomNav() {
    if (!isMobile()) return;
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
    const user = safeParseJSON(localStorage.getItem('loggedInUser'), null);
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
    const currentPageKey = getCurrentPageKey();
    nav.querySelectorAll('a[data-page]').forEach(a => {
      if (a.dataset.page === currentPageKey) a.classList.add('active');
    });

    document.body.appendChild(nav);
  }

  function getCartCount() {
    try {
      const cart = safeParseJSON(localStorage.getItem('cart') || '[]', []);
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
    if (!isMobile()) return;
    if (page !== 'menu.html') return;
    if (document.querySelector('.m-category-tabs')) return;

    const sections = document.querySelectorAll('.menu-section');
    if (!sections.length) return;

    const tabs = document.createElement('div');
    tabs.className = 'm-category-tabs';
    tabs.style.position = 'fixed';
    tabs.style.left = '0';
    tabs.style.right = '0';
    tabs.style.zIndex = '998';

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
        const y = sec.getBoundingClientRect().top + window.scrollY - headerH - tabsH - 14;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
      tabs.appendChild(btn);
    });

    // Insert after header or at top of main content
    const menuContainer = document.querySelector('.menu-container') || document.querySelector('.menu-section')?.parentElement;
    if (menuContainer) {
      menuContainer.insertBefore(tabs, menuContainer.firstChild);

      const syncTabsOffset = () => {
        if (!isMobile()) {
          menuContainer.style.removeProperty('padding-top');
          return;
        }
        syncHeaderHeightVar();
        const header = document.querySelector('.header');
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--m-header-h')) || 56;
        if (header) {
          header.style.position = 'fixed';
          header.style.top = '0';
          header.style.left = '0';
          header.style.right = '0';
          header.style.width = '100%';
          header.style.zIndex = '999';
        }
        tabs.style.top = `${headerH}px`;
        menuContainer.style.paddingTop = `${headerH + tabs.offsetHeight + 12}px`;
      };

      syncTabsOffset();
      window.addEventListener('resize', syncTabsOffset);
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

  // ===== MEDIA PERFORMANCE =====
  function optimizeImagesForMobile() {
    if (!isMobile()) return;
    const images = document.querySelectorAll('img');
    images.forEach((img, idx) => {
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
      // Keep first few visuals eager for perceived speed; defer the rest.
      if (idx > 2 && !img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (idx > 2 && !img.hasAttribute('fetchpriority')) {
        img.setAttribute('fetchpriority', 'low');
      }
    });
  }

  // ===== INIT =====
  function init() {
    // Ensure stale lock class is never carried across history restores.
    setBodyScrollLock(false);

    let mobileMode = isMobile();

    syncHeaderHeightVar();
    window.addEventListener('resize', syncHeaderHeightVar);
    window.addEventListener('orientationchange', syncHeaderHeightVar);
    window.addEventListener('pageshow', syncHeaderHeightVar);
    window.addEventListener('orientationchange', recoverScrollLockState);
    window.addEventListener('pageshow', recoverScrollLockState);

    bindMenuToggle();

    if (mobileMode) {
      initDrawer();
      initBottomNav();
      initFooterAccordion();
      initCategoryTabs();
      optimizeImagesForMobile();
    } else {
      cleanupDesktopArtifacts();
    }

    window.addEventListener('resize', () => {
      const nextMobileMode = isMobile();
      if (nextMobileMode === mobileMode) return;
      mobileMode = nextMobileMode;

      if (mobileMode) {
        initDrawer();
        initBottomNav();
        initFooterAccordion();
        initCategoryTabs();
        optimizeImagesForMobile();
      } else {
        cleanupDesktopArtifacts();
      }
    });

    // Keep cart badge fresh when coming back from background / navigation.
    ['focus', 'pageshow', 'visibilitychange', 'storage'].forEach((evt) => {
      window.addEventListener(evt, () => {
        if (evt === 'visibilitychange' && document.hidden) return;
        recoverScrollLockState();
        window.updateBottomNavBadge();
      });
    });

    // Safety net: if drawer is closed but class remains, unlock scroll.
    recoverScrollLockState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
