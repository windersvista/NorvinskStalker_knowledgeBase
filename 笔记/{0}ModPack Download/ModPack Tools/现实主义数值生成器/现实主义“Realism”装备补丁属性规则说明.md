# 现实主义“Realism”装备补丁属性规则说明（v3.15）

本文档不再作为旧版官方样例翻译存档使用，而是作为当前仓库里“装备与字段语义”的参考说明。它用于解释 Gear、WeaponMod、Gun 常见字段的含义，以及当前生成器对装备类物品实际做了哪些处理。

## 1. 当前定位

- 如果你在看“规则怎么自动生成”，优先看三份规则指南和详细使用说明。
- 如果你在看“某个字段在 Realism 里大致是什么意思”，再看本文档。
- 如果你在手工补丁和自动生成之间来回对照，本文档可以作为字段语义索引。

## 2. 当前生成器对 Gear 的实际处理

与 Gun、WeaponMod、Ammo 不同，Gear 当前没有独立的 profile 规则文件。

主流程目前只会对 Gear 做三项夹紧：

- ReloadSpeedMulti：0.85 到 1.25
- Comfort：0.6 到 1.4
- speedPenaltyPercent：-40 到 10

这意味着：

- Gear 当前更偏“安全收口”，而不是复杂分档生成
- 如果未来要让护甲、背包、Rig 走更细规则，建议新建独立 gear_rule_ranges.py，而不是继续堆在主脚本里

## 3. Gear 常见字段语义

- AllowADS：是否允许开镜
- ReloadSpeedMulti：装填速度倍率，越高越快
- Comfort：舒适度或负重体验系数，越低通常越轻松
- speedPenaltyPercent：移动速度惩罚，越负说明减速越明显
- mousePenalty：鼠标灵敏度惩罚
- weaponErgonomicPenalty：对持枪人机的惩罚

## 4. WeaponMod 常见字段语义

- VerticalRecoil / HorizontalRecoil：后坐修正
- Dispersion：整体散布
- CameraRecoil：镜头后坐
- ModMalfunctionChance：故障率修正
- Accuracy：精度修正
- HeatFactor / CoolFactor：发热与散热倾向
- DurabilityBurnModificator：耐久烧蚀倾向
- Velocity：枪口初速修正
- RecoilAngle：后坐方向偏转
- Ergonomics：人机工程修正
- Loudness：噪音修正
- Convergence：收束/响应性
- Handling：操作性
- AimStability：瞄准稳定性
- AimSpeed：开镜速度
- CenterOfImpact：对精度或弹着点的偏移影响

这些字段的自动区间与命中逻辑，以 附件属性规则指南.md 和 attachment_rule_ranges.py 为准。

## 5. Gun 常见字段语义

- WeapAccuracy：基础武器精度修正
- BaseTorque：平衡感，负值通常更前重
- HasShoulderContact：是否具备抵肩支撑
- Ergonomics：基础人机
- VerticalRecoil / HorizontalRecoil：武器后坐
- Dispersion：散布
- CameraRecoil：镜头后坐
- VisualMulti：视觉后坐倍率
- Convergence：响应/收束速度
- BaseMalfunctionChance：基础故障率
- HeatFactorGun / CoolFactorGun：基础发热与散热
- AutoROF / SemiROF：自动与半自动循环速度
- BaseReloadSpeedMulti / BaseChamberSpeedMulti：装填与上膛修正
- BaseChamberCheckSpeed / BaseFixSpeed：检膛与排故速度
- RecoilIntensity：程序动画后坐强度

这些字段的自动区间与二级修正，以 武器属性规则指南.md、weapon_rule_ranges.py、weapon_refinement_rules.py 为准。

## 6. 当前建议的手工介入方式

### 6.1 想改普遍规律

优先改规则文件，而不是手改 output/ 中的大量结果。

### 6.2 想改单个物品

可以在 output/ 中找到对应源文件的结果，只改目标 ItemID 的字段。

### 6.3 想新增映射或默认模板

先看 generator_static_data.py，而不是直接去改主脚本顶部常量。

## 7. 最小示例

### Gear

```json
{
  "example_gear_id": {
    "$type": "RealismMod.Gear, RealismMod",
    "ItemID": "example_gear_id",
    "Name": "example_backpack",
    "ReloadSpeedMulti": 1.02,
    "Comfort": 0.95,
    "speedPenaltyPercent": -4
  }
}
```

### WeaponMod

```json
{
  "example_mod_id": {
    "$type": "RealismMod.WeaponMod, RealismMod",
    "ItemID": "example_mod_id",
    "Name": "example_suppressor",
    "ModType": "muzzle_suppressor",
    "Ergonomics": -8,
    "VerticalRecoil": -10,
    "Loudness": -28
  }
}
```

### Gun

```json
{
  "example_gun_id": {
    "$type": "RealismMod.Gun, RealismMod",
    "ItemID": "example_gun_id",
    "Name": "example_rifle_556x45",
    "Ergonomics": 90,
    "VerticalRecoil": 95,
    "HorizontalRecoil": 170
  }
}
```

## 8. 文档策略

本文档负责解释字段语义与当前 Gear 处理定位，不再重复维护旧版官方样例全文。涉及具体自动生成区间时，请回到对应规则指南与代码文件查看。