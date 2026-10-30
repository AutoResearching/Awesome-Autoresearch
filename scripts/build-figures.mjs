import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(arg => arg !== '--check')) throw new Error('Usage: node scripts/build-figures.mjs [--check]');
const output = path.join(root, 'docs', 'assets');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (x, y, value, size = 20, fill = '#24334a', weight = 400, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(value)}</text>`;
const lines = (x, y, values, size = 20, step = 29, fill = '#24334a', weight = 400) => values.map((s, i) => text(x, y + i * step, s, size, fill, weight)).join('\n');
const rect = (x, y, w, h, fill = '#ffffff', stroke = '#dbe3ed', radius = 16) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
function arrow(d) {
  let x = 0, y = 0, previousX = 0, previousY = 0;
  for (const [, command, first, second] of d.matchAll(/([MHV])(-?\d+)(?:\s+(-?\d+))?/g)) {
    previousX = x; previousY = y;
    if (command === 'M') { x = Number(first); y = Number(second); }
    if (command === 'H') x = Number(first);
    if (command === 'V') y = Number(first);
  }
  const dx = Math.sign(x - previousX), dy = Math.sign(y - previousY);
  const ax = x - 8 * dx, ay = y - 8 * dy;
  return `<path d="${d} M${ax - 5 * dy} ${ay + 5 * dx}L${x} ${y}L${ax + 5 * dy} ${ay - 5 * dx}" fill="none" stroke="#8290a4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function svg(title, description, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(description)}</desc>
