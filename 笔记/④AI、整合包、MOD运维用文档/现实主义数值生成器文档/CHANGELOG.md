# 更新日志

## v2.1

### 项目重构

- 重构整个项目，重新梳理生成器、规则加载、模板识别与输出落盘流程。
- 删除功能不完善的审计功能。

## v1.30.0

### 本轮调整

- 重新梳理规则的定制和输出逻辑，让输出结果更清晰、可控和稳定。
- 增强对现有MOD物品数据类型的兼容性。
- 增加兜底生成功能，对程序规则未能识别的武器装备MOD，也尽可能尝试进行基础兼容。
- 对检修功能进行改进，现在不但可以检查数值范围是否合规，还会检查物品属性是否合乎模板，极大程度避免数据结构上的错误。
- 清理旧代码。
- 全量复核 README 与 docs 文档集，统一到 GUI-only、模板驱动结构检修和当前发布方式。
- 默认发布脚本版本提升到 v1.30.0，并补充轻量运行时依赖包说明。

### 本轮修复

- 修复补丁的输出结构出错的问题
- 修复部分附件补丁字段丢失的问题
- 清理了目前所有的检修警告问题。

### 本轮验证

- 逐个检查补丁子类是否符合重新整理的规则逻辑
- 补充对应子类的生成与审计验证
- 完整测试复跑通过

## v1.22

### 新增

- GUI 新增可选 Seed 输入框，支持固定 seed 生成、清空 seed 回到随机模式，以及回填最近一次实际使用的 seed

### 调整

- 移除独立 CLI 项目入口，生成与审计流程统一收口到 GUI
- 发布脚本不再构建或打包 CLI 可执行文件
- 生成器默认改为每次运行使用新的运行时种子，重复生成时会在规则范围内重新采样
- 生成结果对象现在会显式返回本次实际使用的 seed，便于 GUI 和后续集成稳定复用
- README、使用说明和 SPTHub 文档同步改为 GUI-only 工作流，并补充随机采样、固定 seed 和 GUI seed 工作流说明
- 项目版本号更新到 v1.22
- 例外物品窗口的默认左右分栏与搜索区初始布局重新调整，减少首次打开时的拥挤感

### 修复

- 修复例外物品窗口中搜索提示文本与按钮在英文界面下的重叠问题
- 修复例外物品窗口首次打开时分栏尺寸过宽、需要手动拖动才能恢复到合适比例的问题
- 修复发布版中打开例外物品窗口时，SplitContainer 在初始化阶段因最小面板宽度与默认分栏距离冲突而崩溃的问题

### 验证

- 新增集成测试，确认相同 seed 会生成完全一致的输出

## v1.1

### 调整

- 弹药规则中的霰弹基础档拆分为 shotgun_shell_12g、shotgun_shell_20g、shotgun_shell_23x75
- 武器规则中的霰弹口径补修同步拆分为 12g、20g、23x75 三档
- GUI profile 名称、README 和主说明文档同步更新到霰弹分口径设计
- C# 版 output 改为保留输入源文件中的条目顺序，与 Python 版输出顺序对齐，便于人工核对
- README 与中英文使用说明补充当前输出顺序行为说明

### 验证

- 新增审计测试，确认 ammo_profile 与 weapon caliber_profile 能正确命中新霰弹档位
- 新增集成测试，确认生成结果会保留输入条目顺序
- 重新生成 output 并全量对比 Python 版，210 个同名 JSON 文件的 ItemID 顺序全部一致
- CLI 审计复跑通过，当前 output 审计结果为 0 违规、0 警告

### 修复

- 修正一处 user_templates 集成测试中的输出文件名预期，消除无关测试噪音

### 当前保留项

- 仍需基于实际生成结果继续微调 12g、20g、23x75 三档的手感范围

## v1.0

### 新增

- 例外物品管理窗口重构为按 Name 搜索 output 物品的工作流
- 例外物品编辑区支持按当前物品大类新增允许字段
- 新增字段编辑支持规则驱动的建议范围和保存时安全夹紧
- 例外物品窗口增加明确的“保存物品”流程
- 主文档集统一整理为当前 C# 项目的 v1.0 版本

### 调整

- “新增字段”按钮文案更新为“新增/修改字段”，与当前实际行为一致
- 例外物品窗口只搜索 output 结果，不再按旧说明搜索 input
- 输出与文档说明统一为“按目标文件覆盖写出，不整目录清空 output”
- docs 目录删除重复别名文档，只保留主文档集
- README 同步到 v1.0，并补充例外物品与审计现状说明

### 修复

