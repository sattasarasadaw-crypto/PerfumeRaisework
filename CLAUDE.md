# CLAUDE.md

ไฟล์นี้ให้คำแนะนำแก่ Claude Code (claude.ai/code) เมื่อทำงานใน repo `Raise/`

## โฟกัสปัจจุบัน: RAISE Module 3 (เริ่ม 26 ก.ย. 2026)

repo นี้คือพื้นที่งานส่งวิชา **RAISE** ตอนนี้งานหลักคือ **Module 3 — Basic Data Analytics & Data Visualization using AI Vibe Coding**
งานใหม่ทั้งหมดของ Module 3 ให้อยู่ใต้ `Module 3/` (ชื่อโฟลเดอร์มีช่องว่าง — ใส่เครื่องหมายคำพูดครอบ path ทุกครั้ง)
**`Module 3/` เป็น git repo แยกของตัวเอง** (`Module 3/.git`, branch `main`) — repo `Raise` กัน `Module 3/` ไว้ใน `.gitignore` จึงไม่เก็บซ้ำ: commit งาน Module 3 จากในโฟลเดอร์ `Module 3/` เท่านั้น; remote = https://github.com/sattasarasadaw-crypto/baanbrew · `Module 3/.gitignore` กันเฉพาะ `ref/` (สไลด์/เฉลย/ชุด Lab ต้นฉบับ) และไฟล์ความลับ (`.env`, Firebase service account key) — `node_modules/` และ `dist/` ขึ้น GitHub ด้วยตามที่ผู้ใช้สั่ง (27 ก.ย.): **ต้อง `npm run build` ใหม่ก่อน commit ทุกครั้ง** ไม่งั้น `dist/` จะเก่ากว่า `src/`; `node_modules` เป็นของ Windows x64 — ไฟล์ข้อมูล `.csv` นอก `ref/` ขึ้น GitHub ได้ (ผู้ใช้สั่ง 27 ก.ย.; `.gitattributes` `*.csv -text` เก็บตามไบต์เดิม)
**อย่าแตะ `Module2/`** ถ้าผู้ใช้ไม่ได้สั่ง (ดูหัวข้อ Module 2 ด้านล่าง)

### เนื้อหาคอร์ส (จาก `Module 3/ref/`)

กรณีศึกษาทั้งคอร์สคือเครือร้านกาแฟสมมติ **"บ้านบรู" (Baan Brew)** — 5 สาขาในกรุงเทพฯ ข้อมูล 1 เม.ย. 2025 – 20 ก.ย. 2026

| สาขา | ประเภท | หมายเหตุ |
|---|---|---|
| สยาม | ห้าง | |
| สีลม | ออฟฟิศ | |
| อารีย์ | ชุมชน | เปิด 1 พ.ย. 2025 → ข้อมูลน้อยกว่าสาขาอื่น ห้ามเทียบยอดรวมตรง ๆ ใช้ยอดเฉลี่ยต่อวันที่เปิดแทน |
| บางนา | ห้าง | |
| มหาวิทยาลัย | สถานศึกษา | |

| คาบ | วัน | เนื้อหา / Lab |
|---|---|---|
| 1 | ส. 26 ก.ย. บ่าย | Vibe Coding (Prompt → Run → **Verify** → Refine) · Lab 1.1 ตั้งโปรเจกต์ · Lab 1.2 Dashboard: KPI 4 ใบ + กราฟเส้นรายวัน + กราฟแท่งสาขาเรียงมาก→น้อย, ตรวจกับ Pivot Table, push GitHub · การบ้าน: กราฟจำนวนบิลตามชั่วโมง แยกสาขา + ข้อสังเกต ≥3 ข้อ |
| 2 | ~~อา. 27 ก.ย. เช้า~~ **เลื่อน** (อาจารย์แจ้ง 26 ก.ย., วันใหม่ยังไม่ทราบ) | คำถาม → ตัวชี้วัด → กราฟ, ประเภทข้อมูล, mean vs median · Lab 2.1 data profiling + cleaning `sales_raw` ด้วย pandas ใน Colab → `sales_clean.csv` + README บันทึกการตัดสินใจ · Lab 2.2 ซ่อมกราฟแย่ 5 แบบ · Quiz |
| 3 | ~~อา. 27 ก.ย. บ่าย~~ **เลื่อน** (วันใหม่ยังไม่ทราบ) | Lab 3.1 Firebase project + seed script (`firebase-admin`, 3 เดือนล่าสุด, batch ≤500, doc id = `order_id-product_id`) · Lab 3.2 Dashboard real-time (`onSnapshot`, filter วันที่/สาขา, ฟอร์มบันทึกยอดขาย) · Lab 3.3 Google login + Security Rules + deploy (Firebase Hosting หรือ Vercel) · การบ้าน: เสนอหัวข้อโปรเจกต์ 1 ย่อหน้า ส่งก่อน ส. 3 ต.ค. |
| ต่อไป | 3 ต.ค. – 25 ต.ค. | Day 3–4 RFM/Cohort/Pareto/drill-down/แผนที่/forecast/anomaly · Day 5–6 AI สรุปผล/รีวิวภาษาไทย/แชตถามข้อมูล · Day 7 โปรเจกต์ทีม Demo Day · คาบ 7 สอน `daily_summary` |

