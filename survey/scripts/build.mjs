import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const surveyRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const languages = ['en', 'zh'];
const expectedCount = 79;
const citationPattern = /\\(?:cite|citep|citet|citealt|citealp|citeauthor|citeyear|citeyearpar|Citep|Citet)\*?(?:\s*\[[^\]]*\])*\s*\{([^}]+)\}/g;
const headingPattern = /\\(section|subsection|subsubsection|paragraph|subparagraph)\*?\s*(?:\[[^\]]*\]\s*)?\{/g;

// Keep all paths relative to this source bundle, regardless of the caller's cwd.
function fail(message) { throw new Error(message); }
function read(filename) { return fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, ''); }
function sha256(filename) { return createHash('sha256').update(fs.readFileSync(filename)).digest('hex'); }
function posix(filename) { return filename.split(path.sep).join('/'); }
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

export function activeText(source) {
  const uncommented = source.split(/\r?\n/).map(line => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== '%') continue;
      let slashes = 0;
      for (let j = i - 1; j >= 0 && line[j] === '\\'; j--) slashes++;
      if (slashes % 2 === 0) return line.slice(0, i);
    }
    return line;
  }).join('\n');
  return uncommented.replace(/\\begin\{(verbatim\*?|Verbatim|lstlisting|minted|comment)\}[\s\S]*?\\end\{\1\}/g, '');
}

