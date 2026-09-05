# CLAUDE.md

ไฟล์นี้ให้คำแนะนำแก่ Claude Code (claude.ai/code) เมื่อทำงานกับโค้ดในโปรเจกต์นี้

## สถานะของโปรเจกต์

โปรเจกต์นี้คือ **AI Perfumery Formulation Assistant** — ระบบผู้ช่วยปรุงน้ำหอมที่คำนวณจากฟิสิกส์เคมีจริง (ไม่ใช่ Generative AI เดาข้อความ) พื้นที่นี้เป็นหลักส่วนงานเอกสาร requirements/design ของโปรเจกต์เต็ม — งานส่วนใหญ่ที่มีอยู่ตอนนี้อยู่ภายใต้โฟลเดอร์ `docs/` และ**ยังไม่มี tech stack/framework ตัดสินใจสำหรับระบบเต็ม** (`docs/02-design/02-technical/technology-stack.md` คือจุดที่จะกำหนดเรื่องนี้เมื่อมีการตัดสินใจแล้ว) — **อย่าสมมติ**ว่ามี stack อยู่แล้วสำหรับงานส่วนนี้ ความคืบหน้าของแต่ละขั้นตอน (requirements/design/testing) ไม่เท่ากัน — บางไฟล์มีเนื้อหาแล้ว บางไฟล์/โฟลเดอร์ยังว่างรอเนื้อหาอยู่ ให้ตรวจสถานะจริงของแต่ละไฟล์ก่อนอ้างอิงหรือแก้ไข อย่าเชื่อคำอธิบายสถานะที่เขียนไว้ในเอกสารฉบับเก่า

นอกจากงานเอกสาร repo นี้ยังมี**ซอร์สโค้ดจริงชิ้นเล็ก** ภายใต้ `Submission-RAISE-M2-HW1/prototype/` (ดูหัวข้อ "งานส่งย่อยที่มีโค้ดจริง" ด้านล่างสำหรับคำสั่งรัน) — เป็นการบ้านคนละชุดกับเอกสาร `docs/` เต็มระบบ ให้แยกบริบทสองส่วนนี้ออกจากกันเสมอเวลาถูกขอให้ช่วยงาน

## ภาพรวมระบบที่กำลังวางแผน

**สรุปโดเมนอย่างย่อ** (รายละเอียดเต็มอยู่ใน `reference/` — อ่านจากที่นั่นเสมอเมื่อต้องการบริบทลึก):
ระบบช่วยนักปรุงน้ำหอม (Perfumer) ออกแบบสูตรน้ำหอม 50–80 สาร โดยแก้ 3 ปัญหาหลัก — **Scent Drift** (สูตรหลงทาง), **Muddy Accord** (กลิ่นตีกันไร้มิติ), และ **Cost & IFRA Risk** สถาปัตยกรรมเป็น **Two-Engine Core**: **Engine A** (Physics & Chemistry) คำนวณตัวเลขจริง ห้ามเดา — **Engine B** (Generative NLP) แปลผลของ Engine A เป็นคำบรรยายกลิ่นเท่านั้น **ไม่มีสิทธิ์แก้ตัวเลข** โดยมี **Human-in-the-loop Layer** ให้นักปรุงตัดสินใจขั้นสุดท้ายเสมอ

**กติกาโดเมนที่ห้ามละเมิดเมื่อเขียนเอกสารทุกชั้น:**
- ห้ามออกแบบให้ Engine B (NLP) แก้ไข/สร้างตัวเลขทางเคมีเอง — ทุกตัวเลขต้องมาจาก Engine A เท่านั้น
- **IFRA Compliance** และ **Olfactory Detection Threshold (ODT)** เป็นข้อบังคับ ต้องมี NFR/AC กำกับเสมอ
- มนุษย์ต้องแทรกแซง/ยกเลิกคำแนะนำของระบบได้เสมอ (ห้ามออกแบบให้ระบบตัดสินใจแทนแบบปิดตาย)
- ห้ามอ้างตัวเลขทางเคมี/ผลลัพธ์ที่ไม่ปรากฏใน `reference/` หรือ spec จริง (กัน Hallucination)

