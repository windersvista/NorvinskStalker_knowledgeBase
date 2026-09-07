# input/user_templates 数据结构统计

统计范围：input/user_templates 下全部 JSON 文件，共 172 个。

统计口径分为两层：

- 精确结构签名：按每个条目实际键集合精确区分，共 51 种。
- 宽口径结构族：按核心标记字段归并，并排除 mod 作者自己制作的现实主义补丁和空样本后，共 4 种。

当前报告列出的是更适合人工阅读的 4 种有效输入源结构族。

## 1. WTT_templates

识别特征：条目对象包含 itemTplToClone。

当前状态：已清除原先对整个 WTT_templates 的统一识别输出逻辑，当前代码目前已支持 WttArmory_templates、Epic_templates、ConsortiumOfThings_templates、Requisitions_templates、EcoAttachment_templates、Artem_templates、WttStandalone_templates 与 SptBattlepass_templates 八个子类。

当前 WTT_templates 仍按来源 mod 做统计分组；但在代码实现上，目前只有 WttArmory_templates、Epic_templates、ConsortiumOfThings_templates、Requisitions_templates、EcoAttachment_templates、Artem_templates、WttStandalone_templates 与 SptBattlepass_templates 已进入正式识别链。当前分组如下：

- WttArmory_templates：文件名包含 WTT - Armory_
- ConsortiumOfThings_templates：文件名包含 ConsortiumOfThings_
- Requisitions_templates：文件名包含 Echoes.of.Tarkov.-.Requisitions_
- EcoAttachment_templates：文件名包含 Eco-Attachment Emporium_
- Epic_templates：文件名包含 EpicRangeTime-
- Artem_templates：文件名包含 Artem_
- WttStandalone_templates：文件名包含 AK50、AKResonant、50 BMG 或 .50BMG，用于 AK50/AKResonant/.50BMG Remaster 等独立 WTT 来源
- SptBattlepass_templates：文件名包含 SPT Battlepass

当前这一步主要用于后续分批重建各子类专属逻辑。现阶段 WttArmory_templates、Epic_templates、ConsortiumOfThings_templates、Requisitions_templates、EcoAttachment_templates、Artem_templates、WttStandalone_templates 与 SptBattlepass_templates 都会驱动各自的 parentId / 模板提示与实际输出。

文件数：149（其中 WttStandalone_templates 占 4 个，SptBattlepass_templates 占 1 个）

- input/user_templates/[2]新物品-竞技场赛季奖励-SPT Battlepass.json
- input/user_templates/[3].50BMG重制-Epics 50 BMG Remaster-Expansion.json
- input/user_templates/[3]新武器-AK50_items.json
- input/user_templates/[3]新武器-AK50_Weapon.json
- input/user_templates/[3]新武器-AKResonant.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Ammo.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_Foregrips.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_IronSights.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_Magazines.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_Muzzles.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_PistolGrips.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_Scopes.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_Suppressors.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Attachment_VSSM.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_M700XL.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_M700XL_Norma.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_Weapon92fs.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponAEK.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponAGSeries.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponAK5C.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponAN94.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponAuto5.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponAXMC_300WM.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponC9.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponCarmel.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponCZ75.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponCZScorpion.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponDragunov.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponG3.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponGrizzly.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponHK417.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponKACPDW.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponM249.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponM76.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponMK23.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponMSR.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponPatriot.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponPM9.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponProdigy.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponRemingtonACR.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponSerbuSuperShorty.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponStaccatoXC.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponUCP.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponUdav.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponWagesOfSin.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponWilsonCombatEDCX9.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponX95.json
- input/user_templates/[3]新武器-WTT武器库-WTT - Armory_WeaponXM8.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Ammo.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Attachments.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Barrels.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Barters.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Foregrips.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Handguards.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Mags.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Mounts.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Stocks.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Suppressors.json
- input/user_templates/[3]新配件-ConsortiumOfThings_Weapon556Krink.json
- input/user_templates/[3]新配件-ConsortiumOfThings_WeaponFNX.json
- input/user_templates/[3]新配件-ConsortiumOfThings_WeaponGlock22.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Ammunition.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Attachments.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Barrels.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Eotech.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Handguards.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Mags.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Mounts.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Optics.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Pistol_Grips.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Recievers.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Skull_HG.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Stocks.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_Weapon762AR.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponAKs.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponM700.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponMCX.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponP320.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponPitViper.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponSCARL.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponSKS.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponSR25.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponUMP9.json
- input/user_templates/[3]新配件-Echoes.of.Tarkov.-.Requisitions_WeaponVelociraptor.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_AK_Stuff.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_Anaconda_Riser.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_Arisaka_Mounts.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_AR_15_handguards.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_AR_15_Receivers.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_AR_15_Stocks.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_As_Val_Mod_3_5.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_Clutch_CH.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_Foregrips.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_IronSights.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_MK12_Mod0.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_PistolGrips.json
- input/user_templates/[3]新配件-Eco-Attachment Emporium_PKM_Zenitco_kit.json
- input/user_templates/[3]新配件-EpicRangeTime-WeaponsAK_HGS.json
- input/user_templates/[3]新配件-EpicRangeTime-WeaponsAK_Muzzle Devices.json
- input/user_templates/[3]新配件-EpicRangeTime-WeaponsAK_Pgrips.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_AK15_Muzzle_Devices.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_AK_Stocks.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Amps.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Armor Plates.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_AR_Barrels.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_AR_Muzzle_Devices.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_AR_Stocks.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_AXMC_Barrels.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_BCM_MCMR.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Bipods.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_DD_MFR.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Glock_parts.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Headgear.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_HK_SMR.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Hogue_Tube.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Iron_Sights.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_KAC_FF_RAS_SR25.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Lasers.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_M700.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Magazines.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Magnifiers.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_MCX_Parts.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Midwest_AR10_rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Midwest_NF_Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Midwest_SS.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Misc_Barter.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Misc_Mounts.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_MK16_Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_MK4_Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_MK8 Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_New_AKs.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_New_M4.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_New_MK47s.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_New_Spear.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Pistol_Grips.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Red_Dots.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_RISIIFSP_Rail.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_RISIIIL_Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_RISIIIU_Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Scopes.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_Suppressors.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_URX3_Rails.json
- input/user_templates/[3]新配件-EpicRangeTime-Weapons_URX4_Rails.json
- input/user_templates/[4]新商人-Artem_Backpacks.json
- input/user_templates/[4]新商人-Artem_Helmets.json
- input/user_templates/[4]新商人-Artem_Masks.json
- input/user_templates/[4]新商人-Artem_Misc.json
- input/user_templates/[4]新商人-Artem_Patches.json
- input/user_templates/[4]新商人-Artem_Vests.json

