# TarkovIRL - Weapons Handling Mod (WHM)

> SPT 3.11.x 兼容 | BepInEx 客户端插件 | 依赖 Realism Mod

---

## 一、项目概述

TarkovIRL Weapons Handling Mod（简称 WHM）是一个针对《逃离塔科夫》离线版(SPT-Aki)的 **第一人称武器操控增强模组**。它通过 Harmony 补丁框架深度拦截游戏的渲染管线，在原生武器动画之上叠加多层视觉修正，以求达到更真实、更具沉浸感的武器操控体验。

### 核心理念

在原版塔科夫中，武器在第一人称视角下始终锁定在屏幕正中央，无论角色如何旋转、移动、受伤或疲劳。WHM 的目标是打破这种"武器焊在脸上"的感觉，引入真实世界中持枪会出现的各种细微偏移：

- **惯性摇摆** — 旋转视角时武器不会瞬间跟随，带有视觉延迟（lagging sway）
- **呼吸起伏** — 耐力消耗影响武器的垂直摆动幅度
- **手臂颤抖** — 角色受伤、骨折、流血时持枪不稳
- **姿态影响** — 站立/蹲下/卧倒切换时武器会产生过渡偏移
- **脚步弹跳** — 移动时每一步都会轻微影响武器位置
- **视差效果** — 瞄准镜与眼睛的相对位置随视角变化
- **方向摇摆** — 前后左右移动时武器向对应方向倾斜
- **死区** — 小幅度鼠标移动不触发武器旋转，减少微抖动
- **换弹增强** — 换弹时武器和头部产生视觉偏移
- **武器切换过渡** — 不同武器槽位切换时有平滑的取出动画

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                  EFT 原生代码                         │
│  ProceduralWeaponAnimation / Player / MovementState  │
└──────────────┬──────────────────────────────────────┘
               │ Harmony Patch (17个补丁)
┌──────────────▼──────────────────────────────────────┐
│              TarkovIRL - WHM                          │
│                                                       │
│  ┌─────────────┐  ┌──────────────────────────────┐  │
│  │  PrimeMover  │  │  入口 / BepInEx 插件 / 配置   │  │
│  └──────┬──────┘  └──────────────────────────────┘  │
│         │                                             │
│  ┌──────▼──────────────────────────────────────┐    │
│  │           Controller 层 (静态控制器)          │    │
│  │                                              │    │
│  │  PlayerMotionController  ← 旋转/移动追踪     │    │
│  │  EfficiencyController    ← 效率综合评估      │    │
│  │  WeaponController        ← 武器属性追踪      │    │
│  │  AnimStateController     ← 动画状态映射      │    │
│  │                                              │    │
│  │  NewSwayController       ← 核心摇摆算法     │    │
│  │  ParallaxController      ← 视差效果          │    │
│  │  DirectionalSwayController ← 方向摇摆        │    │
│  │  HandBreathController    ← 呼吸效果          │    │
│  │  HandShakeController     ← 手臂颤抖          │    │
│  │  HandPoseController      ← 姿态效果          │    │
│  │  HandMovWithRotController ← 旋转拉枪        │    │
│  │  FootstepController      ← 脚步效果          │    │
│  │  DeadzoneController      ← 死区              │    │
│  │  HeadRotController       ← 头部旋转          │    │
│  │  WeaponSelectionController ← 切换过渡       │    │
│  │  AugmentedReloadController ← 换弹增强       │    │
│  │  ThrowController         ← 投掷偏移          │    │
│  │  RunningFadeController   ← 奔跑过渡          │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │          RealismWrapper (桥接层)              │    │
│  │  只读访问 Realism Mod 的公开 API              │    │
│  │  - WeaponStats  - PlayerState                 │    │
│  │  - StanceController - RealHealthController    │    │
│  │  - PluginConfig                                │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
               │ 依赖
