# friendlyPMC v4.5.0 - Bot 队友系统 功能解析

> SPT 3.11.4 兼容 | 作者: Pit Alex | 分析版本: 2026-06-05

---

## 一、MOD 概述

friendlyPMC 是一个双端 MOD（客户端 BepInEx + 服务端 TypeScript），为 SPT 提供完整的 **PMC Bot 队友系统**。玩家可以创建自定义 PMC 队友、带他们进 Raid、通过语音/快捷指令下达战术命令、管理队友装备，并与 Goon 小队（Knight / BigPipe / BirdEye）互动。

### 核心依赖
| 依赖 | 说明 |
|------|------|
| Fika | 多人联机框架（MOD 专为 Fika 优化） |
| BigBrain | Bot AI 扩展框架（可选，用于 AI 行为增强） |
| SAIN | 智能 AI 模组（可选，friendlyPMC 有兼容补丁） |
| Waypoints | 导航点扩展（推荐，提升 Bot 寻路能力） |
| Virtual's Custom Quest Loader | 自定义任务加载器（必选，Knight 任务线依赖） |

---

## 二、功能清单

### 2.1 Follower 小队系统

| 功能 | 说明 |
|------|------|
| **创建队友** | 通过 Messenger 中的 SquadManager 对话输入 `/add <昵称>` 创建自定义 PMC 队友 |
| **自动入队** | `/autojoin <昵称> on` 设置队友在每次 Raid 自动加入队伍 |
| **队友上限** | 无硬编码限制（取决于服务器性能） |
| **队友重命名** | `/rename <旧昵称> <新昵称>` |
| **删除队友** | `/delete <昵称>` 移除队友及其档案 |
| **查看信息** | `/info <昵称>` 查询队友等级/技能/战术/经验 |

### 2.2 战术指令系统

| 类别 | 指令 | 触发方式 |
|------|------|----------|
| **跟随** | FollowMe | F1 短语 "Follow Me" |
| **固守** | HoldPosition / Stop | F2 短语 "Hold Position" / "Stop" |
| **掩护** | GetInCover / CoverMe / NeedCover / TakeCover | F3 短语系列 |
| **集结** | Regroup / NeedHelp | F4/F5 短语 |
| **搜刮** | GoLoot / LootGeneric / LootWeapon / LootMoney / LootKey / LootBody / LootContainer | F6 系列 |
| **注意** | Look | F7 "Look" |
| **传送** | 可配置热键 | Follower 传送到玩家身边 |
| **治疗** | 可配置热键 (默认 F10) | 强制 Follower 全额恢复生命 |

### 2.2.1 手势指挥 (v4.5.0 增强)

除 F6 语音短语外，Follower 也可通过**手势** (F1-F10 直按或手势轮盘 ENEMY 组) 进行指挥：

| 手势 | 触发方式 | 效果 |
|------|---------|------|
| Point (F1) | 指向 Follower | 移动到玩家位置 |
| Stop (F2) | 停止手势 | Follower 固守当前位置 |
| Come Here (F7) | 召唤手势 | Follower 移动到玩家瞄准点 |
| Over There (手势轮盘ENEMY组) | 指向敌人方向 | Follower 报告敌情 |

手势指挥**不会被附近敌对 AI 听到**，适合隐蔽操作。

### 2.3 战术类型

每个 Follower 可设置 5 种战术角色：

| 战术 | 英文 | 行为描述 |
|------|------|----------|
| **默认** | Default | 根据战况自动选择最佳行为 |
| **守卫** | Guard | 持掩护位置，压制火力支援，专注射击 |
| **神射手** | Marksman | 远程狙击，优先高价值目标，自动寻找高地 |
| **突击手** | Pusher | 近身突击敌人，激进推进，高机动性 |
| **固守者** | Holder | 坚守当前位置，防御性射击，不主动出击 |

> **v4.5.0 增强:** Pusher 战术现在会主动识别敌人重伤时机进行冲锋。Follower 在丢失敌人后会进入搜索状态（移动→暂停→前进），而非站桩。

### 2.4 装备系统

| 功能 | 说明 |
|------|------|
| **默认装备** | 根据玩家等级自动生成匹配装备 |
| **玩家 Build 切换** | `/equip <昵称> <Build名称>` 从玩家的装备预设中选择 |
| **装备冻结** | `/staticdefault <昵称> on` 锁定当前装备，不再自动替换 |
| **物品归还** | Raid 结束后 Follower 拾取的非战利品自动归还到信箱 |
| **限制模式** | `/restrictions on` 开启装备限制，Follower 只能使用玩家仓库中拥有的物品 |