เอกสารข้อกำหนด (ไฟล์ Markdown ใน `docs/01-requirements/01-spec/` — อาจมีมากกว่า 1 ไฟล์ตามความต้องการที่ทยอยเพิ่มเข้ามา ให้ดูรายการไฟล์จริงในโฟลเดอร์นี้แทนการอ้างชื่อไฟล์เจาะจง) คือแหล่งอ้างอิงเดียวที่บอกว่าระบบที่กำลังวางแผนคือระบบอะไร มีขอบเขตแค่ไหน และมีบทบาทผู้ใช้แบบใด **ห้ามสมมติโดเมนหรือฟีเจอร์ของระบบจากความจำหรือจากตัวอย่างโปรเจกต์อื่น** ให้เปิดอ่านไฟล์ spec จริงก่อนตอบคำถามเกี่ยวกับภาพรวมระบบเสมอ (โดเมนของระบบกำหนดโดยผู้ใช้และเปลี่ยนได้ในแต่ละช่วงของโปรเจกต์ ส่วนนี้ของ CLAUDE.md จึงตั้งใจไม่ระบุเจาะจงไว้ เพื่อไม่ให้ล้าสมัยเมื่อโดเมนเปลี่ยน)

กติกาที่คงที่ไม่ว่าโดเมนของระบบจะเป็นอะไร (มาจากรูปแบบของเอกสารทั้งวอลต์ ไม่ใช่จากตัวระบบที่วางแผนอยู่):
- ทุกความต้องการเชิงฟังก์ชัน/ไม่ใช่เชิงฟังก์ชันมีรหัสกำกับ (`FR-xx` / `NFR-xx`) และระดับความสำคัญ (สูง/กลาง/ต่ำ โดย "สูง" คือสิ่งที่ต้องมีใน MVP) — ดูสรุปล่าสุดที่ `docs/01-requirements/backlog.md`
- เอกสารทุกชั้นอ้างอิงกันด้วย `[[wikilink]]` แบบ Obsidian และควรอ้างอิงกลับไปยัง spec ต้นทางเสมอ
- ให้ตรวจสถานะจริงของ spec ก่อนอ้างอิงหรือแก้ไข อย่าเชื่อคำอธิบายภาพรวมระบบที่เคยเขียนไว้ในเอกสารฉบับเก่า (รวมถึงหัวข้อนี้เอง หากมีใครเติมรายละเอียดเจาะจงไว้ในอนาคตแล้วโดเมนถูกเปลี่ยนภายหลัง)

## โครงสร้างพื้นที่เอกสาร (`docs/`)

โปรเจกต์นี้ใช้รูปแบบโฟลเดอร์แบ่งตามขั้นตอน SDLC โดยมีลำดับเลขนำหน้า เมื่อสร้างเอกสารใหม่ ให้ใส่ในโฟลเดอร์ขั้นตอนที่ตรงกัน อย่าสร้างตำแหน่งใหม่เอง:

