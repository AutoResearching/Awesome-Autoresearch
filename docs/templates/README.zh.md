<!-- 由 scripts/build.mjs 根据本模板及 data/*.json 生成。 -->
# Awesome Autoresearch: Learning to Do Research

[English](README.md) | [简体中文](README.zh-CN.md)

围绕 **科研品味（research taste）、问题提出（question formulation）、科学推理（scientific reasoning）以及从研究经验中学习（learning from research experience）** 的论文、系统与基准精选。

AI 如何识别值得研究的未知，提出有意义的问题，开展严谨调查，并通过研究经验成为更好的研究者？

**{{COUNT}} 项精选工作 · {{PAPER_COUNT}} 条论文记录 · {{CODE_COUNT}} 个已核实官方代码链接**

来源核查日期：**{{REVIEW_RANGE}}**。这是有选择的入门资料库，不是穷尽式综述或性能排行榜。

## 范围

本仓库的研究对象是做研究的过程本身。**AI research 是主要实验场景，mathematics 是补充 testbed。** 其他学科的工作，如果提出可复用的发现方法、科研能力或评价协议，也可以收录。

这里采用广义的 **autoresearch**，包含 human–AI collaboration 和自主科研系统。单项方法无需自动化完整科研流程；这个名称也不限于 Karpathy 的同名项目，后者作为一种具体执行循环收录。

重点是问题的选择与调查、科学证据，以及科研决策的改进。通用写作助手、文献搜索产品、agent 框架和领域预测模型，只有在对这些问题提供明确方法贡献时才收录。同行评审与 meta-science 中涉及科研判断和可靠评价的工作同样相关。

## 研究地图

前四个方向描述科研能力，评价贯穿其中；完整系统提供额外的实现视角。每项工作只放在一个主要位置，跨方向关系通过阅读路线与链接表达。

{{MAP}}

## 建议阅读路线

这些路线强调证据与机制的互补性，属于编者建议，不代表某个系统性能最好。

{{STARTER}}

了解完整实现，可以继续读 [The AI Scientist-v2](#work-ai-scientist-v2) 或 [AI-Researcher](#work-ai-researcher)。关注数学发现，可以对照 [FunSearch](#work-funsearch)、[AlphaEvolve](#work-alphaevolve) 和 [Aletheia](#work-aletheia)。

## 如何阅读条目

- **年份**指所引工作首次公开的年份，venue 可能是后续发表年份。来源标签描述所引版本；标为 arXiv 不代表不存在后续正式发表版本。
- **Paper / Code / Project / Resources** 指向原始来源。没有 Code 链接，表示本轮未核实官方实现；项目网页、prompts 和输出记录不自动等同于完整代码发布。
- **基础方法（Foundation）** 表示具有可迁移价值，但原始实验没有直接验证科学发现或 research taste。
- **来源已核实**指已根据原始材料检查元数据及所述范围，不代表我们重跑了实验或独立确认了作者的科学主张。
- 请同时阅读证据边界：提案评分、可执行实验、复现结果与科学重要性，分别测量不同的能力。

{{CATALOG}}

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