Stack ของคอร์ส: React 19 + Vite 7 + Tailwind CSS 4 (`@tailwindcss/vite`) + Recharts 3 + PapaParse, Node ≥ 20, Firebase (Firestore/Auth/Hosting) — ต่างจาก Module 2 ที่เป็น HTML ล้วนไม่มี build

### กติกาข้อมูลบ้านบรู (ต้นเหตุตัวเลขผิดเกือบทั้งหมด)

- `sales`: **1 แถว = 1 รายการสินค้า ไม่ใช่ 1 บิล** · จำนวนบิล = จำนวน `order_id` ที่ไม่ซ้ำ · ยอดขาย = `qty × unit_price` · ยอดเฉลี่ยต่อบิล = ยอดขาย ÷ จำนวนบิล
- `customer_id` ว่าง = walk-in ไม่ใช่สมาชิก ไม่นับเป็นลูกค้า · `customer_id`/`product_id` เป็นรหัส ห้ามเอาไปเฉลี่ย
- วันที่ = 10 ตัวอักษรแรกของ `datetime` (เวลาไทย +07:00) — ห้ามใช้ `toISOString()` เพราะเลื่อนไป 1 วัน (UTC)
- แปลง `qty`, `unit_price` เป็น Number ก่อนคำนวณ · กำไรขั้นต้น = `qty × (unit_price − products.cost)` · ช่วงโปรฯ 1 แถม 1 `unit_price` เป็นครึ่งราคา
- `sales_raw`: ห้าม `drop_duplicates` ด้วย `order_id` (ลบแถวดีทิ้งหลายพันแถว) — ให้หาแถวซ้ำทุกคอลัมน์ · การตัดสินใจทำความสะอาดเป็นเรื่องธุรกิจ ต้องจดใน README ว่าตัดอะไร กี่แถว เพราะอะไร
- เดือน ก.ย. 2026 มีแค่ 20 วัน — กราฟรายเดือนต้องบอก/ใช้ยอดเฉลี่ยต่อวัน

**Verify ห้ามข้าม:** เทียบตัวเลขกับ Pivot Table/การคำนวณอิสระก่อนบอกว่าเสร็จ ตัวเลขเฉลยอยู่ในโน้ตผู้สอน (กล่องเหลือง) ใน `Module 3/ref/Day 1–2 · …html` — ตรวจแล้ว (26 ก.ย.) ว่าข้อมูลในชุด student pack ให้ค่าตรงกับเฉลยทุกตัว (ห้ามคัดลอกเฉลยลงไฟล์ที่ commit)

### ⚠️ ข้อควรรู้เกี่ยวกับ `Module 3/ref/` (read-only — ห้ามแก้)