- 修复例外物品窗口中备注框、字段按钮和保存按钮的布局可见性问题
- 修复装备类特殊字段候选与例外编辑流程的多处可用性问题

### 当前保留项

- GUI 自动化交互测试尚未补齐
- 仍需继续做更细的数值回归和界面打磨

## v0.9

### 新增

- 新增结构化规则范围编辑 GUI
- 新增左侧规则分类树与中部范围编辑表
- 新增字段说明面板与运行日志面板
- 新增 profile 中文友好名称映射
- 新增保存、重新加载、生成补丁、检查未遵循规则物品工作流
- 新增使用说明文档与规则说明文档
- 新增例外物品管理窗口，可按 ItemID 保存最终字段覆盖
- 新增 rules/item_exceptions.json 配置文件，并接入生成与检查链路
- 新增例外物品字段导入能力，可从 output 或 input 现有物品导入顶层字段
- 新增例外物品字段表格编辑器，替代整段原始 JSON 覆盖编辑
- 新增主界面例外物品只读总览页，便于快速查看当前配置命中项

### 调整

- GUI 名称更新为 SPT现实主义数值范围编辑生成器 v0.9
- 中文界面作为当前优先优化方向
- 将“执行审计”相关中文表述统一调整为“检查未遵循规则物品”
- 左侧规则分类栏宽度按当前中文阅读体验重新调整
- 规则范围表移除冗余的档位列，将空间留给核心编辑字段

### 保留问题 / 后续计划

- 英文界面仍保留基础支持，但尚未继续细修
- GUI 自动化交互测试尚未补齐
- 部分 profile 中文名称仍可继续按项目术语优化

# Changelog

## Unreleased

- None

## v2.0

### Project Refactor

- Refactored the project structure and generation pipeline, including rule loading, template recognition, merge flow, and output writing.
- Added stable support for multiple MOD input shapes, including RealismStandardTemplate, Moxo_Template, and Mixed_templates.
- Added a dedicated CLI entry point with seed, logging, file filter, and directory filter support for targeted generation and debugging.
- Unified output naming and item ordering rules so standard template outputs keep their original names while other compatible outputs use the _realism_patch suffix.
- Changed clone merge precedence so legal source fields override conflicting official clone base values.
- Added a final allowed-field pruning stage so generated patches only contain fields permitted by rules or templates.
- Removed default template field leakage and normalized dirty field casing to prevent invalid or duplicated output fields.
- Rewrote README and docs so the documentation matches the current GUI/CLI workflow and rule-driven output behavior.

### Fixes

- Fixed cases where clone chains could lose source fields, produce unstable names, or break source item order.
- Fixed ConflictingItems being cleared incorrectly for some generated items such as SIG MCX entries.
- Fixed handguard outputs incorrectly containing ChamberSpeed.
- Fixed Moxo item output issues where Name could be taken from the wrong source and Prefab could leak into the final patch.
- Fixed invalid fields such as weapFireType, shotgunDispersion, RecoilCenter, BurstShotsCount, and DoubleActionAccuracyPenalty appearing in SIG MCX output.

### Validation

- Verified targeted outputs across the supported input structures, including Moxo, Mixed, and standard template items.
- Validated CLI generation for single-file, single-directory, and full-output workflows.
- Regenerated the formal output set and spot-checked key samples to confirm invalid fields were removed while legal fields and ConflictingItems were preserved.

## v1.30.0

### Changes

- Reworked rule customization and output generation flow so results are clearer, more controllable, and more stable.
- Expanded fallback generation so the tool can still attempt basic compatibility for weapon and equipment mods whose rule style is not fully recognized.
- Improved auditing so it now checks not only numeric ranges but also whether item properties match their templates, greatly reducing structural output errors.
- Removed historical output samples, temporary build artifacts, and directories unrelated to the current GUI-first workflow.
- Reviewed README and the docs set end to end, aligning them to the GUI-only workflow, template-driven structure auditing, and the current release process.
- Raised the default release script version to v1.30.0 and added notes for the lightweight runtime-dependent package.

### Fixes

- Fixed incorrect output structure in generated patches.
- Fixed missing fields in some attachment patches.
- Cleared the current set of audit warnings.

### Verification

- Rechecked patch subclasses one by one against the reorganized rule logic.
- Added matching generation and audit validation for the adjusted subclasses.
- Re-ran the full test pass successfully.

## v1.22

### Added

- Added an optional Seed input box to the GUI, supporting fixed-seed generation, clearing the seed back to random mode, and restoring the most recently used seed.

### Changed

