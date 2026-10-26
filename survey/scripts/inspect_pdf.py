"""Render all pages and report mechanical PDF checks; visual review is separate."""
import argparse
import json
from pathlib import Path
import re
import pymupdf as fitz
from PIL import Image, ImageDraw

p = argparse.ArgumentParser()
p.add_argument("pdf", type=Path)
p.add_argument("output", type=Path)
args = p.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
doc = fitz.open(args.pdf)
report = {"file": args.pdf.name, "pages": len(doc), "page_checks": [], "mechanical_issues": [], "visual_review": "Required; inspect the rendered pages and contact sheets."}
texts, thumbs = [], []
for i, page in enumerate(doc):
    text = page.get_text()
    texts.append(text)
    spans = [s for b in page.get_text("dict")["blocks"] if "lines" in b for line in b["lines"] for s in line["spans"]]
    outside = [s["text"] for s in spans if s["bbox"][0] < -0.5 or s["bbox"][1] < -0.5 or s["bbox"][2] > page.rect.width + 0.5 or s["bbox"][3] > page.rect.height + 0.5]
    checks = {"page": i + 1, "characters": len(text.strip()), "minimum_font_pt": round(min((s["size"] for s in spans), default=0), 2), "outside_page": outside}
    report["page_checks"].append(checks)
    if outside or "\ufffd" in text or not text.strip():
        report["mechanical_issues"].append(checks)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3), alpha=False)
    filename = args.output / f"page-{i+1:02d}.png"
    pix.save(filename)
    image = Image.open(filename).convert("RGB")
    image.thumbnail((260, 370))
    tile = Image.new("RGB", (280, 402), "#e8ebef")
    tile.paste(image, ((280-image.width)//2, 20))
    ImageDraw.Draw(tile).text((10, 383), f"Page {i+1}", fill="black")
    thumbs.append(tile)
for start in range(0, len(thumbs), 12):
    sheet = Image.new("RGB", (1120, 402 * ((len(thumbs[start:start+12])+3)//4)), "white")
    for j, thumb in enumerate(thumbs[start:start+12]):
        sheet.paste(thumb, ((j%4)*280, (j//4)*402))
    sheet.save(args.output / f"contact-{start//12+1:02d}.png")
joined = "\n\f\n".join(texts)
report["unresolved_citation_markers"] = len(re.findall(r"\[\?\]|\[\?,", joined))
report["embedded_fonts"] = sorted({font[3] for page in doc for font in page.get_fonts()})
(args.output / "text.txt").write_text(joined, encoding="utf-8")
(args.output / "inspection.json").write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
print(json.dumps({k:v for k,v in report.items() if k not in ["page_checks","embedded_fonts"]}, ensure_ascii=False))