- `Day 1–2 · Data Analytics & Visualization ด้วย AI Vibe Coding.html` = สไลด์คาบ 1–3 **พร้อมโน้ตผู้สอน/เฉลย**; `Day1-2_Data_Analytics_Vibe_Coding.pdf` = สไลด์ชุดเดียวกันแบบรูปภาพ (ไม่มีโน้ต, ไม่มีข้อความให้ค้น)
- `Lab1-…/Lab1/baanbrew-student-pack/` ถูก Google Drive **แปลงไฟล์ตอนดาวน์โหลด**: `.csv` → `.xlsx` (ชื่อชีตยังเป็น `sales.csv` ฯลฯ), `.md` → `.md.docx`, และ `lab1-starter/index.html` กลายเป็น `index.docx` **ว่างเปล่า** → starter รัน Vite ไม่ได้จนกว่าจะสร้าง `index.html` ใหม่ และ `App` ที่ใช้ PapaParse ต้องการ `public/*.csv` ไม่ใช่ `.xlsx` (ต้องแปลงกลับเป็น CSV UTF-8 ก่อน โดยให้คอลัมน์ `datetime` เป็นข้อความเดิม)
- แปลง `.xlsx` → `.csv` (UTF-8 BOM, LF) ไว้ข้างไฟล์เดิมแล้ว (26 ก.ย.) และแปลง `.md.docx` → `.md` แล้ว:
  - `sales.csv` **ตรงกับต้นฉบับจากอาจารย์ทุกไบต์** (อาจารย์ส่งมาให้โดยตรง 26 ก.ย.) → ใช้ได้เต็มที่
  - `sales_raw.csv` **เพี้ยนจากการแปลงของ Drive**: กู้วันที่ `วว/ดด/ปปปป` 212 ช่องที่ Drive อ่านเป็น `ดด/วว` กลับแล้ว แต่ชื่อสาขาที่มีช่องว่างท้าย (เช่น `"สยาม␣"`) ถูกตัดหายไปประมาณ 333 แถว กู้ไม่ได้ (นับชื่อสาขาไม่มาตรฐานได้ 738 เทียบกับเฉลย 1,071; ปี พ.ศ. ได้ 639 เทียบกับเฉลย 630 ยังไม่รู้สาเหตุ) → รอไฟล์ต้นฉบับจากอาจารย์ก่อน Lab 2.1
  - ไฟล์อื่น (`products`, `branches`, `customers`, `thai_holidays`, `reviews_th`) จำนวนแถวตรงกับ README แต่ยังไม่มีต้นฉบับให้เทียบ; คอลัมน์วันที่เขียนเป็น `YYYY-MM-DD` ตามที่สันนิษฐานไว้
- data pack มี 7 ไฟล์: `sales` (53,092), `sales_raw` (53,357), `products` (40), `branches` (5), `customers` (3,000 — มี `phone` ปิดบังบางส่วน ใช้คุยเรื่อง PDPA), `thai_holidays` (26), `reviews_th` (1,503) — `reviews_labels`/`ANSWER_KEY.md` อยู่ในชุดผู้สอน ไม่มีในนี้

## 🔒 Data Boundary — กฎเหล็ก (ใช้กับทุก Module)

repo นี้จะถูก push ขึ้น GitHub **ห้ามนำเข้ามาเด็ดขาด**: เอกสารสัญญา/MoU/equity, Governance/IP/Approval Matrix, ข้อมูลส่วนบุคคลจริง, ฐานข้อมูลสารเคมีดิบ/ราคา/CAS/Rule Sheet เต็ม, credential/token/คีย์ใด ๆ — ของเหล่านี้อยู่ที่โฟลเดอร์แม่ `AI Perfumery Engine/` (นอก repo)

- `.gitignore` กัน `*.csv`, `*.xlsx`, `*.zip`, `*.env`, `*secret*`, `*credential*`, `config.local.*`, `node_modules/` ไว้แล้ว — **ห้ามแก้ให้หลวมลง** (ผลคือไฟล์ข้อมูลบ้านบรูจะไม่ขึ้น GitHub; ถ้า deploy ผ่าน Vercel ที่ build จาก repo จะไม่มีไฟล์ข้อมูล — ถามผู้ใช้ก่อนตัดสินใจทางแก้)
- **Firebase service account key** (Lab 3.1) มีสิทธิ์เต็มฐานข้อมูล: เก็บนอก repo, อ่าน path จาก `.env`, ห้ามวางลงแชต, ถ้าหลุดต้องลบ key ใน Google Cloud Console (ลบไฟล์ใน commit ถัดไปไม่พอ)
- Firebase web config (`apiKey`, `projectId`) เปิดเผยได้ — ความปลอดภัยจริงมาจาก Security Rules; ห้ามปล่อย `allow read, write: if true`
- ตรวจคีย์หลุดที่**ผลลัพธ์ที่ deploy** ด้วย (`dist/`, Hosting) ไม่ใช่แค่ใน repo — เคยหลุดทาง Firebase Hosting มาแล้วใน Module 2
- ก่อนติดตั้งแพ็กเกจ/`npx` ใด ๆ ทำ Security Check ตามกฎ supply chain ใน `~/.claude/CLAUDE.md` (ชื่อแพ็กเกจที่คอร์สใช้ดูจาก `lab1-starter/package.json`)

