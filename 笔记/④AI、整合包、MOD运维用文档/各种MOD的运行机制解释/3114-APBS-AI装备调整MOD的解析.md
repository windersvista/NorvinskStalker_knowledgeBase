# Progressive Bot System (APBS) -- 渐进式AI装备系统

> SPT 3.11.x 兼容版本 | 原作者: acidphantasm | 版本: 1.9.4

---

## 一、项目概述

**Progressive Bot System** 是《逃离塔科夫》离线版（SPT）的一个MOD，核心目标是让所有AI Bot的装备水平随玩家等级**动态提升**。

在原版 SPT（以及线上塔科夫）中，Scav（拾荒者）的装备永远是低级喷子、破烂AK，当玩家升到30级以上后，Scav 几乎沦为背景噪音，毫无挑战性。APBS 改变了这一点——通过一个 **8级分层装备池系统（Tier 0-7）**，让所有 AI 的武器、弹药、护甲、配件、外观都随玩家等级动态调整。

```
玩家1级   -> 遇到 Tier 1 敌人 (低级武器/弹药)
玩家30级  -> 遇到 Tier 3-4 敌人 (中高级装备)
玩家60级  -> 遇到 Tier 6-7 敌人 (顶级满改武器)
```

---

## 二、核心架构

### 2.1 MOD 生命周期

APBS 通过 SPT 的三个生命周期钩子介入游戏：

| 阶段 | 文件 | 主要工作 |
|------|------|----------|
| **preSptLoad** | `mod.ts` | 加载配置、注册路由钩子、加载8层装备JSON数据、检查兼容性（QuestingBots/Realism） |
| **postDBLoad** | `mod.ts` | 初始化数据库修改（BotConfigs）、检查所有Bot类型、加载模组导入 |
| **postSptLoad** | `mod.ts` | 初始化黑名单、打印版本信息 |

### 2.2 依赖注入覆盖机制 (DI Override)

APBS 通过 SPT 的 `tsyringe` 依赖注入容器，**替换了9个核心SPT类**，这是它影响AI装备生成的根本机制：

| 自定义类 | 替换的SPT原生类 | 功能 |
|----------|----------------|------|
| `APBSBotGenerator` | `BotGenerator` | 覆盖外观生成（使用分层外观池）、狗牌生成、游戏版本分配 |
| `APBSBotInventoryGenerator` | `BotInventoryGenerator` | 覆盖整个装备栏生成逻辑（装备→武器→战利品） |
| `APBSBotEquipmentModGenerator` | `BotEquipmentModGenerator` | 覆盖配件生成（武器改装配件和装备子配件） |
| `APBSBotWeaponGenerator` | `BotWeaponGenerator` | 覆盖武器生成（武器选择+弹药选择+弹匣生成+改装） |
| `APBSBotLootGenerator` | `BotLootGenerator` | 覆盖战利品生成（背包/口袋/弹挂内物品） |
| `APBSBotLootCacheService` | `BotLootCacheService` | 覆盖战利品缓存（按Bot角色+Tier混合缓存） |
| `APBSPlayerScavGenerator` | `PlayerScavGenerator` | 覆盖玩家Scav生成 |
| `APBSBotGeneratorHelper` | `BotGeneratorHelper` | 覆盖资源随机化逻辑（食物/药品耐久度） |
| `APBSBotLevelGenerator` | `BotLevelGenerator` | 通过 `afterResolution` 钩子补丁Bot等级计算逻辑 |

---

## 三、详细运作逻辑

### 3.1 分层装备系统 (Tier System)

APBS 定义了 **8个装备层级 (Tier 0-7)**，每个层级包含5类JSON数据文件：

```
src/db/
  Tier0_equipment.json   Tier0_mods.json   Tier0_chances.json   Tier0_ammo.json   Tier0_appearance.json
  Tier1_equipment.json   Tier1_mods.json   Tier1_chances.json   Tier1_ammo.json   Tier1_appearance.json
  ...
  Tier7_equipment.json   Tier7_mods.json   Tier7_chances.json   Tier7_ammo.json   Tier7_appearance.json
```

**分层映射表：**