function includedSources(root, lang) {
  const sources = new Map();
  const visiting = new Set();
  function visit(relative) {
    const absolute = path.resolve(root, relative);
    const local = path.relative(root, absolute);
    if (local.startsWith(`..${path.sep}`) || local === '..' || path.isAbsolute(local)) fail(`Source outside survey bundle: ${relative}`);
    const name = posix(local);
    if (visiting.has(name)) fail(`Circular TeX input: ${name}`);
    if (sources.has(name)) fail(`Duplicate TeX input in ${lang}: ${name}`);
    if (!fs.existsSync(absolute)) fail(`Missing TeX source: ${name}`);
    const content = activeText(read(absolute));
    if (/\\(?:nocite|includeonly)\b/.test(content)) fail(`${name}: nocite and includeonly are not allowed in the survey`);
    sources.set(name, content);
    visiting.add(name);
    for (const match of content.matchAll(/\\(?:input|include)\s*\{([^}]+)\}/g)) {
      const target = match[1].trim();
      if (/[\\#$]/.test(target)) fail(`${name}: dynamic TeX inputs are unsupported: ${target}`);
      visit(target.endsWith('.tex') ? target : `${target}.tex`);
    }
    visiting.delete(name);
  }
  visit(`main.${lang}.tex`);
  return sources;
}

function citationKeys(content) {
  return [...content.matchAll(citationPattern)].flatMap(match => match[1].split(',').map(key => key.trim()));
}

function checkCitationContext(content, section) {
  if (/\\iffalse\b/.test(content)) fail(`${section}: hidden iffalse blocks cannot establish citation coverage`);
  for (const paragraph of content.split(/\n\s*\n/)) {
    if (!citationKeys(paragraph).length) continue;
    const context = paragraph.replace(citationPattern, '').replace(/\\[A-Za-z]+\*?/g, '');
    const letters = context.match(/[\p{L}]/gu) ?? [];
    if (letters.length < 10) fail(`${section}: a bare citation group does not establish substantive coverage`);
  }
}

export function validateSurvey(root = surveyRoot) {
  const snapshotPath = path.join(root, 'generated', 'catalog-snapshot.json');
  const snapshot = JSON.parse(read(snapshotPath));
  if (!Array.isArray(snapshot.records) || snapshot.count !== expectedCount || snapshot.records.length !== expectedCount) {
    fail(`Expected the frozen ${expectedCount}-record catalog snapshot`);
  }
  const ids = snapshot.records.map(record => record.id);
  if (ids.some(id => typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) || new Set(ids).size !== expectedCount) {
    fail('Invalid or duplicate catalog IDs in snapshot');
  }
  const idSet = new Set(ids);
  const bibliography = read(path.join(root, 'references.bib'));
  const bibKeys = [...bibliography.matchAll(/^\s*@(?!comment\b|string\b|preamble\b)[A-Za-z]+\s*[\{(]\s*([^,\s]+)\s*,/gim)].map(match => match[1]);
  if (new Set(bibKeys).size !== bibKeys.length) fail('Duplicate bibliography keys');
  const unknownBib = bibKeys.filter(key => !idSet.has(key));
  const absentBib = ids.filter(id => !bibKeys.includes(id));
  if (unknownBib.length || absentBib.length) fail(`Bibliography/snapshot mismatch; unknown: ${unknownBib.join(', ') || 'none'}; missing: ${absentBib.join(', ') || 'none'}`);

  const coverage = Object.fromEntries([...ids].sort().map(id => [id, { en: [], zh: [] }]));
  const summaries = {};
  const structures = {};
  const sourceFiles = new Set(['generated/catalog-snapshot.json', 'references.bib']);
  const citedByLanguage = {};
  for (const lang of languages) {
    const sources = includedSources(root, lang);
    for (const [filename, content] of sources) {
      sourceFiles.add(filename);
      const unknown = citationKeys(content).filter(key => !idSet.has(key));
      if (unknown.length) fail(`${filename}: unknown citation keys: ${[...new Set(unknown)].join(', ')}`);
    }
    const sections = [...sources].filter(([filename]) => filename.startsWith('sections/'));
    if (!sections.length) fail(`No included sections in main.${lang}.tex`);
    const cited = new Set();
    let occurrences = 0;
    structures[lang] = [];
    const headings = {};
    for (const [filename, content] of sections) {
      if (!filename.endsWith(`.${lang}.tex`)) fail(`Wrong-language or unpaired section in ${lang}: ${filename}`);
      checkCitationContext(content, filename);
      const keys = citationKeys(content);
      occurrences += keys.length;
      for (const key of new Set(keys)) {
        cited.add(key);
        coverage[key][lang].push(filename);
      }
      const levels = [...content.matchAll(headingPattern)].map(match => match[1]);
      structures[lang].push({ section: filename.replace(new RegExp(`\\.${lang}\\.tex$`), ''), levels });
      for (const level of levels) headings[level] = (headings[level] ?? 0) + 1;
    }
    const missing = ids.filter(id => !cited.has(id));
    if (missing.length) fail(`${lang}: snapshot works not cited in included sections: ${missing.join(', ')}`);
    citedByLanguage[lang] = [...cited].sort();
    summaries[lang] = { unique_citations: cited.size, citation_occurrences: occurrences, included_sections: sections.length, headings };
  }
  if (!sameArray(citedByLanguage.en, citedByLanguage.zh)) fail('English and Chinese citation sets differ');
  if (!sameArray(structures.en, structures.zh)) {
    const mismatches = structures.en.filter((item, i) => !sameArray(item, structures.zh[i])).map(item => item.section);
    fail(`Bilingual section order or heading hierarchy differs: ${mismatches.join(', ') || 'section count'}`);
  }
  return {
    snapshot_date: snapshot.snapshot_date,
    corpus_count: expectedCount,
    validation: 'Included active citations, bibliography keys, and bilingual heading hierarchy checked; semantic relevance requires editorial review.',
    languages: summaries,
    entries: coverage,
    source_files: [...sourceFiles].sort(),
  };
}

function parseArgs(args) {
  const options = { checkOnly: false, tectonic: null, help: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--check-only') options.checkOnly = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--tectonic') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) fail('--tectonic requires an absolute executable path');
      options.tectonic = args[++i];
      if (!path.isAbsolute(options.tectonic)) fail('--tectonic requires an absolute executable path');
    } else fail(`Unknown argument: ${arg}`);
  }
  return options;
}

function probe(command, args = ['--version']) {
  const result = spawnSync(command, args, { cwd: surveyRoot, shell: false, encoding: 'utf8', timeout: 10000, windowsHide: true });
  if (result.error || result.status !== 0) return null;
  return (result.stdout || result.stderr || '').trim().split(/\r?\n/).slice(0, 4).join('\n');
}

function selectEngine(explicitTectonic) {
  if (explicitTectonic) {
    const version = probe(explicitTectonic);
    if (version === null) fail(`Cannot run Tectonic: ${explicitTectonic}`);
    return { name: 'tectonic', executable: explicitTectonic, version };
  }
  for (const name of ['tectonic', 'latexmk']) {
    const version = probe(name, name === 'latexmk' ? ['-v'] : ['--version']);
    if (version !== null) return { name, executable: name, version };
  }
  fail('No compiler found. Install Tectonic or latexmk with XeLaTeX, or use --tectonic <absolute executable path>.');
}