```
reference/                        เอกสารต้นทางดิบของโปรเจกต์ (READ-ONLY — ห้ามแก้ไข ใช้เป็นวัตถุดิบเท่านั้น)
  AI_Perfumery_Complete_Submission.md    Problem/Solution/ROI/Rule Sheet Overview
  AI_Perfumery_Project_Brief_ForAttachment.md   ขอบเขตงาน + การแบ่งบทบาท
  AI_Perfumery_System_Architecture.md    สถาปัตยกรรมระบบฉบับเต็ม
  AI_Perfumery_Matrix_Engine_Design_v2.md  บันทึกการออกแบบ Matrix Engine (Key Features + Roadmap)
  design_prompt_ai_perfumery_dashboard.md  บรีฟงานออกแบบ Dashboard (ต้นทางของ DESIGN.md)

docs/
  00-archived/                    เอกสารที่เลิกใช้/ถูกแทนที่แล้ว
  01-requirements/
    01-spec/                      เอกสารความต้องการทุกฉบับ (1 ไฟล์ต่อ 1 requirement/หัวข้อ ตั้งชื่อแบบ `YYYYMMDD-NN-<slug>.md`) — ดูรายการไฟล์จริงในโฟลเดอร์นี้เสมอ อาจมีมากกว่า 1 ไฟล์
    02-plan/
      release-plan.md              แผนแบ่ง phase/release ก่อนเริ่ม dev จริง (จัดกลุ่ม FR/NFR ตามลำดับที่ควรทำก่อน-หลัง พร้อมเหตุผล)
    03-task/
      {phase-slug}-tasks.md         การแตกงานย่อยระดับ implementation ต่อ phase (อ้างอิง release-plan.md) เขียนแบบไม่ผูก tech stack จนกว่าจะมีการตัดสินใจจริง
    backlog.md                    Backlog รวม FR/NFR ทั้งหมดจากทุกไฟล์ใน 01-spec/ (ตรวจสถานะ/เนื้อหาจริงในไฟล์ก่อนอ้างอิง)
  02-design/
    01-prototypes/<date>-<n>-<version>/   โฟลเดอร์ Prototype แบบมีวันที่และเวอร์ชัน (HTML mockup, prototype.md)
    02-technical/
      architecture.md              สถาปัตยกรรมระดับ logical/conceptual (component, data flow) — ไม่ผูก tech stack จนกว่า technology-stack.md จะถูกตัดสินใจ
      api-spec.md                  สัญญา API เชิง logical (resource/operation/request-response) ไม่ผูก framework
      db-spec.md                   โมเดลข้อมูลเชิง logical (entity/attribute/ความสัมพันธ์) ไม่ผูก database engine
      detailed-design/{feature-slug}.md   การออกแบบระดับ component ต่อฟีเจอร์ อ้างอิง api-spec.md/db-spec.md
      nfr-review.md                ตรวจสอบว่าการออกแบบ (architecture/api-spec/db-spec/detailed-design) รองรับทุก NFR ใน backlog หรือไม่
      technology-stack.md          ยังไม่ตัดสินใจ — รอจนกว่าจะเริ่มพัฒนาจริง
    feature-list.md
    user-journey.md
    DESIGN.md                     Design System หลัก (สี, ตัวอักษร, ระยะห่าง, องค์ประกอบ UI) — อ้างอิงก่อนทำ Prototype ใน 01-prototypes/
  03-testing/
    01-test-plan/
      acceptance-criteria.md      เกณฑ์ยอมรับ (Given-When-Then) ต่อ FR/NFR จัดกลุ่มตาม feature-list
      test-plan.md                 ภาพรวมกลยุทธ์ทดสอบ 1 ไฟล์ต่อโปรเจกต์ (scope, ประเภทการทดสอบ, environment, entry/exit criteria)
      test-cases/{feature-slug}.md Test case แบบ step-by-step ต่อฟีเจอร์ อ้างอิง acceptance-criteria.md
    02-test-result/                ผลการรันทดสอบจริง — ยังไม่มีเอกสาร/agent ดูแล เพราะโปรเจกต์ยังไม่มีซอร์สโค้ดให้ทดสอบจริง
  04-retrospectives/
  05-log/
  06-module2-homework/            หลักฐานส่งงาน Submission-RAISE-M2-HW1 (เช่น screenshot Firebase Console) — อยู่นอกลำดับ SDLC ปกติโดยตั้งใจ เพราะผูกกับการบ้าน Module 2 ไม่ใช่ vault เอกสารระบบเต็ม (ดูหัวข้อ "งานส่งย่อยที่มีโค้ดจริง" ด้านล่าง)
  .obsidian/                      Vault นี้เปิด/แก้ไขด้วย Obsidian — Markdown + wikilink คือรูปแบบหลักของพื้นที่นี้เช่นกัน
```

ไฟล์ในโฟลเดอร์ที่มีวันที่ (เช่น prototypes) ใช้รูปแบบชื่อ `YYYYMMDD-NN-<slug>` ให้คงรูปแบบนี้ต่อไปเมื่อสร้างไฟล์ใหม่ที่มีวันที่กำกับ เพื่อให้เรียงตามลำดับเวลาได้ถูกต้อง

เนื่องจาก `docs/` เป็น Obsidian vault เมื่อเพิ่มเนื้อหาใหม่ ควรใช้การอ้างอิงข้ามเอกสารแบบ `[[wikilink]]` เสมอ เพื่อให้เอกสารทุกชั้นสาวกลับไปหา spec ต้นทางได้

**สำคัญ:** `reference/` เป็นแหล่งข้อมูลดิบ (read-only) ห้ามแก้ไขไฟล์ในนั้น และห้ามเขียนเอกสารงานลงไปในนั้น — ผลงานทุกชิ้นต้องอยู่ใน `docs/` ตามโครงสร้าง SDLC ด้านบนเท่านั้น

## 🔒 ขอบเขตข้อมูล (Data Boundary) — กฎเหล็ก

โฟลเดอร์ `Raise/` นี้เป็น **พื้นที่งานส่งวิชา RAISE เท่านั้น** และจะถูก push ขึ้น GitHub

