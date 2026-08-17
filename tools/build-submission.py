"""
build-submission.py — สร้างชุดไฟล์ส่งงาน RAISE W3 จากเอกสารต้นฉบับใน docs/

วิธีใช้ (จากโฟลเดอร์ Raise/):
    python tools/build-submission.py

ผลลัพธ์จะไปอยู่ที่ ../Submission-RAISE-W3/ (นอก repo โดยตั้งใจ ไม่ต้อง commit)
    01-Prototype.html      สำเนา prototype (single-file HTML กดใช้งานได้จริง)
    02-Test-Spec.html      Test Plan + Acceptance Criteria + Test Cases รวมเล่มเดียว
    03-Prototype-Doc.html  เอกสารประกอบ prototype + สูตรตัวอย่าง

ทุกครั้งที่ build จะประทับ commit hash + วันที่ไว้บนหน้าปก
เพื่อให้รู้ชัดว่าไฟล์ที่ส่งไปมาจากโค้ดเวอร์ชันไหน

ต้องมี: pip install markdown
"""
import re
import sys
import shutil
import pathlib
import subprocess
import datetime

# Windows console เริ่มต้นเป็น cp1252 พิมพ์ภาษาไทยไม่ได้ — บังคับเป็น UTF-8
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    import markdown
except ImportError:
    raise SystemExit("ไม่พบไลบรารี markdown — ติดตั้งด้วย:  pip install markdown")

ROOT = pathlib.Path(__file__).resolve().parent.parent      # .../Raise
OUT = ROOT.parent / "Submission-RAISE-W3"
PROTO = ROOT / "docs/02-design/01-prototypes/20260818-01-v1"
TEST = ROOT / "docs/03-testing/01-test-plan"

TH_MONTHS = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
             "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]


def stamp():
    """คืนข้อมูลเวอร์ชัน: commit hash ปัจจุบัน + วันที่ build"""
    try:
        h = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT,
                           capture_output=True, text=True, check=True).stdout.strip()
        dirty = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT,
                               capture_output=True, text=True).stdout.strip()
        commit = h + (" (มีการแก้ไขที่ยังไม่ commit)" if dirty else "")
    except Exception:
        commit = "ไม่พบข้อมูล git"
    d = datetime.date.today()
    return commit, f"{d.day} {TH_MONTHS[d.month]} {d.year + 543}"


CSS = """
:root{--bg:#F3EFE7;--ink:#20281F;--accent:#C0813A;--support:#7E8F6E;--heart:#B15E6C;--warn:#BD5A2E;
--surface:#FAF8F3;--divider:rgba(32,40,31,.12);--muted:rgba(32,40,31,.62);
--fd:Georgia,'Times New Roman',serif;--fb:'Inter',-apple-system,'Segoe UI','Noto Sans Thai',sans-serif;
--fm:'IBM Plex Mono','SF Mono',Consolas,monospace}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--fb);font-size:15px;line-height:1.7}
.page{max-width:940px;margin:0 auto;padding:56px 40px 96px}
.cover{background:var(--ink);color:var(--bg);border-radius:20px;padding:44px 40px;margin-bottom:44px}
.cover .eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:600}
.cover h1{font-family:var(--fd);font-size:38px;line-height:1.15;margin:12px 0 6px;letter-spacing:-.015em}
.cover .sub{opacity:.8;font-size:15px}
.cover .meta{margin-top:24px;padding-top:18px;border-top:1px solid rgba(243,239,231,.2);
font-family:var(--fm);font-size:12.5px;opacity:.75;line-height:2}
.toc{background:var(--surface);border-radius:12px;padding:24px 28px;margin-bottom:44px;
box-shadow:0 1px 2px rgba(32,40,31,.04),0 8px 24px rgba(32,40,31,.05)}
.toc h2{font-family:var(--fd);font-size:19px;margin:0 0 12px}
.toc ol{margin:0;padding-left:22px}
.toc li{margin-bottom:6px}
.toc a{color:var(--accent);text-decoration:none}
.toc a:hover{text-decoration:underline}
section.doc{background:var(--surface);border-radius:12px;padding:36px 40px;margin-bottom:36px;
box-shadow:0 1px 2px rgba(32,40,31,.04),0 8px 24px rgba(32,40,31,.05)}
h1,h2,h3,h4{font-family:var(--fd);line-height:1.3;letter-spacing:-.01em}
section.doc>h1:first-child{font-size:30px;margin:0 0 8px;padding-bottom:14px;border-bottom:2px solid var(--accent)}
h2{font-size:22px;margin:34px 0 12px;padding-top:8px}
h3{font-size:18px;margin:26px 0 10px;color:var(--accent)}
h4{font-size:16px;margin:20px 0 8px}
p{margin:10px 0}
ul,ol{margin:10px 0;padding-left:24px}
li{margin-bottom:5px}
hr{border:none;border-top:1px solid var(--divider);margin:30px 0}
a{color:var(--accent)}
code{font-family:var(--fm);font-size:.88em;background:var(--bg);padding:2px 6px;border-radius:4px}
pre{background:var(--ink);color:var(--bg);padding:18px 20px;border-radius:10px;overflow-x:auto;font-size:13px}
pre code{background:none;color:inherit;padding:0}
blockquote{margin:16px 0;padding:12px 18px;border-left:3px solid var(--accent);
background:rgba(192,129,58,.08);border-radius:0 8px 8px 0}
blockquote p{margin:4px 0}
.tw{overflow-x:auto;margin:16px 0}
table{border-collapse:collapse;width:100%;font-size:13.5px}
th,td{padding:9px 12px;text-align:left;border-bottom:1px solid var(--divider);vertical-align:top}
th{background:var(--ink);color:var(--bg);font-weight:600;font-size:12px;
letter-spacing:.03em;text-transform:uppercase;border-bottom:none}
tbody tr:nth-child(even){background:rgba(32,40,31,.025)}
td code{white-space:nowrap}
strong{font-weight:600}
@media print{
 body{background:#fff}
 .page{max-width:100%;padding:0}
 .cover{background:#fff;color:var(--ink);border:2px solid var(--ink);border-radius:0;page-break-after:always}
 .cover .eyebrow,.cover h1{color:var(--ink)}
 .cover .meta{border-top-color:var(--divider)}
 .toc{page-break-after:always;box-shadow:none;border:1px solid var(--divider)}
 section.doc{box-shadow:none;border:none;padding:0;page-break-before:always;background:#fff}
 pre{background:#f2f2f2;color:#000;border:1px solid #ccc}
 th{background:#e8e4dc;color:#000}
 h2,h3{page-break-after:avoid}
 table,blockquote{page-break-inside:avoid}
}
"""