## 2. RaidOverhaul_templates

识别特征：条目对象包含 ItemToClone。

当前状态：已完成识别与输出支持。

文件数：16

- input/user_templates/[5]战局大修-RaidOverhaul_ConstItems/DeadSkul.json
- input/user_templates/[5]战局大修-RaidOverhaul_ConstItems/LegionMask.json
- input/user_templates/[5]战局大修-RaidOverhaul_ConstItems/Onyx.json
- input/user_templates/[5]战局大修-RaidOverhaul_ConstItems/SecConts.json
- input/user_templates/[5]战局大修-RaidOverhaul_ConstItems/SpecialExfilFlare.json
- input/user_templates/[5]战局大修-RaidOverhaul_ConstItems/SpecialTrainFlare.json
- input/user_templates/[5]战局大修-RaidOverhaul_Gear/Carrion.json
- input/user_templates/[5]战局大修-RaidOverhaul_Gear/LoneDragon.json
- input/user_templates/[5]战局大修-RaidOverhaul_Gear/Oakley.json
- input/user_templates/[5]战局大修-RaidOverhaul_Gear/Rhino.json
- input/user_templates/[5]战局大修-RaidOverhaul_Weapons/Aug.json
- input/user_templates/[5]战局大修-RaidOverhaul_Weapons/Executioner.json
- input/user_templates/[5]战局大修-RaidOverhaul_Weapons/Judge.json
- input/user_templates/[5]战局大修-RaidOverhaul_Weapons/Jury.json
- input/user_templates/[5]战局大修-RaidOverhaul_Weapons/MCM4.json
- input/user_templates/[5]战局大修-RaidOverhaul_Weapons/STM46.json

## 3. Mixed_templates

识别特征：同一个文件内部同时存在 clone + item 结构，以及只有 item 或 items 的近似结构。

当前状态：已完成识别与输出支持。

文件数：3

- input/user_templates/[2]新装备、衣服-TacticalGearComponent.json
- input/user_templates/[3]新武器-SIG_MCX_VIRTUS_items.json
- input/user_templates/[3]新武器-国产武器-1SD-QBZ191_items.json

## 4. Moxo_Template

识别特征：条目对象同时包含 clone 和 item 或 items。

当前状态：已完成识别与输出支持。

文件数：2

- input/user_templates/[3]新配件-BlackCore.json
- input/user_templates/[3]新配件-MagTape.json

## 结论

- 如果按精确键集统计：共有 51 种数据结构签名。
- 如果按人工可读的宽口径结构族统计，并排除 mod 作者自己额外制作的现实主义补丁文件与空样本：共有 4 种。
- 当前可视为有效第三方输入源结构的主要就是 4 种：itemTplToClone、ItemToClone、Mixed(clone+item,item/items)、clone+item。
