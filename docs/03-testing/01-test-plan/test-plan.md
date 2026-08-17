# Test Plan — AI Perfumery Formulation Assistant

- **อัปเดตล่าสุด:** 2026-08-18
- **เวอร์ชัน:** 1.0
- **ที่มา:** [[../../01-requirements/backlog|Backlog]] · [[../../02-design/feature-list|Feature List]] · [[acceptance-criteria|Acceptance Criteria]]
- **หลักการที่ยึด:** Shift-Left Testing — ตรวจสอบตั้งแต่ชั้น Requirement ไม่รอถึงตอนมีโค้ด

---

## 1. Scope (ขอบเขตการทดสอบ)

### 1.1 สิ่งที่ทดสอบ (In Scope)

| ระดับ | สิ่งที่ทดสอบ | อ้างอิง |
|---|---|---|
| **Functional** | ฟีเจอร์ระดับ Must ทั้ง 8 ตัว | F-01 – F-08 |
| **Functional** | ฟีเจอร์ระดับ Should เมื่อพัฒนาแล้ว | F-09 – F-15 |
| **Non-Functional** | Performance (NFR-01, NFR-02) | เวลาตอบสนองการคำนวณและการตรวจ IFRA |
| **Non-Functional** | Accuracy / Reproducibility (NFR-03) | ผลลัพธ์ deterministic |
| **Non-Functional** | Security (NFR-09) | การแยกข้อมูลระหว่างบัญชี |
| **Non-Functional** | Legal Compliance (NFR-10, NFR-11) | Audit Log 90 วัน, PDPA Consent |
| **Non-Functional** | Usability & Accessibility (NFR-14, NFR-15) | อ่านครบใน 1 หน้าจอ, WCAG 2.1 AA |
| **Document-level** | ความสอดคล้องของเอกสารทุกชั้น | Spec ↔ Backlog ↔ Feature List ↔ Journey ↔ AC |

### 1.2 สิ่งที่ไม่ทดสอบ (Out of Scope)

| ไม่ทดสอบ | เหตุผล |
|---|---|
| ความถูกต้องเชิงเคมีของค่าใน Group Interaction Matrix | เป็นข้อมูลตั้งต้นจากผู้เชี่ยวชาญโดเมน ไม่ใช่ผลลัพธ์ของซอฟต์แวร์ — ตรวจโดยนักปรุงน้ำหอม ไม่ใช่ QA |
| การดมกลิ่นจริงเพื่อยืนยันคำบรรยาย | ต้องผสมจริงในแล็บ อยู่นอกขอบเขตการทดสอบซอฟต์แวร์ |
| ฟีเจอร์ระดับ Won't (W-01 – W-05) | ไม่อยู่ในขอบเขตการพัฒนารอบนี้ |
| ประสิทธิภาพภายใต้ผู้ใช้พร้อมกันจำนวนมาก (Load Test) | เลื่อนไปรอบหลัง MVP |

---

## 2. Test Strategy (กลยุทธ์การทดสอบ)

### 2.1 ระดับและประเภทการทดสอบ

| ระดับ | ประเภท | ทดสอบอะไร | ผู้รับผิดชอบ |
|---|---|---|---|
| **Static** | Document Review | เอกสารทุกชั้นสอดคล้องกันและ map FR ครบ | ทีมพัฒนา + AI audit |
| **Unit** | Automated | ฟังก์ชันคำนวณของ Engine A แต่ละตัว (Synergy, Suppression, Evaporation, ODT) | Developer |
| **Integration** | Automated | Engine A → Threshold Filter → Engine B ส่งข้อมูลถูกต้อง | Developer |
| **System / E2E** | Manual + Automated | Journey ทั้งเส้น UJ-01 และ UJ-02 | QA |
| **Acceptance (UAT)** | Manual | นักปรุงน้ำหอมจริงใช้งานตาม AC ทั้ง 27 ข้อ | Perfumer + PO |
| **Non-Functional** | Performance / Security | NFR-01, NFR-02, NFR-03, NFR-09 | QA + Developer |
| **Accessibility** | Manual + Tool | Contrast ratio ตาม WCAG 2.1 AA | Designer |

### 2.2 แนวทางเฉพาะของโปรเจกต์นี้

| ประเด็น | แนวทาง |
|---|---|
| **Golden Dataset** | เตรียมชุดสูตรมาตรฐาน 10 สูตร ที่มีผลลัพธ์ที่ผู้เชี่ยวชาญยืนยันแล้ว ใช้เป็นชุดอ้างอิงถาวรทุกรอบ regression |
| **ทดสอบ Determinism** | รันสูตรเดียวกัน 100 รอบ ผลลัพธ์ต้องเท่ากันทุกตัวเลข (NFR-03) |
| **ทดสอบเส้นแบ่ง Engine A/B** | ตรวจว่าไม่มีตัวเลขใดใน output ของ Engine B ที่ไม่ปรากฏใน output ของ Engine A (BR-05) |
| **ทดสอบ Boundary Value** | เน้นเคสขอบของกติกา เช่น กลุ่มที่มีสัดส่วน **20.0% พอดี** และ **5.0% พอดี** (BR-04) และ IFRA ที่ **เท่ากับเพดานพอดี** |
| **ทดสอบ Negative Case** | สารไม่มี Micro-Cluster, ผลรวม ≠ 100%, สารที่ไม่มีค่า ODT ในฐานข้อมูล |