**ห้ามนำเข้ามาในโฟลเดอร์นี้เด็ดขาด** (ไม่ว่าจะเป็นไฟล์ ข้อความในเอกสาร หรือคำอธิบายประกอบ):
- เอกสารสัญญา / MoU / ข้อตกลงค่าตอบแทน / โครงสร้างหุ้น (equity, vesting)
- เอกสารธรรมาภิบาลและทรัพย์สินทางปัญญา (Governance Charter, Boundary Rules, IP Ownership, Approval Matrix, org chart)
- ข้อมูลส่วนบุคคลของผู้เกี่ยวข้อง (ชื่อ-นามสกุลจริง, เบอร์โทร, อีเมล, LINE ID, ที่อยู่)
- ฐานข้อมูลสารเคมีดิบ ราคาวัตถุดิบ รายชื่อ/CAS Number เต็ม และรายละเอียด Rule Sheet ฉบับสมบูรณ์
- ข้อมูล credential / token / คีย์ใดๆ

เอกสารเหล่านี้เก็บไว้ที่โฟลเดอร์แม่ (`AI Perfumery Engine/docs/`) ซึ่ง**อยู่นอก repo นี้** หากถูกขอให้แก้ไขเอกสารกลุ่มนี้ ให้แก้ที่โฟลเดอร์แม่เท่านั้น **ห้ามคัดลอกเข้ามาใน `Raise/`** และห้ามอ้างอิงเนื้อหาของมันในเอกสารใน `docs/`

`.gitignore` ของ repo นี้กัน `reference/` และไฟล์กลุ่มข้างต้นไว้แล้ว — **ห้ามแก้ `.gitignore` ให้ปล่อยไฟล์เหล่านี้ผ่าน**

## งานส่งย่อยที่มีโค้ดจริง (`Submission-RAISE-M2-HW1/`)

โฟลเดอร์นี้คือ workspace แยกสำหรับการบ้าน Module 2 — **ไม่ใช่ส่วนหนึ่งของ SDLC vault ใน `docs/`** ขอบเขตของงานชิ้นนี้ถูกตัดมาจากภาพรวมระบบเต็มและล็อกไว้ที่ [`SCOPE.md`](SCOPE.md) (root ของ repo): ทำเฉพาะวงจร **สร้างสูตร (Formula) → เก็บ Firestore → ส่งตรวจ (submitted) → อนุมัติ/ตีกลับ (approved/rejected)** โดยบทบาท Perfumer กับ QC Reviewer เดิมเป็นการบ้านที่ 1 (Memory — read-only), ปัจจุบันต่อยอดเป็นการบ้านที่ 2 (สัปดาห์ 7 — Auth/CRUD/ACL/Hosting) แล้ว โดยใช้โฟลเดอร์เดิมต่อเนื่องกันเพราะเป็น Firebase project เดียวกัน

**Firestore collections และสถานะทั้งหมด (ตามที่โจทย์สัปดาห์ 7 กำหนดให้ระบุไว้ตรงนี้):**
- `formulas` (หลัก) — ฟิลด์สำคัญ: `perfumerId` (Auth UID เจ้าของ), `perfumerName`, `fragranceTypeId`/`fragranceTypeName`, `brief`, `status`, `createdAt`
- `formulas/{id}/ingredients` (sub-collection) — `materialName`, `percent`
- `fragranceTypes` (lookup, read-only จาก client) — `name`, `concentrationRange`
- `users` — `email`, `displayName`, `role` (ดู [`ACL.md`](ACL.md))
- **สถานะที่เป็นไปได้ทั้งหมดของ `formulas.status` มีแค่ 4 ค่า:** `draft` → `submitted` → `approved` หรือ `rejected` (ห้ามมีค่าอื่นนอกจากนี้)
- **บทบาทที่เป็นไปได้ทั้งหมดของ `users.role` มีแค่ 2 ค่า:** `perfumer` (default ตอนสมัคร) และ `qc_reviewer` (ตั้งด้วยมือใน Console เท่านั้น)

