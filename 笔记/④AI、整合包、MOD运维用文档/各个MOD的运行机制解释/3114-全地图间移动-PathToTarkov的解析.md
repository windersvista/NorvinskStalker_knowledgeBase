# Path To Tarkov 运行逻辑文档

> 适用版本：SPT 3.11.4 | PTT 对应版本

---

## 1. 项目概述

Path To Tarkov（以下简称 PTT）是一个 SPT（Single Player Tarkov）开放世界模组，通过改造游戏的所有撤离点，将《逃离塔科夫》的全部地图连接成一个无缝的开放世界网络。玩家不再仅仅是进入 raid、撤离、返回藏身处，而是从一个地图撤离后"停留"在塔科夫世界中的某个位置，并可以从该位置继续探索相邻地图。

PTT 采用双架构设计：

- **服务端（src/）**：TypeScript 编写，作为 SPT 服务器模组运行，负责战局逻辑、地图生成拦截、脱战位置持久化、仓库和商人管理。
- **客户端（PTT-Plugin/）**：C# 编写，基于 BepInEx 插件框架，通过 Harmony 补丁修改游戏客户端行为，处理 UI 交互和提取/转移逻辑。
- **Fika 多人模块（PTT-Fika/）**：独立扩展程序集，通过事件桥（FikaBridge）与核心插件通信，提供多人模式下转移投票、网络同步功能。

---

## 2. 核心概念：脱战位置（Offraid Position）

PTT 最核心的设计概念是"脱战位置"（Offraid Position）。每一次 raid 结束后，玩家的 PMC 不会自动回到藏身处，而是根据使用的撤离点被设定到一个具名的世界地图位置。

一个脱战位置定义以下内容：

- **可进入的地图**：从该位置出发可以 infiltrate（渗透）哪些地图。
- **使用的出生点**：进入每张地图时，玩家具体在哪个坐标出生。
- **激活的仓库**：默认主仓库是否可用，抑或切换为某个副仓库。
- **可用的商人**：哪些商人开放交易、保险、维修和医疗。
- **藏身处状态**：是否可访问藏身处。
- **回复（regen）配置**：脱离战局时的水分、能量、健康回复是否生效。

脱战位置信息存储在玩家档案的 `profile.PathToTarkov.offraidPosition` 字段中，每次游戏中都会从该字段读取当前位置。

---

## 3. 服务端架构（src/）

### 3.1 启动流程

入口 `mod.ts` 中的 `PathToTarkov` 类实现了 `IPreSptLoadMod` 和 `IPostSptLoadMod` 接口。启动流程如下：

1. **preSptLoad**：读取 `UserConfig.json5` → 根据 `selectedConfig` 加载对应的 `config.json5` → `processConfig()` 处理配置（规范化副仓库、预处理自动转移、处理 Ground Zero 高低等级镜像）→ 加载 `shared_player_spawnpoints.json5` 和 `additional_player_spawnpoints.json5` → 合并生成完整的 `SpawnConfig`。
2. **创建核心对象**：`EventWatcher`（拦截战局生命周期事件）、`EndOfRaidController`（战后处理）、`PathToTarkovController`（地图/仓库/商人/跳蚤市场控制）。
3. **注册自定义 HTTP 路由**：包括 `/PathToTarkov/CurrentLocationData`（客户端获取当前地图的撤离目标）和 `/PathToTarkov/version`（版本查询）。
4. **postDBLoad**：预设跳蚤市场全局配置。
5. **postSptLoad**：初始化商人可用性服务、注册副仓库模板、注入多语言提示文本、写入脱战位置显示名称，并可选择暴露旧版全局 API。

### 3.2 战局生命周期管理（event-watcher.ts）

`EventWatcher` 负责拦截四个关键事件点，通过 `RaidCache`（按 sessionId 索引）追踪每个玩家会话的状态：

