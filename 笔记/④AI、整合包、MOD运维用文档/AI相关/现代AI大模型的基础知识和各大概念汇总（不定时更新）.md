当前 AI 体系的主流定义，可以直接给你一套**清晰的从属 / 层级关系**：

# 一、整体层级（从底层 → 上层）

1. **LLM / Transformer**（基座模型）
2. **Function Call / MCP**（模型调用外部能力）
3. **Agent**（智能体，核心主体）
4. **Skill**（Agent 拥有的 “技能”）
5. **Harness Engineering**（管控 Agent 执行的框架）

---

# 二、从属关系一句话总结

- **Skill 从属于 Agent**
    
    一个 Agent 可以拥有多个 Skill。
- **Harness 管理 / 约束 Agent**
    
    Harness 不属于 Agent，而是**控制 Agent 运行环境与执行流程**的上层机制。
- **MCP / Function Call 是 Skill 的实现基础**
    
    Skill 本质就是封装好的 Function Call / MCP 能力。

---

# 三、详细关系拆解

## 1. Agent（智能体）

- 是**主体**，有目标、有记忆、能规划、能行动。
- 相当于 “人”。

## 2. Skill（技能）

- 是 Agent 可以**调用的标准化能力单元**。
- 比如：查天气、写代码、读文件、数据分析。
- **从属关系：Skill ⊂ Agent**
    
    → Agent 装备 Skill，Skill 不能脱离 Agent 单独存在。

## 3. Harness / Harness Engineering

- 是**Agent 的执行环境与管控系统**。
- 负责：
    
    - 给 Agent 分配任务
    - 限制权限
    - 管理上下文
    - 防止失控、幻觉、错误调用
    - 协调多个 Agent
    
- **从属关系：Harness ⊃ Agent**
    
    → Harness 管 Agent，而不是 Agent 的一部分。

## 4. MCP / Function Call

- 是让 LLM 调用外部工具的**协议 / 机制**。
- Skill 就是对 Function Call/MCP 的**高级封装**。
- **从属关系：FunctionCall/MCP → 支撑 → Skill**

---

# 四、最直观类比（用人来比喻）

- **LLM = 大脑**
- **Agent = 人**
- **Skill = 人的技能（做饭、开车、编程）**
- **Harness = 规则、制度、工作流程、安全规范**

从属关系：

> **Harness 管理 Agent，Agent 拥有 Skill。**