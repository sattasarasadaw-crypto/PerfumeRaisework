# DESIGN.md — Design System

**AI Perfumery Formulation Assistant**

- **อัปเดตล่าสุด:** 2026-08-18
- **สถานะ:** Single Source of Truth ของงานออกแบบเชิงภาพทั้งโปรเจกต์
- **ที่มา:** `reference/design_prompt_ai_perfumery_dashboard.md`

> ⚠️ **กติกาการใช้งาน:** Prototype ทุกตัวใน `01-prototypes/` ต้องยึด token และกฎในเอกสารนี้เท่านั้น
> ห้ามกำหนดสี/ฟอนต์/ระยะห่างใหม่นอกเอกสารนี้ — ถ้าต้องเปลี่ยน ให้แก้ที่นี่ก่อนแล้วค่อยสะท้อนไป Prototype

---

## 1. Brand Identity & CI

### 1.1 ตัวตนของแบรนด์

| หัวข้อ | รายละเอียด |
|---|---|
| **Personality** | *"นักคิดผู้สร้างสรรค์ที่พูดจาเป็นทางการ"* — เหมือนสมุดบันทึกของนักเคมีที่เป็นศิลปินไปในตัว |
| **ไม่ใช่** | ❌ สเปรดชีตห้องแล็บที่เย็นชา · ❌ แอปไลฟ์สไตล์ที่ดูเล่นเกินไป |
| **ความรู้สึกเป้าหมาย** | *"หยิบขวดน้ำหอมโบราณมาวางข้างสมุดจดสูตรเคมี"* |

### 1.2 หลักการ 3 ข้อ

1. **น่าเชื่อถือ แม่นยำ มีลำดับขั้นชัดเจน** — เหมือนรายงานวิทยาศาสตร์
2. **อบอุ่น เข้าถึงง่าย อ่านสบายตา** — ไม่ใช้ศัพท์เทคนิคดิบๆ โดยไม่มีคำอธิบายกำกับ
3. **มีจังหวะโค้งมนนุ่มนวลของธรรมชาติ/ศิลปะ** แทรกในรายละเอียด ไม่แข็งทื่อ

### 1.3 ผู้ใช้เป้าหมาย
มืออาชีพที่ต้องอ่านข้อมูลเชิงลึกเร็ว ตัดสินใจแม่นยำ และรู้สึกว่าเครื่องมือนี้ **"น่าเชื่อถือเท่าห้องแล็บ แต่มีจิตวิญญาณเท่างานศิลปะ"**

---

## 2. Design Tokens

### 2.1 Color Palette

| Token | ชื่อ | Hex | ใช้ทำอะไร |
|---|---|---|---|
| `--color-bg` | **Vapor Mist** | `#F3EFE7` | พื้นหลังหลัก อบอุ่นแบบกระดาษ/ฉลากขวด — **ไม่ใช่ขาวจั๋ว** |
| `--color-ink` | **Absolute Ink** | `#20281F` | ข้อความหลัก / พื้นผิวเข้ม เหมือนแก้วขวดน้ำหอมสีเข้ม |
| `--color-accent` | **Amber Glass** | `#C0813A` | สีเน้นหลัก (primary accent) — ปุ่ม / ไฮไลต์สำคัญ |
| `--color-support` | **Botanical Sage** | `#7E8F6E` | ข้อมูลรอง / กราฟ / ค่าที่ **"ผ่าน"** |
| `--color-heart` | **Rose Attar** | `#B15E6C` | Heart note / จุดเน้นเชิงอารมณ์ |
| `--color-warn` | **Ember Warn** | `#BD5A2E` | ⚠️ แจ้งเตือน Muddy Accord / IFRA FAIL **เท่านั้น** — ใช้ให้น้อยที่สุด |

**สีที่ได้จากการผสม (Derived):**

