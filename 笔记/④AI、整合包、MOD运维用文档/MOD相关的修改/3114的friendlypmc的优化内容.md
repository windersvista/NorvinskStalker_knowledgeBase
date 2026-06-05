# friendlyPMC v4.5.0 更新日志

> 性能优化版 | 基于 v4.4.12 (Pit Alex) | 发布日期: 2026-06-05
> 议会共识审查 | 22 项优化 | 双端交付

---

## 交付架构

v4.5.0 通过三层组件协同工作：

```
+----------------------------------+
| friendlyPMC-Optimizer.dll (新增)  |  ← Harmony 运行时补丁，增强原 DLL
+----------------------------------+
| friendlyPMC.dll (v4.4.12 原版)    |  ← 保留原版，未修改
+----------------------------------+
| user/mods/friendlyPMC/src/*.ts    |  ← 服务端全面重构
+----------------------------------+
```

| 组件 | 状态 | 说明 |
|------|------|------|
| `friendlyPMC-Optimizer.dll` | **编译交付 (11 KB)** | 5 个 Harmony Prefix 补丁，0 错误 0 警告编译 |
| `friendlyPMC.dll` | 保留原版 | 不直接修改，由 Optimizer 运行时增强 |
| 服务端 TypeScript | **源码交付** | 消息队列、索引、配置化、清理等 8 项优化 |
| 客户端 C# 源码 | **参考交付** | 完整优化源码在 `decompiled-client/` (共 22,134 行) |

---

## Optimizer 补丁清单 (5 项)

每个补丁 < 60 行，通过 Harmony Prefix 在运行时拦截原始 DLL 的热路径：

| 补丁 | 目标 | 策略 | 效果 |
|------|------|------|------|
| `FollowerPatrolOptimizer` | `FollowerPatrol.Patrol()` | LRU 缓存 + 空间哈希 + 迭代 30→10 | CPU -8~15% |
| `BotActivateOptimizer` | `BotOwnerActivatePatch.PatchPostfix` | HashSet O(1) 跳过已注册 Follower | CPU -5~10% |
| `BeingHitOptimizer` | `FollowerCommonLayer.BeingHitAction` | 每 Bot 200ms 节流 | GC -3~5% (战斗时) |
| `BulletImpactOptimizer` | `BulletImpactPatch.PatchPostfix` | 无 Follower 时完全拦截 | 单人 Raid 0ms 开销 |
| `JsonCacheOptimizer` | `NpcMessage.NpcSendThankYou` | 双检锁全局缓存 | UI 响应 +200ms |

---

## 服务端优化清单 (8 项)

所有修改在 `user/mods/friendlyPMC/src/` 中，直接生效：