- **`/client/game/start`**：玩家登录游戏 → 初始化 RaidCache → 调用 `initPlayer()`（设置 raid 内限制、初始化仓库、修正可重复任务）→ 执行 `executeOnStartAPICallbacks`。
- **`/client/game/profile/create`**：新建 PMC 角色 → 同上逻辑。
- **`MatchController.startLocalRaid`**：战局启动 → `afterResolution` 注入覆盖方法。关键操作：
  - 记录 `isPlayerScav` 和 `currentLocationName` 到 RaidCache。
  - 调用 `syncLocationBase()` 对 `locationBase` 进行原地变异：替换出生点、替换撤离点、处理转移起点。
- **`MatchCallbacks.endLocalRaid`**：战局结束 → 从 `data.results.exitName` 中解析复合撤离名称 → 写入 RaidCache（`exitName`、`targetOffraidPosition`、`transitTargetMapName`、`transitTargetSpawnPointId`）→ 恢复原始 `exitName`（避免 SPT 核心无法识别自定义撤离名称）→ 调用 `EndOfRaidController.end()`。

RaidCache 在以下情况下**不会重置**：当上次战局以 `Transit`（转移）状态结束时，这意味着玩家正在进行跨图转移，下一个战局的 RaidCache 会保留 transit 目标信息。

### 3.3 地图生成拦截（path-to-tarkov-controller.ts）

`PathToTarkovController` 是服务端最复杂的类，通过 `overrideControllers()` 对多个 SPT 控制器进行猴子补丁：

#### `LocationController.generateAll` 覆盖

`createGenerateAll()` 生成一个包装函数，在每次生成地图列表时：

1. 从玩家档案获取当前 `offraidPosition`。
2. 遍历所有地图，根据 `config.infiltrations[offraidPosition]` 判断哪些地图应解锁/锁定。
3. 对每张解锁的地图调用 `syncLocationBase()`，依次执行：
   - **`updateSpawnPoints()`**：清除所有玩家出生点，根据 `infiltrations[offraidPosition][mapName]` 配置的出生点 ID 从 `spawnConfig` 中读取坐标，调用 `createSpawnPoint()` 创建新的 `SpawnPointParams`。
   - **`updateSpawnPointsForTransit()`**：当 RaidCache 中存在 `transitTargetMapName` 和 `transitTargetSpawnPointId` 时，仅保留目标转移出生点。
   - **`updateLocationBaseExits()`**：用 `config.exfiltrations[mapName]` 中定义的撤离点替换原地图的所有出口，移除原版出口条件，保证玩家只能通过 PTT 配置的撤离点离开。
   - **`updateLocationBaseTransits()`**：如果 `enable_all_vanilla_transits` 为 false，禁用所有原版转移点。

#### `DataCallbacks` 覆盖

三个关键回调被覆盖：

- **`getTemplateItems`**：根据当前脱战位置，动态调整副仓库模板的尺寸（`cellsV`）。
- **`getHideoutAreas`**：根据当前脱战位置启用/禁用藏身处各区域。
- **`getGlobals`**：动态控制脱战后回复效果（hydration/energy/health）以及跳蚤市场可用的最小等级。

### 3.4 战后处理（end-of-raid-controller.ts）

`EndOfRaidController.end()` 接收来自 EventWatcher 的 `EndOfRaidPayload` 并根据策略分发：

| 条件 | 行为 |
|------|------|
| playerIsDead（exitName 为空） | 调用 `onPlayerDies()`，若 `resetOffraidPositionOnPlayerDeath` 为 true，则将脱战位置重置为 `respawn_at` 或 `initial_offraid_position` |
| isPlayerScav 且 `playerScavMoveOffraidPosition` 为 false | Scav 不影响 PMC 脱战位置，直接返回 |
| `newOffraidPosition` 不为空 | 调用 `onPlayerExtracts()` → 更新仓库和商人 → 持久化 |
| `isTransit` 为 true | 仅记录日志，RaidCache 保留 transit 目标供下一场战局使用 |

