
> [!NOTE] 好奇猫注：
> 本文章是翻译自：https://hub.sp-tarkov.com/files/file/1453-that-s-lit-logical-ai-vision/#overview 的内容，是THAT'S LIT的说明
> THAT'S LIT是我的整合包中辅助SAIN进行AI视野拟人化的MOD，他通过一些复杂的计算让AI的视野受到游戏内光影环境的影响，以模拟人类在游戏中的表现。

# **That's Lit**

Let's define unfair: When your bullet hits or whizzes past a bot, it knows your exact position. They can see you perfectly fine in the dark as long as you are within its vision range. They don't care how dense are the foliage and grasses around you.


> [!NOTE] 翻译
> 让我们来定义一下不公平：
> 当你的子弹击中或飞过机器人时，它知道你的确切位置。只要你在它的视野范围内，它们就能在黑暗中完美地看到你。
> 它们不在乎你周围的树叶和草有多茂密。


Yet we struggle to locate bots with our human eyes.

This is why That's Lit exists: in SPT, we no longer play against human players, bots need to make human-like mistakes just like how real players do.

That's Lit let AIs overlook you when you are blended in the shadow, or spots you faster when you are lit up by lighting. Imaging ratting in Night Factory?

It also allows you to traverse the fields through grasses and bushes without always getting engaged from afar. Imagine to prone in the Woods?

Additionally, randomness is applied to AIs vision check, so they are no longer machines which 100% spots you in their configured distance or 0% out of range.


> [!NOTE] 翻译
> 然而，我们很难用人类的眼睛找到机器人。
这就是 That's Lit 存在的原因：在 SPT 中，我们不再与人类玩家对战，机器人需要像真人玩家一样犯下类似人类的错误。
That's Lit 让机器人在您融入阴影时忽略您，或者在您被灯光照亮时更快地发现您。想象一下你在工厂夜图里抓老鼠？
它还允许你穿过草地和灌木丛穿越田野，而不必总是从远处进行攻击。想象一下在树林里匍匐前进？
此外，机器人的视觉检查具有随机性，因此它们在配置距离内不再只有 100% 或 0%发现你两种极端情况。


The goal is to give bots vision restrictions and imperfect reaction similar to human, so you can sneak around in night time without always getting spotted by bots from a distance, dash into trees and plants to interrupt bots' aim, or maybe get surprised by the fact that, bot no longer shoot at the very first moment you pop out of cover.


> [!NOTE] 翻译
> 目标是让机器人的视觉受到限制，并做出与人类相似的不完美反应，这样你就可以在夜间潜行而不会总是被远处的机器人发现，冲进树木和植物中打断机器人的瞄准，或者可能会惊讶地发现，当你从掩体中跳出的第一刻，机器人不再射击。


By default 2 meters are displayed at the top left corner for you to learn the mechanic, and they can be disabled.

The first is brightness meter showing how dark (left) and how bright (right) you are, the second meter (factor) tells you how much AIs are actually affected by your brightness. Factor value is just squared Score. In other words, the second meter is the final effectiveness of the first meter.

The meters only give you a rough idea about the impact of your brightness, ingame the bots are affected individually according to their positions, directions or other conditions.

To directly feel the effect of That's Lit, just go to Night Factory and look at the meters as you move, or sit in the darkness and wait for innocent AIs coming to you.

> [!NOTE] 翻译
> 默认情况下，左上角会显示 2 个仪表，供你参考，它们可以被禁用。
> 
>第一个是亮度计，显示你有多暗（左）和多亮（右），第二个仪表（因子）告诉你AI的视野实际上受到第一个仪表的亮度的影响有多大。因子值只是得分的平方。换句话说，第二个仪表是第一个仪表的最终效果。
>
>仪表只能让你大致了解亮度的影响，游戏中的机器人会根据其位置、方向或其他条件受到单独影响。
>
>要直观感受 That's Lit 的效果，只要进工厂夜图，边移动边查看仪表，或者坐在黑暗中等待无辜的 AI 来到您身边即可。

The mod is developed with SAIN and Realism, it works fine without them, but the default experience could feel easier if your setup is different.

It's very important to have a loadout mod that properly gives bots NVG or Flashlights in night raids to keep the game balanced.

