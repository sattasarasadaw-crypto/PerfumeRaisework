// ค่า config นี้เป็น Firebase Client config (public-safe ตามการออกแบบของ Firebase เอง)
// ความปลอดภัยจริงมาจาก Firestore Security Rules (ดู ../firestore.rules) ไม่ใช่การซ่อนค่าเหล่านี้
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAU--OrJfjajnO5SEod9rjoM4-CRUiDg3E",
  authDomain: "sattasarasada-perfume.firebaseapp.com",
  projectId: "sattasarasada-perfume",
  storageBucket: "sattasarasada-perfume.firebasestorage.app",
  messagingSenderId: "263330698195",
  appId: "1:263330698195:web:d57653b9e847fc492e9526",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