### 3.5 复合退出名称解析（exfils-targets.ts）

PTT 通过复合退出名称（Compound Exit Name）在客户端和服务端之间传递结构化的撤离/转移数据。格式规则：

```
# 普通撤离（提取到脱战位置）
<ExitName>.<OffraidPosition>
示例: Gate 3.MY_OFFRAID_POSITION

# 转移（前往另一张地图的特定出生点）
<ExitName>.<TargetMapName>.<TargetSpawnPointId>
示例: Gate 3.bigmap.SPAWN_A
```

`parseExfilTargetFromExitName()` 按 `.` 分割字符串：
- 1 段：纯退出名，无附加信息 → EventWatcher 回退到 `handleRegularExtracts()` 从配置中查找。
- 2 段：退出名 + 脱战位置。
- 3 段：退出名 + 目标地图名 + 目标出生点 ID（转移）。

`parseExilTargetFromPTTConfig()` 用于解析配置文件中单段（脱战位置）或双段（地图.出生点）的目标格式。

### 3.6 多仓库系统（stash-controller.ts）

PTT 实现了动态仓库切换，关键机制：

1. **初始化**：在 `postSptLoad` 时，`initSecondaryStashTemplates()` 读取 `config.hideout_secondary_stashes`，克隆标准仓库模板（`566abbc34bdc2d92178b4576`），为每个副仓库生成唯一的 MongoID、GridID 和 TemplateID，注册到数据库的 `templates.items` 中。

2. **`EMPTY_STASH`**：始终注册的空仓库（尺寸为 0），当没有副仓库匹配时作为回退。

3. **`updateStash()`**：每次脱战位置改变时执行：
   - 检查 `mainStashAccessVia` 是否匹配当前脱战位置（同时受 `multistash` 开关控制）。
   - 如果主仓库可用：将玩家 `Inventory.stash` 设回原始主仓库 ID。
   - 如果主仓库不可用：搜索第一个 `access_via` 匹配当前脱战位置的副仓库，设置 `Inventory.stash` 为该副仓库 ID，并在物品列表中追加仓库 item。
   - 调用 `setInventorySlotIds()` 将所有非活跃副仓库的物品标记为 `ptt_locked_stash`（锁定槽位），防止在脱战菜单中交互。

4. **`getStashSize()`**：客户端请求模板时，告知副仓库的垂直格数。

5. **`getHideoutEnabled()`**：主仓库不可用时同步禁用藏身处。

### 3.7 商人控制（traders-controller.ts）

`TradersController` 在 `initTraders()` 中执行一次初始化，在 `updateTraders()` 中每次脱战位置变化时执行：

- 初始化阶段：将所有配置中出现的商人设为 `unlockedByDefault = false`，覆盖商人的保险/维修/治疗配置。
- 更新阶段：遍历 `traders_config`，对每个商人检查：
  - `tradersAccessRestriction` 全局开关：关闭则所有商人解锁。
  - 使用 `checkAccessVia()` 判断商人的 `access_via` 是否匹配当前脱战位置。
  - 额外检查 `TradersAvailabilityService`：该服务基于玩家已完成的任务判断商人是否已解锁（例如 Jaeger 需要完成介绍任务）。
  - 设置 `TradersInfo[traderId].unlocked`。

### 3.8 跳蚤市场控制

跳蚤市场有三种模式，通过 `UserConfig.gameplay.fleaMarketMode` 配置：

- **`everywhere`**：所有位置可用，受 `fleaMarketMinLevel` 等级限制。
- **`disabled`**：全局禁用，将最低等级设为 99。
- **`location_based`**：按脱战位置动态控制，读取 `traders_config.ragfair.access_via`。

实现分两层：`postDBLoad` 中 `setEarlyRagFairConfig()` 预设初始值，`createGetGlobals()` 在每次玩家请求全局配置时动态覆盖。此外 `overrideRagfairRoutes()` 对 `RagfairCallbacks` 的 `search`、`addOffer`、`extendOffer`、`getMarketPrice`、`getFleaPrices` 等方法逐一覆写，确保在每次跳蚤市场操作前临时更新全局配置。

