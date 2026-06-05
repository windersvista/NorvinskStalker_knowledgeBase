# ABPS - Acid's Bot Placement System

> SPT 3.11.4 兼容 | 全面的 AI 生成系统大修

---

## 1. 项目概述

ABPS（Acid's Bot Placement System）是一个针对 SPT（Single Player Tarkov）3.11.x 的客户端-服务端双端模组。它完全接管并替换了 SPT 的香草 AI 生成系统，提供精细的 PMC、Scav 和 Boss 生成控制，包括距离感知生成点选择、渐进式 Boss 生成概率、热点区域系统、Bot 远距离清除等功能。

**开发**: acidphantasm  
**版本**: 1.1.4  
**SPT 版本兼容**: ~3.11 (使用 semver `satisfies` 匹配)  
**加载优先级**: 需要在 `RaidOverhaul` 和 `WTT-RogueJustice` 之前加载

---

## 2. 架构概述

```
+------------------------------------------------------------------+
|                        ABPS 模组架构                              |
+------------------------------------------------------------------+
|                                                                    |
|   [Server 端 - TypeScript]          [Client 端 - C#/BepInEx]      |
|   运行在 SPT 服务器进程内            运行在 EscapeFromTarkov.exe     |
|                                                                    |
|   mod.ts (入口)                     Plugin.cs (入口)               |
|     |                                  |                           |
|     +-> InstanceManager.ts            +-> Harmony Patches:        |
|     |   (依赖注入容器)                 |   |                       |
|     |                                  |   +- PMCDistancePatch     |
|     +-> ModConfig.ts                  |   |  (PMC 生成控制)        |
|     |   (读取 config/config.json)      |   |                       |
|     |                                  |   +- NonWavesSpawn...     |
|     +-> MapSpawnControl.ts            |   |  (Scav 生成控制)       |
|     |   (中央调度器, 协调所有生成)       |   |                       |
|     |                                  |   +- PMCWaveCountPatch    |
|     +-> BossSpawnControl.ts           |   |  (数据重置)            |
|     |   (Boss/Raider 生成)             |   |                       |
|     |                                  |   +- TryToSpawnInZone...  |
|     +-> PMCSpawnControl.ts            |   |  (Scav 生成点过滤)      |
|     |   (PMC 生成数据构建)              |   |                       |
|     |                                  |   +- IsPlayerEnemyPatch   |
|     +-> ScavSpawnControl.ts           |   |  (PMC 敌友关系)         |
|     |   (Scav 生成数据构建)             |   |                       |
|     |                                  |   +- MaxBotLimitPatch     |
|     +-> VanillaAdjustmentControl.ts   |   |  (Bot 上限控制)        |
|     |   (禁用/调整香草设置)             |   |                       |
|     |                                  |   +- BossAddProgression.. |
|     +-> StaticRouterHooks.ts          |   |  (Boss 渐进概率)        |
|         (HTTP 路由 + 数据持久化)        |   |                       |
|                                        |   +- MenuLoadPatch        |
|         [Defaults/ 目录]              |   |  (Boss 追踪数据加载)    |
|         - Bosses.ts  (Boss 模板)       |   |                       |
|         - PMCs.ts    (PMC 模板)        |   +- AssaultGroupPatch    |
|         - Scavs.ts   (Scav 模板)       |   |  (禁用突击组冲锋)       |
|         - MapSpawnZones.ts (生成区)     |   |                       |
|         - Hostility.ts (敌对关系)       |   +- PmcGroupSpawner     |
|                                        |   |  (PMC 小队生成系统)    |
|                                        |   |                       |
|                                        |   +- BossSpawnTracking    |
|                                        |      (Boss 追踪系统)      |
+------------------------------------------------------------------+
```

---

## 3. 数据流与生命周期

### 3.1 启动时 (Server 端)

```
SPT 服务器启动
  -> preSptLoad: 验证 SPT 版本，注册 DI 容器，注册 HTTP 路由
  -> postDBLoad: 初始化数据库服务引用，配置初始数据
  -> configureInitialData(): 核心初始化
     - 清空所有地图的 BossLocationSpawn 和 waves
     - 根据配置控制 NewSpawn/OldSpawn 系统开关
     - 调整生成系统参数（时间窗口、间隔、触发条件等）
     - 修复 PMC 敌对关系
     - 禁用香草 SPT 生成设置
     - 移除香草 PMC 波次
     - buildInitialCache(): 构建完整的自定义生成数据
       - buildBossWaves(): 构建所有 Boss 生成波次
       - buildPMCWaves(): 构建起始 PMC + PMC 增援波次
       - buildStartingScavs(): 构建起始 Scav 生成波次
       - replaceOriginalLocations(): 用构建的数据替换地图原始数据
```

