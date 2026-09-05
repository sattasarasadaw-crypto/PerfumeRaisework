# NFR Review — AI Perfumery Formulation Assistant

- **อัปเดตล่าสุด:** 2026-08-28
- **ขอบเขตงาน:** ตรวจสอบ NFR-01 ถึง NFR-15 ใน [[../../01-requirements/backlog|backlog.md]] เทียบกับ [[architecture|architecture.md]], [[api-spec|api-spec.md]], [[db-spec|db-spec.md]] และไฟล์ใน `detailed-design/` — **รายงานเท่านั้น ไม่แก้ไขเอกสารเชิงเทคนิคอื่นใด**
- **สถานะ Detailed Design ที่ใช้ตรวจ:** ครอบคลุมเฉพาะฟีเจอร์ระดับ MVP (F-01–F-08, F-18) — F-09 ถึง F-19 ที่เหลือยังไม่มี detailed-design แยก (ดูขอบเขตที่ตกลงไว้ใน [[../../feature-list|feature-list.md]])

---

## 1. ตารางสรุปผลตรวจสอบ

| รหัส NFR | คำอธิบายสั้น | สถานะ | เอกสาร/ส่วนที่พบ | สิ่งที่ยังขาด | แนะนำให้รันอะไรต่อ |
|---|---|---|---|---|---|
| NFR-01 | คำนวณสูตร 50–80 สาร ภายใน 500ms | ✅ รองรับแล้ว | [[architecture#5. ตาราง Mapping NFR → Component\|architecture.md §5]] · [[api-spec#5. โมดูล C — Core Calculation Pipeline (F-02, F-03, F-04, F-05, F-06 / FR-07–27 / NFR-01,02,03,08,12,13)\|api-spec.md §5 CalculateFormula]] · [[detailed-design/engine-a-calculation\|detailed-design/engine-a-calculation.md]] Edge Case #5 | กลไก precompute/refresh Matrix จริง (batch/on-demand) ยังรอ `technology-stack.md` — เป็นเรื่องปกติสำหรับเอกสารระดับนี้ ไม่ใช่ช่องว่าง | ไม่ต้องทำเพิ่มในชั้นนี้ |
| NFR-02 | ตรวจ IFRA real-time ภายใน 300ms | ✅ รองรับแล้ว | architecture.md §5 · api-spec.md §5 CalculateFormula · [[detailed-design/ifra-compliance-check\|detailed-design/ifra-compliance-check.md]] Sequence Diagram + Edge Case #3 | — | — |
| NFR-03 | Engine A ต้อง deterministic 100% | ✅ รองรับแล้ว | architecture.md §1, §5 · [[db-spec#3.4 ผลการคำนวณ Engine A + Threshold Filter (F-02, F-03 / FR-08, FR-12–14, FR-16–17 / NFR-01, NFR-03, NFR-08)\|db-spec.md §3.4]] · [[detailed-design/engine-a-calculation\|detailed-design/engine-a-calculation.md]] §3, Edge Case #4 | — | — |
| NFR-04 | Matrix จำกัดไม่เกิน 100 Micro-Clusters | ✅ รองรับแล้ว | architecture.md §5 · [[db-spec#3.3 คลังวัตถุดิบและกลุ่มจุลภาค (F-02, F-17 / FR-03, FR-07, FR-09–11, FR-15, FR-35 / NFR-04–06)\|db-spec.md §3.3]] · [[api-spec#9. โมดูล G — Data Steward: Registry & Ruleset Maintenance (NFR-04,05,06,07)\|api-spec.md §9 UpdateInteractionMatrixEntry]] | ยังไม่มี detailed-design ของโมดูล Data Steward (นอกขอบเขต MVP รอบนี้) — ไม่กระทบความสมบูรณ์ของ NFR นี้ในชั้น architecture/api/db | ถ้าจะทำ Data Steward เป็น MVP ในอนาคต ให้รัน `sync-detailed-design` เพิ่ม |
| NFR-05 | เพิ่มสารใหม่ไม่ต้องคำนวณ Matrix ใหม่ทั้งระบบ | ✅ รองรับแล้ว | architecture.md §5 · db-spec.md §3.3 (`GroupInteractionMatrixEntry` หมายเหตุ) · api-spec.md §9 `RegisterCentralSubstance` | เช่นเดียวกับ NFR-04 | เช่นเดียวกับ NFR-04 |
| NFR-06 | รองรับคลังสาร 2,000–3,000 ชนิด | ✅ รองรับแล้ว | architecture.md §5 · db-spec.md §3.3 · api-spec.md §4 `SearchSubstance` · [[detailed-design/formula-management\|detailed-design/formula-management.md]] Edge Case #3 | กลไก index จริงยังรอ `technology-stack.md` | ไม่ต้องทำเพิ่ม |
| NFR-07 | อัปเดตฐาน IFRA ได้โดยไม่แก้โค้ด | ✅ รองรับแล้ว | architecture.md §3.12, §5 · db-spec.md §3.6 (`RegulatoryLimit`) · api-spec.md §9 `UpdateRegulatoryRuleset` | — | — |
| NFR-08 | ทุกค่าบน Dashboard สาวกลับที่มาได้ | ✅ รองรับแล้ว | architecture.md §1, §5 · [[detailed-design/dashboard-aroma-profile\|detailed-design/dashboard-aroma-profile.md]] Edge Case #4 · [[detailed-design/olfactory-threshold-filter\|detailed-design/olfactory-threshold-filter.md]] Edge Case #2 | — | — |
| NFR-09 | เข้ารหัสสูตร + แยกสิทธิ์ตามบัญชี | ⚠️ รองรับแล้ว (มีเงื่อนไขให้ติดตาม) | architecture.md §3.2, §3.3, §5 (ระบุข้อยกเว้น FR-42/BR-08 ชัดเจน) · db-spec.md §3.1 (`Organization`, `User.organization_ref`) · api-spec.md §10 `ListOrganizationFormulas` (บังคับกรองด้วย organization เสมอ) | **ถ้อยคำ NFR-09 ในเอกสารต้นทาง [[../../01-requirements/01-spec/20260818-01-ai-perfumery-core#5. ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (Non-Functional Requirements)\|20260818-01-ai-perfumery-core.md §5]] ยังเป็นถ้อยคำเดิมที่ไม่มีข้อยกเว้น** ทั้งที่ชั้นออกแบบ (architecture/api-spec/db-spec) implement ข้อยกเว้นนี้ครบแล้ว — ดูมติที่ข้อ 2 ด้านล่าง | **ต้องการการตัดสินใจของผู้ใช้/PO** ว่าจะรับข้อเสนอปรับถ้อยคำหรือไม่ (ดูหัวข้อ 2) — ไม่ใช่งานที่ `sync-*` แก้ให้อัตโนมัติได้ เพราะเป็นการแก้ไข spec ต้นทาง |
| NFR-10 | เก็บ Traffic Log ≥ 90 วัน | ✅ รองรับแล้ว | architecture.md §3.13 · db-spec.md §3.1 (`AuditLogEntry`) · [[detailed-design/account-identity-audit-consent\|detailed-design/account-identity-audit-consent.md]] Edge Case #3 | นโยบาย retention/purge อัตโนมัติจริงยังรอ `technology-stack.md` | ไม่ต้องทำเพิ่ม |
| NFR-11 | Consent + สิทธิเจ้าของข้อมูล (PDPA) | ✅ รองรับแล้ว | architecture.md §3.2 · db-spec.md §3.1 (`ConsentRecord`, `DataSubjectRequest`) · api-spec.md §3 · [[detailed-design/account-identity-audit-consent\|detailed-design/account-identity-audit-consent.md]] §1.2, §3 · [[../../user-journey#UJ-03 — Journey: จัดการความยินยอมข้อมูลส่วนบุคคล (PDPA)\|UJ-03]] | — | — |
| NFR-12 | แจ้งผู้ใช้ว่าบรีฟสร้างโดย AI | ✅ รองรับแล้ว | architecture.md §3.6 · db-spec.md §3.5 (`ai_generated_flag`) · [[detailed-design/engine-b-aroma-description\|detailed-design/engine-b-aroma-description.md]] Edge Case #4 | — | — |
| NFR-13 | มี Fallback Plan + ระบุผู้รับผิดชอบ | ⚠️ รองรับบางส่วน (Partial) | architecture.md §3.6, §5 · db-spec.md §3.5 (`is_fallback`) · [[detailed-design/engine-b-aroma-description\|detailed-design/engine-b-aroma-description.md]] Edge Case #5 — ครอบคลุมเฉพาะ **"Fallback Plan"** ทางเทคนิค | ส่วน **"ระบุผู้รับผิดชอบ"** ยังเป็นประเด็นกระบวนการ/องค์กร ไม่มี component หรือ operation ใดรองรับ (ระบุไว้ตรงๆ ใน architecture.md §5 ว่า "architecture ระดับนี้รองรับได้แค่ hook ทางเทคนิค") | **ไม่ใช่ช่องว่างที่ `sync-architecture`/`sync-api-db` แก้ได้** เพราะเป็นเรื่ององค์กร/กระบวนการนอกระบบ ควรบันทึกเป็นเอกสารนโยบาย (เช่น runbook หรือ RACI) แยกต่างหาก ไม่ใช่ architecture |
| NFR-14 | ผลสรุปหลักอ่านครบใน 1 หน้าจอ | ✅ รองรับแล้ว | architecture.md §3.1, §5 · [[detailed-design/dashboard-aroma-profile\|detailed-design/dashboard-aroma-profile.md]] Edge Case #3 | — | — |
| NFR-15 | Contrast ผ่าน WCAG 2.1 AA | ✅ รองรับแล้ว | architecture.md §3.1, §5 (อ้างอิง [[../DESIGN|DESIGN.md]]) | รายละเอียด token สี/contrast จริงอยู่ใน `DESIGN.md` แล้ว (ไม่ใช่หน้าที่ของ architecture.md ที่จะซ้ำเนื้อหา) | ไม่ต้องทำเพิ่ม |

**สรุป:** รองรับแล้ว **13/15** · รองรับแล้วมีเงื่อนไขให้ติดตาม **1/15** (NFR-09) · รองรับบางส่วน **1/15** (NFR-13) · ยังไม่รองรับ **0/15**

---

## 2. มติเรื่องข้อเสนอปรับถ้อยคำ NFR-09 (ตามที่ [[../../01-requirements/01-spec/20260818-03-formulation-manager-role|Formulation Manager Role Spec §3]] ร้องขอให้ nfr-review.md พิจารณาอย่างเป็นทางการ)

**ข้อเสนอเดิม (จากสเปก):**

> เดิม: *"สูตรของผู้ใช้ถือเป็นความลับทางการค้า ต้องเข้ารหัสขณะจัดเก็บ และแยกการเข้าถึงตามบัญชีอย่างเด็ดขาด"*
>
> ข้อเสนอ: *"...**ยกเว้นบทบาท Formulation Manager ที่เข้าถึงได้เฉพาะสูตรภายในบัญชี/องค์กรเดียวกันเท่านั้นตาม FR-42 — ห้ามขยายข้อยกเว้นนี้ไปยังบทบาทอื่นหรือข้ามบัญชี/องค์กรโดยไม่มีการอนุมัติและปรับ NFR-09 เพิ่มเติม**"*

**ผลการตรวจสอบของ nfr-review นี้:** ชั้นออกแบบเชิงเทคนิค (architecture.md, api-spec.md, db-spec.md) ได้ implement ข้อยกเว้นนี้ไว้ครบและสอดคล้องกันแล้วทั้ง 3 ไฟล์ — `Organization` entity, `User.organization_ref`, `ListOrganizationFormulas` ที่บังคับกรองด้วยองค์กรเสมอ (BR-08), และ Audit Log ทุกครั้งที่ Formulation Manager เข้าถึงข้ามผู้ใช้ (FR-38) ดังนั้น**เชิงเทคนิคถือว่า NFR-09 รองรับ FR-42 ได้อย่างสมบูรณ์แล้ว**

**สิ่งที่ยังไม่เกิดขึ้น:** ถ้อยคำจริงใน `20260818-01-ai-perfumery-core.md` §5 ยังไม่ถูกแก้ (ยังคงเป็นเวอร์ชันเดิมที่ไม่มีข้อยกเว้น) — nfr-reviewer **ไม่มีสิทธิ์แก้ไฟล์ spec ต้นทาง** ตามกฎความปลอดภัยของตัวเอง จึงทำได้แค่รายงานว่า:

- **แนะนำ:** ยอมรับข้อเสนอปรับถ้อยคำตามที่ระบุไว้ข้างต้น เพราะสอดคล้อง 100% กับสิ่งที่ถูก implement จริงในชั้นออกแบบแล้ว
- **ผู้ที่ต้องตัดสินใจ:** ผู้ใช้/Product Owner ของโปรเจกต์นี้ (ไม่ใช่ agent ใดตัดสินใจแทน)
- **ขั้นตอนถัดไปถ้าอนุมัติ:** แก้ไข `20260818-01-ai-perfumery-core.md` §5 โดยตรง (นอกขอบเขตเครื่องมือของ nfr-reviewer) แล้วอัปเดต `backlog.md` ให้สะท้อนถ้อยคำใหม่

---

## 3. ประเด็นที่ nfr-review นี้เลือก**ไม่**หยิบยกเป็นช่องว่างทางเทคนิค

- **NFR-04/NFR-05 กับโมดูล Data Steward:** แม้ยังไม่มี detailed-design ของ Data Steward (module G) แต่ architecture.md/api-spec.md/db-spec.md ระบุ component/operation/entity ที่รับผิดชอบไว้ชัดเจนแล้ว — ถือว่า NFR รองรับแล้วในชั้นออกแบบ การไม่มี detailed-design เป็นเรื่องขอบเขต MVP ของรอบนี้ ไม่ใช่ช่องว่างของ NFR
- **Tech-stack-dependent items** (encryption algorithm, index จริง, retention job อัตโนมัติ) — ทุกข้อถูกจงใจปล่อยว่างไว้จนกว่า `technology-stack.md` จะมีเนื้อหา ตามกฎของทั้ง 3 เอกสารเชิงเทคนิค ไม่ใช่ความบกพร่องของรอบ review นี้

---

## 4. เอกสารที่เกี่ยวข้อง

- [[../../01-requirements/backlog|Backlog]] — แหล่งความจริงของรายการ NFR ทั้งหมด
- [[architecture|Architecture]]
- [[api-spec|API Spec]]
- [[db-spec|DB Spec]]
- `detailed-design/` — [[detailed-design/formula-management|formula-management]], [[detailed-design/engine-a-calculation|engine-a-calculation]], [[detailed-design/olfactory-threshold-filter|olfactory-threshold-filter]], [[detailed-design/engine-b-aroma-description|engine-b-aroma-description]], [[detailed-design/ifra-compliance-check|ifra-compliance-check]], [[detailed-design/muddy-accord-detection|muddy-accord-detection]], [[detailed-design/dashboard-aroma-profile|dashboard-aroma-profile]], [[detailed-design/account-identity-audit-consent|account-identity-audit-consent]], [[detailed-design/prohibited-substance-guard|prohibited-substance-guard]]
- [[../../01-requirements/01-spec/20260818-03-formulation-manager-role|Formulation Manager Role Spec]] — ต้นทางของมติในหัวข้อ 2
