/* 
========================================================================================

                                     CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/

/**
 * firebase.js - Cấu hình Firebase cho toàn bộ ứng dụng
 *
 * File này khởi tạo Firebase App và export đối tượng `auth`
 * để các module khác (loginregister.js,...) sử dụng.
 *
 * SDK: Firebase v10 modular (tree-shakable)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Cấu hình Firebase — lấy từ Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCnHG40t4WN230Alu4ia0cvzKhfndeBfpE",
  authDomain: "coffee-a718c.firebaseapp.com",
  projectId: "coffee-a718c",
  storageBucket: "coffee-a718c.firebasestorage.app",
  messagingSenderId: "37237991343",
  appId: "1:37237991343:web:035a77871af9b41476315a",
  measurementId: "G-YSS8HXMN6R",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Export Firebase Auth để dùng ở các module khác
export const auth = getAuth(app);

/*
  Lưu ý: phần logic đăng nhập (Google/GitHub) nằm trong loginregister.js
  để giữ firebase.js chỉ chứa cấu hình cơ bản.
*/

/* 
========================================================================================

                                    KẾT THÚC CODE BỞI NGUYỄN THẾ ANH

========================================================================================
*/