### 3.2 进入战局时 (Client 端)

```
玩家点击"开始战局"
  -> SPT 服务器生成地图数据（已包含 ABPS 修改过的生成数据）
  -> 客户端加载地图
  -> MaxBotLimitPatch: 设置该地图最大 Bot 数量
  -> PMCWaveCountPatch: 重置工具类缓存（地图区域、生成点等）
  
  BossSpawnScenario 开始处理 BossLocationSpawn：
  -> LocalGameProgressivePatch: 应用渐进式 Boss 概率
  -> PMCDistancePatch: 拦截 PMC 生成，执行距离感知生成点选择
     - 优先使用玩家生成点（PMC 出生点）
     - 如果玩家生成点不可用，回退到 Bot 生成点
     - 如果配置了 pmcSpawnAnywhere，使用全图生成点
     - 对每个候选生成点执行距离检查（vs PMCs / vs Scavs）
     - 通过 PmcGroupSpawner 创建 PMC 小队
  
  BossAddProgressionPatch: Boss 生成后记录到追踪系统
  
  非波次 Scav 生成 (NonWavesSpawnScenario)：
  -> NonWavesSpawnScenarioUpdatePatch: 完全替换 Scav 持续生成逻辑
     - 自定义生成周期（活跃/安静时间交替）
     - 软上限机制（预留空间给 PMC 波次）
     - 区域上限控制（每区域最大 Scav 数）
     - 热点区域系统（可选，高价值区域更多 Scav）
     - 远距离 Bot 清除系统（可选）
  -> TryToSpawnInZonePatch: 生成点级别过滤
     - Scav 距离检查（vs PMCs / vs Scavs）
     - 区域 Scav 数量检查 -> 超限时切换到其他区域
     - 热点区域特殊处理
```

### 3.3 Scav 玩家中途加入 (Late Start)

```
玩家作为 Scav 加入进行中的战局
  -> SPT 服务器 RaidTimeAdjustmentService 调用 adjustWaves()
  -> MapSpawnControl.adjustWaves():
     - 保留所有 Time == -1 的初始 Boss
     - 保留时间大于加入时间的所有波次（PMC 和其他）
     - 对这些波次的时间进行偏移（减去已过时间）
     - 重新生成剩余 PMC 数量（根据剩余时间计算）
     - 重新生成起始 Scav
     - 组合所有波次
```

### 3.4 战局结束后 (Server 端)

```
战局结束
  -> Client 端 BossSpawnTracking.EndRaidMergeData()
     -> 发送 PUT /abps/save 到 Server
  -> Server 端 StaticRouterHooks 保存到 bossTrackingData.json
  -> Server 端 ABPS-EndMatchRouter:
     -> MapSpawnControl.configureInitialData(): 为下一局重新构建生成数据
```

### 3.5 主菜单加载时 (Client 端)

```
主菜单加载
  -> MenuLoadPatch: 触发 BossSpawnTracking.LoadFromServer()
     -> 发送 GET /abps/load 到 Server
     -> 获取 Boss 追踪数据
     -> 匹配玩家 ProfileID 加载该玩家的 Boss 生成历史
```

---

## 4. 核心子系统详解

### 4.1 PMC 生成系统

ABPS 将 PMC 作为"Boss 波次"来实现（利用 `BossLocationSpawn` 数据结构）。

**两种 PMC 生成模式:**

| 模式 | 配置键 | 描述 |
|------|--------|------|
| 起始 PMC | `pmcConfig.startingPMCs` | 战局开始时立即生成，数量由 `mapLimits.min/max` 随机决定 |
| PMC 波次 | `pmcConfig.waves` | 战局中按时间间隔持续生成（默认关闭） |

**PMC 类型**: 随机选择 `pmcUSEC` 或 `pmcBEAR`，各 50% 概率。

