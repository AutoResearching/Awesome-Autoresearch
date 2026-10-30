# Contributing

Thank you for helping build **Awesome Autoresearch: Learning to Do Research**.

We organize research around scientific capabilities and evidence: research taste, question formulation, scientific reasoning and execution, learning from research experience, and evaluation. AI research is the primary testbed; mathematics and other fields are welcome when the methodological contribution transfers.

## What belongs here

- Methods or empirical studies about selecting valuable questions, generating hypotheses, designing investigations, interpreting evidence, or improving research decisions.
- Research agents and integrated systems with enough primary documentation to understand their actual scope.
- Benchmarks that isolate relevant abilities, including important negative findings and limitations of evaluation.
- Selected foundations for memory, feedback, learning, and agent improvement, explicitly marked as foundations when their experiments are not scientific research.
- Selected author essays and talks about research judgment and scientific practice, collected separately under `perspectives` as contextual reading rather than evidence of another scientific capability.

A work does not need to solve the whole research process or be fully autonomous. We do not rank entries by stars, citation count, or claimed autonomy.

General writing tools, search interfaces, agent frameworks, or domain predictors need a specific contribution to the questions above to qualify. A domain discovery can qualify through a reusable method or evaluation; using AI alone is insufficient.

## Suggest a resource

Use the [resource suggestion form](https://github.com/AutoResearching/Awesome-Autoresearch/issues/new?template=suggest-resource.yml) for a paper, benchmark, project, essay, or talk. Check the existing collection first, then provide a primary source and explain its relevance. Suggestions can be in English or Chinese; a complete JSON record or translation is not required. For corrections, open an issue or pull request with the affected entry and supporting source.

The requirements below apply when preparing a catalog entry for a pull request.

## Evidence requirements

1. Read a primary source: the paper, publisher page, author project page, or official repository; for perspectives, read the author's essay or an attributable original talk/transcript. Other lists and search results are leads, not sufficient verification.
2. Confirm the exact title, first public release year, and any claimed publication venue. A later venue year may differ from the first-release year. Use the title of the linked version; record version changes in the evidence notes when they affect interpretation.
3. Link **Paper** and verified official **Code** where available. Use `null` when a link was not verified. A GitHub project page, prompts-only release, third-party implementation, or similarly named repository must not be mislabeled as the authors' implementation. Essays use their primary reading URL in `project`, displayed as **Read**; they do not require a paper or code release.
4. Write one concise contribution description and a concrete evidence boundary in **both English and Chinese**. Describe the problem actually studied, the feedback used, and the human inputs where relevant.
5. Record the primary `evidence_urls` used and the actual `verified_on` date. Do not update all dates when only one entry was checked.

Keep these distinctions explicit:

- Perceived novelty, citation impact, and review scores are proxies; none alone establishes scientific importance.
- Given-task solving, reproduction, hypothesis generation, and open-ended agenda selection are different capabilities.
- Report generation is not evidence that the reported experiments ran. Label model-generated, unexecuted results clearly.
- Within-run search, cross-run memory, reusable skills, agent-code evolution, and model-parameter training are different improvement mechanisms.
- Automatically checked answers, numerical validation, human-checked proofs, and formal proof checking are different verification procedures.
- An author-reported result is not an independent replication. Record significant protocol, access, or maintenance limitations.
- An essay's recommendations or an author's experience are perspectives, not empirical validation of a research agent or universal rules for good science.

Source verification means checking bibliographic details, links, and claims against the cited material. It does not mean that contributors have executed the code or independently reproduced the results. State any reproduction separately, including its configuration and observed outcome.

## Update the catalog

The canonical records are JSON arrays in `data/*.json`. The build reads every JSON file in that directory, including focused additions and `perspectives.json`; filenames do not determine categories. Update an appropriate existing file or add a clearly named batch using the same schema.

The six research categories are `taste`, `questions`, `execution`, `learning`, `evaluation`, and `systems`. The seventh category, `perspectives`, is a separate collection of essays and talks, not an additional scientific capability.

Each work appears once, in the category that best explains its main contribution. Use reading-path cross-links for overlap. Keep versions as separate records only when they represent meaningfully different methods or implementations; explain related publications rather than inflating the count with mirrors or minor revisions.

Required fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable lowercase kebab-case identifier used for links |
| `title`, `short_name` | Exact source title and readable display name |
| `year` | First public release year of the cited work |
| `category` | One of the seven category identifiers above |
| `kind` | `method`, `benchmark`, `study`, `system`, `foundation`, or `perspective` |
| `status` | `published`, `preprint`, `project`, or `essay`; describes the cited source version |
| `venue` | Verified venue and publication year, `arXiv`, or the project/essay source |
| `paper`, `code`, `project` | HTTPS primary links, or `null` |
| `focus_en`, `focus_zh` | Why the work is relevant; one concise sentence per language |
| `boundary_en`, `boundary_zh` | What its evidence actually covers or does not establish |
| `evidence_urls` | Nonempty array of the primary sources consulted |
| `verified_on` | Source-review date in `YYYY-MM-DD` form |

For an essay or talk, use `category: "perspectives"`, `kind: "perspective"`, and `status: "essay"`, with its reading URL in `project` and `paper: null`. Describe the relevant argument and its limits, without turning advice into an experimental result.

## Metadata and presentation conventions

- `year` is the first public year of the cited work, not necessarily its conference or journal year. Confirm that earlier release from a primary source; keep the verified publication year in `venue`.
- `published` records a verified publication venue, while `preprint`, `project`, and `essay` identify other source types; none of these labels is a quality score or an independent replication claim.
- **Paper** links to the cited paper version, **Code** to a verified official implementation, and **Project** or **Resources** to supporting material; **Read** opens the primary text of a perspective. Missing code means no official implementation was verified for this record, not proof that none exists.
- `focus_*` explains the contribution; `boundary_*` describes its demonstrated scope, required human inputs, evaluation limits, or relevant access and maintenance restrictions. Keep both languages aligned.
- `verified_on` records a specific source review, not an experiment date or a promise that every external URL remains accessible.

The READMEs use compact three-column tables for the work, its relevance, and links. Each section has expandable **Evidence and scope notes** containing full titles, type/status information, and evidence boundaries. Preserve those details when changing the layout, and review both the compact and expanded views.

The prose templates live in `docs/templates/README.en.md` and `docs/templates/README.zh.md`. Edit those templates for scope, research questions, and editorial guidance. The editable illustration source is `scripts/build-figures.mjs`; it generates four bilingual research illustrations and the social-preview SVG in `docs/assets/`. Keep diagram labels and relationships aligned across languages, distinguish learning within a run from reuse across runs, and mark explanatory examples as illustrations rather than results. Metadata conventions belong in this guide rather than a separate “How to read the collection” section in the READMEs.

**Do not edit the generated root READMEs directly.** Reading-path selections, section labels, and generated table/detail formatting live in `scripts/build.mjs`.

## Generate and check

Run from the repository root with Node.js 18 or newer; no package installation is needed:

```sh
node scripts/build-figures.mjs
node scripts/build.mjs
node scripts/build-figures.mjs --check
node scripts/build.mjs --check
git diff --check
```

The build validates required fields, bilingual text, date formats, category coverage, unique IDs/titles/paper URLs, and local links/anchors in the generated READMEs. Check mode also ensures both generated READMEs match the catalog and templates. It does not verify scientific claims or perform network link checks.

The [Validate collection workflow](.github/workflows/validate.yml) runs this check with Node.js 24 on pull requests and pushes to `main`. Include the regenerated READMEs in catalog or template changes. Survey changes have separate build instructions in [survey/README.md](survey/README.md); ordinary catalog contributions do not require a PDF rebuild.

Review both rendered READMEs before submitting a change. For corrections, give the primary source and explain what changed. For new entries, explain which research question the work advances and how it was evaluated. Issues or pull requests are welcome in English or Chinese.

## License

This repository uses the [MIT License](LICENSE). Linked papers, datasets, and external projects retain their own licenses.

## 中文贡献说明

欢迎通过 [资源推荐表单](https://github.com/AutoResearching/Awesome-Autoresearch/issues/new?template=suggest-resource.yml) 用中文或英文提交建议，附原始来源和相关性说明即可。提交 catalog PR 时，请先阅读原始论文或官方资料，再填写中英文贡献与证据边界；不要仅依据其他 Awesome list、宣传页摘要或模型生成的描述。

生成器会读取全部 `data/*.json`；请修改对应记录，或编辑 `docs/templates/` 中的文字。双语 SVG 图示的可编辑源文件是 `scripts/build-figures.mjs`，生成结果位于 `docs/assets/`。运行上述命令更新图示与 README，不要直接修改生成文件。正文采用三列表格，完整标题、类型、状态和证据边界保留在各节可展开的说明中。

保持首次公开年份、正式发表年份和所引版本之间的区别，逐项记录实际核查日期；无法核实的官方代码链接填 `null`。`perspectives` 单独收录作者文章与演讲，使用 `kind: "perspective"`、`status: "essay"`，将 **Read** 链接存入 `project`，无需补造 `paper`。

来源核查不等于实验复现，作者观点也不等于实证结论。请区分科研品味与代理评分、问题生成与给定任务求解、真实执行与生成结果、单次搜索与跨任务学习，以及答案检查与形式化证明；发现评价偏差或维护状态变化时，请附原始证据提出修正。构建检查不会联网核验链接或科学结论。

PR 会自动检查 catalog 与生成 README 是否一致，以及 README 中的本地链接和 anchors。普通文献更新无需重新编译 survey PDF。