- `Submission-RAISE-M2-HW1/prototype/` — โปรเจกต์ Node เล็กๆ ที่มีโค้ดจริง ต่อ Firebase (Firestore + Auth) โปรเจกต์ `sattasarasada-perfume`:
  - `npm install && npm run seed` — รัน `seed.js` เพื่อ seed ข้อมูลตัวอย่าง 5 `formulas` + 3 `fragranceTypes` (พร้อม `ingredients` เป็น sub-collection ต่อสูตร) ข้อมูลทั้งหมดเป็นข้อมูลสมมติเพื่อสาธิต UI เท่านั้น — สูตรที่ seed ไว้ใช้ `perfumerId` สมมติ (ไม่ใช่ Auth UID จริง) จึงใช้สาธิตได้แค่มุมมอง QC Reviewer เท่านั้น ไม่ใช่ CRUD ของบัญชีจริง
  - `public/` — โฟลเดอร์ที่ deploy ขึ้น Firebase Hosting จริง (ตั้งค่าใน `firebase.json`) มี 5 หน้า: `login.html`, `signup.html` (สมัครแล้วได้ `role:"perfumer"` เสมอ, เขียนลง `users/{uid}`), `index.html` (list — filter ตาม role: perfumer เห็นแค่ของตัวเอง, qc_reviewer เห็นทุกสูตร), `formula-new.html` (ฟอร์มสร้างสูตร+วัตถุดิบ), `formula-detail.html` (ปุ่ม ส่งตรวจ/อนุมัติ/ตีกลับ/ลบ ตาม role+status) — ทุกหน้าใช้ `firebase-config.js` ร่วมกัน (ES module เดียว export `auth`/`db`) และการ์ด `onAuthStateChanged` เพื่อ redirect ไป `login.html` ถ้ายังไม่ login
  - `firestore.rules` — บังคับสิทธิ์จริงตาม [`ACL.md`](../../ACL.md) (root ของ repo): ต้อง login ทุก read/write, perfumer เห็น/แก้/ลบได้แค่สูตรตัวเองตอน `draft`, QC เปลี่ยนได้แค่ฟิลด์ `status` ของสูตรที่ `submitted` แล้ว, ห้ามเปลี่ยน `role` ของตัวเอง (กันโปรโมทตัวเองเป็น QC) — deploy คู่กับ hosting ด้วย `firebase deploy --only hosting,firestore:rules`
  - `firebase.json`/`.firebaserc` — คอนฟิก Firebase CLI (ชี้ `public/` เป็น hosting root, project id `sattasarasada-perfume`) ไม่มี secret ใดๆ ปลอดภัยที่จะ commit
  - ไม่มี lint/test ในโฟลเดอร์นี้ — เป็นการบ้านสาธิตเชื่อมต่อฐานข้อมูล/auth/deploy เท่านั้น
- `firebaseConfig` ที่ hardcode ใน `seed.js`/`public/firebase-config.js` เป็น Firebase **client config** (ตั้งใจเป็น public ได้ ไม่ใช่ secret) — ความปลอดภัยจริงมาจาก `firestore.rules` ไม่ใช่การซ่อนค่านี้ — **ห้ามใส่ข้อมูลจริงของบุคคลอื่นลงไปเด็ดขาด** ใช้ข้อมูลสมมติเท่านั้น
- `docs/06-module2-homework/` — โฟลเดอร์รับหลักฐานส่งงาน (เช่น screenshot Firebase Console ที่เห็นข้อมูลใน `formulas` อย่างน้อย 5 รายการ) เก็บไว้ที่นี่ตามที่ `docs/06-module2-homework/README.md` ระบุ ไม่ใช่ตำแหน่งลำดับ SDLC ปกติ (`00-`…`05-`) — อย่าย้าย/ลบโดยไม่ตรวจกับผู้ใช้ก่อน
- `tools/build-submission.py` (รันจาก root ของ `Raise/`: `python tools/build-submission.py`, ต้อง `pip install markdown` ก่อน) — แปลง prototype + test docs ใน `docs/` ให้เป็นชุด HTML ส่งงาน RAISE W3 ไปไว้ที่ `../Submission-RAISE-W3/` (นอก repo โดยตั้งใจ ดู `.gitignore`) นี่คนละชุดกับ `Submission-RAISE-M2-HW1/`

## เครื่องมืออัตโนมัติดูแลความสอดคล้องของเอกสาร (agents & skills)

