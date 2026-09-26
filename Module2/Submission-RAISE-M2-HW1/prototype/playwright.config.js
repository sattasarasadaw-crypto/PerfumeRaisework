import { defineConfig, devices } from "@playwright/test";

// ชุดทดสอบยิงไปที่ "เว็บจริงที่ deploy แล้ว" ไม่ใช่ไฟล์ในเครื่อง
// เพราะเกณฑ์ผ่าน Module 2 ข้อ ① และ ② วัดที่ระบบออนไลน์จริง
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 15_000 },

  // รันทีละไฟล์/ทีละเทสต์ เพราะทุกเทสต์ใช้บัญชีจริงชุดเดียวกันบน Firebase project เดียวกัน
  fullyParallel: false,
  workers: 1,
  retries: 0,

  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/report.json" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "https://sattasarasada-perfume.web.app",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
