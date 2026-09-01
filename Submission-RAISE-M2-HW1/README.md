# การบ้านที่ 1 (Module 2) — ทำให้ระบบมีความจำ

โฟลเดอร์นี้เป็น **workspace แยก** สำหรับการบ้านที่ 1 ของ Module 2 (สัปดาห์ที่ 6)
ไม่ใช่ตัวไฟล์ที่ส่งจริง — ของที่ตรวจจริงคือ **repo `Raise` ทั้งก้อนบน GitHub** (ผู้สอนเปิด URL ตรวจเอง)

- โจทย์เต็ม: https://cnacha-mfu.github.io/raise2-module2/materials/week6/w6-homework.html
- คู่มือเลือกขอบเขต: https://cnacha-mfu.github.io/raise2-module2/materials/shared/homework-scope-guide.html
- ขอบเขตที่เลือกไว้แล้ว: [`../SCOPE.md`](../SCOPE.md) ← ไฟล์นี้ต้องอยู่ที่ **root ของ repo Raise** (ทำไว้ให้แล้ว)

## ต้องส่งอะไร (ภายใน ศุกร์ 4 ก.ย. 2569 ทาง Google Classroom)

ส่ง **URL เดียว** ของ repo `Raise` (https://github.com/sattasarasadaw-crypto/PerfumeRaisework) โดย repo ต้องมีครบ 4 อย่าง:

- [ ] โค้ดระบบ พร้อม commit ในชื่อคุณ **อย่างน้อย 3 ครั้ง** (นับจากนี้ไป ไม่นับ commit เก่าของ Week 3)
- [x] `SCOPE.md` ที่ root ของ repo — ทำไว้แล้ว ([`../SCOPE.md`](../SCOPE.md))
- [ ] โฟลเดอร์ `docs/06-module2-homework/` — มีภาพเดียวของหน้า Firebase Console ที่เห็นข้อมูลตัวอย่าง ≥5 รายการ
- [ ] หน้ารายการที่อ่านข้อมูลจริงจาก Firestore (แก้ Console → F5 → หน้าเว็บเปลี่ยนตาม)

## สิ่งที่ต้องมี "ก่อน" ลงมือเขียนโค้ด

**ต้องมี Firebase project ส่วนตัวก่อน — ขั้นตอนนี้ต้องทำเองเท่านั้น (สร้างบัญชี/โปรเจกต์ ผู้ช่วย AI ทำแทนไม่ได้):**

1. เข้า https://console.firebase.google.com ด้วย Google account ของคุณ → สร้างโปรเจกต์ใหม่
2. เปิด **Firestore Database** → เลือก **Test mode** (ไม่ใช่ Production mode)
3. ไปที่ Project Settings → คัดลอกค่า `firebaseConfig` (apiKey, projectId ฯลฯ) มาเก็บไว้
4. **ห้าม** ใส่ข้อมูลจริงของคนอื่นลงไป — Test mode เปิดให้ใครก็อ่านได้ ใช้ชื่อสมมติเท่านั้น

เมื่อมี `firebaseConfig` แล้ว ค่อยกลับมาบอก Claude เพื่อ:
- เขียนสคริปต์ seed ข้อมูลตัวอย่างลง `formulas` (5 รายการ) และ `fragranceTypes` (3 รายการ) ตามช่องใน [`../SCOPE.md`](../SCOPE.md)
- ต่อหน้ารายการสูตร (`/formulas`) ให้อ่านจาก Firestore จริง

## ทำตามลำดับ (ประมาณ 2 ชม. รวม)

| ขั้น | งาน | สถานะ |
|---|---|---|
| A | Prototype อยู่บน GitHub อยู่แล้ว (repo `PerfumeRaisework`) | ✅ ข้ามได้ ใช้ repo เดิม |
| B | ร่างโครงสร้างข้อมูลลงกระดาษ (ไม่ต้องส่ง) | ⬜ |
| C | สร้าง Firebase project + Firestore Test mode + seed ข้อมูลตัวอย่าง | ⬜ ต้องทำเองก่อน (ดูด้านบน) |
| D | หน้ารายการอ่านจาก Firestore จริง + พิสูจน์ด้วย F5 | ⬜ |

## เช็กก่อนส่ง

- [ ] repo มี commit ≥3 ครั้งใหม่ ชื่อผู้ทำเป็นชื่อคุณ
- [ ] `docs/06-module2-homework/` มีภาพ Firebase Console เปิดดูได้จากหน้าเว็บ GitHub
- [ ] แก้ข้อมูลใน Console แล้วกด F5 หน้าเว็บเปลี่ยนตาม
- [ ] ไม่มีข้อมูลจริงของบุคคลอื่นอยู่ในฐานข้อมูลเลย
