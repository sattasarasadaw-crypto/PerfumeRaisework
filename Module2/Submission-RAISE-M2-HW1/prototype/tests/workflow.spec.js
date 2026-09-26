// workflow.spec.js — เทสต์เส้นทางหลักของระบบ (ข้อ 1, 2, 3 ของการบ้าน)
//
// 🚫 ห้ามแก้โค้ดของระบบเพื่อให้เทสต์ผ่าน — ถ้าไม่ผ่านให้แยกก่อนว่าโค้ดผิดหรือเทสต์เขียนผิด

import { test, expect } from "@playwright/test";
import { loadAccounts, signIn, countFormulasOf, loginViaUi, SETUP_HINT } from "./helpers.js";

const accounts = loadAccounts();

test.describe.serial("เส้นทางหลัก: สร้างสูตร → เห็นในรายการ → ส่งตรวจ", () => {
  test.skip(!accounts, SETUP_HINT);

  // ชื่อไม่ซ้ำกันทุกครั้งที่รัน จะได้ไม่ชนกับข้อมูลเดิมในฐานข้อมูล
  const formulaName = `สูตรทดสอบอัตโนมัติ ${new Date().toISOString().slice(0, 19)}`;

  test("T1: นักปรุงสร้างสูตรใหม่แล้วต้องเห็นสูตรนั้นในรายการของตัวเอง", async ({ page }) => {
    await loginViaUi(page, accounts.perfumerA);

    // ปุ่ม "สร้างสูตรใหม่" ซ่อนอยู่จนกว่าจะโหลด role เสร็จ และโชว์เฉพาะ Perfumer
    const newBtn = page.locator("#newBtn");
    await expect(newBtn, "บัญชี A ต้องเป็น perfumer จึงจะเห็นปุ่มสร้างสูตรใหม่").toBeVisible({ timeout: 20_000 });
    await newBtn.click();
    await page.waitForURL("**/formula-new.html");

    // รอให้ตัวเลือกประเภทน้ำหอมโหลดมาจาก Firestore ก่อน
    await page.waitForFunction(() => {
      const el = document.querySelector("#fragranceType");
      return el && el.options.length > 0 && el.options[0].value !== "";
    }, null, { timeout: 20_000 });

    await page.fill("#name", formulaName);
    await page.selectOption("#fragranceType", { index: 0 });
    await page.fill("#brief", "โจทย์สมมติสำหรับชุดทดสอบอัตโนมัติ ไม่ใช่ข้อมูลลูกค้าจริง");
    await page.fill(".ing-row .ing-name", "Bergamot Oil");
    await page.fill(".ing-row .ing-percent", "5");

    await page.click('#formulaForm button[type="submit"]');
    await page.waitForURL("**/index.html", { timeout: 20_000 });

    await expect(page.locator("#rows")).toContainText(formulaName, { timeout: 20_000 });
    await expect(page.locator("#rows tr", { hasText: formulaName })).toContainText("draft");
  });

  test("T2: กดปุ่มส่งตรวจแล้วสถานะต้องเปลี่ยนจาก draft เป็น submitted", async ({ page }) => {
    await loginViaUi(page, accounts.perfumerA);

    const row = page.locator("#rows tr", { hasText: formulaName });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await row.click();
    await page.waitForURL("**/formula-detail.html?id=*");

    await expect(page.locator("#card .badge")).toHaveText("draft");
    await page.click("#submitBtn");
    await expect(page.locator("#card .badge"), "สถานะต้องกลายเป็น submitted หลังกดส่งตรวจ").toHaveText(
      "submitted",
      { timeout: 20_000 }
    );

    // ปุ่มส่งตรวจต้องหายไปแล้ว (ส่งซ้ำไม่ได้)
    await expect(page.locator("#submitBtn")).toHaveCount(0);
  });

  test("T3: กรอกฟอร์มไม่ครบแล้วต้องไม่บันทึกลงฐานข้อมูล", async ({ page, request }) => {
    const a = await signIn(request, accounts.perfumerA);
    const countBefore = await countFormulasOf(request, a.uid, a.idToken);

    await loginViaUi(page, accounts.perfumerA);
    await page.goto("/formula-new.html");
    await page.waitForFunction(() => {
      const el = document.querySelector("#fragranceType");
      return el && el.options.length > 0 && el.options[0].value !== "";
    }, null, { timeout: 20_000 });

    // กรอกแค่ชื่อ เว้น brief และวัตถุดิบไว้
    await page.fill("#name", "สูตรที่กรอกไม่ครบ ไม่ควรถูกบันทึก");
    await page.click('#formulaForm button[type="submit"]');

    // ต้องยังอยู่หน้าเดิม (ถ้าบันทึกสำเร็จจะเด้งไป index.html)
    await page.waitForTimeout(2000);
    expect(page.url(), "กรอกไม่ครบแล้วต้องไม่ถูกพาไปหน้ารายการ").toContain("formula-new.html");

    // ช่อง brief ต้องถูกเบราว์เซอร์ตีกลับว่ายังไม่ผ่านการตรวจ
    const briefValid = await page.evaluate(() => document.querySelector("#brief").checkValidity());
    expect(briefValid, "ช่อง brief ที่ว่างต้องไม่ผ่าน validation").toBe(false);

    // ยืนยันจากฝั่งฐานข้อมูลว่าไม่มีเอกสารใหม่เกิดขึ้น
    const countAfter = await countFormulasOf(request, a.uid, a.idToken);
    expect(countAfter, "ไม่ควรมีสูตรใหม่ถูกสร้างขึ้นจากฟอร์มที่กรอกไม่ครบ").toBe(countBefore);
  });
});
