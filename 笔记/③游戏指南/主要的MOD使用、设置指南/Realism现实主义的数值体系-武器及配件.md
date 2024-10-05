
现实主义将塔科夫原版简单的武器系统进行了大修。
现在武器的数值体系更为复杂，所以在进行数值设计时，要了解这个系统都设置哪些数值以及它们的作用。
- ###### 新的武器及其配件所用到的数值包括且不限于以下：
	- 人机Ergonomics：影响人机功效，越高越好
	- 精准度Accuracy：影响武器MOA，越高越好
		- 科普：1 MOA 大约等于 100 码外的 1 英寸，这意味着 1 MOA 精度的枪支能命中在 100 码处直径约 1"英寸的圆圈，用公制单位，则MOA 在 100 米处命中直径 2.91 厘米的圆圈。
	- 侧向后座力Dispersion：影响枪的散布，越低越好
	- 垂直后坐VerticalRecoil：影响枪的垂直后座力，越低越好
	- 水平后坐HorizontalRecoil：，越低越好
	- 镜头后坐CameraRecoil：，越低越好
	- 后坐力仰角RecoilAngle：，越低越好
	- 平坦度Flatness//Convergence：影响子弹轨迹的平坦度，换句话说，影响子弹的下坠。子弹轨迹越平坦，代表下坠越小。
	- 膛口初速Velocity：
	- 瞄准速度AimSpeed：
	- 有效射程Range：
	- 射速：
	- 冷却CoolFactor：
	- 发热HeatFactor：
	- 上膛速度chamber speed：
	- 故障率MagMalfunctionChance/ModMalfunctionChance：
	- 耐久损耗DurabilityBurnModificator：
	- 填弹/卸弹速度调整LoadUnloadModifier：
	- 换弹匣效率ReloadSpeed：
	- 检视速度CheckTimeModifier：
	- 重量weight：

但现实主义的目前版本中，大部分武器和配件的以上数值都是用脚填（确信）的。
因此在这个系统的配件默认属性中，会出现诸如：导气箍影响准确性、枪管影响瞄准速度、弹鼓影响膛口初速等等奇怪的属性搭配，或者标准AR15导气管的属性比红管好，个别裸枪故障率奇高等等问题。
而我想要做的，就是重新将这些属性回到它们真正应该属于的配件下