---

## 4. 客户端架构（PTT-Plugin/）

### 4.1 插件入口（Plugin.cs）

`Plugin` 类继承 `BaseUnityPlugin`，在 `Awake()` 中的执行顺序：

1. 向服务端发起版本请求，验证 PTT 是否已安装/卸载。
2. 检测 Fika 和 InteractableExfilsAPI 依赖。
3. 注册 12 个 Harmony 补丁，覆盖游戏 UI 和后端行为。
4. 通过反射加载 `PTT-Fika` 模块（如 Fika 存在）。
5. 初始化 `CurrentLocationDataService` 用于与服务端通信。

### 4.2 提取点系统

**`ExfiltrationPointAwakePatch`**：追踪所有 `ExfiltrationPoint.Awake()` 调用，缓存提取点实例列表。`DisableInvalidExfils()` 遍历这些实例，检查 `CurrentLocationDataService.IsExfiltrationPointEnabled()`，对未在 PTT 配置中的提取点执行全方位禁用：销毁 `CustomExfilTrigger` 组件、禁用 GameObject、禁用所有碰撞体、设置状态为 `NotPresent`。

**`InitAllExfiltrationPointsPatch`**：覆盖 `ExfiltrationControllerClass.InitAllExfiltrationPoints()`。在初始化后立即调用 `ApplyExfilFiltering()`，该函数：
1. 获取场景中所有 `ExfiltrationPoint`。
2. 分别处理 PMC 和 Scav 提取点。
3. 仅保留 `CurrentLocationDataService` 中记为 enabled 的提取点。
4. 其余提取点被彻底禁用。

**`ScavExfiltrationPointPatch`**：使 Scav 专用提取点对 PMC 也可用，扩展可用的转移/撤离选项。

### 4.3 战后数据传递

**`CurrentExfilTargetService`**：静态单例，保存玩家在当前 raid 中选择的撤离目标。在 `CustomExfilService.ExtractTo()` 或 `TransitTo()` 中调用 `SaveExfil()` 存储，在 `LocalRaidEndedPatch` 的 Prefix 中调用 `ConsumeExitName()` 消费。

**`LocalRaidEndedPatch`**：拦截战局结束方法，在 SPT 处理前（Prefix）将 `CurrentExfilTargetService.ConsumeExitName()` 返回的复合退出名注入到 `results.exitName` 中。这样 SPT 的 `MatchCallbacks.endLocalRaid` 就会收到 PTT 格式的退出名，服务端随后按 `parseExfilTargetFromExitName()` 解析。

### 4.4 提取/转移执行（CustomExfilService）

- **`ExtractTo()`**：非 Fika 模式下，调用 `LocalGame.Stop(player.ProfileId, ExitStatus.Survived, exitName, delay)` 以自定义退出名结束战局。Fika 模式下委托给 `FikaBridge.TransitTo()`。
- **`TransitTo()`**：通过 `Transit.Create()` 构建一个 `TransitPoint`，然后使用原版 `TransitControllerAbstractClass.Transit()` 启动转移。使用 `DelayedAction` 延迟回调以防止 Unity 的 `ManualUpdate` 嵌套错误。
- **`CancelTransitVote()`**：Fika 模式下取消投票。

### 4.5 UI 系统

**`ExfilPrompt`**：实现 `InteractableExfilsAPI` 的 `ICustomExfilPrompt` 接口。当玩家进入提取区域时，`Render()` 方法被反复调用，返回一个三阶段交互流：

1. **选择阶段**：从 `CurrentLocationDataService.GetExfilTargets()` 获取当前提取点的所有目标，生成 `CustomExfilAction` 列表。每个目标代表一个"提取到 X"或"转移到 Y"的操作。
2. **确认阶段**：选中后进入确认步骤（显示"Confirm"和"Cancel"操作）。
3. **执行阶段**：确认后执行对应的 `ExtractTo()` 或 `TransitTo()`。

