# SAIN -- Solarint's AI Modifications

> SPT 3.11.4 离线版《逃离塔科夫》AI行为逻辑全面替换模组
>
> 作者: Solarint | 兼容版维护: Moew-SAIN-For-3114

---

## 一、项目简介

SAIN 是一个 BepInEx 插件，通过 Harmony Patch 深度注入替换《逃离塔科夫》原版 AI 的行为树系统，为离线版（SPT）的 Bot 提供类似真人玩家的战术行为。项目通过约 **100 个 Harmony Patch** 和 **40+ 子组件类**，完全接管 Bot 的视觉、听觉、移动、射击、掩体和决策系统。

### 核心特性

- **行为决策系统**: 替换原版 Bot 行为树，模拟真人玩家的战术决策
- **动态掩体系统**: 基于实时碰撞体分析生成掩体点，无需预置数据
- **多线程视觉射线检测**: 基于 Unity Jobs 的批量射线检测
- **高级移动系统**: Bot 可以翻越、探头、侧身、冲刺、匍匐、跳跃
- **Bot 个性系统**: 根据装备品质和随机概率分配不同个性（GigaChad、Rat、Coward 等）
- **游戏内 GUI 编辑器**: 按 F6 打开，实时调整和预览 Bot 行为参数
- **预设系统**: 所有配置绑定到"预设"文件，可分享导入
- **小队协调**: Bot 组队执行包抄、压制、支援等战术
- **手电筒/激光检测**: Bot 能看见玩家的手电和激光，影响其视觉和瞄准
- **压制系统**: 子弹飞过时 Bot 受到模拟压制效果
- **装备影响**: Bot 的武器/头盔/耳机等装备真实影响其战斗性能

---

## 二、前置模组

SAIN 依赖两个前置 BepInEx 插件，它们提供底层框架和基础设施：

### 2.1 BigBrain (DrakiaXYZ) v1.3.2

**项目定位**: AI 行为树框架。BigBrain **本身不提供任何 AI 行为逻辑**，它提供一套 **Hook + 抽象层 + 管理 API**：

- **6 个 Harmony Patch** 深度注入 EFT 原生 `AICoreStrategyClass` 体系
- 提供两个抽象基类：
  - `CustomLayer` -- 自定义行为层（对应原版 Layer），SAIN 继承此基类
  - `CustomLogic` -- 自定义逻辑节点（对应原版 Logic），SAIN 继承此基类
- `BrainManager` API:
  - `AddCustomLayer()` -- 向指定 Brain 注入自定义 Layer
  - `RemoveLayer()` / `RestoreLayer()` -- 动态删除/恢复原版 Layer
  - 支持批量操作和 `WildSpawnType` 角色过滤
- Layer 优先级系统：数值越高越优先，原生 Layer 和自定义 Layer 统一排序
- 生命周期管理：自动调用 `Start()`/`Stop()` 处理 Layer 切换

**SAIN 调用方式**: SAIN 继承 `CustomLayer` 创建 `SAINLayer` 系列，通过 `BrainManager.AddCustomLayer()` 注册，通过 `BrainManager.RemoveLayer()` 删除原版战斗 Layer。

### 2.2 Waypoints (DrakiaXYZ) v1.7.1

**项目定位**: NavMesh 增强模组。为上层 AI 模组提供"可用的寻路地图"：

- **自定义 NavMesh 注入**: 在 `BotsController.Init` 时从 `.bundle` 文件加载 `NavMeshData`，替换原版 NavMesh
- **寻路算法替换**: 用 Unity 原生 `NavMesh.CalculatePath` 替换 BSG 原版寻路算法
- **门系统处理**: 为锁定/可破坏门创建 `NavMeshDoorLink`，动态控制 carving
- **NavMeshObstacle 管理**: 为开关门、撤离门添加动态障碍物
- 服务端修改: 调整 bot 巡逻参数、禁用路径缓存

**SAIN 的依赖**: SAIN 的所有寻路都依赖 Waypoints 提供的 `NavMesh.CalculatePath` 接口。没有 Waypoints，SAIN 的 Bot 将使用原版 NavMesh 和 BSG 原版寻路。

---

## 三、整体架构

### 3.1 启动流程