function compile(engine, lang) {
  const outdir = path.join('build', lang);
  fs.mkdirSync(path.join(surveyRoot, outdir), { recursive: true });
  const main = `main.${lang}.tex`;
  const args = engine.name === 'tectonic'
    ? ['--keep-logs', '--keep-intermediates', '--outdir', outdir, main]
    : ['-xelatex', '-interaction=nonstopmode', '-halt-on-error', '-file-line-error', `-outdir=${outdir}`, main];
  console.log(`Building ${lang} with ${engine.name}...`);
  const result = spawnSync(engine.executable, args, { cwd: surveyRoot, shell: false, stdio: 'inherit', windowsHide: true });
  if (result.error) fail(`${lang} compiler failed: ${result.error.message}`);
  if (result.status !== 0) fail(`${lang} compiler exited with ${result.status ?? result.signal}`);
  const pdf = path.join(surveyRoot, outdir, `main.${lang}.pdf`);
  if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5 || fs.readFileSync(pdf).subarray(0, 5).toString('ascii') !== '%PDF-') {
    fail(`${lang}: compiler did not produce a valid PDF file`);
  }
  const logfile = path.join(surveyRoot, outdir, `main.${lang}.log`);
  if (fs.existsSync(logfile)) {
    const log = read(logfile);
    if (/Missing character:/.test(log)) fail(`${lang}: missing font glyphs; inspect ${posix(path.relative(surveyRoot, logfile))}`);
    if (/There were undefined (?:references|citations)|Citation[^\r\n]*undefined|Reference[^\r\n]*undefined/i.test(log)) {
      fail(`${lang}: unresolved references or citations remain; inspect ${posix(path.relative(surveyRoot, logfile))}`);
    }
  }
  return { lang, pdf, command_args: args };
}

function pageCount(pdf) {
  const result = spawnSync('pdfinfo', [pdf], { cwd: surveyRoot, shell: false, encoding: 'utf8', timeout: 10000, windowsHide: true });
  if (result.error || result.status !== 0) return null;
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  return match ? Number(match[1]) : null;
}

function writeJson(filename, value) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  if (options.help) {
    console.log('Usage: node scripts/build.mjs [--check-only] [--tectonic <absolute executable path>]\nBuilds main.en.tex and main.zh.tex; --check-only performs offline source checks without invoking compilers.');
    return;
  }
  const coverage = validateSurvey();
  writeJson(path.join(surveyRoot, 'generated', 'citation-coverage.json'), coverage);
  console.log(`Citation/structure checks passed: ${expectedCount} works cited in each language.`);
  if (options.checkOnly) return;
  const engine = selectEngine(options.tectonic);
  const compiled = languages.map(lang => compile(engine, lang));
  const destination = path.resolve(surveyRoot, '..', 'output', 'pdf');
  fs.mkdirSync(destination, { recursive: true });
  const documents = {};
  for (const { lang, pdf, command_args } of compiled) {
    const filename = `autoresearch-survey-${lang}.pdf`;
    const target = path.join(destination, filename);
    fs.copyFileSync(pdf, target);
    const pages = pageCount(target);
    documents[lang] = {
      filename, bytes: fs.statSync(target).size, sha256: sha256(target),
      ...(pages === null ? {} : { pages }),
      engine: engine.name, command_args, ...coverage.languages[lang],
    };
  }
  const report = {
    built_at: new Date().toISOString(), snapshot_date: coverage.snapshot_date,
    corpus_count: expectedCount, engine: { name: engine.name, version: engine.version }, documents,
    source_sha256: Object.fromEntries(coverage.source_files.map(filename => [filename, sha256(path.join(surveyRoot, filename))])),
    validation: { active_citation_coverage: 'passed', bilingual_structure: 'passed', unresolved_references: 'none detected in compiler logs', visual_review: 'not performed by this build script' },
    metadata_refresh: 'none; checked-in bibliography and snapshot used',
  };
  writeJson(path.join(destination, 'survey-build-report.json'), report);
  console.log(`Built both PDFs and survey-build-report.json in ${destination}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.error(`Survey build failed: ${error.message}`); process.exitCode = 1; }
}