- Removed the standalone CLI entry point and consolidated generation and audit flow into the GUI.
- Updated the release script so it no longer builds or packages the CLI executable.
- Changed the generator default so each run uses a fresh runtime seed and repeated runs resample values within rule ranges.
- Updated generation results so they explicitly return the actual seed used in that run, making GUI reuse and downstream integration more stable.
- Synchronized README, user guides, and SPTHub docs to the GUI-only workflow, and added notes about random resampling, fixed seeds, and the GUI seed workflow.
- Updated the project version to v1.22.
- Adjusted the default split layout and search area layout in the Item Exceptions window to reduce the crowded first-open experience.

### Fixes

- Fixed overlap between search hint text and buttons in the Item Exceptions window under the English UI.
- Fixed the issue where the split layout in the Item Exceptions window initially opened too wide and needed manual dragging to return to a usable ratio.
- Fixed a release-build crash when opening the Item Exceptions window, caused by a SplitContainer initialization conflict between minimum panel width and the default splitter distance.

### Verification

- Added an integration test to confirm that identical seeds produce identical output.

## v1.1

### Changed

- Split the base shotgun ammo profile rules into shotgun_shell_12g, shotgun_shell_20g, and shotgun_shell_23x75.
- Split the shotgun caliber repair logic in weapon rules into separate 12g, 20g, and 23x75 profiles.
- Updated GUI profile names, README, and the main guide to match the new shotgun-by-caliber design.
- Changed C# output to preserve item order from input source files so it matches Python output ordering and is easier to review manually.
- Updated README and both Chinese and English user guides to document the current output ordering behavior.

### Verification

- Added audit tests to confirm that ammo_profile and weapon caliber_profile correctly map to the new shotgun profiles.
- Added an integration test to confirm that generated output preserves input item ordering.
- Regenerated output and compared it against the Python version; all 210 same-named JSON files matched in ItemID order.
- Re-ran CLI audit successfully, with the current output showing 0 violations and 0 warnings.

### Fixes

- Corrected one expected output filename in a user_templates integration test and removed unrelated test noise.

### Remaining

- The 12g, 20g, and 23x75 handling ranges still need additional tuning based on real generated results.

## v1.0

### Added

- Reworked the Item Exceptions management window into a workflow based on searching output items by Name.
- Added allowed-field insertion based on the current item category in the Item Exceptions editor.
- Added rule-driven suggested ranges and safe clamping when saving newly edited fields.
- Added an explicit Save Item workflow in the Item Exceptions window.
- Reorganized the main documentation set into the v1.0 documentation for the current C# project.

### Changed

- Updated the Add Field button label to Add/Modify Field so it matches actual behavior.
- Changed the Item Exceptions window to search only output results instead of input as older docs described.
- Unified output and documentation wording to clarify that target files are overwritten without clearing the whole output directory.
- Removed duplicate alias documents from docs and kept only the primary documentation set.
- Updated README to v1.0 and added notes about Item Exceptions and the current audit status.

### Fixes

- Fixed layout and visibility issues around the remarks box, field buttons, and save button in the Item Exceptions window.
- Fixed multiple usability issues around gear-specific field candidates and the Item Exceptions editing flow.

### Remaining

- GUI automation interaction tests are still missing.
- More detailed numeric regression and UI polish are still needed.

## v0.9

### Added

- Added a structured GUI for editing rule ranges.
- Added a rule category tree on the left and a range editing table in the center.
- Added a field description panel and a runtime log panel.
- Added user-friendly Chinese mappings for profile names.
- Added workflows for save, reload, generate patches, and check items that do not follow rules.
- Added the user guide and rule overview documentation.
- Added an Item Exceptions management window that stores final field overrides by ItemID.
- Added the rules/item_exceptions.json configuration file and integrated it into generation and checking.
- Added the ability to import Item Exception fields from existing top-level fields in output or input items.
- Added a table-based Item Exception field editor to replace raw JSON block editing.
- Added a read-only Item Exceptions overview page on the main window for quick inspection of current matched items.

### Changed

- Updated the GUI name to SPT Realism Value Range Editor Generator v0.9.
- Set the Chinese UI as the current primary optimization direction.
- Unified Chinese audit wording around checking items that do not follow rules.
- Adjusted the width of the left rule category pane for the current Chinese reading experience.
- Removed the redundant profile level column from the rule range table and gave that space back to core editing fields.

### Known Issues / Next Steps

- The English UI still has basic support, but has not yet received further polish.
- GUI automation interaction tests are still missing.
- Some Chinese profile names can still be improved to better match project terminology.
