/* 
========================================================================================

                                    CODE BỞI TRẦN GIA BẢO

========================================================================================
*/

// GỬI CONTACT
const contactForm = document.getElementById("contactForm");
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".closeBtn");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. KIỂM TRA HỢP LỆ
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const btn = contactForm.querySelector(".btn-send");
    const originalText = btn.innerText;

    // 2. LẤY DỮ LIỆU FORM
    const formData = new FormData(contactForm);

    const contactData = {
      hoTen: formData.get("fullname") || "",
      soDienThoai: formData.get("phone") || "",
      loiNhan: formData.get("message") || "",
      thoiGianGui: new Date().toLocaleString("vi-VN"),
    };

    // 3. HIỆU ỨNG ĐANG GỬI
    btn.innerText = "Đang gửi...";
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";

    // 4. GIẢ LẬP GỬI DỮ LIỆU
    setTimeout(() => {
      // 5. TẠO FILE JSON VÀ TẢI XUỐNG
      const jsonString = JSON.stringify(contactData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `contact-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 6. HIỆN MODAL
      if (modal) {
        modal.style.display = "block";
      }

      // 7. KHÔI PHỤC NÚT
      btn.innerText = originalText;
      btn.style.opacity = "1";
      btn.style.pointerEvents = "all";

      // 8. RESET FORM
      contactForm.reset();
    }, 1500);
  });
}

// ĐÓNG MODAL
if (closeBtn && modal) {
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
}

window.onclick = (event) => {
  if (modal && event.target === modal) {
    modal.style.display = "none";
  }
};

/* 
========================================================================================

                                KẾT THÚC CODE BỞI TRẦN GIA BẢO

========================================================================================
*/
