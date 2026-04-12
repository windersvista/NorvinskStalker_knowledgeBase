# 现实主义“Realism”装备补丁属性规则说明

本文档定义当前生成器认可的 Realism 标准输出字段边界，并说明各字段在最终补丁中的作用。

## 1. 文档目的

本文档解决两个问题：

- 哪些字段属于 Realism 标准补丁字段
- 这些字段在最终输出中的作用是什么

当前仓库的硬规则是：

- 输入 JSON 中出现过的字段，不等于允许输出的字段
- TemplateID、itemTplToClone、ItemToClone、overrideProperties、Prefab、traderItems、barterScheme、SingleFireRate、Cartridges、Slots 等都可以是源 mod 输入字段
- 最终 output 只能保留 Realism 标准补丁字段
- 字段边界以代码中的默认模板、规则字段白名单和 modType 专属字段表为准，而不是以第三方 mod 的原始结构为准

## 2. 字段边界来源

当前标准输出字段由以下几部分共同决定：

1. 默认 Realism 模板
2. 规则文件声明的可生成字段
3. 按 modType 追加的专属字段
4. 最终输出白名单裁剪

对应代码来源如下：

- 武器默认模板：RealismPatchGenerator.Core/StaticData.cs 中的 CreateDefaultWeaponTemplate
- 弹药默认模板：RealismPatchGenerator.Core/StaticData.cs 中的 CreateDefaultAmmoTemplate
- 装备默认模板：RealismPatchGenerator.Core/StaticData.cs 中的 CreateDefaultGearTemplate
- 附件默认模板：RealismPatchGenerator.Core/StaticData.cs 中的 CreateDefaultModTemplate
- modType 专属字段：RealismPatchGenerator.Core/StaticData.cs 中的 ModTypeSpecificAttributes
- 最终输出裁剪：RealismPatchGenerator.Core/RealismPatchGenerator.cs 中的 CreateAllowedFieldMap、AddRuleAllowedFields、AddRequiredAllowedFields、PruneDisallowedOutputFields

## 3. 总体原则

所有类型都遵循以下共性：

- $type：Realism 补丁类型标识，决定客户端按哪类模板解释当前条目
- ItemID：物品模板 ID，必须与对象键一致
- Name：仅用于可读性和排查，不决定规则分组
- ConflictingItems：与原始冲突列表合并的附加冲突项，是当前唯一允许从第三方源结构继续透传到标准输出的通用结构字段

以下字段不属于 Realism 标准输出字段：

- TemplateID
- itemTplToClone
- ItemToClone
- clone
- overrideProperties / OverrideProperties
- Prefab
- traderItems
- barterScheme
- StaticLootContainer / StaticLootContainers
- SingleFireRate
- Cartridges
- Slots
- AimSensitivity
- CalibrationDistances
- ModesCount
- IsAdjustableOptic
- sightModType

这些字段可以参与输入识别、基底克隆、类别推断或内部计算，但不会进入最终补丁输出。

## 4. 武器标准字段

武器类型固定为：RealismMod.Gun, RealismMod

### 4.1 基础识别字段

- $type：声明该条目为武器补丁
- ItemID：武器模板 ID
- Name：武器显示名或调试名
- ConflictingItems：需要额外合并的冲突物品列表

### 4.2 武器分类与操作字段

- WeapType：武器分类，如 rifle、smg、pistol 等；决定武器规则档位和价格区间
- OperationType：动作机构类型，用于标识半自动、栓动、泵动等操作方式
- HasShoulderContact：是否具备有效抵肩支撑
- IsManuallyOperated：是否为手动操作武器
- WeaponAllowADS：是否强制允许开镜

### 4.3 武器核心数值字段

- WeapAccuracy：基础武器精度修正
- BaseTorque：基础平衡与前后配重倾向
- Ergonomics：基础人机工程
- VerticalRecoil：垂直后坐
- HorizontalRecoil：水平后坐
- Dispersion：散布
- CameraRecoil：相机后坐
- VisualMulti：视觉后坐倍率
- Convergence：操控响应和平顺性
- RecoilAngle：后坐方向角
- RecoilIntensity：后坐动画强度
- OffsetRotation：开火后偏转幅度
- RecoilDamping：上下方向后坐阻尼
- RecoilHandDamping：前后方向后坐阻尼

