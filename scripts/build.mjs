import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(arg => arg !== '--check')) throw new Error('Usage: node scripts/build.mjs [--check]');
const categories = [
  { id: 'taste', en: 'Research Taste and Problem Selection', zh: '科研品味与问题选择 · Research Taste', question_en: 'Which questions deserve attention, and how can that judgment be learned or evaluated?', question_zh: '什么问题值得研究？这种判断如何学习和评价？' },
  { id: 'questions', en: 'Question Formulation and Hypothesis Generation', zh: '问题提出与假设生成 · Question Formulation', question_en: 'How can AI turn gaps, contradictions, and observations into valuable, testable questions?', question_zh: 'AI 如何把知识缺口、矛盾与观察转化为有价值、可检验的问题？' },
  { id: 'execution', en: 'Scientific Reasoning and Research Execution', zh: '科学推理与研究执行 · Research Execution', question_en: 'Which experiments, proofs, and revisions turn a question into reliable new knowledge?', question_zh: '哪些实验、证明与修订，能够把问题转化为可靠的新知识？' },
  { id: 'learning', en: 'Learning from Research Experience', zh: '从研究经验中学习 · Learning from Experience', question_en: 'How do outcomes and feedback improve future research decisions, including on new tasks?', question_zh: '如何利用研究结果和反馈，改善后续研究以及新任务上的决策？' },
  { id: 'evaluation', en: 'Benchmarks and Evaluation', zh: '基准与评价 · Benchmarks and Evaluation', question_en: 'How can we measure question value, valid discoveries, resource efficiency, and transfer separately?', question_zh: '如何分别评价问题价值、发现的可靠性、资源效率与迁移能力？' },
  { id: 'systems', en: 'Integrated AI Scientist Systems', zh: '完整科研系统 · AI Scientist Systems', question_en: 'How are research capabilities assembled, and which decisions remain human-supplied?', question_zh: '科研能力如何组合成系统？哪些决策仍由人类提供？' },
  { id: 'perspectives', en: 'Essays on Research Taste and Scientific Practice', zh: '科研品味与科学实践 · Essays and Perspectives', question_en: 'Researcher perspectives on choosing problems, developing judgment, and improving science. These essays offer ideas and heuristics, not empirical validation of AI capabilities.', question_zh: '研究者关于选题、判断力和改进科学实践的思考。这些文章提供观点与启发，并非 AI 能力的实证验证。' },
];
const required = ['id', 'title', 'short_name', 'year', 'category', 'kind', 'status', 'venue', 'paper', 'code', 'project', 'focus_en', 'focus_zh', 'boundary_en', 'boundary_zh', 'evidence_urls', 'verified_on'];
const kinds = ['method', 'benchmark', 'study', 'system', 'foundation', 'perspective'];
const statuses = ['preprint', 'published', 'project', 'essay'];
const dataFiles = fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.json')).sort();
const records = dataFiles.flatMap(file => {
  const values = JSON.parse(fs.readFileSync(path.join(root, 'data', file), 'utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(values)) throw new Error(`${file}: expected an array`);
  return values;
});
if (!records.length) throw new Error('Empty catalog');
const ids = new Set();
const papers = new Set();
const titles = new Set();
const fail = (r, message) => { throw new Error(`${r.id ?? 'unknown entry'}: ${message}`); };
function validateURL(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password && !/\s/.test(url);
  } catch { return false; }
}
function paperKey(url) {
  if (!url) return null;
  const arxiv = url.match(/arxiv\.org\/(?:abs|pdf|html)\/(\d{4}\.\d{4,5})/);
  return arxiv ? `arxiv:${arxiv[1]}` : url.replace(/[#?].*$/, '').replace(/\/$/, '').toLowerCase();
}
for (const r of records) {
  for (const field of required) if (!(field in r)) fail(r, `missing ${field}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.id) || ids.has(r.id)) fail(r, 'invalid or duplicate id');
  ids.add(r.id);
  for (const field of ['title', 'short_name', 'venue', 'focus_en', 'focus_zh', 'boundary_en', 'boundary_zh']) {
    if (typeof r[field] !== 'string' || !r[field].trim() || /[\r\n]/.test(r[field])) fail(r, `invalid ${field}`);
  }
  const title = r.title.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  if (titles.has(title)) fail(r, 'duplicate title');
  titles.add(title);
  if (!categories.some(c => c.id === r.category)) fail(r, 'unknown category');
  if (!kinds.includes(r.kind) || !statuses.includes(r.status)) fail(r, 'unknown kind or status');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.verified_on) || Number.isNaN(Date.parse(r.verified_on)) || new Date(r.verified_on).toISOString().slice(0, 10) !== r.verified_on) fail(r, 'invalid verified_on date');
  if (!Number.isInteger(r.year) || r.year < 1900 || r.year > Number(r.verified_on.slice(0, 4))) fail(r, 'invalid first-release year');
  if (!/\p{Script=Han}/u.test(r.focus_zh) || !/\p{Script=Han}/u.test(r.boundary_zh)) fail(r, 'missing Chinese description');
  for (const field of ['paper', 'code', 'project']) if (r[field] !== null && !validateURL(r[field])) fail(r, `invalid ${field} URL`);
  if (!r.paper && !['project', 'essay'].includes(r.status)) fail(r, 'research entry needs a paper or project status');
  if ((r.category === 'perspectives') !== (r.kind === 'perspective' && r.status === 'essay')) fail(r, 'perspectives must use kind perspective and status essay');
  if (r.status === 'essay' && (!r.project || r.paper)) fail(r, 'essays need a primary article URL in project and no paper URL');
  if (!r.paper && !r.code && !r.project) fail(r, 'entry needs a primary link');
  if (!Array.isArray(r.evidence_urls) || !r.evidence_urls.length || !r.evidence_urls.every(validateURL)) fail(r, 'invalid evidence_urls');
  if (![r.paper, r.code, r.project].filter(Boolean).some(url => r.evidence_urls.includes(url))) fail(r, 'evidence must include a listed primary link');
  const key = paperKey(r.paper);
  if (key && papers.has(key)) fail(r, 'duplicate paper; use one primary category and cross-links');
  if (key) papers.add(key);
}
for (const c of categories) if (!records.some(r => r.category === c.id)) throw new Error(`Empty category: ${c.id}`);

const byId = new Map(records.map(r => [r.id, r]));
const latest = records.map(r => r.verified_on).sort().at(-1);
const oldest = records.map(r => r.verified_on).sort()[0];
const kindLabels = { en: { method: 'Method', benchmark: 'Benchmark', study: 'Study', system: 'System', foundation: 'Foundation', perspective: 'Perspective' }, zh: { method: '方法', benchmark: '基准', study: '实证研究', system: '系统', foundation: '基础方法', perspective: '观点' } };
const sourceLabels = { en: { preprint: 'Preprint / report', published: 'Published', project: 'Project', essay: 'Essay / talk' }, zh: { preprint: '预印本 / 报告', published: '已发表', project: '项目', essay: '文章 / 演讲' } };
function cell(text) { return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('|', '&#124;'); }
function links(r, lang) {
  return [['Paper', r.paper], ['Code', r.code], [r.status === 'essay' ? 'Read' : r.project?.includes('github.com') ? 'Resources' : 'Project', r.project]]
    .filter(([, url]) => url).map(([label, url]) => `[${label}](${url})`).join(' · ');
}
function table(items, lang) {
  const header = lang === 'en'
    ? '| Work | Contribution / idea | Sources |\n| --- | --- | --- |'
    : '| 工作 | 贡献 / 观点 | 来源 |\n| --- | --- | --- |';
  const rows = [header, ...items.map(r => {
    const metadata = `${r.year} · ${cell(r.venue)}`;
    return `| <a id="work-${r.id}"></a>**${cell(r.short_name)}**<br><sub>${metadata}</sub> | ${cell(r[`focus_${lang}`])} | ${links(r, lang)} |`;
  })].join('\n');
  const label = lang === 'en' ? 'Full titles, evidence and scope notes' : '展开完整标题、评价证据与适用范围';
  const notes = items.map(r => `- **${cell(r.short_name)}** — *${cell(r.title)}*. ${kindLabels[lang][r.kind]} · ${sourceLabels[lang][r.status]}. ${cell(r[`boundary_${lang}`])}`).join('\n');
  return `${rows}\n\n<details>\n<summary>${label} (${items.length})</summary>\n\n${notes}\n\n</details>`;
}
const starter = [
  { en: 'Taste and its proxies', zh: 'Taste 及其代理指标', ids: ['colah-taste-exercises', 'ai-can-learn-scientific-taste', 'tasteval'], why_en: 'Move from human heuristics to learned preferences and experimental decisions.', why_zh: '从人类经验出发，对照学习得到的偏好与实验决策。' },
  { en: 'Ideas and realized outcomes', zh: 'Idea 与实际研究结果', ids: ['llm-novel-research-ideas-human-study', 'ideation-execution-gap'], why_en: 'Read proposal ratings alongside what happens when researchers execute the ideas.', why_zh: '把提案评分与研究者实际执行 idea 后的结果放在一起看。' },
  { en: 'Finding a research question', zh: '发现值得研究的问题', ids: ['rq-bench', 'agentideabench'], why_en: 'Compare author-anchored questions with ideas formed through active literature exploration.', why_zh: '对照以作者研究为参照的问题，以及通过主动文献探索形成的构思。' },
  { en: 'Executable research loops', zh: '可执行的科研循环', ids: ['autoresearch', 'arbor'], why_en: 'Start with a compact loop, then inspect hypothesis and evidence management.', why_zh: '从简洁循环入手，再研究假设与证据的管理。' },
  { en: 'Learning across research runs', zh: '跨研究过程的经验积累', ids: ['agentrxiv', 'evoscientist'], why_en: 'Compare shared reports with explicit ideation and experimentation memories.', why_zh: '比较共享报告与显式的构思、实验经验记忆。' },
  { en: 'Evaluation for AI research', zh: 'AI research 的评价', ids: ['mlr-bench', 'fml-bench', 'paperbench'], why_en: 'Separate open-ended proposals, controlled search comparisons, and replication.', why_zh: '区分开放式提案、受控搜索策略比较和论文复现。' },
];
function starterTable(lang) {
  const header = lang === 'en' ? '| Route | Start with | Reading question |\n| --- | --- | --- |' : '| 路线 | 建议先读 | 阅读重点 |\n| --- | --- | --- |';
  return [header, ...starter.map(s => {
    const refs = s.ids.map(id => {
      const r = byId.get(id);
      if (!r) throw new Error(`Unknown starter entry: ${id}`);
      return `[${r.short_name}](#work-${id})`;
    }).join(' → ');
    return `| ${s[lang]} | ${refs} | ${s[`why_${lang}`]} |`;
  })].join('\n');
}
function catalog(lang) {
  return categories.map(c => {
    const items = records.filter(r => r.category === c.id).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'en'));
    let body = `## ${c[lang]}\n\n<a id="${c.id}"></a>\n\n${c[`question_${lang}`]}\n\n`;
    const foundations = items.filter(r => r.kind === 'foundation');
    body += table(items.filter(r => r.kind !== 'foundation'), lang);
    if (foundations.length) body += `\n\n### ${lang === 'en' ? 'Transferable foundations' : '可迁移的基础方法'}\n\n${lang === 'en' ? 'These methods inform research-agent design; their original evaluations do not directly establish scientific discovery or research taste.' : '这些方法为科研 agent 设计提供基础；原始评价并未直接验证科学发现或 research taste。'}\n\n${table(foundations, lang)}`;
    if (c.id === 'systems') body += lang === 'en'
      ? '\n\n**Version note:** The AI Scientist v1 and v2 are retained as distinct implementation reports. Their later journal synthesis is [Towards end-to-end automation of AI research](https://www.nature.com/articles/s41586-026-10265-5), Nature 2026; it is a follow-up, not an additional independently counted system.'
      : '\n\n**版本说明：** The AI Scientist v1 与 v2 作为不同实现报告分别保留。后续期刊整合版为 [Towards end-to-end automation of AI research](https://www.nature.com/articles/s41586-026-10265-5)，Nature 2026；这里作为后续版本链接，不额外计为独立系统。';
    return body;
  }).join('\n\n');
}
function mapTable(lang) {
  const header = lang === 'en' ? '| Explore the collection | Entries |\n| --- | ---: |' : '| 浏览目录 | 条目数 |\n| --- | ---: |';
  return [header, ...categories.map(c => `| [${c[lang]}](#${c.id}) | ${records.filter(r => r.category === c.id).length} |`)].join('\n');
}
const rendered = new Map();
for (const lang of ['en', 'zh']) {
  const template = fs.readFileSync(path.join(root, 'docs', 'templates', `README.${lang}.md`), 'utf8');
  const replacements = { COUNT: String(records.length), PAPER_COUNT: String(papers.size), ESSAY_COUNT: String(records.filter(r => r.status === 'essay').length), CODE_COUNT: String(records.filter(r => r.code).length), VERIFIED_ON: latest, REVIEW_RANGE: oldest === latest ? latest : `${oldest}–${latest}`, MAP: mapTable(lang), STARTER: starterTable(lang), CATALOG: catalog(lang) };
  const content = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in replacements)) throw new Error(`Unknown template placeholder: ${key}`);
    return replacements[key];
  }).replace(/\r\n/g, '\n').trimEnd() + '\n';
  const filename = lang === 'en' ? 'README.md' : 'README.zh-CN.md';
  const entryIds = [...content.matchAll(/<a id="work-([^"]+)"><\/a>/g)].map(m => m[1]);
  if (entryIds.length !== records.length || new Set(entryIds).size !== records.length || entryIds.some(id => !ids.has(id))) throw new Error(`${filename}: catalog mismatch`);
  rendered.set(filename, content);
}
function anchors(content) {
  const found = new Set([...content.matchAll(/<a id="([^"]+)"><\/a>/g)].map(m => m[1]));
  for (const match of content.matchAll(/^#{1,6} (.+)$/gm)) found.add(match[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-'));
  return found;
}
for (const [filename, content] of rendered) {
  for (const match of content.matchAll(/\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^https?:\/\//.test(target)) {
      if (!validateURL(target)) throw new Error(`${filename}: invalid external URL ${target}`);
      continue;
    }
    const [relative, anchor] = target.split('#');
    const destination = relative || filename;
    const resolved = path.resolve(root, destination);
    if (!rendered.has(destination) && !fs.existsSync(resolved)) throw new Error(`${filename}: missing local link ${target}`);
    if (anchor) {
      const linked = rendered.get(destination) ?? fs.readFileSync(resolved, 'utf8');
      if (!anchors(linked).has(anchor)) throw new Error(`${filename}: missing anchor ${target}`);
    }
  }
}
for (const [filename, content] of rendered) {
  const destination = path.join(root, filename);
  if (check) {
    if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8').replace(/\r\n/g, '\n') !== content) throw new Error(`${filename} is stale; run node scripts/build.mjs`);
  } else fs.writeFileSync(destination, content, 'utf8');
}
console.log(JSON.stringify({ mode: check ? 'check' : 'build', works: records.length, papers: papers.size, official_code_links: records.filter(r => r.code).length, categories: Object.fromEntries(categories.map(c => [c.id, records.filter(r => r.category === c.id).length])), source_review_range: oldest === latest ? latest : [oldest, latest], bilingual_catalog: 'matched', local_links_and_anchors: 'valid' }, null, 2));
