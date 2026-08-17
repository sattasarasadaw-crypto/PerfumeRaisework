# สูตรตัวอย่าง EDP-001 "Amber Sage"

> ชุดข้อมูลที่ใช้ใน [Prototype v1](index.html) — สร้างจากคลังวัตถุดิบจริงของโครงการ

- **วันที่:** 2026-08-18
- **ประเภท:** Eau de Parfum — หัวน้ำหอมเข้มข้น **20%** ในเอทานอล
- **จำนวนสาร:** 26 ตัว · **ผลรวม:** 100.00%
- **แนวกลิ่น:** Woody Amber Floral

---

## 1. แหล่งที่มาของข้อมูล — อะไรจริง อะไรสมมติ

| ข้อมูล | สถานะ | หมายเหตุ |
|---|---|---|
| ชื่อสาร + CAS Number | ✅ **จริง** | จากคลังวัตถุดิบของโครงการ (127 สาร) |
| เพดาน IFRA Category 4 | ✅ **จริง** | จาก IFRA 51st Amendment Standards Overview — จับคู่ได้ 46/127 สาร |
| สัดส่วน % ของสูตร | ✅ ออกแบบเอง | ตามหลักโครงสร้าง Top/Heart/Base |
| การจัดกลุ่ม Micro-Cluster | ⚠️ **สมมติ** | รอ Rule Sheet ฉบับเต็ม (ความเสี่ยง R-01) |
| ค่า ODT รายสาร | ⚠️ **สมมติ** | ยังไม่ตัดสินใจแหล่งข้อมูล (Open Issue OI-03) |
| ค่า Synergy / Suppression | ⚠️ **สมมติ** | รอ Rule Sheet ฉบับเต็ม |
| ราคาวัตถุดิบ | ⚠️ **ค่าแทน (placeholder)** | ราคาจริงเป็นข้อมูลภายใน ไม่รวมอยู่ใน repo นี้ |

> 📌 **สรุป:** ชื่อสาร CAS และเพดาน IFRA เป็นข้อมูลจริงและตรวจสอบได้จากแหล่งสาธารณะ
> ส่วนค่าที่เกี่ยวกับกลไกการคำนวณของ Engine เป็นค่าสมมติทั้งหมด เพื่อสาธิต UI เท่านั้น

---

## 2. ตารางสูตร

`%ในขวด` = `%สูตร` × 0.20 — **เพดาน IFRA คิดจากผลิตภัณฑ์สำเร็จรูป ไม่ใช่หัวน้ำหอมเข้มข้น**

### ชั้น Top — 24.0%

| สาร | CAS | %สูตร | %ในขวด | เพดาน IFRA Cat 4 | ใช้ไป |
|---|---|---|---|---|---|
| Limonene (D-limonene) | 5989-27-5 | 5.70 | 1.140 | *specification* | — |
| Linalool | 78-70-6 | 6.00 | 1.200 | *specification* | — |
| Dihydromyrcenol | 18479-58-8 | 5.00 | 1.000 | ไม่จำกัด | — |
| Linalyl Acetate | 115-95-7 | 4.00 | 0.800 | ไม่จำกัด | — |
| **Citral** | 5392-40-5 | 2.80 | 0.560 | **0.6%** | ⚠️ **93%** |
| Cis-3-Hexenol | 928-96-1 | 0.30 | 0.060 | ไม่จำกัด | — |
| Aldehyde C-10 (Decanal) | 112-31-2 | 0.20 | 0.040 | ไม่จำกัด | — |

### ชั้น Heart — 29.2%

| สาร | CAS | %สูตร | %ในขวด | เพดาน IFRA Cat 4 | ใช้ไป |
|---|---|---|---|---|---|
| Methyl Dihydrojasmonate (Hedione) | 24851-98-7 | 12.00 | 2.400 | ไม่จำกัด | — |
| Phenethyl Alcohol | 60-12-8 | 6.00 | 1.200 | ไม่จำกัด | — |
| Citronellol | 106-22-9 | 4.00 | 0.800 | 12% | 7% |
| Geraniol | 106-24-1 | 3.00 | 0.600 | 4.7% | 13% |
| Alpha-methyl Ionone | 127-42-4 | 3.00 | 0.600 | 30% | 2% |
| Hexyl Salicylate | 6259-76-3 | 1.00 | 0.200 | 6.5% | 3% |
| Rose Oxide | 16409-43-1 | 0.15 | 0.030 | ไม่จำกัด | — |
| Indole | 120-72-9 | 0.03 | 0.006 | ไม่จำกัด | — |
| Damascenone Total | 23696-85-7 | 0.02 | 0.004 | 0.043% | 9% |

### ชั้น Base — 46.8%

| สาร | CAS | %สูตร | %ในขวด | เพดาน IFRA Cat 4 | ใช้ไป |
|---|---|---|---|---|---|
| Iso E Super (Anthamber) | 54464-57-2 | 18.00 | 3.600 | 20% | 18% |
| Habanolide | 111879-80-2 | 8.00 | 1.600 | ไม่จำกัด | — |
| Galaxolide (HHCB) | 1222-05-5 | 7.00 | 1.400 | ไม่จำกัด | — |
| Cedramber | 19870-74-7 | 4.00 | 0.800 | ไม่จำกัด | — |
| Ethylene Brassylate | 105-95-3 | 4.00 | 0.800 | ไม่จำกัด | — |
| Ambroxan | 6790-58-5 | 3.00 | 0.600 | ไม่จำกัด | — |
| Coumarin | 91-64-5 | 1.20 | 0.240 | 1.5% | 16% |
| Timberol | 70788-30-6 | 1.00 | 0.200 | 1.3% | 15% |
| Vanillin | 121-33-5 | 0.50 | 0.100 | ไม่จำกัด | — |
| Evernyl (Veramoss) | 4707-47-5 | 0.10 | 0.020 | ไม่จำกัด | — |