| Token | ค่า | ใช้ทำอะไร |
|---|---|---|
| `--color-surface` | `#FAF8F3` | พื้นการ์ด (สว่างกว่าพื้นหลังเล็กน้อย) |
| `--color-divider` | `rgba(32, 40, 31, 0.12)` | เส้นแบ่งบาง |
| `--color-ink-muted` | `rgba(32, 40, 31, 0.62)` | ข้อความรอง / คำอธิบาย |
| `--color-accent-soft` | `rgba(192, 129, 58, 0.14)` | พื้นหลังชิป/badge สีเน้น |
| `--color-support-soft` | `rgba(126, 143, 110, 0.16)` | พื้นหลัง badge "ผ่าน" |
| `--color-warn-soft` | `rgba(189, 90, 46, 0.14)` | พื้นหลัง badge แจ้งเตือน |

**🚫 ห้ามใช้:**
- พาเลตต์ cream + terracotta (แพทเทิร์นซ้ำของ AI dashboard ทั่วไป)
- dark mode + เขียวนีออน
- แดง/เขียวมาตรฐานสำหรับ Diff View — ให้ใช้ Amber เข้ม (เพิ่มขึ้น) / Sage อ่อน (ลดลง) แทน

### 2.2 Typography — 3 บทบาท ห้ามปนกัน

| บทบาท | Token | ประเภทฟอนต์ | ใช้กับ |
|---|---|---|---|
| **Display** | `--font-display` | Serif แบบฉลากน้ำหอม/apothecary (แนว Fraunces, Canela) | หัวข้อใหญ่ และ **"AI Auto-Generated Profile"** เท่านั้น — ให้ความรู้สึกเป็นคำโปรยบนฉลากขวด |
| **Body** | `--font-body` | Humanist sans อ่านง่าย (แนว Inter, General Sans) | เนื้อหาที่มีข้อมูลหนาแน่น |
| **Data / Utility** | `--font-mono` | Monospace หรือ grotesk เชิงเทคนิค (แนว IBM Plex Mono) | ตัวเลข / รหัสเคมี / หน่วย (ppm, %, บาท/กก.) — ให้รู้สึกเหมือนอ่านรายงานแล็บจริง |

**Type Scale**

| Token | ขนาด | Line-height | ใช้กับ |
|---|---|---|---|
| `--text-hero` | 40 px | 1.15 | Hero — AI Auto-Generated Profile |
| `--text-h1` | 28 px | 1.25 | หัวข้อหลักของหน้า |
| `--text-h2` | 20 px | 1.3 | หัวข้อการ์ด |
| `--text-body` | 15 px | 1.6 | เนื้อหาทั่วไป |
| `--text-small` | 13 px | 1.5 | คำอธิบายกำกับ / caption |
| `--text-data` | 15 px | 1.4 | ตัวเลขในตาราง (mono) |
| `--text-data-lg` | 26 px | 1.2 | ตัวเลขเด่น เช่น ค่า Longevity (mono) |

### 2.3 Spacing — สเกลฐาน 4

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--space-1` | 4 px | ระยะชิดสุด |
| `--space-2` | 8 px | ภายใน chip / badge |
| `--space-3` | 12 px | ระหว่างบรรทัดในกลุ่มเดียวกัน |
| `--space-4` | 16 px | padding ภายในการ์ดขนาดเล็ก |
| `--space-6` | 24 px | padding มาตรฐานของการ์ด |
| `--space-8` | 32 px | ระยะระหว่างการ์ด |
| `--space-12` | 48 px | ระยะระหว่าง section |
| `--space-16` | 64 px | ขอบบน/ล่างของหน้า |

> **หลักการ:** Grid โปร่ง เว้นขอบเยอะ (generous whitespace) — ให้ความรู้สึก *"lab notebook พบ art journal"*

### 2.4 Radius & Elevation

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--radius-sm` | 6 px | chip, badge, input |
| `--radius-md` | 12 px | การ์ดมาตรฐาน |
| `--radius-lg` | 20 px | การ์ด hero, panel ใหญ่ |
| `--shadow-card` | `0 1px 2px rgba(32,40,31,.04), 0 8px 24px rgba(32,40,31,.05)` | เงาการ์ด — นุ่ม บางมาก |