The positive and negative impact from the mod is fully configurable, so when you feel the game becomes too easy maybe adjust those to your liking, but I suggest try harder SAIN presets or hardcore mods like Realism, before tuning the mod, because the mod is more like a post-processor which is based on vanilla and other mods.

Some setting adjustment is required for SAIN, Check "Recommended Mods" below.

Keep reading to get the most out of the mod.

> [!NOTE] 翻译
> 该模组是在 SAIN 和 Realism 环境下开发的，但没有它们也能正常工作，如果您的设置不同，默认体验可能也会让你游玩更轻松。
> 
>不过，拥有一个可以在夜间战局中为机器人提供 夜视仪 或手电筒的装备模组（例如Realism现实主义）非常重要，这样可以保持游戏平衡。
>
>该模组的积极和消极效果是完全可配置的，因此当您觉得游戏变得太简单时，可以根据自己的喜好进行调整，但我建议在调整模组之前尝试更难的 SAIN 预设或 Realism 等硬核模组，因为该模组更像是基于 vanilla 和其他模组的后处理器。
>
>SAIN 需要进行一些设置调整，请查看下面的“推荐模组”。
>继续阅读以充分利用该模组。


### **Explanation-解释**

In short: The mod delays bots reaction, in a way that how a human would see you but fail to recognize you.

Most parts of the mod are about modifying one value called _SeenCoef_, which determines how long the an AI needs to have you in their vision to recognize you, in other word, time to visual confirmation.

> [!NOTE] 翻译
> 简而言之：该模组会延迟机器人的反应，就像人类可以看到你但无法识别你一样。
> 
> 该模组的大部分内容都是关于修改一个名为“SeenCoef”的值，该值决定了AI需要多长时间才能将你置于他们的视野中并确认你，换句话说，就是视觉确认的时间。


The _SeenCoef_ is modified by some calculation with all these factored in :

- The mod factors in all sorts of data to adjust AIs, minor mechanics are not listed. Direction, distance, height, indoor/outdoor, weather, season, devices/goggles/scopes, movement... A lot of stuff could have a impact on the gameplay.
- Time and cloudiness determine the ambience lighting in raid. Lighting matters a lot! Try to sneak in shadows and avoid lights.
    - This also means weathers now affects gameplay! Sunny days are much brighter than cloudy days and makes you more visible, thus you'd prefer cloudy days for low profile raids.
    - In the brightest hours of clear nights you could be as visible as day time raids of normal weather.
    - When outside, you will want to stick to shadows, especially in the brightest hours (clear days&nights). It helps.
        - Top half of some Ground Zero skyscrapers do not have proper colliders thus Ambience Shadow check is not working stably for these. This only mess with you if you are not covered by nothing else or the bottom of the skyscrapers. (Maybe Streets have the same issue too, not tested)
    - Some balance changes are applied in winter raids, and overall makes you slightly easier to be spotted. Try to avoid empty snowy ground.


> [!NOTE] 翻译
> _SeenCoef_ 经过一些计算修改，其中考虑了所有这些因素：
> - 该模型考虑了各种数据来调整 AI，未列出小机制。方向、距离、高度、室内/室外、天气、季节、设备/护目镜/瞄准镜、运动……很多东西都可能对游戏玩法产生影响。
> - 时间和云量决定了突袭中的氛围照明。照明非常重要！尝试潜入阴影并避开灯光。
> - 这也意味着天气现在会影响游戏玩法！晴天比阴天明亮得多，让你更容易被看到，因此你更喜欢阴天进行低调突袭。
> - 在晴朗夜晚最亮的时候，你可以像正常天气的白天突袭一样被看到。
> - 在户外时，你会想要待在阴影里，特别是在最亮的时候（晴朗的白天和夜晚）。这会有所帮助。
> - 一些中心区的摩天大楼的上半部分没有合适的碰撞器，因此环境阴影检测无法稳定地工作。如果您没有被其他东西或摩天大楼的底部遮挡，这只会对您造成困扰。（也许街区也有同样的问题，未经测试）
> - 在冬季战局中应用了一些平衡变化，总体而言，让您更容易被发现。所以尽量避免停留在空旷的雪地中吧。


