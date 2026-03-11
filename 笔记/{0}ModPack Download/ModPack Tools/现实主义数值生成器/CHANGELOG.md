# 更新日志

本文件记录项目中所有重要变更。

格式参考 Keep a Changelog，版本号沿用仓库历史中的语义化风格。

## [Unreleased]

## [v3.12] - 2026-03-12

### 变更
- 武器第三层枪托细分修正补充 `CameraRecoil` 与 `VisualMulti` 两个字段到全部档位（`fixed_stock` / `folding_stock_extended` / `folding_stock_collapsed` / `bullpup` / `stockless`），以区分机械后坐与视觉/镜头后坐。
- 新增武器口径子档 `intermediate_rifle_58x42`，并加入 `5.8x42` / `58x42` / `Caliber58x42` 关键词映射，覆盖 QBZ191 类输入。

### 修复
- 修复部分 `9x39` 武器在仅有名称口径信息时未稳定命中口径细分的问题，确认 `subsonic_heavy_9x39` 可通过主流程识别并参与数值重算。

## [v3.11] - 2026-03-11

### 变更
- 扩展瞄具名称识别关键词，新增 `1p87`、`comp_m4/compm4`、`boss_xe` 及历史拼写兼容词（如 `aimpooint`）。
- 调整 `ModType = sight` 在 `ScopeTemplates.json` 条件下的兜底顺序：关键词未命中时优先按红点兜底，降低因通用 parent 回填导致的高倍率偏置。

### 修复
- 修复 `5c7d55de2e221644f31bff68`、`655f13e0a246670fb0373245`、`5c0505e00db834001b735073` 等红点/全息镜条目被套用高倍率规则的问题。

## [v3.10] - 2026-03-10

### 变更
- 优化瞄具档位识别：`ModType = sight` 的判定顺序调整为“名称关键词优先 -> parent/base_profile 回退 -> 默认 red dot”。
- 扩展 `_infer_sight_profile_from_name` 关键词与倍率规则，补充红点/全息常见命名（如 `eotech`、`aimpoint`、`holosun`、`rmr` 等）及倍率表达式识别（如 `1x`、`3x`、`1-4x`）。

### 修复
- 修复 `ScopeTemplates` 在 `CURRENT_PATCH` 且 `parentId` 缺失时，因 parent 回填优先导致大量 `sight` 条目被归并为同一档位的问题。

## [v3.9] - 2026-03-10

### 变更
- 调整 `weapon_refinement_rules.py` 中 `stockless` 相关修正策略，使冲锋枪在“无抵肩”场景下不再出现显著超出预期的后坐抬升。
- 对齐 `mount` 附件热量字段策略，避免为无热管理语义的导轨/镜座注入不必要的 `HeatFactor` / `CoolFactor` 数值。

### 修复
- 修复部分 `SMGTemplates` 条目在 `stockless` 命中后 `VerticalRecoil` 明显偏离武器规则指南预期的问题。
- 修复 `mount` 档位出现 `HeatFactor: 0.01`、`CoolFactor: 0.01` 的无意义占位值问题。

## [v3.8] - 2026-03-10

### 新增
- 基于 `现实主义物品模板/ammo/ammoTemplates.json`（402 条）重建弹药第三层类型词典。
- 第三层新增档位：`tracer`、`shot_shell_payload`、`ball_standard`，覆盖示踪弹、霰弹载荷类与普通球弹族。

### 变更
- `AMMO_SPECIAL_KEYWORDS` 与 `AMMO_SPECIAL_MODIFIERS` 按模板真实 `Name` 词元重新制定，并保留 `model_m995` / `model_m855a1` 优先档位。
- `generate_realism_patch.py` 的第三层识别改为“词元精确匹配优先”，复合词保留短语匹配能力。

### 修复
- 修复短关键词（如 `ap` / `sp`）在子串匹配下可能误命中无关名称的问题（例如 `lapua` 类文本）。

### 文档
- 更新 `弹药属性规则指南.md` 第 2.1 节，明确第三层数据来源、档位定义与匹配机制。

## [v3.7] - 2026-03-10

### 新增
- 弹药规则新增第三层“弹种型号”分类：`AMMO_SPECIAL_KEYWORDS` + `AMMO_SPECIAL_MODIFIERS`。
- 新增型号优先档位：`model_m995`、`model_m855a1`，用于同口径内高穿弹精细区分。
- 穿深分层扩展为 `11` 级，新增 `pen_lvl_11`（`101~130`）用于非常大口径/极高压/顶级高穿深弹药。