> ใช้**เส้นแบ่ง (divider) บาง** แทนกรอบหนา

---

## 3. UI Components & Patterns

### 3.1 Card (องค์ประกอบพื้นฐาน)
- โครงสร้างแบบการ์ดเป็นหลัก — **ห้ามทำตารางเต็มจอที่ดูเป็นสเปรดชีต**
- พื้น `--color-surface` · radius `--radius-md` · padding `--space-6` · เงา `--shadow-card`

### 3.2 Status Chip
| สถานะ | สีข้อความ | สีพื้น | ใช้เมื่อ |
|---|---|---|---|
| ✅ ผ่าน | `--color-support` | `--color-support-soft` | IFRA PASS |
| ⚠️ แจ้งเตือน | `--color-warn` | `--color-warn-soft` | Muddy Accord Risk / IFRA FAIL |
| ℹ️ ข้อมูล | `--color-accent` | `--color-accent-soft` | ป้ายข้อมูลทั่วไป |

### 3.3 Scent Pyramid — ⭐ Signature Element
**จุดจำหลักของดีไซน์:** พีระมิดกลิ่นในรูป **ทรงขวดน้ำหอมโปร่งแสง** ไล่เฉดสีตามชั้น

| ชั้น | ช่วงเวลา | สีประจำชั้น |
|---|---|---|
| **Top** | 0–15 นาที | `--color-accent` (Amber Glass) |
| **Heart** | 1–4 ชั่วโมง | `--color-heart` (Rose Attar) |
| **Base** | 6+ ชั่วโมง | `--color-ink` (Absolute Ink) |

พร้อมม่านหมอก (mist/gradient) เคลื่อนไหวแผ่วเบาแทนค่า Sillage — เป็นภาพเดียวที่ผสานเคมี (เลเยอร์ข้อมูล) กับศิลปะ (ทรงขวด, แสง)

### 3.4 Micro-Cluster Spectrum
- กราฟแท่งหรือ radial แสดง **top 8–10 กลุ่มเด่น** จาก 100 กลุ่ม
- มีลิงก์ "ดูทั้งหมด" — **ห้ามโชว์ทั้ง 100 กลุ่มพร้อมกัน**
- ใช้ `--color-support` เป็นสีหลักของกราฟ

### 3.5 Command Bar
- แถบพิมพ์คำสั่ง **ลอยด้านล่างจอ**
- มี chip คำถามลัด เช่น *"ดูคู่ Synergy"*, *"ตารางสารก่อแพ้"*, *"ต้นทุนต่อกิโลกรัม"*

### 3.6 Diff View (What-If Simulation)
- มุมมองก่อน/หลัง ไฮไลต์ค่าที่เปลี่ยน
- **Amber เข้ม** = เพิ่มขึ้น · **Sage อ่อน** = ลดลง (แทนแดง/เขียวทั่วไป)

### 3.7 ลวดลาย/โมทีฟ (ใช้เบาบาง)
- เส้น line-art โครงสร้างโมเลกุล (molecular bond) เป็น texture จางๆ **5–8% opacity** ที่มุมจอหรือพื้นหลังการ์ด
- ภาพเส้น botanical (กลีบดอก/ใบไม้) เป็น accent **มุมจอเท่านั้น**
- ทรงขวดแก้ว/vial ใช้เป็นกรอบภาพสำหรับ visualization หลัก — ไม่ใช่แค่ไอคอนตกแต่ง

---

## 4. Layout Principles