**小队系统**: PMC 可以组成小队：
- `groupChance`: 组成小队的概率
- `maxGroupSize`: 小队最大人数（含队长）
- `maxGroupCount`: 全图最多小队数量
- 同小队 PMC 互不攻击（通过 IsPlayerEnemyPatch 确保）

**难度分配**: 使用加权随机从 `pmcDifficulty` 配置中抽取（easy/normal/hard/impossible），Boss 和随从分别独立随机。

**距离感知生成**: Client 端通过 `PMCDistancePatch` 确保 PMC 生成时：
- 不会生成在当前存活 PMC 的近距离范围内
- 不会生成在当前存活 Scav 的近距离范围内
- 如果玩家是 Scav，也不会生成在玩家附近
- 距离阈值可通过 BepInEx 配置逐地图调整（默认 30-150 米不等）

**Scav 加入时的 PMC 补偿**: 当玩家以 Scav 身份中途加入时，Server 端会根据剩余时间重新计算 PMC 数量：

| 剩余时间 | 生成 PMC 数量 |
|----------|--------------|
| < 600 秒 (10分钟) | 1-3 人 |
| < 1200 秒 (20分钟) | 1-6 人 |
| < 1800 秒 (30分钟) | 4-9 人 |
| >= 1800 秒 | 使用 mapLimits 正常随机 |

### 4.2 Scav 生成系统

**两种 Scav 生成模式:**

| 模式 | 配置键 | 描述 |
|------|--------|------|
| 起始 Scav | `scavConfig.startingScavs` | 战局开始时立即生成的 Scav |
| 波次 Scav | `scavConfig.waves` | 战局中持续的 Scav 生成（NewSpawn 系统） |

**NewSpawn 系统控制 (客户端)**:

ABPS 完全接管了 `NonWavesSpawnScenario.Update()` 方法，实现自定义的 Scav 持续生成逻辑：

1. **生成时间窗口**: 由 Server 端设置 `BotStart`（何时开始生成）和 `BotStop`（何时停止生成）
2. **活跃/安静周期**: 
   - 活跃时间 (`BotSpawnTimeOnMin/Max`): 生成 Scav 的时间窗口
   - 安静时间 (`BotSpawnTimeOffMin/Max`): 不生成 Scav 的间隔
   - 两个状态交替切换
3. **生成触发条件**:
   - 当前存活/加载中 Bot 数量 ≤ `maxCount - softCap` 时开始检查生成
   - Bot 数量低于 `BotSpawnCountStep` 时触发一次生成
4. **软上限**: 当 Bot 数量接近硬上限时停止生成 Scav，为 PMC 波次预留空间

**生成点选择 (客户端)**:

- 随机选择非狙击区域 (`!x.SnipeZone`)
- 区域上限: 每个区域最多 `zoneScavCap` 个 assault Scav
- 热点区域: 如果启用且有 `hotzoneScavChance%` 概率，优先在热点区域生成
  - 热点区域定义（硬编码）:
    - 储备站: `ZoneSubStorage`, `ZoneBarrack`
    - 海岸线: `ZoneSanatorium1`, `ZoneSanatorium2`
    - 灯塔: `Zone_LongRoad`, `Zone_Chalet`, `Zone_Village`
    - 立交桥: `ZoneCenter`, `ZoneCenterBot`
    - 海关: `ZoneDormitory`, `ZoneScavBase`, `ZoneOldAZS`, `ZoneGasStation`
  - 热点区域上限: `hotzoneScavCap`（可单独配置）

**距离检查**: 每个候选生成点必须满足：
- 与所有 PMC 的距离 ≥ 各图配置的 `ScavSpawnDistanceCheck`（默认 30-45 米）
- 与所有 Scav 的距离 ≥ 20 米（工厂/GroundZero）或 40 米（其他地图）
- 热点区域中降低到 10 米

**区域重选**: 如果当前区域的 Scav 数量超限，自动切换到其他随机有效区域（最多重试 5 次）。

**狙击 Scav**: 可选的 `startingMarksman` 配置，在地图的狙击生成区域额外生成狙击手（每地图最多 2 个）。

**玩家 Scav**: `isPlayers` 概率（起始 Scav 10%，后期 Scav 可配置 `pScavChance`，默认 20%）。

**禁止突击组**: `AssaultGroupPatch` 自动将 `assaultGroup` 角色替换为 `assault`，防止香草游戏中的"跟踪玩家并冲锋"的 Scav 小队行为。

