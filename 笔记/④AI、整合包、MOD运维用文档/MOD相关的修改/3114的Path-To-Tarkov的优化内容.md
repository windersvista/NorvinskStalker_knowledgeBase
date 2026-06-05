# Changelog

All notable changes to Path To Tarkov will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [6.2.0] - 2026-06-05

### Added

- **原版转移位置追踪**: 使用原版转移（vanilla transit）从地图 A 转移到地图 B 后，PTT 现在能自动追踪并更新你的 offraid 位置。仓库访问、商人可用性和回血机制都将与新位置同步。通过反向 infiltrations 自动推导 + 可选 `vanilla_transit_destination` 配置映射实现

### Fixed

- **撤离点全部消失**：当 `/PathToTarkov/CurrentLocationData` 获取失败时，不再错误地禁用全部撤离点，改为保留原版撤离点作为兜底
- **战后存档一致性**：移除 `KeepFoundInRaidTweak` 内的重复 `saveProfile()` 调用，统一由 `updateOffraidPosition` 单次保存，消除半完成状态的存档风险
- **战后转移/撤离判定错误**：用 `exitStatus === 'Transit'` 替代 `!targetOffraidPosition` 判定转移，原版（vanilla）转移不再被错误路由到 PTT 处理逻辑
- **配置校验漏检**：修正 transit target 校验只检查地图名而遗漏出生点 ID 的 typo（`transitTargetMapName` 写了两次）
- **转移/撤离状态残留污染**：`CustomExfilService.TransitTo()` 和 `ExtractTo()` 的 `SaveExfil()` 移到所有验证通过之后，取消转移时显式清理，防止陈旧状态串到下一局
- **仓库访问判定子串误匹配**：`checkAccessVia()` 在 `access_via` 为字符串时用 `String.includes()` 做子串匹配（如 `"PlayerHideout".includes("Hideout")` 误判为通配），改为先 `ensureArray()` 再精确匹配；`isWildcardAccessVia` 修正为对单一 `'*'` 的精确判断
- **仓库模板缺失硬崩溃**：`createGetTemplateItems` 对缺失的 vanilla stash 模板改为跳过 + 警告，不再抛异常导致整个 `/client/items` 响应崩溃
- **headless 客户端串位**：不再修改 headless profile 数据，仅返回匹配的主 profile 位置；找不到时打印警告并使用默认位置
- **configCache 内存泄漏**：新增缓存上限（100 条）和自动剪枝（保留最近 50 条）
- **Constructor 重复构造**：移除 `PathToTarkovController` 构造函数内重复 `new TradersAvailabilityService()` 覆盖注入实例的代码
- **[PTT Debug] 日志污染**：19 处 `info` 级别的调试日志降级为 `debug` 级别，避免运行时日志刷屏

### Added

- **ROAMING_EMERGENCY_STASH 应急仓**：当玩家处于既无主仓权限又无专属副仓的位置时，不再兜底到 size=0 的空仓，改为使用一个 20 格的应急仓。离开该位置时自动递归清空内容。解决 RagFair/保险/任务返还物品因目标仓库无空间导致的 `profile/list` 崩溃问题
- **tests/stash-controller.test.ts**：应急仓功能的 4 项 Jest 单元测试

### Changed

- `checkAccessVia()` 行为修正：旧版对字符串 AccessVia 做的是子串匹配（宽松），现改为数组精确匹配（严格）。若此前配置依赖了旧版的"宽松匹配"，可能需调整配置。

---

## [6.0.0] - 2026-05-27

### Added

- 支持 SPT 3.10.x
- Fika 联机模式下撤离/转移投票系统
- 自动转移生成（`enable_automatic_transits_creation`）
- 撤离点工具提示显示可到达地图和商人信息
- 每撤离点自定义 tooltip 模板覆盖

### Fixed

- 空 stash 导致漫游位置崩溃
- TrapTransits 配置中 Shoreline 撤离点名称错误
- shared_player_spawnpoints 缺少 Shoreline Vehicle Extract