### 4.1 ลำดับชั้นข้อมูล
```
Headline (บรีฟกลิ่น)  →  ภาพข้อมูล (กราฟ/พีระมิด)  →  แจ้งเตือน/ปุ่มสั่งการ
```

### 4.2 โครงสร้างหน้า Dashboard

| ลำดับ | ส่วน | เนื้อหา |
|---|---|---|
| 1 | **Hero — AI Auto-Generated Profile** | คำบรรยายกลิ่นด้วย display font ขนาดใหญ่ เหมือนคำโปรยฉลากน้ำหอม พร้อมตัวเลือกโทนเสียง (เชิงเคมี / การตลาด / ไทย-อังกฤษ) |
| 2 | **Micro-Cluster Spectrum** | กราฟ top 8–10 กลุ่มเด่น + ลิงก์ "ดูทั้งหมด" |
| 3 | **Scent Pyramid & Performance** | พีระมิด/ทรงขวดไล่ชั้นสี + badge Longevity และ Sillage |
| 4 | **System Alerts** | แถบ/ชิปเรียบๆ — Sage = ผ่าน IFRA, Ember Warn = Muddy Accord พร้อมปุ่ม "ขอคำแนะนำปรับลด" |
| 5 | **Command Bar** | ลอยด้านล่างจอ |

### 4.3 กฎการจัดวาง
- ✅ Grid โปร่ง เว้นขอบเยอะ
- ✅ ใช้เส้นแบ่งบางแทนกรอบหนา
- ✅ ปุ่มลัด/ตัวเลขลำดับ ใช้เฉพาะจุดที่เป็นลำดับจริง (เช่น step 4 ขั้น)
- ❌ ไม่ใส่เลข 01/02/03 ประดับเฉยๆ

---

## 5. Motion & Interaction

> **หลักการ:** เบาที่สุดเท่าที่จำเป็น — ต้องดู**น่าเชื่อถือ ไม่ใช่ flashy**

| พฤติกรรม | รายละเอียด |
|---|---|
| **Count-up** | ตัวเลขนับขึ้น/ลงเมื่อคำนวณใหม่ — แทน skeleton loading ทื่อๆ |
| **Graph transition** | กราฟเปลี่ยนอย่างนุ่มนวลตอนสลับ What-If |
| **หลีกเลี่ยง** | animation เยอะเกินความจำเป็น |

**Duration มาตรฐาน:** `--motion-fast` 150 ms · `--motion-base` 240 ms · `--motion-slow` 400 ms (count-up)
**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 6. UX Guidelines & Rules

### 6.1 กฎบังคับที่ผูกกับ Requirement

| กฎ | อ้างอิง |
|---|---|
| ผลสรุปหลัก (บรีฟกลิ่น + IFRA + คำเตือน) ต้องอ่านครบใน **1 หน้าจอโดยไม่ต้องเลื่อน** ที่ 1440×900 | NFR-14 |
| ทุกค่าที่แสดงต้อง**คลิกดูที่มาของการคำนวณได้** | NFR-08 |
| ต้องมีข้อความกำกับชัดเจนว่า**คำบรรยายกลิ่นสร้างโดย AI** และต้องผ่านการยืนยันจากมนุษย์ | NFR-12 |
| Contrast ratio ต้องผ่าน **WCAG 2.1 ระดับ AA** เป็นอย่างน้อย | NFR-15 |
| สารที่ถูกตัดด้วย ODT **ต้องแสดงให้ผู้ใช้เห็น** ไม่ใช่ซ่อน | FR-17 |
| เมื่อ IFRA = FAIL ปุ่ม Export รายงานฉบับสมบูรณ์ต้อง **disabled** พร้อมเหตุผล | BR-02 |

### 6.2 การใช้ภาษา