| Tier | 玩家等级 | 等级浮动范围（Bot相对玩家） | 说明 |
|------|----------|---------------------------|------|
| 0 | 任意 | - | "blickyMode" - 裸装模式，Bot只有最基础装备 |
| 1 | 1-10 | -10 ~ +5 | 新手期：低级武器、低级弹药、基础护甲 |
| 2 | 11-20 | -10 ~ +5 | 进阶期 |
| 3 | 21-30 | -15 ~ +7 | 中期 |
| 4 | 31-40 | -20 ~ +10 | 中后期 |
| 5 | 41-50 | -30 ~ +15 | 高等级 |
| 6 | 51-60 | -40 ~ +20 | 准满级 |
| 7 | 61-100 | -79 ~ +20 | 满级/巅峰装备 |

**重要机制：** Bot等级不是固定的，而是围绕玩家等级 ± 浮动范围随机生成。例如玩家30级时，Bot可能是10-40级的任意值，对应的Tier会在1-4之间浮动。

每类JSON数据的内容：

- **equipment.json**: 按Bot角色分类的装备池（USEC/BEAR/Scav/各Boss），包含主武器、副武器、手枪、头盔、护甲、弹挂、耳机、面罩、背包等所有装备槽位的候选物品和权重
- **mods.json**: 武器配件池，按武器TPL ID索引，列出每个配件槽位可选的所有配件
- **chances.json**: 生成概率配置，包含装备槽生成概率、武器配件生成概率、生成数量权重
- **ammo.json**: 弹药池，分为 `pmcAmmo`（PMC弹药）、`scavAmmo`（Scav弹药，不含顶级弹）、`bossAmmo`（Boss弹药）
- **appearance.json**: 外观池，按季节（春夏秋冬）和阵营（USEC/BEAR）提供服装/头部/手部/鞋子的外观选项

### 3.2 完整Bot生成流程

```
Raid开始
  │
  ├─[路由钩子] 捕获玩家等级、地图、时间、是否新档
  │
  └─Bot生成请求
      │
      ├─1. APBSBotLevelGenerator 计算Bot等级
      │    ├─ 获取玩家等级
      │    ├─ 查询Tier浮动范围
      │    ├─ 随机生成Bot等级（玩家等级 ± 浮动值，限制在1-79）
      │    ├─ 计算Tier层级（根据Bot等级查表）
      │    ├─ 处理声望等级（Prestige）
      │    └─ 处理特殊模式（仅Chad/仅菜鸟/blickyMode）
      │
      ├─2. APBSBotGenerator 创建Bot基础数据
      │    ├─ 生成Bot外观（根据Tier+阵营+季节选择服装池）
      │    ├─ 分配游戏版本（标准版/黑边/Unheard等，可加权）
      │    ├─ 开发者名字彩蛋（可配置的SPT贡献者名字列表）
      │    └─ 生成狗牌（根据阵营+版本+声望等级）
      │
      └─3. APBSBotInventoryGenerator 生成装备栏
           │
           ├─3a. 是否启用APBS？否→退回原版生成
           │
           ├─3b. PMC任务系统检查（10%概率分配任务）
           │    └─ 任务会影响武器/配件/装备的选择
           │
           ├─3c. 贫困系统检查（PMC有10%概率降1-3个Tier）
           │
           ├─3d. 生成装备（按特定顺序）
           │    ├─ Pockets（口袋）+ FaceCover（面罩）+ Headwear（头盔）
           │    ├─ Earpiece（耳机）+ ArmorVest（护甲）
           │    │    └─ 无护甲则强制生成TacticalVest（弹挂）
           │    ├─ TacticalVest（弹挂，无护甲时强制生成ArmouredRig）
           │    └─ 护甲板按等级过滤（不同Tier有不同防弹等级概率）
           │
           ├─3e. 生成武器
           │    ├─ 根据Bot角色+Tier+地图远近权重选择武器池
           │    ├─ 选择弹药（根据武器口径从弹药池加权随机）
           │    ├─ 生成配件（递归填充所有配件槽位）
           │    │    ├─ 按武器类型调整配件概率（步枪/狙击/冲锋枪等）
           │    │    ├─ 处理任务指定配件（如Punisher系列任务）
           │    │    ├─ 护木/镜座/消音器/脚架等强制联动规则
           │    │    └─ 无效武器回退到预设
           │    ├─ 填充弹匣+枪膛
           │    ├─ 处理UBGL（下挂榴弹发射器）
           │    └─ 生成额外弹匣+安全箱弹药
           │
           └─3f. 生成战利品
                ├─ 特殊物品 → 医疗 → 药品 → 食物 → 饮料
                ├─ 货币 → 兴奋剂 → 手雷
                ├─ 背包战利品（按卢布价值限制）
                ├─ 弹挂战利品
                └─ 口袋战利品
```

### 3.3 地图远近武器权重系统

