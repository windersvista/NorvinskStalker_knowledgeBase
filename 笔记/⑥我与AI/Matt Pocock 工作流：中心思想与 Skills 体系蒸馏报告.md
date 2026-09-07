# Matt Pocock 工作流：中心思想与 Skills 体系蒸馏报告

> 本报告基于 Matt Pocock 两个视频的逐字稿（见 `docs/transcripts/`）提炼而成，并交叉核对了本仓库 `mattpocock/skills` 的 25 个 SKILL.md 与 README。
>
> 素材：
> - 演讲《AI 时代，软件基本功反而更重要 | AI Engineer Europe》（`speech-software-fundamentals.*.md`）
> - 教程《十分钟讲完 25 个 Skills | mattpocock/skills v1.2.3》（`25-skills-overview.*.md`）
>
> 一句话概括：**在 AI 时代，软件基本功不是过时了，而是第一次变得真正值钱——因为 AI 是一台"好的代码库放大器"，也是一台"坏代码库放大器"。**

---

## 一、中心思想

### 1.1 核心论点：代码不便宜，坏代码的代价史上最高

Matt 开场就直接反驳了 AI 圈两个流行口号：

- **"spec-to-code"**：写规格书 → AI 生成代码 → 出问题就回改 spec、重跑"编译器"。他的亲身复盘是——每重跑一轮，代码就变差一档，反复几次只剩一坨垃圾。他给它定性：**这不叫新范式，这是"vibe coding 换了个名字"**（"letting the code manage itself is just vibe coding by another name"）。
- **"code is cheap"**：他反驳说代码一点都不便宜。**坏代码的代价从来没有今天这么高**——因为代码库一旦难改，你就接不住 AI 能带来的全部红利。AI 在好代码库里表现极好，在坏代码库里只会加速腐烂。

因此结论：**好代码库比以前更重要 → 软件基本功比以前更重要。** 这就是整场演讲的论点。

他给出的"好坏"定义来自 John Ousterhout《软件设计的哲学》：

> 复杂度 = 软件系统结构中任何让你难以理解、难以修改的东西。坏代码库 = 一改就出 bug 的代码库；好代码库 = 改起来很轻松的代码库。

### 1.2 四个失效模式 → 四条"回到老书"的解法

Matt 的方法论不是发明新概念，而是**把 AI 编程的常见翻车场景，逐一映射回经典软件工程原则**，再固化成 skill：

| 失效模式 | 老书/原则 | 解法 skill |
|---------|-----------|-----------|
| 1. AI 做出来的不是我要的 | 《程序员修炼之道》"没有人确切知道自己想要什么"；Brooks《The Design of Design》"设计概念 (design concept)" | `grill-me` / `grill-with-docs`（盘问式对齐） |
| 2. AI 话太多、鸡同鸭讲 | Eric Evans《领域驱动设计》"统一语言 (ubiquitous language)" | `domain-modeling` + `CONTEXT.md` 术语表 |
| 3. 代码跑不起来 | 《程序员修炼之道》"反馈的速度就是你的限速" / "开得比车灯还远 (outrunning your headlights)" | `tdd`（逼 LLM 小步走） |
| 4. 代码变成一坨泥球 | Ousterhout "深模块"；Kent Beck "每天都对系统设计投资" | `improve-codebase-architecture` + `codebase-design` |

四个症结层层递进：**先对齐 → 再统一语言 → 再建立反馈回路 → 最后救架构**。

### 1.3 几个关键洞见（贯穿全局）

1. **"设计概念"是那个不可言说的东西**。它不是你塞进 Markdown 里的资产，而是你们之间"我们在造什么"的隐形共识。`grill-me` 之所以两行字就爆火（几十到上百个问题），就是因为它把 AI 变成对手，逼出这个共享概念——比默认的 plan mode 更早、更诚实地对齐。

2. **反馈的速度就是你的限速**。LLM 天然喜欢"一次写一大堆再回头检查"，这正是资深工程师不会犯的错。TDD 的价值不在"测试"，而在**强制小步**：红 → 绿 → 重构。

3. **深模块 vs 浅模块**。AI 特别擅长造出"浅模块满地、布局混乱"的代码库，而那种代码库恰恰是 AI 自己最难探索的。反过来，**少量大模块 + 简单接口**（深模块）既让 AI 好探索，又天然可测试。

4. **灰盒法 (gray box) 救人脑子**。深模块让你可以"只设计接口、下放实现"——对应用里不那么关键的部分，你只需从接口外测试验证，把内部实现整个交给 AI。这解决了"AI 产出太快、你的脑子跟不上"的疲劳问题。

