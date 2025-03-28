
# 《生活在诺文斯克》-Live in Norvinsk-安装、技术手册

> [!NOTE]
> #### 整合包信息：
> 《生活在诺文斯克》Live in Norvinsk整合包是基于SPT3.11.x制作，开发阶段仅作为Q群内群友福利。
> 正式版将为v1.0.0，届时会正式对外发布，作为《诺文斯克潜行者》整合包1.1.8之后的全新重制的离线塔科夫整合包。
> 
> #### **特色简介**：
> 
> 而是在原版基础上通过Mod：PathToTarkov（PTT）进行地图间移动设置、CustomProfiles（自定义档案）增加专属起始角色、Realism（现实主义）进行更进一步现实化改造（《诺潜》已经有一定现实化改造了），加入整合包专属商人、整合包专属任务线，具备撬锁、枪破门、技能大改、医疗方式大修、AI行为拟人化、武器装备的数值重新平衡等等，提供区别于原版塔科夫的真实性沉浸式游戏体验。

## 安装前必读事项：

> [!NOTE] 
> 
>  #### 一、整合包玩家必须要做内存管理
>  
> 1. **原因**：离线版塔科夫SPT需要玩家电脑同时运行服务器端和客户端，同时我的整合包包含极大增加系统负担的AI类和玩法改进MOD，所以实际上比在线版更吃系统资源，内存要求也比在线版更多。
> 2. 为了防止玩家出现爆内存闪退的情况，游玩前请先做好这两个措施：
> 
>	- 措施一. ==必须将虚拟内存大小设置为你物理内存的1到1.5倍。==即使电脑有128g物理内存也一定要开虚拟内存，哪怕是默认设置！设置方法B站自寻。
>	
>	- 措施二. ==必须安装一个内存管理软件==：ProcessLasso或Memreduct均可，第一个没效果则用第二个。我个人使用前者，内存清理推荐设置参数如下——
>		ProcessLasso：
>			![](assets/Pasted%20image%2020241006202456.png)
>			![](assets/Pasted%20image%2020241006202519.png)
> #### 二、整合包存档路径
> 整合包存档位置，共备份两个文件夹：
> (1) 你的存档文件在：Realized_Norvinsk_v0.X\\overwrite\\user\\profiles整个文件夹。
> (2) 你自己的游戏设置在：Realized_Norvinsk_v0.X\\overwrite\\user\\sptsettings整个文件夹。
> 
> #### 三、其他注意事项
> 
> 1. 安装游戏前请先安装网盘中，安装“0、【非正版玩家才用】前置系统环境软件”中的几个系统环境软件：
> 	![](assets/Pasted%20image%2020241002174854.png)
> 2. #### 整合包游戏本体和MO2路径均不可以有中文，且文件夹堆叠不宜超过三层文件夹，导致路径太长。
> 3. 请不要擅自修改本体里的SPT.Launcher.exe和SPT.Server.exe的文件名，这样会导致mo2无法识别游戏。
> 4. 本整合包使用压缩软件：**Bandizip**压缩，推荐使用同款软件解压，否则mo2可能出现**备注有乱码**，可能因为压缩编码问题，本软件安装包已放在网盘的“0、【非正版玩家才用】前置系统环境软件”文件夹中。
> 5. 本整合包以塔科夫离线版SPT3.9.8本体为基础，所以有Realized_Norvinsk_v0.X和SPT_39x（分卷包）两个压缩包,“Realized_Norvinsk_v0.X”是MOD管理器和MOD，“SPT_39x”是游戏本体，请两个都下载。**注：分卷包是指zip、z01-z05共6个文件都要下载，解压仅需解压zip即可。**
> 6. 如果不懂安装，请遵循本技术手册中的安装教程安装整合包，不要跳过任何一步。**本教程部分配图使用旧版本的截图，但道理相通，就不改了。**
> 7. 本整合包多个核心MOD与超级模块和MG大量功能存在冲突，非常不建议与这些MOD一起食用。
> 8. 如果你懂得使用MO2并有一个已经在使用的MO2，请使用该链接中：[https://hub.sp-tarkov.com/files/file/1314-spt-modorganizer-integration/](https://hub.sp-tarkov.com/files/file/1314-spt-modorganizer-integration/)的MO2塔科夫兼容插件建立实例即可。
> 9. ###### 为什么要使用MO2作为整合包的载体，可阅读这篇文章：[为什么用Mod Organizer2来做塔科夫整合包？](为什么用Mod%20Organizer2来做塔科夫整合包？.md)
> 10. ##### ==对整合包进行任何自行改动之前，你都要知道自己在做什么。==

## 安装流程：

### 整合包最低配置要求：
	CPU：Xeon E3-1231 v3@3.4Ghz
	内存：24G ddr3 1600MHz
	显卡：AMD RX580 8G
	硬盘：固态硬盘
![](assets/43A51F0CBE03A9E24D08ACABCE51E3FF.png)

- ### 整合包老玩家请看这里：
	1. 离线版3.7.5开始的去正版验证增加了一个步骤，**如果你是非正版拥有者，或电脑中没有安装正版**，请重新用网盘中的“**1、【非正版玩家才用】新正版验证程序**”重新做一次去正版验证。
	2. 整合包使用的的MO2版本2.5.1rc1，可能有少数电脑用这个版本会有问题。**如果你在正确安装整合包后，用2.5.1rc1启动游戏出现加载MOD数量为0或其他的情况**，请更换mo2版本为网盘中的“仅支持SPT38X及以下版本的Mod.Organizer-2.4.4”，即，将这个244版本解压，然后将Realized_Norvinsk_v1.X中的“mods”、“profiles”、“overwrite”三个文件夹复制到244文件夹中，按下面安装教程重建实例即可。

- ### 整合包新玩家从这里开始看：
	1. **先为整合包创建一个简洁易懂的文件路径，以下将按我自己的实例路径为例讲解（这里推荐萌新玩家、懒人照抄。懂MO2的玩家也可以按自己喜好自定路径，再次提醒：整合包游戏本体和MO2路径均不可以有中文，且路径不宜超过三层。）：在E盘根目录下创建“EFT_Offline”文件夹。
	2. 将Realized_Norvinsk_v0.9x和SPT_39x两个压缩包解压后得到的以下文件剪切到“EFT_Offline”中。
	3. 即此时游戏本体路径应为：E:\\EFT_Offline\\SPT_39x。MO2路径应为：E:\\EFT_Offline\\Realized_Norvinsk_v0.9x。
		==**注意！mo2文件夹不能放在本体文件里！我整合包的mod安装方式不是老一套！==
	4. 电脑首次安装塔科夫的玩家，请先按照“1、【非正版玩家才用】3.7.6新正版验证程序”中的去验证说明.txt使用塔科夫去验证补丁。
	5. 注意：**是电脑从来没装过任何版本的《逃离塔科夫》、或完整卸载过塔科夫的电脑的才需要使用这个“去正版验证文件”文件。电脑已有正版《逃离塔科夫》或其他离线版本的玩家请跳过这一步。

- ### 创建实例
	1. 以上步骤——下载游戏本体和做正版验证确认完成后，打开E:\\EFT_Offline\\Realized_Norvinsk_v0.9x，运行里面的ModOrganizer.exe，便可打开MO2。
	2. 如果直接照抄我上面的实例路径（即盘符、文件夹、路径全部一致），打开MO2后看到的界面应该是下图所示，等于MO2直接读取了我包中已有的实例。可**跳到第五步**之后，继续操作。
	3. 如果没有使用我上面的实例路径，MO2应该会提示以下错误，这表示MO2没找到可识别的实例，这里只需要按“确定”即可跳到创建实例的步骤。
		 ![](assets/Pasted%20image%2020241119230157.png)
	4. 创建实例窗口，点击（1）开始创建实例：
		![](assets/Pasted%20image%2020241002163044.png)
	
	5. 出现的以下窗口中，这两项均可，因为要设置的路径都是一样的：
		![](assets/Pasted%20image%2020241002163241.png)
	
	6. 下一个窗口中，选择（1）：
		![](assets/Pasted%20image%2020241002163423.png)
	
	7. 这里选择的是游戏本体的路径：
		![](assets/Pasted%20image%2020241002165607.png)
	
	8. 下一步出现的这个窗口中不用改动任何东西，因为选不选不会有任何影响。
		![](assets/Pasted%20image%2020241002165758.png)
	
	9. 下一步窗口设置的是MO2所在的路径：
		![](assets/Pasted%20image%2020241002170624.png)
	10. 接下来这两个窗口不用管直接过，就finish安装完成了：
		![](assets/Pasted%20image%2020241002170729.png)
		![](assets/Pasted%20image%2020241002170808.png)
	11. 点完上面的finish完成就会重启，以下界面宣告着实例创建成功：
		![](assets/Pasted%20image%2020241002172504.png)
- #### 必须做的设置
		在游玩之前，还要做必要的设置。先改设置换成中文界面tools-settings-Chinese(Simplified)然后OK即可——
		![](assets/Pasted%20image%2020241018222440.png)
	13. 之后这一步
		1. ### 必须做：这一步必须做**将MOD列表中的备注拉出来**——
		右键黄框一栏，按如图所示将“备注”开启，我在备注中添加了大量说明信息。
		![](assets/Pasted%20image%2020241018222517.png)
	14. 然后接着下一步——恢复预先准备的MOD排序的备份还原。还原备份操作如下：点击“配置档案”栏，确认此时选择的是“现实化诺文斯克vX.x.x”的档案：
		![](assets/Pasted%20image%2020241002173706.png)
 
 - #### 恢复MO2备份
		 ![](assets/Pasted%20image%2020241018222640.png)
		点击以上高亮的黄色箭头，会出现以下界面，因为我已根据不同需求，提供了三个不同的排序备份，请按你的实际情况选择备份恢复。
		![](assets/Pasted%20image%2020250327214006.png)

	##### 安装流程到这里，点击“运行”就可以打开游戏了。但在开始游戏之前，我推荐进行一下一些设置，方便你后续的游玩和游戏中设置。

## 游玩前检查和设置：

- #### 检查
	- 需要检查一下“运行”旁边的路径，这里点击“编辑”打开以下窗口——
		![](assets/Pasted%20image%2020241018222740.png)
	- 确保“程序”的路径是指向你游戏本体里的sptvfsbridge.bat。确保“启动于”的路径是指向你的游戏本体的路径。
		![](assets/Pasted%20image%2020241018222811.png)
		
	- 两个都确保以后，点击MO2界面的“运行”会自动依次运行离线塔科夫的服务器端：
		![](assets/Pasted%20image%2020241018223146.png)
		
	- 然而此时还不能直接按“开始游戏”，先点击右上角“设置”：
		![](assets/Pasted%20image%2020241018223251.png)
		
		确定了“选择文件夹”项的路径是你游戏本体路径，如：E:\\EFT_Offline\\SPT_39x文件夹后，再重启客户端、服务器端，才可开始游戏。
		
	- **温馨提示：如果你的电脑配置较差，服务器开启较慢。SPT Launcher启动后，服务器端可能并未启动完成，就会显示“默认服务器‘SPT-AKI’不可用”。**
		![](assets/Pasted%20image%2020241018223008.png)
		
	- 请在服务器端显示“**服务器正在运行 玩得开心！！**”之后再点客户端上的“重试”就可以正常启动客户端了。
		![](assets/Pasted%20image%2020241002180943.png)
		
		
	- 可自行新建存档。在“电子邮箱”一栏随便输入你喜欢的命名，例如：
		![](assets/Pasted%20image%2020241018223330.png)
		
		##### 并点击“登录/注册”便可创建账号，开始游戏。


## 特别鸣谢

### 汉化、翻译：Volcano对MOD的一系列汉化补丁制作工作及使用授权：
他的ODDBA论坛主页：
https://sns.oddba.cn/139847.html
### **Q群群友:**
诺文斯克潜行者1.0.0版教程的修正：随风而去
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
现实化诺文斯克制作过程中：渗透者之心的物价建议、✘✘✘✘的任务文本翻译、颜开的起始角色建议。

### 离线塔科夫MOD社区
塔科夫 MOD 社区网站：https://hub.sp-tarkov.com/files/
国内塔科夫 MOD 社区 ODDBA：https://sns.oddba.cn/

本整合包所使用的每个MOD的主页列表：
[5.List of the mod used in Realization Norvinsk](../{0}ModPack%20Download/5.List%20of%20the%20mod%20used%20in%20Realization%20Norvinsk.md)

说明手册借鉴自：

B站up主BB84 的辐射 4 整合包《废土蓝调》:
https://www.bilibili.com/video/BV1z54y1Z7hv/

### 谨以此整合包纪念我的两只爱猫

- 大头（左）：2024年3月11日
- 灵灵（右）：2024年3月13日
![](assets/Pasted%20image%2020240930211216.png)