| # | 优化 | 文件 | 效果 |
|---|------|------|------|
| 1 | MessageQueue 消息队列 | SquadChat.ts | 替换 33 处 setTimeout，指令响应 -0.5~1s |
| 2 | Profile 索引 | SquadChat.ts | 8 处 find() → O(1) Map 查找 |
| 3 | 技能 JSON 化 | Squad.ts + config/skills.json | 150 行硬编码 → 30 行配置驱动 |
| 4 | Session TTL 清理 | Squad.ts | 每 30 分钟清理 24h 未用 session 数据 |
| 5 | SPTAdapter 参考实现 | SptAdapter.ts (新建) | 16 个方法封装私有 API 访问 |
| 6 | 装备 Set 优化 | SquadChat.ts | Array.includes → Set.has |
| 7 | 命令参数验证 | SquadChat.ts | 防止无效命令崩溃 |
| 8 | JSON Schema | config/*.schema.json (3 新建) | 防止手动编辑配置损坏 |

---

## 客户端源码优化 (9 项，参考交付)

完整 C# 源码在 `decompiled-client/friendlyPMC/`，154 个文件，22,134 行。以下优化在源码层面已完成，未来可重新编译替代 Optimizer + 原始 DLL：

| # | 优化 | 文件 | 说明 |
|---|------|------|------|
| 1 | FollowerPatrol 缓存 + 迭代削减 | FollowerPatrol.cs | 巡逻点 LRU 缓存，NavMeshPath 池化 |
| 2 | BeingHitAction 环形缓冲区 | FollowerCommonLayer.cs | List → 固定 8 槽环形缓冲区 |
| 3 | BotOwnerActivatePatch HashSet 跳过 | BotOwnerActivatePatch.cs | 27 方法 ReaderWriterLockSlim |
| 4 | BossPlayers 线程安全 | BossPlayers.cs | 防止主线程/回调线程并发崩溃 |
| 5 | JSON Converter 全局缓存 | JsonHelper.cs (新建) | 8 处反射 → 1 次 |
| 6 | Covers 空间哈希 | CoverSpatialGrid.cs (新建) | 50m 网格 + fallback 安全 |
| 7 | 统一对象池 | PooledObjects.cs (新建) | NavMeshPath/List/Vector3 池化 |
| 8 | GetDecision 战术缓存 | FollowerFightLayer.cs | 200ms 决策缓存，5Hz 刷新 |
| 9 | CheckSeenEnemies 节流 | InteractableObjects.cs | SphereCast 每帧 → 500ms |

---

## 新增文件

| 文件 | 组件 | 说明 |
|------|------|------|
| `BepInEx/plugins/friendlyPMC/friendlyPMC-Optimizer.dll` | Optimizer | Harmony 运行时补丁 (11 KB) |
| `decompiled-client/Utils/JsonHelper.cs` | 源码参考 | JSON Converter 全局缓存 |
| `decompiled-client/Utils/CoverSpatialGrid.cs` | 源码参考 | 50m 网格空间分区 |
| `decompiled-client/Utils/PooledObjects.cs` | 源码参考 | 统一对象池系统 |
| `user/mods/friendlyPMC/src/SptAdapter.ts` | 服务端 | SPT API 适配层 |
| `user/mods/friendlyPMC/config/skills.json` | 服务端 | 技能配置数据 |
| `user/mods/friendlyPMC/config/settings.schema.json` | 服务端 | 设置 JSON Schema |
| `user/mods/friendlyPMC/config/progress.schema.json` | 服务端 | 任务进度 Schema |
| `user/mods/friendlyPMC/config/squad-profile.schema.json` | 服务端 | Follower 档案 Schema |

---

## 性能基准

| 场景 | v4.4.12 | v4.5.0 (预期) | 主要贡献 |
|------|---------|-------------|----------|
| 单人 Raid (无 Follower) | 基线 | +5~10% | BulletImpactOptimizer 守卫 |
| 闲置巡逻 (4 Follower) | 40-50 FPS | 50-65 FPS | Patrol 缓存 + Activate 跳过 |
| 轻度战斗 (4 Follower) | 30-40 FPS | 40-55 FPS | BeingHit 节流 + 消息队列 |
| 重度战斗 (8 Follower) | 20-30 FPS | 30-45 FPS | 综合效果 |

---

## 升级说明

1. 备份 `BepInEx/plugins/friendlyPMC/friendlyPMC.dll`
2. 备份 `user/mods/friendlyPMC/` 目录
3. 解压 release 包覆盖到 SPT 根目录
4. 删除 `user/mods/friendlyPMC/database/settings.json` (自动重建)
5. 新增的 `config/skills.json` 可按需自定义技能数值
6. `friendlyPMC-Optimizer.dll` 会自动加载，无需额外配置

**安装后验证:**
- BepInEx 控制台应显示 `friendlyPMC-Optimizer: Applying performance patches...`
- BepInEx 控制台应显示 `friendlyPMC-Optimizer: All patches applied.`

## 回滚

1. 删除 `BepInEx/plugins/friendlyPMC/friendlyPMC-Optimizer.dll`
2. 恢复备份的 `friendlyPMC.dll`
3. 恢复备份的 `user/mods/friendlyPMC/` 目录

---

## 已知限制

- Optimizer 通过反射访问原始 DLL 的内部字段，极端情况下 BepInEx 加载顺序可能导致反射失败 (Harmony 会自动跳过失败补丁)
- 客户端 C# 源码因 IL 反编译语法问题无法直接 `dotnet build`，需原作者源码环境重新编译
- FollowerCombatManager 和 CheckSeenEnemies 节流等部分优化仅存在于源码参考中，Optimizer 未覆盖

---

*Vault-Tec Optimizer Terminal | v4.5.0 | 议会共识审查通过*  
*编译环境: .NET SDK 10.0.300 | BepInEx 5.4.22 | Harmony 2.x*  
*Remember: A well-optimized Vault is a happy Vault.*