### 变更
- `AMMO_PENETRATION_TIERS` 改为 `1~130` 的分层体系，按每 10 点约 1 级映射，`pen_lvl_10` 调整为 `91~100`。
- 重设各弹药类型 `PenetrationPower` 区间以匹配新分层体系，并同步二级穿深增量修正。
- 补充无点格式口径关键词兼容（如 `556x45`、`545x39`、`58x42`、`Caliber58x42`），修复部分第三方弹药误落入默认档的问题。
- `ArmorDamage` 规则统一为护甲/插板耐久损伤倍率，最终值硬限制在 `1.00~1.20`。

### 修复
- 修复同口径下 `M995` 与 `M855A1` 等高穿弹在随机采样下可能出现关系反转的问题（通过第三层型号修正显著降低概率）。

### 文档
- 更新 `弹药属性规则指南.md`：补充 11 级穿深标准映射、第三层型号规则、以及新默认穿深档位说明。

## [v3.6] - 2026-03-10

### 新增
- 弹药规则新增 3 个故障相关字段：`MalfMisfireChance`、`MisfireChance`、`MalfFeedChance`。
- 在高穿深档位（`pen_high` / `pen_very_high` / `pen_ap_extreme`）中加入故障概率正向增量修正。

### 变更
- `ArmorDamage` 全面切换为系数制语义，范围统一到小数倍率体系（目标约 `1.00 ~ 1.50`）。
- 高压口径（`rifle_762x51` / `full_power_rifle` / `magnum_heavy` / `anti_materiel_50bmg`）故障概率上限提升到 `0.015`。
- `generate_realism_patch.py` 对故障概率字段增加硬限制：最终值统一夹紧在 `0.001 ~ 0.015`。

### 文档
- 更新《弹药属性规则指南》：覆盖字段由 12 项扩展到 15 项，补充故障字段解释与高压/高穿规则说明。

## [v3.5] - 2026-03-10

### 新增
- 新增独立弹药规则配置模块 `ammo_rule_ranges.py`，统一管理弹药基础区间、口径关键词映射与穿深档位修正。
- 新增弹药属性规则文档 `弹药属性规则指南.md`，覆盖字段、档位逻辑、命中优先级与调参建议。

### 变更
- `generate_realism_patch.py` 接入弹药规则应用链路：支持口径识别、穿深档位识别、二级修正叠加及缺失字段补齐。
- 弹药规则按 EFT 手感方向细调，强化低穿弹肉伤倾向与高穿/AP 弹在热量、耐久损耗、后坐/精度侧的代价。
- 新增口径子档规则（`5.45x39`、`5.56x45`、`7.62x39`、`7.62x51`、`9x39`、`.300 AAC/.300 BLK`），并提升关键词优先级以避免误分类。

### 兼容性
- 保持输入格式兼容范围与输出目录策略不变；本次为弹药数值规则层增强。

## [v3.0] - 2026-03-10

### 变更
- 以 `CURRENT_PATCH` 为一等标准输入，重构识别与兼容主流程：先做统一 `item_info` 归一化，再进行规则推断与数值应用。
- 新增基于 `source_file` 的上下文补全链路，支持从输入文件路径推断 `template_file`，并在缺失 `parentId` 时反推 `parent_id`。
- 武器规则推断新增 `template_file -> weapon_profile` 兜底映射，避免 `WeapType` 为空或名称不规范时漏命中。
- `template_file -> parent_id` 从手工小映射升级为基于 `PARENT_ID_TO_TEMPLATE` 的反向索引，降低后续维护成本。

### 修复
- 修复 `input/weapons` 中大量 `CURRENT_PATCH` 条目因缺失 `parentId/WeapType` 导致武器主规则与二级细分规则未生效的问题。
- 修复兼容顺序倒置导致的“标准数据反而不稳定、第三方格式优先”问题，统一为“标准优先，兼容扩展随后”。

### 兼容性
- 保持输入格式兼容范围不变（`CURRENT_PATCH` / `STANDARD` / `CLONE` / `ITEMTOCLONE` / `VIR` / `TEMPLATE_ID`）。
- 输出目录结构与按源文件导出策略不变；本次为识别与规则命中架构重构。

## [v2.13] - 2026-03-10

### 变更
- 增强 `CURRENT_PATCH` 分支的附件档位推断：当 `parentId` 缺失时，新增基于 `Name/ModType` 的 `template_file` 兜底映射，避免 `ReceiverTemplates` / `GasblockTemplates` 规则漏命中。
- 附件名称兜底识别新增 `reciever_` 拼写兼容（与 `receiver_` 等效），提升历史数据兼容性。

### 修复
- 修复 `input/attatchments/ReceiverTemplates.json` 中大量 `reciever_*` 条目因 `parentId`、`ModType` 为空且名称拼写差异导致 `receiver` 规则未生效的问题。
- 修复 `receiver` 规则未命中时输出数值近似照搬输入源的问题，确保 `AutoROF`、`SemiROF`、`Convergence` 等规则字段可按区间落地。