```
SAINPlugin.Awake()  (插件入口)
  ├─ PresetHandler.Init()          -- 加载预设配置
  ├─ BindConfigs()                 -- 绑定 F6 快捷键
  ├─ InitPatches()                 -- 启用全部 ~100 个 Harmony Patch
  │   ├─ 视觉: 15 个 Patch
  │   ├─ 听觉: 26 个 Patch
  │   ├─ 移动: 16 个 Patch
  │   ├─ 射击: 17 个 Patch
  │   ├─ 语音: 6 个 Patch
  │   ├─ 通用: 23 个 Patch
  │   ├─ 修复: 13 个 Patch
  │   └─ 组件: 7 个 Patch
  ├─ BigBrainHandler.Init()        -- 向所有 Bot 类型注册 SAIN 自定义层
  │   ├─ PMC: 注册 5 个层，禁用 14 个原版层
  │   ├─ SCAV: 注册 5 个层，禁用原版层
  │   ├─ Raider/Boss/Rogue/Goon: 类似
  └─ Vector.Init()                 -- 向量辅助工具初始化
```

### 3.2 行为层架构

SAIN 通过 BigBrain 框架为每种 Bot 类型注册 **5 个自定义行为层**（按优先级从高到低）：

| 层 | 类 | 优先级 | 触发条件 |
|---|---|---|---|
| DebugLayer | DebugLayer | 99 | 调试模式 |
| 躲避威胁 | SAINAvoidThreatLayer | 80 | 手雷检测+智能躲避（破片/闪光/烟雾分化） |
| 撤离 | ExtractLayer | 可配置 | Bot 需要撤离 |
| 小队战斗 | CombatSquadLayer | 可配置 | 小队协调行为 |
| 个人战斗 | CombatSoloLayer | 可配置 | 个人战斗行为 |

同时**禁用**了 EFT 原版的 14 个战斗相关层：
`Help`, `AdvAssaultTarget`, `Hit`, `Simple Target`, `Pmc`, `AssaultHaveEnemy`, `Assault Building`, `Enemy Building`, `PushAndSup`, `Pursuit`，以及 Boss 专属的 `KnightFight`, `BirdEyeFight`, `KojaniyB_Enemy` 等。

### 3.3 BotComponent 组件系统

每个 Bot 生成时被附加一个 `BotComponent`（继承 `MonoBehaviour`），内部包含约 **35 个 IBotClass 子组件**。所有子组件按 `TickRequirement` 分为 4 个更新批次：

```
BotComponent.ManualUpdate()
  ├─ AlwaysTickClasses        -- 始终更新（信息类、基础状态）
  ├─ TickWhenActiveClasses    -- Bot 活跃时更新
  ├─ TickWhenNoSleepClasses   -- Bot 非睡眠时更新（主要战斗逻辑）
  └─ TickWhenCombatClasses    -- 战斗中更新（友军火力检测等）
```

**子组件清单**（在 `CreateClasses()` 中按顺序创建）：

| 组件 | 职责 |
|---|---|
| `SAINBotInfoClass` | Bot 基础信息（角色/装备/文件设置），必须最先创建 |
| `SAINNoBushESP` | 灌木 ESP 预防（MonoBehaviour 组件） |
| `BotSquadContainer` | 小队成员管理 |
| `BotBusyHandsDetector` | 手中物品状态检测 |
| `BotGlobalEventsClass` | 全局事件管理 |
| `SAINShootData` | 射击数据管理 |
| `BotWeightManagement` | 负重管理 |
| `SAINMemoryClass` | 记忆系统 |
| `SAINBotUnstuckClass` | 卡住检测与自动解救 |
| `SAINHearingSensorClass` | 听觉传感器 |
| `SAINBotTalkClass` | 语音管理 |
| `SAINDecisionClass` | 决策门面类 |
| `SAINCoverClass` | 掩体管理 |
| `SAINSelfActionClass` | 自行动作执行器 |
| `SAINSteeringClass` | 转向控制 |
| `BotGrenadeManager` | 手雷管理 |
| `SAINMoverClass` | 移动控制 |
| `SAINEnemyController` | 敌人管理 |
| `SAINFriendlyFireClass` | 友军火力检测 |
| `SAINVisionClass` | 视觉管理 |
| `SAINSearchClass` | 搜索管理 |
| `SAINVaultClass` | 翻越管理 |
| `SAINBotSuppressClass` | 压制管理 |
| `SAINAILimit` | AI 行为距离限制 |
| `AimDownSightsController` | 瞄准镜控制 |
| `SAINBotSpaceAwareness` | 空间感知 |
| `DoorOpener` | 门交互 |
| `SAINBotMedicalClass` | 医疗管理 |
| `BotLightController` | 手电/激光管理 |
| `BotBackpackDropClass` | 背包丢弃管理 |
| `CurrentTargetClass` | 当前目标管理 |
| `ManualShootClass` | 手动射击控制 |
| `SAINActivationClass` | 激活/休眠状态管理 |
| `AimClass` | 瞄准计算 |

### 3.4 全局管理器 (BotManagerComponent)

单例 `BotManagerComponent` 管理所有 SAIN Bot 的中央服务：