### 2.5 招募系统

| 功能 | 说明 |
|------|------|
| **战中招募** | Raid 中遇到同阵营 PMC 时，可招募到小队 |
| **信箱确认** | 新招募候选人通过信箱好友请求确认 |
| **招募概率** | 基于等级差：同等级 100%，高10级 0% |
| **招募开关** | `/recruit on/off` 开启/关闭招募功能 |

### 2.6 Scav 小队

| 功能 | 说明 |
|------|------|
| **启用** | `/scavsquad on` 允许 Scav Raid 时也带队友 |
| **人数** | `/scavsquadsize <数字>` 设置 Scav 小队人数（1-10） |

### 2.7 Goon 小队整合

| 角色 | 说明 | 解锁条件 |
|------|------|----------|
| **Knight** | Goon 小队队长，突击型 Boss | 完成 Knight 专属任务线 |
| **BigPipe** | Goon 小队爆破手，范围压制 | Knight 好感度 >= 0.5 + 专属任务 |
| **BirdEye** | Goon 小队狙击手，远程侦察 | Knight 好感度 >= 0.5 + 专属任务 |

**Boss 专属：** Goon 成员拥有独立的战斗 AI（`KnightFightLayer`、`BigPipeArtilleryLayer`、`BirdEyeFightLayer`），区别于普通 Follower。

### 2.8 商人系统

| 商人 | ID | 说明 |
|------|-----|------|
| **Knight** | `67768b19fa281ca31708b187` | Goon 武器商店，16把定制武器 |

**武器列表：** AK-103, Breacher, Colt M45A1, Glock, HK USP 45, M4A1, MCX, MDR Tan, MK-47, MP-153, MP-155, MP7A1, Remington, SCAR-556, SCAR-751, Spear

### 2.9 友善 PMC 系统

| 设置 | 说明 |
|------|------|
| **Friendly PMC** | 将同阵营 AI PMC 设为友好（不攻击） |
| **Bad Guy** | 反转——敌对同阵营，友对不同阵营 |
| **PMC 臂章** | 在 PMC 上强制佩戴臂章用于识别（USEC=蓝，BEAR=红） |
| **English BEAR** | 强制 BEAR 使用英语语音 |

### 2.10 HUD 与交互

| 功能 | 说明 |
|------|------|
| **队友标记** | 可配置热键在 HUD 上标记所有队友位置 |
| **敌人标记** | 可配置热键标记可视敌人（Follower 也会响应） |
| **状态音效** | Follower 状态变化时播放无线电音效 |
| **无线电聊天** | Follower 通过 Messenger 发送状态消息 |
| **档案查看** | 通过好友列表查看 Follower 完整装备和技能 |
| **装备拖放** | 在档案界面直接管理 Follower 背包/装备 |

---

## 三、技术架构

### 3.1 系统层次

```
+--------------------------------------------------+
|                  用户交互层                        |
|  短语命令 | 热键 | Messenger 聊天 | 好友列表 UI    |
+--------------------------------------------------+
|                  服务端 (TypeScript)               |
|  Squad.ts | SquadChat.ts | Quests.ts | Trader.ts |
|  HTTP 路由 20+ | Bot 档案存储 | 任务系统 | 商人   |
+--------------------------------------------------+
|                  客户端 (C# / BepInEx)             |
|  friendlyPMC.cs (入口) | 60+ Harmony Patches      |
|  +------------------------------------------------+
|  | AI 层 (Layers/)      | 行为 (Actions/)        |
|  | FollowerFightLayer   | FollowerPatrol         |
|  | FollowerCommonLayer  | FollowerDogFight       |
|  | KnightFightLayer     | FollowerGoToEnemy      |
|  | BirdEyeFightLayer    | FollowerSniperSearch   |
|  | Guard/Pusher/Sniper  | FollowerTakeLoot       |
|  +------------------------------------------------+
|  | 运行时模块 (Modules/) | 组件 (Components/)     |
|  | BossPlayers          | BotFollowerPlayer      |
|  | InteractableObjects  | FollowerAIAgent        |
|  | Receivers            | FollowerCombatManager  |
|  | NpcMessage           | AIBossPlayerLogic      |
|  +------------------------------------------------+
|  | 数据工具 (Utils/)    | 补丁 (Patches/)        |
|  | SpawnHelper          | SAIN/Donuts/Questing   |
|  | PingTeamates         | Fika 兼容 10+ 补丁    |
|  | BotData / Covers     | UI 补丁 10+           |
+--------------------------------------------------+
```