┌──────────────▼──────────────────────────────────────┐
│            Realism Mod (LIN-Realism)                  │
│  客户端 (BepInEx) + 服务端 (TypeScript)              │
│  - 武器弹道 / 后座力 / 姿态系统 / 健康系统           │
└──────────────────────────────────────────────────────┘
```

### 2.2 数据流（每帧渲染循环）

```
[输入] 玩家输入: 鼠标旋转, 键盘移动, 姿态切换
  │
  ▼
[Harmony Patch 拦截]
  ├─ Patch_LerpCamera_ForceUpdateSway
  │    → 刷新动画状态 → 更新 PlayerMotionController
  │    → 强制调用 UpdateSwayFactors()
  │
  ├─ Patch_LateUpdate_UpdateWpnStats
  │    → 检测武器变更 → WeaponController.UpdateWpnStats()
  │
  └─ Patch_CalculateCameraPosition_HandLayers ★核心汇聚点★
       │
       ├─ EfficiencyController.UpdateEfficiency(Player)
       │    ├─ 遍历所有健康效果 (流血/骨折/震颤/疼痛/疲劳/中毒)
       │    ├─ 综合: 水分/能量/负重/耐力/体力/肾上腺素
       │    └─ 输出: _efficiencyLerp (归一化效率值 0~1+)
       │
       ├─ HandBreathController    → 呼吸垂直偏移
       ├─ HandShakeController     → 颤抖偏移
       ├─ HandPoseController      → 姿态偏移 + 姿态切换过渡
       ├─ HandMovWithRotController→ 旋转拉枪 + 未抵肩下沉
       ├─ FootstepController      → 脚步弹跳 + 侧向摇摆
       ├─ ParallaxController      → 视差位置 + 旋转
       ├─ NewSwayController       → 摇摆位置 + 旋转
       ├─ DirectionalSwayController → 方向摇摆
       └─ WeaponSelectionController → 武器切换过渡
            │
            ▼
       [输出] WeaponRoot.localPosition += 总偏移
              WeaponRoot.localRotation *= 总旋转
```

### 2.3 模块依赖关系

```
PrimeMover (总入口)
  ├── 21条 AnimationCurve (曲线配置)
  ├── ~80个 BepInEx ConfigEntry (可调参数)
  │
  ├── PlayerMotionController
  │     └── 追踪: 旋转速度/方向/移动/俯卧/瞄准/耐力
  │
  ├── EfficiencyController
  │     ├── RealismWrapper (肾上腺素)
  │     ├── AnimStateController (姿态状态)
  │     └── PlayerMotionController (移动状态)
  │
  ├── WeaponController
  │     ├── RealismWrapper (抵肩检测/武器平衡)
  │     └── AnimStateController
  │
  ├── NewSwayController ★核心算法★
  │     ├── RealismWrapper (抵肩/平衡)
  │     ├── WeaponController (武器重量/人体工学)
  │     ├── EfficiencyController (效率修正)
  │     ├── PlayerMotionController (旋转速度)
  │     └── AnimStateController
  │
  ├── ParallaxController
  │     ├── ParallaxAdsController (ADS权重/射击偏移)
  │     ├── RealismWrapper
  │     └── WeaponController
  │
  └── (其余小型控制器，依赖较轻)