### 兼容性
- 不改变输入格式兼容范围与输出目录结构，仅修正附件 profile 推断链路与规则命中稳定性。

## [v2.12] - 2026-03-09

### 新增
- 规则应用新增“字段补齐”能力：当规则字段在补丁中缺失时，先生成区间内基准值，再执行加权重算，避免 `Handling` 等字段因不存在而跳过。
- `ItemInfo` 新增 `template_file` 信息链路，并在 `TEMPLATE_ID` / `STANDARD` / `VIR` / `CLONE` / `ITEMTOCLONE` 分支补齐来源模板信息。
- 新增按模板文件名推断附件档位的兜底逻辑（如 `FlashlightLaserTemplates.json -> flashlight_laser`）。

### 变更
- `_apply_numeric_ranges` 支持 `ensure_fields=True`，并在武器与附件主规则应用中启用，规则从“命中已存在字段”升级为“规则字段必命中并生效”。
- 武器二级细分（口径/枪托）改为可对缺失字段先补值再应用修正，降低细分规则漏命中概率。
- 附件名称兜底识别扩展 `flashlight` / `laser` / `tactical` / `peq` / `dbal` / `x400` / `xc1` 关键词。

### 修复
- 修复 `FlashlightLaserTemplates` 等附件在 `parent_id` 缺失或 `ModType` 为空时，`flashlight_laser` 规则不触发的问题。
- 修复附件规则仅在 `key in patch` 时生效导致的“配置了区间但输出不变”问题。

### 兼容性
- 输入格式兼容范围不变（`CURRENT_PATCH` / `STANDARD` / `CLONE` / `ITEMTOCLONE` / `VIR` / `TEMPLATE_ID`）。
- 输出目录与按源文件导出策略不变；本次改动仅影响规则命中方式与字段落地行为。

## [v2.11] - 2026-03-08

### 变更
- 基于输出结果审查，下调武器基础后坐范围（含手枪/霰弹/狙击/突击等档位）。
- 下调口径与枪托二级修正规则中的正向后坐增量，缓解整体后坐偏高问题。
- 新增 `machinegun` 与 `launcher` 武器档位并参与规则夹紧，减少极端横向后坐离群值。
- 武器全局后坐夹紧增强：`VerticalRecoil` 上限与 `HorizontalRecoil` 上限收紧。
- 适度强化附件减后坐范围（枪口、枪托、前握把、中/长护木）。

### 兼容性
- 输入输出格式不变，规则调优仅影响数值区间与夹紧结果。

## [v2.10] - 2026-03-08

### 新增
- 在 `weapon_refinement_rules.py` 中新增口径关键词映射配置 `CALIBER_PROFILE_KEYWORDS`，用于可维护的口径识别策略。

### 变更
- 口径细分新增 `7.62x39`（中间威力）、`7.62x51`（全威力）、`7.62x54R`（全威力有缘弹）独立档位修正。
- 主脚本口径识别从硬编码改为读取配置映射，提高可扩展性。
- 更新脚本横幅与内嵌版本历史为 `v2.10`。

### 兼容性
- 原有输入输出与一级规则流程保持不变，仅增强口径识别细度与可配置能力。

## [v2.9] - 2026-03-08

### 新增
- 新增 `weapon_refinement_rules.py`，提供“口径 + 枪托形态”武器二级修正规则配置。

### 变更
- 在武器规则校验流程中，新增二级细分修正：先应用基础武器档位，再叠加口径和枪托修正。
- 更新脚本横幅与内嵌版本历史为 `v2.9`。

### 兼容性
- 保持原有输入格式和输出结构不变，仅增强武器数值规则的细分精度。

## [v2.8] - 2026-03-08

### 新增
- 新增 `weapon_rule_ranges.py`，将武器规则范围 `WEAPON_PROFILE_RANGES` 独立为可维护配置文件。

### 变更
- 主脚本改为从 `weapon_rule_ranges.py` 导入武器规则范围，并保留 `WEAPON_PARENT_GROUPS` 作为档位识别映射。
- README 高级配置补充武器规则独立配置说明，与附件规则配置方式保持一致。
- 更新脚本横幅与内嵌版本历史为 `v2.8`。

### 兼容性
- 规则生效逻辑保持不变，仅配置来源从脚本内嵌常量迁移为外部文件。

## [v2.7] - 2026-03-08

### 新增
- 新增 `CURRENT_PATCH` 输入格式识别，支持直接处理 `"$type" + "ItemID"` 的现有补丁对象数据。

