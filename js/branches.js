/* 
========================================================================================

                                   CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/

(function () {
  "use strict";

  const state = {
    filteredBranches: [],
    activeBranchId: "",
  };

  const elements = {};

  function getElements() {
    elements.cityFilter = document.getElementById("branchCityFilter");
    elements.searchInput = document.getElementById("branchSearch");
    elements.resultCount = document.getElementById("branchResultCount");
    elements.branchGrid = document.getElementById("branchGrid");
    elements.branchEmpty = document.getElementById("branchEmpty");

    elements.detailPanel = document.getElementById("branchDetailPanel");
    elements.detailImage = document.getElementById("detailImage");
    elements.detailName = document.getElementById("detailName");
    elements.detailCity = document.getElementById("detailCity");
    elements.detailDistrict = document.getElementById("detailDistrict");
    elements.detailShort = document.getElementById("detailShort");
    elements.detailFull = document.getElementById("detailFull");
    elements.detailAddress = document.getElementById("detailAddress");
    elements.detailPhoneRow = document.getElementById("detailPhoneRow");
    elements.detailPhone = document.getElementById("detailPhone");
    elements.detailEmailRow = document.getElementById("detailEmailRow");
    elements.detailEmail = document.getElementById("detailEmail");
    elements.detailMap = document.getElementById("detailMap");
    elements.detailMapLink = document.getElementById("detailMapLink");
  }

  function formatCountText(count) {
    return count + " chi nhánh";
  }

  function buildMapsLink(address) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(address)
    );
  }

  function renderBranchCards(branches) {
    if (!elements.branchGrid) return;

    if (!branches.length) {
      elements.branchGrid.innerHTML = "";
      elements.branchEmpty.classList.remove("hidden");
      return;
    }

    elements.branchEmpty.classList.add("hidden");

    const html = branches
      .map(
        (branch) => `
          <article class="branch-card" data-branch-id="${branch.id}">
            <img class="branch-card__img" src="${branch.image}" alt="${branch.name}" />
            <div class="branch-card__body">
              <h3 class="branch-card__name">${branch.name}</h3>
              <p class="branch-card__address">
                <i class="fa-solid fa-map-pin"></i> ${branch.address}
              </p>
              <p class="branch-card__desc">${branch.shortDescription}</p>
            </div>
          </article>
        `,
      )
      .join("");

    elements.branchGrid.innerHTML = html;
  }

  function renderBranchDetail(branch) {
    if (!branch || !elements.detailPanel) return;

    elements.detailImage.src = branch.image;
    elements.detailImage.alt = branch.name;
    elements.detailName.textContent = branch.name;
    elements.detailCity.textContent = branch.cityName;
    elements.detailDistrict.textContent = branch.district;
    elements.detailShort.textContent = branch.shortDescription;
    elements.detailFull.textContent = branch.fullDescription;
    elements.detailAddress.textContent = branch.address;

    // Chỉ hiển thị dòng liên hệ khi có dữ liệu.
    if (branch.contactPhone) {
      elements.detailPhoneRow.style.display = "flex";
      elements.detailPhone.textContent = branch.contactPhone;
      elements.detailPhone.href =
        "tel:" + branch.contactPhone.replace(/\s+/g, "");
    } else {
      elements.detailPhoneRow.style.display = "none";
    }

    if (branch.contactEmail) {
      elements.detailEmailRow.style.display = "flex";
      elements.detailEmail.textContent = branch.contactEmail;
      elements.detailEmail.href = "mailto:" + branch.contactEmail;
    } else {
      elements.detailEmailRow.style.display = "none";
    }

    elements.detailMap.src = branch.mapEmbedUrl;
    elements.detailMapLink.href = buildMapsLink(branch.address);
  }

  function highlightActiveCard() {
    if (!elements.branchGrid) return;

    elements.branchGrid.querySelectorAll(".branch-card").forEach((card) => {
      card.classList.toggle(
        "active",
        card.dataset.branchId === state.activeBranchId,
      );
    });
  }

  function updateQueryString(branchId) {
    const url = new URL(window.location.href);
    if (branchId) {
      url.searchParams.set("branch", branchId);
    } else {
      url.searchParams.delete("branch");
    }
    window.history.replaceState({}, "", url.toString());
  }

  function selectBranch(branchId, options) {
    const settings = {
      updateQuery: true,
      scrollToDetail: false,
      ...(options || {}),
    };
    const branch = window.GIBOR_BRANCH_UTILS.getById(branchId);
    if (!branch) return;

    if (elements.detailPanel) {
      elements.detailPanel.style.display = "";
    }

    state.activeBranchId = branch.id;
    renderBranchDetail(branch);
    highlightActiveCard();

    if (settings.updateQuery) {
      updateQueryString(branch.id);
    }

    if (
      settings.scrollToDetail &&
      window.innerWidth <= 768 &&
      elements.detailPanel
    ) {
      elements.detailPanel.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function applyFilters() {
    const cityCode = elements.cityFilter ? elements.cityFilter.value : "all";
    const keyword = elements.searchInput ? elements.searchInput.value : "";

    state.filteredBranches = window.GIBOR_BRANCH_UTILS.search(
      keyword,
      cityCode,
    );
    renderBranchCards(state.filteredBranches);

    if (elements.resultCount) {
      elements.resultCount.textContent = formatCountText(
        state.filteredBranches.length,
      );
    }

    if (!state.filteredBranches.length) {
      state.activeBranchId = "";
      updateQueryString("");
      if (elements.detailPanel) {
        // Ẩn panel chi tiết khi không còn chi nhánh phù hợp bộ lọc.
        elements.detailPanel.style.display = "none";
      }
      return;
    }

    const shouldKeepCurrent = state.filteredBranches.some(
      (branch) => branch.id === state.activeBranchId,
    );
    const branchIdToSelect = shouldKeepCurrent
      ? state.activeBranchId
      : state.filteredBranches[0].id;

    selectBranch(branchIdToSelect, {
      updateQuery: true,
      scrollToDetail: false,
    });
  }

  function getBranchFromUrl() {
    const branchId = new URLSearchParams(window.location.search).get("branch");
    if (!branchId) return null;
    return window.GIBOR_BRANCH_UTILS.getById(branchId);
  }

  function bindEvents() {
    if (elements.cityFilter) {
      elements.cityFilter.addEventListener("change", applyFilters);
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", applyFilters);
    }

    if (elements.branchGrid) {
      elements.branchGrid.addEventListener("click", (event) => {
        const card = event.target.closest(".branch-card");
        if (!card) return;
        selectBranch(card.dataset.branchId, {
          updateQuery: true,
          scrollToDetail: true,
        });
      });
    }
  }

  function initBranchesPage() {
    if (
      !window.GIBOR_BRANCH_UTILS ||
      typeof window.GIBOR_BRANCH_UTILS.search !== "function"
    ) {
      return;
    }

    getElements();
    bindEvents();
    applyFilters();

    // Nếu URL có branch id, ưu tiên hiển thị đúng chi nhánh đó.
    const branchFromUrl = getBranchFromUrl();
    if (branchFromUrl) {
      if (elements.cityFilter) {
        elements.cityFilter.value = branchFromUrl.cityCode;
      }
      applyFilters();
      selectBranch(branchFromUrl.id, {
        updateQuery: true,
        scrollToDetail: false,
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initBranchesPage);
})();
/* 
========================================================================================

                                    KẾT THÚC CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/