```
BotManagerComponent
  ├─ BotSpawnController    -- Bot 生成/销毁管理
  ├─ BotExtractManager      -- 撤离点管理
  ├─ TimeClass              -- 时间/光线计算
  ├─ SAINWeatherClass       -- 天气视觉修正
  ├─ BotSquads              -- 所有小队管理
  ├─ BotHearingClass        -- 中央声音事件分发器
  ├─ BotJobsClass           -- Unity Jobs 管理器
  └─ GrenadeController      -- 手雷追踪
```

---

## 四、核心子系统详解

### 4.1 决策系统

`BotDecisionManager` 以 **10Hz** 频率运行优先级决策树：

```
0. 手雷威胁 → AvoidGrenade (最高优先级，即使无敌人也执行)
1. 无敌人 → None
2. SelfAction (治疗/手术/换弹/兴奋剂) → SeekCover + 对应自行动作
3. DogFight 近战格斗检查
4. ContinueMoveToCover (保护逻辑：正在跑向掩体则不切换)
5. Squad 小队决策 (PushSuppressedEnemy > GroupSearch > Suppress > Help > Regroup)
6. Enemy 个人战斗决策 (StandAndShoot > ShootDistantEnemy > RushEnemy > ThrowGrenade > ShiftCover > MoveToEngage > Search > Retreat > RunAway > Freeze > CreepOnEnemy)
```

**决策触发动作切换**: 当决策变化时，`OnDecisionMade` 事件触发，`SAINLayer` 设置 `_actionReset = true`，BigBrain 框架在下一次检查 `IsCurrentActionEnding()` 时结束当前动作并调用 `GetNextAction()`。

### 4.2 视觉系统

SAIN **完整替换**了原版视觉系统：

**原版视觉被全面禁用**:
- `LookSensor.Activate()` -- 前缀返回 false
- `LookSensor.method_2()` -- 前缀返回 false
- `BotOwner.IsEnemyLookingAtMe()` -- 始终返回 false（禁用 ESP 检测）

**SAIN 替代方案**:
- `SAINBotLookClass.UpdateLook()` -- 每帧独立遍历所有敌人，调用底层视线检测
- 视觉距离更新：正常 5 秒/次，被闪光弹击中时 0.5 秒/次
- 方向控制：SAINSteeringClass 按优先级决定看向哪里（瞄准 > 可见敌人 > 被射击 > 最后已知位置 > 听到威胁 > 随机环顾）

**发现速度（14 因子修正器）**:
`EnemyGainSightClass.GetGainSightModifier()` 综合以下因子：
被射击(0.5x更快)、身体部位可见比例、装备隐蔽性、天气、时间、敌人移动速度、高度差、第三方视角、注视角度、玩家不看Bot方向、未知敌人加成(1.5x)、姿态、手电/激光辅助(0.75x/0.95x)、NVG辅助(IR激光0.7x)

**距离修正**: 角度修正(视角外无法发现)、移动修正(移动越快越容易发现)、装备隐蔽修正、射击火光修正(无抑制器1.25x)

**灌木ESP预防 (SAINNoBushESP)**:
- 强制多部位射线检测，检查射线命中的物体名称是否包含 `bush`, `tree`, `plant`, `grass` 等关键词
- 命中灌木则强制设为不可见、不可射击
- 增强模式遍历所有身体部位，要求大部分部位通过才认为可见

**Unity Jobs 多线程射线检测**:
`RaycastJob` / `PathVisionJob` 使用 `RaycastCommand.ScheduleBatch()` 将射线批量提交到 Unity Job System 并行执行，减少主线程压力。

### 4.3 听觉系统

SAIN **完整替换**了原版听觉系统，通过 **26 个 Harmony Patch** 拦截游戏中所有声音事件：

**声音事件分类** (28 种 `SAINSoundType`):
`FootStep`, `Sprint`, `Prone`, `Looting`, `Reload`, `GearSound`, `GrenadePin`, `GrenadeExplosion`, `GrenadeDraw`, `Jump`, `Door`, `DoorBreach`, `Shot`, `SuppressedShot`, `Heal`, `Food`, `Conversation`, `Surgery`, `DryFire`, `TurnSound`, `Breathing`, `Pain`, `Bush`, `BulletImpact`, `Land` 等

**三层架构**:
1. **中央层** (`BotHearingClass`): 接收所有声音事件 -> 延迟 0.1s 分发 -> 同步原版系统
2. **Bot 层** (`HearingInputClass`): 5个声音缓存队列 -> 按枪声/消音/对话/普通顺序处理 -> 逐条判断是否反应
3. **敌人层** (`EnemyHearing`): 追踪是否听到该敌人 -> 更新位置 -> 向小队报告