- Getting lit up by any lights including flashlights, gun flashes or thunder, will hinder your stealth, especially when the lighting is unstable.
- Active flashlight or laser is very likely to expose you (including IR if the AI is using NVGs)
    - A lot of the features are much less effective with flashlights on, some even get impacted by lasers. Try to toggle them wisely!
- AIs using NVGs are quite unaffected by darkness, especially at close distance. If the player is in really dark areas, their NVGs will be somewhat less effective.
- AIs using Thermal goggles are pretty much unaffected, and can actually spot the player faster.
    - Taking stims like SJ9 actually nullify this and grants you stealth against them.
- AIs using Night Vision scopes and Thermal scopes can ignore your stealth, given you are in front of them, especially when the bot is not moving.

> [!NOTE] 翻译
> - 被任何灯光（包括手电筒、枪闪光或雷声）照亮都会妨碍你的隐身，尤其是在光线不稳定的情况下。
>- 激活手电筒或激光很可能会暴露你（如果人工智能使用夜视镜，包括红外线）
> 	- 很多功能在打开手电筒时效果会大打折扣，有些甚至会受到激光的影响。尝试明智地切换它们！
>- 使用夜视镜的人工智能几乎不受黑暗的影响，尤其是在近距离时。如果玩家处于非常黑暗的区域，他们的夜视镜效果会稍差一些。
> - 使用热护目镜的人工智能几乎不受影响，而且实际上可以更快地发现玩家。
>	- 服用像 SJ9 这样的刺激剂实际上可以消除这种情况并让你对他们隐身。
> - 使用夜视镜和热成像镜的人工智能可以忽略你的隐身，因为你在他们面前，尤其是当机器人不动的时候。

