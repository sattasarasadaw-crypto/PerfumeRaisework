# AI Perfumery Formulation Assistant — เอกสารโปรเจกต์

> พื้นที่เอกสาร requirements/design/testing ของระบบผู้ช่วยปรุงน้ำหอมด้วย AI
> จัดทำเป็นงานส่งวิชา **RAISE** (Week 3 — Day 1 & Day 2)

---

## 🔴 ระบบที่ใช้งานได้จริง + รายงานผลการทดสอบ

> ### 🌐 URL ระบบ: **https://sattasarasada-perfume.web.app**
> ### 📊 รายงานผลการทดสอบ: **[`test-results.md`](test-results.md)**

**ของส่งมอบ 5 รายการของ [การบ้านที่ 4 (Module 2 สัปดาห์ที่ 9)](https://cnacha-mfu.github.io/raise2-module2/materials/week9/w9-homework.html)**

| # | ของส่งมอบ | อยู่ที่ |
|---|---|---|
| 1 | 🌐 URL ระบบที่เปิดใช้งานได้จริง | https://sattasarasada-perfume.web.app |
| 2 | 🤖 ไฟล์ตั้งค่าผู้ช่วย 3 ตัว (ระบุโมเดลต่างกันตามงาน) | [`.claude/agents/`](.claude/agents/) — `formula-ui-builder` (haiku) · `formula-data-rules` (opus) · `formula-ai-feature` (sonnet) · `formula-tester` (sonnet) |
| 3 | 🧪 ชุดทดสอบ รวมเทสต์ความปลอดภัย | [`Submission-RAISE-M2-HW1/prototype/tests/`](Submission-RAISE-M2-HW1/prototype/tests/) |
| 4 | 📊 รายงานผลการทดสอบ | [`test-results.md`](test-results.md) |
| 5 | 📝 สิ่งที่ยังไม่เสร็จ ส่งต่อ Module 3 | [`BACKLOG.md`](BACKLOG.md) |

**เอกสารประกอบ:** สเปคฉบับรวม [`spec.md`](spec.md) · ขอบเขตโครงงาน [`SCOPE.md`](SCOPE.md) · สิทธิ์ตามบทบาท [`ACL.md`](ACL.md)
**โค้ดจริง:** [`Submission-RAISE-M2-HW1/prototype/`](Submission-RAISE-M2-HW1/prototype/) · **บันทึกรายสัปดาห์:** [HW1](Submission-RAISE-M2-HW1/README.md) · [HW2](Submission-RAISE-M2-HW2/README.md) · [HW3](Submission-RAISE-M2-HW3/README.md) · [HW4](Submission-RAISE-M2-HW4/README.md)

### 🔒 คีย์ AI ไม่หลุด — ตรวจได้

- ไม่เคยมีคีย์ใน git history เลย (`config.local.js` เข้า `.gitignore` ก่อนถูกสร้าง)
- ตั้งแต่ 20 ก.ย. 2569 คีย์ไม่ถูก deploy ขึ้นเว็บด้วย — `firebase.json` กันไว้อีกชั้น
- มีเทสต์อัตโนมัติ T6 คอยยิงเช็กเว็บจริงว่าไม่มีคีย์หลุด รันทุกครั้งที่ `npm test`

---

## 📦 งานที่ส่ง

### Day 1

| งานที่ต้องส่ง | ไฟล์ | สถานะ |
|---|---|---|
| Feature List จาก Requirement และ Product Backlog | [`docs/02-design/feature-list.md`](docs/02-design/feature-list.md) | ✅ |
| User Journey อย่างน้อย 1 เรื่อง | [`docs/02-design/user-journey.md`](docs/02-design/user-journey.md) | ✅ (ทำ 2 เรื่อง) |
| Test Spec ที่สอดคล้องกับ Journey ที่เลือก | [`docs/03-testing/01-test-plan/`](docs/03-testing/01-test-plan/) | ✅ (AC + Test Plan + Test Case) |

### Day 2

| งานที่ต้องส่ง | ไฟล์ | สถานะ |
|---|---|---|
| Prototype อย่างน้อย 1 หน้า ที่สอดคล้องกับ Journey ที่เลือก | [`docs/02-design/01-prototypes/20260818-01-v1/index.html`](docs/02-design/01-prototypes/20260818-01-v1/index.html) | ✅ |

### เอกสารตั้งต้น (ทำเพิ่มเพราะเป็น input ที่จำเป็น)

| เอกสาร | ไฟล์ |
|---|---|
| Requirement Specification (FR 39 / NFR 15) | [`docs/01-requirements/01-spec/20260818-01-ai-perfumery-core.md`](docs/01-requirements/01-spec/20260818-01-ai-perfumery-core.md) |
| Product Backlog | [`docs/01-requirements/backlog.md`](docs/01-requirements/backlog.md) |
| Design System | [`docs/02-design/DESIGN.md`](docs/02-design/DESIGN.md) |

---

## 🔗 สายความเชื่อมโยงของเอกสาร

```
Requirement Spec ──► Product Backlog ──► Feature List ──► User Journey
   (FR/NFR)                              (MoSCoW)         (Mermaid + FR map)
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                          Acceptance Criteria          Prototype
                          (Given-When-Then)           (+ DESIGN.md)
                                    │
                                    ▼
                          Test Plan + Test Case
```

**ทุกชั้นอ้างอิงกลับไปหาชั้นก่อนหน้าด้วยรหัส `FR-xx` / `NFR-xx` และ Obsidian `[[wikilink]]`**

---

## 📂 โครงสร้างโฟลเดอร์

```
.claude/          Sub Agent 11 ตัว + Agent Skill 14 ตัว
docs/
  01-requirements/  01-spec/ · 02-plan/ · 03-task/ · backlog.md
  02-design/        feature-list.md · user-journey.md · DESIGN.md
                    01-prototypes/ · 02-technical/
  03-testing/       01-test-plan/ (AC, test-plan, test-cases/) · 02-test-result/
  04-retrospectives/
  05-log/           บันทึกการทำงานรายวัน
reference/        เอกสารต้นทางของโครงการ (ไม่ push — อยู่ใน .gitignore)
```

---

## ▶️ วิธีเปิด Prototype

เปิดไฟล์นี้ด้วยเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม (Single-File HTML):

```
docs/02-design/01-prototypes/20260818-01-v1/index.html
```

**สิ่งที่กดลองได้:** แก้ % ของสาร → ผลรวมและ Dashboard คำนวณใหม่ทันที · ดัน `Citral` เกิน 3.0% เพื่อดูสถานะ IFRA FAIL · กดที่ค่า Longevity/Sillage เพื่อดูที่มาของการคำนวณ · ใช้ Command Bar ด้านล่างจอ

รายละเอียดเพิ่มเติม: [`prototype.md`](docs/02-design/01-prototypes/20260818-01-v1/prototype.md)

---

## 🔒 หมายเหตุด้านข้อมูล

repo นี้เก็บ**เฉพาะเอกสารงานส่งวิชา**เท่านั้น
เอกสารเชิงธุรกิจ สัญญา ทรัพย์สินทางปัญญา ฐานข้อมูลสารเคมีดิบ และราคาวัตถุดิบ **ไม่รวมอยู่ใน repo นี้** (ดู `.gitignore`)

ค่าตัวเลขทางเคมีทั้งหมดใน Prototype เป็น**ข้อมูลสมมติเพื่อสาธิต UI** ไม่ใช่ข้อมูลจริงของโครงการ