def conv(path):
    md = pathlib.Path(path).read_text(encoding="utf-8")
    html = markdown.markdown(md, extensions=["tables", "fenced_code", "sane_lists", "attr_list"])
    html = html.replace("<table>", '<div class="tw"><table>').replace("</table>", "</table></div>")
    # wikilink ของ Obsidian ใช้ไม่ได้นอก vault -> เหลือแค่ชื่อ
    html = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"<em>\2</em>", html)
    html = re.sub(r"\[\[([^\]]+)\]\]", lambda m: "<em>%s</em>" % m.group(1).split("/")[-1], html)
    return html


def build(outfile, title, subtitle, meta_lines, parts):
    commit, today = stamp()
    meta = "<br>".join(meta_lines + [
        "&nbsp;",
        f"สร้างจาก commit &nbsp;: &nbsp;{commit}",
        f"วันที่สร้างไฟล์ &nbsp;&nbsp;: &nbsp;{today}",
    ])
    toc = "\n".join(f'<li><a href="#{a}">{l}</a></li>' for a, l, _ in parts)
    body = "".join(
        f'<section class="doc" id="{a}">\n{conv(p)}\n</section>\n' for a, _, p in parts
    )
    doc = f"""<!DOCTYPE html>
<html lang="th"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><style>{CSS}</style></head>
<body><div class="page">
<div class="cover">
  <div class="eyebrow">RAISE · Week 3 — งานส่ง</div>
  <h1>{title}</h1>
  <div class="sub">{subtitle}</div>
  <div class="meta">{meta}</div>
</div>
<div class="toc"><h2>สารบัญ</h2><ol>{toc}</ol></div>
{body}
</div></body></html>"""
    (OUT / outfile).write_text(doc, encoding="utf-8")
    print(f"  [OK] {outfile:<24} {len(doc)/1024:>6.0f} KB")


def main():
    OUT.mkdir(exist_ok=True)
    commit, today = stamp()
    print(f"\nBuild ชุดส่งงาน RAISE W3")
    print(f"  commit : {commit}")
    print(f"  วันที่  : {today}")
    print(f"  ปลายทาง: {OUT}\n")

    shutil.copy2(PROTO / "index.html", OUT / "01-Prototype.html")
    size = (OUT / "01-Prototype.html").stat().st_size / 1024
    print(f"  [OK] {'01-Prototype.html':<24} {size:>6.0f} KB  (คัดลอกตรงจากต้นฉบับ)")

    build(
        "02-Test-Spec.html",
        "Test Specification",
        "AI Perfumery Formulation Assistant — ระบบผู้ช่วยปรุงน้ำหอมด้วย AI",
        ["โครงการ &nbsp;: &nbsp;AI Perfumery Formulation Assistant",
         "ฟีเจอร์ &nbsp;&nbsp;: &nbsp;F-07 Dashboard สรุปผลสูตร (Aroma Profile)",
         "Journey &nbsp;: &nbsp;UJ-01 ป้อนสูตรและอ่านผลวิเคราะห์ · UJ-02 IFRA FAIL → แก้จนผ่าน"],
        [("test-plan", "Test Plan — แผนการทดสอบภาพรวม", TEST / "test-plan.md"),
         ("ac", "Acceptance Criteria — เกณฑ์ยอมรับ (Given-When-Then)", TEST / "acceptance-criteria.md"),
         ("tc", "Test Cases — F-07 Dashboard สรุปผลสูตร", TEST / "test-cases/dashboard-aroma-profile.md")],
    )
    build(
        "03-Prototype-Doc.html",
        "Prototype Documentation",
        "เอกสารประกอบ Interactive Prototype v1",
        ["ไฟล์ Prototype &nbsp;: &nbsp;01-Prototype.html (เปิดด้วยเบราว์เซอร์ได้เลย)",
         "เวอร์ชัน &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;20260818-01-v1"],
        [("proto", "Prototype — ขอบเขต โครงสร้างหน้าจอ และสิ่งที่กดได้", PROTO / "prototype.md"),
         ("formula", "สูตรตัวอย่าง EDP-001 — ข้อมูลที่ใช้ใน Prototype", PROTO / "sample-formula.md")],
    )
    print("\nเสร็จเรียบร้อย — เปิดโฟลเดอร์ปลายทางเพื่อส่งงานได้เลย\n")


if __name__ == "__main__":
    main()