โปรเจกต์นี้มี custom agents ใน `.claude/agents/` และ skills ใน `.claude/skills/` สำหรับสร้าง/ตรวจสอบความสอดคล้องของเอกสารแต่ละชั้นให้ตรงกับชั้นก่อนหน้าเสมอ ตามลำดับ: spec → `backlog.md` → `feature-list.md`/`user-journey.md` → แตกแขนงขนานกัน 3 สาย (technical spec ใน `02-technical/`, test plan ใน `03-testing/`, prototype ใน `01-prototypes/`) → phase plan ใน `01-requirements/02-plan/`+`03-task/` เมื่อผู้ใช้ขอให้ทำงานที่ตรงกับหน้าที่ของ skill ใดอยู่แล้ว **ให้เรียกใช้ skill/agent นั้นแทนการแก้ไฟล์เอกสารตรงๆ เอง** เพื่อให้การตรวจสอบ cross-file consistency และการบันทึกสรุปงานลง `docs/05-log/{YYYYMMDD}-log.md` เป็นไปตามรูปแบบเดิมของโปรเจกต์

จุดเริ่มต้นที่ใช้บ่อย:
- `/capture-requirement` — แปลง requirement ดิบจากผู้ใช้เป็นเอกสาร spec ใหม่/แก้ไขของเดิม พร้อมอัปเดต backlog
- `/audit-backlog`, `/sync-feature-journey`, `/sync-technical-spec` (รวม architecture → api-spec/db-spec → detailed-design → nfr-review), `/sync-test-plan`, `/sync-phase-plan`, `/build-prototype` — ตรวจสอบและ sync เอกสารแต่ละชั้นให้ตรงกับชั้นก่อนหน้า
- `/run-requirements-phase`, `/run-technical-phase`, `/run-prototype-phase` — รวมหลายขั้นตอนที่เกี่ยวข้องกันไว้ในคำสั่งเดียว
- `/audit-pipeline` — ตรวจสอบความสอดคล้องทั้งสายงานตั้งแต่ spec ถึงปลายทางในคำสั่งเดียว

## แนวทางการทำงานในโปรเจกต์นี้ตอนนี้

- ให้ยึดเอกสารทั้งหมดใน `docs/01-requirements/01-spec/` (ไม่ใช่ไฟล์ใดไฟล์หนึ่งโดยเฉพาะ) เป็นแหล่งอ้างอิงหลักของความต้องการเชิงฟังก์ชัน/ไม่ใช่เชิงฟังก์ชัน (รหัส FR-xx / NFR-xx) — ใช้รหัสเหล่านี้อ้างอิงเมื่อพูดคุยหรือวางแผนฟีเจอร์ และให้ตรวจ `docs/01-requirements/backlog.md` เพื่อดูสรุป FR/NFR ล่าสุดทั้งหมดก่อนเสมอ
- เอกสารออกแบบเชิงเทคนิคใน `docs/02-design/02-technical/` (`architecture.md`, `api-spec.md`, `db-spec.md`, `technology-stack.md` และไฟล์ใน `detailed-design/`) หากยังไม่มีไฟล์หรือยังว่างเปล่า หากถูกขอให้ช่วยออกแบบระบบ ให้สร้าง/เติมเนื้อหาลงในไฟล์เหล่านี้ตามตำแหน่งที่ระบุไว้ในโครงสร้างด้านบน ไม่ควรสร้างเอกสารคู่ขนานแยกที่อื่น
- `docs/02-design/DESIGN.md` คือแหล่งอ้างอิงหลัก (single source of truth) ของ Design System เชิงภาพ (สี, ตัวอักษร, ระยะห่าง, องค์ประกอบ UI, accessibility) — เมื่อสร้างหรือแก้ไข Prototype ใดๆ ใน `01-prototypes/` ให้ยึด token และกติกาใน `DESIGN.md` เสมอ ห้ามกำหนดสี/สไตล์ใหม่นอกเอกสารนี้โดยไม่จำเป็น หากพบว่า Design System ต้องเปลี่ยน ให้แก้ที่ `DESIGN.md` ก่อน แล้วค่อยสะท้อนไปยัง Prototype
- ระบบเต็ม (`docs/` vault) ยังไม่มี package manifest, โครงสร้างซอร์สโค้ด หรือ CI config ใดๆ เมื่อเริ่มพัฒนาจริงแล้ว ควรกลับมาอัปเดตไฟล์นี้ให้มีคำสั่ง build/lint/test และสถาปัตยกรรมโค้ดจริง (ซอร์สโค้ดเล็กๆ ที่มีอยู่ตอนนี้ใน `Submission-RAISE-M2-HW1/` เป็นการบ้านคนละขอบเขต ดูหัวข้อด้านบน)
