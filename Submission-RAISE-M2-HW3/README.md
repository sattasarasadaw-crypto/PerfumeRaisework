# การบ้านที่ 3 (Module 2) — ใส่ผู้ช่วย AI ในระบบของคุณ (สัปดาห์ที่ 8)

โฟลเดอร์นี้เป็น **workspace แยก** สำหรับการบ้านที่ 3 ของ Module 2 (สัปดาห์ที่ 8)
ต่อยอดจากการบ้านที่ 1/2 ([`../Submission-RAISE-M2-HW1/`](../Submission-RAISE-M2-HW1/), [`../Submission-RAISE-M2-HW2/`](../Submission-RAISE-M2-HW2/)) — **โค้ดจริงยังอยู่ที่เดิม** ที่ [`../Submission-RAISE-M2-HW1/prototype/`](../Submission-RAISE-M2-HW1/prototype/) เพราะเป็น Firebase project เดียวกัน (`sattasarasada-perfume`)

- โจทย์เต็ม (การบ้าน): https://cnacha-mfu.github.io/raise2-module2/materials/week8/w8-homework.html
- แบบฝึกหัดในคาบ (ตัวอย่าง LeaveEasy): https://cnacha-mfu.github.io/raise2-module2/materials/week8/w8-lab-leaveeasy.html
- ขอบเขตโครงงาน: [`../SCOPE.md`](../SCOPE.md) (ดูแถว "🤖 งานที่ AI ช่วย" — ล็อกแนวทางไว้ล่วงหน้าแล้วว่าใช้ AI ตรวจ IFRA เบื้องต้น)
- สิทธิ์การเข้าถึงตามบทบาท: [`../ACL.md`](../ACL.md)

## 🔴 Live App

> **URL:** https://sattasarasada-perfume.web.app

## ต้องส่งอะไร (ภายใน ศุกร์ 18 ก.ย. 2569 ทาง Google Classroom)

ส่ง **URL เดียว** ของ repo `Raise` (https://github.com/sattasarasadaw-crypto/PerfumeRaisework)

- [x] URL repo เดิม
- [x] ปุ่ม AI ใช้งานจริงบนเว็บออนไลน์ (deploy แล้ว + ทดสอบผ่าน dynamic import ทั้งกรณีมี/ไม่มีคีย์)
- [x] ไม่มีคีย์ AI ในที่โล่งของ repo — `config.local.js` อยู่ใน `.gitignore` (ตรวจด้วย `git grep` หาคำนำหน้าคีย์ OpenRouter แล้วไม่พบ)
- [x] URL เว็บออนไลน์เขียนไว้บนสุดของ [`../README.md`](../README.md)

## งานที่ทำ

### ส่วน A: AI ระดับ 1 — `formula-new.html`

ปุ่ม **"🤖 ให้ AI ตรวจ IFRA เบื้องต้น"** อ่าน `brief` + รายการวัตถุดิบที่กรอกในฟอร์ม (ยังไม่บันทึก) ส่งให้โมเดล `google/gemini-2.5-flash-lite` ให้ข้อสังเกตเชิงคุณภาพว่ามีวัตถุดิบที่ควรระวังตาม IFRA หรือไม่

- มีสัญญาณกำลังทำงาน (ปุ่ม disable + เปลี่ยนข้อความ) กันกดซ้ำ
- มีป้ายกำกับชัดเจนว่าเป็น "ข้อสังเกตเบื้องต้นจาก AI — ไม่ใช่ผลตรวจ IFRA อย่างเป็นทางการ"
- ตัดที่ 15 วินาทีด้วย `AbortController` — เรียกไม่สำเร็จ/timeout ไม่ทำให้หน้าค้าง ยังบันทึกสูตรต่อได้ตามปกติ
- ผลลัพธ์ถูกบันทึกลง Firestore จริง (ฟิลด์ `aiIfraNote` ในเอกสาร `formulas/{id}` ตอนกดบันทึกสูตร)
- **AI ไม่ฟันธงผ่าน/ไม่ผ่านและไม่อ้างเลขขีดจำกัดที่แน่นอน** — เป็นไปตามกติกาโดเมนใน root `CLAUDE.md` ("ห้าม Engine B แต่งตัวเลขทางเคมี")

### ส่วน B: AI ระดับ 2 (agentic) — `formula-detail.html`

ปุ่ม **"🤖 ให้ AI สรุปสูตรนี้ให้ QC อ่าน"** (แสดงเฉพาะ QC Reviewer ตอนสูตรเป็น `submitted`) —

1. **อ่านหลายที่**: เอกสาร `formulas/{id}` (name/brief/fragranceTypeName) + subcollection `ingredients` ทั้งหมด
2. **สรุป**: ส่งให้ AI สรุปองค์ประกอบ/แนวกลิ่น + ตั้งข้อสังเกต IFRA เบื้องต้น (ห้ามฟันธงอนุมัติ/ตีกลับ)
3. **จดบันทึก**: เขียนผลลง `formulas.aiSuggestion` (เฉพาะฟิลด์นี้) + เพิ่มประวัติลง subcollection `formulas/{id}/aiLog` (`input`/`output`/`createdAt`)

**AI ไม่ตัดสินแทน** — `status` ไม่ถูกแตะจากปุ่มนี้เลย เปลี่ยนได้เฉพาะตอน QC กด "อนุมัติ"/"ตีกลับ" เองเท่านั้น (คนละฟังก์ชันกัน) ปรับ `firestore.rules` ให้ QC เขียนได้เฉพาะฟิลด์ `aiSuggestion` แยกจากสิทธิ์เปลี่ยน `status` เดิม และเพิ่ม rule ให้ `aiLog` โดยเฉพาะ

## กันคีย์หลุด

- คีย์ OpenRouter (ของหลักสูตร ไม่ใช่ส่วนตัว) เก็บใน `prototype/public/config.local.js` — เพิ่ม pattern เข้า `.gitignore` (root ของ repo) **ก่อน**สร้างไฟล์ จึงไม่เคยเข้า git history เลย
- มีไฟล์แม่แบบ `config.local.example.js` ให้ commit ได้แทน (ไม่มีคีย์จริง)
- ใช้ **dynamic `import()`** ไว้ในตัวจัดการปุ่ม AI เท่านั้น (ไม่ใช่ static import ที่หัวไฟล์) — ถ้าไฟล์คีย์หายไปจะกระทบแค่ปุ่ม AI ปุ่มเดียว ไม่ทำให้ทั้งหน้าโหลดไม่ขึ้น (บทเรียนจากบั๊กที่เจอตอนทำแบบฝึกหัด LeaveEasy สัปดาห์เดียวกัน — static import ที่พังทำให้ทั้งหน้ายื่นใบลา/หน้ารายละเอียดพังไปด้วย)
- `firebase.json` ของ hosting ไม่กัน `config.local.js` ออกจาก deploy โดยตั้งใจ — เพราะเป็นคีย์ของหลักสูตรที่ยอมรับความเสี่ยงได้ และเกณฑ์การบ้านข้อ "ปุ่ม AI ใช้งานจริงบนเว็บออนไลน์" ต้องการให้ทำงานได้จริงบนเว็บสาธารณะ (ไม่ใช่แค่ในเครื่อง) — คีย์ยังไม่ขึ้น GitHub เหมือนเดิมเสมอ
- ตรวจซ้ำก่อน push ด้วย `git grep` หาคำนำหน้าคีย์ OpenRouter ทั่วทั้ง repo — ไม่พบ
