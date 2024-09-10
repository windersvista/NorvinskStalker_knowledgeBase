## **Loot Finder-寻找战利品**

- `Enable corpse looting` - 启用所选机器人类型的尸体掠夺功能
- `Enable corpse line of sight check` - 扫描战利品时，如果机器人看不到尸体，它们将被忽略
- `Detect corpse distance` - 机器人能够探测到尸体的距离（以米为单位
- `Enable container looting` - 启用所选机器人类型的容器掠夺功能
- `Enable container line of sight check` - 在扫描战利品时，如果机器人看不到集装箱，它们将被忽略
- `Detect container distance` - 机器人检测集装箱的距离（以米为单位
- `Enable loose item looting` - 为选定的机器人类型启用散装物品掠夺功能
- `Enable item line of sight check` - 扫描战利品时，如果机器人看不到散落的物品，它们将被忽略
- `Detect item distance` - 机器人检测物品的距离（以米为单位
- `Debug: Log Levels` - 在日志中显示不同级别的日志信息
- `Debug: Show navigation points` - 渲染机器人在掠夺集装箱时试图导航的球形区域。(红色）：集装箱位置。(绿色）：计算出的机器人目的地。(蓝色）：NavMesh 修正后的目的地（机器人将移动的位置）。

## **Loot Finder (Timing)-战利品搜寻器（计时）**

- `Delay after spawn` - 机器人进入突袭后等待开始第一次战利品扫描的秒数。
- `Delay after taking an item (ms)` - 机器人将一件物品放入其库存后，在尝试掠夺另一件物品前所需等待的毫秒数。模拟玩家查看战利品并决定拿走某件物品所需的时间。
- `Enable examine time` - 在掠夺物品前添加延迟，以模拟机器人在搜索容器、物品和尸体时 "发现（检查）"物品所需的时间。延迟时间是使用物品的 ExamineTime 和机器人的 AttentionExamineTime 计算得出的。
- `Loot scan interval` - 机器人触发另一次战利品扫描前的等待秒数

## **Weapon Loot Settings-武器掠夺设置***

- `Use flea market prices`- 机器人将查询更准确的 ragfair 价格来检查物品价值。将在客户端首次启动时查询 ragfair 价格。可能会影响客户端的初始启动时间。
- `Calculate value from attachments`- 通过查找每个附件来计算武器价值。比查看基本武器模板更准确，但检查费用略高
- `Allow weapon attachment stripping` - 如果机器人无法将武器拾取到自己的库存中，则允许它们取下武器上的附件
- `PMC: Min loot value threshold` - PMC 机器人只会掠夺超过指定卢布值的物品。当设置为 0 时，机器人将忽略最小值阈值
- `PMC: Max loot value threshold` - PMC 机器人不会掠夺超过指定卢布值的物品。设置为 0 时，机器人将忽略最大值阈值
- `PMC: Allowed gear to equip` - PMC 机器人在突袭期间可装备的装备
- `PMC: Allowed gear in bags` - PMC 机器人可放置在背包/支架中的设备
- `Scav: Min loot value threshold` - 所有非 PMC 机器人只会掠夺超过指定卢布值的物品。设置为 0 时，机器人将忽略最小值阈值
- `Scav: Max value threshold` - 所有非 PMC 机器人都不会掠夺超过指定卢布值的物品。设置为 0 时，机器人将忽略最大值阈值
- `Scav: Allowed gear to equip` - 非 PMC 机器人在突袭期间可装备的装备
- `Scav: Allowed gear in bags` - 非 PMC 机器人可放置在背包/支架中的设备
- `Log Levels` - 在日志中显示不同级别的日志信息