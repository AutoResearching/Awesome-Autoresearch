# Learning to Do Research: bilingual survey sources

This folder contains the English and Chinese versions of a question-centered survey of research taste, question generation, scientific execution, learning from research experience, and evaluation. Both versions cover the frozen **79-work catalog dated 26 October 2026**: 72 paper records, six essays/talks, and one software project. The proposed experiments are research designs to test, not newly obtained experimental results.

The source bundle builds independently of the parent Awesome repository. It uses the included `references.bib` and catalog snapshot; normal compilation does not require `../data/` or refresh bibliographic metadata.

## Build both versions

Use Node.js 18 or newer and either **Tectonic** or **latexmk with XeLaTeX**. The script prefers Tectonic when both are on `PATH`. The TeX installation must supply the packages and fonts used in `preamble.tex`, including `fontspec`, `ctex`, Fandol Chinese fonts, TeX Gyre fonts, TikZ, and natbib. Tectonic can download missing TeX dependencies on its first compilation; this is separate from bibliographic metadata retrieval.

From this folder:

```sh
node scripts/build.mjs --check-only
node scripts/build.mjs
```

To use a specific Tectonic executable, supply its absolute path:

```powershell
node scripts/build.mjs --tectonic "C:\path\to\tectonic.exe"
```

```sh
node scripts/build.mjs --tectonic /absolute/path/to/tectonic
```

All compiler processes run with this folder as their working directory and without a shell. Intermediate files and compiler logs go to `build/en/` and `build/zh/`. After both compilations succeed, the final artifacts are copied to the sibling output directory:

```text
../output/pdf/autoresearch-survey-en.pdf
../output/pdf/autoresearch-survey-zh.pdf
../output/pdf/survey-build-report.json
```

This output location also applies when the `survey/` folder is unpacked elsewhere as a standalone archive. The build creates missing output directories. The report records the compiler, citation counts, PDF sizes and SHA-256 hashes, and source hashes; page counts are included when `pdfinfo` is available. Compilation and source checks do not constitute visual review or experimental reproduction. Inspect both rendered PDFs, particularly tables, diagrams, Chinese glyphs, and page breaks.

## Offline checks and citation coverage

`--check-only` invokes no compiler and performs no network requests. It checks:

- Exactly 79 unique snapshot IDs, with matching bibliography keys and no unknown citations.
- Active citations in sections included by each main file, excluding comments and literal-code environments; `\nocite` and bare citation-only paragraphs cannot provide coverage.
- The same cited-work set in both languages, with matching section order and heading hierarchy.

Successful checks write `generated/citation-coverage.json`, mapping every catalog ID to its English and Chinese section files. This establishes structural citation coverage, not the semantic correctness of an attribution. Editors must still confirm that each citation supports a substantive discussion and that paraphrases reflect the primary source. Missing sources, coverage gaps, mismatched structure, compiler errors, and unresolved references cause a nonzero exit status.

## Overleaf or direct TeX compilation

Upload the contents of this folder and select **XeLaTeX** as the compiler. Set `main.en.tex` as the main document for the English PDF, then switch to `main.zh.tex` for the Chinese PDF. Each main file includes the shared preamble and the appropriate language-specific sections; both use `references.bib`. Overleaf does not run the Node.js coverage checker, so run `--check-only` locally before upload when possible.

For a local single-language compilation without the wrapper, use either of these commands from this folder, replacing `en` with `zh` for Chinese:

```sh
tectonic --keep-logs --keep-intermediates --outdir build/en main.en.tex
latexmk -xelatex -interaction=nonstopmode -halt-on-error -outdir=build/en main.en.tex
```

Create `build/en/` first for direct compilation if the engine requires it. The wrapper creates both directories, validates the sources, builds both versions, and copies the final PDFs automatically.

## Source layout and reference conventions

| Path | Purpose |
| --- | --- |
| `main.en.tex`, `main.zh.tex` | English and Chinese entry points |
| `preamble.tex` | Shared typography, packages, diagram support, and Chinese font setup |
| `sections/*.en.tex`, `sections/*.zh.tex` | Matched narrative sections, diagrams, tables, and proposed studies |
| `references.bib` | Included bibliography; citation keys are stable catalog IDs |
| `generated/catalog-snapshot.json` | Frozen 79-work corpus and source provenance |
| `generated/bibliographic-metadata.json` | Recorded author metadata and its primary sources |
| `generated/citation-coverage.json` | Coverage map produced by the source checker |
| `scripts/build.mjs` | Offline checks and bilingual PDF build |
| `scripts/inspect_pdf.py` | Optional all-page rendering and mechanical checks; requires PyMuPDF and Pillow |
| `scripts/fetch_metadata.py`, `scripts/build_references.mjs` | Maintainer tools for deliberately updating metadata from the parent catalog; not required for standalone builds |
| `build/` | Disposable compilation outputs and logs; exclude from source archives |

Reference titles follow the cited source version. The bibliography uses a verified publication year when available and records an earlier first public release year in a note; otherwise it uses the work's first public year. A preprint/report, software project, or essay is identified as such. Venue labels and source review dates do not imply independent reproduction. The metadata files document attribution sources; source checking does not verify that reported experiments were independently rerun.

Keep citation IDs stable, update English and Chinese sections together, and preserve the distinction between reported evidence, survey interpretation, and untested proposals. Metadata refresh is an explicit maintainer action and is never triggered by the build script.

For optional local visual inspection, install `pymupdf` and `pillow`, then run `python scripts/inspect_pdf.py ../output/pdf/autoresearch-survey-en.pdf build/preview-en` (replace `en` with `zh` for Chinese). The script renders every page, creates contact sheets, and checks for empty pages, text outside page bounds, and unresolved citation markers. Inspect the PNGs yourself; these checks do not establish visual quality automatically.

## 中文构建说明

本目录提供完整英文与中文 LaTeX 源码，两版覆盖同一份 **79 项工作**的文献快照。文中的 proposed experiments 是待验证方案，不是本项目已经得到的实验结果。

安装 Node.js 18+，以及 Tectonic 或包含 XeLaTeX 的 latexmk 后，在本目录运行 `node scripts/build.mjs`，即可同时生成两版 PDF；指定临时 Tectonic 时使用 `--tectonic "绝对路径"`。中间文件位于 `build/en/` 与 `build/zh/`，最终 PDF 和构建报告位于 `../output/pdf/`。独立解压源码文件夹也可以构建，不依赖父仓库的 `data/`。

`node scripts/build.mjs --check-only` 只做离线引用和双语结构检查，不调用编译器，也不联网刷新 metadata。它生成逐条 citation coverage，但引用是否恰当仍需人工阅读核对。使用 Overleaf 时选择 XeLaTeX，并分别将 `main.en.tex`、`main.zh.tex` 设为主文件。编译成功不代表完成 visual QA 或实验复现，请检查两版 PDF 的表格、图示、中文字体与分页。
