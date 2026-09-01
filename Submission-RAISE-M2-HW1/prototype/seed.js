// Module 2 HW1 — seed sample data into Firestore (test mode project sattasarasada-perfume)
// ใช้ Firebase Client SDK ตรง ๆ (ไม่ต้องมี service account key) เพราะฐานข้อมูลเปิด test mode อยู่แล้ว
// รัน: npm install && npm run seed

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU--OrJfjajnO5SEod9rjoM4-CRUiDg3E",
  authDomain: "sattasarasada-perfume.firebaseapp.com",
  projectId: "sattasarasada-perfume",
  storageBucket: "sattasarasada-perfume.firebasestorage.app",
  messagingSenderId: "263330698195",
  appId: "1:263330698195:web:d57653b9e847fc492e9526",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// โฟลเดอร์ประเภท (fragranceTypes) — 3 รายการ ตาม SCOPE.md
const fragranceTypes = [
  { id: "edp", name: "Eau de Parfum", concentrationRange: "15-20%" },
  { id: "edt", name: "Eau de Toilette", concentrationRange: "5-15%" },
  { id: "extrait", name: "Extrait de Parfum", concentrationRange: "20-30%" },
];

// โฟลเดอร์หลัก (formulas) — 5 รายการ ข้อมูลสมมติทั้งหมดเพื่อสาธิต UI เท่านั้น
// แต่ละรายการมี ingredients เป็นโฟลเดอร์ย่อยของตัวเอง (item-specific data)
const formulas = [
  {
    name: "Citrus Morning Draft",
    perfumerId: "perfumer-001",
    perfumerName: "สมชาย ปรุงกลิ่น",
    fragranceTypeId: "edt",
    fragranceTypeName: "Eau de Toilette",
    brief: "กลิ่นสดชื่นตอนเช้า โทนซิตรัส-เขียว เหมาะใส่ทำงาน ไม่ฉุนเกินไป",
    status: "draft",
    ingredients: [
      { materialName: "Bergamot Oil", percent: 8 },
      { materialName: "Lemon Oil", percent: 5 },
      { materialName: "Green Tea Accord", percent: 3 },
    ],
  },
  {
    name: "Velvet Rose Extrait",
    perfumerId: "perfumer-002",
    perfumerName: "มานี กลิ่นหอม",
    fragranceTypeId: "extrait",
    fragranceTypeName: "Extrait de Parfum",
    brief: "กลิ่นกุหลาบเข้มข้น หรูหรา สำหรับใส่ตอนเย็น",
    status: "submitted",
    ingredients: [
      { materialName: "Rose Absolute", percent: 12 },
      { materialName: "Patchouli Oil", percent: 6 },
      { materialName: "Vanilla Accord", percent: 4 },
    ],
  },
  {
    name: "Ocean Breeze EDP",
    perfumerId: "perfumer-001",
    perfumerName: "สมชาย ปรุงกลิ่น",
    fragranceTypeId: "edp",
    fragranceTypeName: "Eau de Parfum",
    brief: "กลิ่นทะเล สดชื่น โทนน้ำ-โอโซนิก",
    status: "approved",
    ingredients: [
      { materialName: "Calone", percent: 2 },
      { materialName: "Marine Accord", percent: 5 },
      { materialName: "Musk Accord", percent: 4 },
    ],
  },
  {
    name: "Spice Market EDP",
    perfumerId: "perfumer-003",
    perfumerName: "วิชัย นักปรุง",
    fragranceTypeId: "edp",
    fragranceTypeName: "Eau de Parfum",
    brief: "กลิ่นเครื่องเทศตลาดตะวันออก โทนอบอุ่น",
    status: "rejected",
    ingredients: [
      { materialName: "Cardamom Oil", percent: 3 },
      { materialName: "Cinnamon Accord", percent: 2 },
      { materialName: "Amber Accord", percent: 7 },
    ],
  },
  {
    name: "Fresh Linen EDT",
    perfumerId: "perfumer-002",
    perfumerName: "มานี กลิ่นหอม",
    fragranceTypeId: "edt",
    fragranceTypeName: "Eau de Toilette",
    brief: "กลิ่นผ้าสะอาดเพิ่งซัก โทนมัสค์อ่อน ๆ",
    status: "submitted",
    ingredients: [
      { materialName: "Clean Musk Accord", percent: 6 },
      { materialName: "Aldehyde C-12", percent: 1 },
    ],
  },
];

async function seed() {
  console.log("Seeding fragranceTypes...");
  for (const ft of fragranceTypes) {
    await setDoc(doc(db, "fragranceTypes", ft.id), {
      name: ft.name,
      concentrationRange: ft.concentrationRange,
    });
    console.log(`  + fragranceTypes/${ft.id}`);
  }

  console.log("Seeding formulas...");
  for (const f of formulas) {
    const { ingredients, ...formulaData } = f;
    const formulaRef = await addDoc(collection(db, "formulas"), {
      ...formulaData,
      createdAt: Timestamp.now(),
    });
    console.log(`  + formulas/${formulaRef.id} (${f.name})`);
    for (const ing of ingredients) {
      await addDoc(collection(formulaRef, "ingredients"), ing);
    }
  }

  console.log("Done: 5 formulas + 3 fragranceTypes seeded.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