### 2.3 เครื่องมือ

> ⚠️ ยังไม่ตัดสินใจ tech stack (ดู `docs/02-design/02-technical/technology-stack.md`) จึงระบุเป็น**ประเภทเครื่องมือ**ไม่ผูกยี่ห้อ

| ประเภท | ใช้ทำอะไร |
|---|---|
| Unit test framework | ทดสอบฟังก์ชันคำนวณของ Engine A |
| E2E / browser automation | ทดสอบ Journey UJ-01, UJ-02 |
| Performance profiler | วัดเวลาตอบสนองตาม NFR-01, NFR-02 |
| Color contrast checker | ตรวจ WCAG 2.1 AA |
| Spreadsheet / diff tool | เทียบผลลัพธ์กับ Golden Dataset |

---

## 3. Test Environment (สภาพแวดล้อมการทดสอบ)

| หัวข้อ | รายละเอียด |
|---|---|
| **Environment** | แยก 3 ชุด: `DEV` (นักพัฒนา) → `TEST` (QA) → `UAT` (นักปรุงน้ำหอมทดลองใช้) |
| **ข้อมูลทดสอบ (Test Data)** | ① Golden Dataset 10 สูตรที่ผู้เชี่ยวชาญยืนยันแล้ว<br>② สูตรเคสขอบ (ผลรวม 99.9%, 100.1%, กลุ่ม 20.0% พอดี)<br>③ สูตรที่จงใจให้ IFRA FAIL<br>④ สูตรที่จงใจให้เข้าเกณฑ์ Muddy Accord |
| **ข้อมูลอ้างอิงที่ต้องพร้อม** | Master Code ของสารทดสอบ, Micro-Cluster Assignment, Group Interaction Matrix, ตารางเพดาน IFRA 51st, ค่า ODT รายสาร |
| **อุปกรณ์/หน้าจอ** | Desktop 1440×900 เป็นค่ามาตรฐาน (ตาม NFR-14) และทดสอบเพิ่มที่ 1920×1080 |
| **บัญชีทดสอบ** | อย่างน้อย 2 บัญชี (User A / User B) เพื่อทดสอบการแยกข้อมูลตาม NFR-09 |
| **ข้อกำหนดด้านข้อมูล** | ⚠️ ห้ามใช้สูตรจริงของลูกค้าเป็น Test Data — ต้องใช้สูตรสมมติเท่านั้น (ความลับทางการค้า NFR-09) |

---

## 4. Risk Management (การบริหารความเสี่ยง)

| # | ความเสี่ยง | ผลกระทบ | แผนรับมือ (Mitigation) |
|---|---|---|---|
| R-01 | **Rule Sheet ฉบับเต็มยังไม่ส่งมอบ** — สูตรคำนวณเชิงลึกยังไม่ทราบ | ทดสอบความถูกต้องของ Engine A ไม่ได้ | ทดสอบด้วยค่าสมมติที่ใส่เข้ามาแทน (mock rule) ก่อน แล้ววางโครง test case ให้เปลี่ยนค่าคาดหวังได้ทันทีเมื่อได้ Rule Sheet จริง |
| R-02 | **ฐานข้อมูล ODT รายสารยังไม่ระบุแหล่ง** (OI-03) | ทดสอบ F-03 ไม่ครบ | ทดสอบด้วยชุดสารที่มีค่า ODT ยืนยันแล้วก่อน และเพิ่มเคสตรวจว่าระบบจัดการอย่างไรเมื่อไม่มีค่า ODT ในฐานข้อมูล |
| R-03 | **IFRA ออก Amendment ใหม่ระหว่างพัฒนา** | ผลทดสอบ IFRA ล้าสมัยทันที | NFR-07 บังคับให้อัปเดตฐาน IFRA ได้โดยไม่แก้โค้ด — ต้องมี test case ยืนยันข้อนี้โดยเฉพาะ |
| R-04 | **เกณฑ์ Scent Drift ยังไม่นิ่ง** (OI-01) | ทดสอบ F-10 ไม่ได้ | เลื่อนการทดสอบ F-10 ออกไปจนกว่าเกณฑ์จะสรุป และไม่นับรวมใน Exit Criteria ของ MVP |
| R-05 | **นักปรุงน้ำหอมไม่ว่างทำ UAT ตามกำหนด** | ปิด UAT ไม่ได้ | นัดล่วงหน้าอย่างน้อย 2 สัปดาห์ และเตรียมสคริปต์ UAT ให้ทำได้ภายใน 1 ชั่วโมง |
| R-06 | **Engine B สร้างตัวเลขเองโดยไม่ตั้งใจ** (Hallucination) | ผิดกติกาหลักของระบบ ความน่าเชื่อถือพัง | ทำ automated test เทียบทุกตัวเลขใน output ของ Engine B กับ output ของ Engine A ทุกครั้งที่ build |