5. **收束：分工定位**。AI 是"地面上的战术型程序员/军士"，你是"战略层"。而战略层需要的那套软件基本功，我们已经用了 20 年。

---

## 二、25 个 Skills 全景：各自的作用

> 25 个技能不是平铺清单，而是一条流程链 + 一圈支撑。以下按功能分层（交叉核对仓库 SKILL.md 与视频讲解）。

### 2.1 底层参考技能（被其他技能反复调用的"原语"）

这三个是"单一事实来源"，被多个上层技能拉进来用：

| 技能 | 作用 |
|------|------|
| `grilling` | **盘问原语**：设计树 / 轮次 / 前沿，把"收集事实"交给 agent、把"做决定"留给用户。是 grill-me、grill-with-docs、triage、wayfinder、improve-codebase-architecture 的共同引擎 |
| `domain-modeling` | **领域建模**：挑战模糊术语、记录 ADR、更新 `CONTEXT.md`。用在你需要"改变"领域模型时，而非仅仅读词汇 |
| `codebase-design` | **深模块词汇表**：模块 / 接口 / 深度 / 接缝 / 适配器 / 杠杆 / 局部性等设计语汇。设计一个模块"长什么样"时查阅 |

### 2.2 主流程技能（"想法 → 交付"的主干道）

| 技能 | 作用 | 触发时机 |
|------|------|---------|
| `grill-with-docs` | 盘问式对齐 + 顺手产出术语表与 ADR 文档 | 在有工作目录时，任何改动开工前 |
| `to-spec` | 把对话整理成**规格书**，落到 issue tracker | 想法已定，需要一个可施工的目的地 |
| `to-tickets` | 把 spec 拆成**追踪子弹式工单**，每条声明阻塞边 | 工作跨多会话、需要拆分派发 |
| `implement` | 实现 spec/ticket 描述的活儿 | 真正动手写代码时（极小的 skill，一句话） |
| `tdd` | 红-绿-重构循环 + 好测试/坏测试指南 | 被 implement 驱动 |
| `code-review` | **双轴评审**：规范轴（仓库编码标准 + Fowler 坏味道基线）＋ spec 轴（是否忠实实现原始 issue/spec），并行子代理互不污染 | implement/tdd 收尾前 |

### 2.3 规划与塑形技能（超大工程的"找路"）

| 技能 | 作用 |
|------|------|
| `wayfinder` | 把"超过一个会话装不下"的巨型工作画成**决策工单地图**，一次解决一张，直到路径清晰 |
| `prototype` | 造一次性原型回答一个设计问题（状态/逻辑手感，或 UI 长什么样） |
| `research` | 起后台代理去查**一手来源**，沉淀成带引用的 Markdown |

> 关系：wayfinder 负责"规划"的跨窗口编排（正如 to-spec/to-tickets 负责"实现"的跨窗口编排），过程中会派 prototype（定不下来就做原型）和 research（要查资料就查）。

### 2.4 保养技能（维护、诊断、修复）

| 技能 | 作用 |
|------|------|
| `setup-matt-pocock-skills` | **一次性仓库配置**：issue tracker、triage 标签、领域文档布局。用其他工程技能前先跑一次 |
| `diagnosing-bugs` | 疑难 bug / 性能回退的**六阶段纪律**：搭红色反馈回路 → 复现/最小化 → 假设 → 插桩 → 修复 + 回归测试 → 清理 |
| `resolving-merge-conflicts` | 逐 hunk 化解合并/变基冲突，追 `git blame` 到每处改动的原始意图（**切斯特顿栅栏原则**：不知道栅栏为何立着就别拆），永不 `--abort` |
| `improve-codebase-architecture` | 扫描代码库找**"深化"机会**，产出可视化 HTML 报告，再对你选的那一个盘问到底 |
| `triage` | 把 issue/PR 走分诊角色状态机（needs-triage / info / ready-for-agent / ready-for-human / wontfix），为 agent 写简报 |

### 2.5 元技能（关于这套系统本身的技能）

| 技能 | 作用 |
|------|------|
| `ask-matt` | **路由器**：回答"我当前处境该用哪个技能/哪条流程" |
| `writing-for-agents` | **写技能的技能**：编写 skills、AGENTS.md/CLAUDE.md 等 agent 视角文档的参考 |

### 2.6 独立辅助技能（挂在主流程之外，按需取用）