- Forest blending: Staying close to foliage grants a small chance for AI vision check to fail from afar.
    - Requires the nearest foliage to be between the AI and you (effectiveness scale down with the relative angle up to 90 degree).
        - It's configurable up to 5 candidates instead of just the nearest foliage, which can helps you against multiple bots from different directions
    - By **afar** I mean this has no effect for AIs within 10m, and the effectiveness gradually scales up by distance up to 110m. (It's a low curve, much weaker at close range, only 25% effective at 50m but reach 100% at 110m)
- AIs have a chance to overlook players up high, especially when the player is in low poses.
- There's a small chance for bots outside to fail spotting players inside. Does not work when the bot is looking straight toward the player, or at closer distances.
    - "Inside" is defined by BSG. Proper buildings with walls and ceilings usually count... of course, there are weird exceptions.
- There's a possibility AIs will continuously overlook when you hide nicely inside foliage, even at close distance, just like how we can rat in bushes on live.
    - You may still become exposed anytime, especially when they get close or turn to you. Don't feel too safe in there.
    - Different foliage have different characteristics, different poses may be required for a foliage to take effect, and the effectiveness may vary against AIs at different heights.
    - This even applies to short trees or tall bushes, while they are usually useless against AIs at close or maybe mid range, It's not a bad idea to stick to foliage as much as possible, It does has an effect against AIs far away.
    - [Preview](https://streamable.com/01r3pb)
- Grasses are now proper visual covers, surrounding grasses contributes to AIs overlooking you.
- You can actually get close to enemies without being noticed in day time by crawling through dense grasses.
- The only thing to note is only grasses in the direction to the AI within ~3.5m participate in the calculation. Otherwise, common sense applies.
- Warning: there are some rare [exceptions](https://imgur.com/a/W6Z2HaF) (ex: the plant in the center), these are probably decorations manually placed by BSG. They are not rendered by the terrain detail system so are not detectable.

> [!NOTE] 翻译
> - 森林融合：靠近树叶会导致 AI 远距离视觉检查失败。
> -	要求最近的树叶位于 AI 和您之间（效果会随着相对角度的增加而减小，最大角度为 90 度）。
> -	最多可配置 5 个候选者，而不仅仅是最近的树叶，这可以帮助您对抗来自不同方向的多个机器人
> - 远处的意思是这对 10 米内的 AI 没有影响，效果会随着距离逐渐增加，最远可达 110 米。（这是一条低曲线，近距离时效果要弱得多，在 50 米时效果只有 25%，但在 110 米时达到 100%）
> - AI 有机会忽略高处的玩家，尤其是当玩家处于低姿势时。
> - 外面的机器人有很小的几率无法发现里面的玩家。当机器人直视玩家或距离较近时不起作用。
“内部”由 BSG 定义。有墙壁和天花板的正规建筑通常算数……当然，也有奇怪的例外。
> - 当你很好地躲在树叶里时，AI 可能会不断忽视你，即使在近距离，就像我们在现场的灌木丛中捉老鼠一样。
> - 你仍然可能随时暴露，尤其是当他们靠近或转向你时。在那里不要觉得太安全。
> - 不同的树叶有不同的特点，树叶可能需要不同的姿势才能生效，并且对不同高度的 AI 的有效性可能会有所不同。
> - 这甚至适用于矮树或高灌木丛，虽然它们通常对近距离或中距离的 AI 无效，但尽可能地坚持树叶并不是一个坏主意，它对远处的 AI 确实有影响。
> - 草现在是合适的视觉掩体，周围的草有助于 AI 俯视你。
> - 实际上，白天时，你可以通过爬过茂密的草丛接近敌人而不被发现。
> - 唯一要注意的是，只有 AI 方向约 3.5 米内的草丛才会参与计算。否则，常识适用。
> - 警告：有一些罕见的例外（例如：中心的植物），这些可能是 BSG 手动放置的装饰。它们不由地形细节系统渲染，因此无法检测到。

- Distance matters. Most of the features are more effective to AIs far away from you. Once you are spotted, you lost the distance bonus and will need to get out of the sight for a short while to regain the bonus.
	- For AIs at 110m+ away you need to stay out of sight for about 1.5 seconds; the required time is much longer for closer AIs. If the AI is actively targeting you, it'd take longer.
	- Physical obstacles are always better than grasses and foliage. If you are caught off guard and really have no choice but some nice dense grasses around you, you can try to prone and hope it works.
- Player and bot movement are applied as final modifiers.
	- Sprinting bots are less likely to spot players not in front.
	- The player will be spotted faster by movement speed, unless it's really dark.
	- Bots staying still will spot the player faster.
- Like SAIN's Personality system, That's Lit has a caution mechanic that diversify bots' immunity against some mechanics.
	- 1 or 2 bots out of 10 have better resistance, they are defined to be cautions and are less likely to overlook the player in stealth.
	- 3 to 5 bots out of 10 have weaker resistance, they are defined to be careless and are more likely to overlook the player in stealth.
- To simulate bots remembering your presence, many mechanics are greatly nerfed if the bot has seen you recently, or has seen you at the same spot. Keep moving!
- By default, all the features don't affect bosses (optional). Bush Ratting does not work for bosses even if the option is turned on, for balance reason.
TL;DR: Out **of** fights, utilize the environment and choose path wisely. When engaged, be strategic and flexible, try to stay out of sight as much as possible... When you pop up, you kill.


> [!NOTE] 翻译
> 距离很重要。大多数功能对远离你的 AI 更有效。一旦被发现，您将失去距离奖励，需要离开视线一小会儿才能重新获得奖励。
>- 对于距离 110 米以上的 AI，您需要离开视线约 1.5 秒；对于距离较近的 AI，所需时间要长得多。如果 AI 主动瞄准您，则需要更长时间。
>- 物理障碍总是比草和树叶更好。如果您措手不及，真的别无选择，只能在周围有一些茂密的草丛，您可以尝试俯卧并希望它有效。
>- 玩家和机器人移动被用作最终修改器。
>- 冲刺机器人不太可能发现不在前面的玩家。
>- 除非天真的很黑，否则玩家会因移动速度而更快地被发现。
>- 保持静止的机器人会更快地发现玩家。
>- 与 SAIN 的个性系统一样，That's Lit 有一个谨慎机制，可以分散机器人对某些机制的免疫力。
>- 10 个机器人中，有 1 到 2 个具有更好的抵抗力，它们被定义为谨慎，不太可能忽视隐身中的玩家。
>- 10 个机器人中，有 3 到 5 个具有较弱的抵抗力，它们被定义为粗心大意，更有可能忽视隐身中的玩家。
>- 为了模拟机器人记住您的存在，如果机器人最近见过您，或者在同一地点见过您，许多机制都会被大大削弱。继续前进！
>- 默认情况下，所有功能都不会影响 Boss（可选）。出于平衡原因，即使打开该选项，Bush Ratting 也不适用于 Boss。
>
>
>TL;DR：在战斗之外，利用环境并明智地选择路径。交战时，要有策略性和灵活性，尽量远离视线……当您突然出现时，您就会杀死。

The mod also include some small patches to make bots more reasonable:

- Bots' aim will be delayed if they encounter you when sprinting, because in vanilla they sometimes head,eye us at the first moment they end inertia slide, while we players can't even ADS when sprinting.
- In situations a bot is told to "see" you but it's actually not facing your way, by a chance That's Lit will cancel the visibility. Instead, the bot will be told it's spotted from the player's direction, so it may finds covers first instead of instant returning fire,  
    - If that doesn't happen, there's still a fallback chance for it to happen if it's a surprise attack (the bot haven't seen you for quite a while and you are far away)
    - Basically, this helps bots to behave like human being clueless when surprise attacked.


> [!NOTE] 翻译
> 该模组还包含一些小补丁，使机器人更加合理：
> - 如果机器人在冲刺时遇到你，它们的瞄准会延迟。因为在原版中，它们有时会在惯性滑行结束的第一刻就盯着我们，而我们玩家在冲刺时甚至无法进行 ADS。
> - 如果机器人被告知“看到”你，但实际上它并没有面向你，那么 That's Lit 可能会取消可见性。相反，机器人会被告知它从玩家的方向被发现，因此它可能会先找到掩体，而不是立即回击，如果没有发生这种情况，如果是突然袭击（机器人很长时间没有看到你，而你离你很远），仍然有后备机会发生。
> - 基本上，这有助于机器人在受到突然袭击时表现得像人类一样毫无头绪。

- Compensation to bots vision distance to at least a reasonable amount:
    - When the ambience is very bright
    - When the ambience is dark but the player is lit up
    - When the player is in the dark but the bot is using NVG
    - When the bot is using Thermal goggles
    - These compensations are especially important with SAIN, because it scales down bots' vision distance simply by time and weather. Vision distance decides whether vision check happens, this means, no matter how much the player is lit up, bots remains unable to see the player if the distance exceeds the SAIN modified value. The patch balances out SAIN's vision distance scaling.
- When the Brightness module is disabled, an optional fluctuation to visual confirmation is applied (optional, enabled by default). For the most part there will not be noticeable difference, only that you may get lucky or unlucky.
- Bot aim point is forced to randomly jump when blind firing. This is because I got shot in the head from the sawmill (Woods)... and I was at RUAF Gate.

That's Lit is unlikely to conflict with other mods. The mod only modifies specific values out of the whole AI system, it does not add or change AI behavior pattern. An analogy would be... Given a formula **A+B**, That's Lit changes the value of B instead of makes it **A+B+C** or **B+C**.

> [!NOTE] 翻译
> 将机器人的视距补偿到至少合理的量：
> - 当环境非常明亮时
> - 当环境很暗但玩家被照亮时
> - 当玩家在黑暗中但机器人正在使用 NVG 时
> - 当机器人正在使用热护目镜时
> - 这些补偿对于 SAIN 尤其重要，因为它会根据时间和天气缩小机器人的视距。视距决定是否进行视觉检查，这意味着，无论玩家被照亮多少，如果距离超过 SAIN 修改值，机器人仍然无法看到玩家。补丁平衡了 SAIN 的视距缩放。
> - 当亮度模块被禁用时，将应用可选的视觉确认波动（可选，默认情况下启用）。在大多数情况下不会有明显的差异，只是你可能会幸运或不幸。
> - 盲目射击时，机器人瞄准点被迫随机跳跃。这是因为我在锯木厂（Woods）被子弹击中头部……当时我在 RUAF Gate。
> 
> That's Lit 不太可能与其他模组发生冲突。该模组仅修改整个 AI 系统的特定值，不会添加或更改 AI 行为模式。打个比方……给定一个公式 **A+B**，That's Lit 会改变 B 的值，而不是使其成为 **A+B+C** 或 **B+C**。



