# **-「Norvinsk Stalker」-**

# **【诺文斯克潜行者】1.1.8版游戏手册**

## **手册说明**

本手册主要内容是对整合包游玩方式的说明。

整合包安装教程和技术说明，以及游玩过程中可能遇到的部分BUG的解决方案请查阅《技术手册》。

**本整合包正式版为免费整合包，仅测试版需要发电领取。**

整合包作者：Samuel是不是好奇猫

B站ID：Samuel是不是好奇猫

B站主页：[https://space.bilibili.com/9883076](https://space.bilibili.com/9883076)

爱发电ID：Samuel是不是好奇猫

爱发电主页：[https://afdian.net/a/samuel_szeto](https://afdian.net/a/samuel_szeto)

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps1.jpg)![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps2.jpg)![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps3.jpg) 

### **特别鸣谢页**

**Q群群友****:**

1.0.0版教程的修正：随风而去

1.0.0版整问题反馈：珠泪哀歌族·？

1.0.0版大地图汉化：出走在远方

“点开始游戏却没有反应”的解决方案：夜熙、夢遊于華胥之國、旗礼、BadForNight

Traveler商人位置修改补丁的制作和测试：KHORNE制作，树上骑柒只猴

制作对应的实时地图修改：树上骑柒只猴

1.0.5版新traveler大地图指引制作：风吟随行

1.0.5版测试人员：珠泪哀歌族·？、那我就特别凶、恰啡就是咖啡、憨伍蒂

1.1.0版测试人员：T1anMen9、Niegerlia、Rivaille、E_lizard、加把劲骑士、Kang、Weeping Dawn

1.0.0热修鸣谢：Kang、E_lizard、B站UP：Oo大H豆oO、刀刀

1.1.8版测试人员：一只梅狸猫、公用带星怒、随风而去、童某、悲剧龙

1.2.0制作过程中：渗透者之心的物价建议、✘✘✘✘的任务文本翻译

**整合包所用MOD作者及下载链接：**

塔科夫MOD社区网站：[https://hub.sp-tarkov.com/files/](https://hub.sp-tarkov.com/files/)

国内塔科夫MOD社区ODDBA：[https://sns.oddba.cn/](https://sns.oddba.cn/)

TRAVELER 1.1.1：

[https://hub.sp-tarkov.com/files/file/1212-traveler/](https://hub.sp-tarkov.com/files/file/1212-traveler/)

SPT REALISM MOD 0.14.12

[https://hub.sp-tarkov.com/files/file/606-spt-realism-mod/](https://hub.sp-tarkov.com/files/file/606-spt-realism-mod/)

SOFTCORE (PROPER SINGLEPLAYER EXPERIENCE FOR SPT) 1.7.0

[https://hub.sp-tarkov.com/files/file/998-softcore-proper-singleplayer-experience-for-spt/](https://hub.sp-tarkov.com/files/file/998-softcore-proper-singleplayer-experience-for-spt/)

RAID OVERHAUL 1.5.0

[https://hub.sp-tarkov.com/files/file/1673-raid-overhaul/](https://hub.sp-tarkov.com/files/file/1673-raid-overhaul/)

**说明手册的形式借鉴自辐射整合包：**

BB84《废土蓝调》:

[https://www.bilibili.com/video/BV1z54y1Z7hv/](https://www.bilibili.com/video/BV1z54y1Z7hv/)

**谨以此整合包纪念我的两只爱猫**

**大头：2024年3月11日**

**灵灵：2024年3月13日**

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps4.png) 

# **整合包游戏手册**

### **目录——**

**整合包的特色玩法总结性介绍**

**整合包自定义项目的说明**

**存档编辑器的启用方式**

**现实主义设定程序的启用方式**

**现实主义MOD-弹道大修说明**

**现实主义MOD-治疗系统大修说明**

**现实主义MOD-污染区说明**

**整合包内除核心MOD以外，其他MOD和用法的简述**

**整合包现有BUG及解决、绕过方式**

### **整合包的特色玩法总结性介绍**

一． 《诺文斯克潜行者》整合包1.2.x版更倾向于单机化、RPG化和潜行者化。与离线/在线版塔科夫是完全不同的游戏体验。

二． 现在整合包的核心MOD有五个：、Softcore（软核）、Realism（现实主义）、Path to Tarkov（PTT-通往塔科夫的路）ImmersiveDaylightCycle（沉浸式日夜循环）、customraidtimes（自定义战局时间）。

前两个核心MOD我已经出过说明视频：

**Path to Tarkov：待更新**

译作通往塔科夫的路，提供了类潜行者地图的伪无缝地图风格。整合包的整个地图自定义设计就是由它实现的。所以它也是本整合包的最重要的MOD。

**Softcore说明：**[https://www.bilibili.com/video/BV1W8411Q7h8/](https://www.bilibili.com/video/BV1W8411Q7h8/)

译作软核，它提供了对游戏经济系统的RPG化修改，去除了大部分NJT为了线上运营设计的限制，并实现了更多适合单机游玩的机制。

**Realism说明：**[https://www.bilibili.com/video/BV1de411v7bi/](https://www.bilibili.com/video/BV1de411v7bi/)

[https://www.bilibili.com/video/BV17x421U7Af/](https://www.bilibili.com/video/BV17x421U7Af/)

译作现实主义，对整个塔科夫战斗系统进行了大修。让塔科夫的游玩体验更加偏真实。

治疗系统补充说明：生存难度、浪人模式时治疗系统大修打开，战局内会无法使用药包加血，药包只能止血和自动恢复少许血量，想要在战局内回满血量，请自备各类针剂和我修改过的部分吃喝（如热棒、士力架、巧克力板、酒类等）。

**ImmersiveDaylightCycle说明：待更新**

**自定义战局时长-refringe-customraidtimes****：**

战局时长3小时，时间流逝与原版相同。

三． 整合包拥有专属任务《诺文斯克之影》系列，目前更新到序章。

四． 有五种不同的难度选择，容易到困难会相对生存难度更接近原版塔科夫的体验，而生存难度才是整合包的完全体。**浪人模式属于自虐难度，选择游玩前请明白自己在做什么。**

五． 前三个难度切换到生存难度/浪人模式，请开新档。

难度区别明细如下：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps5.jpg) 

六． 各难度的地图设置请查阅网盘内的《线路指引图》。

七． 客户端MOD的使用请先看视频：[https://www.bilibili.com/video/BV1Sw411p74W/](https://www.bilibili.com/video/BV1Sw411p74W/)

这个视频比较旧，有些mod有差异，但大致用法相同。一些主要的mod我会在后文细讲。

**整合包自定义项目的说明**

整合包的其他自定义项：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps6.jpg) 

**存档编辑器的使用**

整合包内设置程序的使用方式：

1. 1.1.5版更新中集成了存档编辑器的最新版2.6.8，想使用该版本，请按以下步骤设置：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps7.jpg) 

在MO2里添加存档编辑器的启动方式——

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps8.jpg) 

点击MO2界面中这里的“编辑”：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps9.jpg) 

点击“从文件添加”，然后选择MO2文件夹：Norvinsk_Stalker_110\mods\存档编辑器v2.8.6-SPT-AKI Profile Editor\SPT-AKI Profile Editor\中的SPT-AKI Profile Editor.exe即可将它添加到MO2的“可执行程序”列表中。

在MO2中启动存档编辑器后，需要进入它的设置界面，将服务器目录改成本体所在路径，即可读取账号信息并编辑了。

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps10.jpg) 

**现实主义设定程序的启用方式**

想在本整合包中使用现实主义MOD配置程序，请按以下步骤设置：

基本方式跟存档编辑器一致，只是最后一步“从文件添加”应选择Norvinsk_Stalker_115\mods\现实主义大修-Fontaine-Realism-Mod\user\mods\SPT-Realism文件夹里的RealismModConfig.exe

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps11.jpg) 

即可将现实主义的配置程序添加到MO2的启动程序列表中。

只要选择好你想编辑的难度，然后再打开它，即可对不同难度的现实主义MOD配置进行再设置——

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps12.jpg) 

对于本现实主义设置程序中的主要模块的功能介绍，请观看此视频：

[https://www.bilibili.com/video/BV1de411v7bi/](https://www.bilibili.com/video/BV1de411v7bi/)

**现实主义MOD-弹道大修说明：**

生存难度、浪人模式时弹道（子弹、护甲体系）大修会启动。我尽可能参照维基百科的现实数据对部分的子弹数值进行了重新设计，子弹伤害和原版不尽相同，具体数值请游戏内自行查阅。

护甲系统大修作者对此功能的解释个人精翻：[https://hub.sp-tarkov.com/files/file/606-spt-realism-mod/?highlight=Realism#tab_e80a36af4af3422f47c9a0d991e9702372e579b1](#tab_e80a36af4af3422f47c9a0d991e9702372e579b1)

全新的护甲和身体Hitbox设计：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps13.jpg) 

上图：新的护甲防护区域

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps14.jpg)![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps15.jpg) 

上图：人物新的HitBox

#### **护甲概述：**

耐久度损失和钝器伤害已从头开始完全重写，护甲穿透也进行了重做。整合包默认情况下，护甲等级显示为塔科夫的1-10级护甲等级，如有需要可以在F12里打开护甲的 IRL 护甲等级显示。如果你想知道它应该能阻止什么，可以查找该护甲分类来了解情况：[https://en.wikipedia.org/wiki/List_of_body_armor_performance_standards](https://en.wikipedia.org/wiki/List_of_body_armor_performance_standards)

人体工学和移动速度也得到了调整。鼠标灵敏度惩罚已被取消。

**头盔：**

除少数例外，大多数头盔都无法阻挡步枪子弹，而大多数头盔都能被 AP 手枪子弹击穿。即使子弹无法穿透，也会造成大量钝器伤害，因此它们也无法承受手枪弹的弹匣冲击，所以几乎任何弹药都能击中头部。这也是对技术的奖励，因为只要能击中头部，即使是最差的弹药也是可行的。SLAAP、Vulkan 或全套装备的 "堡垒 "仍能阻止步枪子弹。有一个配置选项可以增强头盔（整合包默认已打开）。

**剥落（原词Spalling，不知道有何对应的中文词语）：**

有些装甲会剥落，这意味着子弹在未能穿透装甲后会在装甲上留下碎片，伤害有几率扩散到四肢和头部（而不是腹部或胸部）。有多少部位被击中是随机的。受到的伤害数量会根据盔甲的 "剥落伤害减免 "属性而减少。如果盔甲有手臂或颈部保护，则手臂/颈部受到的剥落伤害会减少。

游戏中会显示新的数据，如盔甲的钝器伤害减免、剥落能力和剥落减免：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps16.jpg) 

**注：1.1.8版中所有护甲都不能被“剥落”。**

**耐久度损失和钝伤：**

钝伤和甲伤现在基于子弹的动能 (KE)，而不是任意的属性。手枪弹现在的 KE 很低（350j），造成的钝器伤害和护甲伤害也很低。弹头（约 3000+j）和 M80 等步枪子弹（约 3500j）将造成更多的钝器伤害和护甲伤害。这对游戏的意义在于，像弹头这样穿透力低但能量高的子弹甚至能对高级装甲造成大量钝器伤害，而手枪子弹则需要倾泻弹匣才能对步枪级装甲造成任何伤害（如果对方穿着步枪级装甲，则瞄准头部或腿部）。说到护甲和钝器伤害，穿透力和护甲等级就不那么重要了。

**注：整合包1.1.8版的参数设计中，甲穿高的子弹甲伤并不高。**

**子弹****穿透****护甲能****力：**

钢甲在穿透时会忽略耐久度。耐久度为 0 的钢铁与耐久度为 100 的钢铁的穿透力相同。泰坦装甲则降低了耐久度的重要性。不过，随着耐久度的降低，泰坦装甲和钢铁装甲的剥落伤害都会迅速增加。

这个机制将在未来（离线版3.8.X或更远）完全重写。

**护甲****耐久与****等级表****：**

|   |   |   |
|---|---|---|
|**护甲****材料**|**与现实对应****的材料**|**相对耐久****度**|
|护甲钢|钢板，几乎坚不可摧|很高|
|泰坦|金属和凯夫拉或芳纶做衬底|高|
|UHWMPE|高密度聚乙烯，轻便，耐用|高|
|复合材料|UHWMPE+陶瓷，两全其美的材料|中高|
|陶瓷|陶瓷，耐久低，钝伤低|中低|
|芳纶|软护甲，仅适于防护霰弹或手枪|低|
|玻璃|耐久很低，但坏之前几乎没钝伤|很低|

钢制护甲将具有非常高的耐久度，以抵消所有子弹造成的最低耐久度损失。钢板几乎应该是坚不可摧的，因此为了防止子弹像对其他护甲那样将其融化，钢板被赋予了很高的耐久性。但由于钢板可承受极高的钝器伤害，因此抵消了这一影响。

现在有 10 个护甲等级，分别代表美国 NIJ 和俄罗斯 GOST 装甲等级。这并不精确，但已接近 BSG 的任意系统。在塔科夫原版中，1-6 系统不足以真实地代表相对的装甲性能。1-5 可以阻挡手枪和霰弹枪子弹。5-7 可以阻挡高笔数手枪和霰弹枪子弹，以及低笔数步枪子弹。7-8 可以阻挡大部分中等笔尖的步枪子弹。9-10 可阻挡大部分步枪子弹，但高倍镜/终极子弹除外。如果您了解现实生活中的装甲等级，请参考下表：

游戏内护甲对应的现实护甲等级分类（整合包未开启显示现实护甲等级）

|   |   |
|---|---|
|**1**|**NIJ I**|
|**2**|**GOST 1**|
|**3**|**NIJ IIA / PM 2**|
|**4**|**NIJ II / GOST 2 / PM 3**|
|**5**|**NIJ IIIA / GOST 2A**|
|**6**|**GOST 3 / PM 5**|
|**7**|**NIJ III / GOST 4 / PM 8**|
|**8**|**NIJ III+ / GOST 5 / MK4A Plates / ESAPI (Rev. G)**|
|**9**|**NIJ IV / GOST 5A / ESAPI (Rev. J) / PM 10 / NIJ RF3 07**|
|**10+**|**GOST 6 / XSAPI**|

**注：****手枪等级****/****步枪等级**

#### **弹药概述：**

**弹药属性已完成重做，以尽量模拟这些子弹在现实生活中的性能。**

现在，几乎所有步枪子弹都能穿透手枪级装甲，包括 HP 子弹。AP 9x19 和 .45 将不再适用于步枪级防弹衣，4.6 毫米和 5.7 毫米的穿透力也不再优于步枪子弹。现在，7.62x51 毫米等大口径子弹比 5.56x45 毫米等中口径子弹更有威力，更能可靠地击倒敌人。**（猫：整合包1.1.8版参数并未严格按此设计）**

**枪管长度/枪口速度：**

枪管长度现在会影响子弹的伤害、穿透力、破片几率、弹道系数、穿甲伤害和钝器穿甲伤害。您可以使用枪管的速度属性来确定这些属性的或多或少的减少量。每英寸枪管长度的速度损失/增加量取决于口径。例如，7.62x39 的枪管较短，速度损失不大，而 5.56 的枪管较长，速度损失很大。

损耗/增益的百分比是与该口径的 "标准 "枪管长度进行比较的，而 "标准 "枪管长度是以该口径通常被认为的最佳枪管长度为基础的。这意味着弹药统计信息只对标准枪管长度有效，任何更长/更短的枪管长度都会改变统计信息：

**射击命中率 (STK)：**

射击命中率现在在很大程度上取决于射击命中的位置（请参阅上文有关新命中区域的视频）。手枪子弹需要 1-7 发，取决于击中胸部的位置和子弹的种类。中间步枪子弹需要 1-4 发，全威力子弹需要 1-2 发。

说到护甲，头盔能提供实际的保护水平，因此除了幸运跳弹外，大部分护甲不再能抵挡步枪子弹。一般来说，防弹衣的防护能力要强得多。

**后坐力和精度统计：**

现在，子弹的后坐力统计反映了其能量输出和压力。与 "标准 "子弹相比，+P 9x19 子弹的后坐力会明显增加。与未修改的 EFT 不同，后坐力统计现在也会影响散射和镜头后坐力。

不同的子弹还会改变武器的射速。一般来说，射速的变化约为后坐力状态的一半。

与未修改的 EFT 不同，精度状态现在会影响霰弹的散布/扩散。

霰弹现在有符合实际的弹丸数量（8 至 27）。

**现实主义MOD-治疗系统大修说明：**

**现实主义MOD-污染区说明：**

**整合包内其他MOD和用法的简述**

注意：能简单说明的MOD使用方法均写明在MO2的MOD备注中，请先打开MOD备注：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps17.jpg) 

AI增强-SAIN：整合包的AI强度由它管理，并使用PMC.Terminators的SAIN预设。可在游戏中按F6打开设置界面，没有汉化，请自行翻译改动。

AI视野真实化-That's Lit：请看下图——

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps18.jpg) 

AI动态生成点-SWAG-Donuts：整合包的AI生成由它管理，其实是两个MOD：SWAG和Donuts。

我翻译有简单的说明文档并附在整合包中，可在MO2的数据窗口查阅——

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps19.jpg) 

SWAG是服务器MOD，负责BOSS和特殊AI的生成规则。

Donuts是客户端MOD，负责PMC和Scav的生成规则。游戏中F12——Donuts即它的设置页面，建议仅修改红框的AI刷新预设来指定AI的多寡：

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps20.jpg) 

整合包1.1.5版的默认预设（Preset Selection）：NorvinskStalker Like包含以下模式的循环。

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps21.jpg) 

你还可以自行选择其他模式，这里推荐几个常用模式：

Queitraids：AI数量最少得模式，适合漫游和安静做任务，也是我最喜欢的模式。

Live-like：这种模式有几个，AI的pmc和scav比例是模拟线上的，区别在于AI的生成点位会彼此不同。

Morescavs：会有更多的scav。

MorePMCs：有更多的PMC。

瞄准视野大修-Fontaine-FOV-Fix：该mod给部分光学倍镜添加Ctrl+鼠标滚轮的无极变焦功能，F12中红框可修改

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps22.jpg) 

武器破门-dvize.BackdoorBandit：让所有的门和容器（除收银机柜）均可用近战武器和枪打开。建议配合Tarkymenu万能菜单的Max Melee使用。

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps23.jpg) 

平衡的夜视装备视效-BORKEL'S REALISTIC NIGHT VISION GOGGLES：让游戏里的夜视仪拥有更接近现实的视野效果，F12中可以设置。红框部分为作者增添的“冲刺时关闭战术设备（装在枪或头盔上的灯和红外等）开关”，如果打开，在你未装备战术设备时会掉帧。当你装备了战术设备后，该功能与“AI视野真实化-That's Lit”配合完美。

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps24.jpg) 

空中支援-SamSWAT-FireSupport：提供两个功能，空袭和直升机撤离。

在手持测距仪并双击Y打开对话界面时即可看见功能选项，F12中打开设置——

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps25.jpg) 

物品感应-AmandsSense：可以在战局里双击F高亮显示有物品的容器和尸体，F12中打开设置——

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps26.jpg) 

万能菜单-ervph‘s Tarky Menu：大量作弊功能。包括但不限于：无敌、半无敌、一键治疗、无限耐力、无限体力、传送AI到你位置、没装备夜视装备也可以使用夜视等等等等等功能。

![](file:///C:\Users\SAMUEL~1\AppData\Local\Temp\ksohtml1328\wps27.jpg) 

**整合包现有BUG及解决、绕过方式**

**Traverler断更引起的bug****：**  
1、新档开档第一时间进不了藏身处。绕过方法：多见于简单或中等难度，切换到困难难度或以上后，进一次战局出来后再尝试进藏身处，能进入后再切回原难度。  
2、撤离时读秒完撤离不了（不常见）。重新进撤离点读秒即可。但如果恰巧在某些特殊撤离点（立交桥安全屋要按按钮关门）遇到，则可能导致该点无法撤离。  
3、藏身处不能有破墙，否则会导致坏档，目前所有难度藏身处已禁止了破墙的建设，所以本整合包也没有健身房（但其实整合包也不需要健身房）。

**其他不常见BUG：**

**部分武器开火手乱舞：**该bug跟负重过低有关，建议裸身负重-50kg以上，出门装负重-25kg以上。原因推测是现实主义的负重/移动大修可能导致游戏后坐力体系不稳定，百分百避免的方法是关闭现实主义的movement changes和weight changes  
**游戏物品显示****狗头****：**这个分两种情况：1、进战局里也有狗头，请删除整个本体和mo2文件夹，重新解压并清空mo2里的overwrite文件夹。2、仅购买界面有狗头，则仅清空mo2里的overwrite文件夹即可。