- ✅ ศัพท์เคมีต้องมี**คำอธิบายกำกับ**ให้คนอ่านเข้าใจง่าย
- ✅ ตัวเลขและหน่วยใช้ `--font-mono` เสมอ
- ❌ ห้ามใช้ศัพท์เคมีล้วนๆ ที่ไม่มีคำอธิบาย
- ❌ ห้ามใช้ศัพท์โปรแกรมเมอร์กับผู้ใช้ (ผู้ใช้เป็นนักปรุงน้ำหอม ไม่ใช่สายเทคนิค)

### 6.3 การจัดการสถานะ (State Handling)

| สถานะ | ต้องทำอย่างไร |
|---|---|
| **Empty** | เมื่อยังไม่มีสูตร แสดงคำแนะนำขั้นแรกพร้อมปุ่มสร้างสูตรใหม่ ไม่ใช่หน้าว่างเปล่า |
| **Loading** | ใช้ count-up ของตัวเลข ไม่ใช้ skeleton block |
| **Error** | บอกว่าเกิดอะไรขึ้นและ**จะแก้ยังไง** ไม่ใช่แค่แจ้งว่าผิดพลาด |
| **Disabled** | ปุ่มที่ปิดใช้งานต้อง**แสดงเหตุผล**เสมอ (เช่น "ผลรวมยังไม่ครบ 100%") |
| **Blocked by rule** | เมื่อถูกกติกาบล็อก ต้องอ้างกติกาที่เกี่ยวข้องให้ผู้ใช้เข้าใจ |

---

## 7. สิ่งที่ต้องหลีกเลี่ยง (สรุป)

| ❌ ห้าม | เพราะ |
|---|---|
| พาเลตต์ cream+terracotta / dark+เขียวนีออน | เป็นแพทเทิร์นซ้ำของ AI dashboard ทั่วไป |
| ตารางสารเคมีดิบเต็มจอบนหน้าแรก | ผู้ใช้จมกับข้อมูล 2,000–3,000 ชนิด |
| ศัพท์เคมีล้วนๆ ไม่มีคำอธิบาย | ขัดกับ personality ข้อ 2 |
| แอนิเมชัน/ของตกแต่งที่ไม่สื่อสารข้อมูล | ลดความน่าเชื่อถือ |
| แสดงทั้ง 100 Micro-Cluster พร้อมกัน | Cognitive overload |

---

## 8. CSS Variables (พร้อมคัดลอกไปใช้ใน Prototype)

```css
:root {
  /* Color — Core */
  --color-bg: #F3EFE7;
  --color-ink: #20281F;
  --color-accent: #C0813A;
  --color-support: #7E8F6E;
  --color-heart: #B15E6C;
  --color-warn: #BD5A2E;

  /* Color — Derived */
  --color-surface: #FAF8F3;
  --color-divider: rgba(32, 40, 31, 0.12);
  --color-ink-muted: rgba(32, 40, 31, 0.62);
  --color-accent-soft: rgba(192, 129, 58, 0.14);
  --color-support-soft: rgba(126, 143, 110, 0.16);
  --color-warn-soft: rgba(189, 90, 46, 0.14);

  /* Typography */
  --font-display: Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, 'Segoe UI', 'Noto Sans Thai', sans-serif;
  --font-mono: 'IBM Plex Mono', 'SF Mono', Consolas, monospace;

  --text-hero: 40px;
  --text-h1: 28px;
  --text-h2: 20px;
  --text-body: 15px;
  --text-small: 13px;
  --text-data: 15px;
  --text-data-lg: 26px;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px;

  /* Radius & Elevation */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-card: 0 1px 2px rgba(32,40,31,.04), 0 8px 24px rgba(32,40,31,.05);

  /* Motion */
  --motion-fast: 150ms;
  --motion-base: 240ms;
  --motion-slow: 400ms;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## เอกสารที่เกี่ยวข้อง

- Prototype: [[01-prototypes/index]]
- Feature List: [[feature-list]]
- User Journey: [[user-journey]]
- Acceptance Criteria: [[../03-testing/01-test-plan/acceptance-criteria]]
