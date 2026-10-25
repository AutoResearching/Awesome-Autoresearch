<!-- 由 scripts/build.mjs 根据本模板及 data/*.json 生成。 -->
# Awesome Autoresearch: Learning to Do Research

[English](README.md) | [简体中文](README.zh-CN.md)

围绕 **科研品味（research taste）、问题提出（question formulation）、科学推理（scientific reasoning）以及从研究经验中学习（learning from research experience）** 的论文、系统与基准精选。

AI 如何识别值得研究的未知，提出有意义的问题，开展严谨调查，并通过研究经验成为更好的研究者？

**44 项精选工作 · 43 条论文记录 · 33 个已核实官方代码链接**

来源核查日期：**2026-10-24**。这是有选择的入门资料库，不是穷尽式综述或性能排行榜。

## 范围

本仓库的研究对象是做研究的过程本身。**AI research 是主要实验场景，mathematics 是补充 testbed。** 其他学科的工作，如果提出可复用的发现方法、科研能力或评价协议，也可以收录。

这里采用广义的 **autoresearch**，包含 human–AI collaboration 和自主科研系统。单项方法无需自动化完整科研流程；这个名称也不限于 Karpathy 的同名项目，后者作为一种具体执行循环收录。

重点是问题的选择与调查、科学证据，以及科研决策的改进。通用写作助手、文献搜索产品、agent 框架和领域预测模型，只有在对这些问题提供明确方法贡献时才收录。同行评审与 meta-science 中涉及科研判断和可靠评价的工作同样相关。

## 研究地图

前四个方向描述科研能力，评价贯穿其中；完整系统提供额外的实现视角。每项工作只放在一个主要位置，跨方向关系通过阅读路线与链接表达。

| 方向 | 核心问题 | 条目数 |
| --- | --- | ---: |
| [科研品味与问题选择 · Research Taste](#taste) | 什么问题值得研究？这种判断如何学习和评价？ | 6 |
| [问题提出与假设生成 · Question Formulation](#questions) | AI 如何把知识缺口、矛盾与观察转化为有价值、可检验的问题？ | 6 |
| [科学推理与研究执行 · Research Execution](#execution) | 哪些实验、证明与修订，能够把问题转化为可靠的新知识？ | 5 |
| [从研究经验中学习 · Learning from Experience](#learning) | 如何利用研究结果和反馈，改善后续研究以及新任务上的决策？ | 9 |
| [基准与评价 · Benchmarks and Evaluation](#evaluation) | 如何分别评价问题价值、发现的可靠性、资源效率与迁移能力？ | 12 |
| [完整科研系统 · AI Scientist Systems](#systems) | 科研能力如何组合成系统？哪些决策仍由人类提供？ | 6 |

## 建议阅读路线

这些路线强调证据与机制的互补性，属于编者建议，不代表某个系统性能最好。

| 路线 | 建议先读 | 阅读重点 |
| --- | --- | --- |
| Taste 及其代理指标 | [Scientific Taste / RLCF](#work-ai-can-learn-scientific-taste) → [TasteVal](#work-tasteval) | 对照学习得到的偏好信号与实验决策效率。 |
| Idea 与实际研究结果 | [Human Study of Research Ideation](#work-llm-novel-research-ideas-human-study) → [Ideation-Execution Gap](#work-ideation-execution-gap) | 把提案评分与研究者实际执行 idea 后的结果放在一起看。 |
| 可执行的科研循环 | [Karpathy's autoresearch](#work-autoresearch) → [Arbor](#work-arbor) | 从简洁循环入手，再研究假设与证据的管理。 |
| 跨研究过程的经验积累 | [AgentRxiv](#work-agentrxiv) → [EvoScientist](#work-evoscientist) | 比较共享报告与显式的构思、实验经验记忆。 |
| AI research 的评价 | [MLR-Bench](#work-mlr-bench) → [FML-bench](#work-fml-bench) → [PaperBench](#work-paperbench) | 区分开放式提案、受控搜索策略比较和论文复现。 |

了解完整实现，可以继续读 [The AI Scientist-v2](#work-ai-scientist-v2) 或 [AI-Researcher](#work-ai-researcher)。关注数学发现，可以对照 [FunSearch](#work-funsearch)、[AlphaEvolve](#work-alphaevolve) 和 [Aletheia](#work-aletheia)。

## 如何阅读条目

- **年份**指所引工作首次公开的年份，venue 可能是后续发表年份。来源标签描述所引版本；标为 arXiv 不代表不存在后续正式发表版本。
- **Paper / Code / Project / Resources** 指向原始来源。没有 Code 链接，表示本轮未核实官方实现；项目网页、prompts 和输出记录不自动等同于完整代码发布。
- **基础方法（Foundation）** 表示具有可迁移价值，但原始实验没有直接验证科学发现或 research taste。
- **来源已核实**指已根据原始材料检查元数据及所述范围，不代表我们重跑了实验或独立确认了作者的科学主张。
- 请同时阅读证据边界：提案评分、可执行实验、复现结果与科学重要性，分别测量不同的能力。

## 科研品味与问题选择 · Research Taste

<a id="taste"></a>

什么问题值得研究？这种判断如何学习和评价？

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-ai-can-learn-scientific-taste"></a>**Scientific Taste / RLCF**<br>AI Can Learn Scientific Taste<br>2026 · arXiv<br>方法 · 预印本 / 报告 | 从领域与时间匹配的引用偏好中训练 Scientific Judge，再用其奖励训练 Scientific Thinker 生成后续研究想法。 | 引用量是学术共同体反响的代理，不能直接等同于科学价值；生成想法主要由 LLM 评审，尚未经过实验验证。 | [Paper](https://arxiv.org/abs/2603.14473) · [Code](https://github.com/tongjingqi/AI-Can-Learn-Scientific-Taste) · [Project](https://tongjingqi.github.io/AI-Can-Learn-Scientific-Taste/) |
| <a id="work-hindsight"></a>**HindSight**<br>HindSight: Evaluating LLM-Generated Research Ideas via Future Impact<br>2026 · arXiv<br>基准 · 预印本 / 报告 | 提出回顾式评价：将生成想法与后续论文匹配，并用引用量和发表 venue 对匹配结果加权。 | 论文匹配只是影响力代理，可能低估尚未被探索的想法；文中模型知识截止时间晚于检索截止时间，因此不能排除时间泄漏。 | [Paper](https://arxiv.org/abs/2603.15164) |
| <a id="work-rinobench"></a>**RINoBench**<br>Is This Idea Novel? An Automated Benchmark for Judgment of Research Ideas<br>2026 · LREC 2026<br>基准 · 已发表 | 用专家判断评估研究想法的新颖性评分及其理由，将 novelty assessment 作为可单独测量的科研能力。 | 与新颖性判断一致，不等于能提出新问题、预测可行性或证明科学重要性；理由听起来合理也不代表判断正确。 | [Paper](https://aclanthology.org/2026.lrec-1.370/) · [Code](https://github.com/TimSchopf/RINoBench) |
| <a id="work-scistylebench"></a>**SciStyleBench**<br>Style Wins, Substance Loses: A Diagnosis of LLM-as-Judge in Idea Generation<br>2026 · arXiv<br>基准 · 预印本 / 报告 | 通过受控改变想法的表达风格与实质内容，检验 LLM judge 奖励的是科学内容还是有说服力的写作风格。 | 测量构造扰动下评审器的稳健性与排序偏差，不直接验证被评想法的长期科学价值。 | [Paper](https://arxiv.org/abs/2608.01666) |
| <a id="work-tasteval"></a>**TasteVal**<br>TasteVal: Measuring the Experimental Research Taste of AI Systems Against Human Experts<br>2026 · arXiv<br>基准 · 预印本 / 报告 | 在 AI R&amp;D 任务上评估迭代实验设计与结果解释，并通过固定 coding agent 将研究决策与代码实现区分开。 | 将 taste 操作化为给定问题上的实验算力效率，不评估开放式选题能力，且任务未公开发布。 | [Paper](https://arxiv.org/abs/2610.06824) · [Project](https://pzeroresearch.com/work/tasteval/) |
| <a id="work-ideation-execution-gap"></a>**Ideation-Execution Gap**<br>The Ideation-Execution Gap: Execution Outcomes of LLM-Generated versus Human Research Ideas<br>2025 · ICLR 2026<br>实证研究 · 已发表 | 让研究者执行人类与 LLM 提出的想法，对比执行前后的专家评价，将提案质量与实际研究结果联系起来。 | 执行由人类主导，结果在 NLP 研究场景中评估；它提供想法评价的证据，并非自主科研执行能力的展示。 | [Paper](https://arxiv.org/abs/2506.20803) · [Code](https://github.com/NoviScl/AI-Researcher) |

## 问题提出与假设生成 · Question Formulation

<a id="questions"></a>

AI 如何把知识缺口、矛盾与观察转化为有价值、可检验的问题？

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-llm-novel-research-ideas-human-study"></a>**Human Study of Research Ideation**<br>Can LLMs Generate Novel Research Ideas? A Large-Scale Human Study with 100+ NLP Researchers<br>2024 · ICLR 2025<br>实证研究 · 已发表 | 通过专家盲审比较 LLM 与专家提出的研究方案，并分析生成多样性和自我评价的失败模式。 | 主要证据是执行前对 NLP 提案新颖性与可行性的评价；专家偏好不能证明已经实现科学发现或下游科学价值。 | [Paper](https://arxiv.org/abs/2409.04109) · [Code](https://github.com/NoviScl/AI-Researcher) |
| <a id="work-chain-of-ideas"></a>**Chain of Ideas / Idea Arena**<br>Chain of Ideas: Revolutionizing Research Via Novel Idea Development with LLM Agents<br>2024 · Findings of EMNLP 2025<br>方法 · 已发表 | 将文献组织成研究发展链，以生成想法和实验设计，并提出 Idea Arena 对提案进行比较评价。 | 提案比较评分衡量的是被评判的想法质量，不能证明已经执行的科学发现；组织既有文献本身也不等于从新实验中学习。 | [Paper](https://aclanthology.org/2025.findings-emnlp.477/) · [Code](https://github.com/DAMO-NLP-SG/CoI-Agent) |
| <a id="work-researchagent"></a>**ResearchAgent**<br>ResearchAgent: Iterative Research Idea Generation over Scientific Literature with Large Language Models<br>2024 · NAACL 2025<br>方法 · 已发表 | 利用种子论文、学术关系图与实体知识库提出问题、方法和实验计划，并通过 reviewing agents 迭代完善。 | 证据来自对生成提案的人类与模型评价；生成实验设计不等于已执行并验证该实验。 | [Paper](https://aclanthology.org/2025.naacl-long.342/) · [Code](https://github.com/JinheonBaek/ResearchAgent) |
| <a id="work-scideator"></a>**Scideator**<br>Scideator: Human-LLM Compound System for Scientific Ideation through Facet Recombination and Novelty Evaluation<br>2024 · ACM CAIS 2026<br>系统 · 已发表 | 通过重组论文的问题目的、方法机制和评价方式支持人机共同构思，并依据文献检查想法的新颖性。 | 这是经用户研究与新颖性检查器消融评估的人机协作系统；创造力支持和新颖性判断不能证明自主发现或实际影响。 | [Paper](https://arxiv.org/abs/2409.14634) |
| <a id="work-scipip"></a>**SciPIP**<br>SciPIP: An LLM-based Scientific Paper Idea Proposer<br>2024 · arXiv<br>方法 · 预印本 / 报告 | 结合语义、关键词和引用关系检索，以及 brainstorming 与检索生成两条路径，为给定研究背景提出想法。 | 评价采用专家对 NLP 和计算机视觉提案的评分；被认为可行或有帮助，不代表提案已经成功执行。 | [Paper](https://arxiv.org/abs/2410.23166) · [Code](https://github.com/cheerss/SciPIP) |
| <a id="work-scimon"></a>**SciMON**<br>SciMON: Scientific Inspiration Machines Optimized for Novelty<br>2023 · ACL 2024<br>方法 · 已发表 | 从给定研究背景出发检索科学启发，并通过与相关工作比较、迭代修改，生成自然语言研究方向。 | 以新颖性为目标的提案生成依赖给定背景；相对检索文献的新颖性不能证明实验有效性或研究重要性。 | [Paper](https://aclanthology.org/2024.acl-long.18/) · [Code](https://github.com/EagleW/Scientific-Inspiration-Machines-Optimized-for-Novelty) |

## 科学推理与研究执行 · Research Execution

<a id="execution"></a>

哪些实验、证明与修订，能够把问题转化为可靠的新知识？

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-autoresearch"></a>**Karpathy's autoresearch**<br>autoresearch<br>2026 · Open-source project<br>系统 · 项目 | 面向单 GPU 语言模型训练的修改—训练—评价—保留循环，可作为简洁的科研执行 baseline。 | 在短时训练中优化固定指标，研究指令由人类编写；指标提升不能验证问题选择或 taste 学习。 | [Code](https://github.com/karpathy/autoresearch) |
| <a id="work-arbor"></a>**Arbor**<br>Toward Generalist Autonomous Research via Hypothesis-Tree Refinement<br>2026 · arXiv<br>系统 · 预印本 / 报告 | 用持久化假设树保存假设、实验产物、证据与可复用经验，由 coordinator 和隔离的 executors 管理。 | 主要评价给定产物与目标下的自主优化；证据积累本身不能等同于广泛的科学问题选择。 | [Paper](https://arxiv.org/abs/2606.11926) · [Code](https://github.com/RUC-NLPIR/Arbor) · [Project](https://RUC-NLPIR.github.io/Arbor/) |
| <a id="work-aletheia"></a>**Aletheia**<br>Towards Autonomous Mathematics Research<br>2026 · arXiv<br>系统 · 预印本 / 报告 | 在研究级数学问题上迭代生成、验证、修订与文献使用，并讨论自主程度、新颖性和人类贡献的记录。 | 采用自然语言推理，并非所有结果都经过形式化证明检查；链接公开的是 prompts 与输出，不是完整 agent 实现。 | [Paper](https://arxiv.org/abs/2602.10177) · [Resources](https://github.com/google-deepmind/superhuman/tree/main/aletheia) |
| <a id="work-alphaevolve"></a>**AlphaEvolve**<br>AlphaEvolve: A coding agent for scientific and algorithmic discovery<br>2025 · arXiv / technical report<br>系统 · 预印本 / 报告 | 利用 LLM 候选方案与自动 evaluator 的反馈，演化数学和计算任务中的算法实现。 | 需要可执行的目标与评价过程；给定任务内的已验证改进，不等于自主选题价值的评价。 | [Paper](https://arxiv.org/abs/2506.13131) · [Project](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) |
| <a id="work-funsearch"></a>**FunSearch**<br>Mathematical discoveries from program search with large language models<br>2023 · Nature 2023<br>方法 · 已发表 | 结合 LLM 程序生成、可执行评价与演化搜索，寻找数学构造和算法。 | 目标和 evaluator 由人类提供；公开研究代码不包含语言模型、沙箱和分布式基础设施。 | [Paper](https://www.nature.com/articles/s41586-023-06924-6) · [Code](https://github.com/google-deepmind/funsearch) |

## 从研究经验中学习 · Learning from Experience

<a id="learning"></a>

如何利用研究结果和反馈，改善后续研究以及新任务上的决策？

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-agora"></a>**Agora**<br>Agora: Git as Shared Memory for Collective AutoResearch<br>2026 · arXiv<br>系统 · 预印本 / 报告 | 用 Git 保存假设、结果与核验组成的共享图，使不同会话中的科研智能体能够复用和延续集体研究。 | 权重迁移案例展示了复用与核验；论文指出仍需匹配对照才能确定单位算力的发现收益。共享状态不等于模型训练。 | [Paper](https://arxiv.org/abs/2609.18094) · [Project](https://yifanzhang-pro.github.io/Agora/) |
| <a id="work-evoscientist"></a>**EvoScientist**<br>EvoScientist: Towards Multi-Agent Evolving AI Scientists for End-to-End Scientific Discovery<br>2026 · arXiv<br>系统 · 预印本 / 报告 | 演化管理智能体把已完成的科研轨迹提炼为持久的构思与实验记忆，供研究和工程智能体在后续任务中检索。 | 适应机制是基于记忆的策略复用；构思评分和执行结果不能证明通用科学重要性判断，也不应被描述为基础模型训练。 | [Paper](https://arxiv.org/abs/2603.08127) · [Code](https://github.com/EvoScientist/EvoScientist) |
| <a id="work-hypoforge"></a>**HypoForge**<br>HypoForge: A Self-Improving Multi-Agent Framework for Automated Hypothesis Generation and Testing via Scientific Skill Learning<br>2026 · arXiv<br>方法 · 预印本 / 报告 | 通过比较式批评和执行反馈学习可复用的假设生成与检验技能，并在留出任务上评估改进后的技能，无需微调基础模型。 | 检验通过指标要求参考假设的执行成功且 p &lt; 0.05；这本身不能确立假阳性控制或科学重要性，适应过程也不更新基础模型参数。 | [Paper](https://arxiv.org/abs/2608.25770) |
| <a id="work-agentrxiv"></a>**AgentRxiv**<br>AgentRxiv: Towards Collaborative Autonomous Research<br>2025 · arXiv<br>系统 · 预印本 / 报告 | 科研智能体通过共享报告库检索和发布研究结果，在多轮研究中复用先前的推理与提示方法实验。 | 证据针对给定基准目标上的累积进展；复用报告不等于已经学会科研品味或通用跨领域科研策略。 | [Paper](https://arxiv.org/abs/2503.18102) · [Code](https://github.com/SamuelSchmidgall/AgentLaboratory) · [Project](https://agentrxiv.github.io/) |
| <a id="work-dolphin"></a>**Dolphin**<br>Dolphin: Moving Towards Closed-loop Auto-research through Thinking, Practice, and Feedback<br>2025 · ACL 2025<br>系统 · 已发表 | 连接构思生成、代码实现与实验分析，把上一轮结果反馈给下一轮研究。 | 反馈用于改进给定主题内的搜索；本身不能证明跨任务科研策略学习、模型参数更新或科研品味学习。 | [Paper](https://aclanthology.org/2025.acl-long.1056/) · [Code](https://github.com/InternScience/Dolphin) · [Project](https://alpha-innovator.github.io/Dolphin-project-page/) |
| <a id="work-cycleresearcher"></a>**CycleResearcher**<br>CycleResearcher: Improving Automated Research via Automated Review<br>2024 · ICLR 2025<br>方法 · 已发表 | 以研究生成策略模型和自动审稿模型进行迭代偏好训练，改进研究规划与论文文本生成。 | 主要评估针对生成稿件与审稿分数，其中实验结果由模型生成、未经实际执行；真实执行不属于核心方法，附录另展示了接入外部执行器的案例。 | [Paper](https://arxiv.org/abs/2411.00816) · [Code](https://github.com/zhu-minjun/Researcher) |

### 可迁移的基础方法

这些方法为科研 agent 设计提供基础；原始评价并未直接验证科学发现或 research taste。

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-darwin-godel-machine"></a>**Darwin Gödel Machine**<br>Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents<br>2025 · ICLR 2026<br>基础方法 · 已发表 | 维护不断演化的编程智能体档案，让智能体修改自身代码，并通过编程基准评估产生的新版本。 | 属于智能体层面的自我改进基础方法，验证范围为编程；经验性基准提升既不是自我修改有益性的形式化证明，也不是科研品味的证据。 | [Paper](https://arxiv.org/abs/2505.22954) · [Code](https://github.com/jennyzzt/dgm) |
| <a id="work-adas"></a>**ADAS**<br>Automated Design of Agentic Systems<br>2024 · ICLR 2025<br>基础方法 · 已发表 | 元智能体利用既有设计与评估档案搜索智能体程序，并开展跨任务和基础模型的迁移测试。 | 属于针对给定任务目标改进智能体工作流的基础方法；基准迁移不能证明其能选择重要的科学问题。 | [Paper](https://arxiv.org/abs/2408.08435) · [Code](https://github.com/ShengranHu/ADAS) · [Project](https://www.shengranhu.com/ADAS/) |
| <a id="work-reflexion"></a>**Reflexion**<br>Reflexion: Language Agents with Verbal Reinforcement Learning<br>2023 · NeurIPS 2023<br>基础方法 · 已发表 | 将任务反馈转化为语言反思并存入情景记忆，以指导后续尝试，无需更新模型参数。 | 属于推理时适应的基础方法，评估覆盖决策、编程与推理任务；不能直接证明科学发现或科研品味学习能力。 | [Paper](https://arxiv.org/abs/2303.11366) · [Code](https://github.com/noahshinn/reflexion) |

## 基准与评价 · Benchmarks and Evaluation

<a id="evaluation"></a>

如何分别评价问题价值、发现的可靠性、资源效率与迁移能力？

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-airs-bench"></a>**AIRS-Bench**<br>AIRS-Bench: a Suite of Tasks for Frontier AI Research Science Agents<br>2026 · arXiv<br>基准 · 预印本 / 报告 | 从 ML 论文提取任务，要求智能体在没有基线代码的条件下构建方案，连接想法生成、实验分析和跨领域迭代优化。 | 每个任务仍给定问题、数据集与指标；超过参考分数不等于自主发现研究问题或证明科学意义。 | [Paper](https://arxiv.org/abs/2602.06855) · [Code](https://github.com/facebookresearch/airs-bench) |
| <a id="work-fml-bench"></a>**FML-bench**<br>FML-bench: A Controlled Study of AI Research Agent Strategies from the Perspective of Search Dynamics<br>2026 · arXiv<br>基准 · 预印本 / 报告 | 分离科研搜索策略与共享执行基础设施，并衡量过程行为，支持对探索方式和实验迭代开展受控比较。 | 智能体在固定任务上改进给定基线代码；2026 年 main 版本与 2025 年 legacy 版本不同，不应混用任务与结论。 | [Paper](https://arxiv.org/abs/2605.17373) · [Code](https://github.com/qrzou/FML-bench) |
| <a id="work-mlgym"></a>**MLGym**<br>MLGym: A New Framework and Benchmark for Advancing AI Research Agents<br>2025 · COLM 2025<br>基准 · 已发表 | 覆盖视觉、语言、强化学习与博弈的 Gym 式科研环境，支持智能体评估及科研行为学习算法开发。 | 探索发生在给定任务内；benchmark 分数提高本身不足以证明算法创新或科学判断力的学习。 | [Paper](https://arxiv.org/abs/2502.14499) · [Code](https://github.com/facebookresearch/MLGym) · [Project](https://sites.google.com/view/mlgym) |
| <a id="work-mlr-bench"></a>**MLR-Bench**<br>MLR-Bench: Evaluating AI Agents on Open-Ended Machine Learning Research<br>2025 · NeurIPS 2025 Datasets and Benchmarks<br>基准 · 已发表 | 基于 workshop 主题构建研究任务，通过 MLR-Judge 分阶段评价 idea、proposal、实验和论文，支持超越单一预测指标的科研质量研究。 | 研究主题由环境给定，基于 rubric 的 LLM 评审属于代理评价；科研质量仍需独立核验实验、新颖性与价值。 | [Paper](https://arxiv.org/abs/2505.19955) · [Code](https://github.com/chchenhui/mlrbench) · [Project](https://chchenhui.github.io/mlrbench/) |
| <a id="work-paperbench"></a>**PaperBench**<br>PaperBench: Evaluating AI's Ability to Replicate AI Research<br>2025 · ICML 2025<br>基准 · 已发表 | 通过结合原作者意见的分层评分标准评价 ML 论文复现，覆盖实现、执行和结果匹配，并单独评价自动评审器。 | 复现目标由环境提供；Code-Dev 与完整复现分数的评价范围不同，二者都不衡量原创问题选择。 | [Paper](https://arxiv.org/abs/2504.01848) · [Code](https://github.com/openai/frontier-evals/tree/main/project/paperbench) · [Project](https://openai.com/index/paperbench/) |
| <a id="work-discoverybench"></a>**DiscoveryBench**<br>DiscoveryBench: Towards Data-Driven Discovery with Large Language Models<br>2024 · ICLR 2025<br>基准 · 已发表 | 利用真实及合成发现任务，评价基于数据集的假设搜索与验证，并对发现内容进行分面评分。 | 数据集与发现目标由环境提供，结果与参考假设比较；不评价自主选择不受限研究议程的能力。 | [Paper](https://arxiv.org/abs/2407.01725) · [Code](https://github.com/allenai/discoverybench) |
| <a id="work-discoveryworld"></a>**DiscoveryWorld**<br>DISCOVERYWORLD: A Virtual Environment for Developing and Evaluating Automated Scientific Discovery Agents<br>2024 · NeurIPS 2024 Datasets and Benchmarks<br>基准 · 已发表 | 在模拟环境中评价假设形成、干预、实验和解释的完整循环，同时衡量任务完成与获得的解释性知识。 | 受控模拟便于检查发现行为，但其中的成功不能直接证明向真实科学的迁移或重要问题的自主选择。 | [Paper](https://arxiv.org/abs/2406.06769) · [Code](https://github.com/allenai/discoveryworld) · [Project](https://allenai.github.io/discoveryworld/) |
| <a id="work-frontiermath"></a>**FrontierMath**<br>FrontierMath: A Benchmark for Evaluating Advanced Mathematical Reasoning in AI<br>2024 · arXiv<br>基准 · 预印本 / 报告 | 由专家编写、答案可自动检查的高难度数学问题，为复杂推理与计算探索提供补充测试环境。 | 本条指原始答案检查型 benchmark，不代表形式化证明验证或自主猜想选择；正确性本身不衡量 research taste。 | [Paper](https://arxiv.org/abs/2411.04872) · [Project](https://epoch.ai/frontiermath/tiers-1-4/the-benchmark) |
| <a id="work-mle-bench"></a>**MLE-bench**<br>MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering<br>2024 · ICLR 2025<br>基准 · 已发表 | 通过源自 Kaggle 的任务评价数据处理、模型训练和实验迭代，并提供人类竞赛基线以及资源扩展与污染分析。 | 衡量给定目标下的 ML engineering，不直接衡量 research taste；官方排行榜于 2026 年 4 月暂停接收新提交以改进可比性。 | [Paper](https://arxiv.org/abs/2410.07095) · [Code](https://github.com/openai/mle-bench) · [Project](https://openai.com/index/mle-bench/) |
| <a id="work-re-bench"></a>**RE-Bench**<br>RE-Bench: Evaluating frontier AI R&amp;D capabilities of language model agents against human experts<br>2024 · ICML 2025<br>基准 · 已发表 | 提供科研工程环境及人类专家尝试记录，支持比较智能体表现、搜索策略和增加时间预算带来的收益。 | 适合作为有限 AI R&amp;D 任务的历史参考，不直接评价 research taste；官方任务仓库目前已标记 deprecated。 | [Paper](https://arxiv.org/abs/2411.15114) · [Code](https://github.com/METR/RE-Bench) |
| <a id="work-scienceagentbench"></a>**ScienceAgentBench**<br>ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery<br>2024 · ICLR 2025<br>基准 · 已发表 | 通过来自已发表科学研究且经专家核验的任务，评价生成程序、执行结果及成本，强调科研流程中具体环节的可靠性。 | 评价指定的数据驱动任务，而非无限制的科学发现；应使用 2026 年 4 月发布的 verified split 减少已知评分假阴性。 | [Paper](https://arxiv.org/abs/2410.05080) · [Code](https://github.com/OSU-NLP-Group/ScienceAgentBench) · [Project](https://osu-nlp-group.github.io/ScienceAgentBench/) |
| <a id="work-mlagentbench"></a>**MLAgentBench**<br>MLAgentBench: Evaluating Language Agents on Machine Learning Experimentation<br>2023 · ICML 2024<br>基准 · 已发表 | 较早的可执行科研智能体测试环境，覆盖读写文件、运行实验与改进机器学习模型，适合研究规划及实验轨迹。 | 数据集与研究目标由环境给定；模型改进衡量实验能力，不直接评价自主选择重要科学问题的能力。 | [Paper](https://arxiv.org/abs/2310.03302) · [Code](https://github.com/snap-stanford/MLAgentBench) |

## 完整科研系统 · AI Scientist Systems

<a id="systems"></a>

科研能力如何组合成系统？哪些决策仍由人类提供？

| 工作 / 来源 | 与本方向的关系 | 证据边界 | 链接 |
| --- | --- | --- | --- |
| <a id="work-co-scientist"></a>**Co-Scientist**<br>Accelerating scientific discovery with Co-Scientist<br>2025 · Nature 2026<br>系统 · 已发表 | 围绕科学家给定的目标生成、批评、排序和演化假设，并在生物医学案例中开展后续实验验证。 | 假设演化使用 test-time computation；流程仍包含人工目标与实验室验证，尚未确立跨项目的 taste 学习。 | [Paper](https://www.nature.com/articles/s41586-026-10644-y) |
| <a id="work-agent-laboratory"></a>**Agent Laboratory**<br>Agent Laboratory: Using LLM Agents as Research Assistants<br>2025 · Findings of EMNLP 2025<br>系统 · 已发表 | 提供从人工研究 idea 到文献综述、实验和报告的可检查流程，并支持各阶段的人类反馈。 | 从人类提供的 idea 出发，主要验证科研协作与执行，不直接验证自主选择有价值问题的能力。 | [Paper](https://aclanthology.org/2025.findings-emnlp.320/) · [Code](https://github.com/SamuelSchmidgall/AgentLaboratory) · [Project](https://agentlaboratory.github.io/) |
| <a id="work-ai-researcher"></a>**AI-Researcher / Scientist-Bench**<br>AI-Researcher: Autonomous Scientific Innovation<br>2025 · NeurIPS 2025<br>系统 · 已发表 | 整合文献依据、假设生成、实现与报告；Scientist-Bench 区分引导式创新和研究主题内的探索。 | 实现成功率与论文质量评分，需要与独立复现的发现、开放式研究议题选择区分。 | [Paper](https://arxiv.org/abs/2505.18705) · [Code](https://github.com/HKUDS/AI-Researcher) |
| <a id="work-kosmos"></a>**Kosmos**<br>Kosmos: An AI Scientist for Autonomous Discovery<br>2025 · arXiv<br>系统 · 预印本 / 报告 | 通过结构化 world model 连接文献搜索、假设生成与数据分析，支持更长程的研究。 | 从给定目标与数据集出发；可追溯的报告仍可能包含错误，或统计显著但科学意义有限的结果。 | [Paper](https://arxiv.org/abs/2511.02824) · [Project](https://edisonscientific.com/news/announcing-kosmos) |
| <a id="work-ai-scientist-v2"></a>**The AI Scientist-v2**<br>The AI Scientist-v2: Workshop-Level Automated Scientific Discovery via Agentic Tree Search<br>2025 · arXiv<br>系统 · 预印本 / 报告 | 通过实验管理 agent 与 agentic tree search 探索假设、运行 ML 实验，解除 v1 对人工代码模板的依赖。 | 论文报告的是有限的 workshop 投稿案例；录用是一种评价信号，不代表已验证通用 research taste。 | [Paper](https://arxiv.org/abs/2504.08066) · [Code](https://github.com/SakanaAI/AI-Scientist-v2) |
| <a id="work-ai-scientist"></a>**The AI Scientist**<br>The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery<br>2024 · arXiv<br>系统 · 预印本 / 报告 | 把 idea 生成、编码、实验、报告和自动评审连接为可检查的 ML 科研流程。 | 原始实验依赖人工编写的代码模板；自动评审分数不能确立独立的科学价值。 | [Paper](https://arxiv.org/abs/2408.06292) · [Code](https://github.com/SakanaAI/AI-Scientist) |

**版本说明：** The AI Scientist v1 与 v2 作为不同实现报告分别保留。后续期刊整合版为 [Towards end-to-end automation of AI research](https://www.nature.com/articles/s41586-026-10265-5)，Nature 2026；这里作为后续版本链接，不额外计为独立系统。

## 值得探索的研究方向

以下是**根据已收录工作形成的编者研究设想**，不是已确立的结论，也不表示这些问题尚无人探索。

1. **从真实研究结果中学习 taste。** 将引用量或评审奖励与实际调查结果的反馈进行对照，并包含有信息价值的负结果；检验学到的偏好能否迁移到新主题。可以从 [AI Can Learn Scientific Taste](#work-ai-can-learn-scientific-taste)、[TasteVal](#work-tasteval) 和 [The Ideation-Execution Gap](#work-ideation-execution-gap) 入手。
2. **连接问题提出与实际执行。** 提出问题时，同时给出成本最低、能够区分假设的实验和明确的失败判据；共同评价提案质量及执行后获得的认识。可以从 [ResearchAgent](#work-researchagent)、[The Ideation-Execution Gap](#work-ideation-execution-gap) 和 [MLR-Bench](#work-mlr-bench) 入手。
3. **学习能够迁移的科研策略。** 在相近预算和留出任务上，比较情景记忆、可复用技能、agent 程序搜索和参数更新；观察哪些经验能在数据、模型或研究主题变化后继续发挥作用。可以从 [EvoScientist](#work-evoscientist)、[HypoForge](#work-hypoforge)、[ADAS](#work-adas) 和 [FML-bench](#work-fml-bench) 入手。
4. **减少风格偏好与信息泄漏对科研判断评价的影响。** 结合盲评专家意见、可复现实验、显式 novelty 检查和知识截止时间记录；检查无关措辞变化是否改变排序，以及系统是否偏好容易验证但价值有限的问题。可以从 [SciStyleBench](#work-scistylebench)、[RINoBench](#work-rinobench) 和 [HindSight](#work-hindsight) 入手。
5. **评价获得的信息，包括失败的价值。** 研究 agent 能否选择区分假设的实验、校准不确定性并停止无效方向；分别记录留出集预测性能与解释性知识。可以从 [DiscoveryWorld](#work-discoveryworld)、[DiscoveryBench](#work-discoverybench) 和 [Arbor](#work-arbor) 入手。

## 实验场景的选择

| 场景 | 能提供的证据 | 仍需补充的评价 |
| --- | --- | --- |
| ML 工程与优化：MLE-bench、MLGym、AIRS-Bench、autoresearch | 可执行迭代、资源使用、留出集性能 | 所选研究问题的原创性与重要性 |
| 论文复现：PaperBench | 实现是否忠实、能否执行、是否复现报告中的发现 | 新问题生成与原创贡献 |
| 提案与主题内研究：MLR-Bench、Scientist-Bench | 构思、研究计划、执行和报告质量 | 独立的新颖性与有效性检查，以及基于 rubric 的评审校准 |
| 实验决策：TasteVal、FML-bench、DiscoveryWorld | 研究行动选择、过程效率、假设检验 | 向开放科研场景的迁移，以及原始研究议题的价值 |
| 数学：FunSearch、AlphaEvolve、Aletheia、FrontierMath | 算法构造、推理，以及相应任务提供的可检查答案或证明 | 新颖性、数学意义，以及验证属于数值、人类还是形式化检查 |

比较方法时，固定模型访问权限、数据划分、工具和计算预算。分别报告人类提供什么、agent 决定什么、结论如何验证，以及研究过程之间保留了什么经验。不能仅凭 benchmark 名称判断它测量的能力；请查看各条目的证据边界和最新官方文档。

## 综述与社区

- [AutoResearch AI: Towards AI-Powered Research Automation for Scientific Discovery](https://arxiv.org/abs/2605.23204)：科研流程层面的综述与术语参考。
- [AI for Meta-Science](https://ai4metascience.org/)：科研评价、可复现性与科学活动的组织。
- [AI for Science community](https://ai4sciencecommunity.github.io/)：科学发现、AI scientists 及相关 workshops。

## 贡献与维护

收录范围、证据要求和双语更新方法见 [CONTRIBUTING.md](CONTRIBUTING.md)。原始记录位于 [data/](data/)，包含准确标题、证据链接和逐条核查日期。

两个 README 使用同一份目录数据生成。需要 Node.js 18 或更高版本：

```sh
node scripts/build.mjs
node scripts/build.mjs --check
git diff --check
```

检查涵盖元数据、重复项、双语覆盖、生成文件同步以及本地链接和锚点。外部来源核实属于编辑工作；离线检查不会声称所有远程 URL 此刻都可访问。

仓库原创内容采用 [MIT License](LICENSE)。链接的论文、代码和其他资源保留各自的许可证。
