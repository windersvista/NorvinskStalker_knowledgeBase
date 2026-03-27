# EFT 现实主义数值生成器使用指南（v2.1）

##### 下载链接： 

- ###### 直接下载：
>[https://github.com/Samuel-Windersvista/Realism-patch-Generator-Csharp/releases/tag/2.1](https://github.com/Samuel-Windersvista/Realism-patch-Generator-Csharp/releases/tag/2.1)

- ###### 源代码：
>[https://github.com/Samuel-Windersvista/Realism-patch-Generator-Csharp](https://github.com/Samuel-Windersvista/Realism-patch-Generator-Csharp)


# SPT Realism Patch Generator v2.1

项目当前聚焦 3 件事：
- 基于模板和规则生成 Realism 补丁
- 在 GUI 中编辑规则范围
- 通过 item_exceptions.json 管理个别物品的最终例外覆盖

## 当前状态

- 当前版本：v2.1
- 当前主要入口：GUI、CLI
- 核心生成入口：RealismPatchGenerator.Core/RealismPatchGenerator.cs
- 当前有效生成大类：武器、附件、弹药、装备
- consumable 不在当前有效生成链路内

## 当前支持的输入情况


当前核心生成器直接支持以下输入物品格式：


1. RealismStandardTemplate
2. WttArmory_templates（仅 Armory 子类，itemTplToClone 来源为 Armory 专属文件）
3. Epic_templates（仅 EpicRangeTime 子类，itemTplToClone 来源为 Epic 专属文件）
4. ConsortiumOfThings_templates（ConsortiumOfThings_ 子类）
5. Requisitions_templates（Echoes.of.Tarkov.-.Requisitions_ 子类）
6. EcoAttachment_templates（Eco-Attachment Emporium_ 子类）
7. Artem_templates（Artem_ 子类）
8. WttStandalone_templates（AK50、AKResonant、.50BMG 等独立 WTT 来源）
9. SptBattlepass_templates（SPT Battlepass 来源）
10. RaidOverhaul_templates
11. Moxo_Template
12. Mixed_templates


其中 WTT family 目前正式支持 Armory、Epic、ConsortiumOfThings、Requisitions、EcoAttachment、Artem、WttStandalone 与 SptBattlepass 八个子类。

详细结构分组与支持状态见：

- docs/MOD物品数据结构统计报告.md

其余输入格式说明与识别特征见文档。

当前实现对“标准字段边界”采用硬规则：输入阶段允许读取 TemplateID、itemTplToClone、overrideProperties、SingleFireRate、Cartridges 等源字段用于识别、克隆和推断，但最终 output 只允许写出 Realism 标准补丁字段；源 mod 输入字段不会直接进入最终补丁。

## 当前生成规则

生成器当前遵循以下固定约束：

1. 输出条目顺序必须与输入源文件中的物品顺序一致
2. 只有 RealismStandardTemplate 且来源于 input/attatchments、input/gear、input/weapons 的输出文件保持原文件名
3. 其他当前支持的输出文件名继续在源文件名后追加 _realism_patch
4. output 不会在每次运行前整目录清空，只覆盖本次需要写出的目标文件
5. item_exceptions 会在自动规则处理完成后作为最终覆盖层应用

对 Moxo_Template，当前还额外遵循以下行为：

- 支持 clone 到模板库物品
- 支持同一源文件内 clone 到前面已生成的物品
- 只会保留克隆基底中存在的有效字段，不会把 Prefab 这类非 Realism 标准字段直接泄漏到输出补丁中

对 Mixed_templates，当前还额外遵循以下行为：

- 同文件中的 clone 条目优先复用 Moxo 路径处理
- clone 基底不可用时，会退回到 direct item/items 路径构造 Realism 基底补丁
- direct item/items 条目同样会过滤掉 Prefab 这类非 Realism 标准字段

对 RaidOverhaul_templates，当前还额外遵循以下行为：

- 优先使用 ItemToClone 对应的模板库基底
- 若 ItemToClone 不是模板真实 ItemID，会尝试按模板 Name 做别名匹配
- 若仍无法解析 clone 基底，会退回到 Handbook 和 cloneId 类别提示来构造可输出的 Realism 基底补丁

对所有第三方输入结构，当前统一遵循以下输出边界：

- `ConflictingItems` 是少数允许从源输入合并进最终补丁的结构字段
- `SingleFireRate`、`Cartridges`、`Slots`、`Prefab`、`traderItems`、`barterScheme` 等仅属于源输入语义，不属于 Realism 标准输出字段
- 是否允许输出某个字段，以 Realism 默认模板、规则字段白名单和 modType 专属字段表为准，而不是以输入里“出现过该字段”为准

  

## 目录说明

  

程序默认以仓库根目录作为数据根。当前运行时关键目录：

- input：输入源文件
- RealismItemTemplates：结构模板目录
- RealismItemRules：规则目录
- output：生成结果目录
- docs：说明文档


仓库里还保留了一些用于整理、备份、比对或调查的目录，例如中文模板目录、rules、artifacts、input备份、可用的已输出结果。这些目录可能对维护有帮助，但不代表都是当前核心生成流程的直接读取入口。

## 推荐使用方式

开发环境下启动 GUI：

```powershell

dotnet run --project RealismPatchGenerator.Gui

```

开发环境下直接用 CLI 生成：

  

```powershell

dotnet run --project .\RealismPatchGenerator.Cli\RealismPatchGenerator.Cli.csproj

```

CLI 当前定位：仅提供“一键生成补丁”入口。

CLI 支持参数：

- 位置参数 `[basePath] [outputPath]`：可选，默认使用当前目录和默认 output
- `--seed <uint>`：指定随机种子

CLI 示例：

```powershell

dotnet run --project .\RealismPatchGenerator.Cli\RealismPatchGenerator.Cli.csproj

dotnet run --project .\RealismPatchGenerator.Cli\RealismPatchGenerator.Cli.csproj -- . .\output

dotnet run --project .\RealismPatchGenerator.Cli\RealismPatchGenerator.Cli.csproj -- . .\output --seed 123456

```

规则编辑、例外物品管理、结构检查与交互式操作统一归属 GUI。

常规工作流：

1. 将输入 JSON 放入 input
2. 启动 GUI
3. 调整规则并保存到 RealismItemRules
4. 生成补丁到 output
5. 检查生成结果
6. 如有必要，再用例外物品功能写入 item_exceptions.json 做最终覆盖

## 规则与例外物品

主规则文件位于 RealismItemRules：

- weapon_rules.json
- attachment_rules.json
- ammo_rules.json
- gear_rules.json
- item_exceptions.json

其中：

- 前四个文件定义各大类的范围与修正规则
- item_exceptions.json 用于对具体 ItemID 做最终字段覆盖
  
例外物品的设计目标不是替代整类规则，而是处理少量确实需要单独落地的对象。


## 文档索引

如果要了解当前实现，请优先看这些文档：

- docs/使用说明.md
- docs/规则说明.md
- docs/补丁生成流程说明.md
- docs/MOD物品数据结构统计报告.md
- docs/规则文件与文档同步对照清单.md

## 发布说明

当前发布仍区分两种包：

- 完整包：自带运行时，适合普通用户直接使用
- 轻量包：不带运行时，要求目标机器预装匹配的 .NET Desktop Runtime

打包脚本位于：

- scripts/build-release.ps1