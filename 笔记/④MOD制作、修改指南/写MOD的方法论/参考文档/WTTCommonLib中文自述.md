# WTT-CommonLib

一个为 SPT 设计的综合性模组库，简化了向《逃离塔科夫》（Escape from Tarkov）添加自定义内容的过程。WTT-CommonLib 自动处理服务器端数据库修改和客户端资源加载——你只需要配置你的内容并调用相应的服务。

## 目录
- [WTT-CommonLib](#wtt-commonlib)
  - [目录](#目录)
  - [功能特性](#功能特性)
  - [安装方法](#安装方法)
  - [快速开始](#快速开始)
    - [关键点：](#关键点)
  - [可用的服务器服务](#可用的服务器服务)
    - [CustomItemServiceExtended (扩展自定义物品服务)](#customitemserviceextended-扩展自定义物品服务)
    - [CustomLocaleService (自定义语言服务)](#customlocaleservice-自定义语言服务)
    - [CustomQuestService (自定义任务服务)](#customquestservice-自定义任务服务)
    - [CustomQuestZoneService (自定义任务区域服务)](#customquestzoneservice-自定义任务区域服务)
    - [CustomVoiceService (自定义语音服务)](#customvoiceservice-自定义语音服务)
    - [CustomHeadService (自定义头部服务)](#customheadservice-自定义头部服务)
    - [CustomClothingService (自定义服装服务)](#customclothingservice-自定义服装服务)
    - [CustomBotLoadoutService (自定义机器人装备服务)](#custombotloadoutservice-自定义机器人装备服务)
    - [CustomLootspawnService (自定义战利品生成服务)](#customlootspawnservice-自定义战利品生成服务)
    - [CustomAssortSchemeService (自定义商店货物方案服务)](#customassortschemeservice-自定义商店货物方案服务)
    - [CustomStaticSpawnService (自定义静态物体生成服务)](#customstaticspawnservice-自定义静态物体生成服务)
    - [CustomHideoutRecipeService (自定义藏身处配方服务)](#customhideoutrecipeservice-自定义藏身处配方服务)
    - [CustomRigLayoutService (自定义战术背心布局服务)](#customriglayoutservice-自定义战术背心布局服务)
    - [CustomSlotImageService (自定义插槽图标服务)](#customslotimageservice-自定义插槽图标服务)
    - [CustomBuffService (自定义增益/减益效果服务)](#custombuffservice-自定义增益减益效果服务)
    - [CustomProfileService (自定义档案服务)](#customprofileservice-自定义档案服务)
    - [CustomWeaponPresetService (自定义武器预设服务)](#customweaponpresetservice-自定义武器预设服务)
  - [CustomAudioService (自定义音频服务)](#customaudioservice-自定义音频服务)
    - [目的](#目的)
    - [用法](#用法)
    - [关键方法](#关键方法)
    - [设置步骤](#设置步骤)
    - [配置条目](#配置条目)
    - [注意](#注意)
    - [CustomAchievementService (自定义成就服务)](#customachievementservice-自定义成就服务)
    - [CustomCustomizationService (自定义外观服务)](#customcustomizationservice-自定义外观服务)
    - [CustomDialogueService (自定义对话服务)](#customdialogueservice-自定义对话服务)
      - [用法](#用法-1)
      - [对话格式](#对话格式)
  - [示例模组结构](#示例模组结构)
    - [自定义武器模组结构](#自定义武器模组结构)
  - [可用的客户端服务](#可用的客户端服务)
    - [CustomTemplateIdToObjectService (自定义模板 ID 到对象映射服务)](#customtemplateidtoobjectservice-自定义模板-id-到对象映射服务)
    - [服务器端自定义物品模板注册](#服务器端自定义物品模板注册)

## 功能特性

- **简化物品创建** - 使用 JSON 配置文件克隆并修改物品
- **任务系统** - 创建基于区域目标的自定义任务
- **角色自定义** - 添加头部、声音和服装选项
- **机器人配置** - 自定义 AI 装备和配备
- **战利品管理** - 控制物品生成和分布
- **藏身处整合** - 添加制作配方
- **多语言支持** - 简易本地化系统

## 安装方法

1. 从 GitHub 或 SPT Forge 下载 WTT-CommonLib
2. 打开 .7z 文件
3. 将 SPT 和 BepInEx 文件夹拖入你的 SPT 主目录（包含 EscapeFromTarkov.exe 的文件夹）

**致模组作者**

服务器端 (SERVER)
1. 通过你常用的 IDE 下载最新的 WTT-ServerCommonLib Nuget 包
2. 通过构造函数注入 `WTTServerCommonLib`
3. 使用 `Assembly.GetExecutingAssembly()` 获取当前程序集
4. 将其传递给你想要使用的服务

客户端 (CLIENT)
1. 通过你常用的 IDE 下载最新的 WTT-ClientCommonLib Nuget 包
2. 在你的主插件 .cs 文件顶部添加 `[BepInDependency("com.wtt.commonlib")]`。

## 快速开始

这是一个展示如何使用 WTT-CommonLib 的最小示例：

```csharp
using System.Reflection;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Models.Spt.Mod;
using Range = SemanticVersioning.Range;

namespace YourModName;

public record ModMetadata : AbstractModMetadata
{
    public override string ModGuid { get; init; } = "com.yourname.yourmod";
    public override string Name { get; init; } = "Your Mod Name";
    public override string Author { get; init; } = "Your Name";
    public override SemanticVersioning.Version Version { get; init; } = new("1.0.0");
    public override Range SptVersion { get; init; } = new("~4.0.1");
    public override string License { get; init; } = "MIT";
    public override bool? IsBundleMod { get; init; } = true;
    public override Dictionary<string, Range>? ModDependencies { get; init; } = new()
    {
        { "com.wtt.commonlib", new Range("~2.0.0") }
    };
    public override string? Url { get; init; }
    public override List<string>? Contributors { get; init; }
    public override List<string>? Incompatibilities { get; init; }
}

[Injectable(TypePriority = OnLoadOrder.PostDBModLoader + 2)]
public class YourMod(
    WTTServerCommonLib.WTTServerCommonLib wttCommon
) : IOnLoad
{
    public async Task OnLoad()
    {

        // 获取当前程序集
        var assembly = Assembly.GetExecutingAssembly();


        // 使用 WTT-CommonLib 服务
        await wttCommon.CustomItemServiceExtended.CreateCustomItems(assembly);
        await wttCommon.CustomLocaleService.CreateCustomLocales(assembly);
        
        await Task.CompletedTask;
    }
}
```

### 关键点：
- 通过构造函数注入 `WTTServerCommonLib.WTTServerCommonLib`
- 设置 `TypePriority = OnLoadOrder.PostDBModLoader + 2` 以便在数据库加载后加载
- 传递你的当前程序集以使用任何可用的公共服务

---

## 可用的服务器服务

### CustomItemServiceExtended (扩展自定义物品服务)

**目的**: 创建自定义物品（ weapons、armors、consumables等）并将其整合到商人、随机战利品表和机器人装备中。

**用法**:
```csharp
// 使用默认路径 (db/CustomItems/)
await wttCommon.CustomItemServiceExtended.CreateCustomItems(assembly);

// 或者指定自定义路径
await wttCommon.CustomItemServiceExtended.CreateCustomItems(assembly,
    Path.Join("db", "MyCustomItemFolder"));
```

**配置**: 将 JSON 文件放置在 `db/CustomItems/` (或你的自定义路径)：

<details>
<summary> 物品配置示例 (点击展开)</summary>

```json
{
  // 此自定义物品的唯一 ID
  "THIS MUST BE A UNIQUE MONGOID": {
    // 被克隆属性的原版塔科夫物品模板 ID（例如，另一个腰带或容器）
    "itemTplToClone": "PUT THE MONGOID FOR THE ITEM YOU ARE CLONING HERE",

    // 游戏物品数据库中的父类 ID，控制它在物品树中的位置
    "parentId": "6815465859b8c6ff13f94026",

    // 手册中的父类 ID（用于 UI 中跳蚤市场的排序/分组）
    "handbookParentId": "5b5f6f8786f77447ed563642",

    // 将覆盖 "itemTplToClone" 默认属性的属性
    "overrideProperties": {
      // 使此物品在玩家库存中默认已检查（可见）
      "ExaminedByDefault": true,

      // 此物品的资源预制体：游戏应使用的 3D 模型和图标
      "Prefab": {
        // 物品的 AssetBundle 文件路径
        "path": "Gear_Belts/belt_fannypack.bundle",
        "rcid": ""
      },

      // 库存大小：2x2 格
      "Width": 2,
      "Height": 2,

      // 重量 (kg)
      "Weight": 0.46,

      // 物品内部的网格（“容器插槽”），你可以在其中放置其他物品
      "Grids": [
        {
          "_id": "belt_fannypackgrid",
          "_name": "main",
          "_parent": "6761b213607f9a6f79017aef",
          "_props": {
            "cellsH": 3,
            "cellsV": 2,
            "filters": [
              {
                "Filter": ["54009119af1c881c07000029"] 
              }
            ]
          }
        }
      ]
    },

    // 物品在不同语言（“本地化”）下的显示方式
    "locales": {
      "en": {
        "name": "Fanny Pack",
        "shortName": "Fanny Pack",
        "description": "A fanny pack that can be worn at the waist."
      }
    },

    // 跳蚤市场的价格（卢布）
    "fleaPriceRoubles": 10900,

    // 手册中的价格
    "handbookPriceRoubles": 7250,

    // 此物品可以添加到的特定库存插槽（例如插槽：“ArmBand”）
    "addtoInventorySlots": ["ArmBand"],

    // 是否应该放入藏身处海报插槽？
    "addtoHideoutPosterSlots": true,

    // 是否应该在海报/地图上可见？  
    "addPosterToMaps": true,

    // 作为地图海报出现的概率
    "posterSpawnProbability": 10,

    // 是否应该在藏身处的雕像展示位可用？
    "addtoStatuetteSlots": true,

    // （如果你正在制作弹药）是否应该将弹药口径添加到所有克隆位置？
    "addCaliberToAllCloneLocations": true,

    // 是否应包含在静态弹药表中（用于生成）
    "addtoStaticAmmo": true,

    // 作为静态弹药生成的几率
    "staticAmmoProbability": 5,

    // 是否应提供给机器人/装备？（注意 - 如果该机器人战利品表中有被克隆物品，这将以与被克隆物品相同的概率推送到机器人战利品表）
    "addtoBots": true,

    // 是否应推送到特殊插槽
    "addtoSpecialSlots": true,

    // 是否应推送到被克隆物品允许去的任何地方
    "addtoModSlots": true,

    // 搜索被克隆物品 ID 并将你的物品添加到的特定改装插槽 (modSlot)
    "modSlot": ["mod_muzzle"],

    // 是否应作为名人堂物品可用？
    "addtoHallOfFame": true,

    // 此物品可以放入的名人堂“插槽”/类别
    "hallOfFameSlots": [
      "bigTrophies", 
      "smallTrophies", 
      "dogTags"
    ],

    // 是否可以作为藏身处发电机的燃料使用？
    "addtoGeneratorAsFuel": true,

    // 发电机可以使用此燃料的阶段
    "generatorFuelSlotStages": [
      "1",
      "2",
      "3"
    ],

    // 是否应该为“包含骨骼但其属性中没有槽位”的原版物品动态创建槽位？
    "addtoEmptyPropSlots": true,

    // 应添加到的一个空属性插槽的详细信息
    "emptyPropSlot": {
      "itemToAddTo": "628a66b41d5e41750e314f34",
      "modSlot": "mod_muzzle"
    },

    // 是否应添加到静态战利品容器（例如 Scav 尸体）
    "addtoStaticLootContainers": true,

    // 容器列表及其出现的几率
    "StaticLootContainers": [
      {
        "ContainerName": "LOOTCONTAINER_DEAD_SCAV", // 容器的 ID 或短名称（参见 COMMONLIBS 的 ITEMMAPS）
        "Probability": 54 // 生成百分比几率
      }
    ],

    // 是否应添加到所有保险箱过滤器中？
    "addtoSecureFilters": true,

    // 这是一个随机战利品箱吗？（必须使用随机战利品箱 "62f109593b54472778797866" 作为此物品的父类 ID）
    "isRandomLootContainer": true,

    // 打开此战利品箱给出的数量和奖励
    "randomLootContainerRewards":
    {
          "rewardCount": 6,
          "foundInRaid": true,
          "rewardTplPool": {
            "57514643245977207f2c2d09": 100,
            "544fb62a4bdc2dfb738b4568": 100,
            "57513f07245977207e26a311": 100,
            "57513f9324597720a7128161": 100,
            "57513fcc24597720a31c09a6": 100,
            "5e8f3423fd7471236e6e3b64": 100,
            "60b0f93284c20f0feb453da7": 100,
            "5734773724597737fd047c14": 100,
            "59e3577886f774176a362503": 100,
            "57505f6224597709a92585a9": 100,
            "544fb6cc4bdc2d34748b456e": 100,
            "5751496424597720a27126da": 100,
            "60098b1705871270cd5352a1": 100,
            "5d40407c86f774318526545a": 100,
            "5c0fa877d174af02a012e1cf": 100,
            "575062b524597720a31c09a1": 100,
            "575146b724597720a27126d5": 100,
            "62a09f32621468534a797acb": 100,
            "57347d7224597744596b4e72": 100,
            "57347d5f245977448b40fa81": 100,
            "65815f0e647e3d7246384e14": 100,
            "635a758bfefc88a93f021b8a": 100,
            "57347d692459774491567cf1": 100,
            "5bc9c29cd4351e003562b8a3": 100,
            "57347d8724597744596b4e76": 100,
            "5c0530ee86f774697952d952": 10
          }
    },

    // 它是商人提供的吗？
    "addtoTraders": true,

    // 自定义以物易物/商人设置
    "traders": {
      "RAGMAN": {
        // 报价 ID（唯一 ID - 为此使用 mongoID 生成器）
        "PUT A UNIQUE MONGOID HERE": {
          // 商人处的购买要求
          "barterSettings": {
            "loyalLevel": 1,
            "unlimitedCount": true,
            "stackObjectsCount": 99
          },
          // 你需要用来交换它的东西（例如卢布）
          "barters": [
            {
              "count": 26125,
              "_tpl": "MONEY_ROUBLES" // 货币 ID 或短名称（参见 SPT 的 ITEMTPL 类）
            }
          ]
        }
      }
    }
  }
}
```
</details>

**特性**:
- 克隆现有物品并修改属性
- 通过自定义以物易物添加到商人库存
- 添加到机器人装备（继承被克隆物品的生成几率）
- 添加到随机战利品容器
- 武器预设支持
- 武器精通整合
- 名人堂整合
- 发电机燃料整合
- 藏身处海报/雕像整合
- 自定义库存插槽放置
- 特殊插槽支持
- 基于口径的武器兼容性
- 改装插槽传播（基于被克隆物品的位置）
- 添加到默认情况下为空的插槽（例如 Keymount 枪口制退器上的 mod_muzzle）

---

### CustomLocaleService (自定义语言服务)

**目的**: 处理你所有自定义内容的翻译。

**用法**:
```csharp
await wttCommon.CustomLocaleService.CreateCustomLocales(assembly);
// 或者指定自定义路径
await wttCommon.CustomLocaleService.CreateCustomLocales(assembly,
    Path.Join("db", "MyCustomLocalesFolder"));
```

**配置**: 在 `db/CustomLocales/` 中创建语言文件：
- `en.json` - 英语
- `ru.json` - 俄语
- `de.json` - 德语
- 等。

<details>
<summary> 语言文件示例 (点击展开)</summary>

```json
{
  "my_custom_weapon_001 Name": "Custom Assault Rifle",
  "my_custom_weapon_001 ShortName": "CAR",
  "my_custom_weapon_001 Description": "A powerful custom rifle",
  "my_custom_quest_001 name": "Custom Quest Name",
  "my_custom_quest_001 description": "Quest description here"
}
```
</details>

---

### CustomQuestService (自定义任务服务)

**目的**: 向数据库添加自定义任务，支持复杂的目标、奖励、时间窗口和阵营限制。

**用法**:
```csharp
await wttCommon.CustomQuestService.CreateCustomQuests(assembly);
// 或者指定自定义路径
await wttCommon.CustomQuestService.CreateCustomQuests(assembly,
    Path.Join("db", "MyCustomQuestsFolder"));
```

**默认文件夹结构**: 

该服务期望按照商人组织的任务结构如下：

```
db/CustomQuests/
├── QuestTimeData.json          # 可选：限时任务配置
├── QuestSideData.json          # 可选：阵营专属任务配置
├── mechanic/                   # 商人文件夹（可以使用商人名称或 ID）
│   ├── Quests/
│   │   └── quest_definitions.json
│   ├── QuestAssort/            # 可选：任务解锁的商人物品
│   │   └── assort.json
│   ├── Locales/
│   │   ├── en.json
│   │   └── ru.json
│   └── Images/                 # 任务图标
│       └── quest_icon.png
├── prapor/
│   └── ...
└── skier/
    └── ...
```

**配置文件**:

**QuestTimeData.json** (可选 - 限时任务):
```json
{
  "my_quest_id": {
    "StartMonth": 12,
    "StartDay": 1,
    "EndMonth": 12,
    "EndDay": 31
  }
}
```
此文件中的任务仅在指定的日期范围内可用。适用于季节性/节日活动。

**QuestSideData.json** (可选 - 阵营专属任务):
```json
{
  "usecOnlyQuests": [
    "quest_id_1",
    "quest_id_2"
  ],
  "bearOnlyQuests": [
    "quest_id_3",
    "quest_id_4"
  ]
}
```
此处列出的任务仅对指定的 PMC 阵营可用。

**任务商店货物 (Quest Assort)** (`QuestAssort/*.json`) - 任务完成后解锁的物品：
```json
{
  "success": {
    "assort_item_id_to_unlock": "my_quest_id"
  }
}
```

**语言 (Locales)** (`Locales/*.json`):
```json
{
  "my_quest_id name": "Custom Quest Name",
  "my_quest_id description": "Quest description text",
  "my_quest_id successMessageText": "Quest completion message",
  "my_quest_id startedMessageText": "Quest started message"
}
```

**图像 (Images)** (`Images/*`): 任务定义中通过文件名（不带扩展名）引用的任务图标。

**特性**:
- 限时任务（通过 QuestTimeData.json 实现季节性/基于日期的任务）
- 阵营限制（通过 QuestSideData.json 实现仅限 BEAR/USEC）
- 完整的本地化支持，具有向英语的回退机制
- 任务解锁的商人货物
- 自定义任务图标

**商人名称**: 文件夹名称可以使用商人名称（不区分大小写）或商人 ID：
- `mechanic`, `prapor`, `therapist`, `skier`, `peacekeeper`, `jaeger`, `ragman`, `fence`
- 或者他们的商人 ID：`54cb50c76803fa8b248b4571` 等。

**重要提示**:
- 任务 .json 文件 **必须完全匹配 BSG 任务模型**。无效的任务数据将抛出错误并阻止加载。
- QuestTimeData.json 和 QuestSideData.json 是可选的，可以放置在 `CustomQuests/` 根文件夹中。
- 如果任务在其时间窗口之外，它将不会被加载到数据库中。
- 图像必须是标准格式（.png, .jpg 等）。
- 如果特定语言缺少翻译，则本地化将回退到英语。

---

### CustomQuestZoneService (自定义任务区域服务)

**目的**: 管理用于访问、放置物品和其他基于位置目标的自定义任务区域。

**用法**:
```csharp
await wttCommon.CustomQuestZoneService.CreateCustomQuestZones(assembly);
// 或者指定自定义路径
await wttCommon.CustomQuestZoneService.CreateCustomQuestZones(assembly,
    Path.Join("db", "MyCustomQuestZonesFolder"));
```

**配置**: 将区域文件放置在 `db/CustomQuestZones/`

<details>
<summary> 区域配置示例 (点击展开)</summary>

```json
{
  "ZoneId": "deadbody_1",
  "ZoneName": "deadbody_1",
  "ZoneLocation": "woods",
  "ZoneType": "placeitem",
  "FlareType": "",
  "Position": {
    "X": "91.6219",
    "Y": "16.7",
    "Z": "-845.9562"
  },
  "Rotation": {
    "X": "0",
    "Y": "0",
    "Z": "0",
    "W": "1"
  },
  "Scale": {
    "X": "1.5",
    "Y": "3.25",
    "Z": "1.75"
  }
}
```
</details>

**游戏中编辑器**: 在游戏中按下 **F12** → 导航到 **WTT-ClientCommonLib** 设置 → 可视化地创建和定位区域。

---

### CustomVoiceService (自定义语音服务)

**目的**: 为玩家和机器人添加自定义角色语音。

**用法**:
```csharp
await wttCommon.CustomVoiceService.CreateCustomVoices(assembly);
// 或者指定自定义路径
await wttCommon.CustomVoiceService.CreateCustomVoices(assembly,
    Path.Join("db", "MyCustomVoicesFolder"));
```

**配置**: 在 `db/CustomVoices/` 中创建语音配置文件：

<details>
<summary> 语音配置示例 (点击展开)</summary>

```json
{
  "6747aa4495b4845a0f3d9f98": {
    "locales": {
      "en": "Duke"
    },
    "name": "Duke",
    "bundlePath": "voices/Duke/Voices/duke_voice.bundle",
    "addVoiceToPlayer": true
  }
}
```
</details>

**要求**: 将语音音频打包成 Unity AssetBundles → 放置在 `bundles/` 文件夹中 → 添加到 `bundles.json`。

---

### CustomHeadService (自定义头部服务)

**目的**: 为玩家自定义添加自定义角色头部模型。

**用法**:
```csharp
await wttCommon.CustomHeadService.CreateCustomHeads(assembly);
// 或者指定自定义路径
await wttCommon.CustomHeadService.CreateCustomHeads(assembly,
    Path.Join("db", "MyCustomHeadsFolder"));
```

**配置**: 在 `db/CustomHeads/` 中创建头部配置文件：

<details>
<summary> 头部配置示例 (点击展开)</summary>

```json
{
  "6747aa715be2c2e443264f32": {
    "path": "heads/chrishead.bundle",
    "addHeadToPlayer": true,
    "side": ["Bear", "Usec"],
    "locales": {
      "en": "Chris Redfield"
    }
  }
}
```
</details>

**要求**: 将头部模型打包成 Unity AssetBundles → 放置在 `bundles/` 文件夹中。

---

### CustomClothingService (自定义服装服务)

**目的**: 为玩家添加自定义服装套装（上装、下装）。

**用法**:
```csharp
await wttCommon.CustomClothingService.CreateCustomClothing(assembly);
// 或者指定自定义路径
await wttCommon.CustomClothingService.CreateCustomClothing(assembly,
    Path.Join("db", "MyCustomClothingFolder"));
```

**配置**: 在 `db/CustomClothing/` 中创建服装配置文件：

<details>
<summary> 服装配置示例 (点击展开)</summary>

```json
{
  "type": "top",
  "suiteId": "PUT A UNIQUE MONGOID HERE",
  "outfitId": "PUT A UNIQUE MONGOID HERE",
  "topId": "PUT A UNIQUE MONGOID HERE",
  "handsId": "PUT A UNIQUE MONGOID HERE",
  "locales": {
    "en": {
        "name": "Lara's Tattered Tank Top",
        "description": "Women's Upper"
  },
  "topBundlePath": "clothing/lara_top.bundle",
  "handsBundlePath": "clothing/lara_hands.bundle",
  "traderId": "RAGMAN",
  "loyaltyLevel": 1,
  "profileLevel": 1,
  "standing": 0,
  "currencyId": "ROUBLES",
  "price": 150,
  "achievementRequirements": [],
  "questRequirements": []
}
```
**注意**: 自定义服装服务将尝试自动向尚未拥有服务选项卡的商人添加服务选项卡。
</details>

---

### CustomBotLoadoutService (自定义机器人装备服务)

**目的**: 自定义 AI 机器人的装备、武器和外观。

**用法**:
```csharp
await wttCommon.CustomBotLoadoutService.CreateCustomBotLoadouts(assembly);
// 或者指定自定义路径
await wttCommon.CustomBotLoadoutService.CreateCustomBotLoadouts(assembly,
    Path.Join("db", "MyCustomBotLoadoutsFolder"));
```

**配置**: 在 `db/CustomBotLoadouts/` 中创建机器人装备文件：

<details>
<summary> 机器人装备示例 (点击展开)</summary>

```json
{
  "chances": {
    "equipment": {
      "FirstPrimaryWeapon": 100
    },
    "weaponMods": {
      "mod_stock": 100,
      "mod_magazine": 100,
      "mod_tactical_002": 65
    }
  },
  "inventory": {
    "equipment": {
      "FirstPrimaryWeapon": {
        "679a6a534f3d279c99b135b9": 500
      }
    },
    "mods": {
      "679a6a534f3d279c99b135b9": {
        "mod_stock": ["679a6e58085b54fdd56f5d0d"],
        "mod_magazine": ["679a702c47bb7fa666fe618e"]
      }
    },
    "Ammo": {
      "Caliber545x39": {
        "61962b617c6c7b169525f168": 1
      }
    }
  }
}
```
</details>

---

### CustomLootspawnService (自定义战利品生成服务)

**目的**: 控制你的自定义物品在地图上作为战利品生成的地点和频率。支持随机战利品生成和任务目标的保证强制生成。

**用法**:
```csharp
await wttCommon.CustomLootspawnService.CreateCustomLootspawns(assembly);
// 或者指定自定义路径
await wttCommon.CustomLootspawnService.CreateCustomLootspawns(assembly,
    Path.Join("db", "MyCustomLootspawnsFolder"));
```

**默认文件夹结构**:

```
db/CustomLootspawns/
├── CustomSpawnpoints/           # 随机战利品生成（基于概率）
│   ├── woods_spawns.json
│   ├── customs_spawns.json
│   └── factory_spawns.json
└── CustomSpawnpointsForced/     # 强制生成（用于任务物品）
    ├── woods_forced.json
    └── customs_forced.json
```

**配置文件**:

**随机战利品生成 (Random Loot Spawns)** (`CustomSpawnpoints/*.json`):

<details>
<summary> CustomSpawnpoints 配置示例 (点击展开)</summary>
  
```json
{
  "sandbox": [
        {
            "locationId": "(82.8276, 14.3806, 181.004)",
            "probability": 0.30,
            "template": {
                "Id": "ag43_spawn",
                "IsContainer": false,
                "useGravity": false,
                "randomRotation": false,
                "Position": {
                    "x": 82.8276,
                    "y": 14.3806,
                    "z": 181.004
                },
                "Rotation": {
                    "x": 2.8415,
                    "y": 212.2408,
                    "z": 91.2423
                },
                "IsGroupPosition": false,
                "GroupPositions": [],
                "IsAlwaysSpawn": false,
                "Root": "68cf6c56cb996a3530052b52",
                "Items": [
                    {
                        "composedKey": "-69420",
                        "_id": "PUT A UNIQUE MONGOID HERE",
                        "_tpl": "68cf56067ff6ceab0c2fd49e",
                        "upd": {
                            "SpawnedInSession": true,
                            "Repairable": {
                                "MaxDurability": 100,
                                "Durability": 100
                            },
                            "Foldable": {
                                "Folded": true
                            },
                            "FireMode": {
                                "FireMode": "single"
                            }
                        }
                    }
                ]
            },
            "itemDistribution": [
                {
                    "composedKey": {
                        "key": "-69420"
                    },
                    "relativeProbability": 1
                }
            ]
        }
    ]
}
```
</details>

**强制战利品生成 (Forced Loot Spawns)** (`CustomSpawnpointsForced/*.json`) - 任务激活时始终生成：

<details>
<summary> CustomSpawnpointsForced 配置示例 (点击展开)</summary>
  
```json
{
    "interchange": [     
        {
            "locationId": "(31.7642 38.7517 -22.9169)",
            "probability": 0.25,
            "template": {
                "Id": "quest_item_immortal_poster (1) [8d2f6c4e-9b3a-4e1f-a7d5-2c8b0e9f3a6d]",
                "IsContainer": false,
                "useGravity": false,
                "randomRotation": false,
                "Position": {
                    "x": 31.7642,
                    "y": 38.7517,
                    "z": -23.244
                },
                "Rotation": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "IsGroupPosition": false,
                "GroupPositions": [],
                "IsAlwaysSpawn": true,
                "Root": "68748750c2bc7bbc4797d713",
                "Items": [
                    {
                        "_id": "PUT A UNIQUE MONGOID HERE",
                        "_tpl": "687464af51ed3be7e4f6f525",
                        "upd": {
                            "StackObjectsCount": 1
                        }
                    }
                ]
            },
            "itemDistribution": [
                {
                    "composedKey": {
                        "key": "687464af51ed3be7e4f6f525"
                    },
                    "relativeProbability": 1
                }
            ]
        }
    ]
}
```
</details>

**地图名称**: 使用以下地图标识符（区分大小写）：
- `bigmap` - 海关 (Customs)
- `woods` - 森林 (Woods)
- `factory4_day` / `factory4_night` - 工厂 (Factory)
- `interchange` - 立交桥 (Interchange)
- `lighthouse` - 灯塔 (Lighthouse)
- `rezervbase` - 储备站 (Reserve)
- `shoreline` - 海岸线 (Shoreline)
- `tarkovstreets` - 塔科夫街区 (Streets of Tarkov)
- `laboratory` - 实验室 (Labs)
- `sandbox` - 归零地 (Ground Zero)

**用例**:

- **任务物品**: 将玩家必须为任务寻找的物品放在 `CustomSpawnpointsForced/` 中。
- **多个位置**: 使用 `GroupPositions` 数组定义几个可能的生成位置，以增加多样性。

---

### CustomAssortSchemeService (自定义商店货物方案服务)

**目的**: 向商人库存中添加复杂的、完整组装的物品（如预改装的武器或带有插板的护甲），并带有自定义的以物易物方案。此服务让你完全控制物品的配置和定价。

**用法**:
```csharp
await wttCommon.CustomAssortSchemeService.CreateCustomAssortSchemes(assembly);
// 或者指定自定义路径
await wttCommon.CustomAssortSchemeService.CreateCustomAssortSchemes(assembly,
    Path.Join("db", "MyCustomAssortSchemesFolder"));
```

**何时使用此服务**:
- **完全改装的武器**，且预装了特定的配件。
- **带有插板的护甲**已插入。
- 需要嵌套子物品的**复杂物品**。

**默认文件夹结构**:

```
db/CustomAssortSchemes/
├── peacekeeper_assort.json
├── mechanic_assort.json
└── ragman_assort.json
```

**配置结构**:

每个文件定义商人的货物方案，包含三个主要部分：

<details>
<summary>点击展开完整配置示例</summary>

```json
{
  "PEACEKEEPER": {
    "items": [
      {
        "_id": "my_custom_weapon_root(PUT A UNIQUE MONGOID HERE)",
        "_tpl": "5447a9cd4bdc2dbd208b4567",
        "upd": {
          "Repairable": {
            "MaxDurability": 100,
            "Durability": 100
          },
          "FireMode": {
            "FireMode": "fullauto"
          },
          "UnlimitedCount": true,
          "StackObjectsCount": 999999,
          "BuyRestrictionMax": 0
        },
        "parentId": "hideout",
        "slotId": "hideout"
      },
      {
        "_id": "PUT A UNIQUE MONGOID HERE",
        "_tpl": "55d480c04bdc2d1d4e8b456a",
        "slotId": "mod_magazine",
        "parentId": "my_custom_weapon_root"
      },
      {
        "_id": "PUT A UNIQUE MONGOID HERE",
        "_tpl": "5649be884bdc2d79388b4577",
        "slotId": "mod_stock",
        "parentId": "my_custom_weapon_root"
      }
    ],
    "barter_scheme": {
      "my_custom_weapon_root": [
        [
          {
            "count": 50000,
            "_tpl": "5449016a4bdc2d6f028b456f"
          }
        ]
      ]
    },
    "loyal_level_items": {
      "my_custom_weapon_root": 2
    }
  }
}
```

</details>

---

### CustomStaticSpawnService (自定义静态物体生成服务)

**目的**: 在地图上放置具有高级条件的持久性 3D 对象。支持复杂的生成逻辑，包括任务状态检查、物品要求、Boss 检测和链接的任务条件。

**用法**:
```csharp
await wttCommon.CustomStaticSpawnService.CreateCustomStaticSpawns(assembly);
// 或者指定自定义路径
await wttCommon.CustomStaticSpawnService.CreateCustomStaticSpawns(assembly,
    Path.Join("db", "MyCustomStaticSpawnsFolder"));
```

# **设置步骤**

**1. 将你的预制体打包成 Unity AssetBundles**

使用 Unity 的 AssetBundle 构建工具创建包含你的预制体的 `.bundle` 文件。

**2. 在 `bundles.json` 中注册 Bundles**

在你的模组 `bundles.json` 清单中添加条目：
```json
{
  "key": "staticspawns/my_objects.bundle",
  "dependencies": [
    "assets/commonassets/physics/physicsmaterials.bundle",
    "shaders",
    "cubemaps"
  ]
},
{
  "key": "staticspawns/quest_decorations.bundle",
  "dependencies": [
    "assets/commonassets/physics/physicsmaterials.bundle",
    "shaders",
    "cubemaps"
    ]
}
```

**3. 将 Bundle 文件放置在你的模组中**

```
YourMod/
└── bundles/
    └── staticspawns/
        ├── my_objects.bundle
        └── quest_decorations.bundle
```

**4. 创建生成配置文件**

将 JSON 配置放置在你的模组 `db/CustomStaticSpawns/CustomSpawnConfigs/` 中：

```
db/CustomStaticSpawns/
└── CustomSpawnConfigs/
    ├── interchange_spawns.json
    ├── woods_spawns.json
    └── customs_spawns.json
```

**5. 在模组的 OnLoad 中注册**

```csharp
public async Task OnLoad()
{
    await wttCommon.CustomStaticSpawnService.CreateCustomStaticSpawns(assembly);
}
```

**配置结构**:

<details>
<summary>CustomStaticSpawn 配置示例 (点击展开)</summary>

```json
[
  {
    "questId": "my_custom_quest_001",
    "locationID": "interchange",
    "bundleName": "my_objects",
    "prefabName": "QuestMarker_001",
    "position": {
      "x": 123.45,
      "y": 15.67,
      "z": -89.01
    },
    "rotation": {
      "x": 0,
      "y": 45,
      "z": 0
    },
    "requiredQuestStatuses": ["Started"],
    "excludedQuestStatuses": ["AvailableForStart"],
    "questMustExist": true,
    "linkedQuestId": null,
    "linkedRequiredStatuses": [],
    "linkedExcludedStatuses": [],
    "linkedQuestMustExist": null,
    "requiredItemInInventory": null,
    "requiredLevel": 10,
    "requiredFaction": "USEC",
    "requiredBossSpawned": null
  },
  {
    "questId": "my_custom_quest_002",
    "locationID": "woods",
    "bundleName": "quest_decorations",
    "prefabName": "TreeMarker_001",
    "position": {
      "x": 200.5,
      "y": 20.0,
      "z": -150.3
    },
    "rotation": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "requiredQuestStatuses": ["AvailableForStart", "Started"],
    "excludedQuestStatuses": ["Completed"],
    "questMustExist": false,
    "linkedQuestId": "linked_quest_001",
    "linkedRequiredStatuses": ["Completed"],
    "linkedExcludedStatuses": [],
    "linkedQuestMustExist": true,
    "requiredItemInInventory": "some_item_template_id",
    "requiredLevel": null,
    "requiredFaction": null,
    "requiredBossSpawned": "BosBully"
  }
]
```
</details>

**条件属性**:

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `questId` | string | 基于条件必须存在/不存在的任务 ID |
| `locationID` | string | 物件生成的地图 ID (小写，区分大小写) |
| `bundleName` | string | 包含预制体的 AssetBundle 名称 (来自 `bundles.json` 的 key) |
| `prefabName` | string | 要生成的 Bundle 内部的 GameObject 名称 |
| `position` | XYZ | 物件生成的全局位置 |
| `rotation` | XYZ | 物品旋转的欧拉角 |
| `requiredQuestStatuses` | List[string] | 任务必须处于这些状态之一才能生成 (例如 "Started", "Completed") |
| `excludedQuestStatuses` | List[string] | 任务必须不处于这些状态才能生成 |
| `questMustExist` | bool | 如果为 true，任务必须存在于玩家档案中；如果为 false，则不能存在 |
| `linkedQuestId` | string | 用于链接任务条件的次要任务 ID |
| `linkedRequiredStatuses` | List[string] | 链接任务必须处于这些状态之一 |
| `linkedExcludedStatuses` | List[string] | 链接任务必须不处于这些状态 |
| `linkedQuestMustExist` | bool | 如果为 true，链接任务必须存在；如果为 false，则不能存在 |
| `requiredItemInInventory` | string | 玩家库存中必须有此物品模板才能生成物件 |
| `requiredLevel` | int | 玩家必须至少达到此等级才能看到物品 |
| `requiredFaction` | string | 玩家必须是此阵营: "USEC" 或 "BEAR" |
| `requiredBossSpawned` | string | 具有此角色的 Boss 必须在突袭中存活 (例如 "BosBully", "BosKnight") |

**游戏中物件放置工具**:

在游戏中按下 **~** 进入调试控制台：

1. **生成物件 (Spawn Object)**: `SpawnObject <bundleName> <prefabName>`
   - 在你面前生成物件
   
2. **进入编辑模式 (Enter Edit Mode)**: `EnterEditMode`
   - WASD - 移动物件
   - Numpad 1-9 - 旋转
   - Shift - 2倍速度加成
   - Shift+Alt - 4倍速度加成
   - Enter - 反斜杠 (Backslash)
   - Delete 键 - 移除选中的物件
   - Period (.) - 循环切换生成的物件
   - Comma (,) - 循环切换生成的物件

3. **导出生成信息 (Export Spawns)**: `ExportSpawnedObjectInfo`
   - 将所有放置的物件保存到 JSON 文件
   - 输出到: `WTT-ClientCommonLib-CustomStaticSpawnConfig-Output-{timestamp}.json`

**示例工作流程**:

1. 构建 Unity 预制体并打包为 AssetBundles (my_objects.bundle)。
2. 在 `bundles.json` 中以 key `staticspawns/my_objects.bundle` 注册 bundle。
3. 将 bundle 放置在 `bundles/staticspawns/my_objects.bundle`。
4. 在游戏中运行: `SpawnObject my_objects QuestMarker_001`。
5. 使用编辑模式控制调整物件位置。
6. 运行: `ExportSpawnedObjectInfo` 生成配置 JSON。
7. 将 JSON 移动到 `db/CustomStaticSpawns/CustomSpawnConfigs/`。
8. 调用 `CreateCustomStaticSpawns(assembly)` 以加载你的配置。

**注意**:

- 配置中的 Bundle 名称必须 match 你的 `bundles.json` 中指向 bundle 的路径（即 `StaticSpawns/my_objects.bundle`）或者与其 bundle 名称本身匹配（不带 `.bundle` 扩展名）。
- 所有 bundle 都通过 SPT 的 Bundle 管理器加载，以确保一致性和效率。
- 只有当满足所有指定条件时，物件才会生成。

---


### CustomHideoutRecipeService (自定义藏身处配方服务)

**目的**: 为藏身处制作模块（工作台、盥洗室、医疗站等）创建自定义制作配方。

**用法**:
```csharp
await wttCommon.CustomHideoutRecipeService.CreateHideoutRecipes(assembly);
// 或者指定自定义路径
await wttCommon.CustomHideoutRecipeService.CreateHideoutRecipes(assembly,
    Path.Join("db", "MyCustomHideoutRecipesFolder"));
```

**配置**: 将配方 JSON 文件放置在 `db/CustomHideoutRecipes/`

**配方示例**:
```json
{
  "_id": "my_custom_recipe_001",
  "areaType": 10,
  "requirements": [
    {
      "areaType": 10,
      "requiredLevel": 2,
      "type": "Area"
    },
    {
      "templateId": "5c06779c86f77426e00dd782",
      "count": 1,
      "isFunctional": false,
      "isEncoded": false,
      "type": "Item"
    }
  ],
  "productionTime": 3600,
  "needFuelForAllProductionTime": true,
  "locked": false,
  "endProduct": "my_custom_item_001",
  "continuous": false,
  "count": 1,
  "productionLimitCount": 0,
  "isEncoded": false
}
```

**关键点**:
- 配方 JSON **必须完全匹配 BSG 的 HideoutProduction 模型**。
- `_id` 必须是有效的 24 位十六进制 MongoDB ID。
- `areaType` 决定配方出现在哪个藏身处模块中（10 = 工作台，2 = 盥洗室，7 = 医疗站等）。
- `productionTime` 以秒为单位。
- 无效的配方结构将抛出错误并阻止加载。

---

### CustomRigLayoutService (自定义战术背心布局服务)

**目的**: 将自定义战术背心布局发送到客户端，以便其可以在游戏中注册并供你的物品使用。

**用法**:
```csharp
wttCommon.CustomRigLayoutService.CreateRigLayouts(assembly);
// 或者指定自定义路径
wttCommon.CustomRigLayoutService.CreateRigLayouts(assembly,
    Path.Join("db", "MyCustomRigLayoutsFolder"));
```

**要求**:
- 将你的战术背心布局预制体构建进 Unity AssetBundles。
- 将 `.bundle` 文件放置在模组文件夹内的 `db/CustomRigLayouts/` 中。

***

### CustomSlotImageService (自定义插槽图标服务)

**目的**: 为独特物品提供自定义库存插槽图标。

**用法**:
```csharp
wttCommon.CustomSlotImageService.CreateSlotImages(assembly);
// 或者指定自定义路径
wttCommon.CustomSlotImageService.CreateSlotImages(assembly,
    Path.Join("db", "MyCustomSlotImagesFolder"));
```

**配置**:
- 将图像文件（`.png`, `.jpg` 等）放置在模组文件夹内的 `db/CustomSlotImages/` 中。
- 将每个文件命名为其替换的插槽 ID（不带扩展名的文件名）。
- 插槽 ID/key 将在需要时用于语言条目。

***

### CustomBuffService (自定义增益/减益效果服务)

**目的**: 向游戏数据库注册自定义刺激剂增益效果配置，允许你为刺激剂和其他消耗品创建新的增益效果。

**用法**:
```csharp
// 使用默认路径 (db/CustomBuffs/)
await wttCommon.CustomBuffService.CreateCustomBuffs(assembly);

// 或者指定自定义路径
await wttCommon.CustomBuffService.CreateCustomBuffs(assembly,
    Path.Join("db", "MyCustomBuffsFolder"));
```

<details>
<summary> 增益效果配置示例 (点击展开)</summary>

```json
{
    "Geeked": [
        {
            "BuffType": "StaminaRate",
            "Chance": 1,
            "Delay": 1,
            "Duration": 180,
            "Value": 200,
            "AbsoluteValue": true,
            "SkillName": ""
        },
        {
            "BuffType": "WeightLimit",
            "Chance": 1,
            "Delay": 1,
            "Duration": 180,
            "Value": 50,
            "AbsoluteValue": true,
            "SkillName": ""
        },
        {
            "BuffType": "DamageModifier",
            "Chance": 1,
            "Delay": 1,
            "Duration": 180,
            "Value": -15,
            "AbsoluteValue": true,
            "SkillName": ""
        },
        {
            "BuffType": "HealthRate",
            "Chance": 1,
            "Delay": 1,
            "Duration": 180,
            "Value": 3,
            "AbsoluteValue": true,
            "SkillName": ""
        }
    ]
}
```
</details>


***


### CustomProfileService (自定义档案服务)

**目的**: 向游戏数据库注册自定义玩家档案版本，允许你为不同的 PMC 阵营创建具有自定义库存、技能和外观配置的替代起始档案。

**用法**:
```csharp
// 使用默认路径 (db/CustomProfiles/)
await wttCommon.CustomProfileService.CreateCustomProfiles(assembly);

// 或者指定自定义路径
await wttCommon.CustomProfileService.CreateCustomProfiles(assembly,
    Path.Join("config", "MyCustomProfilesFolder"));
```

**配置**: 将档案配置文件放置在 `config/CustomProfiles/` 中：


**特性**:
- 创建阵营特定的起始档案 (BEAR/USEC)。
- 定义自定义起始库存和装备。
- 设置初始技能等级和健康值。
- 配置玩家统计数据和进度数据。

**文件命名**:
- 文件名（不带扩展名）成为档案 ID。

**重要提示**:
- 档案结构 **必须完全匹配 SPT 的 ProfileSides 模型** - 无效数据将导致错误。

***


### CustomWeaponPresetService (自定义武器预设服务)

**目的**: 向游戏数据库注册自定义武器预设，允许你创建具有特定配件的预配置武器构建，玩家和机器人可以选择并使用。

**用法**:
```csharp
// 使用默认路径 (db/CustomWeaponPresets/)
await wttCommon.CustomWeaponPresetService.CreateCustomWeaponPresets(assembly);

// 或者指定自定义路径
await wttCommon.CustomWeaponPresetService.CreateCustomWeaponPresets(assembly,
    Path.Join("db", "MyCustomWeaponPresetsFolder"));
```

<details>
<summary> 武器预设配置示例 (点击展开)</summary>

```json
{
    "PUT A UNIQUE MONGOID HERE": {
      "_changeWeaponName": true,
      "_id": "5a32808386f774764a3226d9",
      "_items": [
        {
          "_id": "PUT A UNIQUE MONGOID HERE",
          "_tpl": "5447a9cd4bdc2dbd208b4567"
        },
        {
          "_id": "PUT A UNIQUE MONGOID HERE",
          "_tpl": "59db3a1d86f77429e05b4e92",
          "parentId": "POINTS TO WEAPON ROOT",
          "slotId": "mod_pistol_grip"
        },
        {
          "_id": "PUT A UNIQUE MONGOID HERE",
          "_tpl": "59c1383d86f774290a37e0ca",
          "parentId": "POINTS TO WEAPON ROOT",
          "slotId": "mod_magazine"
        },
      ],
      "_name": "M4A1 2017 New year",
      "_parent": "5a2fa9c4c4a282000d72204f",
      "_type": "Preset"
    }
}
```
</details>

**特性**:
- 创建带有所有预配置配件的完整武器构建。
- 每个配置文件支持多个预设。

**重要提示**:
- 预设结构 **必须完全匹配 SPT 的 Preset 模型** - 无效的预设数据将导致错误。
- 如果你期望拥有唯一命名的预设，你还必须推送该预设的语言条目，以便正确应用名称。

***

## CustomAudioService (自定义音频服务)

### 目的
处理角色创建头像卡和藏身处收音机的自定义音频注册和管理。此服务通过 SPT 的 Bundle 管理器管理音频 bundle，消除了冗余下载并提高了与 Fika 等多人模组的兼容性。

### 用法

音频 bundle 通过 SPT 的 bundle 清单系统注册，而不是单独加载，从而确保高效的资源管理和兼容性。

### 关键方法

- `RegisterAudioBundles(List<string> audioBundleKeys)`:  
  注册已经在你的模组 `bundles.json` 清单中定义的音频 bundle key。

- `CreateFaceCardAudio(string faceName, string audioKey, bool playOnRadioIfFaceIsSelected = false)`:  
  将音频片段与头像卡关联，并可选地将其标记为当选择该头像时在收音机中播放。

- `CreateRadioAudio(string audioKey)`:  
  将音频片段添加到全局收音机池中，独立于头像选择进行播放。

- `GetAudioManifest()`:  
  返回完整的音频清单（bundles、头像映射、收音机音频）。

### 设置步骤

**1. 将你的音频打包进 Unity AssetBundle**

使用 Unity 的 AssetBundle 构建工具创建一个包含你的 AudioClip 资源的 `.bundle` 文件。

**2. 在 `bundles.json` 中注册 bundle**

在你的模组 `bundles.json` 清单中添加一个条目：
```json
{
    "key": "heads/mymodaudio.bundle",
    "dependencyKeys": [
    ]
}
```

**3. 将 bundle 文件放置在你的模组中**

```
YourMod/
└── bundles/
    └── heads/
        └── mymodaudio.bundle
```

**4. 在模组的 OnLoad 中注册**

```csharp
public async Task OnLoad()
{
    // 列出要发送到客户端的音频 bundle 路径
    internal static readonly List<string> AudioBundleKeys = new()
    {
        "audio/mymodaudio.bundle"
    };

    // 注册你的音频 bundle
    wttCommon.CustomAudioService.RegisterAudioBundles(AudioBundleKeys)

    // 添加特定头像的音频
    wttCommon.CustomAudioService.CreateFaceCardAudio("SoldierFace", "soldier_radio_01", true);
    
    // 添加独立的收音机音频
    wttCommon.CustomAudioService.CreateRadioAudio("ambient_bg_track_01");
}
```

### 配置条目

- `FaceCardVolume`:  
  角色创建期间头像卡音频的音量级别（0.0 到 1.0）。

- `GymEnabled`:  
  启用/禁用健身房收音机的自定义音频。

- `GymReplacementChance`:  
  自定义音频替换默认健身房收音机音频的百分比几率（0-100）。

- `GymPlayOnFirstEntrance`:  
  如果可用，在第一次进入藏身处时播放自定义头像音频。

- `GymRadioVolume`:  
  健身房收音机自定义音频的音量（0.0 到 1.0）。

- `RestSpaceEnabled`:  
  启用/禁用休息区收音机的自定义音频。

- `RestSpaceReplacementChance`:  
  自定义音频替换默认休息区音频的百分比几率（0-100）。

- `RestSpacePlayOnFirstEntrance`:  
  如果可用，在第一次进入藏身处时播放自定义头像音频。

- `RestSpaceRadioVolume`:  
  休息区收音机自定义音频的音量（0.0 到 1.0）。

### 注意

- 音频 bundle 通过 SPT 的 Bundle 管理器加载，消除了冗余下载并提高了 Fika 兼容性。
- Bundle key 必须匹配你的 `bundles.json` 清单中的条目。

***


### CustomAchievementService (自定义成就服务)

**目的**: 创建自定义成就，包含语言条目和自定义图像。

**用法**:
```csharp
// 使用默认路径 (db/CustomAchievements/)
await wttCommon.CustomAchievementService.CreateCustomAchievements(assembly);

// 或者指定自定义路径
await wttCommon.CustomAchievementService.CreateCustomAchievements(assembly,
    Path.Join("db", "MyCustomAchievementsFolder"));
```

**默认文件夹结构**:

```
db/CustomAchievements/
├── Achievements/
│   ├── achievement_set_001.json
│   └── achievement_set_002.json
├── Locales/
│   ├── en.json
│   ├── ru.json
│   └── de.json
└── Images/
    ├── achievement_icon_001.png
    ├── achievement_icon_002.jpg
    └── achievement_rewards.png
```

**配置文件**:

**成就 (Achievements)** (`Achievements/*.json`) - 成就定义：

<details>
<summary>成就配置示例 (点击展开)</summary>

```json
[
{
    "id": "achievement_001(THIS MUST BE A UNIQUE MONGOID)", 
    "imageUrl": "/files/achievement/hipoint.png",
    "assetPath": "",
    "rewards": [],
    "conditions": {
      "availableForFinish": [
        {
          "id": "THIS MUST BE A UNIQUE MONGOID",
          "index": 0,
          "dynamicLocale": false,
          "visibilityConditions": [],
          "globalQuestCounterId": "",
          "parentId": "",
          "value": 1,
          "type": "Elimination",
          "oneSessionOnly": false,
          "completeInSeconds": 0,
          "doNotResetIfCounterCompleted": false,
          "isResetOnConditionFailed": false,
          "isNecessary": false,
          "counter": {
            "id": "THIS MUST BE A UNIQUE MONGOID",
            "conditions": [
              {
                "id": "THIS MUST BE A UNIQUE MONGOID",
                "dynamicLocale": false,
                "target": "Savage",
                "value": 1,
                "compareMethod": ">=",
                "conditionType": "Kills",
                "weapon": [
                  "679f2453d1970258c1df3fce"
                ],
                "bodyPart": [],
                "daytime": {
                  "from": 0,
                  "to": 0
                },
                "distance": {
                  "compareMethod": ">=",
                  "value": 0
                },
                "resetOnSessionEnd": false,
                "savageRole": [],
                "enemyEquipmentExclusive": [],
                "enemyEquipmentInclusive": [],
                "enemyHealthEffects": [],
                "weaponCaliber": [],
                "weaponModsExclusive": [],
                "weaponModsInclusive": []
              }
            ]
          },
          "conditionType": "CounterCreator"
        }
      ],
      "fail": []
    },
    "instantComplete": false,
    "showNotificationsInGame": true,
    "showProgress": true,
    "prefab": "",
    "rarity": "Common",
    "hidden": false,
    "showConditions": true,
    "progressBarEnabled": true,
    "side": "Pmc",
    "index": 9001
  }
]  
```
</details>

**语言 (Locales)** (`Locales/*.json`) - 多语言支持：

```json
{
  "achievement_001 name": "Custom Achievement Title",
  "achievement_001 description": "Detailed description of what this achievement requires",
  "achievement_002 name": "Secret Challenge",
  "achievement_002 description": "A hidden achievement description"
}
```

**重要提示**:
- 成就 JSON 文件 **必须完全匹配 BSG 的 Achievement 模型** — 无效的成就数据将被跳过并显示警告。
- 每个成就都需要一个有效的 24 位十六进制 MongoDB ID。
- 图像会自动注册为路由：`/files/achievement/{imageName}`。

***

### CustomCustomizationService (自定义外观服务)

**目的**: 向游戏数据库注册自定义藏身处装饰、外观物品、图标和靶场命中纹理。

**用法**:
```csharp
// 使用默认路径
await wttCommon.CustomCustomizationService.CreateCustomCustomizations(assembly);

// 或者指定自定义路径
await wttCommon.CustomCustomizationService.CreateCustomCustomizations(assembly,
    customizationRelativePath: Path.Combine("db", "CustomCustomization", "Customization"),
    storageRelativePath: Path.Combine("db", "CustomCustomization", "CustomizationStorage"),
    hideoutCustomizationRelativePath: Path.Combine("db", "CustomCustomization", "HideoutCustomizationGlobals"),
    hideoutIconsRelativePath: Path.Combine("db", "CustomCustomization", "HideoutIcons"),
    markTexturesRelativePath: Path.Combine("db", "CustomCustomization", "ShootingRangeMarkTextures")
);
```

**默认配置**:

将 JSON 文件和图像放置在模组的 `db/CustomCustomization/` 目录下：

| 目录 | 目的 |
|-----------|---------|
| `Customization/` | 外观物品配置 (JSON) |
| `CustomizationStorage/` | 外观存储配置 (JSON) |
| `HideoutCustomizationGlobals/` | 藏身处外观全局配置 (JSON) |
| `HideoutIcons/` | 藏身处外观图标 (`.png`, `.jpg` 等) |
| `ShootingRangeMarkTextures/` | 用于靶场的高分辨率命中纹理 (`.png`, `.jpg` 等) |

**特性**:
- 注册自定义藏身处墙壁、天花板、地板。
- 提供图标入口。
- 添加靶场命中痕迹。

**重要提示**:
- 所有外观配置 **必须完全匹配 BSG 的模型**。这意味着 CustomizationItems、CustomizationStorage、HideoutCustomizationGlobals 都必须匹配 SPT 定义的模型。
***

### CustomDialogueService (自定义对话服务)

**自定义 NPC 对话管理**

`WTTCustomDialogueService` 从 JSON/JSONC 文件加载自定义 NPC 对话并将其注册到游戏数据库中。此服务允许你通过自定义对话树和交互来扩展商人对话。

#### 用法

```csharp
// 使用默认路径 (db/CustomDialogues)
await wttCommon.CustomDialogueService.CreateCustomDialogues(assembly);

// 或者指定自定义路径
await wttCommon.CustomDialogueService.CreateCustomDialogues(assembly,
    Path.Join("db", "MyCustomDialoguesFolder"));
```

#### 对话格式

**重要提示：你的对话结构必须完全匹配 BSG 的对话模型。**
- 查看 `SPT/SPT_Data/database/templates/dialogue.json` 并确保你的对话与 "elements" 对象之一 1:1 匹配。

***

## 示例模组结构

### 自定义武器模组结构

```
MyWeaponMod/
├── bundles/
│ └── MyCustomWeapon.bundle
├── db/
│ ├── CustomItems/
│ │ └── weapons.json
│ └── CustomAssortSchemes/
│ 	└── praporAssort.json
├── bundles.json
└── MyWeaponMod.dll
```

***

## 可用的客户端服务

### CustomTemplateIdToObjectService (自定义模板 ID 到对象映射服务)

**目的**: 允许其他模组注册自定义物品和模板，使游戏能够正确实例化自定义物品类型。

**用法**:

```csharp
using System.Collections.Generic;
using BepInEx;
using EFT.InventoryLogic;

// 引用 Client Common Lib - 请使用 NUGET 包！
using WTTClientCommonLib.Services;

namespace YOURMOD
{
    [BepInDependency("com.wtt.commonlib")]
    [BepInPlugin("com.YOURMOD.Core", "YOURMOD", "1.0")]
    internal class YOURMOD : BaseUnityPlugin
    {
        internal void Awake()
        {
            CustomTemplateIdToObjectService.AddNewTemplateIdToObjectMapping(MyCustomItems.CustomMappings);
        }

        public class MyCustomItems
        {
            // 模板类型
            public class MyCustomTemplateType(string myCustomProp1, string myCustomProp2)
                : CompoundItemTemplateClass
            {
                public readonly string MyCustomProp1 = myCustomProp1;
                public readonly string MyCustomProp2 = myCustomProp2;
            }

            // 物品类型
            public class MyCustomItemType(string id, MyCustomTemplateType template) : CompoundItem(id, template)
            {
            }

            // 物品
            public class MyNewItem : MyCustomItemType
            {
                [GAttribute23] private readonly TagComponent _tag;
                public string MyCustomProp1 { get; }
                public string MyCustomProp2 { get; }

                public MyNewItem(string id, MyCustomTemplateType template) : base(id, template)
                {
                    MyCustomProp1 = template.MyCustomProp1;
                    MyCustomProp2 = template.MyCustomProp2;
                    Components.Add(_tag = new TagComponent(this));
                }

                public override IEnumerable<EItemInfoButton> ItemInteractionButtons
                {
                    get
                    {
                        foreach (var itemInfoButton in GetBaseInteractions())
                        {
                            yield return itemInfoButton;
                        }

                        yield return EItemInfoButton.Install;
                        yield return EItemInfoButton.Uninstall;
                        if (!string.IsNullOrEmpty(_tag?.Name))
                        {
                            yield return EItemInfoButton.ResetTag;
                        }
                    }
                }

                private IEnumerable<EItemInfoButton> GetBaseInteractions()
                {
                    return base.ItemInteractionButtons;
                }
            }

            // 定义需要添加到 TemplateIdToObjectMappingClass 字典中的物品和模板
            // 注意: 模板 ID 必须匹配你在 db/templates/items 中的服务器端物品定义
            public static readonly List<TemplateIdToObjectType> CustomMappings =
            [
                // 注册模板类型 (无需实例化物品)
                new(
                    "66f16b85ed966fb78f5563d8", // 模板 ID
                    null, // 物品类型 (对于仅模板注册，此处为 null)
                    typeof(MyCustomTemplateType), // 模板类型
                    null // 构造函数 (对于仅模板注册，此处为 null)
                ),
                // 注册带有构造函数的物品类型
                new(
                    "66f17b4cb59dbccbf12990e6", // 模板 ID
                    typeof(MyNewItem), // 物品类型
                    typeof(MyCustomTemplateType), // 模板类型
                    (id, template) => new MyNewItem(id, (MyCustomTemplateType)template) // 构造函数
                ),
            ];
        }
    }
}
```

**映射属性**:

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `TemplateId` | string | 匹配服务器数据库中物品模板 ID 的自定义物品模板 ID |
| `ItemType` | Type | 继承自 `Item` 或其衍生类的 C# 类 (仅模板注册时为 null) |
| `TemplateType` | Type | 代表模板数据结构的 C# 类 |
| `Constructor` | Delegate | 实例化自定义物品的函数: `(id, template) => new YourItem(id, template)` (仅模板注册时为 null) |

**注册内容**:

该服务将你的映射注册到 `TemplateIdToObjectMappingsClass` 内的三个内部字典中：

- **TypeTable**: 将模板 ID 映射到其 `ItemType` 类，用于库存对象实例化。
- **TemplateTypeTable**: 将模板 ID 映射到其 `TemplateType` 类，用于 data 表示。
- **ItemConstructors**: 将模板 ID 映射到构造函数，用于创建物品实例。

**示例用例**:

- 创建具有独特库存布局的自定义容器或箱子 (请参见 Pack N Strap)。
- 创建具有配件和特殊交互的自定义可用物品 (请参见 Komrade Kid)。

**重要提示**:

- `ItemType` 和 `TemplateType` 都必须是定义合理的 C# 类。
- 仅注册自定义物品——此服务不会覆盖原版的《逃离塔科夫》物品。
- 映射中的模板 ID 必须与服务器数据库中定义的物品模板 ID 一致。
- 你仍然必须通过 `db/templates/items` 将你的新模板和物品添加到服务器数据库中——此服务仅处理客户端的对象实例化。

***

### 服务器端自定义物品模板注册

在客户端使用 `CustomTemplateIdToObjectService` 时，你还必须在服务器上注册你的自定义物品模板。以下是如何在模组的数据库初始化中设置自定义物品：

**实现示例**:

```csharp
using System.Reflection;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Spt.Mod;
using SPTarkov.Server.Core.Services;
using Range = SemanticVersioning.Range;
using Path = System.IO.Path;

namespace YOURMOD.Server;

public record ModMetadata : AbstractModMetadata
{
    public override string ModGuid { get; init; } = "com.YOURNAME.YOURMOD-Server";
    public override string Name { get; init; } = "YOURMOD-Server";
    public override string Author { get; init; } = "YourName";
    public override List<string>? Contributors { get; init; } = null;
    public override SemanticVersioning.Version Version { get; init; } = new("1.0.0");
    public override Range SptVersion { get; init; } = new("~4.0.2");
    public override List<string>? Incompatibilities { get; init; }
    public override Dictionary<string, Range>? ModDependencies { get; init; }
    public override string? Url { get; init; }
    public override bool? IsBundleMod { get; init; } = true;
    public override string License { get; init; } = "MIT";
}

[Injectable(TypePriority = OnLoadOrder.PostDBModLoader + 2)]
public class YOURMODServer(
    WTTServerCommonLib.WTTServerCommonLib wttCommon,
    DatabaseService databaseService) : IOnLoad
{
    public async Task OnLoad()
    {
        Assembly assembly = Assembly.GetExecutingAssembly();
        var itemsDb = databaseService.GetTables().Templates.Items;

        // 你的自定义物品类型的基本模板
        itemsDb["6906a3c931abc0ab8b62d0d2"] = new TemplateItem()
        {
            Id = "6906a3c931abc0ab8b62d0d2",
            Name = "MyCustomItemTemplate",
            Parent = "566162e44bdc2d3f298b4573", // 父模板 ID (在这种情况下是 CompoundItem)
            Type = "Node",
            Properties = new TemplateItemProperties()
        };

        // 你的自定义物品
        itemsDb["6906a400270c1fac09608296"] = new TemplateItem()
        {
            Id = "6906a400270c1fac09608296",
            Name = "MyCustomItemType",
            Parent = "6906a3c931abc0ab8b62d0d2", // 指向你的基本模板
            Type = "Node",
            Properties = new TemplateItemProperties()
        };

        // 使用你的新物品或模板类型注册新的自定义物品
        await wttCommon.CustomItemServiceExtended.CreateCustomItems(assembly);
        
        await Task.CompletedTask;
    }
}
```

**关键点**:

- **模板 ID**: 必须 match 你的客户端 `CustomTemplateIdToObjectService` 映射中使用的 ID。
- **父模板**: 指向一个与你的物品功能相匹配的现有物品模板。

***