| 技能 | 作用 |
|------|------|
| `grill-me` | 无文档的**纯盘问**（grill-with-docs 的 stateless 版，非代码场景用） |
| `handoff` | 把会话压成交接文档，交给另一个 agent |
| `to-questionnaire` | 把"你一个人答不了的决策"转成问卷，交给那个能答的人，异步/开会填完再喂回 agent |
| `teach` | 生成 HTML 课程教你任何东西，拿当前目录当有状态教学工作区——上手陌生代码库一绝 |
| `wait-what` | **"停，没说到点上"**：让模型用 `CONTEXT.md` 的词汇、更干净地重讲一遍（治啰嗦） |
| `wizard` | 生成交互式 bash 向导，带人完成"只有人能做"的步骤（配 AWS、API key、第三方后台） |

---

## 三、如何联系与贯通

### 3.1 贯穿一切的心智模型：上下文"聪明区"

Matt 反复强调一个他自己观察出来的工作指标——**"聪明区 (smart zone)"约 150K token**：

- 会话早期 agent 敏锐专注，拉长后滑进"迟钝区 (dumb zone)"，马虎健忘、错误变多。
- 于是所有技能的编排，本质都是围绕**"如何把工作塞进聪明区 / 拆出聪明区"**设计的：
  - 任务能塞进一个窗口 → `grill-with-docs` → `implement`，一条龙。
  - 任务超过 150K → 先 `to-spec` 出规格书（目的地）→ `to-tickets` 拆工单（分给多个 agent，每个 agent 一个工单一个窗口）。
  - 任务大到连规划都装不下 → `wayfinder` 决策工单地图，跨会话逐个决策，闭环后再回 `to-spec`。

### 3.2 主流程链（对齐 → 规格 → 工单 → 实现 → 评审）

```
grill-with-docs ──(对齐 + 术语表 + ADR)
      │
      ├─ 小任务(单窗口): 直接 ──► implement ──► tdd ──► code-review
      │
      └─ 大任务(跨窗口): to-spec ──► to-tickets ──► (每个工单) implement ──► tdd ──► code-review

超大规划: wayfinder ──► (prototype / research / grilling 决策) ──► 全部决策闭环 ──► to-spec ──► to-tickets ──► ...
```

### 3.3 引用关系图（skill → 调用的 skill）

```
grill-with-docs ─► grilling, domain-modeling
grill-me        ─► grilling
implement       ─► tdd, code-review
tdd             ─► codebase-design, code-review
code-review     ─► setup-matt-pocock-skills
to-spec         ─► setup-matt-pocock-skills
to-tickets      ─► setup-matt-pocock-skills
wayfinder       ─► grilling, domain-modeling, research, prototype, setup-matt-pocock-skills
triage          ─► grilling, domain-modeling, setup-matt-pocock-skills
diagnosing-bugs ─► improve-codebase-architecture
improve-codebase-architecture ─► codebase-design, grilling, domain-modeling
ask-matt        ─► (几乎全部技能，作为路由器)
```

**叶子原语**（不被别的技能反向依赖、可独立使用）：`grilling`、`domain-modeling`、`codebase-design`、`prototype`、`research`、`wizard`、`handoff`、`teach`、`wait-what`、`to-questionnaire`、`resolving-merge-conflicts`。

### 3.4 两条贯穿的"隐性主线"

1. **统一语言（共享词汇）贯穿始终**。`grill-with-docs` 建术语表和 ADR → `domain-modeling` 维护 `CONTEXT.md` → `wait-what` 用这套词汇重讲 → 规划/PRD 里点名要改哪些模块、哪些接口。词汇一旦对齐，AI 思考更简洁、命名更一致、实现更贴合规划。

2. **深模块（模块地图）贯穿始终**。`codebase-design` 提供词汇 → `improve-codebase-architecture` 找深化机会 → `to-spec` 逼你在 spec 里写清楚动哪些模块 → `tdd` 在接缝处测试接口。模块地图本身也成了统一语言的一部分。

### 3.5 一句贯通总结

> **先盘问对齐（共享设计概念）→ 建统一语言（共享词汇）→ 用 TDD 建立反馈回路（限速内小步走）→ 用深模块设计让代码库可改可测（灰盒下放实现）——而这一切的分工定位是：AI 是战术执行者，你才是每天对系统设计做投资的战略层。**

---

## 四、附：素材与方法说明

- 逐字稿由 faster-whisper（medium，CPU int8）对视频音频自动转写，共 4 份（两个视频 × 英文原声 / 中文配音），含时间戳，见 `docs/transcripts/`。
- 因 B 站正片字幕为烧录画面、AI 字幕需登录，本报告采用音频 ASR 方案；专有名词/人名/书名可能有个别转写误差（如 "Ousterhout" 被转成 "Alsterhout"、"Kent Beck" 被转成 "Cantback"、"ubiquitous" 被转成 "everywhere" 等），已在正文中按正确写法还原。
- 技能清单与引用关系以本仓库 `skills/**/SKILL.md` 与 `README.md` 为准，视频讲解为辅。
