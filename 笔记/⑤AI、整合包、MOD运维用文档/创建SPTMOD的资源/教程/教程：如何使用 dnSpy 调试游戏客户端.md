# 教程：如何使用 dnSpy 调试游戏客户端

> 本页面适用于 SPT 版本`4.0`

# 先决条件

- [dnSpy](https://github.com/dnSpyEx/dnSpy)
- SPT`4.0.0`或更新版本（指南已通过 SPT 测试和验证`4.0.2`）
- 强烈建议至少使用 2 个显示器（详情请参见“注意事项和技巧”第 3 部分）。

## 第一章：客户准备

1. 下载[此已准备好的存档](https://mega.nz/file/38w1lQjC#kqKSaYBdcWzOASflUpwsYPC6I6DOqXzuq3157LPoLRg)（如果您不信任下载的内容，请参阅第 4 章了解如何准备您自己的存档）。
2. 请备份以下游戏文件：
    - `\BepInEx\config\BepInEx.cfg`
    - `\EscapeFromTarkov_Data\boot.config`
    - `UnityPlayer.dll`
    - `WinPixEventRuntime.dll`（如果存在的话）
3. 用之前下载的压缩包中的文件覆盖所有游戏文件
4. 请确保`\EscapeFromTarkov_Data\boot.config`文件设置为只读。否则，游戏启动时，对文件的更改可能会被覆盖。
5. 找到该`\user\launcher\config.json`文件，并用文本编辑器（推荐使用 Notepad++）打开它。
6. 添加`"WinPixEventRuntime.dll"`到字符串数组设置中`"ExcludeFromCleanup"`。例如：`"ExcludeFromCleanup": ["WinPixEventRuntime.dll"],`
7. 启动 SPT 服务器和启动器。如果一切操作正确，游戏将顺利启动，屏幕右下角将显示“开发版本”字样。
8. 启动 dnSpy。确保程序集资源管理器为空（可选，但强烈建议 - 请参阅第 5 节“注释和提示”）。
9. 在 dnSpy 中，点击`Debug`顶部栏，然后点击。接着，从列表中`Attach to Process (Unity)...`选择进程。`EscapeFromTarkov.exe`
10. 附加游戏进程后，可以通过以下两种方式之一打开要调试的程序集：
    1. （推荐）打开已加载模块视图`Debug -> Windows -> Modules`-或-`Ctrl+Alt+U`并搜索所需的程序集。
    2. 打开要调试的程序集文件`File -> Open...`-或者- `Ctrl+O`（参见注释和提示第 6 节）。

就是这样！继续阅读，了解一些关于调试异常情况以及如何解决这些问题的注意事项。

## 第二章：常见问题

- 如果在启动游戏时出现“WinPixEventRuntime.dll”缺失的错误，请确保正确设置 SPT 启动器的配置，使其在游戏启动时不删除必要的 DLL 文件。
    
- 如果游戏没有出现在 dnSpy 的 Unity 进程列表中，请仔细检查并确保您的“boot.config”文件已设置只读属性。如果没有设置，则游戏会覆盖其内容，您需要重新从下载的压缩包中恢复该文件。
    
- 如果游戏无法正常加载，例如卡在加载界面，请检查 BepInEx 日志，查看是否有任何 SPT 插件加载失败。Unity 开发版本包含一些额外的检查，这些检查可能会导致一些在运行常规版 EFT 时不会出现的错误。如果出现这种情况，请与我联系并告知我问题所在！
    
- 如果尝试启动游戏时出现奇怪的错误并崩溃，则可能是准备的压缩包中的 DLL 文件已过时，而 EFT 的引擎在本指南编写后可能已经更新。请转到第四章，尝试创建您自己的开发版本文件。
    

## 第三章：笔记和提示

- 启用开发版本后，如果出现任何客户端错误，Unity 调试控制台将会弹出。这些错误通常可以忽略，控制台本身也可以安全关闭。某些客户端模组可能会持续产生错误，导致控制台无法关闭——在这种情况下，我建议暂时移除这些模组。
    
- 目前，Mono 调试的“单步跳过”功能可能存在问题，会导致其行为异常。我建议避免使用单步跳过功能，而是为要检查的代码行添加断点。
    
- 当程序触发断点时，所有游戏线程（包括渲染器）都会被冻结。这会导致游戏窗口冻结，并且无法以任何方式最小化游戏窗口。最简单的解决方法是使用多个显示器，这样您可以将 dnSpy 窗口放在与游戏窗口不同的显示器上，从而避免出现问题。
    
- 由于调试版本对性能要求较高，游戏性能和加载速度预计会比平时慢。我不建议任何人在启用调试版本的情况下休闲地游玩这款游戏。
    
- 如果在附加游戏进程之前，程序集已添加到 dnSpy 的程序集资源管理器中，则可能无法加载调试符号，断点也可能无法正常工作。因此，我通常建议在开始之前清除工作区。
    
- 使用推荐的 BepInEx 配置（包含在准备好的归档文件中）时，任何使用 BepInEx 预加载器补丁修补的 DLL 都将被转储`\BepInEx\DumpedAssemblies\EscapeFromTarkov`。如果您尝试手动将程序集添加到工作区，请记住这一点。
    
- 要将游戏恢复到常规的非开发版本，只需恢复之前备份的文件即可。
    

## 第四章：准备你自己的开发构建文件

前往 Unity 下载存档，下载与 EFT 当前引擎版本匹配的 Unity 编辑器版本。您可以通过查看游戏`UnityPlayer.dll`文件版本（位于“详细信息”选项卡中）来确定所需的具体版本。您无需任何额外的构建支持安装程序。或者，您也可以使用 Unity Hub 下载正确的编辑器版本。

1. 转到 Unity 编辑器安装目录，然后导航到以下文件夹：`\Editor\Data\PlaybackEngines\windowsstandalonesupport\Variations\win64_development_mono`
2. 复制`UnityPlayer.dll`到`WinPixEventRuntime.dll`您的游戏目录。请在覆盖之前备份所有文件！
3. 打开`\EscapeFromTarkov_Data\boot.config`文件并添加以下行：`player-connection-debug=1`。编辑完成后，请务必将文件设置为只读模式！
4. 打开`\BepInEx\config\BepInEx.cfg`文件并进行以下更改：
    - `HarmonyBackend`将值更改为`cecil`
    - `DumpAssemblies`将值更改为`true`
    - `LoadDumpedAssemblies`将值更改为`true`

# 来源

关于如何将 EFT 转换为调试版本并进行调试的初始指南：[GitHub 上的 dnspy Wiki](https://github.com/dnSpy/dnSpy/wiki/Debugging-Unity-Games#turning-a-release-build-into-a-debug-build)

有关使用 BepInEx 在 dnSpy 中加载游戏程序集的更多信息：[BepInEx 文档](https://docs.bepinex.dev/articles/advanced/debug/assemblies_dnSpy.html)

Unity 编辑器版本存档，其中包含已准备好的 2022.3.43f1 调试 DLL 存档：[Unity 下载存档](https://unity.com/releases/editor/archive)