提示模板通过 `PTT_TRANSITS_PROMPT_TEMPLATE` 和 `PTT_EXTRACTS_PROMPT_TEMPLATE` 多语言键值对自定义。

**`ExfilTooltip`**：在提取点 UI 悬浮提示中渲染额外信息，包括：
- 可前往的下一个地图列表（绿色文字）。
- 可在该脱战位置访问的商人列表（橙色文字）。

数据来源为 `ExfilTarget.nextMaps` 和 `ExfilTarget.nextTraders`，由服务端在构建 `CurrentLocationDataResponse` 时计算。

### 4.6 与服务端通信

`CurrentLocationDataService` 在 `RaidStarted()` 时调用 `FetchExfilsTargetsForCurrentLocation()`，向服务端路由 `/PathToTarkov/CurrentLocationData` 发送 HTTP 请求（包含当前 `locationId`），获得该地图所有配置撤离点及其目标数据。响应体 `CurrentLocationDataResponse` 结构如下：

```json
{
  "exfilsTargets": {
    "Gate 3": [
      {
        "exitName": "Gate 3",
        "isTransit": false,
        "offraidPosition": "CUSTOMS_WAREHOUSE",
        "nextMaps": ["bigmap", "woods"],
        "nextTraders": ["54cb50c76803fa8b248b4571"]
      },
      {
        "exitName": "Gate 3",
        "isTransit": true,
        "transitMapId": "55f2d3fd4bdc2d5f408b4567",
        "transitSpawnPointId": "SPAWN_CUSTOMS_ROAD",
        "nextMaps": [],
        "nextTraders": []
      }
    ]
  }
}
```

---

## 5. Fika 多人集成（PTT-Fika/）

### 5.1 桥接模式

PTT 核心插件通过 `FikaBridge` 静态类定义了事件委托，PTT-Fika 模块（`PTT-Fika.dll`）以反射方式加载并订阅这些事件。这样核心插件无需直接引用 Fika 程序集即可实现多人支持。

### 5.2 转移投票系统（TransitVoteService）

多人模式下，队友之间需要"投票"决定使用哪个撤离目标。`TransitVoteService` 的工作流程：

1. 玩家在提取区域选择目标 → `VoteForExfil()` 被调用。
2. 如果是单人游戏或只剩一名真人玩家，自动跳过投票直接执行。
3. 多人模式下，投票通过 `PlayerVotedForExfilTargetPacket` 网络包同步。
4. 服务端主机（Host）监控所有玩家投票状态，`IsVoteSuccess()` 检查所有真人玩家是否投票且目标一致。
5. 投票通过后，主机发送 `PerformExfilPacket` 给所有客户端，所有人同时执行 `PerformLocalExfil()`。
6. 如果玩家主机死亡，`OnHostPlayerDead` 自动禁用转移投票并通知所有客户端。

### 5.3 网络包

`PTT-Packets/` 项目定义了三个网络包：

- `PlayerVotedForExfilTargetPacket`：玩家投票或取消投票。
- `PerformExfilPacket`：服务器通知所有客户端执行撤离。
- `DisableTransitVotePacket`：服务器通知投票被禁用。

---

## 6. 数据流全景

以下是一个完整的 raid 循环，展示了 PTT 各模块的协作：

### Step 1：游戏启动

```
玩家登录 → SPT 触发 /client/game/start
  → EventWatcher.initRaidCache(sessionId)
  → PathToTarkovController.initPlayer(sessionId)
      → changeRestrictionsInRaid()         [设置 raid 内限制]
      → stashController.initProfile()       [检测并持久化主仓库 ID]
      → fixRepeatableQuestsForProfile()     [移除因商人锁定导致不可用的重复任务]
      → updateOffraidPosition()             [读取/初始化脱战位置，切换仓库和商人]
```