### 4.3 Boss 生成系统

ABPS 覆盖了所有 Boss 的生成数据，包括：

| Boss 名称 | 配置键 | 默认生成地图 | 随从类型 |
|-----------|--------|-------------|---------|
| Knight (Goons 小队) | `bossKnight` | 海关/灯塔/海岸线/森林 | BigPipe, BirdEye |
| Reshala | `bossBully` | 海关 | followerBully x4 |
| Tagilla | `bossTagilla` | 工厂 | 无 |
| Killa | `bossKilla` | 立交桥 | 无 |
| Zryachiy | `bossZryachiy` | 灯塔(岛) | followerZryachiy x2 |
| Glukhar | `bossGluhar` | 储备站 | 突击/安保/侦察各 x2 |
| Sanitar | `bossSanitar` | 海岸线 | followerSanitar x3 |
| Kolontay | `bossKolontay` | GZ/街区 | 安保 x2, 突击 x2, 侦察 |
| Kaban | `bossBoar` | 街区 | followerBoar x6 + Close1 + Close2 |
| Shturman | `bossKojaniy` | 森林 | followerKojaniy x2 |
| Partisan | `bossPartisan` | 海关/灯塔/海岸线/森林 | 无（触发器生成） |
| 邪教徒祭司 | `sectantPriest` | 多图(夜间) | sectantWarrior |
| Arena 斗士 | `arenaFighterEvent` | 海关/森林 | arenaFighterEvent |
| Raider (pmcBot) | `pmcBot` | 实验室/储备站 | pmcBot（多波次系统） |
| Rogues (exUsec) | `exUsec` | 灯塔 | exUsec（多区域驻守） |
| Gifter | `gifter` | 无（活动 NPC） | 无 |

**每个 Boss 配置项目:**
- `enable`: 是否启用
- `time`: 生成时间（-1 = 战局开始时）
- `spawnChance`: 每图生成概率（0-100）
- `bossZone`: 每图生成区域（逗号分隔多个区域）

**Raider 多波次系统**: 
当 `pmcBot.addExtraSpawns` 启用时（实验室默认开启），ABPS 会生成定时的 Raider 波次：
- 非实验室地图: 每 450 秒一波，每波最多 4 人，100% 小队概率
- 实验室: 每 450 秒一波，每波最多 10 人，100% 小队概率
- 在剩余 300 秒时停止生成波次

**Boss 难度**: 使用加权随机从 `bossDifficulty` 配置中抽取。

### 4.4 渐进式 Boss 生成概率

可选的 `progressiveChances` 系统（默认关闭）：

1. 每个被追踪的 Boss 有一个动态概率值
2. Boss 未生成时: 概率 += `chanceStep`（默认 +5），直到达到 `maximumChance`（默认 100）
3. Boss 生成时: 概率重置为 `minimumChance`（默认 5）
4. 数据跨战局持久化（存储在 Server 端 `bossTrackingData.json`）

**被追踪的 Boss**: Boar, Bully, Gluhar, Killa, Knight, Kolontay, Kojaniy, Sanitar, Tagilla, Partisan, Zryachiy, arenaFighterEvent, sectantPriest

### 4.5 Bot 远距离清除系统

可选的远距离 Bot 清除功能（默认关闭）：

1. 定期（每 `despawnTimer` 秒，默认 300 秒）检查所有非 Boss Bot
2. 计算所有活跃玩家（非 AI）的中心位置
3. 距离中心超过 `despawnDistance`（默认 250 米）的 Bot 将被清除
4. 可选是否同时清除 PMC（`despawnPmcs`，默认关闭）
5. 清除操作: 止血 -> 注销 -> 停用 -> 销毁 GameObject

**注意: 存在已知风险** — 当前的 `DestroyImmediate` 使用可能在运行时导致问题（见章节 6）。

### 4.6 敌对关系系统

ABPS 在 Server 端重写了 PMC 的敌对关系设置：

**PMC 对其他 Bot 类型**:
- 添加 `assault`, `pmcBEAR`, `pmcUSEC` 到 `additionalEnemyTypes`
- 设置 `savageEnemyChance = 100`, `bearEnemyChance = 100`, `usecEnemyChance = 100`
- 设置 `savagePlayerBehaviour = "AlwaysEnemies"`