<g font-family="Arial, 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif">
${rect(1, 1, 1198, height - 2, '#f8fafc', '#e2e8f0', 20)}
${body}
</g>
</svg>
`;
}

const copy = {
  en: {
    title: 'What does an AI researcher actually do?',
    kicker: 'ONE EXAMPLE · FOUR RESEARCH CAPABILITIES',
    context: ['Suppose training scores improve, but performance on new tasks stays flat.', 'This is an illustrative research situation, not a reported experimental result.'],
    cards: [
      { tag: 'RESEARCH TASTE', title: '1  Choose what matters', question: ['Why do the gains fail to transfer?'], detail: ['Check prior work and explain why resolving', 'this uncertainty would change a decision.'], artifact: 'Output: a justified research question', color: '#2456a5', bg: '#edf4ff' },
      { tag: 'QUESTIONS & HYPOTHESES', title: '2  Make the idea testable', question: ['Better data, or simply more training?'], detail: ['State competing explanations and predict', 'what each would imply for a fair comparison.'], artifact: 'Output: hypotheses and a test plan', color: '#7353aa', bg: '#f3effb' },
      { tag: 'RESEARCH EXECUTION', title: '3  Run a discriminating test', question: ['Compare data choices on unseen tasks.'], detail: ['Control training setup; record uncertainty,', 'failed attempts, and reproducible evidence.'], artifact: 'Output: results that address the claim', color: '#09756e', bg: '#eaf7f4' },
      { tag: 'LEARNING FROM EXPERIENCE', title: '4  Improve the next investigation', question: ['Which lesson helps on a new task?'], detail: ['Retain evidence and its limits; test whether', 'memory, skills, code, or training improve decisions.'], artifact: 'Output: a lesson whose transfer is tested', color: '#9a601a', bg: '#fff5e6' },
    ],
    evaluation: 'EVALUATE EACH STEP',
    evaluationText: ['Is the question worthwhile? Is the finding new?', 'Does the evidence hold up? Where does it apply?'],
    footer: 'Evidence can change the question, the method, or the next project. Researchers can revisit any step.',
    learnTitle: 'A better result today. A better researcher tomorrow?',
    learnKicker: 'TWO CLAIMS THAT NEED DIFFERENT TESTS',
    leftTitle: 'Within one investigation', rightTitle: 'Across investigations',
    left: ['Try data mix A', 'Inspect the result', 'Revise the mix and try again'],
    right: ['Save the decision, evidence, and conditions', 'Change memory, skills, code, or model weights', 'Evaluate the change on a held-out task'],
    leftNote: ['What this can show:', 'a better solution to the current task.'],
    rightNote: ['What this can show:', 'better research decisions on a new task.'],
    learnFooter: ['Compare research quality on held-out tasks against a suitable baseline.', 'Saving a report or updating weights alone does not demonstrate transfer.'],
  },
  zh: {
    title: 'AI 做研究，具体在做什么？',
    kicker: '一个例子 · 四项科研能力',
    context: ['假设：训练分数提高了，但模型在新任务上的表现没有改善。', '这是帮助理解流程的示例，并非本项目报告的实验结果。'],
    cards: [
      { tag: 'RESEARCH TASTE · 科研品味', title: '1  选择值得研究的问题', question: ['为什么已有提升不能迁移？'], detail: ['检查已有研究，说明回答这个问题', '会改变什么认识或实际决策。'], artifact: '产出：有依据、有价值的研究问题', color: '#2456a5', bg: '#edf4ff' },
      { tag: 'QUESTIONS & HYPOTHESES · 问题与假设', title: '2  把想法变成可检验的假设', question: ['数据更好，还是只是训练更多？'], detail: ['提出不同解释，写清每种解释', '在公平比较下会预测什么现象。'], artifact: '产出：研究假设与验证方案', color: '#7353aa', bg: '#f3effb' },
      { tag: 'RESEARCH EXECUTION · 研究执行', title: '3  用实验区分不同解释', question: ['在未见任务上比较不同的数据选择。'], detail: ['控制训练条件；记录误差、', '失败尝试，以及可复现的证据。'], artifact: '产出：能够回答关键主张的结果', color: '#09756e', bg: '#eaf7f4' },
      { tag: 'LEARNING FROM EXPERIENCE · 经验学习', title: '4  改善下一次研究', question: ['哪些经验对一个新任务仍然有用？'], detail: ['保留证据及适用条件；检验记忆、技能、', '代码或参数训练能否改善研究决策。'], artifact: '产出：经过迁移检验的经验', color: '#9a601a', bg: '#fff5e6' },
    ],
    evaluation: 'EVALUATION · 每一步都要评价',
    evaluationText: ['问题值得研究吗？发现是否带来新知识？', '证据是否可靠？结论适用于哪些条件？'],
    footer: '新证据可以改变问题、方法或后续项目；研究者可以回到任何一步重新思考。',
    learnTitle: '这次结果更好，下次研究也会更好吗？',
    learnKicker: '两种改进，需要不同的检验',
    leftTitle: '同一次研究之内', rightTitle: '不同研究任务之间',
    left: ['尝试数据配比 A', '查看实验结果', '修改配比，再试一次'],
    right: ['保存研究决策、证据和适用条件', '改变记忆、技能、代码或模型参数', '在一个留出任务上检验改进'],
    leftNote: ['可以支持的结论：', '当前任务的解更好了。'],
    rightNote: ['可以支持的结论：', '新任务上的研究决策更好了。'],
    learnFooter: ['在留出任务上与合适的 baseline 比较，检验研究质量是否提高。', '保存报告或更新参数本身，不能证明经验已经迁移。'],
  },
};

function researchMap(c) {
  const pieces = [text(44, 38, c.kicker, 15, '#53647b', 700), text(44, 80, c.title, 34, '#15243b', 700)];
  pieces.push(rect(44, 104, 1112, 84, '#e9eff7', '#e9eff7', 12));
  pieces.push(text(64, 138, c.context[0], 23, '#233b59', 600), text(64, 168, c.context[1], 17, '#53647b'));
  const coords = [[44, 220], [620, 220], [44, 490], [620, 490]];
  c.cards.forEach((card, i) => {
    const [x, y] = coords[i];
    pieces.push(rect(x, y, 536, 236));
    pieces.push(`<path d="M${x + 16} ${y}H${x + 520}" stroke="${card.color}" stroke-width="4"/>`);
    pieces.push(text(x + 22, y + 32, card.tag, 14, card.color, 700));
    pieces.push(text(x + 22, y + 68, card.title, 25, '#15243b', 700));
    pieces.push(lines(x + 22, y + 108, card.question, 23, 29, card.color, 600));
    pieces.push(lines(x + 22, y + 143, card.detail, 19, 27, '#53647b'));
    pieces.push(rect(x + 14, y + 189, 508, 34, card.bg, card.bg, 8));
    pieces.push(text(x + 24, y + 212, card.artifact, 18, card.color, 600));
  });
  pieces.push(arrow('M584 338H614'), arrow('M888 460V473H312V484'), arrow('M584 608H614'));
  pieces.push(rect(44, 754, 1112, 100, '#eaf1ef', '#d6e4df', 12));
  pieces.push(text(64, 789, c.evaluation, 17, '#15574d', 700));
  pieces.push(lines(430, 789, c.evaluationText, 20, 30, '#284e45'));
  pieces.push(text(44, 886, c.footer, 17, '#53647b'));
  return svg(c.title, [...c.context, ...c.cards.map(x => `${x.title}. ${x.question.join(' ')} ${x.artifact}.`), ...c.evaluationText].join(' '), 910, pieces.join('\n'));
}

function learningMap(c) {
  const pieces = [text(44, 38, c.learnKicker, 15, '#53647b', 700), text(44, 80, c.learnTitle, 32, '#15243b', 700)];
  const columns = [{x:44, title:c.leftTitle, values:c.left, note:c.leftNote, color:'#2456a5', bg:'#edf4ff'}, {x:620, title:c.rightTitle, values:c.right, note:c.rightNote, color:'#9a601a', bg:'#fff5e6'}];
  for (const col of columns) {
    pieces.push(rect(col.x, 112, 536, 375));
    pieces.push(text(col.x + 24, 150, col.title, 25, col.color, 700));
    col.values.forEach((s, i) => {
      const y = 174 + i * 73;
      pieces.push(rect(col.x + 24, y, 488, 48, col.bg, col.bg, 9), text(col.x + 42, y + 31, s, 20));
      if (i < 2) pieces.push(arrow(`M${col.x + 268} ${y + 51}V${y + 67}`));
    });
    pieces.push(lines(col.x + 24, 428, col.note, 21, 29, col.color, 600));
  }
  pieces.push(rect(44, 512, 1112, 88, '#e9eff7', '#e9eff7', 12));
  pieces.push(lines(64, 545, c.learnFooter, 21, 30, '#233b59'));
  return svg(c.learnTitle, [c.leftTitle, ...c.left, ...c.leftNote, c.rightTitle, ...c.right, ...c.rightNote, ...c.learnFooter].join('. '), 626, pieces.join('\n'));
}

const figures = new Map();
for (const [lang, c] of Object.entries(copy)) {
  figures.set(`research-map.${lang}.svg`, researchMap(c));
  figures.set(`learning-transfer.${lang}.svg`, learningMap(c));
}
figures.set('social-preview.svg', svg('Awesome Autoresearch — Learning to Do Research', 'A curated collection about choosing worthwhile research questions, testing ideas, and learning from evidence. Papers, code, benchmarks, and a bilingual survey.', 630, [
  text(64, 62, 'AUTORESEARCHING / OPEN RESEARCH COLLECTION', 16, '#53647b', 700),
  text(64, 143, 'Awesome Autoresearch', 58, '#15243b', 700),
  text(64, 200, 'Learning to Do Research', 35, '#2456a5', 600),
  lines(64, 263, ['How can AI ask better questions, test ideas,', 'and learn from the evidence?'], 29, 39, '#53647b'),
  ...[{x:64, title:'CHOOSE A QUESTION', sub:'Research taste', color:'#2456a5', bg:'#edf4ff'}, {x:430, title:'TEST AN IDEA', sub:'Methods and evidence', color:'#09756e', bg:'#eaf7f4'}, {x:796, title:'LEARN WHAT WORKS', sub:'Experience and transfer', color:'#9a601a', bg:'#fff5e6'}].flatMap(c => [rect(c.x, 355, 340, 105, c.bg, c.bg, 14), text(c.x + 20, 397, c.title, 20, c.color, 700), text(c.x + 20, 433, c.sub, 22, '#24334a')]),
  arrow('M410 408H424'), arrow('M776 408H790'),
  text(64, 531, 'Papers · Code · Benchmarks · English & Chinese survey', 24, '#24334a'),
  text(64, 581, 'github.com/AutoResearching/Awesome-Autoresearch', 21, '#53647b'),
].join('\n')));
if (!check) fs.mkdirSync(output, {recursive:true});
for (const [name, content] of figures) {
  const destination = path.join(output, name);
  if (check) {
    if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8').replace(/\r\n/g, '\n') !== content) throw new Error(`${name} is stale; run node scripts/build-figures.mjs`);
  } else fs.writeFileSync(destination, content, 'utf8');
}
console.log(`${check ? 'Checked' : 'Built'} ${figures.size} SVG assets.`);
