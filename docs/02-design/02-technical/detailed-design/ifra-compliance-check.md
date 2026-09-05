# Detailed Design — F-05 IFRA Compliance Check

- **อัปเดตล่าสุด:** 2026-08-28
- **ฟีเจอร์:** [[../../feature-list#F-05 IFRA Compliance Check|F-05 IFRA Compliance Check]] (FR-21, FR-22, NFR-02)
- **ที่มา:** [[../api-spec|API Spec]] §5 โมดูล C (ส่วนหนึ่งของ CalculateFormula) + §7 โมดูล E (ExportFormulaReport) + [[../db-spec|DB Spec]] §3.6 + [[../../user-journey#UJ-02 — Journey รอง: เจอ IFRA FAIL แล้วแก้สูตรจนผ่าน|UJ-02]]
- **ระดับเอกสาร:** Conceptual — ไม่ผูก tech stack

---

## 1. Sequence Diagram

```mermaid
sequenceDiagram
    participant EA as Engine A
    participant CR as Compliance & Risk Module
    participant REG as Regulatory Ruleset Store
    participant C as Client
    actor U as Perfumer

    EA->>CR: ส่งผลคำนวณระดับสาร/กลุ่มไปตรวจ (FR-21)
    CR->>REG: ดึง RegulatoryLimit ประเภท RESTRICTION ล่าสุดของสาร/กลุ่มที่เกี่ยวข้อง
    REG-->>CR: เพดานที่ใช้ตรวจ (amendment_version, max_percentage)
    CR->>CR: เทียบค่าจริงกับเพดานทุกรายการ
    alt ทุกรายการอยู่ต่ำกว่าเพดาน
        CR->>CR: สร้าง ComplianceCheckResult (overall_status=PASS)
        CR-->>C: ป้ายเขียว + ระยะห่างจากเพดานที่เหลือ (FR-22)
    else มีรายการเกินเพดาน
        CR->>CR: สร้าง ComplianceCheckResult (overall_status=FAIL) + ComplianceViolation ต่อรายการที่เกิน
        CR-->>C: ป้ายแดง + ชื่อสารที่เกิน + ส่วนต่าง ppm/% (FR-22)
        C-->>C: ปิดปุ่ม Export รายงานฉบับสมบูรณ์ (BR-02)
        loop จนกว่าจะ PASS
            U->>C: ลดสัดส่วนสารที่เกิน
            C->>EA: คำนวณใหม่ (ผ่าน UpdateFormulaComposition + CalculateFormula)
            EA->>CR: ส่งผลคำนวณใหม่ไปตรวจซ้ำ ภายใน 300ms (NFR-02)
            CR->>REG: ดึงเพดานล่าสุดอีกครั้ง
        end
    end
```

## 2. Operation ↔ Entity ที่กระทบ

| Operation | Entity ที่กระทบ | การกระทำ | ลำดับก่อน-หลัง |
|---|---|---|---|
| `CalculateFormula` (ส่วน Compliance) | `ComplianceCheckResult` | สร้าง (1 แถวต่อ `FormulaCalculationRun`) | หลัง Engine A คำนวณเสร็จ |
| `CalculateFormula` (ส่วน Compliance) | `ComplianceViolation` | สร้าง (1 แถวต่อรายการที่เกินเพดาน) | เฉพาะเมื่อ `overall_status=FAIL` |
| `CalculateFormula` (ส่วน Compliance) | `RegulatoryLimit` (limit_type=RESTRICTION) | อ่านอย่างเดียว | อ่านทุกครั้งที่ตรวจ ไม่แคชค่าเก่าไว้ใช้ซ้ำ (NFR-07) |
| `ExportFormulaReport` | `ComplianceCheckResult`, `ExportedReport` | อ่าน `ComplianceCheckResult` ล่าสุด แล้วสร้าง/ปฏิเสธ `ExportedReport` | ต้องมี `ComplianceCheckResult` ของ `calculation_id` นั้นอยู่ก่อนเสมอ |

## 3. State Diagram — สถานะ Compliance ที่ผู้ใช้เห็นต่อสูตรหนึ่งสูตร

```mermaid
stateDiagram-v2
    [*] --> NotChecked: สร้าง/แก้สูตรแต่ยังไม่คำนวณ
    NotChecked --> PASS: CalculateFormula (ทุกรายการต่ำกว่าเพดาน)
    NotChecked --> FAIL: CalculateFormula (มีรายการเกินเพดาน)
    FAIL --> FAIL: แก้สัดส่วน + คำนวณใหม่ (ยังเกินอยู่)
    FAIL --> PASS: แก้สัดส่วน + คำนวณใหม่ (ต่ำกว่าเพดานแล้ว)
    PASS --> FAIL: แก้สัดส่วนใหม่จนกลับไปเกินเพดาน
    FAIL --> [*]: Export ถูกบล็อกตลอดที่ยังอยู่สถานะนี้ (BR-02)
    PASS --> [*]: อนุญาต Export รายงานฉบับสมบูรณ์
```

> หมายเหตุ: แต่ละ transition คือการสร้าง `ComplianceCheckResult` แถวใหม่จาก `FormulaCalculationRun` ใหม่ (ไม่ใช่การแก้ไขแถวเดิม) — Diagram นี้อธิบาย "สถานะที่ผู้ใช้รับรู้ล่าสุด" ไม่ใช่ state ของ entity เดี่ยวๆ

## 4. Edge Case และวิธีจัดการ

| # | สถานการณ์ | พฤติกรรมที่ต้องเกิด | อ้างอิง |
|---|---|---|---|
| 1 | ทุกสารต่ำกว่าเพดาน IFRA | แสดง PASS พร้อมระยะห่างจากเพดานที่เหลือของสารที่ใกล้เพดานที่สุด | AC-05.1 |
| 2 | มีสารเกินเพดาน | แสดง FAIL พร้อมชื่อสารที่เกินและส่วนต่างเป็น ppm หรือ % | AC-05.2 |
| 3 | ผู้ใช้ลดสัดส่วนสารที่เกินจนต่ำกว่าเพดาน | ต้องตรวจซ้ำอัตโนมัติโดยผู้ใช้ไม่ต้องกดคำนวณเอง และเปลี่ยนเป็น PASS ภายใน 300 มิลลิวินาที | AC-05.3, NFR-02 |
| 4 | สถานะ IFRA เป็น FAIL แล้วผู้ใช้กด Export รายงานฉบับสมบูรณ์ | ปุ่มต้องอยู่ในสถานะปิดใช้งาน พร้อมเหตุผลว่าสูตรยังไม่ผ่านเกณฑ์ IFRA — ห้าม Export จนกว่าจะแก้เป็น PASS | AC-05.4, BR-02 |
| 5 | สารที่ถูก Threshold Filter ตัดออกไปแล้ว (F-03) | ยังคงถูกนับในการตรวจ IFRA ตามปกติ ไม่ถูกยกเว้น | BR-03 |
| 6 | สารมีสถานะ Regulatory Limit เป็น PROHIBITION | **ไม่ใช่หน้าที่ของ component นี้** — ถูกบล็อกไปแล้วตั้งแต่จุดเลือกสารโดย Formula Management Module ก่อนจะมาถึงขั้นคำนวณ (ดู [[prohibited-substance-guard|Detailed Design F-18]]) | FR-40, FR-41 |

## 5. เอกสารที่เกี่ยวข้อง

- [[../api-spec|API Spec]] §5 โมดูล C, §7 โมดูล E
- [[../db-spec|DB Spec]] §3.6
- [[../../feature-list|Feature List]]
- [[../../user-journey|User Journey]] UJ-02
- [[../../../03-testing/01-test-plan/acceptance-criteria|Acceptance Criteria]] AC-05.1–AC-05.4
- [[prohibited-substance-guard|Detailed Design F-18]] — กลไก PROHIBITION ที่ทำงานก่อนขั้นตอนนี้เสมอ
