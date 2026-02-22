# SPT现实主义MOD兼容补丁生成器


>Python版本下载链接：
>[https://github.com/windersvista/Realism-patch-Generator/releases/tag/2.4](https://github.com/windersvista/Realism-patch-Generator/releases/tag/2.4)

>C#版本下载链接：
>[https://github.com/windersvista/RealismPatchGenerator_CSharp/releases/tag/1.0](https://github.com/windersvista/RealismPatchGenerator_CSharp/releases/tag/1.0)

>Git Hub源码链接：
>Python:https://github.com/windersvista/Realism-patch-Generator
>C#:https://github.com/windersvista/RealismPatchGenerator_CSharp

## 📋 项目概述

**EFT 现实主义MOD兼容补丁生成器 是一个功能强大的Python脚本，用于为《逃离塔科夫》(Escape from Tarkov)的SPT3.11.4的 现实主义MOD (Realism Mod) 自动生成兼容补丁。它可以根据Items文件夹中的物品数据，使用预定义的模板快速生成规范化的配置文件。

## 🎯 核心特性

- ✅ **最高优先级校验**: 强制规避数值夸大，确保护甲、武器属性符合现实主义 1.6.3+ 标准。
- ✅ **物理属性推断**: 自动感应材质(钛/钢/碳)并修正重量，通过枪管长度(mm/inch)推断初速偏差。
- ✅ **多格式支持**: 同时支持 `TEMPLATE_ID`、`VIR`、`CLONE`、`STANDARD`、`ItemToClone` 5种数据格式。
- ✅ **智能属性保护**: 自动识别并保留核心现实属性（人机、后坐、散布等），防止被普通 MOD 错误数值覆盖。
- ✅ **递归文件扫描**: 自动处理 `input` 文件夹及其所有子文件夹中的 JSON 文件。
- ✅ **模板库管理**: 内置丰富的物品模板库，涵盖武器、配件、装备、消耗品等多种类型。

## 📊 版本历史

| 版本        | 日期         | 主要更新                                                          |
| --------- | ---------- | ------------------------------------------------------------- |
| **v2.4**  | 2026-02-21 | 🛡️ **现实主义规则校验 & 物理推断** - 强制校验数值范围，材质推断，枪管长度转换初速等物理逻辑。        |
| v2.3      | 2026-02-21 | 📁 **源文件名分类输出** - 输出文件名与输入文件名对应，修正 `__init__` 分类字典。           |
| v2.2      | 2026-02-21 | 🏢 **输入属性优先与Locales提取** - 支持从 `locales` 提取名称，完善 `CLONE` 格式。   |
| **v2.0**  | 2026-02-20 | 📌 **ItemToClone格式支持** - 支持新的物品引用格式，HandbookParent智能映射，常量前缀识别 |
| v1.9      | 2026-02-20 | 递归文件夹扫描                                                       |
| v1.8      | 2026-02-20 | Clone链递归处理、enable字段检查                                         |
| v1.7      | 2026-02-20 | 消耗品模板支持、TacticalCombo类型识别                                     |
| v1.6      | 2026-02-20 | 模板路径迁移、ammo和gear模板、TemplateID格式                               |
| v1.5-v1.0 | 2026-02-20 | 基础功能开发                                                        |

## 📁 项目结构

```

Realism-patch-Generator/

├── generate_realism_patch.py              # 🚀 主程序脚本

├── 运行补丁生成器.bat                      # 快速启动脚本（Windows）

├── Items/                                  # 📥 输入目录 - 待处理的物品数据

│   ├── weapon_data_1.json

│   ├── attachments_data_1.json

│   └── ...（支持子文件夹）

├── 现实主义物品模板/                       # 📘 模板库

│   ├── weapons/

│   │   ├── AssaultRifleTemplates.json

│   │   ├── PistolTemplates.json

│   │   └── ...

│   ├── attachments/

│   │   ├── ScopeTemplates.json

│   │   ├── MagazineTemplates.json

│   │   └── ...

│   ├── ammo/

│   ├── gear/

│   └── consumables/

├── output/                                 # 📤 输出目录（自动创建）

│   ├── all_items_realism_patch.json       # ⭐ 完整补丁（推荐使用）

│   ├── weapons_realism_patch.json          # 武器补丁

│   ├── attachments_realism_patch.json      # 配件补丁

│   ├── ammo_realism_patch.json             # 弹药补丁

│   └── consumables_realism_patch.json      # 消耗品补丁（可选）

└── 📚 文档

    ├── README.md                          # 本文件

    ├── 快速入门.md

    ├── 高级配置指南.md

    └── v2.0更新说明.md

```

## 🚀 快速开始

### 步骤 1️⃣：安装环境要求

- **Python 3.6 或更高版本** 已安装
- 无需额外的依赖包（仅使用Python标准库）

### 步骤 2️⃣：准备物品数据

将待生成补丁的物品JSON文件放入 `Items/` 文件夹：
- 可以直接放在 `Items/` 目录根部
- 也可以放在 `Items/` 的子目录中（会自动递归扫描）
- 支持多个文件和任意目录层级

### 步骤 3️⃣：运行生成器

选择以下任一方式运行：

**方式A - Windows批处理（推荐）**

```bash

双击 运行补丁生成器.bat

```

**方式B - 命令行**

```bash

python generate_realism_patch.py

```

**方式C - Python IDE**

- 在VS Code、PyCharm等IDE中直接运行脚本


### 步骤 4️⃣：获取生成的补丁

运行完成后，在 `output/` 文件夹中查看结果：

- 📌 **all_items_realism_patch.json** - 包含所有物品的完整补丁（推荐选择此文件使用）

- weapons_realism_patch.json - 仅包含武器补丁

- attachments_realism_patch.json - 仅包含配件补丁

- ammo_realism_patch.json - 仅包含弹药补丁


## 📋 使用方法详解


### 输入数据格式

脚本支持5种物品数据格式，会自动识别：

#### 1️⃣ **ITEMTOCLONE 格式** （v2.0新增）

```json

{

  "item_id": {

    "ItemToClone": "ASSAULTRIFLE_AK74",

    "OverrideProperties": {

      "Accuracy": 0.5

    },

    "Handbook": {

      "HandbookParent": "AssaultRifles",

      "Price": 50000

    }

  }

}

```

#### 2️⃣ **STANDARD 格式**（推荐）

```json

{

  "item_id": {

    "parentId": "5447b5cf4bdc2d65278b4567",

    "overrideProperties": {

      "Accuracy": 0.5

    }

  }

}

```

#### 3️⃣ **VIR 格式**

```json

{

  "item_id": {

    "item": {

      "_id": "item_id",

      "_parent": "5447b5cf4bdc2d65278b4567",

      "_props": {...}

    }

  }

}

```

#### 4️⃣ **CLONE 格式**

```json

{

  "item_id": {

    "clone": "template_id",

    "overrideProperties": {...}

  }

}

```

#### 5️⃣ **TEMPLATE_ID 格式**

```json

{

  "item_id": "template_id"

}

```

### 智能识别特性

#### ✨ ItemToClone 常量前缀识别 （v2.0新增）

脚本可以通过常量名称前缀自动推断物品类型：


- **武器前缀**: `ASSAULTRIFLE_`、`RIFLE_`、`SNIPER`、`SHOTGUN_`、`SMG_`、`PISTOL_`、`MACHINEGUN_`、`GRENADELAUNCHER_`

- **配件前缀**: `MAGAZINE_`、`RECEIVER_`、`BARREL_`、`STOCK_`、`HANDGUARD_`、`GRIP_`、`SIGHT_`、`SCOPE_`、`SUPPRESSOR_`、`MOUNT_`...

- **装备前缀**: `ARMOR_`、`HELMET_`、`HEADPHONES_`、`FACECOVER_`...

- **其他前缀**: `AMMO_`、`CONTAINER_`、`KEY_`、`INFO_`...

  

#### 🔍 HandbookParent 映射 （v2.0新增）

支持通过 `Handbook.HandbookParent` 字段推断物品类型：

  

**武器类型**: AssaultRifles, Handguns, MachineGuns, SniperRifles, Shotguns, SMGs 等  

**配件类型**: Magazines, Sights, Scopes, Stocks, Barrels, Suppressors, Grips 等  

**装备类型**: Armor, Backpacks, ChestRigs, Headwear, FaceCover 等

  

#### 🔄 Clone 链递归处理 （v1.8支持）

支持链式Clone引用，脚本会自动递归解析并继承属性。

  

#### 📂 递归文件夹扫描 （v1.9支持）

Items文件夹中的所有JSON文件都会被自动发现和处理，包括：

- 直接放在Items/目录的文件

- 任意深度的子文件夹中的文件

  

## 💡 工作流程

  

### 数据处理流程图

  

```

输入文件 (Items文件夹)

    ↓

格式检测 (自动识别5种格式)

    ↓

数据提取 (parentId / ItemToClone / clone等)

    ↓

类型识别 (武器 / 配件 / 弹药 / 装备等)

    ↓

模板匹配 (查找相应的参考模板)

    ↓

属性继承 (从模板继承属性)

    ↓

属性覆盖 (用输入数据覆盖属性)

    ↓

补丁生成 (生成最终的Realism补丁)

    ↓

输出文件 (output文件夹)

```

  

### 主要处理步骤

1. **递归扫描** - 查找Items文件夹及所有子文件夹中的JSON文件
2. **格式检测** - 自动判断数据格式（ITEMTOCLONE/STANDARD/VIR/CLONE/TEMPLATE_ID）
3. **信息提取** - 从输入数据中提取关键信息（ID、parentId、属性等）
4. **类型推断** - 基于parentId、ItemToClone前缀、HandbookParent推断物品类型
5. **模板查询** - 在相应的模板库中查找参考数据
6. **属性合并** - 合并模板属性和输入属性
7. **分类输出** - 按类型（武器/配件/弹药）生成独立文件和合并文件

## 📊 支持的物品类型

### 武器类型 (v2.0)

- 突击步枪、卡宾枪、精确射手步枪、狙击步枪
- 机枪、冲锋枪、霰弹枪、手枪
- 榴弹发射器

### 配件类型 (v2.0)

- **瞄具** - 瞄准镜、机械瞄具、铁刻度
- **供弹** - 弹匣、弹鼓
- **枪口部件** - 消音器、制退器、闪光隐藏器
- **握把部件** - 前握把、手枪握把、掌托
- **枪机部件** - 枪托、护木、枪管、机匣
- **安装部件** - 导轨、刺刀、钻头
- **特殊** - 战术组合装置

### 装备与其他 (v2.0)

- **护甲类** - 防弹衣、防弹板、头盔
- **携行** - 背包、战术背心
- **其他** - 消耗品、钥匙、容器、信息物品

## 📈 运行结果示例


```

============================================================

EFT 现实主义MOD兼容补丁生成器 v2.4

============================================================

  

扫描 input 文件夹...

  发现 22 个 JSON 文件

  

加载模板库...

  weapons/: 9 个文件
  attachments/: 16 个文件
  ammo/: 3 个文件
  gear/: 5 个文件
  ✓ 模板加载完成

  

处理物品数据...

  ✓ WeaponAK74.json (3 个物品识别)
  ✓ AttachmentScopes.json (12 个物品识别)

  ...

  🛡️ 校验逻辑应用:

    - 强制数值平滑: [502] 个字段
    - 物理属性推断: [128] 个字段

  ✓ 总计: 1548 个物品识别

  
✅ 补丁生成完成！

============================================================

```

## ⚙️ 高级配置

### 修改模板文件位置

编辑 `generate_realism_patch.py` 中的模板路径配置：

```python

TEMPLATE_BASE_PATH = "现实主义物品模板"

```

### 添加自定义模板

1. 在相应的模板子文件夹中创建新的JSON文件
2. 按照现有模板格式编写数据
3. 重新运行脚本，会自动加载新模板

### 调整输出文件

所有生成的补丁文件都是标准JSON格式，可以：
- 手动编辑属性值
- 合并多个补丁文件
- 用于其他工具处理

## 🆘 常见问题 & 解决方案

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| 脚本无法运行 | Python版本过低 | 升级至Python 3.6+ |
| 生成物品数少 | 物品parentId未映射或格式不支持 | 查看控制台"跳过"信息，检查数据格式 |
| 数据格式错误 | 输入JSON不符合任何支持的格式 | 查看本README的格式示例部分 |
| 模板路径错误 | 模板文件夹不存在 | 确保"现实主义物品模板"文件夹存在 |
| 中文乱码 | 文件编码问题 | 确保所有JSON文件使用UTF-8编码 |


## 📞 技术支持

  

遇到问题？请检查以下内容：

1. **查看控制台输出** - 大部分信息会显示在运行结果中
2. **检查文件格式** - 用JSON验证工具检查JSON文件有效性
3. **检查文件编码** - 确保使用UTF-8编码
4. **查看日志信息** - 脚本会输出详细的处理过程


## 📚 相关文档


阅读以下文档获取更多信息：

- [更新完成总结.md](更新完成总结.md) - v2.4 核心功能说明 (推荐阅读)
- [现实主义“Realism”装备补丁属性规则说明.md](%E7%8E%B0%E5%AE%9E%E4%B8%BB%E4%B9%89%E2%80%9CRealism%E2%80%9D%E8%A3%85%E5%A4%87%E8%A1%A5%E4%B8%81%E5%B1%9E%E6%80%A7%E8%A7%84%E5%88%99%E8%AF%B4%E6%98%8E.md) - v2.4 校验规则源码对照
- [快速入门.md](快速入门.md) - 快速开始（3步完成）
- [高级配置指南.md](高级配置指南.md) - 深度配置和定制
- [配件数据结构更新说明.md](配件数据结构更新说明.md) - 完整属性参考


## 📝 AttributeID 属性参考

### 武器常见属性

- `Accuracy` - 精准度
- `Ergonomics` - 人体工程学
- `VerticalRecoil` - 竖直后坐力
- `HorizontalRecoil` - 水平后坐力
- `RoF` - 射速
- `CyclicalRateOfFire` - 循环射速

### 配件常见属性

- `ModType` - 配件类型
- `Ergonomics` - 人体工程学改动
- `RecoilModifier` - 后坐力修正
- `AccuracyModifier` - 精准度修正
- `Handling` - 操控性

 

更多属性详见 [高级配置指南.md](高级配置指南.md)


## ✅ 质量检查清单
  
| 检查项 | 说明 | 状态 |
|-------|------|------|
| ✓ | 所有JSON文件使用UTF-8编码 | 必需 |
| ✓ | Items文件夹存在并包含数据 | 必需 |
| ✓ | 模板库完整 | 必需 |
| ✓ | Python版本 ≥ 3.6 | 必需 |
| ✓ | 生成的补丁大小合理 | 推荐 |
| ✓ | 补丁文件可被JSON验证器打开 | 推荐 |



## 🎯 最佳实践


1. **循序渐进** - 先用少量数据测试，确认效果后再处理大量数据
2. **保存备份** - 保存原始的Items数据和生成后的补丁
3. **定期更新** - 随着现实主义MOD更新而更新补丁
4. **版本控制** - 为不同版本的补丁标记版本号
5. **测试验证** - 在游戏中充分测试补丁的有效性

## 版本信息

| 项目 | 信息 |
|------|------|
| **当前版本** | 2.0 |
| **更新日期** | 2026年2月20日 |
| **版本状态** | ✅ 稳定版 |
| **Python要求** | ≥ 3.6 |
| **依赖** | 无（仅标准库） |

## 许可证 

本项目遵循MIT许可证。详见 [LICENSE](LICENSE) 文件。

---

**上次更新**: 2026年2月20日
**贡献者**: GitHub Copilot
**反馈**: 如有建议或发现问题，欢迎反馈！