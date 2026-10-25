# Contributing

Thank you for helping build **Awesome Autoresearch: Learning to Do Research**.

We organize research around scientific capabilities and evidence: research taste, question formulation, scientific reasoning and execution, learning from research experience, and evaluation. AI research is the primary testbed; mathematics and other fields are welcome when the methodological contribution transfers.

## What belongs here

- Methods or empirical studies about selecting valuable questions, generating hypotheses, designing investigations, interpreting evidence, or improving research decisions.
- Research agents and integrated systems with enough primary documentation to understand their actual scope.
- Benchmarks that isolate relevant abilities, including important negative findings and limitations of evaluation.
- Selected foundations for memory, feedback, learning, and agent improvement, explicitly marked as foundations when their experiments are not scientific research.

A work does not need to solve the whole research process or be fully autonomous. We do not rank entries by stars, citation count, or claimed autonomy.

General writing tools, search interfaces, agent frameworks, or domain predictors need a specific contribution to the questions above to qualify. A domain discovery can qualify through a reusable method or evaluation; using AI alone is insufficient.

## Evidence requirements

1. Read a primary source: the paper, publisher page, author project page, or official repository. Other lists and search results are leads, not sufficient verification.
2. Confirm the exact title, first public release year, and any claimed publication venue. A later venue year may differ from the first-release year. Use the title of the linked version; record version changes in the evidence notes when they affect interpretation.
3. Link **Paper** and verified official **Code** where available. Use `null` when a link was not verified. A GitHub project page, prompts-only release, third-party implementation, or similarly named repository must not be mislabeled as the authors' implementation.
4. Write one concise contribution description and a concrete evidence boundary in **both English and Chinese**. Describe the problem actually studied, the feedback used, and the human inputs where relevant.
5. Record the primary `evidence_urls` used and the actual `verified_on` date. Do not update all dates when only one entry was checked.

Keep these distinctions explicit:

- Perceived novelty, citation impact, and review scores are proxies; none alone establishes scientific importance.
- Given-task solving, reproduction, hypothesis generation, and open-ended agenda selection are different capabilities.
- Report generation is not evidence that the reported experiments ran. Label model-generated, unexecuted results clearly.
- Within-run search, cross-run memory, reusable skills, agent-code evolution, and model-parameter training are different improvement mechanisms.
- Automatically checked answers, numerical validation, human-checked proofs, and formal proof checking are different verification procedures.
- An author-reported result is not an independent replication. Record significant protocol, access, or maintenance limitations.

## Update the catalog

The canonical records are JSON arrays in `data/`:

| File | Primary categories |
| --- | --- |
| `questions.json` | `taste`, `questions` |
| `systems.json` | `execution`, `systems` |
| `learning.json` | `learning` |
| `evaluation.json` | `evaluation` |

Each work appears once, in the category that best explains its main contribution. Use reading-path cross-links for overlap. Keep versions as separate records only when they represent meaningfully different methods or implementations; explain related publications rather than inflating the count with mirrors or minor revisions.

Required fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable lowercase kebab-case identifier used for links |
| `title`, `short_name` | Exact source title and readable display name |
| `year` | First public release year of the cited work |
| `category` | One of the six categories above |
| `kind` | `method`, `benchmark`, `study`, `system`, or `foundation` |
| `status` | `published`, `preprint`, or `project`; describes the cited source version |
| `venue` | Verified venue and publication year, or `arXiv` / project source |
| `paper`, `code`, `project` | HTTPS primary links, or `null` |
| `focus_en`, `focus_zh` | Why the work is relevant; one concise sentence per language |
| `boundary_en`, `boundary_zh` | What its evidence actually covers or does not establish |
| `evidence_urls` | Nonempty array of the primary sources consulted |
| `verified_on` | Source-review date in `YYYY-MM-DD` form |

The prose templates live in `docs/templates/README.en.md` and `docs/templates/README.zh.md`. Edit those templates for scope, research questions, and editorial guidance. **Do not edit the generated root READMEs directly.** Reading-path selections and section labels live in `scripts/build.mjs`.

Run from the repository root with Node.js 18 or newer; no package installation is needed:

```sh
node scripts/build.mjs
node scripts/build.mjs --check
git diff --check
```

The build validates required fields, bilingual text, date formats, category coverage, unique IDs/titles/paper URLs, and local links/anchors. Check mode also ensures both generated READMEs match the catalog and templates. It does not verify scientific claims or perform network link checks.

Review both rendered READMEs before submitting a change. For corrections, give the primary source and explain what changed. For new entries, explain which research question the work advances and how it was evaluated. Issues or pull requests are welcome in English or Chinese.

## 中文贡献说明

欢迎用中文或英文提交建议。请先阅读原始论文或官方资料，再填写中英文贡献与证据边界；不要仅依据其他 Awesome list、宣传页摘要或模型生成的描述。

修改 `data/` 中的记录，或 `docs/templates/` 中的介绍文字，然后运行上述生成与检查命令。保持首次公开年份、正式发表年份和所引版本之间的区别。对每项工作单独记录实际核查日期；无法核实的代码链接填 `null`。

尤其注意区分科研品味与代理评分、问题生成与给定任务求解、真实执行与生成结果、单次搜索与跨任务学习，以及答案检查与形式化证明。发现数据泄漏、评价偏差或维护状态变化时，请附原始证据提出修正。
