// ai-key.js — หาคีย์ OpenRouter ตอน "กดปุ่ม AI" โดยไม่ฝังคีย์ลงในไฟล์ที่ deploy ขึ้นเว็บสาธารณะ
//
// ที่มาของไฟล์นี้ (Module 2 การบ้านที่ 4 / สัปดาห์ที่ 9):
// เดิมปุ่ม AI import คีย์จาก ./config.local.js ตรง ๆ และ firebase.json ยอมให้ไฟล์นั้น deploy
// ขึ้น hosting ด้วย ผลคือใครก็ได้เปิด https://<โดเมน>/config.local.js แล้วก๊อปคีย์ไปใช้ได้
// (คีย์ไม่เคยขึ้น GitHub ก็จริง แต่ "หลุดทางเว็บ" อยู่ดี) — ตอนนี้ config.local.js ถูกกันออกจาก
// deploy แล้ว (ดู ../firebase.json) ไฟล์นี้จึงทำหน้าที่หาคีย์ให้แทน
//
// ลำดับการหาคีย์:
//   1) sessionStorage — คีย์ที่ผู้ใช้วางเองในแท็บนี้ (หายเมื่อปิดแท็บ ไม่ติดไปกับเครื่องคนอื่น)
//   2) ./config.local.js — มีเฉพาะตอนรันในเครื่องตัวเอง (.gitignore กันไม่ให้ขึ้น GitHub,
//      firebase.json กันไม่ให้ขึ้นเว็บ) บนเว็บจริงไฟล์นี้ไม่มี import จึงพังแล้วตกไปข้อ 3
//   3) ถามผู้ใช้ให้วางคีย์ของตัวเองลงไป
//
// ⚠️ นี่ยังไม่ใช่ทางแก้ที่ถูกต้องที่สุด — คีย์ยังไปโผล่ในเบราว์เซอร์ของผู้ใช้อยู่ดี
// ทางแก้จริงคือย้ายการเรียก AI ไปไว้ฝั่งเซิร์ฟเวอร์ที่ผู้ใช้แตะไม่ได้ (ดู BACKLOG.md ที่ root)

const SESSION_KEY = "openrouter_api_key";

const PROMPT_TEXT =
  "ใส่คีย์ OpenRouter เพื่อใช้ปุ่ม AI\n\n" +
  "• คีย์จะถูกเก็บไว้แค่ในแท็บนี้ (sessionStorage) และหายไปเมื่อปิดแท็บ\n" +
  "• ระบบไม่เคยบันทึกคีย์ลงฐานข้อมูล และไม่มีคีย์ฝังอยู่ในเว็บนี้\n" +
  "• กด Cancel ได้ถ้าไม่ต้องการใช้ปุ่ม AI — ฟังก์ชันอื่นทั้งหมดยังใช้ได้ตามปกติ";

/** คืนค่าคีย์ OpenRouter หรือ null ถ้าผู้ใช้ไม่ให้คีย์ */
export async function getOpenRouterKey() {
  const fromSession = sessionStorage.getItem(SESSION_KEY);
  if (fromSession) return fromSession;

  // มีเฉพาะตอนรันในเครื่อง — บนเว็บจริงไฟล์นี้ไม่ถูก deploy จึง import ไม่สำเร็จโดยตั้งใจ
  try {
    const mod = await import("./config.local.js");
    const localKey = (mod.OPENROUTER_API_KEY || "").trim();
    if (localKey && localKey.startsWith("sk-")) return localKey;
  } catch {
    // ไม่มีไฟล์คีย์ในเครื่อง = พฤติกรรมปกติของเว็บที่ deploy แล้ว ไม่ใช่ข้อผิดพลาด
  }

  const pasted = (window.prompt(PROMPT_TEXT) || "").trim();
  if (!pasted) return null;

  sessionStorage.setItem(SESSION_KEY, pasted);
  return pasted;
}

/** ลืมคีย์ที่เก็บไว้ในแท็บนี้ (เรียกเมื่อ OpenRouter ตอบว่าคีย์ใช้ไม่ได้ จะได้ขอใหม่รอบหน้า) */
export function forgetOpenRouterKey() {
  sessionStorage.removeItem(SESSION_KEY);
}