**听觉修正因子**:
- 环境修正: 室内/室外不同环境、地堡修正
- 条件修正: 耳机/头盔/受伤/濒死/冲刺/喘气状态
- 遮挡修正: 有视线(1x)、不同声音类型不同系数
- **脚步声概率检测**: 近距离必定听到、远距离完全听不到、中间距离基于概率
- **耳聋机制**: 近距离枪声触发 0.75s 耳聋，期间听力降低
- **AI 对 AI 限制**: 基于 `AILimitSetting` 控制最大听力距离

**声音分散**: 不精确告知敌人位置，而是生成随机化的搜索点（分散系数 12.5-17.5），通过 NavMesh 确保可达。

### 4.4 移动系统

SAIN **完整替换**了原版移动控制：

**被禁用的原版移动功能**:
- `BotMover.ManualUpdate` -- 战斗中完全替换
- `BotMover.ManualFixedUpdate` -- 战斗中阻止
- `MovementContext.IsAI` -- 始终返回 false
- 侧向冲刺、负重限制、姿态体力、瞄准体力 -- 全部移除
- 战斗中爬行、原版冲刺逻辑 -- 禁用

**双缓冲路径系统** (`BotPathDataManual`):
- `_preparedPath1` 和 `_preparedPath2` 两条预计算路径
- 一条路径完成后无缝切换到下一条
- 路径转角检测、卡住检测、自动跳跃/翻越
- 5 级冲刺状态管理（转向角度 >45° 暂停冲刺）

**高级移动能力**:
- **翻越** (`SAINVaultClass`): 全局 VaultPoints 缓存，SphereCast 检测障碍物
- **倾斜/探头** (`LeanClass`): 基于敌人位置的左右倾斜，平滑过渡(0.2s)
- **匍匐** (`ProneClass`): 距离 >25m 且能射击时决定匍匐
- **姿态** (`PoseClass`): 自动蹲伏到遮挡射击线的最小高度
- **盲射** (`BlindFireController`): 掩体中敌人不可见时盲射
- **近战缠斗** (`DogFight`): 后撤/靠近/射击三种状态切换
- **门交互** (`DoorOpener`): 路径集成的门交互、踢门决策

### 4.5 动态掩体系统

`CoverFinderComponent` 协程驱动（每 0.1 秒），实时分析环境：

1. **碰撞体扫描**: `OverlapBox(35x5x35m)` 获取周围碰撞体
2. **碰撞体过滤**: 最小 0.25x0.5x0.25m，最大 30x30x30m
3. **碰撞体刷新**: 每 4 秒重新获取一次
4. **掩体点生成**: 每帧处理一个碰撞体的 60 方向射线检测
5. **掩体验证**: 检查是否在 Bot 和敌人之间、NavMesh 可达
6. **点数限制**: 最多生成 5 个掩体点，按路径距离排序

### 4.6 小队协调系统

**队长选举**: 基于 `PowerLevel` 比较，Boss 类型自动成为队长（最高优先级），队长死亡后有 60s 冷却后重选。

**信息共享**:
- 敌人位置共享: 基于 `CoordinationLevel` 计算共享概率（25 + Coordination*15 %）
- 脆弱状态共享: 通讯范围内共享敌人状态（换弹/治疗/手术等）
- 通讯范围: 有耳机无限制，无耳机 30-50m

**Squad 决策**（优先级从高到低）:
1. `PushSuppressedEnemy` -- 敌人被压制时冲锋
2. `GroupSearch` -- 队长在搜索时组队搜索
3. `Suppress` -- 队友撤退时火力压制
4. `Help` -- 支援附近队友
5. `Regroup` -- 远离队长时归队

### 4.7 射击系统

SAIN 接管了射击的几乎所有方面：

- **瞄准时间计算**: 角度曲线/距离曲线/移动/恐慌/ADS/CQB 加速/配件修正，使用 `AnimationCurve` 实现非线性曲线
- **弹道散布**: 修改 MOA（角分）计算，基础 4、全自动 x3、应用综合散射倍数
- **射速控制**: 替换开火逻辑，计算连发时长和射速间隔
- **后座模拟**: AI 受装备/技能/武器类型影响的模拟后座
- **受击效果**: 替换原版受击偏移计算
- **武器故障禁用**: AI 武器永远不会卡壳
- **部位选择**: 默认瞄准腿部，可配置爆头概率

### 4.8 手雷躲避系统 (Grenade Dodge) — v4.2.0 新增

激活了 SAIN 原有但从未生效的 `ECombatDecision.AvoidGrenade` 死代码，实现基于手雷落点的智能躲避，替代 EFT 原版 `BewareGrenade`。