```

---

## 三、各模块详解

### 3.1 PrimeMover.cs — 插件入口

`PrimeMover` 是 BepInEx 插件的入口点，继承自 `BaseUnityPlugin`。负责：

- 构造所有 `AnimationCurve`（21条动画曲线，共数百个关键帧）
- 注册所有 Harmony Patch
- 暴露约80个 `ConfigEntry` 供玩家在 BepInEx 配置文件中调整
- 提供全局时间变量 `DeltaTime`、`FixedDeltaTime`

**配置节组织：**
| 节 | 名称 | 内容 |
|----|------|------|
| a | Toggle base features | 功能开关（摇摆/呼吸/姿态等） |
| b | Adjust main feature values | 主功能参数 |
| c | Sway multipliers | 摇摆倍率 |
| d | Parallax multipliers | 视差倍率 |
| e | Efficiency multipliers | 效率倍率 |
| f | Rotation engine multipliers | 旋转引擎倍率 |
| g | Misc multipliers | 杂项 |
| h | Directional Sway Values | 方向摇摆参数 |
| i | Augmented Reload Values | 增强换弹参数 |
| j | Deadzone Values | 死区参数 |
| k | Debug logs | 调试日志 |

### 3.2 PlayerMotionController.cs — 玩家运动追踪

追踪每一帧玩家的运动状态，提供以下关键数据：

| 输出 | 含义 | 用途 |
|------|------|------|
| `RotationDelta` | 总旋转角速度(度/秒) | NewSwayController、ParallaxController |
| `HorizontalRotationDelta` | 水平旋转角速度 | NewSwayController 输入 |
| `VerticalRotationDelta` | 垂直旋转角速度 | NewSwayController hyper vertical |
| `MovementMagnitude` | 移动速度标量 | DirectionalSwayController |
| `MovementDirection` | 移动方向向量 | DirectionalSwayController |
| `LeanNormal` | 倾斜角度 | NewSwayController 倾斜垂直偏移 |
| `IsAiming` | 是否瞄准 | 几乎所有控制器 |
| `IsProne` | 是否卧倒 | EfficiencyController |

### 3.3 EfficiencyController.cs — 效率综合评估

这是整个模组的 **核心调节器**。每帧综合评估玩家状态，输出 `_efficiencyLerp`（归一化效率值）：

**负面影响（降低效率，增加摇摆）：**
- 脱水、饥饿、生命值低、耐力低、手臂耐力低
- 出血、骨折、震颤、疼痛、疲劳、中毒
- 超重

**正面影响（提高效率，减少摇摆）：**
- 站定不动时效率高，奔跑时效率低
- 卧倒更稳定、蹲姿次之
- HighReady姿态加成
- 抵肩/架枪大幅降低摇摆
- 肾上腺素临时消除所有负面效果

**输出：** `EfficiencyModifier` 和 `EfficiencyModifierInverse` 被几乎所有其他控制器使用。

### 3.4 NewSwayController.cs — 核心摇摆算法

这是 WHM 最重要的控制器。它在每帧计算武器的位置和旋转偏移：

**计算输入：**
1. 玩家水平旋转角速度 (`HorizontalRotationDelta`)
2. 是否抵肩 (`HasCheekWeld`)
3. 是否瞄准 (`IsAiming`)
4. 武器重量和人体工学 (`WeaponController.GetWeaponMulti`)
5. 效率修正 (`EfficiencyController`)
6. 武器平衡 (`RealismWrapper.WeaponBalanceMulti`)
7. 姿态 (`StanceController`)

**摇摆输出组件：**
- `_lerpPosHorizontal` — 水平位置摇摆
- `_lerpPosVertical` — 垂直位置摇摆（未抵肩时武器下沉）
- `_lerpRot` — 旋转摇摆（水平转向时的武器倾斜）
- `_weaponTiltLerp` — 武器倾斜角
- `_leanVerticalLerp` — 倾斜导致的垂直偏移
- `_vertDropFromRotLerp` — 旋转导致的枪口下沉
- `_hyperVerticalLerp` — 快速垂直旋转时的过冲

**延迟摇摆 (Lagging Sway)：**
维护一个30帧的环形缓冲区，回溯武器在过去的位置。当前帧的武器位置不是直接输出，而是追向历史位置，产生"武器跟在视角后面"的视觉延迟效果。回溯帧数由武器重量、平衡值、效率综合确定。

### 3.5 ParallaxController.cs — 视差效果

模拟瞄准镜的视差效应。当眼睛（相机）偏离瞄准镜光轴时，武器在屏幕上的位置会产生偏移。

核心算法：累积相机旋转角度 → 通过二次曲线衰减 → 乘以武器倍率 → 在ADS/射击时平滑过渡。

### 3.6 其他控制器

| 控制器 | 功能简述 |
|--------|---------|
| HandBreathController | 耐力越低，呼吸导致的垂直摆动幅度越大 |
| HandShakeController | 随武器耐久下降和手臂骨折增加颤抖偏移 |
| HandPoseController | 蹲姿拉近武器；姿态切换时枪口下沉过渡 |
| HandMovWithRotController | 旋转时武器略微收回；未抵肩时枪口下沉 |
| FootstepController | 脚步弹跳 + 侧向摇摆（走路时武器左右摆动） |
| DirectionalSwayController | W/A/S/D移动时武器向对应方向倾斜 |
| DeadzoneController / NewDeadzoneController | 小角度旋转不触发武器跟随（旧版已弃用） |
| HeadRotController | 组合投掷/倾斜/换弹/ADS的头部旋转偏移 |
| WeaponSelectionController | 不同武器槽位切换时的平滑过渡动画 |
| AugmentedReloadController | 换弹时加速动画 + 头部偏移 |
| ThrowController | 投掷手雷时的视觉偏移 |
| RunningFadeController | 从奔跑状态退出时的武器位置恢复 |

---

## 四、Harmony 补丁清单

| 补丁文件 | 目标方法 | 方式 | 功能 |
|---------|---------|------|------|
| Patch_LerpCamera_ForceUpdateSway | `ProceduralWeaponAnimation.LerpCamera` | Postfix | 每帧刷新动画状态 + 强制摇摆更新 |
| Patch_UpdateSwayFactors | `ProceduralWeaponAnimation.UpdateSwayFactors` | Postfix | 替换原生SwayFactors（Y轴） |
| Patch_LateUpdate_UpdateWpnStats | `Player.LateUpdate` | Postfix | 检测武器变更，更新武器统计 |
| Patch_CalculateCameraPosition_HandLayers | `ProceduralWeaponAnimation.CalculateCameraPosition` | Postfix | **主渲染汇聚点** |
| Patch_PlayStepSound | `Player.PlayStepSound` | Postfix | 脚步事件通知 |
| Patch_OnShot | `Player.OnMakingShot` | Postfix | 射击时更新视差 |
| Patch_TranslateCommand | `Class1599.TranslateCommand` | Postfix | 命令路由（换弹/屏息/折叠托/武器选择） |
| Patch_SetHeadRotation | `ProceduralWeaponAnimation.SetHeadRotation` | Prefix(false) | 死区 + 头部旋转完全替换 |
| Patch_Look | `Player.Look` | Postfix | 头部旋转组合（投掷/倾斜/换弹/ADS） |
| Patch_ProcessRotation | `MovementState.ProcessRotation` | Prefix(false) | 完全替换原生旋转逻辑 |
| Patch_ProcessUpperbodyRotation | `MovementState.ProcessUpperbodyRotation` | Prefix(false) | 完全替换原生上身旋转 |
| Patch_ReloadMag | `Player.FirearmController.ReloadMag` | Postfix | 刷新换弹动画器引用 |
| Patch_QuickReloadMag | `Player.FirearmController.QuickReloadMag` | Postfix | 同上 |
| Patch_CheckAmmo | `Player.FirearmController.CheckAmmo` | Postfix | 同上 |
| Patch_StamRegen | `PlayerPhysicalClass.method_21` | Postfix | 屏息时额外消耗耐力 |
| Patch_ThrowGrenade | `Player.ThrowGrenade` | Postfix | **已注释，未启用** |
| Patch_SetSprint | `FirearmsAnimator.SetSprint` | Prefix(false) | **未注册，会完全阻止冲刺** |

---

## 五、与 Realism Mod 的依赖关系

WHM **硬依赖** Realism Mod，通过 `RealismWrapper` 封装访问：

| WHM使用的Realism API | 用途 |
|---------------------|------|
| `WeaponStats.HasShoulderContact` | 判断武器是否抵肩 |
| `WeaponStats.Balance` | 获取武器平衡值 |
| `WeaponStats.CurrentMagReloadSpeed` | 获取当前弹匣装填速度 |
| `WeaponStats._WeapClass` | 判断武器类别（手枪/步枪） |
| `PlayerState.ReloadSkillMulti` | 获取换弹技能加成 |
| `PlayerState.GearErgoPenalty` | 获取装备人体工学惩罚 |
| `StanceController.IsDoingTacSprint` | 检测战术冲刺 |
| `StanceController.ActiveAimManipBuff` | 获取ActiveAim加成 |
| `StanceController.CurrentStance` | 获取当前姿态（HighReady/LowReady/ShortStock等） |
| `StanceController.IsMounting` | 检测架枪状态 |
| `StanceController.IsLeftShoulder` | 检测左肩抵肩 |
| `Plugin.RealHealthController` | 肾上腺素/健康状态（通过 `Plugin.RealHealthController` 访问） |
| `PluginConfig.GlobalCheckAmmoMulti` | 获取检查弹药速度倍率 |
| `PluginConfig.GlobalCheckAmmoPistolSpeedMulti` | 获取手枪检查弹药速度倍率 |

> 注: WHM 中使用的 `EfficiencyController.EfficiencyModifierInverse` 是 WHM 自身的效率计算器（`TarkovIRL.EfficiencyController`），不是 Realism 的 API。Realism v1.6.3 中不含同名类。

**注意：** 由于 WHM 直接引用 `RealismMod` 命名空间中的类型，Realism Mod **必须先于** WHM 加载。

---

## 六、配置说明

在 SPT 中安装后，首次运行会在 `BepInEx/config/` 目录下生成配置文件 `TarkovIRL.cfg`。

### 功能开关（a节）
每个视觉效果都可以独立开关：
```ini
[a - Toggle base features]
IsWeaponDeadzone = true     # 武器死区
IsWeaponSway = true         # 武器摇摆
IsBreathingEffect = true    # 呼吸效果
IsPoseEffect = true         # 姿态效果
IsPoseChangeEffect = true   # 姿态切换过渡
IsArmShakeEffect = true     # 手臂颤抖
IsSmallMovementsEffect = true # 微动效果
IsFootstepEffect = true     # 脚步效果
IsParallaxEffect = true     # 视差效果
IsDirectionalSway = true    # 方向摇摆
IsHeadTiltADS = true        # ADS头部倾斜
IsAugmentedReload = true    # 增强换弹
IsWeaponTrans = true        # 武器切换过渡
```

### 倍率参数（b-j节）
所有视觉效果的强度都可以通过倍率滑块调整，范围通常为 0.0 ~ 5.0，默认 1.0。

建议使用默认值开始，逐步调整到适合自己的手感。

---

## 七、安装方法

1. 确保已安装 SPT 3.11.x
2. 确保已安装 **Realism Mod**（客户端 + 服务端）
3. 将 WHM 的 `scripts/` 目录下的所有 `.cs` 文件编译为 DLL，或直接放入 BepInEx 插件目录
4. 启动 SPT 服务器，然后启动游戏客户端
5. 首次运行后在 `BepInEx/config/TarkovIRL.cfg` 中调整参数

---

## 八、已知问题

1. **武器切换过渡** — `WeaponSelectionController.selectionFromSlot` 逻辑错误（`&=` 应为 `|=`），已修复于 v1.0.1
2. **RealismWrapper.IsOverdose 硬编码** — `IsOverdose` 曾硬编码返回 `false`，已接入 `RealismHealthController.HasOverdosed`，已修复于 v1.0.1
3. **每帧字符串分配** — `EfficiencyController` 曾每帧分配字符串，已通过 Type 缓存解决，已修复于 v1.0.1
4. **旋转日志刷屏** — `Patch_ProcessRotation` 曾每帧输出 Error 日志，已注释，已修复于 v1.0.1
5. **旧版死区控制器** — `DeadzoneController` 和 `Patch_SetHeadRotation_ApplyDeadzone` 已移除

---

## 九、技术栈

- **语言：** C#
- **框架：** .NET Framework 4.7.2 / .NET Standard 2.1
- **游戏引擎：** Unity (Escape from Tarkov)
- **模组框架：** BepInEx + Harmony + SPT.Reflection
- **代码组织：** 40个 C# 脚本文件，全部位于 `scripts/` 目录（优化后从45个精简至40个，移除5个弃用文件）

---

*TarkovIRL - Weapons Handling Mod — 让塔科夫的武器操控回归真实。*