配置中的 `mapRangeWeighting` 为每个地图定义了远程/近程武器的概率权重：

```
Woods（森林）:   LongRange=60, ShortRange=40  → 倾向狙击枪/DMR
Factory（工厂）: LongRange=5,  ShortRange=95  → 倾向霰弹枪/SMG
```

Bot生成主武器时，会根据当前地图的权重随机选择 LongRange 或 ShortRange 武器池。

### 3.4 护甲板等级过滤

`plateClasses` 配置为每个Tier的每种Bot类型定义了不同防弹等级护甲板的出现概率。例如：

- **PMC Tier 4**: 3级板 1%, 4级板 50%, 5级板 39%, 6级板 10%
- **Scav Tier 5**: 3级板 85%, 4级板 9%, 5级板 5%, 6级板 1%
- **Boss Tier 1-7**: 统一使用 3级10%, 4级50%, 5级35%, 6级5%

### 3.5 任务Bot系统 (Quest Bot System)

PMC Bot 有10%概率被分配一个"任务"，该任务会影响其装备选择：

- **Fishing Gear**: 强制使用 SV-98 狙击枪 + 指定配件
- **Punisher Part 2**: 强制使用消音器武器
- **Test Drive 系列**: 强制使用特定武器 + 特定配件组合
- **Setup**: 强制使用霰弹枪 + Ushanka帽 + Scav背心
- 等等...共约20个预设任务配置

### 3.6 兼容性

- **QuestingBots**: 如果检测到，会额外注册动态路由钩子来记录QB生成的Bot
- **Realism**: 如果检测到且启用 `Realism_AddGasMasksToBots`，会强制给Bot装备防毒面具
- **SAIN / SWAG+Donuts / LootingBots**: 官方测试过的兼容MOD

---

## 四、配置文件说明

主配置文件 `config/config.json` 包含以下主要配置组：

| 配置组 | 说明 |
|--------|------|
| `compatibilityConfig` | 模组武器/装备/服装/配件开关、初始外观Tier、武器权重、安全守卫 |
| `normalizedHealthPool` | 统一Bot血量（头35/胸85/胃70等）、统一技能等级 |
| `generalConfig` | 武器类型配件概率、大容量弹匣限制、枪托/防尘盖/瞄具强制、枪口概率、护甲板配置、地图权重、模式开关 |
| `pmcBots` | PMC生成开关、武器耐久度、战利品配置、任务系统、声望系统、开发者彩蛋 |
| `scavBots` | Scav生成开关及其各项配置、钥匙配置（全部钥匙/机械钥匙/门禁卡） |
| `bossBots` | Boss生成开关及其各项配置 |
| `followerBots` | Boss护卫生成开关及其各项配置 |
| `specialBots` | 特殊Bot（邪教、Raider、Rogue等）生成开关及其各项配置 |
| `customLevelDeltas` | 自定义等级浮动范围 |
| `customScavLevelDeltas` | 自定义Scav等级浮动范围 |

---

## 五、代码问题与潜在Bug

### 5.1 [严重] 战利品黑名单移除失效

**位置:** `src/Alterations/BotConfigs.ts` 的 `setScavLoot()`, `setBossLoot()`, `setFollowerLoot()`, `setSpecialLoot()` 方法

**问题描述:** 黑名单移除代码使用了错误的方式来删除物品：

```typescript
// 当前代码（有BUG）:
const tacticalVestLootTable = Object.keys(botTable[botType].inventory.items.TacticalVest);
const index = tacticalVestLootTable.indexOf(item);
if (index > -1) {
    tacticalVestLootTable.splice(index, 1)  // 只修改了临时数组，Not修改原对象！
}
```

`Object.keys()` 返回一个**新数组**，`splice` 只修改了这个临时数组的副本，原始的 `botTable[...].inventory.items.TacticalVest` 对象完全没有被修改。

**影响范围:** 所有Bot类型的战利品黑名单功能（Scav/Boss/Follower/Special的 TacticalVest/Pockets/Backpack 三个槽位）完全无效。

**修复方案:**
```typescript
// 正确做法：使用 delete 直接删除对象属性
if (item in botTable[botType].inventory.items.TacticalVest) {
    delete botTable[botType].inventory.items.TacticalVest[item];
}
if (item in botTable[botType].inventory.items.Pockets) {
    delete botTable[botType].inventory.items.Pockets[item];
}
if (item in botTable[botType].inventory.items.Backpack) {
    delete botTable[botType].inventory.items.Backpack[item];
}
```

