import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const records = fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.json')).sort().flatMap(f => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8').replace(/^\uFEFF/, '')));
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'survey/generated/bibliographic-metadata.json'), 'utf8'));
const tex = s => s.replace(/[&%$#_{}]/g, c => '\\' + c).replaceAll('–', '--').replaceAll('—', '---').replaceAll('‑', '-');
const bib = records.map(r => {
  const m = metadata[r.id];
  if (!m?.authors?.length) throw new Error(`Missing verified authors: ${r.id}`);
  const authors = m.authors.length > 6 ? [...m.authors.slice(0, 6), 'others'] : m.authors;
  const publicationYear = [...r.venue.matchAll(/20\d{2}/g)].at(-1)?.[0] ?? String(r.year);
  const note = [r.status === 'preprint' ? 'Preprint / technical report' : r.status === 'project' ? 'Software project' : r.status === 'essay' ? 'Essay / talk' : '', publicationYear !== String(r.year) ? `First public release: ${r.year}` : ''].filter(Boolean).join('. ');
  return `@misc{${r.id},\n  author = {${authors.map(tex).join(' and ')}},\n  title = {{${tex(r.title)}}},\n  year = {${publicationYear}},\n  howpublished = {${tex(r.venue)}},\n  url = {${r.paper ?? r.project ?? r.code}}${note ? `,\n  note = {${tex(note)}}` : ''}\n}`;
}).join('\n\n') + '\n';
fs.writeFileSync(path.join(root, 'survey/references.bib'), bib);
const snapshot = {snapshot_date:'2026-10-26', base_commit:'4d9bd787f8a1568b5ce618593cf08be8e487c6d9', count:records.length, papers:records.filter(r=>r.paper).length, essays:records.filter(r=>r.status==='essay').length, records:records.map(r=>({id:r.id,title:r.title,category:r.category,kind:r.kind,status:r.status,paper:r.paper,code:r.code,project:r.project,verified_on:r.verified_on}))};
fs.writeFileSync(path.join(root,'survey/generated/catalog-snapshot.json'),JSON.stringify(snapshot,null,2)+'\n');
console.log(`Generated ${records.length} references with verified author metadata.`);
