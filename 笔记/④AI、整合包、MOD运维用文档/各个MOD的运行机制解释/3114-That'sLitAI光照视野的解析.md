# That's Lit -- SPT 3.11.4 离线版塔科夫 AI 视野真实化模组

> *"Because you're S.P.E.C.I.A.L. -- even bots should fear the dark."*
>
> -- 原项目地址: [No3371/SPT_ThatsLit](https://github.com/No3371/SPT_ThatsLit)
> -- 本仓库兼容 SPT 3.11.4，项目结构 re-target 至 .NET 4.7.2

---

## 一、模组概述

"That's Lit"（"亮瞎了"）是一个 BepInEx 插件，核心目标是**消除逃离塔科夫离线版（SPT）中 Bot AI 的"夜视千里眼"**。在原版塔科夫中，Bot 的视觉系统几乎不受光照、植被、地形或者距离的影响——无论白天黑夜，无论你在草丛还是开阔地，AI 都能以相同的效率发现你。本模组通过 Harmony 运行时补丁的方式，将玩家的**真实光照亮度**、**周围植被密度**、**地形草地覆盖**、**装备灯光/激光**等数据注入到 Bot AI 的视觉判定中，让 AI 的行为更接近人类玩家的感知能力。

**一句话总结：Bot 在黑暗中更难发现你，在草丛中有时会看漏你，你开手电会被更快发现，但夜间你又能利用黑暗逼近它们。**

---

## 二、兼容性

| 项目 | 版本 |
|------|------|
| SPT | 3.11.0 (EFT Build 35392) |
| .NET | Framework 4.7.2 |
| BepInEx | 5.x |
| SAIN | 软依赖 (SoftDependency)，无 SAIN 也能运行 |
| Fika 联机 | 需要额外安装 That's Lit Sync 扩展 |

---

## 三、核心系统与运作原理

### 3.1 总架构：GameWorld 单例 + 每玩家组件

```
ThatsLitPlugin (BepInEx 入口)
  └─ GameWorldHandler.Update() [每帧调用]
       └─ ThatsLitGameworld (单例 MonoBehavior)
            ├─ 为每位真实玩家创建 ThatsLitPlayer 组件
            ├─ 管理地形详情地图 (GPU Instancer Detail Map)
            ├─ 管理植被数据 (Foliage Profile)
            └─ 持有 ScoreCalculator (每地图特化子类)
                 └─ 通过 Unity Jobs 并行计算像素亮度分桶
```

### 3.2 光照/亮度系统 (Brightness Module)

**这是整个模组的核心**，也是最消耗性能的部分。

#### 3.2.1 数据采集流程

```
每帧（ThatsLitPlayer.LateUpdate）：
  1. 6 个方向轮流渲染玩家模型到 32x32~128x128 RenderTexture
  2. AsyncGPUReadback 异步将 GPU 像素读回 CPU
  3. Unity Jobs (IJobParallelFor) 多线程并行统计像素亮度分桶
     - 将像素按亮度分为 7 档：Shine/High/HighMid/Mid/MidLow/Low/Dark
  4. ScoreCalculator.CalculateMultiFrameScore() 综合计算
```

每帧相机从 6 个方向之一渲染玩家模型，渲染纹理仅包含玩家自身（cullingMask = PlayerMask），背景为黑色。这样得到的纹理反映了"玩家在当前游戏光照下看起来有多亮"。

#### 3.2.2 分数计算模型

最终产出两个核心分数（范围 -1 到 1）：

- **ambienceScore（环境光分数）**：基于地图的时间、天气（云量/雾/雨）、地图基础亮度表得出。不同地图有独立的子类：
  - `WoodsScoreCalculator` -- 森林夜间更暗，草地遮蔽更强
  - `LighthouseScoreCalculator` -- 灯塔地图极暗
  - `InterchangeScoreCalculator` -- 立交桥有室内/室外/停车场三重环境
  - `CustomsScoreCalculator` -- 海关有 bunker 环境
  - `ReserveScoreCalculator` -- 储备站有 bunker 环境
  - `StreetsScoreCalculator` -- 街区有城市灯光
  - `GroundZeroScoreCalculator` -- 零号地
  - `ShorelineScoreCalculator` -- 海岸线
  - `NightFactoryScoreCalculator` -- 工厂（夜间）
  - `HideoutScoreCalculator` -- 藏身处

- **multiFrameLitScore（多帧综合亮度分数）**：综合 6 个方向（多帧平均）的像素亮度、环境光分数、玩家装备灯光/激光、以及环境光遮蔽（Ambience Shadow Factor）等因素得出。

**分数含义**：
| 分范围 | 含义 |
|--------|------|
| -1.0 ~ -0.7 | 极度黑暗 -- 几乎不可见 |
| -0.7 ~ -0.3 | 较暗 -- 难以发现 |
| -0.3 ~ 0.3 | 中等 -- 正常可见 |
| 0.3 ~ 0.7 | 较亮 -- 容易发现 |
| 0.7 ~ 1.0 | 极亮 -- 极易发现 |

#### 3.2.3 环境光遮蔽 (Ambience Shadow)

在 `ThatsLitPlayer.Update()` 中，每 5 帧轮流向环境光源方向（太阳/月亮方向）发出射线检测（头/左手/右手/左腿/右腿），计算玩家是否处于阴影中。被遮挡的次数越多，`ambienceShadowFactor` 越高（0~1），会削减环境光分数的影响。

同时还维护了一个 `overheadHaxRating`（头顶遮挡评级），通过 6 个方向的球面射线检测玩家头顶是否有天花板/建筑物，用于判断室内环境。

### 3.3 地形草地遮蔽系统 (Terrain Detail)

该系统读取 Unity 地形的 GPU Instancer Detail Map（即游戏中可见的草丛密度数据），建立玩家周围 5x5 格网的地形细节数据。

#### 数据采集流程（ThatsLitGameworld.BuildAllTerrainDetailMapCoroutine）

```
战局开始后：
  1. 协程遍历所有 Terrain.activeTerrains
  2. 通过反射读取 GPUInstancerDetailManager 的内部空间分区数据(spData)
  3. 逐 cell 提取每种 detail prototype 的密度值，构建 int[,] 二维地图
  4. 此过程跨多个帧执行（yield return WaitForEndOfFrame），避免卡顿
```

#### 实时查询（ThatsLitGameworld.CalculateDetailScore）

当 Bot 进行视觉检查时（SeenCoefPatch），根据 Bot 相对玩家的方向角度，查询对应方向的 3x3 或 2x2 格网（共 15 个方向预置），计算该方向的杂草遮蔽分数。

每种草地类型有不同的评分公式（Utility.CalculateDetailScore，硬编码了 16+ 种草/植物的评分表），分为**趴姿分数(prone)**和**蹲/站姿分数(regular)**。

### 3.4 植被/灌木系统 (Foliage)

#### 数据采集（ThatsLitGameworld.UpdateFoliageScore）

每 ~0.45 秒对玩家周围 4m 进行 `Physics.OverlapSphereNonAlloc` 检测，将碰撞的 Foliage/Grass 层对象按距离排序并计分。距离玩家越近的植被分数越高（0.25m=1.0, 2m=0.1）。

#### 灌木"老鼠"机制 (Bush Ratting)

这是模组中最精密的子系统之一。在 SeenCoefPatch 中，当玩家紧贴特定类型的灌木时，会触发高度定制的遮蔽逻辑。每种灌木有独立的参数组合：

- **角度因子（angleFactor）**：Bot 需要偏离多少角度才能触发遮蔽
- **距离因子（foliageDisFactor）**：玩家离灌木多远才能享受遮蔽
- **敌人距离因子（enemyDisFactor）**：Bot 离多远时遮蔽有效
- **姿态因子（poseScale）**：不同姿态（趴/蹲/站）的遮蔽强度
- **垂直角度因子（yDeltaFactor）**：Bot 从高处往下看时遮蔽是否有效

硬编码支持的灌木类型包括：`filbert_big01~03`(大榛树)、`filbert_01`、`filbert_small01~03`、`filbert_dry03`、`fibert_hedge01~02`(树篱)、`privet_hedge`(女贞)、`bush_dry01~03`(干灌木)、`tree02`、`pine01/05`(松树)、`fern01`(蕨类) 等。

### 3.5 装备灯光/激光系统 (Equipment Check)

每 ~0.41 秒检查玩家装备的灯光/激光设备状态，通过 That's Lit 兼容性 JSON 配置文件（`*.thatslitcompat.json`）查找每个设备模板的灯光/激光/IR 强度值。

检测范围：
- 当前武器上的设备（手电/激光/IR）
- 头盔上的设备
- 副武器/手枪上的设备（标记为 Sub，弱于主武器设备）
- 特殊模组（`extraDevices`，非设备物品但可作为手电用的模组）

状态使用位掩码（`LightAndLaserState.storage`）存储 8 个布尔值，减少内存占用。

### 3.6 六大 Harmony 补丁详解

#### 3.6.1 SeenCoefPatch -- 核心视觉系数修改

**目标方法**: `EnemyInfo.method_7` -- 这是塔科夫 AI 判定"看见玩家"的核心方法，返回值是 Bot 对玩家的视觉系数（SeenCoef）。值越高表示越容易看见，值 >= 8888 表示"直接看见"。

**逻辑流程**（约 1000 行，是模组中最复杂的补丁）：

1. **获取玩家亮度分数**：`multiFrameLitScore`（-1 到 1）
2. **热成像/夜视仪处理**：
   - 热成像模式：直接提升分数到 0.7，大幅增加视觉距离
   - 夜视模式：nullify（削弱）黑暗的影响，根据黑暗程度分三级 nullify
   - IR 激光/灯光：仅在夜视模式中有效
3. **姿态因子（pPoseFactor）**：趴姿 ≈ 0.05，蹲姿 ≈ 0.45，站姿 ≈ 1.0
4. **距离因子（disFactor）**：越远越大，最大 110m 时达到 1.0（距离增强了隐身的有效性）
5. **CQB 近战因子**：6m 以内大幅削弱隐身效果
6. **全局随机忽略（Global Overlook）**：趴姿玩家有一定概率被 Bot 忽略（模拟真实情况）
7. **头顶/室内忽略**：Bot 在高处往下看玩家时忽略概率增加
8. **植被遮蔽**：根据玩家周围植被分数，有概率触发额外的视觉系数提升（即 Bot 更难看见）
9. **地形草地遮蔽**：根据 3x3/2x2 格网方向的地形分数，有概率触发遮蔽
10. **灌木"老鼠"机制**：满足条件时大幅增加 SeenCoef
11. **身体部位识别**：玩家暴露的身体部位越少，Bot 越难识别
12. **模拟自由视角**：Bot 存在"注意力涣散"机制，会随机偏移焦点方向
13. **亮度分数核心应用**：
    - 分数 < 0（黑暗）：增加 SeenCoef 延迟 + 概率强制延迟
    - 分数 > 0（明亮）：减少 SeenCoef 延迟
14. **移动速度影响**：玩家移动快 → 更容易被发现，Bot 移动快 → Bot 更难发现玩家
15. **手电/射击方向影响**：玩家手电直射 Bot → 反应更快；玩家朝向 Bot 射击 → 反应更快
16. **反狙击手机制**：玩家从高处/远处射击 → Bot 有一定概率注意到大致方向
17. **最终缩放**：应用 DarknessImpactScale/BrightnessImpactScale/FinalOffset/FinalImpactScale

#### 3.6.2 EncounteringPatch -- 遭遇反应延迟

**目标方法**: `EnemyInfo.SetVisible` -- Bot "刚看到"玩家的那一刻。

**效果**：
- Bot 背对玩家时，以"模糊线索"替代直接视觉确认（玩家位置被随机偏移 ~50m）
- Bot 冲刺时：强制 ~0.45s 瞄准延迟 + ~22.5% 概率打偏第一枪
- Bot 意外遭遇时：强制 ~0.15s 瞄准延迟 + ~22.5% 概率打偏第一枪
- 向 Bot 的 DangerPointsData 添加危险点，触发 AI 战术响应（而非立即开火）

#### 3.6.3 ExtraVisibleDistancePatch -- 视觉距离补偿

**目标方法**: `EnemyInfo.CheckPartLineOfSight` -- 检查 Bot 的视线是否能到达玩家身体部位。

**效果**：根据光照条件补偿 Bot 的视觉距离（原版 SAIN 夜间会大幅缩短 Bot 视觉距离，导致平衡问题）：
- 热成像模式：补充到热成像有效距离
- 夜视 + 暗环境：根据 IR 灯光/激光强度补充到 MIDDLE_DIST（~100m）
- 白天（ambienceScore > 0）：根据环境光强度补充视觉距离
- 雾天：视觉距离补偿被削减

#### 3.6.4 BlindFirePatch -- 盲射散布

**目标方法**: Bot 盲射计算 `EndTargetPoint` 属性。

**效果**：Bot 盲射时，子弹落点增加随机散布（`Random.insideUnitSphere * 5 * distance/200`），距离越远散布越大。

#### 3.6.5 SAINNoBushOverride -- SAIN 灌木 ESP 中断

**目标方法**: `SAIN.Components.SAINNoBushESP.SetCanShoot` -- SAIN 的灌木阻挡射击判定。

**效果**：当 SAIN 的 NoBushESP 过于激进地阻止 Bot 射击（例如玩家离 Bot 仅 2m 但 Bot 被灌木逻辑阻挡），That's Lit 以概率方式解除该阻挡。概率由距离、Bot 警戒级别、玩家姿态、Bot 是否在瞄准等因素综合计算。

> [!] 仅当 SAIN 已安装且 `Interrupt SAIN No Bush` 配置启用时生效。

#### 3.6.6 InitiateShotMonitor -- 玩家射击监听

**目标方法**: `Player.FirearmController.InitiateShot`

**效果**：记录玩家最近一次射击的方向和时间，供 SeenCoefPatch 和 EncounteringPatch 使用（Bot 会更快发现正在开火的玩家）。

### 3.7 相机采样与像素计数（性能关键路径）

```
帧 N：
  Update() → 相机移动到指定方向 → 渲染 → gquReq 发起 AsyncGPUReadback

帧 N+1：
  Update() → gquReq.done == true → 取回像素 NativeArray<Color32>
          → 启动 CountPixelsJob (Unity IJobParallelFor, 多线程)
          → PreCalculate() 预设阈值

  LateUpdate() → CountingJobHandle.Complete()
              → CompleteCountPixels() 汇总多线程结果
              → CalculateMultiFrameScore() 综合计算
```

**像素分桶** (CountPixelsJob.Execute)：
- 白色像素 (Color.white) 或 Alpha <= 0.5 → 跳过（无效像素）
- 计算亮度值 `pxLum = (R+G+B)/765`
- 按 6 个阈值分 7 档计数，同时累加总亮度和非暗亮度

### 3.8 与 SAIN 的关系

That's Lit 使用 **BepInEx SoftDependency** 声明对 SAIN 的依赖：

```csharp
[BepInDependency("me.sol.sain", BepInDependency.DependencyFlags.SoftDependency)]
```

**交互方式**：
1. 所有 5 个有效 Harmony 补丁均标注 `[HarmonyAfter("me.sol.sain")]`，确保 That's Lit 的修改在 SAIN 之后执行
2. SAINNoBushOverride 直接通过反射 Patch SAIN 程序集的 `SAINNoBushESP.SetCanShoot` 方法
3. SeenCoefPatch 通过 HarmonyAfter 确保它覆盖 SAIN 对 SeenCoef 的任何修改
4. That's Lit 的夜间额外视觉距离补偿（ExtraVisibleDistancePatch）是专门为 SAIN 降低夜间视觉距离后做的平衡补偿

**如果 SAIN 未安装**：模组正常运作，仅 SAINNoBushOverride 补丁不会被注册（ThatsLitPlugin.Patches 中检查 `SAINLoaded`）。

---

## 四、项目文件结构

```
ThatsLit.sln
├── ThatsLit.Core/                          # 主模组
│   ├── ThatsLitPlugin.cs                   # BepInEx 入口，配置绑定，补丁注册
│   ├── ThatsLitAPI.cs                      # 公开 API (供其他模组调用)
│   ├── Logger.cs / ComponentHelpers.cs     # 工具
│   ├── Properties/
│   │   ├── AssemblyInfo.cs                 # 版本信息 + VersionChecker
│   │   └── ConfigurationManagerAttributes.cs
│   ├── VersionChecker/                     # EFT 版本校验
│   ├── Packed/
│   │   ├── default.thatslitcompat.json     # 默认设备兼容配置
│   │   └── empty.thatslitcompat.json       # 空白兼容配置模板
│   └── src/                                # 核心逻辑 (24 文件)
│       ├── ThatsLitGameworld.cs            # 游戏世界单例，地形/植被管理
│       ├── ThatsLitPlayer.cs               # 每玩家组件，环境光遮蔽，相机管理
│       ├── GameWorldHandler.cs             # Update 循环调度
│       ├── ScoreCalculator.cs              # 亮度分数计算 + 9 个地图子类
│       ├── PlayerLitScoreProfile.cs        # 每玩家亮度追踪 (Unity Jobs)
│       ├── PlayerTerrainDetailsProfile.cs  # 每玩家地形数据
│       ├── PlayerFoliageProfile.cs         # 每玩家植被数据
│       ├── PlayerDebugInfo.cs              # 调试数据
│       ├── SeenCoefPatch.cs                # [Patch] 核心视觉系数修改
│       ├── EncounteringPatch.cs            # [Patch] 遭遇反应延迟
│       ├── ExtraVisibleDistancePatch.cs    # [Patch] 视觉距离补偿
│       ├── BlindFirePatch.cs               # [Patch] 盲射散布
│       ├── SAINNoBushOverride.cs           # [Patch] SAIN 灌木中断
│       ├── InitiateShotMonitor.cs          # [Patch] 玩家射击监听
│       ├── ShadowMaskExtractorPatch.cs     # [Patch] 影子遮罩 (已注释)
│       ├── FoliageInfo.cs                  # 植被信息结构体
│       ├── LightAndLaserState.cs           # 灯光/激光状态
│       ├── FrameStats.cs                   # 帧统计结构体
│       ├── ManagedStopWatch.cs             # 性能计时
│       ├── CastedDetailInfo.cs             # 地形详情结构体
│       ├── Utility.cs                      # 通用工具 (草地评分/设备检测/UI)
│       ├── ReflectionHelper.cs             # 反射辅助 (带缓存)
│       └── ThatsLitCompat.cs               # 兼容配置加载器
└── ThatsLit.Sync/                          # Fika 联机同步扩展
    ├── ThatsLitSyncPlugin.cs               # 同步入口
    └── ScorePacket.cs                      # 网络包
```

---

## 五、配置项一览

模块通过 BepInEx 配置系统提供约 50 个可调参数，分为 9 个类别：

| 类别 | 关键配置 | 说明 |
|------|---------|------|
| **1. Main** | Enable | 总开关 |
| **2. Darkness/Brightness** | Enable, Throttle Camera, Darkness/Brightness Impact Offset, 各地图开关 | 亮度模组核心配置 |
| **3. Encountering** | Enable | 遭遇反应延迟开关 |
| **4. Grasses/Foliage** | Enable Grasses, Enable Foliage, Enable Bush Ratting, Foliage Impact Scale | 植被/草地/灌木 |
| **5. Tweaks** | Movement Impact, Sim Free Look, Body Parts Recognition, Nearest Bot Steering, Extra Flashlight Reaction, Final Impact Scale | 行为微调 |
| **6. Info** | Lighting/Weather/Equipment/Foliage/Terrain Info | 屏幕HUD信息显示 |
| **7. Performance** | Resolution Level (1~4), Foliage Samples (1~5) | 性能调节 |

---

## 六、代码质量与问题分析

### 6.1 性能评估

| 模块 | 每帧开销 | 评估 |
|------|---------|------|
| 玩家相机渲染 | 高（GPU 渲染 32x32~128x128 texture） | 主玩家 1 个相机，每联机玩家额外 1 个 |
| AsyncGPUReadback | 中（GPU→CPU 异步传输） | 每玩家每帧 1 次 |
| Unity Jobs 像素计数 | 低（多线程并行，128x128=16384 像素） | 分 64 批次调度 |
| Physics.OverlapSphere (植被) | 低（~0.45s 间隔，4m 半径） | 稀疏触发 |
| 地形详情轮询 | 低（~0.41s 间隔，仅在移动时） | 缓存机制良好 |
| SeenCoefPatch | 中（每 Bot 每玩家每帧，每次 ~30 次 Random.Range + 多次 Dictionary 查找） | 高频调用 |
| 环境光遮蔽射线 (RaycastIgnoreGlass) | 低-中（每 ~0.2s 一轮） | 含玻璃穿透逻辑 |

**整体评估：模组可能吃掉 5-20 FPS，具体取决于 CPU/GPU 和 Raid 中的玩家/Bot 数量。**

### 6.2 已发现的问题

#### [严重] P1 -- NativeArray observed 双重释放风险

**文件**: `ThatsLitPlayer.cs:344-363`

在 `cam.enabled` 被关闭且 GPU 回读请求未完成时，`observed.Dispose()` 可能在主线程和渲染回调中分别调用，导致 Unity NativeArray 双重释放 -- 可能造成崩溃或内存损坏。

**建议**：引入 `_disposeRequested` 标记，确保 NativeArray 只被释放一次。

#### [严重] B1 -- IsPMCSpawnType 运算符优先级

**文件**: `Utility.cs:789-792`

```csharp
return spawnType != null && spawnType == WildSpawnType.pmcBEAR 
    || spawnType == WildSpawnType.pmcUSEC;
```

由于 `&&` 优先级高于 `||`，实际逻辑为 `(spawnType != null && spawnType == pmcBEAR) || (spawnType == pmcUSEC)`。当前因 nullable enum 比较行为巧合正确，但应添加括号明确意图。

#### [严重] B2 -- SAINNoBushOverride 反射目标 NRE

**文件**: `SAINNoBushOverride.cs:15`

`Type.GetType("SAIN.Components.SAINNoBushESP, SAIN")` 若 SAIN 版本更新导致类名/命名空间变化，返回 null 即抛 NullReferenceException。Patches() 调用无 try-catch 保护。

**建议**：添加 try-catch 并在反射失败时优雅降级。

#### [中等] B3 -- Interchange 月光因子死代码

**文件**: `ScoreCalculator.cs:793`

```csharp
if (time > 23.9 && time < 0)  // 条件永假！time 不可能同时 > 23.9 且 < 0
```

应为 `if (time > 23.9 || time < 0)`，否则 Interchange 在 23:54-24:00 月光因子始终为 0。

#### [中等] B4 -- 地形角部格网 NullRef

**文件**: `ThatsLitGameworld.cs:635,644,653,662`

`terrain.topNeighbor.rightNeighbor` 等链式访问中，`topNeighbor` 可能为 null，但条件检查 `posY >= resolution && terrain.topNeighbor.rightNeighbor` 不做 null 检查。Unity 的 `Terrain.topNeighbor` 在无邻居时返回 null。

#### [中等] P2 -- 相机节流逻辑不稳定

**文件**: `ThatsLitPlayer.cs:325-342`

`cameraThrottleFrequency` 由 `1/Time.deltaTime` 计算，帧时间波动导致节流频率频繁变化，且 `Mathf.Lerp(cameraThrottleFrequency, 1, ...)` 使频率持续趋向 1（即关闭节流），与节流设计意图相悖。

#### [轻微] B5 -- Foliage 数组并发读取时序

**文件**: `ThatsLitGameworld.cs:200-281` vs `SeenCoefPatch.cs:398-409`

`UpdateFoliageScore` 先 `Array.Clear` 再填充，但 `FoliageCount` 在函数末尾才更新。SeenCoefPatch 可能在中间状态读到旧 `FoliageCount` + 新 `Clear()` 的数据。

#### [轻微] D1 -- SeenCoefPatch 1000 行单体方法

`SeenCoefPatch.PatchPostfix` 含约 50 个局部变量和 10 个逻辑段落，认知负荷极高。建议拆分为 8-10 个私有辅助方法。

#### [轻微] D2 -- 灌木名称硬编码

20+ 种灌木名称硬编码为字符串字面量（`SeenCoefPatch.cs:577-697`），新地图/资产重命名会静默失效。建议数据驱动（JSON 配置）设计。

#### [轻微] D3 -- #define DEBUG_DETAILS 发布启用

多个源文件顶部 `#define DEBUG_DETAILS`，调试代码在 Release 构建中仍然编译。建议改用 `#if DEBUG` 条件编译。

#### [轻微] D4 -- LightAndLaserState 结构体内含静态 Dictionary 缓存

`LightAndLaserState.Format()` 使用 `static Dictionary<long, string> cache`，结构体是值类型，但静态字典存活期与 AppDomain 一致。如果 storage 值种类极多，可能导致内存泄漏。

### 6.3 性能优化建议

1. **Fika 代理模式利用**：That's Lit Sync 允许联机时切换非本地玩家为 Proxy 模式，跳过其相机渲染，仅通过网络同步分数。已实现但需确保 Fika 场景中正确启用。

2. **SeenCoefPatch 中 Random 调用优化**：每次 PatchPostfix 调用约 30 次 `UnityEngine.Random.Range()`，建议使用 `Unity.Mathematics.Random`（带种子可复现）或预生成随机数数组轮询。

3. **字典查找缓存**：`player.Player.MainParts[BodyPartType.body]` 等每帧多次调用，应在方法开头缓存。

4. **相机降采样**：当 raid 中非本地玩家超过阈值时，自动将远处玩家的相机分辨率降至 16x16。

5. **地形详情多线程构建**：当前在协程中逐 cell 构建，可考虑 Unity Jobs + Burst 编译并行处理。

---

## 七、S.P.E.C.I.A.L. 评级

```
  S - Strength (性能):     5/10  [每玩家渲染开销大，但 Jobs 并行和节流有意识]
  P - Perception (异常处理): 7/10 [关键路径有空检查，但存在边界 bug]
  E - Endurance (可靠性):   6/10 [NativeArray 竞争条件 + 地形 NRE 存在]
  C - Charisma (可读性):    6/10 [架构清晰但 1000 行单体方法拉低评价]
  I - Intelligence (算法):  9/10 [光照/植被/地形三维体系设计精妙，bush ratting 数据详实]
  A - Agility (响应速度):   7/10 [多帧平滑设计优秀，AsyncGPUReadback 合理]
  L - Luck (边界覆盖):      6/10 [边界条件有多处遗漏]
```

---

## 八、贡献与许可

- **原作者**: BA (bastudio) / No3371
- **原仓库**: https://github.com/No3371/SPT_ThatsLit
- **SPT 3.11.4 兼容移植**: SamMeow (本仓库)
- **ReflectionHelper.cs** 部分代码来自 SPT-Aki，使用 University of Illinois/NCSA 开源许可证

---

> *Vault-Tec 提醒：本模组旨在消除 AI 的"千里眼"，实现更公平的游戏体验。但请注意，在真实战场上，一束激光在夜空中的可见距离远超你想象。使用可见激光时，请勿惊讶于 Bot 的快速反应 -- 毕竟，那道光束对双方都是双向的。Prepare for the Future!*
