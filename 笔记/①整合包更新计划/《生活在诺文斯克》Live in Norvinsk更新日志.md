
> [!NOTE]
> ##### 注：
>《生活在诺文斯克》Live in Norvinsk基于SPT3.11.3制作，开发阶段仅作为Q群内群友福利。
>这里记录的是v0.9.0及之后的更新日志

#### 游玩须知：
1. 本整合包鼓励玩家扮演丹尼斯。

# 25-09-07

#### 更新日志：

- 新增：
	- [6]AI敌意分离-SeparateHostility
	- [8]好莱坞投掷武器视觉辅助-VisualAssist
	- [4]新商人-江湖-JiangHu
	- [8]战场环境临场感增强-SPTBattleAmbience
	- [8]现实主义配套模组-武器操控大修-TarkovIRL_WeaponsHandlingMod
- 更新：
	- 本体更新到SPT3.11.4
	- [8]好莱坞级特效系统-HollywoodFX
	- [3]新武器-WTT武器库-WTT - Armory
	- [9]任务交接自动化-TaskAutomation
	- [7]平衡的夜视装备视效-BRNVG
	- [2]新物品-竞技场赛季奖励-SPT Battlepass
- 调整：
	- 调整修正所有开局档案
	- 完善修订《生活在诺文斯克》4个难度
	- 调整MOD商人的所在位置，让他们更合理，更发挥各自的作用。
	- 升级《生活在诺文斯克》SAIN预设-Live in Norvinsk AI preset的所有选项，升级到v1.2
	- MOD子弹和部分贵重物品不会用于商人以物易物。
	- 更换Reshade和阿曼达滤镜。
	- 增加手术包和药包的使用次数
- 修复：
	- 初始档案Usec不能用的问题
	- PTT生存难度某些路径出错的问题
- 已知问题：
	- 仓库把现金放钱包可能进行交易会出爆红，可能只是单个存档的问题，待查。
	- 受到反映打完信号弹切刀再切枪会卡手，无法复现，待查。


# 25-09-21

本次更新是Beta版更新，整合包将对外免费公开。

版本号更新为：Life_in_Norvinsk_Beta_v0.1
#### 更新日志：

- 新增：
	- [8]好莱坞级画面优化-HollywoodGraphics，这是一个跟阿曼达图形相似功能的新mod
	- [3]新武器功能-AK-105可以使用AN94的超速射 - BabaYaga x Hyperburst
	- [6]AI视觉光依赖化-ombarella测试版，以期替换停止更新的That's Lit
- 更新： 
	- [8]好莱坞级特效系统-HollywoodFX
	- [5]武器操控大修-TarkovIRL_W.H.M(关现实主义这个也一起关）
	- [5]现实主义大修-Fontaine-Realism正式版
	- [7]瞄准视野大修-Fontaine-FOV-Fix
	- [11]扫敌雷达-Tyr-RadarStandalone
	- [4]新任务线-迎新礼物任务-EFCL-WelcomeGifts
- 调整：
	- 调整《生活在诺文斯克》SAIN预设-Live in Norvinsk AI preset，升级到v1.3
		- 禁用Wreckless性格，避免生成就直奔玩家而来的PMC出现，这一点都不真实。
		- 全面加强Partisan，尝试避免他被其他AI轻易杀死。
		- 稍微调低Scav的听力范围
		- 稍微增强PMC的作战实力，以期平衡比他们多的Scav的战力
		- 减少Rat、coward性格的产生比例
	- 更新[14]客户端MOD文本通用翻译器及已翻译文本
	- 调整[6]Acid的AI生成系统-acidphantasm-botplacementsystem，增加AI的刷新间隔，减少每局AI的总数量。
	- 关闭[6]Acid的AI装备调整系统-acidphantasm-progressivebotsystem，因为现实主义的AI装备生成功能已经生效。
	- 通过IRL和现实主义设置的修改，优化整体武器操控手感。
	- 调整Order.json增强mod之间兼容性
	- 关闭Reshade和阿曼达的图形，使用HollywoodGraphics进行画面优化
	- 默认关闭了一些存在感很低和不必要的mod，观察其必要性以准备淘汰它们。
- 修复：
	- 重新制作PMC新兵开局，以修复死亡爆红问题。
	- 暂时关闭本地人开局，直到我修好它的死亡后爆红。
- 已知问题：
	- 仓库把现金放钱包进行交易有小概率会爆红，可能只是单个存档的问题，待查。
	- 本地人开局死亡服务器会宕机，已停用待查。
	- 收到反映打完信号弹切刀再切枪会卡手，无法复现，待查。


# 25-10-01

版本号更新为：Life_in_Norvinsk_Beta_v0.1.2
#### 更新日志：

- 新增：
	- [2]新装备-couturier
	- 
	- [10]显示价格-showmethemoney
	- [10]显示价格之快速出售-showmethemoney-quick-sell
	- [2]新药品-ConsumablesGalore
	- [9]自动将MOD武器添加到任务要求中-AMQWR
	- [6]AI视线优化-thuynguyentrungdang版That.s.Lit.+.Sync_v1.3110.1
- 淘汰/关闭：
	- 淘汰[10]便捷出售-IhanaMies-LootValue
	- 淘汰[6]AI分离敌对-SeparateHostility
	- 淘汰[2]新装备-SerWolfik-Heavy-Troopers
	- 淘汰[4]新商人-江湖-JiangHu
	- 默认关闭[13]瞄准点坐标-InternetDuce-AimPointCoordinates
	- 默认关闭[8]自动奔跑-Tyfon-AutoRun-alt+W自动向前
	- 默认关闭[4]新任务线-迎新礼物任务-EFCL-WelcomeGifts
	- 默认关闭[6]AI视觉光依赖化-ombarella测试版，因为有人接手更新了可用的That.s.Lit
- 更新： 
	- [7]MOD武器配件自动兼容框架-autocompatframework
	- [8]战场环境临场感增强-SPTBattleAmbience
	- [6]AI视觉光依赖化-ombarella测试版
	- [2]新酒水-WTT - CornerStore
	- [2]腰包-WTT-PackNStrap
- 调整：
	- 移除[4]新商人-江湖-JiangHu
	- 更新了个人的Realism数值
	- 调整《生活在诺文斯克》AI生成-botplacementsystem沉浸感增强设置，让各个地图生成更合理，调整PMC和Scav的刷新比例，现在更合理。
- 修复：
	- 重新制作本地人开局，以修复死亡爆红问题。

- 已知问题：
	- 仓库把现金放钱包进行交易有小概率会爆红，可能只是单个存档的问题，待查。
	- 收到反映打完信号弹切刀再切枪会卡手，无法复现，待查。