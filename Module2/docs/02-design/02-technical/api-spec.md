# API Spec — AI Perfumery Formulation Assistant

- **อัปเดตล่าสุด:** 2026-08-28
- **ระดับเอกสาร:** Operation Contract — **ไม่ผูกกับ protocol ใดๆ** (ห้ามอ่านว่าเป็น REST/GraphQL/gRPC, ไม่มี HTTP method/path)
- **ที่มา:** [[architecture|Architecture]] ← [[../feature-list|Feature List]] + [[../user-journey|User Journey]] ← [[../../01-requirements/backlog|Product Backlog]] ← [[../../01-requirements/01-spec/20260818-01-ai-perfumery-core|Requirement Spec]] + [[../../01-requirements/01-spec/20260818-02-prohibited-substance-blocking|Prohibited Substance Blocking Spec]] + [[../../01-requirements/01-spec/20260818-03-formulation-manager-role|Formulation Manager Role Spec]]
- **สถานะ `[[technology-stack]]`:** ยังไม่มีไฟล์ / ยังไม่ตัดสินใจ — operation ด้านล่างเขียนในระดับ **สัญญาการทำงาน (contract)** เท่านั้น
- **คู่กันกับ:** [[db-spec|DB Spec]] — ทุก field ใน input/output ของ operation ต้องตรงกับ attribute ของ entity ใน db-spec.md

> **รูปแบบการเขียนแต่ละ Operation:** ชื่อ (verb+noun) · บทบาทที่เรียกได้ · Input · Output · กฎทางธุรกิจ · กรณี Error หลัก · FR/NFR ที่เกี่ยวข้อง

---

## 1. หลักการออกแบบ

