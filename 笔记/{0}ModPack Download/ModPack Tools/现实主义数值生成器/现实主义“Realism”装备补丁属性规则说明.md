# 装备补丁制作样例说明

> [!NOTE]
> 本文档基于《现实主义（Realism）1.6.3版》的补丁样例说明翻译整理，旨在指导如何调整SPT游戏中的装备数值。

## 背景与目的

现实主义mod大幅重构了原版塔科夫的武器系统，使数值体系更复杂。但原版数值存在问题（如“用脚填”导致不合理属性搭配），例如：
- 导气箍影响准确性
- 枪管影响瞄准速度
- 弹鼓影响枪口初速
- 标准AR15导气管属性优于红管
- 某些裸枪故障率异常高

安装mod后，需手动调整数值以实现更符合“现实”的游戏体验，避免这些缺陷。

## 补丁格式说明

补丁使用JSON格式，通过物品的MongoID为键，指定`$type`和属性字段。文件放置在mod目录（如`user/mods/SPT-Realism/db/templates/attatchments`），重启SPT后生效。

### 装备物品（Gear，如背包、护甲）
- **用途**：调整非武器装备的属性。
- **关键属性**：
  - `AllowADS`：是否允许瞄准镜（true=允许）。
  - `ReloadSpeedMulti`：装填速度倍率（>1=更快）。
  - `Comfort`：舒适度修正（越低越好）。
  - `speedPenaltyPercent`：移动速度惩罚（越低越差）。
  - `mousePenalty`：鼠标惩罚（通常0）。
  - `weaponErgonomicPenalty`：人机工程惩罚（越低越差）。

### 附件物品（WeaponMod，如消音器、枪管）
- **用途**：修改武器配件的性能。
- **关键属性**：
  - `VerticalRecoil` / `HorizontalRecoil`：垂直/水平后坐力（越低越好）。
  - `Dispersion`：整体散布（越低越好）。
  - `CameraRecoil`：相机后坐力（越低越好）。
  - `AutoROF` / `SemiROF`：射速增加百分比。
  - `ModMalfunctionChance`：故障率修正（越低越好）。
  - `Accuracy`：连续射击散布（越高越好）。
  - `HeatFactor` / `CoolFactor`：热量/冷却因子。
  - `DurabilityBurnModificator`：耐久消耗（越低越好）。
  - `Velocity`：枪口初速百分比增加。
  - `RecoilAngle`：后坐力角度。
  - `Ergonomics`：人机工程（越高越好）。
  - `Weight`：重量（kg）。
  - `Loudness`：噪音水平（负值=更安静）。
  - `Convergence`：灵敏度（越高越好）。
  - `Handling`：操作性（越高越好）。
  - `AimStability`：瞄准稳定性（越高越好）。
  - `AimSpeed`：瞄准速度（越高越好）。
  - `CenterOfImpact`：精度（越高=精度越低）。
  - `ModShotDispersion`：霰弹散布（负值=减少）。

### 武器（Gun，如AK74M）
- **用途**：调整枪械基础数值。
- **关键属性**：
  - `WeapAccuracy`：基础精度修正。
  - `BaseTorque`：平衡（负值=前重）。
  - `HasShoulderContact`：是否有肩托。
  - `Ergonomics`：人机工程。
  - `VerticalRecoil` / `HorizontalRecoil`：后坐力。
  - `Dispersion`：散布。
  - `CameraRecoil`：相机后坐力。
  - `VisualMulti`：视觉后坐力倍率。
  - `Convergence`：灵敏度。
  - `RecoilAngle`：后坐力角度。
  - `BaseMalfunctionChance`：基础故障率。
  - `HeatFactorGun` / `CoolFactorGun`：热量/冷却因子。
  - `CenterOfImpact`：内置枪管精度。
  - `HipAccuracyRestorationDelay/Speed`：腰射精度恢复。
  - `Velocity`：初速。
  - `RecoilDamping` / `RecoilHandDamping`：后坐力阻尼。
  - `AutoROF` / `SemiROF`：射速。
  - `BaseReloadSpeedMulti` / `BaseChamberSpeedMulti`：装填/装弹速度。
  - `IsManuallyOperated`：是否手动操作。
  - `OffsetRotation`：射击后偏移。
  - `RecoilIntensity`：后坐力动画强度。

