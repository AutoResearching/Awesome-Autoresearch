"""Create and verify a portable LaTeX source archive, excluding build artifacts."""
import hashlib
import json
from pathlib import Path
import zipfile

survey = Path(__file__).resolve().parents[1]
root = survey.parent
output = root / "output"
output.mkdir(exist_ok=True)
archive = output / "autoresearch-survey-latex.zip"
files = [survey / name for name in ["README.md", "LICENSE", "main.en.tex", "main.zh.tex", "preamble.tex", "references.bib"]]
files += sorted((survey / "sections").glob("*.tex"))
files += sorted((survey / "scripts").glob("*.py"))
files += sorted((survey / "scripts").glob("*.mjs"))
files += [survey / "generated" / name for name in ["catalog-snapshot.json", "bibliographic-metadata.json", "citation-coverage.json"]]
manifest = {}
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for source in files:
        name = "survey/" + source.relative_to(survey).as_posix()
        data = source.read_bytes()
        z.writestr(name, data)
        manifest[name] = hashlib.sha256(data).hexdigest()
with zipfile.ZipFile(archive) as z:
    if z.testzip() is not None:
        raise RuntimeError("Archive CRC check failed")
    for name, digest in manifest.items():
        if hashlib.sha256(z.read(name)).hexdigest() != digest:
            raise RuntimeError(f"Archive content mismatch: {name}")
report = {"archive": archive.name, "files": len(manifest), "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "source_sha256": manifest, "crc_and_content_checks": "passed"}
(output / "survey-source-archive-report.json").write_text(json.dumps(report, indent=2)+"\n", encoding="utf-8")
print(json.dumps({k:v for k,v in report.items() if k != "source_sha256"}))
