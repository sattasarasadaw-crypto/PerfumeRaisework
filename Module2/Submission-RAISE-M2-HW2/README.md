# การบ้านที่ 2 (Module 2) — ระบบรู้จักผู้ใช้ และออกสู่โลก (สัปดาห์ที่ 7)

โฟลเดอร์นี้เป็น **workspace แยก** สำหรับการบ้านที่ 2 ของ Module 2 (สัปดาห์ที่ 7)
ต่อยอดจากการบ้านที่ 1 ([`../Submission-RAISE-M2-HW1/`](../Submission-RAISE-M2-HW1/)) — **โค้ดจริงยังอยู่ที่เดิม** ที่ [`../Submission-RAISE-M2-HW1/prototype/`](../Submission-RAISE-M2-HW1/prototype/) เพราะเป็น Firebase project เดียวกัน (`sattasarasada-perfume`) ที่ค่อยๆ พัฒนาต่อเนื่องกันในแต่ละสัปดาห์ โฟลเดอร์นี้เก็บแค่ README + screenshot หลักฐานของสัปดาห์นี้

- โจทย์เต็ม (การบ้าน): https://cnacha-mfu.github.io/raise2-module2/materials/week7/w7-homework.html
- แบบฝึกหัดในคาบ (ตัวอย่าง LeaveEasy): https://cnacha-mfu.github.io/raise2-module2/materials/week7/w7-lab-leaveeasy.html
- ขอบเขตโครงงาน: [`../SCOPE.md`](../SCOPE.md)
- สิทธิ์การเข้าถึงตามบทบาท: [`../ACL.md`](../ACL.md)

## 🔴 Live App

> **URL:** https://sattasarasada-perfume.web.app

## ต้องส่งอะไร (ภายใน ศุกร์ 11 ก.ย. 2569 ทาง Google Classroom)

ส่ง **URL เดียว** ของ repo `Raise` (https://github.com/sattasarasadaw-crypto/PerfumeRaisework) โดย repo ต้องมีครบ:

> **หมายเหตุ:** รายการ 4 ข้อด้านล่างคือสิ่งที่โจทย์ **w7-homework.html** (การบ้านจริงที่ต้องส่ง) ระบุไว้ตรงๆ — ส่วน checkpoint แบบ 4 ขั้นที่เคยเขียนไว้ในไฟล์นี้ก่อนหน้านี้มาจาก **w7-lab-leaveeasy.html** (แบบฝึกหัดในคาบ ไม่ใช่เกณฑ์ส่งงานจริง) เก็บไว้ในหัวข้อ "ทดสอบเพิ่มเติม (ไม่บังคับส่ง)" ด้านล่างแทน เพราะยังมีประโยชน์ในการยืนยันว่าระบบทำงานถูกต้อง

- [x] Source code พร้อม `CLAUDE.md` ที่ไม่มี API key/secret หลุด (ดูหัวข้อ "งานส่งย่อยที่มีโค้ดจริง" ใน root `CLAUDE.md`)
- [x] `README.md` (ไฟล์นี้) มี live URL แล้ว: https://sattasarasada-perfume.web.app
- [x] `ACL.md` ที่ root ของ repo — ทำไว้แล้ว ([`../ACL.md`](../ACL.md))
- [x] ภาพใน `docs/` แสดง "หน้าต่างส่วนตัวที่เข้าไม่ได้ตอนไม่ login" — [`../../docs/06-module2-homework/w7-permission-denied-incognito.png`](../../docs/06-module2-homework/w7-permission-denied-incognito.png) (Incognito + URL bar + Console เห็น `403 Forbidden`/`permission-denied` ชัดเจน)

## ทำตามลำดับ

| ขั้น | งาน | สถานะ |
|---|---|---|
| A | `CLAUDE.md` อัปเดตครอบคลุม auth/roles/rules แล้ว, `.gitignore` กัน secret เดิมอยู่แล้ว | ✅ |
| B | CRUD ครบ: Create (`formula-new.html`), Read (`index.html`), Update-status-only (`formula-detail.html`), Delete-with-confirm (`formula-detail.html`) | ✅ ทดสอบจริงแล้ว (signup→create→submit→persistence-after-reload→delete-cancel ผ่านหมด) — ยังขาดแค่ยืนยัน delete-confirm กด OK จริง |
| C | Auth (login/signup/logout, redirect ถ้าไม่ login, `perfumerId`=uid), ACL.md, Firestore Security Rules | ✅ ทดสอบจริงแล้ว — role flip เป็น `qc_reviewer` ใช้งานได้, perfumer/QC เห็นข้อมูลตาม scope ที่ถูกต้อง |
| D | Deploy ขึ้น Firebase Hosting + Firestore Rules | ✅ deploy สำเร็จแล้ว — ยืนยัน `permission-denied` จริงตอนไม่ login และ live URL ใช้งานได้ |

## ทดสอบเพิ่มเติม (ไม่บังคับส่ง — มาจากแบบฝึกหัดในคาบ)

รายการนี้ไม่ใช่สิ่งที่โจทย์ w7-homework.html บังคับให้ส่ง แต่เป็นขั้นตอนตรวจสอบที่มีประโยชน์ (ได้ทำและยืนยันผ่านหมดแล้ว):

1. Firebase Console → Authentication → เปิด provider Email/Password — ✅
2. สมัคร/login/สร้างสูตร/ส่งตรวจ/ลบ → ปิดเบราว์เซอร์แล้วเปิดใหม่พิสูจน์ persistence — ✅ ทดสอบผ่านแล้ว
3. flip `role` เป็น `qc_reviewer` ใน Firebase Console → login ทดสอบอนุมัติ/ตีกลับ — ✅ ทดสอบผ่านแล้ว
4. เปิด Incognito แบบไม่ login → เจอ `permission-denied` — ✅ ยืนยันแล้ว (ภาพอยู่ใน `docs/06-module2-homework/`)
5. ส่ง live URL ให้เพื่อนเปิดจากเครื่องอื่น (พิสูจน์ deploy ใช้งานได้จริงข้ามเครื่อง) — ยังไม่ได้ทำ (ไม่บังคับตามโจทย์การบ้าน)

## Deploy ขึ้น Firebase Hosting

จากโฟลเดอร์ `../Submission-RAISE-M2-HW1/prototype/`:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore:rules
```

`firebase login` จะเปิดเบราว์เซอร์ให้ login ด้วย Google account ของคุณเอง (ขั้นตอนนี้ต้องทำเองเท่านั้น) หลัง deploy สำเร็จจะได้ URL แบบ `https://sattasarasada-perfume.web.app` — เอา URL นี้มาใส่ในหัวข้อ "🔴 Live App" ด้านบน (ทำไปแล้ว — ดูด้านบน)