### 换肤（Skin）
- **用途**：克隆其他物品的统计数据。
- **关键属性**：
  - `TemplateID`：原版物品ID（用于克隆数据）。

## 注意事项
- **数值调整**：参考“Realism统计数据”（如枪管长度对初速的影响）。从小幅修改开始，测试平衡。
- **版本兼容**：基于1.5.3版，检查最新更新。
- **风险**：过度调整可能破坏游戏稳定。备份文件，使用调试模式验证。
- **工具**：用JSON编辑器检查语法。社区有现成补丁分享。

```
{
    "Comments": {
        "Comments are in the square brackets, do not include these": [
            "注释位于方括号中，请勿包含这些内容"
        ],
        "the $type must be EXACTLY the same as in these examples, and they must be used correctly": [
            "$type 必须与这些示例中的完全一致，并且必须正确使用"
        ],
        "$type and ItemID are required, other fields are not unless it's a gun in which case all are required": [
            "$type 和 ItemID 是必填项，除非是枪械（此时所有字段均为必填），否则其他字段非必填"
        ]
    },
    "[装备物品，在此处填入物品的模板MongoID]": {
        "$type [客户端用于动态分配模板类型]": "RealismMod.Gear, RealismMod",
        "ItemID [与对象键名相同]": "ValidMongoID",
        "Name [仅供清晰标识]": "backpack_wild",
        "AllowADS [是否阻止开镜，若为可切换面罩则仅在展开时生效]": true,
        "LoyaltyLevel [若使用商人改动则为商人等级]": 2,
        "ReloadSpeedMulti [数值越高越好]": 1.05,
        "Comfort [数值越低越好，重量修正系数]": 1.04,
        "speedPenaltyPercent [数值越低越差]": -2,
        "mousePenalty [保持为0]": 0,
        "weaponErgonomicPenalty [数值越低越差]": 0
    },
    "[附件物品，在此处填入物品的模板MongoID]": {
        "$type": "RealismMod.WeaponMod, RealismMod",
        "ItemID": "5cebec00d7f00c065c53522a",
        "Name": "silencer_p90_fn_p90_attenuator_57x28",
        "ModType [请参考SPT模组页面链接的文档]": "",
        "VerticalRecoil [数值越低越好]": 0,
        "HorizontalRecoil [数值越低越好]": -3,
        "Dispersion [数值越低越好，整体散布]": -15,
        "CameraRecoil [数值越低越好]": -10,
        "AutoROF [1代表1%射速提升]": 1,
        "SemiROF [2.5代表2.5%射速提升]": 2.5,
        "ModMalfunctionChance [数值越低越好]": -10,
        "CanCycleSubs [是否允许在通常无法循环亚音速弹的口径中循环亚音速弹药]": false,
        "Accuracy": -5,
        "HeatFactor [数值越高越差]": 1.13,
        "CoolFactor [数值越高越好]": 0.95,
        "DurabilityBurnModificator [数值越高越差]": 1.1,
        "Velocity [2%初速提升，如果是枪管，则使用同口径相近长度枪管的现实主义模组数据]": 2,
        "RecoilAngle [5 = 后坐角度增加5%以上，趋向90度（垂直向上）]": 5,
        "ConflictingItems [应冲突的物品，将与原冲突列表合并，而非覆盖]": [],
        "Ergonomics": 0,
        "Weight": 0.354,
        "Loudness [负值表示更安静，用于致聋机制和SAIN模组]": -32,
        "Convergence [数值越高，响应更迅速，更不飘，枪口上扬和后坐爬升更小]": 0,
        "LoyaltyLevel": 3,
        "Flash [数值越高，若为消音器或非枪口装置则气体更多，否则火焰更明显]": 15,
        "Handling [武器在移动鼠标或行走/侧移时惯性阻力更小]": 6,
        "AimStability [武器瞄准晃动更小]": 7.5,
        "AimSpeed [数值越高越好]": 5,
        "StockAllowADS [覆盖被设定为阻止开镜的装备物品]": false,
        "HasShoulderContact [枪托是否实际接触玩家肩部]": true,
        "CenterOfImpact [若为枪管则影响精度，数值越高精度越差]": 0.042,
        "ModShotDispersion [负值减小鹿弹散布]": -25
    },
    "[武器，在此处填入物品的模板MongoID]": {
        "$type": "RealismMod.Gun, RealismMod",
        "ItemID": "5ac4cd105acfc40016339859",
        "Name": "weapon_izhmash_ak74m_545x39",
        "WeapType [请参考SPT模组页面链接的文档]": "",
        "OperationType [请参考SPT模组页面链接的文档]": "",
        "WeapAccuracy [基础武器精度修正]": 0,
        "BaseTorque [步枪的默认平衡度，负值表示更前重]": -3.8,
        "HasShoulderContact [武器是否自带抵肩枪托]": false,
        "Ergonomics": 80,
        "VerticalRecoil": 84,
        "HorizontalRecoil": 195,
        "Dispersion [散布]": 11,
        "CameraRecoil": 0.033,
        "VisualMulti [视觉后坐，数值越高视觉后坐越明显（抖动、旋转）]": 1.025,
        "Convergence [响应速度/平顺性]": 15,
        "RecoilAngle [90为垂直向上，65为向右]": 87,
        "BaseMalfunctionChance": 0.0009,
        "HeatFactorGun": 0.2,
        "HeatFactorByShot": 1,
        "CoolFactorGun": 0.1,
        "CoolFactorGunMods": 1,
        "AllowOverheat": true,
        "CenterOfImpact [若为内置枪管则影响精度，数值越高精度越差]": 0.042,
        "HipAccuracyRestorationDelay": 0.2,
        "HipAccuracyRestorationSpeed": 7,
        "HipInnaccuracyGain": 0.16,
        "ShotgunDispersion": 0,
        "Velocity [若枪械有内置枪管，则需要初速属性，请参考枪管与武器的现实主义模组数据]": 0,
        "RecoilDamping [上下晃动，数值越高晃动越明显]": 0.81,
        "RecoilHandDamping [前后晃动，数值越高晃动越明显]": 0.64,
        "WeaponAllowADS [武器是否允许开镜，无视装备阻挡和枪托类型]": false,
        "Weight": 2.402,
        "DurabilityBurnRatio": 0.15,
        "AutoROF": 650,
        "SemiROF": 390,
        "LoyaltyLevel": 3,
        "BaseReloadSpeedMulti [装填速度修正]": 1,
        "BaseChamberSpeedMulti [上膛速度修正，也适用于手动操作枪械]": 1,
        "MinChamberSpeed": 0.7,
        "MaxChamberSpeed": 1.5,
        "IsManuallyOperated [若为栓动或泵动式则为true]": false,
        "BaseChamberCheckSpeed": 1.5,
        "BaseFixSpeed [故障修复速度]": 1.3,
        "OffsetRotation [数值越高越差，开火后枪口偏离目标的程度]": 0.009,
        "RecoilIntensity [整体后坐力程序动画强度]": 0.15
    },
    "[换肤，在此处填入物品的模板MongoID]": {
        "$type": "RealismMod.Gear, RealismMod",
        "ItemID": "6770852638b652c9b4e588a9",
        "Name": "Name of item",
        "TemplateID [要克隆属性的物品ID，必须是原版物品，而非模组添加的物品]": "60363c0c92ec1c31037959f5"
    }
}