---

## 5. Entry Criteria (เกณฑ์ก่อนเริ่มทดสอบ)

ต้องครบทุกข้อจึงเริ่มรอบทดสอบได้:

- ☐ เอกสาร Requirement, Backlog, Feature List, User Journey และ Acceptance Criteria ผ่านการตรวจความสอดคล้องแล้ว
- ☐ ฟีเจอร์ที่จะทดสอบพัฒนาเสร็จและผ่าน Unit Test ของนักพัฒนาเองแล้ว
- ☐ Test Environment พร้อมใช้งาน และมีข้อมูลอ้างอิงครบ (Matrix, IFRA, ODT)
- ☐ Golden Dataset 10 สูตรพร้อมและได้รับการยืนยันจากผู้เชี่ยวชาญ
- ☐ Test Case ของฟีเจอร์นั้นเขียนเสร็จและผ่านการรีวิว

---

## 6. Exit Criteria (เกณฑ์ก่อนอนุมัติปล่อยขึ้น Production)

ต้องครบทุกข้อจึงถือว่าผ่าน:

| # | เกณฑ์ | ค่าเป้าหมาย |
|---|---|---|
| 1 | Test Case ที่รันแล้ว | **100%** ของ Test Case ทั้งหมด |
| 2 | อัตราการผ่าน (Pass Rate) | **≥ 95%** |
| 3 | ข้อบกพร่องระดับ Critical / High ที่ยังค้าง | **0 รายการ** |
| 4 | Acceptance Criteria ระดับ Must | ผ่าน **ครบทุกข้อ** (27 ข้อ) |
| 5 | NFR ด้าน Performance | NFR-01 ≤ 500 ms และ NFR-02 ≤ 300 ms **ผ่าน** |
| 6 | NFR ด้าน Determinism | รัน 100 รอบผลเท่ากันทุกครั้ง **ผ่าน** |
| 7 | NFR ด้านกฎหมาย | NFR-10 (Log 90 วัน) และ NFR-11 (PDPA) **ผ่าน** |
| 8 | UAT โดยนักปรุงน้ำหอม | ได้รับการยอมรับเป็นลายลักษณ์อักษร |

> **ข้อบกพร่องระดับ Critical** = ผลการคำนวณผิด, Engine B สร้างตัวเลขเอง, ข้อมูลรั่วข้ามบัญชี, IFRA ตรวจผิด
> **ข้อบกพร่องระดับ High** = ฟีเจอร์ Must ใช้งานไม่ได้, Performance เกินเกณฑ์เกิน 2 เท่า

---

## 7. Schedule / Milestones

| Milestone | กิจกรรม | ผู้รับผิดชอบ |
|---|---|---|
| M1 | ทบทวนเอกสารและ Acceptance Criteria | ทีมพัฒนา + PO |
| M2 | เตรียม Test Environment + Golden Dataset | QA + Domain Expert |
| M3 | รอบทดสอบที่ 1 (Functional ระดับ Must) | QA |
| M4 | แก้ข้อบกพร่อง + ทดสอบซ้ำ (Regression) | Developer + QA |
| M5 | ทดสอบ Non-Functional (Performance / Security / Accessibility) | QA |
| M6 | UAT โดยนักปรุงน้ำหอม | Perfumer + PO |
| M7 | สรุปผลการทดสอบและตัดสินใจปล่อย | PO |

> วันที่จริงของแต่ละ Milestone จะกำหนดเมื่อ Release Plan ถูกจัดทำใน `docs/01-requirements/02-plan/release-plan.md`

---

## 8. Deliverables (สิ่งที่ส่งมอบจากการทดสอบ)

| เอกสาร | ตำแหน่ง |
|---|---|
| Acceptance Criteria | [[acceptance-criteria]] |
| Test Case รายฟีเจอร์ | `test-cases/{feature-slug}.md` |
| ผลการทดสอบ (Test Result) | `docs/03-testing/02-test-result/` |
| สรุปบทเรียนหลังรอบทดสอบ | `docs/04-retrospectives/` |

---

## เอกสารที่เกี่ยวข้อง

- Acceptance Criteria: [[acceptance-criteria]]
- Test Cases: [[test-cases/dashboard-aroma-profile]]
- Feature List: [[../../02-design/feature-list]]
- User Journey: [[../../02-design/user-journey]]