### 3.2 双端通信

```
客户端 C#                        服务端 TypeScript
    |                                    |
    |-- /client/raid/pitconfig -------->|  配置同步
    |-- /singleplayer/pitlang -------->|  语言数据
    |-- /client/game/bot/followergenerate ->|  Bot 生成
    |-- /client/game/bot/followerprogress ->|  经验上报
    |-- /singleplayer/returnitems ---->|  物品归还
    |-- /singleplayer/teamescaped ---->|  撤离通知
    |-- /client/game/bot/recruit ----->|  招募请求
    |<------- JSON Response ----------|  数据响应
```

### 3.3 队友生成流程

```
1. 玩家触发 Raid 开始
2. MainMenuControllerPatch 清空队伍（移除所有非玩家成员）
3. BotsControllerPatch 拦截 BotController.AddActivePlayer
4. 初始化全局单例（BossPlayers, Receivers, NpcMessage, InteractableObjects, PingTeamates）
5. CreateProfilesJob 异步取所有 Follower 档案（/client/game/bot/followergenerate）
6. FetchMemberProfile 逐成员获取完整 Bot Profile
7. SpawnGroupBots 生成所有 Follower Bot 实例
8. 注册阵营关系（BotsGroupPlayer 配置敌我识别）
9. 激活 FollowerBrain 并设置战术
```

### 3.4 Follower 状态机

```
           +-----------+
           | IDLE/跟随  |
           +-----+-----+
                 |
     +-----------+-----------+
     |           |           |
+----v----+ +---v----+ +---v-----+
| 战斗中   | | 搜刮中 | | 治疗中   |
| Fight   | | Loot   | | Heal    |
+----+----+ +--------+ +----+----+
     |                       |
     v                       v
+----+-----------------------v----+
|        FollowerCommonLayer      |
| (共享：掩护/受伤/集结/恐慌/近战) |
+--------------------------------+
```

---

## 四、已知问题与限制

| 问题 | 影响 | 状态 |
|------|------|------|
| 高 Follower 数时严重掉帧 | FPS 降低 30-50% | 见性能优化文档 |
| Fika 兼容性不稳定 | 联机时 Follower 偶尔消失 | 需正式适配接口 |
| AI 指令响应延迟 | 短语指令后 Follower 延迟 1-3 秒响应 | 因 setTimeout 链 |
| 寻路卡死 | Follower 偶尔在复杂地形卡住 | 需增加检测+传送 |
| 配置文件损坏 | 手动编辑 JSON 可能导致崩溃 | 需 Schema 验证 |

---

## 五、v4.5.0 优化组件

本版本通过 **friendlyPMC-Optimizer.dll** (Harmony 伴侣插件) 运行时增强原始 DLL，包含 9 个补丁:

| 类别 | 补丁数 | 内容 |
|------|--------|------|
| 性能优化 | 5 个 | 巡逻缓存、激活跳过、受伤节流、子弹过滤、JSON 缓存 |
| 战术重构 | 4 个 | 搜索状态机、掩体排序桩、冲刺判断、突进判定 |

**设计文档:** `Docs/command-mechanism-and-sain-integration.md` | `Docs/tactical-refactor-design.md`

## 六、相关文档

| 文档 | 说明 |
|------|------|
| [code-review.md](./code-review.md) | 代码审查与性能分析 |
| [command-mechanism-and-sain-integration.md](./command-mechanism-and-sain-integration.md) | 指挥机制与 SAIN 集成研究 |
| [gesture-command-design.md](./gesture-command-design.md) | 手势指挥强化设计 |
| [tactical-refactor-design.md](./tactical-refactor-design.md) | 战术重构设计 (SAIN 移植) |
| [implementation-plan.md](./implementation-plan.md) | 性能优化实施计划 |
| [superpowers/plans/2026-06-06-tactical-refactor-plan.md](./superpowers/plans/2026-06-06-tactical-refactor-plan.md) | 战术重构实施计划 |