**数据流**:
```
GrenadeController (Harmony反射引信时间 + 协程追踪落点)
  → GrenadeTrackerClass (视觉/听觉/紧急反应检测 + 个性参数)
    → BotDecisionManager (决策链#0最高优先级)
      → SAINAvoidThreatLayer → DodgeGrenadeAction
        → 分层表执行: 寻路掩体 / 反向冲刺 / 原地扑倒
        → Squad 广播 (OnMemberSpottedGrenade)
```

**核心特性**:

| 特性 | 说明 |
|------|------|
| 时间-距离分层 | 剩余 >2s → 反向冲刺+掩体寻路 / 1-2s → 反向跑+扑倒 / <1s → 原地扑倒 |
| 手雷类型分化 | 破片→反向跑 / 闪光→转身不看 / 烟雾→移出烟雾区 / VOG→立即扑倒 |
| 引信时间获取 | Harmony反射优先(3个候选私有字段)+查表兜底(6种手雷类型) |
| 安全点寻路 | 9方向×3距离扇形采样，`CanGoToPoint`验证完整NavMesh路径 |
| 掩体检测 | 每候选点独立Raycast + 碰撞体尺寸过滤(≥0.5×0.5×1m) + 导航路径安全检查 |
| 垂直楼层感知 | 不同楼层用导航路径距离替代3D直线距离，避免误判威胁 |
| 紧急反应 | 距离<8m且正在接近，即使CanReact=false也触发 |
| 三层降级 | SAIN寻路→原地扑倒→EFT兜底(仅非敌人手雷保留EFT原生) |
| Squad协同 | `OnMemberSpottedGrenade`事件广播落点坐标，30m内队友暂停前进 |
| 个性差异化 | 3个可配置字段：反应速度倍率/安全距离倍率/硬扛概率 |
| 决策粘滞防护 | 手雷销毁/超时(10s)自动清除威胁状态 |
| 全局开关 | `GrenadeSettings.ENABLED`，关闭即恢复EFT原版行为 |

**设计文档**: `docs/SAIN躲避手雷逻辑链改造方案.md` (v2.0) | **实施文档**: `docs/SAIN躲避手雷逻辑链改造方案-实施文档.md`

### 4.9 服务端模组

TypeScript 服务端模组 (`ServerMod/src/mod.ts`) 执行以下修改：

1. **限制 PMC Brain 类型**: 所有 PMC 仅使用 `pmcBot` brain（确保与 SAIN 兼容）
2. **限制 SCAV Brain 类型**: 所有 SCAV 仅使用 `assault` brain
3. **限制玩家 SCAV Brain 类型**: 仅使用 `pmcBot` brain
4. **清零原版 Bot 全局修正**: 将所有地图的 `AccuracySpeed`、`GainSight`、`Scattering`、`VisibleDistance` 设为 1.0，由 SAIN 自行管理所有 AI 参数

---

## 五、SAIN 如何影响 EFT AI 行为 -- 公平性分析

### 5.1 替换程度: 近乎完全接管

SAIN 保留了 EFT 原版系统的极少部分：`BotOwner` 生命周期、`BotMover` 低级定位（大部分被 Patch 替换）、`BotAimingClass` 极底层瞄准（SAIN 接管了瞄准时间和瞄准点）。以下是**被完全禁用**的原版系统：

| 原版系统 | 禁用方式 |
|---|---|
| 视觉 LookSensor | Patch `Activate` 返回 false |
| 听觉 BotHearingSensor | Patch 返回 false |
| 原版寻路 | 被 Waypoints NavMesh.CalculatePath 替换 |
| 负重/超重系统 | Patch 硬编码为 9000（几乎无限） |
| 姿势体力消耗 | Patch 移除 |
| 瞄准体力消耗 | Patch 移除 |
| 武器故障/卡壳 | Patch 强制 None |
| 动画阻止射击 | Patch 强制 `CanShootByState = true` |
| 战斗中换弹限制 | Patch 强制允许 |
| AI 止痛药/代谢 | Patch 禁用 |
| 原版语音系统 | Patch 路由到 SAIN |
| 原版手雷处理 | Patch 替换 |
| "敌人是否看我" (ESP) | Patch 始终返回 false |
| 冲刺旋转限制 | Patch 移除 |

### 5.2 公平设计(模拟真人)

以下方面是"公平"的，模拟真实玩家的限制：

1. **听觉系统**: 多因子修正（环境/装备/状态/遮挡），脚步声非确定性概率检测，AI对AI听力限制
2. **视觉系统**: 14因子的发现速度修正，每个敌人独立的视觉循环和LOS检测
3. **瞄准时间**: 完整的非线性瞄准计算公式，考虑角度/距离/恐慌/移动/ADS/附件
4. **决策冷却**: 10Hz 决策频率，存在决策"惯性"无法瞬切
5. **声音分散**: 不精确告知位置，产生随机化搜索点