### 4.4 武器可靠性与热量字段

- BaseMalfunctionChance：基础故障率
- HeatFactorGun：武器本体热量累积系数
- HeatFactorByShot：每次击发的热量倍率
- CoolFactorGun：武器本体散热系数
- CoolFactorGunMods：附件散热对武器的影响倍率
- AllowOverheat：是否允许进入过热逻辑
- DurabilityBurnRatio：耐久损耗比例
- BaseFixSpeed：故障处理速度基值

### 4.5 命中与操控附加字段

- CenterOfImpact：内置枪管或整体系统对命中的影响
- HipAccuracyRestorationDelay：腰射精度恢复延迟
- HipAccuracyRestorationSpeed：腰射精度恢复速度
- HipInnaccuracyGain：连续腰射散布累积
- ShotgunDispersion：霰弹散布修正
- Velocity：内置枪管或整体结构带来的初速修正

### 4.6 射速与装填字段

- AutoROF：全自动射速
- SemiROF：半自动射速
- BurstShotsCount：点射模式每次连发数量
- BaseReloadSpeedMulti：装填速度基值
- MinReloadSpeed：装填速度下限
- MaxReloadSpeed：装填速度上限
- BaseChamberSpeedMulti：上膛速度基值
- MinChamberSpeed：上膛速度下限
- MaxChamberSpeed：上膛速度上限
- BaseChamberCheckSpeed：验膛速度基值

### 4.7 可视后坐开关字段

- EnableBSGVisRecoil：是否启用 BSG 可视后坐链路
- ReduceBSGVisRecoil：是否压低 BSG 可视后坐效果

### 4.8 交易与权重字段

- Weight：武器重量
- LoyaltyLevel：商人解锁等级
- Price：生成器输出的标准价格字段

## 5. 附件标准字段

附件类型固定为：RealismMod.WeaponMod, RealismMod

### 5.1 通用字段

- $type：声明该条目为附件补丁
- ItemID：附件模板 ID
- Name：附件显示名或调试名
- ModType：附件分类，如 sight、magazine、barrel、muzzle、foregrip 等；决定可输出字段集合
- ConflictingItems：附加冲突项列表
- Ergonomics：人机工程修正
- Weight：附件重量
- LoyaltyLevel：商人等级
- Price：附件价格
- VerticalRecoil：垂直后坐修正
- HorizontalRecoil：水平后坐修正
- AimSpeed：举枪与进入瞄准速度修正
- Accuracy：精度修正

### 5.2 通用扩展字段

这些字段由规则白名单直接允许输出，是否实际存在取决于物品类型与规则：

- Dispersion：整体散布修正
- CameraRecoil：相机后坐修正
- AimStability：瞄准稳定性修正
- Flash：枪口焰或气体表现修正
- HeatFactor：发热系数修正
- CoolFactor：冷却系数修正
- Handling：操控与惯性修正
- ReloadSpeed：装填速度修正
- LoadUnloadModifier：弹匣装弹/退弹速度修正
- CheckTimeModifier：检查弹匣速度修正
- ModMalfunctionChance：故障率修正
- DurabilityBurnModificator：耐久损耗修正

### 5.3 按 modType 输出的标准字段

以下字段只有在对应 modType 下才属于标准输出字段：

- HasShoulderContact：枪托类附件是否提供有效抵肩
- BlocksFolding：是否阻止枪托折叠
- StockAllowADS：枪托或适配器是否强制允许开镜
- AutoROF：附件对全自动射速的修正
- SemiROF：附件对半自动射速的修正
- Convergence：附件对操控平顺性的修正
- CenterOfImpact：枪管类附件对命中的修正
- Velocity：枪管或枪口装置对初速的修正
- Loudness：噪音修正
- CanCycleSubs：是否允许可靠循环亚音速弹
- RecoilAngle：后坐角度修正
- ModShotDispersion：霰弹散布修正
- ChamberSpeed：泵动握把或机匣类对上膛速度的修正
- FixSpeed：某些附件对故障处理速度的修正
- MalfunctionChance：弹匣类故障率修正
- MeleeDamage：刺刀类近战伤害
- MeleePen：刺刀类近战穿透

