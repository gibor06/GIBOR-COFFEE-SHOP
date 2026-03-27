/* 
========================================================================================

                                    CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/

(function () {
  "use strict";

  // Danh sách gốc 15 chi nhánh.
  const BRANCH_BASE_LIST = [
    {
      id: "hcm1",
      cityCode: "hcm",
      cityName: "TP. Hồ Chí Minh",
      district: "Tân Phú",
      name: "GIBOR Lê Trọng Tấn",
      address: "140 Lê Trọng Tấn, Tây Thạnh, Tân Phú, TP. Hồ Chí Minh",
      image: "images/Branch/TPHCM2.jpg",
    },
    {
      id: "hcm2",
      cityCode: "hcm",
      cityName: "TP. Hồ Chí Minh",
      district: "Quận 1",
      name: "GIBOR Nguyễn Huệ",
      address: "263 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      image: "images/Branch/TPHCM1.jpg",
    },
    {
      id: "hcm3",
      cityCode: "hcm",
      cityName: "TP. Hồ Chí Minh",
      district: "Quận 3",
      name: "GIBOR Võ Văn Tần",
      address: "123 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh",
      image: "images/Branch/TPHCM3.jpg",
    },
    {
      id: "hcm4",
      cityCode: "hcm",
      cityName: "TP. Hồ Chí Minh",
      district: "TP. Thủ Đức",
      name: "GIBOR Xa lộ Hà Nội",
      address: "77 Xa lộ Hà Nội, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
      image: "images/Branch/TPHCM4.jpg",
    },
    {
      id: "hcm5",
      cityCode: "hcm",
      cityName: "TP. Hồ Chí Minh",
      district: "Bình Thạnh",
      name: "GIBOR Điện Biên Phủ",
      address: "23 Điện Biên Phủ, Phường 15, Bình Thạnh, TP. Hồ Chí Minh",
      image: "images/Branch/TPHCM5.jpg",
    },
    {
      id: "hn1",
      cityCode: "hn",
      cityName: "Hà Nội",
      district: "Cầu Giấy",
      name: "GIBOR Trần Duy Hưng",
      address: "81 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
      image: "images/Branch/HANOI1.jpg",
    },
    {
      id: "hn2",
      cityCode: "hn",
      cityName: "Hà Nội",
      district: "Đống Đa",
      name: "GIBOR Láng Hạ",
      address: "66 Láng Hạ, Láng Hạ, Đống Đa, Hà Nội",
      image: "images/Branch/HANOI2.jpg",
    },
    {
      id: "hn3",
      cityCode: "hn",
      cityName: "Hà Nội",
      district: "Hai Bà Trưng",
      name: "GIBOR Bạch Mai",
      address: "115 Bạch Mai, Bạch Mai, Hai Bà Trưng, Hà Nội",
      image: "images/Branch/HANOI3.jpg",
    },
    {
      id: "hn4",
      cityCode: "hn",
      cityName: "Hà Nội",
      district: "Ba Đình",
      name: "GIBOR Hoàng Hoa Thám",
      address: "632 Hoàng Hoa Thám, Vĩnh Phúc, Ba Đình, Hà Nội",
      image: "images/Branch/HANOI4.jpg",
    },
    {
      id: "hn5",
      cityCode: "hn",
      cityName: "Hà Nội",
      district: "Long Biên",
      name: "GIBOR Nguyễn Văn Cừ",
      address: "334 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội",
      image: "images/Branch/HANOI5.jpg",
    },
    {
      id: "dn1",
      cityCode: "dn",
      cityName: "Đà Nẵng",
      district: "Ngũ Hành Sơn",
      name: "GIBOR Võ Nguyên Giáp",
      address: "567 Võ Nguyên Giáp, Mỹ An, Ngũ Hành Sơn, Đà Nẵng",
      image: "images/Branch/DANANG2.jpg",
    },
    {
      id: "dn2",
      cityCode: "dn",
      cityName: "Đà Nẵng",
      district: "Hải Châu",
      name: "GIBOR Bạch Đằng",
      address: "453 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng",
      image: "images/Branch/DANANG1.jpg",
    },
    {
      id: "dn3",
      cityCode: "dn",
      cityName: "Đà Nẵng",
      district: "Hải Châu",
      name: "GIBOR Nguyễn Văn Linh",
      address: "638 Nguyễn Văn Linh, Nam Dương, Hải Châu, Đà Nẵng",
      image: "images/Branch/DANANG3.jpg",
    },
    {
      id: "dn4",
      cityCode: "dn",
      cityName: "Đà Nẵng",
      district: "Liên Chiểu",
      name: "GIBOR Tôn Đức Thắng",
      address: "53 Tôn Đức Thắng, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng",
      image: "images/Branch/DANANG4.jpg",
    },
    {
      id: "dn5",
      cityCode: "dn",
      cityName: "Đà Nẵng",
      district: "Cẩm Lệ",
      name: "GIBOR Cách Mạng Tháng Tám",
      address: "55 Cách Mạng Tháng Tám, Khuê Trung, Cẩm Lệ, Đà Nẵng",
      image: "images/Branch/DANANG5.jpg",
    },
  ];

  const BRANCH_IMAGE_BY_CITY = {
    hcm: "images/banner/hero-bg.jpg",
    hn: "images/about/about1.jpg",
    dn: "images/about/about2.jpg",
  };

  const BRANCH_CONTACT_BY_CITY = {
    hcm: { phone: "0909 999 999", email: "hcm@giborcoffee.com" },
    hn: { phone: "024 3999 0999", email: "hanoi@giborcoffee.com" },
    dn: { phone: "0236 3888 999", email: "danang@giborcoffee.com" },
  };

  function createDescriptions(branch) {
    const shortDescription =
      "Không gian ấm cúng tại " +
      branch.district +
      ", phù hợp làm việc nhanh, gặp gỡ bạn bè và thư giãn cuối ngày.";

    const fullDescription =
      branch.name +
      " là điểm dừng chân quen thuộc của khách hàng tại khu vực " +
      branch.district +
      ". Chi nhánh được thiết kế theo tinh thần tối giản, ấm áp, tập trung vào trải nghiệm cà phê sạch, phục vụ nhanh và thân thiện. Đây là nơi phù hợp để làm việc cá nhân, gặp đối tác hoặc tận hưởng khoảng nghỉ nhẹ nhàng giữa nhịp sống đô thị.";

    return { shortDescription, fullDescription };
  }

  function createMapEmbedUrl(address) {
    return (
      "https://www.google.com/maps?q=" +
      encodeURIComponent(address) +
      "&output=embed"
    );
  }

  function normalizeText(text) {
    return (text || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();
  }

  const branches = BRANCH_BASE_LIST.map((branch, index) => {
    const contact = BRANCH_CONTACT_BY_CITY[branch.cityCode] || {};
    const descriptions = createDescriptions(branch);

    return {
      ...branch,
      order: index + 1,
      image:
        branch.image ||
        BRANCH_IMAGE_BY_CITY[branch.cityCode] ||
        "images/logo/logo.jpg",
      shortDescription: descriptions.shortDescription,
      fullDescription: descriptions.fullDescription,
      contactPhone: contact.phone || "",
      contactEmail: contact.email || "",
      mapEmbedUrl: createMapEmbedUrl(branch.address),
    };
  });

  const branchById = {};
  const branchesByCity = { hcm: [], hn: [], dn: [] };

  branches.forEach((branch) => {
    branchById[branch.id] = branch;
    if (!branchesByCity[branch.cityCode]) branchesByCity[branch.cityCode] = [];
    branchesByCity[branch.cityCode].push(branch);
  });

  function cloneBranch(branch) {
    return branch ? { ...branch } : null;
  }

  // Expose dữ liệu và helper dùng chung cho các trang khác.
  window.GIBOR_BRANCHES = branches.map(cloneBranch);
  window.GIBOR_BRANCH_UTILS = {
    all() {
      return branches.map(cloneBranch);
    },
    getByCity(cityCode) {
      return (branchesByCity[cityCode] || []).map(cloneBranch);
    },
    getById(branchId) {
      return cloneBranch(branchById[branchId]);
    },
    search(keyword, cityCode) {
      const normalizedKeyword = normalizeText(keyword);
      const list =
        cityCode && cityCode !== "all"
          ? branchesByCity[cityCode] || []
          : branches;

      if (!normalizedKeyword) return list.map(cloneBranch);

      return list
        .filter((branch) => {
          const haystack = normalizeText(
            [
              branch.name,
              branch.address,
              branch.cityName,
              branch.district,
              branch.shortDescription,
            ].join(" "),
          );
          return haystack.includes(normalizedKeyword);
        })
        .map(cloneBranch);
    },
  };
})();
/* 
========================================================================================

                                    KẾT THÚC CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/