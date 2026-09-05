# การบ้านที่ 2 (Module 2) — ระบบรู้จักผู้ใช้ และออกสู่โลก (สัปดาห์ที่ 7)

โฟลเดอร์นี้เป็น **workspace แยก** สำหรับการบ้านที่ 2 ของ Module 2 (สัปดาห์ที่ 7)
ต่อยอดจากการบ้านที่ 1 ([`../Submission-RAISE-M2-HW1/`](../Submission-RAISE-M2-HW1/)) — **โค้ดจริงยังอยู่ที่เดิม** ที่ [`../Submission-RAISE-M2-HW1/prototype/`](../Submission-RAISE-M2-HW1/prototype/) เพราะเป็น Firebase project เดียวกัน (`sattasarasada-perfume`) ที่ค่อยๆ พัฒนาต่อเนื่องกันในแต่ละสัปดาห์ โฟลเดอร์นี้เก็บแค่ README + screenshot หลักฐานของสัปดาห์นี้

- โจทย์เต็ม (การบ้าน): https://cnacha-mfu.github.io/raise2-module2/materials/week7/w7-homework.html
- แบบฝึกหัดในคาบ (ตัวอย่าง LeaveEasy): https://cnacha-mfu.github.io/raise2-module2/materials/week7/w7-lab-leaveeasy.html
- ขอบเขตโครงงาน: [`../SCOPE.md`](../SCOPE.md)
- สิทธิ์การเข้าถึงตามบทบาท: [`../ACL.md`](../ACL.md)

## 🔴 Live App

> **URL:** _(รอกรอกหลัง `firebase deploy` — ดูขั้นตอนด้านล่าง)_

## ต้องส่งอะไร (ภายใน ศุกร์ 11 ก.ย. 2569 ทาง Google Classroom)

ส่ง **URL เดียว** ของ repo `Raise` (https://github.com/sattasarasadaw-crypto/PerfumeRaisework) โดย repo ต้องมีครบ:

- [x] Source code พร้อม `CLAUDE.md` ที่ไม่มี API key/secret หลุด (ดูหัวข้อ "งานส่งย่อยที่มีโค้ดจริง" ใน root `CLAUDE.md`)
- [ ] `README.md` (ไฟล์นี้) ต้องมี live URL ต่อจากที่ deploy แล้ว
- [x] `ACL.md` ที่ root ของ repo — ทำไว้แล้ว ([`../ACL.md`](../ACL.md))
- [ ] Screenshot หลักฐานใน `docs/` (ดูรายการ checkpoint ด้านล่าง)

## ทำตามลำดับ

| ขั้น | งาน | สถานะ |
|---|---|---|
| A | `CLAUDE.md` อัปเดตครอบคลุม auth/roles/rules แล้ว, `.gitignore` กัน secret เดิมอยู่แล้ว | ✅ |
| B | CRUD ครบ: Create (`formula-new.html`), Read (`index.html`), Update-status-only (`formula-detail.html`), Delete-with-confirm (`formula-detail.html`) | ✅ เขียนโค้ดแล้ว — ต้องทดสอบจริงในเบราว์เซอร์ |
| C | Auth (login/signup/logout, redirect ถ้าไม่ login, `perfumerId`=uid), ACL.md, Firestore Security Rules | ✅ เขียนโค้ดแล้ว — ต้องเปิด Email/Password provider ใน Firebase Console ก่อนทดสอบได้ |
| D | Deploy ขึ้น Firebase Hosting | ⬜ ต้องรันเองในเทอร์มินัล (ดูด้านล่าง) |

## สิ่งที่ต้องทำเองก่อนเริ่มทดสอบ

1. **Firebase Console → Authentication** → เปิด provider **Email/Password** (ถ้ายังไม่เปิด)
2. ทดสอบในเครื่อง: เปิด `../Submission-RAISE-M2-HW1/prototype/public/index.html` ด้วยเบราว์เซอร์ (ไม่ต้องมี server, เหมือน HW1) → ลองสมัคร/login/สร้างสูตร/ส่งตรวจ/ลบ → ปิดเบราว์เซอร์แล้วเปิดใหม่เพื่อพิสูจน์ persistence (Checkpoint B4)
3. เข้า Firebase Console → Firestore → collection `users` → แก้ `role` ของบัญชีทดสอบที่ 2 เป็น `"qc_reviewer"` → login ด้วยบัญชีนั้นเพื่อทดสอบอนุมัติ/ตีกลับ (ดูขั้นตอนละเอียดใน [`../ACL.md`](../ACL.md))
4. ลอง fetch/เปิดหน้าเว็บแบบไม่ login (หรือ Incognito) → ต้องเจอ `permission-denied` → เก็บภาพเป็น **Checkpoint C3**

## Deploy ขึ้น Firebase Hosting

จากโฟลเดอร์ `../Submission-RAISE-M2-HW1/prototype/`:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore:rules
```

`firebase login` จะเปิดเบราว์เซอร์ให้ login ด้วย Google account ของคุณเอง (ขั้นตอนนี้ต้องทำเองเท่านั้น) หลัง deploy สำเร็จจะได้ URL แบบ `https://sattasarasada-perfume.web.app` — เอา URL นี้มาใส่ในหัวข้อ "🔴 Live App" ด้านบน แล้วส่งให้เพื่อนลองเปิดเพื่อทดสอบ **Checkpoint D2** (เพื่อนต้อง login ก่อนถึงจะเห็นข้อมูล)

## เช็กก่อนส่ง

- [ ] Checkpoint 1: repo มี `CLAUDE.md` ไม่มี API key ที่เป็นความลับหลุด (`firebaseConfig` เป็น client config เปิดเผยได้ ไม่ใช่ secret — ดูคำอธิบายใน `CLAUDE.md`)
- [ ] Checkpoint 2: screenshot ก่อน/หลังปิดเบราว์เซอร์ พิสูจน์ข้อมูลยังอยู่
- [ ] Checkpoint 3: screenshot เจอ `permission-denied` ตอนไม่ได้ login
- [ ] Checkpoint 4: screenshot เพื่อนเปิด live URL แล้วต้อง login ก่อน
- [ ] คำตอบ Google Classroom: บทบาทของระบบมีอะไรบ้าง และแต่ละบทบาททำอะไรไม่ได้ (สรุปจาก [`../ACL.md`](../ACL.md) ได้เลย)
- [ ] ไม่มีข้อมูลจริงของบุคคลอื่นอยู่ในฐานข้อมูลเลย (ข้อมูลสมมติทั้งหมด)