### 5.2 [中等] 弹药Tier滑动算法逻辑问题

**位置:** `src/Utils/APBSEquipmentGetter.ts` `newTierCalc()` 方法 (第464行)

```typescript
const newTier = (Math.floor(Math.random() * (maxTier - minTier + 1) + minTier)) >= tierInfo
    ? (tierInfo - 1)
    : (Math.floor(Math.random() * (maxTier - minTier + 1) + minTier))
```

**问题:** 这段代码使用了 `>=` 判断，意味着当随机Tier**等于**当前Tier时，也会降级。这种倾向性可能导致弹药降级过于频繁（超过配置的 `slideChance` 概率），因为调用此函数前已经通过了一次 `getChance100(slideChance)` 判断。

### 5.3 [低] `Object.values()` 重复创建数组

**位置:** 多处（`BotEnablementHelper.ts`, `APBSBotWeaponGenerator.ts`, `BotConfigs.ts` 等）

每次调用 `Object.values(PMCBots).includes(botType)` 都会创建一个新数组。在 Bot 生成循环中这些检查被频繁调用。

**优化方案:** 预先创建静态 Set 成员：
```typescript
private static PMC_SET = new Set(Object.values(PMCBots));
// 使用: BotEnablementHelper.PMC_SET.has(botType)
```

### 5.4 [低] TierInformation 中 Tier 7 的 maxLevel 与实际限制不一致

**位置:** `src/Globals/TierInformation.ts` + `src/Generators/ABPSBotLevelGenerator.ts`

Tier 7 配置为 `playerMaximumLevel: 100`，但 `ABPSBotLevelGenerator.apbsGetRelativeBotLevelRange()` 第83行将Bot等级硬限制为 `max >= 79 ? 79`。虽然这是合理的设计（SPT最高79级），但配置中的100与代码中的79不一致，容易引起混淆。

### 5.5 [低] `InstanceManager.getPath()` 反篡改检查无实际作用

**位置:** `src/InstanceManager.ts` 第264-278行

```typescript
const key = "V2F5ZmFyZXI=";  // base64解码后为 "Wayfarer"
const keyDE = Buffer.from(key, "base64")
const contents = fs.readdirSync(modDir).includes(keyDE.toString());
```

此方法检查 mod 目录下是否存在名为 "Wayfarer" 的文件。返回值 `true/false` 从未被使用。这似乎是原作者用来检测MOD是否被篡改的机制，但在当前代码中完全无效。

### 5.6 [低] 深层嵌套循环性能风险

**位置:** `src/ClassExtensions/APBSBotEquipmentModGenerator.ts` `apbsGetModPoolToForceSpecificMods()` 方法

该函数包含4层嵌套的 for 循环迭代配件槽位过滤器树。虽然只在任务Bot生成时调用（约10%的PMC），但每次调用的最坏情况时间复杂度较高。

---

## 六、性能与帧数优化建议

### 6.1 预计算Bot类别查找

将频繁使用的 `Object.values(Enum).includes()` 替换为静态 Set 查找，可将每次检查从 O(n) 降低到 O(1)。

### 6.2 缓存Bot角色→装备池的映射

`APBSEquipmentGetter` 中的大量 switch 语句可以根据 botRole 创建一个 Map 缓存：
```typescript
// 构造函数中一次计算
this.equipmentGetterMap = new Map([
    ["pmcusec", (tier) => tier.pmcUSEC.equipment],
    ["pmcbear", (tier) => tier.pmcBEAR.equipment],
    // ...
]);
```

### 6.3 战利品缓存策略优化

当前 `APBSBotLootCacheService` 按 `botRole + tierNumber` 组合缓存。对于同一次 Raid 中大量生成的同类型Bot，这个缓存是有效的。但 `apbsClearCache()` 在构造函数中调用，每次服务实例化时清空，意味着缓存生命周期较短。可以考虑延长缓存生命周期或是预热常用组合。

### 6.4 减少配件池遍历深度

`apbsGetModPoolToForceSpecificMods()` 中的4层嵌套可以改造为递归函数，并在搜索到目标配件后立即返回，减少不必要的遍历。

---

## 七、文件结构总览