### Step 2：战局创建

```
玩家选择地图进入 raid
  → MatchController.startLocalRaid()
      → 原始方法执行后，PTT 拦截响应
      → syncLocationBase(locationBase, sessionId)
          → updateSpawnPoints()              [替换玩家出生点]
          → updateLocationBaseExits()        [替换撤离点]
          → updateLocationBaseTransits()     [可选禁用原版转移]
      → 记录 isPlayerScav / currentLocationName
```

### Step 3：客户端初始化

```
客户端加载战局 → Plugin.RaidStarted()
  → CurrentLocationDataService.Init()
      → HTTP GET /PathToTarkov/CurrentLocationData
          → 服务端调用 getExfilsTargets() 计算所有撤离目标
          → 返回 exfilsTargets（包含 offraidPosition / transit 信息）
  → InitAllExfiltrationPointsPatch.ApplyExfilFiltering()
      → 只保留 PTT 配置中存在的提取点
      → 禁用非配置提取点的交互
  → CurrentExfilTargetService.Init()         [重置撤离目标缓存]
```

### Step 4：战局中的交互

```
玩家接近提取点
  → InteractableExfilsAPI 检测到玩家进入区域
  → ExfilPrompt.Render() 被调用
      → CurrentLocationDataService.GetExfilTargets(exfil)
      → 显示可用目标列表
  → 玩家选择目标 → 确认
      → CustomExfilService.ExtractTo() / TransitTo()
          → CurrentExfilTargetService.SaveExfil(exfilTarget)
          → LocalGame.Stop() / TransitControllerAbstractClass.Transit()
```

### Step 5：战局结束

```
SPT 触发 MatchCallbacks.endLocalRaid()
  → PatchPrefix LocalRaidEndedPatch
      → CurrentExfilTargetService.ConsumeExitName()
      → 将复合退出名注入 results.exitName
  → EventWatcher 拦截 endLocalRaid
      → parseExfilTargetFromExitName(results.exitName)
          → 解析出 exitName / targetOffraidPosition / transitTargetMapName / transitTargetSpawnPointId
      → 恢复原始 exitName（去掉复合后缀）
      → 调用原始 endLocalRaid（SPT 正常处理战局结算）
      → runEndOfRaidCallback()
```

### Step 6：战后路由

```
EndOfRaidController.end(payload)
  → 判断玩家是否死亡 / 是否为 Scav / 是否为转移
  → 存活且提取 → PathToTarkovController.onPlayerExtracts()
      → KeepFoundInRaidTweak               [可选：标记装备为战利品]
      → updateOffraidPosition(newOffraidPosition)
          → stashController.updateStash()    [切换仓库]
          → tradersController.updateTraders()[切换商人]
          → saveServer.saveProfile()         [持久化档案]
  → 死亡 → PathToTarkovController.onPlayerDies()
      → 可选重置脱战位置为 respawn_at
```

### Step 7：回到菜单

```
玩家返回主菜单 → 提取 profile/list 请求（SPT 内部）
  → DataCallbacks 覆盖
      → getTemplateItems：使用副仓库尺寸
      → getHideoutAreas：禁用了藏身处
      → getGlobals：脱战后回复和跳蚤市场限制
  → 玩家看到的是新脱战位置下的仓库内容、商人列表和可用地图
```

---

## 总结

Path To Tarkov 通过对 SPT 服务端核心接口的深度拦截和客户端 Unity 行为的 Harmony 补丁，构建了一个完整的"开放世界 Tarkov"体验。其设计精髓在于"脱战位置"这一抽象层——它将地图连接、出生点、仓库、商人和游戏机制全部统一到同一个状态变量之下，使得模组的行为可以在配置文件中灵活定义，而无需修改游戏引擎。双架构（TypeScript 服务端 + C# 客户端）配合事件驱动的 Fika 多人桥接，为 SPT 单机模组提供了一个企业级的开放世界实现参考。