**PMC 对其他 PMC**:
- 不同小队的同类型 PMC 互为敌人（通过 `IsPlayerEnemyPatch` 确保）
- 同小队 PMC 互不攻击

### 4.7 生成点区域数据

ABPS 为每个地图硬编码了 Scav 的生成区域：

| 地图 | 普通 Scav 区域数 | 狙击 Scav 区域数 |
|------|-----------------|-----------------|
| 海关 (bigmap) | 12 | 4 |
| 工厂 (factory4) | 1 (BotZone) | 0 |
| 立交桥 (interchange) | 10 | 0 |
| 实验室 (laboratory) | 3 | 0 |
| 灯塔 (lighthouse) | 19 | 1 |
| 储备站 (rezervbase) | 7 | 0 |
| Ground Zero (sandbox) | 1 (ZoneSandbox) | 2 |
| 海岸线 (shoreline) | 18 | 2 |
| 街区 (tarkovstreets) | 15 | 6 |
| 森林 (woods) | 13 | 1 |

---

## 5. 配置说明

### 5.1 Server 端配置 (`Server/config/config.json`)

#### PMC 配置

```json
"pmcConfig": {
    "startingPMCs": {
        "enable": true,          // 是否启用起始 PMC
        "ignoreMaxBotCaps": true, // 是否忽略 Bot 上限
        "groupChance": 25,       // 组成小队概率 (%)
        "maxGroupSize": 3,       // 小队最大人数
        "maxGroupCount": 4,      // 最多小队数量
        "mapLimits": {           // 每个地图的 PMC 数量范围
            "bigmap": { "min": 8, "max": 10 },
            "interchange": { "min": 9, "max": 13 },
            "woods": { "min": 9, "max": 13 },
            // ... 其他地图
        }
    },
    "waves": {
        "enable": false,          // 是否启用 PMC 增援波次
        "delayBeforeFirstWave": 500,  // 第一波延迟 (秒)
        "secondsBetweenWaves": 360,   // 波次间隔 (秒)
        "maxBotsPerWave": 5,          // 每波最大人数
        "stopWavesBeforeEndOfRaidLimit": 300  // 停止生成时间
    }
}
```

#### Scav 配置

```json
"scavConfig": {
    "startingScavs": {
        "enable": true,
        "startingMarksman": true,
        "maxBotSpawns": {         // 每图最大起始 Scav 数
            "bigmap": 5,
            "interchange": 5,
            "woods": 5,
            // ...
            "laboratory": 0       // 实验室无 Scav
        }
    },
    "waves": {
        "enable": true,
        "enableCustomFactory": true,  // 工厂使用自定义生成参数
        "startSpawns": 60,            // 开始生成时间 (秒)
        "stopSpawns": 600,            // 停止生成时间 (秒，相对于结束)
        "activeTimeMin": 180,         // 活跃生成最短时间
        "activeTimeMax": 240,         // 活跃生成最长时间
        "quietTimeMin": 120,          // 安静间隔最短时间
        "quietTimeMax": 180,          // 安静间隔最长时间
        "checkToSpawnTimer": 15,      // 生成检查间隔
        "pendingBotsToTrigger": 3     // 触发生成的待定 Bot 数
    }
}
```

#### Boss 配置 (以 Killa 为例)

```json
"bossKilla": {
    "enable": true,
    "time": -1,                // -1 = 战局开始时
    "spawnChance": {
        "interchange": 30,    // 仅立交桥 30%
        "bigmap": 0,
        // ...
    },
    "bossZone": {
        "interchange": "ZoneCenterBot,ZoneCenter,ZoneOLI,ZoneIDEA,ZoneGoshan"
    }
}
```

### 5.2 Client 端配置 (BepInEx ConfigurationManager)

Client 端通过 BepInEx 配置系统提供热更新配置：

- **1. Despawn Settings**: 远距离清除开关、距离、计时器、是否清除 PMC
- **2. General Settings**: 每图最大 Bot 数、渐进式 Boss 概率参数
- **3. PMC Settings**: PMC 生成点类型、每图距离限制
- **4. Scav Settings**: 软上限、玩家 Scav 概率、区域/热点上限、每图距离限制

---

## 6. 已知问题与代码质量评估

### 6.1 关键问题（需要修复）