### 5.4 典型边界说明

- magazine 标准输出里允许 LoadUnloadModifier 与 CheckTimeModifier，但不允许 Cartridges
- sight 标准输出只允许 Realism 定义过的瞄具字段，不允许 AimSensitivity、CalibrationDistances、ModesCount、IsAdjustableOptic、sightModType
- receiver、handguard、mount 是否允许某字段，取决于 Realism 默认模板、规则白名单和 modType 专属字段表；第三方输入里的 Slots 不会进入最终补丁

## 6. 装备标准字段

装备类型固定为：RealismMod.Gear, RealismMod

### 6.1 基础字段

- $type：声明该条目为装备补丁
- ItemID：装备模板 ID
- Name：装备显示名或调试名
- AllowADS：是否允许开镜
- LoyaltyLevel：商人等级
- TemplateType：装备模板分类标识，当前固定用于 gear 路径
- Price：装备价格
- Weight：装备重量

### 6.2 防护与体验字段

- ArmorClass：护甲等级描述
- CanSpall：是否允许破片逻辑
- SpallReduction：破片减伤比例
- ReloadSpeedMulti：装填速度倍率
- Comfort：舒适度或负重体验修正
- speedPenaltyPercent：移动速度惩罚
- mousePenalty：鼠标或视角惩罚
- weaponErgonomicPenalty：对武器人机工程的惩罚
- GasProtection：毒气防护能力
- RadProtection：辐射防护能力
- dB：听觉或降噪相关修正

## 7. 弹药标准字段

弹药类型固定为：RealismMod.Ammo, RealismMod

- $type：声明该条目为弹药补丁
- ItemID：弹药模板 ID
- Name：弹药显示名或调试名
- Damage：伤害
- PenetrationPower：穿透能力
- LoyaltyLevel：商人等级
- BasePriceModifier：价格倍率基础值
- InitialSpeed：初速
- BulletMassGram：弹头质量
- BallisticCoeficient：弹道系数
- Weight：重量
- DurabilityBurnModificator：枪械耐久损耗修正
- ammoRec：后坐修正
- ammoAccr：精度修正
- ArmorDamage：对护甲耐久的伤害倍率
- HeatFactor：热量修正
- HeavyBleedingDelta：重出血修正
- LightBleedingDelta：轻出血修正
- MalfMisfireChance：哑火故障概率修正
- MisfireChance：失火概率修正
- MalfFeedChance：供弹故障概率修正

## 8. 消耗品标准字段

当前仓库保留了消耗品默认模板，但常规审计与生成主线不将 consumable 作为当前有效生成重点。

若后续启用，其标准字段边界为：

- $type：声明该条目为消耗品补丁
- Name：显示名
- TemplateType：模板分类，当前为 consumable
- LoyaltyLevel：商人等级
- BasePriceModifier：价格倍率基础值
- ConsumableType：消耗品分类
- Duration：持续时间
- Delay：生效延迟
- EffectPeriod：效果间隔
- WaitPeriod：等待周期
- Strength：效果强度
- TunnelVisionStrength：隧道视觉强度
- CanBeUsedInRaid：是否允许在局内使用

## 9. 源字段与标准字段的关系

以下关系需要明确区分：

1. 输入字段可读
2. 输入字段可参与推断
3. 输入字段可成为最终输出字段

这三者不是同义词。

例如：

- TemplateID 可用于标准模板克隆解析，但不会出现在最终输出中
- itemTplToClone 可用于 WTT 克隆解析，但不会出现在最终输出中
- SingleFireRate 可存在于源 mod 输入中，但当前不属于标准武器输出字段
- Cartridges 可用于内部识别弹匣结构或容量信息，但当前不属于标准附件输出字段
- Slots 可属于第三方源结构，但不属于 Realism 标准补丁字段

## 10. 维护要求

当后续需要新增或删除标准输出字段时，必须同步更新三处：

1. 默认模板或 modType 字段定义
2. 最终输出白名单逻辑
3. 本文档与回归测试

如果只改其中一处，就会再次出现“源字段误当成标准字段”的边界漂移问题。