### 变更
- 导出策略调整为仅按源文件输出，不再生成按类型聚合补丁和总合并补丁。
- 按源文件导出时保留 `input` 的目录结构到 `output`。
- 每次导出前自动清空 `output` 目录旧结果，确保输出与本次输入一致。
- 更新脚本横幅与内嵌版本历史为 `v2.7`。

### 兼容性
- 保持输入格式兼容：`CURRENT_PATCH`、`STANDARD`、`CLONE`、`ITEMTOCLONE`、`VIR`、`TEMPLATE_ID`。
- 输出兼容策略变更：仅保留按源文件输出（含目录结构）。

## [v2.5] - 2026-03-08

### 新增
- 接入 `武器属性规则指南.md` 与 `附件属性规则指南.md` 的规则层。
- 新增武器档位范围控制：`assault`、`pistol`、`smg`、`sniper`、`shotgun`。
- 新增附件档位范围控制：枪口装置、弹匣、导气箍、瞄具、枪托、握把、机匣、枪管、护木等。
- 新增 `RealismMod.Gun` 与 `RealismMod.WeaponMod` 的必填字段兜底约束。

### 变更
- 将 `process_single_item` 重构为“流程编排 + 专用助手”结构，拆分格式分支（`TEMPLATE_ID`、`CLONE`、`ITEMTOCLONE`）及基于 parent 的构建/存储阶段。
- 将文件处理与生成流程重构为更小方法（读取、处理、汇总输出）。
- 将补丁导出流程重构为按源文件、按类型、合并输出三个保存助手。
- 将脚本横幅与内嵌版本历史更新为 `v2.5`。

### 修复
- 修复 `ITEMTOCLONE` 流程在解析 `parent_id` 后未刷新类型标记的问题。
- 修复类型标注与可选路径相关问题，满足静态诊断要求。

### 兼容性
- 保持输入格式兼容：`STANDARD`、`CLONE`、`ITEMTOCLONE`、`VIR`、`TEMPLATE_ID`。
- 保持输出兼容：按源文件补丁、按类型补丁、合并补丁三类输出均保留。

## [v2.4] - 2026-02-21

### 新增
- 引入现实主义优先级校验，用于约束夸张数值。
- 新增自动物理推断规则（材质影响、尺寸缩放、枪管长度推断初速）。
- 强化模板选择策略，优先使用 `itemTplToClone` / `clone` 提升匹配基线质量。

### 变更
- 改进属性合并保护，降低非 Realism 源数据覆盖核心 Realism 数值的风险。
- 修正护甲/胸挂/战术背心映射路径与类型识别逻辑。

## [v2.3.1] - 2026-02-21

### 修复
- 修复 `__init__` 中缺失分类字典初始化导致的 `AttributeError`。

## [v2.3] - 2026-02-21

### 新增
- 新增按源文件名输出补丁的能力。

## [v2.2] - 2026-02-21

### 新增
- 新增输入属性优先策略，并完善 locale 名称提取逻辑。

## [v2.1] - 2026-02-21

### 变更
- 输入目录由 `Items` 调整为 `input`。

## [v2.0] - 2026-02-20

### 新增
- 新增 `ItemToClone` 格式支持。

## [v1.9] - 2026-02-20

### 新增
- 新增 `input` 子目录递归 JSON 扫描能力。

## [v1.8] - 2026-02-20

### 新增
- 新增文件内 `clone` 引用链递归处理与 `enable` 字段校验。

## [v1.7] - 2026-02-20

### 新增
- 新增消耗品模板加载（`food.json`、`meds.json`）及消耗品补丁输出。
- 新增战术组合装置（tactical combo）支持。

## [v1.6] - 2026-02-20

### 新增
- 新增 ammo 与 gear 模板支持。
- 新增 `TemplateID` 格式兼容。

### 变更
- 模板目录迁移到 `现实主义物品模板`。

## [v1.5.1] - 2026-02-20

### 新增
- 新增 Armor_Plate（`5b5f704686f77447ec5d76d7`）识别支持。

## [v1.5] - 2026-02-20

### 新增
- 新增 `CLONE` 格式支持，可按 clone ID 继承模板。

## [v1.4] - 2026-02-20

### 新增
- 新增字符串名称 `parentId` 规范化（例如 `GAS_BLOCK` 转 ID）。

## [v1.3] - 2026-02-20

### 新增
- 新增通过父类 ID `5485a8684bdc2da71d8b4567` 识别弹药。

## [v1.2] - 2026-02-20

### 新增
- 新增 VIR 格式支持并扩展父类映射。

## [v1.1] - 2026-02-20

### 新增
- 新增完整配件结构支持与更智能的类型识别。

## [v1.0] - 2026-02-20

### 新增
- 初始版本发布。