### 5.3 存在简化的方面(设计选择而非Bug)

这些简化是为了让 AI 在塔科夫环境下可玩，属于设计权衡：

| 简化 | 说明 |
|---|---|
| 无限负重 | AI 负重上限设为 9000，携带无限物资不减速 |
| 无姿势/瞄准体力 | 姿态变换和瞄准不消耗体力 |
| 武器永不卡壳 | AI 武器故障被强制清除 |
| 动画不阻止射击 | `CanShootByState` 始终为 true |
| 战斗中始终可换弹 | 不受原版换弹限制 |
| 冲刺无旋转限制 | 可以任意方向冲刺 |
| `MovementContext.IsAI` 返回 false | AI使用玩家的物理规则 |

**综合评价**: SAIN 核心感知系统(视觉/听觉)是公平且细腻的。简化的部分主要是为了修复 EFT 原版 AI 的设计缺陷（原版 AI 的作弊式负重/体力也需要修正）。"公平/简化"比例约为 **7:3**。

---

## 六、性能与帧数优化分析

### 6.1 性能架构概览

| 项目 | 数据 |
|---|---|
| Harmony Patch 总数 | ~100 个 |
| 每 Bot 子组件数 | ~35 个 |
| 决策频率 | 10Hz(每 0.1s) |
| 视觉距离更新 | 5s/次(正常)，0.5s/次(被闪光) |
| 掩体查找 | 每 0.1s(协程) |
| 碰撞体刷新 | 每 4s |
| 预计 20 Bot 时每帧 ManualUpdate 调用 | 300-500 次 |

**Patch 本身的性能影响**: 绝大多数 Patch 是 Prefix + `return false`（直接短路原方法），开销仅为方法调用 + 空判断。对 FPS 影响在 **1-3% 以内**。真正影响帧率的是 Patch 内触发的 SAIN 子系统逻辑。

### 6.2 GC 分配热点(需优先修复)

| 位置 | 问题 | 严重程度 |
|---|---|---|
| `BotManagerComponent.AddNavObstacles` | 每个尸体每帧 `Physics.OverlapSphere`，大量尸体时累积 | 高 |
| `SAINMoverClass.CanGoToPoint` | 每次调用 `new NavMeshPath()` | 中 |
| `HearingInputClass` | `SoundDataToReactTo.TrimExcess()` 触发不必要的内存重新分配 | 中 |
| `CoverFinderComponent.FindCoverLoop` | `new WaitForSeconds()` 每次协程恢复重新分配 | 低 |
| `List<>.Sort` 使用 Comparison 委托 | .NET Framework 4.7.1 中产生装箱分配 | 低 |

### 6.3 严重性能 Bug

**Bug 1: 尸体障碍物 RemoveAt 索引错误**

**文件**: `Components/BotManagerComponent.cs:178-183`
```csharp
foreach (var index in IndexToRemove) {
    DeadBots.RemoveAt(index);  // 正向顺序移除导致索引错乱
}
```
当移除索引列表为 `[0, 2]` 时，移除索引 0 后列表长度变化，移除索引 2 会移除错误的元素。应改为从高索引到低索引遍历。

**Bug 2: `EncumberedPatch` 影响全局 `MovementContext.IsAI`**

**文件**: `Patches/MovementPatches.cs:99-112`
```csharp
public static bool Patch(ref bool __result) {
    __result = false;
    return false;  // 影响所有 Player，不仅 SAIN Bot
}
```
可能影响真人玩家的 `IsAI` 判断。如果 EFT 某处代码用 `IsAI` 区分玩家和 AI（而非 `!IsAI` 判断真人），可能导致行为错误。

**Bug 3: `SAINNoBushESP` 作为 MonoBehaviour 始终激活**

每个 Bot 都有一个 `SAINNoBushESP` 组件附加到 GameObject，即使在非战斗状态也参与 Unity 的 Update 循环。20 个 Bot = 20 个额外的 MonoBehaviour 组件始终运行。建议改为普通 `IBotClass` 实现，纳入 `TickWhenCombatClasses` 批次。

### 6.4 优化建议