| 编号 | 严重程度 | 位置 | 问题描述 |
|------|---------|------|---------|
| B1 | [!] 严重 | `Client/Spawning/BossSpawnTracking.cs:13-15` | C# 代码使用了 `[]` 初始化 Dictionary（非法语法），会导致编译失败 |
| B2 | [!] 严重 | `Server/src/Controls/ScavSpawnControl.ts:77,148-175` | `getMarksmanSpawnZones` 在多数地图返回 `undefined`，在 `createExhaustableArray` 中使用前未做空值检查，启用 `startingMarksman` 时会触发运行时异常 |
| B3 | [!] 高 | `Server/src/Controls/MapSpawnControl.ts:215-236` | `adjustWaves` 的过滤逻辑会丢弃所有非 PMC 的定时 Boss 波次，导致 Scav 加入战局时缺失 Boss |
| B4 | [!] 高 | `Server/src/Controls/ScavSpawnControl.ts:79` | `marksmanSpawnCount` 初始化为 `scavCap`（逻辑错误），应初始化为 `waveLength` |

### 6.2 性能问题

| 编号 | 影响 | 位置 | 问题描述 | 优化建议 |
|------|------|------|---------|---------|
| P1 | 中 | 多处 | 大量使用 `Vector3.Distance()`（含 `sqrt` 运算）进行距离检查 | 改用 `sqrMagnitude` 比较平方距离，避免开方 |
| P2 | 中 | 多处 | 使用 `OrderBy(Guid.NewGuid())` 进行随机排序 | 改用 Fisher-Yates 原地洗牌，避免高分配 |
| P3 | 中 | `Client/Utils/Utility.cs` | `GetAllPMCs()` / `GetAllScavs()` 每次调用都创建新列表 | 在同一帧内缓存结果 |
| P4 | 低 | 多处 | LINQ `.Where().ToList()` 在热点循环中创建临时集合 | 改用传统循环或缓存结果 |

### 6.3 内存/资源管理问题

| 编号 | 严重程度 | 位置 | 问题描述 |
|------|---------|------|---------|
| M1 | 高 | `Client/Spawning/PMCSpawning.cs:20-22` | `allPmcGroups` 和 `wavePmcGroupClassData` 静态字典条目未清理，随战局数增长持续泄漏 |
| M2 | 高 | `Client/Patches/NewSpawnPatches.cs:204-206` | 使用 `DestroyImmediate` 在运行时销毁 Bot GameObject（危险，应使用 `Destroy`） |
| M3 | 中 | 多处 | 事件订阅（如 `OnSpawnedWave`）添加后未取消订阅 |

### 6.4 代码质量问题

| 编号 | 类型 | 位置 | 问题描述 |
|------|------|------|---------|
| Q1 | 可读性 | `Server/src/Controls/BossSpawnControl.ts:58` | 长条件表达式缺少括号，运算符优先级不直观 |
| Q2 | 健壮性 | `Server/src/Controls/MapSpawnControl.ts:54-56` | `locationData[mapName]` 无存在性检查 |
| Q3 | 健壮性 | `Server/src/Controls/PMCSpawnControl.ts:148-160` | `getDefaultValuesForBoss` 返回 `undefined` 时上游代码会崩溃 |
| Q4 | 风格 | `MapSpawnControl.ts` 多处 | 使用 `for (const map in this.validMaps)` 迭代数组（得到索引字符串），应使用 `for...of` |
| Q5 | 逻辑 | `PMCSpawnControl.ts:177-179` | `generateScavRaidRemainingPMCs` 中先随机再被后续条件无条件覆盖，浪费计算 |

---

## 7. 推荐的优化与改进方向

### 7.1 帧数/性能优化

1. **距离检查优化（高优先级）**: 
   - 将所有 `Vector3.Distance()` 替换为 `(a - b).sqrMagnitude` 与预计算的 `threshold * threshold` 比较
   - 影响范围: `PMCDistancePatch.IsValid`, `NewSpawnPatches.DespawnFurthestBots`, `TryToSpawnInZonePatch.IsValid`

2. **随机排序优化**:
   - 实现 Fisher-Yates 洗牌替代 `OrderBy(Guid.NewGuid())`
   - 影响范围: `Utility.GetMapBotZones`, `PMCDistancePatch.GetPlayerSpawnPoints/GetAnySpawnPoints`, `NewSpawnPatches` 多处

3. **列表缓存**:
   - 将 `GetAllPMCs()` / `GetAllScavs()` 结果在同一帧内缓存，避免重复 LINQ 过滤和列表创建