1. **Client ไม่คำนวณตรรกะเอง** — ทุก operation ที่มีตรรกะเคมี/กฎหมาย/AI ประมวลผลที่ Backend Service เสมอ ตาม [[architecture#1. ภาพรวม (Overview)|architecture.md §1]]
2. **สิทธิ์ตามความเป็นเจ้าของ (NFR-09)** — ทุก operation ที่เข้าถึง `Formula`/`FormulaVersion`/`Substance` (คลังส่วนตัว) ต้องตรวจว่าผู้เรียกเป็น `owner_ref` เท่านั้น ยกเว้นระบุไว้เป็นอย่างอื่นชัดเจน
3. **บทบาทผู้ใช้** อ้างอิงตาม [[../../01-requirements/01-spec/20260818-01-ai-perfumery-core#2. บทบาทผู้ใช้ (User Roles)|Requirement Spec §2]]: Perfumer, Formulation Manager, Data Steward
4. **ไม่มี operation ใดให้ Engine B เขียนตัวเลขกลับเข้า Engine A** — สอดคล้อง FR-19/BR-05 การไหลของข้อมูลเป็นทางเดียวเสมอ (Engine A → Threshold Filter → Engine B)
5. **Performance เป็นคุณสมบัติของ operation ไม่ใช่ error case** — operation ที่ต้องเสร็จภายใน NFR-01 (500ms) หรือ NFR-02 (300ms) ระบุไว้ในหัวข้อกฎทางธุรกิจของ operation นั้น ไม่ใช่กรณี error แยก

---

## 2. ตารางสรุป Operation ตามโมดูล

| โมดูล | จำนวน Operation | อ้างอิง Component ใน architecture.md |
|---|---|---|
| A. Identity, Access & Consent | 7 | [[architecture#3.2 Identity, Access & Audit Module (F-08)|Identity, Access & Audit Module]] |
| B. Formula Management (รวม Prohibited Substance Guard) | 9 | [[architecture#3.3 Formula Management Module (F-01, F-15, F-16, F-19)|Formula Management Module]] |
| C. Core Calculation Pipeline (Engine A + Threshold Filter + Engine B + Compliance) | 3 | [[architecture#3.4 Engine A — Physics & Chemistry Calculation (F-02)|Engine A]] / [[architecture#3.5 Olfactory Threshold Filter (F-03)|Threshold Filter]] / [[architecture#3.6 Engine B — Aroma Description Generation (F-04)|Engine B]] / [[architecture#3.7 Compliance & Risk Module (F-05, F-06, F-10)|Compliance & Risk Module]] |
| D. Supporting Services | 5 | [[architecture#3.8 Supporting Services (F-11, F-12, F-13, F-14)|Supporting Services]] |
| E. Export | 1 | Formula Management + Compliance & Risk |
| F. Private Registry | 3 | Substance Reference Store |
| G. Data Steward — Registry & Ruleset Maintenance | 4 | Substance Reference Store + Precomputed Interaction Matrix Store + Regulatory Ruleset Store |
| H. Formulation Manager — Organization Overview | 1 | [[architecture#3.3 Formula Management Module (F-01, F-15, F-16, F-19)|Formula Management Module]] + [[architecture#3.2 Identity, Access & Audit Module (F-08)|Identity, Access & Audit Module]] |
| **รวม** | **33** | |

---

## 3. โมดูล A — Identity, Access & Consent (F-08 / FR-37–39 / NFR-09,10,11)

### AuthenticateUser
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยังไม่ยืนยันตัวตน (public)
- **Input:** ข้อมูลยืนยันตัวตน (รูปแบบจริงรอ [[technology-stack|technology-stack.md]])
- **Output:** `user_id`, `role`, โทเคน/สถานะการเข้าใช้งาน (รูปแบบจริงรอ technology-stack.md)
- **กฎทางธุรกิจ:** ต้องยืนยันตัวตนสำเร็จก่อนเข้าถึง operation อื่นทั้งหมดในเอกสารนี้ (ยกเว้น operation ที่ระบุว่า public)
- **กรณี Error:** ข้อมูลยืนยันตัวตนไม่ถูกต้อง · บัญชีถูกปิดใช้งาน (`User.is_active = เท็จ`)
- **อ้างอิง:** FR-37

### EndUserSession
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยืนยันตัวตนแล้ว (ทุกบทบาท)
- **Input:** (ไม่มี — ใช้ session ปัจจุบัน)
- **Output:** ยืนยันการออกจากระบบสำเร็จ
- **กฎทางธุรกิจ:** ไม่มี
- **กรณี Error:** ไม่มี session ที่ใช้งานอยู่
- **อ้างอิง:** FR-37

### GetOwnAuditLog
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยืนยันตัวตนแล้ว (ทุกบทบาท) — ดูได้เฉพาะ log ของตัวเอง
- **Input:** ช่วงวันที่ (ไม่บังคับ)
- **Output:** รายการ `AuditLogEntry` ที่ `user_ref` ตรงกับผู้เรียก
- **กฎทางธุรกิจ:** ห้ามดู log ของผู้ใช้อื่น (NFR-09)
- **กรณี Error:** ไม่มี (คืนรายการเปล่าถ้าไม่มีข้อมูล)
- **อ้างอิง:** FR-38, NFR-09, NFR-10

### GetConsentStatus
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยืนยันตัวตนแล้ว (ทุกบทบาท)
- **Input:** (ไม่มี — ใช้ผู้เรียกปัจจุบัน)
- **Output:** รายการ `ConsentRecord` ของผู้เรียก พร้อม `status` ปัจจุบันต่อ `consent_type`
- **กฎทางธุรกิจ:** ไม่มี
- **กรณี Error:** ไม่มี
- **อ้างอิง:** FR-39, NFR-11

### GrantConsent
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยืนยันตัวตนแล้ว (ทุกบทบาท)
- **Input:** `consent_type`
- **Output:** `ConsentRecord` ที่สร้างใหม่ (`status` = ให้ความยินยอม, `given_at`)
- **กฎทางธุรกิจ:** ต้องแสดงข้อความระบุว่าจะเก็บข้อมูลอะไรและใช้ทำอะไรก่อนขอความยินยอม (ตาม [[../../03-testing/01-test-plan/acceptance-criteria#AC-08.3 การจัดการความยินยอม FR-39, NFR-11|AC-08.3]])
- **กรณี Error:** `consent_type` ไม่รู้จัก
- **อ้างอิง:** FR-39, NFR-11

### WithdrawConsent
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยืนยันตัวตนแล้ว (ทุกบทบาท) — เจ้าของ `ConsentRecord` เท่านั้น
- **Input:** `consent_id`
- **Output:** `ConsentRecord` ที่อัปเดต (`status` = ถอนความยินยอม, `withdrawn_at`)
- **กฎทางธุรกิจ:** ระบบต้องหยุดใช้ข้อมูลที่เกี่ยวข้องทันทีหลังถอน (AC-08.3)
- **กรณี Error:** `consent_id` ไม่พบ หรือไม่ใช่ของผู้เรียก
- **อ้างอิง:** FR-39, NFR-11

### SubmitDataSubjectRequest
- **บทบาทที่เรียกได้:** ผู้ใช้ที่ยืนยันตัวตนแล้ว (ทุกบทบาท)
- **Input:** `request_type` (เข้าถึงข้อมูล / แก้ไขข้อมูล / ลบข้อมูล / คัดค้านการประมวลผล)
- **Output:** `DataSubjectRequest` ใหม่ (`status` = รอดำเนินการ)
- **กฎทางธุรกิจ:** สิทธินี้ครอบคลุมตาม PDPA (รับรู้/เข้าถึง/แก้ไข/ลบ/คัดค้าน) — การดำเนินการจริงเป็นกระบวนการนอกระบบส่วนหนึ่ง (เทียบ NFR-13 ที่ยกให้เป็นประเด็นกระบวนการ/องค์กร)
- **กรณี Error:** `request_type` ไม่รู้จัก
- **อ้างอิง:** NFR-11

---

## 4. โมดูล B — Formula Management (F-01, F-15, F-16 / FR-01–06)

### CreateFormula
- **บทบาทที่เรียกได้:** Perfumer
- **Input:** `name`, `brief_note` (ไม่บังคับ)
- **Output:** `Formula` ใหม่ พร้อม `FormulaVersion` เวอร์ชันที่ 1 ที่ยังไม่มีรายการสาร (`total_percentage` = 0, `is_complete` = เท็จ)
- **กฎทางธุรกิจ:** `owner_ref` ถูกกำหนดเป็นผู้เรียกโดยอัตโนมัติ (NFR-09)
- **กรณี Error:** `name` ว่างเปล่า
- **อ้างอิง:** FR-01, FR-04

### ListMyFormulas
- **บทบาทที่เรียกได้:** Perfumer
- **Input:** เงื่อนไขค้นหา/กรอง (ไม่บังคับ)
- **Output:** รายการ `Formula` ที่ `owner_ref` ตรงกับผู้เรียก
- **กฎทางธุรกิจ:** เห็นเฉพาะสูตรของตนเองเท่านั้น (NFR-09, AC-08.1)
- **กรณี Error:** ไม่มี
- **อ้างอิง:** FR-04, NFR-09

### GetFormula
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `formula_id`
- **Output:** `Formula` พร้อม `FormulaVersion` ปัจจุบันและรายการ `FormulaVersionIngredient`
- **กฎทางธุรกิจ:** ต้องได้สารและสัดส่วนครบทุกตัวเหมือนตอนบันทึก (AC-01.5) · ปฏิเสธถ้าผู้เรียกไม่ใช่เจ้าของ (NFR-09, AC-08.1)
- **กรณี Error:** `formula_id` ไม่พบ · ผู้เรียกไม่ใช่เจ้าของ
- **อ้างอิง:** FR-04, NFR-09

### SearchSubstance
- **บทบาทที่เรียกได้:** Perfumer, Data Steward
- **Input:** คำค้น (ชื่อสามัญ / CAS Number / `internal_code`), ขอบเขตคลัง (คลังกลาง และ/หรือ คลังส่วนตัวของผู้เรียก)
- **Output:** รายการ `Substance` ที่ตรงกับคำค้น พร้อม `common_name`, `cas_number`, `internal_code`, `micro_cluster_ref`, และ **`regulatory_status`** ต่อรายการ (ไม่มี / RESTRICTION / PROHIBITION) พร้อม `regulatory_reason` (เลข IFRA Amendment/มาตราที่เกี่ยวข้อง) เมื่อมีสถานะใดสถานะหนึ่ง — ดึงจาก `RegulatoryLimit.limit_type` ที่ตรงกับสารนั้นเสมอ (FR-40)
- **กฎทางธุรกิจ:** ต้องตอบภายใน 1 วินาที ([[../../03-testing/01-test-plan/acceptance-criteria#AC-01.4 ค้นหาสารจากคลัง FR-03|AC-01.4]]) แม้คลังมีถึง 2,000–3,000 รายการ (NFR-06) · คลังส่วนตัวของผู้ใช้อื่นต้องไม่ปรากฏในผลลัพธ์ · ทุกรายการที่มี `regulatory_status = PROHIBITION` ต้องส่ง `regulatory_reason` มาด้วยเสมอ (FR-40) เพื่อให้ Client แสดง badge **ก่อน**ที่ผู้ใช้จะกดเลือกสารนั้น
- **กรณี Error:** ไม่มี (คืนรายการเปล่าถ้าไม่พบ)
- **อ้างอิง:** FR-03, FR-40, NFR-06

### UpdateFormulaComposition
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `formula_version_id`, รายการ `FormulaVersionIngredient` ที่จะเพิ่ม/แก้ไข/ลบ (`substance_ref`, `percentage`)
- **Output:** `FormulaVersion` ที่อัปเดต พร้อม `total_percentage` และ `is_complete` ที่คำนวณใหม่
- **กฎทางธุรกิจ:** แสดงผลรวม % ปัจจุบันตลอดเวลาโดยไม่ต้องกดปุ่มใด (AC-01.1) · การบันทึกองค์ประกอบระดับร่างนี้ไม่บังคับว่าต้อง = 100% — เงื่อนไข 100% (BR-01) เป็นเงื่อนไขของ `CalculateFormula` เท่านั้น · **ก่อนเพิ่ม `substance_ref` ใดเข้ารายการ ต้องตรวจ `RegulatoryLimit.limit_type` ของสารนั้นก่อนเสมอ — ถ้าเป็น PROHIBITION ต้องปฏิเสธการเพิ่มทันที ไม่มี override ใดๆ ในระบบ (FR-41, BR-07)** ต่างจากสถานะ RESTRICTION ที่ยังเพิ่มเข้าสูตรได้ตามปกติ (ไปตรวจเพดานที่ `CalculateFormula`/`CR` แทน)
- **กรณี Error:** `substance_ref` ไม่พบในคลัง (กลางหรือส่วนตัวของผู้เรียก) · `percentage` เป็นค่าลบ · **`substance_ref` มีสถานะ Regulatory Limit เป็น PROHIBITION → ปฏิเสธทั้งรายการที่มีสารนี้ พร้อมเหตุผลอ้างอิงเลข IFRA Amendment/มาตรา (FR-41)**
- **อ้างอิง:** FR-01, FR-02, FR-41, BR-07

### SaveFormulaVersion
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `formula_version_id`, `change_summary`
- **Output:** `FormulaVersion` ใหม่ (version_number +1) ที่ถูกตรึงค่าไว้ (immutable snapshot) และเป็น `Formula.current_version_ref`
- **กฎทางธุรกิจ:** ทุกครั้งที่บันทึกต้องเขียน `AuditLogEntry` (action_type = "บันทึกเวอร์ชันสูตร") (FR-38)
- **กรณี Error:** `formula_version_id` ไม่พบ หรือผู้เรียกไม่ใช่เจ้าของ
- **อ้างอิง:** FR-04, FR-05, FR-38

### ListFormulaVersions
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `formula_id`
- **Output:** รายการ `FormulaVersion` เรียงตาม `version_number` พร้อม `created_at`, `created_by_ref`, `change_summary`
- **กฎทางธุรกิจ:** ไม่มี
- **กรณี Error:** `formula_id` ไม่พบ หรือผู้เรียกไม่ใช่เจ้าของ
- **อ้างอิง:** FR-05

### RestoreFormulaVersion
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `version_id` ที่ต้องการย้อนกลับไปใช้
- **Output:** `FormulaVersion` ใหม่ที่คัดลอกรายการ `FormulaVersionIngredient` จาก `version_id` ที่เลือก และกลายเป็น `Formula.current_version_ref`
- **กฎทางธุรกิจ:** การย้อนกลับไม่ลบเวอร์ชันที่อยู่ระหว่างนั้น (ประวัติทุกเวอร์ชันยังคงอยู่ครบ)
- **กรณี Error:** `version_id` ไม่พบ หรือไม่ใช่เวอร์ชันของสูตรที่ผู้เรียกเป็นเจ้าของ
- **อ้างอิง:** FR-05

### ImportFormulaFromFile
- **บทบาทที่เรียกได้:** Perfumer
- **Input:** ไฟล์ CSV/Excel ที่มีรายการสารและสัดส่วน
- **Output:** `FormulaImportBatch` (`status`, `row_count`, `error_detail`) และ `Formula`/`FormulaVersion` ที่สร้างขึ้นเมื่อสำเร็จ
- **กฎทางธุรกิจ:** แถวที่ระบุ `substance` ไม่ตรงกับคลัง (กลางหรือส่วนตัว) ถูกข้ามและบันทึกไว้ใน `error_detail` โดยไม่ทำให้ทั้ง batch ล้มเหลว (`status` = สำเร็จบางส่วน)
- **กรณี Error:** ไฟล์อ่านไม่ได้/รูปแบบไม่ถูกต้อง (`status` = ล้มเหลว)
- **อ้างอิง:** FR-06

---

## 5. โมดูล C — Core Calculation Pipeline (F-02, F-03, F-04, F-05, F-06 / FR-07–27 / NFR-01,02,03,08,12,13)

### CalculateFormula
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `formula_version_id`
- **Output:** `FormulaCalculationRun` ใหม่ ครบทุกส่วนที่ Dashboard ต้องแสดงในหน้าเดียว (FR-26):
  - `CalculationClusterWeight[]` (FR-08, ใช้แสดงกราฟ FR-28 ด้วย)
  - `CalculationTimeSeriesPoint[]` (FR-12)
  - `longevity_min_hours`, `longevity_max_hours` (FR-13), `sillage_index` (FR-14)
  - `ThresholdFilterOutcome[]` — รายการสารที่ถูกตัดพร้อมเหตุผลและค่า ppm/ODT (FR-16, FR-17)
  - `AromaDescriptionSegment[]` แยก Top/Heart/Base พร้อม `ai_generated_flag` (FR-18–20, NFR-12)
  - `ComplianceCheckResult` + `ComplianceViolation[]` (FR-21, FR-22)
  - `MuddyAccordAssessment` + `MuddyAccordRecommendation[]` (FR-23, FR-24)
- **กฎทางธุรกิจ:**
  - ต้องปฏิเสธการคำนวณถ้า `FormulaVersion.total_percentage ≠ 100%` (BR-01, FR-02) — คืนส่วนต่างที่ขาด/เกินให้ผู้เรียกแสดงผล ไม่ใช่แค่ error ทั่วไป
  - ถ้ามีสารตัวใดใน `FormulaVersionIngredient` ที่ไม่มี `micro_cluster_ref` ต้องหยุดการคำนวณและแจ้งชื่อสารนั้น ห้ามคำนวณต่อแบบข้ามสาร ([[../../03-testing/01-test-plan/acceptance-criteria#AC-02.1 ระบุ Micro-Cluster อัตโนมัติ FR-07|AC-02.1]])
  - ผลลัพธ์ทุกค่าต้อง**deterministic**: `formula_version_id` เดิม (ไม่มีการแก้ไของค์ประกอบ) ต้องให้ผลลัพธ์ทุกตัวเลขเท่ากันเป๊ะทุกครั้งที่เรียกซ้ำ (NFR-03, AC-02.2)
  - ต้องตอบกลับสมบูรณ์ภายใน **500 มิลลิวินาที** สำหรับสูตรที่มีสาร 50–80 ตัว (NFR-01, AC-02.4)
  - Engine B ต้องอ้างอิงเฉพาะค่าจาก Engine A เท่านั้นและห้ามอ้างสารที่ `ThresholdFilterOutcome.passed_filter = เท็จ` (FR-19, BR-05, AC-04.2) — ถ้าสร้างคำบรรยายล้มเหลวหรือมั่นใจต่ำ ต้อง fallback เป็นแสดงตัวเลขดิบจาก Engine A แทน (`AromaDescriptionSegment.is_fallback = จริง`, NFR-13)
  - สารที่ถูก Threshold Filter ตัดออกยังต้องถูกนับในผล `ComplianceCheckResult`/ต้นทุน (BR-03)
  - ทุกค่าที่คืนต้องมี reference กลับไปยัง component/สาร/กลุ่มต้นทางเพื่อรองรับการสาวที่มา (NFR-08, [[../../03-testing/01-test-plan/acceptance-criteria#AC-07.4 ความสามารถในการอธิบายที่มา NFR-08|AC-07.4]])
- **กรณี Error:**
  - ผลรวม % ≠ 100% → ปฏิเสธ พร้อมส่วนต่าง (BR-01)
  - มีสารที่ไม่มี Micro-Cluster → ปฏิเสธ พร้อมชื่อสาร (AC-02.1)
  - ไม่พบ `GroupInteractionMatrixEntry` ของคู่กลุ่มที่จำเป็น (ข้อมูลอ้างอิงไม่สมบูรณ์) → ปฏิเสธพร้อมระบุคู่กลุ่มที่ขาด
- **อ้างอิง:** FR-07–24, FR-26, NFR-01, NFR-02, NFR-03, NFR-08, NFR-12, NFR-13, BR-01, BR-03, BR-05

### GetFormulaCalculation
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `calculation_id`
- **Output:** เหมือน output ของ `CalculateFormula` แต่เป็นการอ่านผลที่มีอยู่แล้วโดยไม่คำนวณใหม่ (สำหรับเปิด Dashboard ของสูตรที่คำนวณไว้ก่อนหน้า)
- **กฎทางธุรกิจ:** ไม่มี (read-only)
- **กรณี Error:** `calculation_id` ไม่พบ หรือไม่ใช่ของสูตรที่ผู้เรียกเป็นเจ้าของ
- **อ้างอิง:** FR-26

### CheckScentDrift
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `calculation_id` (การคำนวณปัจจุบัน), `baseline_calculation_id` (การคำนวณตั้งต้นของบรีฟ)
- **Output:** `ScentDriftAssessment` (`drift_score`, `is_drifted`)
- **กฎทางธุรกิจ:** เกณฑ์ตัวเลขของความเบี่ยง **ยังเป็น Open Issue OI-01** — operation นี้กำหนด contract ไว้ล่วงหน้า แต่สูตรคำนวณ/ค่าเกณฑ์จริงต้องรอ Rule Sheet ฉบับเต็มตาม [[../../01-requirements/01-spec/20260818-01-ai-perfumery-core#9. ประเด็นที่ยังไม่ได้ข้อสรุป (Open Issues)|spec §9]]
- **กรณี Error:** `calculation_id` หรือ `baseline_calculation_id` ไม่พบ
- **อ้างอิง:** FR-25

---

## 6. โมดูล D — Supporting Services (F-11–14 / FR-28, FR-29, FR-31–34, FR-36)

### RunWhatIfSimulation
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `base_formula_version_id`, `substance_removed_ref`, `substance_added_ref`
- **Output:** `WhatIfSimulation` + `resulting_calculation_ref` (ผลคำนวณเฉพาะจุดต่าง) + `WhatIfDiffResult[]` เทียบ 5 มิติ (กลิ่น / Longevity / Sillage / IFRA / ต้นทุน)
- **กฎทางธุรกิจ:** คำนวณเฉพาะ diff ไม่คำนวณสูตรใหม่ทั้งหมด (FR-31) — เงื่อนไขนี้ใช้ได้เมื่อ `substance_added_ref` อยู่ใน `micro_cluster_ref` เดียวกับ `substance_removed_ref` เท่านั้น เพราะการคำนวณแบบ diff อาศัยสมมติฐานว่าน้ำหนักกลุ่มไม่เปลี่ยน — ถ้าสลับข้ามกลุ่ม ต้องเรียก `CalculateFormula` แบบเต็มแทน (ไม่ใช่ error แต่เป็นเส้นทางที่ operation นี้ไม่รองรับ)
- **กรณี Error:** `substance_removed_ref` ไม่อยู่ในสูตรฐาน · `substance_added_ref` ไม่พบในคลัง
- **อ้างอิง:** FR-31, FR-32

### ListMicroClusterMembers
- **บทบาทที่เรียกได้:** Perfumer
- **Input:** `micro_cluster_id`, `formula_version_id` (เพื่อระบุว่าสารตัวใดอยู่ในบรีฟปัจจุบันแล้วไฮไลต์)
- **Output:** รายการ `Substance` ที่ `micro_cluster_ref` ตรงกัน พร้อม flag ว่าอยู่ใน `FormulaVersionIngredient` ของ `formula_version_id` นี้หรือไม่ (ใช้แสดงโทนเข้ม/จาง)
- **กฎทางธุรกิจ:** ไม่มี
- **กรณี Error:** `micro_cluster_id` ไม่พบ
- **อ้างอิง:** FR-33

### GetDistinctivenessCard
- **บทบาทที่เรียกได้:** Perfumer
- **Input:** `substance_id`
- **Output:** `DistinctivenessCard` (`unique_trait_text`, `comparison_note`)
- **กฎทางธุรกิจ:** ไม่มี
- **กรณี Error:** `substance_id` ไม่พบ หรือยังไม่มีการ์ดสำหรับสารนี้
- **อ้างอิง:** FR-34

### GetFormulaCostBreakdown
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `calculation_id`
- **Output:** รายการ `CostBreakdownEntry` เรียงตาม `cost_contribution_percentage` จากมากไปน้อย
- **กฎทางธุรกิจ:** นับสารที่ถูก Threshold Filter ตัดออกด้วย (BR-03)
- **กรณี Error:** `calculation_id` ไม่พบ
- **อ้างอิง:** FR-36

### SubmitCommandBarQuery
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `calculation_id`, ข้อความคำถามภาษาธรรมชาติ (เช่น "ขอตารางต้นทุนต่อกิโลกรัม", "สารตัวไหนกลบ Top Note อยู่?")
- **Output:** ข้อมูลที่ตรงกับคำถาม — ดึงจาก entity ที่มีอยู่แล้วของ `calculation_id` นั้น (`CostBreakdownEntry`, `ComplianceViolation`, `CalculationClusterWeight` ฯลฯ) ไม่ใช่การสร้างตัวเลขใหม่
- **กฎทางธุรกิจ:** ต้องไม่สร้างตัวเลขใหม่ที่ไม่มีอยู่ใน `FormulaCalculationRun` เดิม — ยึดกติกาเดียวกับ Engine B (BR-05) เพราะเป็นอีกช่องทางหนึ่งที่แสดงผลลัพธ์เชิงตัวเลข/บรรยายให้ผู้ใช้
- **กรณี Error:** คำถามที่ไม่สามารถจับคู่กับข้อมูลที่มีอยู่ได้ → ต้องแจ้งผู้ใช้ตรงๆ ว่าตอบไม่ได้ ห้ามเดาคำตอบ
- **อ้างอิง:** FR-29

---

## 7. โมดูล E — Export (F-16 / FR-30 / BR-02)

### ExportFormulaReport
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสูตร)
- **Input:** `calculation_id`, `format` (PDF/CSV)
- **Output:** `ExportedReport` (`export_status`, ไฟล์ผลลัพธ์เมื่อสำเร็จ — รูปแบบการส่งมอบไฟล์จริงรอ technology-stack.md)
- **กฎทางธุรกิจ:** ถ้า `ComplianceCheckResult.overall_status = FAIL` ของ `calculation_id` นี้ ต้องปฏิเสธการ Export รายงานฉบับสมบูรณ์เสมอ (BR-02) — คืน `export_status` = ถูกบล็อก พร้อม `blocked_reason` อธิบายว่าสูตรยังไม่ผ่านเกณฑ์ IFRA ([[../../03-testing/01-test-plan/acceptance-criteria#AC-05.4 บล็อกการ Export เมื่อยัง FAIL BR-02, FR-30|AC-05.4]])
- **กรณี Error:** `calculation_id` ไม่พบ · `format` ไม่รู้จัก
- **อ้างอิง:** FR-30, BR-02

---

## 8. โมดูล F — Private Registry (F-17 / FR-35)

### AddPrivateSubstance
- **บทบาทที่เรียกได้:** Perfumer
- **Input:** `common_name`, `cas_number` (ไม่บังคับ), `internal_code`, `micro_cluster_ref`, Master Code (`molecular_weight`, `vapor_pressure`, `log_p`, `receptor_tag`), `odt_value`, `odt_unit`, `cost_per_kg`
- **Output:** `Substance` ใหม่ (`registry_scope` = คลังส่วนตัว, `owner_ref` = ผู้เรียก)
- **กฎทางธุรกิจ:** มองเห็นได้เฉพาะเจ้าของ (`SearchSubstance`/`GetFormula` ของผู้ใช้อื่นต้องไม่เห็นสารนี้)
- **กรณี Error:** `micro_cluster_ref` ไม่พบ
- **อ้างอิง:** FR-35

### UpdatePrivateSubstance
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสารนั้น)
- **Input:** `substance_id`, field ที่ต้องการแก้ไข (เหมือน `AddPrivateSubstance`)
- **Output:** `Substance` ที่อัปเดต
- **กฎทางธุรกิจ:** แก้ได้เฉพาะสารที่ `registry_scope` = คลังส่วนตัว และ `owner_ref` ตรงกับผู้เรียก
- **กรณี Error:** `substance_id` ไม่พบ · เป็นสารในคลังกลาง (ไม่มีสิทธิ์แก้)
- **อ้างอิง:** FR-35

### RemovePrivateSubstance
- **บทบาทที่เรียกได้:** Perfumer (เจ้าของสารนั้น)
- **Input:** `substance_id`
- **Output:** ยืนยันการลบ
- **กฎทางธุรกิจ:** ห้ามลบถ้าสารนี้ถูกใช้อยู่ใน `FormulaVersionIngredient` ของเวอร์ชันปัจจุบันของสูตรใดๆ — ต้องแจ้งรายการสูตรที่อ้างอิงอยู่แทนการลบทันที
- **กรณี Error:** `substance_id` ไม่พบ · ยังมีสูตรอ้างอิงอยู่
- **อ้างอิง:** FR-35

---

## 9. โมดูล G — Data Steward: Registry & Ruleset Maintenance (NFR-04,05,06,07)

> บทบาทของ Data Steward ("ดูแลคลังสาร (Master Code), Micro-Cluster Assignment และการอัปเดตฐานข้อมูล IFRA") มาจาก [[../../01-requirements/01-spec/20260818-01-ai-perfumery-core#2. บทบาทผู้ใช้ (User Roles)|Requirement Spec §2]] โดยตรง ส่วน operation ต่อไปนี้ถูกออกแบบเพื่อให้ NFR-05/NFR-07 เป็นไปได้จริง (การเพิ่มสารใหม่ไม่ต้องคำนวณ Matrix ใหม่ทั้งระบบ, การอัปเดตฐาน IFRA โดยไม่ต้องแก้โค้ด) — ไม่มี FR เฉพาะเจาะจงกำกับ operation กลุ่มนี้ (ดู `## NEEDS_NEW_REQUIREMENT`)

### RegisterCentralSubstance
- **บทบาทที่เรียกได้:** Data Steward
- **Input:** เหมือน `AddPrivateSubstance` แต่ `registry_scope` = คลังกลาง (ไม่มี `owner_ref`)
- **Output:** `Substance` ใหม่ พร้อม `micro_cluster_ref` ที่ระบุ
- **กฎทางธุรกิจ:** การเพิ่มสารนี้ต้อง**ไม่ทำให้ต้องคำนวณ `GroupInteractionMatrixEntry` ใหม่ทั้งระบบ** — สารใหม่ map เข้ากลุ่มที่มีอยู่แล้วเท่านั้น (NFR-05)
- **กรณี Error:** `micro_cluster_ref` ไม่พบ · จำนวน `MicroCluster` ทั้งระบบจะเกิน 100 กลุ่มถ้าต้องสร้างกลุ่มใหม่ (NFR-04 — ปฏิเสธการสร้างกลุ่มใหม่เกินเพดาน)
- **อ้างอิง:** NFR-04, NFR-05, NFR-06

### UpdateMicroClusterAssignment
- **บทบาทที่เรียกได้:** Data Steward
- **Input:** `substance_id`, `micro_cluster_ref` ใหม่
- **Output:** `Substance` ที่อัปเดต
- **กฎทางธุรกิจ:** ใช้แก้ไขผลการระบุกลุ่มอัตโนมัติ (FR-07) เมื่อพบว่าไม่ถูกต้อง — การเปลี่ยนกลุ่มมีผลกับการคำนวณครั้งถัดไปเท่านั้น ไม่ไปแก้ `FormulaCalculationRun` ที่บันทึกไว้แล้ว (คงหลักการ immutable snapshot)
- **กรณี Error:** `micro_cluster_ref` ใหม่ไม่พบ
- **อ้างอิง:** FR-07, NFR-05

### UpdateRegulatoryRuleset
- **บทบาทที่เรียกได้:** Data Steward
- **Input:** รายการ `RegulatoryLimit` ที่จะเพิ่ม/แก้ไข (`substance_ref` หรือ `micro_cluster_ref`, `ifra_category`, `limit_type`, `max_percentage`, `amendment_version`, `effective_date`)
- **Output:** `RegulatoryLimit[]` ที่อัปเดต
- **กฎทางธุรกิจ:** ต้องทำได้โดย**ไม่ต้องแก้โค้ดของระบบ** (NFR-07) · `limit_type` ต้องรองรับทั้งกรณี "มีเพดาน" และ "ห้ามใช้เด็ดขาด" (ดูหมายเหตุใน [[db-spec#3.6 Compliance & Risk (F-05, F-06, F-10 / FR-21–25 / NFR-02, NFR-07)|db-spec.md §3.6]])
- **กรณี Error:** `substance_ref`/`micro_cluster_ref` ไม่พบ · ระบุทั้งสองพร้อมกัน (ต้องเลือกอย่างใดอย่างหนึ่ง) หรือไม่ระบุเลย
- **อ้างอิง:** NFR-07

### UpdateInteractionMatrixEntry
- **บทบาทที่เรียกได้:** Data Steward
- **Input:** `cluster_a_ref`, `cluster_b_ref`, `synergy_score`, `suppression_factor`, `evaporation_shift`
- **Output:** `GroupInteractionMatrixEntry` ที่สร้าง/อัปเดต
- **กฎทางธุรกิจ:** ตารางทั้งระบบต้องโหลดขึ้นหน่วยความจำได้ทั้งหมด — จำกัดจำนวนคู่กลุ่มไม่ให้เกินขนาดที่เกิดจาก 100 `MicroCluster` (NFR-04)
- **กรณี Error:** `cluster_a_ref`/`cluster_b_ref` ไม่พบ
- **อ้างอิง:** NFR-04, NFR-05

---

## 10. โมดูล H — Formulation Manager: Organization Overview (F-19 / FR-42 / BR-08)

> ปิดช่องว่าง **OI-05** ใน [[../../01-requirements/01-spec/20260818-03-formulation-manager-role|Formulation Manager Role Spec]] — operation นี้เป็นจุดเดียวในระบบที่อนุญาตให้อ่านข้ามเจ้าของสูตรได้ ภายใต้เงื่อนไขบัญชี/องค์กรเดียวกันเท่านั้น

### ListOrganizationFormulas
- **บทบาทที่เรียกได้:** Formulation Manager
- **Input:** (ไม่มี — ใช้ `organization_ref` ของผู้เรียกปัจจุบันเสมอ ไม่รับพารามิเตอร์ขอบเขตองค์กรจากภายนอก เพื่อกันการปลอมค่ามาอ่านข้ามองค์กร)
- **Output:** รายการสรุปต่อ `Formula` ที่ `owner_ref.organization_ref` ตรงกับผู้เรียกเท่านั้น ประกอบด้วย ชื่อสูตร, ชื่อเจ้าของ, ต้นทุนโดยประมาณล่าสุด (อ้างอิง `CostBreakdownEntry`/FR-36), สถานะ `ComplianceCheckResult.overall_status` ล่าสุด (FR-22)
- **กฎทางธุรกิจ:** **ต้องกรองด้วยขอบเขต `Organization` ของผู้เรียกเสมอ ห้ามคืนสูตรของผู้ใช้ที่ `organization_ref` ไม่ตรงกันโดยเด็ดขาด ไม่มีข้อยกเว้นหรือพารามิเตอร์ override ใดๆ (BR-08)** — เป็นข้อยกเว้นเดียวที่อนุญาตต่อ NFR-09 (ดู [[architecture#5. ตาราง Mapping NFR → Component|architecture.md §5]]) · การเรียก operation นี้ถูกบันทึกลง `AuditLogEntry` เสมอ (FR-38) เพราะเป็นการเข้าถึงข้อมูลของผู้ใช้อื่น
- **กรณี Error:** ผู้เรียกไม่มีบทบาท Formulation Manager → ปฏิเสธ · ผู้เรียกไม่มี `organization_ref` (ยังไม่ถูกจัดกลุ่มองค์กร) → คืนรายการเปล่าพร้อมแจ้งเหตุผล ไม่ใช่ error
- **อ้างอิง:** FR-42, FR-36, FR-22, FR-38, BR-08, NFR-09

---

## 11. ประเด็นรอตัดสินใจ

ต้องรอ [[technology-stack|technology-stack.md]] ก่อนจึงระบุรายละเอียดต่อได้:

1. **โปรโตคอลสื่อสารระหว่าง Client ↔ Backend Service** (synchronous request-response, WebSocket/push, ฯลฯ) — โดยเฉพาะ operation ที่ต้องมีคุณสมบัติ real-time เช่นการตรวจ IFRA อัตโนมัติภายใน 300ms หลังผู้ใช้แก้สัดส่วน (NFR-02) — เอกสารนี้จงใจไม่ฟันธงว่าเป็นการ "เรียกซ้ำ" หรือ "ระบบผลักข้อมูลมาเอง"
2. **รูปแบบโทเคน/session ของ `AuthenticateUser`** และวิธีตรวจสอบสิทธิ์ในทุก operation ที่ตามมา (รวมถึงวิธียืนยัน `organization_ref` ของผู้เรียกสำหรับ `ListOrganizationFormulas`)
3. **รูปแบบไฟล์ที่ส่ง/รับจริง** ของ `ImportFormulaFromFile` (การอัปโหลด) และ `ExportFormulaReport` (การส่งมอบไฟล์ผลลัพธ์)
4. **Pagination/ขนาดผลลัพธ์** ของ `SearchSubstance`, `ListMyFormulas`, `ListFormulaVersions`, `GetOwnAuditLog`, `ListOrganizationFormulas` เมื่อข้อมูลมีจำนวนมาก
5. **Idempotency ของการเรียกซ้ำ** สำหรับ operation ที่มีผลข้างเคียง (เช่น `CalculateFormula`, `SaveFormulaVersion`) เมื่อเครือข่ายขัดข้องและมีการเรียกซ้ำ

---

## 12. เอกสารที่เกี่ยวข้อง

| เอกสาร | ความสัมพันธ์ |
|---|---|
| [[db-spec|DB Spec]] | Entity/attribute ที่ operation ทั้งหมดใน field input/output อ้างถึง |
| [[architecture|Architecture]] | Component ที่รับผิดชอบแต่ละโมดูล operation |
| [[../feature-list|Feature List]] | แหล่งฟีเจอร์ที่ operation ต้อง map กลับได้ |
| [[../user-journey|User Journey]] | ลำดับการเรียก operation จริงตาม UJ-01/UJ-02/UJ-04 |
| [[../../01-requirements/backlog|Backlog]] | แหล่ง FR/NFR ทั้งหมด |
| [[../../01-requirements/01-spec/20260818-01-ai-perfumery-core|Requirement Spec]] | Business Rules, User Roles, Open Issues |
| [[../../01-requirements/01-spec/20260818-02-prohibited-substance-blocking|Prohibited Substance Blocking Spec]] | ต้นทางของ FR-40/FR-41/BR-07 ที่ `SearchSubstance`/`UpdateFormulaComposition` รองรับ |
| [[../../01-requirements/01-spec/20260818-03-formulation-manager-role|Formulation Manager Role Spec]] | ต้นทางของ `ListOrganizationFormulas` (โมดูล H) |
| [[../../03-testing/01-test-plan/acceptance-criteria|Acceptance Criteria]] | เกณฑ์ผ่านที่ operation ต้องทำให้ได้จริง |
| [[technology-stack|Technology Stack]] | ยังว่างเปล่า — จุดตัดสินใจประเด็นในหัวข้อ 11 |