| 优先级 | 建议 | 预期效果 |
|---|---|---|
| **高** | 将 `AddNavObstacles` 改为协程降频(每 2-3 秒检测一次) | 减少 Physics 开销 |
| **高** | 修复 `DeadBots.RemoveAt` 索引错误 | 修复功能 Bug + 内存泄漏 |
| **高** | 将 `SAINNoBushESP` 改为 IBotClass 非 MonoBehavior | 减少 Unity 组件开销 |
| **中** | 复用 `NavMeshPath` 实例(全局池) | 减少 GC 分配 |
| **中** | 移除 `TrimExcess()` 调用 | 减少内存重新分配 |
| **中** | 覆盖查找使用空间分区(类似 Physics.OverlapSphereNonAlloc) | 减少中央听觉分发遍历 |
| **低** | 引入"感知质量级别"，远处敌人更新降频 | 减少感知系统开销 |
| **低** | 将 `[Conditional("DEBUG")]` 属性应用于 StringBuider 相关代码 | 减少条件判断开销 |

---

## 七、已知问题与潜在 Bug 汇总

### 7.1 严重级别

| Bug | 文件 | 描述 |
|---|---|---|
| DeadBots RemoveAt 索引错乱 | `Components/BotManagerComponent.cs:178-183` | 正向顺序移除导致索引错误，尸体 NavMeshObstacle 管理混乱 |
| EncumberedPatch 全局影响 IsAI | `Patches/MovementPatches.cs:99-112` | 对所有 Player 返回 false，可能影响真人玩家物理/碰撞 |
| CanBeSnappedPatch 全局影响 | `Patches/MovementPatches.cs:117-130` | 禁用所有 Player 的 CanBeSnapped，可能影响门交互定位 |

### 7.2 中等级别

| Bug | 文件 | 描述 |
|---|---|---|
| 大量 #if DEBUG 预处理 | 全代码 | 大量条件编译块，生产构建无法选择性启用调试 |
| 异常处理模式吞噬细节 | 多个文件 | `catch(Exception ex) { LogError; return false; }` 导致部分功能静默失败 |
| Static 事件订阅可能内存泄漏 | `CoverFinderComponent.cs:249-262` | 静态构造函数订阅事件，即使 Bot 未生成也存在 |
| 空引用风险 | 多处 | `GoalEnemy` / `BotSpawnController.Instance` 等可能为 null 的访问 |

### 7.3 低风险

| 问题 | 描述 |
|---|---|
| 魔法数字未提取 | 大量内联常量(如 `ObstacleRadius = 1.5f`, OverlapBox 尺寸 `35x5x35`) |
| `SetDecision` 方法未被使用 | `BotDecisionManager.SetDecision(FSainBotDecision)` 完整实现但未被调用 |
| 跨帧协程状态共享 | CoverFinder 协程中 `CoverPoints` 列表在 yield 期间可能被外部读取 |

---

## 八、安装说明

### 8.1 要求

