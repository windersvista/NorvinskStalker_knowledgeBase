# Realism 装备数值规则指南（v3.5）

本文档与 gear_rule_ranges.py、generate_realism_patch.py 中的装备规则应用链路保持同步，描述当前 gear 各模板文件如何归档、如何命中规则，以及调参时应修改哪些入口。

## 0. 同步说明（2026-03-14 / v3.5）

- 当前规则源文件：gear_rule_ranges.py
- 当前全局夹紧来源：generate_realism_patch.py 中的 GEAR_CLAMP_RULES
- 当前应用方式：命中 gear_profile 后使用 ensure_fields=True 补字段，再按规则区间重算，最后回到全局夹紧收口
- 当前审计默认仍跳过 consumable 与 cosmetic；其中 cosmeticsTemplates.json 只有具备防毒/防辐射语义的条目才参与 gear 主规则

## 1. 装备规则怎么应用

在 apply_realism_sanity_check() 中，Gear 的处理顺序是：

1. 先应用 GEAR_CLAMP_RULES 全局夹紧
2. 基于 parentId、template_file、Name、ArmorClass、IsGasMask 推断 gear_profile
3. 命中 gear_rule_ranges.py 中的 gear 档位后，按档位补字段并采样
4. 再做一次全局夹紧

与武器/附件不同，当前 gear 规则是“模板文件主档 + 极少量二级细分”结构，重点覆盖真实模板中稳定出现的功能字段，而不是经济字段。

## 2. 防护核心

### 2.1 护甲主体

当前包含：

- armor_vest_light / armor_vest_heavy：对应 armorVestsTemplates.json，并按 ArmorClass 粗分轻型防护与高等级重型防护
- armor_chest_rig_light / armor_chest_rig_heavy：对应 armorChestrigTemplates.json，并按 ArmorClass 粗分轻型防护与高等级 plated rig

这些档位主要覆盖：

- SpallReduction
- ReloadSpeedMulti
- Comfort
- speedPenaltyPercent
- weaponErgonomicPenalty

当前二级细分原则：

- 轻型档通常命中 GOST 2/2A/3/3A、NIJ II/IIA/III、PM 2/3 等较低到中等防护等级
- 重型档通常命中 GOST 4/5/6、NIJ III+/IV、ESAPI/XSAPI、MK4A、PM 5/8/10 等更高等级或硬板语义
- 未能明确判断 ArmorClass 时，当前默认落入 heavy 档，避免高防护载具被误判为轻型

### 2.2 插板

当前 armorPlateTemplates.json 被细分为：

- armor_plate_soft：名称或 ArmorClass 明显指向 soft armor / IIIA / GOST 2A 等软防护时命中
- armor_plate_helmet：名称明显指向 helmet armor、ears、nape、jaw、eyes、top 等头盔附板语义时命中
- armor_plate_hard：其余 armorPlateTemplates 默认命中

当前插板规则只重算：

- SpallReduction
- ReloadSpeedMulti

## 3. 头部与面部

### 3.1 头盔与附加护具

当前包含：

- helmet_light：对应 FAST、MICH、EXFIL、AirFrame、ULACH、Team Wendy 等轻量/中型头盔平台
- helmet_heavy：对应 Altyn、Rys-T、Maska、Vulkan、Ronin、ZSh、LSHZ 等重型头盔平台
- armor_component_accessory：对应 armorComponentsTemplates.json 中的 side armor、耳罩、护颈、mandible 等附加护具
- armor_component_faceshield：对应 armorComponentsTemplates.json 中的 shield、face shield、visor 等正面面甲

这些档位当前更偏保守：

- helmet_light 与 helmet_heavy 会稳定补齐 Comfort / ReloadSpeedMulti / SpallReduction，其中当前主要通过 Comfort 区间区分轻重平台
- armor_component_accessory / armor_component_faceshield 主要通过 SpallReduction 区分护具层级

### 3.2 面罩、护目镜与轻量头饰

当前包含：

- armor_mask_decorative：对应 armorMasksTemplates.json 中不具备明确弹道防护语义的装饰性面罩
- armor_mask_ballistic：对应 armorMasksTemplates.json 中带明确弹道等级或防碎裂等级的面罩
- protective_eyewear_standard：用于普通防碎裂眼镜、轻型射击眼镜
- protective_eyewear_ballistic：用于带明确 V50、ANSI、MIL-PRF 等防护等级文本的弹道护目镜
- cosmetic_headwear：用于贝雷帽、帽类等无防护头饰

这些档位当前只做最小范围校验：

- armor_mask_decorative 保持接近中性，不把装饰性面罩误写成真正的弹道防护件
- armor_mask_ballistic 与 protective_eyewear_ballistic 允许更高的 SpallReduction，但不扩展到重型面甲级别
- protective_eyewear_standard 主要保持较轻的 SpallReduction，避免普通眼镜被写成重型护具
- cosmetic_headwear 主要校验 ReloadSpeedMulti、speedPenaltyPercent、weaponErgonomicPenalty 是否保持中性

## 4. 承载系统

### 4.1 胸挂与背包

当前包含：

- chest_rig_light / chest_rig_heavy：对应 chestrigTemplates.json，并按承载量语义粗分轻载与重载胸挂
- backpack_compact：对应 sling、daypack、takedown、medpack 一类小型背包与斜挎包
- backpack_full：对应常规突击包、登山包、重型背包与背负系统
- headset：对应 headsetTemplates.json