4. **空间分区**:
   - 对于大型地图的大量距离检查，可考虑使用简单的网格空间分区，将 O(n*m) 降低到接近 O(n)

### 7.2 稳定性改进

1. 移除 `DestroyImmediate` 使用，改用安全销毁流程
2. 清理静态字典条目和事件订阅
3. 添加数据库访问的空值防护
4. 统一 `getDefaultValuesForBoss` 返回 `[]` 并在调用方检查空数组

---

## 8. 文件结构

```
Moew-botplacementsystem/
├── README.md                          # 本文件
├── .gitignore
├── Server/                            # SPT 服务端 (TypeScript)
│   ├── package.json                   # 模组元数据 (名称为 "Acids Bot Placement System")
│   ├── tsconfig.json
│   ├── config/
│   │   └── config.json               # 服务端配置 (PMC/Scav/Boss 所有参数)
│   └── src/
│       ├── mod.ts                     # 入口, SPT 生命周期钩子
│       ├── InstanceManager.ts         # 依赖注入 + 控制类实例化
│       ├── Globals/
│       │   └── ModConfig.ts          # 配置读取 + TypeScript 类型定义
│       ├── Routers/
│       │   └── StaticRouterHooks.ts  # HTTP 路由 (start/end match + boss 追踪)
│       ├── Controls/
│       │   ├── MapSpawnControl.ts    # 中央调度器
│       │   ├── BossSpawnControl.ts   # Boss 生成数据构建
│       │   ├── PMCSpawnControl.ts    # PMC 生成数据构建
│       │   ├── ScavSpawnControl.ts   # Scav 生成数据构建
│       │   └── VanillaAdjustmentControl.ts  # 香草设置禁用/修改
│       ├── Utils/
│       │   └── GlobalUtils.ts        # ExhaustableArray 工厂函数
│       └── Defaults/
│           ├── Bosses.ts             # Boss/Raider/Rogue 默认生成数据
│           ├── PMCs.ts               # PMC 默认生成数据
│           ├── Scavs.ts              # Scav 默认生成数据
│           ├── Hostility.ts          # 敌对关系模板
│           └── MapSpawnZones.ts      # 所有地图的 Scav 生成区域
└── Client/                            # 游戏客户端 (C#/BepInEx)
    ├── acidphantasm-botplacementsystem.csproj
    ├── acidphantasm-botplacementsystem.sln
    ├── Plugin.cs                      # BepInEx 入口 + Harmony Patch 注册
    ├── ABPSConfig.cs                  # BepInEx 配置项定义
    ├── ConfigurationManagerAttributes.cs  # BepInEx CM 辅助类
    ├── Patches/
    │   ├── BossSpawnPatches.cs        # PMC 生成控制 + Boss 渐进追踪
    │   ├── NewSpawnPatches.cs         # Scav 生成控制 + 远距离清除
    │   ├── IsPlayerEnemyPatch.cs      # PMC 小队敌对关系
    │   ├── MaxBotLimitPatch.cs        # Bot 上限覆盖
    │   ├── LocalGameProgressivePatch.cs  # 渐进式 Boss 概率应用
    │   └── MenuLoadPatch.cs           # Boss 追踪数据加载
    ├── Spawning/
    │   ├── PMCSpawning.cs             # 自定义 PMC 小队生成系统
    │   └── BossSpawnTracking.cs       # Boss 生成追踪 + 持久化通信
    └── Utils/
        └── Utility.cs                 # 工具类 (玩家/生成点查询 + 热点定义)
```

---

## 9. 技术备注

- 项目依赖 SPT 3.11.x 的 `@spt/*` 类型定义（通过 tsconfig paths 映射）
- 使用 `tsyringe` 作为依赖注入框架
- Client 端使用 `Harmony` (通过 `SPT.Reflection.Patching.ModulePatch`) 进行方法拦截
- Boss 追踪数据通过自定义 HTTP 端点 `/abps/save` 和 `/abps/load` 进行跨战局持久化
- PMCs 被视为 "Boss" 类型（`BossLocationSpawn`）以便利用 SPT 的基础设施
- Scavs 使用标准的 `IWave` 类型，通过修改 `waves[]` 数组控制
- `ExhaustableArray` 用于 Scav 生成区域的不放回随机抽取