- SPT 3.11.4
- [BigBrain v1.3.2](https://hub.sp-tarkov.com/files/file/1219-bigbrain/) (DrakiaXYZ)
- [Waypoints v1.7.1](https://hub.sp-tarkov.com/files/file/1119-waypoints-expanded-navmesh/) (DrakiaXYZ)

### 8.2 安装步骤

1. 确认 SPT 版本为 3.11.4
2. 安装 BigBrain 和 Waypoints
3. 将 SAIN 压缩包内容解压到 SPT 安装目录
4. 进入游戏主菜单，按 F6 确认 SAIN GUI 可用

---

## 九、技术架构评分 (S.P.E.C.I.A.L.)

| 属性 | 评分 | 说明 |
|---|---|---|
| **S**trength (性能) | 6/10 | GC 分配和缩放架构需优化 |
| **P**erception (错误处理) | 8/10 | 异常处理全面，错误恢复机制健壮 |
| **E**ndurance (可靠性) | 7/10 | 核心逻辑可靠，存在少量竞态和索引 Bug |
| **C**harisma (可读性) | 8/10 | 代码组织清晰，命名规范，架构文档化程度高 |
| **I**ntelligence (算法) | 9/10 | 决策树结构清晰，感知系统细腻 |
| **A**gility (响应速度) | 6/10 | 高频更新路径可优化 |
| **L**uck (边界覆盖) | 7/10 | 多数边界情况有处理，少量被忽略 |

---

## 十、Moew 兼容版更新 (v4.2.0 — 2026-05-31)

### Phase 1: Bug 修复
- **震聋机制修复**: `_BotDeafedTime` 比较方向修正
- **对话声音识别修复**: 非枪声传入正确列表
- **定位精度梯度修复**: ratio 括号修正
- **NoBushESP 组件标准化**: 基类修正确保生命周期注册

### Phase 2: 感知公平性
- **转向梯度误差**: 被击中转向精度随距离递减，连续被压制提升定位
- **弹着点分级误差**: 三阶分级，连续命中缩小范围
- **倍镜视觉分级**: 无镜 80m+ 发现极难，8x 镜有效视距 350m+
- **声音定位倍率**: 高倍镜枪声更难定位
- **DoorOpener 退后**: 开门前退后减少穿门

### Phase 3: 战斗行为增强
- **空仓切副武器**: 主武器弹尽自动切换手枪
- **掩体战术换弹**: 优先找掩体再换弹
- **小队阵亡反应**: 队友死亡语音 + 行为调整
- **战后恢复**: 自动治疗 + 补充弹药
- **击杀确认**: 倒地敌人 2s 瞄准确认
- **受伤跛行**: 腿部骨折 60% 移速禁止冲刺
- **LootingBots 整合**: 搜刮威胁中断 + 安全就位 + 警戒轮换 + 战后搜刮 + 估价缓存

### Phase 4: 战术深度
- **闪光弹战术**: 近距离室内敌人概率投掷
- **小队角色分配**: 狙击/突击/支援自动分配
- **兴趣点系统**: 交战/阵亡位置标记，和平状态探索
- **冲刺限制**: <10m/被压制/腿伤/濒死不冲刺

### Phase 5: 武器隐蔽值扩展
- **装备隐蔽系统重构**: 移除全部硬编码，改为纯 JSON 驱动
- **武器视觉暴露**: 长枪管/重型武器增加远距离被发现概率（狙击 0.70/机枪 0.65），F6 可调
- **武器听觉暴露**: 重型武器增加移动噪音（机枪 1.30/手枪 0.90 更安静），F6 可调
- **F6 "添加新装备条目"**: 装备隐蔽值 Tab 新增自定义条目按钮

### Phase 6: 手雷躲避系统 (Grenade Dodge)
- **智能手雷躲避**: 激活 `AvoidGrenade` 死代码，实现 13 维度手雷威胁响应（时间/距离/类型/掩体/垂直楼层/Squad协同）
- **手雷类型分化**: 破片反向跑+掩体，闪光转身不看，烟雾移出烟雾区，VOG 立即扑倒
- **安全点寻路**: 9方向×3距离 NavMesh 扇形采样，掩体检测带碰撞体尺寸过滤
- **Squad 广播**: 队友检测到手雷后广播落点坐标，30m 内其他成员暂停前进
- **个性差异化**: GigaChad 可设 10% 概率硬扛，Rat/Coward 跑更远反应更快
- **全局开关**: `GrenadeSettings.ENABLED`，关闭即完全恢复 EFT 原版 BewareGrenade 行为

### Phase 7: 战斗逻辑全面优化 (v4.3.0 — 2026-05-31)

基于代码库三模型交叉审阅，修复 10 项战斗逻辑问题:

- **MoveToEngage 激活**: `shallMoveToEngage` 从死代码恢复，Bot 超出射程时主动推进
- **AggressionMultiplier 差异化**: 所有个性从统一 1.0 改为 2.0~0.3 分级，搜索速度/坚守时间/冻结时长按个性缩放
- **Regroup 小队集结**: `shallRegroup` 解除注释，散开 Bot 自动归队
- **室外 Freeze**: Rat/SnappingTurtle 室外听到敌人后先跑向掩体再蹲守
- **枪声 10% 概率漏听**: 模拟注意力不集中或环境噪音遮蔽
- **战后恢复延长**: 10s→30s，手术中的 Bot 不被中断
- **Holster 武器切换**: SelfAction 侧统一检查两个副武器槽位
- **手雷爆炸即时过期**: 手雷销毁后立即清除威胁状态
- **狗斗退出延迟**: 0.5s 最小持续时间锁防止频繁切换
- **LootingBots 武器切换分级**: Boss 40% → Scav 80% 五级分级
- **LootingOverwatch 精确化**: 新增 IsBotLooting API 取代启发式判断

> **总计 (v4.3.0)**: ~50 文件 / 0 编译错误 / F6 GUI 完全可控
>
> v4.2.0 Phase 1-6 详情见 `CHANGELOG.md`

---

## 十一、开发信息

- **原始作者**: Solarint
- **兼容版维护**: 针对 SPT 3.11.4 版本
- **代码语言**: C# (.NET Framework 4.7.1) + TypeScript (服务端)
- **前置源代码**: 见 `前置MOD的源代码/` 目录
  - `SPT-BigBrain-1.3.2/` -- BigBrain 完整源码
  - `SPT-Waypoints-1.7.1/` -- Waypoints 完整源码

> [VAULT-TEC 备注] 本 README 基于完整代码库逆向工程分析编写。SAIN 涉及约 100 个 Harmony Patch、40+ 子组件、6 层行为系统、28 种声音类型、18 种战斗决策。Vault-Tec 不对任何辐射泄漏（即 bug）、数据腐化（即内存泄漏）或食尸鬼化（即未捕获异常）负责。Preparing for the Future!