当前无甲胸挂的二级细分原则：

- 轻型档通常命中 bankrobber、micro、d3crx、recon、zulu 这类极简或高速取弹胸挂
- 重型档通常命中 beltab、azimut、bearing、umka、triton、commando 一类多模块或高承载胸挂

其中：

- chest_rig_light 更偏向快速取弹与轻载机动
- chest_rig_heavy 更偏向多模块携行与持续承载
- backpack_compact 主要保持更高 Comfort 和更轻的 speedPenaltyPercent
- backpack_full 主要承担更重的 speedPenaltyPercent 与更低的 Comfort
- headset 当前只对 dB 做范围约束

### 4.2 腰带与背部面板

当前包含：

- belt_harness：用于战术腰带、警用腰带、MULE 类腰挂系统
- back_panel：用于背部面板、后挂扩展模块

其中：

- belt_harness 在三类承载附件里保持最高 Comfort 与最低速度惩罚
- back_panel 保持中间层级，惩罚略高于腰带但明显低于完整背包

## 5. 特殊饰品

### 5.1 装饰/防毒类装备

cosmeticsTemplates.json 当前不是统一整文件采样，而是只对具备以下特征的条目命中 cosmetic_gasmask：

- IsGasMask = true
- 存在 GasProtection 或 RadProtection 字段
- 名称明显包含 gas mask / respirator / 防毒面具 等语义

该档位主要覆盖：

- GasProtection
- RadProtection
- ReloadSpeedMulti
- speedPenaltyPercent
- weaponErgonomicPenalty

普通饰品、臂章、帽子类条目当前继续保持审计豁免，不强行归入装备主规则采样。

## 6. 当前覆盖字段

gear 规则当前会按档位重算的字段包括：

- SpallReduction
- ReloadSpeedMulti
- Comfort
- speedPenaltyPercent
- weaponErgonomicPenalty
- dB
- GasProtection
- RadProtection

另有承载辅助件覆盖：

- belt_harness：ReloadSpeedMulti、Comfort、speedPenaltyPercent、weaponErgonomicPenalty
- back_panel：ReloadSpeedMulti、Comfort、speedPenaltyPercent、weaponErgonomicPenalty

另有轻量档位按需覆盖：

- cosmetic_headwear：ReloadSpeedMulti、speedPenaltyPercent、weaponErgonomicPenalty
- protective_eyewear_standard：SpallReduction、ReloadSpeedMulti
- protective_eyewear_ballistic：SpallReduction、ReloadSpeedMulti

说明：

- Price、LoyaltyLevel 当前不纳入 gear 主规则生成
- mousePenalty 在 gear 模板里几乎恒定为 0，当前仅保留原值，不单独采样

## 7. 当前全局夹紧边界

Gear 全局安全边界当前为：

- ReloadSpeedMulti：0.85 到 1.25
- Comfort：0.6 到 1.4
- speedPenaltyPercent：-40 到 10

这意味着即使某个 gear 档位更激进，最终仍会被主流程收口到可控区间。

## 8. 当前识别来源

gear_profile 推断当前综合以下信号：

- parentId
- template_file
- Name
- ArmorClass
- IsGasMask
- 输入属性中的 GasProtection / RadProtection

优先级上，当前更信任 parentId / template_file；只有这些信息不足时，才回退到名称关键词判断。

## 9. 当前调参入口

### 想改某类装备整体手感

改 gear_rule_ranges.py 中对应 profile 的区间。

### 想补充新的 gear 识别逻辑

改 generate_realism_patch.py 中的 _infer_gear_profile() 及其辅助函数。

### 想扩大或收紧安全边界

改 generate_realism_patch.py 中的 GEAR_CLAMP_RULES。

## 10. 验证建议

1. 先用 gear 小样本生成一次输出
2. 检查 armor vest / plate / backpack / helmet 是否命中预期档位
3. 运行 audit_output_rule_violations.py，确认 gear_profile 没有出现大面积 unresolved
4. 对 cosmeticsTemplates.json 重点确认只有防毒类条目进入 gear 主规则

## 11. 常见属性解释

- SpallReduction：破片或飞溅伤害抑制能力。数值越低通常表示越能降低二次破片影响，数值为 1 则接近不额外干预。
- ReloadSpeedMulti：换弹速度倍率。大于 1 通常表示换弹更快，小于 1 表示换弹受阻。
- Comfort：穿戴舒适度或负载友好度。越高通常表示穿着负担更轻、长期操作更舒服。
- speedPenaltyPercent：移动速度惩罚百分比。负值越大通常代表机动性损失越明显。
- weaponErgonomicPenalty：对武器操控的人机惩罚。负值越大，通常表示开镜、持枪和转枪体验越差。
- dB：耳机类的声音增益或拾音强度指标，用于描述环境声音放大能力。
- GasProtection：防毒保护能力，越高通常表示对毒气环境的防护越强。
- RadProtection：防辐射保护能力，越高通常表示对辐射环境的防护越强。
- mousePenalty：鼠标操控惩罚。当前 gear 规则不主动重算它，但它通常表示穿戴后对操作灵敏度的负面影响。

## 12. 文档策略

本指南描述当前 gear 规则结构、覆盖字段与命中逻辑；精确区间以 gear_rule_ranges.py 为准。涉及字段语义时，再回到本文件或其他规则指南交叉对照。