```
Moew-ProgressiveBotSystem/
├── config/
│   ├── config.json          # 主配置文件 (~1100行)
│   └── blacklists.json      # 黑名单配置文件
├── presets/                 # 用户自定义预设文件夹
├── src/
│   ├── mod.ts               # MOD入口 (preSptLoad/postDBLoad/postSptLoad)
│   ├── InstanceManager.ts   # 依赖注入管理器，注册所有自定义类
│   ├── Alterations/
│   │   └── BotConfigs.ts    # 直接修改SPT Bot配置（耐久度/护甲板/NVG等）
│   ├── ClassExtensions/     # 覆盖SPT核心类
│   │   ├── APBSBotGenerator.ts              # Bot基础数据生成
│   │   ├── APBSBotWeaponGenerator.ts        # 武器+弹药+弹匣生成
│   │   ├── APBSBotEquipmentModGenerator.ts  # 配件生成（武器+装备）
│   │   ├── APBSBotInventoryGenerator.ts     # 装备栏总控
│   │   ├── APBSBotLootGenerator.ts          # 战利品生成
│   │   ├── APBSBotLootCacheService.ts       # 战利品缓存
│   │   ├── APBSBotGeneratorHelper.ts        # 资源随机化
│   │   └── APBSPlayerScavGenerator.ts       # 玩家Scav生成
│   ├── Generators/
│   │   └── ABPSBotLevelGenerator.ts         # Bot等级计算（补丁方式）
│   ├── Globals/
│   │   ├── TierInformation.ts  # 8层Tier数据+等级映射表
│   │   ├── ModConfig.ts        # 配置接口定义+读取
│   │   ├── RaidInformation.ts  # 当前Raid状态（地图/时间/玩家信息）
│   │   └── ModInformation.ts   # MOD元信息
│   ├── RouterHooks/
│   │   ├── APBSStaticRouterHooks.ts   # 静态路由钩子（Bot生成/开局/游戏开始）
│   │   └── APBSDynamicRouterHooks.ts  # 动态路由钩子（QuestingBots兼容）
│   ├── Helpers/
│   │   ├── JSONHelper.ts         # JSON数据加载（内置db或预设）
│   │   ├── BotEnablementHelper.ts # Bot启用状态检查
│   │   ├── BotQuestHelper.ts     # 任务系统（~20个预设任务）
│   │   ├── BotLogHelper.ts       # Bot生成日志
│   │   ├── BlacklistHelper.ts    # 装备黑名单处理
│   │   ├── ModdedImportHelper.ts # 模组物品导入
│   │   └── RealismHelper.ts      # Realism MOD兼容
│   ├── Utils/
│   │   ├── APBSTierGetter.ts     # Tier查询工具
│   │   ├── APBSEquipmentGetter.ts # 装备/配件/弹药/外观池查询
│   │   ├── APBSLogger.ts         # 日志工具
│   │   └── APBSTester.ts         # 测试工具
│   ├── InventoryMagGen/          # 弹匣生成策略模式
│   ├── Enums/                    # 枚举定义（Bot类型/日志类型）
│   ├── Interface/                # TypeScript 接口定义
│   └── db/                       # 8层 x 5类 = 40个JSON数据文件
└── ConfigApp/                    # C# Blazor 配置编辑器
```

---

## 八、安装与注意事项

1. **加载顺序:** 必须放在MOD列表的**最后一位**
2. **前置依赖:** 无强制依赖，但推荐配合 SAIN + SWAG+Donuts 使用
3. **兼容SPT版本:** 3.11.x（通过 `package.json` 中的 `sptVersion` 字段控制）
4. **日志:** 生成日志存放在 `user/mods/acidphantasm-progressivebotsystem/logs/` 目录
5. **预设系统:** 将 `usePreset` 设为 `true` 并在 `presets/` 目录下放置自定义JSON文件，可使用自定义装备池

---

## 九、总结

Progressive Bot System 是一个设计精巧的SPT MOD，通过依赖注入覆盖核心生成器的方式，完全接管了AI的装备生成流程。其8层分级系统为游戏提供了平滑的难度曲线，解决了原版高等级玩家缺乏挑战的核心痛点。

**S.P.E.C.I.A.L. 评分:**
- Strength (性能): C -- 大量重复数组创建和复杂嵌套循环影响生成速度
- Perception (错误处理): B -- 有完善的try-catch和多层回退机制
- Endurance (可靠性): B -- 核心功能稳定，但黑名单功能因bug完全失效
- Charisma (可读性): B -- 命名清晰，但部分方法过长（1000+行单文件）
- Intelligence (算法): B -- 分层权重随机设计合理，任务系统有创意
- Agility (响应): C -- 未优化的循环和重复计算影响生成速度
- Luck (边界情况): B -- 有回退到原生/预设的安全机制
