# SPT-LootingBots v1.6.1 (SPT 3.11.4 适配版)

> **为逃离塔科夫离线版（SPT）的AI Bot赋予完整的战局内拾取行为，模拟真实玩家的舔包/搜刮逻辑。**

---

## 目录

1. [项目概述](#1-项目概述)
2. [Mod架构与组成](#2-mod架构与组成)
3. [核心运作逻辑详解](#3-核心运作逻辑详解)
4. [配置参数说明](#4-配置参数说明)
5. [与其他Mod的交互（Interop）](#5-与其他mod的交互interop)
6. [代码质量审查](#6-代码质量审查)
7. [性能优化建议](#7-性能优化建议)
8. [已知Bug与修复建议](#8-已知bug与修复建议)
9. [安装说明](#9-安装说明)

---

## 1. 项目概述

### 1.1 这是什么

LootingBots 是一个为 **SPT（Single Player Tarkov / 逃离塔科夫离线版）** 开发的客户端+服务端双端Mod。它的核心功能是让地图中的AI Bot（SCAV、PMC、Raider、Boss等）在巡逻过程中主动搜索、移动靠近、并拾取战局中的战利品（尸体、容器、散落物品），包括装备对比与替换决策，模拟真实玩家的舔包行为。

### 1.2 解决了什么问题

- **原版游戏**：AI只有极为有限的拾取行为（SCAV偶尔捡尸体主武器，PMC在SPT中开局自带背包战利品）
- **安装本Mod后**：AI会在巡逻间隙主动扫描周围物资，按价值阈值决策拾取，替换更优装备，甚至拆解武器配件

### 1.3 依赖项

| 依赖 | 说明 |
|------|------|
| **SPT-BigBrain** (DrakiaXYZ) | AI大脑框架，允许自定义行为层注入Bot的决策系统 |
| SPT 3.11.x | 目标SPT版本 |
| BepInEx | Unity Mono注入框架 |

---

## 2. Mod架构与组成

项目由三个模块组成：

```
Moew-LootingBot-For-3114/
├── LootingBots/              ← C# 客户端Mod (BepInEx插件)
│   ├── Components/           ← 核心组件
│   ├── Logic/                ← AI行为逻辑层
│   ├── Actions/              ← 数据模型（装备/移动/交换动作）
│   ├── Patches/              ← Harmony补丁
│   └── Utilities/            ← 工具类与缓存
│
├── LootingBotsServerMod/     ← C# 服务端Mod (数据库加载后处理)
│
└── LootingBots-ServerMod/    ← TypeScript 服务端Mod (SPT原生)
```

### 2.1 客户端Mod (LootingBots.dll)

这是Mod的核心，负责所有AI拾取行为的运行时逻辑：

| 组件/文件 | 职责 |
|-----------|------|
| `LootingBots.cs` | 入口点：注册配置、启用Harmony补丁、注入BigBrain自定义层 |
| `LootingLayer.cs` | BigBrain自定义层：决定何时激活扫描/拾取/和平三种行为 |
| `LootingBrain.cs` | 拾取大脑：管理Active目标、执行拾取协程、性能启停控制 |
| `LootFinder.cs` | 战利品扫描器：Physics.OverlapSphere + NavMesh路径检测 |
| `LootingInventoryController.cs` | 库存控制器：装备对比、武器替换、物品拾取决策 |
| `LootingTransactionController.cs` | 交易控制器：封装游戏原生的物品移动/装备/丢弃操作 |
| `ItemAppraiser.cs` | 物品估价器：手册价格或跳蚤市场价格查询 |
| `ActiveBotCache.cs` | 活跃Bot缓存：限制同时进行拾取逻辑的Bot数量 |
| `ActiveLootCache.cs` | 战利品缓存：防止多个Bot同时导航到同一个物品 |
| `FindLootLogic.cs` | 扫描行为逻辑：触发LootFinder扫描 |
| `LootingLogic.cs` | 拾取行为逻辑：导航到目标位置、卡住检测 |
| `PeacefulLogic.cs` | 和平巡逻逻辑：委托给游戏原版巡逻AI |

### 2.2 服务端Mod

两个服务端Mod（C#和TypeScript双版本，功能相同）负责：

- **控制Bot出生时背包/弹挂/口袋中的战利品**：可将PMC和SCAV的出生战利品权重清零
- **全局禁用DiscardLimits**：防止AI丢弃物品时因RMT保护机制抛出异常
- **标记DiscardLimit物品为不可投保**：保持保险机制的正确性

---

## 3. 核心运作逻辑详解

### 3.1 初始化：注入AI大脑

Mod启动时（`LootingBots.Awake()`）：

1. **移除原版拾取层**：通过BigBrain的`BrainManager.RemoveLayer`移除BSG原版的"LootPatrol"和"Utility peace"层
2. **注册自定义层**：为不同Bot类型注册`LootingLayer`，优先级4-13不等（数字越低优先级越高）
   - Scav/突击类 → 优先级4
   - PMC/USEC/Bear → 优先级5
   - 教派战士/祭司 → 优先级13
   - Obdolbs → 优先级11
3. **启用Harmony补丁**：三个补丁确保生命周期正确
   - `RemoveLootingBrainPatch`：Bot销毁时清理LootingBrain组件
   - `CleanCacheOnRaidEndPatch`：战局结束时重置所有缓存
   - `EnableWeaponSwitchingPatch`：修改Bot切换武器的概率配置

### 3.2 行为状态机

每个Bot的LootingLayer在BigBrain框架中以固定频率运行，内部是三态状态机：

```
                    ┌──────────────────────┐
                    │   PeacefulLogic      │  ← 默认：委托原版巡逻AI
                    │   (和平巡逻)          │
                    └──────┬───────────────┘
                           │ ScanTimer到期
                           v
                    ┌──────────────────────┐
                    │   FindLootLogic       │  ← 扫描附近可拾取物
                    │   (战利品扫描)         │
                    └──────┬───────────────┘
                           │ 找到目标
                           v
                    ┌──────────────────────┐
                    │   LootingLogic         │  ← 移动到目标并拾取
                    │   (移动+拾取)           │
                    └──────┬───────────────┘
                           │ 拾取完成
                           v
                    返回PeacefulLogic (重置ScanTimer)
```

**激活条件** (`LootingLayer.IsActive`)：
- Bot处于Active状态
- 不在治疗中（无急救/手术进行中）
- LootingBrain未被性能限制禁用
- 扫描已到期 或 正在拾取中

**终止条件** (`LootingLayer.IsCurrentActionEnding`)：
- 扫描结束但未找到目标
- 拾取完成（ActiveContainer/ActiveCorpse/ActiveItem均为null）

### 3.3 战利品扫描流程 (FindLootLogic → LootFinder)

这是性能最敏感的环节，每次扫描执行以下步骤：

```
1. Physics.OverlapSphereNonAlloc(位置, 最大检测半径, collider数组池, LootMask)
   └─ 一次性检测范围内所有 Interactive/Loot/Deadbody 层对象
   └─ 最大同时检测3000个碰撞体

2. 按距离排序 (ColliderDistanceComparer)

3. 遍历排序后的碰撞体（最多3次"超出范围"计数后提前终止）:
   ├─ 获取组件: LootableContainer / LootItem / Player (corpse)
   ├─ 检查是否已被忽略 (IgnoredLootIds / NonNavigableLootIds / 其他Bot正在使用)
   ├─ 分类判断可拾取性:
   │   ├─ 容器: 类型启用 + 未锁定 + isActiveAndEnabled
   │   ├─ 尸体: 类型启用 + GetPlayer != null (排除静态尸体)
   │   └─ 散落物品: 类型启用 + 非任务物品 + (可搜索物|更好护甲|价值达标且有空间)
   │
   ├─ NavMesh.SamplePosition: 计算可达导航点（含1.5m防穿模padding）
   ├─ IsLootInRange: 通过NavMesh路径距离判断是否在配置的检测范围内
   ├─ IsLootInSight: 可选视线检测（Raycast from LookSensor._headPoint）
   │
   └─ 找到第一个有效目标 → 标记到ActiveLootCache → 设置Active目标 → break

4. finally: 归还collider数组到ArrayPool
```

**关键设计要点**：

- **单次只选一个目标**：遍历到第一个有效目标就break，防止一次扫描占用过多
- **路径距离 vs 直线距离**：使用`BotOwner.Mover.ComputePathLengthToPoint`计算实际导航路径长度，而非简单的欧几里得距离
- **NavMesh防卡**：`GetDestination`方法对容器位置做NavMesh.SamplePosition，再反向padding 1.5m，防止Bot贴容器太近导致抖动
- **Collider池化**：使用`ArrayPool<Collider>.Shared`避免频繁分配大数组

### 3.4 移动导航流程 (LootingLogic)

```
TryLoot() 每帧检查:
├─ 每2秒检查是否到达:
│   ├─ 距离 < 0.85m (XZ平面) 且 高度差 < 0.5m → 开始拾取
│   ├─ 距离 < 6m → 取消冲刺，防止滑铲
│   └─ 未到达 → 站姿全速移动
│
├─ 每4秒发起导航:
│   ├─ 首次导航: BotOwner.GoToPoint(destination) → 检查NavMeshPathStatus
│   ├─ 卡住检测: 每次移动距离变化 < 0.3m 视为卡住
│   ├─ 卡住2次 → 放弃该目标，加入NonNavigableLootIds
│   └─ 超过30次导航尝试 → 放弃该目标
│
└─ 异常捕获：任何异常均记录日志不崩溃
```

**放弃策略**：
- `NonNavigableLootIds`：永久忽略（当前战局内），定期清理机制约2分钟清空
- `IgnoredLootIds`：被Bot成功拾取过的物品ID

### 3.5 物品拾取与装备决策流程

当Bot到达目标后，核心决策链位于 `LootingInventoryController.TryAddItemsToBot`：

```
对每个物品执行:
│
├─ 1. 模拟检视延迟 (ExamineTime / Attention技能值)
│
├─ 2. 中断检查 (IsLootingInterrupted: 行为层被停止)
│
├─ 3. 价值评估: GetItemPrice → CurrentItemPrice
│
├─ 4. 弹匣过滤: 如果不是Bot当前可用武器的弹匣，跳过
│
├─ 5. 装备替换决策 (GetEquipAction):
│   ├─ 武器: 
│   │   ├─ 手枪: 如果没手枪直接装，否则比较价值替换
│   │   ├─ 长枪: 比较Primary/Secondary价值，最优武器始终作为主武器
│   │   └─ Boss不替换武器（自定义AI依赖特定装备）
│   ├─ 背包: 格数更多则替换
│   ├─ 头盔/护甲: 护甲等级更高则替换
│   ├─ 弹挂: 护甲等级更高则替换（如果当前有独立护甲则先丢弃）
│   └─ 替换时先丢旧装备 → 转移旧容器内物品 → 装上新装备
│
├─ 6. 尝试装备: AllowedToEquip + FindSlotToPickUp → MoveItem
│
├─ 7. 尝试拾取到容器: AllowedToPickup + FindGridToPickUp → MoveItem
│   └─ 优先级: 合并已有堆叠 > 找空格
│
├─ 8. 递归搜刮子物品: 对于可搜索物品，先拾取其内部物品
│   └─ 过滤: 锁定格子物品、任务物品、一次性钥匙
│
├─ 9. 武器拆解: 如果武器无法拾取，且CanStripAttachments启用
│   └─ 递归取出所有RaidModdable的非必需配件
│
└─ 10. 无用弹匣丢弃: 武器替换后丢弃不再兼容的弹匣（至少保留2个兼容弹匣）
```

**价值阈值系统**：
- PMC使用独立阈值（默认min:12000₽, max:0即无上限）
- SCAV/Raider/Boss等使用Scav阈值（默认min:5000₽）
- 可用弹匣和金钱无视阈值始终拾取
- 狗牌始终拾取（如果AllowedToPickup）

### 3.6 性能管理机制

为控制帧率影响，Mod内置两级性能限制：

| 机制 | 配置项 | 默认值 | 说明 |
|------|--------|--------|------|
| 最大活跃Bot数 | `MaxActiveLootingBots` | 20 | 同时运行拾取逻辑的Bot上限 |
| 玩家距离限制 | `LimitDistanceFromPlayer` | 0(关闭) | 超过此距离（米）的Bot禁用拾取 |

**性能检查周期**：
- 每3秒检查一次（或取3秒与LootScanInterval的较小值）
- 容量管理：Bot进入活跃缓存（容量未满 + 距离符合）→ 启用；超出容量或超出距离 → 禁用
- 正在拾取中的Bot不会被强制中断（等当前拾取完成后再禁用）

### 3.7 战利品互斥机制 (ActiveLootCache)

防止多个Bot同时导航到同一个物品：

```
ActiveLootCache:
├─ CacheActiveLootId(id, bot): 标记物品正在被使用
├─ IsLootInUse(id): 检查是否有其他Bot在目标该物品
└─ Cleanup(bot): 战局结束时清理/Bot销毁时清理该Bot的所有标记
```

### 3.8 服务端逻辑

服务端Mod在数据库加载后执行：

1. **清空出生战利品**（可选）：
   - `pmcSpawnWithLoot=false`: 清零USEC/Bear的backpackLoot、vestLoot、pocketLoot权重
   - `scavSpawnWithLoot=false`: 清零assault的对应权重
   - 同时关闭PMC背包中刷武器的配置

2. **DiscardLimits处理**：
   - 全局设置`DiscardLimitsEnabled = false`（允许AI丢弃任何物品）
   - 对`DiscardLimit >= 0`且非`IsAlwaysAvailableForInsurance`的物品设置`InsuranceDisabled = true`
   - 防止玩家通过保险机制回收AI丢弃的RMT保护物品

---

## 4. 配置参数说明

所有客户端配置通过F12菜单实时调整。

### 4.1 Loot Finder（战利品查找器）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| Enable corpse looting | 全部类型 | 按Bot类型启用尸体拾取 |
| Detect corpse distance | 80m | 尸体检测路径距离 |
| Enable corpse line of sight check | false | 是否需要视线无遮挡 |
| Enable container looting | 全部类型 | 按Bot类型启用容器拾取 |
| Detect container distance | 80m | 容器检测路径距离 |
| Enable container line of sight check | false | 是否需要视线无遮挡 |
| Enable loose item looting | 全部类型 | 按Bot类型启用散落物品拾取 |
| Detect item distance | 80m | 散落物品检测路径距离 |
| Enable item line of sight check | false | 是否需要视线无遮挡 |
| Debug log levels | Error | 日志级别（None/Error/Warning/Info/Debug） |
| Debug: Show navigation points | false | 渲染导航辅助球体(调试用，正式游玩请关闭) |

### 4.2 Loot Finder (Timing)（时间参数）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| Delay after spawn | 6s | 出生后首次扫描延迟 |
| Loot scan interval | 10s | 扫描间隔 |
| Delay after taking item | 500ms | 拾取物品后的模拟思考延迟 |
| Enable examine time | true | 模拟翻找物品的检视时间 |

### 4.3 Loot Settings（拾取设置）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| Bots always close containers | true | 拾取完毕后关闭容器 |
| Use flea market prices | false | 使用跳蚤市场价格评估（首次启动有额外查询耗时） |
| Calculate weapon value from attachments | true | 按配件价值计算武器总价（比只看底价更准，稍增开销） |
| Allow weapon attachment stripping | true | 无法带走武器时拆卸配件 |
| PMC: Min loot value threshold | 12000₽ | PMC最低拾取价值 |
| PMC: Max loot value threshold | 0(关闭) | PMC最高拾取价值 |
| PMC: Allowed gear to equip | 全部 | PMC可装备的装备类型 |
| PMC: Allowed gear in bags | 全部 | PMC可放入背包的装备类型 |
| Scav: Min loot value threshold | 5000₽ | 非PMC最低拾取价值 |
| Scav: Max loot value threshold | 0(关闭) | 非PMC最高拾取价值 |
| Scav: Allowed gear to equip | 全部 | 非PMC可装备的装备类型 |
| Scav: Allowed gear in bags | 全部 | 非PMC可放入背包的装备类型 |

### 4.4 Performance（性能）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| Maximum looting bots | 20 | 同时运行拾取逻辑的Bot数量上限（0=无限制） |
| Limit looting by distance to player | 0(关闭) | 超过此距离(m)的Bot不运行拾取逻辑 |

### 4.5 服务端配置

`LootingBots-ServerMod/config/config.json`:
```json
{
    "pmcSpawnWithLoot": true,
    "scavSpawnWithLoot": true
}
```
设为`false`可让对应Bot类型不带包内战利品出生，获得更真实的"Bot需要自己搜刮"体验。

---

## 5. 与其他Mod的交互（Interop）

LootingBots 提供了无需硬依赖的反射式互操作接口（`LootingBotsInterop.cs`），其他Mod可以：

| 方法 | 功能 |
|------|------|
| `Init()` | 检测并初始化互操作，返回是否可用 |
| `TryForceBotToScanLoot(BotOwner)` | 强制Bot立即扫描战利品 |
| `TryPreventBotFromLooting(BotOwner, duration)` | 阻止Bot拾取指定时长 |
| `CheckIfInventoryFull(BotOwner)` | 检查Bot背包是否已满 |
| `GetNetLootValue(BotOwner)` | 获取Bot当前战局已拾取总价值 |
| `GetItemPrice(LootItem)` | 使用LB估价器查询物品价值 |

---

## 6. 代码质量审查

### 6.1 架构评价

| S.P.E.C.I.A.L. 属性 | 评分 | 说明 |
|---------------------|------|------|
| Strength（性能） | B | Physics扫描+NavMesh路径计算有优化空间 |
| Perception（错误处理） | B+ | 核心路径有try-catch，但部分边缘情况未覆盖 |
| Endurance（可靠性） | B+ | 缓存/状态管理合理，卡住检测完备 |
| Charisma（可读性） | A | 命名清晰，注释详尽，模块分离好 |
| Intelligence（算法） | A- | 装备对比逻辑详尽，武器替换策略完备 |
| Agility（响应） | B | 状态机设计合理，但每帧尝试拾取可优化 |
| Luck（边界情况） | B- | 部分硬编码参数、null检查遗漏 |

### 6.2 代码亮点

- **BigBrain集成**：合理利用框架能力而非重复造轮
- **三层Action模型**：EquipAction / MoveAction / SwapAction 数据对象清晰分离决策和执行
- **ArrayPool使用**：Collider数组池化减少GC压力
- **卡住检测**：0.3m阈值 + 30次上限 + 2次卡住的三级放弃策略
- **NavMesh防抖padding**：1.5m反向padding解决贴容器抖动问题
- **装备替换链**：弹挂替换→先丢护甲→换弹挂→转移物品，逻辑顺序合理

---

## 7. 性能优化建议

### 7.1 高优先级

**[P1] Boss类型判断的内存分配**

```csharp
// 问题代码 (BotTypes.cs:148)
public static bool IsBoss(WildSpawnType wildSpawnType)
{
    List<WildSpawnType> bosses = new List<WildSpawnType> { ... }; // 每次调用都new
    return bosses.Contains(wildSpawnType);
}
```
**修复**：将List改为static readonly数组或HashSet，避免每次调用分配GC。

**[P1] LootCache.Cleanup 的O(n*m)遍历**

```csharp
// 每次清理遍历全部活跃战利品条目 (LootCache.cs:77-105)
foreach (KeyValuePair<string, BotOwner> keyValue in ActiveLoot) { ... }
```
**优化**：维护一个反向索引 `Dictionary<BotOwner, List<string>>`，清理时直接按Bot查找O(1)。

### 7.2 中优先级

**[P2] Physics扫描频率可降级**

当前默认10秒扫描间隔+每3秒性能检查。如果Bot数量超过30+（如敌人密集的地图），`Physics.OverlapSphereNonAlloc`仍然可能造成帧率尖峰。

**建议**：
- 添加"扫描错峰"机制：每个Bot的扫描时间增加随机偏移（如+-2秒），避免多个Bot同时触发物理查询
- 降低默认扫描间隔为15秒，同时允许用户自行调低

**[P2] 物品估价缓存**

`GetItemPrice` 在单次拾取中可能对同一物品多次调用（TryAddItemsToBot内的递归调用链）。

**建议**：添加短期LRU缓存（TemplateId → price），战局内价格不变，可大幅减少重复查询。

**[P2] TryAddItemsToBot的递归深度**

武器拆解→递归调用TryAddItemsToBot→物品可能又是可搜索物→再递归。虽有限制但可考虑显式深度限制。

### 7.3 低优先级

**[P3] DebugLootNavigation球体泄漏**

```csharp
// GetDestination() 内部 (LootFinder.cs:342)
GameObjectHelper.DrawSphere(center, 0.5f, Color.red); // 从不销毁!
```
每次扫描创建3个调试球体且永不销毁。正式使用时建议加`Destroy(sphere, 5f)`定时清理，或仅在Debug启用时创建。

**[P3] 编译期可优化的属性访问**

多处重复访问 `LootingBots.Xxx.Value`（ConfigEntry），可在方法开头缓存到本地变量。

---

## 8. 已知Bug与修复建议

### BUG-1 [严重] BotStats.SubtractNetValue 运算符错误

**位置**：`LootingBots/Components/LootingInventoryController.cs:47`

```csharp
public void SubtractNetValue(float itemPrice)
{
    NetLootValue += itemPrice;  // BUG! 应该是 -=
}
```

当Bot丢弃装备换取新装备时，`GetSwapAction`中通过`Stats.SubtractNetValue(_itemAppraiser.GetItemPrice(toThrow))`意图扣除旧装备价值，但由于运算符为`+=`，价值不降反升。这会导致Bot的已拾取价值统计虚高，影响`GetNetLootValue`互操作API的准确性。

**修复**：
```csharp
NetLootValue -= itemPrice;
```

### BUG-2 [中等] ItemAppraiser.GetItemMarketPrice 可能抛出 KeyNotFoundException

**位置**：`LootingBots/Components/ItemAppraiser.cs:128`

```csharp
public float GetItemMarketPrice(Item lootItem)
{
    float price = MarketData[lootItem.TemplateId]; // 未TryGetValue
    ...
}
```

当物品的TemplateId不在MarketData字典中时（如某些Mod添加的自定义物品），会抛出`KeyNotFoundException`。虽外层有catch，但会影响物品估价结果（返回0）。

**修复**：
```csharp
MarketData.TryGetValue(lootItem.TemplateId, out float price);
return price;
```

### BUG-3 [低] IsDogtag 类型检查过于宽泛

**位置**：`LootingBots/Utilities/EquipmentTypes.cs:174`

```csharp
public static bool IsDogtag(Item item)
{
    return item is OtherItemClass; // 涵盖大量物品类型，不仅仅是狗牌
}
```

**影响**：可能导致非狗牌物品（如其他OtherItemClass类别的物品）被误判为狗牌，从而绕过硬编码的价值阈值检查。

**修复**：添加更精确的TemplateId或ItemId特征匹配。

### BUG-4 [低] 静态缓存的线程安全隐患

**位置**：`ActiveLootCache.cs` / `ActiveBotCache.cs`

两个缓存类都是静态的且无锁保护。虽然Unity协程在主线程运行，但如果BigBrain框架在任何异步上下文中调用，可能产生竞态条件。

**建议**：添加 `[MethodImpl(MethodImplOptions.Synchronized)]` 或使用`ConcurrentDictionary`。

---

## 9. 安装说明

### 9.1 文件结构

```
SPT/
├── BepInEx/plugins/
│   └── skwizzy.LootingBots.dll           ← 客户端核心DLL
│
└── user/mods/
    ├── Skwizzy-LootingBots-ServerMod/    ← TypeScript服务端Mod
    │   ├── package.json
    │   ├── src/mod.ts
    │   └── config/config.json
    │
    └── LootingBotsServerMod/             ← C#服务端Mod（二选一）
        ├── LootingBotsServerMod.dll
        └── config/config.json
```

### 9.2 安装步骤

1. 确保已安装 **SPT-BigBrain** (https://github.com/DrakiaXYZ/SPT-BigBrain)
2. 将zip包内容解压到SPT根目录
3. TypeScript和C#服务端Mod二选一（功能相同）
4. 启动SPT服务器，确认日志中无LootingBots相关错误
5. 进入战局，F12打开配置菜单调整参数

### 9.3 冲突说明

- 与其他修改 `globals.config.DiscardLimitsEnabled` 的服务端Mod冲突
- 如果PMC丢弃装备时抛出异常，检查DiscardLimitsEnabled是否为false

---

> *"A better future, underground!" — Vault-Tec Corporation*
>
> *本项目为非官方社区Mod，与Battlestate Games及Vault-Tec Corporation无任何关联。*
>
> *原项目作者：Skwizzy | SPT 3.11.4 适配：Moew*