**รวม 100.00%**

---

## 3. ผลตรวจ IFRA Category 4 (Fine Fragrance)

**สถานะ: ✅ PASS ทุกสาร**

| สารที่ตึงที่สุด | %ในขวด | เพดาน | ระยะห่างที่เหลือ |
|---|---|---|---|
| **Citral** | 0.560% | 0.600% | **0.040%** ← จุดเสี่ยงที่สุดของสูตร |
| Iso E Super | 3.600% | 20.0% | 16.400% |
| Coumarin | 0.240% | 1.5% | 1.260% |
| Timberol | 0.200% | 1.3% | 1.100% |

### ⚠️ ผลเมื่อเปลี่ยนความเข้มข้นของผลิตภัณฑ์

| ประเภท | ความเข้มข้น | Citral ในขวด | ผล |
|---|---|---|---|
| EDT | 12% | 0.336% | ✅ PASS |
| **EDP** | **20%** | **0.560%** | **✅ PASS (93% ของเพดาน)** |
| Parfum | 30% | 0.840% | ❌ **FAIL — เกินเพดาน 0.24%** |

> **นี่คือเคสที่ใช้สาธิตใน Prototype:** สลับความเข้มข้นเป็น **Parfum 30%** แล้วสถานะจะเปลี่ยนเป็น FAIL ทันทีโดยไม่ต้องแก้สูตรเลย — แสดงให้เห็นว่าทำไมการตรวจ IFRA ต้องผูกกับความเข้มข้นของผลิตภัณฑ์ ไม่ใช่ตรวจที่หัวน้ำหอมเข้มข้นอย่างเดียว
>
> ถ้าต้องการทำ Parfum 30% ต้องลด Citral จาก 2.80% เหลือไม่เกิน **2.00%**

---

## 4. 🚫 สารในคลังที่ IFRA ห้ามใช้

จากการตรวจคลังวัตถุดิบทั้งหมดกับ IFRA 51st Amendment พบสารที่มีสถานะ **PROHIBITION** จำนวน 3 ตัว — ไม่ได้ใส่ในสูตรนี้

| สาร | CAS |
|---|---|
| 6-methyl Coumarin | 92-48-8 |
| Musk Ambrette | 83-66-9 |
| Musk Xylol | 81-15-2 |

> 💡 **ข้อเสนอให้เพิ่มเป็น Requirement ใหม่:** สารที่มีสถานะ PROHIBITION ควรถูกบล็อกตั้งแต่**หน้าค้นหาสาร** ไม่ใช่ปล่อยให้เลือกเข้าสูตรแล้วค่อยไปเตือนตอนตรวจ IFRA
> เป็นคนละกรณีกับ RESTRICTION (ที่มีเพดาน %) เพราะ PROHIBITION ใช้ไม่ได้เลยไม่ว่าปริมาณเท่าไร — ปัจจุบัน FR-21/FR-22 ครอบคลุมเฉพาะ RESTRICTION

---

## 5. โครงสร้าง Micro-Cluster (สมมติ)

| กลุ่ม | สัดส่วน | สารในกลุ่ม |
|---|---|---|
| Woody Amber | 22.0% | Iso E Super, Cedramber |
| Rosy Alcohol | 13.0% | Phenethyl Alcohol, Citronellol, Geraniol |
| Macrocyclic Musk | 12.0% | Habanolide, Ethylene Brassylate |
| Jasmine Airy | 12.0% | Hedione |
| Citrus Terpene | 10.7% | Limonene, Dihydromyrcenol |
| Linalool Fresh | 10.0% | Linalool, Linalyl Acetate |
| Polycyclic Musk | 7.0% | Galaxolide |
| Citrus Aldehydic | 3.0% | Citral, Aldehyde C-10 |
| Ionone Powdery | 3.0% | Alpha-methyl Ionone |
| Ambergris | 3.0% | Ambroxan |
| Coumarinic Sweet | 1.7% | Coumarin, Vanillin |
| Salicylate Floral | 1.0% | Hexyl Salicylate |
| Sandalwood Dry | 1.0% | Timberol |
| Green Leaf | 0.3% | Cis-3-Hexenol |
| Rose Ketone | 0.17% | Rose Oxide, Damascenone Total |
| Mossy | 0.1% | Evernyl |
| Indolic Animalic | 0.03% | Indole |

**ผลตรวจ Muddy Accord (BR-04):** ✅ **ไม่เข้าเกณฑ์เสี่ยง**
- กลุ่มสูงสุด **Woody Amber 22.0%** (> 20%) ✓
- กลุ่มต่ำสุด **Indolic Animalic 0.03%** (< 5%) ✓
- โครงสร้างมีทั้งกลุ่มนำที่ชัดเจนและกลุ่มเสริมที่เบา = กลิ่นมีมิติ

---

## เอกสารที่เกี่ยวข้อง

- Prototype: [index.html](index.html) · [prototype.md](prototype.md)
- Design System: [[../../DESIGN]]
- User Journey: [[../../user-journey]]
- Test Case: [[../../../03-testing/01-test-plan/test-cases/dashboard-aroma-profile]]
