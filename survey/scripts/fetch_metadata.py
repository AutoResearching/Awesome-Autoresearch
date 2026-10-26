"""Fetch bibliographic metadata from primary pages; never infer author names."""
import concurrent.futures
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
import requests

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "survey" / "generated" / "bibliographic-metadata.json"
records = [r for p in sorted((ROOT / "data").glob("*.json")) for r in json.loads(p.read_text(encoding="utf-8-sig"))]

class MetadataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.values = {}
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta":
            name = a.get("name", a.get("property", "")).lower()
            if name.startswith("citation_"):
                self.values.setdefault(name, []).append(a.get("content", ""))

manual = {
    "colah-taste-exercises": ["Olah, Chris"],
    "karpathy-phd-guide": ["Karpathy, Andrej"],
    "hamming-you-and-your-research": ["Hamming, Richard W."],
    "research-debt": ["Olah, Chris", "Carter, Shan"],
    "nielsen-research-heuristics": ["Nielsen, Michael"],
    "vision-of-metascience": ["Nielsen, Michael", "Qiu, Kanjun"],
    "autoresearch": ["Karpathy, Andrej"],
}
prior = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}

def fetch(r):
    if r["id"] in prior and prior[r["id"]].get("authors"):
        return r["id"], prior[r["id"]]
    if r["id"] in manual:
        return r["id"], {"authors": manual[r["id"]], "source": r["paper"] or r["project"] or r["code"], "method": "primary-source manual attribution", "checked_on": "2026-10-26"}
    sess = requests.Session()
    sess.trust_env = False
    sess.headers["User-Agent"] = "Autoresearch-survey-bibliography/1.0"
    candidates = list(dict.fromkeys([r["paper"]] + [u for u in r["evidence_urls"] if "arxiv.org/abs/" in u]))
    errors = []
    for url in candidates:
        if not url:
            continue
        try:
            response = sess.get(url, timeout=25)
            response.raise_for_status()
            parser = MetadataParser()
            parser.feed(response.text)
            values = parser.values
            authors = values.get("citation_author", [])
            if authors:
                return r["id"], {"authors": authors, "source": url, "source_title": values.get("citation_title", [""])[0], "doi": values.get("citation_doi", [None])[0], "method": "citation meta tags", "checked_on": "2026-10-26"}
            errors.append(f"{url}: no citation authors")
        except Exception as exc:
            errors.append(f"{url}: {type(exc).__name__}")
        time.sleep(0.5)
    return r["id"], {"authors": [], "errors": errors, "checked_on": "2026-10-26"}

result = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for key, value in pool.map(fetch, records):
        result[key] = value
        print(key, len(value.get("authors", [])), flush=True)
OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("Missing authors:", [k for k, v in result.items() if not v.get("authors")])
