# 装备补丁制作样例说明


> [!NOTE] Title
> 本文代码部分是《现实主义1.5.3版》的补丁样例的说明的翻译

现实主义将塔科夫原版简单的武器系统进行了大修。现在武器的数值体系更为复杂，所以在进行数值设计时，要了解这个系统都设置哪些数值以及它们的作用。
但现实主义的目前版本中，大部分武器和配件的以上数值都是用脚填（确信）的。
因此在这个系统的配件默认属性中，会出现诸如：导气箍影响准确性、枪管影响瞄准速度、弹鼓影响膛口初速等等奇怪的属性搭配，或者标准AR15导气管的属性比红管好，个别裸枪故障率奇高等等问题。
所以需要在安装好现实主义后对其数值进行一定程度的调整才能真正的符合“现实”。

```
{
    "Comments": {
        "注释在方括号中，不要包含这些": [],
        "$type 必须与这些示例中的完全相同，并且必须正确使用": [],
        "$type 和 ItemID 是必需的，其他字段不是必需的，除非是枪支，在这种情况下所有字段都是必需的": []
    },
    "[装备物品，将物品的模板 MongoID 放在这里]": {
        "$type [客户端用于动态分配模板类型]": "RealismMod.Gear, RealismMod",
        "ItemID [与对象的键相同]": "ValidMongoID",
        "Name [仅为清晰起见]": "backpack_wild",
        "AllowADS [物品是否应阻止 ADS，如果可切换，面罩仅在展开时适用]": true,
        "LoyaltyLevel [如果使用商人更改，则为交易员忠诚度等级]": 2,
        "ReloadSpeedMulti [越高越好]": 1.05,
        "Comfort [越低越好，重量修正]": 1.04,
        "speedPenaltyPercent [越低越差]": -2,
        "mousePenalty [保持为 0]": 0,
        "weaponErgonomicPenalty [越低越差]": 0
    },
    "[附件物品，将物品的模板 MongoID 放在这里]": {
        "$type": "RealismMod.WeaponMod, RealismMod",
        "ItemID": "5cebec00d7f00c065c53522a",
        "Name": "silencer_p90_fn_p90_attenuator_57x28",
        "ModType [参考 SPT mod 页面链接的文档]": "",
        "VerticalRecoil [越低越好]": 0,
        "HorizontalRecoil [越低越好]": -3,
        "Dispersion [越低越好，整体散布]": -15,
        "CameraRecoil [越低越好]": -10,
        "AutoROF [1 表示 1% 射速增加]": 1,
        "SemiROF [2.5 表示 2.5% 射速增加]": 2.5,
        "ModMalfunctionChance [越低越好]": -10,
	    "CanCycleSubs [是否允许在通常不能循环亚音速弹药的弹药中循环亚音速弹药]": false,
        "Accuracy [可能控制连续射击中的着弹点散布，越高越好]": -5,
        "HeatFactor [越高越差]": 1.13,
        "CoolFactor [越高越好]": 0.95,
        "DurabilityBurnModificator [越高越差]": 1.1,
        "Velocity [2% 枪口速度增加，如果是枪管，请使用相同口径的类似枪管长度的 Realism 统计数据]": 2,
        "RecoilAngle [5 = 5+ 百分比后坐力角度，朝向 90 度，即直上]": 5,
        "ConflictingItems [应冲突的物品，将与原始物品结合，不会覆盖]": [],
        "Ergonomics": 0,
        "Weight": 0.354,
        "Loudness [负值表示更安静，用于致聋机制和 SAIN]": -32,
        "Convergence [越高 = 更灵敏，更少浮动，更少枪口翻转和后坐力爬升]": 0,
        "LoyaltyLevel": 3,
        "Flash [越高表示如果是抑制器或非枪口装置则有更多气体，否则有更多闪光]": 15,
        "Handling [移动鼠标或行走/侧移时武器将有更少的惯性和阻力]": 6,
        "AimStability [武器将有更少的瞄准晃动]": 7.5,
        "AimSpeed [越高越好]": 5,
        "StockAllowADS [覆盖设置为阻止 ADS 的装备物品]": false,
        "HasShoulderContact [枪托是否实际接触玩家的肩膀]": true,
        "CenterOfImpact [如果是枪管，则为精度，越高 = 精度越低]": 0.042,
        "ModShotDispersion [负值减少霰弹的散布]": -25
    },
    "[武器，将物品的模板 MongoID 放在这里]": {
        "$type": "RealismMod.Gun, RealismMod",
        "ItemID": "5ac4cd105acfc40016339859",
        "Name": "weapon_izhmash_ak74m_545x39",
        "WeapType [参考 SPT mod 页面链接的文档]": "",
        "OperationType [参考 SPT mod 页面链接的文档]": "",
        "WeapAccuracy [基础武器精度修正]": 0,
        "BaseTorque [步枪的默认平衡，负值表示更前重]": -3.8,
        "HasShoulderContact [武器是否带有内置枪托并接触肩膀]": false,
        "Ergonomics": 80,
        "VerticalRecoil": 84,
        "HorizontalRecoil": 195,
        "Dispersion [散布]": 11,
        "CameraRecoil": 0.033,
        "VisualMulti [视觉后坐力，越高 = 更多的视觉后坐力（抖动，旋转）]": 1.025,
        "Convergence [灵敏度/平坦度]": 15,
        "RecoilAngle [90 是直上，65 是向右]": 87,
        "BaseMalfunctionChance": 0.0009,
        "HeatFactorGun": 0.2,
        "HeatFactorByShot": 1,
        "CoolFactorGun": 0.1,
        "CoolFactorGunMods": 1,
        "AllowOverheat": true,
        "CenterOfImpact [如果是内置枪管，则为精度，越高 = 精度越低]": 0.042,
        "HipAccuracyRestorationDelay": 0.2,
        "HipAccuracyRestorationSpeed": 7,
        "HipInnaccuracyGain": 0.16,
        "ShotgunDispersion": 0,
        "Velocity [如果枪有内置枪管，则需要速度统计数据，请参考枪管和武器的 Realism 统计数据]": 0,
        "RecoilDamping [上下摆动，越高 = 摆动越多]": 0.81,
        "RecoilHandDamping [前后摆动，越高 = 摆动越多]": 0.64,
        "WeaponAllowADS [武器是否应允许 ADS，无论装备是否阻止它以及它有什么枪托]": false,
        "Weight": 2.402,
        "DurabilityBurnRatio": 0.15,
        "AutoROF": 650,
        "SemiROF": 390,
        "LoyaltyLevel": 3,
        "BaseReloadSpeedMulti [装填速度修正]": 1,
        "BaseChamberSpeedMulti [装弹速度修正，也适用于手动操作的枪支]": 1,
        "MinChamberSpeed": 0.7,
        "MaxChamberSpeed": 1.5,
        "IsManuallyOperated [如果是螺栓或泵动则为 true]": false,
        "BaseChamberCheckSpeed": 1.5,
        "BaseFixSpeed [故障修复速度]": 1.3,
        "OffsetRotation [越高越差，射击后枪偏离目标的程度]": 0.009,
        "RecoilIntensity [整体后坐力程序动画强度]": 0.15
    },
    "[换肤，将物品的模板 MongoID 放在这里]": {
        "$type": "RealismMod.Gear, RealismMod",
        "ItemID": "6770852638b652c9b4e588a9",
        "Name": "物品名称",
        "TemplateID [您要克隆统计数据的物品的 ID，它必须是原版物品，而不是由 mod 添加的物品]": "60363c0c92ec1c31037959f5"
    }
}
```