## โครงสร้าง repo ปัจจุบัน

```
Module 3/            ← งานปัจจุบัน (git repo แยก ไม่อยู่ใน repo Raise)
  ref/               วัสดุคอร์สต้นฉบับ (read-only, gitignored)
  baanbrew-dashboard/  Lab 1 — React + Vite + Tailwind v4 + Recharts + PapaParse (`npm run dev`; ตรรกะคำนวณใน src/lib/metrics.js)
Module2/             งาน Module 2 ทั้งหมด ถูกย้ายมารวมที่นี่ (commit การย้ายแล้ว 26 ก.ย. — ยังไม่ push)
  docs/              SDLC vault เดิม (01-requirements … 06-module2-homework) — Obsidian + [[wikilink]]
  reference/         เอกสารต้นทางเชิงลึก (gitignored, read-only)
  Submission-RAISE-M2-HW1..4/   การบ้าน M2 (HW1/prototype = แอป Formula Review บน Firebase `sattasarasada-perfume`)
  tools/build-submission.py
ACL.md SCOPE.md spec.md BACKLOG.md test-results.md README.md   ของส่ง Module 2 ที่ root (README ยังชี้ path เก่าก่อนย้าย)
.claude/             agents + skills (ส่วนใหญ่เขียนสำหรับ Module 2 — ดูด้านล่าง), launch.json (`baanbrew-dashboard` ใช้ได้; `formula-review-local` ยังชี้ path เก่า `Submission-RAISE-M2-HW1/...`)
```

## Module 2 (เสร็จแล้ว — อ้างอิงเท่านั้น)

ระบบ **Formula Review** (สร้างสูตร → draft → submitted → approved/rejected) บน Firebase: https://sattasarasada-perfume.web.app — ขอบเขตใน `SCOPE.md`, สิทธิ์ใน `ACL.md`, สเปคใน `spec.md`, งานค้างส่งต่อ Module 3 ใน `BACKLOG.md`
- `formulas.status` มีแค่ `draft|submitted|approved|rejected` · `users.role` มีแค่ `perfumer|qc_reviewer`
- ปุ่ม AI เรียก OpenRouter; คีย์อยู่ใน `config.local.js` (gitignored + กันใน `firebase.json` ไม่ให้ deploy); เทสต์ Playwright ใน `Module2/Submission-RAISE-M2-HW1/prototype/tests/` (`npm test`)
- กติกาโดเมนน้ำหอม (Engine A คำนวณตัวเลข, Engine B/NLP ห้ามแก้ตัวเลข, IFRA/ODT ต้องมี NFR/AC, มนุษย์ override ได้เสมอ, ห้ามอ้างตัวเลขเคมีที่ไม่มีใน reference) ยังใช้ถ้า Module 3 ทำโปรเจกต์ทีมเป็นเรื่องน้ำหอม
- agents/skills ใน `.claude/` (`formula-*`, `/capture-requirement`, `/sync-*`, `/audit-pipeline`, `/build-prototype` ฯลฯ) อ้าง path `docs/...` ที่ root ซึ่งย้ายไป `Module2/docs/` แล้ว — **ใช้กับ Module 3 ไม่ได้ตรง ๆ** ต้องแก้ path ก่อนถ้าจะใช้

## วิธีทำงานกับผู้ใช้ใน Module 3

- ทำทีละขั้น ถามยืนยันก่อนขั้นถัดไป ห้ามเดาเนื้อหาที่ไม่มีใน ref (กฎ study/exam ใน `~/.claude/CLAUDE.md`)
- คำอธิบาย/เอกสารเขียนภาษาไทย; ชื่อไฟล์/ตัวแปร/คอลัมน์เป็นอังกฤษ
- แยกโค้ดคำนวณไว้ที่ `src/lib/metrics.js` ตามที่คอร์สกำหนด และอธิบายวิธีคำนวณทุกฟังก์ชันเพื่อให้ผู้ใช้ Verify ได้
